/* ═══ page-team.js — صفحة المعلمين (تطوير كامل) ═══ */

var TEAM={teachers:[], filtered:[], search:'', filterSubject:'', filterClass:''};

registerPage('team',{
  enter:function(){
    TEAM={teachers:[], filtered:[], search:'', filterSubject:'', filterClass:''};
    loadTeachers();
  }
});

function loadTeachers(){
  $('#teamList').innerHTML='<div class="empty">⏳ تحميل...</div>';
  api({action:'adminData',key:key()}).then(function(r){
    if(!r.ok){toast('❌ '+r.error,'err');return;}
    TEAM.teachers=r.teachers||[];
    applyFilters();
  }).catch(function(){toast('تعذر الاتصال','err');});
}

/* ═══ تطبيق الفلاتر ══ */
function applyFilters(){
  TEAM.filtered=TEAM.teachers.filter(function(t){
    var matchSearch=!TEAM.search || t.name.indexOf(TEAM.search)!==-1 || t.code.indexOf(TEAM.search)!==-1;
    var matchSubject=!TEAM.filterSubject || t.subjects.some(function(s){return s.name===TEAM.filterSubject;});
    var matchClass=!TEAM.filterClass || t.subjects.some(function(s){return s.classes.indexOf(TEAM.filterClass)!==-1;});
    return matchSearch && matchSubject && matchClass;
  });
  renderTeachers();
}

/* ═══ عرض المعلمين ══ */
function renderTeachers(){
  if(!TEAM.filtered.length){
    $('#teamList').innerHTML='<div class="empty">لا يوجد معلمون</div>';
    return;
  }
  
  var colors=['#1E40AF','#047857','#B45309','#7E22CE','#BE123C','#0E7490'];
  var h='';
  
  TEAM.filtered.forEach(function(t,i){
    var color=colors[i%colors.length];
    var lastLoginStr=t.lastLogin?ago(t.lastLogin):'لم يدخل بعد';
    var totalClasses=t.subjects.reduce(function(sum,s){return sum+s.classes.length;},0);
    
    h+='<div class="teacher-card" style="border-right:5px solid '+color+';margin-bottom:12px">';
    h+='<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">';
    h+='<div style="flex:1">';
    h+='<div style="font-size:18px;font-weight:900;color:#0F172A;margin-bottom:4px">'+esc(t.name)+'</div>';
    h+='<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">';
    h+='<span class="chip" style="background:#F1F5F9;color:#475569;font-weight:700">🔑 '+esc(t.code)+'</span>';
    h+='<button class="btn sm" onclick="copyCode(\''+escA(t.code)+'\')" title="نسخ الكود">📋 نسخ</button>';
    h+='<button class="btn sm" style="background:#25D366;color:#fff" onclick="sendWhatsApp(\''+escA(t.code)+'\',\''+escA(t.name)+'\')" title="إرسال عبر واتساب"> واتساب</button>';
    h+='</div>';
    h+='</div>';
    h+='<div style="display:flex;gap:6px;align-items:center">';
    if(t.locked){
      h+='<span class="chip" style="background:#FEE2E2;color:#DC2626">🔒 مقفل</span>';
      h+='<button class="btn sm ok" onclick="toggleLock(\''+escA(t.code)+'\')">🔑 فتح</button>';
    }else{
      h+='<span class="chip" style="background:#D1FAE5;color:#047857">🔓 مفتوح</span>';
      h+='<button class="btn sm danger" onclick="toggleLock(\''+escA(t.code)+'\')">🔒 قفل</button>';
    }
    h+='</div>';
    h+='</div>';
    
    // المواد والصفوف
    h+='<div style="margin-bottom:10px">';
    t.subjects.forEach(function(s){
      h+='<div style="margin-bottom:6px">';
      h+='<div style="font-weight:800;color:'+color+';margin-bottom:3px">📘 '+esc(s.name)+'</div>';
      h+='<div style="display:flex;gap:4px;flex-wrap:wrap;padding-right:10px">';
      s.classes.forEach(function(c){
        h+='<span class="chip" style="background:#EFF6FF;color:#1E40AF;font-size:12px"> '+esc(c)+'</span>';
      });
      h+='</div>';
      h+='</div>';
    });
    h+='</div>';
    
    // الإحصائيات
    h+='<div style="display:flex;gap:12px;flex-wrap:wrap;padding-top:8px;border-top:1px solid var(--line);font-size:12px;color:#64748B">';
    h+='<span>📊 آخر دخول: <b>'+lastLoginStr+'</b></span>';
    h+='<span>📝 درجات مرسلة: <b>'+arNum(t.sentCount)+'</b></span>';
    h+='<span> عدد الصفوف: <b>'+arNum(totalClasses)+'</b></span>';
    h+='<span>📘 عدد المواد: <b>'+arNum(t.subjects.length)+'</b></span>';
    h+='</div>';
    
    // أزرار الإجراءات
    h+='<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">';
    h+='<button class="btn sm" onclick="editTeacher(\''+escA(t.code)+'\')">✏️ تعديل</button>';
    h+='<button class="btn sm danger" onclick="deleteTeacher(\''+escA(t.code)+'\')">🗑 حذف</button>';
    h+='</div>';
    h+='</div>';
  });
  
  $('#teamList').innerHTML=h;
}

