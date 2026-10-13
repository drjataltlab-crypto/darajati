/* ═══ page-dash.js — الصفحة الرئيسية (محدث + منع الكاش) ═══ */

// ✅ منع الكاش - إضافة timestamp فريد
var CACHE_BUSTER = Date.now();

window.DASH_TEACHERS = [];

registerPage('dash', {
  enter: function() { 
    CACHE_BUSTER = Date.now(); // تحديث timestamp عند الدخول
    loadDashData(); 
  },
  silent: function() { 
    CACHE_BUSTER = Date.now();
    loadDashData(true); 
  }
});

/* ═══ التصميم ═══ */
(function(){
  if(document.getElementById('dashProStyles')) return;
  var s = document.createElement('style'); 
  s.id = 'dashProStyles';
  s.textContent = 
  '#dashKpi{margin-bottom:20px;width:100%}'+
  
  /* شريط الإحصائيات الأفقي - بعرض الصفحة الكامل */
  '#dashKpi .stats-bar{display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;align-items:stretch !important;width:100% !important;gap:14px !important;padding:18px 22px !important;border-radius:18px;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;box-shadow:0 8px 24px rgba(15,23,42,.15);justify-content:space-between !important}'+
  '#dashKpi .stats-bar .stat-item{display:flex !important;align-items:center !important;gap:10px !important;padding:12px 18px !important;background:rgba(255,255,255,.1) !important;border-radius:12px !important;border:1px solid rgba(255,255,255,.15) !important;backdrop-filter:blur(6px) !important;flex:1 !important;min-width:140px !important;white-space:nowrap !important}'+
  '#dashKpi .stats-bar .stat-icon{font-size:26px !important;width:42px !important;height:42px !important;display:grid !important;place-items:center !important;background:rgba(255,255,255,.15) !important;border-radius:10px !important}'+
  '#dashKpi .stats-bar .stat-info{display:flex !important;flex-direction:column !important}'+
  '#dashKpi .stats-bar .stat-num{font-size:22px !important;font-weight:900 !important;line-height:1 !important}'+
  '#dashKpi .stats-bar .stat-lbl{font-size:11px !important;opacity:.85 !important;font-weight:700 !important;margin-top:3px !important}'+
  '#dashKpi .stats-bar .progress-wrap{flex:1.5 !important;min-width:200px !important;padding:12px 16px !important;background:rgba(255,255,255,.1) !important;border-radius:12px !important;border:1px solid rgba(255,255,255,.15) !important}'+
  '#dashKpi .stats-bar .progress-top{display:flex !important;justify-content:space-between !important;font-size:11px !important;font-weight:700 !important;margin-bottom:6px !important;opacity:.9 !important}'+
  '#dashKpi .stats-bar .progress-track{height:10px !important;background:rgba(255,255,255,.15) !important;border-radius:99px !important;overflow:hidden !important}'+
  '#dashKpi .stats-bar .progress-fill{height:100% !important;background:linear-gradient(90deg,#34d399,#10b981) !important;border-radius:99px !important;transition:width .6s ease !important}'+
  '#dashKpi .health-badge{padding:10px 16px !important;border:1px solid rgba(255,255,255,.25) !important;background:rgba(255,255,255,.12) !important;border-radius:999px !important;font-size:12px !important;font-weight:800 !important;display:flex !important;align-items:center !important;gap:7px !important;white-space:nowrap !important;flex-shrink:0 !important}'+
  '#dashKpi .health-dot{display:inline-block !important;width:9px !important;height:9px !important;border-radius:50% !important;background:#34d399 !important;box-shadow:0 0 0 4px rgba(52,211,153,.2) !important;animation:pulse 2s infinite !important}'+
  '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}'+
  
  /* بطاقات المعلمين */
  '#dashList .dash-pro-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:10px 0 16px;flex-wrap:wrap}'+
  '#dashList .dash-pro-title{font-size:22px;font-weight:900;color:#0f172a}'+
  '#dashList .dash-pro-sub{margin-top:4px;font-size:13px;color:#64748b}'+
  '#dashList .dash-pro-count{padding:8px 14px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:900;white-space:nowrap}'+
  '#dashList .dash-pro-teachers{display:grid;grid-template-columns:1fr;gap:16px}'+
  '#dashList .dash-pro-teacher{position:relative;overflow:hidden;border-radius:22px;padding:22px;box-shadow:0 10px 30px rgba(15,23,42,.12);transition:.25s;color:#fff}'+
  '#dashList .dash-pro-teacher:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(0,0,0,.18)}'+
  '#dashList .dash-pro-top{display:flex;align-items:center;gap:14px;margin-bottom:14px}'+
  '#dashList .dash-pro-avatar{width:64px;height:64px;display:grid;place-items:center;border-radius:18px;font-size:30px;font-weight:900;flex:none;box-shadow:0 6px 16px rgba(0,0,0,.15);background:rgba(255,255,255,.95)}'+
  '#dashList .dash-pro-main{min-width:0;flex:1}'+
  '#dashList .dash-pro-name{font-size:20px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.2);white-space:normal;word-wrap:break-word;overflow-wrap:break-word;line-height:1.3;margin-bottom:4px}'+
  '#dashList .dash-pro-code{font-size:13px;color:rgba(255,255,255,.9);font-family:monospace;font-weight:700}'+
  '#dashList .dash-pro-status{font-size:12px;font-weight:900;padding:8px 14px;border-radius:999px;white-space:nowrap;background:rgba(255,255,255,.95);box-shadow:0 2px 8px rgba(0,0,0,.1)}'+
  '#dashList .dash-pro-status.open{color:#047857}'+
  '#dashList .dash-pro-status.locked{color:#dc2626}'+
  
  /* قسم الشعب والمواد */
  '#dashList .dash-classes-section{background:rgba(255,255,255,.15);border-radius:14px;padding:14px;margin-top:14px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15)}'+
  '#dashList .dash-classes-title{font-size:12px;font-weight:800;color:rgba(255,255,255,.9);margin-bottom:10px;display:flex;align-items:center;gap:6px}'+
  '#dashList .dash-class-item{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,.12);border-radius:10px;margin-bottom:6px;font-size:12px;transition:.2s}'+
  '#dashList .dash-class-item:hover{background:rgba(255,255,255,.2)}'+
  '#dashList .dash-class-item:last-child{margin-bottom:0}'+
  '#dashList .dash-class-name{font-weight:800;color:#fff;display:flex;align-items:center;gap:6px;flex:1;min-width:0}'+
  '#dashList .dash-class-stats{display:flex;gap:10px;align-items:center;flex-shrink:0}'+
  '#dashList .dash-class-stat{font-size:11px;color:rgba(255,255,255,.9);font-weight:700}'+
  '#dashList .dash-class-stat b{color:#fff;font-size:13px;margin-right:3px}'+
  '#dashList .dash-class-open-btn{padding:6px 10px;background:rgba(255,255,255,.9);color:#1d4ed8;border-radius:8px;font-size:10px;font-weight:800;cursor:pointer;border:none;transition:.2s;white-space:nowrap}'+
  '#dashList .dash-class-open-btn:hover{background:#fff;transform:scale(1.05)}'+
  
  /* معلومات إضافية */
  '#dashList .dash-pro-meta{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}'+
  '#dashList .dash-pro-meta-item{padding:7px 12px;border-radius:11px;background:rgba(255,255,255,.2);font-size:12px;color:#fff;font-weight:700;display:flex;align-items:center;gap:5px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15)}'+
  
  /* الإحصائيات السفلية */
  '#dashList .dash-pro-info{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.25)}'+
  '#dashList .dash-pro-info-item{text-align:center}'+
  '#dashList .dash-pro-info-item .lbl{font-size:10px;color:rgba(255,255,255,.85);font-weight:700;margin-bottom:4px;display:block}'+
  '#dashList .dash-pro-info-item .val{font-size:18px;color:#fff;font-weight:900;display:block}'+
  '#dashList .dash-pro-info-item .val.small{font-size:13px}'+
  
  /* أزرار الإجراءات */
  '#dashList .dash-pro-actions{display:flex;gap:10px;margin-top:14px}'+
  '#dashList .dash-action-btn{flex:1;padding:11px;border-radius:12px;font-size:13px;font-weight:800;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:6px;border:1px solid rgba(255,255,255,.25)}'+
  '#dashList .dash-action-btn.view{background:rgba(255,255,255,.2);color:#fff}'+
  '#dashList .dash-action-btn.view:hover{background:rgba(255,255,255,.3)}'+
  '#dashList .dash-action-btn.lock{background:rgba(255,255,255,.95);color:#dc2626}'+
  '#dashList .dash-action-btn.lock:hover{background:#fff}'+
  '#dashList .dash-action-btn.unlock{background:rgba(255,255,255,.95);color:#047857}'+
  '#dashList .dash-action-btn.unlock:hover{background:#fff}'+
  
  '#dashList .dash-pro-toolbar{display:flex;gap:10px;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap}'+
  '#dashList .dash-pro-search{display:flex;align-items:center;gap:7px;flex:1;max-width:430px;padding:0 12px;border:1px solid #e2e8f0;border-radius:13px;background:#fff;box-shadow:0 4px 12px rgba(15,23,42,.035)}'+
  '#dashList .dash-pro-search span{font-size:20px;color:#94a3b8}'+
  '#dashList .dash-pro-search input{width:100%;border:0;outline:0;background:transparent;padding:11px 0;color:#334155;font:inherit;font-size:12px}'+
  '#dashList .dash-pro-filters{display:flex;gap:5px;padding:4px;border-radius:13px;background:#f1f5f9}'+
  '#dashList .dash-filter{border:0;background:transparent;color:#64748b;padding:7px 10px;border-radius:9px;font-size:11px;font-weight:800;cursor:pointer}'+
  '#dashList .dash-filter.active{background:#fff;color:#1d4ed8;box-shadow:0 2px 7px rgba(15,23,42,.08)}'+
  '#dashList .dash-pro-noresults{padding:28px;text-align:center;border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;color:#64748b;font-size:12px;font-weight:800}'+
  
  /* ✅ تنسيق جدول الدرجات - خط أسود واضح */
  '.grades-table{width:100%;border-collapse:collapse;font-size:14px}'+
  '.grades-table th,.grades-table td{padding:8px 10px;border:1.5px solid #334155;text-align:center;color:#0f172a;font-weight:700}'+
  '.grades-table th{background:#1E40AF;color:#fff;font-weight:900;font-size:13px}'+
  '.grades-table td.name-cell{text-align:right;font-weight:900;color:#0f172a;min-width:180px;max-width:220px;white-space:normal;word-wrap:break-word}'+
  '.grades-table td.num-cell{background:#f1f5f9;font-weight:900}'+
  '.grades-table td.avg-cell{background:#FEF3C7;font-weight:900;color:#92400e}'+
  '.grades-table td.pass-cell{color:#047857;font-weight:900}'+
  '.grades-table td.fail-cell{color:#DC2626;font-weight:900}'+
  
  /* ✅ تنسيق الطباعة مع حدود */
  '.print-container{font-family:"Tajawal",Arial,sans-serif !important;width:210mm !important;margin:0 auto !important;padding:10mm !important;background:#fff !important}'+
  '.print-container h2{text-align:center !important;color:#1E40AF !important;margin-bottom:15px !important;font-size:20px !important;border-bottom:2px solid #1E40AF !important;padding-bottom:10px !important}'+
  '.print-table{width:100% !important;border-collapse:collapse !important;border:2px solid #000 !important}'+
  '.print-table th,.print-table td{padding:6px 8px !important;border:1.5px solid #000 !important;text-align:center !important;font-size:12px !important;color:#000 !important;font-weight:700 !important}'+
  '.print-table th{background:#1E40AF !important;color:#fff !important;font-weight:900 !important;font-size:11px !important}'+
  '.print-table td.name-cell{text-align:right !important;font-weight:900 !important;min-width:200px !important;max-width:250px !important;white-space:normal !important;word-wrap:break-word !important}'+
  '.print-table td.avg-cell{background:#FEF3C7 !important;font-weight:900 !important}'+
  '.print-table td.pass-cell{color:#047857 !important;font-weight:900 !important}'+
  '.print-table td.fail-cell{color:#DC2626 !important;font-weight:900 !important}'+
  
  /* ✅ منع الكاش في الطباعة */
  '@media print{body *{visibility:hidden !important}.print-container,.print-container *{visibility:visible !important}.print-container{position:absolute !important;left:0 !important;top:0 !important;width:100% !important;margin:0 !important;padding:10mm !important}@page{size:A4 landscape !important;margin:10mm !important}}'+
  
  '@media(max-width:768px){'+
  '#dashKpi .stats-bar{flex-wrap:wrap !important}'+
  '#dashKpi .stats-bar .stat-item{min-width:calc(50% - 10px) !important}'+
  '#dashList .dash-pro-info{grid-template-columns:repeat(2,1fr)}'+
  '#dashList .dash-pro-name{font-size:18px!important}'+
  '#dashList .dash-class-item{flex-wrap:wrap;gap:8px}'+
  '#dashList .dash-class-stats{width:100%;justify-content:flex-start}'+
  '}';
  document.head.appendChild(s);
})();

