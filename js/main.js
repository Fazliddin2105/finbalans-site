/* =========================================================
   FinBalans — sayt skriptlari
   Til almashtirgich (UZ/RU/EN), mobil menyu, telefon
   maskasi, forma tekshiruvi va yuborish.
   ========================================================= */

/* Ariza yuboriladigan manzil.
   Sayt server orqali ochilganda (node server.js -> http://localhost:3000)
   arizalar avtomatik /api/leads ga yuboriladi va data/leads.json da
   saqlanadi (Telegram ham ulangan bo'lsa - xabar boradi).
   Fayl to'g'ridan-to'g'ri (file://) ochilsa - namoyish rejimi. */
const FORM_ENDPOINT =
  (location.protocol === 'http:' || location.protocol === 'https:') ? '/api/leads' : '';

/* `js` sinfi index.html dagi inline skriptda qo'yiladi (birinchi
   bo'yashdan oldin). BU YERDA QAYTA QO'YILMAYDI: aks holda
   index.html dagi 6 soniyalik zaxira sinfni olib tashlagandan
   keyin kech yuklangan main.js uni qaytarib, kontent
   "ko'rinib -> yashirinib" ketardi. Sinfning egasi bitta joyda. */

/* ---------------- Preloader ----------------
   Eng boshda turadi: quyidagi kodda xato bo'lsa ham loader baribir
   yashirinadi va sayt ochiq qoladi */
