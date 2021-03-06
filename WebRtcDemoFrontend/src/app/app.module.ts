import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { RoomComponent } from './room/room.component';
import { ChatComponent } from './chat/chat.component';
import {AuthGuard} from "./auth-guard.service";
import { AuthComponent } from './auth/auth.component';
import { UserComponent } from './user/user.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import { CreateNewRoomDialogComponent } from './rooms-list/create-new-room-dialog/create-new-room-dialog.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {TextFieldModule} from "@angular/cdk/text-field";
import {HttpClientModule} from "@angular/common/http";
import { VideoViewComponent } from './video-view/video-view.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { SettingsComponent } from './settings/settings.component';
import {MatSelectModule} from "@angular/material/select";
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsListComponent,
    RoomComponent,
    ChatComponent,
    AuthComponent,
    UserComponent,
    CreateNewRoomDialogComponent,
    VideoViewComponent,
    SettingsComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    TextFieldModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  entryComponents: [
    RoomsListComponent,
    CreateNewRoomDialogComponent,
    RoomComponent,
    SettingsComponent
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
