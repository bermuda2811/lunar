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
  Share2,
  Bookmark,
  Calendar,
} from 'lucide-react-native';
import { ScreenType } from '../types';

interface EventDetailScreenProps {
  eventId?: number;
  onNavigate: (screen: ScreenType) => void;
  fontMultiplier?: number;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  eventId = 8,
  onNavigate,
  fontMultiplier = 1,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('events_list')}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#334155" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontSize: 16 * fontMultiplier }]}>
          Tết Trung Thu
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButtonSmall} activeOpacity={0.7}>
            <Share2 size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButtonSmall} activeOpacity={0.7}>
            <Bookmark size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Graphic matching wireframe */}
        <View style={styles.heroBanner}>
          {/* Moon */}
          <View style={styles.moonGlow}>
            <View style={styles.moonBody}>
              <View style={styles.moonCrater1} />
              <View style={styles.moonCrater2} />
            </View>
          </View>

          {/* Lanterns */}
          <View style={styles.lanternsRow}>
            <View style={styles.lanternCol}>
              <View style={[styles.lanternString, { height: 18 }]} />
              <View style={styles.lanternBox}>
                <Text style={styles.lanternChar}>Phúc</Text>
              </View>
            </View>
            <View style={styles.lanternCol}>
              <View style={[styles.lanternString, { height: 28 }]} />
              <View style={[styles.lanternBox, { backgroundColor: '#EA580C' }]}>
                <Text style={styles.lanternChar}>Lộc</Text>
              </View>
            </View>
            <View style={styles.lanternCol}>
              <View style={[styles.lanternString, { height: 16 }]} />
              <View style={styles.lanternBox}>
                <Text style={styles.lanternChar}>Thọ</Text>
              </View>
            </View>
          </View>

          {/* Banner bottom text */}
          <View style={styles.bannerFooter}>
            <Text style={[styles.bannerFooterText, { fontSize: 13 * fontMultiplier }]}>
              ĐÊM HỘI TRĂNG RẰM
            </Text>
          </View>
        </View>

        {/* Thời gian diễn ra */}
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
            <Calendar size={20} color="#B3261E" />
          </View>
          <View>
            <Text style={[styles.cardLabel, { fontSize: 12 * fontMultiplier }]}>
              Thời gian diễn ra
            </Text>
            <Text style={[styles.dateText, { fontSize: 15 * fontMultiplier }]}>
              15 tháng 8 âm lịch (năm 2026: 25/9)
            </Text>
          </View>
        </View>

        {/* Ý nghĩa */}
        <View style={styles.cardCol}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.titleDot, { backgroundColor: '#B3261E' }]} />
            <Text style={[styles.sectionTitle, { fontSize: 15 * fontMultiplier }]}>
              Ý nghĩa
            </Text>
          </View>
          <Text style={[styles.paragraphText, { fontSize: 13 * fontMultiplier }]}>
            Tết Trung Thu là dịp để gia đình sum vầy, trẻ em được vui chơi, rước đèn, phá cỗ. Đây cũng là dịp thể hiện tình thân và truyền thống văn hóa tốt đẹp của dân tộc.
          </Text>
        </View>

        {/* Hoạt động truyền thống */}
        <View style={styles.cardCol}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.titleDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.sectionTitle, { fontSize: 15 * fontMultiplier }]}>
              Hoạt động truyền thống
            </Text>
          </View>
          <View style={styles.activitiesList}>
            <View style={styles.activityItem}>
              <Text style={styles.bulletRed}>•</Text>
              <Text style={[styles.activityText, { fontSize: 13 * fontMultiplier }]}>
                Rước đèn ông sao, múa lân sư rồng
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.bulletRed}>•</Text>
              <Text style={[styles.activityText, { fontSize: 13 * fontMultiplier }]}>
                Phá cỗ trông trăng, ăn bánh nướng, bánh dẻo
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.bulletRed}>•</Text>
              <Text style={[styles.activityText, { fontSize: 13 * fontMultiplier }]}>
                Tặng quà và chúc phúc cho người thân
              </Text>
            </View>
          </View>
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
  iconButtonSmall: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  heroBanner: {
    height: 180,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  moonGlow: {
    position: 'absolute',
    top: 16,
    right: 24,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(254, 240, 138, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonBody: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FDE047',
    position: 'relative',
  },
  moonCrater1: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FACC15',
    opacity: 0.5,
  },
  moonCrater2: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FACC15',
    opacity: 0.4,
  },
  lanternsRow: {
    position: 'absolute',
    top: 0,
    left: 20,
    flexDirection: 'row',
    gap: 16,
  },
  lanternCol: {
    alignItems: 'center',
  },
  lanternString: {
    width: 1.5,
    backgroundColor: '#FDE047',
  },
  lanternBox: {
    width: 30,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lanternChar: {
    color: '#FEF08A',
    fontWeight: '700',
    fontSize: 10,
  },
  bannerFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
  },
  bannerFooterText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    color: '#64748B',
    fontWeight: '500',
  },
  dateText: {
    fontWeight: '700',
    color: '#B3261E',
    marginTop: 2,
  },
  cardCol: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  paragraphText: {
    color: '#334155',
    lineHeight: 22,
    fontWeight: '500',
  },
  activitiesList: {
    gap: 6,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletRed: {
    color: '#B3261E',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
  },
  activityText: {
    color: '#334155',
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
});
