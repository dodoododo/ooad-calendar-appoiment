import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import moment from "moment";

/**
 * WarningDialog - Hộp thoại cảnh báo trùng lịch (Bước 2 - Conflict Check)
 */

// Định nghĩa kiểu dữ liệu cho Props
interface WarningDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  conflictingAppointment: any; // Hoặc Appointment nếu bạn đã import class
  onOverride: () => void;
  onCancel: () => void;
}

export default function WarningDialog({ 
  open, 
  onClose, 
  conflictingAppointment, 
  onOverride, 
  onCancel 
}: WarningDialogProps) {
  
  const formatTime = (date: any) => moment(date).format("DD/MM/YYYY HH:mm");

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <AlertDialogTitle className="text-yellow-700">Trùng lịch!</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 space-y-3">
            <p>Cuộc hẹn mới bị trùng thời gian với lịch hiện tại:</p>
            {conflictingAppointment && (
              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 space-y-1">
                <p className="font-medium text-yellow-900">{conflictingAppointment.name}</p>
                <p className="text-xs text-yellow-700">
                  {formatTime(conflictingAppointment.startTime)} — {formatTime(conflictingAppointment.endTime)}
                </p>
              </div>
            )}
            <p className="font-medium">Bạn muốn chọn giờ khác hay ghi đè lịch cũ?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Chọn giờ khác
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onOverride}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Ghi đè lịch cũ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}