const loader = document.getElementById('loader');
function hideLoader() { if (loader) loader.classList.add('done'); }
window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 1200); /* zaxira: har qanday holatda yashirinadi */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Tarjimalar ---------------- */
const translations = {

  /* ======== UZ ======== */
  uz: {
    'meta.title': "FinBalans — Toshkentda buxgalteriya xizmatlari",
    'a11y.langGroup': "Til",
    'a11y.skip': "Mazmunga o'tish",
    'a11y.tg': "Telegram orqali yozish",
    'a11y.menu': "Menyu",
    'a11y.mainNav': "Asosiy menyu",
    'a11y.tariffs': "Tariflar — yon tomonga suriladi",
    'a11y.langNow': "tanlangan til",

    'nav.services': "Xizmatlar",
    'nav.pricing': "Narxlar",
    'nav.team': "Jamoa",
    'nav.faq': "Savol-javob",
    'nav.contact': "Aloqa",
    'nav.cta': "Konsultatsiya",

    'hero.kicker': "Buxgalteriya byurosi · Toshkent",
    'hero.titleBase': "Toshkentda buxgalteriya autsorsingi — ",
    'hero.typed': ["MChJ uchun", "YaTT uchun", "TIF kompaniyalari uchun"],
    'hero.lead': "Hisobotlarni o'z vaqtida topshiramiz, soliqlarni to'g'ri hisoblaymiz, kadrlar hujjatlarini tartibda saqlaymiz. Biznesingizni xatolar va jarimalardan asraymiz.",
    'hero.cta1': "Bepul konsultatsiya olish",
    'hero.cta2': "Tariflarni ko'rish",
    'hero.chip1': "Birinchi konsultatsiya bepul",
    'hero.chip2': "50 mln so'mgacha kafolat",
    'hero.chip3': "30 daqiqa ichida javob",

    'facts.f1': "yildan beri ishlaymiz",
    'facts.f2': "kompaniya doimiy xizmatda",
    'facts.f3': "hisobot muddatida topshirilgan",
    'facts.f4num': "50 mln",
    'facts.f4': "so'mgacha javobgarlik sug'urtalangan",

    'services.kicker': "Xizmatlar",
    'services.title': "Nima qilamiz",
    'services.sub': "Kundalik hisob yuritishdan soliq tekshiruvlarida vakillikkacha. Asosiy xizmatlar oylik tarifga kiradi, bir martalik ishlar alohida baholanadi.",
    'services.link': "Tariflar va narxlar",
    'services.inTariff': "tarif tarkibida",
    'services.s1t': "Buxgalteriya hisobini yuritish",
    'services.s1d': "1C va Didox'da ishlaymiz: birlamchi hujjatlar, bank operatsiyalari, elektron hisobvaraq-fakturalar (EHF), kirim-chiqim nazorati.",
    'services.s2t': "Soliq hisobotlari",
    'services.s2d': "Aylanma soliq, QQS, foyda va daromad soliqlari, ijtimoiy soliq — barchasi soliq.uz orqali muddatida topshiriladi.",
    'services.s3t': "Ish haqi va kadrlar hisobi",
    'services.s3d': "Mehnat shartnomalari, ta'til va kasallik varaqalari, daromad solig'i va ijtimoiy soliq hisob-kitobi.",
    'services.s4t': "Hisobni tiklash",
    'services.s4d': "Yuritilmagan yoki xato yuritilgan davrlar hisobini tartibga keltiramiz, aniqlangan xatolar bo'yicha aniqlashtirilgan hisobotlar topshiramiz.",
    'services.s4p': "3 000 000 so'mdan, bir martalik",
    'services.s5t': "Nol hisobot topshirish",
    'services.s5d': "Faoliyat yuritmayotgan kompaniyalar uchun majburiy hisobotlarni topshirib boramiz.",
    'services.s5p': "300 000 so'm / chorak",
    'services.s6t': "Biznesni ro'yxatdan o'tkazish",
    'services.s6d': "MChJ yoki YaTT ochish, soliq rejimini tanlash, bank hisob raqami va elektron imzo (ERI) rasmiylashtirish.",
    'services.s6p': "1 500 000 so'm, bir martalik",

    'pricing.kicker': "Tariflar",
    'pricing.title': "Narxlar",
    'pricing.sub': "Aniq narx soliq rejimi, oylik operatsiyalar va xodimlar soniga bog'liq. Qo'ng'iroqda 10 daqiqada hisoblab beramiz.",
    'pricing.unit': "so'mdan / oyiga",
    'pricing.cta': "Ariza qoldirish",
    'pricing.tag': "Ko'p tanlanadi",
    'pricing.t1name': "YaTT",
    'pricing.t1for': "Yakka tartibdagi tadbirkorlar uchun",
    'pricing.t1price': "600 000",
    'pricing.t1f1': "Oyiga 30 tagacha operatsiya",
    'pricing.t1f2': "Daromad solig'i hisobotlari",
    'pricing.t1f3': "soliq.uz va bank bilan ishlash",
    'pricing.t1f4': "Telegram orqali maslahat",
    'pricing.t2name': "MChJ · aylanma soliq",
    'pricing.t2for': "Soddalashtirilgan rejimdagi kompaniyalar",
    'pricing.t2price': "1 200 000",
    'pricing.t2f1': "Oyiga 100 tagacha operatsiya",
    'pricing.t2f2': "Barcha soliq va statistika hisobotlari",
    'pricing.t2f3': "5 xodimgacha ish haqi hisob-kitobi",
    'pricing.t2f4': "Shaxsiy buxgalter",
    'pricing.t2f5': "Oylik kirim-chiqim xulosasi",
    'pricing.t3name': "MChJ · QQS",
    'pricing.t3for': "Umumiy rejim, QQS to'lovchilar",
    'pricing.t3price': "2 400 000",
    'pricing.t3f1': "QQS hisobi va EHF nazorati",
    'pricing.t3f2': "Cheklanmagan hisobotlar",
    'pricing.t3f3': "10 xodimgacha ish haqi hisob-kitobi",
    'pricing.t3f4': "Soliq tekshiruvlarida vakillik",
    'pricing.t3f5': "Bosh buxgalter darajasidagi mutaxassis",
    'pricing.note1': "Eksport-import (TIF) bilan ishlovchi kompaniyalar uchun xizmat 2 000 000 so'mdan boshlanadi va alohida kelishiladi.",
    'pricing.note2': "Tarifdan ortiq har bir xodimning ish haqi hisob-kitobi — 50 000 so'm / oy. Yillik shartnomada 10% chegirma.",
    'pricing.note3': "Narxlar 2026-yil avgust holatiga ko'rsatilgan.",

    'compare.kicker': "Taqqoslash",
    'compare.title': "Shtatdagi buxgalter yoki autsorsing?",
    'compare.sub': "Raqamlar bilan solishtirganda farq yaqqol ko'rinadi.",
    'compare.colA': "Shtatdagi buxgalter",
    'compare.r1l': "Oylik xarajat",
    'compare.r1a': "8–12 mln so'm + ish o'rni va soliqlar",
    'compare.r1b': "600 ming – 2,4 mln so'm, boshqa xarajatsiz",
    'compare.r2l': "Ta'til va kasallik",
    'compare.r2a': "Hisob to'xtab qoladi",
    'compare.r2b': "Jamoa uzluksiz ishlaydi",
    'compare.r3l': "Xato uchun javobgarlik",
    'compare.r3a': "Amalda undirib bo'lmaydi",
    'compare.r3b': "Shartnomada: 50 mln so'mgacha sug'urta",
    'compare.r4l': "Bilim doirasi",
    'compare.r4a': "Bitta mutaxassis imkoniyati",
    'compare.r4b': "Buxgalter + soliq maslahatchisi + kadrlar",
    'compare.r5l': "Sifat nazorati",
    'compare.r5a': "Rahbar o'zi tekshirishi kerak",
    'compare.r5b': "Oylik ichki nazorat",

    'ind.label': "Biz ishlaydigan sohalar",
    'ind.i1': "Savdo",
    'ind.i2': "Ishlab chiqarish",
    'ind.i3': "Xizmat ko'rsatish",
    'ind.i4': "IT",
    'ind.i5': "Qurilish",
    'ind.i6': "Logistika",
    'ind.i7': "Umumiy ovqatlanish",
    'ind.i8': "Eksport-import",
    'marquee.text': "Buxgalteriya hisobi — Soliq hisobotlari — Ish haqi va kadrlar — Moliyaviy xotirjamlik — ",

    'about.imgAlt': "Oltin tangalar — jamg'arma o'sishi",
    'cta.title': "Buxgalteriyani ishonchli qo'llarga topshiring",

    'guar.kicker': "Javobgarlik",
    'guar.imgAlt': "Shartnoma imzolash",
    'guar.title': "Xatolarimiz uchun o'zimiz javob beramiz",
    'guar.lead': "Bizning aybimiz bilan jarima yoki penya hisoblansa — uni o'z hisobimizdan qoplaymiz. Bu og'zaki va'da emas: shartnomaning 6.2-bandida yozilgan, javobgarligimiz 50 mln so'mgacha sug'urtalangan.",
    'guar.i1t': "Shartnoma namunasi — oldindan",
    'guar.i1d': "Imzolashdan avval shartnoma matnini to'liq o'rganib chiqasiz. Masofadan, ERI orqali tuzish mumkin.",
    'guar.i2t': "Maxfiylik",
    'guar.i2d': "Moliyaviy ma'lumotlaringiz oshkor qilinmasligi shartnomadagi alohida NDA bandi bilan kafolatlanadi.",
    'guar.i3t': "Ichki nazorat",
    'guar.i3d': "Har bir buxgalterning ishi oyda bir marta ichki nazoratchi tomonidan tekshiriladi.",

    'process.kicker': "Ish tartibi",
    'process.title': "Qanday boshlaymiz",
    'process.s1time': "30 daqiqa",
    'process.s1t': "Ariza va qo'ng'iroq",
    'process.s1d': "Formani to'ldirasiz — ish vaqtida 30 daqiqa ichida bog'lanib, faoliyatingiz va ehtiyojingizni aniqlaymiz.",
    'process.s2time': "1–2 kun",
    'process.s2t': "Hujjatlarni ko'rib chiqish",
    'process.s2d': "Joriy hisob holatini bepul baholaymiz va operatsiyalar hajmidan kelib chiqib aniq narx aytamiz.",
    'process.s3time': "1 kun",
    'process.s3t': "Shartnoma",
    'process.s3d': "Namunani oldindan yuboramiz, savollarni ko'rib chiqamiz. Ofisda yoki masofadan ERI bilan imzolaymiz.",
    'process.s4time': "1 hafta ichida",
    'process.s4t': "Ishni topshirasiz",
    'process.s4d': "Hujjatlarni qabul qilamiz; avvalgi buxgalterdan ishlarni o'tkazib olishni o'zimiz tashkil qilamiz.",

    'team.kicker': "Jamoa",
    'team.title': "Hisobingizni yuritadigan odamlar",
    'team.sub': "Har bir mijozga aniq mas'ul buxgalter biriktiriladi — kim bilan ishlayotganingizni bilasiz.",
    'team.p1role': "Asoschi, bosh buxgalter",
    'team.p1cred': "14 yillik tajriba · Soliq maslahatchisi sertifikati",
    'team.p2role': "Soliq maslahatchisi",
    'team.p2cred': "QQS va eksport-import bo'yicha 9 yil",
    'team.p3role': "Buxgalter",
    'team.p3cred': "MChJ va YaTT hisobi bo'yicha 6 yil",
    'team.p4role': "Kadrlar va ish haqi bo'yicha mutaxassis",
    'team.p4cred': "Mehnat qonunchiligi bo'yicha 8 yil",

    'reviews.kicker': "Mijozlar tajribasi",
    'reviews.title': "Biz bilan ishlaydigan kompaniyalar",
    'reviews.r1text': "«QQSga o'tganimizda hisobda xatolar chiqdi — FinBalans ikki oyda hammasini tartibga keltirdi va 14 mln so'm ortiqcha to'langan soliqni qaytarib oldi.»",
    'reviews.r1role': "«TexnoPlast» MChJ direktori",
    'reviews.r2text': "«Uch yildan beri birorta hisobot kechikmadi. Savolimga ish kunida bir soat ichida javob olaman — avvalgi buxgalterimiz bilan bunday bo'lmagan.»",
    'reviews.r2role': "«FoodCity» moliya menejeri",
    'reviews.r3text': "«Shtatdagi buxgalterga oyiga 8 mln so'm to'lardik. Endi xuddi shu hajmdagi ish 2,4 mln so'mga bajarilyapti — sifat esa yuqoriroq.»",
    'reviews.r3role': "«LogiTrans» asoschisi",

    'faq.kicker': "Savol-javob",
    'faq.title': "Ko'p so'raladigan savollar",
    'faq.q1': "Ish boshlash uchun qanday hujjatlar kerak?",
    'faq.a1': "Guvohnoma, soliq.uz kabinetiga kirish, ERI kaliti, bank ko'chirmalari va mavjud bo'lsa — oxirgi topshirilgan hisobotlar. Ro'yxatni ariza qoldirganingizdan keyin yuboramiz; hujjatlarni Telegram orqali qabul qilamiz.",
    'faq.q2': "Shartnomani masofadan tuzish mumkinmi?",
    'faq.a2': "Ha. Shartnoma namunasini oldindan yuboramiz, kelishilgach ERI orqali masofadan imzolaymiz. Ofisga kelish shart emas.",
    'faq.q3': "Sizning xatoingiz tufayli jarima kelsa nima bo'ladi?",
    'faq.a3': "Jarima va penyani o'z hisobimizdan qoplaymiz — bu shartnomaning 6.2-bandida belgilangan. Javobgarligimiz 50 mln so'mgacha sug'urtalangan.",
    'faq.q4': "Soliq rejimini almashtirsak nima o'zgaradi?",
    'faq.a4': "O'tish hujjatlarini o'zimiz tayyorlaymiz va topshiramiz — bu tarifga kiradi. Tarif yangi rejimdagi ish hajmiga qarab qayta ko'rib chiqiladi va oldindan kelishiladi.",
    'faq.q5': "Tarifga nima kiradi, kutilmagan qo'shimcha to'lovlar bo'lmaydimi?",
    'faq.a5': "Tarif tarkibi shartnomaga ilova qilinadi: hisob yuritish, hisobotlar, kelishilgan miqdordagi xodimlar ish haqi. Tarifdan tashqari ishlar (masalan, hisobni tiklash) faqat oldindan kelishilgan narxda bajariladi.",
    'faq.q6': "Narx nimaga bog'liq?",
    'faq.a6': "To'rt omilga: soliq rejimi (aylanma soliq yoki QQS), oylik operatsiyalar soni, xodimlar soni va eksport-import mavjudligi. Shu ma'lumotlar bilan narxni 10 daqiqada aniq aytamiz.",

    'contact.kicker': "Aloqa",
    'contact.title': "Ariza qoldiring",
    'contact.sub': "Ish vaqtida 30 daqiqa ichida qo'ng'iroq qilamiz: savollarga javob beramiz va biznesingiz uchun aniq narxni hisoblab beramiz.",
    'contact.phoneLabel': "Telefon",
    'contact.addressLabel': "Manzil",
    'contact.address': "Toshkent sh., Yakkasaroy tumani, Bobur ko'chasi, 20",
    'contact.hoursLabel': "Ish vaqti",
    'contact.hours': "Dushanba – shanba, 9:00 – 18:00",
    'contact.socials': "Ijtimoiy tarmoqlar",
    'contact.mapTitle': "FinBalans — xaritada",
    'contact.mapOpen': "Xaritada ochish",

    'form.name': "Ismingiz",
    'form.phone': "Telefon raqamingiz",
    'form.message': "Izoh",
    'form.optional': "(ixtiyoriy)",
    'form.consent': "Shaxsiy ma'lumotlarimni qayta ishlashga rozilik bildiraman",
    'form.submit': "Ariza yuborish",
    'form.invalid': "Iltimos, belgilangan maydonlarni to'ldiring va rozilik bandini belgilang.",
    'form.success': "Rahmat, arizangiz qabul qilindi. Ish vaqtida 30 daqiqa ichida bog'lanamiz.",
    'form.sending': "Yuborilmoqda…",
    'form.error': "Xatolik yuz berdi — ariza yuborilmadi. Iltimos, to'g'ridan-to'g'ri bog'laning:",

    'footer.tagline': "MChJ va YaTT uchun buxgalteriya autsorsingi. Toshkent, 2018-yildan beri.",
    'footer.colServices': "Xizmatlar",
    'footer.colCompany': "Kompaniya",
    'footer.colContact': "Aloqa",
    'footer.legalName': "«FINBALANS» MChJ",
    'footer.stir': "STIR: 309 415 782",
    'footer.admin': "Xodimlar uchun kirish",
    'footer.privacy': "Maxfiylik siyosati",

    'reviews.prev': "Oldingi fikr",
    'reviews.next': "Keyingi fikr",
    'reviews.goto': "Fikr",
    'mobilebar.call': "Qo'ng'iroq qilish",
    'mobilebar.form': "Ariza qoldirish",
    'a11y.toTop': "Yuqoriga qaytish",

    /* --- Valyuta kursi lentasi --- */
    'rates.label': "Markaziy bank kursi",
    'rates.source': "cbu.uz",

    /* --- Kalkulyator --- */
    'nav.calc': "Kalkulyator",
    'calc.kicker': "Kalkulyator",
    'calc.title': "Xizmat narxini hisoblang",
    'calc.sub': "Bir necha soniyada taxminiy oylik to'lovni ko'ring. Formula ochiq — nimadan nima chiqayotgani quyida ko'rsatilgan.",
    'calc.entity': "Biznes shakli",
    'calc.entityIp': "YaTT",
    'calc.entityLlc': "MChJ",
    'calc.regime': "Soliq rejimi",
    'calc.regimeTurnover': "Aylanma soliq",
    'calc.regimeVat': "QQS",
    'calc.regimeLocked': "YaTT uchun soliq rejimi tanlanmaydi",
    'calc.ops': "Oyiga operatsiyalar soni",
    'calc.emps': "Xodimlar soni",
    'calc.tif': "Eksport-import (TIF) bilan ishlaymiz",
    'calc.resultLabel': "Taxminiy oylik to'lov",
    'calc.unit': "so'm / oyiga",
    'calc.breakdown': "Narx nimadan tashkil topadi",
    'calc.bBase': "Asosiy tarif",
    'calc.bOps': "Qo'shimcha operatsiyalar",
    'calc.bEmps': "Qo'shimcha xodimlar",
    'calc.bTif': "Eksport-import ustamasi",
    'calc.bIncluded': "tarifga kiradi",
    'calc.note': "Bu — taxminiy hisob. Aniq narxni hujjatlaringizni ko'rib chiqib, qo'ng'iroqda tasdiqlaymiz.",
    'calc.cta': "Aniq narxni olish",
    'calc.msgIntro': "Kalkulyator bo'yicha hisob:",
    'calc.msgEntity': "Biznes shakli",
    'calc.msgRegime': "Soliq rejimi",
    'calc.msgOps': "Operatsiyalar",
    'calc.msgEmps': "Xodimlar",
    'calc.msgTif': "Eksport-import",
    'calc.msgYes': "ha",
    'calc.msgNo': "yo'q",
    'calc.msgTotal': "Taxminiy oylik to'lov",

    /* --- Hisobot muddatlari --- */
    'dl.title': "Yaqin hisobot muddatlari",
    'dl.sub': "Sanalar bugungi kundan avtomatik hisoblanadi.",
    'dl.vat': "QQS hisoboti",
    'dl.payroll': "Ijtimoiy soliq va JShDS",
    'dl.turnover': "Aylanma soliq (chorak)",
    'dl.daysLeft': "kun qoldi",
    'dl.today': "bugun",
    'dl.tomorrow': "ertaga",
    'dl.months': "yanvar,fevral,mart,aprel,may,iyun,iyul,avgust,sentabr,oktabr,noyabr,dekabr",

    /* --- Tejash grafigi --- */
    'save.title': "Yiliga qancha tejaysiz",
    'save.staff': "Shtatdagi buxgalter",
    'save.staffVal': "8–12 mln so'm / oy",
    'save.us': "FinBalans",
    'save.usVal': "0,6–2,4 mln so'm / oy",
    'save.badge': "≈70% tejash"
  },

  /* ======== RU ======== */
  ru: {
    'meta.title': "FinBalans — бухгалтерские услуги в Ташкенте",
    'a11y.langGroup': "Язык",
    'a11y.skip': "Перейти к содержанию",
    'a11y.tg': "Написать в Telegram",
    'a11y.menu': "Меню",
    'a11y.mainNav': "Главное меню",
    'a11y.tariffs': "Тарифы — прокручивается вбок",
    'a11y.langNow': "выбранный язык",

    'nav.services': "Услуги",
    'nav.pricing': "Цены",
    'nav.team': "Команда",
    'nav.faq': "Вопросы и ответы",
    'nav.contact': "Контакты",
    'nav.cta': "Консультация",

    'hero.kicker': "Бухгалтерское бюро · Ташкент",
    'hero.titleBase': "Аутсорсинг бухгалтерии в Ташкенте — ",
    'hero.typed': ["для ООО", "для ИП", "для ВЭД-компаний"],
    'hero.lead': "Сдадим отчёты вовремя, правильно рассчитаем налоги, приведём в порядок кадровые документы. Убережём ваш бизнес от ошибок и штрафов.",
    'hero.cta1': "Получить бесплатную консультацию",
    'hero.cta2': "Посмотреть тарифы",
    'hero.chip1': "Первая консультация бесплатна",
    'hero.chip2': "Гарантия до 50 млн сум",
    'hero.chip3': "Ответ в течение 30 минут",

    'facts.f1': "год основания компании",
    'facts.f2': "компаний на постоянном обслуживании",
    'facts.f3': "отчётов сдано в срок",
    'facts.f4num': "50 млн",
    'facts.f4': "сум — страхование ответственности",

    'services.kicker': "Услуги",
    'services.title': "Что мы делаем",
    'services.sub': "От ежедневного учёта до представительства при налоговых проверках. Основные услуги входят в месячный тариф, разовые работы оцениваются отдельно.",
    'services.link': "Тарифы и цены",
    'services.inTariff': "входит в тариф",
    'services.s1t': "Ведение бухгалтерского учёта",
    'services.s1d': "Работаем в 1С и Didox: первичные документы, банковские операции, электронные счета-фактуры (ЭСФ), контроль прихода и расхода.",
    'services.s2t': "Налоговая отчётность",
    'services.s2d': "Налог с оборота, НДС, налог на прибыль, НДФЛ и социальный налог — всё сдаётся через soliq.uz в срок.",
    'services.s3t': "Зарплата и кадровый учёт",
    'services.s3d': "Трудовые договоры, отпуска и больничные, расчёт НДФЛ и социального налога.",
    'services.s4t': "Восстановление учёта",
    'services.s4d': "Приведём в порядок незакрытые или ошибочные периоды, сдадим уточнённую отчётность по найденным ошибкам.",
    'services.s4p': "от 3 000 000 сум, разово",
    'services.s5t': "Нулевая отчётность",
    'services.s5d': "Для компаний, не ведущих деятельность, сдаём обязательные отчёты.",
    'services.s5p': "300 000 сум / квартал",
    'services.s6t': "Регистрация бизнеса",
    'services.s6d': "Открытие ООО или ИП, выбор налогового режима, банковский счёт и электронная подпись (ЭЦП).",
    'services.s6p': "1 500 000 сум, разово",

    'pricing.kicker': "Тарифы",
    'pricing.title': "Цены",
    'pricing.sub': "Точная цена зависит от налогового режима, числа операций в месяц и количества сотрудников. Рассчитаем за 10 минут по телефону.",
    'pricing.unit': "сум / месяц",
    'pricing.cta': "Оставить заявку",
    'pricing.tag': "Выбирают чаще всего",
    'pricing.t1name': "ИП (ЯТТ)",
    'pricing.t1for': "Для индивидуальных предпринимателей",
    'pricing.t1price': "от 600 000",
    'pricing.t1f1': "До 30 операций в месяц",
    'pricing.t1f2': "Отчётность по налогу на доход",
    'pricing.t1f3': "Работа с soliq.uz и банком",
    'pricing.t1f4': "Консультации в Telegram",
    'pricing.t2name': "ООО · налог с оборота",
    'pricing.t2for': "Компании на упрощённом режиме",
    'pricing.t2price': "от 1 200 000",
    'pricing.t2f1': "До 100 операций в месяц",
    'pricing.t2f2': "Вся налоговая и статистическая отчётность",
    'pricing.t2f3': "Расчёт зарплаты до 5 сотрудников",
    'pricing.t2f4': "Персональный бухгалтер",
    'pricing.t2f5': "Ежемесячная сводка прихода и расхода",
    'pricing.t3name': "ООО · НДС",
    'pricing.t3for': "Общий режим, плательщики НДС",
    'pricing.t3price': "от 2 400 000",
    'pricing.t3f1': "Учёт НДС и контроль ЭСФ",
    'pricing.t3f2': "Отчётность без ограничений",
    'pricing.t3f3': "Расчёт зарплаты до 10 сотрудников",
    'pricing.t3f4': "Представительство при налоговых проверках",
    'pricing.t3f5': "Специалист уровня главного бухгалтера",
    'pricing.note1': "Для компаний с внешнеэкономической деятельностью (ВЭД) обслуживание — от 2 000 000 сум, условия согласовываются отдельно.",
    'pricing.note2': "Расчёт зарплаты сверх тарифа — 50 000 сум / мес за сотрудника. При годовом договоре — скидка 10%.",
    'pricing.note3': "Цены указаны по состоянию на август 2026 года.",

    'compare.kicker': "Сравнение",
    'compare.title': "Штатный бухгалтер или аутсорсинг?",
    'compare.sub': "В цифрах разница видна сразу.",
    'compare.colA': "Штатный бухгалтер",
    'compare.r1l': "Расходы в месяц",
    'compare.r1a': "8–12 млн сум + рабочее место и налоги",
    'compare.r1b': "600 тыс. – 2,4 млн сум, без прочих расходов",
    'compare.r2l': "Отпуск и больничные",
    'compare.r2a': "Учёт останавливается",
    'compare.r2b': "Команда работает без перерыва",
    'compare.r3l': "Ответственность за ошибки",
    'compare.r3a': "На практике не взыскать",
    'compare.r3b': "В договоре: страховка до 50 млн сум",
    'compare.r4l': "Охват знаний",
    'compare.r4a': "Возможности одного специалиста",
    'compare.r4b': "Бухгалтер + налоговый консультант + кадровик",
    'compare.r5l': "Контроль качества",
    'compare.r5a': "Проверять приходится руководителю",
    'compare.r5b': "Ежемесячный внутренний контроль",

    'ind.label': "Отрасли, с которыми мы работаем",
    'ind.i1': "Торговля",
    'ind.i2': "Производство",
    'ind.i3': "Услуги",
    'ind.i4': "IT",
    'ind.i5': "Строительство",
    'ind.i6': "Логистика",
    'ind.i7': "Общепит",
    'ind.i8': "Экспорт-импорт",
    'marquee.text': "Бухгалтерский учёт — Налоговая отчётность — Зарплата и кадры — Финансовое спокойствие — ",

    'about.imgAlt': "Золотые монеты — рост накоплений",
    'cta.title': "Передайте бухгалтерию в надёжные руки",

    'guar.kicker': "Ответственность",
    'guar.imgAlt': "Подписание договора",
    'guar.title': "За свои ошибки отвечаем сами",
    'guar.lead': "Если штраф или пеня начислены по нашей вине — оплатим их из собственных средств. Это не обещание на словах: пункт 6.2 договора, ответственность застрахована на сумму до 50 млн сум.",
    'guar.i1t': "Образец договора — заранее",
    'guar.i1d': "Вы полностью изучаете текст договора до подписания. Можно заключить дистанционно, по ЭЦП.",
    'guar.i2t': "Конфиденциальность",
    'guar.i2d': "Неразглашение ваших финансовых данных закреплено отдельным пунктом договора (NDA).",
    'guar.i3t': "Внутренний контроль",
    'guar.i3d': "Работа каждого бухгалтера раз в месяц проверяется внутренним контролёром.",

    'process.kicker': "Порядок работы",
    'process.title': "Как мы начинаем",
    'process.s1time': "30 минут",
    'process.s1t': "Заявка и звонок",
    'process.s1d': "Вы заполняете форму — в рабочее время перезвоним в течение 30 минут, выясним вид деятельности и задачи.",
    'process.s2time': "1–2 дня",
    'process.s2t': "Изучение документов",
    'process.s2d': "Бесплатно оценим текущее состояние учёта и назовём точную цену исходя из объёма операций.",
    'process.s3time': "1 день",
    'process.s3t': "Договор",
    'process.s3d': "Заранее отправим образец, обсудим вопросы. Подписание в офисе или дистанционно по ЭЦП.",
    'process.s4time': "в течение недели",
    'process.s4t': "Передача дел",
    'process.s4d': "Принимаем документы; передачу дел от прежнего бухгалтера организуем сами.",

    'team.kicker': "Команда",
    'team.title': "Люди, которые ведут ваш учёт",
    'team.sub': "За каждым клиентом закрепляется ответственный бухгалтер — вы знаете, с кем работаете.",
    'team.p1role': "Основатель, главный бухгалтер",
    'team.p1cred': "14 лет опыта · сертификат налогового консультанта",
    'team.p2role': "Налоговый консультант",
    'team.p2cred': "9 лет: НДС и внешнеэкономическая деятельность",
    'team.p3role': "Бухгалтер",
    'team.p3cred': "6 лет: учёт ООО и ИП",
    'team.p4role': "Специалист по кадрам и зарплате",
    'team.p4cred': "8 лет: трудовое законодательство",

    'reviews.kicker': "Опыт клиентов",
    'reviews.title': "Компании, которые с нами работают",
    'reviews.r1text': "«При переходе на НДС в учёте обнаружились ошибки — FinBalans за два месяца навёл порядок и вернул 14 млн сум переплаченного налога.»",
    'reviews.r1role': "директор ООО «TexnoPlast»",
    'reviews.r2text': "«За три года ни один отчёт не был просрочен. На вопросы отвечают в течение часа в рабочий день — с прежним бухгалтером так не было.»",
    'reviews.r2role': "финансовый менеджер «FoodCity»",
    'reviews.r3text': "«Штатному бухгалтеру мы платили 8 млн сум в месяц. Сейчас тот же объём работы выполняется за 2,4 млн — а качество выше.»",
    'reviews.r3role': "основатель «LogiTrans»",

    'faq.kicker': "Вопросы и ответы",
    'faq.title': "Частые вопросы",
    'faq.q1': "Какие документы нужны для начала работы?",
    'faq.a1': "Свидетельство, доступ к кабинету soliq.uz, ключ ЭЦП, банковские выписки и, если есть, последняя сданная отчётность. Список отправим после заявки; документы принимаем через Telegram.",
    'faq.q2': "Можно ли заключить договор дистанционно?",
    'faq.a2': "Да. Заранее отправим образец договора, после согласования подпишем дистанционно по ЭЦП. Приезжать в офис не обязательно.",
    'faq.q3': "Что будет, если штраф придёт по вашей вине?",
    'faq.a3': "Штраф и пеню оплатим из собственных средств — это закреплено в пункте 6.2 договора. Наша ответственность застрахована на сумму до 50 млн сум.",
    'faq.q4': "Что изменится при смене налогового режима?",
    'faq.a4': "Документы для перехода подготовим и сдадим сами — это входит в тариф. Тариф пересматривается по объёму работы на новом режиме и согласовывается заранее.",
    'faq.q5': "Что входит в тариф, не будет ли неожиданных доплат?",
    'faq.a5': "Состав тарифа прилагается к договору: ведение учёта, отчётность, расчёт зарплаты для согласованного числа сотрудников. Работы сверх тарифа (например, восстановление учёта) выполняются только по заранее согласованной цене.",
    'faq.q6': "От чего зависит цена?",
    'faq.a6': "От четырёх факторов: налоговый режим (налог с оборота или НДС), число операций в месяц, количество сотрудников и наличие ВЭД. С этими данными назовём точную цену за 10 минут.",

    'contact.kicker': "Контакты",
    'contact.title': "Оставьте заявку",
    'contact.sub': "В рабочее время перезвоним в течение 30 минут: ответим на вопросы и рассчитаем точную цену для вашего бизнеса.",
    'contact.phoneLabel': "Телефон",
    'contact.addressLabel': "Адрес",
    'contact.address': "г. Ташкент, Яккасарайский район, ул. Бабура, 20",
    'contact.hoursLabel': "Режим работы",
    'contact.hours': "Понедельник – суббота, 9:00 – 18:00",
    'contact.socials': "Мы в соцсетях",
    'contact.mapTitle': "FinBalans на карте",
    'contact.mapOpen': "Открыть на карте",

    'form.name': "Ваше имя",
    'form.phone': "Номер телефона",
    'form.message': "Комментарий",
    'form.optional': "(необязательно)",
    'form.consent': "Даю согласие на обработку персональных данных",
    'form.submit': "Отправить заявку",
    'form.invalid': "Пожалуйста, заполните отмеченные поля и отметьте согласие.",
    'form.success': "Спасибо, заявка принята. Перезвоним в течение 30 минут в рабочее время.",
    'form.sending': "Отправляется…",
    'form.error': "Произошла ошибка — заявка не отправлена. Пожалуйста, свяжитесь с нами напрямую:",

    'footer.tagline': "Аутсорсинг бухгалтерии для ООО и ИП. Ташкент, работаем с 2018 года.",
    'footer.colServices': "Услуги",
    'footer.colCompany': "Компания",
    'footer.colContact': "Контакты",
    'footer.legalName': "ООО «FINBALANS»",
    'footer.stir': "ИНН (СТИР): 309 415 782",
    'footer.admin': "Вход для сотрудников",
    'footer.privacy': "Политика конфиденциальности",

    'reviews.prev': "Предыдущий отзыв",
    'reviews.next': "Следующий отзыв",
    'reviews.goto': "Отзыв",
    'mobilebar.call': "Позвонить",
    'mobilebar.form': "Оставить заявку",

    /* --- Курс валют --- */
    'rates.label': "Курс Центрального банка",
    'rates.source': "cbu.uz",

    /* --- Калькулятор --- */
    'nav.calc': "Калькулятор",
    'calc.kicker': "Калькулятор",
    'calc.title': "Рассчитайте стоимость обслуживания",
    'calc.sub': "Посмотрите примерный ежемесячный платёж за несколько секунд. Формула открыта — ниже видно, из чего складывается сумма.",
    'calc.entity': "Форма бизнеса",
    'calc.entityIp': "ИП",
    'calc.entityLlc': "ООО",
    'calc.regime': "Налоговый режим",
    'calc.regimeTurnover': "Налог с оборота",
    'calc.regimeVat': "НДС",
    'calc.regimeLocked': "Для ИП налоговый режим не выбирается",
    'calc.ops': "Операций в месяц",
    'calc.emps': "Количество сотрудников",
    'calc.tif': "Работаем с экспортом-импортом (ВЭД)",
    'calc.resultLabel': "Примерный платёж в месяц",
    'calc.unit': "сум / месяц",
    'calc.breakdown': "Из чего складывается цена",
    'calc.bBase': "Базовый тариф",
    'calc.bOps': "Дополнительные операции",
    'calc.bEmps': "Дополнительные сотрудники",
    'calc.bTif': "Надбавка за ВЭД",
    'calc.bIncluded': "входит в тариф",
    'calc.note': "Это предварительный расчёт. Точную цену подтвердим по телефону после просмотра документов.",
    'calc.cta': "Получить точную цену",
    'calc.msgIntro': "Расчёт по калькулятору:",
    'calc.msgEntity': "Форма бизнеса",
    'calc.msgRegime': "Налоговый режим",
    'calc.msgOps': "Операций",
    'calc.msgEmps': "Сотрудников",
    'calc.msgTif': "Экспорт-импорт",
    'calc.msgYes': "да",
    'calc.msgNo': "нет",
    'calc.msgTotal': "Примерный платёж в месяц",

    /* --- Сроки отчётности --- */
    'dl.title': "Ближайшие сроки отчётности",
    'dl.sub': "Даты рассчитываются автоматически от сегодняшнего дня.",
    'dl.vat': "Отчёт по НДС",
    'dl.payroll': "Социальный налог и НДФЛ",
    'dl.turnover': "Налог с оборота (квартал)",
    'dl.daysLeft': "дн. осталось",
    'dl.today': "сегодня",
    'dl.tomorrow': "завтра",
    'dl.months': "января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря",

    /* --- График экономии --- */
    'save.title': "Сколько вы экономите",
    'save.staff': "Бухгалтер в штате",
    'save.staffVal': "8–12 млн сум / мес",
    'save.us': "FinBalans",
    'save.usVal': "0,6–2,4 млн сум / мес",
    'save.badge': "≈70% экономии",
    'a11y.toTop': "Наверх"
  },

  /* ======== EN ======== */
  en: {
    'meta.title': "FinBalans — Accounting services in Tashkent",
    'a11y.langGroup': "Language",
    'a11y.skip': "Skip to content",
    'a11y.tg': "Message us on Telegram",
    'a11y.menu': "Menu",
    'a11y.mainNav': "Main menu",
    'a11y.tariffs': "Pricing plans — scrolls sideways",
    'a11y.langNow': "selected language",

    'nav.services': "Services",
    'nav.pricing': "Pricing",
    'nav.team': "Team",
    'nav.faq': "FAQ",
    'nav.contact': "Contact",
    'nav.cta': "Consultation",

    'hero.kicker': "Accounting bureau · Tashkent",
    'hero.titleBase': "Accounting outsourcing in Tashkent — ",
    'hero.typed': ["for LLCs", "for sole proprietors", "for foreign-trade firms"],
    'hero.lead': "We file reports on time, calculate taxes correctly and keep HR records in order — protecting your business from errors and fines.",
    'hero.cta1': "Get a free consultation",
    'hero.cta2': "View pricing",
    'hero.chip1': "First consultation is free",
    'hero.chip2': "Guarantee up to 50 mln UZS",
    'hero.chip3': "Reply within 30 minutes",

    'facts.f1': "the year we started",
    'facts.f2': "companies under ongoing service",
    'facts.f3': "reports filed on time",
    'facts.f4num': "50 million",
    'facts.f4': "UZS liability insurance coverage",

    'services.kicker': "Services",
    'services.title': "What we do",
    'services.sub': "From day-to-day bookkeeping to representation during tax inspections. Core services are included in the monthly plan; one-off work is priced separately.",
    'services.link': "Plans and pricing",
    'services.inTariff': "included in the plan",
    'services.s1t': "Bookkeeping",
    'services.s1d': "We work in 1C and Didox: primary documents, bank transactions, electronic invoices (EHF), income and expense control.",
    'services.s2t': "Tax reporting",
    'services.s2d': "Turnover tax, VAT, profit and income taxes, social tax — all filed on time via soliq.uz.",
    'services.s3t': "Payroll and HR records",
    'services.s3d': "Employment contracts, vacation and sick leave, income tax and social tax calculation.",
    'services.s4t': "Accounting recovery",
    'services.s4d': "We clean up periods with missing or incorrect records and file amended reports for the errors found.",
    'services.s4p': "from 3,000,000 UZS, one-time",
    'services.s5t': "Zero reporting",
    'services.s5d': "For dormant companies we file the mandatory reports.",
    'services.s5p': "300,000 UZS / quarter",
    'services.s6t': "Business registration",
    'services.s6d': "LLC or sole-proprietor registration, tax regime selection, bank account and e-signature (ERI).",
    'services.s6p': "1,500,000 UZS, one-time",

    'pricing.kicker': "Plans",
    'pricing.title': "Pricing",
    'pricing.sub': "The exact price depends on the tax regime, monthly transactions and headcount. We'll calculate it in 10 minutes over the phone.",
    'pricing.unit': "UZS / month",
    'pricing.cta': "Leave a request",
    'pricing.tag': "Most popular",
    'pricing.t1name': "Sole proprietor",
    'pricing.t1for': "For individual entrepreneurs (YaTT)",
    'pricing.t1price': "from 600,000",
    'pricing.t1f1': "Up to 30 transactions per month",
    'pricing.t1f2': "Income tax reporting",
    'pricing.t1f3': "Work with soliq.uz and your bank",
    'pricing.t1f4': "Consultations via Telegram",
    'pricing.t2name': "LLC · turnover tax",
    'pricing.t2for': "Companies on the simplified regime",
    'pricing.t2price': "from 1,200,000",
    'pricing.t2f1': "Up to 100 transactions per month",
    'pricing.t2f2': "All tax and statistical reports",
    'pricing.t2f3': "Payroll for up to 5 employees",
    'pricing.t2f4': "Dedicated accountant",
    'pricing.t2f5': "Monthly income and expense summary",
    'pricing.t3name': "LLC · VAT",
    'pricing.t3for': "General regime, VAT payers",
    'pricing.t3price': "from 2,400,000",
    'pricing.t3f1': "VAT accounting and EHF control",
    'pricing.t3f2': "Unlimited reporting",
    'pricing.t3f3': "Payroll for up to 10 employees",
    'pricing.t3f4': "Representation during tax inspections",
    'pricing.t3f5': "Chief-accountant-level specialist",
    'pricing.note1': "For companies with foreign trade (import/export), service starts from 2,000,000 UZS and is agreed individually.",
    'pricing.note2': "Payroll beyond the plan — 50,000 UZS / month per employee. 10% discount with an annual contract.",
    'pricing.note3': "Prices as of August 2026.",

    'compare.kicker': "Comparison",
    'compare.title': "In-house accountant or outsourcing?",
    'compare.sub': "The difference is obvious in numbers.",
    'compare.colA': "In-house accountant",
    'compare.r1l': "Monthly cost",
    'compare.r1a': "8–12 mln UZS + workplace and taxes",
    'compare.r1b': "0.6–2.4 mln UZS, nothing extra",
    'compare.r2l': "Vacation and sick leave",
    'compare.r2a': "The books stop",
    'compare.r2b': "The team continues uninterrupted",
    'compare.r3l': "Liability for mistakes",
    'compare.r3a': "Hard to recover in practice",
    'compare.r3b': "In the contract: insured up to 50 mln UZS",
    'compare.r4l': "Expertise",
    'compare.r4a': "One specialist's capacity",
    'compare.r4b': "Accountant + tax consultant + HR",
    'compare.r5l': "Quality control",
    'compare.r5a': "The owner has to check",
    'compare.r5b': "Monthly internal review",

    'ind.label': "Industries we work with",
    'ind.i1': "Trade",
    'ind.i2': "Manufacturing",
    'ind.i3': "Services",
    'ind.i4': "IT",
    'ind.i5': "Construction",
    'ind.i6': "Logistics",
    'ind.i7': "Food service",
    'ind.i8': "Import & export",
    'marquee.text': "Bookkeeping — Tax reporting — Payroll & HR — Financial peace of mind — ",

    'about.imgAlt': "Gold coins — growing savings",
    'cta.title': "Put your books in reliable hands",

    'guar.kicker': "Liability",
    'guar.imgAlt': "Signing the contract",
    'guar.title': "We answer for our own mistakes",
    'guar.lead': "If a fine or penalty is caused by our fault, we pay it from our own funds. Not a verbal promise: it is clause 6.2 of the contract, and our liability is insured for up to 50 million UZS.",
    'guar.i1t': "Contract sample — in advance",
    'guar.i1d': "You review the full contract text before signing. It can be concluded remotely with an e-signature.",
    'guar.i2t': "Confidentiality",
    'guar.i2d': "Non-disclosure of your financial data is secured by a dedicated NDA clause in the contract.",
    'guar.i3t': "Internal review",
    'guar.i3d': "Every accountant's work is checked monthly by an internal reviewer.",

    'process.kicker': "How we work",
    'process.title': "How we start",
    'process.s1time': "30 minutes",
    'process.s1t': "Request and call",
    'process.s1d': "You fill in the form — we call back within 30 minutes during business hours to understand your activity and needs.",
    'process.s2time': "1–2 days",
    'process.s2t': "Document review",
    'process.s2d': "We assess your current books free of charge and quote an exact price based on transaction volume.",
    'process.s3time': "1 day",
    'process.s3t': "Contract",
    'process.s3d': "We send the sample in advance and discuss your questions. Signing in the office or remotely with an e-signature.",
    'process.s4time': "within a week",
    'process.s4t': "Handover",
    'process.s4d': "We take over your documents; we arrange the handover from your previous accountant ourselves.",

    'team.kicker': "Team",
    'team.title': "The people who keep your books",
    'team.sub': "Every client gets a designated responsible accountant — you know exactly who you work with.",
    'team.p1role': "Founder, chief accountant",
    'team.p1cred': "14 years of experience · certified tax consultant",
    'team.p2role': "Tax consultant",
    'team.p2cred': "9 years: VAT and foreign trade",
    'team.p3role': "Accountant",
    'team.p3cred': "6 years: LLC and sole-proprietor books",
    'team.p4role': "HR and payroll specialist",
    'team.p4cred': "8 years: labor law",

    'reviews.kicker': "Client experience",
    'reviews.title': "Companies that work with us",
    'reviews.r1text': "“When we switched to VAT, errors surfaced in our books — FinBalans sorted everything out in two months and recovered 14 million UZS of overpaid tax.”",
    'reviews.r1role': "Director, TexnoPlast LLC",
    'reviews.r2text': "“In three years not a single report has been late. I get answers within an hour on business days — it was never like that with our previous accountant.”",
    'reviews.r2role': "Finance manager, FoodCity",
    'reviews.r3text': "“We used to pay an in-house accountant 8 million UZS a month. Now the same workload is done for 2.4 million — at higher quality.”",
    'reviews.r3role': "Founder, LogiTrans",

    'faq.kicker': "FAQ",
    'faq.title': "Frequently asked questions",
    'faq.q1': "What documents are needed to start?",
    'faq.a1': "Registration certificate, access to the soliq.uz account, e-signature key, bank statements and, if available, the last filed reports. We send the checklist after your request; documents are accepted via Telegram.",
    'faq.q2': "Can the contract be concluded remotely?",
    'faq.a2': "Yes. We send the contract sample in advance and, once agreed, sign remotely with an e-signature. Visiting the office is not required.",
    'faq.q3': "What happens if a fine is caused by your mistake?",
    'faq.a3': "We pay the fine and penalty from our own funds — this is fixed in clause 6.2 of the contract. Our liability is insured for up to 50 million UZS.",
    'faq.q4': "What changes if we switch tax regimes?",
    'faq.a4': "We prepare and file the transition documents ourselves — it's included in the plan. The plan is then reviewed for the workload on the new regime and agreed in advance.",
    'faq.q5': "What's in the plan — will there be unexpected extra charges?",
    'faq.a5': "The plan's scope is attached to the contract: bookkeeping, reporting, payroll for the agreed number of employees. Work beyond the plan (e.g. accounting recovery) is done only at a price agreed beforehand.",
    'faq.q6': "What does the price depend on?",
    'faq.a6': "Four factors: tax regime (turnover tax or VAT), monthly transaction count, headcount and whether you do foreign trade. With that information we quote an exact price in 10 minutes.",

    'contact.kicker': "Contact",
    'contact.title': "Leave a request",
    'contact.sub': "We call back within 30 minutes during business hours: we'll answer your questions and calculate an exact price for your business.",
    'contact.phoneLabel': "Phone",
    'contact.addressLabel': "Address",
    'contact.address': "Tashkent, Yakkasaray district, Bobur street, 20",
    'contact.hoursLabel': "Working hours",
    'contact.hours': "Monday – Saturday, 9:00 – 18:00",
    'contact.socials': "Social media",
    'contact.mapTitle': "FinBalans on the map",
    'contact.mapOpen': "Open in Maps",

    'form.name': "Your name",
    'form.phone': "Phone number",
    'form.message': "Comment",
    'form.optional': "(optional)",
    'form.consent': "I consent to the processing of my personal data",
    'form.submit': "Send request",
    'form.invalid': "Please fill in the highlighted fields and tick the consent box.",
    'form.success': "Thank you, your request has been received. We'll call back within 30 minutes during business hours.",
    'form.sending': "Sending…",
    'form.error': "Something went wrong — the request was not sent. Please contact us directly:",

    'footer.tagline': "Accounting outsourcing for LLCs and sole proprietors. Tashkent, since 2018.",
    'footer.colServices': "Services",
    'footer.colCompany': "Company",
    'footer.colContact': "Contact",
    'footer.legalName': "FINBALANS LLC",
    'footer.stir': "Tax ID (STIR): 309 415 782",
    'footer.admin': "Staff login",
    'footer.privacy': "Privacy policy",

    'reviews.prev': "Previous review",
    'reviews.next': "Next review",
    'reviews.goto': "Review",
    'mobilebar.call': "Call us",
    'mobilebar.form': "Leave a request",

    /* --- Currency rates --- */
    'rates.label': "Central Bank rate",
    'rates.source': "cbu.uz",

    /* --- Calculator --- */
    'nav.calc': "Calculator",
    'calc.kicker': "Calculator",
    'calc.title': "Estimate your monthly fee",
    'calc.sub': "See an approximate monthly price in seconds. The formula is open — the breakdown below shows exactly how it adds up.",
    'calc.entity': "Business type",
    'calc.entityIp': "Sole trader",
    'calc.entityLlc': "LLC",
    'calc.regime': "Tax regime",
    'calc.regimeTurnover': "Turnover tax",
    'calc.regimeVat': "VAT",
    'calc.regimeLocked': "Tax regime does not apply to sole traders",
    'calc.ops': "Transactions per month",
    'calc.emps': "Number of employees",
    'calc.tif': "We handle export-import (foreign trade)",
    'calc.resultLabel': "Estimated monthly fee",
    'calc.unit': "UZS / month",
    'calc.breakdown': "How the price adds up",
    'calc.bBase': "Base tariff",
    'calc.bOps': "Additional transactions",
    'calc.bEmps': "Additional employees",
    'calc.bTif': "Foreign-trade surcharge",
    'calc.bIncluded': "included in tariff",
    'calc.note': "This is an estimate. We confirm the exact price on a call after reviewing your documents.",
    'calc.cta': "Get an exact quote",
    'calc.msgIntro': "Calculator estimate:",
    'calc.msgEntity': "Business type",
    'calc.msgRegime': "Tax regime",
    'calc.msgOps': "Transactions",
    'calc.msgEmps': "Employees",
    'calc.msgTif': "Export-import",
    'calc.msgYes': "yes",
    'calc.msgNo': "no",
    'calc.msgTotal': "Estimated monthly fee",

    /* --- Reporting deadlines --- */
    'dl.title': "Upcoming reporting deadlines",
    'dl.sub': "Dates are calculated automatically from today.",
    'dl.vat': "VAT return",
    'dl.payroll': "Social tax and personal income tax",
    'dl.turnover': "Turnover tax (quarterly)",
    'dl.daysLeft': "days left",
    'dl.today': "today",
    'dl.tomorrow': "tomorrow",
    'dl.months': "January,February,March,April,May,June,July,August,September,October,November,December",

    /* --- Savings chart --- */
    'save.title': "What you save",
    'save.staff': "In-house accountant",
    'save.staffVal': "8–12M UZS / month",
    'save.us': "FinBalans",
    'save.usVal': "0.6–2.4M UZS / month",
    'save.badge': "≈70% saved",
    'a11y.toTop': "Back to top"
  }
};

