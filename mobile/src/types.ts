export type ScreenType =
  | 'splash'
  | 'daily_overview'
  | 'daily_detail'
  | 'monthly_calendar'
  | 'reminders'
  | 'add_reminder'
  | 'settings'
  | 'search'
  | 'events_list'
  | 'event_detail'
  | 'auth'
  | 'donate';

export interface UserAccount {
  id: string; // guest_xxxx or user_xxxx
  email?: string;
  isGuest: boolean;
  name?: string;
  avatar?: string;
  authProvider?: string;
  role?: string;
  status?: string;
  createdAt: string;
}

export interface DonationInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  momoPhone?: string;
  note: string;
}

export interface DonationConfig {
  id?: number;
  bankBin: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrTemplate: string;
  customQrUrl?: string | null;
  suggestedAmounts: number[];
  momoPhone?: string;
  momoName?: string;
  transferSyntax: string;
  thankYouMessage: string;
  isActive: boolean;
  defaultVietQrUrl: string;
}

export interface DonationTransaction {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  sender_name: string;
  sender_email?: string;
  message?: string;
  is_anonymous: number;
  created_at: string;
  completed_at?: string;
}

export type MainTabType = 'daily' | 'monthly' | 'reminders';

export interface ReminderItem {
  id: string;
  title: string;
  calendarType: 'solar' | 'lunar' | 'both';
  solarDate: string; // YYYY-MM-DD
  lunarDay: number;
  lunarMonth: number;
  lunarYear?: number;
  lunarFormatted?: string;
  time: string; // "all_day" or "18:00"
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  remindBeforeDays: number;
  icon: 'cake' | 'altar' | 'lotus' | 'plane' | 'family' | 'heart' | 'star' | 'more';
  notes?: string;
  isCompleted: boolean;
  section: 'upcoming' | 'later';
}

export interface AppSettings {
  notificationsEnabled: boolean;
  lunarDisplayMode: 'full' | 'basic' | 'date_only';
  theme: 'warm' | 'white' | 'dark';
  fontSize: 'standard' | 'large' | 'extra_large';
  language: 'vi' | 'en';
}

export interface CalendarEvent {
  id: number;
  title: string;
  calendar_type: 'solar' | 'lunar';
  day: number;
  month: number;
  category: string;
  status: string;
  summary?: string;
  meaning?: string;
  traditions?: string;
  image_url?: string;
}
