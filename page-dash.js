/* ══ page-dash.js — الصفحة الرئيسية (محدث واحترافي) ═══ */

// متغير عام لحفظ بيانات المعلمين
window.DASH_TEACHERS = [];

registerPage('dash', {
  enter: function() {
    loadDashData();
  },
  silent: function() {
    loadDashData(true);
  }
});

/* ═══ تصميم الصفحة الرئيسية ══ */
(function(){
  if(document.getElementById('dashProStyles')) return;
  var s = document.createElement('style'); 
  s.id = 'dashProStyles';
  s.textContent = 
  '#dashKpi{margin-bottom:20px}'+
  '#dashKpi .dash-pro-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}'+
  '#dashKpi .dash-pro-card{position:relative;overflow:hidden;display:flex;align-items:center;gap:16px;min-height:120px;padding:20px 22px;border-radius:22px;box-shadow:0 8px 24px rgba(15,23,42,.08);transition:.25s}'+
  '#dashKpi .dash-pro-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(15,23,42,.15)}'+
  '#dashKpi .dash-pro-card:before{content:"";position:absolute;right:0;top:0;bottom:0;width:6px;background:var(--accent)}'+
  '#dashKpi .dash-pro-icon{width:68px;height:68px;display:grid;place-items:center;border-radius:18px;background:var(--soft);font-size:32px;flex:none;box-shadow:0 6px 16px rgba(0,0,0,.08)}'+
  '#dashKpi .dash-pro-value{font-size:34px;line-height:1;font-weight:900;color:#0f172a}'+
  '#dashKpi .dash-pro-label{margin-top:8px;font-size:14px;color:#475569;font-weight:800}'+
  '#dashList .dash-pro-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:10px 0 16px}'+
  '#dashList .dash-pro-title{font-size:22px;font-weight:900;color:#0f172a}'+
  '#dashList .dash-pro-sub{margin-top:4px;font-size:13px;color:#64748b}'+
  '#dashList .dash-pro-count{padding:8px 14px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:900;white-space:nowrap}'+
  '#dashList .dash-pro-teachers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}'+
  '#dashList .dash-pro-teacher{position:relative;overflow:hidden;border-radius:22px;padding:20px;box-shadow:0 10px 30px rgba(15,23,42,.12);cursor:pointer;transition:.25s;color:#fff}'+
  '#dashList .dash-pro-teacher:hover{transform:translateY(-5px);box-shadow:0 20px 45px rgba(0,0,0,.2)}'+
  '#dashList .dash-pro-top{display:flex;align-items:center;gap:14px;margin-bottom:14px}'+
  '#dashList .dash-pro-avatar{width:60px;height:60px;display:grid;place-items:center;border-radius:18px;font-size:28px;font-weight:900;flex:none;box-shadow:0 6px 16px rgba(0,0,0,.15)}'+
  '#dashList .dash-pro-main{min-width:0;flex:1}'+
  '#dashList .dash-pro-name{font-size:19px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}'+
  '#dashList .dash-pro-code{font-size:12px;color:rgba(255,255,255,.9);font-family:monospace;font-weight:700}'+
  '#dashList .dash-pro-status{font-size:12px;font-weight:900;padding:8px 12px;border-radius:999px;white-space:nowrap;background:rgba(255,255,255,.95);box-shadow:0 2px 8px rgba(0,0,0,.1)}'+
  '#dashList .dash-pro-status.open{color:#047857}'+
  '#dashList .dash-pro-status.locked{color:#dc2626}'+
  '#dashList .dash-pro-meta{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}'+
  '#dashList .dash-pro-meta-item{padding:7px 11px;border-radius:11px;background:rgba(255,255,255,.22);font-size:12px;color:#fff;font-weight:700;display:flex;align-items:center;gap:5px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15)}'+
  '#dashList .dash-pro-info{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,.25)}'+
  '#dashList .dash-pro-info-item{text-align:center}'+
  '#dashList .dash-pro-info-item .lbl{font-size:10px;color:rgba(255,255,255,.85);font-weight:700;margin-bottom:4px;display:block}'+
  '#dashList .dash-pro-info-item .val{font-size:17px;color:#fff;font-weight:900;display:block}'+
  '#dashList .dash-pro-info-item .val.small{font-size:13px}'+
  '#dashList .dash-pro-open{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;padding:11px;border-radius:13px;background:rgba(255,255,255,.18);color:#fff;font-size:14px;font-weight:800;cursor:pointer;transition:.2s;border:1px solid rgba(255,255,255,.2)}'+
  '#dashList .dash-pro-open:hover{background:rgba(255,255,255,.28)}'+
  '#dashList .dash-pro-open span{font-size:18px;transition:.2s}'+
  '#dashList .dash-pro-teacher:hover .dash-pro-open span{transform:translateX(-4px)}'+
  '#dashKpi .dash-pro-shell{padding:2px 0}'+
  '#dashKpi .dash-pro-welcome{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:18px;padding:22px 24px;border-radius:24px;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;box-shadow:0 12px 30px rgba(15,23,42,.18)}'+
  '#dashKpi .dash-pro-eyebrow{font-size:11px;opacity:.85;font-weight:800;margin-bottom:4px}'+
  '#dashKpi .dash-pro-heading{font-size:28px;font-weight:950}'+
  '#dashKpi .dash-pro-desc{font-size:13px;opacity:.85;margin-top:6px}'+
  '#dashKpi .dash-pro-health{padding:10px 14px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.12);border-radius:999px;font-size:12px;font-weight:800;white-space:nowrap;display:flex;align-items:center;gap:7px}'+
  '#dashKpi .dash-pro-health-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#34d399;box-shadow:0 0 0 4px rgba(52,211,153,.2);animation:pulse 2s infinite}'+
  '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}'+
  '#dashKpi .dash-pro-card.blue{--accent:#2563eb;--soft:#dbeafe;background:linear-gradient(135deg,#eff6ff,#dbeafe)}'+
  '#dashKpi .dash-pro-card.green{--accent:#10b981;--soft:#d1fae5;background:linear-gradient(135deg,#ecfdf5,#d1fae5)}'+
  '#dashKpi .dash-pro-card.red{--accent:#ef4444;--soft:#fee2e2;background:linear-gradient(135deg,#fef2f2,#fee2e2)}'+
  '#dashKpi .dash-pro-card.amber{--accent:#f59e0b;--soft:#fef3c7;background:linear-gradient(135deg,#fffbeb,#fef3c7)}'+
  '#dashKpi .dash-pro-mini{font-size:11px;color:#64748b;margin-top:8px;font-weight:700}'+
  '#dashKpi .dash-pro-progress{margin-top:16px;padding:16px 18px;border:1px solid #e5e7eb;border-radius:18px;background:#fff;box-shadow:0 5px 16px rgba(15,23,42,.04)}'+
  '#dashKpi .dash-pro-progress>div:first-child{display:flex;justify-content:space-between;color:#64748b;font-size:12px;font-weight:700;margin-bottom:10px}'+
  '#dashKpi .dash-pro-progress b{color:#1d4ed8}'+
  '#dashKpi .dash-pro-track{height:9px;background:#e2e8f0;border-radius:99px;overflow:hidden}'+
  '#dashKpi .dash-pro-track i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#2563eb,#60a5fa);transition:width .5s ease}'+
  '#dashList .dash-pro-toolbar{display:flex;gap:10px;align-items:center;justify-content:space-between;margin-bottom:14px}'+
  '#dashList .dash-pro-search{display:flex;align-items:center;gap:7px;flex:1;max-width:430px;padding:0 12px;border:1px solid #e2e8f0;border-radius:13px;background:#fff;box-shadow:0 4px 12px rgba(15,23,42,.035)}'+
  '#dashList .dash-pro-search span{font-size:20px;color:#94a3b8}'+
  '#dashList .dash-pro-search input{width:100%;border:0;outline:0;background:transparent;padding:11px 0;color:#334155;font:inherit;font-size:12px}'+
  '#dashList .dash-pro-filters{display:flex;gap:5px;padding:4px;border-radius:13px;background:#f1f5f9}'+
  '#dashList .dash-filter{border:0;background:transparent;color:#64748b;padding:7px 10px;border-radius:9px;font-size:11px;font-weight:800;cursor:pointer}'+
  '#dashList .dash-filter.active{background:#fff;color:#1d4ed8;box-shadow:0 2px 7px rgba(15,23,42,.08)}'+
  '#dashList .dash-pro-noresults{padding:28px;text-align:center;border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;color:#64748b;font-size:12px;font-weight:800}'+
  '@media(max-width:900px){#dashKpi .dash-pro-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#dashList .dash-pro-teachers{grid-template-columns:1fr}}'+
  '@media(max-width:520px){'+
  '#dashKpi .dash-pro-welcome{padding:16px;border-radius:18px}.dash-pro-heading{font-size:22px!important}.dash-pro-desc{font-size:11px!important}.dash-pro-health{font-size:11px!important;padding:8px 10px!important}'+
  '#dashList .dash-pro-toolbar{display:block}.dash-pro-search{max-width:none!important;margin-bottom:8px}.dash-pro-filters{width:max-content}'+
  '#dashList .dash-pro-teachers{gap:12px}'+
  '#dashKpi .dash-pro-grid{gap:10px}#dashKpi .dash-pro-card{min-height:100px;padding:14px}.dash-pro-icon{width:54px!important;height:54px!important;font-size:26px!important}.dash-pro-value{font-size:28px!important}'+
  '#dashList .dash-pro-teacher{padding:16px}'+
  '#dashList .dash-pro-name{font-size:16px!important}'+
  '#dashList .dash-pro-avatar{width:50px!important;height:50px!important;font-size:24px!important}}';
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
  
  api({action:'adminData', key:key()}, 15000).then(function(r){
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
    var avgSent = total ? Math.round(totalSent / total) : 0;

    if(kpiEl){
      kpiEl.innerHTML =
        '<div class="dash-pro-shell">' +
          '<div class="dash-pro-welcome">' +
            '<div><div class="dash-pro-eyebrow">لوحة الإدارة</div><div class="dash-pro-heading">الرئيسية</div><div class="dash-pro-desc">متابعة المعلمين والحسابات والدرجات من مكان واحد</div></div>' +
            '<div class="dash-pro-health"><span class="dash-pro-health-dot"></span>النظام متصل</div>' +
          '</div>' +
          '<div class="dash-pro-grid">' +
            '<div class="dash-pro-card blue"><div class="dash-pro-icon">👨‍🏫</div><div><div class="dash-pro-value">'+arNum(total)+'</div><div class="dash-pro-label">إجمالي المعلمين</div><div class="dash-pro-mini">متوسط '+arNum(avgSent)+' درجة/معلم</div></div></div>' +
            '<div class="dash-pro-card green"><div class="dash-pro-icon">🟢</div><div><div class="dash-pro-value">'+arNum(open)+'</div><div class="dash-pro-label">حسابات مفتوحة</div><div class="dash-pro-mini">نسبة النشاط '+arNum(activeRate)+'%</div></div></div>' +
            '<div class="dash-pro-card red"><div class="dash-pro-icon"></div><div><div class="dash-pro-value">'+arNum(locked)+'</div><div class="dash-pro-label">حسابات مقفلة</div><div class="dash-pro-mini">تحتاج إلى مراجعة</div></div></div>' +
            '<div class="dash-pro-card amber"><div class="dash-pro-icon">📊</div><div><div class="dash-pro-value">'+arNum(totalSent)+'</div><div class="dash-pro-label">إجمالي الدرجات</div><div class="dash-pro-mini">تم إرسالها للنظام</div></div></div>' +
          '</div>' +
          '<div class="dash-pro-progress">' +
            '<div><span>نسبة الحسابات النشطة</span><b>'+arNum(activeRate)+'%</b></div>' +
            '<div class="dash-pro-track"><i style="width:'+activeRate+'%"></i></div>' +
          '</div>' +
        '</div>';
    }
    
    if(listEl){
      if(!teachers.length){
        listEl.innerHTML = '<div class="empty">📭 لا يوجد معلمون مسجلون بعد</div>';
        return;
      }
      
      // ألوان متدرجة قوية واحترافية
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
                '<div><div class="dash-pro-title">👥 قائمة المعلمين</div><div class="dash-pro-sub">إدارة الحسابات ومتابعة النشاط والدرجات المرسلة</div></div>' +
                '<div class="dash-pro-count">📊 '+arNum(total)+' معلم</div>' +
              '</div>' +
              '<div class="dash-pro-toolbar">' +
                '<div class="dash-pro-search"><span></span><input id="dashTeacherSearch" type="search" placeholder="ابحث باسم المعلم أو الكود..." oninput="filterDashTeachers(this.value)"></div>' +
                '<div class="dash-pro-filters">' +
                  '<button class="dash-filter active" data-filter="all" onclick="setDashTeacherFilter(\'all\',this)">الكل</button>' +
                  '<button class="dash-filter" data-filter="open" onclick="setDashTeacherFilter(\'open\',this)">🟢 مفتوحة</button>' +
                  '<button class="dash-filter" data-filter="locked" onclick="setDashTeacherFilter(\'locked\',this)"> مقفلة</button>' +
                '</div>' +
              '</div>' +
              '<div id="dashTeacherGrid" class="dash-pro-teachers">';
              
      teachers.forEach(function(t,i){
        var theme = colors[i%colors.length];
        var last = t.lastLogin ? ago(t.lastLogin) : 'لم يدخل بعد';
        var cnt = 0;
        var subjectsList = [];
        var lastSentDate = t.lastSent ? formatDate(t.lastSent) : '—';
        
        if(t.subjects) {
          t.subjects.forEach(function(s){ 
            if(s.classes) {
              cnt += s.classes.length;
              subjectsList.push(s.name);
            } 
          });
        }
        
        var status = t.locked ? 'locked' : 'open';
        var subjectText = subjectsList.length > 0 ? subjectsList.join('، ') : '—';
        var shortSubject = subjectText.length > 25 ? subjectText.substring(0, 25) + '...' : subjectText;
        
        h += '<div class="dash-pro-teacher" data-status="'+status+'" data-search="'+escA((t.name||'')+' '+(t.code||''))+'" style="background:'+theme.gradient+'" onclick="viewTeacher(\''+escA(t.code)+'\')" role="button" tabindex="0">';
        
        // الرأس: الصورة والاسم والكود والحالة
        h += '<div class="dash-pro-top">';
        h += '<div class="dash-pro-avatar" style="background:rgba(255,255,255,.95);color:'+theme.accent+'">'+esc((t.name||'?').trim().charAt(0))+'</div>';
        h += '<div class="dash-pro-main" style="flex:1;min-width:0">';
        h += '<div class="dash-pro-name">'+esc(t.name)+'</div>';
        h += '<div class="dash-pro-code">🔑 '+esc(t.code)+'</div>';
        h += '</div>';
        h += '<div class="dash-pro-status '+status+'">'+(t.locked?'🔒 مقفل':'🟢 مفتوح')+'</div>';
        h += '</div>';
        
        // المادة وتاريخ الإرسال
        h += '<div class="dash-pro-meta">';
        h += '<div class="dash-pro-meta-item">📚 '+esc(shortSubject)+'</div>';
        h += '<div class="dash-pro-meta-item">📅 '+lastSentDate+'</div>';
        h += '</div>';
        
        // الإحصائيات
        h += '<div class="dash-pro-info">';
        h += '<div class="dash-pro-info-item"><span class="lbl">الدرجات</span><span class="val">'+arNum(t.sentCount||0)+'</span></div>';
        h += '<div class="dash-pro-info-item"><span class="lbl">الشعب</span><span class="val">'+arNum(cnt)+'</span></div>';
        h += '<div class="dash-pro-info-item"><span class="lbl">آخر دخول</span><span class="val small">'+esc(last)+'</span></div>';
        h += '</div>';
        
        // زر فتح الملف
        h += '<div class="dash-pro-open">📂 فتح ملف المعلم الكامل <span>←</span></div>';
        
        h += '</div>';
      });
      
      h += '</div>';
      h += '<div id="dashNoResults" class="dash-pro-noresults" style="display:none">🔍 لا توجد نتائج مطابقة للبحث</div>';
      listEl.innerHTML = h;
    }
    
  }).catch(function(err){
    var msg = '️ تعذر الاتصال بالخادم';
    if (err.message === 'no-url') msg = ' رابط الخادم مفقود';
    else if (err.name === 'AbortError') msg = '⏱ انتهت مهلة الاتصال';
    if(!silent) toast(msg, 'err');
    if(kpiEl) kpiEl.innerHTML = '<div class="empty">'+msg+'</div>';
  });
}

// دالة تنسيق التاريخ
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
  
  $('#tvSub').textContent = ' '+t.code+' | '+subjText;
  go('s-tview');
  loadTeacherView(code);
}