/* ---------------- Til almashtirgich ---------------- */
const langButtons = document.querySelectorAll('.lang-btn');

function setLanguage(lang) {
  if (!translations[lang]) lang = 'uz';
  let dict = translations[lang];

  /* Admin-CMS matn qayta yozishlari: content.i18n[lang] lug'at ustidan ustun */
  let cfg = serverContent;
  if (!cfg) {
    try { cfg = JSON.parse(localStorage.getItem('finbalans-content')); } catch (e) { /* yo'q */ }
  }
  const i18nOverrides = cfg && cfg.i18n && cfg.i18n[lang];
  if (i18nOverrides) dict = Object.assign({}, dict, i18nOverrides);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  /* Atribut tarjimalari: data-i18n-attr="attr:kalit" yoki "attr:kalit;attr2:kalit2" */
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
      const [attr, key] = pair.split(':');
      if (attr && key && dict[key] !== undefined) el.setAttribute(attr.trim(), dict[key]);
    });
  });

  langButtons.forEach(btn => {
    const on = btn.dataset.lang === lang;
    btn.classList.toggle('active', on);
    /* aria-pressed: skrinrider "bosilgan" deb o'qiydi. Ilgari faol til
       faqat `.active` sinfi bilan, ya'ni ko'z bilan ajralib turardi. */
    btn.setAttribute('aria-pressed', String(on));
  });
  document.documentElement.lang = lang;
  document.title = dict['meta.title'];
  try { localStorage.setItem('finbalans-lang', lang); } catch (e) { /* xotira bloklangan */ }

  currentLang = lang;
  startTyping(dict['hero.typed'] || []);
  buildMarquee2(dict);
  updateCarouselAria(dict);
  renderRates(dict);
  applyContentOverrides();
}

