import React, { useState, useEffect } from 'react';
import { ReminderItem, AppSettings, UserAccount } from './types';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredUser,
  saveStoredUser,
  getStoredUserReminders,
  saveStoredUserReminders,
  INITIAL_REMINDERS,
} from './storage';
import { CalendarWebApp } from './views/CalendarWebApp';
import { MobileReviewView } from './views/MobileReviewView';

export const App: React.FC = () => {
  // Determine if user is accessing the developer/wireframe review page or the real user web app
  const getInitialViewMode = (): 'app' | 'review' => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path.startsWith('/mobile-review') ||
        path.startsWith('/review') ||
        search.includes('view=mobile') ||
        search.includes('mode=review')
      ) {
        return 'review';
      }
    }
    return 'app';
  };

  const [viewMode, setViewMode] = useState<'app' | 'review'>(getInitialViewMode);
  // Khởi tạo thời gian thực tế của người dùng
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => getStoredUser());
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [selectedEventId, setSelectedEventId] = useState<number>(8);

  // Sync route with browser history (back/forward button support)
  useEffect(() => {
    const handlePopState = () => {
      setViewMode(getInitialViewMode());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load reminders for current user on mount & user change
  useEffect(() => {
    setReminders(getStoredUserReminders(currentUser.id));
  }, [currentUser.id]);

  const navigateViewMode = (mode: 'app' | 'review') => {
    setViewMode(mode);
    const targetUrl = mode === 'review' ? '/mobile-review' : '/';
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    );
    setReminders(updated);
    saveStoredUserReminders(currentUser.id, updated);
  };

  const handleAddReminder = (newRem: ReminderItem) => {
    const updated = [newRem, ...reminders];
    setReminders(updated);
    saveStoredUserReminders(currentUser.id, updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveStoredUserReminders(currentUser.id, updated);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleLoginSuccess = (user: UserAccount, mergeGuestData: boolean) => {
    let nextReminders: ReminderItem[] = [];
    const existingUserReminders = getStoredUserReminders(user.id);

    if (mergeGuestData) {
      const existingTitles = new Set(existingUserReminders.map((r) => r.title.toLowerCase().trim()));
      const toAdd = reminders.filter((r) => !existingTitles.has(r.title.toLowerCase().trim()));
      nextReminders = [...existingUserReminders, ...toAdd];
    } else {
      nextReminders = existingUserReminders.length > 0 ? existingUserReminders : INITIAL_REMINDERS;
    }

    saveStoredUser(user);
    saveStoredUserReminders(user.id, nextReminders);
    setCurrentUser(user);
    setReminders(nextReminders);
  };

  const handleLogout = () => {
    const guestUser: UserAccount = {
      id: 'guest_' + Math.random().toString(36).substring(2, 8) + Date.now(),
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    saveStoredUser(guestUser);
    saveStoredUserReminders(guestUser.id, INITIAL_REMINDERS);
    setCurrentUser(guestUser);
    setReminders(INITIAL_REMINDERS);
  };

  // Dedicated Wireframe & Mobile Simulation Review page
  if (viewMode === 'review') {
    return (
      <MobileReviewView
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        reminders={reminders}
        onToggleReminder={handleToggleReminder}
        onAddReminder={handleAddReminder}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        selectedEventId={selectedEventId}
        onSelectEventId={setSelectedEventId}
        onNavigateToDesktop={() => navigateViewMode('app')}
      />
    );
  }

  // Real-world Web Application (Web PC + Web Mobile)
  return (
    <CalendarWebApp
      currentDate={currentDate}
      onDateChange={setCurrentDate}
      currentUser={currentUser}
      onLoginSuccess={handleLoginSuccess}
      onLogout={handleLogout}
      reminders={reminders}
      onToggleReminder={handleToggleReminder}
      onAddReminder={handleAddReminder}
      onDeleteReminder={handleDeleteReminder}
      settings={settings}
      onUpdateSettings={handleUpdateSettings}
    />
  );
};
