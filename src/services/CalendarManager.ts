import { User } from '../models/User';
import { Appointment } from '../models/Appointment';
import { GroupMeeting } from '../models/GroupMeeting';
import { Reminder } from '../models/Reminder';

/**
 * Class CalendarManager - Đóng vai trò System/Controller
 * Ánh xạ từ Class Diagram: chứa logic nghiệp vụ
 * Tính Đóng gói: tất cả thuộc tính đều private
 */
export class CalendarManager {
  // Thuộc tính private - đảm bảo tính đóng gói
  private appointments: Appointment[];
  private groupMeetings: GroupMeeting[];
  private reminders: Reminder[];
  private currentUser: User;

  constructor() {
    // ===== MOCK DATA - Khởi tạo dữ liệu mẫu để Demo =====

    // 1. Tạo Current User
    this.currentUser = new User('U001', 'Nguyễn Văn A', 'nguyenvana@email.com');

    // 2. Tạo Mock Appointment: "Đi khám răng" - ngày mai, 8h-9h
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const apptStart = new Date(tomorrow);
    apptStart.setHours(8, 0, 0, 0);
    const apptEnd = new Date(tomorrow);
    apptEnd.setHours(9, 0, 0, 0);

    const mockAppointment = new Appointment(
      'Đi khám răng',
      'Phòng khám Nha khoa ABC',
      apptStart,
      apptEnd
    );

    // 3. Tạo Mock GroupMeeting: "Họp nhóm OOAD" - ngày mốt, 120 phút
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const meetStart = new Date(dayAfterTomorrow);
    meetStart.setHours(14, 0, 0, 0);
    const meetEnd = new Date(dayAfterTomorrow);
    meetEnd.setHours(16, 0, 0, 0); // 120 phút

    const participant1 = new User('U002', 'Trần Thị B', 'tranthib@email.com');
    const participant2 = new User('U003', 'Lê Văn C', 'levanc@email.com');

    const mockGroupMeeting = new GroupMeeting(
      'Họp nhóm OOAD',
      'Phòng họp 301 - Tòa nhà IT',
      meetStart,
      meetEnd,
      [participant1, participant2]
    );

    this.appointments = [mockAppointment];
    this.groupMeetings = [mockGroupMeeting];
    this.reminders = [];
  }

  // ===== Getter cho UI truy cập dữ liệu =====

  getUser(): User {
    return this.currentUser;
  }

  getAppointments(): Appointment[] {
    return [...this.appointments];
  }

  getGroupMeetings(): GroupMeeting[] {
    return [...this.groupMeetings];
  }

  getReminders(): Reminder[] {
    return [...this.reminders];
  }

  // ===== CÁC PHƯƠNG THỨC XỬ LÝ LOGIC (Ánh xạ Sequence Diagram) =====

  /**
   * Bước 2 - checkConflict(start, end)
   * Kiểm tra xem khoảng thời gian mới có trùng với lịch hẹn nào không
   * Trả về: Appointment bị trùng hoặc null
   */
  checkConflict(start: Date, end: Date): Appointment | null {
    for (const appt of this.appointments) {
      // Hai khoảng thời gian trùng nhau khi: start1 < end2 AND start2 < end1
      if (start < appt.endTime && end > appt.startTime) {
        return appt; // Trả về cuộc hẹn bị trùng
      }
    }
    return null; // Không có trùng lịch
  }

  /**
   * Bước 3 - checkGroupMeetingMatch(name, duration)
   * Kiểm tra xem có GroupMeeting nào cùng tên VÀ cùng thời lượng không
   * Trả về: GroupMeeting khớp hoặc null
   */
  checkGroupMeetingMatch(name: string, duration: number): GroupMeeting | null {
    for (const meeting of this.groupMeetings) {
      // FIX: Tương thích gọi hàm lấy thời lượng (hỗ trợ cả getDurationMinutes và getDuration)
      const meetingDuration = typeof meeting.getDurationMinutes === 'function' 
        ? meeting.getDurationMinutes() 
        : (meeting as any).getDuration();

      if (
        meeting.name.toLowerCase() === name.toLowerCase() &&
        meetingDuration === duration
      ) {
        return meeting; // Trả về nhóm họp khớp
      }
    }
    return null; // Không tìm thấy
  }

  /**
   * Bước 4 - createAppointment(...)
   * Tạo mới một Appointment và thêm vào danh sách
   */
  createAppointment(
    name: string,
    location: string,
    startTime: Date,
    endTime: Date
  ): Appointment {
    const newAppointment = new Appointment(name, location, startTime, endTime);
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  /**
   * joinMeeting(user, meeting) - Tham gia nhóm họp
   */
  joinMeeting(user: User, meeting: GroupMeeting): void {
    const target = this.groupMeetings.find(g => g.name === meeting.name);
    if (target) {
      // Ưu tiên gọi hàm addParticipant (Chuẩn Đóng gói trong OOP)
      if (typeof (target as any).addParticipant === 'function') {
        (target as any).addParticipant(user);
      } 
      // Nếu không có hàm addParticipant, chỉ push thẳng vào mảng (không gán lại)
      else if (target.participants) {
        target.participants.push(user);
      }
    }
  }

  /**
   * createReminder - Tạo nhắc nhở cho cuộc hẹn
   */
  createReminder(triggerTime: Date, message: string): Reminder {
    const reminder = new Reminder(triggerTime, message);
    this.reminders.push(reminder);
    return reminder;
  }

  /**
   * overrideAppointment - Ghi đè cuộc hẹn cũ bằng cuộc hẹn mới
   * Xóa cuộc hẹn trùng và thêm cuộc hẹn mới
   */
  overrideAppointment(
    conflicting: Appointment,
    name: string,
    location: string,
    startTime: Date,
    endTime: Date
  ): Appointment {
    // Xóa cuộc hẹn cũ
    this.appointments = this.appointments.filter(a => a !== conflicting);
    // Tạo cuộc hẹn mới
    return this.createAppointment(name, location, startTime, endTime);
  }
}