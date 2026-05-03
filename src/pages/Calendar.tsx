import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Calendar as CalendarIcon, User, Bell } from "lucide-react";
import { CalendarManager } from "../services/CalendarManager";
import AppointmentTable from "../components/calendar/AppointmentTable";
import CalendarGrid from "../components/calendar/CalendarGrid";
import AddAppointmentDialog from "../components/calendar/AddAppointmentDialog";
import ErrorDialog from "../components/calendar/ErrorDialog";
import WarningDialog from "../components/calendar/WarningDialog";
import ConfirmDialog from "../components/calendar/ConfirmDialog";
import SuccessDialog from "../components/calendar/SuccessToast";

/**
 * =========================================================
 * CalendarUI - Tầng Giao diện (View / Boundary)
 * =========================================================
 * Ánh xạ từ Sequence Diagram:
 * Actor -> CalendarUI -> CalendarManager (System)
 * =========================================================
 */

// Định nghĩa interface cho dữ liệu hẹn để TS không báo lỗi property access
interface AppointmentData {
  name: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  enableReminder: boolean;
  reminderMinutes: number;
}

export default function Calendar() {
  // Khởi tạo CalendarManager (System/Controller)
  const [manager] = useState(() => new CalendarManager());

  // State refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // Lấy dữ liệu từ Manager
  const currentUser = useMemo(() => manager.getUser(), [manager]);
  const appointments = useMemo(() => manager.getAppointments(), [manager, refreshKey]);
  const groupMeetings = useMemo(() => manager.getGroupMeetings(), [manager, refreshKey]);
  const reminders = useMemo(() => manager.getReminders(), [manager, refreshKey]);

  const [prefillDate, setPrefillDate] = useState("");
  const [prefillTime, setPrefillTime] = useState("");

  // FIX: Thêm kiểu string cho tham số
  const handleDateClick = (date: string, time: string) => {
    setPrefillDate(date);
    setPrefillTime(time);
    setShowAddDialog(true);
  };

  // ===== Dialog states =====
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });
  
  // FIX: Sử dụng <any> để tránh lỗi "Type is not assignable to null"
  const [warningDialog, setWarningDialog] = useState<any>({ open: false, conflicting: null });
  const [confirmDialog, setConfirmDialog] = useState<any>({ open: false, matched: null });
  const [successDialog, setSuccessDialog] = useState({ open: false, message: "" });

  // FIX: Khai báo kiểu AppointmentData | null
  const [pendingData, setPendingData] = useState<AppointmentData | null>(null);

  // ==========================================================
  // handleSave - Hàm xử lý chính (Ánh xạ Sequence Diagram)
  // ==========================================================
  const handleSave = (formData: any) => {
    const { name, location, startDate, startTime, endDate, endTime, enableReminder, reminderMinutes } = formData;

    // ===== BƯỚC 1: VALIDATION (Tại CalendarUI) =====
    if (!name) {
      setErrorDialog({ open: true, message: "Tên sự kiện không được để trống!" });
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      setErrorDialog({ open: true, message: "Vui lòng nhập đầy đủ ngày và giờ bắt đầu/kết thúc!" });
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    if (durationMs <= 0) {
      setErrorDialog({
        open: true,
        message: "Thời gian kết thúc phải sau thời gian bắt đầu! (Thời lượng phải > 0)",
      });
      return;
    }

    const data: AppointmentData = { name, location, startDateTime, endDateTime, enableReminder, reminderMinutes };
    setPendingData(data);

    // ===== BƯỚC 2: CONFLICT CHECK (Gọi xuống CalendarManager) =====
    const conflicting = manager.checkConflict(startDateTime, endDateTime);
    if (conflicting) {
      setWarningDialog({ open: true, conflicting });
      setShowAddDialog(false);
      return;
    }

    // ===== BƯỚC 3: GROUP MEETING CHECK (Gọi xuống CalendarManager) =====
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    const matchedMeeting = manager.checkGroupMeetingMatch(name, durationMinutes);
    
    if (matchedMeeting) {
      // Tìm thấy -> Mở Confirm Dialog hỏi user có muốn Join không
      setConfirmDialog({ open: true, matched: matchedMeeting });
      setShowAddDialog(false);
      return; // Dừng lại chờ user quyết định
    }

    // ===== BƯỚC 4: CREATE & SAVE =====
    executeCreate(data);
  };

  // ===== Hàm thực thi tạo cuộc hẹn (Bước 4) =====
  const executeCreate = (data: AppointmentData) => {
    const { name, location, startDateTime, endDateTime, enableReminder, reminderMinutes } = data;

    // Khởi tạo cuộc hẹn mới lưu vào danh sách
    manager.createAppointment(name, location, startDateTime, endDateTime);

    // Nếu user có tick chọn Reminder -> Tính giờ kích hoạt và thêm vào danh sách
    if (enableReminder) {
      const triggerTime = new Date(startDateTime.getTime() - reminderMinutes * 60 * 1000);
      manager.createReminder(triggerTime, `Nhắc nhở: "${name}" sắp bắt đầu sau ${reminderMinutes} phút`);
    }

    // Đóng form, làm mới UI và báo thành công
    setShowAddDialog(false);
    refresh();
    setSuccessDialog({ open: true, message: `Cuộc hẹn đã được tạo thành công!` });
  };

  // ===== Handler cho Warning Dialog (Bước 2 - Kết quả) =====
  const handleOverride = () => {
    if (!pendingData) return;
    const { name, location, startDateTime, endDateTime } = pendingData;

    manager.overrideAppointment(warningDialog.conflicting, name, location, startDateTime, endDateTime);

    if (pendingData.enableReminder) {
      const triggerTime = new Date(startDateTime.getTime() - pendingData.reminderMinutes * 60 * 1000);
      manager.createReminder(triggerTime, `Nhắc nhở: "${name}" sắp bắt đầu sau ${pendingData.reminderMinutes} phút`);
    }

    setWarningDialog({ open: false, conflicting: null });
    setPendingData(null);
    refresh();
    setSuccessDialog({
      open: true,
      message: `Đã ghi đè lịch cũ. Cuộc hẹn "${name}" đã được tạo thành công!`,
    });
  };

  const handleCancelConflict = () => {
    setWarningDialog({ open: false, conflicting: null });
    setShowAddDialog(true);
  };

  // ===== Handler cho Confirm Dialog (Bước 3 - Kết quả) =====
  const handleJoinMeeting = () => {
    if (!pendingData || !confirmDialog.matched) return;

    manager.joinMeeting(currentUser, confirmDialog.matched);

    setConfirmDialog({ open: false, matched: null });
    setPendingData(null);
    refresh();
    setSuccessDialog({
      open: true,
      message: `Bạn đã tham gia nhóm họp "${confirmDialog.matched.name}" thành công!`,
    });
  };

  const handleDeclineJoin = () => {
    setConfirmDialog({ open: false, matched: null });
    if (pendingData) {
      executeCreate(pendingData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <CalendarIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Calendar Manager</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  OOAD — Add Calendar Appointment Demo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{currentUser.username}</span>
              </div>
              {reminders.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">{reminders.length}</Badge>
                </div>
              )}
              <Button onClick={() => setShowAddDialog(true)} className="shadow-md">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <CalendarGrid
            appointments={appointments}
            groupMeetings={groupMeetings}
            onDateClick={handleDateClick}
          />
        </div>

        <AppointmentTable appointments={appointments} groupMeetings={groupMeetings} />

        {reminders.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-chart-4" />
              <h2 className="text-lg font-semibold tracking-tight">Nhắc nhở đã đặt</h2>
              <Badge variant="secondary" className="ml-1">{reminders.length}</Badge>
            </div>
            <div className="space-y-2">
              {reminders.map((r: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card shadow-sm">
                  <div className="h-8 w-8 rounded-lg bg-chart-4/10 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.message}</p>
                    <p className="text-xs text-muted-foreground">
                      Nhắc lúc: {r.triggerTime.toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== DIALOGS ===== */}
      <AddAppointmentDialog
        open={showAddDialog}
        onClose={(val: boolean) => setShowAddDialog(val)}
        onSave={handleSave}
        initialDate={prefillDate}
        initialTime={prefillTime}
      />

      <ErrorDialog
        open={errorDialog.open}
        onClose={() => setErrorDialog({ open: false, message: "" })}
        message={errorDialog.message}
      />

      <WarningDialog
        open={warningDialog.open}
        onClose={() => setWarningDialog({ open: false, conflicting: null })}
        conflictingAppointment={warningDialog.conflicting}
        onOverride={handleOverride}
        onCancel={handleCancelConflict}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, matched: null })}
        matchedMeeting={confirmDialog.matched}
        onJoin={handleJoinMeeting}
        onDecline={handleDeclineJoin}
      />

      <SuccessDialog
        open={successDialog.open}
        onClose={() => setSuccessDialog({ open: false, message: "" })}
        message={successDialog.message}
      />
    </div>
  );
}