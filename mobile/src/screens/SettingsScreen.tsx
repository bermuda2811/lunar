import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Calendar,
  Palette,
  Type,
  Globe,
  Info,
  Check,
  User,
  Heart,
  LogOut,
} from 'lucide-react-native';
import { ScreenType, AppSettings, UserAccount } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onNavigate: (screen: ScreenType) => void;
  currentUser?: UserAccount;
  onLogout?: () => void;
  fontMultiplier?: number;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
  currentUser,
  onLogout,
  fontMultiplier = 1,
}) => {
  const [activeModal, setActiveModal] = useState<
    'font' | 'lunar' | 'theme' | 'about' | null
  >(null);

  const isGuest = !currentUser || currentUser.isGuest;

  const toggleNotifications = () => {
    const nextState = !settings.notificationsEnabled;
    onUpdateSettings({
      ...settings,
      notificationsEnabled: nextState,
    });
    Alert.alert(
      'Thông báo',
      nextState
        ? 'Đã bật thông báo nhắc nhở ngày lễ, rằm, mùng một.'
        : 'Đã tắt thông báo nhắc nhở.'
    );
  };

  const handleFontSizeChange = (size: AppSettings['fontSize']) => {
    onUpdateSettings({
      ...settings,
      fontSize: size,
    });
    setActiveModal(null);
  };

  const handleLunarModeChange = (mode: AppSettings['lunarDisplayMode']) => {
    onUpdateSettings({
      ...settings,
      lunarDisplayMode: mode,
    });
    setActiveModal(null);
  };

  const handleThemeChange = (theme: AppSettings['theme']) => {
    onUpdateSettings({
      ...settings,
      theme,
    });
    setActiveModal(null);
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

        <Text style={[styles.headerTitle, { fontSize: 16 * fontMultiplier }]} numberOfLines={1}>
          Tài khoản & Cài đặt
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile / Account Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={[styles.profileAvatar, !isGuest && styles.profileAvatarActive]}>
              {!isGuest ? (
                <Text style={styles.profileAvatarChar}>
                  {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                </Text>
              ) : (
                <User size={24} color="#64748B" />
              )}
            </View>
            <View style={styles.profileDetails}>
              <Text
                style={[styles.profileName, { fontSize: 15 * fontMultiplier }]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {!isGuest ? currentUser?.email : 'Tài khoản trên máy (Khách)'}
              </Text>
              <Text
                style={[styles.profileStatus, { fontSize: 12 * fontMultiplier }]}
                numberOfLines={2}
              >
                {!isGuest ? '✓ Đã sao lưu dữ liệu đám mây' : 'Dữ liệu chỉ lưu trên thiết bị này'}
              </Text>
            </View>
            {!isGuest && onLogout && (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Đăng xuất', style: 'destructive', onPress: onLogout },
                  ]);
                }}
                style={styles.logoutIconBtn}
                activeOpacity={0.7}
              >
                <LogOut size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {isGuest && (
            <TouchableOpacity
              onPress={() => onNavigate('auth')}
              activeOpacity={0.8}
              style={styles.loginBannerBtn}
            >
              <Text style={[styles.loginBannerBtnText, { fontSize: 13 * fontMultiplier }]}>
                Đăng nhập bằng Email (Sao lưu & Đồng bộ)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Highlight Card: Ủng hộ nhà phát triển */}
        <TouchableOpacity
          onPress={() => onNavigate('donate')}
          activeOpacity={0.7}
          style={styles.donateCard}
        >
          <View style={styles.donateLeft}>
            <View style={styles.donateIconCircle}>
              <Heart size={20} color="#B3261E" fill="#B3261E" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.donateTitle, { fontSize: 15 * fontMultiplier }]} numberOfLines={1}>
                Ủng hộ nhà phát triển
              </Text>
              <Text style={[styles.donateSub, { fontSize: 12 * fontMultiplier }]} numberOfLines={2}>
                Mời tách trà ấm duy trì ứng dụng
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color="#B3261E" style={{ flexShrink: 0 }} />
        </TouchableOpacity>

        {/* 1. Thông báo */}
        <TouchableOpacity
          onPress={toggleNotifications}
          activeOpacity={0.7}
          style={styles.settingCard}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
              <Bell size={20} color="#B3261E" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { fontSize: 15 * fontMultiplier }]} numberOfLines={1}>
                Thông báo
              </Text>
              <Text style={[styles.settingSub, { fontSize: 12 * fontMultiplier }]} numberOfLines={2}>
                Nhắc nhở lễ tết, mùng 1, ngày rằm
              </Text>
            </View>
          </View>

          <View style={styles.settingRight}>
            <Text style={[styles.settingValue, { fontSize: 13 * fontMultiplier }]} numberOfLines={1}>
              {settings.notificationsEnabled ? 'Bật' : 'Tắt'}
            </Text>
            <ChevronRight size={18} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {/* 2. Lịch âm */}
        <TouchableOpacity
          onPress={() => setActiveModal('lunar')}
          activeOpacity={0.7}
          style={styles.settingCard}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Calendar size={20} color="#B45309" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { fontSize: 15 * fontMultiplier }]} numberOfLines={1}>
                Lịch âm
              </Text>
              <Text style={[styles.settingSub, { fontSize: 12 * fontMultiplier }]} numberOfLines={2}>
                Chế độ hiển thị thông tin âm lịch
              </Text>
            </View>
          </View>

          <View style={styles.settingRight}>
            <Text style={[styles.settingValue, { fontSize: 13 * fontMultiplier }]} numberOfLines={1}>
              {settings.lunarDisplayMode === 'full'
                ? 'Đầy đủ'
                : settings.lunarDisplayMode === 'basic'
                ? 'Cơ bản'
                : 'Chỉ ngày'}
            </Text>
            <ChevronRight size={18} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {/* 3. Giao diện */}
        <TouchableOpacity
          onPress={() => setActiveModal('theme')}
          activeOpacity={0.7}
          style={styles.settingCard}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
              <Palette size={20} color="#4338CA" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { fontSize: 15 * fontMultiplier }]} numberOfLines={1}>
                Giao diện
              </Text>
              <Text style={[styles.settingSub, { fontSize: 12 * fontMultiplier }]} numberOfLines={2}>
                Màu nền và độ tương phản
              </Text>
            </View>
          </View>

          <View style={styles.settingRight}>
            <Text style={[styles.settingValue, { fontSize: 13 * fontMultiplier }]} numberOfLines={1}>
              {settings.theme === 'warm'
                ? 'Sáng ấm'
                : settings.theme === 'white'
                ? 'Sáng trắng'
                : 'Tối dịu'}
            </Text>
            <ChevronRight size={18} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {/* 4. Cỡ chữ */}
        <TouchableOpacity
          onPress={() => setActiveModal('font')}
          activeOpacity={0.7}
          style={styles.settingCard}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
              <Type size={20} color="#047857" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { fontSize: 15 * fontMultiplier }]} numberOfLines={1}>
                Cỡ chữ
              </Text>
              <Text style={[styles.settingSub, { fontSize: 12 * fontMultiplier }]} numberOfLines={2}>
                Tối ưu cho người cao tuổi
              </Text>
            </View>
          </View>

          <View style={styles.settingRight}>
            <Text
              style={[styles.settingValueGreen, { fontSize: 13 * fontMultiplier }]}
              numberOfLines={1}
            >
              {settings.fontSize === 'extra_large'
                ? 'Rất lớn'
                : settings.fontSize === 'large'
                ? 'Lớn (20px)'
                : 'Tiêu chuẩn'}
            </Text>
            <ChevronRight size={18} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {/* 5. Ngôn ngữ */}
        <TouchableOpacity
          onPress={() => {
            const nextLang = settings.language === 'vi' ? 'en' : 'vi';
            onUpdateSettings({ ...settings, language: nextLang });
          }}
          activeOpacity={0.7}
          style={styles.settingCard}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
              <Globe size={20} color="#0369A1" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { fontSize: 15 * fontMultiplier }]} numberOfLines={1}>
                Ngôn ngữ
              </Text>
              <Text style={[styles.settingSub, { fontSize: 12 * fontMultiplier }]} numberOfLines={2}>
                {settings.language === 'vi' ? 'Tiếng Việt' : 'English'}
              </Text>
            </View>
          </View>

          <View style={styles.settingRight}>
            <Text style={[styles.settingValue, { fontSize: 13 * fontMultiplier }]} numberOfLines={1}>
              {settings.language === 'vi' ? 'Tiếng Việt' : 'English'}
            </Text>
            <ChevronRight size={18} color="#94A3B8" />
          </View>
        </TouchableOpacity>

        {/* 6. Giới thiệu ứng dụng */}
        <TouchableOpacity
          onPress={() => setActiveModal('about')}
          activeOpacity={0.7}
          style={styles.settingCard}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
              <Info size={20} color="#7E22CE" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { fontSize: 15 * fontMultiplier }]} numberOfLines={1}>
                Giới thiệu ứng dụng
              </Text>
              <Text style={[styles.settingSub, { fontSize: 12 * fontMultiplier }]} numberOfLines={2}>
                Phiên bản 1.0.0 (Bính Ngọ 2026)
              </Text>
            </View>
          </View>

          <View style={styles.settingRight}>
            <ChevronRight size={18} color="#94A3B8" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Cỡ chữ */}
      <Modal
        visible={activeModal === 'font'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <Text style={styles.modalTitle}>Chọn cỡ chữ hiển thị</Text>
            {[
              { id: 'standard', title: 'Tiêu chuẩn (16px)', desc: 'Phù hợp người mắt sáng' },
              { id: 'large', title: 'Lớn (20px)', desc: 'Phù hợp cho người cao tuổi, dễ đọc' },
              { id: 'extra_large', title: 'Rất lớn (24px)', desc: 'Cỡ chữ cực lớn, rõ ràng nhất' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleFontSizeChange(item.id as any)}
                activeOpacity={0.7}
                style={[
                  styles.modalOption,
                  settings.fontSize === item.id && styles.modalOptionActive,
                ]}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.optionTitle}>{item.title}</Text>
                  <Text style={styles.optionDesc} numberOfLines={2}>{item.desc}</Text>
                </View>
                {settings.fontSize === item.id && <Check size={18} color="#B3261E" />}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal Lịch âm */}
      <Modal
        visible={activeModal === 'lunar'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <Text style={styles.modalTitle}>Chế độ hiển thị Âm lịch</Text>
            {[
              { id: 'full', title: 'Đầy đủ', desc: 'Ngày, tháng âm, Can Chi, Tiết khí, Hoàng đạo' },
              { id: 'basic', title: 'Cơ bản', desc: 'Ngày tháng âm và Can Chi chính' },
              { id: 'date_only', title: 'Chỉ ngày âm', desc: 'Chỉ hiện số ngày âm lịch nhỏ gọn' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleLunarModeChange(item.id as any)}
                activeOpacity={0.7}
                style={[
                  styles.modalOption,
                  settings.lunarDisplayMode === item.id && styles.modalOptionActive,
                ]}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.optionTitle}>{item.title}</Text>
                  <Text style={styles.optionDesc} numberOfLines={2}>{item.desc}</Text>
                </View>
                {settings.lunarDisplayMode === item.id && <Check size={18} color="#B3261E" />}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal Giao diện */}
      <Modal
        visible={activeModal === 'theme'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <Text style={styles.modalTitle}>Chọn tông màu giao diện</Text>
            {[
              { id: 'warm', title: 'Sáng ấm truyền thống', desc: 'Tông màu kem ấm, dịu mắt (Mặc định)' },
              { id: 'white', title: 'Sáng tiêu chuẩn', desc: 'Nền trắng sáng, tương phản cao' },
              { id: 'dark', title: 'Tối dịu mắt', desc: 'Phù hợp xem lịch vào ban đêm' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleThemeChange(item.id as any)}
                activeOpacity={0.7}
                style={[
                  styles.modalOption,
                  settings.theme === item.id && styles.modalOptionActive,
                ]}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.optionTitle}>{item.title}</Text>
                  <Text style={styles.optionDesc} numberOfLines={2}>{item.desc}</Text>
                </View>
                {settings.theme === item.id && <Check size={18} color="#B3261E" />}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal Giới thiệu */}
      <Modal
        visible={activeModal === 'about'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <Text style={styles.modalTitle}>Lịch An Nhiên (Lịch Việt)</Text>
            <Text style={styles.aboutText}>
              Ứng dụng Lịch Việt gìn giữ nét văn hóa truyền thống, cung cấp thông tin Âm Dương lịch, Can Chi, Tiết khí, Hoàng đạo chính xác theo thuật toán thiên văn chuẩn UTC+7 của Hồ Ngọc Đức.
            </Text>
            <Text style={[styles.aboutText, { marginTop: 8 }]}>
              Thiết kế đặc biệt tối ưu cho người cao tuổi với chữ to, độ tương phản cao, thao tác rõ ràng.
            </Text>
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
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileAvatarActive: {
    backgroundColor: '#B3261E',
  },
  profileAvatarChar: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 6,
  },
  profileName: {
    fontWeight: '700',
    color: '#0F172A',
  },
  profileStatus: {
    color: '#64748B',
    marginTop: 2,
    lineHeight: 17,
  },
  logoutIconBtn: {
    padding: 8,
    flexShrink: 0,
  },
  loginBannerBtn: {
    marginTop: 12,
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBannerBtnText: {
    color: '#B3261E',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },
  donateCard: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    shadowColor: '#B3261E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  donateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 6,
  },
  donateIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  donateTitle: {
    fontWeight: '700',
    color: '#9F1239',
  },
  donateSub: {
    color: '#E11D48',
    marginTop: 2,
    lineHeight: 16,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 6,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  settingTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  settingLabel: {
    fontWeight: '700',
    color: '#0F172A',
  },
  settingSub: {
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
    justifyContent: 'flex-end',
    maxWidth: '40%',
  },
  settingValue: {
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'right',
    flexShrink: 1,
  },
  settingValueGreen: {
    fontWeight: '700',
    color: '#047857',
    textAlign: 'right',
    flexShrink: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modalOptionActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FECDD3',
  },
  optionTitle: {
    fontWeight: '700',
    color: '#0F172A',
  },
  optionDesc: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  aboutText: {
    color: '#334155',
    lineHeight: 22,
  },
  modalCloseBtn: {
    marginTop: 16,
    backgroundColor: '#B3261E',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
