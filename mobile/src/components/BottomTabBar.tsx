import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Calendar, CalendarDays, Bell } from 'lucide-react-native';
import { ScreenType, MainTabType } from '../types';

interface BottomTabBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  fontMultiplier?: number;
  bottomInset?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onNavigate,
  fontMultiplier = 1,
  bottomInset = 0,
}) => {
  let activeTab: MainTabType = 'daily';
  if (currentScreen === 'monthly_calendar') {
    activeTab = 'monthly';
  } else if (currentScreen === 'reminders' || currentScreen === 'add_reminder') {
    activeTab = 'reminders';
  } else {
    activeTab = 'daily';
  }

  const redColor = '#B3261E';
  const inactiveColor = '#64748B';

  return (
    <View style={[styles.container, { paddingBottom: Math.max(bottomInset, 10) }]}>
      {/* 1. Lịch ngày */}
      <TouchableOpacity
        onPress={() => onNavigate('daily_overview')}
        activeOpacity={0.7}
        style={styles.tabItem}
      >
        <Calendar
          size={22}
          color={activeTab === 'daily' ? redColor : inactiveColor}
          strokeWidth={activeTab === 'daily' ? 2.5 : 1.8}
        />
        <Text
          style={[
            styles.tabText,
            { fontSize: 12 * fontMultiplier },
            activeTab === 'daily' ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          Lịch ngày
        </Text>
      </TouchableOpacity>

      {/* 2. Lịch tháng */}
      <TouchableOpacity
        onPress={() => onNavigate('monthly_calendar')}
        activeOpacity={0.7}
        style={styles.tabItem}
      >
        <CalendarDays
          size={22}
          color={activeTab === 'monthly' ? redColor : inactiveColor}
          strokeWidth={activeTab === 'monthly' ? 2.5 : 1.8}
        />
        <Text
          style={[
            styles.tabText,
            { fontSize: 12 * fontMultiplier },
            activeTab === 'monthly' ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          Lịch tháng
        </Text>
      </TouchableOpacity>

      {/* 3. Nhắc nhở */}
      <TouchableOpacity
        onPress={() => onNavigate('reminders')}
        activeOpacity={0.7}
        style={styles.tabItem}
      >
        <Bell
          size={22}
          color={activeTab === 'reminders' ? redColor : inactiveColor}
          strokeWidth={activeTab === 'reminders' ? 2.5 : 1.8}
        />
        <Text
          style={[
            styles.tabText,
            { fontSize: 12 * fontMultiplier },
            activeTab === 'reminders' ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          Nhắc nhở
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    minHeight: 48,
    paddingVertical: 4,
  },
  tabText: {
    marginTop: 4,
    letterSpacing: -0.2,
  },
  tabTextActive: {
    color: '#B3261E',
    fontWeight: '700',
  },
  tabTextInactive: {
    color: '#64748B',
    fontWeight: '500',
  },
});
