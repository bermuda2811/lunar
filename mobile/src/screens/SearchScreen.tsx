import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react-native';
import { ScreenType } from '../types';

interface SearchScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectEvent?: (eventId: number) => void;
  fontMultiplier?: number;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onNavigate,
  onSelectEvent,
  fontMultiplier = 1,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'date' | 'event' | 'holiday'>('date');

  const recentSearches = [
    { title: 'Tết Nguyên Đán', date: '29 tháng Chạp - Mùng 3 Tết', id: 2 },
    { title: 'Rằm tháng Giêng', date: '15 tháng 1 Âm lịch', id: 3 },
    { title: 'Giỗ Tổ Hùng Vương', date: '10 tháng 3 Âm lịch', id: 4 },
    { title: 'Ngày Thương binh Liệt sĩ', date: '27 tháng 7 Dương lịch', id: 5 },
    { title: 'Quốc khánh 2/9', date: '2 tháng 9 Dương lịch', id: 9 },
    { title: 'Tết Trung Thu', date: '15 tháng 8 Âm lịch', id: 8 },
  ];

  const filteredResults = query.trim()
    ? recentSearches.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleItemClick = (id: number) => {
    if (onSelectEvent) onSelectEvent(id);
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
          Tìm kiếm
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm ngày, sự kiện, lễ tết..."
            placeholderTextColor="#94A3B8"
            style={[styles.searchInput, { fontSize: 14 * fontMultiplier }]}
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.pillsRow}>
          {[
            { id: 'date', label: 'Ngày' },
            { id: 'event', label: 'Sự kiện' },
            { id: 'holiday', label: 'Lễ tết' },
          ].map((item) => {
            const isActive = filterType === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setFilterType(item.id as any)}
                activeOpacity={0.7}
                style={[styles.pill, isActive && styles.pillActive]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isActive && styles.pillTextActive,
                    { fontSize: 13 * fontMultiplier },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search Results */}
        {query.trim().length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: 12 * fontMultiplier }]}>
              KẾT QUẢ TÌM KIẾM ({filteredResults.length})
            </Text>
            {filteredResults.length > 0 ? (
              <View style={styles.resultsList}>
                {filteredResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleItemClick(item.id)}
                    activeOpacity={0.7}
                    style={styles.resultItem}
                  >
                    <View>
                      <Text style={[styles.resultTitle, { fontSize: 14 * fontMultiplier }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.resultDate, { fontSize: 12 * fontMultiplier }]}>
                        {item.date}
                      </Text>
                    </View>
                    <ChevronRight size={18} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyBox}>
                <Text style={[styles.emptyText, { fontSize: 13 * fontMultiplier }]}>
                  Không tìm thấy kết quả phù hợp
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* Recent Searches */
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: 12 * fontMultiplier }]}>
              GỢI Ý & TÌM KIẾM GẦN ĐÂY
            </Text>
            <View style={styles.resultsList}>
              {recentSearches.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleItemClick(item.id)}
                  activeOpacity={0.7}
                  style={styles.resultItem}
                >
                  <View>
                    <Text style={[styles.resultTitle, { fontSize: 14 * fontMultiplier }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.resultDate, { fontSize: 12 * fontMultiplier }]}>
                      {item.date}
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#0F172A',
    paddingVertical: 4,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FECDD3',
  },
  pillText: {
    color: '#64748B',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#B3261E',
    fontWeight: '700',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  resultsList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    overflow: 'hidden',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resultTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  resultDate: {
    color: '#B3261E',
    fontWeight: '500',
    marginTop: 2,
  },
  emptyBox: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
  },
});
