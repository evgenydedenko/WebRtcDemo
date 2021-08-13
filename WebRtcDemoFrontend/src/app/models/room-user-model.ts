export class RoomUserShortModel {
  connectionId: string = '';
  userId: number = 0;
}

export class RoomUserModel extends RoomUserShortModel {
  peer: any = {};
}
