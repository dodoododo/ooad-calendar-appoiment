import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarPlus } from "lucide-react";

/**
 * AddAppointmentDialog - Form nhập liệu tạo cuộc hẹn mới
 */

// Định nghĩa kiểu dữ liệu cho Props để xóa lỗi TypeScript
interface AddAppointmentDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onSave: (data: any) => void;
  initialDate?: string;
  initialTime?: string;
}

export default function AddAppointmentDialog({
  open,
  onClose,
  onSave,
  initialDate = "",
  initialTime = "",
}: AddAppointmentDialogProps) {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(initialDate);
  const [startTimeStr, setStartTimeStr] = useState<string>(initialTime);
  const [endDate, setEndDate] = useState<string>(initialDate);
  const [endTimeStr, setEndTimeStr] = useState<string>("");
  const [enableReminder, setEnableReminder] = useState<boolean>(false);
  const [reminderMinutes, setReminderMinutes] = useState<string>("15");

  const handleSubmit = () => {
    // Gom dữ liệu từ form và gửi lên CalendarUI
    onSave({
      name: name.trim(),
      location: location.trim(),
      startDate,
      startTime: startTimeStr,
      endDate,
      endTime: endTimeStr,
      enableReminder,
      reminderMinutes: parseInt(reminderMinutes, 10),
    });
  };

  // Sync pre-filled date/time khi dialog mở
  useEffect(() => {
    if (open) {
      setStartDate(initialDate || "");
      setStartTimeStr(initialTime || "");
      setEndDate(initialDate || "");
    }
  }, [open, initialDate, initialTime]);

  const resetForm = () => {
    setName("");
    setLocation("");
    setStartDate("");
    setStartTimeStr("");
    setEndDate("");
    setEndTimeStr("");
    setEnableReminder(false);
    setReminderMinutes("15");
  };

  const handleClose = (val: boolean) => {
    if (!val) resetForm();
    onClose(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <CalendarPlus className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">Thêm cuộc hẹn mới</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Tên sự kiện */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Tên sự kiện <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Đi khám răng, Họp nhóm OOAD..."
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </div>

          {/* Địa điểm */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Địa điểm</Label>
            <Input
              id="location"
              placeholder="VD: Phòng khám ABC, Phòng họp 301..."
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            />
          </div>

          {/* Thời gian bắt đầu */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Ngày bắt đầu <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Giờ bắt đầu <span className="text-destructive">*</span>
              </Label>
              <Input
                type="time"
                value={startTimeStr}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTimeStr(e.target.value)}
              />
            </div>
          </div>

          {/* Thời gian kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Ngày kết thúc <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Giờ kết thúc <span className="text-destructive">*</span>
              </Label>
              <Input
                type="time"
                value={endTimeStr}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTimeStr(e.target.value)}
              />
            </div>
          </div>

          {/* Nhắc nhở */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <Checkbox
              id="reminder"
              checked={enableReminder}
              // Ép kiểu CheckedState về boolean
              onCheckedChange={(checked) => setEnableReminder(checked === true)}
            />
            <Label htmlFor="reminder" className="text-sm cursor-pointer flex-1">
              Bật nhắc nhở trước cuộc hẹn
            </Label>
            {enableReminder && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={reminderMinutes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReminderMinutes(e.target.value)}
                  className="w-20 h-8 text-sm"
                />
                <span className="text-sm text-muted-foreground">phút</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Thêm cuộc hẹn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}