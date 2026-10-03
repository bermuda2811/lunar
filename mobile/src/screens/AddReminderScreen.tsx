import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
} from 'lucide-react-native';
import { ScreenType, ReminderItem } from '../types';
import { ReminderIcon } from '../components/ReminderIcon';
import { solarToLunar } from '../domain/lunarCalendar';

interface AddReminderScreenProps {
  onSave: (reminder: ReminderItem) => void;
  onNavigate: (screen: ScreenType) => void;
  fontMultiplier?: number;
}

export const AddReminderScreen: React.FC<AddReminderScreenProps> = ({
  onSave,
  onNavigate,
  fontMultiplier = 1,
}) => {
  const [title, setTitle] = useState('');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar' | 'both'>('both');
  const [dateStr, setDateStr] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('yearly');
  const [time, setTime] = useState('all_day');
  const [remindBeforeDays, setRemindBeforeDays] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState<ReminderItem['icon']>('cake');
  const [notes, setNotes] = useState('');

  // Calculate lunar equivalent
  const now = new Date();
  const parts = dateStr.split('-').map((n) => parseInt(n, 10));
  const year = parts[0] || now.getFullYear();
  const month = parts[1] || (now.getMonth() + 1);
  const day = parts[2] || now.getDate();
  const lunar = solarToLunar(day, month, year);
  const lunarDisplay = `${lunar.day}/${lunar.month} âm lịch`;

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên nhắc nhở.');
      return;
    }

    const newReminder: ReminderItem = {
      id: 'rem-' + Date.now(),
      title: title.trim(),
      calendarType,
      solarDate: dateStr,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      lunarFormatted: lunarDisplay,
      time,
      repeat,
      remindBeforeDays,
      icon: selectedIcon,
      notes: notes.trim() || undefined,
      isCompleted: false,
      section: 'upcoming',
    };

    onSave(newReminder);
    onNavigate('reminders');
  };

  const iconsList: ReminderItem['icon'][] = [
    'cake',
    'altar',
    'lotus',
    'family',
    'heart',
    'plane',
    'star',
    'more',
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('reminders')}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#334155" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontSize: 16 * fontMultiplier }]}>
          Thêm nhắc nhở
        </Text>

        <TouchableOpacity onPress={handleSave} style={styles.saveBtn} activeOpacity={0.7}>
          <Text style={[styles.saveBtnText, { fontSize: 13 * fontMultiplier }]}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Field 1: Tên nhắc nhở */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
            Tên nhắc nhở *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ví dụ: Ngày giỗ Ông"
            placeholderTextColor="#94A3B8"
            style={[styles.input, { fontSize: 14 * fontMultiplier }]}
          />
        </View>

        {/* Field 2: Loại ngày */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
            Ngày nhắc
          </Text>
          <View style={styles.segmentedRow}>
            {(['solar', 'lunar', 'both'] as const).map((type) => {
              const label = type === 'solar' ? 'Ngày dương' : type === 'lunar' ? 'Ngày âm' : 'Cả hai';
              const isSelected = calendarType === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setCalendarType(type)}
                  activeOpacity={0.7}
                  style={[styles.segmentedItem, isSelected && styles.segmentedItemActive]}
                >
                  <Text
                    style={[
                      styles.segmentedText,
                      isSelected && styles.segmentedTextActive,
                      { fontSize: 13 * fontMultiplier },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Field 3: Ngày chọn */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
            Ngày (YYYY-MM-DD)
          </Text>
          <TextInput
            value={dateStr}
            onChangeText={setDateStr}
            placeholder="2026-09-25"
            placeholderTextColor="#94A3B8"
            style={[styles.input, { fontSize: 14 * fontMultiplier }]}
          />
          <View style={styles.lunarHintBox}>
            <Text style={[styles.lunarHintText, { fontSize: 12 * fontMultiplier }]}>
              Quy đổi: {lunarDisplay}
            </Text>
          </View>
        </View>

        {/* Field 4: Lặp lại */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
            Lặp lại
          </Text>
          <View style={styles.chipsWrap}>
            {[
              { id: 'none', label: 'Không' },
              { id: 'yearly', label: 'Hàng năm' },
              { id: 'monthly', label: 'Hàng tháng' },
              { id: 'weekly', label: 'Hàng tuần' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setRepeat(item.id as any)}
                activeOpacity={0.7}
                style={[styles.chip, repeat === item.id && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    repeat === item.id && styles.chipTextActive,
                    { fontSize: 12 * fontMultiplier },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Field 5: Thời gian */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
            Thời gian
          </Text>
          <View style={styles.chipsWrap}>
            {['all_day', '08:00', '12:00', '18:00'].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTime(t)}
                activeOpacity={0.7}
                style={[styles.chip, time === t && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    time === t && styles.chipTextActive,
                    { fontSize: 12 * fontMultiplier },
                  ]}
                >
                  {t === 'all_day' ? 'Cả ngày' : t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Field 6: Báo trước */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
            Báo trước
          </Text>
          <View style={styles.chipsWrap}>
            {[
              { val: 0, label: 'Đúng ngày' },
              { val: 1, label: 'Trước 1 ngày' },
              { val: 3, label: 'Trước 3 ngày' },
              { val: 7, label: 'Trước 7 ngày' },
            ].map((item) => (
              <TouchableOpacity
                key={item.val}
                onPress={() => setRemindBeforeDays(item.val)}
                activeOpacity={0.7}
                style={[styles.chip, remindBeforeDays === item.val && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    remindBeforeDays === item.val && styles.chipTextActive,
                    { fontSize: 12 * fontMultiplier },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Field 7: Biểu tượng */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
            Biểu tượng
          </Text>
          <View style={styles.iconsGrid}>
            {iconsList.map((ic) => {
              const isSelected = selectedIcon === ic;
              return (
                <TouchableOpacity
                  key={ic}
                  onPress={() => setSelectedIcon(ic)}
                  activeOpacity={0.7}
                  style={[styles.iconChoice, isSelected && styles.iconChoiceActive]}
                >
                  <ReminderIcon icon={ic} size={22} color={isSelected ? '#B3261E' : '#64748B'} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Field 8: Ghi chú */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
            Ghi chú (Tùy chọn)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Ghi chú thêm về nhắc nhở này..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            style={[styles.inputMultiline, { fontSize: 14 * fontMultiplier }]}
          />
        </View>
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
  saveBtn: {
    backgroundColor: '#B3261E',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#B3261E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#0F172A',
  },
  inputMultiline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  segmentedItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentedItemActive: {
    backgroundColor: '#B3261E',
  },
  segmentedText: {
    color: '#64748B',
    fontWeight: '600',
  },
  segmentedTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  lunarHintBox: {
    marginTop: 2,
  },
  lunarHintText: {
    color: '#B3261E',
    fontWeight: '600',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  chipActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FECDD3',
  },
  chipText: {
    color: '#64748B',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#B3261E',
    fontWeight: '700',
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconChoice: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChoiceActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FECDD3',
  },
});
