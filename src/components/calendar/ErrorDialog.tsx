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
import { AlertCircle } from "lucide-react";

/**
 * ErrorDialog - Hộp thoại báo lỗi (Bước 1 - Validation)
 * Hiển thị khi dữ liệu nhập không hợp lệ
 */

// Định nghĩa kiểu dữ liệu cho Props để hết lỗi TypeScript
interface ErrorDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  message: string;
}

export default function ErrorDialog({ 
  open, 
  onClose, 
  message 
}: ErrorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-destructive">Lỗi nhập liệu</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 text-sm leading-relaxed">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={() => onClose(false)}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Đã hiểu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}