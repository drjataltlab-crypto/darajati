/* ═══ core.js — الأساس المشترك (نسخة نهائية مصححة) ═══ */

window.addEventListener('error', function(e) {
  var d = document.getElementById('errbar');
  if (d) {
    d.style.display = 'block';
    d.textContent = 'ERROR line ' + e.lineno + ': ' + e.message;
  }
});

// ═══ المتغيرات العامة ═══
// ✅ تم إصلاح نقص الرقم ٣ هنا
var SUBJECTS = ['التربية الإسلامية', 'اللغة العربية', 'اللغة الانكليزية', 'الرياضيات', 'الاجتماعيات', 'العلوم', 'الفنية', 'الرياضة'];
var AR = '٠١٢٣٤٥٦٧٨٩'; 

var THEMES = {
  dash: ['#1D4ED8', '#DBEAFE'],
  res: ['#B45309', '#FDE68A'],
  team: ['#047857', '#A7F3D0'],
  entry: ['#7E22CE', '#DDD6FE'],
  studs: ['#0E7490', '#A5F3FC'],
  keys: ['#BE123C', '#FECDD3'],
  set: ['#475569', '#E2E8F0']
};

var AV = ['#1D4ED8', '#7E22CE', '#047857', '#B45309', '#BE123C', '#0E7490', '#DB2777', '#65A30D'];
var Pages = {};
var ADM = { teachers: [], tv: null, res: null };
var ROLE = '', toastT, _yes = null;

// ═══ الدوال الأساسية ═══

function arNum(x) {
  if (x === null || x === undefined || x === '') return '—';
  return String(x).replace(/\d/g, function(d) { return AR[d]; });
}

function $(s) {
  if (!s) return null;
  return document.querySelector(s);
}

function $$(s) {
  return document.querySelectorAll(s);
}

function url() {
  return localStorage.getItem('d_url') || (typeof SERVER_URL !== 'undefined' ? SERVER_URL : '');
}

function key() {
  return localStorage.getItem('d_key') || '';
}

function registerPage(id, obj) {
  Pages[id] = obj;
}

