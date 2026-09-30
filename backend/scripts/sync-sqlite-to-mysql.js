const Database = require('better-sqlite3');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

async function sync() {
  const dbPath = path.resolve(__dirname, '../data/calendar.db');
  if (!fs.existsSync(dbPath)) {
    console.log('No calendar.db found, skipping SQLite sync.');
    return;
  }

  const sqlite = new Database(dbPath);
  const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'thanhtrung@#@1',
    database: 'lich_an_nhien',
  });

  console.log('Syncing data from SQLite to MySQL...');

  // 1. Sync events
  const events = sqlite.prepare('SELECT * FROM events').all();
  for (const ev of events) {
    await pool.query(`
      INSERT INTO events (id, title, calendar_type, day, month, category, status, summary, meaning, traditions, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        calendar_type = VALUES(calendar_type),
        day = VALUES(day),
        month = VALUES(month),
        category = VALUES(category),
        status = VALUES(status),
        summary = VALUES(summary),
        meaning = VALUES(meaning),
        traditions = VALUES(traditions),
        image_url = VALUES(image_url)
    `, [ev.id, ev.title, ev.calendar_type, ev.day, ev.month, ev.category, ev.status, ev.summary, ev.meaning, ev.traditions, ev.image_url]);
  }
  console.log(`Synced ${events.length} events to MySQL.`);

  // 2. Sync daily_quotes
  const quotes = sqlite.prepare('SELECT * FROM daily_quotes').all();
  for (const q of quotes) {
    await pool.query(`
      INSERT INTO daily_quotes (id, quote, author, applicable_day, applicable_month, theme)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        quote = VALUES(quote),
        author = VALUES(author),
        applicable_day = VALUES(applicable_day),
        applicable_month = VALUES(applicable_month),
        theme = VALUES(theme)
    `, [q.id, q.quote, q.author, q.applicable_day, q.applicable_month, q.theme]);
  }
  console.log(`Synced ${quotes.length} quotes to MySQL.`);

  // 3. Sync app_config
  const configs = sqlite.prepare('SELECT * FROM app_config').all();
  for (const c of configs) {
    await pool.query(`
      INSERT INTO app_config (\`key\`, \`value\`, description)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`value\` = VALUES(\`value\`),
        description = VALUES(description)
    `, [c.key, c.value, c.description]);
  }
  console.log(`Synced ${configs.length} app_config items to MySQL.`);

  // 4. Sync analytics_stats
  const stats = sqlite.prepare('SELECT * FROM analytics_stats').all();
  for (const s of stats) {
    await pool.query(`
      INSERT INTO analytics_stats (id, date, active_users, reminders_created, page_views)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        date = VALUES(date),
        active_users = VALUES(active_users),
        reminders_created = VALUES(reminders_created),
        page_views = VALUES(page_views)
    `, [s.id, s.date, s.active_users, s.reminders_created, s.page_views]);
  }
  console.log(`Synced ${stats.length} stats to MySQL.`);

  // 5. Sync users
  const users = sqlite.prepare('SELECT * FROM users').all();
  for (const u of users) {
    await pool.query(`
      INSERT INTO users (id, email, name, avatar, is_guest, auth_provider, role, status, last_login_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        name = VALUES(name),
        avatar = VALUES(avatar),
        is_guest = VALUES(is_guest),
        auth_provider = VALUES(auth_provider),
        role = VALUES(role),
        status = VALUES(status),
        last_login_at = VALUES(last_login_at)
    `, [u.id, u.email, u.name, u.avatar, u.is_guest, u.auth_provider || 'guest', u.role || 'user', u.status || 'active', u.last_login_at || null]);
  }
  console.log(`Synced ${users.length} users to MySQL.`);

  // 6. Sync donation_config
  const donConfigs = sqlite.prepare('SELECT * FROM donation_config').all();
  for (const dc of donConfigs) {
    await pool.query(`
      INSERT INTO donation_config (
        id, bank_bin, bank_name, account_number, account_holder,
        qr_template, custom_qr_url, suggested_amounts, momo_phone,
        momo_name, transfer_syntax, thank_you_message, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        bank_bin = VALUES(bank_bin),
        bank_name = VALUES(bank_name),
        account_number = VALUES(account_number),
        account_holder = VALUES(account_holder),
        qr_template = VALUES(qr_template),
        custom_qr_url = VALUES(custom_qr_url),
        suggested_amounts = VALUES(suggested_amounts),
        momo_phone = VALUES(momo_phone),
        momo_name = VALUES(momo_name),
        transfer_syntax = VALUES(transfer_syntax),
        thank_you_message = VALUES(thank_you_message),
        is_active = VALUES(is_active)
    `, [
      dc.id, dc.bank_bin || '970422', dc.bank_name, dc.account_number, dc.account_holder,
      dc.qr_template || 'compact2', dc.custom_qr_url || null,
      dc.suggested_amounts || '[10000, 30000, 50000, 100000, 200000]',
      dc.momo_phone || null, dc.momo_name || null,
      dc.transfer_syntax || 'LICHVIET',
      dc.thank_you_message || 'Lịch An Nhiên xin cảm ơn!',
      dc.is_active !== undefined ? dc.is_active : 1
    ]);
  }
  console.log(`Synced ${donConfigs.length} donation_config to MySQL.`);

  // 7. Sync transactions
  const txns = sqlite.prepare('SELECT * FROM transactions').all();
  for (const t of txns) {
    await pool.query(`
      INSERT INTO transactions (
        id, user_id, amount, currency, payment_method, transaction_code,
        sender_name, sender_email, message, status, is_anonymous
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        amount = VALUES(amount),
        currency = VALUES(currency),
        payment_method = VALUES(payment_method),
        transaction_code = VALUES(transaction_code),
        sender_name = VALUES(sender_name),
        sender_email = VALUES(sender_email),
        message = VALUES(message),
        status = VALUES(status),
        is_anonymous = VALUES(is_anonymous)
    `, [
      t.id, t.user_id, t.amount, t.currency || 'VND', t.payment_method || 'vietqr',
      t.transaction_code, t.sender_name, t.sender_email, t.message, t.status, t.is_anonymous
    ]);
  }
  console.log(`Synced ${txns.length} transactions to MySQL.`);

  await pool.end();
  sqlite.close();
  console.log('🎉 ALL DATA SYNCED TO MYSQL SUCCESSFULLY!');
}

sync().catch(err => {
  console.error('Error syncing SQLite to MySQL:', err);
  process.exit(1);
});
