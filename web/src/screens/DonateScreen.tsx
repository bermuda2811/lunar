import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Heart,
  Copy,
  Check,
  Coffee,
  Gift,
  Sparkles,
  QrCode,
  Send,
  MessageSquare,
  Award,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ScreenType, DonationConfig, DonationTransaction } from '../types';
import { StatusBar } from '../components/StatusBar';

interface DonateScreenProps {
  onNavigate: (screen: ScreenType) => void;
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
  defaultVietQrUrl: 'https://img.vietqr.io/image/970422-0988668899-compact2.png?amount=0&addInfo=LICHVIET&accountName=NGUYEN%20TRUNG'
};

export const DonateScreen: React.FC<DonateScreenProps> = ({ onNavigate }) => {
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
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setConfig(data.data);
        }
      })
      .catch(() => {});

    fetch('http://localhost:4000/api/v1/donation/transactions?publicOnly=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setPublicTransactions(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const effectiveAmount = isCustomMode ? (parseInt(customAmountStr, 10) || 0) : selectedAmount;
  const effectiveSyntax = activeTransaction ? activeTransaction.transactionCode : `${config.transferSyntax || 'LICHVIET'}`;

  // VietQR Dynamic URL calculation
  const qrUrl = activeTransaction
    ? activeTransaction.vietQrUrl
    : `https://img.vietqr.io/image/${config.bankBin}-${config.accountNumber}-${config.qrTemplate}.png?amount=${effectiveAmount}&addInfo=${encodeURIComponent(effectiveSyntax)}&accountName=${encodeURIComponent(config.accountHolder)}`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 3000);
  };

  // Tạo giao dịch ủng hộ với mã riêng biệt
  const handleGenerateTransaction = async () => {
    if (effectiveAmount <= 0) {
      alert('Vui lòng chọn hoặc nhập số tiền ủng hộ lớn hơn 0đ');
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
        await fetch(`http://localhost:4000/api/v1/donation/transactions/${activeTransaction.id}/confirm`, {
          method: 'PATCH',
        });
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
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] select-none">
      <StatusBar />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
        <button
          onClick={() => onNavigate('settings')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-700 shrink-0 cursor-pointer"
          title="Quay lại"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-base font-bold text-slate-900 truncate flex-1 text-center mx-2">
          Ủng hộ Nhà phát triển
        </h1>

        <div className="w-10 shrink-0"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Heartfelt Intro Card */}
        <div className="bg-gradient-to-br from-rose-50 via-red-50 to-amber-50 border border-rose-200/80 rounded-2xl p-4 text-center space-y-2 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-[#B3261E] flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-6 h-6 fill-[#B3261E]" />
          </div>
          <h2 className="text-base font-bold text-slate-900 truncate">
            Cảm ơn tấm lòng của bạn!
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            <strong>Lịch An Nhiên (Lịch Việt)</strong> được xây dựng phi lợi nhuận, tuyệt đối không chèn quảng cáo làm phiền người cao tuổi. Sự ủng hộ của bạn giúp duy trì máy chủ và phát triển thêm tiện ích mới.
          </p>
        </div>

        {/* Tiers Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Chọn mức ủng hộ:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {tiers.map((t) => {
              const isSelected = !isCustomMode && selectedAmount === t.amount;
              return (
                <button
                  key={t.amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(t.amount);
                    setIsCustomMode(false);
                    setActiveTransaction(null);
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer min-w-0 ${
                    isSelected
                      ? 'bg-rose-50 border-[#B3261E] ring-2 ring-rose-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-slate-700 min-w-0 max-w-full">
                    {t.icon === 'tea' && <Coffee className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                    {t.icon === 'coffee' && <Coffee className="w-3.5 h-3.5 text-amber-900 shrink-0" />}
                    {t.icon === 'gift' && <Gift className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                    {t.icon === 'heart' && <Heart className="w-3.5 h-3.5 text-[#B3261E] shrink-0 fill-[#B3261E]" />}
                    {t.icon === 'sparkle' && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    <span className="text-xs font-bold text-slate-800 truncate">{t.label}</span>
                  </div>
                  <span className={`text-sm font-black truncate max-w-full ${isSelected ? 'text-[#B3261E]' : 'text-slate-900'}`}>
                    {t.amount.toLocaleString('vi-VN')} đ
                  </span>
                </button>
              );
            })}

            {/* Custom Amount Button */}
            <button
              type="button"
              onClick={() => {
                setIsCustomMode(true);
                setActiveTransaction(null);
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer min-w-0 ${
                isCustomMode
                  ? 'bg-rose-50 border-[#B3261E] ring-2 ring-rose-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-xs font-bold text-slate-800">Tùy tâm</span>
              </div>
              <span className={`text-sm font-black ${isCustomMode ? 'text-[#B3261E]' : 'text-slate-900'}`}>
                Tự nhập số tiền
              </span>
            </button>
          </div>

          {/* Custom Amount Input Field */}
          {isCustomMode && (
            <div className="mt-3 bg-white p-3 rounded-xl border border-rose-200 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Số tiền (VNĐ):</span>
              <input
                type="number"
                value={customAmountStr}
                onChange={(e) => {
                  setCustomAmountStr(e.target.value);
                  setActiveTransaction(null);
                }}
                placeholder="Ví dụ: 250000"
                className="flex-1 px-3 py-1.5 text-sm font-bold text-[#B3261E] border border-slate-200 rounded-lg outline-none focus:border-[#B3261E]"
              />
            </div>
          )}
        </div>

        {/* VietQR Display */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <QrCode className="w-4 h-4 text-[#B3261E]" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Mã VietQR Chuẩn Ngân Hàng (NAPAS 247)
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-2">
            Mở bất kỳ ứng dụng ngân hàng hoặc MoMo để quét mã tự động điền số tiền
          </p>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-inner my-1 max-w-[240px]">
            <img
              src={qrUrl}
              alt="Mã VietQR Chuyển khoản"
              className="w-48 sm:w-52 h-auto object-contain rounded-lg"
              loading="lazy"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-600">Mức ủng hộ:</span>
            <span className="text-sm font-black text-[#B3261E]">
              {effectiveAmount.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>

          {activeTransaction && (
            <div className="mt-2 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Mã giao dịch riêng: {activeTransaction.transactionCode}
            </div>
          )}
        </div>

        {/* Bank Details Card with Copy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-1.5 border-b border-slate-100 flex items-center justify-between">
            <span>Thông tin chuyển khoản thủ công</span>
            <span className="text-[10px] text-slate-400 font-normal">Chạm để sao chép</span>
          </div>

          {/* Ngân hàng */}
          <div className="flex items-start justify-between text-xs py-1 gap-2">
            <span className="text-slate-500 shrink-0 min-w-[85px] pt-0.5">Ngân hàng</span>
            <span className="font-bold text-slate-900 text-right flex-1 break-words">{config.bankName}</span>
          </div>

          {/* Số tài khoản */}
          <div className="flex items-center justify-between text-xs py-1 gap-2">
            <span className="text-slate-500 shrink-0 min-w-[85px]">Số tài khoản</span>
            <div className="flex items-center gap-2 shrink-0 justify-end flex-1">
              <span className="font-black text-sm text-[#B3261E] tracking-wider truncate">
                {config.accountNumber}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(config.accountNumber, 'Số tài khoản')}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shrink-0 cursor-pointer flex items-center gap-1"
                title="Sao chép số tài khoản"
              >
                {copiedField === 'Số tài khoản' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span className="text-[10px] font-bold text-[#B3261E]">Sao chép</span>
              </button>
            </div>
          </div>

          {/* Chủ tài khoản */}
          <div className="flex items-center justify-between text-xs py-1 gap-2">
            <span className="text-slate-500 shrink-0 min-w-[85px]">Chủ tài khoản</span>
            <span className="font-bold text-slate-900 text-right flex-1 truncate">{config.accountHolder}</span>
          </div>

          {/* Nội dung chuyển */}
          <div className="flex items-center justify-between text-xs py-1 gap-2">
            <span className="text-slate-500 shrink-0 min-w-[85px]">Nội dung CK</span>
            <div className="flex items-center gap-2 shrink-0 justify-end flex-1">
              <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[140px]">
                {effectiveSyntax}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(effectiveSyntax, 'Nội dung')}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shrink-0 cursor-pointer flex items-center gap-1"
                title="Sao chép nội dung"
              >
                {copiedField === 'Nội dung' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span className="text-[10px] font-bold text-[#B3261E]">Sao chép</span>
              </button>
            </div>
          </div>
        </div>

        {/* MoMo Option */}
        {config.momoPhone && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="bg-[#A50064] text-white text-[10px] font-black px-2 py-0.5 rounded shrink-0">
                MoMo
              </span>
              <span className="text-xs font-bold text-slate-900 truncate">
                Hoặc ví điện tử MoMo
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-700 truncate flex-1">
                {config.momoPhone} ({config.momoName || config.accountHolder})
              </span>
              <button
                type="button"
                onClick={() => handleCopy(config.momoPhone || '', 'Số MoMo')}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shrink-0 cursor-pointer flex items-center gap-1"
                title="Sao chép số MoMo"
              >
                {copiedField === 'Số MoMo' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span className="text-[10px] font-bold text-[#B3261E]">Sao chép</span>
              </button>
            </div>
          </div>
        )}

        {/* Donor Message & Appreciation Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <MessageSquare className="w-4 h-4 text-[#B3261E]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Gửi lời nhắn & Vinh danh (Tùy chọn)
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Tên của bạn:</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                disabled={isAnonymous}
                placeholder={isAnonymous ? 'Đã ẩn danh' : 'Ví dụ: Cô Lan (Hải Phòng)'}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#B3261E] bg-slate-50/50 disabled:bg-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="anonCheck"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-[#B3261E] rounded border-slate-300 focus:ring-[#B3261E] cursor-pointer"
              />
              <label htmlFor="anonCheck" className="text-slate-700 font-medium cursor-pointer select-none">
                Ủng hộ ẩn danh (không hiện tên trên bảng tri ân)
              </label>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email nhận thư cảm ơn:</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="tenban@gmail.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#B3261E] bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Lời nhắn gửi nhà phát triển:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Gửi lời chúc hoặc ý kiến đóng góp của bạn..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#B3261E] bg-slate-50/50 resize-none"
              />
            </div>

            {!activeTransaction && (
              <button
                type="button"
                onClick={handleGenerateTransaction}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Tạo mã chuyển khoản gắn lời nhắn này</span>
              </button>
            )}
          </div>
        </div>

        {/* Thank You Action Button */}
        <button
          type="button"
          onClick={handleConfirmDonated}
          className="w-full py-3.5 px-4 bg-[#B3261E] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-red-900/30 hover:bg-[#8B1D1D] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-white shrink-0" />
          <span className="truncate">Tôi đã chuyển khoản - Xác nhận ủng hộ!</span>
        </button>

        {/* Bảng Vàng Tri Ân (Public Donor Honor Roll) */}
        {publicTransactions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Bảng vàng tri ân cộng đồng
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {publicTransactions.length} người ủng hộ gần nhất
              </span>
            </div>

            <div className="space-y-2.5">
              {publicTransactions.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#B3261E] fill-[#B3261E]" />
                      {item.sender_name}
                    </span>
                    <span className="font-black text-[#B3261E]">
                      +{item.amount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  {item.message && (
                    <p className="text-[11px] text-slate-600 italic line-clamp-2">
                      "{item.message}"
                    </p>
                  )}
                  <div className="text-[9px] text-slate-400 text-right">
                    {item.created_at.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-rose-100">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#B3261E] flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
              <Heart className="w-8 h-8 fill-[#B3261E]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                Tri ân tấm lòng vàng!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {config.thankYouMessage || 'Lịch An Nhiên xin chân thành cảm ơn tấm lòng hảo tâm và sự đồng hành của bạn! Chúc bạn và gia quyến luôn vạn sự cát tường, an khang thịnh vượng!'}
              </p>
            </div>

            {senderEmail && (
              <div className="bg-rose-50 p-2.5 rounded-xl text-[11px] text-[#B3261E] font-medium">
                ✉️ Thư tri ân kèm lời chúc đã được chuẩn bị gửi tới <strong>{senderEmail}</strong>.
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowThankYouModal(false)}
              className="w-full py-3 bg-[#B3261E] text-white rounded-xl text-xs font-bold hover:bg-[#8B1D1D] transition-all cursor-pointer"
            >
              Đóng và tiếp tục xem lịch
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