/* ═══ نسخ الكود ═══ */
function copyCode(code){
  copyText(code);
}

/* ═══ إرسال واتساب ═══ */
function sendWhatsApp(code,name){
  var msg='مرحباً '+name+' 👋\n\nكودك في تطبيق «درجاتي»:\n\n🔑 '+code+'\n\nثبّت التطبيق وأدخل هذا الكود.';
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
}

/* ═══ قفل/فتح ═══ */
function toggleLock(code){
  var t=TEAM.teachers.find(function(x){return x.code===code;});
  if(!t)return;
  var action=t.locked?'فتح':'قفل';
  confirmDlg(action+' حساب '+t.name+'؟',function(){
    api({action:'toggleLock',key:key(),code:code}).then(function(r){
      if(r.ok){toast('✓ تم '+action,'ok');loadTeachers();}
      else{toast('❌ '+r.error,'err');}
    });
  },action);
}

/* ═══ تعديل معلم ═══ */
function editTeacher(code){
  var t=TEAM.teachers.find(function(x){return x.code===code;});
  if(!t)return;
  
  // بناء صيغة المواد والصفوف
  var subjectsData=t.subjects.map(function(s){
    return s.name+':'+s.classes.join('،');
  }).join(' | ');
  
  $('#edCode').value=t.code;
  $('#edName').value=t.name;
  $('#edSubjectsData').value=subjectsData;
  $('#editModal').classList.add('show');
}

/* ═══ حفظ التعديل ═══ */
function saveEditTeacher(){
  var code=$('#edCode').value.trim();
  var name=$('#edName').value.trim();
  var subjectsData=$('#edSubjectsData').value.trim();
  
  if(!code||!name||!subjectsData){toast('جميع الحقول مطلوبة','err');return;}
  
  api({action:'updateTeacher',key:key(),code:code,name:name,subjectsData:subjectsData}).then(function(r){
    if(r.ok){toast('✓ تم التعديل','ok');hideModal('editModal');loadTeachers();}
    else{toast('❌ '+r.error,'err');}
  });
}

/* ═══ حذف معلم ═══ */
function deleteTeacher(code){
  var t=TEAM.teachers.find(function(x){return x.code===code;});
  if(!t)return;
  confirmDlg('حذف المعلم '+t.name+'؟',function(){
    api({action:'delTeacher',key:key(),code:code}).then(function(r){
      if(r.ok){toast('✓ تم الحذف','ok');loadTeachers();}
      else{toast('❌ '+r.error,'err');}
    });
  },'حذف');
}

