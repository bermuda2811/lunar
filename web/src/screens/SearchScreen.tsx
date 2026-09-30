import React, { useState } from 'react';
import { ChevronLeft, Search, Calendar, Star, ChevronRight } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { ScreenType } from '../types';

interface SearchScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectEvent?: (eventId: number) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onNavigate,
  onSelectEvent
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'date' | 'event' | 'holiday'>('date');

  const recentSearches = [
    { title: 'Tết Nguyên Đán', date: '29 tháng Chạp - Mùng 3 Tết', id: 2 },
    { title: 'Rằm tháng Giêng', date: '15 tháng 1 Âm lịch', id: 3 },
    { title: 'Giỗ Tổ Hùng Vương', date: '10 tháng 3 Âm lịch', id: 4 },
    { title: 'Ngày Thương binh Liệt sĩ', date: '27 tháng 7 Dương lịch', id: 5 },
    { title: 'Quốc khánh 2/9', date: '2 tháng 9 Dương lịch', id: 9 },
    { title: 'Tết Trung Thu', date: '15 tháng 8 Âm lịch', id: 8 }
  ];

  const filteredResults = query.trim()
    ? recentSearches.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleItemClick = (id: number) => {
    if (onSelectEvent) onSelectEvent(id);
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
          Tìm kiếm
        </h1>

        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Search Bar (Khớp Screen 8 Wireframe) */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm ngày, sự kiện, lễ tết..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#B3261E] transition-all shadow-xs"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Pills: [Ngày] [Sự kiện] [Lễ tết] */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('date')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'date'
                ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200 font-bold'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Ngày
          </button>
          <button
            onClick={() => setFilterType('event')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'event'
                ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200 font-bold'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Sự kiện
          </button>
          <button
            onClick={() => setFilterType('holiday')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === 'holiday'
                ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200 font-bold'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            Lễ tết
          </button>
        </div>

        {/* Search Results (if user types) */}
        {query.trim() && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kết quả tìm kiếm ({filteredResults.length})
            </h2>
            {filteredResults.length > 0 ? (
              <div className="space-y-2">
                {filteredResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-[#B3261E] font-medium mt-0.5">{item.date}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">Không tìm thấy kết quả phù hợp</p>
            )}
          </div>
        )}

        {/* Section: Kết quả gần đây (Khớp Screen 8 Wireframe) */}
        {!query.trim() && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kết quả gần đây
            </h2>
            <div className="bg-white border border-slate-200/90 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-xs">
              {recentSearches.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
