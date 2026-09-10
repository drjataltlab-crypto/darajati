/* ═══ page-team.js — صفحة المعلمين ═══ */

var TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };

registerPage('team', {
  enter: function() {
    TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };
    loadTeachers();
  }
});

function loadTeachers() {
  var el = $('#teamList');
  if (!el) {
    console.error('teamList غير موجود');
    return;
  }
  el.innerHTML = '<div class="empty">⏳ تحميل...</div>';
  
  api({action:'adminData', key:key()}).then(function(r){
    if(!r.ok){toast('❌ '+r.error,'err'); return;}
    TEAM.teachers = r.teachers || [];
    updateSubjectFilter();
    applyFilters();
  }).catch(function(){
    toast('تعذر الاتصال','err');
    el.innerHTML = '<div class="empty">⚠️ تعذر الاتصال</div>';
  });
}

function updateSubjectFilter(){
  var el = $('#filterSubject');
  if(!el) return;
  
  var subs = {};
  TEAM.teachers.forEach(function(t){
    if(t.subjects && Array.isArray(t.subjects)){
      t.subjects.forEach(function(s){ subs[s.name] = true; });
    }
  });
  
  var h = '<option value="">كل المواد</option>';
  Object.keys(subs).sort().forEach(function(s){
    h += '<option>'+esc(s)+'</option>';
  });
  el.innerHTML = h;
}

function applyFilters(){
  TEAM.filtered = TEAM.teachers.filter(function(t){
    var s1 = !TEAM.search || t.name.indexOf(TEAM.search)!==-1 || t.code.indexOf(TEAM.search)!==-1;
    var s2 = !TEAM.filterSubject || (t.subjects && t.subjects.some(function(x){return x.name===TEAM.filterSubject;}));
    var s3 = !TEAM.filterClass || (t.subjects && t.subjects.some(function(x){return x.classes.indexOf(TEAM.filterClass)!==-1;}));
    return s1 && s2 && s3;
  });
  renderTeachers();
}

function renderTeachers(){
  var el = $('#teamList');
  if(!el) return;
  
  if(!TEAM.filtered.length){
    el.innerHTML = '<div class="empty">لا يوجد معلمون</div>';
    return;
  }
  
  var colors = ['#1E40AF','#047857','#B45309','#7E22CE','#BE123C','#0E7490'];
  var h = '';
  
  TEAM.filtered.forEach(function(t,i){
    var col = colors[i%colors.length];
    var last = t.lastLogin ? ago(t.lastLogin) : 'لم يدخل';
    var cnt = 0;
    if(t.subjects) t.subjects.forEach(function(s){ if(s.classes) cnt+=s.classes.length; });
    
    h += '<div class="teacher-card" style="border-right:5px solid '+col+'">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:10px">';
    h += '<div style="flex:1">';
    h += '<div style="font-size:18px;font-weight:900;color:#0F172A;margin-bottom:4px">'+esc(t.name)+'</div>';
    h += '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">';
    h += '<span class="chip" style="background:#F1F5F9;color:#475569;font-weight:700;font-family:monospace"> '+esc(t.code)+'</span>';
    h += '<button class="btn sm" onclick="copyText(\''+escA(t.code)+'\')">📋 نسخ</button>';
    h += '<button class="btn sm" style="background:#25D366;color:#fff" onclick="sendWA(\''+escA(t.code)+'\',\''+escA(t.name)+'\')">📱 واتساب</button>';
    h += '</div></div>';
    h += '<div style="display:flex;gap:6px;align-items:center">';
    if(t.locked){
      h += '<span class="chip" style="background:#FEE2E2;color:#DC2626">🔒 مقفل</span>';
      h += '<button class="btn sm ok" onclick="toggleLock(\''+escA(t.code)+'\')">🔑 فتح</button>';
    }else{
      h += '<span class="chip" style="background:#D1FAE5;color:#047857"> مفتوح</span>';
      h += '<button class="btn sm danger" onclick="toggleLock(\''+escA(t.code)+'\')">🔒 قفل</button>';
    }
    h += '</div></div>';
    
    if(t.subjects && t.subjects.length){
      h += '<div style="margin:10px 0;padding:10px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0">';
      t.subjects.forEach(function(s){
        h += '<div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed #E2E8F0">';
        h += '<div style="font-weight:800;font-size:13px;margin-bottom:4px;color:'+col+'">📘 '+esc(s.name)+'</div>';
        if(s.classes && s.classes.length){
          h += '<div style="display:flex;gap:4px;flex-wrap:wrap;padding-right:10px">';
          s.classes.forEach(function(c){
            h += '<span style="background:#EFF6FF;color:#1E40AF;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;border:1px solid #BFDBFE">🏫 '+esc(c)+'</span>';
          });
          h += '</div>';
        }
        h += '</div>';
      });
      h += '</div>';
    }
    
    h += '<div style="display:flex;gap:12px;flex-wrap:wrap;padding-top:10px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B">';
    h += '<span>📊 آخر دخول: <b>'+last+'</b></span>';
    h += '<span>📝 درجات: <b>'+arNum(t.sentCount||0)+'</b></span>';
    h += '<span>🏫 صفوف: <b>'+arNum(cnt)+'</b></span>';
    h += '<span>📘 مواد: <b>'+arNum(t.subjects?t.subjects.length:0)+'</b></span>';
    h += '</div>';
    
    h += '<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">';
    h += '<button class="btn sm" onclick="editT(\''+escA(t.code)+'\')">✏️ تعديل</button>';
    h += '<button class="btn sm danger" onclick="delT(\''+escA(t.code)+'\')">🗑 حذف</button>';
    h += '</div></div>';
  });
  
  el.innerHTML = h;
}

