import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { registerElement } from 'nativescript-angular/element-registry';

require("nativescript-websockets");

@Component({
    selector: 'ns-chatroom-screen',
    templateUrl: './chatroom-screen.component.html',
    styleUrls: ['./chatroom-screen.component.css'],
    moduleId: module.id
})

export class ChatroomScreenComponent implements OnInit, OnDestroy {
    private socket: any;
    public messages: Array<any>;
    public chatBox: string;

    public constructor(private zone: NgZone) {
        this.socket = new WebSocket("", []);
        this.messages = [];
        this.chatBox = "";
    }

    public ngOnInit() {
        this.socket.addEventListener('open', event => {
            this.zone.run(() => {
                this.messages.push({content: "Welcome to the chat!"});
            });
        });
        this.socket.addEventListener('message', event => {
            this.zone.run(() => {
                this.messages.push(JSON.parse(event.data));
            });
        });
        this.socket.addEventListener('close', event => {
            this.zone.run(() => {
                this.messages.push({content: "You have been disconnected"});
            });
        });
        this.socket.addEventListener('error', event => {
            console.log("The socket had an error", event.error);
        });
    }

    public ngOnDestroy() {
        this.socket.close();
    }

    public send() {
        if(this.chatBox) {
            this.socket.send(this.chatBox);
            this.chatBox = "";
        }
    }
}
