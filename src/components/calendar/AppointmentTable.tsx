import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, CalendarDays } from "lucide-react";
import moment from "moment";

/**
 * Component AppointmentTable - Hiển thị danh sách cuộc hẹn dạng bảng
 * Thuộc tầng View (CalendarUI)
 */

// Định nghĩa kiểu dữ liệu cho Props
interface AppointmentTableProps {
  appointments: any[];
  groupMeetings: any[];
}

export default function AppointmentTable({ appointments, groupMeetings }: AppointmentTableProps) {
  // Thêm kiểu dữ liệu :any cho tham số date
  const formatTime = (date: any) => moment(date).format("DD/MM/YYYY HH:mm");

  return (
    <div className="space-y-8">
      {/* Bảng Appointments */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold tracking-tight">Danh sách Cuộc hẹn</h2>
          <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700">
            {appointments.length}
          </Badge>
        </div>
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-bold text-slate-700">Tên sự kiện</TableHead>
                <TableHead className="font-bold text-slate-700">Địa điểm</TableHead>
                <TableHead className="font-bold text-slate-700">Bắt đầu</TableHead>
                <TableHead className="font-bold text-slate-700">Kết thúc</TableHead>
                <TableHead className="font-bold text-slate-700 text-right">Thời lượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Chưa có cuộc hẹn cá nhân nào được tạo.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appt: any, idx: number) => (
                  <TableRow key={idx} className="group hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-900">{appt.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-sm">{appt.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{formatTime(appt.startTime)}</TableCell>
                    <TableCell className="text-sm text-slate-600">{formatTime(appt.endTime)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono text-[11px] bg-white">
                        <Clock className="h-3 w-3 mr-1 text-slate-400" />
                        {appt.getDurationMinutes ? appt.getDurationMinutes() : (appt.getDuration ? appt.getDuration() : "--")} phút
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Bảng Group Meetings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold tracking-tight">Danh sách Nhóm họp</h2>
          <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700">
            {groupMeetings.length}
          </Badge>
        </div>
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-bold text-slate-700">Tên nhóm họp</TableHead>
                <TableHead className="font-bold text-slate-700">Địa điểm</TableHead>
                <TableHead className="font-bold text-slate-700">Bắt đầu</TableHead>
                <TableHead className="font-bold text-slate-700">Thời lượng</TableHead>
                <TableHead className="font-bold text-slate-700">Thành viên</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupMeetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Chưa có nhóm họp nào trong hệ thống.
                  </TableCell>
                </TableRow>
              ) : (
                groupMeetings.map((meeting: any, idx: number) => (
                  <TableRow key={idx} className="group hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-900">{meeting.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-sm">{meeting.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{formatTime(meeting.startTime)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[11px] bg-white">
                        <Clock className="h-3 w-3 mr-1 text-slate-400" />
                        {meeting.getDurationMinutes ? meeting.getDurationMinutes() : (meeting.getDuration ? meeting.getDuration() : "--")} phút
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {meeting.participants && meeting.participants.map((p: any, pidx: number) => (
                          <Badge key={pidx} variant="secondary" className="text-[10px] h-5 px-1.5 bg-emerald-50 text-emerald-700 border-emerald-100">
                            {p.username}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}