function loadDashData(silent) {
  var kpiEl = $('#dashKpi');
  var listEl = $('#dashList');
  
  if (!silent) {
    if (kpiEl) kpiEl.innerHTML = '<div class="empty">⏳ جاري التحميل...</div>';
    if (listEl) listEl.innerHTML = '';
  }
  
  if (!url()) {
    var msg = '⚠️ رابط الخادم غير موجود في config.js';
    if (!silent) toast(msg, 'err');
    if (kpiEl) kpiEl.innerHTML = '<div class="empty">'+msg+'</div>';
    return;
  }
  
  // ✅ إضافة cache-buster للطلب
  api({action:'adminData', key:key(), _t: CACHE_BUSTER}, 30000).then(function(r){
    if(!r.ok){ 
      var errMsg = '❌ ' + (r.error || 'خطأ غير معروف');
      if(!silent) toast(errMsg, 'err');
      if(kpiEl) kpiEl.innerHTML = '<div class="empty">'+errMsg+'</div>';
      return; 
    }
    
    var teachers = r.teachers || [];
    window.DASH_TEACHERS = teachers;
    
    var total = teachers.length;
    var open = teachers.filter(function(t){ return !t.locked; }).length;
    var locked = total - open;
    var totalSent = teachers.reduce(function(sum, t){ return sum + (t.sentCount||0); }, 0);
    var activeRate = total ? Math.round((open / total) * 100) : 0;

    // شريط إحصائيات أفقي بعرض الصفحة
    if(kpiEl){
      kpiEl.innerHTML =
        '<div class="stats-bar">' +
          '<div class="stat-item"><div class="stat-icon">👨🏫</div><div class="stat-info"><span class="stat-num">'+arNum(total)+'</span><span class="stat-lbl">إجمالي المعلمين</span></div></div>' +
          '<div class="stat-item"><div class="stat-icon">🟢</div><div class="stat-info"><span class="stat-num">'+arNum(open)+'</span><span class="stat-lbl">حسابات مفتوحة</span></div></div>' +
          '<div class="stat-item"><div class="stat-icon">🔒</div><div class="stat-info"><span class="stat-num">'+arNum(locked)+'</span><span class="stat-lbl">حسابات مقفلة</span></div></div>' +
          '<div class="stat-item"><div class="stat-icon">📊</div><div class="stat-info"><span class="stat-num">'+arNum(totalSent)+'</span><span class="stat-lbl">درجات مرسلة</span></div></div>' +
          '<div class="progress-wrap">' +
            '<div class="progress-top"><span>نسبة الحسابات النشطة</span><b>'+arNum(activeRate)+'%</b></div>' +
            '<div class="progress-track"><div class="progress-fill" style="width:'+activeRate+'%"></div></div>' +
          '</div>' +
          '<div class="health-badge"><span class="health-dot"></span>النظام متصل</div>' +
        '</div>';
    }
    
    if(listEl){
      if(!teachers.length){
        listEl.innerHTML = '<div class="empty">📭 لا يوجد معلمون مسجلون بعد</div>';
        return;
      }
      
      var colors = [
        {gradient:'linear-gradient(135deg, #3b82f6, #1d4ed8)', accent:'#1d4ed8'},
        {gradient:'linear-gradient(135deg, #10b981, #047857)', accent:'#047857'},
        {gradient:'linear-gradient(135deg, #f59e0b, #b45309)', accent:'#b45309'},
        {gradient:'linear-gradient(135deg, #ef4444, #b91c1c)', accent:'#b91c1c'},
        {gradient:'linear-gradient(135deg, #8b5cf6, #6d28d9)', accent:'#6d28d9'},
        {gradient:'linear-gradient(135deg, #06b6d4, #0e7490)', accent:'#0e7490'},
        {gradient:'linear-gradient(135deg, #ec4899, #be185d)', accent:'#be185d'},
        {gradient:'linear-gradient(135deg, #14b8a6, #0f766e)', accent:'#0f766e'}
      ];
      
      var h = '<div class="dash-pro-head">' +
                '<div><div class="dash-pro-title">👥 قائمة المعلمين</div><div class="dash-pro-sub">إدارة الحسابات ومتابعة النشاط والدرجات</div></div>' +
                '<div class="dash-pro-count">📊 '+arNum(total)+' معلم</div>' +
              '</div>' +
              '<div class="dash-pro-toolbar">' +
                '<div class="dash-pro-search"><span>🔍</span><input id="dashTeacherSearch" type="search" placeholder="ابحث باسم المعلم أو الكود..." oninput="filterDashTeachers(this.value)"></div>' +
                '<div class="dash-pro-filters">' +
                  '<button class="dash-filter active" data-filter="all" onclick="setDashTeacherFilter(\'all\',this)">الكل</button>' +
                  '<button class="dash-filter" data-filter="open" onclick="setDashTeacherFilter(\'open\',this)">🟢 مفتوحة</button>' +
                  '<button class="dash-filter" data-filter="locked" onclick="setDashTeacherFilter(\'locked\',this)">🔒 مقفلة</button>' +
                '</div>' +
              '</div>' +
              '<div id="dashTeacherGrid" class="dash-pro-teachers">';
              
      teachers.forEach(function(t,i){
        var theme = colors[i%colors.length];
        var last = t.lastLogin ? ago(t.lastLogin) : 'لم يدخل بعد';
        var lastSentDate = t.lastSent ? formatDate(t.lastSent) : '—';
        var status = t.locked ? 'locked' : 'open';
        
        var classesData = [];
        var totalClasses = 0;
        
        if(t.subjects) {
          t.subjects.forEach(function(subj){
            if(subj.classes) {
              subj.classes.forEach(function(cls){
                totalClasses++;
                classesData.push({name: cls, subject: subj.name});
              });
            }
          });
        }
        
        var subjectText = '';
        if(t.subjects && t.subjects.length > 0) {
          subjectText = t.subjects.map(function(s){ return s.name; }).join('، ');
        } else if (t.subject) {
          subjectText = t.subject;
        } else {
          subjectText = '—';
        }
        var shortSubject = subjectText.length > 30 ? subjectText.substring(0, 30) + '...' : subjectText;
        
        h += '<div class="dash-pro-teacher" data-status="'+status+'" data-search="'+escA((t.name||'')+' '+(t.code||''))+'" style="background:'+theme.gradient+'" role="button" tabindex="0">';
        
        h += '<div class="dash-pro-top">';
        h += '<div class="dash-pro-avatar" style="color:'+theme.accent+'">'+esc((t.name||'?').trim().charAt(0))+'</div>';
        h += '<div class="dash-pro-main" style="flex:1;min-width:0">';
        h += '<div class="dash-pro-name">'+esc(t.name)+'</div>';
        h += '<div class="dash-pro-code"> '+esc(t.code)+'</div>';
        h += '</div>';
        h += '<div class="dash-pro-status '+status+'">'+(t.locked?'🔒 مقفل':'🟢 مفتوح')+'</div>';
        h += '</div>';
        
        h += '<div class="dash-pro-meta">';
        h += '<div class="dash-pro-meta-item">📚 '+esc(shortSubject)+'</div>';
        h += '<div class="dash-pro-meta-item">📅 آخر إرسال: '+lastSentDate+'</div>';
        h += '</div>';
        
        if(classesData.length > 0) {
          h += '<div class="dash-classes-section">';
          h += '<div class="dash-classes-title">🏫 الشعب والمواد ('+arNum(totalClasses)+' شعبة) — اضغط لعرض الدرجات</div>';
          classesData.forEach(function(cd){
            h += '<div class="dash-class-item">';
            h += '<div class="dash-class-name"> '+esc(cd.subject)+' — '+esc(cd.name)+'</div>';
            h += '<div class="dash-class-stats">';
            h += '<button class="dash-class-open-btn" onclick="event.stopPropagation();viewTeacherSubject(\''+escA(t.code)+'\',\''+escA(cd.subject)+'\',\''+escA(cd.name)+'\')">📂 عرض الدرجات</button>';
            h += '</div>';
            h += '</div>';
          });
          h += '</div>';
        } else {
          h += '<div class="dash-classes-section"><div class="dash-classes-title"> لا توجد شعب مسجلة</div></div>';
        }
        
        h += '<div class="dash-pro-info">';
        h += '<div class="dash-pro-info-item"><span class="lbl">الدرجات المرسلة</span><span class="val">'+arNum(t.sentCount||0)+'</span></div>';
        h += '<div class="dash-pro-info-item"><span class="lbl">عدد الشعب</span><span class="val">'+arNum(totalClasses)+'</span></div>';
        h += '<div class="dash-pro-info-item"><span class="lbl">آخر دخول</span><span class="val small">'+esc(last)+'</span></div>';
        h += '<div class="dash-pro-info-item"><span class="lbl">الحالة</span><span class="val small">'+(t.locked?'مقفلة':'مفتوحة')+'</span></div>';
        h += '</div>';
        
        h += '<div class="dash-pro-actions">';
        h += '<button class="dash-action-btn view" onclick="event.stopPropagation();viewTeacher(\''+escA(t.code)+'\')">📂 كل المواد</button>';
        if(t.locked) {
          h += '<button class="dash-action-btn unlock" onclick="event.stopPropagation();toggleTeacherLock(\''+escA(t.code)+'\', false)">🔓 فتح الحساب</button>';
        } else {
          h += '<button class="dash-action-btn lock" onclick="event.stopPropagation();toggleTeacherLock(\''+escA(t.code)+'\', true)">🔒 قفل الحساب</button>';
        }
        h += '</div>';
        
        h += '</div>';
      });
      
      h += '</div>';
      h += '<div id="dashNoResults" class="dash-pro-noresults" style="display:none">🔍 لا توجد نتائج مطابقة للبحث</div>';
      listEl.innerHTML = h;
    }
    
  }).catch(function(err){
    var msg = '⚠️ تعذر الاتصال بالخادم';
    if (err.message === 'no-url') msg = ' رابط الخادم مفقود';
    else if (err.name === 'AbortError') msg = ' انتهت مهلة الاتصال — جاري إعادة المحاولة...';
    if(!silent) toast(msg, 'err');
    if(kpiEl) kpiEl.innerHTML = '<div class="empty">'+msg+'</div>';
  });
}

