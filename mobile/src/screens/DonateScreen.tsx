import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import {
  ChevronLeft,
  Heart,
  Copy,
  Coffee,
  Gift,
  Sparkles,
  QrCode,
  Award,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react-native';
import { ScreenType, DonationConfig, DonationTransaction } from '../types';

interface DonateScreenProps {
  onNavigate: (screen: ScreenType) => void;
  fontMultiplier?: number;
}

const DEFAULT_CONFIG: DonationConfig = {
  bankBin: '970422',
  bankName: 'MB Bank (Ngân hàng Quân Đội)',
  accountNumber: '0988668899',
  accountHolder: 'NGUYEN TRUNG',
  qrTemplate: 'compact2',
  suggestedAmounts: [10000, 30000, 50000, 100000, 200000],
  momoPhone: '0988668899',
  momoName: 'NGUYEN TRUNG',
  transferSyntax: 'LICHVIET',
  thankYouMessage: 'Lịch An Nhiên xin chân thành cảm ơn tấm lòng hảo tâm và sự đồng hành của bạn!',
  isActive: true,
  defaultVietQrUrl: 'https://img.vietqr.io/image/970422-0988668899-compact2.png?amount=0&addInfo=LICHVIET&accountName=NGUYEN%20TRUNG',
};

export const DonateScreen: React.FC<DonateScreenProps> = ({
  onNavigate,
  fontMultiplier = 1,
}) => {
  const [config, setConfig] = useState<DonationConfig>(DEFAULT_CONFIG);
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form states
  const [senderName, setSenderName] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // Active Transaction state
  const [activeTransaction, setActiveTransaction] = useState<{
    id: string;
    transactionCode: string;
    vietQrUrl: string;
    amount: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showThankYouModal, setShowThankYouModal] = useState<boolean>(false);
  const [publicTransactions, setPublicTransactions] = useState<DonationTransaction[]>([]);

  // Load config & public transactions
  useEffect(() => {
    fetch('http://localhost:4000/api/v1/donation/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setConfig(data.data);
        }
      })
      .catch(() => {});

    fetch('http://localhost:4000/api/v1/donation/transactions?publicOnly=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPublicTransactions(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const effectiveAmount = isCustomMode ? parseInt(customAmountStr, 10) || 0 : selectedAmount;
  const effectiveSyntax = activeTransaction
    ? activeTransaction.transactionCode
    : `${config.transferSyntax || 'LICHVIET'}`;

  // VietQR Dynamic URL calculation
  const qrUrl = activeTransaction
    ? activeTransaction.vietQrUrl
    : `https://img.vietqr.io/image/${config.bankBin}-${config.accountNumber}-${config.qrTemplate}.png?amount=${effectiveAmount}&addInfo=${encodeURIComponent(
        effectiveSyntax
      )}&accountName=${encodeURIComponent(config.accountHolder)}`;

  const handleCopy = (text: string, label: string) => {
    setCopiedField(label);
    Alert.alert('Đã sao chép', `Đã sao chép ${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 3000);
  };

  // Tạo giao dịch ủng hộ với mã riêng biệt
  const handleGenerateTransaction = async () => {
    if (effectiveAmount <= 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn hoặc nhập số tiền ủng hộ lớn hơn 0đ');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:4000/api/v1/donation/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: effectiveAmount,
          paymentMethod: 'vietqr',
          senderName: senderName || undefined,
          senderEmail: senderEmail || undefined,
          message: message || undefined,
          isAnonymous,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setActiveTransaction({
          id: data.data.id,
          transactionCode: data.data.transactionCode,
          vietQrUrl: data.data.vietQrUrl,
          amount: data.data.amount,
        });
        Alert.alert(
          'Mã giao dịch riêng đã tạo!',
          `Mã thanh toán: ${data.data.transactionCode}. Bạn có thể quét mã QR hoặc sao chép để chuyển khoản.`
        );
      }
    } catch (err) {
      console.warn('Không thể tạo mã giao dịch, sử dụng mã mặc định', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xác nhận đã chuyển khoản
  const handleConfirmDonated = async () => {
    if (activeTransaction) {
      try {
        await fetch(
          `http://localhost:4000/api/v1/donation/transactions/${activeTransaction.id}/confirm`,
          { method: 'PATCH' }
        );
      } catch (err) {}
    }
    setShowThankYouModal(true);
  };

  const tiers = [
    { amount: 10000, label: 'Tách trà ấm', icon: 'tea' },
    { amount: 30000, label: 'Ly cà phê', icon: 'coffee' },
    { amount: 50000, label: 'Món quà nhỏ', icon: 'gift' },
    { amount: 100000, label: 'Tấm lòng vàng', icon: 'heart' },
    { amount: 200000, label: 'Đại hồng ân', icon: 'sparkle' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate('settings')}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#334155" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontSize: 16 * fontMultiplier }]} numberOfLines={1}>
          Ủng hộ Nhà phát triển
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Heartfelt Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.introIconCircle}>
            <Heart size={28} color="#B3261E" fill="#B3261E" />
          </View>
          <Text style={[styles.introTitle, { fontSize: 17 * fontMultiplier }]} numberOfLines={2}>
            Giữ truyền thống, gần gũi mỗi ngày
          </Text>
          <Text style={[styles.introText, { fontSize: 13 * fontMultiplier }]}>
            Lịch An Nhiên được xây dựng phi lợi nhuận, không chứa quảng cáo gây phiền toái cho người lớn tuổi. Sự ủng hộ ấm áp của bạn là động lực to lớn giúp đội ngũ duy trì máy chủ và hoàn thiện ứng dụng ngày càng tốt hơn!
          </Text>
        </View>

        {/* Gift Packages Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: 13 * fontMultiplier }]}>
            CHỌN MỨC ỦNG HỘ:
          </Text>
          <View style={styles.tiersGrid}>
            {tiers.map((t) => {
              const isSelected = !isCustomMode && selectedAmount === t.amount;
              return (
                <TouchableOpacity
                  key={t.amount}
                  onPress={() => {
                    setSelectedAmount(t.amount);
                    setIsCustomMode(false);
                    setActiveTransaction(null);
                  }}
                  activeOpacity={0.7}
                  style={[styles.tierCard, isSelected && styles.tierCardActive]}
                >
                  <View style={styles.tierIconRow}>
                    {t.icon === 'tea' && <Coffee size={18} color={isSelected ? '#B3261E' : '#B45309'} />}
                    {t.icon === 'coffee' && <Coffee size={18} color={isSelected ? '#B3261E' : '#78350F'} />}
                    {t.icon === 'gift' && <Gift size={18} color={isSelected ? '#B3261E' : '#E11D48'} />}
                    {t.icon === 'heart' && <Heart size={18} color="#B3261E" fill="#B3261E" />}
                    {t.icon === 'sparkle' && <Sparkles size={18} color={isSelected ? '#B3261E' : '#D97706'} />}
                  </View>
                  <Text
                    style={[
                      styles.tierAmount,
                      isSelected && styles.tierAmountActive,
                      { fontSize: 14 * fontMultiplier },
                    ]}
                    numberOfLines={1}
                  >
                    {t.amount.toLocaleString('vi-VN')}đ
                  </Text>
                  <Text style={[styles.tierLabel, { fontSize: 12 * fontMultiplier }]} numberOfLines={1}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Custom Amount Button */}
            <TouchableOpacity
              onPress={() => {
                setIsCustomMode(true);
                setActiveTransaction(null);
              }}
              activeOpacity={0.7}
              style={[styles.tierCard, isCustomMode && styles.tierCardActive]}
            >
              <View style={styles.tierIconRow}>
                <Sparkles size={18} color={isCustomMode ? '#B3261E' : '#D97706'} />
              </View>
              <Text
                style={[
                  styles.tierAmount,
                  isCustomMode && styles.tierAmountActive,
                  { fontSize: 14 * fontMultiplier },
                ]}
                numberOfLines={1}
              >
                Tùy tâm
              </Text>
              <Text style={[styles.tierLabel, { fontSize: 12 * fontMultiplier }]} numberOfLines={1}>
                Tự nhập số tiền
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Input */}
          {isCustomMode && (
            <View style={styles.customInputRow}>
              <Text style={[styles.customInputLabel, { fontSize: 13 * fontMultiplier }]}>
                Số tiền (VNĐ):
              </Text>
              <TextInput
                keyboardType="numeric"
                value={customAmountStr}
                onChangeText={(text) => {
                  setCustomAmountStr(text);
                  setActiveTransaction(null);
                }}
                placeholder="Ví dụ: 250000"
                placeholderTextColor="#94A3B8"
                style={[styles.customInput, { fontSize: 15 * fontMultiplier }]}
              />
            </View>
          )}
        </View>

        {/* VietQR Bank Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrCardHeaderRow}>
            <QrCode size={18} color="#B3261E" />
            <Text style={[styles.qrCardTitle, { fontSize: 15 * fontMultiplier }]} numberOfLines={1}>
              Mã VietQR Chuẩn Ngân Hàng (NAPAS 247)
            </Text>
          </View>
          <Text style={[styles.qrCardSub, { fontSize: 12 * fontMultiplier }]}>
            Mở app ngân hàng bất kỳ để quét mã tự động điền số tiền
          </Text>

          {/* QR Code Preview */}
          <View style={styles.qrWrapper}>
            <Image
              source={{ uri: qrUrl }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.qrAmountRow}>
            <Text style={[styles.qrAmountLabel, { fontSize: 13 * fontMultiplier }]}>Mức ủng hộ:</Text>
            <Text style={[styles.qrAmountVal, { fontSize: 16 * fontMultiplier }]}>
              {effectiveAmount.toLocaleString('vi-VN')} VNĐ
            </Text>
          </View>

          {activeTransaction && (
            <View style={styles.activeCodeBadge}>
              <ShieldCheck size={14} color="#059669" />
              <Text style={styles.activeCodeText}>
                Mã giao dịch riêng: {activeTransaction.transactionCode}
              </Text>
            </View>
          )}

          {/* Bank Details Table */}
          <View style={styles.bankInfoTable}>
            <View style={styles.bankInfoRow}>
              <Text style={[styles.bankInfoKey, { fontSize: 12 * fontMultiplier }]}>Ngân hàng</Text>
              <Text style={[styles.bankInfoVal, { fontSize: 13 * fontMultiplier }]}>
                {config.bankName}
              </Text>
            </View>

            <View style={styles.bankInfoRow}>
              <Text style={[styles.bankInfoKey, { fontSize: 12 * fontMultiplier }]}>Số tài khoản</Text>
              <View style={styles.copyRow}>
                <Text style={[styles.bankInfoValRed, { fontSize: 15 * fontMultiplier }]} numberOfLines={1}>
                  {config.accountNumber}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy(config.accountNumber, 'Số tài khoản')}
                  style={styles.copyBtn}
                  activeOpacity={0.7}
                >
                  <Copy size={13} color="#B3261E" />
                  <Text style={styles.copyBtnText}>Sao chép</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bankInfoRow}>
              <Text style={[styles.bankInfoKey, { fontSize: 12 * fontMultiplier }]}>Chủ tài khoản</Text>
              <Text style={[styles.bankInfoVal, { fontSize: 13 * fontMultiplier }]} numberOfLines={1}>
                {config.accountHolder}
              </Text>
            </View>

            <View style={styles.bankInfoRow}>
              <Text style={[styles.bankInfoKey, { fontSize: 12 * fontMultiplier }]}>Nội dung CK</Text>
              <View style={styles.copyRow}>
                <Text style={[styles.bankInfoValNote, { fontSize: 13 * fontMultiplier }]} numberOfLines={1}>
                  {effectiveSyntax}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy(effectiveSyntax, 'Nội dung')}
                  style={styles.copyBtn}
                  activeOpacity={0.7}
                >
                  <Copy size={13} color="#B3261E" />
                  <Text style={styles.copyBtnText}>Sao chép</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* MoMo Option */}
        {config.momoPhone && (
          <View style={styles.momoCard}>
            <View style={styles.momoHeader}>
              <View style={styles.momoBadge}>
                <Text style={styles.momoBadgeText}>MoMo</Text>
              </View>
              <Text style={[styles.momoTitle, { fontSize: 14 * fontMultiplier }]} numberOfLines={1}>
                Hoặc ví điện tử MoMo
              </Text>
            </View>
            <View style={styles.momoBody}>
              <Text style={[styles.momoNumber, { fontSize: 13 * fontMultiplier }]} numberOfLines={2}>
                {config.momoPhone} ({config.momoName || config.accountHolder})
              </Text>
              <TouchableOpacity
                onPress={() => handleCopy(config.momoPhone || '', 'Số MoMo')}
                style={styles.copyBtn}
                activeOpacity={0.7}
              >
                <Copy size={13} color="#B3261E" />
                <Text style={styles.copyBtnText}>Sao chép</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Donor Message & Appreciation Form */}
        <View style={styles.formCard}>
          <View style={styles.formHeaderRow}>
            <MessageSquare size={16} color="#B3261E" />
            <Text style={[styles.formTitle, { fontSize: 13 * fontMultiplier }]}>
              GỬI LỜI NHẮN & VINH DANH (TÙY CHỌN)
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { fontSize: 12 * fontMultiplier }]}>Tên của bạn:</Text>
            <TextInput
              value={senderName}
              onChangeText={setSenderName}
              editable={!isAnonymous}
              placeholder={isAnonymous ? 'Đã ẩn danh' : 'Ví dụ: Cô Lan (Hải Phòng)'}
              placeholderTextColor="#94A3B8"
              style={[styles.textInput, isAnonymous && styles.textInputDisabled]}
            />
          </View>

          <TouchableOpacity
            onPress={() => setIsAnonymous(!isAnonymous)}
            style={styles.checkboxRow}
            activeOpacity={0.7}
          >
            <View style={[styles.checkboxBox, isAnonymous && styles.checkboxBoxActive]}>
              {isAnonymous && <Check size={12} color="#FFFFFF" />}
            </View>
            <Text style={[styles.checkboxLabel, { fontSize: 12 * fontMultiplier }]}>
              Ủng hộ ẩn danh (không hiện tên trên bảng tri ân)
            </Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { fontSize: 12 * fontMultiplier }]}>Email nhận thư cảm ơn:</Text>
            <TextInput
              value={senderEmail}
              onChangeText={setSenderEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="tenban@gmail.com"
              placeholderTextColor="#94A3B8"
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { fontSize: 12 * fontMultiplier }]}>Lời nhắn gửi nhà phát triển:</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={2}
              placeholder="Gửi lời chúc hoặc ý kiến đóng góp của bạn..."
              placeholderTextColor="#94A3B8"
              style={[styles.textInput, { height: 60, textAlignVertical: 'top' }]}
            />
          </View>

          {!activeTransaction && (
            <TouchableOpacity
              onPress={handleGenerateTransaction}
              disabled={isSubmitting}
              style={styles.generateBtn}
              activeOpacity={0.8}
            >
              <Sparkles size={16} color="#B45309" />
              <Text style={styles.generateBtnText}>Tạo mã chuyển khoản gắn lời nhắn này</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Thank You Action Button */}
        <TouchableOpacity
          onPress={handleConfirmDonated}
          activeOpacity={0.8}
          style={styles.thankBtn}
        >
          <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={[styles.thankBtnText, { fontSize: 14 * fontMultiplier }]}>
            Tôi đã chuyển khoản - Xác nhận ủng hộ!
          </Text>
        </TouchableOpacity>

        {/* Bảng Vàng Tri Ân (Public Donor Honor Roll) */}
        {publicTransactions.length > 0 && (
          <View style={styles.boardCard}>
            <View style={styles.boardHeaderRow}>
              <View style={styles.boardTitleGroup}>
                <Award size={18} color="#D97706" />
                <Text style={[styles.boardTitle, { fontSize: 13 * fontMultiplier }]}>
                  BẢNG VÀNG TRI ÂN CỘNG ĐỒNG
                </Text>
              </View>
              <Text style={styles.boardSub}>{publicTransactions.length} người ủng hộ gần nhất</Text>
            </View>

            <View style={styles.boardList}>
              {publicTransactions.map((item) => (
                <View key={item.id} style={styles.boardItem}>
                  <View style={styles.boardItemTop}>
                    <Text style={[styles.boardItemName, { fontSize: 13 * fontMultiplier }]} numberOfLines={1}>
                      ❤️ {item.sender_name}
                    </Text>
                    <Text style={[styles.boardItemAmount, { fontSize: 13 * fontMultiplier }]}>
                      +{item.amount.toLocaleString('vi-VN')} đ
                    </Text>
                  </View>
                  {item.message ? (
                    <Text style={[styles.boardItemMsg, { fontSize: 12 * fontMultiplier }]} numberOfLines={2}>
                      "{item.message}"
                    </Text>
                  ) : null}
                  <Text style={styles.boardItemDate}>{item.created_at.split(' ')[0]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Thank You Modal */}
      <Modal visible={showThankYouModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconCircle}>
              <Heart size={36} color="#B3261E" fill="#B3261E" />
            </View>
            <Text style={[styles.modalTitle, { fontSize: 18 * fontMultiplier }]}>
              Tri ân tấm lòng vàng!
            </Text>
            <Text style={[styles.modalText, { fontSize: 13 * fontMultiplier }]}>
              {config.thankYouMessage ||
                'Lịch An Nhiên xin chân thành cảm ơn tấm lòng hảo tâm và sự đồng hành của bạn! Chúc bạn và gia quyến luôn vạn sự cát tường, an khang thịnh vượng!'}
            </Text>

            {senderEmail ? (
              <View style={styles.modalEmailBox}>
                <Text style={styles.modalEmailText}>
                  ✉️ Thư tri ân kèm lời chúc đã được chuẩn bị gửi tới {senderEmail}.
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => setShowThankYouModal(false)}
              style={styles.modalCloseBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseBtnText}>Đóng và tiếp tục xem lịch</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    gap: 14,
  },
  introCard: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  introIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  introTitle: {
    fontWeight: '800',
    color: '#9F1239',
    textAlign: 'center',
  },
  introText: {
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  tiersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  tierCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tierCardActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#B3261E',
    borderWidth: 2,
  },
  tierIconRow: {
    marginBottom: 2,
  },
  tierAmount: {
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  tierAmountActive: {
    color: '#B3261E',
  },
  tierLabel: {
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  customInputRow: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customInputLabel: {
    fontWeight: '700',
    color: '#475569',
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontWeight: '800',
    color: '#B3261E',
    backgroundColor: '#FFFFFF',
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  qrCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  qrCardTitle: {
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  qrCardSub: {
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  qrWrapper: {
    width: 210,
    height: 210,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  qrAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  qrAmountLabel: {
    color: '#64748B',
    fontWeight: '500',
  },
  qrAmountVal: {
    color: '#B3261E',
    fontWeight: '900',
  },
  activeCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  activeCodeText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 11,
  },
  bankInfoTable: {
    width: '100%',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 12,
  },
  bankInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  bankInfoKey: {
    color: '#64748B',
    fontWeight: '500',
    minWidth: 85,
    flexShrink: 0,
    paddingTop: 2,
  },
  bankInfoVal: {
    color: '#0F172A',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  bankInfoValRed: {
    color: '#B3261E',
    fontWeight: '800',
    flexShrink: 1,
  },
  bankInfoValNote: {
    color: '#0F172A',
    fontWeight: '700',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 1,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    justifyContent: 'flex-end',
    flex: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    flexShrink: 0,
  },
  copyBtnText: {
    color: '#B3261E',
    fontWeight: '700',
    fontSize: 11,
  },
  momoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  momoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  momoBadge: {
    backgroundColor: '#A50064',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
  },
  momoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  momoTitle: {
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  momoBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  momoNumber: {
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  formHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  formTitle: {
    fontWeight: '800',
    color: '#334155',
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontWeight: '600',
    color: '#475569',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  textInputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#94A3B8',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxBoxActive: {
    backgroundColor: '#B3261E',
    borderColor: '#B3261E',
  },
  checkboxLabel: {
    color: '#334155',
    fontWeight: '500',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  generateBtnText: {
    color: '#92400E',
    fontWeight: '700',
    fontSize: 12,
  },
  thankBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B3261E',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#B3261E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  thankBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  boardCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  boardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  boardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boardTitle: {
    fontWeight: '800',
    color: '#0F172A',
  },
  boardSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
  boardList: {
    gap: 8,
  },
  boardItem: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  boardItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boardItemName: {
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  boardItemAmount: {
    fontWeight: '900',
    color: '#B3261E',
  },
  boardItemMsg: {
    color: '#475569',
    fontStyle: 'italic',
  },
  boardItemDate: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: 12,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalText: {
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalEmailBox: {
    backgroundColor: '#FFF1F2',
    padding: 8,
    borderRadius: 10,
    width: '100%',
  },
  modalEmailText: {
    color: '#B3261E',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalCloseBtn: {
    backgroundColor: '#B3261E',
    paddingVertical: 12,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