function go(id) {
  $$('.screen').forEach(function(s) { s.classList.remove('active'); });
  var el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function toast(m, t) {
  var e = $('#toast');
  if (!e) return;
  e.textContent = m;
  e.className = 'toast show' + (t === 'err' ? ' err' : t === 'ok' ? ' ok' : '');
  clearTimeout(toastT);
  toastT = setTimeout(function() { e.className = 'toast'; }, 3200);
}

function hideModal(id) {
  var el = $('#' + id);
  if (el) el.classList.remove('show');
}

function confirmDlg(m, f, t) {
  var title = $('#cfTitle');
  var msg = $('#cfMsg');
  if (title) title.textContent = t || 'تأكيد';
  if (msg) msg.textContent = m;
  _yes = f;
  var ovl = $('#confirmOvl');
  if (ovl) ovl.classList.add('show');
}

function confirmYes() {
  hideModal('confirmOvl');
  if (_yes) _yes();
  _yes = null;
}

function esc(s) {
  return String(s === null || s === undefined ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escA(s) {
  return esc(s).replace(/"/g, '&quot;');
}

function ago(ms) {
  if (!ms) return '';
  var s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return 'الآن';
  var m = Math.floor(s / 60);
  if (m < 60) return 'قبل ' + arNum(m) + ' د';
  var h = Math.floor(m / 60);
  if (h < 24) return 'قبل ' + arNum(h) + ' س';
  var d = Math.floor(h / 24);
  return d < 30 ? 'قبل ' + arNum(d) + ' يوم' : new Date(ms).toLocaleDateString('ar');
}

function fmtDate(ms) {
  return new Date(ms).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' });
}

function copyText(s) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(s).then(function() { toast('✓ تم النسخ', 'ok'); });
  } else {
    var ta = document.createElement('textarea');
    ta.value = s;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    toast('✓ تم النسخ', 'ok');
  }
}

function shareWa(code, name) {
  window.open('https://wa.me/?text=' + encodeURIComponent('مرحباً ' + (name || 'أستاذي') + ' 👋\nكودك في تطبيق «درجاتي»:\n\n🔑 ' + code + '\n\nثبّت التطبيق وأدخل هذا الكود.'), '_blank');
}

function api(p, ms) {
  var serverUrl = url();
  if (!serverUrl) return Promise.reject(new Error('no-url'));
  
  var c = new AbortController();
  var t = setTimeout(function() { c.abort(); }, ms || 30000);
  
  return fetch(serverUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(p),
    signal: c.signal,
    redirect: 'follow',  // ✅ إضافة مهمة للتعامل مع redirect
    mode: 'cors'         // ✅ إضافة مهمة
  }).then(function(r) { 
    return r.json(); 
  }).finally(function() { 
    clearTimeout(t); 
  });
}

function getStudyYear() {
  return localStorage.getItem('study_year') || '٢٠٢٥ - ٢٠٢٦';
}

function getPrintCfg() {
  var g = function(k, d) { return localStorage.getItem(k) || d; };
  return {
    schoolColor: g('pc_school_color', '#1E40AF'),
    schoolSize: g('pc_school_size', '22'),
    schoolAlign: g('pc_school_align', 'center'),
    titleColor: g('pc_title_color', '#1E40AF'),
    titleSize: g('pc_title_size', '26'),
    subColor: g('pc_sub_color', '#B45309'),
    subSize: g('pc_sub_size', '17'),
    yearColor: g('pc_year_color', '#475569'),
    yearSize: g('pc_year_size', '15'),
    logoSize: g('pc_logo_size', '110'),
    studentAlign: g('pc_student_align', 'right'),
    classAlign: g('pc_class_align', 'center'),
    dateAlign: g('pc_date_align', 'left'),
    tableFontSize: g('pc_table_font', '13'),
    cellHeight: g('pc_cell_height', '32'),
    cellPad: g('pc_cell_pad', '5'),
    subjectWidth: g('pc_subject_width', '140'),
    guideAlign: g('pc_guide_align', 'right'),
    principalAlign: g('pc_principal_align', 'left'),
    signFontSize: g('pc_sign_font', '15')
  };
}

function parseCls(cls) {
  cls = String(cls || '').trim();
  var i = cls.lastIndexOf(' ');
  if (i === -1) return { grade: cls, section: '' };
  return { grade: cls.slice(0, i).trim(), section: cls.slice(i + 1).trim() };
}

function calcHalfResult(bySub) {
  var graded = 0, failedNames = [];
  SUBJECTS.forEach(function(s) {
    var r = bySub[s]; if (!r) return;
    var v = (r.half != null) ? r.half : ((r.a1 != null) ? r.a1 : null);
    if (v == null) return;
    graded++;
    if (v < (r.max || 100) / 2) failedNames.push(s);
  });
  if (!graded) return { text: '—', cls: 'none' };
  if (failedNames.length === 0) return { text: 'ناجح', cls: 'pass' };
  if (failedNames.length <= 2) return { text: 'مكمل من ' + failedNames.join(' و '), cls: 'warn' };
  return { text: 'راسب', cls: 'fail' };
}

function calcFinalResult(bySub) {
  var graded = 0, failedNames = [];
  SUBJECTS.forEach(function(s) {
    var r = bySub[s]; if (!r) return;
    if (r.final == null) return;
    graded++;
    if (r.final < (r.max || 100) / 2) failedNames.push(s);
  });
  if (!graded) return { text: '—', cls: 'none' };
  if (failedNames.length === 0) return { text: 'ناجح', cls: 'pass' };
  if (failedNames.length <= 2) return { text: 'مكمل من ' + failedNames.join(' و '), cls: 'warn' };
  return { text: 'راسب', cls: 'fail' };
}

// ═══ دوال الطباعة ═══

function buildOneResult(rows, compact, hideSignatures) {
  var bySub = {};
  rows.forEach(function(r) { bySub[r.subject] = r; });
  var halfRes = calcHalfResult(bySub);
  var finalRes = calcFinalResult(bySub);
  var C = getPrintCfg();

  var schoolName = localStorage.getItem('school_name') || 'مدرسة المنهل الابتدائية';
  var schoolLogo = localStorage.getItem('school_logo') || '';
  var guideName = localStorage.getItem('guide_name') || '....................';
  var principalName = localStorage.getItem('principal_name') || '....................';
  var studyYear = getStudyYear();
  var name = rows.length ? rows[0].name : '';
  var grade = rows.length ? rows[0].grade : '';
  var section = rows.length ? rows[0].section : '';

  var scale = compact ? 0.78 : 1;
  var schoolSz = Math.round(parseInt(C.schoolSize) * scale);
  var titleSz = Math.round(parseInt(C.titleSize) * scale);
  var subSz = Math.round(parseInt(C.subSize) * scale);
  var yearSz = Math.round(parseInt(C.yearSize) * scale);
  var logoSz = Math.round(parseInt(C.logoSize) * scale);
  var tableFs = Math.round(parseInt(C.tableFontSize) * scale);
  var cellH = Math.round(parseInt(C.cellHeight) * scale);
  var cellPd = Math.round(parseInt(C.cellPad) * scale);
  var subjW = Math.round(parseInt(C.subjectWidth) * scale);
  var signFs = Math.round(parseInt(C.signFontSize) * scale);

  var bord = '#0F172A';
  var printWidth = compact ? '180mm' : '190mm';
  var printPadding = compact ? '2mm' : '5mm';

  var h = '<div style="font-family:Tajawal,Arial,sans-serif;width:' + printWidth + ';box-sizing:border-box;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0 auto;padding:' + printPadding + '">';

  var headMargin = compact ? '5px' : '10px';
  var headPad = compact ? '4px' : '8px';
  h += '<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px double ' + C.schoolColor + ';padding-bottom:' + headPad + ';margin-bottom:' + headMargin + ';gap:8px">';
  h += '<div style="flex:1;text-align:' + C.schoolAlign + ';font-weight:900;font-size:' + schoolSz + 'px;color:' + C.schoolColor + ';line-height:1.3;word-break:break-word">ادارة<br>' + esc(schoolName) + '<br>للبنين</div>';
  h += '<div style="flex:1;text-align:center">';
  h += '<div style="font-size:' + titleSz + 'px;font-weight:900;color:' + C.titleColor + '">بطاقة درجات</div>';
  h += '<div style="font-size:' + subSz + 'px;font-weight:800;color:' + C.subColor + ';margin-top:1px">الصف الخامس والسادس الابتدائي</div>';
  h += '<div style="font-size:' + yearSz + 'px;font-weight:700;color:' + C.yearColor + ';margin-top:1px">للعام الدراسي ' + esc(studyYear) + '</div>';
  h += '</div>';
  h += '<div style="flex:1;text-align:center">';
  if (schoolLogo) {
    h += '<img src="' + schoolLogo + '" style="width:' + logoSz + 'px;height:' + logoSz + 'px;object-fit:contain;border:2px solid ' + C.schoolColor + ';border-radius:8px">';
  } else {
    h += '<div style="width:' + logoSz + 'px;height:' + logoSz + 'px;border:2px dashed #CBD5E1;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:9px;margin:0 auto">شعار<br>المدرسة</div>';
  }
  h += '</div></div>';

  var infoMargin = compact ? '4px' : '10px';
  var infoPad = compact ? '4px 8px' : '8px 12px';
  var infoFs = compact ? '12px' : '16px';
  var nameGradeFs = compact ? '13px' : '18px';

  h += '<div style="display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);padding:' + infoPad + ';border-radius:6px;margin-bottom:' + infoMargin + ';border:1px solid #BFDBFE;flex-wrap:wrap;gap:4px">';
  h += '<div style="flex:1;min-width:130px;text-align:' + C.studentAlign + ';font-size:' + infoFs + ';font-weight:800"><b style="color:#1E40AF">التلميذ:</b> <span style="font-weight:900;color:#0F172A;font-size:' + nameGradeFs + '">' + esc(name) + '</span></div>';
  h += '<div style="flex:1;min-width:130px;text-align:' + C.classAlign + ';font-size:' + infoFs + ';font-weight:800"><b style="color:#1E40AF">الصف والشعبة:</b> <span style="font-weight:900;color:#0F172A;font-size:' + nameGradeFs + '">' + esc(grade || '—') + ' ' + esc(section || '') + '</span></div>';
  h += '<div style="flex:1;min-width:110px;text-align:' + C.dateAlign + ';font-size:11px;font-weight:700"><b style="color:#1E40AF">التاريخ:</b> <span style="font-weight:800">' + new Date().toLocaleDateString('ar') + '</span></div>';
  h += '</div>';

  h += '<table style="width:100%;border-collapse:collapse;border:2px solid ' + bord + ';font-size:' + tableFs + 'px;box-sizing:border-box">';

  var thStyle = 'border:1px solid ' + bord + ';color:#fff;padding:' + cellPd + 'px 1px;font-size:' + (tableFs) + 'px;font-weight:bold;text-align:center;vertical-align:middle';
  h += '<thead>';
  h += '<tr>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#1E40AF,#2563EB)" rowspan="2">ت</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#1E40AF,#2563EB)" rowspan="2">الدروس</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#1D4ED8,#3B82F6)" colspan="3">الفصل الأول</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#B45309,#D97706)" rowspan="2">معدل ف١</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#1E40AF,#2563EB)" rowspan="2">نصف السنة</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#0E7490,#06B6D4)" colspan="2">الفصل الثاني</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#B45309,#D97706)" rowspan="2">معدل ف٢</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#B45309,#D97706)" rowspan="2">السعي السنوي</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#1E40AF,#2563EB)" rowspan="2">نهاية السنة</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#BE123C,#E11D48)" rowspan="2">الدرجة النهائية</th>'
    + '</tr>';

  h += '<tr>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#1D4ED8,#3B82F6)">ت</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#1D4ED8,#3B82F6)">ت٢</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#1D4ED8,#3B82F6)">ك١</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#0E7490,#06B6D4)">آذار</th>'
    + '<th style="' + thStyle + ';background:linear-gradient(135deg,#0E7490,#06B6D4)">نيسان</th>'
    + '</tr></thead><tbody>';

  var tdStyle = 'border:1px solid ' + bord + ';padding:' + cellPd + 'px 1px;text-align:center;font-size:' + (tableFs + 2) + 'px;font-weight:900;background:#fff;min-height:' + cellH + 'px';
  var tdnStyle = 'border:1px solid ' + bord + ';padding:' + cellPd + 'px 3px;text-align:right;font-size:' + (tableFs + 3) + 'px;font-weight:900;background:#fff;width:' + subjW + 'px;min-height:' + cellH + 'px';

  SUBJECTS.forEach(function(s, i) {
    var r = bySub[s];
    function td(v) { return (v == null || v === '') ? '<td style="' + tdStyle + ';color:#CBD5E1">—</td>' : '<td style="' + tdStyle + '">' + arNum(v) + '</td>'; }
    var fin = r && r.final != null;
    var finStyle = tdStyle + (fin ? (r.final >= (r.max || 100) / 2 ? ';color:#047857;font-weight:bold;background:#D1FAE5' : ';color:#DC2626;font-weight:bold;background:#FEE2E2') : '');
    h += '<tr style="' + (i % 2 === 1 ? 'background:#F8FAFC' : '') + '">'
      + '<td style="' + tdStyle + '">' + arNum(i + 1) + '</td>'
      + '<td style="' + tdnStyle + '">' + s + '</td>'
      + td(r ? r.m1 : null) + td(r ? r.m2 : null) + td(r ? r.m3 : null)
      + '<td style="' + tdStyle + ';background:#FEF3C7;font-weight:bold;color:#B45309">' + (r ? arNum(r.a1) : '—') + '</td>'
      + td(r ? r.half : null) + td(r ? r.m4 : null) + td(r ? r.m5 : null)
      + '<td style="' + tdStyle + ';background:#FEF3C7;font-weight:bold;color:#B45309">' + (r ? arNum(r.a2) : '—') + '</td>'
      + '<td style="' + tdStyle + ';background:#FEF3C7;font-weight:bold;color:#B45309">' + (r ? arNum(r.annual) : '—') + '</td>'
      + td(r ? r.exam : null)
      + '<td style="' + finStyle + '">' + (r ? arNum(r.final) : '—') + '</td>'
      + '</tr>';
  });
  h += '</tbody></table>';

  function resSpan(res) {
    var color = res.cls === 'pass' ? '#047857' : res.cls === 'fail' ? '#DC2626' : res.cls === 'warn' ? '#B45309' : '#64748B';
    var bg = res.cls === 'pass' ? '#D1FAE5' : res.cls === 'fail' ? '#FEE2E2' : res.cls === 'warn' ? '#FEF3C7' : '#F1F5F9';
    var rPad = compact ? '2px 6px' : '3px 10px';
    var rFs = compact ? Math.round(tableFs * 0.95) : Math.round(tableFs * 1.05);
    return '<span style="background:' + bg + ';color:' + color + ';padding:' + rPad + ';border-radius:8px;font-weight:900;margin:0 2px;border:2px solid ' + color + ';font-size:' + rFs + 'px">' + res.text + '</span>';
  }
  var resMargin = compact ? '4px' : '10px';
  var resPad = compact ? '4px' : '8px';
  h += '<div style="display:flex;gap:4px;margin-top:' + resMargin + '">';
  h += '<div style="flex:1;background:linear-gradient(135deg,#1E3A8A,#1E40AF);color:#fff;font-weight:900;font-size:' + Math.round(tableFs * 1) + 'px;padding:' + resPad + ';border-radius:6px;text-align:center;border:2px solid #0F172A">';
  h += 'نتيجة نصف السنة: ' + resSpan(halfRes) + '</div>';
  h += '<div style="flex:1;background:linear-gradient(135deg,#1E3A8A,#1E40AF);color:#fff;font-weight:900;font-size:' + Math.round(tableFs * 1) + 'px;padding:' + resPad + ';border-radius:6px;text-align:center;border:2px solid #0F172A">';
  h += 'نتيجة نهاية السنة: ' + resSpan(finalRes) + '</div>';
  h += '</div>';

  if (!hideSignatures) {
    var sigMargin = compact ? '4px' : '20px';
    var sigFs = compact ? '9px' : signFs;
    var sigPad = compact ? '0 2px' : '0 8px';
    h += '<div style="display:flex;justify-content:space-between;margin-top:' + sigMargin + ';padding:' + sigPad + ';font-size:' + sigFs + 'px;font-weight:800;color:#0F172A;flex-wrap:wrap;gap:4px">';
    h += '<div style="flex:1;text-align:' + C.guideAlign + ';min-width:140px;word-break:break-word">مرشد الصف : <span style="color:#1E40AF;font-weight:900">' + esc(guideName) + '</span></div>';
    h += '<div style="flex:1;text-align:' + C.principalAlign + ';min-width:140px;word-break:break-word">مدير المدرسة : <span style="color:#1E40AF;font-weight:900">' + esc(principalName) + '</span></div>';
    h += '</div>';
  }

  h += '</div>';
  return h;
}

function resultTable(rows, opts) {
  opts = opts || {};
  var compact = !!opts.compact;
  var secondRows = opts.secondRows || null;

  if (secondRows && secondRows.length) {
    var h = '<div style="width:180mm;margin:0 auto">';
    h += buildOneResult(rows, true, false);
    h += '<div style="border-top:1px dashed #94A3B8;margin:3px 0"></div>';
    h += buildOneResult(secondRows, true, false);
    h += '</div>';
    return h;
  } else {
    return '<div style="width:190mm;margin:0 auto">' + buildOneResult(rows, false, false) + '</div>';
  }
}

function resultCard(name, grade, section, rows) {
  var finals = rows.map(function(r) { return r.final; }).filter(function(v) { return v != null; });
  var max = rows.length ? rows[0].max || 100 : 100;
  var pass = finals.filter(function(v) { return v >= max / 2; }).length;
  var avg = finals.length ? Math.round(finals.reduce(function(a, b) { return a + b; }, 0) / finals.length) : null;
  var isPass = avg !== null && avg >= max / 2;
  return '<div class="rescard">'
    + '<div class="rc-top"><div class="t">🎓 بطاقة نتيجة التلميذ</div><div class="y">السنة الدراسية ' + esc(getStudyYear()) + '</div></div>'
    + '<div class="rc-info"><span>التلميذ: <b>' + esc(name) + '</b></span>'
    + (grade ? '<span>الصف: <b>' + esc(grade) + ' ' + esc(section || '') + '</b></span>' : '')
    + '<span>المعدل العام: <b>' + (avg !== null ? arNum(avg) : '—') + '</b></span>'
    + '<span>ناجح في: <b>' + arNum(pass) + '</b> من <b>' + arNum(rows.length) + '</b></span>'
    + (avg !== null ? '<span class="verdict ' + (isPass ? 'pass' : 'fail') + '">' + (isPass ? 'ناجح ✔' : 'راسب ✘') + '</span>' : '')
    + '</div>'
    + '<div class="rc-body" style="background:#E2E8F0;padding:20px;overflow-x:auto">' + resultTable(rows) + '</div>'
    + '</div>';
}

function downloadXLS(filename, title, tablesHTML) {
  var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" dir="rtl"><head><meta charset="utf-8">'
    + '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>الدرجات</x:Name><x:WorksheetOptions><x:DisplayRightToLeft/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->'
    + '</head><body><h2 style="font-family:Tahoma;color:#1E40AF">' + title + '</h2>' + tablesHTML + '</body></html>';
  var blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename + '.xls';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 5000);
  toast('✓ تم التنزيل — افتحه في Excel', 'ok');
}

