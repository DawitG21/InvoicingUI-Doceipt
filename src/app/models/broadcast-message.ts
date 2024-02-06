export class BroadcastMessage {
  sender: string;
  data?: any;

  /**
   *
   */
  constructor(sender: string, data?: any) {
    this.sender = sender;
    this.data = data;
  }
}
