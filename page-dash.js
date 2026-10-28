/* ═══ page-dash.js — الرئيسية (محدث: مستطيل عريض + بطاقات محسنة + طباعة عمودية بخطوط كبيرة) ══ */
var currentPrintData = null;
window.DASH_TEACHERS = [];

registerPage('dash', {
  enter: function() { loadDashData(); },
  silent: function() { loadDashData(true); }
});

/* ═══ التصميم ═══ */
(function(){
  if(document.getElementById('dashProStyles')) return;
  var s = document.createElement('style'); 
  s.id = 'dashProStyles';
  s.textContent = 
  '#dashKpi{margin-bottom:20px;width:100%}'+
  
  /* ══ المستطيل العريض لمعلومات الحسابات ══ */
  '#dashKpi .stats-rect{display:grid !important;grid-template-columns:repeat(5,1fr) !important;gap:16px !important;padding:24px !important;border-radius:20px !important;background:linear-gradient(135deg,#0f172a,#1e3a8a) !important;color:#fff !important;box-shadow:0 12px 32px rgba(15,23,42,.18) !important;width:100% !important}'+
  '#dashKpi .stat-box{display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:center !important;padding:16px !important;background:rgba(255,255,255,.08) !important;border-radius:14px !important;border:1px solid rgba(255,255,255,.12) !important;backdrop-filter:blur(6px) !important;transition:.2s !important;min-height:110px !important}'+
  '#dashKpi .stat-box:hover{background:rgba(255,255,255,.14) !important;transform:translateY(-2px) !important}'+
  '#dashKpi .stat-icon{font-size:28px !important;width:48px !important;height:48px !important;display:grid !important;place-items:center !important;background:rgba(255,255,255,.15) !important;border-radius:12px !important;margin-bottom:8px !important}'+
  '#dashKpi .stat-num{font-size:26px !important;font-weight:900 !important;line-height:1 !important;color:#fff !important}'+
  '#dashKpi .stat-lbl{font-size:12px !important;opacity:.9 !important;font-weight:700 !important;margin-top:6px !important;text-align:center !important;color:rgba(255,255,255,.9) !important}'+
  '#dashKpi .progress-box{grid-column:span 1 !important;display:flex !important;flex-direction:column !important;justify-content:center !important}'+
  '#dashKpi .progress-top{display:flex !important;justify-content:space-between !important;font-size:11px !important;font-weight:700 !important;margin-bottom:8px !important;opacity:.9 !important}'+
  '#dashKpi .progress-track{height:10px !important;background:rgba(255,255,255,.15) !important;border-radius:99px !important;overflow:hidden !important}'+
  '#dashKpi .progress-fill{height:100% !important;background:linear-gradient(90deg,#34d399,#10b981) !important;border-radius:99px !important;transition:width .6s ease !important}'+
  '#dashKpi .health-badge{padding:8px 12px !important;border:1px solid rgba(255,255,255,.25) !important;background:rgba(255,255,255,.12) !important;border-radius:999px !important;font-size:11px !important;font-weight:800 !important;display:flex !important;align-items:center !important;justify-content:center !important;gap:6px !important;white-space:nowrap !important;margin-top:auto !important}'+
  '#dashKpi .health-dot{display:inline-block !important;width:8px !important;height:8px !important;border-radius:50% !important;background:#34d399 !important;box-shadow:0 0 0 4px rgba(52,211,153,.2) !important;animation:pulse 2s infinite !important}'+
  '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}'+
  
  /* ══ بطاقات المعلمين المحسنة ══ */
  '#dashList .dash-pro-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:10px 0 16px;flex-wrap:wrap}'+
  '#dashList .dash-pro-title{font-size:22px;font-weight:900;color:#0f172a}'+
  '#dashList .dash-pro-sub{margin-top:4px;font-size:13px;color:#64748b}'+
  '#dashList .dash-pro-count{padding:8px 14px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:900;white-space:nowrap}'+
  '#dashList .dash-pro-teachers{display:grid;grid-template-columns:1fr;gap:16px}'+
  '#dashList .dash-pro-teacher{position:relative;overflow:hidden;border-radius:20px;padding:20px;box-shadow:0 10px 30px rgba(15,23,42,.12);transition:.25s;color:#fff}'+
  '#dashList .dash-pro-teacher:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(0,0,0,.18)}'+
  '#dashList .dash-pro-top{display:flex;align-items:center;gap:14px;margin-bottom:14px}'+
  '#dashList .dash-pro-avatar{width:60px;height:60px;display:grid;place-items:center;border-radius:16px;font-size:28px;font-weight:900;flex:none;box-shadow:0 6px 16px rgba(0,0,0,.15);background:rgba(255,255,255,.95)}'+
  '#dashList .dash-pro-main{min-width:0;flex:1}'+
  '#dashList .dash-pro-name{font-size:19px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.2);white-space:normal;word-wrap:break-word;overflow-wrap:break-word;line-height:1.3;margin-bottom:4px}'+
  '#dashList .dash-pro-code{font-size:12px;color:rgba(255,255,255,.9);font-family:monospace;font-weight:700}'+
  '#dashList .dash-pro-status{font-size:11px;font-weight:900;padding:7px 12px;border-radius:999px;white-space:nowrap;background:rgba(255,255,255,.95);box-shadow:0 2px 8px rgba(0,0,0,.1)}'+
  '#dashList .dash-pro-status.open{color:#047857}'+
  '#dashList .dash-pro-status.locked{color:#dc2626}'+
  
  /* قسم الشعب والمواد داخل البطاقة */
  '#dashList .dash-classes-section{background:rgba(255,255,255,.15);border-radius:14px;padding:14px;margin-top:14px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15)}'+
  '#dashList .dash-classes-title{font-size:12px;font-weight:800;color:rgba(255,255,255,.9);margin-bottom:10px;display:flex;align-items:center;gap:6px}'+
  '#dashList .dash-class-item{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,.12);border-radius:10px;margin-bottom:6px;font-size:12px;transition:.2s}'+
  '#dashList .dash-class-item:hover{background:rgba(255,255,255,.2)}'+
  '#dashList .dash-class-item:last-child{margin-bottom:0}'+
  '#dashList .dash-class-name{font-weight:800;color:#fff;display:flex;align-items:center;gap:6px;flex:1;min-width:0}'+
  '#dashList .dash-class-stats{display:flex;gap:10px;align-items:center;flex-shrink:0}'+
  '#dashList .dash-class-open-btn{padding:6px 10px;background:rgba(255,255,255,.9);color:#1d4ed8;border-radius:8px;font-size:10px;font-weight:800;cursor:pointer;border:none;transition:.2s;white-space:nowrap}'+
  '#dashList .dash-class-open-btn:hover{background:#fff;transform:scale(1.05)}'+
  
  /* معلومات إضافية */
  '#dashList .dash-pro-meta{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}'+
  '#dashList .dash-pro-meta-item{padding:7px 12px;border-radius:11px;background:rgba(255,255,255,.2);font-size:12px;color:#fff;font-weight:700;display:flex;align-items:center;gap:5px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15)}'+
  
  /* الإحصائيات السفلية للبطاقة */
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
  
  /* ══ تنسيق جدول الدرجات - خط أسود واضح ══ */
  '.grades-table{width:100%;border-collapse:collapse;font-size:14px}'+
  '.grades-table th,.grades-table td{padding:8px 10px;border:1.5px solid #334155;text-align:center;color:#0f172a;font-weight:700}'+
  '.grades-table th{background:#1E40AF;color:#fff;font-weight:900;font-size:13px}'+
  '.grades-table td.name-cell{text-align:right;font-weight:900;color:#0f172a;min-width:180px;max-width:220px;white-space:normal;word-wrap:break-word}'+
  '.grades-table td.num-cell{background:#f1f5f9;font-weight:900}'+
  '.grades-table td.avg-cell{background:#FEF3C7;font-weight:900;color:#92400e}'+
  '.grades-table td.pass-cell{color:#047857;font-weight:900}'+
  '.grades-table td.fail-cell{color:#DC2626;font-weight:900}'+
  
  '@media(max-width:768px){'+
  '#dashKpi .stats-rect{grid-template-columns:repeat(2,1fr) !important}'+
  '#dashKpi .progress-box{grid-column:span 2 !important}'+
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

    // ══ المستطيل العريض بدلاً من الشريط ══
    if(kpiEl){
      kpiEl.innerHTML =
        '<div class="stats-rect">' +
          '<div class="stat-box"><div class="stat-icon">👨🏫</div><div class="stat-num">'+arNum(total)+'</div><div class="stat-lbl">إجمالي المعلمين</div></div>' +
          '<div class="stat-box"><div class="stat-icon">🟢</div><div class="stat-num">'+arNum(open)+'</div><div class="stat-lbl">فتح حسابه</div></div>' +
          '<div class="stat-box"><div class="stat-icon">🔒</div><div class="stat-num">'+arNum(locked)+'</div><div class="stat-lbl">لم يفتحه</div></div>' +
          '<div class="stat-box"><div class="stat-icon"></div><div class="stat-num">'+arNum(totalSent)+'</div><div class="stat-lbl">درجات مرسلة</div></div>' +
          '<div class="stat-box progress-box">' +
            '<div class="progress-top"><span>نسبة الحسابات النشطة</span><b>'+arNum(activeRate)+'%</b></div>' +
            '<div class="progress-track"><div class="progress-fill" style="width:'+activeRate+'%"></div></div>' +
            '<div class="health-badge"><span class="health-dot"></span>النظام متصل</div>' +
          '</div>' +
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
        {gradient:'linear-gradient(135deg, #06b6d4, #0e7490)', accent:'#0e7490'}
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
        h += '<div class="dash-pro-code">🔑 '+esc(t.code)+'</div>';
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
            h += '<div class="dash-class-name">📖 '+esc(cd.subject)+' — '+esc(cd.name)+'</div>';
            h += '<div class="dash-class-stats">';
            h += '<button class="dash-class-open-btn" onclick="event.stopPropagation();viewTeacherSubject(\''+escA(t.code)+'\',\''+escA(cd.subject)+'\',\''+escA(cd.name)+'\')">📊 عرض الدرجات</button>';            h += '</div>';
            h += '</div>';
          });
          h += '</div>';
        } else {
          h += '<div class="dash-classes-section"><div class="dash-classes-title">🏫 لا توجد شعب مسجلة</div></div>';
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
    var msg = '️ تعذر الاتصال بالخادم';
    if (err.message === 'no-url') msg = ' رابط الخادم مفقود';
    else if (err.name === 'AbortError') msg = '⏱ انتهت مهلة الاتصال';
    if(!silent) toast(msg, 'err');
    if(kpiEl) kpiEl.innerHTML = '<div class="empty">'+msg+'</div>';
  });
}

