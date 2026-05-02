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
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * ConfirmDialog - Hộp thoại xác nhận tham gia nhóm họp (Bước 3 - Group Meeting Check)
 */

// Định nghĩa kiểu dữ liệu cho Props
interface ConfirmDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  matchedMeeting: any; // Hoặc GroupMeeting nếu bạn đã import class
  onJoin: () => void;
  onDecline: () => void;
}

export default function ConfirmDialog({ 
  open, 
  onClose, 
  matchedMeeting, 
  onJoin, 
  onDecline 
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <AlertDialogTitle className="text-blue-700">Tìm thấy nhóm họp!</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 space-y-3">
            <p>Phát hiện một nhóm họp có cùng tên và thời lượng với sự kiện bạn đang tạo:</p>
            {matchedMeeting && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-2">
                <p className="font-medium text-blue-900">{matchedMeeting.name}</p>
                <p className="text-xs text-blue-700">
                  Thời lượng: {matchedMeeting.getDurationMinutes ? matchedMeeting.getDurationMinutes() : matchedMeeting.getDuration()} phút
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-xs text-blue-600 mr-1">Thành viên:</span>
                  {matchedMeeting.participants && matchedMeeting.participants.map((p: any, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] h-5 px-1.5">
                      {p.username}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <p className="font-medium">Bạn có muốn tham gia nhóm họp này không?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDecline}>
            Không, tạo sự kiện riêng
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onJoin}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Có, tham gia nhóm họp
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}