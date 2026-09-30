import React, { useState, useEffect } from 'react';
import { ScreenType, ReminderItem, AppSettings } from './types';
import { getStoredReminders, saveStoredReminders, getStoredSettings, saveStoredSettings } from './storage';
import { SplashScreen } from './screens/SplashScreen';
import { DailyOverviewScreen } from './screens/DailyOverviewScreen';
import { DailyDetailScreen } from './screens/DailyDetailScreen';
import { MonthlyCalendarScreen } from './screens/MonthlyCalendarScreen';
import { RemindersScreen } from './screens/RemindersScreen';
import { AddReminderScreen } from './screens/AddReminderScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SearchScreen } from './screens/SearchScreen';
import { EventsListScreen } from './screens/EventsListScreen';
import { EventDetailScreen } from './screens/EventDetailScreen';
import { Smartphone, Monitor, ExternalLink, Calendar, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('daily_overview');
  // Initialize with 16/9/2026 to match wireframe showcase
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 16));
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [selectedEventId, setSelectedEventId] = useState<number>(8);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Load reminders & settings on mount
  useEffect(() => {
    setReminders(getStoredReminders());
    setSettings(getStoredSettings());
  }, []);

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r);
    setReminders(updated);
    saveStoredReminders(updated);
  };

  const handleAddReminder = (newRem: ReminderItem) => {
    const updated = [newRem, ...reminders];
    setReminders(updated);
    saveStoredReminders(updated);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const screensList: { id: ScreenType; label: string; num: number }[] = [
    { id: 'splash', label: '1. Loading', num: 1 },
    { id: 'daily_overview', label: '2. Xem ngày (Tổng quan)', num: 2 },
    { id: 'daily_detail', label: '3. Xem ngày (Chi tiết)', num: 3 },
    { id: 'monthly_calendar', label: '4. Xem tháng', num: 4 },
    { id: 'reminders', label: '5. Nhắc nhở', num: 5 },
    { id: 'add_reminder', label: '6. Tạo nhắc nhở', num: 6 },
    { id: 'settings', label: '7. Cài đặt', num: 7 },
    { id: 'search', label: '8. Tìm kiếm', num: 8 },
    { id: 'events_list', label: '9. Danh sách sự kiện', num: 9 },
    { id: 'event_detail', label: '10. Chi tiết sự kiện', num: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#1A1E29] text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4">
      {/* Top Interactive Showcase Toolbar */}
      <header className="w-full max-w-5xl bg-[#242B3D] border border-slate-700/80 rounded-2xl p-3 mb-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B3261E] to-red-500 flex items-center justify-center text-white font-bold shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Lịch An Nhiên (Lịch Việt)</h1>
              <span className="text-[11px] font-semibold bg-red-950/80 text-red-300 border border-red-800/60 px-2 py-0.5 rounded-full">
                100% Khớp Wireframe
              </span>
            </div>
            <p className="text-xs text-slate-400">Thiết kế tối ưu người cao tuổi • Âm dương lịch chuẩn UTC+7</p>
          </div>
        </div>

        {/* Action buttons & mode switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isPhoneFrame
                ? 'bg-red-600/20 border-red-500/50 text-red-200'
                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
            }`}
            title="Chuyển đổi kiểu khung điện thoại hoặc toàn màn hình"
          >
            {isPhoneFrame ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
            <span>{isPhoneFrame ? 'Khung Di Động' : 'Toàn Màn Hình'}</span>
          </button>

          {/* Direct link to Screen 11: Backend Admin CMS */}
          <a
            href="http://localhost:4000/admin"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#B3261E] text-white shadow-md shadow-red-900/40 hover:bg-[#8B1D1D] transition-all"
          >
            <span>11. Mở Backend CMS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Screen Quick Selector Chips (1 to 10) */}
      <div className="w-full max-w-5xl overflow-x-auto pb-2 mb-3 no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5" /> Chuyển màn hình:
          </span>
          {screensList.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setCurrentScreen(sc.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                currentScreen === sc.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/50 font-bold scale-105'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Device Frame Container or Full View */}
      <main className="flex-1 w-full flex items-center justify-center my-auto">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isPhoneFrame
              ? 'w-[380px] h-[780px] max-h-[92vh] rounded-[42px] border-[10px] border-[#1F2430] bg-[#FDFBF7] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden relative ring-1 ring-white/10'
              : 'w-full max-w-2xl h-[800px] max-h-[90vh] rounded-2xl bg-[#FDFBF7] shadow-2xl flex flex-col overflow-hidden border border-slate-700'
          }`}
        >
          {/* Dynamic Island / Speaker Notch on Phone frame */}
          {isPhoneFrame && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#11141D] rounded-full z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#1A1F2C] mr-2"></div>
              <div className="w-2 h-2 rounded-full bg-[#1E2538]"></div>
            </div>
          )}

          {/* Screen Content Render */}
          <div className="flex-1 flex flex-col h-full overflow-hidden text-slate-900">
            {currentScreen === 'splash' && (
              <SplashScreen onFinish={() => setCurrentScreen('daily_overview')} />
            )}

            {currentScreen === 'daily_overview' && (
              <DailyOverviewScreen
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                onNavigate={setCurrentScreen}
              />
            )}

            {currentScreen === 'daily_detail' && (
              <DailyDetailScreen
                currentDate={currentDate}
                onNavigate={setCurrentScreen}
              />
            )}

            {currentScreen === 'monthly_calendar' && (
              <MonthlyCalendarScreen
                currentDate={currentDate}
                onDateSelect={setCurrentDate}
                onNavigate={setCurrentScreen}
              />
            )}

            {currentScreen === 'reminders' && (
              <RemindersScreen
                reminders={reminders}
                onToggleComplete={handleToggleReminder}
                onNavigate={setCurrentScreen}
              />
            )}

            {currentScreen === 'add_reminder' && (
              <AddReminderScreen
                onSave={handleAddReminder}
                onNavigate={setCurrentScreen}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onNavigate={setCurrentScreen}
              />
            )}

            {currentScreen === 'search' && (
              <SearchScreen
                onNavigate={setCurrentScreen}
                onSelectEvent={setSelectedEventId}
              />
            )}

            {currentScreen === 'events_list' && (
              <EventsListScreen
                onNavigate={setCurrentScreen}
                onSelectEvent={setSelectedEventId}
              />
            )}

            {currentScreen === 'event_detail' && (
              <EventDetailScreen
                eventId={selectedEventId}
                onNavigate={setCurrentScreen}
              />
            )}
          </div>
        </div>
      </main>

      {/* Slogan Footer */}
      <footer className="mt-3 text-center text-xs text-slate-400 font-medium">
        Lịch Việt – Giữ truyền thống, gần gũi mỗi ngày! | Thiết kế đơn giản – Dễ sử dụng – Phù hợp cho người cao tuổi
      </footer>
    </div>
  );
};
