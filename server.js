/* =========================================================
   FinBalans — mini-server (Node.js, kutubxonasiz)

   Vazifasi:
   1. Saytni tarqatish (index.html, admin.html, css, js ...)
   2. Ariza qabul qilish  → data/leads.json ga saqlash
   3. (ixtiyoriy) Har bir arizani Telegramga yuborish
   4. Admin panel uchun API (arizalar + kontent)

   Ishga tushirish:  node server.js   (yoki start-site.bat)
   So'ng brauzerda:  http://localhost:3000
   ========================================================= */

'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/* ------------------ SOZLAMALAR ------------------ */

const PORT = process.env.PORT || 3000;

/* Admin kirish ma'lumotlari.
   Boshlang'ich qiymatlar (birinchi ishga tushirishda data/admin.json ga
   yoziladi). Keyinchalik login va parol ADMIN PANELNING "Tizim" bo'limidan
   o'zgartiriladi - bu fayl qayta tahrirlanmaydi.
   Parol hech qachon ochiq matnda saqlanmaydi: faqat SHA-256 + tuz (salt).
   Parolni unutsangiz: data/admin.json faylini o'chiring - quyidagi
   boshlang'ich login/parol qaytadi. */
const DEFAULT_LOGIN = process.env.ADMIN_LOGIN || 'admin';
/* Parol berilmasa - birinchi ishga tushirishda tasodifiy parol yaratiladi
   va terminalga chiqariladi (kodda ochiq parol saqlanmaydi). */
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD ||
  crypto.randomBytes(6).toString('base64').replace(/[^A-Za-z0-9]/g, '') + '2026';

/* ---------- Kirish ma'lumotlari fayli (data/admin.json) ---------- */

const ADMIN_FILE = path.join(__dirname, 'data', 'admin.json');

/* Parol hash: sha256(salt + parol). Har bir parol uchun yangi tasodifiy tuz. */
function hashPassword(password, salt) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  return { salt: s, hash: crypto.createHash('sha256').update(s + String(password)).digest('hex') };
}

function readAdmin() {
  try {
    const a = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    if (a && a.login && a.hash && a.salt) return a;
  } catch (e) { /* fayl yo'q yoki buzuq - boshlang'ich qiymatga qaytamiz */ }

  const h = hashPassword(DEFAULT_PASSWORD);
  const a = { login: DEFAULT_LOGIN, salt: h.salt, hash: h.hash, updated: new Date().toISOString() };
  writeAdmin(a);
  console.log('');
  console.log('  ==================================================');
  console.log('  Admin kirish malumotlari yaratildi:');
  console.log('    Login: ' + DEFAULT_LOGIN);
  console.log('    Parol: ' + DEFAULT_PASSWORD);
  console.log('  (panelning "Tizim" bolimidan ozgartiring)');
  console.log('  ==================================================');
  console.log('');
  return a;
}

function writeAdmin(a) {
  const dir = path.dirname(ADMIN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(a, null, 2));
}

/* Sessiya tokenlari (xotirada): token -> {created, last} */
const SESSIONS = new Map();
const SESSION_IDLE_MS = 30 * 24 * 3600 * 1000;  /* 30 kun harakatsizlik */
const SESSION_MAX_MS = 90 * 24 * 3600 * 1000;   /* 90 kun mutlaq muddat */

/* Kirish cheklovi: faqat bot/brute-force uchun. Oddiy adminga
   sezilmaydi - 5 daqiqada 20 ta xato urinishga ruxsat. */
const LOGIN_ATTEMPTS = new Map();

/* Faqat tekshiradi (hisoblamaydi): 15 daqiqada 5 ta xato urinishdan keyin bloklanadi */
function loginLimited(ip) {
  const now = Date.now();
  const arr = (LOGIN_ATTEMPTS.get(ip) || []).filter(t => now - t < 5 * 60 * 1000);
  LOGIN_ATTEMPTS.set(ip, arr);
  return arr.length >= 20;
}

