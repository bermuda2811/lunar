"use strict";
/**
 * Vietnamese Lunar Calendar (Âm lịch Việt Nam)
 * Based on the astronomical algorithm by Ho Ngoc Duc (UTC+7, Vietnam Standard Time)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.jdFromDate = jdFromDate;
exports.jdToDate = jdToDate;
exports.solarToLunar = solarToLunar;
exports.lunarToSolar = lunarToSolar;
exports.getCanChi = getCanChi;
exports.getTietKhi = getTietKhi;
exports.getDayRating = getDayRating;
exports.getAuspiciousHours = getAuspiciousHours;
exports.getDayOfWeekName = getDayOfWeekName;
exports.getFullDayData = getFullDayData;
const TIME_ZONE = 7.0; // UTC+7 for Vietnam
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const GIO_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const GIO_TIME_RANGES = [
    '23h - 1h', '1h - 3h', '3h - 5h', '5h - 7h',
    '7h - 9h', '9h - 11h', '11h - 13h', '13h - 15h',
    '15h - 17h', '17h - 19h', '19h - 21h', '21h - 23h'
];
const TIET_KHI_NAMES = [
    'Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ',
    'Tiểu mãn', 'Mang chủng', 'Hạ chí', 'Tiểu thử',
    'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ',
    'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông',
    'Tiểu tuyết', 'Đại tuyết', 'Đông chí', 'Tiểu hàn',
    'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'
];
function jdFromDate(dd, mm, yy) {
    const a = Math.floor((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) {
        jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    return jd;
}
function jdToDate(jd) {
    let a, b, c, d, e, m;
    if (jd > 2299160) {
        a = jd + 32044;
        b = Math.floor((4 * a + 3) / 146097);
        c = a - Math.floor((146097 * b) / 4);
    }
    else {
        b = 0;
        c = jd + 32082;
    }
    d = Math.floor((4 * c + 3) / 1461);
    e = c - Math.floor((1461 * d) / 4);
    m = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);
    return { day, month, year };
}
function getNewMoonDay(k, timeZone) {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    const C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    const C2 = -0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
    const C3 = -0.0004 * Math.sin(3 * dr * Mpr);
    const C4 = 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
    const C5 = -0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
    const C6 = -0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
    const C7 = 0.001 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
    const deltaT = Jd1 + C1 + C2 + C3 + C4 + C5 + C6 + C7;
    return Math.floor(deltaT + 0.5 + timeZone / 24);
}
function getSunLongitude(jdn, timeZone) {
    const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
    const T2 = T * T;
    const dr = Math.PI / 180;
    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    const DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M) +
        (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
        0.00029 * Math.sin(dr * 3 * M);
    let L = L0 + DL;
    L = L * dr;
    L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
    return Math.floor((L / Math.PI) * 6);
}
function getLunarMonth11(yy, timeZone) {
    const off = jdFromDate(31, 12, yy) - 2415021;
    const k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    const sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
}
function getLeapMonthOffset(a11, timeZone) {
    const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
}
function solarToLunar(dd, mm, yy) {
    const currentJd = jdFromDate(dd, mm, yy);
    const k = Math.floor((currentJd - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, TIME_ZONE);
    if (monthStart > currentJd) {
        monthStart = getNewMoonDay(k, TIME_ZONE);
    }
    let a11 = getLunarMonth11(yy - 1, TIME_ZONE);
    let b11 = a11;
    let lunarYear = yy;
    if (a11 >= monthStart) {
        lunarYear = yy - 1;
        a11 = getLunarMonth11(yy - 2, TIME_ZONE);
    }
    else {
        b11 = getLunarMonth11(yy, TIME_ZONE);
    }
    if (monthStart >= b11) {
        lunarYear = yy + 1;
        a11 = b11;
        b11 = getLunarMonth11(yy + 1, TIME_ZONE);
    }
    const lunarDay = currentJd - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);
    let lunarLeap = false;
    let lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
        const leapMonthDiff = getLeapMonthOffset(a11, TIME_ZONE);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff === leapMonthDiff) {
                lunarLeap = true;
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }
    return {
        day: lunarDay,
        month: lunarMonth,
        year: lunarYear,
        isLeap: lunarLeap,
        jd: currentJd
    };
}
function lunarToSolar(lunarDay, lunarMonth, lunarYear, isLeapMonth = false) {
    let a11;
    if (lunarMonth < 11) {
        a11 = getLunarMonth11(lunarYear - 1, TIME_ZONE);
    }
    else {
        a11 = getLunarMonth11(lunarYear, TIME_ZONE);
    }
    const b11 = getLunarMonth11(lunarYear, TIME_ZONE);
    let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let off = lunarMonth - 11;
    if (off < 0) {
        off += 12;
    }
    if (b11 - a11 > 365) {
        const leapOff = getLeapMonthOffset(a11, TIME_ZONE);
        let leapMonth = leapOff - 2;
        if (leapMonth <= 0) {
            leapMonth += 12;
        }
        if (isLeapMonth && lunarMonth === leapMonth) {
            off = leapOff;
        }
        else if (off >= leapOff) {
            off += 1;
        }
    }
    const monthStart = getNewMoonDay(k + off, TIME_ZONE);
    return jdToDate(monthStart + lunarDay - 1);
}
function getCanChi(dd, mm, yy, lunarYear, lunarMonth) {
    const jd = jdFromDate(dd, mm, yy);
    const dayCanIndex = (jd + 9) % 10;
    const dayChiIndex = (jd + 1) % 12;
    const yearCanIndex = (lunarYear + 6) % 10;
    const yearChiIndex = (lunarYear + 8) % 12;
    // Can của tháng dựa vào Can của năm:
    // Giáp, Kỷ -> Bính; Ất, Canh -> Mậu; Bính, Tân -> Canh; Đinh, Nhâm -> Nhâm; Mậu, Quý -> Giáp
    const monthCanBase = (yearCanIndex % 5) * 2 + 2;
    const monthCanIndex = (monthCanBase + (lunarMonth - 1)) % 10;
    // Chi của tháng 1 luôn là Dần (index 2)
    const monthChiIndex = (lunarMonth + 1) % 12;
    return {
        day: `${CAN[dayCanIndex]} ${CHI[dayChiIndex]}`,
        month: `${CAN[monthCanIndex]} ${CHI[monthChiIndex]}`,
        year: `${CAN[yearCanIndex]} ${CHI[yearChiIndex]}`,
        dayChiIndex,
        dayCanIndex,
        yearCanIndex,
        yearChiIndex
    };
}
function getSunLongitude24(jdn, timeZone) {
    const T = (jdn - 2451545.0 - timeZone / 24.0) / 36525.0;
    const T2 = T * T;
    const dr = Math.PI / 180;
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T2;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T2;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr)
        + (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr)
        + 0.000289 * Math.sin(3 * M * dr);
    let theta = L0 + C;
    theta = theta * dr;
    theta = theta - Math.PI * 2 * Math.floor(theta / (Math.PI * 2));
    return Math.floor((theta / (Math.PI * 2)) * 24);
}
function getTietKhi(dd, mm, yy) {
    const jd = jdFromDate(dd, mm, yy);
    const currentIdx = getSunLongitude24(jd, TIME_ZONE);
    const currentName = TIET_KHI_NAMES[currentIdx % 24];
    const nextName = TIET_KHI_NAMES[(currentIdx + 1) % 24];
    // Tính số ngày chính xác đến tiết khí kế tiếp
    let days = 1;
    while (days <= 20) {
        const nextJd = jd + days;
        const nextIdx = getSunLongitude24(nextJd, TIME_ZONE);
        if (nextIdx !== currentIdx) {
            break;
        }
        days++;
    }
    return {
        name: currentName,
        nextName: nextName,
        daysRemaining: days
    };
}
// Tính Ngày Hoàng Đạo / Hắc Đạo theo 12 Trực / Thập Nhị Tinh
function getDayRating(dayChiIndex, monthChiIndex) {
    // Bảng 12 sao hoàng đạo theo Chi tháng (Thanh Long, Minh Đường, Thiên Hình, Chu Tước, Kim Quỹ, Kim Đường/Thiên Đức, Bạch Hổ, Ngọc Đường, Thiên Lao, Huyền Vũ, Tư Mệnh, Câu Trận)
    // Các sao Hoàng Đạo (Tốt): 0 (Thanh Long), 1 (Minh Đường), 4 (Kim Quỹ), 5 (Thiên Đức/Bảo Quang), 7 (Ngọc Đường), 10 (Tư Mệnh)
    const offset = (monthChiIndex % 6) * 2;
    const starIndex = (dayChiIndex - offset + 12) % 12;
    const isHoangDao = [0, 1, 4, 5, 7, 10].includes(starIndex);
    if (isHoangDao) {
        return {
            isGoodDay: true,
            label: 'Tốt - Ngày hoàng đạo',
            suitableFor: ['Cưới hỏi', 'xuất hành', 'khai trương', 'ký kết', 'cầu tài', 'hội họp'],
            avoid: ['Động thổ', 'sửa nhà (lưu ý tùy việc cụ thể)', 'tranh chấp']
        };
    }
    else {
        return {
            isGoodDay: false,
            label: 'Bình thường - Ngày hắc đạo',
            suitableFor: ['Cúng tế', 'quét dọn', 'nghỉ ngơi', 'việc thiện'],
            avoid: ['Khai trương', 'cưới hỏi', 'xuất hành xa', 'khởi công lớn']
        };
    }
}
// 6 Giờ Hoàng Đạo trong ngày
function getAuspiciousHours(dayChiIndex) {
    // Tính dựa trên Chi ngày: 6 giờ hoàng đạo tương ứng
    // Tý/Ngọ: Tý, Sửu, Mão, Ngọ, Thân, Dậu
    // Dần/Thân: Tý, Sửu, Thìn, Tỵ, Mùi, Tuất
    // Mão/Dậu: Tý, Dần, Mão, Ngọ, Mùi, Dậu
    // Thìn/Tuất: Dần, Thìn, Tỵ, Thân, Dậu, Hợi
    // Tỵ/Hợi: Sửu, Thìn, Ngọ, Mùi, Tuất, Hợi
    // Sửu/Mùi: Dần, Mão, Tỵ, Thân, Tuất, Hợi
    const group = dayChiIndex % 6;
    const hoangDaoIndicesMap = {
        0: [0, 1, 3, 6, 8, 9], // Tý/Ngọ
        1: [2, 3, 5, 8, 10, 11], // Sửu/Mùi
        2: [0, 1, 4, 5, 7, 10], // Dần/Thân
        3: [0, 2, 3, 6, 7, 9], // Mão/Dậu
        4: [2, 4, 5, 8, 9, 11], // Thìn/Tuất
        5: [1, 4, 6, 7, 10, 11] // Tỵ/Hợi
    };
    const goodIndices = hoangDaoIndicesMap[group] || [0, 1, 4, 5, 7, 10];
    return goodIndices.map(idx => ({
        canChi: GIO_CHI[idx],
        time: GIO_TIME_RANGES[idx],
        isGood: true
    }));
}
function getDayOfWeekName(day, month, year) {
    const jd = jdFromDate(day, month, year);
    const dow = (jd + 1) % 7; // 0 = Chủ Nhật, 1 = Thứ Hai, ...
    const names = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return names[dow];
}
function getFullDayData(day, month, year) {
    const lunar = solarToLunar(day, month, year);
    const canChi = getCanChi(day, month, year, lunar.year, lunar.month);
    const tietKhi = getTietKhi(day, month, year);
    const rating = getDayRating(canChi.dayChiIndex, (lunar.month + 1) % 12);
    const auspiciousHours = getAuspiciousHours(canChi.dayChiIndex);
    const dayOfWeek = getDayOfWeekName(day, month, year);
    return {
        solar: {
            day,
            month,
            year,
            dayOfWeek,
            formatted: `${day}/${month}/${year}`
        },
        lunar: {
            day: lunar.day,
            month: lunar.month,
            year: lunar.year,
            yearName: canChi.year,
            isLeap: lunar.isLeap,
            formatted: `${lunar.day < 10 ? '0' + lunar.day : lunar.day}/${lunar.month < 10 ? '0' + lunar.month : lunar.month}/${canChi.year}`
        },
        canChi,
        tietKhi,
        rating,
        auspiciousHours
    };
}
