import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Plus,
  Check,
  Clock,
} from 'lucide-react-native';
import { ScreenType, ReminderItem } from '../types';
import { ReminderIcon } from '../components/ReminderIcon';
import { BottomTabBar } from '../components/BottomTabBar';

interface RemindersScreenProps {
  reminders: ReminderItem[];
  onToggleComplete: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
  fontMultiplier?: number;
  bottomInset?: number;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({
  reminders,
  onToggleComplete,
  onNavigate,
  fontMultiplier = 1,
  bottomInset = 0,
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'upcoming') return !r.isCompleted;
    if (filter === 'completed') return r.isCompleted;
    return true;
  });

  const upcomingList = filteredReminders.filter((r) => r.section === 'upcoming');
  const laterList = filteredReminders.filter((r) => r.section === 'later');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: 20 * fontMultiplier }]}>
          Nhắc nhở
        </Text>

        <TouchableOpacity
          onPress={() => onNavigate('add_reminder')}
          activeOpacity={0.7}
          style={styles.addBtn}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips: [Tất cả] [Sắp tới] [Đã hoàn thành] */}
      <View style={styles.filterBar}>
        {(['all', 'upcoming', 'completed'] as const).map((tab) => {
          const label = tab === 'all' ? 'Tất cả' : tab === 'upcoming' ? 'Sắp tới' : 'Đã hoàn thành';
          const isActive = filter === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              activeOpacity={0.7}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                  { fontSize: 13 * fontMultiplier },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Reminders List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section: Sắp tới */}
        {upcomingList.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: 12 * fontMultiplier }]}>
              SẮP TỚI
            </Text>
            <View style={styles.itemsList}>
              {upcomingList.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.reminderCard,
                    item.isCompleted && styles.reminderCardCompleted,
                  ]}
                >
                  <View style={styles.iconCircle}>
                    <ReminderIcon icon={item.icon} size={22} color="#B3261E" />
                  </View>

                  <View style={styles.detailsBox}>
                    <Text
                      style={[
                        styles.reminderTitle,
                        item.isCompleted && styles.reminderTitleCompleted,
                        { fontSize: 14 * fontMultiplier },
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={[styles.reminderDate, { fontSize: 12 * fontMultiplier }]}>
                      {item.solarDate.split('-').reverse().join('/')} ({item.lunarFormatted})
                    </Text>
                    <View style={styles.timeRow}>
                      <Clock size={12} color="#94A3B8" />
                      <Text style={[styles.timeText, { fontSize: 11 * fontMultiplier }]}>
                        {item.time === 'all_day' ? 'Cả ngày' : item.time}
                      </Text>
                    </View>
                  </View>

                  {/* Checkbox */}
                  <TouchableOpacity
                    onPress={() => onToggleComplete(item.id)}
                    activeOpacity={0.7}
                    style={[
                      styles.checkbox,
                      item.isCompleted && styles.checkboxActive,
                    ]}
                  >
                    {item.isCompleted && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Section: Sau này */}
        {laterList.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: 12 * fontMultiplier }]}>
              SAU NÀY
            </Text>
            <View style={styles.itemsList}>
              {laterList.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.reminderCard,
                    item.isCompleted && styles.reminderCardCompleted,
                  ]}
                >
                  <View style={styles.iconCircle}>
                    <ReminderIcon icon={item.icon} size={22} color="#B3261E" />
                  </View>

                  <View style={styles.detailsBox}>
                    <Text
                      style={[
                        styles.reminderTitle,
                        item.isCompleted && styles.reminderTitleCompleted,
                        { fontSize: 14 * fontMultiplier },
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={[styles.reminderDate, { fontSize: 12 * fontMultiplier }]}>
                      {item.solarDate.split('-').reverse().join('/')} ({item.lunarFormatted})
                    </Text>
                    <View style={styles.timeRow}>
                      <Clock size={12} color="#94A3B8" />
                      <Text style={[styles.timeText, { fontSize: 11 * fontMultiplier }]}>
                        {item.time === 'all_day' ? 'Cả ngày' : item.time}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => onToggleComplete(item.id)}
                    activeOpacity={0.7}
                    style={[
                      styles.checkbox,
                      item.isCompleted && styles.checkboxActive,
                    ]}
                  >
                    {item.isCompleted && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {filteredReminders.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { fontSize: 14 * fontMultiplier }]}>
              Không có nhắc nhở nào trong mục này
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        currentScreen="reminders"
        onNavigate={onNavigate}
        fontMultiplier={fontMultiplier}
        bottomInset={bottomInset}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#B3261E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B3261E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  filterChipText: {
    color: '#64748B',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#B3261E',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  itemsList: {
    gap: 10,
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  reminderCardCompleted: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBox: {
    flex: 1,
  },
  reminderTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  reminderTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  reminderDate: {
    color: '#475569',
    fontWeight: '500',
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  timeText: {
    color: '#94A3B8',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#B3261E',
    borderColor: '#B3261E',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#94A3B8',
  },
});
