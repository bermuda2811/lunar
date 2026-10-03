import React, { useState } from 'react';
import { ChevronLeft, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { ReminderIcon } from '../components/ReminderIcon';
import { ScreenType, ReminderItem } from '../types';
import { solarToLunar, lunarToSolar } from '../domain/lunarCalendar';

interface AddReminderScreenProps {
  onSave: (reminder: ReminderItem) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const AddReminderScreen: React.FC<AddReminderScreenProps> = ({
  onSave,
  onNavigate
}) => {
  const [title, setTitle] = useState('');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar' | 'both'>('both');
  const [dateStr, setDateStr] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('yearly');
  const [time, setTime] = useState('all_day');
  const [selectedIcon, setSelectedIcon] = useState<ReminderItem['icon']>('cake');
  const [notes, setNotes] = useState('');

  // Calculate lunar equivalent
  const now = new Date();
  const [year, month, day] = dateStr.split('-').map(n => parseInt(n, 10));
  const lunar = solarToLunar(day || now.getDate(), month || (now.getMonth() + 1), year || now.getFullYear());
  const lunarDisplay = `${lunar.day}/${lunar.month} âm lịch`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên nhắc nhở');
      return;
    }

    const newReminder: ReminderItem = {
      id: 'rem-' + Date.now(),
      title: title.trim(),
      calendarType,
      solarDate: dateStr,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      lunarFormatted: lunarDisplay,
      time,
      repeat,
      remindBeforeDays: 1,
      icon: selectedIcon,
      notes: notes.trim() || undefined,
      isCompleted: false,
      section: 'upcoming'
    };

    onSave(newReminder);
    onNavigate('reminders');
  };

  const iconsList: ReminderItem['icon'][] = ['cake', 'family', 'heart', 'plane', 'star', 'more'];

  return (
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] select-none">
      <StatusBar />

      {/* Screen Header (Khớp Screen 6 Wireframe) */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <button
          onClick={() => onNavigate('reminders')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-base font-bold text-slate-900">
          Thêm nhắc nhở
        </h1>

        <button
          onClick={handleSave}
          className="px-5 py-1.5 rounded-full bg-[#B3261E] text-white text-xs font-bold shadow-md shadow-red-200 active:scale-95 transition-all"
        >
          Lưu
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
        {/* Field 1: Tên nhắc nhở */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Tên nhắc nhở
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Ngày giỗ Ông"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#B3261E] transition-all shadow-xs"
            required
          />
        </div>

        {/* Field 2: Ngày nhắc (Segmented buttons: [Ngày dương] [Ngày âm] [Cả hai]) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Ngày nhắc
          </label>
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setCalendarType('solar')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                calendarType === 'solar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Ngày dương
            </button>
            <button
              type="button"
              onClick={() => setCalendarType('lunar')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                calendarType === 'lunar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Ngày âm
            </button>
            <button
              type="button"
              onClick={() => setCalendarType('both')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                calendarType === 'both'
                  ? 'bg-[#B3261E] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cả hai
            </button>
          </div>
        </div>

        {/* Field 3: Chọn ngày */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Chọn ngày
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#B3261E] transition-all shadow-xs pr-10"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs text-[#B3261E] font-semibold pl-1">
            Quy đổi: {lunarDisplay} (Năm Bính Ngọ)
          </div>
        </div>

        {/* Field 4: Lặp lại */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Lặp lại
          </label>
          <div className="relative">
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#B3261E] transition-all shadow-xs appearance-none pr-10 cursor-pointer"
            >
              <option value="none">Không lặp lại</option>
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="monthly">Hàng tháng</option>
              <option value="yearly">Hàng năm</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 5: Thời gian */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Thời gian
          </label>
          <div className="relative">
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#B3261E] transition-all shadow-xs appearance-none pr-10 cursor-pointer"
            >
              <option value="all_day">Cả ngày</option>
              <option value="07:00">07:00 sáng</option>
              <option value="08:00">08:00 sáng</option>
              <option value="09:00">09:00 sáng</option>
              <option value="12:00">12:00 trưa</option>
              <option value="18:00">18:00 chiều tối</option>
              <option value="20:00">20:00 tối</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 6: Biểu tượng (Row of circular icons - Khớp Wireframe) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Biểu tượng
          </label>
          <div className="flex items-center gap-3 pt-1">
            {iconsList.map((iconKey) => {
              const isSelected = selectedIcon === iconKey;
              return (
                <button
                  type="button"
                  key={iconKey}
                  onClick={() => setSelectedIcon(iconKey)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#B3261E] text-white shadow-md shadow-red-200 scale-105'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <ReminderIcon icon={iconKey} size={20} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 7: Ghi chú (tùy chọn) */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-700">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thêm ghi chú..."
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#B3261E] transition-all shadow-xs resize-none"
          />
        </div>
      </form>
    </div>
  );
};