/* =========================================================
   Valyuta kurslari lentasi (Markaziy bank, /api/rates)
   ========================================================= */
let ratesData = null;

let ratesHist = null;

if (location.protocol === 'http:' || location.protocol === 'https:') {
  fetch('/api/rates-history')
    .then(r => (r.ok ? r.json() : null))
    .then(json => {
      if (json && json.days && json.days.length > 2) {
        ratesHist = json;
        renderRates(translations[currentLang] || translations.uz);
      }
    })
    .catch(() => { /* statistikasiz davom etadi */ });

  fetch('/api/rates')
    .then(r => (r.ok ? r.json() : null))
    .then(json => {
      if (json && json.rates && json.rates.length) {
        ratesData = json;
        renderRates(translations[currentLang] || translations.uz);
      }
    })
    .catch(() => { /* server yo'q - lenta ko'rinmaydi */ });
}

function renderRates(dict) {
  const bar = document.getElementById('ratesBar');
  const list = document.getElementById('ratesList');
  const dateEl = document.getElementById('ratesDate');
  if (!bar || !list) return;

  /* Ma'lumot yo'q - lenta umuman ko'rsatilmaydi (soxta raqam chiqmaydi) */
  if (!ratesData || !ratesData.rates || !ratesData.rates.length) {
    bar.hidden = true;
    return;
  }

  if (dateEl) dateEl.textContent = ratesData.date || '';

  /* Bitta element: kod + qiymat + o'sish/pasayish belgisi */
  function buildItem(r) {
    const diff = parseFloat(String(r.diff).replace(',', '.')) || 0;
    const dir = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';

    const li = document.createElement('li');
    li.className = 'rate-item';

    const code = document.createElement('span');
    code.className = 'rate-code rate-code-' + r.code.toLowerCase();
    /* Valyuta belgisi: $ , € , ₽ */
    const sym = { USD: '$', EUR: '€', RUB: '₽' }[r.code] || '';
    const symEl = document.createElement('i');
    symEl.className = 'rate-sym';
    symEl.textContent = sym;
    code.appendChild(symEl);
    code.appendChild(document.createTextNode(r.code));

    const val = document.createElement('span');
    val.className = 'rate-val';
    val.textContent = Math.round(parseFloat(r.rate) || 0).toLocaleString('ru-RU');

    const d = document.createElement('span');
    d.className = 'rate-diff rate-' + dir;

    /* Yashil yuqoriga / qizil pastga strelka (SVG) */
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'rate-arrow');
    svg.setAttribute('aria-hidden', 'true');
    const pth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pth.setAttribute('d', dir === 'down'
      ? 'M12 4v15M6 13l6 6 6-6'   /* pastga */
      : 'M12 20V5M6 11l6-6 6 6'); /* yuqoriga */
    pth.setAttribute('fill', 'none');
    pth.setAttribute('stroke', 'currentColor');
    pth.setAttribute('stroke-width', '2.6');
    pth.setAttribute('stroke-linecap', 'round');
    pth.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(pth);

    const num = document.createElement('span');
    num.textContent = Math.abs(diff).toFixed(2);

    if (dir !== 'flat') d.appendChild(svg);
    d.appendChild(num);

    li.appendChild(code);
    li.appendChild(val);
    li.appendChild(d);

    /* 14 kunlik mini-grafik (statistika) */
    if (ratesHist && ratesHist.days) {
      const vals = ratesHist.days.map(x => x[r.code]).filter(v => typeof v === 'number');
      if (vals.length > 2) {
        const min = Math.min.apply(null, vals);
        const max = Math.max.apply(null, vals);
        const span = (max - min) || 1;
        const W = 46, H = 14, P = 1.5;
        const pts = vals.map((v, i) =>
          (P + i * (W - 2 * P) / (vals.length - 1)).toFixed(1) + ' ' +
          (H - P - (v - min) / span * (H - 2 * P)).toFixed(1));
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.setAttribute('class', 'rate-spark');
        svg.setAttribute('aria-hidden', 'true');
        const pl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pl.setAttribute('d', 'M' + pts.join(' L'));
        pl.setAttribute('class',
          vals[vals.length - 1] >= vals[0] ? 'sp-line sp-up' : 'sp-line sp-down');
        svg.appendChild(pl);
        li.appendChild(svg);
      }
    }
    return li;
  }

  /* Uzluksiz surilish uchun ro'yxat ikki nusxada chiziladi */
  const list2 = document.getElementById('ratesList2');
  [list, list2].forEach(ul => {
    if (!ul) return;
    ul.innerHTML = '';
    ratesData.rates.forEach(r => ul.appendChild(buildItem(r)));
  });

  bar.hidden = false;
  document.body.classList.add('has-rates');
}

