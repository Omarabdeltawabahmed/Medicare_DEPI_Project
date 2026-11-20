# MediCare Frontend

كل صفحة اتقسمت لـ 3 ملفات منفصلة: HTML و CSS و JS.

```
Medicare_Frontend/
├── index.html      login.html     register.html
├── page2.html      (حجز موعد)
├── page3.html      (بوابة المريض)
├── page4.html      (بوابة الدكتور)
├── page5.html      (لوحة الأدمن)
├── css/
│   ├── theme.css       ألوان الوضع الفاتح/الداكن (مشترك)
│   ├── sidebar.css     شكل القائمة الجانبية (مشترك)
│   └── <page>.css      تنسيق كل صفحة
└── js/
    ├── theme.js        تبديل الدارك مود وحفظ الاختيار (مشترك)
    ├── sidebar.js      القائمة الجانبية (مشترك) - عدّل الروابط من مصفوفة LINKS
    └── <page>.js       كود كل صفحة
```

- لإضافة/حذف عنصر من القائمة: عدّل `LINKS` في `js/sidebar.js` (والترجمة في `TXT`).
- لتعديل ألوان الدارك مود: `css/theme.css` (قسم `html[data-theme="dark"]`).
- كل `<body>` فيه `data-page="..."` عشان القائمة تعرف الصفحة الحالية.
- شغّل `index.html` مباشرة أو من Live Server.
