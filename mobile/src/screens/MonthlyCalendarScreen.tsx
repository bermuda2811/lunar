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
  Search,
} from 'lucide-react-native';
import { ScreenType } from '../types';
import { solarToLunar, getDayRating, getCanChi } from '../domain/lunarCalendar';
import { BottomTabBar } from '../components/BottomTabBar';

interface MonthlyCalendarScreenProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onNavigate: (screen: ScreenType) => void;
  fontMultiplier?: number;
  bottomInset?: number;
}

interface DayCell {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  lunarDay: number;
  lunarMonth: number;
  isLeap: boolean;
  isGoodDay: boolean;
  hasEvent: boolean;
  isHoliday: boolean;
}

export const MonthlyCalendarScreen: React.FC<MonthlyCalendarScreenProps> = ({
  currentDate,
  onDateSelect,
  onNavigate,
  fontMultiplier = 1,
  bottomInset = 0,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth() + 1);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth() + 1);
    setSelectedDate(now);
    onDateSelect(now);
  };

  const handleCellPress = (cell: DayCell) => {
    const newDate = new Date(cell.year, cell.month - 1, cell.day);
    setSelectedDate(newDate);
    onDateSelect(newDate);
    if (!cell.isCurrentMonth) {
      setViewMonth(cell.month);
      setViewYear(cell.year);
    }
  };

  // Calendar Calculation (Mon = 0, ..., Sun = 6)
  const firstDayOfMonth = new Date(viewYear, viewMonth - 1, 1);
  const totalDaysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();
  const startCol = (firstDayWeekday + 6) % 7;
  const totalDaysPrevMonth = new Date(viewYear, viewMonth - 1, 0).getDate();

  const cells: DayCell[] = [];

  // Trailing previous month days
  for (let i = startCol - 1; i >= 0; i--) {
    const d = totalDaysPrevMonth - i;
    const m = viewMonth === 1 ? 12 : viewMonth - 1;
    const y = viewMonth === 1 ? viewYear - 1 : viewYear;
    const lunar = solarToLunar(d, m, y);
    const canChi = getCanChi(d, m, y, lunar.year, lunar.month);
    const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);
    cells.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isLeap: lunar.isLeap,
      isGoodDay: rating.isGoodDay,
      hasEvent: false,
      isHoliday: false,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const lunar = solarToLunar(d, viewMonth, viewYear);
    const canChi = getCanChi(d, viewMonth, viewYear, lunar.year, lunar.month);
    const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);
    const isSpecialEvent = (viewMonth === 9 && (d === 16 || d === 25)) || lunar.day === 15;
    const isHoliday =
      (viewMonth === 9 && d === 2) ||
      (viewMonth === 1 && d === 1) ||
      (viewMonth === 4 && d === 30) ||
      (viewMonth === 5 && d === 1);

    cells.push({
      day: d,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isLeap: lunar.isLeap,
      isGoodDay: rating.isGoodDay,
      hasEvent: isSpecialEvent,
      isHoliday: isHoliday,
    });
  }

  // Next month leading days
  const remaining = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length > 0 ? 42 - cells.length : 0;
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 12 ? 1 : viewMonth + 1;
    const y = viewMonth === 12 ? viewYear + 1 : viewYear;
    const lunar = solarToLunar(d, m, y);
    const canChi = getCanChi(d, m, y, lunar.year, lunar.month);
    const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);
    cells.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isLeap: lunar.isLeap,
      isGoodDay: rating.isGoodDay,
      hasEvent: false,
      isHoliday: false,
    });
  }

  // Selected date info
  const selDay = selectedDate.getDate();
  const selMonth = selectedDate.getMonth() + 1;
  const selYear = selectedDate.getFullYear();
  const selLunar = solarToLunar(selDay, selMonth, selYear);
  const selCanChi = getCanChi(selDay, selMonth, selYear, selLunar.year, selLunar.month);
  const selRating = getDayRating(selCanChi.dayChiIndex, (selLunar.month + 1) % 12);

  const today = new Date();
  const isToday = (c: DayCell) =>
    c.day === today.getDate() && c.month === today.getMonth() + 1 && c.year === today.getFullYear();
  const isSelected = (c: DayCell) =>
    c.day === selDay && c.month === selMonth && c.year === selYear;

  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.iconButton} activeOpacity={0.7}>
            <ChevronLeft size={22} color="#334155" />
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { fontSize: 16 * fontMultiplier }]}>
            Tháng {viewMonth} năm {viewYear}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.iconButton} activeOpacity={0.7}>
            <ChevronRight size={22} color="#334155" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleToday} style={styles.todayPill} activeOpacity={0.7}>
            <Text style={[styles.todayPillText, { fontSize: 12 * fontMultiplier }]}>Hôm nay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate('search')} style={styles.iconButton} activeOpacity={0.7}>
            <Search size={20} color="#334155" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Weekday Row */}
          <View style={styles.weekdayRow}>
            {weekdays.map((w, idx) => (
              <View key={idx} style={styles.weekdayCell}>
                <Text style={[styles.weekdayText, idx === 6 && styles.sundayText, { fontSize: 13 * fontMultiplier }]}>
                  {w}
                </Text>
              </View>
            ))}
          </View>

          {/* 7x5 or 7x6 Grid */}
          <View style={styles.grid}>
            {cells.map((cell, idx) => {
              const selected = isSelected(cell);
              const currentToday = isToday(cell);

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleCellPress(cell)}
                  activeOpacity={0.7}
                  style={[
                    styles.cell,
                    selected && styles.cellSelected,
                    currentToday && !selected && styles.cellToday,
                  ]}
                >
                  {/* Solar Day */}
                  <Text
                    style={[
                      styles.solarDayText,
                      { fontSize: 14 * fontMultiplier },
                      !cell.isCurrentMonth && styles.textMuted,
                      selected && styles.textWhite,
                      (idx % 7 === 6) && cell.isCurrentMonth && !selected && styles.sundayText,
                    ]}
                  >
                    {cell.day}
                  </Text>

                  {/* Lunar Day */}
                  <Text
                    style={[
                      styles.lunarDayText,
                      { fontSize: 10 * fontMultiplier },
                      !cell.isCurrentMonth && styles.textMutedLight,
                      selected && styles.textWhiteSubtle,
                      (cell.lunarDay === 1 || cell.lunarDay === 15) && !selected && styles.textRed,
                    ]}
                  >
                    {cell.lunarDay === 1
                      ? `${cell.lunarDay}/${cell.lunarMonth}`
                      : cell.lunarDay === 15
                      ? '15'
                      : cell.lunarDay}
                  </Text>

                  {/* Dots Indicator */}
                  <View style={styles.dotsRow}>
                    {cell.isGoodDay && (
                      <View style={[styles.dot, { backgroundColor: selected ? '#FFF' : '#10B981' }]} />
                    )}
                    {cell.hasEvent && (
                      <View style={[styles.dot, { backgroundColor: selected ? '#FEF08A' : '#EF4444' }]} />
                    )}
                    {cell.isHoliday && (
                      <View style={[styles.dot, { backgroundColor: selected ? '#FED7AA' : '#F59E0B' }]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Summary Card */}
        <TouchableOpacity
          onPress={() => onNavigate('daily_detail')}
          activeOpacity={0.8}
          style={styles.summaryCard}
        >
          <View style={styles.summaryHeader}>
            <View>
              <Text style={[styles.summaryDateTitle, { fontSize: 15 * fontMultiplier }]}>
                {selDay} tháng {selMonth} năm {selYear}
              </Text>
              <Text style={[styles.summaryLunarSubtitle, { fontSize: 13 * fontMultiplier }]}>
                {selLunar.day}/{selLunar.month} năm {selCanChi.year}
              </Text>
            </View>
            <View style={styles.detailLink}>
              <Text style={[styles.detailLinkText, { fontSize: 13 * fontMultiplier }]}>
                Xem chi tiết
              </Text>
              <ChevronRight size={16} color="#B3261E" />
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <Text style={[styles.summaryRatingText, { fontSize: 13 * fontMultiplier }]}>
            <Text style={styles.boldText}>
              {selRating.isGoodDay ? 'Ngày tốt: ' : 'Ngày bình thường: '}
            </Text>
            Thích hợp {selRating.suitableFor.slice(0, 3).join(', ')}
          </Text>
        </TouchableOpacity>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.legendText, { fontSize: 12 * fontMultiplier }]}>Ngày tốt</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.legendText, { fontSize: 12 * fontMultiplier }]}>Lễ tết</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.legendText, { fontSize: 12 * fontMultiplier }]}>Sự kiện</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        currentScreen="monthly_calendar"
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayPill: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayPillText: {
    color: '#B3261E',
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  weekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontWeight: '700',
    color: '#475569',
  },
  sundayText: {
    color: '#B3261E',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  cell: {
    width: '14.28%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 2,
  },
  cellSelected: {
    backgroundColor: '#B3261E',
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: '#B3261E',
  },
  solarDayText: {
    fontWeight: '700',
    color: '#1E293B',
  },
  lunarDayText: {
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  textMuted: {
    color: '#CBD5E1',
  },
  textMutedLight: {
    color: '#E2E8F0',
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textWhiteSubtle: {
    color: '#FEE2E2',
  },
  textRed: {
    color: '#B3261E',
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 2,
    height: 4,
    marginTop: 2,
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryDateTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryLunarSubtitle: {
    color: '#B3261E',
    fontWeight: '600',
    marginTop: 2,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailLinkText: {
    fontWeight: '700',
    color: '#B3261E',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  summaryRatingText: {
    color: '#334155',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    color: '#64748B',
    fontWeight: '500',
  },
});
