import {EventEmitter, Injectable} from '@angular/core';
import  * as signalR  from '@microsoft/signalr';
import {environment} from "../../environments/environment";
import {MessageModel} from "../models/message-model";
import {SignalModel} from "../models/signal-model";
import {RoomUserShortModel} from "../models/room-user-model";
import {HubConnection} from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private connection: HubConnection | undefined;
  onMessageSent = new EventEmitter<MessageModel>();
  onUserJoined = new EventEmitter<SignalModel>();
  onReceivingReturnedSignal = new EventEmitter<SignalModel>();
  onAnotherUsersSent = new EventEmitter<RoomUserShortModel[]>();
  onAnotherUsersDisconnected = new EventEmitter<string>();
  onRoomIsFull = new EventEmitter<string>();

  get connectionId(): string {
    return this.connection?.connectionId || '';
  }

  constructor() {

  }

  async connectToHub(roomId: number, userId: number): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiDomain}/chat?roomId=${roomId}&userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    [ 'onMessageSent',
      'onUserJoined',
      'onReceivingReturnedSignal',
      'onAnotherUsersSent',
      'onAnotherUsersDisconnected'
    ].forEach(action => {
      this.connection?.on(action, (data: any) => {
        (this.getPropertyValue(this, action) as EventEmitter<any>)?.emit(data);
      });
    });

    this.connection?.on("RoomIsFull", (data: string) => {
      this.onRoomIsFull.emit(data);
    });

    await this.connection.start();
  }

  async disconnectFromHub() {
    await this.connection?.stop();
  }

  sendMessage(message: MessageModel): void {
    this.connection?.invoke("SendMessage", message);
  }

  emitSendSignal(payload: SignalModel): void {
    this.connection?.invoke("OnSendingSignal", payload);
  }

  emitReturnSignal(payload: SignalModel): void {
    this.connection?.invoke("OnReturningSignal", payload);
  }

  emitJoinRoom(): void {
    this.connection?.invoke("JoinRoom");
  }

  private getPropertyValue(obj: any, property: string): object {
    return obj[property];
  }
}
