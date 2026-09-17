import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar as RNStatusBar,
  TextInput
} from 'react-native';
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
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('daily_overview');
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 16));
  const [reminders, setReminders] = useState([
    { id: '1', title: 'Sinh nhật Bà', date: '17/9/2026', lunar: '7/8 âm lịch', time: 'Cả ngày', completed: false, icon: '🎂' },
    { id: '2', title: 'Ngày giỗ Ông', date: '25/9/2026', lunar: '15/8 âm lịch', time: 'Cả ngày', completed: false, icon: '🪔' },
    { id: '3', title: 'Rằm tháng 8 (Tết Trung Thu)', date: '25/9/2026', lunar: '15/8 âm lịch', time: 'Cả ngày', completed: false, icon: '🏮' },
    { id: '4', title: 'Chuyến đi Đà Nẵng', date: '10/10/2026', lunar: '30/8 âm lịch', time: 'Cả ngày', completed: false, icon: '✈️' },
    { id: '5', title: 'Họp mặt gia đình', date: '2/10/2026', lunar: '22/8 âm lịch', time: '18:00', completed: false, icon: '👨‍👩‍👧‍👦' },
  ]);

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const dayData = getFullDayData(day, month, year);

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  return (
    <SafeAreaView style={styles.container}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

      {/* TOP HEADER */}
      <View style={styles.topBar}>
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
          <View style={{ gap: 14 }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
              Tháng {month} năm {year}
            </Text>
            <View style={styles.gridHeader}>
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((t, i) => (
                <Text key={i} style={[styles.gridColHeader, i === 6 && { color: '#B3261E' }]}>{t}</Text>
              ))}
            </View>
            {/* Calendar grid representation */}
            <View style={styles.monthCardPreview}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#B3261E' }}>
                Ngày chọn: {day} tháng {month} (Âm lịch: {dayData.lunar.day}/{dayData.lunar.month})
              </Text>
              <Text style={{ fontSize: 13, color: '#444', marginTop: 4 }}>
                ☘ {dayData.rating.label}: Thích hợp cưới hỏi, xuất hành, khai trương.
              </Text>
            </View>
          </View>
        )}

        {/* 4. MÀN HÌNH NHẮC NHỞ - Screen 5 */}
        {currentScreen === 'reminders' && (
          <View style={{ gap: 12 }}>
            <View style={styles.rowBetween}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Danh sách nhắc nhở</Text>
              <TouchableOpacity onPress={() => setCurrentScreen('add_reminder')} style={styles.addBtnSmall}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Thêm</Text>
              </TouchableOpacity>
            </View>
            {reminders.map(r => (
              <TouchableOpacity key={r.id} onPress={() => toggleReminder(r.id)} style={styles.reminderCard}>
                <Text style={{ fontSize: 24 }}>{r.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.remTitle, r.completed && { textDecorationLine: 'line-through', color: '#888' }]}>{r.title}</Text>
                  <Text style={styles.remDate}>{r.date} ({r.lunar}) • {r.time}</Text>
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
            <Text style={styles.formLabel}>Tên nhắc nhở *</Text>
            <TextInput style={styles.input} placeholder="Ví dụ: Ngày giỗ Ông" placeholderTextColor="#999" />
            <Text style={styles.formLabel}>Ngày nhắc (Dương lịch hoặc Âm lịch)</Text>
            <TextInput style={styles.input} defaultValue="25/09/2026 (15/8 âm lịch)" />
            <Text style={styles.formLabel}>Lặp lại</Text>
            <TextInput style={styles.input} defaultValue="Hàng năm" />
            <TouchableOpacity onPress={() => setCurrentScreen('reminders')} style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Lưu nhắc nhở</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 6. MÀN HÌNH CÀI ĐẶT - Screen 7 */}
        {currentScreen === 'settings' && (
          <View style={{ gap: 10 }}>
            {['🔔 Thông báo (Bật)', '🌙 Lịch âm (Hiển thị đầy đủ)', '🎨 Giao diện (Sáng ấm)', '🔤 Cỡ chữ (Lớn cho người cao tuổi)', '🌐 Ngôn ngữ (Tiếng Việt)', 'ℹ️ Giới thiệu ứng dụng'].map((s, i) => (
              <View key={i} style={styles.settingsRow}>
                <Text style={styles.settingsText}>{s}</Text>
                <Text style={{ color: '#999' }}>›</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* BOTTOM TAB NAVIGATION (3 Tabs chuẩn Wireframe) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => setCurrentScreen('daily_overview')}
          style={[styles.navTab, currentScreen === 'daily_overview' && styles.navTabActive]}
        >
          <Text style={{ fontSize: 18 }}>📅</Text>
          <Text style={[styles.navTabText, currentScreen === 'daily_overview' && styles.navTabTextActive]}>Lịch ngày</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentScreen('monthly_calendar')}
          style={[styles.navTab, currentScreen === 'monthly_calendar' && styles.navTabActive]}
        >
          <Text style={{ fontSize: 18 }}>🗓️</Text>
          <Text style={[styles.navTabText, currentScreen === 'monthly_calendar' && styles.navTabTextActive]}>Lịch tháng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentScreen('reminders')}
          style={[styles.navTab, currentScreen === 'reminders' && styles.navTabActive]}
        >
          <Text style={{ fontSize: 18 }}>🔔</Text>
          <Text style={[styles.navTabText, currentScreen === 'reminders' && styles.navTabTextActive]}>Nhắc nhở</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  gridColHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  monthCardPreview: {
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  remTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  remDate: {
    fontSize: 12,
    color: '#64748B',
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
    color: '#334155',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
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
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
    paddingVertical: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  navTabActive: {},
  navTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  navTabTextActive: {
    color: '#B3261E',
    fontWeight: '800',
  },
});
