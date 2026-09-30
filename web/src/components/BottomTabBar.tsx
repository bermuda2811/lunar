import React from 'react';
import { Calendar, CalendarDays, Bell } from 'lucide-react';
import { MainTabType, ScreenType } from '../types';

interface BottomTabBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentScreen, onNavigate }) => {
  // Determine active tab
  let activeTab: MainTabType = 'daily';
  if (currentScreen === 'monthly_calendar') {
    activeTab = 'monthly';
  } else if (currentScreen === 'reminders' || currentScreen === 'add_reminder') {
    activeTab = 'reminders';
  } else {
    activeTab = 'daily';
  }

  return (
    <div className="w-full bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-around select-none shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <button
        onClick={() => onNavigate('daily_overview')}
        className={`flex flex-col items-center gap-1 transition-colors min-w-[70px] py-1 ${
          activeTab === 'daily' ? 'text-[#B3261E] font-bold' : 'text-slate-500 font-medium hover:text-slate-700'
        }`}
      >
        <Calendar className={`w-5 h-5 ${activeTab === 'daily' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-xs tracking-tight">Lịch ngày</span>
      </button>

      <button
        onClick={() => onNavigate('monthly_calendar')}
        className={`flex flex-col items-center gap-1 transition-colors min-w-[70px] py-1 ${
          activeTab === 'monthly' ? 'text-[#B3261E] font-bold' : 'text-slate-500 font-medium hover:text-slate-700'
        }`}
      >
        <CalendarDays className={`w-5 h-5 ${activeTab === 'monthly' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-xs tracking-tight">Lịch tháng</span>
      </button>

      <button
        onClick={() => onNavigate('reminders')}
        className={`flex flex-col items-center gap-1 transition-colors min-w-[70px] py-1 ${
          activeTab === 'reminders' ? 'text-[#B3261E] font-bold' : 'text-slate-500 font-medium hover:text-slate-700'
        }`}
      >
        <Bell className={`w-5 h-5 ${activeTab === 'reminders' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-xs tracking-tight">Nhắc nhở</span>
      </button>
    </div>
  );
};
