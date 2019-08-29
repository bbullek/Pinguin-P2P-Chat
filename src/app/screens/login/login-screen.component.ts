import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'ns-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css'],
    moduleId: module.id
})

export class LoginScreenComponent {
    public constructor(private router: Router) {}

    chatroomName = '';
    displayName = '';

    public navigateToChatroom() {
        this.router.navigate(["/chatroom"]);
    }
}
