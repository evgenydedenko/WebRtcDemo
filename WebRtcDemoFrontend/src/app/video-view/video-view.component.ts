import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {RoomUserModel} from "../models/room-user-model";
import {setStream} from "../helpers/StreamHelper";
import {DevicesService} from "../devices.service";

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss']
})
export class VideoViewComponent implements OnInit, AfterViewInit {
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

  constructor(private readonly devicesService: DevicesService) { }

  ngAfterViewInit(): void {
    this.attachSinkId(this.videoElement.nativeElement, this.devicesService.devices.audioOutput);
  }

  ngOnInit(): void {

  }

  private setVideo(): void {
    const { stream, isSelf } = this.roomUser;
    setStream(this.videoElement.nativeElement, stream, isSelf);
  }

  private attachSinkId(element: any, sinkId: string | undefined) {
    if (!sinkId) return;
    if (typeof element.sinkId !== 'undefined') {
      element.setSinkId(sinkId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }
}
