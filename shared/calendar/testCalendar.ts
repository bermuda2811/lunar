import { getFullDayData, solarToLunar, lunarToSolar, getDayRating, getAuspiciousHours, getCanChi } from './lunarCalendar';

console.log('=== BỘ KIỂM THỬ ĐỘ CHÍNH XÁC THIÊN VĂN LỊCH AN NHIÊN (HỒ NGỌC ĐỨC UTC+7) ===\n');

// 1. Kiểm tra ngày thực tế hôm nay (3/10/2026)
console.log('--- TEST 1: Ngày Thực Tế Hôm Nay (3/10/2026) ---');
const today = getFullDayData(3, 10, 2026);
console.log('Thứ:', today.solar.dayOfWeek);
console.log('Âm lịch:', `${today.lunar.day}/${today.lunar.month} Năm ${today.lunar.yearName}`);
console.log('Can Chi:', `Ngày ${today.canChi.day} - Tháng ${today.canChi.month} - Năm ${today.canChi.year}`);
console.log('Tiết khí:', `${today.tietKhi.name} (còn ${today.tietKhi.daysRemaining} ngày đến ${today.tietKhi.nextName})`);
console.log('Đánh giá:', today.rating.label);
console.log('Giờ hoàng đạo:', today.auspiciousHours.map(h => `${h.canChi} (${h.time})`).join(', '));

// 2. Kiểm tra các mốc Tết Nguyên Đán (chuyển giao năm âm lịch)
console.log('\n--- TEST 2: Chuyển giao Năm Âm Lịch (Trước & Sau Tết Nguyên Đán) ---');
const tetCases = [
  { name: 'Giao thừa Tết Giáp Thìn (30 Tết 2024)', d: 9, m: 2, y: 2024, expectedLunarYear: 2023, expectedYearName: 'Quý Mão' },
  { name: 'Mùng 1 Tết Giáp Thìn 2024', d: 10, m: 2, y: 2024, expectedLunarYear: 2024, expectedYearName: 'Giáp Thìn' },
  { name: 'Trước Tết Ất Tỵ (28/1/2025 - 29 tháng Chạp)', d: 28, m: 1, y: 2025, expectedLunarYear: 2024, expectedYearName: 'Giáp Thìn' },
  { name: 'Mùng 1 Tết Ất Tỵ 2025', d: 29, m: 1, y: 2025, expectedLunarYear: 2025, expectedYearName: 'Ất Tỵ' },
  { name: 'Trước Tết Bính Ngọ (16/2/2026 - 29 tháng Chạp)', d: 16, m: 2, y: 2026, expectedLunarYear: 2025, expectedYearName: 'Ất Tỵ' },
  { name: 'Mùng 1 Tết Bính Ngọ 2026', d: 17, m: 2, y: 2026, expectedLunarYear: 2026, expectedYearName: 'Bính Ngọ' },
  { name: 'Mùng 1 Tết Đinh Mùi 2027', d: 6, m: 2, y: 2027, expectedLunarYear: 2027, expectedYearName: 'Đinh Mùi' },
];

for (const tc of tetCases) {
  const lunar = solarToLunar(tc.d, tc.m, tc.y);
  const canChi = getCanChi(tc.d, tc.m, tc.y, lunar.year, lunar.month);
  const pass = (lunar.year === tc.expectedLunarYear) && canChi.year.includes(tc.expectedYearName);
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${tc.name} (${tc.d}/${tc.m}/${tc.y}): Âm ${lunar.day}/${lunar.month} Năm ${canChi.year}`);
  if (!pass) throw new Error(`Test failed for ${tc.name}`);
}

// 3. Roundtrip test (Dương -> Âm -> Dương)
console.log('\n--- TEST 3: Kiểm thử Chuyển đổi 2 chiều (Roundtrip Solar -> Lunar -> Solar) ---');
const sampleDays = [
  [1, 1, 2024], [10, 2, 2024], [1, 5, 2024], [2, 9, 2024],
  [1, 1, 2025], [29, 1, 2025], [1, 6, 2025], [2, 9, 2025],
  [1, 1, 2026], [17, 2, 2026], [16, 9, 2026], [25, 9, 2026], [3, 10, 2026], [31, 12, 2026],
  [1, 1, 2027], [6, 2, 2027]
];

for (const [d, m, y] of sampleDays) {
  const lunar = solarToLunar(d, m, y);
  const solar = lunarToSolar(lunar.day, lunar.month, lunar.year, lunar.isLeap);
  const pass = (solar.day === d && solar.month === m && solar.year === y);
  if (!pass) throw new Error(`Roundtrip failed for ${d}/${m}/${y}: Got ${solar.day}/${solar.month}/${solar.year}`);
}
console.log(`✅ Toàn bộ ${sampleDays.length} ngày kiểm thử đều chuyển đổi 2 chiều chính xác 100%!`);

// 4. Kiểm thử Ngày Hoàng Đạo
console.log('\n--- TEST 4: Kiểm thử Ngày Hoàng Đạo / Hắc Đạo ---');
const ratingCases = [
  { d: 17, m: 2, y: 2026, desc: 'Mùng 1 Tết Bính Ngọ (Nhâm Tuất)', expectGood: true },
  { d: 29, m: 1, y: 2025, desc: 'Mùng 1 Tết Ất Tỵ (Mậu Tuất)', expectGood: true },
  { d: 10, m: 2, y: 2024, desc: 'Mùng 1 Tết Giáp Thìn (Giáp Thìn)', expectGood: true }
];

for (const rc of ratingCases) {
  const data = getFullDayData(rc.d, rc.m, rc.y);
  const pass = data.rating.isGoodDay === rc.expectGood;
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${rc.desc} (${rc.d}/${rc.m}/${rc.y}): ${data.rating.label}`);
  if (!pass) throw new Error(`Rating test failed for ${rc.desc}`);
}

console.log('\n✅ TẤT CẢ CÁC BÀI KIỂM THỬ THIÊN VĂN ÂM DƯƠNG LỊCH ĐỀU VƯỢT QUA XUẤT SẮC!');
