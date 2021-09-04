import {Component, NgZone, OnInit} from '@angular/core';
import {RoomService} from "../services/room.service";
import {AuthGuard} from "../auth-guard.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private readonly roomsService: RoomService,
              private readonly authGuard: AuthGuard,
              private readonly zone: NgZone) { }

  ngOnInit(): void {
    this.getUserAndSearchRoom();
  }

  private getUserAndSearchRoom(): void {
    const user = this.authGuard.userView;
    if (!!user.dbId) {
      this.goToRoom();
      return;
    }
    const sub = this.authGuard.userLoaded.subscribe(() => {
      sub.unsubscribe();
      this.goToRoom();
    });
  }


  private goToRoom(): void {
    const user = this.authGuard.userView;
    const sub = this.roomsService.search(user.dbId, user.fullName).subscribe(roomId => {
      sub.unsubscribe();
      this.zone.run(() => this.authGuard.navigateToRoom(roomId));
    });
  }

}
