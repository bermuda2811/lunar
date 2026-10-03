import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { ScreenType } from '../types';
import { solarToLunar, getDayRating, getCanChi } from '../domain/lunarCalendar';

interface MonthlyCalendarScreenProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const MonthlyCalendarScreen: React.FC<MonthlyCalendarScreenProps> = ({
  currentDate,
  onDateSelect,
  onNavigate
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth() + 1); // 1-12

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Generate calendar days for the month
  // Monday = index 0, ..., Sunday = index 6
  const firstDayOfMonth = new Date(viewYear, viewMonth - 1, 1);
  const totalDaysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  let firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon...
  let startCol = (firstDayWeekday + 6) % 7; // Convert to Mon = 0, Sun = 6

  // Total days in previous month
  const totalDaysPrevMonth = new Date(viewYear, viewMonth - 1, 0).getDate();

  interface DayCell {
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    lunarDay: number;
    lunarMonth: number;
    isLeap: boolean;
    isGoodDay: boolean;
    hasEvent: boolean;
    isHoliday: boolean;
  }

  const cells: DayCell[] = [];

  // Previous month trailing days
  for (let i = startCol - 1; i >= 0; i--) {
    const d = totalDaysPrevMonth - i;
    const m = viewMonth === 1 ? 12 : viewMonth - 1;
    const y = viewMonth === 1 ? viewYear - 1 : viewYear;
    const lunar = solarToLunar(d, m, y);
    const canChi = getCanChi(d, m, y, lunar.year, lunar.month);
    const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);
    cells.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isLeap: lunar.isLeap,
      isGoodDay: rating.isGoodDay,
      hasEvent: false,
      isHoliday: false
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const lunar = solarToLunar(d, viewMonth, viewYear);
    const canChi = getCanChi(d, viewMonth, viewYear, lunar.year, lunar.month);
    const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);

    // Holiday & special event marks
    const isHoliday =
      (viewMonth === 9 && (d === 2 || d === 3)) ||
      (viewMonth === 1 && d === 1) ||
      (viewMonth === 4 && d === 30) ||
      (viewMonth === 5 && d === 1) ||
      (lunar.month === 1 && (lunar.day === 1 || lunar.day === 2 || lunar.day === 3)) ||
      (lunar.month === 3 && lunar.day === 10);

    const isSpecialEvent =
      isHoliday ||
      lunar.day === 1 ||
      lunar.day === 15 ||
      (lunar.month === 8 && lunar.day === 15);

    cells.push({
      day: d,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isLeap: lunar.isLeap,
      isGoodDay: rating.isGoodDay,
      hasEvent: isSpecialEvent,
      isHoliday: isHoliday
    });
  }

  // Next month leading days to complete 35 or 42 grid cells
  const remaining = 35 - cells.length > 0 ? 35 - cells.length : (42 - cells.length > 0 ? 42 - cells.length : 0);
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 12 ? 1 : viewMonth + 1;
    const y = viewMonth === 12 ? viewYear + 1 : viewYear;
    const lunar = solarToLunar(d, m, y);
    const canChi = getCanChi(d, m, y, lunar.year, lunar.month);
    const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);
    cells.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isLeap: lunar.isLeap,
      isGoodDay: rating.isGoodDay,
      hasEvent: false,
      isHoliday: false
    });
  }

  // Selected date data
  const selDay = selectedDate.getDate();
  const selMonth = selectedDate.getMonth() + 1;
  const selYear = selectedDate.getFullYear();
  const selLunar = solarToLunar(selDay, selMonth, selYear);
  const selCanChi = getCanChi(selDay, selMonth, selYear, selLunar.year, selLunar.month);
  const selRating = getDayRating(selCanChi.dayChiIndex, (selLunar.month + 1) % 12);

  const handleCellClick = (cell: DayCell) => {
    const newD = new Date(cell.year, cell.month - 1, cell.day);
    setSelectedDate(newD);
    onDateSelect(newD);
    if (!cell.isCurrentMonth) {
      setViewMonth(cell.month);
      setViewYear(cell.year);
    }
  };

  const isCellSelected = (cell: DayCell) => {
    return (
      cell.day === selectedDate.getDate() &&
      cell.month === selectedDate.getMonth() + 1 &&
      cell.year === selectedDate.getFullYear()
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] select-none">
      <StatusBar />

      {/* Header Month Switcher (Khớp Screen 4 Wireframe) */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <button
          onClick={handlePrevMonth}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h2 className="text-base font-bold text-slate-900">
          Tháng {viewMonth} năm {viewYear}
        </h2>

        <button
          onClick={handleNextMonth}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Weekdays Row: T2 T3 T4 T5 T6 T7 CN */}
      <div className="grid grid-cols-7 text-center py-2 px-3 border-b border-slate-100 bg-white text-xs font-bold text-slate-500 shrink-0">
        <div>T2</div>
        <div>T3</div>
        <div>T4</div>
        <div>T5</div>
        <div>T6</div>
        <div>T7</div>
        <div className="text-[#B3261E]">CN</div>
      </div>

      {/* Month Calendar Grid (7 columns) */}
      <div className="flex-1 px-3 py-1 overflow-y-auto no-scrollbar flex flex-col justify-start">
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, idx) => {
            const isSelected = isCellSelected(cell);
            const isSunday = idx % 7 === 6;

            return (
              <button
                key={idx}
                onClick={() => handleCellClick(cell)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all relative ${
                  isSelected
                    ? 'bg-[#B3261E] text-white shadow-md shadow-red-200'
                    : cell.isCurrentMonth
                    ? 'hover:bg-slate-100 text-slate-800'
                    : 'text-slate-300'
                }`}
                style={{ minHeight: '48px' }}
              >
                {/* Solar Date (Large) */}
                <span
                  className={`text-sm font-bold leading-tight ${
                    isSelected
                      ? 'text-white'
                      : isSunday
                      ? 'text-[#B3261E]'
                      : cell.isCurrentMonth
                      ? 'text-slate-900'
                      : 'text-slate-300'
                  }`}
                >
                  {cell.day}
                </span>

                {/* Lunar Date (Small) */}
                <span
                  className={`text-[10px] leading-tight font-medium ${
                    isSelected
                      ? 'text-red-100'
                      : cell.lunarDay === 1 || cell.lunarDay === 15
                      ? 'text-[#B3261E] font-bold'
                      : cell.isCurrentMonth
                      ? 'text-slate-500'
                      : 'text-slate-300'
                  }`}
                >
                  {cell.lunarDay === 1
                    ? `${cell.lunarDay}/${cell.lunarMonth}`
                    : cell.lunarDay === 15
                    ? '15'
                    : cell.lunarDay}
                </span>

                {/* Dots indicator (Ngày tốt / xấu / sự kiện) */}
                <div className="flex items-center gap-0.5 mt-0.5 h-1.5">
                  {cell.isCurrentMonth && (
                    <>
                      {cell.isGoodDay ? (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></span>
                      ) : (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-red-200' : 'bg-amber-800'}`}></span>
                      )}
                      {cell.hasEvent && (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-red-500'}`}></span>
                      )}
                      {cell.isHoliday && (
                        <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-yellow-200' : 'bg-amber-500'}`}></span>
                      )}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Info Card at Bottom (Khớp Screen 4 Wireframe) */}
        <div className="mt-2.5 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {selDay} tháng {selMonth} năm {selYear}
            </h3>
            <button
              onClick={() => onNavigate('daily_detail')}
              className="text-xs font-bold text-[#B3261E] flex items-center hover:underline"
            >
              Xem chi tiết <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <p className="text-xs text-[#B3261E] font-semibold mt-0.5">
            {selLunar.day}/{selLunar.month} năm {selCanChi.year}
          </p>

          <div className="flex items-start gap-1.5 text-xs text-slate-700 mt-2 pt-2 border-t border-slate-100">
            <span className="text-emerald-700 font-bold shrink-0">☘ Ngày tốt:</span>
            <span className="text-slate-600 line-clamp-1">
              Thích hợp: {selRating.suitableFor.slice(0, 3).join(', ')}...
            </span>
          </div>
        </div>

        {/* Legend dots at bottom (Khớp Screen 4 Wireframe) */}
        <div className="flex items-center justify-center gap-4 py-2 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Ngày tốt</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-800"></span>
            <span>Ngày xấu</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Sự kiện</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Ngày lễ</span>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar currentScreen="monthly_calendar" onNavigate={onNavigate} />
    </div>
  );
};
