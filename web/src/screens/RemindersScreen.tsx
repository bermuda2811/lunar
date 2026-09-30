import React, { useState } from 'react';
import { Plus, Check, Clock } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { ReminderIcon } from '../components/ReminderIcon';
import { ScreenType, ReminderItem } from '../types';

interface RemindersScreenProps {
  reminders: ReminderItem[];
  onToggleComplete: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({
  reminders,
  onToggleComplete,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredReminders = reminders.filter(r => {
    if (filter === 'upcoming') return !r.isCompleted;
    if (filter === 'completed') return r.isCompleted;
    return true;
  });

  const upcomingList = filteredReminders.filter(r => r.section === 'upcoming');
  const laterList = filteredReminders.filter(r => r.section === 'later');

  return (
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] select-none">
      <StatusBar />

      {/* Screen Header */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <h1 className="text-lg font-bold text-slate-900">
          Nhắc nhở
        </h1>

        {/* Red + button matching Screen 5 Wireframe */}
        <button
          onClick={() => onNavigate('add_reminder')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#B3261E] text-white shadow-md shadow-red-200 active:scale-95 transition-all"
          title="Thêm nhắc nhở mới"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Filter Tabs / Chips: [Tất cả] [Sắp tới] [Đã hoàn thành] */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-white border-b border-slate-100 shrink-0">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'upcoming'
              ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Sắp tới
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-[#FFEBEE] text-[#B3261E] border border-red-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Đã hoàn thành
        </button>
      </div>

      {/* Reminders List */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 no-scrollbar">
        {/* Section: Sắp tới */}
        {upcomingList.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Sắp tới
            </h2>
            <div className="space-y-2.5">
              {upcomingList.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs transition-all ${
                    item.isCompleted ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Left Icon with Pastel background */}
                  <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#B3261E] shrink-0">
                    <ReminderIcon icon={item.icon} size={22} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold text-slate-900 truncate ${item.isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium truncate">
                      {item.solarDate.split('-').reverse().join('/')} ({item.lunarFormatted})
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{item.time === 'all_day' ? 'Cả ngày' : item.time}</span>
                    </div>
                  </div>

                  {/* Custom Checkbox */}
                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                      item.isCompleted
                        ? 'bg-[#B3261E] border-[#B3261E] text-white'
                        : 'border-slate-300 hover:border-[#B3261E] bg-white'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Sau này */}
        {laterList.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Sau này
            </h2>
            <div className="space-y-2.5">
              {laterList.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs transition-all ${
                    item.isCompleted ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <ReminderIcon icon={item.icon} size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold text-slate-900 truncate ${item.isCompleted ? 'line-through text-slate-400' : ''}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium truncate">
                      {item.solarDate.split('-').reverse().join('/')} ({item.lunarFormatted})
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{item.time === 'all_day' ? 'Cả ngày' : item.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                      item.isCompleted
                        ? 'bg-[#B3261E] border-[#B3261E] text-white'
                        : 'border-slate-300 hover:border-[#B3261E] bg-white'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredReminders.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            Chưa có nhắc nhở nào trong mục này.
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar currentScreen="reminders" onNavigate={onNavigate} />
    </div>
  );
};