/* Xato urinishni qayd etadi (to'g'ri kirishda chaqirilmaydi) */
function loginFailed(ip) {
  const now = Date.now();
  const arr = (LOGIN_ATTEMPTS.get(ip) || []).filter(t => now - t < 5 * 60 * 1000);
  arr.push(now);
  LOGIN_ATTEMPTS.set(ip, arr);
}

function sha256(x) { return crypto.createHash('sha256').update(String(x)).digest('hex'); }

/* Vaqt-farqi hujumlaridan himoya: doimiy vaqtli taqqoslash */
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/* Telegramga xabar yuborish uchun (ixtiyoriy):
   1. @BotFather orqali bot yarating, tokenni oling
   2. Botga /start yozing, keyin chat ID ni oling
      (masalan @userinfobot orqali)
   3. Ikkalasini shu yerga yozing: */
const TELEGRAM_BOT_TOKEN = process.env.TG_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TG_CHAT || '';

/* ------------------------------------------------ */

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

/* ---------- Fayl yordamchilari ---------- */

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LEADS_FILE)) fs.writeFileSync(LEADS_FILE, '[]');
  if (!fs.existsSync(CONTENT_FILE)) fs.writeFileSync(CONTENT_FILE, '{}');
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { return fallback; }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ---------- Javob yordamchilari ---------- */

const SEC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'no-referrer'
};

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  }, SEC_HEADERS));
  res.end(body);
}

function readBody(req, limit, cb) {
  let raw = '';
  let overflow = false;
  req.on('data', chunk => {
    raw += chunk;
    if (raw.length > limit) { overflow = true; req.destroy(); }
  });
  req.on('end', () => {
    if (overflow) return cb(new Error('too large'));
    try { cb(null, raw ? JSON.parse(raw) : {}); }
    catch (e) { cb(e); }
  });
  req.on('error', () => cb(new Error('read error')));
}

function isAuthed(req) {
  const token = req.headers['x-admin-token'] || '';
  const sess = SESSIONS.get(token);
  if (!sess) return false;
  const now = Date.now();
  if (now - sess.last > SESSION_IDLE_MS || now - sess.created > SESSION_MAX_MS) {
    SESSIONS.delete(token);
    return false;
  }
  sess.last = now;
  return true;
}

/* Eskirgan sessiyalarni davriy tozalash */
setInterval(() => {
  const now = Date.now();
  SESSIONS.forEach((s, t) => {
    if (now - s.last > SESSION_IDLE_MS || now - s.created > SESSION_MAX_MS) SESSIONS.delete(t);
  });
}, 30 * 60 * 1000).unref();

/* ---------- Oddiy anti-spam: IP bo'yicha cheklov ---------- */

const leadRate = new Map(); /* ip -> so'nggi so'rovlar vaqtlari */
const RATE_WINDOW = 60 * 1000; /* 1 daqiqa */
const RATE_MAX = 5;            /* daqiqasiga ko'pi bilan 5 ta ariza */

function rateLimited(ip) {
  const now = Date.now();
  const times = (leadRate.get(ip) || []).filter(t => now - t < RATE_WINDOW);
  if (times.length >= RATE_MAX) { leadRate.set(ip, times); return true; }
  times.push(now);
  leadRate.set(ip, times);
  return false;
}

/* Eski yozuvlar vaqti-vaqti bilan tozalanadi */
setInterval(() => {
  const now = Date.now();
  leadRate.forEach((times, ip) => {
    const fresh = times.filter(t => now - t < RATE_WINDOW);
    if (fresh.length) leadRate.set(ip, fresh);
    else leadRate.delete(ip);
  });
}, 5 * 60 * 1000).unref();

/* ---------- Telegram (ixtiyoriy) ---------- */

