import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ChevronLeft,
  Search,
  Calendar,
  Moon,
  Clock,
  CircleCheck,
  Ban,
  Star,
  Sun,
  Compass,
} from 'lucide-react-native';
import { ScreenType } from '../types';
import { getFullDayData } from '../domain/lunarCalendar';
import { BottomTabBar } from '../components/BottomTabBar';

interface DailyDetailScreenProps {
  currentDate: Date;
  onNavigate: (screen: ScreenType) => void;
  fontMultiplier?: number;
  bottomInset?: number;
}

export const DailyDetailScreen: React.FC<DailyDetailScreenProps> = ({
  currentDate,
  onNavigate,
  fontMultiplier = 1,
  bottomInset = 0,
}) => {
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const dayData = getFullDayData(day, month, year);

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

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { fontSize: 15 * fontMultiplier }]}>
            {dayData.solar.dayOfWeek}, {day}/{month}/{year}
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: 12 * fontMultiplier }]}>
            {dayData.lunar.day} tháng {dayData.lunar.month} năm {dayData.canChi.year}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onNavigate('search')}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Search size={20} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Toggle View Mode: [Tổng quan] [Chi tiết] */}
      <View style={styles.toggleBar}>
        <TouchableOpacity
          onPress={() => onNavigate('daily_overview')}
          style={styles.toggleItem}
          activeOpacity={0.7}
        >
          <Text style={[styles.toggleText, { fontSize: 13 * fontMultiplier }]}>
            Tổng quan
          </Text>
        </TouchableOpacity>
        <View style={[styles.toggleItem, styles.toggleItemActive]}>
          <Text style={[styles.toggleTextActive, { fontSize: 13 * fontMultiplier }]}>
            Chi tiết
          </Text>
        </View>
      </View>

      {/* Detail Content List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Dương lịch */}
        <View style={styles.detailCard}>
          <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
            <Calendar size={18} color="#047857" />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier }]}>Dương lịch</Text>
            <Text style={[styles.cardValue, { fontSize: 15 * fontMultiplier }]}>
              {day}/{month}/{year} ({dayData.solar.dayOfWeek})
            </Text>
          </View>
        </View>

        {/* 2. Âm lịch */}
        <View style={styles.detailCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Moon size={18} color="#B3261E" />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier }]}>Âm lịch</Text>
            <Text style={[styles.cardValueRed, { fontSize: 15 * fontMultiplier }]}>
              {dayData.lunar.day}/{dayData.lunar.month}/{dayData.canChi.year}
            </Text>
          </View>
        </View>

        {/* 3. Can Chi */}
        <View style={styles.detailCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Compass size={18} color="#B45309" />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier }]}>Can Chi</Text>
            <Text style={[styles.cardValue, { fontSize: 13 * fontMultiplier, lineHeight: 20 }]}>
              Ngày {dayData.canChi.day} - Tháng {dayData.canChi.month} - Năm {dayData.canChi.year}
            </Text>
          </View>
        </View>

        {/* 4. Tiết khí */}
        <View style={styles.detailCard}>
          <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
            <Sun size={18} color="#0369A1" />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier }]}>Tiết khí</Text>
            <Text style={[styles.cardValue, { fontSize: 13 * fontMultiplier }]}>
              {dayData.tietKhi.nextName} (còn {dayData.tietKhi.daysRemaining} ngày)
            </Text>
          </View>
        </View>

        {/* 5. Ngày tốt / xấu */}
        <View style={styles.detailCard}>
          <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
            <Star size={18} color="#047857" fill="#10B981" />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier }]}>Ngày tốt/xấu</Text>
            <Text style={[styles.cardValueGreen, { fontSize: 13 * fontMultiplier }]}>
              {dayData.rating.label}
            </Text>
          </View>
        </View>

        {/* 6. Giờ hoàng đạo */}
        <View style={styles.detailCard}>
          <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
            <Clock size={18} color="#4338CA" />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier, marginBottom: 4 }]}>
              Giờ hoàng đạo
            </Text>
            <View style={styles.hoursWrap}>
              {dayData.auspiciousHours.map((h, i) => (
                <View key={i} style={styles.hourChip}>
                  <Text style={[styles.hourCanChi, { fontSize: 12 * fontMultiplier }]}>
                    {h.canChi}
                  </Text>
                  <Text style={[styles.hourTime, { fontSize: 11 * fontMultiplier }]}>
                    ({h.time})
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 7. Việc nên làm */}
        <View style={styles.detailCard}>
          <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
            <CircleCheck size={18} color="#047857" />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier }]}>Việc nên làm</Text>
            <Text style={[styles.cardValue, { fontSize: 13 * fontMultiplier, lineHeight: 20 }]}>
              {dayData.rating.suitableFor.join(', ')}
            </Text>
          </View>
        </View>

        {/* 8. Việc kiêng kỵ */}
        <View style={styles.detailCard}>
          <View style={[styles.iconBox, { backgroundColor: '#FFE4E6' }]}>
            <Ban size={18} color="#BE123C" />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier }]}>Việc kiêng kỵ</Text>
            <Text style={[styles.cardValueRose, { fontSize: 13 * fontMultiplier, lineHeight: 20 }]}>
              {dayData.rating.avoid.join(', ')}
            </Text>
          </View>
        </View>

        {/* 9. Sự kiện / Ngày lễ */}
        <TouchableOpacity
          onPress={() => onNavigate('events_list')}
          activeOpacity={0.8}
          style={styles.detailCard}
        >
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <Star size={18} color="#D97706" />
          </View>
          <View style={styles.cardTextBox}>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier }]}>Sự kiện / Ngày lễ</Text>
            <Text style={[styles.cardValue, { fontSize: 13 * fontMultiplier, lineHeight: 20 }]}>
              {day === 16 && month === 9
                ? 'Ngày Quốc tế Bảo vệ Tầng Ozone, Rằm tháng 8 (Tết Trung Thu)'
                : dayData.lunar.day === 15
                ? 'Ngày Rằm'
                : dayData.lunar.day === 1
                ? 'Mùng một đầu tháng'
                : 'Ngày bình thường'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        currentScreen="daily_detail"
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 20,
  },
  toggleItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#B3261E',
  },
  toggleText: {
    fontWeight: '600',
    color: '#64748B',
  },
  toggleTextActive: {
    fontWeight: '700',
    color: '#B3261E',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardTextBox: {
    flex: 1,
  },
  cardLabel: {
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 2,
  },
  cardValue: {
    fontWeight: '700',
    color: '#1E293B',
  },
  cardValueRed: {
    fontWeight: '700',
    color: '#B3261E',
  },
  cardValueGreen: {
    fontWeight: '700',
    color: '#047857',
  },
  cardValueRose: {
    fontWeight: '600',
    color: '#BE123C',
  },
  hoursWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  hourChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hourCanChi: {
    fontWeight: '700',
    color: '#312E81',
  },
  hourTime: {
    color: '#64748B',
  },
});
