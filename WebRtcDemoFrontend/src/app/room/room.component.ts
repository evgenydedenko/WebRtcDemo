import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SignalRService} from "../services/signal-r.service";
import {AuthGuard} from "../auth-guard.service";
import {RoomUserModel} from "../models/room-user-model";
import {SignalModel} from "../models/signal-model";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {CreateNewRoomDialogComponent} from "../rooms-list/create-new-room-dialog/create-new-room-dialog.component";
import {RoomModel} from "../models/room-model";
import {SettingsComponent} from "../settings/settings.component";
import {IDevicesModel, IDevicesModelShort} from "../models/i-devices-model";
import {DevicesService} from "../devices.service";

declare var SimplePeer: import('simple-peer').SimplePeer;

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  private isInit: boolean = false;
  private subscriptionsPool: Subscription[] = [];
  currentRoomId: number = 0;
  users: RoomUserModel[] = [];
  currentRoomUser: RoomUserModel | undefined;
  audio = true;
  video = true;
  chat = true;

  get audioIcon(): string {
    return this.audio ? 'mic' : 'mic_off';
  }

  get videoIcon(): string {
    return this.video ? 'videocam' : 'videocam_off'
  }

  get chatIcon(): string {
    return this.chat ? 'speaker_notes_off' : 'speaker_notes_on'
  }

  get audioLabel(): string {
    return this.audio ? 'Mute' : 'Unmute';
  }

  get chatLabel(): string {
    return this.chat ? 'Hide chat' : 'Show chat';
  }

  get videoLabel(): string {
    return this.video ? "Disable camera" : 'Enable camera';
  }

  get localStream(): MediaStream | undefined {
    return this.currentRoomUser?.stream;
  }

  set localStream(stream: MediaStream | undefined) {
    if (!this.currentRoomUser) return;
    this.currentRoomUser.stream = stream;
  }

  constructor(private readonly route: ActivatedRoute,
              private readonly signalRService: SignalRService,
              private readonly authGuard: AuthGuard,
              private readonly changeDetectorRef: ChangeDetectorRef,
              public dialog: MatDialog,
              private readonly devicesService: DevicesService) { }

  async ngOnInit() {
    this.setViewPortSize();
    this.setRoomId();
    if (this.authGuard.userView.dbId > 0) {
      await this.runRoom();
    } else {
      const sub = this.authGuard.userLoaded.subscribe(async () => {
        await this.runRoom();
        sub.unsubscribe();
      });
    }
  }

  async ngOnDestroy(): Promise<void> {
    this.users = [];
    await this.signalRService.disconnectFromHub();
    this.subscriptionsPool.forEach(sub => sub.unsubscribe());
  }

  onResize(): void {
    this.setViewPortSize();
  }

  async runRoom(): Promise<void> {
    await this.signalRService.connectToHub(this.currentRoomId, this.authGuard.userView.dbId);
    this.watchDisconnectedUsers();
    this.initSelfMedia();
  }

  toggleAudio(): void {
    this.audio = !this.audio;
    this.setStreamAudio();
  }

  toggleVideo(): void {
    this.video = !this.video;
    this.setStreamVideo();
  }

  toggleChat(): void {
    this.chat = !this.chat;
  }

  leaveRoom(): void {
    this.authGuard.navigateToRoot();
  }

 async openSettings() {
    if (!this.isInit) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    const data = this.devicesService.getDevicesFullData(devices);
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: '500px',
      height: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe( async (data) => {
      if (!data) return;
      const devicesShort = {
        audioInput: data.audioInput,
        audioOutput: data.audioOutput,
        videoInput: data.videoInput
      } as IDevicesModelShort;
      localStorage.setItem('devices', JSON.stringify(devicesShort));
      location.reload();
    });
  }

  private watchDisconnectedUsers(): void {
    const onAnotherUsersDisconnectedSub = this.signalRService.onAnotherUsersDisconnected.subscribe(connectionId => {
      this.users = this.users.filter(u => u.connectionId !== connectionId);
      this.changeDetectorRef.detectChanges();
    });

    this.subscriptionsPool.push(onAnotherUsersDisconnectedSub);
  }

  private setRoomId(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.currentRoomId = Number(id);
  }

  private setStreamAudio(): void {
    if (!this.localStream) return;

    const tracks = this.localStream.getAudioTracks();

    if (tracks.length === 0) {
      console.warn("No local audio available.");
      return;
    }

    for (let i = 0; i < tracks.length; i++) {
      tracks[i].enabled = this.audio;
    }
  }

  private setStreamVideo(): void {
    if (!this.localStream) return;

    const tracks = this.localStream.getVideoTracks();

    if (tracks.length === 0) {
      console.warn("No local video available.");
      return;
    }

    for (let i = 0; i < tracks.length; i++) {
      tracks[i].enabled = this.video;
    }
  }

  async getUserMedia() {
    const devicesList = await navigator.mediaDevices.enumerateDevices();
    const devices = this.devicesService.getDevicesFullData(devicesList);
    return await navigator.mediaDevices.getUserMedia({
      video: {
        width: 330,
        height: 180,
        deviceId: devices.videoInput
      },
      audio: {
        deviceId: devices.audioInput
      },
    })
  }

  private initSelfMedia(): void {
    if (this.isInit) return;
    this.isInit = true;
    (async () => {
      const stream = await this.getUserMedia();
      this.initSelfConnection(stream);
      this.setCurrentRoomUser(stream);
      this.toggleAudio();
    })();
  }

  private setCurrentRoomUser(stream: MediaStream): void {
    this.currentRoomUser = {
      userId: this.authGuard.userView.dbId,
      connectionId: this.signalRService.connectionId,
      isSelf: true,
      stream: stream
    } as RoomUserModel;
  }

  private initSelfConnection(selfStream: any): void {
    const onUserJoinedSub = this.signalRService.onUserJoined.subscribe(signalModel => {
      const peer = this.addPeer(signalModel.signal, signalModel.callerID, selfStream);
      this.users = [...this.users, {
        userId: signalModel.userId,
        connectionId: signalModel.callerID,
        peer: peer
      } as RoomUserModel];
      this.changeDetectorRef.detectChanges();
    });

    const onReceivingReturnedSignalSub = this.signalRService.onReceivingReturnedSignal.subscribe(signalModel => {
      const roomUser = this.users.find(p => p.connectionId === signalModel.connectionId);
      roomUser?.peer.signal(signalModel.signal);
    });

    const onAnotherUsersSentSub = this.signalRService.onAnotherUsersSent.subscribe(users => {
      users.forEach(user => {
        const peer = this.createPeer(user.connectionId, this.signalRService.connectionId , selfStream);
        this.users = [...this.users, {
          userId: user.userId,
          connectionId: user.connectionId,
          peer: peer
        } as RoomUserModel];
      });
      this.changeDetectorRef.detectChanges();
    });

    this.signalRService.emitJoinRoom();

    this.subscriptionsPool = this.subscriptionsPool.concat([
      onUserJoinedSub,
      onReceivingReturnedSignalSub,
      onAnotherUsersSentSub
    ])
  }

  private createPeer(userToSignal: string, callerID: string, stream: any): any {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal: any) => {
      this.signalRService.emitSendSignal({
        signal: signal,
        callerID: callerID,
        userToSignal: userToSignal,
        userId: this.authGuard.userView.dbId
      } as SignalModel);
    })

    return peer;
  }

  private addPeer(incomingSignal: any, callerID: any, stream: any): any {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal: any) => {
      this.signalRService.emitReturnSignal({
        signal: signal,
        callerID: callerID
      } as SignalModel);
    })

    peer.signal(incomingSignal);

    return peer;
  }

  private setViewPortSize(): void {
    if (window.innerWidth < 1200) {
      this.chat = false;
    }
  }
}
