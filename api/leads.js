/* Vercel serverless: saytdagi ariza formasi.

   NIMA UCHUN KERAK: sayt Vercel'da statik tarqatiladi va
   `server.js` `.vercelignore` orqali chiqarib tashlangan.
   Shu sabab jonli saytda `/api/leads` umuman mavjud emas edi -
   forma har safar 404 olib, tashrifchiga "xatolik yuz berdi"
   deb ko'rsatardi. Ya'ni sayt orqali kelgan HAR BIR ariza
   yo'qolardi.

   SAQLASH JOYI: serverless funksiya holatni saqlamaydi -
   `data/leads.json` bu yerda yo'q va bo'lishi ham mumkin emas.
   Shu bois arizalar Telegramga yuboriladi: bu real vaqtda
   xabar beradi va tarixi o'zida qoladi.

   SOZLASH (Vercel -> Project -> Settings -> Environment
   Variables), ikkita qiymat:
       TG_TOKEN  - @BotFather bergan bot tokeni
       TG_CHAT   - @userinfobot bergan chat ID
   Qo'shilgach qayta deploy qilinadi.

   Ular qo'yilmagan bo'lsa funksiya 503 qaytaradi - forma
   "to'g'ridan-to'g'ri bog'laning" xabarini ko'rsatadi va
   telefon/Telegram havolalarini beradi. Yolg'on "qabul
   qilindi" ko'rsatib arizani yo'qotgandan ko'ra shu to'g'ri. */

const TG_TOKEN = process.env.TG_TOKEN || '';
const TG_CHAT = process.env.TG_CHAT || '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method not allowed' });
  }

  /* Vercel `Content-Type: application/json` ni o'zi tahlil qiladi,
     lekin boshqa turdagi so'rovda req.body satr bo'lib kelishi mumkin */
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') body = {};

  /* Honeypot: haqiqiy forma bu maydonni to'ldirmaydi. Bot to'ldirsa
     "qabul qilindi" deymiz-u, hech qayerga yubormaymiz - bot qayta
     urinmasin. */
  if (String(body.company || '').trim()) {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.name || '').trim().slice(0, 120);
  const phone = String(body.phone || '').trim().slice(0, 40);
  const message = String(body.message || '').trim().slice(0, 1500);

  /* server.js dagi bilan bir xil tekshiruv */
  if (!name || phone.replace(/\D/g, '').length < 9) {
    return res.status(400).json({ ok: false, error: 'invalid fields' });
  }

  if (!TG_TOKEN || !TG_CHAT) {
    console.error('[ariza] TG_TOKEN/TG_CHAT sozlanmagan - ariza yetkazilmadi:', name, phone);
    return res.status(503).json({ ok: false, error: 'delivery not configured' });
  }

  const text =
    'Yangi ariza — FinBalans sayti\n\n' +
    'Ism: ' + name + '\n' +
    'Telefon: ' + phone +
    (message ? '\nIzoh: ' + message : '');

  try {
    const tg = await fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text }),
    });
    if (!tg.ok) {
      /* Telegram xatosini logga yozamiz, lekin tokenni chiqarmaymiz */
      console.error('[ariza] Telegram javobi:', tg.status, (await tg.text()).slice(0, 200));
      return res.status(502).json({ ok: false, error: 'delivery failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[ariza] Telegramga ulanib bo\'lmadi:', e.message);
    return res.status(502).json({ ok: false, error: 'delivery failed' });
  }
}
