import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell, Calendar, Palette, Type, Globe, Info, Check } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { ScreenType, AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onNavigate
}) => {
  const [showModal, setShowModal] = useState<'font' | 'about' | null>(null);

  const toggleNotifications = () => {
    onUpdateSettings({
      ...settings,
      notificationsEnabled: !settings.notificationsEnabled
    });
  };

  const handleFontSizeChange = (size: AppSettings['fontSize']) => {
    onUpdateSettings({
      ...settings,
      fontSize: size
    });
    setShowModal(null);
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
          Cài đặt
        </h1>

        <div className="w-10"></div>
      </div>

      {/* Settings List (Khớp 100% Screen 7 Wireframe) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar">
        {/* 1. Thông báo */}
        <div
          onClick={toggleNotifications}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#B3261E]">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Thông báo
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>{settings.notificationsEnabled ? 'Bật' : 'Tắt'}</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 2. Lịch âm */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Lịch âm
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>Hiển thị đầy đủ</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 3. Giao diện */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
              <Palette className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Giao diện
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>Sáng ấm</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 4. Cỡ chữ (Phù hợp người cao tuổi) */}
        <div
          onClick={() => setShowModal('font')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Type className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Cỡ chữ
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F5132] max-w-[180px] text-right">
            <span className="truncate">Lớn (phù hợp người cao tuổi)</span>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* 5. Ngôn ngữ */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Ngôn ngữ
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>Tiếng Việt</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 6. Giới thiệu ứng dụng */}
        <div
          onClick={() => setShowModal('about')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Info className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Giới thiệu ứng dụng
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Font Size Modal */}
      {showModal === 'font' && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Chọn cỡ chữ</h3>
            <div className="space-y-2">
              {[
                { id: 'standard', label: 'Tiêu chuẩn (16px)' },
                { id: 'large', label: 'Lớn — Phù hợp người cao tuổi (20px)' },
                { id: 'extra_large', label: 'Rất lớn — Dễ đọc nhất (24px)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleFontSizeChange(opt.id as any)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 text-left text-xs font-semibold text-slate-800"
                >
                  <span>{opt.label}</span>
                  {settings.fontSize === opt.id && <Check className="w-4 h-4 text-[#B3261E]" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(null)}
              className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showModal === 'about' && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#B3261E] text-white flex items-center justify-center mx-auto text-2xl font-black">
              L
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Lịch An Nhiên (Lịch Việt)</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Phiên bản 1.0.0 (Bính Ngọ 2026)</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-serif">
              &ldquo;Giữ truyền thống, gần gũi mỗi ngày! Thiết kế đơn giản – Dễ sử dụng – Phù hợp cho người cao tuổi.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              Thuật toán thiên văn chuẩn Hồ Ngọc Đức (UTC+7)
            </div>
            <button
              onClick={() => setShowModal(null)}
              className="w-full py-2.5 bg-[#B3261E] text-white rounded-xl text-xs font-bold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
