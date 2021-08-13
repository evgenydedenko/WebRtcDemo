export class SignalModel {
  signal: any;
  callerID: string = '';
  userToSignal: string = '';
  connectionId: string = '';
  userId: number = 0;

  constructor(payload: SignalModel) {
    if (!payload) return;
    Object.assign(this, payload);
  }
}
