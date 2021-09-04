import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomsListComponent } from "./rooms-list/rooms-list.component";
import { RoomComponent } from "./room/room.component";
import {AuthGuard} from "./auth-guard.service";
import {AuthComponent} from "./auth/auth.component";
import {SearchComponent} from "./search/search.component";

const routes: Routes = [
  { path: '', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'rooms', component: RoomsListComponent, canActivate: [AuthGuard] },
  { path: 'room/:id', component: RoomComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
