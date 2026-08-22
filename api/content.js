/* Vercel serverless: sayt matnlari (CMS).

   Vercel'da sayt statik holda tarqatiladi - `server.js`
   `.vercelignore` orqali chiqarib tashlangan, ya'ni admin
   panelining `data/content.json` fayli bu yerda mavjud emas
   (serverless funksiyalar holatni saqlamaydi).

   Shunga qaramay endpoint kerak: `js/main.js` sahifa
   ochilishida `/api/content` ni so'raydi. U yo'q bo'lsa
   brauzer har bir tashrifda konsolga 404 yozadi - sayt
   ishlaydi, lekin devtools ochgan har kim buzuq deb o'ylaydi.

   Shu bois bo'sh javob qaytariladi: sayt o'zining ichki
   matnlaridan foydalanadi. Aynan `api/rates.js` xatolikda
   qanday yo'l tutsa - shunday.

   Admin paneldagi matn tahriri `node server.js` bilan
   ishlaganda kuchga kiradi (o'sha yerda `data/content.json`
   o'qiladi va yoziladi). */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json({});
}
