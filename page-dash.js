/* ═══ page-dash.js — الصفحة الرئيسية (محدث واحترافي) ═══ */

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
  '#dashKpi{margin-bottom:20px}'+
  
  /* شريط الإحصائيات الأفقي */
  '#dashKpi .stats-bar{display:flex;align-items:center;gap:20px;padding:20px 24px;border-radius:20px;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;box-shadow:0 12px 30px rgba(15,23,42,.18);flex-wrap:wrap}'+
  '#dashKpi .stats-bar .stat-item{display:flex;align-items:center;gap:10px;padding:10px 16px;background:rgba(255,255,255,.1);border-radius:14px;border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(6px);min-width:140px}'+
  '#dashKpi .stats-bar .stat-icon{font-size:28px;width:40px;height:40px;display:grid;place-items:center;background:rgba(255,255,255,.15);border-radius:12px}'+
  '#dashKpi .stats-bar .stat-info{display:flex;flex-direction:column}'+
  '#dashKpi .stats-bar .stat-num{font-size:24px;font-weight:900;line-height:1}'+
  '#dashKpi .stats-bar .stat-lbl{font-size:11px;opacity:.85;font-weight:700;margin-top:3px}'+
  '#dashKpi .stats-bar .progress-wrap{flex:1;min-width:200px;padding:10px 16px;background:rgba(255,255,255,.1);border-radius:14px;border:1px solid rgba(255,255,255,.15)}'+
  '#dashKpi .stats-bar .progress-top{display:flex;justify-content:space-between;font-size:11px;font-weight:700;margin-bottom:6px;opacity:.9}'+
  '#dashKpi .stats-bar .progress-track{height:10px;background:rgba(255,255,255,.15);border-radius:99px;overflow:hidden}'+
  '#dashKpi .stats-bar .progress-fill{height:100%;background:linear-gradient(90deg,#34d399,#10b981);border-radius:99px;transition:width .6s ease}'+
  '#dashKpi .health-badge{padding:9px 14px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.12);border-radius:999px;font-size:12px;font-weight:800;display:flex;align-items:center;gap:7px;white-space:nowrap}'+
  '#dashKpi .health-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#34d399;box-shadow:0 0 0 4px rgba(52,211,153,.2);animation:pulse 2s infinite}'+
  '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}'+
  
  /* بطاقات المعلمين - عرض كامل */
  '#dashList .dash-pro-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:10px 0 16px;flex-wrap:wrap}'+
  '#dashList .dash-pro-title{font-size:22px;font-weight:900;color:#0f172a}'+
  '#dashList .dash-pro-sub{margin-top:4px;font-size:13px;color:#64748b}'+
  '#dashList .dash-pro-count{padding:8px 14px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:900;white-space:nowrap}'+
  '#dashList .dash-pro-teachers{display:grid;grid-template-columns:1fr;gap:16px}'+
  '#dashList .dash-pro-teacher{position:relative;overflow:hidden;border-radius:22px;padding:22px;box-shadow:0 10px 30px rgba(15,23,42,.12);cursor:pointer;transition:.25s;color:#fff}'+
  '#dashList .dash-pro-teacher:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(0,0,0,.18)}'+
  '#dashList .dash-pro-top{display:flex;align-items:center;gap:14px;margin-bottom:14px}'+
  '#dashList .dash-pro-avatar{width:64px;height:64px;display:grid;place-items:center;border-radius:18px;font-size:30px;font-weight:900;flex:none;box-shadow:0 6px 16px rgba(0,0,0,.15);background:rgba(255,255,255,.95)}'+
  '#dashList .dash-pro-main{min-width:0;flex:1}'+
  '#dashList .dash-pro-name{font-size:20px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.2);white-space:normal;word-wrap:break-word;overflow-wrap:break-word;line-height:1.3;margin-bottom:4px}'+
  '#dashList .dash-pro-code{font-size:13px;color:rgba(255,255,255,.9);font-family:monospace;font-weight:700}'+
  '#dashList .dash-pro-status{font-size:12px;font-weight:900;padding:8px 14px;border-radius:999px;white-space:nowrap;background:rgba(255,255,255,.95);box-shadow:0 2px 8px rgba(0,0,0,.1)}'+
  '#dashList .dash-pro-status.open{color:#047857}'+
  '#dashList .dash-pro-status.locked{color:#dc2626}'+
  
  /* قسم الشعب والطلاب */
  '#dashList .dash-classes-section{background:rgba(255,255,255,.15);border-radius:14px;padding:14px;margin-top:14px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15)}'+
  '#dashList .dash-classes-title{font-size:12px;font-weight:800;color:rgba(255,255,255,.9);margin-bottom:10px;display:flex;align-items:center;gap:6px}'+
  '#dashList .dash-class-item{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(255,255,255,.12);border-radius:10px;margin-bottom:6px;font-size:12px}'+
  '#dashList .dash-class-item:last-child{margin-bottom:0}'+
  '#dashList .dash-class-name{font-weight:800;color:#fff;display:flex;align-items:center;gap:6px}'+
  '#dashList .dash-class-stats{display:flex;gap:12px;align-items:center}'+
  '#dashList .dash-class-stat{font-size:11px;color:rgba(255,255,255,.9);font-weight:700}'+
  '#dashList .dash-class-stat b{color:#fff;font-size:13px;margin-right:3px}'+
  
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
  
  '@media(max-width:768px){'+
  '#dashKpi .stats-bar{flex-direction:column;gap:10px}'+
  '#dashKpi .stats-bar .stat-item{width:100%;min-width:auto}'+
  '#dashKpi .stats-bar .progress-wrap{width:100%}'+
  '#dashList .dash-pro-info{grid-template-columns:repeat(2,1fr)}'+
  '#dashList .dash-pro-name{font-size:18px!important}'+
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
    var avgSent = total ? Math.round(totalSent / total) : 0;

    // شريط الإحصائيات الأفقي المدمج
    if(kpiEl){
      kpiEl.innerHTML =
        '<div class="stats-bar">' +
          '<div class="stat-item"><div class="stat-icon">👨‍</div><div class="stat-info"><span class="stat-num">'+arNum(total)+'</span><span class="stat-lbl">إجمالي المعلمين</span></div></div>' +
          '<div class="stat-item"><div class="stat-icon">🟢</div><div class="stat-info"><span class="stat-num">'+arNum(open)+'</span><span class="stat-lbl">حسابات مفتوحة</span></div></div>' +
          '<div class="stat-item"><div class="stat-icon"></div><div class="stat-info"><span class="stat-num">'+arNum(locked)+'</span><span class="stat-lbl">حسابات مقفلة</span></div></div>' +
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
                '<div><div class="dash-pro-title">👥 قائمة المعلمين</div><div class="dash-pro-sub">إدارة الحسابات ومتابعة النشاط والدرجات المرسلة</div></div>' +
                '<div class="dash-pro-count"> '+arNum(total)+' معلم</div>' +
              '</div>' +
              '<div class="dash-pro-toolbar">' +
                '<div class="dash-pro-search"><span></span><input id="dashTeacherSearch" type="search" placeholder="ابحث باسم المعلم أو الكود..." oninput="filterDashTeachers(this.value)"></div>' +
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
        
        // جمع بيانات الشعب والطلاب
        var classesData = [];
        var totalClasses = 0;
        var totalStudents = 0;
        
        if(t.subjects) {
          t.subjects.forEach(function(subj){
            if(subj.classes) {
              subj.classes.forEach(function(cls){
                totalClasses++;
                classesData.push({
                  name: cls,
                  subject: subj.name,
                  students: 0 // سيتم تحديثه لاحقاً
                });
              });
            }
          });
        }
        totalStudents = t.sentCount || 0;
        
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
        
        // الرأس
        h += '<div class="dash-pro-top">';
        h += '<div class="dash-pro-avatar" style="color:'+theme.accent+'">'+esc((t.name||'?').trim().charAt(0))+'</div>';
        h += '<div class="dash-pro-main" style="flex:1;min-width:0">';
        h += '<div class="dash-pro-name">'+esc(t.name)+'</div>';
        h += '<div class="dash-pro-code"> '+esc(t.code)+'</div>';
        h += '</div>';
        h += '<div class="dash-pro-status '+status+'">'+(t.locked?'🔒 مقفل':'🟢 مفتوح')+'</div>';
        h += '</div>';
        
        // المادة وتاريخ الإرسال
        h += '<div class="dash-pro-meta">';
        h += '<div class="dash-pro-meta-item">📚 '+esc(shortSubject)+'</div>';
        h += '<div class="dash-pro-meta-item">📅 آخر إرسال: '+lastSentDate+'</div>';
        h += '</div>';
        
        // قسم الشعب والطلاب
        if(classesData.length > 0) {
          h += '<div class="dash-classes-section">';
          h += '<div class="dash-classes-title">🏫 الشعب والطلاب ('+arNum(totalClasses)+' شعبة)</div>';
          classesData.forEach(function(cd){
            h += '<div class="dash-class-item">';
            h += '<div class="dash-class-name">📖 '+esc(cd.subject)+' - '+esc(cd.name)+'</div>';
            h += '<div class="dash-class-stats">';
            h += '<span class="dash-class-stat">الطلاب: <b>'+arNum(totalStudents)+'</b></span>';
            h += '<span class="dash-class-stat">المرسلة: <b>'+arNum(totalStudents)+'</b></span>';
            h += '</div>';
            h += '</div>';
          });
          h += '</div>';
        } else {
          h += '<div class="dash-classes-section">';
          h += '<div class="dash-classes-title">🏫 لا توجد شعب مسجلة</div>';
          h += '</div>';
        }
        
        // الإحصائيات
        h += '<div class="dash-pro-info">';
        h += '<div class="dash-pro-info-item"><span class="lbl">الدرجات المرسلة</span><span class="val">'+arNum(t.sentCount||0)+'</span></div>';
        h += '<div class="dash-pro-info-item"><span class="lbl">عدد الشعب</span><span class="val">'+arNum(totalClasses)+'</span></div>';
        h += '<div class="dash-pro-info-item"><span class="lbl">آخر دخول</span><span class="val small">'+esc(last)+'</span></div>';
        h += '<div class="dash-pro-info-item"><span class="lbl">الحالة</span><span class="val small">'+(t.locked?'مقفلة':'مفتوحة')+'</span></div>';
        h += '</div>';
        
        // أزرار الإجراءات
        h += '<div class="dash-pro-actions">';
        h += '<button class="dash-action-btn view" onclick="event.stopPropagation();viewTeacher(\''+escA(t.code)+'\')">📂 فتح الملف الكامل</button>';
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
    if (err.message === 'no-url') msg = '🔗 رابط الخادم مفقود';
    else if (err.name === 'AbortError') msg = '⏱ انتهت مهلة الاتصال';
    if(!silent) toast(msg, 'err');
    if(kpiEl) kpiEl.innerHTML = '<div class="empty">'+msg+'</div>';
  });
}

// دالة قفل/فتح حساب المعلم
function toggleTeacherLock(code, lock) {
  var action = lock ? 'قفل' : 'فتح';
  var msg = lock ? 'هل أنت متأكد من قفل حساب هذا المعلم؟' : 'هل أنت متأكد من فتح حساب هذا المعلم؟';
  
  confirmDlg(msg + '\n\nالكود: ' + code, function() {
    api({
      action: 'toggleLock',
      key: key(),
      code: code
    }).then(function(r) {
      if(r.ok) {
        toast('✓ تم ' + action + ' الحساب بنجاح', 'ok');
        loadDashData(); // إعادة تحميل البيانات
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
  el.innerHTML = '<div class="empty"> جاري التحميل...</div>';
  
  api({action:'teacherGrades', key:key(), code:code}).then(function(r){
    if(!r.ok){ toast('❌ '+r.error, 'err'); el.innerHTML = '<div class="empty">❌ '+r.error+'</div>'; return; }
    var rows = r.rows || [];
    if(!rows.length){ el.innerHTML = '<div class="empty"> لا توجد درجات مسجلة لهذا المعلم</div>'; return; }
    
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
