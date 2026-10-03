import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Heart,
  ExternalLink,
  Sparkles,
  Compass,
  Check,
  Copy,
  Plus,
  Trash2,
  X,
  ShieldCheck,
  Mail,
  LogOut,
  CalendarDays,
  Clock,
  ArrowRightLeft,
  BookOpen,
  Search,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

import { ReminderItem, AppSettings, UserAccount, DonationConfig } from '../types';
import {
  getFullDayData,
  solarToLunar,
  lunarToSolar,
  getCanChi,
  getTietKhi,
  getDayRating,
  getAuspiciousHours,
  SolarDate,
  LunarDate
} from '../domain/lunarCalendar';

interface CalendarWebAppProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  currentUser: UserAccount;
  onLoginSuccess: (user: UserAccount, mergeGuestData: boolean) => void;
  onLogout: () => void;
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (newRem: ReminderItem) => void;
  onDeleteReminder?: (id: string) => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export type WebTab = 'today' | 'month' | 'events' | 'reminders' | 'donate';

export const CalendarWebApp: React.FC<CalendarWebAppProps> = ({
  currentDate,
  onDateChange,
  currentUser,
  onLoginSuccess,
  onLogout,
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<WebTab>('today');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [accountModalTab, setAccountModalTab] = useState<'account' | 'converter'>('account');
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState<boolean>(false);
  const [selectedEventModal, setSelectedEventModal] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('all');

  // Day data for currentDate
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const dayData = useMemo(() => getFullDayData(day, month, year), [day, month, year]);

  // Check if viewing today
  const isToday = useMemo(() => {
    const now = new Date();
    return (
      currentDate.getDate() === now.getDate() &&
      currentDate.getMonth() === now.getMonth() &&
      currentDate.getFullYear() === now.getFullYear()
    );
  }, [currentDate]);

  // Current system real-time hour to highlight active double-hour
  const currentHour = new Date().getHours();

  // Navigation handlers
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

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-').map(Number);
      if (y && m && d) {
        onDateChange(new Date(y, m - 1, d));
      }
    }
  };

  // Cultural events list
  const culturalEvents = [
    {
      id: 1,
      title: 'Tết Dương Lịch',
      dateStr: '1/1',
      calendarType: 'solar',
      category: 'Lễ Quốc Tế & Nghỉ Lễ',
      summary: 'Ngày đầu tiên của năm theo Dương lịch, khởi đầu cho vạn sự may mắn.',
      meaning: 'Đánh dấu sự khởi đầu của một chu kỳ 365 ngày mới, thời điểm sum họp và gửi gắm những ước vọng tốt đẹp nhất cho năm mới.',
      traditions: 'Sum họp gia đình, đón giao thừa đếm ngược, chúc mừng và tặng quà đầu năm.',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 2,
      title: 'Tết Nguyên Đán (Bính Ngọ)',
      dateStr: '29 Tháng Chạp - Mùng 3 Tết',
      calendarType: 'lunar',
      category: 'Lễ Hội Truyền Thống',
      summary: 'Lễ hội cổ truyền lớn nhất của dân tộc Việt Nam, sum vầy đoàn viên.',
      meaning: 'Tết là dịp tạ ơn Trời Đất, tổ tiên, là khoảnh khắc giao hòa giữa con người và thiên nhiên, gắn kết tình thân gia đình qua bao thế hệ.',
      traditions: 'Gói bánh chưng, dọn dẹp bàn thờ gia tiên, chúc Tết mừng tuổi người lớn và trẻ nhỏ, xuất hành hướng cát lành.',
      color: 'bg-red-50 text-red-800 border-red-200'
    },
    {
      id: 3,
      title: 'Rằm Tháng Giêng (Tết Thượng Nguyên)',
      dateStr: '15/1 Âm Lịch',
      calendarType: 'lunar',
      category: 'Lễ Hội Truyền Thống',
      summary: '"Cúng quanh năm không bằng Rằm tháng Giêng", ngày rằm đầu tiên trong năm.',
      meaning: 'Đêm trăng tròn đầu tiên của năm mới, cầu cho quốc thái dân an, gia đạo êm ấm và công việc hanh thông thuận buồm xuôi gió.',
      traditions: 'Đi lễ chùa cầu an, chuẩn bị mâm cỗ chay thanh tịnh, thắp đèn hoa đăng.',
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 4,
      title: 'Giỗ Tổ Hùng Vương',
      dateStr: '10/3 Âm Lịch',
      calendarType: 'lunar',
      category: 'Quốc Lễ Việt Nam',
      summary: '"Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ mùng mười tháng ba".',
      meaning: 'Tưởng nhớ công lao dựng nước của các Vua Hùng, hun đúc lòng tự hào và tình đoàn kết của con Lạc cháu Hồng.',
      traditions: 'Lễ dâng hương tại Đền Hùng (Phú Thọ) và các đền thờ Vua Hùng trên khắp cả nước, rước kiệu truyền thống.',
      color: 'bg-rose-50 text-rose-800 border-rose-200'
    },
    {
      id: 5,
      title: 'Ngày Giải Phóng Miền Nam',
      dateStr: '30/4',
      calendarType: 'solar',
      category: 'Quốc Lễ Việt Nam',
      summary: 'Kỷ niệm ngày non sông thu về một mối, đất nước thống nhất.',
      meaning: 'Khắc ghi mốc son lịch sử vĩ đại của dân tộc, tưởng nhớ những người con đã ngã xuống vì độc lập tự do.',
      traditions: 'Treo cờ Tổ quốc, thăm viếng nghĩa trang liệt sĩ, sum họp gia đình.',
      color: 'bg-red-50 text-red-800 border-red-200'
    },
    {
      id: 6,
      title: 'Quốc Tế Lao Động',
      dateStr: '1/5',
      calendarType: 'solar',
      category: 'Lễ Quốc Tế',
      summary: 'Ngày tôn vinh giai cấp công nhân và người lao động trên toàn thế giới.',
      meaning: 'Khẳng định giá trị của lao động chân chính và sự đóng góp xây dựng xã hội.',
      traditions: 'Nghỉ ngơi, vui chơi giải trí, gặp gỡ bạn bè người thân.',
      color: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    {
      id: 8,
      title: 'Tết Trung Thu (Rằm Tháng 8)',
      dateStr: '15/8 Âm Lịch',
      calendarType: 'lunar',
      category: 'Lễ Hội Truyền Thống',
      summary: 'Tết trông trăng, tết đoàn viên của trẻ thơ và mọi gia đình Việt.',
      meaning: 'Mặt trăng tròn và sáng nhất năm biểu trưng cho sự trọn vẹn, sum vầy, tri ân mùa màng và trao gửi yêu thương đến con trẻ.',
      traditions: 'Phá cỗ trông trăng, rước đèn ông sao, múa lân sư rồng, thưởng thức bánh nướng bánh dẻo cùng chén trà sen ấm áp.',
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 9,
      title: 'Quốc Khánh Nước CHXHCN Việt Nam',
      dateStr: '2/9',
      calendarType: 'solar',
      category: 'Quốc Lễ Việt Nam',
      summary: 'Kỷ niệm Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình.',
      meaning: 'Ngày khai sinh ra nước Việt Nam Dân chủ Cộng hòa (nay là CHXHCN Việt Nam), mốc son chói lọi trong lịch sử dân tộc.',
      traditions: 'Treo cờ Tổ quốc đỏ rực các ngõ phố, dâng hương viếng Lăng Bác, các chương trình nghệ thuật chào mừng.',
      color: 'bg-red-50 text-red-800 border-red-200'
    },
    {
      id: 10,
      title: 'Ngày Nhà Giáo Việt Nam',
      dateStr: '20/11',
      calendarType: 'solar',
      category: 'Tri Ân & Văn Hóa',
      summary: 'Tôn vinh và tri ân những người thầy, người cô đã tận tụy vì sự nghiệp trồng người.',
      meaning: 'Khắc ghi truyền thống "Tôn sư trọng đạo" và "Uống nước nhớ nguồn" ngàn đời của dân tộc Việt Nam.',
      traditions: 'Học sinh thăm thầy cô, tặng hoa và những lời chúc tốt đẹp, tổ chức lễ kỷ niệm tại các nhà trường.',
      color: 'bg-blue-50 text-blue-800 border-blue-200'
    }
  ];

  // Cultural categories for filter tabs in Lễ Tết
  const culturalCategories = [
    { id: 'all', label: 'Tất Cả (10)' },
    { id: 'Lễ Hội Truyền Thống', label: '🏮 Lễ Hội Truyền Thống' },
    { id: 'Quốc Lễ Việt Nam', label: '🇻🇳 Quốc Lễ Việt Nam' },
    { id: 'Lễ Quốc Tế', label: '🌐 Lễ Quốc Tế' },
    { id: 'Tri Ân & Văn Hóa', label: '🌸 Tri Ân & Văn Hóa' },
  ];

  // Filtered events by search query and category
  const filteredEvents = useMemo(() => {
    let list = culturalEvents;
    if (eventCategoryFilter !== 'all') {
      list = list.filter((e) => e.category === eventCategoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.dateStr.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.meaning.toLowerCase().includes(q)
      );
    }
    return list;
  }, [culturalEvents, searchQuery, eventCategoryFilter]);

  // ==========================================
  // CONVERTER STATE (Đổi ngày Âm - Dương)
  // ==========================================
  const [convMode, setConvMode] = useState<'s2l' | 'l2s'>('s2l');
  const [convDay, setConvDay] = useState<number>(day);
  const [convMonth, setConvMonth] = useState<number>(month);
  const [convYear, setConvYear] = useState<number>(year);
  const [convIsLeap, setConvIsLeap] = useState<boolean>(false);

  const convResult = useMemo(() => {
    try {
      if (convMode === 's2l') {
        const lunar = solarToLunar(convDay, convMonth, convYear);
        const canChi = getCanChi(convDay, convMonth, convYear, lunar.year, lunar.month);
        const tietKhi = getTietKhi(convDay, convMonth, convYear);
        const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);
        return {
          solarDate: `${convDay}/${convMonth}/${convYear}`,
          lunarDate: `Ngày ${lunar.day} tháng ${lunar.month}${lunar.isLeap ? ' (Nhuận)' : ''} năm ${canChi.year}`,
          canChiInfo: `Năm ${canChi.year} • Tháng ${canChi.month} • Ngày ${canChi.day}`,
          tietKhi: tietKhi.name,
          rating: rating.label,
          targetDate: new Date(convYear, convMonth - 1, convDay)
        };
      } else {
        const solar = lunarToSolar(convDay, convMonth, convYear, convIsLeap);
        const canChi = getCanChi(solar.day, solar.month, solar.year, convYear, convMonth);
        const tietKhi = getTietKhi(solar.day, solar.month, solar.year);
        const rating = getDayRating(canChi.dayChiIndex, (convMonth + 1) % 12);
        return {
          solarDate: `${solar.day}/${solar.month}/${solar.year}`,
          lunarDate: `Ngày ${convDay} tháng ${convMonth}${convIsLeap ? ' (Nhuận)' : ''} năm ${canChi.year}`,
          canChiInfo: `Năm ${canChi.year} • Tháng ${canChi.month} • Ngày ${canChi.day}`,
          tietKhi: tietKhi.name,
          rating: rating.label,
          targetDate: new Date(solar.year, solar.month - 1, solar.day)
        };
      }
    } catch {
      return null;
    }
  }, [convMode, convDay, convMonth, convYear, convIsLeap]);

  // ==========================================
  // DONATE COMPONENT STATE
  // ==========================================
  const [donateAmount, setDonateAmount] = useState<number>(30000);
  const [donorName, setDonorName] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('Chúc ứng dụng Lịch An Nhiên ngày càng phát triển!');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [copiedBank, setCopiedBank] = useState<boolean>(false);
  const [donationConfig, setDonationConfig] = useState<DonationConfig | null>(null);

  useEffect(() => {
    fetch('/api/v1/donation/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setDonationConfig(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const effectiveBankName = donationConfig?.bankName || 'Ngân hàng Việt Nam thịnh vượng';
  const effectiveAccountNumber = donationConfig?.accountNumber || '170523668';
  const effectiveAccountHolder = donationConfig?.accountHolder || 'NGUYEN THANH TRUNG';
  const effectiveSyntax = donationConfig?.transferSyntax || 'LICHVIET';

  const vietQrUrl = useMemo(() => {
    if (donationConfig?.customQrUrl) {
      return donationConfig.customQrUrl;
    }
    const syntax = `${effectiveSyntax} ${currentUser.id.replace('guest_', '').substring(0, 8)}`;
    const bin = donationConfig?.bankBin || '970422';
    const acc = effectiveAccountNumber;
    const tpl = donationConfig?.qrTemplate || 'compact2';
    const holder = effectiveAccountHolder;
    return `https://img.vietqr.io/image/${bin}-${acc}-${tpl}.png?amount=${donateAmount}&addInfo=${encodeURIComponent(syntax)}&accountName=${encodeURIComponent(holder)}`;
  }, [donationConfig, donateAmount, currentUser.id, effectiveSyntax, effectiveAccountNumber, effectiveAccountHolder]);

  const handleCopyBank = () => {
    navigator.clipboard.writeText(effectiveAccountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  // ==========================================
  // MINI & FULL MONTH CALENDAR GENERATOR
  // ==========================================
  const [viewMonth, setViewMonth] = useState<number>(month);
  const [viewYear, setViewYear] = useState<number>(year);

  // Sync viewMonth and viewYear whenever month or year changes
  useEffect(() => {
    setViewMonth(month);
    setViewYear(year);
  }, [month, year]);

  const calendarGrid = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1);
    const totalDays = new Date(viewYear, viewMonth, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth - 1, 0).getDate();
    let firstDayWeekday = firstDay.getDay(); // 0 is Sun
    let startCol = (firstDayWeekday + 6) % 7; // Mon = 0, Sun = 6

    const items: Array<{
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      lunarDay: number;
      lunarMonth: number;
      isHoliday: boolean;
      isGoodDay: boolean;
    }> = [];

    // Prev month days
    for (let i = startCol - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = viewMonth === 1 ? 12 : viewMonth - 1;
      const y = viewMonth === 1 ? viewYear - 1 : viewYear;
      const lunar = solarToLunar(d, m, y);
      items.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        lunarDay: lunar.day,
        lunarMonth: lunar.month,
        isHoliday: false,
        isGoodDay: false
      });
    }

    // Current month days
    const todayObj = new Date();
    for (let d = 1; d <= totalDays; d++) {
      const lunar = solarToLunar(d, viewMonth, viewYear);
      const isToday =
        d === todayObj.getDate() &&
        viewMonth === todayObj.getMonth() + 1 &&
        viewYear === todayObj.getFullYear();
      const isSelected =
        d === day &&
        viewMonth === month &&
        viewYear === year;
      const isHoliday =
        (viewMonth === 9 && d === 2) ||
        (viewMonth === 1 && d === 1) ||
        (viewMonth === 4 && d === 30) ||
        (viewMonth === 5 && d === 1) ||
        (lunar.month === 1 && (lunar.day === 1 || lunar.day === 2 || lunar.day === 3)) ||
        (lunar.month === 3 && lunar.day === 10) ||
        (lunar.month === 8 && lunar.day === 15);

      items.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        isToday,
        isSelected,
        lunarDay: lunar.day,
        lunarMonth: lunar.month,
        isHoliday,
        isGoodDay: lunar.day === 1 || lunar.day === 15
      });
    }

    // Next month filling
    const remaining = 42 - items.length;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth === 12 ? 1 : viewMonth + 1;
      const y = viewMonth === 12 ? viewYear + 1 : viewYear;
      const lunar = solarToLunar(d, m, y);
      items.push({
        day: d,
        month: m,
        year: y,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        lunarDay: lunar.day,
        lunarMonth: lunar.month,
        isHoliday: false,
        isGoodDay: false
      });
    }

    return items;
  }, [viewMonth, viewYear, day, month, year]);

  // ==========================================
  // DYNAMIC SEO METADATA (lichannhien.com)
  // ==========================================
  useEffect(() => {
    let pageTitle = '';
    let metaDescription = '';
    const dateFormatted = `${day}/${month}/${year}`;
    const lunarFormatted = `${dayData.lunar.day}/${dayData.lunar.month} Âm lịch (${dayData.lunar.yearName})`;

    if (activeTab === 'today') {
      if (isToday) {
        pageTitle = `Hôm Nay Ngày Mấy? Lịch Âm Dương Hôm Nay ${dateFormatted} (${dayData.lunar.day}/${dayData.lunar.month} Âm) | Lịch An Nhiên`;
        metaDescription = `Hôm nay ngày mấy? Hôm nay là ngày ${dateFormatted} Dương lịch, tức ngày ${lunarFormatted}. Ngày ${dayData.canChi.day}, ${dayData.rating.label}, Tiết khí ${dayData.tietKhi.name}. Tra cứu lịch âm dương, xem giờ hoàng đạo hôm nay chính xác 100% tại lichannhien.com.`;
      } else {
        pageTitle = `Lịch Âm Dương Ngày ${dateFormatted} (${dayData.lunar.day}/${dayData.lunar.month} Âm) — Xem Ngày Tốt Xấu | Lịch An Nhiên`;
        metaDescription = `Tra cứu ngày ${dateFormatted} Dương lịch (tức ngày ${lunarFormatted}). Ngày ${dayData.canChi.day}, ${dayData.rating.label}, 12 giờ hoàng đạo và việc nên làm tại lichannhien.com.`;
      }
    } else if (activeTab === 'month') {
      pageTitle = `Lịch Vạn Niên Tháng ${viewMonth}/${viewYear} — Xem Lịch Âm Dương Toàn Cảnh 2026 | Lịch An Nhiên`;
      metaDescription = `Tra cứu bảng lịch vạn niên tháng ${viewMonth} năm ${viewYear} Dương lịch và Âm lịch Bính Ngọ 2026. Xem ngày hoàng đạo, ngày hắc đạo, ngày rằm mùng một chuẩn xác tại lichannhien.com.`;
    } else if (activeTab === 'events') {
      pageTitle = `Bách Khoa Lễ Tết & Sự Kiện Văn Hóa Việt Nam 2026 — Lịch An Nhiên`;
      metaDescription = `Tra cứu danh sách các ngày lễ Tết cổ truyền, ngày kỷ niệm Việt Nam và Quốc tế trong năm 2026. Ý nghĩa văn hóa, phong tục tập quán truyền thống tại lichannhien.com.`;
    } else if (activeTab === 'reminders') {
      pageTitle = `Quản Lý Nhắc Nhở Cá Nhân, Ngày Giỗ & Sinh Nhật Gia Đình — Lịch An Nhiên`;
      metaDescription = `Tạo và quản lý nhắc nhở ngày giỗ chạp, ngày rằm mùng một theo cả ngày Dương lịch và Âm lịch trên Lịch An Nhiên (lichannhien.com).`;
    } else if (activeTab === 'donate') {
      pageTitle = `Ủng Hộ & Đồng Hành Cùng Dự Án Lịch An Nhiên (lichannhien.com)`;
      metaDescription = `Ủng hộ nhà phát triển duy trì ứng dụng Lịch An Nhiên hoàn toàn miễn phí, không quảng cáo quấy rầy. Quét mã VietQR nhanh chóng tại lichannhien.com.`;
    }

    if (pageTitle) {
      document.title = pageTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDescription) {
      metaDesc.setAttribute('content', metaDescription);
    }
  }, [day, month, year, viewMonth, viewYear, activeTab, isToday, dayData]);

  return (

    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans selection:bg-red-100 selection:text-red-900 pb-20 md:pb-0">
      {/* =========================================================================
      {/* =========================================================================
          TOP HEADER: 1 DÒNG DUY NHẤT, GỌN GÀNG, ĐẲNG CẤP & DỄ NHÌN (56px)
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-2xs h-14 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 h-full">
            {/* Brand Logo & Name (Toàn bộ trên 1 dòng duy nhất) */}
            <div className="flex items-center gap-2.5 cursor-pointer select-none shrink-0" onClick={() => setActiveTab('today')}>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#B3261E] via-red-600 to-[#8B1D1D] flex items-center justify-center text-white shadow-xs ring-1 ring-red-200 shrink-0">
                <span className="font-serif font-black text-base sm:text-lg tracking-tighter">L</span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg text-slate-900 tracking-tight whitespace-nowrap flex items-center gap-2 m-0 p-0">
                  <span>LỊCH AN NHIÊN</span>
                  <span className="sr-only"> — Lịch Âm Dương Hôm Nay, Xem Ngày Tốt Xấu & Lịch Vạn Niên 2026 (lichannhien.com)</span>
                </h1>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-red-50 text-[#B3261E] border border-red-200/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {dayData.canChi.year} {year}
                </span>
              </div>

            </div>

            {/* Desktop Navigation Tabs (5 Tabs chuẩn, Chữ và icon trên 1 dòng) */}
            <nav className="hidden md:flex items-center gap-0.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70">
              <button
                onClick={() => setActiveTab('today')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'today'
                    ? 'bg-white text-[#B3261E] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Hôm Nay</span>
              </button>

              <button
                onClick={() => setActiveTab('month')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'month'
                    ? 'bg-white text-[#B3261E] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Lịch Tháng</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'events'
                    ? 'bg-white text-[#B3261E] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Lễ Tết</span>
              </button>

              <button
                onClick={() => setActiveTab('reminders')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative whitespace-nowrap ${
                  activeTab === 'reminders'
                    ? 'bg-white text-[#B3261E] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Nhắc Nhở</span>
                {reminders.filter((r) => !r.isCompleted).length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('donate')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'donate'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-2xs font-extrabold'
                    : 'text-amber-800 hover:bg-amber-100/60'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Ủng Hộ</span>
              </button>
            </nav>

            {/* Header Right: Cụm ngày chuyển đổi tích hợp Hôm nay & Menu Tài khoản */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Cụm điều hướng ngày thống nhất: [ < ] [ Ngày | Hôm nay ] [ > ] */}
              <div className="hidden lg:flex items-center bg-slate-100/90 rounded-2xl p-0.5 border border-slate-200/80 text-xs shadow-2xs">
                <button
                  onClick={handlePrevDay}
                  className="p-1.5 rounded-xl hover:bg-white hover:text-slate-900 text-slate-600 transition-all cursor-pointer"
                  title="Ngày trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center px-2 py-0.5 gap-1.5">
                  <input
                    type="date"
                    value={`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
                    onChange={handleDatePickerChange}
                    className="text-xs font-bold bg-transparent border-0 cursor-pointer text-slate-800 focus:outline-none focus:ring-0 w-[110px]"
                    title="Bấm để chọn ngày bất kỳ"
                  />
                  {!isToday ? (
                    <button
                      onClick={handleToday}
                      className="px-2 py-0.5 rounded-lg bg-amber-100 hover:bg-[#B3261E] text-amber-900 hover:text-white text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                      title="Quay về ngày hôm nay"
                    >
                      Hôm nay
                    </button>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold select-none whitespace-nowrap">
                      Hôm nay
                    </span>
                  )}
                </div>

                <button
                  onClick={handleNextDay}
                  className="p-1.5 rounded-xl hover:bg-white hover:text-slate-900 text-slate-600 transition-all cursor-pointer"
                  title="Ngày sau"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* User Account / Profile Pill (Mở Menu Tài Khoản & Tiện Ích Đổi Ngày) */}
              <button
                onClick={() => {
                  setAccountModalTab('account');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs"
                title="Tài khoản & Tiện ích"
              >
                <div className="w-6 h-6 rounded-full bg-red-100 text-[#B3261E] flex items-center justify-center font-bold text-xs">
                  {currentUser.isGuest ? 'K' : (currentUser.name ? currentUser.name.charAt(0) : 'U')}
                </div>
                <span className="hidden xl:inline max-w-[100px] truncate text-xs font-medium">
                  {currentUser.isGuest ? 'Tài khoản' : (currentUser.name || currentUser.email || 'Thành viên')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN BODY CONTAINER
      ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* SEO Quick Answer Banner for High Intent Search Queries (lichannhien.com) */}
        {activeTab === 'today' && (
          <div className="mb-4 sm:mb-5 px-3.5 sm:px-4 py-2.5 bg-gradient-to-r from-amber-50/90 via-white to-red-50/80 rounded-2xl border border-amber-200/70 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-700 shadow-2xs">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#B3261E] text-white font-extrabold text-[11px] shadow-xs">
                {isToday ? 'Hôm Nay' : 'Ngày Đang Xem'}
              </span>
              <h2 className="font-bold text-slate-900 text-xs sm:text-sm inline-flex items-center gap-1.5 flex-wrap m-0 p-0">
                <span className="text-slate-500 font-normal">Hôm nay ngày mấy?</span>
                <span className="text-[#B3261E] font-black">{dayData.solar.dayOfWeek}, {day}/{month}/{year}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-normal">Hôm nay là bao nhiêu âm lịch?</span>
                <span className="text-[#8B1D1D] font-black font-serif">Ngày {dayData.lunar.day}/{dayData.lunar.month} ({dayData.canChi.day})</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1">
                <span className="text-slate-400">Tiết khí:</span>
                <strong className="text-slate-900">{dayData.tietKhi.name}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{dayData.rating.label}</span>
              </span>
            </div>
          </div>
        )}

        {/* TAB 1: TỜ LỊCH HÔM NAY (DESKTOP MULTI-COLUMN + RESPONSIVE MOBILE SINGLE COLUMN) */}
        {activeTab === 'today' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* COLUMN 1: TỜ LỊCH TREO TƯỜNG TRUYỀN THỐNG (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Mobile Quick Date Stepper Bar (Thống nhất chuyển ngày và về hôm nay) */}
              <div className="lg:hidden flex items-center justify-between gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                <button
                  onClick={handlePrevDay}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  title="Ngày trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex-1 flex items-center justify-center gap-1.5">
                  <input
                    type="date"
                    value={`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
                    onChange={handleDatePickerChange}
                    className="text-xs font-bold bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-800 cursor-pointer text-center"
                    title="Bấm để chọn ngày"
                  />
                  {!isToday ? (
                    <button
                      onClick={handleToday}
                      className="px-2.5 py-1.5 rounded-xl bg-[#B3261E] text-white font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
                      title="Quay về ngày hôm nay"
                    >
                      Hôm nay
                    </button>
                  ) : (
                    <span className="px-2 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] whitespace-nowrap">
                      Hôm nay
                    </span>
                  )}
                </div>

                <button
                  onClick={handleNextDay}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                  title="Ngày sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* The Authentic Tear-Sheet Calendar Card */}
              <div className="bg-[#FDFBF7] rounded-3xl border-2 border-amber-200/80 shadow-xl overflow-hidden relative">
                {/* Red Tear-sheet Hanging Top Bar */}
                <div className="bg-gradient-to-r from-[#B3261E] via-red-700 to-[#8B1D1D] text-white px-5 py-3.5 flex items-center justify-between shadow-inner">
                  <div>
                    <div className="text-[11px] font-semibold text-red-100 uppercase tracking-widest">
                      Dương Lịch
                    </div>
                    <div className="text-base font-bold font-serif">
                      Tháng {month} / {year}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-amber-200 uppercase tracking-widest">
                      Âm Lịch Bính Ngọ
                    </div>
                    <div className="text-base font-bold font-serif text-amber-100">
                      Tháng {dayData.lunar.month} {dayData.lunar.isLeap ? '(Nhuận)' : ''}
                    </div>
                  </div>
                </div>

                {/* Tiết Khí Ribbon */}
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-1.5 flex items-center justify-between text-xs text-amber-900 font-medium">
                  <span>Tiết khí: <strong className="text-[#B3261E] font-bold">{dayData.tietKhi.name}</strong></span>
                  <span className="text-[11px] text-slate-500">Kế tiếp: {dayData.tietKhi.nextName} ({dayData.tietKhi.daysRemaining} ngày)</span>
                </div>

                {/* Calendar Hero Day Content */}
                <div className="p-6 flex flex-col items-center text-center">
                  {/* Day of Week */}
                  <div className="text-xl font-black tracking-wide text-[#B3261E] font-serif uppercase">
                    {dayData.solar.dayOfWeek}
                  </div>

                  {/* Huge Solar Day */}
                  <div className="text-[96px] sm:text-[110px] font-black leading-none my-1 tracking-tighter text-slate-900 font-serif drop-shadow-xs select-none">
                    {day}
                  </div>

                  {/* Solar Year & Month */}
                  <div className="text-sm font-semibold text-slate-500 mb-4">
                    Tháng {month} năm {year} (Dương lịch)
                  </div>

                  {/* Decorative separator */}
                  <div className="w-full flex items-center gap-3 my-2 opacity-70">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                    <span className="text-xs text-amber-700 font-serif">❖ ❖ ❖</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                  </div>

                  {/* Lunar Date Hero */}
                  <div className="w-full bg-red-50/80 border border-red-100 rounded-2xl p-3.5 my-2">
                    <div className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-0.5">
                      Ngày Âm Lịch
                    </div>
                    <div className="text-2xl font-black text-[#B3261E] font-serif">
                      Ngày {dayData.lunar.day} Tháng {dayData.lunar.month} {dayData.lunar.isLeap ? '(Nhuận)' : ''}
                    </div>
                    <div className="text-xs font-semibold text-slate-700 mt-1">
                      Năm Bính Ngọ (Đủ)
                    </div>
                  </div>

                  {/* Can Chi 4 Trụ (Năm, Tháng, Ngày, Giờ) */}
                  <div className="w-full grid grid-cols-2 gap-2 text-left my-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Năm</span>
                      <strong className="text-slate-800">{dayData.canChi.year}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Tháng</span>
                      <strong className="text-slate-800">{dayData.canChi.month}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Ngày</span>
                      <strong className="text-[#B3261E]">{dayData.canChi.day}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Giờ Đầu</span>
                      <strong className="text-slate-800">Giáp Tý</strong>
                    </div>
                  </div>

                  {/* Hoàng Đạo / Hắc Đạo Badge */}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{dayData.rating.label}</span>
                  </div>
                </div>

                {/* Day Stepper Control on Desktop */}
                <div className="hidden lg:flex p-3 bg-amber-50/60 border-t border-amber-200/60 items-center justify-between gap-2">
                  <button
                    onClick={handlePrevDay}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-all shadow-2xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Ngày Trước</span>
                  </button>

                  {!isToday ? (
                    <button
                      onClick={handleToday}
                      className="py-2.5 px-4 rounded-xl bg-[#B3261E] hover:bg-[#8B1D1D] text-white font-bold text-xs transition-all shadow-2xs cursor-pointer"
                    >
                      Về Hôm Nay
                    </button>
                  ) : (
                    <span className="py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs select-none">
                      Đang Xem Hôm Nay
                    </span>
                  )}

                  <button
                    onClick={handleNextDay}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs transition-all shadow-2xs cursor-pointer"
                  >
                    <span>Ngày Sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lời chúc / Danh ngôn an nhiên */}
              <div className="bg-white rounded-2xl p-5 border border-amber-200/70 shadow-2xs relative overflow-hidden">
                <div className="text-[#B3261E]/10 font-serif text-6xl absolute top-1 left-2 select-none leading-none">“</div>
                <div className="relative z-10 pl-3">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block mb-1">
                    Lời Chúc An Nhiên Hôm Nay
                  </span>
                  <p className="font-serif italic text-slate-800 text-sm leading-relaxed">
                    "Tâm an vạn sự an. Sống trọn vẹn từng ngày với lòng biết ơn và nụ cười ấm áp, phúc lành tự khắc đong đầy."
                  </p>
                  <span className="text-[11px] text-slate-400 block mt-2 font-medium">
                    — Lời hay ý đẹp Lịch Việt
                  </span>
                </div>
              </div>
            </div>

            {/* COLUMN 2: CHI TIẾT PHONG THỦY & GIỜ HOÀNG ĐẠO (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Card 1: 12 Giờ Hoàng Đạo & Hắc Đạo */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#B3261E]" />
                    <h3 className="font-bold text-slate-900 text-base">Giờ Hoàng Đạo Trong Ngày</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    12 Can Chi
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {dayData.auspiciousHours.map((item, index) => {
                    const isNow =
                      (index === 0 && (currentHour >= 23 || currentHour < 1)) ||
                      (index === 1 && currentHour >= 1 && currentHour < 3) ||
                      (index === 2 && currentHour >= 3 && currentHour < 5) ||
                      (index === 3 && currentHour >= 5 && currentHour < 7) ||
                      (index === 4 && currentHour >= 7 && currentHour < 9) ||
                      (index === 5 && currentHour >= 9 && currentHour < 11) ||
                      (index === 6 && currentHour >= 11 && currentHour < 13) ||
                      (index === 7 && currentHour >= 13 && currentHour < 15) ||
                      (index === 8 && currentHour >= 15 && currentHour < 17) ||
                      (index === 9 && currentHour >= 17 && currentHour < 19) ||
                      (index === 10 && currentHour >= 19 && currentHour < 21) ||
                      (index === 11 && currentHour >= 21 && currentHour < 23);

                    return (
                      <div
                        key={item.canChi}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                          isNow
                            ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300/40 shadow-xs'
                            : item.isGood
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-slate-50 border-slate-100 text-slate-500'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{item.canChi}</span>
                            {isNow && (
                              <span className="text-[9px] font-black uppercase bg-amber-500 text-white px-1.5 py-0.2 rounded-full">
                                Bây giờ
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">{item.time}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.isGood
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {item.isGood ? 'Hoàng Đạo' : 'Hắc Đạo'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Hướng Xuất Hành */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-base">Hướng Xuất Hành Tốt</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
                    <span className="text-amber-800 font-bold block text-xs">Hỷ Thần (May Mắn)</span>
                    <strong className="text-sm font-bold text-slate-900 mt-0.5 block">Hướng Tây Nam</strong>
                    <span className="text-[11px] text-slate-500">Đón niềm vui, hỷ sự tốt lành</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                    <span className="text-emerald-800 font-bold block text-xs">Tài Thần (Tài Lộc)</span>
                    <strong className="text-sm font-bold text-slate-900 mt-0.5 block">Hướng Đông</strong>
                    <span className="text-[11px] text-slate-500">Cầu tài lộc, kinh doanh hanh thông</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Việc Nên Làm & Việc Kiêng Cữ */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-base">Việc Nên Làm & Kiêng Cữ</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
                    <strong className="text-emerald-800 font-bold block mb-1">✓ Việc Nên Làm:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {dayData.rating.suitableFor.map((act) => (
                        <span key={act} className="px-2.5 py-1 bg-white rounded-lg font-semibold text-emerald-900 border border-emerald-100 shadow-2xs">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70">
                    <strong className="text-rose-800 font-bold block mb-1">✕ Việc Kiêng Cữ:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {dayData.rating.avoid.map((act) => (
                        <span key={act} className="px-2.5 py-1 bg-white rounded-lg font-semibold text-rose-900 border border-rose-100 shadow-2xs">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: TIỆN ÍCH TƯƠNG TÁC & LỊCH NHẮC (lg:col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Mini Calendar Widget */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#B3261E]" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Tháng {viewMonth} / {viewYear}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (viewMonth === 1) {
                          setViewMonth(12);
                          setViewYear(viewYear - 1);
                        } else {
                          setViewMonth(viewMonth - 1);
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (viewMonth === 12) {
                          setViewMonth(1);
                          setViewYear(viewYear + 1);
                        } else {
                          setViewMonth(viewMonth + 1);
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-1">
                  <span>T2</span>
                  <span>T3</span>
                  <span>T4</span>
                  <span>T5</span>
                  <span>T6</span>
                  <span>T7</span>
                  <span className="text-red-600">CN</span>
                </div>

                {/* Calendar Day Cells */}
                <div className="grid grid-cols-7 gap-1">
                  {(calendarGrid[35]?.isCurrentMonth ? calendarGrid : calendarGrid.slice(0, 35)).map((cell, idx) => {
                    const isSunday = (idx % 7) === 6;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          onDateChange(new Date(cell.year, cell.month - 1, cell.day));
                        }}
                        className={`h-11 rounded-xl flex flex-col items-center justify-center p-0.5 transition-all cursor-pointer relative ${
                          cell.isSelected
                            ? 'bg-[#B3261E] text-white shadow-md font-bold'
                            : cell.isToday
                            ? 'bg-red-50 text-[#B3261E] border border-red-200 font-bold'
                            : cell.isCurrentMonth
                            ? 'hover:bg-amber-50/80 text-slate-800'
                            : 'text-slate-300'
                        }`}
                      >
                        <span className={`text-xs font-bold leading-none ${cell.isSelected ? 'text-white' : isSunday ? 'text-red-600' : ''}`}>
                          {cell.day}
                        </span>
                        <span className={`text-[9px] leading-tight mt-0.5 ${cell.isSelected ? 'text-amber-200' : 'text-slate-400 font-medium'}`}>
                          {cell.lunarDay === 1 ? `1/${cell.lunarMonth}` : cell.lunarDay === 15 ? '15' : cell.lunarDay}
                        </span>
                        {cell.isGoodDay && !cell.isSelected && (
                          <div className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-0.5"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lịch Nhắc Nhở Cá Nhân Widget */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900 text-base">Nhắc Nhở & Ngày Giỗ</h3>
                  </div>
                  <button
                    onClick={() => setIsAddReminderModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-[#B3261E] hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {reminders.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">Chưa có nhắc nhở nào</p>
                  ) : (
                    reminders.slice(0, 4).map((rem) => (
                      <div
                        key={rem.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          rem.isCompleted
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : 'bg-[#FDFBF7] border-amber-200/80 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <button
                            onClick={() => onToggleReminder(rem.id)}
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                              rem.isCompleted
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 hover:border-[#B3261E]'
                            }`}
                          >
                            {rem.isCompleted && <Check className="w-3.5 h-3.5" />}
                          </button>
                          <div className="min-w-0">
                            <h4 className={`text-xs font-bold truncate ${rem.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {rem.title}
                            </h4>
                            <span className="text-[11px] text-amber-800 font-semibold block">
                              {rem.lunarFormatted || rem.solarDate}
                            </span>
                          </div>
                        </div>
                        {rem.repeat === 'yearly' && (
                          <span className="text-[10px] bg-red-50 text-[#B3261E] px-2 py-0.5 rounded-full font-bold shrink-0">
                            Hàng năm
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {reminders.length > 4 && (
                  <button
                    onClick={() => setActiveTab('reminders')}
                    className="w-full text-center text-xs font-bold text-[#B3261E] mt-3 hover:underline cursor-pointer"
                  >
                    Xem tất cả ({reminders.length} việc) →
                  </button>
                )}
              </div>

              {/* Sự kiện Lễ Tết Nổi Bật Widget */}
              <div className="bg-gradient-to-br from-red-950 via-[#8B1D1D] to-[#B3261E] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-red-200">
                      Văn Hóa Truyền Thống
                    </span>
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      15/8 Âm Lịch
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-serif mb-1">Tết Trung Thu (Rằm Tháng 8)</h4>
                  <p className="text-xs text-red-100 leading-relaxed mb-3 opacity-90">
                    Tết trông trăng, sum vầy đoàn viên, thưởng trà ngắm trăng tròn cùng bánh nướng bánh dẻo.
                  </p>
                  <button
                    onClick={() => {
                      const ttEvent = culturalEvents.find((e) => e.id === 8);
                      setSelectedEventModal(ttEvent);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-[#B3261E] font-bold text-xs hover:bg-amber-100 transition-all shadow-2xs cursor-pointer"
                  >
                    Khám phá ý nghĩa & phong tục →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LỊCH THÁNG (TOÀN CẢNH) */}
        {activeTab === 'month' && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#B3261E] flex items-center justify-center font-bold text-xl shrink-0">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                    Lịch Toàn Cảnh: Tháng {viewMonth} Năm {viewYear}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Âm Dương song hành • Chạm vào ngày bất kỳ để xem chi tiết
                  </p>
                </div>
              </div>

              {/* Month navigation buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => {
                    if (viewMonth === 1) {
                      setViewMonth(12);
                      setViewYear(viewYear - 1);
                    } else {
                      setViewMonth(viewMonth - 1);
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Tháng trước</span>
                </button>

                <button
                  onClick={() => {
                    const now = new Date();
                    setViewMonth(now.getMonth() + 1);
                    setViewYear(now.getFullYear());
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#B3261E] text-white text-xs font-bold shadow-xs hover:bg-[#8B1D1D] transition-all cursor-pointer"
                >
                  Hôm nay
                </button>

                <button
                  onClick={() => {
                    if (viewMonth === 12) {
                      setViewMonth(1);
                      setViewYear(viewYear + 1);
                    } else {
                      setViewMonth(viewMonth + 1);
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <span>Tháng sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-500 py-3 border-b border-slate-100">
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
              <span className="text-red-600">CN</span>
            </div>

            {/* Widescreen Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-3">
              {calendarGrid.map((cell, idx) => {
                const isSunday = (idx % 7) === 6;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onDateChange(new Date(cell.year, cell.month - 1, cell.day));
                      setActiveTab('today');
                    }}
                    className={`min-h-[72px] sm:min-h-[90px] rounded-2xl p-1.5 sm:p-2.5 border transition-all cursor-pointer flex flex-col justify-between ${
                      cell.isSelected
                        ? 'bg-red-50/90 border-[#B3261E] ring-2 ring-red-300/60 shadow-md'
                        : cell.isToday
                        ? 'bg-amber-50/70 border-amber-300'
                        : cell.isCurrentMonth
                        ? 'bg-white hover:bg-slate-50 border-slate-200'
                        : 'bg-slate-50/50 border-slate-100 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm sm:text-base font-bold font-serif ${isSunday ? 'text-red-600' : 'text-slate-800'}`}>
                        {cell.day}
                      </span>
                      {cell.isHoliday && (
                        <span className="text-[9px] sm:text-[10px] bg-red-100 text-[#B3261E] px-1 py-0.2 rounded-md font-bold">
                          Lễ
                        </span>
                      )}
                    </div>

                    <div className="mt-1 sm:mt-2 text-right">
                      <span className={`text-[11px] sm:text-xs font-bold ${cell.lunarDay === 1 || cell.lunarDay === 15 ? 'text-[#B3261E] font-black' : 'text-slate-500'}`}>
                        {cell.lunarDay === 1 ? `1/${cell.lunarMonth}` : cell.lunarDay === 15 ? `15/${cell.lunarMonth}` : cell.lunarDay}
                      </span>
                      <span className="hidden sm:block text-[10px] text-slate-400">Âm lịch</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SỰ KIỆN & LỄ TẾT (TÍCH HỢP TÌM KIẾM & BÁCH KHOA VĂN HÓA) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Header & Search Control Box */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#B3261E]" />
                    <span>Bách Khoa Sự Kiện & Lễ Tết Cổ Truyền</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nguồn gốc, ý nghĩa văn hóa và phong tục tập quán chuẩn truyền thống dân tộc Việt
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                  {filteredEvents.length} sự kiện
                </div>
              </div>

              {/* Integrated Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sự kiện, ngày lễ (Tết, Giỗ Tổ, Trung Thu, Quốc Khánh, 20/11...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-all"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {culturalCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setEventCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                      eventCategoryFilter === cat.id
                        ? 'bg-[#B3261E] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid / Empty State */}
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 text-center shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold font-serif text-base text-slate-800">
                  Không tìm thấy sự kiện nào khớp với từ khóa "{searchQuery}"
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Bạn có thể thử tìm với từ khóa ngắn gọn hơn như "Tết", "Giỗ", "Rằm", hoặc xóa bộ lọc danh mục.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setEventCategoryFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#B3261E] text-white text-xs font-bold shadow-xs hover:bg-[#8B1D1D] transition-all cursor-pointer"
                >
                  Xem Tất Cả Sự Kiện
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${evt.color}`}>
                          {evt.category}
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {evt.dateStr}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-slate-900 mt-2 mb-1.5">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {evt.summary}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedEventModal(evt)}
                      className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#B3261E] hover:text-white text-slate-700 font-bold text-xs transition-all border border-slate-200 hover:border-[#B3261E] cursor-pointer"
                    >
                      Xem Ý Nghĩa & Phong Tục →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: NHẮC NHỞ & NGÀY GIỖ */}
        {activeTab === 'reminders' && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900">
                  Danh Sách Nhắc Nhở, Ngày Giỗ & Sự Kiện
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Được lưu an toàn theo tài khoản ({currentUser.isGuest ? 'Khách' : currentUser.email})
                </p>
              </div>
              <button
                onClick={() => setIsAddReminderModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B3261E] hover:bg-[#8B1D1D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Nhắc Nhở Mới</span>
              </button>
            </div>

            {/* Reminders List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {reminders.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    item.isCompleted
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-[#FDFBF7] border-amber-200/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleReminder(item.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          item.isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-[#B3261E]'
                        }`}
                      >
                        {item.isCompleted && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <h4 className={`text-sm font-bold ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {item.title}
                        </h4>
                        <span className="text-xs text-amber-800 font-semibold block mt-0.5">
                          {item.lunarFormatted || item.solarDate} ({item.time === 'all_day' ? 'Cả ngày' : item.time})
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {item.repeat === 'yearly' ? 'Hàng năm' : item.repeat === 'monthly' ? 'Hàng tháng' : 'Một lần'}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ỦNG HỘ NHÀ PHÁT TRIỂN (VIETQR) */}
        {activeTab === 'donate' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-900/20">
                <Heart className="w-7 h-7 fill-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Ủng Hộ Duy Trì Lịch An Nhiên
              </h2>
              <p className="text-xs text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
                Ứng dụng hoàn toàn miễn phí và không có quảng cáo. Mọi đóng góp hảo tâm của bạn đều giúp đội ngũ duy trì máy chủ và phát triển thêm nét đẹp văn hóa Việt.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* VietQR Dynamic Preview (col-span-5) */}
              <div className="md:col-span-5 flex flex-col items-center bg-[#FDFBF7] p-4 sm:p-5 rounded-3xl border border-amber-200/80 shadow-inner">
                <div className="w-full max-w-[240px] aspect-square rounded-2xl overflow-hidden bg-white p-2 border border-slate-200 shadow-2xs mb-3">
                  <img
                    src={vietQrUrl}
                    alt="VietQR Chuyển Khoản"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 text-center">
                  {donationConfig?.customQrUrl
                    ? 'Quét mã QR để chuyển khoản trực tiếp qua ngân hàng hoặc ví điện tử'
                    : 'Mở ứng dụng Ngân hàng để quét mã VietQR tự động'}
                </span>

                {/* Bank Transfer Details Box */}
                <div className="w-full mt-4 p-3 bg-white rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <strong className="text-slate-800 text-right">{effectiveBankName}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Chủ tài khoản:</span>
                    <strong className="text-slate-800 text-right">{effectiveAccountHolder}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Số tài khoản:</span>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-[#B3261E] font-mono text-sm">{effectiveAccountNumber}</strong>
                      <button
                        onClick={handleCopyBank}
                        className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                        title="Sao chép số tài khoản"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  {donationConfig?.momoPhone && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-slate-400">Ví MoMo:</span>
                      <strong className="text-pink-700 font-mono text-xs">{donationConfig.momoPhone}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Selection & Form (col-span-7) */}
              <div className="md:col-span-7 space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Chọn mức ủng hộ thân thiện:
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {[
                      { amt: 10000, label: '10.000đ', desc: 'Tách trà ấm' },
                      { amt: 30000, label: '30.000đ', desc: 'Ly cà phê' },
                      { amt: 50000, label: '50.000đ', desc: 'Món quà nhỏ' },
                      { amt: 100000, label: '100.000đ', desc: 'Đồng hành' },
                      { amt: 200000, label: '200.000đ', desc: 'Tấm lòng vàng' },
                      { amt: 500000, label: '500.000đ', desc: 'Đại sứ văn hóa' },
                    ].map((item) => (
                      <button
                        key={item.amt}
                        onClick={() => setDonateAmount(item.amt)}
                        className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          donateAmount === item.amt
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/40 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                        <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ tên của bạn (Tùy chọn):</label>
                    <input
                      type="text"
                      placeholder="Người yêu mến văn hóa Việt"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email nhận thư cảm ơn:</label>
                    <input
                      type="email"
                      placeholder="email@vidu.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lời nhắn gửi:</label>
                    <textarea
                      rows={2}
                      value={donorMessage}
                      onChange={(e) => setDonorMessage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          SEO KNOWLEDGE HUB & TRA CỨU HỎI ĐÁP PHỔ BIẾN (lichannhien.com)
      ========================================================================= */}
      <section
        aria-labelledby="seo-faq-heading"
        className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-4"
      >
        <div className="bg-white rounded-3xl border border-amber-200/70 p-6 sm:p-8 shadow-xs">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#B3261E] border border-red-200 text-xs font-bold mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Cẩm Nang Tra Cứu Lịch Âm Dương lichannhien.com</span>
              </div>
              <h2 id="seo-faq-heading" className="text-xl sm:text-2xl font-black font-serif text-slate-900">
                Hỏi Đáp Tra Cứu Lịch, Xem Ngày &amp; Giờ Hoàng Đạo
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Giải đáp nhanh các thắc mắc hôm nay ngày mấy, hôm nay là bao nhiêu âm lịch, xem ngày tốt xấu và lịch vạn niên 2026.
              </p>
            </div>

            {/* Quick Topic Badges */}
            <div className="flex flex-wrap gap-1.5 self-start md:self-center">
              <button
                onClick={() => setActiveTab('today')}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-[#B3261E] text-slate-600 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                #LịchHômNay
              </button>
              <button
                onClick={() => setActiveTab('month')}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-[#B3261E] text-slate-600 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                #LịchÂmDương2026
              </button>
              <button
                onClick={() => {
                  setAccountModalTab('converter');
                  setIsAuthModalOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-[#B3261E] text-slate-600 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                #ĐổiNgàyÂmDương
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-[#B3261E] text-slate-600 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                #LễTếtViệtNam
              </button>
            </div>
          </div>

          {/* FAQ Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-6">
            {/* Q1 */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 transition-all hover:border-amber-300">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <span className="text-[#B3261E] font-serif font-black text-lg leading-none">Q1.</span>
                <span>Hôm nay là ngày bao nhiêu âm lịch và là thứ mấy?</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hôm nay là <strong>Thứ {dayData.solar.dayOfWeek}</strong>, ngày <strong>{day}/{month}/{year}</strong> Dương lịch, tương ứng ngày <strong>{dayData.lunar.day} tháng {dayData.lunar.month}</strong> năm <strong>{dayData.lunar.yearName}</strong> Âm lịch. Can Chi ngày hôm nay là <strong>{dayData.canChi.day}</strong>, tiết khí hiện tại là <strong>{dayData.tietKhi.name}</strong>. Mọi phép tính trên <em>lichannhien.com</em> đều áp dụng thuật toán thiên văn Hồ Ngọc Đức múi giờ chuẩn UTC+7.
              </p>
            </div>

            {/* Q2 */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 transition-all hover:border-amber-300">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <span className="text-[#B3261E] font-serif font-black text-lg leading-none">Q2.</span>
                <span>Xem ngày hôm nay là ngày tốt hay xấu, hoàng đạo hay hắc đạo?</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ngày hôm nay được xếp loại: <strong className="text-emerald-700">{dayData.rating.label}</strong>. Các hoạt động thuận lợi nên làm bao gồm: <em>{dayData.rating.suitableFor.join(', ')}</em>. Các việc cần lưu ý kiêng cữ: <em>{dayData.rating.avoid.join(', ')}</em>. Bạn có thể theo dõi chi tiết cột phong thủy bên cạnh để đón cát tránh hung.
              </p>
            </div>

            {/* Q3 */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 transition-all hover:border-amber-300">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <span className="text-[#B3261E] font-serif font-black text-lg leading-none">Q3.</span>
                <span>Giờ hoàng đạo hôm nay gồm những khung giờ nào?</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Trong 12 giờ Can Chi, 6 khung giờ Hoàng đạo cát lành ngày hôm nay gồm: <strong>{dayData.auspiciousHours.map(h => `${h.canChi} (${h.time})`).join(', ')}</strong>. Trên giao diện Lịch An Nhiên, khung giờ hoàng đạo đang diễn ra ở thời điểm hiện tại luôn được đánh dấu màu xanh nổi bật theo thời gian thực của máy tính.
              </p>
            </div>

            {/* Q4 */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 transition-all hover:border-amber-300">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <span className="text-[#B3261E] font-serif font-black text-lg leading-none">Q4.</span>
                <span>Làm sao để đổi ngày âm sang ngày dương hoặc ngược lại?</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bạn chỉ cần mở công cụ <strong>Đổi Ngày Âm – Dương</strong> trong menu Tài khoản hoặc bấm vào các nút chuyển đổi trên trang. Nhập ngày tháng năm cần tra cứu, hệ thống lập tức quy đổi 2 chiều và có nút bấm trực tiếp nhảy đến tờ lịch chi tiết của ngày đó mà không cần tính nhẩm.
              </p>
            </div>
          </div>

          {/* Rich Content Summary for Search Intent */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100">
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-[#B3261E]">Lịch Âm Dương Chuẩn Thiên Văn</h4>
              <p className="leading-relaxed">
                Cung cấp ngày Dương lịch, ngày Âm lịch Bính Ngọ 2026, Can Chi 4 trụ, Tiết khí 24 mùa và 12 giờ Hoàng đạo thời gian thực chính xác tuyệt đối.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-emerald-800">Tối Ưu Cho Người Cao Tuổi</h4>
              <p className="leading-relaxed">
                Chữ to rõ ràng, số ngày 96px+, độ tương phản cao đạt chuẩn WCAG AAA, giao diện thuần Việt ấm áp, hoàn toàn miễn phí và không quảng cáo quấy rầy.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-100">
              <h4 className="font-bold text-slate-900 text-sm mb-1 text-[#8B1D1D]">Bách Khoa Lễ Tết &amp; Nhắc Nhở</h4>
              <p className="leading-relaxed">
                Tra cứu nguồn gốc, ý nghĩa và phong tục các ngày lễ truyền thống; hỗ trợ quản lý nhắc ngày giỗ chạp, ngày rằm mùng một thông minh theo chu kỳ âm lịch.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          FIXED MOBILE BOTTOM NAVIGATION BAR (5 Tabs cân đối & tối ưu touch target)
      ========================================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-amber-200/70 shadow-lg px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[50px] ${
            activeTab === 'today' ? 'text-[#B3261E] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Hôm Nay</span>
        </button>

        <button
          onClick={() => setActiveTab('month')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[50px] ${
            activeTab === 'month' ? 'text-[#B3261E] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Tháng</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[50px] ${
            activeTab === 'events' ? 'text-[#B3261E] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Lễ Tết</span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[50px] relative ${
            activeTab === 'reminders' ? 'text-[#B3261E] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Nhắc Nhở</span>
          {reminders.filter((r) => !r.isCompleted).length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 absolute top-1 right-2.5"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('donate')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-w-[50px] ${
            activeTab === 'donate' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Ủng Hộ</span>
        </button>
      </div>

      {/* =========================================================================
          DESKTOP FOOTER
      ========================================================================= */}
      <footer className="hidden md:block bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-800">Lịch An Nhiên</span>
            <span>• Giữ truyền thống, gần gũi mỗi ngày</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>Múi Giờ Việt Nam (UTC+7)</span>
            <a href="/admin" target="_blank" rel="noreferrer" className="hover:text-[#B3261E]">
              Admin CMS
            </a>
          </div>

        </div>
      </footer>

      {/* =========================================================================
          MODAL: CHI TIẾT SỰ KIỆN & PHONG TỤC VĂN HÓA
      ========================================================================= */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedEventModal(null)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center absolute top-4 right-4 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${selectedEventModal.color}`}>
                {selectedEventModal.category}
              </span>
              <span className="text-xs font-bold text-slate-600">
                {selectedEventModal.dateStr}
              </span>
            </div>

            <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">
              {selectedEventModal.title}
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                <strong className="text-amber-900 font-bold block mb-1">🏮 Ý Nghĩa Văn Hóa:</strong>
                <p>{selectedEventModal.meaning}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200/70">
                <strong className="text-red-900 font-bold block mb-1">🌾 Phong Tục & Tập Quán:</strong>
                <p>{selectedEventModal.traditions}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedEventModal(null)}
              className="w-full mt-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Đã hiểu & Đóng lại
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TÀI KHOẢN & TIỆN ÍCH ĐỔI NGÀY ÂM - DƯƠNG
      ========================================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header: Sub-tabs Switcher + Close Button */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2 shrink-0">
              <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl">
                <button
                  onClick={() => setAccountModalTab('account')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    accountModalTab === 'account'
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Tài Khoản</span>
                </button>
                <button
                  onClick={() => setAccountModalTab('converter')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    accountModalTab === 'converter'
                      ? 'bg-white text-[#B3261E] shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Đổi Ngày Âm – Dương</span>
                </button>
              </div>

              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1">
              {accountModalTab === 'account' ? (
                <div>
                  <div className="text-center mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#B3261E] flex items-center justify-center mx-auto mb-2 shadow-2xs">
                      <User className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold font-serif text-slate-900">
                      Tài Khoản Người Dùng
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentUser.isGuest ? 'Đang dùng tài khoản khách trên thiết bị' : `Đã đăng nhập: ${currentUser.email || currentUser.name}`}
                    </p>
                  </div>

                  {currentUser.isGuest ? (
                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
                        Đăng nhập để đồng bộ toàn bộ ngày giỗ, lịch cúng rằm và nhắc nhở cá nhân lên đám mây, không lo mất dữ liệu khi đổi điện thoại hay máy tính.
                      </div>

                      <button
                        onClick={() => {
                          const userAccount: UserAccount = {
                            id: 'user_google_' + Date.now(),
                            email: 'user.lichviet@gmail.com',
                            name: 'Nguyễn Văn An',
                            isGuest: false,
                            createdAt: new Date().toISOString()
                          };
                          onLoginSuccess(userAccount, true);
                          setIsAuthModalOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Đăng nhập 1 chạm bằng Google</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                        Tài khoản của bạn đã được bảo vệ. Lịch nhắc nhở được sao lưu an toàn trên đám mây.
                      </div>
                      <button
                        onClick={() => {
                          onLogout();
                          setIsAuthModalOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  )}

                  {/* Tiện ích mở rộng: Chuyển đổi ngày */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Tiện Ích Đi Kèm
                    </span>
                    <button
                      onClick={() => setAccountModalTab('converter')}
                      className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-200 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                          <ArrowRightLeft className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-xs text-slate-800 block">Đổi Ngày Âm – Dương</span>
                          <span className="text-[11px] text-slate-500">Tra cứu ngày âm, can chi, hoàng đạo</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#B3261E]">Mở →</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-base font-bold font-serif text-slate-900">
                      Chuyển Đổi Ngày Âm – Dương
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Thuật toán thiên văn chuẩn UTC+7 của Hồ Ngọc Đức
                    </p>
                  </div>

                  {/* Mode Switcher */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setConvMode('s2l')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        convMode === 's2l'
                          ? 'bg-[#B3261E] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Dương → Âm
                    </button>
                    <button
                      onClick={() => setConvMode('l2s')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        convMode === 'l2s'
                          ? 'bg-[#B3261E] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Âm → Dương
                    </button>
                  </div>

                  {/* Date Inputs */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Ngày (1-31)</label>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={convDay}
                        onChange={(e) => setConvDay(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-400 outline-none text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Tháng (1-12)</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={convMonth}
                        onChange={(e) => setConvMonth(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-400 outline-none text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Năm</label>
                      <input
                        type="number"
                        min={1900}
                        max={2100}
                        value={convYear}
                        onChange={(e) => setConvYear(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-400 outline-none text-center"
                      />
                    </div>
                  </div>

                  {convMode === 'l2s' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="leap-chk"
                        checked={convIsLeap}
                        onChange={(e) => setConvIsLeap(e.target.checked)}
                        className="w-4 h-4 rounded text-red-600 cursor-pointer"
                      />
                      <label htmlFor="leap-chk" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Là tháng nhuận Âm lịch
                      </label>
                    </div>
                  )}

                  {/* Result Box */}
                  {convResult && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1.5">
                        Kết Quả Quy Đổi
                      </span>

                      <div className="grid grid-cols-2 gap-2 mb-2.5">
                        <div className="bg-white p-2 rounded-xl border border-amber-100">
                          <span className="text-[10px] text-slate-400 block">Dương Lịch</span>
                          <strong className="text-xs sm:text-sm font-bold text-emerald-800">{convResult.solarDate}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-amber-100">
                          <span className="text-[10px] text-slate-400 block">Âm Lịch</span>
                          <strong className="text-xs sm:text-sm font-bold text-[#B3261E]">{convResult.lunarDate}</strong>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-slate-700">
                        <p><strong>Can Chi:</strong> {convResult.canChiInfo}</p>
                        <p><strong>Tiết Khí:</strong> {convResult.tietKhi}</p>
                        <p><strong>Đánh Giá:</strong> {convResult.rating}</p>
                      </div>

                      <button
                        onClick={() => {
                          onDateChange(convResult.targetDate);
                          setActiveTab('today');
                          setIsAuthModalOpen(false);
                        }}
                        className="w-full mt-3 py-2.5 rounded-xl bg-[#B3261E] hover:bg-[#8B1D1D] text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                      >
                        Xem Tờ Lịch Ngày Này →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM NHẮC NHỞ MỚI
      ========================================================================= */}
      {isAddReminderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddReminderModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center absolute top-4 right-4 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">
              Thêm Nhắc Nhở & Ngày Giỗ
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Hỗ trợ tự động quy đổi và nhắc theo cả Lịch Âm & Lịch Dương
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const title = form.title.value;
                const dateStr = form.date.value;
                const repeat = form.repeat.value;
                const notes = form.notes.value;

                if (!title) return;

                const newRem: ReminderItem = {
                  id: 'rem_' + Date.now(),
                  title,
                  calendarType: 'both',
                  solarDate: dateStr || `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                  lunarDay: dayData.lunar.day,
                  lunarMonth: dayData.lunar.month,
                  lunarFormatted: `${dayData.lunar.day}/${dayData.lunar.month} âm lịch`,
                  time: 'all_day',
                  repeat,
                  remindBeforeDays: 1,
                  icon: 'cake',
                  notes,
                  isCompleted: false,
                  section: 'upcoming',
                };

                onAddReminder(newRem);
                setIsAddReminderModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung nhắc nhở / Tên ngày giỗ:</label>
                <input
                  name="title"
                  required
                  placeholder="Ví dụ: Giỗ Cụ Cố, Cúng Rằm tháng 8, Sinh nhật Mẹ..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ngày diễn ra (Dương lịch):</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tần suất nhắc:</label>
                <select
                  name="repeat"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-red-400"
                >
                  <option value="yearly">Lặp lại hàng năm (Khuyên dùng cho ngày giỗ, sinh nhật)</option>
                  <option value="monthly">Lặp lại hàng tháng (Cúng mùng 1, rằm)</option>
                  <option value="none">Chỉ nhắc 1 lần duy nhất</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú thêm:</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Chuẩn bị mâm cỗ chay, hoa tươi, bánh nướng..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddReminderModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#B3261E] hover:bg-[#8B1D1D] text-white font-bold shadow-2xs"
                >
                  Lưu Nhắc Nhở
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
