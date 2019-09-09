import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { registerElement } from 'nativescript-angular/element-registry';
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
    public messages: Array<Message>;

    constructor(private chatService: ChatroomService) {

        const chat = chatService.getChat();

        this.me = chat.participants.me;
        this.other = chat.participants.other;
        this.messages = chat.messages;
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
}

