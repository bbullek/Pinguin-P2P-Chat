import { Component } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { getViewById } from "tns-core-modules/ui/core/view";
import { TextField } from "tns-core-modules/ui/text-field";

@Component({
    selector: 'ns-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrls: ['./login-screen.component.css'],
    moduleId: module.id
})

export class LoginScreenComponent {
    userName: string = 'Developer'; // Set to empty str out of debug mode
    roomName: string = '';

    public constructor(private router: Router) {}

    public navigateToChatroom() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "name": this.userName,
                "room": this.roomName,
            }
        };

        this.router.navigate(["/chatroom"], navigationExtras);
    }
}
