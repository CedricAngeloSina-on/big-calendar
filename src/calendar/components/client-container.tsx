"use client";

import { useMemo } from "react";
import { isSameDay, parseISO } from "date-fns";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { CalendarHeader } from "@/calendar/components/calendar-header";

import type { ICalendarItem, IUser } from "@/calendar/interfaces";

interface IProps {
  calendarItems: ICalendarItem[];
  users: IUser[];
}

export function ClientContainer({ calendarItems, users }: IProps) {
  const { selectedDate, selectedUserId } = useCalendar();

  const filteredCalendarItens = useMemo(() => {
    return calendarItems.filter(item => {
      const itemStartDate = new Date(item.startDate);
      const itemEndDate = new Date(item.endDate);

      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const isInSelectedMonth = itemStartDate <= monthEnd && itemEndDate >= monthStart;
      const isUserMatch = selectedUserId === "all" || item.userId === selectedUserId;
      return isInSelectedMonth && isUserMatch;
    });
  }, [selectedDate, selectedUserId, calendarItems]);

  const singleDayItems = filteredCalendarItens.filter(calendarItem => {
    const startDate = parseISO(calendarItem.startDate);
    const endDate = parseISO(calendarItem.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayItems = filteredCalendarItens.filter(calendarItem => {
    const startDate = parseISO(calendarItem.startDate);
    const endDate = parseISO(calendarItem.endDate);
    return !isSameDay(startDate, endDate);
  });

  return (
    <div className="mx-auto max-w-screen-2xl px-8">
      <div className="rounded-xl border">
        <CalendarHeader view="month" calendarItens={filteredCalendarItens} users={users} />
        <p className="p-4">{JSON.stringify(filteredCalendarItens, null, 2)}</p>
        {/* <CalendarMonthView selectedDate={selectedDate} singleDayCalendarItems={singleDayItems} multiDayCalendarItems={multiDayItems} /> */}
      </div>
    </div>
  );
}
