import { ReminderItem, AppSettings, UserAccount } from './types';

const REMINDERS_KEY = 'lich_an_nhien_reminders_v1';
const SETTINGS_KEY = 'lich_an_nhien_settings_v1';
const USER_KEY = 'lich_an_nhien_user_v1';
const USER_REMINDERS_PREFIX = 'lich_an_nhien_reminders_';

// Seed reminders khớp 100% với Screen 5 wireframe
export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Sinh nhật Bà',
    calendarType: 'both',
    solarDate: '2026-09-17',
    lunarDay: 7,
    lunarMonth: 8,
    lunarFormatted: '7/8 âm lịch',
    time: 'all_day',
    repeat: 'yearly',
    remindBeforeDays: 1,
    icon: 'cake',
    notes: 'Mua bánh kem trà xanh và hoa tặng Bà',
    isCompleted: false,
    section: 'upcoming',
  },
  {
    id: 'rem-2',
    title: 'Ngày giỗ Ông',
    calendarType: 'lunar',
    solarDate: '2026-09-25',
    lunarDay: 15,
    lunarMonth: 8,
    lunarFormatted: '15/8 âm lịch',
    time: 'all_day',
    repeat: 'yearly',
    remindBeforeDays: 3,
    icon: 'altar',
    notes: 'Chuẩn bị mâm cúng giỗ truyền thống gia tiên',
    isCompleted: false,
    section: 'upcoming',
  },
  {
    id: 'rem-3',
    title: 'Rằm tháng 8 (Tết Trung Thu)',
    calendarType: 'both',
    solarDate: '2026-09-25',
    lunarDay: 15,
    lunarMonth: 8,
    lunarFormatted: '15/8 âm lịch',
    time: 'all_day',
    repeat: 'yearly',
    remindBeforeDays: 1,
    icon: 'lotus',
    notes: 'Mua bánh nướng bánh dẻo và đèn ông sao cho các cháu',
    isCompleted: false,
    section: 'upcoming',
  },
  {
    id: 'rem-4',
    title: 'Chuyến đi Đà Nẵng',
    calendarType: 'both',
    solarDate: '2026-10-10',
    lunarDay: 30,
    lunarMonth: 8,
    lunarFormatted: '30/8 âm lịch',
    time: 'all_day',
    repeat: 'none',
    remindBeforeDays: 3,
    icon: 'plane',
    notes: 'Chuyến du lịch nghỉ dưỡng gia đình 4 ngày 3 đêm',
    isCompleted: false,
    section: 'upcoming',
  },
  {
    id: 'rem-5',
    title: 'Họp mặt gia đình',
    calendarType: 'both',
    solarDate: '2026-10-02',
    lunarDay: 22,
    lunarMonth: 8,
    lunarFormatted: '22/8 âm lịch',
    time: '18:00',
    repeat: 'monthly',
    remindBeforeDays: 1,
    icon: 'family',
    notes: 'Ăn tối liên hoan sum họp đại gia đình tại nhà chú Ba',
    isCompleted: false,
    section: 'later',
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  notificationsEnabled: true,
  lunarDisplayMode: 'full',
  theme: 'light',
  fontSize: 'large', // Mặc định Lớn cho người cao tuổi theo wireframe Screen 7
  language: 'vi',
};

export function getStoredUser(): UserAccount {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) {
      const guest: UserAccount = {
        id: 'guest_' + Math.random().toString(36).substring(2, 8) + Date.now(),
        isGuest: true,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(USER_KEY, JSON.stringify(guest));
      return guest;
    }
    return JSON.parse(data);
  } catch {
    return {
      id: 'guest_fallback',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
  }
}

export function saveStoredUser(user: UserAccount) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Lỗi lưu tài khoản người dùng:', e);
  }
}

export function getStoredUserReminders(userId: string): ReminderItem[] {
  try {
    const data = localStorage.getItem(USER_REMINDERS_PREFIX + userId);
    if (!data) {
      localStorage.setItem(USER_REMINDERS_PREFIX + userId, JSON.stringify(INITIAL_REMINDERS));
      return INITIAL_REMINDERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_REMINDERS;
  }
}

export function saveStoredUserReminders(userId: string, reminders: ReminderItem[]) {
  try {
    localStorage.setItem(USER_REMINDERS_PREFIX + userId, JSON.stringify(reminders));
  } catch (e) {
    console.error('Lỗi lưu nhắc nhở theo tài khoản:', e);
  }
}

export function getStoredReminders(): ReminderItem[] {
  try {
    const data = localStorage.getItem(REMINDERS_KEY);
    if (!data) {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(INITIAL_REMINDERS));
      return INITIAL_REMINDERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_REMINDERS;
  }
}

export function saveStoredReminders(reminders: ReminderItem[]) {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch (e) {
    console.error('Lỗi lưu nhắc nhở:', e);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Lỗi lưu cài đặt:', e);
  }
}