// ✅ دالة عرض درجات مادة وشعبة محددة
function viewTeacherSubject(code, subject, cls) {
  var t = (window.DASH_TEACHERS || []).find(function(x){ return x.code === code; });
  if(!t) { toast('بيانات المعلم غير متاحة', 'err'); return; }
  
  ADM.tv = t;
  $('#tvName').textContent = t.name + ' — ' + subject + ' — ' + cls;
  $('#tvSub').textContent = '🔑 '+t.code;
  go('s-tview');
  loadTeacherViewFiltered(code, subject, cls);
}

// ✅ دالة تحميل درجات مادة وشعبة محددة - بخط أسود واضح
function loadTeacherViewFiltered(code, subject, cls) {
  var el = $('#tvBox');
  if(!el) return;
  el.innerHTML = '<div class="empty">⏳ جاري التحميل...</div>';
  
  api({action:'teacherGrades', key:key(), code:code, _t: CACHE_BUSTER}, 30000).then(function(r){
    if(!r.ok){ toast('❌ '+r.error, 'err'); el.innerHTML = '<div class="empty">❌ '+r.error+'</div>'; return; }
    var rows = r.rows || [];
    
    var filteredRows = rows.filter(function(row){
      return row.subject === subject && row.cls === cls;
    });
    
    if(!filteredRows.length){ 
      el.innerHTML = '<div class="empty">📭 لا توجد درجات مسجلة لـ '+esc(subject)+' — '+esc(cls)+'</div>'; 
      return; 
    }
    
    var h = '<div class="card" style="margin-bottom:15px">';
    h += '<div class="ct">🏫 '+esc(cls)+' — 📘 '+esc(subject)+'</div>';
    h += '<div style="overflow-x:auto">';
    h += '<table class="grades-table">';
    h += '<thead><tr>';
    h += '<th style="width:40px">ت</th>';
    h += '<th style="min-width:200px;max-width:250px">اسم التلميذ</th>';
    h += '<th>ت١</th><th>ت٢</th><th>ك١</th><th>آذار</th><th>نيسان</th>';
    h += '<th>معدل ف١</th><th>نصف السنة</th><th>معدل ف٢</th>';
    h += '<th>السعي</th><th>النهاية</th><th>النهائية</th>';
    h += '</tr></thead><tbody>';
    
    filteredRows.forEach(function(row, idx){
      var finalClass = '';
      if(row.final != null) {
        finalClass = (row.final >= (row.max||100)/2) ? 'pass-cell' : 'fail-cell';
      }
      h += '<tr>';
      h += '<td class="num-cell">'+arNum(idx+1)+'</td>';
      h += '<td class="name-cell">'+esc(row.name)+'</td>';
      h += '<td>'+(row.m1!=null?arNum(row.m1):'—')+'</td>';
      h += '<td>'+(row.m2!=null?arNum(row.m2):'—')+'</td>';
      h += '<td>'+(row.m3!=null?arNum(row.m3):'—')+'</td>';
      h += '<td>'+(row.m4!=null?arNum(row.m4):'—')+'</td>';
      h += '<td>'+(row.m5!=null?arNum(row.m5):'—')+'</td>';
      h += '<td class="avg-cell">'+(row.a1!=null?arNum(row.a1):'—')+'</td>';
      h += '<td>'+(row.half!=null?arNum(row.half):'—')+'</td>';
      h += '<td class="avg-cell">'+(row.a2!=null?arNum(row.a2):'—')+'</td>';
      h += '<td class="avg-cell">'+(row.annual!=null?arNum(row.annual):'—')+'</td>';
      h += '<td>'+(row.exam!=null?arNum(row.exam):'—')+'</td>';
      h += '<td class="'+finalClass+'">'+(row.final!=null?arNum(row.final):'—')+'</td>';
      h += '</tr>';
    });
    h += '</tbody></table></div></div>';
    el.innerHTML = h;
    
  }).catch(function(err){
    el.innerHTML = '<div class="empty">⚠️ تعذر تحميل البيانات</div>';
  });
}

