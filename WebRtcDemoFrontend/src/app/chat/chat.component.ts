import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MessageModel} from "../models/message-model";
import {SignalRService} from "../services/signal-r.service";
import {AuthGuard} from "../auth-guard.service";
import {ChatService} from "../services/chat.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscriptionsPool: Subscription[] = [];
  @ViewChild('scrollContainer') private scrollContainer: ElementRef = {} as ElementRef;
  private _roomId: number = 0;

  @Input('roomId') set roomId(id: number | undefined) {
    if (!id) return;
    this._roomId = id;
    this.loadAllMessages();
  }

  message = '';
  messages: MessageModel[] = [];

  get currentUserId(): number {
    return this.authGuard.userView.dbId;
  }

  constructor(private readonly signalRService: SignalRService,
              private readonly chatService: ChatService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly authGuard: AuthGuard) {
    this.watchChatEvents();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptionsPool.forEach(sub => sub.unsubscribe());
  }

  sendMessage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.message.trim()) {
      this.message = '';
      return;
    }

    this.signalRService.sendMessage({
      userId: this.authGuard.userView.dbId,
      roomId: this._roomId,
      message: this.message
    } as MessageModel);
    this.message = '';
  }

  trackByFn(index: number, item: MessageModel) {
    return item.id;
  }

  private loadAllMessages(): void {
    const sub = this.chatService.getAll(this._roomId).subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
      sub.unsubscribe();
    }, () => {
      sub.unsubscribe();
    });
  }

  private watchChatEvents(): void {
    const sub = this.signalRService.onMessageSent.subscribe(message => {
      this.messages.push(message);
      this.scrollToBottom();
    });
    this.subscriptionsPool.push(sub);
  }
  private scrollToBottom(): void {
    this.changeDetectorRef.detectChanges();
    if (this.scrollContainer.nativeElement.scrollTop === undefined) return;
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }
}