function notifyTelegram(lead) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const text =
    'Yangi ariza — FinBalans sayti\n\n' +
    'Ism: ' + lead.name + '\n' +
    'Telefon: ' + lead.phone +
    (lead.message ? '\nIzoh: ' + lead.message : '');

  const payload = JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text });
  const reqTg = https.request({
    hostname: 'api.telegram.org',
    path: '/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, resTg => { resTg.resume(); });
  reqTg.on('error', err => console.error('[telegram]', err.message));
  reqTg.end(payload);
}

/* Valyuta kurslari keshi (6 soat) */
let ratesCache = { time: 0, data: null };
let histCache = { day: '', data: null };

/* ---------- API ---------- */

function handleApi(req, res, urlPath) {
  ensureData();

  /* POST /api/leads — saytdagi forma (ochiq) */
  if (urlPath === '/api/leads' && req.method === 'POST') {
    const ip = (req.socket && req.socket.remoteAddress) || '';
    if (rateLimited(ip)) {
      return sendJson(res, 429, { ok: false, error: 'too many requests' });
    }
    return readBody(req, 10 * 1024, (err, body) => {
      if (err) return sendJson(res, 400, { ok: false, error: 'bad body' });

      /* Honeypot: saytdagi forma bu maydonni hech qachon yubormaydi -
         to'ldirilgan bo'lsa bot, indamay tashlab yuboriladi */
      if (String(body.company || '').trim()) {
        return sendJson(res, 200, { ok: true });
      }

      const name = String(body.name || '').trim().slice(0, 120);
      const phone = String(body.phone || '').trim().slice(0, 40);
      const message = String(body.message || '').trim().slice(0, 1500);
      if (!name || phone.replace(/\D/g, '').length < 9) {
        return sendJson(res, 400, { ok: false, error: 'invalid fields' });
      }

      const leads = readJson(LEADS_FILE, []);

      /* Dublikat: so'nggi 5 daqiqada xuddi shu telefondan ariza bo'lsa -
         qayta saqlanmaydi va Telegramga yuborilmaydi */
      const normPhone = phone.replace(/\D/g, '');
      const isDup = leads.some(l =>
        String(l.phone || '').replace(/\D/g, '') === normPhone &&
        Date.now() - new Date(l.date).getTime() < 5 * 60 * 1000);
      if (isDup) return sendJson(res, 200, { ok: true });

      const lead = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'new',
        name: name,
        phone: phone,
        message: message
      };
      leads.unshift(lead);
      writeJson(LEADS_FILE, leads.slice(0, 5000));
      notifyTelegram(lead);
      console.log('[ariza]', new Date().toLocaleString(), '-', name, phone);
      return sendJson(res, 200, { ok: true });
    });
  }

  /* POST /api/login - server tomonda tekshiriladi, token qaytadi */
  if (urlPath === '/api/login' && req.method === 'POST') {
    const ip = (req.socket && req.socket.remoteAddress) || '';
    if (loginLimited(ip)) {
      return sendJson(res, 429, { ok: false, error: 'too many attempts' });
    }
    return readBody(req, 2048, (err, body) => {
      if (err) return sendJson(res, 400, { ok: false });
      const adm = readAdmin();
      const loginOk = safeEqual(sha256(String(body.login || '')), sha256(adm.login));
      const passOk = safeEqual(hashPassword(String(body.password || ''), adm.salt).hash, adm.hash);
      if (!loginOk || !passOk) {
        loginFailed(ip);
        return sendJson(res, 401, { ok: false });
      }
      LOGIN_ATTEMPTS.delete(ip); /* muvaffaqiyatli kirish - hisob tozalanadi */
      const token = crypto.randomBytes(32).toString('hex');
      SESSIONS.set(token, { created: Date.now(), last: Date.now() });
      return sendJson(res, 200, { ok: true, token: token });
    });
  }

  /* GET /api/me - joriy admin logini (sessiya bilan) */
  if (urlPath === '/api/me' && req.method === 'GET') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false });
    return sendJson(res, 200, { ok: true, login: readAdmin().login });
  }

  /* POST /api/credentials - login va/yoki parolni almashtirish.
     Eski parol majburiy; almashtirilgach barcha sessiyalar bekor qilinadi. */
  if (urlPath === '/api/credentials' && req.method === 'POST') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
    const ip = (req.socket && req.socket.remoteAddress) || '';
    if (loginLimited(ip)) return sendJson(res, 429, { ok: false, error: 'too many attempts' });

    return readBody(req, 4096, (err, body) => {
      if (err) return sendJson(res, 400, { ok: false, error: 'bad body' });

      const adm = readAdmin();
      const curOk = safeEqual(hashPassword(String(body.current || ''), adm.salt).hash, adm.hash);
      if (!curOk) {
        loginFailed(ip);
        return sendJson(res, 401, { ok: false, error: 'wrong current password' });
      }

      const newLogin = String(body.login || '').trim();
      const newPass = String(body.password || '');

      if (newLogin) {
        if (newLogin.length < 3 || newLogin.length > 40 || /[\s:]/.test(newLogin)) {
          return sendJson(res, 400, { ok: false, error: 'bad login' });
        }
        adm.login = newLogin;
      }
      if (newPass) {
        if (newPass.length < 6) return sendJson(res, 400, { ok: false, error: 'weak password' });
        const h = hashPassword(newPass);
        adm.salt = h.salt;
        adm.hash = h.hash;
      }
      if (!newLogin && !newPass) return sendJson(res, 400, { ok: false, error: 'nothing to change' });

      adm.updated = new Date().toISOString();
      writeAdmin(adm);

      /* Boshqa qurilmalardagi sessiyalar tugatiladi, joriy sessiya qoladi -
         admin o'zgartirgach qayta kirishga majbur bo'lmaydi */
      const cur = req.headers['x-admin-token'] || '';
      const keep = SESSIONS.get(cur);
      SESSIONS.clear();
      if (keep) SESSIONS.set(cur, keep);
      LOGIN_ATTEMPTS.delete(ip);
      console.log('[admin] kirish ma\'lumotlari yangilandi:', adm.login);
      return sendJson(res, 200, { ok: true, login: adm.login });
    });
  }

  /* POST /api/logout - sessiyani bekor qilish */
  if (urlPath === '/api/logout' && req.method === 'POST') {
    SESSIONS.delete(req.headers['x-admin-token'] || '');
    return sendJson(res, 200, { ok: true });
  }

  /* GET /api/leads — admin (sessiya tokeni bilan) */
  if (urlPath === '/api/leads' && req.method === 'GET') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
    return sendJson(res, 200, readJson(LEADS_FILE, []));
  }

  /* DELETE /api/leads — hammasini tozalash (admin) */
  if (urlPath === '/api/leads' && req.method === 'DELETE') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
    writeJson(LEADS_FILE, []);
    return sendJson(res, 200, { ok: true });
  }

  /* PATCH | DELETE /api/leads/<id> — bitta ariza (admin) */
  const idMatch = urlPath.match(/^\/api\/leads\/(\d+)$/);
  if (idMatch) {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
    const id = Number(idMatch[1]);
    const leads = readJson(LEADS_FILE, []);
    const idx = leads.findIndex(l => l.id === id);
    if (idx === -1) return sendJson(res, 404, { ok: false, error: 'not found' });

    if (req.method === 'DELETE') {
      leads.splice(idx, 1);
      writeJson(LEADS_FILE, leads);
      return sendJson(res, 200, { ok: true });
    }
    if (req.method === 'PATCH') {
      return readBody(req, 1024, (err, body) => {
        if (err) return sendJson(res, 400, { ok: false, error: 'bad body' });
        if (body.status === 'new' || body.status === 'done') leads[idx].status = body.status;
        if (typeof body.note === 'string') leads[idx].note = body.note.slice(0, 1000);
        writeJson(LEADS_FILE, leads);
        return sendJson(res, 200, { ok: true });
      });
    }
  }

  /* POST /api/upload — rasm yuklash (admin): {name, data: base64} */
  if (urlPath === '/api/upload' && req.method === 'POST') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
    return readBody(req, 4 * 1024 * 1024, (err, body) => {
      if (err) return sendJson(res, 400, { ok: false, error: 'bad body' });
      const raw = String(body.data || '').replace(/^data:image\/\w+;base64,/, '');
      const ext = /^data:image\/png/.test(String(body.data || '')) ? '.png' : '.jpg';
      const name = String(body.name || 'photo').replace(/[^a-z0-9-]/gi, '').slice(0, 40) || 'photo';
      let buf;
      try { buf = Buffer.from(raw, 'base64'); } catch (e) { return sendJson(res, 400, { ok: false, error: 'bad image' }); }
      if (!buf.length || buf.length > 3 * 1024 * 1024) return sendJson(res, 400, { ok: false, error: 'bad size' });
      const dir = path.join(ROOT, 'img', 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = name + '-' + Date.now() + ext;
      fs.writeFileSync(path.join(dir, file), buf);
      return sendJson(res, 200, { ok: true, path: 'img/uploads/' + file });
    });
  }

  /* GET /api/rates-history - so'nggi 14 kunlik kurslar (kunlik kesh) */
  if (urlPath === '/api/rates-history' && req.method === 'GET') {
    const today = new Date().toISOString().slice(0, 10);
    if (histCache.day === today && histCache.data) {
      return sendJson(res, 200, histCache.data);
    }
    const days = [];
    for (let i = 13; i >= 0; i--) {
      days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
    }
    const out = [];
    (function next(idx) {
      if (idx >= days.length) {
        histCache = { day: today, data: { days: out } };
        return sendJson(res, 200, histCache.data);
      }
      https.get('https://cbu.uz/uz/arkhiv-kursov-valyut/json/all/' + days[idx] + '/', r => {
        let raw = '';
        r.on('data', c => { raw += c; if (raw.length > 2e6) r.destroy(); });
        r.on('end', () => {
          try {
            const all = JSON.parse(raw);
            const rec = { date: days[idx] };
            ['USD', 'EUR', 'RUB'].forEach(cc => {
              const it = all.find(x => x.Ccy === cc);
              if (it) rec[cc] = parseFloat(it.Rate);
            });
            if (rec.USD) out.push(rec);
          } catch (e) { /* o'tkazib yuboriladi */ }
          next(idx + 1);
        });
      }).on('error', () => next(idx + 1));
    })(0);
    return;
  }

  /* GET /api/rates — Markaziy bank valyuta kurslari (ochiq, 6 soat kesh) */
  if (urlPath === '/api/rates' && req.method === 'GET') {
    const now = Date.now();
    if (ratesCache.data && now - ratesCache.time < 6 * 3600 * 1000) {
      return sendJson(res, 200, ratesCache.data);
    }
    return https.get('https://cbu.uz/uz/arkhiv-kursov-valyut/json/', r => {
      let raw = '';
      r.on('data', c => { raw += c; if (raw.length > 2e6) r.destroy(); });
      r.on('end', () => {
        try {
          const all = JSON.parse(raw);
          const want = ['USD', 'EUR', 'RUB'];
          const rates = want.map(code => {
            const it = all.find(x => x.Ccy === code);
            return it ? { code: code, rate: it.Rate, diff: it.Diff } : null;
          }).filter(Boolean);
          const out = { date: (all[0] && all[0].Date) || '', rates: rates };
          ratesCache = { time: now, data: out };
          sendJson(res, 200, out);
        } catch (e) { sendJson(res, 200, { date: '', rates: [] }); }
      });
    }).on('error', () => sendJson(res, 200, { date: '', rates: [] }));
  }

  /* GET /api/content — sayt uchun ochiq */
  if (urlPath === '/api/content' && req.method === 'GET') {
    return sendJson(res, 200, readJson(CONTENT_FILE, {}));
  }

  /* PUT /api/content — admin */
  if (urlPath === '/api/content' && req.method === 'PUT') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
    return readBody(req, 300 * 1024, (err, body) => {
      if (err) return sendJson(res, 400, { ok: false, error: 'bad body' });
      const allowed = ['phone', 'telegram', 'email', 'instagram', 'facebook', 'youtube', 't1', 't2', 't3'];
      const clean = {};
      allowed.forEach(k => {
        if (typeof body[k] === 'string' && body[k].trim()) clean[k] = body[k].trim().slice(0, 300);
      });
      /* Jamoa/hero suratlari: {photos: {p1..p4, hero1..hero3, band: "img/..."}} */
      if (body.photos && typeof body.photos === 'object') {
        const ph = {};
        Object.keys(body.photos).slice(0, 12).forEach(k => {
          const v = body.photos[k];
          if (typeof v === 'string' && /^img\//.test(v) && v.length < 200 && k.length <= 20) ph[k] = v;
        });
        clean.photos = ph;
      }
      /* To'liq sayt matnlari (CMS): {i18n: {uz: {kalit: matn}, ru: {...}, en: {...}}} */
      if (body.i18n && typeof body.i18n === 'object') {
        const i18n = {};
        ['uz', 'ru', 'en'].forEach(lang => {
          if (body.i18n[lang] && typeof body.i18n[lang] === 'object') {
            const langObj = {};
            Object.keys(body.i18n[lang]).slice(0, 400).forEach(key => {
              const v = body.i18n[lang][key];
              if (typeof v === 'string' && key.length <= 60) langObj[key] = v.slice(0, 2000);
            });
            i18n[lang] = langObj;
          }
        });
        clean.i18n = i18n;
      }
      writeJson(CONTENT_FILE, clean);
      return sendJson(res, 200, { ok: true });
    });
  }

  return sendJson(res, 404, { ok: false, error: 'unknown endpoint' });
}