function toggleTeacherLock(code, lock) {
  var action = lock ? 'قفل' : 'فتح';
  var msg = lock ? 'هل أنت متأكد من قفل حساب هذا المعلم؟' : 'هل أنت متأكد من فتح حساب هذا المعلم؟';
  
  confirmDlg(msg + '\n\nالكود: ' + code, function() {
    api({action: 'toggleLock', key: key(), code: code, _t: CACHE_BUSTER}, 15000).then(function(r) {
      if(r.ok) {
        toast('✓ تم ' + action + ' الحساب بنجاح', 'ok');
        loadDashData();
      } else {
        toast('❌ ' + (r.error || 'فشل العملية'), 'err');
      }
    }).catch(function(err) {
      toast('⚠️ تعذر الاتصال بالخادم', 'err');
    });
  });
}

function formatDate(timestamp) {
  if(!timestamp) return '—';
  var date = new Date(timestamp);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return day+'/'+month+'/'+year+' '+hours+':'+(minutes<10?'0':'')+minutes;
}

function filterDashTeachers(value){
  var q = (value||'').toLowerCase().trim();
  var grid = document.getElementById('dashTeacherGrid');
  if(!grid) return;
  var active = document.querySelector('#dashList .dash-filter.active');
  var filter = active ? active.getAttribute('data-filter') : 'all';
  var items = grid.querySelectorAll('.dash-pro-teacher');
  var shown = 0;
  items.forEach(function(el){
    var text = (el.getAttribute('data-search')||'').toLowerCase();
    var status = el.getAttribute('data-status');
    var ok = (filter==='all' || status===filter) && (!q || text.indexOf(q)!==-1);
    el.style.display = ok ? '' : 'none';
    if(ok) shown++;
  });
  var empty = document.getElementById('dashNoResults');
  if(empty) empty.style.display = shown ? 'none' : 'block';
}

