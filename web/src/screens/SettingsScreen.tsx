import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Calendar,
  Palette,
  Type,
  Globe,
  Info,
  Check,
  User,
  Heart,
  LogOut,
} from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { ScreenType, AppSettings, UserAccount } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onNavigate: (screen: ScreenType) => void;
  currentUser?: UserAccount;
  onLogout?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  const [showModal, setShowModal] = useState<'font' | 'about' | null>(null);

  const isGuest = !currentUser || currentUser.isGuest;

  const toggleNotifications = () => {
    onUpdateSettings({
      ...settings,
      notificationsEnabled: !settings.notificationsEnabled,
    });
  };

  const handleFontSizeChange = (size: AppSettings['fontSize']) => {
    onUpdateSettings({
      ...settings,
      fontSize: size,
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
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700 shrink-0"
          title="Quay lại"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-base font-bold text-slate-900 truncate flex-1 text-center mx-2">
          Tài khoản & Cài đặt
        </h1>

        <div className="w-10 shrink-0"></div>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {/* Profile / Account Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner shrink-0 ${
                  !isGuest ? 'bg-[#B3261E]' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {!isGuest ? (
                  currentUser?.email?.charAt(0).toUpperCase() || 'U'
                ) : (
                  <User className="w-6 h-6 text-slate-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {!isGuest ? currentUser?.email : 'Tài khoản trên máy (Khách)'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">
                  {!isGuest ? '✓ Đã sao lưu dữ liệu đám mây' : 'Dữ liệu chỉ lưu trên trình duyệt này'}
                </div>
              </div>
            </div>

            {!isGuest && onLogout && (
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
                    onLogout();
                  }
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shrink-0"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {isGuest && (
            <button
              onClick={() => onNavigate('auth')}
              className="mt-3 w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-[#B3261E] border border-red-200 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center cursor-pointer leading-relaxed"
            >
              Đăng nhập bằng Email (Sao lưu & Đồng bộ)
            </button>
          )}
        </div>

        {/* Highlight Card: Ủng hộ nhà phát triển */}
        <div
          onClick={() => onNavigate('donate')}
          className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-xs cursor-pointer hover:border-rose-300 transition-all active:scale-[0.99] gap-3"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-[#B3261E] shrink-0">
              <Heart className="w-5 h-5 fill-[#B3261E]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-bold text-[#9F1239] block truncate">
                Ủng hộ nhà phát triển
              </span>
              <span className="text-xs text-[#E11D48] block truncate">
                Mời tách trà ấm duy trì ứng dụng
              </span>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#B3261E] shrink-0" />
        </div>

        {/* 1. Thông báo */}
        <div
          onClick={toggleNotifications}
          className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all gap-3 min-h-[64px]"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#B3261E] shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-900 block truncate">
                Thông báo
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 truncate">
                Nhắc nhở lễ tết, mùng 1, ngày rằm
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <span>{settings.notificationsEnabled ? 'Bật' : 'Tắt'}</span>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* 2. Lịch âm */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all gap-3 min-h-[64px]">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-900 block truncate">
                Lịch âm
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 truncate">
                Chế độ hiển thị thông tin âm lịch
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <span>Hiển thị đầy đủ</span>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* 3. Giao diện */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all gap-3 min-h-[64px]">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-900 block truncate">
                Giao diện
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 truncate">
                Màu nền và độ tương phản
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <span>Sáng ấm</span>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* 4. Cỡ chữ (Phù hợp người cao tuổi) */}
        <div
          onClick={() => setShowModal('font')}
          className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all gap-3 min-h-[64px]"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <Type className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-900 block truncate">
                Cỡ chữ
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 truncate">
                Tối ưu cho người cao tuổi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-[#0F5132] shrink-0 text-right max-w-[42%]">
            <span className="truncate">
              {settings.fontSize === 'extra_large'
                ? 'Rất lớn'
                : settings.fontSize === 'large'
                ? 'Lớn (20px)'
                : 'Tiêu chuẩn'}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* 5. Ngôn ngữ */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all gap-3 min-h-[64px]">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-900 block truncate">
                Ngôn ngữ
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 truncate">
                {settings.language === 'vi' ? 'Tiếng Việt (Mặc định)' : 'English'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <span>Tiếng Việt</span>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* 6. Giới thiệu ứng dụng */}
        <div
          onClick={() => setShowModal('about')}
          className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-slate-300 transition-all gap-3 min-h-[64px]"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-900 block truncate">
                Giới thiệu ứng dụng
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 truncate">
                Phiên bản 1.0.0 (Bính Ngọ 2026)
              </span>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
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
                { id: 'extra_large', label: 'Rất lớn — Dễ đọc nhất (24px)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleFontSizeChange(opt.id as any)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 text-left text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <span className="truncate pr-2">{opt.label}</span>
                  {settings.fontSize === opt.id && <Check className="w-4 h-4 text-[#B3261E] shrink-0" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(null)}
              className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-200 transition-all"
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
              className="w-full py-2.5 bg-[#B3261E] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#8B1D1D] transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
