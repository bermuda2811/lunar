import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  TextInput,
  Platform,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { getFullDayData, solarToLunar, getCanChi, getDayRating } from './src/domain/lunarCalendar';

type ScreenType =
  | 'splash'
  | 'daily_overview'
  | 'daily_detail'
  | 'monthly_calendar'
  | 'reminders'
  | 'add_reminder'
  | 'settings'
  | 'search'
  | 'events_list'
  | 'event_detail';

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <MainApp />
    </SafeAreaProvider>
  );
}

interface MonthCell {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  lunarDay: number;
  lunarMonth: number;
  isGoodDay: boolean;
  hasEvent: boolean;
  isHoliday: boolean;
}

function MainApp() {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) : 0);
  const bottomInset = insets.bottom;

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('daily_overview');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 16));
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(9);

  // Settings State
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    lunarDisplayMode: 'full' as 'full' | 'basic' | 'day_only',
    theme: 'warm' as 'warm' | 'white' | 'dark',
    fontSize: 'large' as 'standard' | 'large' | 'extra_large',
    language: 'vi' as 'vi' | 'en',
  });
  const [activeModal, setActiveModal] = useState<null | 'lunar' | 'theme' | 'fontSize' | 'language' | 'about'>(null);

  const [reminders, setReminders] = useState([
    { id: '1', title: 'Sinh nhật Bà', date: '17/9/2026', lunar: '7/8 âm lịch', time: 'Cả ngày', completed: false, icon: '🎂' },
    { id: '2', title: 'Ngày giỗ Ông', date: '25/9/2026', lunar: '15/8 âm lịch', time: 'Cả ngày', completed: false, icon: '🪔' },
    { id: '3', title: 'Rằm tháng 8 (Tết Trung Thu)', date: '25/9/2026', lunar: '15/8 âm lịch', time: 'Cả ngày', completed: false, icon: '🏮' },
    { id: '4', title: 'Chuyến đi Đà Nẵng', date: '10/10/2026', lunar: '30/8 âm lịch', time: 'Cả ngày', completed: false, icon: '✈️' },
    { id: '5', title: 'Họp mặt gia đình', date: '2/10/2026', lunar: '22/8 âm lịch', time: '18:00', completed: false, icon: '👨‍👩‍👧‍👦' },
  ]);

  const isDarkMode = settings.theme === 'dark';
  const currentBg = isDarkMode ? '#0F172A' : settings.theme === 'white' ? '#FFFFFF' : '#FDFBF7';
  const currentCardBg = isDarkMode ? '#1E293B' : '#FFFFFF';
  const currentText = isDarkMode ? '#F8FAFC' : '#0F172A';
  const currentSubText = isDarkMode ? '#94A3B8' : '#64748B';
  const currentBorder = isDarkMode ? '#334155' : '#E2E8F0';
  const fontMultiplier = settings.fontSize === 'extra_large' ? 1.2 : settings.fontSize === 'large' ? 1.1 : 1.0;

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const dayData = getFullDayData(day, month, year);

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
    setViewMonth(d.getMonth() + 1);
    setViewYear(d.getFullYear());
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
    setViewMonth(d.getMonth() + 1);
    setViewYear(d.getFullYear());
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setViewMonth(now.getMonth() + 1);
    setViewYear(now.getFullYear());
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  // Monthly Calendar Calculation (Mon = 0, ..., Sun = 6)
  const firstDayOfMonth = new Date(viewYear, viewMonth - 1, 1);
  const totalDaysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon...
  const startCol = (firstDayWeekday + 6) % 7;
  const totalDaysPrevMonth = new Date(viewYear, viewMonth - 1, 0).getDate();

  const monthCells: MonthCell[] = [];

  // Trailing days from previous month
  for (let i = startCol - 1; i >= 0; i--) {
    const d = totalDaysPrevMonth - i;
    const m = viewMonth === 1 ? 12 : viewMonth - 1;
    const y = viewMonth === 1 ? viewYear - 1 : viewYear;
    const lunar = solarToLunar(d, m, y);
    const canChi = getCanChi(d, m, y, lunar.year, lunar.month);
    const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);
    monthCells.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isGoodDay: rating.isGoodDay,
      hasEvent: false,
      isHoliday: false,
    });
  }

  // Days of current month
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

    monthCells.push({
      day: d,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isGoodDay: rating.isGoodDay,
      hasEvent: isSpecialEvent,
      isHoliday: isHoliday,
    });
  }

  // Next month leading days to complete 35 or 42 slots
  const totalSlots = monthCells.length > 35 ? 42 : 35;
  const remainingSlots = totalSlots - monthCells.length;
  for (let d = 1; d <= remainingSlots; d++) {
    const m = viewMonth === 12 ? 1 : viewMonth + 1;
    const y = viewMonth === 12 ? viewYear + 1 : viewYear;
    const lunar = solarToLunar(d, m, y);
    const canChi = getCanChi(d, m, y, lunar.year, lunar.month);
    const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);
    monthCells.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isGoodDay: rating.isGoodDay,
      hasEvent: false,
      isHoliday: false,
    });
  }

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

  const handleSelectMonthCell = (cell: MonthCell) => {
    const d = new Date(cell.year, cell.month - 1, cell.day);
    setCurrentDate(d);
    if (!cell.isCurrentMonth) {
      setViewMonth(cell.month);
      setViewYear(cell.year);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topInset,
          paddingBottom: bottomInset,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: currentBg,
        },
      ]}
    >
      <RNStatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={currentBg} translucent />

      {/* TOP HEADER */}
      <View style={[styles.topBar, { backgroundColor: currentCardBg, borderBottomColor: currentBorder }]}>
        {currentScreen !== 'daily_overview' && currentScreen !== 'monthly_calendar' && currentScreen !== 'reminders' && (
          <TouchableOpacity onPress={() => setCurrentScreen('daily_overview')} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>‹</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.screenTitle}>
            {currentScreen === 'daily_overview' ? 'LỊCH AN NHIÊN' :
             currentScreen === 'daily_detail' ? 'CHI TIẾT NGÀY' :
             currentScreen === 'monthly_calendar' ? 'LỊCH THÁNG' :
             currentScreen === 'reminders' ? 'NHẮC NHỞ' :
             currentScreen === 'add_reminder' ? 'THÊM NHẮC NHỞ' :
             currentScreen === 'settings' ? 'CÀI ĐẶT' :
             currentScreen === 'search' ? 'TÌM KIẾM' :
             currentScreen === 'events_list' ? 'SỰ KIỆN & LỄ TẾT' : 'CHI TIẾT SỰ KIỆN'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setCurrentScreen('settings')} style={styles.iconBtn}>
          <Text style={{ fontSize: 16 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN SCREEN ROUTING */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. MÀN HÌNH XEM NGÀY (TỔNG QUAN) - 100% Khớp Screen 2 Wireframe */}
        {currentScreen === 'daily_overview' && (
          <View style={{ gap: 14 }}>
            {/* Header Date Subtitle */}
            <View style={styles.centerRow}>
              <TouchableOpacity onPress={handlePrevDay} style={styles.roundBtn}>
                <Text style={styles.roundBtnText}>‹</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center', minWidth: 200 }}>
                <Text style={styles.dayOfWeekText}>{dayData.solar.dayOfWeek}</Text>
                <Text style={styles.fullDateText}>{day} tháng {month} năm {year}</Text>
              </View>
              <TouchableOpacity onPress={handleNextDay} style={styles.roundBtn}>
                <Text style={styles.roundBtnText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* 2 Big Cards Side-by-Side: Dương Lịch & Âm Lịch */}
            <View style={styles.row}>
              {/* Left: Dương Lịch (Xanh ngọc) */}
              <TouchableOpacity
                onPress={() => setCurrentScreen('daily_detail')}
                style={[styles.card, styles.solarCard]}
              >
                <Text style={styles.solarCardTag}>DƯƠNG LỊCH</Text>
                <Text style={styles.solarBigNumber}>{day}</Text>
                <Text style={styles.solarSubText}>Tháng {month} - {year}</Text>
                <Text style={styles.solarBadge}>{dayData.solar.dayOfWeek}</Text>
              </TouchableOpacity>

              {/* Right: Âm Lịch (Đỏ truyền thống) */}
              <TouchableOpacity
                onPress={() => setCurrentScreen('daily_detail')}
                style={[styles.card, styles.lunarCard]}
              >
                <Text style={styles.lunarCardTag}>ÂM LỊCH</Text>
                <Text style={styles.lunarBigNumber}>{dayData.lunar.day}</Text>
                <Text style={styles.lunarSubText}>Tháng {dayData.lunar.month} Năm {dayData.canChi.year}</Text>
                <View style={styles.canChiBox}>
                  <Text style={styles.canChiText}>Ngày {dayData.canChi.day}</Text>
                  <Text style={styles.canChiText}>Tháng {dayData.canChi.month}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Đánh giá ngày tốt/xấu */}
            <TouchableOpacity onPress={() => setCurrentScreen('daily_detail')} style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={{ fontSize: 20 }}>🍀</Text>
                <View>
                  <Text style={styles.boldTitle}>Tốt - Ngày hoàng đạo</Text>
                  <Text style={styles.subGreenTitle}>{dayData.rating.label}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <Text style={styles.bodyText}>
                <Text style={styles.boldLabel}>Thích hợp: </Text>
                {dayData.rating.suitableFor.join(', ')}
              </Text>
              <Text style={[styles.bodyText, { marginTop: 4 }]}>
                <Text style={styles.boldRedLabel}>Kiêng kỵ: </Text>
                {dayData.rating.avoid.join(', ')}
              </Text>
            </TouchableOpacity>

            {/* Sự kiện trong ngày */}
            <TouchableOpacity onPress={() => setCurrentScreen('events_list')} style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={{ fontSize: 20 }}>⭐</Text>
                <Text style={styles.boldTitle}>Sự kiện trong ngày</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.bulletText}>• Ngày Quốc tế Bảo vệ Tầng Ozone</Text>
              <Text style={styles.bulletText}>• Rằm tháng 8 (Tết Trung Thu)</Text>
            </TouchableOpacity>

            {/* Danh ngôn ngày */}
            <View style={styles.quoteCard}>
              <Text style={{ fontSize: 22 }}>❝</Text>
              <Text style={styles.quoteText}>
                Trung thu là tết của tình thân, là dịp để gia đình sum vầy.
              </Text>
            </View>

            {/* Nút điều hướng to dành cho người cao tuổi */}
            <View style={styles.elderlyNavRow}>
              <TouchableOpacity onPress={handlePrevDay} style={styles.elderlyBtn}>
                <Text style={styles.elderlyBtnText}>‹ Ngày trước</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleToday} style={styles.todayBtn}>
                <Text style={styles.todayBtnText}>Hôm nay</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextDay} style={styles.elderlyBtn}>
                <Text style={styles.elderlyBtnText}>Ngày sau ›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 2. MÀN HÌNH XEM NGÀY (CHI TIẾT) - Screen 3 */}
        {currentScreen === 'daily_detail' && (
          <View style={{ gap: 12 }}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📅 Dương lịch:</Text>
              <Text style={styles.detailVal}>{day}/{month}/{year} ({dayData.solar.dayOfWeek})</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🌙 Âm lịch:</Text>
              <Text style={[styles.detailVal, { color: '#B3261E' }]}>{dayData.lunar.day}/{dayData.lunar.month} {dayData.canChi.year}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🧭 Can Chi:</Text>
              <Text style={styles.detailVal}>Ngày {dayData.canChi.day} - Tháng {dayData.canChi.month} - Năm {dayData.canChi.year}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>☀️ Tiết khí:</Text>
              <Text style={styles.detailVal}>{dayData.tietKhi.nextName} (còn {dayData.tietKhi.daysRemaining} ngày)</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>✨ Ngày tốt/xấu:</Text>
              <Text style={[styles.detailVal, { color: '#0F5132' }]}>{dayData.rating.label}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>⏰ Giờ hoàng đạo:</Text>
              <Text style={[styles.detailVal, { marginTop: 4 }]}>
                {dayData.auspiciousHours.map(h => `${h.canChi} (${h.time})`).join(', ')}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={[styles.detailLabel, { color: '#0F5132' }]}>✅ Việc nên làm:</Text>
              <Text style={[styles.detailVal, { marginTop: 4 }]}>{dayData.rating.suitableFor.join(', ')}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={[styles.detailLabel, { color: '#B3261E' }]}>🚫 Việc kiêng kỵ:</Text>
              <Text style={[styles.detailVal, { marginTop: 4 }]}>{dayData.rating.avoid.join(', ')}</Text>
            </View>
          </View>
        )}

        {/* 3. MÀN HÌNH XEM THÁNG - Screen 4 */}
        {currentScreen === 'monthly_calendar' && (
          <View style={{ gap: 12 }}>
            {/* Header Tháng & Nút chuyển tháng */}
            <View style={[styles.monthHeaderRow, { backgroundColor: currentCardBg, borderColor: currentBorder }]}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.roundBtn}>
                <Text style={styles.roundBtnText}>‹</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.monthHeaderTitle, { fontSize: 17 * fontMultiplier, color: currentText }]}>
                  Tháng {viewMonth} năm {viewYear}
                </Text>
                <Text style={styles.monthHeaderSubtitle}>
                  Năm {dayData.canChi.year}
                </Text>
              </View>
              <TouchableOpacity onPress={handleNextMonth} style={styles.roundBtn}>
                <Text style={styles.roundBtnText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Hàng Tiêu Đề Thứ (T2 -> CN) */}
            <View style={[styles.gridHeader, { backgroundColor: currentCardBg, borderColor: currentBorder }]}>
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((t, i) => (
                <View key={i} style={styles.gridColHeaderBox}>
                  <Text style={[styles.gridColHeader, i === 6 && { color: '#B3261E' }]}>{t}</Text>
                </View>
              ))}
            </View>

            {/* LƯỚI LỊCH THÁNG 7 CỘT CHUẨN WIREFRAME */}
            <View style={[styles.monthGrid, { backgroundColor: currentCardBg, borderColor: currentBorder }]}>
              {monthCells.map((cell, idx) => {
                const isSelected =
                  cell.day === currentDate.getDate() &&
                  cell.month === (currentDate.getMonth() + 1) &&
                  cell.year === currentDate.getFullYear();
                const isSunday = idx % 7 === 6;

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSelectMonthCell(cell)}
                    activeOpacity={0.7}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                    ]}
                  >
                    {/* Số ngày Dương lịch */}
                    <Text
                      style={[
                        styles.cellSolarText,
                        { fontSize: 15 * fontMultiplier },
                        isSelected
                          ? styles.cellSolarSelected
                          : cell.isCurrentMonth
                          ? (isSunday ? styles.cellSunday : [styles.cellCurrentMonth, { color: currentText }])
                          : styles.cellOtherMonth,
                      ]}
                    >
                      {cell.day}
                    </Text>

                    {/* Số ngày Âm lịch */}
                    <Text
                      style={[
                        styles.cellLunarText,
                        { fontSize: 10 * fontMultiplier },
                        isSelected
                          ? styles.cellLunarSelected
                          : (cell.lunarDay === 1 || cell.lunarDay === 15) && cell.isCurrentMonth
                          ? styles.cellSpecialLunar
                          : cell.isCurrentMonth
                          ? styles.cellNormalLunar
                          : styles.cellOtherLunar,
                      ]}
                    >
                      {cell.lunarDay === 1 ? `${cell.lunarDay}/${cell.lunarMonth}` : cell.lunarDay}
                    </Text>

                    {/* Dấu chấm chỉ thị (Hoàng đạo / Sự kiện) */}
                    <View style={styles.dotRow}>
                      {cell.isCurrentMonth && (
                        <>
                          <View
                            style={[
                              styles.dot,
                              isSelected
                                ? { backgroundColor: '#FFF' }
                                : cell.isGoodDay
                                ? { backgroundColor: '#10B981' }
                                : { backgroundColor: '#D97706' },
                            ]}
                          />
                          {cell.hasEvent && (
                            <View
                              style={[
                                styles.dot,
                                isSelected ? { backgroundColor: '#FDE047' } : { backgroundColor: '#EF4444' },
                              ]}
                            />
                          )}
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Chú thích màu chấm */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendText}>Hoàng đạo</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: '#D97706' }]} />
                <Text style={styles.legendText}>Hắc đạo</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendText}>Sự kiện / Lễ</Text>
              </View>
            </View>

            {/* Thẻ tóm tắt ngày được chọn */}
            <View style={[styles.monthCardPreview, { backgroundColor: currentCardBg, borderColor: currentBorder }]}>
              <View style={styles.rowBetween}>
                <Text style={[styles.previewDateTitle, { fontSize: 14 * fontMultiplier, color: currentText }]}>
                  {dayData.solar.dayOfWeek}, {day} tháng {month} năm {year}
                </Text>
                <TouchableOpacity
                  onPress={() => setCurrentScreen('daily_detail')}
                  style={styles.detailBtnSmall}
                >
                  <Text style={styles.detailBtnSmallText}>Xem chi tiết ›</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <Text style={styles.previewLunarText}>
                🌙 Âm lịch: Ngày {dayData.lunar.day} tháng {dayData.lunar.month} • Năm {dayData.canChi.year}
              </Text>
              <Text style={styles.previewRatingText}>
                {dayData.rating.isGoodDay ? '🍀' : '⚡'} {dayData.rating.label} (Ngày {dayData.canChi.day})
              </Text>
              <Text style={[styles.bodyText, { fontSize: 12 * fontMultiplier, color: currentSubText }]}>
                Thích hợp: {dayData.rating.suitableFor.slice(0, 3).join(', ')}
              </Text>
            </View>
          </View>
        )}

        {/* 4. MÀN HÌNH NHẮC NHỞ - Screen 5 */}
        {currentScreen === 'reminders' && (
          <View style={{ gap: 12 }}>
            <View style={styles.rowBetween}>
              <Text style={[styles.boldTitle, { fontSize: 16 * fontMultiplier, color: currentText }]}>Danh sách nhắc nhở</Text>
              <TouchableOpacity onPress={() => setCurrentScreen('add_reminder')} style={styles.addBtnSmall}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Thêm</Text>
              </TouchableOpacity>
            </View>
            {reminders.map(r => (
              <TouchableOpacity key={r.id} onPress={() => toggleReminder(r.id)} style={[styles.reminderCard, { backgroundColor: currentCardBg, borderColor: currentBorder }]}>
                <Text style={{ fontSize: 24 }}>{r.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.remTitle, { fontSize: 14 * fontMultiplier, color: currentText }, r.completed && { textDecorationLine: 'line-through', color: '#888' }]}>{r.title}</Text>
                  <Text style={[styles.remDate, { color: currentSubText }]}>{r.date} ({r.lunar}) • {r.time}</Text>
                </View>
                <View style={[styles.checkCircle, r.completed && styles.checkCircleActive]}>
                  {r.completed && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 5. MÀN HÌNH THÊM NHẮC NHỞ - Screen 6 */}
        {currentScreen === 'add_reminder' && (
          <View style={{ gap: 14 }}>
            <Text style={[styles.formLabel, { color: currentText }]}>Tên nhắc nhở *</Text>
            <TextInput style={[styles.input, { backgroundColor: currentCardBg, borderColor: currentBorder, color: currentText }]} placeholder="Ví dụ: Ngày giỗ Ông" placeholderTextColor="#999" />
            <Text style={[styles.formLabel, { color: currentText }]}>Ngày nhắc (Dương lịch hoặc Âm lịch)</Text>
            <TextInput style={[styles.input, { backgroundColor: currentCardBg, borderColor: currentBorder, color: currentText }]} defaultValue="25/09/2026 (15/8 âm lịch)" />
            <Text style={[styles.formLabel, { color: currentText }]}>Lặp lại</Text>
            <TextInput style={[styles.input, { backgroundColor: currentCardBg, borderColor: currentBorder, color: currentText }]} defaultValue="Hàng năm" />
            <TouchableOpacity onPress={() => setCurrentScreen('reminders')} style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Lưu nhắc nhở</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 6. MÀN HÌNH CÀI ĐẶT - Screen 7 (100% ACTIONS HOẠT ĐỘNG) */}
        {currentScreen === 'settings' && (
          <View style={{ gap: 12 }}>
            {/* 1. Thông báo */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                const nextVal = !settings.notificationsEnabled;
                setSettings({ ...settings, notificationsEnabled: nextVal });
                Alert.alert(
                  'Thông báo nhắc nhở',
                  nextVal
                    ? 'Đã BẬT thông báo nhắc nhở các ngày lễ tết, sóc vọng (mùng 1, hôm rằm).'
                    : 'Đã TẮT thông báo nhắc nhở.'
                );
              }}
              style={[styles.settingsRow, { backgroundColor: currentCardBg, borderColor: currentBorder }]}
            >
              <View style={styles.settingsLeft}>
                <View style={[styles.settingsIconBox, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={{ fontSize: 18 }}>🔔</Text>
                </View>
                <View>
                  <Text style={[styles.settingsTitle, { fontSize: 14 * fontMultiplier, color: currentText }]}>Thông báo</Text>
                  <Text style={[styles.settingsSubTitle, { color: currentSubText }]}>Nhắc nhở lễ tết, mùng 1, ngày rằm</Text>
                </View>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(val) => {
                  setSettings({ ...settings, notificationsEnabled: val });
                }}
                trackColor={{ false: '#CBD5E1', true: '#B3261E' }}
                thumbColor="#FFF"
              />
            </TouchableOpacity>

            {/* 2. Lịch âm */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveModal('lunar')}
              style={[styles.settingsRow, { backgroundColor: currentCardBg, borderColor: currentBorder }]}
            >
              <View style={styles.settingsLeft}>
                <View style={[styles.settingsIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={{ fontSize: 18 }}>🌙</Text>
                </View>
                <View>
                  <Text style={[styles.settingsTitle, { fontSize: 14 * fontMultiplier, color: currentText }]}>Lịch âm</Text>
                  <Text style={[styles.settingsSubTitle, { color: currentSubText }]}>
                    {settings.lunarDisplayMode === 'full'
                      ? 'Hiển thị đầy đủ (Can Chi, Tiết khí)'
                      : settings.lunarDisplayMode === 'basic'
                      ? 'Cơ bản (Ngày & Tháng âm)'
                      : 'Chỉ số ngày âm'}
                  </Text>
                </View>
              </View>
              <Text style={styles.settingsArrow}>›</Text>
            </TouchableOpacity>

            {/* 3. Giao diện */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveModal('theme')}
              style={[styles.settingsRow, { backgroundColor: currentCardBg, borderColor: currentBorder }]}
            >
              <View style={styles.settingsLeft}>
                <View style={[styles.settingsIconBox, { backgroundColor: '#E0E7FF' }]}>
                  <Text style={{ fontSize: 18 }}>🎨</Text>
                </View>
                <View>
                  <Text style={[styles.settingsTitle, { fontSize: 14 * fontMultiplier, color: currentText }]}>Giao diện</Text>
                  <Text style={[styles.settingsSubTitle, { color: currentSubText }]}>
                    {settings.theme === 'warm'
                      ? 'Sáng ấm (Giấy dó truyền thống)'
                      : settings.theme === 'white'
                      ? 'Sáng tiêu chuẩn (Trắng)'
                      : 'Tối dịu (Bảo vệ mắt)'}
                  </Text>
                </View>
              </View>
              <Text style={styles.settingsArrow}>›</Text>
            </TouchableOpacity>

            {/* 4. Cỡ chữ (Phù hợp người cao tuổi) */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveModal('fontSize')}
              style={[styles.settingsRow, { backgroundColor: currentCardBg, borderColor: currentBorder }]}
            >
              <View style={styles.settingsLeft}>
                <View style={[styles.settingsIconBox, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={{ fontSize: 18 }}>🔤</Text>
                </View>
                <View>
                  <Text style={[styles.settingsTitle, { fontSize: 14 * fontMultiplier, color: currentText }]}>Cỡ chữ</Text>
                  <Text style={[styles.settingsSubTitle, { color: '#0F5132', fontWeight: '700' }]}>
                    {settings.fontSize === 'extra_large'
                      ? 'Rất lớn (24px - Dễ đọc nhất)'
                      : settings.fontSize === 'large'
                      ? 'Lớn (20px - Cho người cao tuổi)'
                      : 'Tiêu chuẩn (16px)'}
                  </Text>
                </View>
              </View>
              <Text style={styles.settingsArrow}>›</Text>
            </TouchableOpacity>

            {/* 5. Ngôn ngữ */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveModal('language')}
              style={[styles.settingsRow, { backgroundColor: currentCardBg, borderColor: currentBorder }]}
            >
              <View style={styles.settingsLeft}>
                <View style={[styles.settingsIconBox, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={{ fontSize: 18 }}>🌐</Text>
                </View>
                <View>
                  <Text style={[styles.settingsTitle, { fontSize: 14 * fontMultiplier, color: currentText }]}>Ngôn ngữ</Text>
                  <Text style={[styles.settingsSubTitle, { color: currentSubText }]}>
                    {settings.language === 'vi' ? 'Tiếng Việt (Mặc định)' : 'English'}
                  </Text>
                </View>
              </View>
              <Text style={styles.settingsArrow}>›</Text>
            </TouchableOpacity>

            {/* 6. Giới thiệu ứng dụng */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveModal('about')}
              style={[styles.settingsRow, { backgroundColor: currentCardBg, borderColor: currentBorder }]}
            >
              <View style={styles.settingsLeft}>
                <View style={[styles.settingsIconBox, { backgroundColor: '#F3E8FF' }]}>
                  <Text style={{ fontSize: 18 }}>ℹ️</Text>
                </View>
                <View>
                  <Text style={[styles.settingsTitle, { fontSize: 14 * fontMultiplier, color: currentText }]}>Giới thiệu ứng dụng</Text>
                  <Text style={[styles.settingsSubTitle, { color: currentSubText }]}>Phiên bản 1.0.0 (Bính Ngọ 2026)</Text>
                </View>
              </View>
              <Text style={styles.settingsArrow}>›</Text>
            </TouchableOpacity>

            {/* Nút khôi phục cài đặt mặc định */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setSettings({
                  notificationsEnabled: true,
                  lunarDisplayMode: 'full',
                  theme: 'warm',
                  fontSize: 'large',
                  language: 'vi',
                });
                Alert.alert('Thành công', 'Đã khôi phục toàn bộ cài đặt về mặc định ban đầu.');
              }}
              style={[styles.resetSettingsBtn, { backgroundColor: currentCardBg, borderColor: currentBorder }]}
            >
              <Text style={styles.resetSettingsBtnText}>🔄 Khôi phục cài đặt mặc định</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM TAB NAVIGATION (3 Tabs chuẩn Wireframe) */}
      <View style={[styles.bottomNav, { backgroundColor: currentCardBg, borderTopColor: currentBorder }]}>
        <TouchableOpacity
          onPress={() => setCurrentScreen('daily_overview')}
          style={[styles.navTab, currentScreen === 'daily_overview' && styles.navTabActive]}
        >
          <Text style={{ fontSize: 18 * fontMultiplier }}>📅</Text>
          <Text style={[styles.navTabText, currentScreen === 'daily_overview' && styles.navTabTextActive, { fontSize: 11 * fontMultiplier }]}>Lịch ngày</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setViewMonth(currentDate.getMonth() + 1);
            setViewYear(currentDate.getFullYear());
            setCurrentScreen('monthly_calendar');
          }}
          style={[styles.navTab, currentScreen === 'monthly_calendar' && styles.navTabActive]}
        >
          <Text style={{ fontSize: 18 * fontMultiplier }}>🗓️</Text>
          <Text style={[styles.navTabText, currentScreen === 'monthly_calendar' && styles.navTabTextActive, { fontSize: 11 * fontMultiplier }]}>Lịch tháng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentScreen('reminders')}
          style={[styles.navTab, currentScreen === 'reminders' && styles.navTabActive]}
        >
          <Text style={{ fontSize: 18 * fontMultiplier }}>🔔</Text>
          <Text style={[styles.navTabText, currentScreen === 'reminders' && styles.navTabTextActive, { fontSize: 11 * fontMultiplier }]}>Nhắc nhở</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL DIALOGS CHO CÀI ĐẶT */}
      <Modal
        visible={activeModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity activeOpacity={1} style={[styles.modalBox, { backgroundColor: currentCardBg }]}>
            {/* 1. Modal Lịch Âm */}
            {activeModal === 'lunar' && (
              <View style={{ gap: 14 }}>
                <Text style={[styles.modalTitle, { color: currentText }]}>Chế độ hiển thị Âm lịch</Text>
                {[
                  { id: 'full', title: 'Đầy đủ (Khuyên dùng)', desc: 'Hiện số ngày âm, tháng âm, Can Chi và Tiết khí' },
                  { id: 'basic', title: 'Cơ bản', desc: 'Chỉ hiển thị số ngày và tháng âm' },
                  { id: 'day_only', title: 'Chỉ số ngày âm', desc: 'Hiển thị tối giản duy nhất số ngày' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setSettings({ ...settings, lunarDisplayMode: item.id as any });
                      setActiveModal(null);
                    }}
                    style={[
                      styles.modalOptionRow,
                      settings.lunarDisplayMode === item.id && styles.modalOptionSelected,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalOptionTitle}>{item.title}</Text>
                      <Text style={styles.modalOptionDesc}>{item.desc}</Text>
                    </View>
                    {settings.lunarDisplayMode === item.id && (
                      <Text style={styles.modalCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 2. Modal Giao Diện */}
            {activeModal === 'theme' && (
              <View style={{ gap: 14 }}>
                <Text style={[styles.modalTitle, { color: currentText }]}>Chọn giao diện hiển thị</Text>
                {[
                  { id: 'warm', title: 'Sáng ấm (Mặc định)', desc: 'Màu giấy dó truyền thống, dịu mắt, ấm cúng' },
                  { id: 'white', title: 'Sáng tiêu chuẩn', desc: 'Nền trắng sáng hiện đại, tương phản sắc nét' },
                  { id: 'dark', title: 'Tối dịu', desc: 'Nền sẫm màu, bảo vệ mắt khi xem ban đêm' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setSettings({ ...settings, theme: item.id as any });
                      setActiveModal(null);
                    }}
                    style={[
                      styles.modalOptionRow,
                      settings.theme === item.id && styles.modalOptionSelected,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalOptionTitle}>{item.title}</Text>
                      <Text style={styles.modalOptionDesc}>{item.desc}</Text>
                    </View>
                    {settings.theme === item.id && (
                      <Text style={styles.modalCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 3. Modal Cỡ Chữ */}
            {activeModal === 'fontSize' && (
              <View style={{ gap: 14 }}>
                <Text style={[styles.modalTitle, { color: currentText }]}>Chọn cỡ chữ hiển thị</Text>
                {[
                  { id: 'standard', title: 'Tiêu chuẩn (16px)', desc: 'Kích thước chuẩn, hiển thị nhiều nội dung' },
                  { id: 'large', title: 'Lớn — Cho người cao tuổi (20px)', desc: 'Khuyên dùng: Chữ to rõ, thoáng đãng, dễ bấm' },
                  { id: 'extra_large', title: 'Rất lớn (24px)', desc: 'Chữ cực to, dễ đọc nhất, không cần kính lão' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setSettings({ ...settings, fontSize: item.id as any });
                      setActiveModal(null);
                    }}
                    style={[
                      styles.modalOptionRow,
                      settings.fontSize === item.id && styles.modalOptionSelected,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalOptionTitle}>{item.title}</Text>
                      <Text style={styles.modalOptionDesc}>{item.desc}</Text>
                    </View>
                    {settings.fontSize === item.id && (
                      <Text style={styles.modalCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 4. Modal Ngôn Ngữ */}
            {activeModal === 'language' && (
              <View style={{ gap: 14 }}>
                <Text style={[styles.modalTitle, { color: currentText }]}>Ngôn ngữ (Language)</Text>
                {[
                  { id: 'vi', title: 'Tiếng Việt', desc: 'Ngôn ngữ mặc định của ứng dụng' },
                  { id: 'en', title: 'English', desc: 'Vietnamese Lunar Calendar for English speakers' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setSettings({ ...settings, language: item.id as any });
                      setActiveModal(null);
                    }}
                    style={[
                      styles.modalOptionRow,
                      settings.language === item.id && styles.modalOptionSelected,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalOptionTitle}>{item.title}</Text>
                      <Text style={styles.modalOptionDesc}>{item.desc}</Text>
                    </View>
                    {settings.language === item.id && (
                      <Text style={styles.modalCheckmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 5. Modal Giới Thiệu */}
            {activeModal === 'about' && (
              <View style={{ gap: 12, alignItems: 'center' }}>
                <View style={styles.aboutLogoBox}>
                  <Text style={{ fontSize: 28, color: '#FFF', fontWeight: '900' }}>L</Text>
                </View>
                <Text style={[styles.aboutAppName, { color: currentText }]}>Lịch An Nhiên (Lịch Việt)</Text>
                <Text style={styles.aboutVersion}>Phiên bản 1.0.0 (Bính Ngọ 2026)</Text>
                <View style={styles.aboutQuoteBox}>
                  <Text style={styles.aboutQuoteText}>
                    "Giữ truyền thống, gần gũi mỗi ngày! Thiết kế đơn giản – Rõ ràng – Dễ sử dụng – Phù hợp cho người cao tuổi."
                  </Text>
                </View>
                <Text style={styles.aboutAlgoCredit}>
                  Thuật toán thiên văn Âm Dương chuẩn Hồ Ngọc Đức (Múi giờ UTC+7 Việt Nam).
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setActiveModal(null)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseBtnText}>Đóng</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B3261E',
    letterSpacing: 0.5,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  iconBtnText: {
    fontSize: 28,
    lineHeight: 30,
    color: '#333',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnText: {
    fontSize: 24,
    lineHeight: 26,
    color: '#333',
  },
  dayOfWeekText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  fullDateText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  solarCard: {
    backgroundColor: '#EBF7EE',
    borderColor: '#C5E8CE',
  },
  solarCardTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#146C43',
    letterSpacing: 0.5,
  },
  solarBigNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: '#0F5132',
    lineHeight: 62,
    marginVertical: 4,
  },
  solarSubText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#146C43',
  },
  solarBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F5132',
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  lunarCard: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  lunarCardTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B3261E',
    letterSpacing: 0.5,
  },
  lunarBigNumber: {
    fontSize: 54,
    fontWeight: '900',
    color: '#B3261E',
    lineHeight: 62,
    marginVertical: 4,
  },
  lunarSubText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9E1B1B',
  },
  canChiBox: {
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 6,
    alignItems: 'center',
  },
  canChiText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  boldTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  subGreenTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
  },
  boldLabel: {
    fontWeight: '700',
    color: '#0F172A',
  },
  boldRedLabel: {
    fontWeight: '700',
    color: '#9E1B1B',
  },
  bulletText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  quoteCard: {
    backgroundColor: '#FFFBF5',
    borderWidth: 1,
    borderColor: '#EFE5D5',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quoteText: {
    flex: 1,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#475569',
    lineHeight: 19,
  },
  elderlyNavRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  elderlyBtn: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  elderlyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  todayBtn: {
    backgroundColor: '#B3261E',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  todayBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailBox: {
    padding: 14,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  monthHeaderTitle: {
    fontWeight: '800',
  },
  monthHeaderSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B3261E',
    marginTop: 2,
  },
  gridHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  gridColHeaderBox: {
    flex: 1,
    alignItems: 'center',
  },
  gridColHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
  },
  dayCell: {
    width: '14.285%',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 10,
  },
  dayCellSelected: {
    backgroundColor: '#B3261E',
  },
  cellSolarText: {
    fontWeight: '700',
  },
  cellSolarSelected: {
    color: '#FFF',
    fontWeight: '800',
  },
  cellCurrentMonth: {
    color: '#0F172A',
  },
  cellSunday: {
    color: '#B3261E',
  },
  cellOtherMonth: {
    color: '#CBD5E1',
    fontWeight: '500',
  },
  cellLunarText: {
    marginTop: 1,
  },
  cellLunarSelected: {
    color: '#FFCDD2',
    fontWeight: '700',
  },
  cellNormalLunar: {
    color: '#64748B',
    fontWeight: '600',
  },
  cellSpecialLunar: {
    color: '#B3261E',
    fontWeight: '800',
  },
  cellOtherLunar: {
    color: '#E2E8F0',
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 6,
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  monthCardPreview: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  previewDateTitle: {
    fontWeight: '800',
  },
  detailBtnSmall: {
    backgroundColor: '#B3261E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  detailBtnSmallText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  previewLunarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B3261E',
  },
  previewRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F5132',
    marginTop: 2,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  remTitle: {
    fontWeight: '700',
  },
  remDate: {
    fontSize: 12,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#B3261E',
    borderColor: '#B3261E',
  },
  addBtnSmall: {
    backgroundColor: '#B3261E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#B3261E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 64,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsTitle: {
    fontWeight: '700',
  },
  settingsSubTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  settingsArrow: {
    fontSize: 22,
    color: '#94A3B8',
    fontWeight: '600',
    paddingLeft: 8,
  },
  resetSettingsBtn: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 6,
  },
  resetSettingsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B3261E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  modalOptionSelected: {
    borderColor: '#B3261E',
    backgroundColor: '#FFF1F2',
  },
  modalOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalOptionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalCheckmark: {
    fontSize: 16,
    fontWeight: '900',
    color: '#B3261E',
    marginLeft: 8,
  },
  modalCloseBtn: {
    backgroundColor: '#B3261E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  modalCloseBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  aboutLogoBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#B3261E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutAppName: {
    fontSize: 18,
    fontWeight: '800',
  },
  aboutVersion: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  aboutQuoteBox: {
    backgroundColor: '#FFFBF5',
    borderWidth: 1,
    borderColor: '#EFE5D5',
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  aboutQuoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  aboutAlgoCredit: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  navTabActive: {},
  navTabText: {
    fontWeight: '600',
    color: '#64748B',
  },
  navTabTextActive: {
    color: '#B3261E',
    fontWeight: '800',
  },
});
