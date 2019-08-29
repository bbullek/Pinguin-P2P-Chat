import { Component } from "@angular/core";

@Component({
    selector: 'ns-chatroom-screen',
    templateUrl: './chatroom-screen.component.html',
    styleUrls: ['./chatroom-screen.component.css'],
    moduleId: module.id
})

export class ChatroomScreenComponent {
    chatroomName = '';
    displayName = '';
}
