/**
 * Class Appointment - Ánh xạ từ Class Diagram
 * Lớp cha (Base class) cho GroupMeeting - thể hiện tính Kế thừa
 */
export class Appointment {
  private _name: string;
  private _location: string;
  private _startTime: Date;
  private _endTime: Date;

  constructor(name: string, location: string, startTime: Date, endTime: Date) {
    this._name = name;
    this._location = location;
    this._startTime = startTime;
    this._endTime = endTime;
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get location(): string {
    return this._location;
  }

  get startTime(): Date {
    return this._startTime;
  }

  get endTime(): Date {
    return this._endTime;
  }

  // Setters - cho phép cập nhật
  set name(value: string) {
    this._name = value;
  }

  set startTime(value: Date) {
    this._startTime = value;
  }

  set endTime(value: Date) {
    this._endTime = value;
  }

  /**
   * Phương thức getDuration()
   * Tính thời lượng cuộc hẹn (đơn vị: phút)
   */
  getDuration(): number {
    const diffMs = this._endTime.getTime() - this._startTime.getTime();
    return Math.round(diffMs / (1000 * 60));
  }
}