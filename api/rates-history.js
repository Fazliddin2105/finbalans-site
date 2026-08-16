/* Vercel serverless: so'nggi 14 kunlik kurslar (mini-grafik uchun) */
export default async function handler(req, res) {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
  }
  const out = [];
  for (const d of days) {
    try {
      const r = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/all/' + d + '/');
      const all = await r.json();
      const rec = { date: d };
      ['USD', 'EUR', 'RUB'].forEach(cc => {
        const it = all.find(x => x.Ccy === cc);
        if (it) rec[cc] = parseFloat(it.Rate);
      });
      if (rec.USD) out.push(rec);
    } catch (e) { /* o'tkazib yuboriladi */ }
  }
  res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate');
  res.status(200).json({ days: out });
}
