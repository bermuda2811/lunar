import React from 'react';
import { ChevronLeft, Search, Calendar, Moon, Clock, CheckCircle2, Ban, Star, Sun, Compass } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { ScreenType } from '../types';
import { getFullDayData } from '../domain/lunarCalendar';

interface DailyDetailScreenProps {
  currentDate: Date;
  onNavigate: (screen: ScreenType) => void;
}

export const DailyDetailScreen: React.FC<DailyDetailScreenProps> = ({
  currentDate,
  onNavigate
}) => {
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const dayData = getFullDayData(day, month, year);

  const getDayEvents = () => {
    const events: string[] = [];
    if (day === 1 && month === 1) events.push('Tết Dương Lịch');
    if (day === 14 && month === 2) events.push('Lễ tình nhân (Valentine)');
    if (day === 8 && month === 3) events.push('Quốc tế Phụ nữ (8/3)');
    if (day === 30 && month === 4) events.push('Ngày Giải phóng Miền Nam (30/4)');
    if (day === 1 && month === 5) events.push('Ngày Quốc tế Lao động (1/5)');
    if (day === 19 && month === 5) events.push('Ngày sinh Chủ tịch Hồ Chí Minh (19/5)');
    if (day === 1 && month === 6) events.push('Quốc tế Thiếu nhi (1/6)');
    if (day === 2 && month === 9) events.push('Ngày Quốc khánh Việt Nam (2/9)');
    if (day === 16 && month === 9) events.push('Ngày Quốc tế Bảo vệ Tầng Ozone');
    if (day === 20 && month === 10) events.push('Ngày Phụ nữ Việt Nam (20/10)');
    if (day === 20 && month === 11) events.push('Ngày Nhà giáo Việt Nam (20/11)');
    if (day === 22 && month === 12) events.push('Ngày Thành lập QĐND Việt Nam (22/12)');
    if (day === 25 && month === 12) events.push('Lễ Giáng sinh (Noel)');

    if (dayData.lunar.month === 1 && dayData.lunar.day === 1) events.push('Mùng 1 Tết Nguyên Đán');
    else if (dayData.lunar.month === 1 && dayData.lunar.day === 2) events.push('Mùng 2 Tết Nguyên Đán');
    else if (dayData.lunar.month === 1 && dayData.lunar.day === 3) events.push('Mùng 3 Tết Nguyên Đán');
    else if (dayData.lunar.month === 1 && dayData.lunar.day === 15) events.push('Rằm Tháng Giêng (Tết Thượng Nguyên)');
    else if (dayData.lunar.month === 3 && dayData.lunar.day === 10) events.push('Giỗ Tổ Hùng Vương (10/3 Âm lịch)');
    else if (dayData.lunar.month === 4 && dayData.lunar.day === 15) events.push('Đại lễ Phật Đản');
    else if (dayData.lunar.month === 5 && dayData.lunar.day === 5) events.push('Tết Đoan Ngọ (5/5 Âm lịch)');
    else if (dayData.lunar.month === 7 && dayData.lunar.day === 15) events.push('Lễ Vu Lan Báo Hiếu (Rằm tháng 7)');
    else if (dayData.lunar.month === 8 && dayData.lunar.day === 15) events.push('Tết Trung Thu (Rằm tháng 8)');
    else if (dayData.lunar.month === 12 && dayData.lunar.day === 23) events.push('Cúng Ông Táo chầu trời');
    else if (dayData.lunar.day === 15) events.push(`Ngày Rằm (${dayData.lunar.day}/${dayData.lunar.month} Âm lịch)`);
    else if (dayData.lunar.day === 1) events.push(`Mùng một đầu tháng (${dayData.lunar.day}/${dayData.lunar.month} Âm lịch)`);

    if (events.length === 0) {
      events.push('Ngày bình an, vạn sự thuận lợi');
    }
    return events;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] select-none">
      <StatusBar />

      {/* Screen Header */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm shrink-0">
        <button
          onClick={() => onNavigate('daily_overview')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700"
          title="Quay lại"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-sm font-bold text-slate-900">
            {dayData.solar.dayOfWeek}, {day}/{month}/{year}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {dayData.lunar.day} tháng {dayData.lunar.month} năm {dayData.canChi.year}
          </span>
        </div>

        <button
          onClick={() => onNavigate('search')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700"
          title="Tìm kiếm"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Toggle View Mode: [Tổng quan] [Chi tiết] (Khớp Screen 3 Wireframe) */}
      <div className="flex border-b border-slate-200 bg-white px-6 shrink-0">
        <button
          onClick={() => onNavigate('daily_overview')}
          className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Tổng quan
        </button>
        <button
          className="flex-1 py-2.5 text-center text-xs font-bold text-[#B3261E] border-b-2 border-[#B3261E]"
        >
          Chi tiết
        </button>
      </div>

      {/* Detail Content List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 no-scrollbar">
        {/* 1. Dương lịch */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <span className="text-slate-500 font-medium block">Dương lịch</span>
            <span className="text-slate-900 font-bold text-sm">
              {day}/{month}/{year} ({dayData.solar.dayOfWeek})
            </span>
          </div>
        </div>

        {/* 2. Âm lịch */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-[#B3261E] shrink-0">
            <Moon className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <span className="text-slate-500 font-medium block">Âm lịch</span>
            <span className="text-[#B3261E] font-bold text-sm">
              {dayData.lunar.day}/{dayData.lunar.month}/{dayData.canChi.year}
            </span>
          </div>
        </div>

        {/* 3. Can Chi */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <span className="text-slate-500 font-medium block">Can Chi</span>
            <span className="text-slate-800 font-bold text-xs leading-relaxed">
              Ngày {dayData.canChi.day} - Tháng {dayData.canChi.month} - Năm {dayData.canChi.year}
            </span>
          </div>
        </div>

        {/* 4. Tiết khí */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <span className="text-slate-500 font-medium block">Tiết khí</span>
            <span className="text-slate-800 font-bold text-xs">
              {dayData.tietKhi.nextName} (còn {dayData.tietKhi.daysRemaining} ngày)
            </span>
          </div>
        </div>

        {/* 5. Ngày tốt / xấu */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Star className="w-4 h-4 fill-emerald-600" />
          </div>
          <div className="flex-1 text-xs">
            <span className="text-slate-500 font-medium block">Ngày tốt/xấu</span>
            <span className="text-emerald-700 font-bold text-xs">
              {dayData.rating.label}
            </span>
          </div>
        </div>

        {/* 6. Giờ hoàng đạo (Khớp Wireframe) */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <span className="text-slate-500 font-medium block mb-1">Giờ hoàng đạo</span>
            <div className="text-slate-800 font-medium leading-relaxed">
              {dayData.auspiciousHours.map((h, i) => (
                <span key={i} className="inline-block mr-2 mb-0.5">
                  <strong className="font-semibold text-indigo-900">{h.canChi}</strong> ({h.time})
                  {i < dayData.auspiciousHours.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Việc nên làm */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <span className="text-slate-500 font-medium block mb-0.5">Việc nên làm</span>
            <span className="text-slate-800 font-medium leading-snug">
              {dayData.rating.suitableFor.join(', ')}
            </span>
          </div>
        </div>

        {/* 8. Việc kiêng kỵ */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
            <Ban className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <span className="text-slate-500 font-medium block mb-0.5">Việc kiêng kỵ</span>
            <span className="text-slate-800 font-medium leading-snug">
              {dayData.rating.avoid.join(', ')}
            </span>
          </div>
        </div>

        {/* 9. Sự kiện / Ngày lễ */}
        <div
          onClick={() => onNavigate('events_list')}
          className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Star className="w-4 h-4 fill-amber-500" />
          </div>
          <div className="flex-1 text-xs">
            <span className="text-slate-500 font-medium block mb-0.5">Sự kiện / Ngày lễ</span>
            <div className="text-slate-800 font-medium space-y-0.5">
              {getDayEvents().map((ev, i) => (
                <div key={i}>• {ev}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar currentScreen="daily_detail" onNavigate={onNavigate} />
    </div>
  );
};