/* ═══ إضافة معلم جديد ═══ */
function showAddTeacherForm(){
  $('#ntName').value='';
  $('#ntSubjectsData').value='';
  $('#addTeacherModal').classList.add('show');
}

function saveNewTeacher(){
  var name=$('#ntName').value.trim();
  var subjectsData=$('#ntSubjectsData').value.trim();
  
  if(!name||!subjectsData){toast('جميع الحقول مطلوبة','err');return;}
  
  api({action:'addTeacher',key:key(),name:name,subjectsData:subjectsData}).then(function(r){
    if(r.ok){
      toast('✓ تم إضافة المعلم — الكود: '+r.code,'ok');
      hideModal('addTeacherModal');
      loadTeachers();
    }else{toast('❌ '+r.error,'err');}
  });
}

/* ═══ طباعة قائمة المعلمين ═══ */
function printTeachersList(){
  var h='<div style="font-family:Tajawal,Arial,sans-serif;width:190mm;margin:0 auto;padding:10mm">';
  h+='<div style="text-align:center;margin-bottom:20px">';
  h+='<h1 style="color:#1E40AF;font-size:24px">قائمة المعلمين</h1>';
  h+='<p style="color:#64748B;font-size:14px">السنة الدراسية '+esc(getStudyYear())+'</p>';
  h+='</div>';
  
  h+='<table style="width:100%;border-collapse:collapse;border:2px solid #0F172A">';
  h+='<thead><tr style="background:#1E40AF;color:#fff">';
  h+='<th style="padding:8px;border:1px solid #0F172A">الكود</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">الاسم</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">المواد والصفوف</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">الحالة</th>';
  h+='</tr></thead><tbody>';
  
  TEAM.filtered.forEach(function(t){
    var subjectsStr=t.subjects.map(function(s){
      return s.name+': '+s.classes.join('، ');
    }).join(' | ');
    
    h+='<tr>';
    h+='<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:bold">'+esc(t.code)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A">'+esc(t.name)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A;font-size:12px">'+esc(subjectsStr)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A;text-align:center">'+(t.locked?'🔒 مقفل':'🔓 مفتوح')+'</td>';
    h+='</tr>';
  });
  
  h+='</tbody></table>';
  h+='</div>';
  
  printWin(h);
}

/* ═══ تصدير Excel ═══ */
function exportTeachersExcel(){
  var h='<table style="width:100%;border-collapse:collapse" dir="rtl">';
  h+='<thead><tr style="background:#1E40AF;color:#fff">';
  h+='<th style="padding:8px;border:1px solid #0F172A">الكود</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">الاسم</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">المواد والصفوف</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">الحالة</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">آخر دخول</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">درجات مرسلة</th>';
  h+='</tr></thead><tbody>';
  
  TEAM.filtered.forEach(function(t){
    var subjectsStr=t.subjects.map(function(s){
      return s.name+': '+s.classes.join('، ');
    }).join(' | ');
    var lastLoginStr=t.lastLogin?fmtDate(t.lastLogin):'-';
    
    h+='<tr>';
    h+='<td style="padding:8px;border:1px solid #0F172A">'+esc(t.code)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A">'+esc(t.name)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A">'+esc(subjectsStr)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A">'+(t.locked?'مقفل':'مفتوح')+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A">'+lastLoginStr+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A;text-align:center">'+arNum(t.sentCount)+'</td>';
    h+='</tr>';
  });
  
  h+='</tbody></table>';
  
  downloadXLS('قائمة-المعلمين','قائمة المعلمين — '+getStudyYear(),h);
}

/* ═══ البحث والتصفية ═══ */
function onSearchChange(){
  TEAM.search=$('#teamSearch').value.trim();
  applyFilters();
}

function onFilterSubjectChange(){
  TEAM.filterSubject=$('#filterSubject').value;
  applyFilters();
}

function onFilterClassChange(){
  TEAM.filterClass=$('#filterClass').value;
  applyFilters();
}
