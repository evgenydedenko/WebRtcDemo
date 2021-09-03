export class RoomUserShortModel {
  connectionId: string = '';
  userId: number = 0;
  isSelf: boolean = false;
}

export class RoomUserModel extends RoomUserShortModel {
  stream: MediaStream | undefined;
  peer: any = {};
}
