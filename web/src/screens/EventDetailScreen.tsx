import React from 'react';
import { ChevronLeft, Share2, Bookmark, Calendar } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { ScreenType } from '../types';

interface EventDetailScreenProps {
  eventId: number;
  onNavigate: (screen: ScreenType) => void;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  eventId,
  onNavigate
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] select-none">
      <StatusBar />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <button
          onClick={() => onNavigate('events_list')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-base font-bold text-slate-900">
          Tết Trung Thu
        </h1>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600">
            <Share2 className="w-4.5 h-4.5" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600">
            <Bookmark className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Banner Illustration (Khớp Screen 10 Wireframe) */}
        <div className="w-full h-44 rounded-2xl overflow-hidden relative shadow-md bg-gradient-to-b from-[#141E30] to-[#243B55] flex items-center justify-center">
          {/* Full Moon & Festive Lanterns Graphic */}
          <div className="absolute top-4 right-10 w-20 h-20 rounded-full bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-300 shadow-[0_0_35px_rgba(255,220,100,0.8)] flex items-center justify-center">
            {/* Moon craters */}
            <div className="w-3 h-3 rounded-full bg-amber-300/30 absolute top-4 left-5"></div>
            <div className="w-4 h-4 rounded-full bg-amber-300/20 absolute bottom-5 right-4"></div>
          </div>

          {/* Glowing Red Lanterns hanging */}
          <div className="absolute top-2 left-6 flex items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="w-[1.5px] h-6 bg-amber-300"></div>
              <div className="w-7 h-9 rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-amber-300 shadow-[0_0_12px_rgba(255,50,50,0.8)] flex items-center justify-center">
                <span className="text-[9px] font-bold text-amber-200 font-serif">Phúc</span>
              </div>
              <div className="w-[1px] h-3 bg-amber-400"></div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[1.5px] h-10 bg-amber-300"></div>
              <div className="w-8 h-10 rounded-full bg-gradient-to-b from-amber-500 to-red-600 border border-yellow-300 shadow-[0_0_12px_rgba(255,150,50,0.8)] flex items-center justify-center">
                <span className="text-[9px] font-bold text-yellow-100 font-serif">Lộc</span>
              </div>
              <div className="w-[1px] h-3 bg-amber-400"></div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-[1.5px] h-5 bg-amber-300"></div>
              <div className="w-6 h-8 rounded-full bg-gradient-to-b from-red-600 to-rose-700 border border-amber-300 shadow-[0_0_10px_rgba(255,50,50,0.7)] flex items-center justify-center">
                <span className="text-[8px] font-bold text-amber-200 font-serif">Thọ</span>
              </div>
              <div className="w-[1px] h-3 bg-amber-400"></div>
            </div>
          </div>

          {/* Children / Festive Silhouettes on ground */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
            <span className="text-white/90 text-xs font-serif font-bold tracking-widest uppercase drop-shadow">
              Đêm Hội Trăng Rằm
            </span>
          </div>
        </div>

        {/* Date Display (Khớp Screen 10 Wireframe) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-[#B3261E] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Thời gian diễn ra</span>
            <span className="text-sm font-bold text-[#B3261E]">
              15 tháng 8 âm lịch (năm 2026: 25/9)
            </span>
          </div>
        </div>

        {/* Section: Ý nghĩa (Khớp Screen 10 Wireframe) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B3261E]"></span>
            Ý nghĩa
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Tết Trung Thu là dịp để gia đình sum vầy, trẻ em được vui chơi, rước đèn, phá cỗ. Đây cũng là dịp thể hiện tình thân và truyền thống văn hóa tốt đẹp của dân tộc.
          </p>
        </div>

        {/* Section: Hoạt động truyền thống */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Hoạt động truyền thống
          </h2>
          <div className="space-y-1.5 text-xs text-slate-700 font-medium pl-1">
            <div className="flex items-start gap-2">
              <span className="text-[#B3261E] font-bold">•</span>
              <span>Rước đèn ông sao, múa lân sư rồng</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#B3261E] font-bold">•</span>
              <span>Phá cỗ trông trăng, ăn bánh nướng, bánh dẻo</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#B3261E] font-bold">•</span>
              <span>Tặng quà và chúc phúc cho người thân</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