function printWin(html) {
  var old = document.getElementById('printFrame');
  if (old) old.remove();
  var f = document.createElement('iframe');
  f.id = 'printFrame';
  f.style.position = 'fixed';
  f.style.left = '-10000px';
  f.style.width = '0';
  f.style.height = '0';
  f.style.border = '0';
  document.body.appendChild(f);
  var doc = f.contentWindow.document;
  doc.open();
  doc.write('<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>طباعة</title>'
    + '<style>'
    + '@page{size:A4;margin:3mm}'
    + '*{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;box-sizing:border-box}'
    + 'html,body{margin:0;padding:0}'
    + 'body{font-family:Tajawal,Arial,sans-serif}'
    + 'table{page-break-inside:avoid;width:100%;border-collapse:collapse}'
    + '</style>'
    + '</head><body>' + html + '</body></html>');
  doc.close();
  setTimeout(function() {
    try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { }
  }, 600);
}

// ═══ دوال تسجيل الدخول والإدارة ═══

function adminLogin() {
  var k = $('#keyIn').value.trim();
  if (!k) { toast('أدخل كلمة المرور', 'err'); return; }
  
  var serverUrl = url();
  if (!serverUrl) { toast('⚠️ رابط الخادم مفقود في config.js', 'err'); return; }
  
  var btn = $('#loginBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ تحقق...'; }
  
  api({ action: 'adminLogin', key: k }, 20000).then(function(r) {
    if (!r.ok) { toast('❌ ' + r.error, 'err'); return; }
    ROLE = r.role;
    localStorage.setItem('d_key', k);
    localStorage.setItem('d_admin', ROLE);
    enterAdmin();
  }).catch(function(err) { 
    // ✅ تم تحسين رسالة الخطأ لتظهر السبب الحقيقي
    console.error('❌ فشل الاتصال بالخادم:', err); 
    var msg = 'تعذر الاتصال بالخادم';
    if (err.message === 'no-url') msg = 'رابط الخادم غير موجود في config.js';
    else if (err.name === 'AbortError') msg = 'انتهت مهلة الاتصال (الخادم بطيء)';
    else if (err.message.includes('Failed to fetch')) msg = 'فشل الاتصال: تحقق من الإنترنت أو أن المتصفح يحظر الطلب';
    toast(msg, 'err'); 
  }).finally(function() {
    if (btn) { btn.disabled = false; btn.textContent = 'دخول'; }
  });
}

