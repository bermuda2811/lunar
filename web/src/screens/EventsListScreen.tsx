import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { ScreenType } from '../types';

interface EventsListScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectEvent: (eventId: number) => void;
}

export const EventsListScreen: React.FC<EventsListScreenProps> = ({
  onNavigate,
  onSelectEvent
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'vn' | 'intl' | 'lunar'>('all');

  // Exact items matching Screen 9 Wireframe
  const events = [
    { id: 1, date: '1/1', title: 'Tết Dương lịch', note: '(1 tháng 1)', category: 'vn' },
    { id: 2, date: '26/1', title: 'Tết Nguyên Đán', note: '(29 tháng Chạp)', category: 'vn' },
    { id: 3, date: '5/2', title: 'Rằm tháng Giêng', note: '(15 tháng 1)', category: 'lunar' },
    { id: 4, date: '10/3', title: 'Giỗ Tổ Hùng Vương', note: '(10 tháng 3)', category: 'vn' },
    { id: 5, date: '30/4', title: 'Ngày Giải phóng miền Nam', note: '(30 tháng 4)', category: 'vn' },
    { id: 6, date: '1/5', title: 'Quốc tế Lao động', note: '(1 tháng 5)', category: 'intl' },
    { id: 8, date: '15/8', title: 'Tết Trung Thu', note: '(15 tháng 8 âm)', category: 'lunar' },
    { id: 9, date: '2/9', title: 'Quốc khánh 2/9', note: '(2 tháng 9)', category: 'vn' },
    { id: 10, date: '20/11', title: 'Ngày Nhà giáo VN', note: '(20 tháng 11)', category: 'vn' },
    { id: 11, date: '24/12', title: 'Giáng Sinh', note: '(24 tháng 12)', category: 'intl' }
  ];

  const filteredEvents = events.filter(e => {
    if (activeTab === 'vn') return e.category === 'vn';
    if (activeTab === 'intl') return e.category === 'intl';
    if (activeTab === 'lunar') return e.category === 'lunar';
    return true;
  });

  const handleItemClick = (id: number) => {
    onSelectEvent(id);
    onNavigate('event_detail');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] select-none">
      <StatusBar />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <button
          onClick={() => onNavigate('daily_overview')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-base font-bold text-slate-900">
          Sự kiện & Ngày lễ
        </h1>

        <div className="w-10"></div>
      </div>

      {/* Filter Tabs: [Tất cả] [Lễ Việt Nam] [Quốc tế] [Âm lịch] (Khớp Screen 9 Wireframe) */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white border-b border-slate-100 shrink-0 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200 font-bold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveTab('vn')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'vn'
              ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200 font-bold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Lễ Việt Nam
        </button>
        <button
          onClick={() => setActiveTab('intl')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'intl'
              ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200 font-bold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Quốc tế
        </button>
        <button
          onClick={() => setActiveTab('lunar')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'lunar'
              ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200 font-bold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Âm lịch
        </button>
      </div>

      {/* Events List (Khớp Screen 9 Wireframe) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
        {filteredEvents.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-red-200 active:bg-slate-50 transition-all shadow-xs"
          >
            {/* Left Date badge in Red */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-[#B3261E] min-w-[42px]">
                {item.date}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Right Note and Arrow */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                {item.note}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