function setDashTeacherFilter(filter, btn){
  var box = document.getElementById('dashList');
  if(!box) return;
  box.querySelectorAll('.dash-filter').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  var input = document.getElementById('dashTeacherSearch');
  filterDashTeachers(input ? input.value : '');
}

function viewTeacher(code){
  var t = (window.DASH_TEACHERS || []).find(function(x){ return x.code === code; });
  if(!t) { toast('بيانات المعلم غير متاحة', 'err'); return; }
  
  ADM.tv = t;
  $('#tvName').textContent = t.name;
  
  var subjText = '—';
  if(t.subjects && t.subjects.length > 0) {
    subjText = t.subjects.map(function(s){ return s.name; }).join('، ');
  } else if (t.subject) {
    subjText = t.subject;
  }
  
  $('#tvSub').textContent = '🔑 '+t.code+' | '+subjText;
  go('s-tview');
  loadTeacherView(code);
}

function loadTeacherView(code){
  var el = $('#tvBox');
  if(!el) return;
  el.innerHTML = '<div class="empty">⏳ جاري التحميل...</div>';
  
  api({action:'teacherGrades', key:key(), code:code, _t: CACHE_BUSTER}, 30000).then(function(r){
    if(!r.ok){ toast('❌ '+r.error, 'err'); el.innerHTML = '<div class="empty">❌ '+r.error+'</div>'; return; }
    var rows = r.rows || [];
    if(!rows.length){ el.innerHTML = '<div class="empty">📭 لا توجد درجات مسجلة لهذا المعلم</div>'; return; }
    
    var byCls = {};
    rows.forEach(function(row){
      var cls = row.cls || 'غير محدد';
      if(!byCls[cls]) byCls[cls] = {};
      if(!byCls[cls][row.subject]) byCls[cls][row.subject] = [];
      byCls[cls][row.subject].push(row);
    });
    
    var h = '';
    Object.keys(byCls).forEach(function(cls){
      h += '<div class="card" style="margin-bottom:15px"><div class="ct"> '+esc(cls)+'</div>';
      Object.keys(byCls[cls]).forEach(function(subj){
        h += '<h4 style="margin:10px 0;color:#047857">📘 '+esc(subj)+'</h4>';
        h += '<div style="overflow-x:auto">';
        h += '<table class="grades-table">';
        h += '<thead><tr>';
        h += '<th style="width:40px">ت</th>';
        h += '<th style="min-width:200px;max-width:250px">اسم التلميذ</th>';
        h += '<th>ت١</th><th>ت٢</th><th>ك١</th><th>آذار</th><th>نيسان</th>';
        h += '<th>معدل ف١</th><th>نصف السنة</th><th>معدل ف٢</th>';
        h += '<th>السعي</th><th>النهاية</th><th>النهائية</th>';
        h += '</tr></thead><tbody>';
        
        var subjRows = byCls[cls][subj];
        subjRows.forEach(function(row, idx){
          var finalClass = '';
          if(row.final != null) {
            finalClass = (row.final >= (row.max||100)/2) ? 'pass-cell' : 'fail-cell';
          }
          h += '<tr>';
          h += '<td class="num-cell">'+arNum(idx+1)+'</td>';
          h += '<td class="name-cell">'+esc(row.name)+'</td>';
          h += '<td>'+(row.m1!=null?arNum(row.m1):'—')+'</td>';
          h += '<td>'+(row.m2!=null?arNum(row.m2):'—')+'</td>';
          h += '<td>'+(row.m3!=null?arNum(row.m3):'—')+'</td>';
          h += '<td>'+(row.m4!=null?arNum(row.m4):'—')+'</td>';
          h += '<td>'+(row.m5!=null?arNum(row.m5):'—')+'</td>';
          h += '<td class="avg-cell">'+(row.a1!=null?arNum(row.a1):'—')+'</td>';
          h += '<td>'+(row.half!=null?arNum(row.half):'—')+'</td>';
          h += '<td class="avg-cell">'+(row.a2!=null?arNum(row.a2):'—')+'</td>';
          h += '<td class="avg-cell">'+(row.annual!=null?arNum(row.annual):'—')+'</td>';
          h += '<td>'+(row.exam!=null?arNum(row.exam):'—')+'</td>';
          h += '<td class="'+finalClass+'">'+(row.final!=null?arNum(row.final):'—')+'</td>';
          h += '</tr>';
        });
        h += '</tbody></table></div>';
      });
      h += '</div>';
    });
    el.innerHTML = h;
    
  }).catch(function(err){
    el.innerHTML = '<div class="empty">⚠️ تعذر تحميل البيانات</div>';
  });
}