function enterAdmin() {
  ROLE = localStorage.getItem('d_admin') || '';
  if (!ROLE) { go('s-login'); return; }
  var urlEl = $('#setUrl');
  if (urlEl) urlEl.value = url();
  fillSubjectSelects();
  applyRole();
  go('s-main');
  adminTab('dash');
  setInterval(function() {
    var dashTab = $('#tab-dash');
    if (dashTab && !dashTab.hidden && Pages.dash && Pages.dash.silent) Pages.dash.silent();
  }, 60000);
}

function fillSubjectSelects() {
  var opts = SUBJECTS.map(function(s) { return '<option>' + s + '</option>'; }).join('');
  var nt = $('#ntSub'); if (nt) nt.innerHTML = opts;
  var ed = $('#edSub'); if (ed) ed.innerHTML = opts;
}

function applyRole() {
  var dev = ROLE === 'dev';
  $$('[data-dev]').forEach(function(el) { el.style.display = dev ? '' : 'none'; });
  var rc = $('#roleCard');
  if (rc) {
    rc.className = 'rolecard ' + (dev ? 'dev' : 'mgr');
    var dot = $('#roleDot'); if (dot) dot.textContent = dev ? '🛠️' : '👔';
    var lbl = $('#roleLabel'); if (lbl) lbl.textContent = dev ? 'المطور' : 'المدير';
    var sub = $('#roleSub'); if (sub) sub.textContent = dev ? 'صلاحيات كاملة' : 'عرض الدرجات';
  }
}