/* ---------------- Ikkinchi marquee: sohalar, teskari yo'nalishda ---------------- */
function buildMarquee2(dict) {
  const a = document.getElementById('marquee2a');
  const b = document.getElementById('marquee2b');
  if (!a || !b) return;
  const words = ['ind.i1', 'ind.i2', 'ind.i3', 'ind.i4', 'ind.i5', 'ind.i6', 'ind.i7', 'ind.i8']
    .map(k => dict[k])
    .filter(Boolean);
  const text = words.join(' · ') + ' · ';
  a.textContent = text;
  b.textContent = text;
}

/* Karusel nuqtalarining aria-yorlig'ini joriy tilga moslash */
function updateCarouselAria(dict) {
  const dotsWrap = document.getElementById('revDots');
  if (!dotsWrap) return;
  Array.prototype.forEach.call(dotsWrap.children, (dot, i) => {
    dot.setAttribute('aria-label', (dict['reviews.goto'] || 'Fikr') + ' ' + (i + 1));
  });
}

let currentLang = 'uz';

/* ---------------- Hero: almashinib turuvchi so'z (krossfeyd) ---------------- */
const typedEl = document.getElementById('typedText');
let typedTimer = null;
let typedWords = [];

/* ---------------- Almashuvchi so'z uchun joy ----------------
   Sarlavhaning oxirgi so'zi har 3.5 sekundda almashadi. Agar
   maydon balandligi belgilanmasa, uzun variant ("TIF
   kompaniyalari uchun") qatorga sig'may, butun hero sakraydi.

   Ilgari CSS'da qat'iy `min-height: 2.28em` turardi - ya'ni
   doim ikki qator. Lekin 390px va undan keng ekranda barcha
   so'zlar (uch tilda ham) bitta qatorga sig'adi: sarlavha
   ostida 34px bo'sh joy qolib, "sahifa buzuq" taassurotini
   berardi. Endi joy o'lchab belgilanadi: eng baland variant
   qancha joy olsa, shuncha. 360px'da bu ikki qator, 390px'da
   bitta qator - hech qanday sehrli breakpoint kerak emas va
   matn o'zgarsa ham o'zi moslashadi. */
function fitTypedBox(words) {
  const wrap = typedEl && typedEl.closest('.typed-wrap');
  if (!wrap || !words.length) return;

  const saved = typedEl.textContent;
  /* O'lchov paytida animatsiya sinflari balandlikka ta'sir
     qilmasligi uchun ular vaqtincha olib turiladi */
  const hadOut = typedEl.classList.contains('word-out');
  const hadIn = typedEl.classList.contains('word-in');
  typedEl.classList.remove('word-out', 'word-in');

  wrap.style.minHeight = '0px';
  let max = 0;
  for (const w of words) {
    typedEl.textContent = w;
    max = Math.max(max, wrap.getBoundingClientRect().height);
  }

  typedEl.textContent = saved;
  if (hadOut) typedEl.classList.add('word-out');
  if (hadIn) typedEl.classList.add('word-in');
  /* Yarim piksel yaxlitlanishi qatorni kesib qo'ymasligi uchun +1 */
  wrap.style.minHeight = max ? Math.ceil(max) + 1 + 'px' : '';
}

/* Ekran burilganda yoki o'lcham o'zgarganda qayta o'lchanadi */
let typedFitTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(typedFitTimer);
  typedFitTimer = setTimeout(() => fitTypedBox(typedWords), 150);
}, { passive: true });

/* Shrift yuklangach yana bir marta. Birinchi o'lchov sahifa
   tahlil qilinayotganda bo'ladi - o'shanda Lora hali yuklanmagan
   va zaxira shrift (Georgia) kengroq: so'z ikki qatorga o'ralib,
   maydon keraksiz baland belgilanib qolardi. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => fitTypedBox(typedWords));
}

function startTyping(words) {
  if (!typedEl || !words.length) return;
  clearTimeout(typedTimer);
  typedEl.classList.remove('word-out', 'word-in');
  typedEl.textContent = words[0];
  typedWords = words;
  fitTypedBox(words);

  if (REDUCED_MOTION || words.length < 2) return;

  let wordIndex = 0;

  function swap() {
    typedEl.classList.add('word-out'); /* yuqoriga silliq so'nadi */
    typedTimer = setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      typedEl.textContent = words[wordIndex];
      typedEl.classList.remove('word-out');
      typedEl.classList.add('word-in'); /* pastdan paydo bo'ladi */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => typedEl.classList.remove('word-in'));
      });
      typedTimer = setTimeout(swap, 3500);
    }, 400);
  }
  /* ---------- Almashinuv qachon boshlanadi ----------
     TOPILGAN MUAMMO: so'z almashishi LCP ni buzardi.

     Brauzer LCP ni "eng katta chizilgan element" bo'yicha
     o'lchaydi va u foydalanuvchi biror narsa bosmaguncha
     yangilanib turadi. Almashuvchi so'z sarlavha ichida katta
     serif matn - "TIF kompaniyalari uchun" ("MChJ uchun" dan
     ancha uzun) chizilganda brauzer yangi, KATTAROQ LCP
     nomzodini yozardi.

     O'lchov (20 Mbps, 6 marta): odatda LCP 1 208ms, lekin
     almashinuv o'z vaqtida tushib qolgan bir yugurishda
     4 544ms - "yomon" darajaga chiqib ketdi.

     Yechim: birinchi bosish/tugma bosilishini kutamiz -
     aynan o'sha paytda brauzer LCP ni yakunlaydi, ya'ni
     undan keyin animatsiya o'lchovga umuman ta'sir qila
     olmaydi. Hech kim bosmasa ham 10 soniyadan keyin o'zi
     boshlanadi (bu paytga kelib sahifa allaqachon o'qilgan).

     Scroll ataylab hisobga olinmagan: u LCP ni yakunlamaydi. */
  let started = false;
  function beginRotation() {
    if (started) return;
    started = true;
    clearTimeout(idleStart);
    ['pointerdown', 'keydown', 'click'].forEach(ev =>
      window.removeEventListener(ev, beginRotation));
    typedTimer = setTimeout(swap, 900);
  }

  const idleStart = setTimeout(beginRotation, 10000);
  ['pointerdown', 'keydown', 'click'].forEach(ev =>
    window.addEventListener(ev, beginRotation, { once: false, passive: true }));
}

/* ---------------- Faktlar: sanaladigan raqamlar ---------------- */
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    if (!target || REDUCED_MOTION) {
      el.textContent = target ? target.toLocaleString('ru-RU') : el.textContent;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}
setTimeout(animateCounters, 600); /* hero kirish animatsiyasidan keyin */

/* ---------------- Admin panel sozlamalari (localStorage) ---------------- */
let serverContent = null;

/* Server rejimida kontent sozlamalari barcha tashrifchilar uchun
   umumiy - /api/content dan olinadi */
if (location.protocol === 'http:' || location.protocol === 'https:') {
  fetch('/api/content')
    .then(r => (r.ok ? r.json() : null))
    .then(json => {
      if (json && Object.keys(json).length) {
        serverContent = json;
        /* Server sozlamalari (jumladan i18n qayta yozishlari) darhol ko'rinsin */
        setLanguage(currentLang);
      }
    })
    .catch(() => { /* server yo'q - localStorage yetarli */ });
}

