import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, StatusBar as RNStatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ScreenType, ReminderItem, AppSettings, UserAccount } from './src/types';
import { SplashScreen } from './src/screens/SplashScreen';
import { DailyOverviewScreen } from './src/screens/DailyOverviewScreen';
import { DailyDetailScreen } from './src/screens/DailyDetailScreen';
import { MonthlyCalendarScreen } from './src/screens/MonthlyCalendarScreen';
import { RemindersScreen } from './src/screens/RemindersScreen';
import { AddReminderScreen } from './src/screens/AddReminderScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { EventsListScreen } from './src/screens/EventsListScreen';
import { EventDetailScreen } from './src/screens/EventDetailScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { DonateScreen } from './src/screens/DonateScreen';

const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: '1',
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
    isCompleted: false,
    section: 'upcoming',
  },
  {
    id: '2',
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
    isCompleted: false,
    section: 'upcoming',
  },
  {
    id: '3',
    title: 'Rằm tháng 8 (Tết Trung Thu)',
    calendarType: 'lunar',
    solarDate: '2026-09-25',
    lunarDay: 15,
    lunarMonth: 8,
    lunarFormatted: '15/8 âm lịch',
    time: 'all_day',
    repeat: 'yearly',
    remindBeforeDays: 1,
    icon: 'lotus',
    isCompleted: false,
    section: 'upcoming',
  },
  {
    id: '4',
    title: 'Chuyến đi Đà Nẵng',
    calendarType: 'solar',
    solarDate: '2026-10-10',
    lunarDay: 30,
    lunarMonth: 8,
    lunarFormatted: '30/8 âm lịch',
    time: 'all_day',
    repeat: 'none',
    remindBeforeDays: 7,
    icon: 'plane',
    isCompleted: false,
    section: 'upcoming',
  },
  {
    id: '5',
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
    isCompleted: false,
    section: 'later',
  },
];

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <MainApp />
    </SafeAreaProvider>
  );
}

