export class MessageModel {
  id: number = 0;
  userId: number = 0;
  roomId: number = 0;
  message: string = '';
  createdBy: string = '';
  createdAt: Date = new Date();
  avatarUrl: string = '';
}
