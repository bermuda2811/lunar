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
              <div>• Ngày Quốc tế Bảo vệ Tầng Ozone</div>
              <div>• Rằm tháng 8 (Tết Trung Thu)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar currentScreen="daily_detail" onNavigate={onNavigate} />
    </div>
  );
};