function loadTeacherView(code){
  var el = $('#tvBox');
  if(!el) return;
  el.innerHTML = '<div class="empty">⏳ جاري التحميل...</div>';
  
  api({action:'teacherGrades', key:key(), code:code}).then(function(r){
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
      h += '<div class="card" style="margin-bottom:15px"><div class="ct">🏫 '+esc(cls)+'</div>';
      Object.keys(byCls[cls]).forEach(function(subj){
        h += '<h4 style="margin:10px 0;color:#047857"> '+esc(subj)+'</h4>';
        h += '<div style="overflow-x:auto"><table class="pt" style="width:100%;border-collapse:collapse">';
        h += '<thead><tr style="background:#1E40AF;color:#fff">';
        h += '<th style="padding:6px;border:1px solid #0F172A">ت</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">الاسم</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">ت١</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">ت٢</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">ك١</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">آذار</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">نيسان</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">معدل ف١</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">نصف السنة</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">معدل ف٢</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">السعي</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">النهاية</th>';
        h += '<th style="padding:6px;border:1px solid #0F172A">النهائية</th>';
        h += '</tr></thead><tbody>';
        
        var subjRows = byCls[cls][subj];
        subjRows.forEach(function(row, idx){
          var finColor = (row.final != null && row.final >= (row.max||100)/2) ? 'color:#047857;font-weight:900' : (row.final != null ? 'color:#DC2626;font-weight:900' : '');
          h += '<tr>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center">'+arNum(idx+1)+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:right;font-weight:bold">'+esc(row.name)+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center">'+(row.m1!=null?arNum(row.m1):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center">'+(row.m2!=null?arNum(row.m2):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center">'+(row.m3!=null?arNum(row.m3):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center">'+(row.m4!=null?arNum(row.m4):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center">'+(row.m5!=null?arNum(row.m5):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;background:#FEF3C7">'+(row.a1!=null?arNum(row.a1):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center">'+(row.half!=null?arNum(row.half):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;background:#FEF3C7">'+(row.a2!=null?arNum(row.a2):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;background:#FEF3C7">'+(row.annual!=null?arNum(row.annual):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center">'+(row.exam!=null?arNum(row.exam):'—')+'</td>';
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;'+finColor+'">'+(row.final!=null?arNum(row.final):'—')+'</td>';
          h += '</tr>';
        });
        h += '</tbody></table></div>';
      });
      h += '</div>';
    });
    el.innerHTML = h;
    
  }).catch(function(err){
    el.innerHTML = '<div class="empty">️ تعذر تحميل البيانات</div>';
  });
}

function showSummary(code){
  var t = ADM.tv;
  if(!t) return;
  api({action:'teacherGrades', key:key(), code:code}).then(function(r){
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

function printTView(){
  var el = $('#tvBox');
  if(!el) return;
  var h = '<div style="font-family:Tajawal;width:190mm;margin:0 auto;padding:10mm">';
  h += '<h2 style="text-align:center;color:#1E40AF;margin-bottom:20px">كشف درجات: '+esc(ADM.tv?ADM.tv.name:'')+'</h2>';
  h += el.innerHTML;
  h += '</div>';
  printWin(h);
}