function sendWA(code,name){
  var msg='مرحباً '+name+' \n\nكودك في تطبيق «درجاتي»:\n\n🔑 '+code+'\n\nثبّت التطبيق وأدخل هذا الكود.';
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
}

function toggleLock(code){
  var t=TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  var act=t.locked?'فتح':'قفل';
  confirmDlg(act+' حساب '+t.name+'؟',function(){
    api({action:'toggleLock',key:key(),code:code}).then(function(r){
      if(r.ok){toast('✓ تم '+act,'ok');loadTeachers();}
      else{toast('❌ '+r.error,'err');}
    });
  },act);
}

function editT(code){
  var t=TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  
  var data='';
  if(t.subjects){
    data=t.subjects.map(function(s){return s.name+':'+(s.classes||[]).join('،');}).join(' | ');
  }
  
  var c=$('#edCode'),n=$('#edName'),s=$('#edSubjectsData');
  if(c)c.value=t.code;
  if(n)n.value=t.name;
  if(s)s.value=data;
  
  var m=$('#editModal');
  if(m)m.classList.add('show');
}

function saveEditTeacher(){
  var c=$('#edCode'),n=$('#edName'),s=$('#edSubjectsData');
  if(!c||!n||!s){toast('خطأ','err');return;}
  
  var code=c.value.trim(),name=n.value.trim(),data=s.value.trim();
  if(!code||!name||!data){toast('جميع الحقول مطلوبة','err');return;}
  
  api({action:'updateTeacher',key:key(),code:code,name:name,subjectsData:data}).then(function(r){
    if(r.ok){toast('✓ تم التعديل','ok');hideModal('editModal');loadTeachers();}
    else{toast('❌ '+r.error,'err');}
  });
}

function delT(code){
  var t=TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  confirmDlg('حذف '+t.name+'؟',function(){
    api({action:'delTeacher',key:key(),code:code}).then(function(r){
      if(r.ok){toast('✓ تم الحذف','ok');loadTeachers();}
      else{toast('❌ '+r.error,'err');}
    });
  },'حذف');
}

function showAddTeacherForm(){
  var n=$('#ntName'),s=$('#ntSubjectsData');
  if(n)n.value='';
  if(s)s.value='';
  var m=$('#addTeacherModal');
  if(m)m.classList.add('show');
}

function saveNewTeacher(){
  var n=$('#ntName'),s=$('#ntSubjectsData');
  if(!n||!s){toast('خطأ','err');return;}
  
  var name=n.value.trim(),data=s.value.trim();
  if(!name||!data){toast('جميع الحقول مطلوبة','err');return;}
  
  api({action:'addTeacher',key:key(),name:name,subjectsData:data}).then(function(r){
    if(r.ok){toast('✓ تم الإضافة — الكود: '+r.code,'ok');hideModal('addTeacherModal');loadTeachers();}
    else{toast('❌ '+r.error,'err');}
  });
}

function printTeachersList(){
  if(!TEAM.filtered.length){toast('لا يوجد معلمون','err');return;}
  var h='<div style="font-family:Tajawal;width:190mm;margin:0 auto;padding:10mm">';
  h+='<h1 style="text-align:center;color:#1E40AF">قائمة المعلمين</h1>';
  h+='<table style="width:100%;border-collapse:collapse;border:2px solid #0F172A"><thead><tr style="background:#1E40AF;color:#fff">';
  h+='<th style="padding:8px;border:1px solid #0F172A">الكود</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">الاسم</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">المواد</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">الحالة</th></tr></thead><tbody>';
  
  TEAM.filtered.forEach(function(t){
    var sub=t.subjects?t.subjects.map(function(s){return s.name+': '+(s.classes||[]).join('،');}).join(' | '):'';
    h+='<tr><td style="padding:8px;border:1px solid #0F172A;text-align:center">'+esc(t.code)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A">'+esc(t.name)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A;font-size:11px">'+esc(sub)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A;text-align:center">'+(t.locked?'🔒':'🔓')+'</td></tr>';
  });
  h+='</tbody></table></div>';
  printWin(h);
}

function exportTeachersExcel(){
  if(!TEAM.filtered.length){toast('لا يوجد معلمون','err');return;}
  var h='<table dir="rtl"><thead><tr style="background:#1E40AF;color:#fff">';
  h+='<th>الكود</th><th>الاسم</th><th>المواد</th><th>الحالة</th><th>آخر دخول</th><th>درجات</th></tr></thead><tbody>';
  
  TEAM.filtered.forEach(function(t){
    var sub=t.subjects?t.subjects.map(function(s){return s.name+': '+(s.classes||[]).join('،');}).join(' | '):'';
    var last=t.lastLogin?fmtDate(t.lastLogin):'-';
    h+='<tr><td>'+esc(t.code)+'</td><td>'+esc(t.name)+'</td><td>'+esc(sub)+'</td>';
    h+='<td>'+(t.locked?'مقفل':'مفتوح')+'</td><td>'+last+'</td><td>'+arNum(t.sentCount||0)+'</td></tr>';
  });
  h+='</tbody></table>';
  downloadXLS('المعلمين','قائمة المعلمين',h);
}

function onSearchChange(){var e=$('#teamSearch');TEAM.search=e?e.value.trim():'';applyFilters();}
function onFilterSubjectChange(){var e=$('#filterSubject');TEAM.filterSubject=e?e.value:'';applyFilters();}
function onFilterClassChange(){var e=$('#filterClass');TEAM.filterClass=e?e.value:'';applyFilters();}
