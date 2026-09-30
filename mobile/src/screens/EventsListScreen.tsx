import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { ScreenType } from '../types';

interface EventsListScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectEvent: (eventId: number) => void;
  fontMultiplier?: number;
}

export const EventsListScreen: React.FC<EventsListScreenProps> = ({
  onNavigate,
  onSelectEvent,
  fontMultiplier = 1,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'vn' | 'intl' | 'lunar'>('all');

  const events = [
    { id: 1, date: '1/1', title: 'Tết Dương lịch', note: '(1 tháng 1)', category: 'vn' },
    { id: 2, date: '26/1', title: 'Tết Nguyên Đán', note: '(29 tháng Chạp)', category: 'vn' },
    { id: 3, date: '5/2', title: 'Rằm tháng Giêng', note: '(15 tháng 1)', category: 'lunar' },
    { id: 4, date: '10/3', title: 'Giỗ Tổ Hùng Vương', note: '(10 tháng 3)', category: 'vn' },
    { id: 5, date: '30/4', title: 'Ngày Giải phóng miền Nam', note: '(30 tháng 4)', category: 'vn' },
    { id: 6, date: '1/5', title: 'Quốc tế Lao động', note: '(1 tháng 5)', category: 'intl' },
    { id: 8, date: '15/8', title: 'Tết Trung Thu', note: '(15 tháng 8 âm)', category: 'lunar' },
    { id: 9, date: '2/9', title: 'Quốc khánh 2/9', note: '(2 tháng 9)', category: 'vn' },
    { id: 10, date: '20/11', title: 'Ngày Nhà giáo VN', note: '(20 tháng 11)', category: 'vn' },
    { id: 11, date: '24/12', title: 'Giáng Sinh', note: '(24 tháng 12)', category: 'intl' },
  ];

  const filteredEvents = events.filter((e) => {
    if (activeTab === 'vn') return e.category === 'vn';
    if (activeTab === 'intl') return e.category === 'intl';
    if (activeTab === 'lunar') return e.category === 'lunar';
    return true;
  });

  const handleItemClick = (id: number) => {
    onSelectEvent(id);
    onNavigate('event_detail');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('daily_overview')}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#334155" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontSize: 16 * fontMultiplier }]}>
          Sự kiện & Ngày lễ
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'vn', label: 'Lễ Việt Nam' },
            { id: 'intl', label: 'Quốc tế' },
            { id: 'lunar', label: 'Âm lịch' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
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
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Events List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredEvents.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleItemClick(item.id)}
            activeOpacity={0.7}
            style={styles.eventCard}
          >
            <View style={styles.eventLeft}>
              <Text style={[styles.eventDate, { fontSize: 15 * fontMultiplier }]}>
                {item.date}
              </Text>
              <Text style={[styles.eventTitle, { fontSize: 14 * fontMultiplier }]}>
                {item.title}
              </Text>
            </View>

            <View style={styles.eventRight}>
              <Text style={[styles.eventNote, { fontSize: 12 * fontMultiplier }]}>
                {item.note}
              </Text>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
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
    padding: 16,
    gap: 10,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  eventLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  eventDate: {
    fontWeight: '900',
    color: '#B3261E',
    minWidth: 44,
  },
  eventTitle: {
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  eventRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventNote: {
    color: '#64748B',
    fontWeight: '500',
  },
});
