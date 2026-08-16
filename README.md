# FinBalans — buxgalteriya xizmatlari sayti

Toshkentdagi buxgalteriya byurosi uchun sayt + boshqaruv paneli + mini-server.
Uch tilda (o'zbek, rus, ingliz), kutubxonalarsiz — toza HTML / CSS / JS / Node.js.

## Imkoniyatlar

**Sayt**
- To'liq ekranli hero: oltin/dollar fon slaydlari, o'sish grafigi, aylanuvchi so'z
- Markaziy bank valyuta kurslari — jonli, har kuni yangilanadi, 14 kunlik mini-grafik bilan
- Xizmatlar, tariflar, taqqoslash jadvali, javobgarlik, ish tartibi, jamoa, fikrlar, FAQ
- Ariza formasi (server yoki Telegram orqali), mobil pastki panel, 3 til, SEO/schema

**Boshqaruv paneli** (`/admin.html`)
- Arizalar: jonli yangilanish, bosqichlar, izohlar, qidiruv, CSV, chop etish
- Statistika: KPI kartalar, 14 kunlik va oylik grafiklar, konversiya voronkasi
- Sayt matnlari: 92 ta matn 3 tilda tahrirlanadi (CMS)
- Aloqa, narxlar, ijtimoiy tarmoqlar, xodim suratlarini yuklash
- Login/parolni panel ichidan almashtirish

## Ishga tushirish

```
node server.js
```
yoki Windows'da `start-site.bat` faylini ikki marta bosing.

- Sayt: http://localhost:3000
- Panel: http://localhost:3000/admin.html

**Birinchi ishga tushirishda** admin login va paroli terminalga chiqariladi
(`data/admin.json` yaratiladi). O'z parolingizni oldindan belgilash uchun:

```
ADMIN_LOGIN=admin ADMIN_PASSWORD=SizningParolingiz node server.js
```

Parolni unutsangiz — `data/admin.json` faylini o'chirib, serverni qayta
ishga tushiring: yangi parol terminalda chiqadi.

## Telegramga ariza yuborish (ixtiyoriy)

1. [@BotFather](https://t.me/BotFather) orqali bot yarating → token oling
2. Chat ID ni [@userinfobot](https://t.me/userinfobot) dan oling
3. Serverni shu qiymatlar bilan ishga tushiring:

```
TG_TOKEN=<bot-token> TG_CHAT=<chat-id> node server.js
```

## Fayllar

| Fayl | Vazifasi |
|---|---|
| `index.html` | Asosiy sayt |
| `admin.html` | Boshqaruv paneli |
| `privacy.html` | Maxfiylik siyosati |
| `server.js` | Server: sayt + API + Telegram + kurslar |
| `css/style.css`, `js/main.js` | Dizayn va skriptlar |
| `img/` | Suratlar |
| `data/` | Arizalar, kontent, admin ma'lumotlari (repoga tushmaydi) |

## Xavfsizlik

- Parol ochiq matnda saqlanmaydi — faqat tuzlangan SHA-256 hash
- Kirish server tomonda tekshiriladi, brauzerga faqat sessiya tokeni beriladi
- Brute-force cheklovi, sessiya muddati, xavfsizlik sarlavhalari
- `data/` papkasi web orqali ochilmaydi va git repoga qo'shilmaydi

## Ishga tushirishdan oldin almashtiring

1. Jamoa va hero suratlari (`img/`) — hozirgilari vaqtinchalik
2. Rekvizitlar: STIR, manzil, telefon, email
3. Tariflar va xizmat narxlari
4. Admin parol (panelning "Tizim" bo'limidan)