function applyContentOverrides() {
  let c = serverContent;
  if (!c) {
    try { c = JSON.parse(localStorage.getItem('finbalans-content')); } catch (e) { /* yo'q */ }
  }
  if (!c) return;

  if (c.phone) {
    const digits = c.phone.replace(/\D/g, '');
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      a.href = 'tel:+' + digits;
      /* Raqam ko'rsatilgan havolalar yangilanadi, matnli tugmalar tegilmaydi */
      if (a.textContent.replace(/\D/g, '').length >= 9) a.textContent = c.phone;
    });
  }
  if (c.telegram) {
    const handle = c.telegram.replace(/^@/, '');
    document.querySelectorAll('a[href*="t.me"]').forEach(a => {
      a.href = 'https://t.me/' + handle;
      if (a.textContent.trim().startsWith('@')) a.textContent = '@' + handle;
    });
  }
  if (c.email) {
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.href = 'mailto:' + c.email;
      if (a.textContent.includes('@')) a.textContent = c.email;
    });
  }
  /* Ijtimoiy tarmoq havolalari (admin panelda kiritilgan bo'lsa) */
  ['instagram', 'facebook', 'youtube'].forEach(net => {
    if (c[net]) {
      document.querySelectorAll('[data-social="' + net + '"]').forEach(a => { a.href = c[net]; });
    }
  });

  /* Jamoa suratlari (admin paneldan yuklangan bo'lsa) */
  if (c.photos) {
    const team = document.querySelectorAll('.team-grid .person img');
    ['p1', 'p2', 'p3', 'p4'].forEach((k, i) => {
      if (c.photos[k] && team[i]) team[i].src = c.photos[k];
    });

    /* Hero slaydshou suratlari (hero1..hero3): kechiktirilgan slaydlarda
       data-src yangilanadi, yuklanganlarida src */
    const heroImgs = document.querySelectorAll('.hero-bg img');
    ['hero1', 'hero2', 'hero3'].forEach((k, i) => {
      if (c.photos[k] && heroImgs[i]) {
        if (heroImgs[i].dataset.src) heroImgs[i].dataset.src = c.photos[k];
        else heroImgs[i].src = c.photos[k];
      }
    });

    /* Foto-band surati (band) */
    const bandImg = document.querySelector('.image-band img');
    if (c.photos.band && bandImg) bandImg.src = c.photos.band;
  }

  const prefix = currentLang === 'ru' ? 'от ' : currentLang === 'en' ? 'from ' : '';
  [['t1', 'pricing.t1price'], ['t2', 'pricing.t2price'], ['t3', 'pricing.t3price']].forEach(([key, i18nKey]) => {
    if (c[key]) {
      const el = document.querySelector('[data-i18n="' + i18nKey + '"]');
      if (el) el.textContent = prefix + c[key];
    }
  });
}

langButtons.forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));

/* ---------------- Header ----------------
   Scroll bilan bog'liq barcha ish pastdagi yagona rAF dvigatelida
   (frameUpdate) bajariladi - alohida scroll tinglovchisi yo'q. */
const header = document.getElementById('siteHeader');

/* ---------------- Mobil menyu ---------------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

/* Menyu holati bitta joyda: panel, burger va sahifa scroll qulfi
   doim bir-biriga mos bo'ladi (html.nav-open -> overflow: hidden) */
function setNav(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('nav-open', open);

  /* Ochilganda fokus panelning birinchi havolasiga o'tadi. Sichqoncha
     bilan ochganda ham zarar qilmaydi, klaviatura bilan ochganda esa
     shart: aks holda keyingi Tab panelni "sakrab o'tib", ortidagi
     ko'rinmas elementlarga tushardi. */
  if (open) {
    const first = nav.querySelector('a, button');
    if (first) first.focus();
  }
}

/* ---------------- Ochiq menyuda fokus tuzog'i ----------------
   TOPILGAN XATO: menyu ochiq turганda Tab fokusni panel ichiga emas,
   uning ORTIDAGI elementlarga - kurs lentasi, hero tugmalari,
   tariflar havolasiga - olib ketardi. Klaviatura yoki skrinrider
   bilan ishlaydigan odam menyuni ochadi-yu, undan foydalana olmasdi.

   Panel faqat burger ko'rinib turgan kengliklarda (<=1000px)
   ochiladi, shuning uchun tuzoq ham faqat o'sha holatda ishlaydi -
   desktopdagi gorizontal menyuga tegmaydi. */
document.addEventListener('keydown', e => {
  if (e.key !== 'Tab' || !nav.classList.contains('open')) return;

  /* Tuzoq chegarasi - butun sarlavha bloki: panel havolalari, til
     tugmalari, burger va kurs lentasi. Menyu ochiq turganda aynan
     shular ko'rinib turadi, qolgani panel ortida qoladi.
     Elementlar DOM tartibida olinadi - shunda halqa Tab bosish
     tartibiga mos tushadi. */
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const items = [...header.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )].filter(el => {
    if (el.offsetParent === null && el !== burger) return false;   /* ko'rinmaydiganlar */
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  });
  if (!items.length) return;

  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;

  if (!header.contains(active)) {
    /* Fokus qandaydir yo'l bilan tashqarida qolsa - qaytariladi */
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
});

burger.addEventListener('click', () => setNav(!nav.classList.contains('open')));

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setNav(false));
});

/* Panel tashqarisiga teginish yoki Escape - menyu yopiladi */
document.addEventListener('click', e => {
  if (!nav.classList.contains('open')) return;
  if (nav.contains(e.target) || burger.contains(e.target)) return;
  setNav(false);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    setNav(false);
    burger.focus();
  }
});

/* ---------------- Telefon maskasi ---------------- */
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('focus', () => {
  if (!phoneInput.value.trim()) phoneInput.value = '+998 ';
});

phoneInput.addEventListener('blur', () => {
  if (phoneInput.value.trim() === '+998') phoneInput.value = '';
});

phoneInput.addEventListener('input', () => {
  /* KURSOR JOYIDA QOLISHI KERAK.
     Ilgari bu yerda `value` shunchaki qayta yozilardi - brauzer esa
     value o'zgargach kursorni oxiriga tashlaydi. Natijada o'rtadagi
     xato raqamni tuzatib bo'lmasdi: har bosishda kursor oxiriga
     sakrardi va raqam teskari terilardi. Telefonda bu ayniqsa
     asabiylashtiradi - odam raqamini kiritolmaydi.

     Yechim: kursordan OLDIN nechta RAQAM borligini sanaymiz
     (bo'shliqlarni emas - ular formatlashda siljiydi), qayta
     formatlaymiz, keyin kursorni o'sha raqamdan keyingi joyga
     qaytaramiz. */
  const el = phoneInput;
  const before = el.value;
  const selStart = el.selectionStart;
  /* kursordan oldingi raqamlar soni */
  const digitsBeforeCaret = selStart === null
    ? null
    : before.slice(0, selStart).replace(/\D/g, '').length;

  let digits = before.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  /* To'liq xalqaro raqam qo'yilganda (prefiks ustiga paste) 998 takroran
     olib tashlanadi - aks holda noto'g'ri, lekin "haqiqiyga o'xshash" raqam chiqadi */
  while (digits.length > 9 && digits.startsWith('998')) digits = digits.slice(3);
  digits = digits.slice(0, 9);

  /* Maydonni butunlay tozalashga ruxsat beramiz */
  if (!digits) { el.value = ''; return; }

  let out = '+998';
  out += ' ' + digits.slice(0, 2);
  if (digits.length > 2) out += ' ' + digits.slice(2, 5);
  if (digits.length > 5) out += ' ' + digits.slice(5, 7);
  if (digits.length > 7) out += ' ' + digits.slice(7, 9);

  if (out === before) return;      /* o'zgarish yo'q - kursorga tegmaymiz */
  el.value = out;

  if (digitsBeforeCaret === null) return;
  /* "+998" prefiksining uchta raqami har doim boshida turadi.
     Foydalanuvchi kiritgan raqamlar shundan keyin boshlanadi. */
  const wanted = Math.max(0, digitsBeforeCaret - (before.replace(/\D/g, '').startsWith('998') ? 3 : 0));
  let seen = 0, pos = out.length;
  for (let i = 0; i < out.length; i++) {
    if (i >= 4 && /\d/.test(out[i])) {      /* 4 = "+998" dan keyin */
      seen++;
      if (seen > wanted) { pos = i; break; }
    }
  }
  if (seen <= wanted) pos = out.length;
  try { el.setSelectionRange(pos, pos); } catch (e) { /* ba'zi turlar qo'llab-quvvatlamaydi */ }
});

/* Joriy tildagi lug'at - forma holat matnlari uchun */
function dictNow() {
  return translations[currentLang] || translations.uz;
}

/* ---------------- Ariza formasi ---------------- */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
const formInvalid = document.getElementById('formInvalid');
const consent = document.getElementById('consent');
const submitBtn = form.querySelector('.btn-submit');

/* Xabar qutisi ko'rinadigan joyga suriladi. Mobil ekranda tugma
   yopishqoq panel ustida turadi, xabar esa uning ostiga chiqib
   ketardi: foydalanuvchi tozalangan formani ko'rib, ariza
   ketgan-ketmaganini bilmasdi. */
function revealFormMsg(box) {
  if (!box) return;
  box.setAttribute('tabindex', '-1');
  box.scrollIntoView({ block: 'center', behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  box.focus({ preventScroll: true });
}

function showSuccess() {
  /* Forma tozalanadi va ochiq qoladi - foydalanuvchi xatoni tuzatib
     yoki ikkinchi ariza yuborib olishi mumkin */
  form.reset();
  submitBtn.disabled = false;
  formError.hidden = true;
  formSuccess.hidden = false;
  revealFormMsg(formSuccess);
}

/* Arizani admin panel o'qiy olishi uchun localStorage'ga yozamiz */
function saveLead(data) {
  try {
    const leads = JSON.parse(localStorage.getItem('finbalans-leads') || '[]');
    leads.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'new',
      name: data.name,
      phone: data.phone,
      message: data.message
    });
    localStorage.setItem('finbalans-leads', JSON.stringify(leads.slice(0, 500)));
  } catch (e) { /* xotira bloklangan */ }
}

form.addEventListener('submit', e => {
  e.preventDefault();

  /* Har urinish boshida eski xabarlar yashiriladi */
  if (formInvalid) formInvalid.hidden = true;
  formError.hidden = true;
  formSuccess.hidden = true;

  let valid = true;
  let firstInvalid = null;
  const name = form.name;
  const phone = form.phone;

  if (!name.value.trim()) {
    name.classList.add('invalid');
    name.setAttribute('aria-invalid', 'true');
    if (!firstInvalid) firstInvalid = name;
    valid = false;
  }
  if (phone.value.replace(/\D/g, '').length < 12) {
    phone.classList.add('invalid');
    phone.setAttribute('aria-invalid', 'true');
    if (!firstInvalid) firstInvalid = phone;
    valid = false;
  }
  if (!consent.checked) {
    consent.closest('.consent').classList.add('invalid');
    consent.setAttribute('aria-invalid', 'true');
    if (!firstInvalid) firstInvalid = consent;
    valid = false;
  }

  if (!valid) {
    /* Nima noto'g'ri ekani aytiladi va fokus birinchi xato maydonga o'tadi */
    if (formInvalid) formInvalid.hidden = false;
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const data = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    message: form.message.value.trim(),
    /* Honeypot: odam uni ko'rmaydi (forma tashqarisiga chiqarilgan),
       shuning uchun bo'sh keladi. Bot to'ldirsa - server indamay
       tashlab yuboradi. Ilgari bu maydon umuman yuborilmasdi, ya'ni
       serverdagi tekshiruv hech qachon ishlamasdi. */
    company: (form.company && form.company.value) || ''
  };

  if (!FORM_ENDPOINT) {
    /* Namoyish rejimi: endpoint ulanmagan, ariza localStorage'ga
       yoziladi (admin.html paneli o'sha yerdan o'qiydi).
       Ishga tushirishdan oldin FORM_ENDPOINT ni to'ldiring! */
    saveLead(data);
    showSuccess();
    return;
  }

  /* VAQT CHEKLOVI VA KO'RINADIGAN HOLAT.
     Ilgari `fetch` cheksiz kutardi: sekin yoki uzilgan tarmoqda
     tugma o'chgan holda qotib qolar, hech qanday xabar chiqmasdi.
     Odam nima bo'layotganini bilmay, sahifani tashlab ketardi.

     Endi: tugmada "Yuborilmoqda..." yozuvi, 15 soniyadan keyin
     so'rov bekor qilinadi va odatiy xato xabari chiqadi -
     telefon va Telegram havolalari bilan. */
  const origLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.setAttribute('aria-busy', 'true');
  submitBtn.textContent = (dictNow() && dictNow()['form.sending']) || 'Yuborilmoqda…';

  function restoreBtn() {
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-busy');
    submitBtn.textContent = origLabel;
  }

  /* AbortController eski brauzerlarda yo'q - u holda taymer
     faqat interfeysni tiklaydi, so'rov fonda tugaydi */
  let ctrl = null;
  try { ctrl = new AbortController(); } catch (e) { /* eski dvigatel */ }
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    if (ctrl) { try { ctrl.abort(); } catch (e) {} }
    restoreBtn();
    formError.hidden = false;
    revealFormMsg(formError);
  }, 15000);

  fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
    signal: ctrl ? ctrl.signal : undefined
  })
    .then(res => {
      if (timedOut) return;
      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      saveLead(data);
      restoreBtn();
      showSuccess();
    })
    .catch(() => {
      if (timedOut) return;          /* xabar allaqachon ko'rsatilgan */
      clearTimeout(timer);
      restoreBtn();
      formError.hidden = false;
      revealFormMsg(formError);
    });
});

