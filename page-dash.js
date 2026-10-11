/* ═══ page-dash.js — نظرة عامة (محدث) ═══ */

registerPage('dash', {
  enter: function() {
    loadDashData();
  },
  silent: function() {
    loadDashData(true);
  }
});


/* ═══ Dashboard Pro UI — لا يحتاج تعديل الملفات الأخرى ═══ */
(function(){
  if(document.getElementById('dashProStyles')) return;
  var s=document.createElement('style'); s.id='dashProStyles';
  s.textContent=
  '#dashKpi{margin-bottom:18px}'+
  '#dashKpi .dash-pro-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}'+
  '#dashKpi .dash-pro-card{position:relative;overflow:hidden;display:flex;align-items:center;gap:13px;min-height:94px;padding:16px 18px;border:1px solid #e5e7eb;border-radius:18px;background:linear-gradient(145deg,#fff,#f8fafc);box-shadow:0 8px 24px rgba(15,23,42,.07);transition:.22s}'+
  '#dashKpi .dash-pro-card:hover{transform:translateY(-3px);box-shadow:0 15px 32px rgba(15,23,42,.11)}'+
  '#dashKpi .dash-pro-card:before{content:"";position:absolute;right:0;top:0;bottom:0;width:4px;background:var(--accent)}'+
  '#dashKpi .dash-pro-icon{width:48px;height:48px;display:grid;place-items:center;border-radius:14px;background:var(--soft);font-size:21px;flex:none}'+
  '#dashKpi .dash-pro-value{font-size:27px;line-height:1;font-weight:900;color:#0f172a}'+
  '#dashKpi .dash-pro-label{margin-top:7px;font-size:12px;color:#64748b;font-weight:700}'+
  '#dashList .dash-pro-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:7px 0 14px}'+
  '#dashList .dash-pro-title{font-size:19px;font-weight:900;color:#0f172a}'+
  '#dashList .dash-pro-sub{margin-top:4px;font-size:12px;color:#64748b}'+
  '#dashList .dash-pro-count{padding:7px 11px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:900;white-space:nowrap}'+
  '#dashList .dash-pro-teachers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}'+
  '#dashList .dash-pro-teacher{position:relative;overflow:hidden;border:1px solid #e5e7eb;border-radius:18px;background:#fff;padding:16px;box-shadow:0 6px 20px rgba(15,23,42,.055);cursor:pointer;transition:.22s}'+
  '#dashList .dash-pro-teacher:before{content:"";position:absolute;right:0;top:0;bottom:0;width:4px;background:var(--accent)}'+
  '#dashList .dash-pro-teacher:hover{transform:translateY(-3px);border-color:#cbd5e1;box-shadow:0 15px 30px rgba(15,23,42,.10)}'+
  '#dashList .dash-pro-top{display:flex;align-items:center;gap:11px}'+
  '#dashList .dash-pro-avatar{width:46px;height:46px;display:grid;place-items:center;border-radius:14px;background:linear-gradient(135deg,var(--accent),#0f172a);color:#fff;font-size:19px;font-weight:900;flex:none}'+
  '#dashList .dash-pro-main{min-width:0;flex:1}'+
  '#dashList .dash-pro-name{font-size:15px;font-weight:900;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
  '#dashList .dash-pro-code{margin-top:5px;color:#64748b;font:11px/1.2 monospace}'+
  '#dashList .dash-pro-status{font-size:10px;font-weight:900;padding:6px 9px;border-radius:999px;white-space:nowrap}'+
  '#dashList .dash-pro-status.open{color:#047857;background:#ecfdf5}'+
  '#dashList .dash-pro-status.locked{color:#dc2626;background:#fef2f2}'+
  '#dashList .dash-pro-stats{display:grid;grid-template-columns:1.35fr 1fr 1fr;gap:8px;margin-top:15px;padding-top:13px;border-top:1px solid #eef2f7}'+
  '#dashList .dash-pro-stats span{display:block;color:#94a3b8;font-size:10px;margin-bottom:4px}'+
  '#dashList .dash-pro-stats b{display:block;color:#334155;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
  '#dashList .dash-pro-open{display:flex;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px dashed #e2e8f0;color:#2563eb;font-size:11px;font-weight:800}'+
  '#dashList .dash-pro-open span{font-size:16px;transition:.2s}'+
  '#dashList .dash-pro-teacher:hover .dash-pro-open span{transform:translateX(-4px)}'+
  '@media(max-width:900px){#dashKpi .dash-pro-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#dashList .dash-pro-teachers{grid-template-columns:1fr}}'+
  
    '#dashKpi .dash-pro-shell{padding:2px 0}'+
    '#dashKpi .dash-pro-welcome{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:16px;padding:18px 20px;border-radius:20px;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;box-shadow:0 12px 28px rgba(15,23,42,.13)}'+
    '#dashKpi .dash-pro-eyebrow{font-size:10px;opacity:.7;font-weight:800;margin-bottom:3px}'+
    '#dashKpi .dash-pro-heading{font-size:23px;font-weight:950}'+
    '#dashKpi .dash-pro-desc{font-size:11px;opacity:.78;margin-top:5px}'+
    '#dashKpi .dash-pro-health{padding:8px 11px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.09);border-radius:999px;font-size:10px;font-weight:800;white-space:nowrap}'+
    '#dashKpi .dash-pro-health-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#34d399;margin-left:6px;box-shadow:0 0 0 4px rgba(52,211,153,.12)}'+
    '#dashKpi .dash-pro-card{min-height:103px}'+
    '#dashKpi .dash-pro-card.blue{--accent:#2563eb;--soft:#eff6ff}.dash-pro-card.green{--accent:#10b981;--soft:#ecfdf5}.dash-pro-card.red{--accent:#ef4444;--soft:#fef2f2}.dash-pro-card.amber{--accent:#f59e0b;--soft:#fffbeb}'+
    '#dashKpi .dash-pro-mini{font-size:9px;color:#94a3b8;margin-top:6px}'+
    '#dashKpi .dash-pro-progress{margin-top:12px;padding:13px 15px;border:1px solid #e5e7eb;border-radius:15px;background:#fff;box-shadow:0 5px 16px rgba(15,23,42,.04)}'+
    '#dashKpi .dash-pro-progress>div:first-child{display:flex;justify-content:space-between;color:#64748b;font-size:10px;font-weight:700;margin-bottom:8px}'+
    '#dashKpi .dash-pro-progress b{color:#1d4ed8}'+
    '#dashKpi .dash-pro-track{height:7px;background:#e2e8f0;border-radius:99px;overflow:hidden}'+
    '#dashKpi .dash-pro-track i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#2563eb,#60a5fa);transition:width .5s ease}'+
    '#dashList .dash-pro-toolbar{display:flex;gap:10px;align-items:center;justify-content:space-between;margin-bottom:13px}'+
    '#dashList .dash-pro-search{display:flex;align-items:center;gap:7px;flex:1;max-width:430px;padding:0 12px;border:1px solid #e2e8f0;border-radius:13px;background:#fff;box-shadow:0 4px 12px rgba(15,23,42,.035)}'+
    '#dashList .dash-pro-search span{font-size:20px;color:#94a3b8}'+
    '#dashList .dash-pro-search input{width:100%;border:0;outline:0;background:transparent;padding:11px 0;color:#334155;font:inherit;font-size:11px}'+
    '#dashList .dash-pro-filters{display:flex;gap:5px;padding:4px;border-radius:13px;background:#f1f5f9}'+
    '#dashList .dash-filter{border:0;background:transparent;color:#64748b;padding:7px 10px;border-radius:9px;font-size:10px;font-weight:800;cursor:pointer}'+
    '#dashList .dash-filter.active{background:#fff;color:#1d4ed8;box-shadow:0 2px 7px rgba(15,23,42,.08)}'+
    '#dashList .dash-pro-noresults{padding:28px;text-align:center;border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;color:#64748b;font-size:12px;font-weight:800}'+
'
@media(max-width:520px){
#dashKpi .dash-pro-welcome{padding:14px;border-radius:16px}.dash-pro-heading{font-size:19px!important}.dash-pro-desc{font-size:9px!important}.dash-pro-health{font-size:9px!important;padding:6px 8px!important}
#dashList .dash-pro-toolbar{display:block}.dash-pro-search{max-width:none!important;margin-bottom:8px}.dash-pro-filters{width:max-content}
#dashList .dash-pro-teachers{gap:10px}
#dashKpi .dash-pro-grid{gap:9px}#dashKpi .dash-pro-card{min-height:80px;padding:12px}.dash-pro-icon{width:40px!important;height:40px!important}.dash-pro-value{font-size:22px!important}}';
  document.head.appendChild(s);
})();

function loadDashData(silent) {
  var kpiEl = $('#dashKpi');
  var listEl = $('#dashList');
  
  if (!silent) {
    if (kpiEl) kpiEl.innerHTML = '<div class="empty"> جاري التحميل...</div>';
    if (listEl) listEl.innerHTML = '';
  }
  
  // اختبار الاتصال أولاً
  if (!url()) {
    var msg = '⚠️ رابط الخادم غير موجود في config.js';
    if (!silent) toast(msg, 'err');
    if (kpiEl) kpiEl.innerHTML = '<div class="empty">'+msg+'</div>';
    if (listEl) listEl.innerHTML = '';
    return;
  }
  
  api({action:'adminData', key:key()}, 15000).then(function(r){
    if(!r.ok){ 
      var errMsg = '❌ ' + (r.error || 'خطأ غير معروف');
      if(!silent) toast(errMsg, 'err');
      if(kpiEl) kpiEl.innerHTML = '<div class="empty">'+errMsg+'</div>';
      console.error('Dashboard Error:', r.error);
      return; 
    }
    
    var teachers = r.teachers || [];
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
            '<div><div class="dash-pro-eyebrow">لوحة الإدارة</div><div class="dash-pro-heading">نظرة عامة</div><div class="dash-pro-desc">متابعة المعلمين والحسابات والدرجات من مكان واحد</div></div>' +
            '<div class="dash-pro-health"><span class="dash-pro-health-dot"></span>النظام متصل</div>' +
          '</div>' +
          '<div class="dash-pro-grid">' +
            '<div class="dash-pro-card blue"><div class="dash-pro-icon">👨‍🏫</div><div><div class="dash-pro-value">'+arNum(total)+'</div><div class="dash-pro-label">إجمالي المعلمين</div><div class="dash-pro-mini">متوسط '+arNum(avgSent)+' درجة/معلم</div></div></div>' +
            '<div class="dash-pro-card green"><div class="dash-pro-icon">✓</div><div><div class="dash-pro-value">'+arNum(open)+'</div><div class="dash-pro-label">حسابات مفتوحة</div><div class="dash-pro-mini">نشاط الحسابات '+arNum(activeRate)+'%</div></div></div>' +
            '<div class="dash-pro-card red"><div class="dash-pro-icon">🔒</div><div><div class="dash-pro-value">'+arNum(locked)+'</div><div class="dash-pro-label">حسابات مقفلة</div><div class="dash-pro-mini">تحتاج إلى مراجعة</div></div></div>' +
            '<div class="dash-pro-card amber"><div class="dash-pro-icon">📝</div><div><div class="dash-pro-value">'+arNum(totalSent)+'</div><div class="dash-pro-label">درجات مرسلة</div><div class="dash-pro-mini">إجمالي عمليات الإرسال</div></div></div>' +
          '</div>' +
          '<div class="dash-pro-progress">' +
            '<div><span>نسبة الحسابات المفتوحة</span><b>'+arNum(activeRate)+'%</b></div>' +
            '<div class="dash-pro-track"><i style="width:'+activeRate+'%"></i></div>' +
          '</div>' +
        '</div>';
    }
    if(listEl){
      if(!teachers.length){
        listEl.innerHTML = '<div class="empty">لا يوجد معلمون بعد</div>';
        return;
      }
      var colors = ['#2563EB','#10B981','#F59E0B','#8B5CF6','#EC4899','#06B6D4'];
      var h = '<div class="dash-pro-head">' +
                '<div><div class="dash-pro-title">المعلمون</div><div class="dash-pro-sub">إدارة الحسابات ومتابعة النشاط والدرجات</div></div>' +
                '<div class="dash-pro-count">'+arNum(total)+' معلم</div>' +
              '</div>' +
              '<div class="dash-pro-toolbar">' +
                '<div class="dash-pro-search"><span>⌕</span><input id="dashTeacherSearch" type="search" placeholder="ابحث باسم المعلم أو الرمز..." oninput="filterDashTeachers(this.value)"></div>' +
                '<div class="dash-pro-filters">' +
                  '<button class="dash-filter active" data-filter="all" onclick="setDashTeacherFilter(\'all\',this)">الكل</button>' +
                  '<button class="dash-filter" data-filter="open" onclick="setDashTeacherFilter(\'open\',this)">مفتوحة</button>' +
                  '<button class="dash-filter" data-filter="locked" onclick="setDashTeacherFilter(\'locked\',this)">مقفلة</button>' +
                '</div>' +
              '</div>' +
              '<div id="dashTeacherGrid" class="dash-pro-teachers">';
      teachers.forEach(function(t,i){
        var col = colors[i%colors.length];
        var last = t.lastLogin ? ago(t.lastLogin) : 'لم يدخل بعد';
        var cnt = 0;
        if(t.subjects) t.subjects.forEach(function(s){ if(s.classes) cnt+=s.classes.length; });
        var status = t.locked ? 'locked' : 'open';

        h += '<div class="dash-pro-teacher" data-status="'+status+'" data-search="'+escA((t.name||'')+' '+(t.code||''))+'" style="--accent:'+col+'" onclick="viewTeacher(\''+escA(t.code)+'\')" role="button" tabindex="0">';
        h += '<div class="dash-pro-top"><div class="dash-pro-avatar">'+esc((t.name||'?').trim().charAt(0))+'</div>';
        h += '<div class="dash-pro-main"><div class="dash-pro-name">'+esc(t.name)+'</div><div class="dash-pro-code">🔑 '+esc(t.code)+'</div></div>';
        h += '<div class="dash-pro-status '+status+'">'+(t.locked?'🔒 مقفل':'● مفتوح')+'</div></div>';
        h += '<div class="dash-pro-stats">';
        h += '<div><span>آخر دخول</span><b>'+esc(last)+'</b></div>';
        h += '<div><span>الدرجات</span><b>'+arNum(t.sentCount||0)+'</b></div>';
        h += '<div><span>الشعب</span><b>'+arNum(cnt)+'</b></div>';
        h += '</div>';
        h += '<div class="dash-pro-open">فتح ملف المعلم <span>←</span></div></div>';
      });
      h += '</div>';
      h += '<div id="dashNoResults" class="dash-pro-noresults" style="display:none">لا توجد نتائج مطابقة للبحث</div>';
      listEl.innerHTML = h;
    }
    
  }).catch(function(err){
    console.error('Dashboard Fetch Error:', err);
    var msg = '⚠️ تعذر الاتصال بالخادم';
    if (err.message === 'no-url') msg = ' رابط الخادم مفقود';
    else if (err.name === 'AbortError') msg = '⏱ انتهت مهلة الاتصال';
    if(!silent) toast(msg, 'err');
    if(kpiEl) kpiEl.innerHTML = '<div class="empty">'+msg+'</div>';
  });
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
  var t = (TEAM.teachers || []).find(function(x){return x.code===code;});
  if(!t) return;
  ADM.tv = t;
  $('#tvName').textContent = t.name;
  $('#tvSub').textContent = '🔑 '+t.code+' | '+t.subjects.map(function(s){return s.name;}).join('،');
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
    if(!rows.length){ el.innerHTML = '<div class="empty">لا توجد درجات لهذا المعلم</div>'; return; }
    
    var byCls = {};
    rows.forEach(function(row){
      var cls = row.cls;
      if(!byCls[cls]) byCls[cls] = {};
      if(!byCls[cls][row.subject]) byCls[cls][row.subject] = [];
      byCls[cls][row.subject].push(row);
    });
    
    var h = '';
    Object.keys(byCls).forEach(function(cls){
      h += '<div class="card"><div class="ct">🏫 '+esc(cls)+'</div>';
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
          var finColor = (row.final != null && row.final >= (row.max||100)/2) ? 'color:#047857' : (row.final != null ? 'color:#DC2626' : '');
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
          h += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:900;'+finColor+'">'+(row.final!=null?arNum(row.final):'—')+'</td>';
          h += '</tr>';
        });
        h += '</tbody></table></div>';
      });
      h += '</div>';
    });
    el.innerHTML = h;
    
  }).catch(function(err){
    console.error('Teacher View Error:', err);
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

function printTView(){
  var el = $('#tvBox');
  if(!el) return;
  var h = '<div style="font-family:Tajawal;width:190mm;margin:0 auto;padding:10mm">';
  h += '<h2 style="text-align:center;color:#1E40AF">كشف: '+esc(ADM.tv?ADM.tv.name:'')+'</h2>';
  h += el.innerHTML;
  h += '</div>';
  printWin(h);
}