function logoutAdmin() {
  confirmDlg('تسجيل الخروج؟', function() {
    localStorage.removeItem('d_admin');
    localStorage.removeItem('d_key');
    ROLE = '';
    go('s-login');
    var ki = $('#keyIn');
    if (ki) ki.value = '';
  }, 'خروج');
}

function refresh() {
  toast('⏳ تحديث...', '');
  if (Pages.dash && Pages.dash.enter) Pages.dash.enter();
}

function adminTab(t) {
  ['dash', 'res', 'team', 'entry', 'studs', 'keys', 'set'].forEach(function(x) {
    var tab = $('#tab-' + x);
    if (tab) tab.hidden = (x !== t);
    $$('[data-tab="' + x + '"]').forEach(function(b) { b.classList.toggle('act', x === t); });
  });
  var th = THEMES[t];
  document.documentElement.style.setProperty('--th', th[0]);
  document.documentElement.style.setProperty('--thb', th[1]);
  document.body.setAttribute('data-page', t);
  var tb = $('#tbTitle');
  if (tb) tb.textContent = { dash: 'نظرة عامة', res: 'نتائج التلاميذ', team: 'المعلمون', entry: 'إدخال إداري', studs: 'التلاميذ', keys: 'كلمات المرور', set: 'الإعدادات' }[t];
  if (Pages[t] && Pages[t].enter) Pages[t].enter();
}

// ═══ التهيئة عند تحميل الصفحة ═══

(function init() {
  try {
    var ki = $('#keyIn');
    if (ki) ki.addEventListener('keydown', function(e) { if (e.key === 'Enter') adminLogin(); });
    if (localStorage.getItem('d_admin')) enterAdmin();
  } catch (e) {
    var d = document.getElementById('errbar');
    if (d) { d.style.display = 'block'; d.textContent = 'INIT ERROR: ' + e.message; }
  }
})();