/* ---------- Statik fayllar ---------- */

function serveStatic(req, res, urlPath) {
  if (urlPath === '/') urlPath = '/index.html';

  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const file = path.join(ROOT, safe);

  /* data/ papkasi va server fayli tashqariga chiqarilmaydi */
  if (!file.startsWith(ROOT) ||
      file.startsWith(DATA_DIR) ||
      path.basename(file) === 'admin.json' ||
      path.basename(file) === 'server.js') {
    res.writeHead(403); return res.end('Forbidden');
  }

  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, Object.assign({ 'Content-Type': MIME[ext] || 'application/octet-stream' }, SEC_HEADERS));
    res.end(data);
  });
}

/* ---------- Server ---------- */

const server = http.createServer((req, res) => {
  /* Noto'g'ri percent-encoding (masalan /%zz) serverni yiqitmasligi kerak */
  let urlPath;
  try {
    urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Bad request');
  }
  if (urlPath.startsWith('/api/')) return handleApi(req, res, urlPath);
  if (req.method !== 'GET') { res.writeHead(405); return res.end(); }
  return serveStatic(req, res, urlPath);
});

ensureData();
server.listen(PORT, () => {
  console.log('');
  console.log('  FinBalans server ishga tushdi');
  console.log('  Sayt:        http://localhost:' + PORT);
  console.log('  Admin panel: http://localhost:' + PORT + '/admin.html');
  console.log('  Arizalar:    data/leads.json faylida saqlanadi');
  console.log('  Telegram:    ' + (TELEGRAM_BOT_TOKEN ? 'ulangan' : "ulanmagan (server.js boshida sozlanadi)"));
  console.log('');
});
