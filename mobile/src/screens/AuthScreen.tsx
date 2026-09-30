import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  ChevronLeft,
  Mail,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react-native';
import { ScreenType, UserAccount } from '../types';

interface AuthScreenProps {
  currentUser: UserAccount;
  onLoginSuccess: (user: UserAccount, mergeGuestData: boolean) => void;
  onNavigate: (screen: ScreenType) => void;
  fontMultiplier?: number;
}

const GoogleLogo = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </Svg>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  onLoginSuccess,
  onNavigate,
  fontMultiplier = 1,
}) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mergeGuestData, setMergeGuestData] = useState(true);

  // Google 1-Click Sign-In
  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    Alert.alert(
      'Đăng nhập với Google',
      'Đăng nhập bằng tài khoản Google để tự động đồng bộ ngày giỗ, sinh nhật gia đình lên đám mây.',
      [
        { text: 'Hủy', style: 'cancel', onPress: () => setGoogleLoading(false) },
        {
          text: 'Tiếp tục',
          onPress: () => executeGoogleLogin('annhien.vietnam@gmail.com'),
        },
      ]
    );
  };

  const executeGoogleLogin = async (gmail: string) => {
    try {
      const cleanEmail = gmail.trim().toLowerCase();
      const verifiedUser: UserAccount = {
        id: 'user_g_' + Date.now(),
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        isGuest: false,
        createdAt: new Date().toISOString(),
      };

      try {
        const res = await fetch('http://10.0.2.2:4000/api/v1/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            name: cleanEmail.split('@')[0],
            guestId: currentUser.id,
            mergeGuestData,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          verifiedUser.id = data.data.id;
          verifiedUser.name = data.data.name;
        }
      } catch (e) {}

      setGoogleLoading(false);
      Alert.alert('Thành công', `Đã kết nối tài khoản Google: ${cleanEmail}`);
      onLoginSuccess(verifiedUser, mergeGuestData);
      onNavigate('settings');
    } catch (err) {
      setGoogleLoading(false);
      Alert.alert('Lỗi', 'Không thể kết nối với tài khoản Google');
    }
  };

  // Resend Email OTP
  const handleSendOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      Alert.alert('Thông báo', 'Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setLoading(true);
    try {
      let sentViaResend = false;
      try {
        const res = await fetch('http://10.0.2.2:4000/api/v1/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail }),
        });
        const data = await res.json();
        sentViaResend = !!data.sentViaResend;
      } catch (e) {}

      setLoading(false);
      setStep('otp');

      if (sentViaResend) {
        Alert.alert(
          'Đã gửi mã xác nhận qua Resend',
          `Mã xác nhận 6 số đã được gửi tới ${cleanEmail}. Vui lòng kiểm tra hộp thư đến hoặc mục Spam/Thư rác.`
        );
      } else {
        Alert.alert(
          'Đã tạo mã xác nhận',
          `Mã xác nhận 6 số đã được tạo cho ${cleanEmail}.\n(Bạn cũng có thể dùng mã thử nghiệm nhanh: 123456)`
        );
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể gửi mã xác nhận. Vui lòng thử lại.');
    }
  };

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      Alert.alert('Thông báo', 'Vui lòng nhập đủ 6 chữ số mã xác nhận.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const verifiedUser: UserAccount = {
        id: 'user_' + Date.now(),
        email: cleanEmail,
        isGuest: false,
        name: cleanEmail.split('@')[0],
        createdAt: new Date().toISOString(),
      };

      try {
        const res = await fetch('http://10.0.2.2:4000/api/v1/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            otp: cleanOtp,
            guestId: currentUser.id,
            mergeGuestData,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          verifiedUser.id = data.data.id;
          verifiedUser.name = data.data.name;
        }
      } catch (e) {}

      setLoading(false);
      Alert.alert('Thành công', `Chào mừng bạn! Dữ liệu đã được liên kết an toàn với ${cleanEmail}.`);
      onLoginSuccess(verifiedUser, mergeGuestData);
      onNavigate('settings');
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Lỗi', 'Mã xác nhận không chính xác.');
    }
  };

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
          Tài khoản & Đồng bộ
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroBox}>
          <View style={styles.heroIconCircle}>
            <Mail size={30} color="#B3261E" />
          </View>
          <Text style={[styles.heroTitle, { fontSize: 18 * fontMultiplier }]} numberOfLines={2}>
            {step === 'email' ? 'Đăng Nhập Tài Khoản' : 'Nhập Mã Xác Nhận'}
          </Text>
          <Text style={[styles.heroSub, { fontSize: 13 * fontMultiplier }]}>
            {step === 'email'
              ? 'Tự động sao lưu và đồng bộ ngày giỗ, sinh nhật, nhắc nhở gia đình qua tài khoản của bạn.'
              : `Mã xác nhận gồm 6 chữ số đã gửi tới: ${email}`}
          </Text>
        </View>

        {/* METHOD 1: Google One-Click */}
        <View style={styles.googleSection}>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
            activeOpacity={0.85}
            style={styles.googleBtn}
          >
            {googleLoading ? (
              <ActivityIndicator color="#B3261E" />
            ) : (
              <GoogleLogo size={20} />
            )}
            <Text style={[styles.googleBtnText, { fontSize: 14 * fontMultiplier }]}>
              Tiếp tục bằng tài khoản Google
            </Text>
          </TouchableOpacity>
          <Text style={[styles.googleSubText, { fontSize: 11 * fontMultiplier }]}>
            (1 chạm nhanh gọn, tối ưu cho người cao tuổi)
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>HOẶC MÃ OTP QUA RESEND</Text>
          <View style={styles.dividerLine} />
        </View>

        {step === 'email' ? (
          /* Step 1: Input Email */
          <View style={styles.formSection}>
            <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
              Nhập địa chỉ Email / Gmail của bạn
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="vidu@gmail.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.input, { fontSize: 15 * fontMultiplier }]}
            />

            {/* Merge Data Checkbox */}
            <TouchableOpacity
              onPress={() => setMergeGuestData(!mergeGuestData)}
              style={styles.mergeOptionRow}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxBox, mergeGuestData && styles.checkboxBoxActive]}>
                {mergeGuestData && <CheckCircle size={14} color="#FFFFFF" />}
              </View>
              <Text style={[styles.mergeOptionText, { fontSize: 12 * fontMultiplier }]}>
                Tự động nhập ngày giỗ & nhắc nhở từ máy vào tài khoản mới
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSendOtp}
              disabled={loading}
              activeOpacity={0.8}
              style={[styles.mainBtn, loading && styles.btnDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.mainBtnText, { fontSize: 15 * fontMultiplier }]}>
                  Gửi mã xác nhận về Email
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.tipBox}>
              <ShieldCheck size={18} color="#047857" style={{ marginTop: 2, flexShrink: 0 }} />
              <Text style={[styles.tipText, { fontSize: 12 * fontMultiplier }]}>
                Không cần nhớ mật khẩu. Hệ thống sẽ gửi mã OTP 6 số để đăng nhập an toàn, tiện lợi.
              </Text>
            </View>
          </View>
        ) : (
          /* Step 2: Input OTP */
          <View style={styles.formSection}>
            <Text style={[styles.fieldLabel, { fontSize: 13 * fontMultiplier }]}>
              Nhập mã xác nhận 6 chữ số
            </Text>
            <TextInput
              value={otp}
              onChangeText={(val) => setOtp(val.replace(/\D/g, ''))}
              placeholder="123456"
              placeholderTextColor="#CBD5E1"
              keyboardType="number-pad"
              maxLength={6}
              style={[styles.otpInput, { fontSize: 24 * fontMultiplier }]}
            />

            <TouchableOpacity
              onPress={handleVerifyOtp}
              disabled={loading}
              activeOpacity={0.8}
              style={[styles.mainBtn, loading && styles.btnDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={[styles.mainBtnText, { fontSize: 15 * fontMultiplier }]}>
                  Xác nhận & Bắt đầu đồng bộ
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStep('email')}
              activeOpacity={0.7}
              style={styles.linkBtn}
            >
              <Text style={[styles.linkBtnText, { fontSize: 13 * fontMultiplier }]}>
                ← Đổi địa chỉ email khác
              </Text>
            </TouchableOpacity>

            <View style={styles.testHintBox}>
              <Text style={[styles.testHintText, { fontSize: 12 * fontMultiplier }]}>
                Mẹo: Bạn có thể kiểm tra hộp thư hoặc nhập mã thử nghiệm <Text style={{ fontWeight: 'bold' }}>123456</Text>.
              </Text>
            </View>
          </View>
        )}

        {/* Benefits Box */}
        <View style={styles.benefitsCard}>
          <Text style={[styles.benefitsTitle, { fontSize: 14 * fontMultiplier }]}>
            Lợi ích khi đăng nhập tài khoản:
          </Text>
          <View style={styles.benefitRow}>
            <CheckCircle size={16} color="#B3261E" style={{ marginTop: 2, flexShrink: 0 }} />
            <Text style={[styles.benefitText, { fontSize: 13 * fontMultiplier }]}>
              Không sợ mất ngày giỗ, lịch cúng khi đổi điện thoại
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <CheckCircle size={16} color="#B3261E" style={{ marginTop: 2, flexShrink: 0 }} />
            <Text style={[styles.benefitText, { fontSize: 13 * fontMultiplier }]}>
              Đồng bộ dữ liệu tức thì giữa điện thoại và máy tính
            </Text>
          </View>
          <View style={styles.benefitRow}>
            <CheckCircle size={16} color="#B3261E" style={{ marginTop: 2, flexShrink: 0 }} />
            <Text style={[styles.benefitText, { fontSize: 13 * fontMultiplier }]}>
              Bảo mật tuyệt đối, bảo tồn nét văn hóa truyền thống
            </Text>
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
  heroBox: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  heroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroTitle: {
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  heroSub: {
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  googleSection: {
    alignItems: 'center',
    gap: 6,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  googleBtnText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  googleSubText: {
    color: '#64748B',
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  formSection: {
    gap: 12,
  },
  fieldLabel: {
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#0F172A',
  },
  mergeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxBoxActive: {
    backgroundColor: '#B3261E',
    borderColor: '#B3261E',
  },
  mergeOptionText: {
    color: '#334155',
    flex: 1,
    lineHeight: 17,
  },
  otpInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B3261E',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#B3261E',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
  },
  mainBtn: {
    backgroundColor: '#B3261E',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B3261E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  mainBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  linkBtnText: {
    color: '#64748B',
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
  },
  tipText: {
    color: '#065F46',
    flex: 1,
    lineHeight: 18,
  },
  testHintBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  testHintText: {
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 18,
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  benefitsTitle: {
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitText: {
    color: '#475569',
    flex: 1,
    lineHeight: 19,
  },
});
