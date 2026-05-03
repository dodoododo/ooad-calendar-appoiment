// src/models/Appointment.ts

export class Appointment {
  // BẮT BUỘC khai báo rõ các thuộc tính ở đây
  name: string;
  location: string;
  startTime: Date;
  endTime: Date;

  constructor(name: string, location: string, startTime: Date, endTime: Date) {
    // Sau đó gán giá trị trong constructor
    this.name = name;
    this.location = location;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public getDurationMinutes(): number {
    return (this.endTime.getTime() - this.startTime.getTime()) / 60000;
  }
}