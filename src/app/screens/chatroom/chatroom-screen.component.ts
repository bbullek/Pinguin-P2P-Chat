import { Component, ViewChild, ElementRef, OnInit, OnDestroy, NgZone } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { ListView } from "tns-core-modules/ui/list-view";
import { TextView } from "tns-core-modules/ui/text-view";
import { ChatroomService, User, Message } from './chatroom.service';
import { SocketService } from './socket.service';
import * as application from "tns-core-modules/application";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";
import { isAndroid } from "tns-core-modules/platform";

const ws = require("nativescript-websockets");

@Component({
    selector: 'ns-chatroom-screen',
    templateUrl: './chatroom-screen.component.html',
    styleUrls: ['./chatroom-screen.component.css'],
    providers: [ChatroomService],
    moduleId: module.id
})

export class ChatroomScreenComponent {
    public me: User;
    public other: User;
    public system: User;
    public room: string;
    public messages: Array<Message>;
    private socket: any;
    private text: string;

    constructor(private route:ActivatedRoute, private routerExtensions: RouterExtensions, private chatService: ChatroomService, private zone: NgZone) {
        const chat = chatService.getChat(); // Debug: Init chat with some pre-generated messages

        this.me = chat.participants.me;
        this.other = chat.participants.other;
        this.system = chat.participants.system;
        this.messages = chat.messages;

        // Use data passed through login screen
        this.route.queryParams.subscribe(params => {
            // TODO: Instead pass to chatservice's User constructor directly
            this.me.name = params["name"];
            this.room = params["room"];
        });

        this.socket = new ws("ws://192.168.1.8:12345/ws", []);
        this.socket.open();
    }

    /**
     * Callback invoked as soon as the new page is instantiated.
     */
    public ngOnInit() {
        console.log('init');
        this.socket.addEventListener('open', event => {
            this.zone.run(() => {
                const newUser = this.me.name;
                const message = this.initializeMessageWith(newUser + " has joined the chat.", this.system);
                this.messages.push(message);
            });
        });
        this.socket.addEventListener('message', event => {
            this.zone.run(() => {
                console.log(this.text);
                const message = this.initializeMessageWith(this.text, this.me);
                this.messages.push(message);
            });
        });
        this.socket.addEventListener('close', event => {
            this.zone.run(() => {
                const oldUser = this.me.name;
                const message = this.initializeMessageWith(oldUser + " has left the chat.", this.system);
                this.messages.push(message);
            });
        });
        this.socket.addEventListener('error', event => {
            console.log("The socket had an error", event.error);
        });

        // Disable default back button behavior on Android devices
        if (!isAndroid) {
            return;
        }
        application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
            const url = this.route.snapshot['_routerState'].url;
            if (url.includes("/chatroom")) {
                data.cancel = true;
                this.confirmLogout();
            }
        });
    }

    /**
     * Callback invoked as soon as the page is closed.
     */
    public ngOnDestroy() {
        console.log('destroy');
        this.socket.close();
    }

    /**
     * Gets the respective CSS classes for the chat bubble (me/system/other user).
     */
    public bubbleClass(message: Message): string {
        var sender = this.isMy(message) ? 'me' : 'other';
        if (this.isSystem(message)) { sender = 'system' }

        return `bubble-from-${sender}`;
    }

    /**
     * Checks if this user is the sender of the given Message.
     */
    private isMy(message: Message): boolean {
        return message.sender == this.me;
    }

    /**
     * Checks if this message was delivered as a type of chatroom notification (e.g.
     * a new user has joined the room).
     */
    private isSystem(message: Message): boolean {
        return message.sender == this.system;
    }

    /**
     * Return the string to display as an identifier within a given
     * chat bubble.
     */
    private getDisplayName(message: Message): string {
        if (this.isMy(message)) {
            return 'Me';
        } else {
            return message.sender.name;
        }
    }

    /**
     * Selects the chatroom's chat box component (stores all messages).
     */
    @ViewChild('chatBox', {static: false}) chatBoxRef: ElementRef;
    private get chatBox(): ListView {
        return this.chatBoxRef.nativeElement;
    }

    /**
     * Selects the chatroom's chat box component (stores active text being
     * written by user prior to sending).
     */
    @ViewChild('newMessage', {static: false}) newMessageRef;
    private get newMessage(): TextView {
        return this.newMessageRef.nativeElement;
    }

    /**
     * Adds the content of the textbox to the chatroom's list of messages.
     */
    public sendMessage(): void {
        const content = this.newMessage;
        const text = content.text;
        if (text == '') {
            return;
        }

        // Alert the socket to a new message
        this.text = text;
        this.socket.send(text);

        // Hide keyboard after pressing Send
        this.scrollChatToBottom();
        this.dismissKeyBoard();
        content.dismissSoftInput();
    }

    /**
     * Creates a new message (with content from the textbox) and assigns
     * the sender/date.
     */
    private initializeMessageWith(content: string, sender: User): Message {
        return {
            content: content,
            sender: sender,
            date: new Date()
        };
    }

    /**
     * Send the chat view to the last (most recent) index of the
     * message array.
     */
    private scrollChatToBottom(): void {
        setTimeout(() => {
            this.chatBox.scrollToIndex(this.messages.length - 1);
        }, 0);
    }

    /**
     * Clears the textbox and hides the user's keyboard.
     */
    private dismissKeyBoard(): void {
        this.newMessage.text = '';
        this.chatBox.focus();
    }

    /**
     * Trigger a confirmation dialog that takes the user back to the main page
     * or discards a device's back button press if accidental.
     */
    public confirmLogout() {
        dialogs.confirm({
            title: "Exit",
            message: "Did you want to logout of chat?",
            okButtonText: "Yes",
            cancelButtonText: "Nope"
        }).then(result => {
            if (!result) return;
            // If dialog is confirmed, exit back to login screen
            this.back();
        });
    }

    back() {
        this.routerExtensions.back();
    }
}
