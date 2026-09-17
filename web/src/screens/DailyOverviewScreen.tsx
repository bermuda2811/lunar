import React from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, Search, Settings } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { ScreenType } from '../types';
import { getFullDayData } from '../domain/lunarCalendar';

interface DailyOverviewScreenProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const DailyOverviewScreen: React.FC<DailyOverviewScreenProps> = ({
  currentDate,
  onDateChange,
  onNavigate
}) => {
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const dayData = getFullDayData(day, month, year);

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] select-none">
      <StatusBar />

      {/* Screen Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-white/70 backdrop-blur-sm shrink-0">
        <button
          onClick={handlePrevDay}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700"
          title="Ngày trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center cursor-pointer" onClick={() => onNavigate('daily_detail')}>
          <h2 className="text-base font-bold text-slate-800">
            {dayData.solar.dayOfWeek}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {day} tháng {month} năm {year}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('search')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700"
            title="Tìm kiếm tra cứu"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
            title="Cài đặt"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3 no-scrollbar">
        {/* 2 Big Side-by-Side Cards (Dương lịch & Âm lịch - Khớp 100% Screen 2 Wireframe) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Dương Lịch Card */}
          <div
            onClick={() => onNavigate('daily_detail')}
            className="bg-[#EBF7EE] border border-[#C5E8CE] rounded-2xl p-3.5 flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow transition-all active:scale-[0.98]"
          >
            <span className="text-xs font-semibold text-[#146C43] tracking-wide uppercase">
              Dương lịch
            </span>
            <span className="text-[58px] font-black leading-none my-1 text-[#0F5132] tracking-tight">
              {day}
            </span>
            <span className="text-sm font-bold text-[#146C43]">
              Tháng {month}
            </span>
            <span className="text-xs text-slate-600 font-medium mt-0.5">
              {year}
            </span>
            <span className="text-xs font-bold text-[#0F5132] mt-1 bg-white/70 px-2.5 py-0.5 rounded-full">
              {dayData.solar.dayOfWeek}
            </span>
          </div>

          {/* Âm Lịch Card */}
          <div
            onClick={() => onNavigate('daily_detail')}
            className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-3.5 flex flex-col items-center text-center cursor-pointer shadow-sm hover:shadow transition-all active:scale-[0.98]"
          >
            <span className="text-xs font-semibold text-[#B3261E] tracking-wide uppercase">
              Âm lịch
            </span>
            <span className="text-[58px] font-black leading-none my-1 text-[#B3261E] tracking-tight">
              {dayData.lunar.day}
            </span>
            <span className="text-sm font-bold text-[#9E1B1B]">
              Tháng {dayData.lunar.month} {dayData.lunar.isLeap ? '(Nhuận)' : ''}
            </span>
            <span className="text-xs font-semibold text-slate-700 mt-0.5">
              Năm {dayData.canChi.year}
            </span>
            <div className="text-[11px] text-slate-600 font-medium leading-tight mt-1 bg-white/70 px-2 py-1 rounded-lg">
              <div>Ngày {dayData.canChi.day}</div>
              <div>Tháng {dayData.canChi.month}</div>
            </div>
          </div>
        </div>

        {/* Card Đánh giá ngày (Cỏ 4 lá / Ngày Hoàng Đạo) */}
        <div
          onClick={() => onNavigate('daily_detail')}
          className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              {/* Clover icon */}
              <svg className="w-4 h-4 fill-emerald-700" viewBox="0 0 24 24">
                <path d="M12 10a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 4a3 3 0 1 0 3 3 3 3 0 0 0-3-3zm-4-2a3 3 0 1 0-3 3 3 3 0 0 0 3-3zm8 0a3 3 0 1 0 3-3 3 3 0 0 0-3 3zm-3 2v6a1 1 0 0 1-2 0v-6z"/>
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block leading-tight">
                {dayData.rating.isGoodDay ? 'Tốt' : 'Bình thường'}
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                {dayData.rating.label}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 pl-1 border-t border-slate-100 pt-2">
            <p className="leading-snug">
              <strong className="text-slate-900 font-semibold">Thích hợp: </strong>
              {dayData.rating.suitableFor.join(', ')}
            </p>
            <p className="leading-snug text-slate-600">
              <strong className="text-rose-800 font-semibold">Kiêng kỵ: </strong>
              {dayData.rating.avoid.join(', ')}
            </p>
          </div>
        </div>

        {/* Card Sự kiện trong ngày (Ngôi sao) */}
        <div
          onClick={() => onNavigate('events_list')}
          className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Star className="w-4 h-4 fill-amber-500 stroke-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Sự kiện trong ngày
            </h3>
          </div>

          <div className="space-y-1.5 pl-2 text-xs text-slate-700 font-medium">
            {day === 16 && month === 9 ? (
              <>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Ngày Quốc tế Bảo vệ Tầng Ozone</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Rằm tháng 8 (Tết Trung Thu)</span>
                </div>
              </>
            ) : dayData.lunar.day === 15 ? (
              <div className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Ngày Rằm ({dayData.lunar.day}/{dayData.lunar.month} Âm lịch)</span>
              </div>
            ) : dayData.lunar.day === 1 ? (
              <div className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span>Mùng một đầu tháng ({dayData.lunar.day}/{dayData.lunar.month} Âm lịch)</span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 text-slate-600">
                <span className="text-amber-500 font-bold">•</span>
                <span>Ngày bình an, vạn sự thuận lợi</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Danh ngôn / Thông điệp ngày (Dấu ngoặc kép) */}
        <div className="bg-[#FFFBF5] border border-[#EFE5D5] rounded-2xl p-3.5 shadow-sm flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-[#B3261E] shrink-0 mt-0.5">
            <Quote className="w-4 h-4 fill-[#B3261E]" />
          </div>
          <p className="text-xs italic text-slate-700 leading-relaxed font-serif pt-0.5">
            &ldquo;Trung thu là tết của tình thân, là dịp để gia đình sum vầy.&rdquo;
          </p>
        </div>

        {/* Cụm nút điều hướng lớn dành cho Người cao tuổi (Khớp Wireframe) */}
        <div className="pt-1 flex items-center justify-between gap-2">
          <button
            onClick={handlePrevDay}
            className="flex-1 py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 shadow-sm active:bg-slate-100 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Ngày trước
          </button>

          <button
            onClick={handleToday}
            className="px-4 py-2.5 bg-[#B3261E] text-white rounded-xl text-xs font-bold shadow-md shadow-red-200 active:scale-95 transition-all"
          >
            Hôm nay
          </button>

          <button
            onClick={handleNextDay}
            className="flex-1 py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 shadow-sm active:bg-slate-100 active:scale-95 transition-all"
          >
            Ngày sau <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar currentScreen="daily_overview" onNavigate={onNavigate} />
    </div>
  );
};
