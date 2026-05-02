import { Appointment } from './Appointment';
import { User } from './User';

/**
 * Class GroupMeeting - Kế thừa (extends) từ Appointment
 * Thể hiện tính Kế thừa (Inheritance) trong OOP
 * Có thêm thuộc tính participants và phương thức addParticipant
 */
export class GroupMeeting extends Appointment {
  private _participants: User[];

  constructor(
    name: string,
    location: string,
    startTime: Date,
    endTime: Date,
    participants: User[] = []
  ) {
    // Gọi constructor của lớp cha (Appointment)
    super(name, location, startTime, endTime);
    this._participants = [...participants];
  }

  // Getter cho danh sách người tham gia
  get participants(): User[] {
    return [...this._participants];
  }

  /**
   * Phương thức addParticipant(user: User)
   * Thêm người tham gia vào nhóm họp
   * Kiểm tra trùng lặp trước khi thêm
   */
  addParticipant(user: User): void {
    const exists = this._participants.some(p => p.userId === user.userId);
    if (!exists) {
      this._participants.push(user);
    }
  }
}