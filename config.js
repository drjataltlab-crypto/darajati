/* ═══ config.js — الإعدادات المشتركة مع الألوان ═══
   هذا الملف يخدم جميع الصفحات:
   - index.html (صفحة المعلم)
   - admin.html (لوحة التحكم)
*/

// رابط الخادم (Google Apps Script)
var SERVER_URL = "https://script.google.com/macros/s/AKfycbyZVQkKBJPvx3ewVm77eGUTr_LIsOTZvgVazwXuq5aQiQ4mprAWK_c97ZXrYA9MAc15tA/exec";

// ═══ ألوان المواد ═══
var SUBJECT_COLORS = {
  'التربية الإسلامية': { primary: '#059669', light: '#d1fae5', bg: '#ecfdf5', icon: '🕌' },
  'اللغة العربية':      { primary: '#2563eb', light: '#dbeafe', bg: '#eff6ff', icon: '' },
  'اللغة الانكليزية':   { primary: '#7c3aed', light: '#ede9fe', bg: '#f5f3ff', icon: '🇬🇧' },
  'الرياضيات':          { primary: '#dc2626', light: '#fee2e2', bg: '#fef2f2', icon: '🔢' },
  'الاجتماعيات':        { primary: '#d97706', light: '#fed7aa', bg: '#fffbeb', icon: '🌍' },
  'العلوم':             { primary: '#0891b2', light: '#cffafe', bg: '#ecfeff', icon: '' },
  'الفنية':             { primary: '#db2777', light: '#fbcfe8', bg: '#fdf2f8', icon: '🎨' },
  'الرياضة':            { primary: '#4f46e5', light: '#e0e7ff', bg: '#eef2ff', icon: '⚽' }
};

// ═══ ألوان الأشهر (خلفيات الصفحة) ═══
var MONTH_THEMES = {
  'تشرين الأول':  { gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)', accent: '#d97706', name: 'الخريف الذهبي' },
  'تشرين الثاني': { gradient: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)', accent: '#c2410c', name: 'الخريف الدافئ' },
  'كانون الأول':   { gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)', accent: '#0369a1', name: 'بداية الشتاء' },
  'آذار':         { gradient: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)', accent: '#15803d', name: 'ربيع أخضر' },
  'نيسان':        { gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)', accent: '#be185d', name: 'ربيع مزهر' }
};

// ═══ ألوان الصفوف ══
var CLASS_COLORS = {
  'أ': { color: '#2563eb', bg: '#dbeafe', icon: '️' },
  'ب': { color: '#059669', bg: '#d1fae5', icon: '🅱️' },
  'ج': { color: '#d97706', bg: '#fed7aa', icon: '🇨' },
  'د': { color: '#7c3aed', bg: '#ede9fe', icon: '🇩' }
};

// إعدادات التطبيق
var APP_CONFIG = {
  SERVER_URL: SERVER_URL,
  APP_NAME: "مدرستي",
  APP_VERSION: "2.0.0",
  MONTHS: ['تشرين الأول', 'تشرين الثاني', 'كانون الأول', 'آذار', 'نيسان'],
  STUDY_YEAR: "2026 - 2027",
  SUBJECT_COLORS: SUBJECT_COLORS,
  MONTH_THEMES: MONTH_THEMES,
  CLASS_COLORS: CLASS_COLORS
};