form.querySelectorAll('input').forEach(field => {
  field.addEventListener('input', () => {
    field.classList.remove('invalid');
    field.removeAttribute('aria-invalid');
    if (field === consent) consent.closest('.consent').classList.remove('invalid');
  });
});
consent.addEventListener('change', () => {
  consent.closest('.consent').classList.remove('invalid');
  consent.removeAttribute('aria-invalid');
});

/* ---------------- FAQ: silliq ochilish-yopilish ---------------- */
document.querySelectorAll('.faq-item').forEach(item => {
  const summary = item.querySelector('summary');
  const content = item.querySelector('p');
  if (!summary || !content) return;

  summary.addEventListener('click', e => {
    if (REDUCED_MOTION) return; /* tabiiy ochilish */
    e.preventDefault();

    if (item.open) {
      content.style.maxHeight = content.scrollHeight + 'px';
      requestAnimationFrame(() => { content.style.maxHeight = '0px'; });
      content.addEventListener('transitionend', function done() {
        item.open = false;
        content.style.maxHeight = '';
        content.removeEventListener('transitionend', done);
      });
    } else {
      item.open = true;
      content.style.maxHeight = '0px';
      requestAnimationFrame(() => { content.style.maxHeight = content.scrollHeight + 'px'; });
      content.addEventListener('transitionend', function done() {
        content.style.maxHeight = '';
        content.removeEventListener('transitionend', done);
      });
    }
  });
});

/* ---------------- Paydo bo'lish animatsiyasi ---------------- */
/* IntersectionObserver himoyada. U yo'q dvigatelda (iOS 12.0-12.1
   Safari, eski Android WebView) himoyasiz `new IntersectionObserver`
   ReferenceError beradi va main.js SHU YERDA o'ladi - undan keyingi
   hamma narsa (menyu, forma, til, karusellar) ishlamay qoladi.
   Bundan ham yomoni: `html.js [data-reveal] { opacity: 0 }` kuchda
   qolib, 23 ta blok mangu ko'rinmas bo'lardi. */
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
} else {
  /* Observer yo'q: animatsiyasiz, hamma narsa darhol ko'rinadi.
     scroll listener ataylab qo'yilmaydi - u bu dvigatellarda
     sekin va baribir keraksiz. */
  document.querySelectorAll('[data-reveal], .stagger, .image-zoom, .steps')
    .forEach(el => el.classList.add('visible'));
}

/* Bootstrap shu yergacha yetdi - zaxira taymerga "kerak emas" deymiz.
   Bayroq AYNAN shu yerda, fayl boshida emas: undan oldingi har
   qanday xato zaxirani ishga tushirishi kerak. */
document.documentElement.classList.add('js-ready');

/* Zaxira yo'li: observer biror sababga ko'ra ishlamasa ham ko'rinish
   doirasidagi bloklar yashirin qolib ketmasligi uchun.
   MUHIM: bu funksiya scroll/rAF taktida CHAQIRILMAYDI - u getBoundingClientRect
   o'qishlarini style yozuvlari bilan aralashtiradi va majburiy sinxron
   layout (layout thrashing) keltirib chiqaradi. Faqat sanoqli marta:
   yuklanishda va o'lcham o'zgarganda. */
function revealInView() {
  const els = document.querySelectorAll('[data-reveal]:not(.visible)');
  if (!els.length) return;
  const vh = window.innerHeight;
  /* Avval hammasi O'QILADI, keyin hammasi YOZILADI */
  const toShow = [];
  els.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh - 40 && r.bottom > 0) toShow.push(el);
  });
  toShow.forEach(el => el.classList.add('visible'));
}
window.addEventListener('load', revealInView);
revealInView();

/* =========================================================
   Yagona scroll dvigateli
   ---------------------------------------------------------
   Sayt "qotib-qotib" ishlamasligi uchun barcha scroll ishi bitta
   rAF taktiga yig'ilgan va qat'iy ikki bosqichga bo'lingan:
     1) O'LCHASH  - layout o'qishlari faqat measure() da, ya'ni
        yuklanish/resize paytida. Har kadrda emas.
     2) YOZISH    - frameUpdate() faqat transform/opacity/class
        yozadi va birorta ham layout o'qimaydi.
   Shu tufayli har kadrda majburiy sinxron layout bo'lmaydi.
   ========================================================= */
const scrollProgress = document.getElementById('scrollProgress');
const heroBg = document.querySelector('.hero-bg');
const heroEl = document.querySelector('.hero');
const guarImg = document.querySelector('.guarantee-media img');
const floatTgEl = document.getElementById('floatTg');
const backTopEl = document.getElementById('backTop');

let rafPending = false;
let lastScrollY = 0;

/* Kadr ichida ishlatiladigan barcha geometriya - oldindan o'lchab qo'yiladi */
const metrics = {
  vh: 0,          /* ko'rinish balandligi */
  docH: 0,        /* aylantirish uzunligi */
  heroFlip: 0,    /* header oq holatga o'tadigan nuqta */
  heroPar: 0,     /* hero parallaksi to'xtaydigan nuqta */
  guarMid: 0,     /* javobgarlik surati markazining hujjatdagi o'rni */
  guarH: 0
};

function measure() {
  const y = window.scrollY;
  metrics.vh = window.innerHeight;
  metrics.docH = document.documentElement.scrollHeight - metrics.vh;
  metrics.heroPar = metrics.vh * 1.4;

  /* Header qachon shaffofdan oqqa o'tishi kerak: hero (to'q maydon)
     header ostidan butunlay chiqib ketganda. Aks holda oq panel to'q
     hero ustida turib qoladi va dizayn buzilgandek ko'rinadi. */
  const headerH = header ? header.offsetHeight : 76;
  if (heroEl && header && header.classList.contains('overlay')) {
    const hr = heroEl.getBoundingClientRect();
    metrics.heroFlip = Math.max(0, hr.top + y + hr.height - headerH);
  } else {
    /* Hero yo'q sahifalar (yoki overlay emas): darhol oq holat */
    metrics.heroFlip = 4;
  }

  if (guarImg && guarImg.parentElement) {
    const gr = guarImg.parentElement.getBoundingClientRect();
    metrics.guarH = gr.height;
    metrics.guarMid = gr.top + y + gr.height / 2;
  }
}

function frameUpdate() {
  rafPending = false;
  const y = window.scrollY;
  const m = metrics;

  /* --- Scroll progressi: width emas, transform (layout emas, kompozitor) --- */
  if (scrollProgress && m.docH > 0) {
    const p = y / m.docH;
    scrollProgress.style.transform = 'scaleX(' + (p < 0 ? 0 : p > 1 ? 1 : p) + ')';
  }

  /* --- Header: fon holati (gisterezis bilan - chegarada miltillamaydi) --- */
  if (header) {
    const solid = header.classList.contains('scrolled');
    if (!solid && y > m.heroFlip + 8) header.classList.add('scrolled');
    else if (solid && y < m.heroFlip - 8) header.classList.remove('scrolled');

    /* Pastga aylantirganda yashirinadi, yuqoriga qaytganda chiqadi.
       Hero ichida hech qachon yashirinmaydi - u yerda header shaffof. */
    const hideFrom = Math.max(480, m.heroFlip);
    if (y > hideFrom && y > lastScrollY + 6 && !(nav && nav.classList.contains('open'))) {
      header.classList.add('hide');
    } else if (y < lastScrollY - 6 || y <= hideFrom) {
      header.classList.remove('hide');
    }
  }

  if (floatTgEl) floatTgEl.classList.toggle('show', y > 650);
  if (backTopEl) backTopEl.classList.toggle('show', y > 600);
  lastScrollY = y;

  if (REDUCED_MOTION) return;

  /* Tinch rejimda parallaks yozilmaydi. CSS uni allaqachon bekor
     qiladi (transform: none !important), lekin har kadrda inline
     style yozish baribir uslub qayta hisoblashiga sabab bo'ladi -
     zaif qurilmada bu bekorga sarflangan ish.
     classList.contains arzon: hech narsa o'lchanmaydi, faqat
     ro'yxatga qaraladi. Sinf ish vaqtida ham qo'shilishi mumkin
     (avtomatik aniqlash), shuning uchun har kadrda tekshiriladi. */
  if (document.documentElement.classList.contains('low-power')) return;

  /* --- Parallakslar: faqat transform yoziladi, hech narsa o'qilmaydi --- */
  if (heroBg && y < m.heroPar) {
    heroBg.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0)';
  }
  if (guarImg && m.guarH) {
    /* Surat markazining ekran markazidan chetlanishi - kesh qilingan
       hujjat koordinatasidan hisoblanadi (getBoundingClientRect'siz) */
    const rTop = m.guarMid - m.guarH / 2 - y;
    if (rTop < m.vh && rTop + m.guarH > 0) {
      const c = (m.guarMid - y - m.vh / 2) / m.vh;
      guarImg.style.transform = 'translate3d(0,' + (c * -34) + 'px,0) scale(1.12)';
    }
  }
}

function onScroll() {
  if (!rafPending) { rafPending = true; requestAnimationFrame(frameUpdate); }
}
window.addEventListener('scroll', onScroll, { passive: true });

/* Qayta o'lchash: resize/orientation/shrift yuklanishi va til almashuvi
   sahifa balandligini o'zgartiradi */
let measureTimer = null;
function remeasure() {
  clearTimeout(measureTimer);
  measureTimer = setTimeout(() => {
    measure();
    revealInView();
    frameUpdate();
  }, 120);
}
window.addEventListener('resize', remeasure, { passive: true });
window.addEventListener('orientationchange', remeasure, { passive: true });
window.addEventListener('load', () => { measure(); frameUpdate(); });
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => { measure(); frameUpdate(); });
}

measure();
frameUpdate();

/* ---------------- Hero: fon slaydshousi (krossfeyd + Ken Burns) ---------------- */
const heroSlides = document.querySelectorAll('.hero-bg img');

/* 2-3-slaydlar kechiktirib yuklanadi: birinchi bo'yashda faqat
   birinchi slayd tortiladi, qolganlari load'da yoki birinchi
   almashinuvdan oldin.

   Slaydlar <picture> ichida: <source data-srcset> ni ham
   ko'chirish kerak, aks holda brauzer WebP variantlarini
   ko'rmay, faqat zaxira JPEG'ni yuklaydi. Tartib muhim -
   avval <source>, keyin <img>: <img src> qo'yilishi bilan
   brauzer tanlovni boshlaydi. */
function loadDeferredHeroSlides() {
  document.querySelectorAll('.hero-bg source[data-srcset]').forEach(src => {
    src.srcset = src.dataset.srcset;
    src.removeAttribute('data-srcset');
  });
  document.querySelectorAll('.hero-bg img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}
if (!REDUCED_MOTION) {
  window.addEventListener('load', loadDeferredHeroSlides);
  setTimeout(loadDeferredHeroSlides, 4500); /* zaxira: load kechiksa ham 1-almashinuvgacha */
}

if (heroSlides.length > 1 && !REDUCED_MOTION) {
  let heroIndex = 0;
  setInterval(() => {
    heroSlides[heroIndex].classList.remove('active');
    heroIndex = (heroIndex + 1) % heroSlides.length;
    heroSlides[heroIndex].classList.add('active');
  }, 6000);
}

/* ---------------- Doimiy animatsiyalar: faqat ekranda ko'ringanda ----------------
   Shimmer/glow kabi cheksiz animatsiyalar element ko'rinmasa pauza qilinadi
   (CSS'dagi .anim-live qoidalari bilan juft ishlaydi) */
/* Bu observer faqat animatsiyalarni pauzadan chiqaradi. Yo'q bo'lsa
   ular pauzada qoladi - kontent yo'qolmaydi, zaif qurilmada hatto
   foydali. Shuning uchun `else` shoxi kerak emas. */
if ('IntersectionObserver' in window) {
  const animObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('anim-live', entry.isIntersecting);
    });
  }, { rootMargin: '80px' });
  /* Cheksiz animatsiyali barcha bloklar: ikkita marquee-lenta, hero
     (Ken Burns + grafik nuqtasi + CTA pulsi), footer suvbelgisi,
     navy tarif kartasi va taqqoslash jadvali nuri. */
  document.querySelectorAll(
    '.footer-mega, .tariff-main, .compare-wrap, .hero, .txt-marquee, .rates-bar'
  ).forEach(el => animObserver.observe(el));
}

/* ---------------- Mijozlar fikri: avtomatik karusel ---------------- */
const revTrack = document.getElementById('reviewsTrack');
const revCarouselEl = document.getElementById('reviewsCarousel');
let revIndex = 0;
let revTimer = null;
let revCount = 0;

function goToReview(i) {
  if (!revTrack || !revCount) return;
  revIndex = ((i % revCount) + revCount) % revCount;
  revTrack.style.transform = 'translateX(-' + (revIndex * 100) + '%)';
  const dotsWrap = document.getElementById('revDots');
  if (dotsWrap) {
    Array.prototype.forEach.call(dotsWrap.children, (d, n) => {
      d.classList.toggle('active', n === revIndex);
    });
  }
}

