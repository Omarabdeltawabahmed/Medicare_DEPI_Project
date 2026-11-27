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
│   ├── chatbot.css     شكل نافذة الشات بوت (مشترك)
│   └── <page>.css      تنسيق كل صفحة
└── js/
    ├── theme.js        تبديل الدارك مود وحفظ الاختيار (مشترك)
    ├── sidebar.js      القائمة الجانبية (مشترك) - عدّل الروابط من مصفوفة LINKS
    ├── chatbot.js      الشات بوت (مشترك) - فيه إعدادات الربط بالـ AI في أول الملف
    └── <page>.js       كود كل صفحة
```

- لإضافة/حذف عنصر من القائمة: عدّل `LINKS` في `js/sidebar.js` (والترجمة في `TXT`).
- لتعديل ألوان الدارك مود: `css/theme.css` (قسم `html[data-theme="dark"]`).
- كل `<body>` فيه `data-page="..."` عشان القائمة تعرف الصفحة الحالية.
- شغّل `index.html` مباشرة أو من Live Server.

## الشات بوت (واجهة فقط حالياً)
- زرار عائم في كل الصفحات، والمحادثة بتفضل محفوظة وأنت بتنقل بين الصفحات.
- حالياً بيرد **ردود تجريبية** (`mode: "mock"`) وعليه بادج "Demo".
- لربطه بالـ AI الحقيقي افتح `js/chatbot.js` وعدّل `CONFIG`:
  `mode: "api"` و `apiBase` = عنوان الباك إند. الـ endpoints جاهزة ومطابقة لـ `AIController`:
  `POST /api/ai/clinic-chat` و `POST /api/ai/medicine-info`.
- لازم تفعّل CORS في الباك إند عشان الفرونت يقدر يكلمه.
- لإخفاء الشات من صفحة معينة: حط `data-chat="off"` على `<body>`.
