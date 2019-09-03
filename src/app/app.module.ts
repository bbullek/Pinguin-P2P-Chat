import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { HideActionBarDirective } from "./screens/util/hideActionBar";
import { LoginScreenComponent } from "./screens/login/login-screen.component";
import { ChatroomScreenComponent } from "./screens/chatroom/chatroom-screen.component";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        LoginScreenComponent,
        ChatroomScreenComponent,
        HideActionBarDirective
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
