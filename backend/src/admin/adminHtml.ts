export function getAdminHtml(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lịch Việt — Hệ Thống Quản Trị Backend CMS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Serif:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root {
      --primary: #B3261E;
      --primary-dark: #8B1D1D;
      --primary-light: #FFEBEE;
      --secondary: #198754;
      --bg: #F4F6F9;
      --sidebar-bg: #1B2232;
      --sidebar-hover: #263045;
      --sidebar-active: #B3261E;
      --card-bg: #FFFFFF;
      --text: #1C2434;
      --text-muted: #64748B;
      --border: #E2E8F0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      display: flex;
      min-height: 100vh;
    }

    /* SIDEBAR (Matches Screen 11 Wireframe) */
    .sidebar {
      width: 250px;
      background-color: var(--sidebar-bg);
      color: #fff;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      box-shadow: 2px 0 10px rgba(0,0,0,0.05);
    }

    .brand {
      padding: 24px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .brand-icon {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #B3261E, #8B1D1D);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      box-shadow: 0 4px 10px rgba(179,38,30,0.3);
    }

    .brand-text {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #fff;
    }

    .nav-menu {
      list-style: none;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: 8px;
      color: #94A3B8;
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background-color: var(--sidebar-hover);
      color: #fff;
    }

    .nav-item.active {
      background-color: var(--sidebar-active);
      color: #fff;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(179,38,30,0.35);
    }

    .nav-item i {
      font-size: 16px;
      width: 20px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid rgba(255,255,255,0.08);
      font-size: 12px;
      color: #64748B;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* MAIN CONTENT */
    .main-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .top-header {
      background-color: #fff;
      border-bottom: 1px solid var(--border);
      padding: 16px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-title h1 {
      font-size: 22px;
      font-weight: 700;
      color: var(--text);
    }

    .header-title p {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .badge-api {
      background: #E8F5E9;
      color: #2E7D32;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .content-body {
      padding: 28px 32px;
      flex: 1;
    }

    /* STATS CARDS */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .stat-icon.red { background: #FFEBEE; color: #B3261E; }
    .stat-icon.green { background: #E8F5E9; color: #198754; }
    .stat-icon.blue { background: #E3F2FD; color: #1976D2; }
    .stat-icon.orange { background: #FFF3E0; color: #F57C00; }

    .stat-info .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--text);
    }

    .stat-info .stat-label {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* CARD CONTAINER */
    .card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      margin-bottom: 28px;
      overflow: hidden;
    }

    .card-header {
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
    }

    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
    }

    .btn-primary {
      background-color: var(--primary);
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background-color: var(--primary-dark);
    }

    /* TABLE STYLES (Matching Screen 11 Wireframe) */
    .table-responsive {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      background-color: #F8FAFC;
      padding: 14px 20px;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      border-bottom: 1px solid var(--border);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 16px 20px;
      font-size: 14px;
      color: var(--text);
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    tr:hover td {
      background-color: #F8FAFC;
    }

    .date-badge {
      font-weight: 700;
      color: var(--primary);
      background: var(--primary-light);
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
      font-size: 13px;
    }

    .category-badge {
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      background: #EDF2F7;
      color: #4A5568;
      font-weight: 500;
    }

    .status-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .status-badge.active {
      background-color: #E8F5E9;
      color: #2E7D32;
    }

    .status-badge.hidden {
      background-color: #ECEFF1;
      color: #607D8B;
    }

    .action-btns {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 15px;
      color: #64748B;
      padding: 6px;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .btn-icon.edit:hover {
      color: #1976D2;
      background: #E3F2FD;
    }

    .btn-icon.delete:hover {
      color: #D32F2F;
      background: #FFEBEE;
    }

    /* WIREFRAME FEATURE INFO BOX (Matching Screen 11) */
    .wireframe-info-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      background: linear-gradient(135deg, #FAF7F2, #FFFBF5);
      border: 1px solid #EAD8C7;
      border-radius: 12px;
      padding: 24px;
      margin-top: 10px;
    }

    .info-section h3 {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary-dark);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info-section ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 14px;
      color: #4A5568;
    }

    .info-section li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      line-height: 1.5;
    }

    .info-section li::before {
      content: "•";
      color: var(--primary);
      font-size: 18px;
      line-height: 1;
    }

    /* MODAL */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(2px);
    }

    .modal-overlay.show {
      display: flex;
    }

    .modal-card {
      background: #fff;
      border-radius: 14px;
      width: 100%;
      max-width: 580px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h2 {
      font-size: 18px;
      font-weight: 700;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #94A3B8;
    }

    .modal-body {
      padding: 24px;
      max-height: 75vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }

    .form-control {
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      border-color: var(--primary);
    }

    textarea.form-control {
      min-height: 80px;
      resize: vertical;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      background: #F8FAFC;
    }

    .btn-secondary {
      background: #fff;
      border: 1px solid var(--border);
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      color: #475569;
    }
  </style>
</head>
<body>

  <!-- SIDEBAR (Khớp Screen 11 Wireframe) -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">
        <i class="fa-solid fa-calendar-days"></i>
      </div>
      <div class="brand-text">Lịch Việt</div>
    </div>

    <ul class="nav-menu">
      <li class="nav-item" onclick="switchTab('overview')">
        <i class="fa-solid fa-house"></i>
        <span>Tổng quan</span>
      </li>
      <li class="nav-item active" onclick="switchTab('events')">
        <i class="fa-solid fa-calendar-check"></i>
        <span>Quản lý sự kiện</span>
      </li>
      <li class="nav-item" onclick="switchTab('quotes')">
        <i class="fa-solid fa-pen-nib"></i>
        <span>Quản lý nội dung</span>
      </li>
      <li class="nav-item" onclick="switchTab('users')">
        <i class="fa-solid fa-users"></i>
        <span>Quản lý người dùng</span>
      </li>
      <li class="nav-item" onclick="switchTab('analytics')">
        <i class="fa-solid fa-chart-pie"></i>
        <span>Thống kê</span>
      </li>
      <li class="nav-item" onclick="switchTab('settings')">
        <i class="fa-solid fa-gear"></i>
        <span>Cài đặt</span>
      </li>
    </ul>

    <div class="sidebar-footer">
      <span>Hệ thống CMS v1.0</span>
      <i class="fa-solid fa-circle-check" style="color: #4CAF50;"></i>
    </div>
  </aside>

  <!-- MAIN CONTAINER -->
  <main class="main-container">
    <header class="top-header">
      <div class="header-title">
        <h1 id="page-title">Quản lý sự kiện</h1>
        <p>Quản lý toàn bộ sự kiện văn hóa, ngày lễ Việt Nam & Quốc tế cho ứng dụng di động</p>
      </div>
      <div class="header-actions">
        <div class="badge-api">
          <i class="fa-solid fa-satellite-dish"></i> API Live: Port 4000
        </div>
        <a href="http://localhost:3000" target="_blank" class="btn-primary" style="background:#263045; text-decoration:none;">
          <i class="fa-solid fa-mobile-screen"></i> Mở Web Lịch App
        </a>
      </div>
    </header>

    <div class="content-body">
      <!-- STATS ROW -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon red">
            <i class="fa-solid fa-calendar-star"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value" id="stat-total-events">11</div>
            <div class="stat-label">Tổng sự kiện trong hệ thống</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <i class="fa-solid fa-check-double"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value" id="stat-active-events">11</div>
            <div class="stat-label">Đang hiển thị trên App</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="fa-solid fa-moon"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">3</div>
            <div class="stat-label">Ngày lễ Âm lịch</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <i class="fa-solid fa-users"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">1,680</div>
            <div class="stat-label">Người dùng tích cực</div>
          </div>
        </div>
      </div>

      <!-- MAIN TABLE CARD (Khớp 100% Màn hình 11) -->
      <div class="card" id="events-section">
        <div class="card-header">
          <div class="card-title">Danh sách sự kiện</div>
          <button class="btn-primary" onclick="openAddEventModal()">
            <i class="fa-solid fa-plus"></i> Thêm sự kiện
          </button>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Tên sự kiện</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th style="text-align: right;">Thao tác</th>
              </tr>
            </thead>
            <tbody id="events-table-body">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- FEATURE INFO BOX (Khớp 100% Khung thông tin wireframe) -->
      <div class="wireframe-info-box">
        <div class="info-section">
          <h3><i class="fa-solid fa-sliders"></i> Chức năng admin:</h3>
          <ul>
            <li>Quản lý sự kiện, ngày lễ, nội dung ý nghĩa</li>
            <li>Cập nhật câu chúc theo ngày</li>
            <li>Quản lý biểu tượng, danh mục</li>
            <li>Thống kê người dùng</li>
          </ul>
        </div>
        <div class="info-section">
          <h3><i class="fa-solid fa-bolt"></i> API cung cấp cho app:</h3>
          <ul>
            <li>Danh sách sự kiện đầy đủ</li>
            <li>Nội dung chi tiết & phong tục truyền thống</li>
            <li>Câu chúc / thông điệp ý nghĩa hàng ngày</li>
            <li>Cập nhật linh hoạt tức thì mà không cần update app</li>
          </ul>
        </div>
      </div>
    </div>
  </main>

  <!-- MODAL THÊM / SỬA SỰ KIỆN -->
  <div class="modal-overlay" id="event-modal">
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="modal-title">Thêm sự kiện mới</h2>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <form id="event-form" onsubmit="handleSaveEvent(event)">
        <input type="hidden" id="event-id" value="">
        <div class="modal-body">
          <div class="form-group">
            <label>Tên sự kiện *</label>
            <input type="text" id="event-title" class="form-control" placeholder="Ví dụ: Tết Trung Thu" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Loại lịch *</label>
              <select id="event-calendar-type" class="form-control">
                <option value="solar">Dương lịch</option>
                <option value="lunar">Âm lịch</option>
              </select>
            </div>
            <div class="form-group">
              <label>Danh mục / Loại *</label>
              <select id="event-category" class="form-control">
                <option value="Lễ Việt Nam">Lễ Việt Nam</option>
                <option value="Quốc tế">Quốc tế</option>
                <option value="Âm lịch">Âm lịch</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ngày (1-31) *</label>
              <input type="number" id="event-day" class="form-control" min="1" max="31" placeholder="15" required>
            </div>
            <div class="form-group">
              <label>Tháng (1-12) *</label>
              <input type="number" id="event-month" class="form-control" min="1" max="12" placeholder="8" required>
            </div>
          </div>

          <div class="form-group">
            <label>Trạng thái</label>
            <select id="event-status" class="form-control">
              <option value="active">Hiển thị</option>
              <option value="hidden">Ẩn</option>
            </select>
          </div>

          <div class="form-group">
            <label>Tóm tắt ngắn</label>
            <input type="text" id="event-summary" class="form-control" placeholder="Tóm tắt hiển thị trên lịch ngày...">
          </div>

          <div class="form-group">
            <label>Ý nghĩa văn hóa (Hiển thị Màn hình Chi tiết)</label>
            <textarea id="event-meaning" class="form-control" placeholder="Ý nghĩa nguồn gốc và thông điệp..."></textarea>
          </div>

          <div class="form-group">
            <label>Hoạt động truyền thống</label>
            <textarea id="event-traditions" class="form-control" placeholder="Các phong tục: rước đèn, cúng gia tiên..."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" onclick="closeModal()">Hủy</button>
          <button type="submit" class="btn-primary">Lưu sự kiện</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let currentEvents = [];

    async function fetchEvents() {
      try {
        const res = await fetch('/api/v1/events');
        const json = await res.json();
        if (json.success) {
          currentEvents = json.data;
          renderEventsTable(currentEvents);
          document.getElementById('stat-total-events').innerText = currentEvents.length;
          document.getElementById('stat-active-events').innerText = currentEvents.filter(e => e.status === 'active').length;
        }
      } catch (err) {
        console.error('Lỗi nạp sự kiện:', err);
      }
    }

    function renderEventsTable(events) {
      const tbody = document.getElementById('events-table-body');
      tbody.innerHTML = '';

      if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 32px; color: #94A3B8;">Chưa có sự kiện nào trong hệ thống</td></tr>';
        return;
      }

      events.forEach(ev => {
        const tr = document.createElement('tr');
        const isLunar = ev.calendar_type === 'lunar';
        const dateDisplay = ev.day + '/' + ev.month + (isLunar ? ' (Âm)' : '');
        const isActive = ev.status === 'active';

        tr.innerHTML = \`
          <td><span class="date-badge">\${dateDisplay}</span></td>
          <td><strong>\${ev.title}</strong></td>
          <td><span class="category-badge">\${ev.category}</span></td>
          <td>
            <span class="status-badge \${isActive ? 'active' : 'hidden'}">
              <i class="fa-solid fa-circle" style="font-size: 8px;"></i>
              \${isActive ? 'Hiển thị' : 'Ẩn'}
            </span>
          </td>
          <td style="text-align: right;">
            <div class="action-btns" style="justify-content: flex-end;">
              <button class="btn-icon edit" title="Chỉnh sửa" onclick="openEditModal(\${ev.id})">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-icon delete" title="Xóa" onclick="deleteEvent(\${ev.id}, '\${ev.title.replace(/'/g, "\\\\'")}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function openAddEventModal() {
      document.getElementById('modal-title').innerText = 'Thêm sự kiện mới';
      document.getElementById('event-id').value = '';
      document.getElementById('event-form').reset();
      document.getElementById('event-modal').classList.add('show');
    }

    function openEditModal(id) {
      const ev = currentEvents.find(e => e.id === id);
      if (!ev) return;

      document.getElementById('modal-title').innerText = 'Chỉnh sửa sự kiện';
      document.getElementById('event-id').value = ev.id;
      document.getElementById('event-title').value = ev.title;
      document.getElementById('event-calendar-type').value = ev.calendar_type;
      document.getElementById('event-category').value = ev.category;
      document.getElementById('event-day').value = ev.day;
      document.getElementById('event-month').value = ev.month;
      document.getElementById('event-status').value = ev.status;
      document.getElementById('event-summary').value = ev.summary || '';
      document.getElementById('event-meaning').value = ev.meaning || '';
      document.getElementById('event-traditions').value = ev.traditions || '';

      document.getElementById('event-modal').classList.add('show');
    }

    function closeModal() {
      document.getElementById('event-modal').classList.remove('show');
    }

    async function handleSaveEvent(e) {
      e.preventDefault();
      const id = document.getElementById('event-id').value;
      const data = {
        title: document.getElementById('event-title').value,
        calendar_type: document.getElementById('event-calendar-type').value,
        category: document.getElementById('event-category').value,
        day: parseInt(document.getElementById('event-day').value, 10),
        month: parseInt(document.getElementById('event-month').value, 10),
        status: document.getElementById('event-status').value,
        summary: document.getElementById('event-summary').value,
        meaning: document.getElementById('event-meaning').value,
        traditions: document.getElementById('event-traditions').value
      };

      try {
        const url = id ? \`/api/v1/events/\${id}\` : '/api/v1/events';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const json = await res.json();
        if (json.success) {
          closeModal();
          fetchEvents();
        } else {
          alert('Lỗi: ' + json.message);
        }
      } catch (err) {
        alert('Lỗi khi lưu sự kiện: ' + err.message);
      }
    }

    async function deleteEvent(id, title) {
      if (!confirm(\`Bạn có chắc chắn muốn xóa sự kiện "\${title}"?\`)) return;
      try {
        const res = await fetch(\`/api/v1/events/\${id}\`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          fetchEvents();
        }
      } catch (err) {
        alert('Lỗi khi xóa sự kiện: ' + err.message);
      }
    }

    function switchTab(tab) {
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      event.currentTarget.classList.add('active');
      if (tab === 'events') {
        document.getElementById('page-title').innerText = 'Quản lý sự kiện';
      } else if (tab === 'overview') {
        document.getElementById('page-title').innerText = 'Tổng quan hệ thống';
      } else if (tab === 'quotes') {
        document.getElementById('page-title').innerText = 'Quản lý nội dung & Câu chúc';
      } else if (tab === 'users') {
        document.getElementById('page-title').innerText = 'Quản lý người dùng';
      } else if (tab === 'analytics') {
        document.getElementById('page-title').innerText = 'Thống kê & Báo cáo';
      } else if (tab === 'settings') {
        document.getElementById('page-title').innerText = 'Cài đặt hệ thống';
      }
    }

    window.onload = fetchEvents;
  </script>
</body>
</html>`;
}
