import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { ChatroomScreenComponent } from "./screens/chatroom/chatroom-screen.component";
import { LoginScreenComponent } from "./screens/login/login-screen.component";

const routes: Routes = [
    { path: "", component: LoginScreenComponent },
    { path: "chatroom", component: ChatroomScreenComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})

export class AppRoutingModule { }