function showSummary(code){
  var t = ADM.tv;
  if(!t) return;
  api({action:'teacherGrades', key:key(), code:code, _t: CACHE_BUSTER}, 30000).then(function(r){
    if(!r.ok) return;
    var rows = r.rows || [];
    var bySubj = {};
    rows.forEach(function(row){
      if(!bySubj[row.subject]) bySubj[row.subject] = {count:0, finals:[]};
      bySubj[row.subject].count++;
      if(row.final != null) bySubj[row.subject].finals.push(row.final);
    });
    var h = '<div style="padding:10px">';
    Object.keys(bySubj).forEach(function(subj){
      var d = bySubj[subj];
      var avg = d.finals.length ? Math.round(d.finals.reduce(function(a,b){return a+b;},0)/d.finals.length) : 0;
      var pass = d.finals.filter(function(v){return v >= 50;}).length;
      h += '<div style="margin-bottom:10px;padding:10px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0">';
      h += '<div style="font-weight:900;color:#1E40AF;margin-bottom:5px">📘 '+esc(subj)+'</div>';
      h += '<div style="font-size:13px;color:#475569">عدد التلاميذ: <b>'+arNum(d.count)+'</b> | المعدل: <b>'+arNum(avg)+'</b> | ناجحون: <b>'+arNum(pass)+'</b></div>';
      h += '</div>';
    });
    h += '</div>';
    $('#sumBox').innerHTML = h;
    $('#sumModal').classList.add('show');
  });
}

