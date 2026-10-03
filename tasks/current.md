## Nhiệm vụ Hiện tại: Tối Ưu Hóa Chuẩn SEO Toàn Diện Cho Domain lichannhien.com
- **Mục tiêu**:
  1. Tối ưu hóa toàn diện cho tên miền chính thức `lichannhien.com`.
  2. Đưa website lên Top tìm kiếm Google và các Search Engine cho nhóm từ khóa cốt lõi:
     - *"lịch"*, *"lịch âm dương"*, *"xem ngày"*, *"xem ngày âm dương"*, *"ngày hôm nay"*, *"lịch hôm nay"*, *"hôm nay ngày mấy"*, *"hôm nay là bao nhiêu âm lịch"*.
     - Nhóm từ khóa phụ trợ: *"giờ hoàng đạo hôm nay"*, *"xem ngày tốt xấu"*, *"đổi ngày âm dương"*, *"lịch việt nam"*, *"lịch vạn niên 2026"*, *"tiết khí"*, *"bính ngọ 2026"*.
  3. Xây dựng nền tảng Technical SEO, On-page SEO, Rich Snippet Schemas (JSON-LD), Semantic HTML Pre-hydration Shell, XML Sitemap và Robots.txt.

- **Tiến độ triển khai**:
  - [x] Tạo `web/public/robots.txt`: Cấu hình bot crawling, chặn `/admin`, `/api/`, `/mobile-review`, trỏ sitemap chuẩn.
  - [x] Tạo `web/public/sitemap.xml`: Chuẩn sitemap XML định dạng 2026-10-03 cho các trang và tabs (`today`, `month`, `events`, `converter`, `donate`).
  - [x] Tạo `web/public/manifest.json`: Web App Manifest cho Google PWA và Mobile Search Snippet.
  - [x] Tạo assets OpenGraph & Twitter Cards: `web/public/favicon.svg`, `web/public/og-image.svg`, `web/public/og-image.png` (1200x630 px).
  - [x] Tối ưu hóa HTML Shell & Rich Schemas (`web/index.html`):
    - Canonical tag: `https://lichannhien.com/`.
    - Meta Title & Description chuẩn 155-160 ký tự trả lời trực diện câu hỏi *"Hôm nay ngày mấy? Hôm nay là bao nhiêu âm lịch?"*.
    - Meta Keywords bao phủ 100% từ khóa người dùng yêu cầu.
    - 3 Schema.org JSON-LD: `WebSite` (Sitelinks Searchbox), `WebApplication` (Rating 4.9⭐, Free), `FAQPage` (5 câu hỏi đáp phổ biến nhất).
    - Semantic Pre-hydration Crawler Shell: Cung cấp nội dung tĩnh `<h1>`, `<h2>` và câu trả lời nhanh để crawler Googlebot/Bingbot đọc được ngay lập tức.
  - [x] Tối ưu hóa React Component & Dynamic SEO (`web/src/views/CalendarWebApp.tsx`):
    - Thẻ `<h1>` ngữ nghĩa chuẩn cho bot và accessibility.
    - SEO Quick Answer Banner: Khung trả lời câu hỏi trực tiếp trên đầu tờ lịch xé: *"Hôm nay ngày mấy? Thứ X, dd/mm/yyyy • Hôm nay là bao nhiêu âm lịch? Ngày dd/mm (Can Chi)"*.
    - SEO Knowledge Hub & FAQ Accordion: Chuyên mục cẩm nang tra cứu và 4 thẻ Q&A accordion phía trên footer giải đáp chi tiết các từ khóa trọng tâm.
    - Dynamic SEO Hook `useEffect`: Tự động cập nhật `document.title` và `meta[name="description"]` thời gian thực theo từng ngày và tab đang chọn.
  - [x] Kiểm thử tự động: `npm test` vượt qua 100%.
  - [x] Kiểm thử build: `npm run build` biên dịch thành công 100% không có lỗi.
  - [x] Kiểm thử truy xuất thực tế: curl `robots.txt`, `sitemap.xml`, `manifest.json`, `index.html` từ Vite dev server hoạt động chính xác.
  - [x] Cập nhật tài liệu: `docs/DECISIONS.md` (D-013), `docs/PRODUCT.md`, `docs/CHANGELOG.md`, `tasks/current.md`.