// ══ دالة عرض درجات مادة وشعبة محددة ══
// ✅ دالة عرض درجات معلم لشعبة معينة (مرتبة حسب قائمة التلاميذ الرسمية)
// ✅ دالة عرض درجات معلم لشعبة معينة (3 معاملات)
// ✅ دالة عرض درجات معلم - مع أرقام عربية وتنسيق محسّن
function viewTeacherSubject(teacherCode, subject, cls) {
  var teacherName = '';
  if (typeof allTeachers !== 'undefined') {
    var t = allTeachers.find(function(x) { return x.code === teacherCode; });
    if (t) teacherName = t.name;
  }
  
  console.log('📊 عرض درجات:', teacherCode, subject, cls);
  
  var modal = document.getElementById('teacherRecordModal');
  if (modal) {
    document.getElementById('trTeacherName').textContent = teacherName + ' | ' + subject + ' - ' + cls;
    document.getElementById('trTableContainer').style.display = 'none';
    document.getElementById('trLoading').style.display = 'block';
    document.getElementById('trEmpty').style.display = 'none';
    modal.classList.add('show');
    
    api({action: 'getStudents', code: teacherCode, cls: cls}).then(function(studentsRes) {
      console.log('📋 قائمة التلاميذ:', studentsRes);
      
      if (!studentsRes.ok || !studentsRes.names || studentsRes.names.length === 0) {
        document.getElementById('trLoading').style.display = 'none';
        document.getElementById('trEmpty').style.display = 'block';
        document.getElementById('trEmpty').textContent = '⚠️ لا توجد قائمة تلاميذ لـ ' + cls;
        return;
      }
      
      api({action: 'teacherGrades', code: teacherCode}).then(function(gradesRes) {
        console.log('📊 درجات المعلم:', gradesRes);
        document.getElementById('trLoading').style.display = 'none';
        
        if (!gradesRes.ok || !gradesRes.rows) {
          document.getElementById('trEmpty').style.display = 'block';
          document.getElementById('trEmpty').textContent = 'لا توجد درجات';
          return;
        }
        
        var gradesMap = {};
        gradesRes.rows.forEach(function(row) {
          if (row.subject === subject && row.cls === cls) {
            gradesMap[row.name.trim()] = row;
          }
        });
        
        var orderedRows = [];
        studentsRes.names.forEach(function(name) {
          var cleanName = name.trim();
          var g = gradesMap[cleanName];
          if (g) {
            orderedRows.push(g);
          } else {
            orderedRows.push({
              name: cleanName,
              m1: null, m2: null, m3: null, a1: null, half: null,
              m4: null, m5: null, a2: null, annual: null, exam: null, final: null, max: 100
            });
          }
        });

// حفظ البيانات للطباعة
window.currentPrintData = {
  teacherName: teacherName,
  subject: subject,
  cls: cls,
  rows: orderedRows
};
console.log('✅ تم حفظ البيانات للطباعة:', window.currentPrintData);
        
        var tbody = document.getElementById('trTableBody');
        tbody.innerHTML = '';
        
        // ✅ دالة مساعدة لتحويل الأرقام إلى عربية
        function toArNum(val) {
          if (val === null || val === undefined || val === '') return '';
          return String(val).replace(/\d/g, function(d) {
            return '٠١٢٣٤٥٦٧٨٩'[parseInt(d)];
          });
        }
        
        orderedRows.forEach(function(row, idx) {
          var tr = document.createElement('tr');
          tr.innerHTML = 
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:bold;font-size:13pt;color:#000;">' + toArNum(idx + 1) + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:right;font-weight:900;font-size:12pt;color:#000;padding-right:8px;">' + row.name + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:bold;font-size:12pt;color:#000;">' + toArNum(row.m1 != null ? row.m1 : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:bold;font-size:12pt;color:#000;">' + toArNum(row.m2 != null ? row.m2 : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:bold;font-size:12pt;color:#000;">' + toArNum(row.m3 != null ? row.m3 : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:900;font-size:13pt;color:#000;background:#f0f9ff;">' + toArNum(row.a1 != null ? row.a1 : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:900;font-size:13pt;color:#000;background:#f0fdf4;">' + toArNum(row.half != null ? row.half : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:bold;font-size:12pt;color:#000;">' + toArNum(row.m4 != null ? row.m4 : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:bold;font-size:12pt;color:#000;">' + toArNum(row.m5 != null ? row.m5 : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:900;font-size:13pt;color:#000;background:#f0f9ff;">' + toArNum(row.a2 != null ? row.a2 : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:900;font-size:13pt;color:#000;background:#fef3c7;">' + toArNum(row.annual != null ? row.annual : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:bold;font-size:12pt;color:#000;">' + toArNum(row.exam != null ? row.exam : '') + '</td>' +
            '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:900;font-size:14pt;color:#000;background:#fce7f3;">' + toArNum(row.final != null ? row.final : '') + '</td>';
          tbody.appendChild(tr);
        });
        // حفظ البيانات للطباعة
currentPrintData = {
  teacherName: teacherName,
  subject: subject,
  cls: cls,
  rows: orderedRows
};
        
        document.getElementById('trTableContainer').style.display = 'block';
        
      }).catch(function(e) {
        console.error(' خطأ في جلب الدرجات:', e);
        document.getElementById('trLoading').style.display = 'none';
        document.getElementById('trEmpty').style.display = 'block';
        document.getElementById('trEmpty').textContent = '⚠️ تعذر جلب الدرجات';
      });
    }).catch(function(e) {
      console.error('❌ خطأ في جلب قائمة التلاميذ:', e);
      document.getElementById('trLoading').style.display = 'none';
      document.getElementById('trEmpty').style.display = 'block';
      document.getElementById('trEmpty').textContent = '⚠️ تعذر جلب قائمة التلاميذ';
    });
  }
}
// ══ دالة تحميل درجات مادة وشعبة محددة ══
function loadTeacherViewFiltered(code, subject, cls) {
  var el = $('#tvBox');
  if(!el) return;
  el.innerHTML = '<div class="empty"> جاري التحميل...</div>';
  
  api({action:'teacherGrades', key:key(), code:code}).then(function(r){
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

// ══ دالة قفل/فتح حساب المعلم ═
function toggleTeacherLock(code, lock) {
  var action = lock ? 'قفل' : 'فتح';
  var msg = lock ? 'هل أنت متأكد من قفل حساب هذا المعلم؟' : 'هل أنت متأكد من فتح حساب هذا المعلم؟';
  
  confirmDlg(msg + '\n\nالكود: ' + code, function() {
    api({action: 'toggleLock', key: key(), code: code}, 15000).then(function(r) {
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
  var q=(value||'').toLowerCase().trim();
  var grid=document.getElementById('dashTeacherGrid');
  if(!grid) return;
  var active=document.querySelector('#dashList .dash-filter.active');
  var filter=active ? active.getAttribute('data-filter') : 'all';
  var items=grid.querySelectorAll('.dash-pro-teacher');
  var shown=0;
  items.forEach(function(el){
    var text=(el.getAttribute('data-search')||'').toLowerCase();
    var status=el.getAttribute('data-status');
    var ok=(filter==='all'||status===filter) && (!q||text.indexOf(q)!==-1);
    el.style.display=ok?'':'none';
    if(ok) shown++;
  });
  var empty=document.getElementById('dashNoResults');
  if(empty) empty.style.display=shown?'none':'block';
}

function setDashTeacherFilter(filter, btn){
  var box=document.getElementById('dashList');
  if(!box) return;
  box.querySelectorAll('.dash-filter').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  var input=document.getElementById('dashTeacherSearch');
  filterDashTeachers(input ? input.value : '');
}

function viewTeacher(code){
  var t = (window.DASH_TEACHERS || []).find(function(x){return x.code===code;});
  if(!t) return;
  ADM.tv = t;
  $('#tvName').textContent = t.name;
  var subjText = '—';
  if(t.subjects && t.subjects.length > 0) {
    subjText = t.subjects.map(function(s){return s.name;}).join('، ');
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
  
  api({action:'teacherGrades', key:key(), code:code}).then(function(r){
    if(!r.ok){ toast('❌ '+r.error, 'err'); el.innerHTML = '<div class="empty">❌ '+r.error+'</div>'; return; }
    var rows = r.rows || [];
    if(!rows.length){ el.innerHTML = '<div class="empty">📭 لا توجد درجات لهذا المعلم</div>'; return; }
    
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
        h += '<h4 style="margin:10px 0;color:#047857">📘 '+esc(subj)+'</h4>';
        h += '<div style="overflow-x:auto"><table class="grades-table">';
        h += '<thead><tr>';
        h += '<th style="width:40px">ت</th>';
        h += '<th style="min-width:200px;max-width:250px">اسم التلميذ</th>';
        h += '<th>ت١</th><th>ت٢</th><th>ك١</th><th>آذار</th><th>نيسان</th>';
        h += '<th>معدل ف١</th><th>نصف السنة</th><th>معدل ف٢</th>';
        h += '<th>السعي</th><th>النهاية</th><th>النهائية</th>';
        h += '</tr></thead><tbody>';
        
        var subjRows = byCls[cls][subj];
        subjRows.forEach(function(row, idx){
          var finColor = (row.final != null && row.final >= (row.max||100)/2) ? 'pass-cell' : (row.final != null ? 'fail-cell' : '');
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
          h += '<td class="'+finColor+'">'+(row.final!=null?arNum(row.final):'—')+'</td>';
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

// ═ دالة الطباعة المحسنة (ورقة عمودية + خطوط كبيرة واضحة) ══
function printTView(){
  var el = $('#tvBox');
  if(!el) return;
  
  var title = 'كشف درجات: '+esc(ADM.tv?ADM.tv.name:'');
  var ctEl = el.querySelector('.ct');
  if(ctEl) {
    title += ' — ' + ctEl.textContent.trim();
  }
  
  // بناء HTML مع CSS مدمج للطباعة - ورقة عمودية وخطوط كبيرة
  var h = '<!DOCTYPE html><html dir="rtl" lang="ar"><head>';
  h += '<meta charset="UTF-8">';
  h += '<title>'+title+'</title>';
  h += '<style>';
  // ✅ تغيير الورقة إلى عمودية (portrait) بدلاً من أفقية
  h += '@page { size: A4 portrait; margin: 12mm; }';
  h += 'body { font-family: "Tajawal", Arial, sans-serif; margin: 0; padding: 12mm; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  // ✅ تكبير حجم العنوان
  h += 'h2 { text-align: center; color: #1E40AF; border-bottom: 3px solid #1E40AF; padding-bottom: 12px; margin-bottom: 20px; font-size: 24px; font-weight: 900; }';
  h += 'table { width: 100%; border-collapse: collapse; }';
  // ✅ تكبير الخطوط في الجدول (من 11px إلى 14px)
  h += 'th, td { padding: 10px 8px; border: 2px solid #334155; text-align: center; font-size: 14px; font-weight: 700; color: #0f172a; }';
  // ✅ تكبير خط العنوان
  h += 'th { background: #1E40AF !important; color: #fff !important; font-weight: 900; font-size: 13px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  // ✅ تكبير عمود اسم التلميذ
  h += 'td.name-cell { text-align: right; font-weight: 900; min-width: 220px; max-width: 280px; white-space: normal; word-wrap: break-word; font-size: 15px; }';
  h += 'td.num-cell { background: #f1f5f9 !important; font-weight: 900; font-size: 15px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += 'td.avg-cell { background: #FEF3C7 !important; font-weight: 900; color: #92400e; font-size: 15px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += 'td.pass-cell { color: #047857 !important; font-weight: 900; font-size: 15px; }';
  h += 'td.fail-cell { color: #DC2626 !important; font-weight: 900; font-size: 15px; }';
  h += '.print-footer { margin-top: 25px; text-align: center; font-size: 12px; color: #666; border-top: 2px solid #e5e7eb; padding-top: 12px; }';
  h += '</style></head><body>';
  
  h += '<h2>'+title+'</h2>';
  
  // نسخ الجدول الحالي من الصفحة كما هو تماماً
  var table = el.querySelector('table');
  if(table) {
    h += table.outerHTML;
  }
  
  h += '<div class="print-footer">';
  h += 'تم الطباعة بتاريخ: '+new Date().toLocaleDateString('ar-IQ')+' '+new Date().toLocaleTimeString('ar-IQ');
  h += '</div>';
  h += '</body></html>';
  
  var printWindow = window.open('', '_blank');
  if(!printWindow) {
    toast('⚠️ يرجى السماح بفتح النوافذ المنبثقة للطباعة', 'err');
    return;
  }
  
  printWindow.document.write(h);
  printWindow.document.close();
  printWindow.focus();
  
  // انتظار تحميل الخطوط ثم الطباعة
  setTimeout(function(){ 
    printWindow.print(); 
    setTimeout(function(){ printWindow.close(); }, 500);
  }, 300);
}