// ✅ دالة الطباعة المحسنة - مع حدود كاملة ومنع الكاش
function printTView(){
  var el = $('#tvBox');
  if(!el) return;
  
  var title = 'كشف درجات: '+esc(ADM.tv?ADM.tv.name:'');
  var ctEl = el.querySelector('.ct');
  if(ctEl) {
    title += ' — ' + ctEl.textContent.trim();
  }
  
  // ✅ بناء HTML كامل مع CSS مدمج للطباعة
  var h = '<!DOCTYPE html><html dir="rtl" lang="ar"><head>';
  h += '<meta charset="UTF-8">';
  h += '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">';
  h += '<meta http-equiv="Pragma" content="no-cache">';
  h += '<meta http-equiv="Expires" content="0">';
  h += '<title>'+title+'</title>';
  h += '<style>';
  h += '@page { size: A4 landscape; margin: 10mm; }';
  h += 'body { font-family: "Tajawal", Arial, sans-serif; margin: 0; padding: 10mm; background: #fff; }';
  h += 'h2 { text-align: center; color: #1E40AF; border-bottom: 3px solid #1E40AF; padding-bottom: 10px; margin-bottom: 20px; }';
  h += 'table { width: 100%; border-collapse: collapse; border: 2px solid #000; }';
  h += 'th, td { padding: 6px 8px; border: 1.5px solid #000; text-align: center; font-size: 12px; font-weight: 700; }';
  h += 'th { background: #1E40AF; color: #fff; font-weight: 900; font-size: 11px; }';
  h += 'td.name-cell { text-align: right; font-weight: 900; min-width: 200px; max-width: 250px; white-space: normal; word-wrap: break-word; }';
  h += 'td.avg-cell { background: #FEF3C7; font-weight: 900; }';
  h += 'td.pass-cell { color: #047857; font-weight: 900; }';
  h += 'td.fail-cell { color: #DC2626; font-weight: 900; }';
  h += '</style></head><body>';
  
  h += '<h2>'+title+'</h2>';
  h += '<table class="print-table">';
  h += '<thead><tr>';
  h += '<th style="width:40px">ت</th>';
  h += '<th style="min-width:200px;max-width:250px">اسم التلميذ</th>';
  h += '<th>ت١</th><th>ت٢</th><th>ك١</th><th>آذار</th><th>نيسان</th>';
  h += '<th>معدل ف١</th><th>نصف السنة</th><th>معدل ف٢</th>';
  h += '<th>السعي</th><th>النهاية</th><th>النهائية</th>';
  h += '</tr></thead><tbody>';
  
  // استخراج البيانات من الجدول المعروض
  var tableRows = el.querySelectorAll('table tbody tr');
  var idx = 1;
  tableRows.forEach(function(row){
    var cells = row.querySelectorAll('td');
    if(cells.length >= 13) {
      h += '<tr>';
      h += '<td>'+arNum(idx++)+'</td>';
      h += '<td class="name-cell">'+esc(cells[1].textContent)+'</td>';
      for(var j=2; j<cells.length; j++){
        var cellText = cells[j].textContent;
        var cellClass = '';
        if(j === 12) { // العمود الأخير (النهائية)
          var numVal = parseFloat(cellText);
          if(!isNaN(numVal)) {
            cellClass = (numVal >= 50) ? 'pass-cell' : 'fail-cell';
          }
        } else if(j === 7 || j === 9 || j === 10) { // أعمدة المعدلات
          cellClass = 'avg-cell';
        }
        h += '<td class="'+cellClass+'">'+esc(cellText)+'</td>';
      }
      h += '</tr>';
    }
  });
  
  h += '</tbody></table>';
  h += '<div style="margin-top:20px;text-align:center;font-size:11px;color:#666">';
  h += 'تم الطباعة بتاريخ: '+new Date().toLocaleDateString('ar-IQ')+'</div>';
  h += '</body></html>';
  
  // ✅ فتح نافذة جديدة مع منع الكاش
  var printWindow = window.open('', '_blank');
  printWindow.document.write(h);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(function(){ printWindow.print(); printWindow.close(); }, 250);
}
