/**
 * Class Reminder - Ánh xạ từ Class Diagram
 * Đối tượng nhắc nhở gắn với một cuộc hẹn
 */
export class Reminder {
  private _triggerTime: Date;
  private _message: string;

  constructor(triggerTime: Date, message: string) {
    this._triggerTime = triggerTime;
    this._message = message;
  }

  // Getters
  get triggerTime(): Date {
    return this._triggerTime;
  }

  get message(): string {
    return this._message;
  }
}