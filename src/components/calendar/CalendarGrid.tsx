import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";

/**
 * CalendarGrid - Lưới lịch tháng (Monthly Calendar View)
 */

// Định nghĩa kiểu dữ liệu cho Props
interface CalendarGridProps {
  appointments: any[];
  groupMeetings: any[];
  onDateClick: (date: string, time: string) => void;
}

export default function CalendarGrid({ appointments, groupMeetings, onDateClick }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));

  const today = moment();
  const startOfMonth = currentMonth.clone().startOf("month");
  const endOfMonth = currentMonth.clone().endOf("month");

  // Xây dựng mảng các ô ngày (bao gồm padding đầu/cuối tháng)
  const startDay = startOfMonth.clone().startOf("week"); 
  const endDay = endOfMonth.clone().endOf("week");

  const days: moment.Moment[] = [];
  let day = startDay.clone();
  while (day.isSameOrBefore(endDay, "day")) {
    days.push(day.clone());
    day.add(1, "day");
  }

  // Build map: date string -> list of events
  const eventMap: Record<string, any[]> = {};
  const allEvents = [
    ...appointments.map(a => ({ ...a, type: "appointment" })),
    ...groupMeetings.map(g => ({ ...g, type: "meeting" })),
  ];

  allEvents.forEach((ev) => {
    const key = moment(ev.startTime).format("YYYY-MM-DD");
    if (!eventMap[key]) eventMap[key] = [];
    eventMap[key].push(ev);
  });

  const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const handleDayClick = (d: moment.Moment) => {
    const now = moment();
    const hour = now.hours() < 23 ? now.hours() + 1 : 8;
    const time = `${String(hour).padStart(2, "0")}:00`;
    onDateClick(d.format("YYYY-MM-DD"), time);
  };

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
      {/* Header điều hướng tháng */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "month"))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold text-base tracking-tight text-slate-800">
          Tháng {currentMonth.format("MM, YYYY")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth(currentMonth.clone().add(1, "month"))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Header ngày trong tuần */}
      <div className="grid grid-cols-7 border-b border-border/40 bg-slate-50/50">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className={cn(
              "text-center py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider",
              wd === "CN" && "text-destructive/70"
            )}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Lưới ngày */}
      <div className="grid grid-cols-7">
        {days.map((d, idx) => {
          const key = d.format("YYYY-MM-DD");
          const isToday = d.isSame(today, "day");
          const isCurrentMonth = d.isSame(currentMonth, "month");
          const events = eventMap[key] || [];
          const isSunday = d.day() === 0;

          return (
            <div
              key={idx}
              onClick={() => isCurrentMonth && handleDayClick(d)}
              className={cn(
                "min-h-[100px] p-2 border-b border-r border-border/30 transition-all",
                isCurrentMonth
                  ? "cursor-pointer hover:bg-slate-50/80"
                  : "bg-slate-50/30 cursor-default opacity-40",
                idx % 7 === 6 && "border-r-0", 
              )}
            >
              {/* Số ngày */}
              <div className="flex justify-end mb-1">
                <span
                  className={cn(
                    "h-7 w-7 flex items-center justify-center rounded-full text-sm font-semibold",
                    isToday && "bg-blue-600 text-white shadow-sm",
                    !isToday && isCurrentMonth && !isSunday && "text-slate-700",
                    !isToday && isCurrentMonth && isSunday && "text-red-500",
                  )}
                >
                  {d.date()}
                </span>
              </div>

              {/* Sự kiện trong ngày */}
              <div className="space-y-1">
                {events.slice(0, 2).map((ev, eidx) => (
                  <div
                    key={eidx}
                    title={ev.name}
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded truncate font-bold border",
                      ev.type === "appointment"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    )}
                  >
                    {moment(ev.startTime).format("H:mm")} {ev.name}
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-[10px] text-muted-foreground pl-1 font-medium">
                    + {events.length - 2} thêm...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-3 border-t border-border/40 bg-slate-50/80">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded bg-blue-500" />
          <span className="text-[11px] font-medium text-slate-600">Cuộc hẹn cá nhân</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded bg-emerald-500" />
          <span className="text-[11px] font-medium text-slate-600">Nhóm họp</span>
        </div>
        <span className="text-[10px] italic text-slate-400 ml-auto">Nhấp vào ô ngày để thêm lịch nhanh</span>
      </div>
    </div>
  );
}