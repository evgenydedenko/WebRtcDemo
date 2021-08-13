import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {RoomUserModel} from "../models/room-user-model";
import {setStream} from "../helpers/StreamHelper";

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss']
})
export class VideoViewComponent implements OnInit, AfterViewInit {
  private roomUser = {} as RoomUserModel;

  @Input('user') set user(user: RoomUserModel) {
    this.roomUser = user;
    this.roomUser.peer.on("stream", (stream:any) => {
      setStream(this.videoElement.nativeElement, stream);
    });
  }

  get user(): RoomUserModel {
    return this.roomUser;
  }

  @ViewChild('videoElement') private videoElement: ElementRef = {} as ElementRef;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

}
