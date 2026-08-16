/* Vercel serverless: Markaziy bank valyuta kurslari */
export default async function handler(req, res) {
  try {
    const r = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/');
    const all = await r.json();
    const rates = ['USD', 'EUR', 'RUB'].map(code => {
      const it = all.find(x => x.Ccy === code);
      return it ? { code, rate: it.Rate, diff: it.Diff } : null;
    }).filter(Boolean);
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate');
    res.status(200).json({ date: (all[0] && all[0].Date) || '', rates });
  } catch (e) {
    res.status(200).json({ date: '', rates: [] });
  }
}
