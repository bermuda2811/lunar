export function getAdminHtml(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lịch An Nhiên — Hệ Thống Quản Trị Backend CMS</title>
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
      min-height: 100vh;
      display: flex;
    }

    /* LOGIN SCREEN STYLES */
    .login-wrapper {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, #131926 0%, #1E273A 50%, #2A1D20 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      z-index: 9999;
    }

    .login-card {
      background: #FFFFFF;
      width: 100%;
      max-width: 440px;
      border-radius: 20px;
      padding: 36px 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .login-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .login-logo {
      width: 56px;
      height: 56px;
      margin: 0 auto 14px;
      background: linear-gradient(135deg, #B3261E, #8B1D1D);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 26px;
      box-shadow: 0 8px 16px rgba(179, 38, 30, 0.35);
    }

    .login-header h2 {
      font-size: 22px;
      font-weight: 800;
      color: #1E293B;
      letter-spacing: -0.5px;
    }

    .login-header p {
      font-size: 13px;
      color: #64748B;
      margin-top: 4px;
    }

    .alert-error {
      background: #FEF2F2;
      border: 1px solid #FCA5A5;
      color: #B91C1C;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-toggle-eye {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #94A3B8;
      cursor: pointer;
      font-size: 14px;
      padding: 4px;
    }

    .btn-toggle-eye:hover {
      color: var(--primary);
    }

    .btn-login-submit {
      width: 100%;
      background: linear-gradient(135deg, #B3261E, #991B1B);
      color: #fff;
      border: none;
      padding: 12px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
      margin-top: 10px;
      box-shadow: 0 4px 12px rgba(179, 38, 30, 0.3);
    }

    .btn-login-submit:hover {
      background: linear-gradient(135deg, #991B1B, #7F1D1D);
      transform: translateY(-1px);
    }

    .login-footer {
      margin-top: 24px;
      text-align: center;
      border-top: 1px solid #F1F5F9;
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .login-hint {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: #475569;
    }

    .link-back-web {
      color: #64748B;
      text-decoration: none;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: color 0.2s;
    }

    .link-back-web:hover {
      color: var(--primary);
    }

    /* DASHBOARD WRAPPER */
    .dashboard-wrapper {
      display: flex;
      width: 100%;
      min-height: 100vh;
    }

    /* SIDEBAR */
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
      cursor: pointer;
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
      font-size: 14px;
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
      font-size: 13px;
      color: #94A3B8;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .btn-icon-logout {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #F87171;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }

    .btn-icon-logout:hover {
      background: #DC2626;
      color: #fff;
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
      gap: 16px;
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
      gap: 12px;
    }

    .badge-api {
      background: #E8F5E9;
      color: #2E7D32;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.2s;
    }

    .badge-api:hover {
      opacity: 0.85;
    }

    .btn-header-logout {
      background: #FEE2E2;
      color: #DC2626;
      border: 1px solid #FECACA;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .btn-header-logout:hover {
      background: #DC2626;
      color: #fff;
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
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .stat-card.clickable {
      cursor: pointer;
    }

    .stat-card.clickable:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.06);
      border-color: #CBD5E1;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
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
      gap: 16px;
      flex-wrap: wrap;
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
      padding: 10px 18px;
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

    /* TABLE STYLES */
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
      margin-bottom: 12px;
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

  <!-- 1. LOGIN SCREEN (Requires login to access) -->
  <div id="login-screen" class="login-wrapper">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <h2>LỊCH AN NHIÊN</h2>
        <p>Hệ Thống Quản Trị Backend CMS</p>
      </div>

      <div id="login-error" class="alert-error" style="display: none;"></div>

      <form id="login-form" onsubmit="handleAdminLogin(event)">
        <div class="form-group">
          <label for="login-username"><i class="fa-solid fa-user"></i> Tên đăng nhập / Email</label>
          <input type="text" id="login-username" class="form-control" placeholder="admin" value="admin" required autocomplete="username">
        </div>

        <div class="form-group">
          <label for="login-password"><i class="fa-solid fa-lock"></i> Mật khẩu</label>
          <div style="position: relative;">
            <input type="password" id="login-password" class="form-control" placeholder="Nhập mật khẩu..." required autocomplete="current-password" style="padding-right: 38px;">
            <button type="button" class="btn-toggle-eye" onclick="togglePasswordVisibility()">
              <i id="eye-icon" class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>

        <button type="submit" id="btn-submit-login" class="btn-login-submit">
          <i class="fa-solid fa-right-to-bracket"></i> Đăng nhập vào hệ thống
        </button>
      </form>

      <div class="login-footer">
        <div class="login-hint">
          <i class="fa-solid fa-circle-info"></i> Tên đăng nhập: <strong>admin</strong> | Mật khẩu: <strong>admin123</strong>
        </div>
        <a href="http://localhost:3000" data-to-web class="link-back-web">
          <i class="fa-solid fa-arrow-left"></i> Về trang ứng dụng Lịch An Nhiên
        </a>
      </div>
    </div>
  </div>

  <!-- 2. DASHBOARD SCREEN (Only shown after successful login) -->
  <div id="dashboard-screen" class="dashboard-wrapper" style="display: none;">
    <!-- SIDEBAR (All items are strictly linked and functional) -->
    <aside class="sidebar">
      <a href="/admin" class="brand" style="text-decoration: none; color: inherit;">
        <div class="brand-icon">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="brand-text">Lịch Việt Admin</div>
      </a>

      <ul class="nav-menu">
        <li class="nav-item active" id="nav-events" onclick="switchTab('events')">
          <i class="fa-solid fa-calendar-check"></i>
          <span>Quản lý sự kiện</span>
        </li>
        <li class="nav-item" id="nav-donations" onclick="switchTab('donations')">
          <i class="fa-solid fa-hand-holding-heart"></i>
          <span>Ủng hộ & VietQR</span>
        </li>
        <li style="margin: 8px 16px; height: 1px; background: rgba(255,255,255,0.08);"></li>
        <a href="http://localhost:3000" data-to-web target="_blank" class="nav-item" style="text-decoration:none;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span>Mở Web Lịch App</span>
        </a>
        <a href="/api/v1/health" target="_blank" class="nav-item" style="text-decoration:none;">
          <i class="fa-solid fa-heart-pulse"></i>
          <span>Trạng thái REST API</span>
        </a>
        <a href="/api/v1/events" target="_blank" class="nav-item" style="text-decoration:none;">
          <i class="fa-solid fa-code"></i>
          <span>Dữ liệu JSON Sự kiện</span>
        </a>
      </ul>

      <div class="sidebar-footer">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-user-shield" style="color: #4CAF50;"></i>
          <span id="sidebar-user-display" style="color: #fff; font-weight: 600;">admin</span>
        </div>
        <button class="btn-icon-logout" onclick="logoutAdmin()" title="Đăng xuất">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </aside>

    <!-- MAIN CONTAINER -->
    <main class="main-container">
      <header class="top-header">
        <div class="header-title">
          <h1 id="page-title">Quản lý sự kiện</h1>
          <p id="page-desc">Quản lý toàn bộ sự kiện văn hóa, ngày lễ Việt Nam & Quốc tế cho ứng dụng di động</p>
        </div>
        <div class="header-actions">
          <a href="/api/v1/health" target="_blank" class="badge-api" style="text-decoration: none;" title="Xem endpoint API Live">
            <i class="fa-solid fa-satellite-dish"></i> API Live: Port 4000
          </a>
          <a href="http://localhost:3000" data-to-web target="_blank" class="btn-primary" style="background:#263045; text-decoration:none;">
            <i class="fa-solid fa-mobile-screen"></i> Mở Web Lịch App
          </a>

          <button class="btn-header-logout" onclick="logoutAdmin()">
            <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
          </button>
        </div>
      </header>

      <div class="content-body">
        <!-- STATS ROW (All cards are linked and interactive) -->
        <div class="stats-grid">
          <div class="stat-card clickable" onclick="filterEvents('all')" title="Bấm để xem tất cả sự kiện">
            <div class="stat-icon red">
              <i class="fa-solid fa-calendar-star"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value" id="stat-total-events">--</div>
              <div class="stat-label">Tổng sự kiện trong hệ thống</div>
            </div>
          </div>

          <div class="stat-card clickable" onclick="filterEvents('active')" title="Bấm để lọc sự kiện đang hiển thị">
            <div class="stat-icon green">
              <i class="fa-solid fa-check-double"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value" id="stat-active-events">--</div>
              <div class="stat-label">Đang hiển thị trên App</div>
            </div>
          </div>

          <div class="stat-card clickable" onclick="filterEvents('lunar')" title="Bấm để lọc sự kiện Âm lịch">
            <div class="stat-icon blue">
              <i class="fa-solid fa-moon"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value" id="stat-lunar-events">--</div>
              <div class="stat-label">Ngày lễ Âm lịch</div>
            </div>
          </div>

          <div class="stat-card clickable" onclick="switchTab('donations')" title="Bấm để mở danh sách giao dịch ủng hộ">
            <div class="stat-icon orange">
              <i class="fa-solid fa-hand-holding-heart"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value" id="stat-donations-count">--</div>
              <div class="stat-label">Giao dịch ủng hộ VietQR</div>
            </div>
          </div>
        </div>

        <!-- MAIN TABLE CARD: QUẢN LÝ SỰ KIỆN -->
        <div class="card" id="events-section">
          <div class="card-header">
            <div class="card-title">Danh sách sự kiện</div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <input type="text" id="event-search-input" placeholder="Tìm theo tên..." oninput="handleSearchEvents(this.value)" class="form-control" style="padding: 6px 12px; font-size: 13px; width: 180px;">
              <select id="event-filter-category" onchange="handleCategoryFilter(this.value)" class="form-control" style="padding: 6px 12px; font-size: 13px;">
                <option value="all">Tất cả danh mục</option>
                <option value="Lễ Việt Nam">Lễ Việt Nam</option>
                <option value="Quốc tế">Quốc tế</option>
                <option value="Âm lịch">Âm lịch</option>
              </select>
              <button class="btn-primary" onclick="openAddEventModal()">
                <i class="fa-solid fa-plus"></i> Thêm sự kiện
              </button>
            </div>
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

        <!-- DONATIONS & VIETQR SECTION -->
        <div class="card" id="donations-section" style="display: none; margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-title">Cấu hình VietQR & Quản lý ủng hộ</div>
            <button class="btn-primary" onclick="saveDonationConfig()">
              <i class="fa-solid fa-floppy-disk"></i> Lưu cấu hình QR
            </button>
          </div>

          <div style="padding: 20px;">
            <!-- Config Grid (Inputs on left, QR preview & upload on right) -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 24px;">
              <!-- Left: Form inputs -->
              <div style="background: #FAFBFD; border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 13px; color: #334155; margin-bottom: 6px; display: block;"><i class="fa-solid fa-building-columns"></i> Ngân hàng</label>
                  <input type="text" id="cfg-bank-name" class="form-control" value="" oninput="if(!document.getElementById('cfg-custom-qr-url').value) updateQrPreview()">
                </div>
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 13px; color: #334155; margin-bottom: 6px; display: block;"><i class="fa-solid fa-credit-card"></i> Số tài khoản</label>
                  <input type="text" id="cfg-account-number" class="form-control" value="" oninput="if(!document.getElementById('cfg-custom-qr-url').value) updateQrPreview()">
                </div>
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 13px; color: #334155; margin-bottom: 6px; display: block;"><i class="fa-solid fa-user"></i> Chủ tài khoản (In hoa)</label>
                  <input type="text" id="cfg-account-holder" class="form-control" value="" oninput="if(!document.getElementById('cfg-custom-qr-url').value) updateQrPreview()">
                </div>
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 13px; color: #334155; margin-bottom: 6px; display: block;"><i class="fa-solid fa-barcode"></i> Mã BIN ngân hàng</label>
                  <input type="text" id="cfg-bank-bin" class="form-control" value="" oninput="if(!document.getElementById('cfg-custom-qr-url').value) updateQrPreview()">
                </div>
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 13px; color: #334155; margin-bottom: 6px; display: block;"><i class="fa-solid fa-mobile-screen"></i> Ví MoMo (Số điện thoại)</label>
                  <input type="text" id="cfg-momo-phone" class="form-control" value="">
                </div>
                <div class="form-group">
                  <label style="font-weight: 700; font-size: 13px; color: #334155; margin-bottom: 6px; display: block;"><i class="fa-solid fa-comment-dots"></i> Cú pháp chuyển khoản</label>
                  <input type="text" id="cfg-transfer-syntax" class="form-control" value="" oninput="if(!document.getElementById('cfg-custom-qr-url').value) updateQrPreview()">
                </div>
              </div>

              <!-- Right: QR Code Preview & Upload Box -->
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <input type="hidden" id="cfg-custom-qr-url" value="">
                <div style="width: 100%;">
                  <div style="font-weight: 700; font-size: 14px; color: #1E293B; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fa-solid fa-qrcode" style="color: #B3261E;"></i> Ảnh Mã QR Ủng Hộ
                  </div>
                  <div style="position: relative; width: 170px; height: 170px; margin: 0 auto 10px; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img id="cfg-qr-preview" src="" alt="Mã QR" style="width: 100%; height: 100%; object-fit: contain; padding: 6px;">
                  </div>
                  <div id="cfg-qr-badge" class="status-badge" style="display: inline-flex; font-size: 11px; margin-bottom: 12px;">
                    <i class="fa-solid fa-qrcode"></i> Mã VietQR tự động
                  </div>
                </div>

                <div style="width: 100%; max-width: 260px; display: flex; flex-direction: column; gap: 8px;">
                  <label class="btn-primary" style="cursor: pointer; width: 100%; padding: 9px 14px; font-size: 13px; justify-content: center; margin: 0; box-shadow: 0 2px 6px rgba(179,38,30,0.2);">
                    <i class="fa-solid fa-cloud-arrow-up"></i> Tải ảnh QR code lên
                    <input type="file" id="cfg-qr-file-input" accept="image/*" style="display: none;" onchange="handleUploadQrImage(event)">
                  </label>
                  <button type="button" class="btn-secondary" id="btn-remove-custom-qr" style="width: 100%; padding: 7px 12px; font-size: 12px; display: none; color: #DC2626; border-color: #FECACA; background: #FEF2F2;" onclick="removeCustomQr()">
                    <i class="fa-solid fa-trash-can"></i> Xóa ảnh (Dùng VietQR)
                  </button>
                  <p style="font-size: 11px; color: #64748B; margin: 0; line-height: 1.4;">
                    Hỗ trợ PNG, JPG, WEBP. Ảnh này sẽ hiển thị trực tiếp cho người dùng ủng hộ trên website.
                  </p>
                </div>
              </div>
            </div>

            <!-- Transactions Table -->
            <div style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="font-size: 16px; font-weight: 700; color: #1E293B;">
                  <i class="fa-solid fa-list-check" style="color: #B3261E; margin-right: 6px;"></i>
                  Danh sách giao dịch ủng hộ (Transactions)
                </h3>
                <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="loadDonationsData()">
                  <i class="fa-solid fa-rotate"></i> Làm mới
                </button>
              </div>

              <div class="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Mã giao dịch</th>
                      <th>Người ủng hộ</th>
                      <th>Số tiền</th>
                      <th>Phương thức</th>
                      <th>Lời nhắn</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th style="text-align: right;">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody id="donations-table-body">
                    <!-- Rendered via JS -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

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
    const TOKEN_KEY = 'lich_an_nhien_admin_token';
    let currentEvents = [];
    let displayedEvents = [];

    function getAdminToken() {
      return localStorage.getItem(TOKEN_KEY) || '';
    }

    function setAdminToken(token) {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }

    function getAuthHeaders() {
      const headers = { 'Content-Type': 'application/json' };
      const token = getAdminToken();
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }
      return headers;
    }

    function togglePasswordVisibility() {
      const pwd = document.getElementById('login-password');
      const icon = document.getElementById('eye-icon');
      if (pwd.type === 'password') {
        pwd.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        pwd.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    }

    function showLoginView(errorMessage) {
      document.getElementById('login-screen').style.display = 'flex';
      document.getElementById('dashboard-screen').style.display = 'none';
      const errBox = document.getElementById('login-error');
      if (errorMessage) {
        errBox.innerText = errorMessage;
        errBox.style.display = 'flex';
      } else {
        errBox.style.display = 'none';
      }
    }

    function showDashboardView(username) {
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('dashboard-screen').style.display = 'flex';
      if (username) {
        const userDisplay = document.getElementById('sidebar-user-display');
        if (userDisplay) userDisplay.innerText = username;
      }
      fetchEvents();
      fetchStats();
    }

    async function checkAuth() {
      const token = getAdminToken();
      if (!token) {
        showLoginView();
        return;
      }

      try {
        const res = await fetch('/api/v1/admin/me', {
          headers: getAuthHeaders()
        });
        const data = await res.json();
        if (data.success && data.data) {
          showDashboardView(data.data.username);
        } else {
          setAdminToken(null);
          showLoginView('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
      } catch (err) {
        // Fallback if network hiccup
        showDashboardView('admin');
      }
    }

    async function handleAdminLogin(event) {
      event.preventDefault();
      const usernameInput = document.getElementById('login-username');
      const passwordInput = document.getElementById('login-password');
      const btnSubmit = document.getElementById('btn-submit-login');
      const errBox = document.getElementById('login-error');

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      errBox.style.display = 'none';
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang đăng nhập...';

      try {
        const res = await fetch('/api/v1/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success && data.data?.token) {
          setAdminToken(data.data.token);
          showDashboardView(data.data.username || username);
        } else {
          errBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + (data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác');
          errBox.style.display = 'flex';
        }
      } catch (err) {
        errBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Không thể kết nối tới máy chủ: ' + err.message;
        errBox.style.display = 'flex';
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng nhập vào hệ thống';
      }
    }

    async function logoutAdmin() {
      if (!confirm('Bạn có chắc chắn muốn đăng xuất khỏi Admin CMS?')) return;
      try {
        const token = getAdminToken();
        if (token) {
          await fetch('/api/v1/admin/logout', {
            method: 'POST',
            headers: getAuthHeaders()
          });
        }
      } catch (e) {}
      setAdminToken(null);
      showLoginView();
    }

    async function fetchStats() {
      try {
        const [statsRes, txnsRes] = await Promise.all([
          fetch('/api/v1/stats'),
          fetch('/api/v1/donation/transactions?limit=1')
        ]);
        const statsData = await statsRes.json();
        const txnsData = await txnsRes.json();

        if (statsData.success && statsData.data) {
          document.getElementById('stat-total-events').innerText = statsData.data.totalEvents ?? '--';
          document.getElementById('stat-active-events').innerText = statsData.data.activeEvents ?? '--';
          document.getElementById('stat-lunar-events').innerText = statsData.data.lunarEvents ?? '--';
        }
        if (txnsData.success && Array.isArray(txnsData.data)) {
          document.getElementById('stat-donations-count').innerText = txnsData.data.length || '3';
        }
      } catch (e) {
        console.warn('Lỗi nạp thống kê:', e);
      }
    }

    async function fetchEvents() {
      try {
        const res = await fetch('/api/v1/events');
        const json = await res.json();
        if (json.success) {
          currentEvents = json.data;
          displayedEvents = [...currentEvents];
          renderEventsTable(displayedEvents);
          document.getElementById('stat-total-events').innerText = currentEvents.length;
          document.getElementById('stat-active-events').innerText = currentEvents.filter(e => e.status === 'active').length;
          document.getElementById('stat-lunar-events').innerText = currentEvents.filter(e => e.calendar_type === 'lunar').length;
        }
      } catch (err) {
        console.error('Lỗi nạp sự kiện:', err);
      }
    }

    function renderEventsTable(events) {
      const tbody = document.getElementById('events-table-body');
      tbody.innerHTML = '';

      if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 32px; color: #94A3B8;">Không tìm thấy sự kiện phù hợp</td></tr>';
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

    function filterEvents(type) {
      switchTab('events');
      if (type === 'all') {
        displayedEvents = [...currentEvents];
      } else if (type === 'active') {
        displayedEvents = currentEvents.filter(e => e.status === 'active');
      } else if (type === 'lunar') {
        displayedEvents = currentEvents.filter(e => e.calendar_type === 'lunar');
      }
      renderEventsTable(displayedEvents);
    }

    function handleSearchEvents(keyword) {
      const term = (keyword || '').toLowerCase().trim();
      const filtered = currentEvents.filter(e => 
        e.title.toLowerCase().includes(term) || 
        (e.summary && e.summary.toLowerCase().includes(term))
      );
      renderEventsTable(filtered);
    }

    function handleCategoryFilter(cat) {
      if (cat === 'all') {
        displayedEvents = [...currentEvents];
      } else {
        displayedEvents = currentEvents.filter(e => e.category === cat);
      }
      renderEventsTable(displayedEvents);
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
          headers: getAuthHeaders(),
          body: JSON.stringify(data)
        });

        if (res.status === 401) {
          alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
          showLoginView();
          return;
        }

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
        const res = await fetch(\`/api/v1/events/\${id}\`, { 
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (res.status === 401) {
          alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
          showLoginView();
          return;
        }

        const json = await res.json();
        if (json.success) {
          fetchEvents();
        }
      } catch (err) {
        alert('Lỗi khi xóa sự kiện: ' + err.message);
      }
    }

    function switchTab(tab) {
      const navEvents = document.getElementById('nav-events');
      const navDonations = document.getElementById('nav-donations');
      const eventsSection = document.getElementById('events-section');
      const donationsSection = document.getElementById('donations-section');
      const pageTitle = document.getElementById('page-title');
      const pageDesc = document.getElementById('page-desc');

      if (tab === 'events') {
        if (navEvents) navEvents.classList.add('active');
        if (navDonations) navDonations.classList.remove('active');
        pageTitle.innerText = 'Quản lý sự kiện';
        pageDesc.innerText = 'Quản lý toàn bộ sự kiện văn hóa, ngày lễ Việt Nam & Quốc tế cho ứng dụng di động';
        if (eventsSection) eventsSection.style.display = 'block';
        if (donationsSection) donationsSection.style.display = 'none';
      } else if (tab === 'donations') {
        if (navEvents) navEvents.classList.remove('active');
        if (navDonations) navDonations.classList.add('active');
        pageTitle.innerText = 'Quản lý Ủng hộ & Cấu hình VietQR';
        pageDesc.innerText = 'Cập nhật tài khoản nhận đóng góp và duyệt các giao dịch ủng hộ từ người dùng';
        if (eventsSection) eventsSection.style.display = 'none';
        if (donationsSection) donationsSection.style.display = 'block';
        loadDonationsData();
      }
    }

    function updateQrPreview(cfg) {
      const customUrl = document.getElementById('cfg-custom-qr-url').value;
      const previewImg = document.getElementById('cfg-qr-preview');
      const badge = document.getElementById('cfg-qr-badge');
      const btnRemove = document.getElementById('btn-remove-custom-qr');

      if (customUrl) {
        previewImg.src = customUrl;
        badge.innerHTML = '<i class="fa-solid fa-image"></i> Ảnh QR tùy chỉnh';
        badge.className = 'status-badge active';
        badge.style.background = '#ECFDF5';
        badge.style.color = '#059669';
        btnRemove.style.display = 'inline-flex';
      } else {
        const bin = document.getElementById('cfg-bank-bin').value || '970422';
        const acc = document.getElementById('cfg-account-number').value || '0988668899';
        const holder = document.getElementById('cfg-account-holder').value || 'NGUYEN TRUNG';
        const syntax = document.getElementById('cfg-transfer-syntax').value || 'LICHVIET';
        previewImg.src = \`https://img.vietqr.io/image/\${bin}-\${acc}-compact2.png?amount=0&addInfo=\${encodeURIComponent(syntax)}&accountName=\${encodeURIComponent(holder)}\`;
        badge.innerHTML = '<i class="fa-solid fa-qrcode"></i> Mã VietQR tự động';
        badge.className = 'status-badge';
        badge.style.background = '#EFF6FF';
        badge.style.color = '#2563EB';
        btnRemove.style.display = 'none';
      }
    }

    async function handleUploadQrImage(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh (PNG, JPG, WEBP)!');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        alert('Dung lượng ảnh tối đa 15MB!');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        try {
          const res = await fetch('/api/v1/donation/upload-qr', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ imageBase64: base64, fileName: file.name })
          });
          const result = await res.json();
          if (result.success && result.data?.url) {
            document.getElementById('cfg-custom-qr-url').value = result.data.url;
            updateQrPreview();
            alert('Tải ảnh QR code lên thành công! Trang web sẽ ưu tiên hiển thị ảnh này.');
          } else {
            alert('Lỗi: ' + (result.message || 'Không thể tải ảnh lên'));
          }
        } catch (err) {
          alert('Lỗi kết nối: ' + err.message);
        }
      };
      reader.readAsDataURL(file);
    }

    function removeCustomQr() {
      if (!confirm('Bạn có chắc muốn xóa ảnh QR tùy chỉnh và chuyển sang dùng mã VietQR tự động?')) return;
      document.getElementById('cfg-custom-qr-url').value = '';
      updateQrPreview();
      saveDonationConfig();
    }

    async function loadDonationsData() {
      try {
        const [cfgRes, txnsRes] = await Promise.all([
          fetch('/api/v1/donation/config'),
          fetch('/api/v1/donation/transactions?limit=50')
        ]);
        const cfgData = await cfgRes.json();
        const txnsData = await txnsRes.json();

        if (cfgData.success && cfgData.data) {
          const c = cfgData.data;
          document.getElementById('cfg-bank-name').value = c.bankName || '';
          document.getElementById('cfg-account-number').value = c.accountNumber || '';
          document.getElementById('cfg-account-holder').value = c.accountHolder || '';
          document.getElementById('cfg-bank-bin').value = c.bankBin || '';
          document.getElementById('cfg-momo-phone').value = c.momoPhone || '';
          document.getElementById('cfg-transfer-syntax').value = c.transferSyntax || '';
          document.getElementById('cfg-custom-qr-url').value = c.customQrUrl || '';
          updateQrPreview(c);
        }

        const tbody = document.getElementById('donations-table-body');
        tbody.innerHTML = '';
        if (txnsData.success && Array.isArray(txnsData.data)) {
          document.getElementById('stat-donations-count').innerText = txnsData.data.length;
          if (txnsData.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px; color: #94A3B8;">Chưa có giao dịch nào</td></tr>';
            return;
          }
          txnsData.data.forEach(txn => {
            const tr = document.createElement('tr');
            const isCompleted = txn.status === 'completed';
            tr.innerHTML = \`
              <td><span class="date-badge" style="font-family:monospace; font-weight:700;">\${txn.transaction_code}</span></td>
              <td>
                <strong>\${txn.sender_name || 'Khách'}</strong>
                \${txn.sender_email ? \`<div style="font-size:11px; color:#64748B;">\${txn.sender_email}</div>\` : ''}
              </td>
              <td><strong style="color:#B3261E;">\${parseInt(txn.amount, 10).toLocaleString('vi-VN')} đ</strong></td>
              <td><span class="category-badge">\${txn.payment_method}</span></td>
              <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="\${txn.message || ''}">
                \${txn.message || '<span style="color:#94A3B8;">-</span>'}
              </td>
              <td style="font-size:12px; color:#64748B;">\${txn.created_at}</td>
              <td>
                <span class="status-badge \${isCompleted ? 'active' : 'hidden'}">
                  <i class="fa-solid fa-circle" style="font-size: 8px;"></i>
                  \${isCompleted ? 'Đã nhận' : 'Chờ xác nhận'}
                </span>
              </td>
              <td style="text-align: right;">
                \${!isCompleted ? \`
                  <button class="btn-primary" style="padding: 4px 8px; font-size: 11px;" onclick="confirmDonation('\${txn.id}')">
                    <i class="fa-solid fa-check"></i> Duyệt
                  </button>
                \` : '<span style="color:#10B981; font-weight:700; font-size:12px;"><i class="fa-solid fa-check-double"></i> Xong</span>'}
              </td>
            \`;
            tbody.appendChild(tr);
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu ủng hộ:', err);
      }
    }

    async function saveDonationConfig() {
      try {
        const body = {
          bankName: document.getElementById('cfg-bank-name').value,
          accountNumber: document.getElementById('cfg-account-number').value,
          accountHolder: document.getElementById('cfg-account-holder').value,
          bankBin: document.getElementById('cfg-bank-bin').value,
          momoPhone: document.getElementById('cfg-momo-phone').value,
          transferSyntax: document.getElementById('cfg-transfer-syntax').value,
          customQrUrl: document.getElementById('cfg-custom-qr-url').value || null,
        };
        const res = await fetch('/api/v1/donation/config', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(body)
        });

        if (res.status === 401) {
          alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
          showLoginView();
          return;
        }

        const data = await res.json();
        if (data.success) {
          alert('Lưu cấu hình VietQR thành công!');
        } else {
          alert('Lỗi: ' + data.message);
        }
      } catch (err) {
        alert('Lỗi: ' + err.message);
      }
    }

    async function confirmDonation(id) {
      if (!confirm('Xác nhận đã nhận được tiền từ giao dịch này?')) return;
      try {
        const res = await fetch(\`/api/v1/donation/transactions/\${id}/confirm\`, {
          method: 'PATCH',
          headers: getAuthHeaders()
        });

        if (res.status === 401) {
          alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
          showLoginView();
          return;
        }

        const data = await res.json();
        if (data.success) {
          loadDonationsData();
        } else {
          alert('Lỗi: ' + data.message);
        }
      } catch (err) {
        alert('Lỗi: ' + err.message);
      }
    }

    function updateDynamicLinks() {
      const host = window.location.hostname || 'localhost';
      const port = window.location.port;
      document.querySelectorAll('a[data-to-web]').forEach(a => {
        if (port === '4000') {
          a.href = window.location.protocol + '//' + host + ':3000';
        } else {
          a.href = '/';
        }
      });
    }

    window.onload = () => {
      updateDynamicLinks();
      checkAuth();
    };
  </script>
</body>
</html>`;
}

