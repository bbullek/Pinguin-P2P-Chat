import { Component, ViewChild, ElementRef, OnInit, OnDestroy, NgZone } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ListView } from "tns-core-modules/ui/list-view";
import { TextView } from "tns-core-modules/ui/text-view";
import { ChatroomService, User, Message } from './chatroom.service';

const ws = require("nativescript-websockets");

@Component({
    selector: 'ns-chatroom-screen',
    templateUrl: './chatroom-screen.component.html',
    styleUrls: ['./chatroom-screen.component.css'],
    providers: [ChatroomService],
    moduleId: module.id
})

// export class ChatroomScreenComponent implements OnInit, OnDestroy {
    // private socket: any;
    // public messages: Array<any>;
    // public chatBox: string;

    // public constructor(private zone: NgZone) {
    //     this.socket = new ws("ws://192.168.1.8:12345/ws", []);
    //     this.socket.open();
    //     this.messages = [];
    //     this.chatBox = "";
    // }

    // public ngOnInit() {
    //     this.socket.addEventListener('open', event => {
    //         this.zone.run(() => {
    //             this.messages.push({content: "Welcome to the chat!"});
    //         });
    //     });
    //     this.socket.addEventListener('message', event => {
    //         this.zone.run(() => {
    //             this.messages.push({content: this.chatBox});
    //             this.chatBox = "";
    //         });
    //     });
    //     this.socket.addEventListener('close', event => {
    //         this.zone.run(() => {
    //             this.messages.push({content: "You have been disconnected"});
    //         });
    //     });
    //     this.socket.addEventListener('error', event => {
    //         console.log("The socket had an error", event.error);
    //     });
    // }

    // public ngOnDestroy() {
    //     this.socket.close();
    // }

    // public send() {
    //     if (this.chatBox) {
    //         this.socket.send(this.chatBox);
    //     }
    // }

export class ChatroomScreenComponent {
    public me: User;
    public other: User;
    public room: string;
    public messages: Array<Message>;

    constructor(private route: ActivatedRoute, private chatService: ChatroomService) {
        const chat = chatService.getChat(); // Debug: Init chat with some pre-generated messages

        this.me = chat.participants.me;
        this.other = chat.participants.other;
        this.messages = chat.messages;

        // Use data passed through login screen
        this.route.queryParams.subscribe(params => {
            // TODO: Instead pass to chatservice's User constructor directly
            this.me.name = params["name"];
            this.room = params["room"];
        });
    }


    /**
     * Gets one of two CSS classes for the chat bubble (me/other).
     */
    public bubbleClass(message: Message): string {
        const sender = this.isMy(message) ? 'me' : 'other';
        return `bubble-from-${sender}`;
    }

    /**
     * Checks if this user is the sender of the given Message.
     */
    private isMy(message: Message): boolean {
        return message.sender == this.me;
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
        const content = this.newMessage.text;
        if (content == '') {
            return;
        }
        const message = this.initializeMessageWith(content);
        this.messages.push(message);
        this.scrollChatToBottom();
        this.dismissKeyBoard();
    }

    /**
     * Creates a new message (with content from the textbox) and assigns
     * the sender/date.
     */
    private initializeMessageWith(content: string): Message {
        return {
            content: content,
            sender: this.me,
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
}