/* Foydalanuvchi karuselga tegsa - avtomatik almashinuv butunlay
   to'xtaydi. Sichqoncha bilan `:hover` pauza beradi, sensorli
   ekranda esa hover yo'q: odam sharhni o'qiyotganda karusel uni
   o'g'irlab ketardi va to'xtatishning iloji yo'q edi. Endi
   birinchi teginish/bosishdan keyin boshqaruv odamda qoladi. */
let revUserTook = false;

function restartRevTimer() {
  clearInterval(revTimer);
  if (REDUCED_MOTION || revUserTook) return;
  revTimer = setInterval(() => goToReview(revIndex + 1), 6000);
}

function revStopAuto() {
  revUserTook = true;
  clearInterval(revTimer);
  revTimer = null;
}

if (revTrack && revCarouselEl) {
  revCount = revTrack.children.length;
  const dotsWrap = document.getElementById('revDots');
  const dict0 = translations[currentLang] || translations.uz;

  for (let i = 0; i < revCount; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'rev-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', (dict0['reviews.goto'] || 'Fikr') + ' ' + (i + 1));
    dot.addEventListener('click', () => { revStopAuto(); goToReview(i); });
    dotsWrap.appendChild(dot);
  }

  /* Sensorli ekranda karuselga teginishning o'zi avtomatikani
     to'xtatadi - odam o'qishga ulgurmay slayd almashib ketmasin */
  revCarouselEl.addEventListener('pointerdown', revStopAuto, { passive: true });

  const prevBtn = document.getElementById('revPrev');
  const nextBtn = document.getElementById('revNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { revStopAuto(); goToReview(revIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', () => { revStopAuto(); goToReview(revIndex + 1); });

  /* Sichqoncha ustida turganda pauza */
  revCarouselEl.addEventListener('mouseenter', () => clearInterval(revTimer));
  revCarouselEl.addEventListener('mouseleave', restartRevTimer);

  /* Klaviatura fokusi karusel ichida bo'lganda ham pauza */
  revCarouselEl.addEventListener('focusin', () => clearInterval(revTimer));
  revCarouselEl.addEventListener('focusout', e => {
    if (!revCarouselEl.contains(e.relatedTarget)) restartRevTimer();
  });

  /* Barmoq bilan surish (touch swipe) */
  let touchX = 0;
  let touchY = 0;
  revCarouselEl.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    clearInterval(revTimer);
  }, { passive: true });
  revCarouselEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) {
      goToReview(revIndex + (dx < 0 ? 1 : -1));
    }
    restartRevTimer();
  }, { passive: true });

  restartRevTimer();
}

/* ---------------- Back-to-top tugmasi ---------------- */
const backTopBtn = document.getElementById('backTop');
if (backTopBtn) {
  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  });
}

/* ---------------- Past qatlam: forma va footer ustida bo'shatiladi ----------------
   Mobil ekranda yopishqoq panelning oltin "Ariza qoldirish" tugmasi
   formaning haqiqiy "Ariza yuborish" tugmasidan 20px pastda turadi
   (bir xil rang, o'xshash matn), suzuvchi doiralar esa footer
   havolalarini bosib qoladi. Bo'lim ko'rinsa - qatlam ketadi.
   Sinflar body'da, ko'rinish qoidalari CSS'da (faqat <=720px). */
if ('IntersectionObserver' in window) {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    new IntersectionObserver(entries => {
      document.body.classList.toggle('at-contact', entries[0].isIntersecting);
    }, { rootMargin: '0px 0px -30% 0px' }).observe(contactSection);
  }

  const footerSection = document.querySelector('.footer');
  if (footerSection) {
    new IntersectionObserver(entries => {
      document.body.classList.toggle('at-footer', entries[0].isIntersecting);
    }, { threshold: 0 }).observe(footerSection);
  }
}

/* ---------------- Xarita: teginib faollashtiriladi ----------------
   Aks holda xarita ustidan boshlangan barmoq harakati sahifani
   emas, Google Maps'ni suradi ("scroll tutqichi") */
const mapWrap = document.querySelector('.map');
if (mapWrap) {
  mapWrap.addEventListener('click', () => mapWrap.classList.add('map-live'));
}

/* ---------------- Jamoa suratlari: yengil 3D tilt ---------------- */
if (window.matchMedia('(pointer: fine)').matches && !REDUCED_MOTION) {
  document.querySelectorAll('.person-photo').forEach(photo => {
    photo.addEventListener('mousemove', e => {
      const r = photo.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
      photo.style.transform = 'perspective(600px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    });
    photo.addEventListener('mouseleave', () => { photo.style.transform = ''; });
  });
}

/* ---------------- Magnit tugmalar ---------------- */
if (window.matchMedia('(pointer: fine)').matches && !REDUCED_MOTION) {
  document.querySelectorAll('.hero-actions .btn, .cta-actions .btn, .btn-submit').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      btn.style.transform = 'translate(' + (dx * 7) + 'px,' + (dy * 5 - 2) + 'px)';
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ---------------- Boshlang'ich holat ---------------- */
document.getElementById('year').textContent = new Date().getFullYear();

let savedLang = 'uz';
try { savedLang = localStorage.getItem('finbalans-lang') || 'uz'; } catch (e) { /* xotira bloklangan */ }
setLanguage(savedLang);


/* =========================================================
   MOBIL KARUSELLAR — chet belgisi va nuqtalar
   ---------------------------------------------------------
   Telefonda ikkita gorizontal suriladigan qator bor: hero
   ishonch chiplari va tarif kartalari. Ikkalasida ham oxirgi
   element ekran chetida kesilib turadi. Kesilgan element
   "sayt buzilgan" degan taassurot qoldiradi — shuning uchun:

   - data-scroll="start|mid|end" atributi qo'yiladi, CSS esa
     boshi/o'rtasida o'ng chetga soya (mask) beradi: "davomi bor"
   - tariflarga nuqtalar qo'shiladi: uchta tarifdan qaysi
     birida turgani ko'rinadi va bosib o'tish mumkin

   Hammasi progressiv: JS ishlamasa qator oddiy suriladi.
   ========================================================= */
(function () {
  /* ---------- Chet holati: start / mid / end ---------- */
  function markEdges(el) {
    const max = el.scrollWidth - el.clientWidth;
    /* Surish imkoni yo'q (hammasi sig'gan) — soya ham kerak emas */
    if (max <= 4) { el.removeAttribute('data-scroll'); return; }
    const x = el.scrollLeft;
    el.setAttribute('data-scroll', x <= 4 ? 'start' : x >= max - 4 ? 'end' : 'mid');
  }

  function watchEdges(el) {
    if (!el) return;
    markEdges(el);
    el.addEventListener('scroll', () => markEdges(el), { passive: true });
    window.addEventListener('resize', () => markEdges(el), { passive: true });
    /* Til almashganda matn uzunligi (va scrollWidth) o'zgaradi */
    if ('ResizeObserver' in window) new ResizeObserver(() => markEdges(el)).observe(el);
  }

  watchEdges(document.querySelector('.hero-chips'));

  /* ---------- Tarif karuseli + nuqtalar ---------- */
  const tariffs = document.querySelector('.tariffs');
  if (!tariffs) return;
  watchEdges(tariffs);

  const cards = [...tariffs.querySelectorAll('.tariff')];
  if (cards.length < 2) return;

  const dots = document.createElement('div');
  dots.className = 'tariffs-dots';
  /* Nuqtalar - ko'rish uchun qulaylik, mazmun kartalarda.
     Skrinriderga takroriy ro'yxat bo'lib eshitilmasligi kerak. */
  dots.setAttribute('aria-hidden', 'true');

  cards.forEach((card, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tariffs-dot';
    b.tabIndex = -1;
    b.addEventListener('click', () => {
      /* scroll-padding-inline: 24px hisobga olinadi */
      tariffs.scrollTo({
        left: card.offsetLeft - tariffs.offsetLeft - 24,
        behavior: REDUCED_MOTION ? 'auto' : 'smooth',
      });
    });
    dots.appendChild(b);
    if (i === 0) b.setAttribute('aria-current', 'true');
  });
  tariffs.after(dots);

  const dotList = [...dots.children];

  /* Markazga eng yaqin karta faol deb belgilanadi: yarmigacha
     surilganda ham nuqta to'g'ri kartani ko'rsatadi */
  function syncDots() {
    const mid = tariffs.scrollLeft + tariffs.clientWidth / 2;
    let best = 0, bestD = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - tariffs.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    dotList.forEach((d, i) => {
      if (i === best) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  }

  let raf = 0;
  tariffs.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; syncDots(); });
  }, { passive: true });
  syncDots();
})();


/* =========================================================
   TAQQOSLASH JADVALI — katak yorliqlari
   ---------------------------------------------------------
   Telefonda jadval kartalarga bo'linadi (CSS'da) va har bir
   katak ustida o'z ustunining nomi turishi kerak: aks holda
   "600 ming - 2,4 mln so'm" qaysi tomonga tegishli ekani
   noma'lum bo'lib qoladi.

   Nomlar HTML'ga qo'lda yozilmaydi - <thead> dan olinadi:
   sayt uch tilda ishlaydi va matnlar admin panelidan ham
   o'zgaradi. MutationObserver o'sha o'zgarishlarni kuzatadi,
   shuning uchun til almashganda yorliqlar o'zi yangilanadi.
   ========================================================= */
(function () {
  const table = document.querySelector('.compare');
  if (!table) return;

  const headCells = [...table.querySelectorAll('thead th')];
  if (headCells.length < 2) return;

  function syncLabels() {
    for (const row of table.querySelectorAll('tbody tr')) {
      /* Katak indeksi <th> ni ham hisoblaydi: birinchi ustun
         qator nomi, keyingilari qiymatlar */
      [...row.children].forEach((cell, i) => {
        if (cell.tagName !== 'TD') return;
        const label = headCells[i];
        if (label) cell.setAttribute('data-label', label.textContent.trim());
      });
    }
  }

  syncLabels();

  const thead = table.querySelector('thead');
  if (thead && 'MutationObserver' in window) {
    new MutationObserver(syncLabels).observe(thead, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }
})();


/* =========================================================
   TINCH REJIMGA AVTOMATIK O'TISH
   ---------------------------------------------------------
   <head> dagi skript qurilmadan so'raydi: xotira, yadrolar,
   ulanish turi, foydalanuvchi sozlamalari. Lekin bu signallar
   hammasini qamramaydi:
     - navigator.deviceMemory Safari da umuman yo'q,
     - telefon kuchli bo'lsa ham fon dasturlari band qilib
       qo'ygan bo'lishi mumkin,
     - eski Android da qiymatlar yolg'on bo'ladi.

   Shuning uchun sahifa ochilgandan keyin ~2 soniya davomida
   haqiqiy kadr oralig'i o'lchanadi. Agar kadrlarning uchdan
   biridan ko'pi 33ms dan uzun bo'lsa (ya'ni 30 kadr/sek dan
   past), sayt o'zi tinch rejimga o'tadi.

   O'lchov faqat bir marta, sahifa ko'rinib turganda va
   requestAnimationFrame ustida - qo'shimcha yuk bermaydi.
   ========================================================= */
(function () {
  const root = document.documentElement;
  if (root.classList.contains('low-power')) return;          /* allaqachon tinch */
  if (!window.requestAnimationFrame || !window.performance) return;

  /* CHEGARALAR ATAYLAB QAT'IY. Birinchi urinishda "kadrlarning
     uchdan biri 33ms dan uzun" deb qo'yilgandi - bu oddiy
     telefonni ham tinch rejimga tushirardi, chunki surish
     paytida qisqa sekinlashuv normal hodisa.
     Endi chegara "sayt haqiqatan ishlatib bo'lmaydigan holatda":
     kadrlarning yarmidan ko'pi 50ms dan uzun, ya'ni barqaror
     20 kadr/sekunddan past. */
  const SAMPLE_MS = 3000;      /* uzoqroq kuzatiladi - tasodifiy sakrash aldamaydi */
  const SLOW_FRAME = 50;       /* 20 kadr/sek chegarasi */
  const SLOW_SHARE = 0.55;     /* yarmidan ko'pi sekin bo'lsagina */
  const MIN_FRAMES = 40;       /* yetarli namuna bo'lmasa qaror qabul qilinmaydi */

  let prev = 0, slow = 0, total = 0, startedAt = 0;

  function tick(t) {
    if (document.hidden) { prev = 0; requestAnimationFrame(tick); return; }
    if (!startedAt) startedAt = t;
    if (prev) {
      const dt = t - prev;
      /* 250ms dan uzun tanaffus - bu kadr emas, sahifa fonda edi
         yoki brauzer boshqa ish bilan band bo'ldi. Hisobga olinmaydi. */
      if (dt < 250) { total++; if (dt > SLOW_FRAME) slow++; }
    }
    prev = t;

    if (t - startedAt < SAMPLE_MS) { requestAnimationFrame(tick); return; }

    if (total >= MIN_FRAMES && slow / total > SLOW_SHARE) {
      root.classList.add('low-power');
      /* Ken Burns va lentalar to'xtaydi - qatlamlar bo'shaydi */
    }
  }

  /* Yuklanish tugagach boshlanadi: yuklash paytidagi tabiiy
     sekinlik qurilmaning aybi emas */
  if (document.readyState === 'complete') requestAnimationFrame(tick);
  else window.addEventListener('load', () => setTimeout(() => requestAnimationFrame(tick), 600));
})();
