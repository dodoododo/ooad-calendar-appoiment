import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

/**
 * SuccessDialog - Hộp thoại thông báo thành công
 * Hiển thị sau khi tạo cuộc hẹn hoặc tham gia nhóm họp thành công
 */

// Định nghĩa kiểu dữ liệu cho Props
interface SuccessDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  message: string;
}

export default function SuccessDialog({ 
  open, 
  onClose, 
  message 
}: SuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <AlertDialogTitle className="text-green-700">Thành công!</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 text-sm leading-relaxed">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={() => onClose(false)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Đóng
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}