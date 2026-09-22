/* ═══ page-dash.js — نظرة عامة (محدث) ═══ */

registerPage('dash', {
  enter: function() {
    loadDashData();
  },
  silent: function() {
    loadDashData(true);
  }
});

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
    
    if(kpiEl){
      kpiEl.innerHTML = 
        '<div class="kpi-card" style="--k:#047857"><div class="v">'+arNum(total)+'</div><div class="l">إجمالي المعلمين</div></div>' +
        '<div class="kpi-card" style="--k:#2563EB"><div class="v">'+arNum(open)+'</div><div class="l">حسابات مفتوحة</div></div>' +
        '<div class="kpi-card" style="--k:#DC2626"><div class="v">'+arNum(locked)+'</div><div class="l">حسابات مقفلة</div></div>' +
        '<div class="kpi-card" style="--k:#B45309"><div class="v">'+arNum(totalSent)+'</div><div class="l">درجات مرسلة</div></div>';
    }
    
    if(listEl){
      if(!teachers.length){
        listEl.innerHTML = '<div class="empty">لا يوجد معلمون بعد</div>';
        return;
      }
      var colors = ['#1E40AF','#047857','#B45309','#7E22CE','#BE123C','#0E7490'];
      var h = '';
      teachers.forEach(function(t,i){
        var col = colors[i%colors.length];
        var last = t.lastLogin ? ago(t.lastLogin) : 'لم يدخل بعد';
        var cnt = 0;
        if(t.subjects) t.subjects.forEach(function(s){ if(s.classes) cnt+=s.classes.length; });
        
        h += '<div class="teacher-card" style="border-right:5px solid '+col+';cursor:pointer" onclick="viewTeacher(\''+escA(t.code)+'\')">';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">';
        h += '<div style="flex:1">';
        h += '<div style="font-size:16px;font-weight:900;color:#0F172A">'+esc(t.name)+'</div>';
        h += '<div style="display:flex;gap:6px;align-items:center;margin-top:4px;flex-wrap:wrap">';
        h += '<span class="chip" style="background:#F1F5F9;color:#475569;font-family:monospace;font-size:11px">🔑 '+esc(t.code)+'</span>';
        if(t.locked){
          h += '<span class="chip" style="background:#FEE2E2;color:#DC2626;font-size:11px">🔒 مقفل</span>';
        }else{
          h += '<span class="chip" style="background:#D1FAE5;color:#047857;font-size:11px">🔓 مفتوح</span>';
        }
        h += '</div></div>';
        h += '<div style="text-align:left;font-size:11px;color:#64748B">';
        h += '<div>📊 '+last+'</div>';
        h += '<div>📝 '+arNum(t.sentCount||0)+' درجة</div>';
        h += '<div>🏫 '+arNum(cnt)+' شعبة</div>';
        h += '</div></div></div>';
      });
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
