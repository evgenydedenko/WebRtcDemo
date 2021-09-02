import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {RoomUserModel} from "../models/room-user-model";
import {setStream} from "../helpers/StreamHelper";

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss']
})
export class VideoViewComponent implements OnInit {
  private roomUser = {} as RoomUserModel;

  @Input('user') set user(user: RoomUserModel | undefined) {
    if (!user) return;
    this.roomUser = user;
    if (user.isSelf) {
      this.setVideo();
    } else {
      this.roomUser.peer.on("stream", (stream:MediaStream) => {
        this.roomUser.stream = stream;
        this.setVideo();
      });
    }
  }

  get user(): RoomUserModel {
    return this.roomUser;
  }

  @ViewChild('videoElement') private videoElement: ElementRef = {} as ElementRef;

  constructor() { }

  ngOnInit(): void {

  }

  private setVideo(): void {
    const { stream, isSelf } = this.roomUser;
    setStream(this.videoElement.nativeElement, stream, isSelf);
  }
}
