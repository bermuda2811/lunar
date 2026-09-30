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
  ChevronRight,
  Search,
  User,
  Star,
  Quote,
} from 'lucide-react-native';
import { ScreenType } from '../types';
import { getFullDayData } from '../domain/lunarCalendar';
import { BottomTabBar } from '../components/BottomTabBar';

interface DailyOverviewScreenProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onNavigate: (screen: ScreenType) => void;
  fontMultiplier?: number;
  bottomInset?: number;
}

export const DailyOverviewScreen: React.FC<DailyOverviewScreenProps> = ({
  currentDate,
  onDateChange,
  onNavigate,
  fontMultiplier = 1,
  bottomInset = 0,
}) => {
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const dayData = getFullDayData(day, month, year);

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handlePrevDay}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#334155" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate('daily_detail')}
          activeOpacity={0.8}
          style={styles.headerDateCenter}
        >
          <Text style={[styles.headerDayOfWeek, { fontSize: 16 * fontMultiplier }]}>
            {dayData.solar.dayOfWeek}
          </Text>
          <Text style={[styles.headerFullDate, { fontSize: 13 * fontMultiplier }]}>
            {day} tháng {month} năm {year}
          </Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => onNavigate('search')}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Search size={20} color="#334155" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onNavigate('settings')}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <User size={20} color="#334155" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2 Big Side-by-Side Cards (Dương lịch & Âm lịch) */}
        <View style={styles.cardsRow}>
          {/* Dương Lịch Card */}
          <TouchableOpacity
            onPress={() => onNavigate('daily_detail')}
            activeOpacity={0.85}
            style={styles.solarCard}
          >
            <Text style={[styles.cardTagSolar, { fontSize: 12 * fontMultiplier }]}>
              DƯƠNG LỊCH
            </Text>
            <Text style={[styles.bigNumberSolar, { fontSize: 58 * fontMultiplier }]}>
              {day}
            </Text>
            <Text style={[styles.monthSolar, { fontSize: 14 * fontMultiplier }]}>
              Tháng {month}
            </Text>
            <Text style={[styles.yearSolar, { fontSize: 12 * fontMultiplier }]}>
              {year}
            </Text>
            <View style={styles.solarBadge}>
              <Text style={[styles.solarBadgeText, { fontSize: 11 * fontMultiplier }]}>
                {dayData.solar.dayOfWeek}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Âm Lịch Card */}
          <TouchableOpacity
            onPress={() => onNavigate('daily_detail')}
            activeOpacity={0.85}
            style={styles.lunarCard}
          >
            <Text style={[styles.cardTagLunar, { fontSize: 12 * fontMultiplier }]}>
              ÂM LỊCH
            </Text>
            <Text style={[styles.bigNumberLunar, { fontSize: 58 * fontMultiplier }]}>
              {dayData.lunar.day}
            </Text>
            <Text style={[styles.monthLunar, { fontSize: 14 * fontMultiplier }]}>
              Tháng {dayData.lunar.month} {dayData.lunar.isLeap ? '(Nhuận)' : ''}
            </Text>
            <Text style={[styles.yearLunar, { fontSize: 12 * fontMultiplier }]}>
              Năm {dayData.canChi.year}
            </Text>
            <View style={styles.canChiBox}>
              <Text style={[styles.canChiText, { fontSize: 11 * fontMultiplier }]}>
                Ngày {dayData.canChi.day}
              </Text>
              <Text style={[styles.canChiText, { fontSize: 11 * fontMultiplier }]}>
                Tháng {dayData.canChi.month}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card Đánh giá ngày */}
        <TouchableOpacity
          onPress={() => onNavigate('daily_detail')}
          activeOpacity={0.8}
          style={styles.infoCard}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.greenIconCircle}>
              <Star size={16} color="#047857" fill="#10B981" />
            </View>
            <View style={styles.cardHeaderTitleBox}>
              <Text style={[styles.boldTitle, { fontSize: 15 * fontMultiplier }]}>
                {dayData.rating.isGoodDay ? 'Tốt' : 'Bình thường'}
              </Text>
              <Text style={[styles.subGreenTitle, { fontSize: 13 * fontMultiplier }]}>
                {dayData.rating.label}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={[styles.bodyText, { fontSize: 13 * fontMultiplier }]}>
            <Text style={styles.boldLabel}>Thích hợp: </Text>
            {dayData.rating.suitableFor.join(', ')}
          </Text>
          <Text style={[styles.bodyText, { fontSize: 13 * fontMultiplier, marginTop: 4 }]}>
            <Text style={styles.boldRedLabel}>Kiêng kỵ: </Text>
            {dayData.rating.avoid.join(', ')}
          </Text>
        </TouchableOpacity>

        {/* Card Sự kiện trong ngày */}
        <TouchableOpacity
          onPress={() => onNavigate('events_list')}
          activeOpacity={0.8}
          style={styles.infoCard}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.amberIconCircle}>
              <Star size={16} color="#D97706" fill="#F59E0B" />
            </View>
            <Text style={[styles.boldTitle, { fontSize: 15 * fontMultiplier }]}>
              Sự kiện trong ngày
            </Text>
          </View>
          <View style={styles.divider} />
          {day === 16 && month === 9 ? (
            <View style={styles.eventList}>
              <View style={styles.eventItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={[styles.eventText, { fontSize: 13 * fontMultiplier }]}>
                  Ngày Quốc tế Bảo vệ Tầng Ozone
                </Text>
              </View>
              <View style={styles.eventItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={[styles.eventText, { fontSize: 13 * fontMultiplier }]}>
                  Rằm tháng 8 (Tết Trung Thu)
                </Text>
              </View>
            </View>
          ) : dayData.lunar.day === 15 ? (
            <View style={styles.eventItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={[styles.eventText, { fontSize: 13 * fontMultiplier }]}>
                Ngày Rằm ({dayData.lunar.day}/{dayData.lunar.month} Âm lịch)
              </Text>
            </View>
          ) : dayData.lunar.day === 1 ? (
            <View style={styles.eventItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={[styles.eventText, { fontSize: 13 * fontMultiplier }]}>
                Mùng một đầu tháng ({dayData.lunar.day}/{dayData.lunar.month} Âm lịch)
              </Text>
            </View>
          ) : (
            <View style={styles.eventItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={[styles.eventTextMuted, { fontSize: 13 * fontMultiplier }]}>
                Ngày bình an, vạn sự thuận lợi
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Card Danh ngôn / Thông điệp ngày */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteIconCircle}>
            <Quote size={16} color="#B3261E" fill="#B3261E" />
          </View>
          <Text style={[styles.quoteText, { fontSize: 13 * fontMultiplier }]}>
            “Trung thu là tết của tình thân, là dịp để gia đình sum vầy.”
          </Text>
        </View>

        {/* Cụm nút điều hướng lớn dành cho Người cao tuổi */}
        <View style={styles.elderlyNavRow}>
          <TouchableOpacity
            onPress={handlePrevDay}
            activeOpacity={0.7}
            style={styles.elderlyBtn}
          >
            <ChevronLeft size={18} color="#334155" />
            <Text style={[styles.elderlyBtnText, { fontSize: 13 * fontMultiplier }]}>
              Ngày trước
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToday}
            activeOpacity={0.7}
            style={styles.todayBtn}
          >
            <Text style={[styles.todayBtnText, { fontSize: 14 * fontMultiplier }]}>
              Hôm nay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextDay}
            activeOpacity={0.7}
            style={styles.elderlyBtn}
          >
            <Text style={[styles.elderlyBtnText, { fontSize: 13 * fontMultiplier }]}>
              Ngày sau
            </Text>
            <ChevronRight size={18} color="#334155" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        currentScreen="daily_overview"
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
  headerDateCenter: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  headerDayOfWeek: {
    fontWeight: '700',
    color: '#1E293B',
  },
  headerFullDate: {
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  solarCard: {
    flex: 1,
    backgroundColor: '#EBF7EE',
    borderWidth: 1,
    borderColor: '#C5E8CE',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTagSolar: {
    fontWeight: '700',
    color: '#146C43',
    letterSpacing: 0.5,
  },
  bigNumberSolar: {
    fontWeight: '900',
    color: '#0F5132',
    lineHeight: 64,
    marginVertical: 2,
  },
  monthSolar: {
    fontWeight: '700',
    color: '#146C43',
  },
  yearSolar: {
    color: '#475569',
    fontWeight: '500',
    marginTop: 2,
  },
  solarBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  solarBadgeText: {
    fontWeight: '700',
    color: '#0F5132',
  },
  lunarCard: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTagLunar: {
    fontWeight: '700',
    color: '#B3261E',
    letterSpacing: 0.5,
  },
  bigNumberLunar: {
    fontWeight: '900',
    color: '#B3261E',
    lineHeight: 64,
    marginVertical: 2,
  },
  monthLunar: {
    fontWeight: '700',
    color: '#9E1B1B',
  },
  yearLunar: {
    color: '#334155',
    fontWeight: '600',
    marginTop: 2,
  },
  canChiBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 6,
    alignItems: 'center',
  },
  canChiText: {
    color: '#475569',
    fontWeight: '600',
    lineHeight: 15,
  },
  infoCard: {
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  greenIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amberIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTitleBox: {
    flex: 1,
  },
  boldTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  subGreenTitle: {
    color: '#047857',
    fontWeight: '600',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  bodyText: {
    color: '#334155',
    lineHeight: 20,
  },
  boldLabel: {
    fontWeight: '700',
    color: '#0F172A',
  },
  boldRedLabel: {
    fontWeight: '700',
    color: '#9E1B1B',
  },
  eventList: {
    gap: 4,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bulletDot: {
    color: '#F59E0B',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 18,
  },
  eventText: {
    color: '#334155',
    fontWeight: '600',
    lineHeight: 18,
  },
  eventTextMuted: {
    color: '#64748B',
    lineHeight: 18,
  },
  quoteCard: {
    backgroundColor: '#FFFBF5',
    borderWidth: 1,
    borderColor: '#EFE5D5',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  quoteIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  quoteText: {
    flex: 1,
    fontStyle: 'italic',
    color: '#334155',
    lineHeight: 20,
    paddingTop: 2,
  },
  elderlyNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  elderlyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  elderlyBtnText: {
    fontWeight: '600',
    color: '#334155',
  },
  todayBtn: {
    backgroundColor: '#B3261E',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#B3261E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  todayBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