function MainApp() {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) : 0
  );
  const bottomInset = insets.bottom;

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('daily_overview');
  // Initialize with 16/9/2026 to match wireframe showcase
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 16));
  const [selectedEventId, setSelectedEventId] = useState<number>(8);

  const [currentUser, setCurrentUser] = useState<UserAccount>({
    id: 'guest_init',
    isGuest: true,
    createdAt: new Date().toISOString(),
  });

  const [settings, setSettings] = useState<AppSettings>({
    notificationsEnabled: true,
    lunarDisplayMode: 'full',
    theme: 'warm',
    fontSize: 'large',
    language: 'vi',
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(DEFAULT_REMINDERS);

  // Initialize Guest Account and load reminders for active user
  useEffect(() => {
    async function initUserAndData() {
      try {
        const storedUserJson = await AsyncStorage.getItem('@user_account');
        let user: UserAccount;
        if (storedUserJson) {
          user = JSON.parse(storedUserJson);
        } else {
          user = {
            id: 'guest_' + Math.random().toString(36).substring(2, 8) + Date.now(),
            isGuest: true,
            createdAt: new Date().toISOString(),
          };
          await AsyncStorage.setItem('@user_account', JSON.stringify(user));
        }
        setCurrentUser(user);

        // Load reminders for this user
        const storedReminders = await AsyncStorage.getItem(`@reminders_${user.id}`);
        if (storedReminders) {
          setReminders(JSON.parse(storedReminders));
        } else {
          // If first time, save default reminders for this account
          await AsyncStorage.setItem(`@reminders_${user.id}`, JSON.stringify(DEFAULT_REMINDERS));
          setReminders(DEFAULT_REMINDERS);
        }
      } catch (err) {
        console.warn('Failed to load user or reminders:', err);
      }
    }
    initUserAndData();
  }, []);

  const handleToggleReminder = async (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    );
    setReminders(updated);
    try {
      await AsyncStorage.setItem(`@reminders_${currentUser.id}`, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleAddReminder = async (newRem: ReminderItem) => {
    const updated = [newRem, ...reminders];
    setReminders(updated);
    try {
      await AsyncStorage.setItem(`@reminders_${currentUser.id}`, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleLoginSuccess = async (user: UserAccount, mergeGuestData: boolean) => {
    try {
      let nextReminders: ReminderItem[] = [];
      const userRemindersJson = await AsyncStorage.getItem(`@reminders_${user.id}`);
      const existingUserReminders: ReminderItem[] = userRemindersJson ? JSON.parse(userRemindersJson) : [];

      if (mergeGuestData) {
        const existingTitles = new Set(existingUserReminders.map((r) => r.title.toLowerCase().trim()));
        const toAdd = reminders.filter((r) => !existingTitles.has(r.title.toLowerCase().trim()));
        nextReminders = [...existingUserReminders, ...toAdd];
      } else {
        nextReminders = existingUserReminders.length > 0 ? existingUserReminders : DEFAULT_REMINDERS;
      }

      await AsyncStorage.setItem('@user_account', JSON.stringify(user));
      await AsyncStorage.setItem(`@reminders_${user.id}`, JSON.stringify(nextReminders));

      setCurrentUser(user);
      setReminders(nextReminders);
    } catch (err) {
      console.warn('Error during login success handler:', err);
    }
  };

  const handleLogout = async () => {
    const guestUser: UserAccount = {
      id: 'guest_' + Math.random().toString(36).substring(2, 8) + Date.now(),
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    try {
      await AsyncStorage.setItem('@user_account', JSON.stringify(guestUser));
      await AsyncStorage.setItem(`@reminders_${guestUser.id}`, JSON.stringify(DEFAULT_REMINDERS));
    } catch (e) {}
    setCurrentUser(guestUser);
    setReminders(DEFAULT_REMINDERS);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const fontMultiplier =
    settings.fontSize === 'extra_large' ? 1.25 : settings.fontSize === 'large' ? 1.12 : 1.0;

  return (
    <View style={[styles.appRoot, { paddingTop: topInset }]}>
      <StatusBar style="dark" />

      {/* Screen Routing */}
      {currentScreen === 'splash' && (
        <SplashScreen
          onFinish={() => setCurrentScreen('daily_overview')}
          fontMultiplier={fontMultiplier}
        />
      )}

      {currentScreen === 'daily_overview' && (
        <DailyOverviewScreen
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onNavigate={setCurrentScreen}
          fontMultiplier={fontMultiplier}
          bottomInset={bottomInset}
        />
      )}

      {currentScreen === 'daily_detail' && (
        <DailyDetailScreen
          currentDate={currentDate}
          onNavigate={setCurrentScreen}
          fontMultiplier={fontMultiplier}
          bottomInset={bottomInset}
        />
      )}

      {currentScreen === 'monthly_calendar' && (
        <MonthlyCalendarScreen
          currentDate={currentDate}
          onDateSelect={setCurrentDate}
          onNavigate={setCurrentScreen}
          fontMultiplier={fontMultiplier}
          bottomInset={bottomInset}
        />
      )}

      {currentScreen === 'reminders' && (
        <RemindersScreen
          reminders={reminders}
          onToggleComplete={handleToggleReminder}
          onNavigate={setCurrentScreen}
          fontMultiplier={fontMultiplier}
          bottomInset={bottomInset}
        />
      )}

      {currentScreen === 'add_reminder' && (
        <AddReminderScreen
          onSave={handleAddReminder}
          onNavigate={setCurrentScreen}
          fontMultiplier={fontMultiplier}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onNavigate={setCurrentScreen}
          currentUser={currentUser}
          onLogout={handleLogout}
          fontMultiplier={fontMultiplier}
        />
      )}

      {currentScreen === 'search' && (
        <SearchScreen
          onNavigate={setCurrentScreen}
          onSelectEvent={setSelectedEventId}
          fontMultiplier={fontMultiplier}
        />
      )}

      {currentScreen === 'events_list' && (
        <EventsListScreen
          onNavigate={setCurrentScreen}
          onSelectEvent={setSelectedEventId}
          fontMultiplier={fontMultiplier}
        />
      )}

      {currentScreen === 'event_detail' && (
        <EventDetailScreen
          eventId={selectedEventId}
          onNavigate={setCurrentScreen}
          fontMultiplier={fontMultiplier}
        />
      )}

      {currentScreen === 'auth' && (
        <AuthScreen
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onNavigate={setCurrentScreen}
          fontMultiplier={fontMultiplier}
        />
      )}

      {currentScreen === 'donate' && (
        <DonateScreen
          onNavigate={setCurrentScreen}
          fontMultiplier={fontMultiplier}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
});
