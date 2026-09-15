/* ═══ page-team.js — صفحة المعلمين (نسخة نهائية متقدمة) ═══ */

var TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };
var EDIT_SUBJECTS = [];
var CURRENT_TEACHER_GRADES = []; // لتخزين درجات المعلم الحالي

registerPage('team', {
  enter: function() {
    TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };
    loadTeachers();
  }
});

function loadTeachers() {
  var el = $('#teamList');
  if (!el) return;
  el.innerHTML = '<div class="empty">⏳ جاري تحميل بيانات المعلمين...</div>';
  
  api({action:'adminData', key:key()}).then(function(r){
    if(!r.ok){ toast('❌ '+r.error, 'err'); return; }
    TEAM.teachers = r.teachers || [];
    applyFilters();
  }).catch(function(){
    toast('تعذر الاتصال', 'err');
    el.innerHTML = '<div class="empty">⚠️ تعذر الاتصال بالخادم</div>';
  });
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
    el.innerHTML = '<div class="empty">لا يوجد معلمون مطابقون للبحث</div>';
    return;
  }
  var colors = ['#1E40AF','#047857','#B45309','#7E22CE','#BE123C','#0E7490'];
  var h = '';
  TEAM.filtered.forEach(function(t,i){
    var col = colors[i%colors.length];
    var last = t.lastLogin ? ago(t.lastLogin) : 'لم يدخل بعد';
    var cnt = 0;
    if(t.subjects) t.subjects.forEach(function(s){ if(s.classes) cnt+=s.classes.length; });
    
    h += '<div class="teacher-card" style="border-right:5px solid '+col+'">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;flex-wrap:wrap;gap:10px">';
    h += '<div style="flex:1">';
    h += '<div style="font-size:18px;font-weight:900;color:#0F172A;margin-bottom:4px">'+esc(t.name)+'</div>';
    h += '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">';
    h += '<span class="chip" style="background:#F1F5F9;color:#475569;font-weight:700;font-family:monospace">🔑 '+esc(t.code)+'</span>';
    h += '<button class="btn sm" onclick="copyText(\''+escA(t.code)+'\')">📋 نسخ</button>';
    h += '<button class="btn sm" style="background:#25D366;color:#fff" onclick="sendWA(\''+escA(t.code)+'\',\''+escA(t.name)+'\')">📱 واتساب</button>';
    h += '</div></div>';
    h += '<div style="display:flex;gap:6px;align-items:center">';
    if(t.locked){
      h += '<span class="chip" style="background:#FEE2E2;color:#DC2626">🔒 مقفل</span>';
      h += '<button class="btn sm ok" onclick="toggleLock(\''+escA(t.code)+'\')">🔓 فتح</button>';
    }else{
      h += '<span class="chip" style="background:#D1FAE5;color:#047857">🔓 مفتوح</span>';
      h += '<button class="btn sm danger" onclick="toggleLock(\''+escA(t.code)+'\')">🔒 قفل</button>';
    }
    h += '</div></div>';
    
    if(t.subjects && t.subjects.length){
      h += '<div style="margin:10px 0;padding:10px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0">';
      t.subjects.forEach(function(s){
        h += '<div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed #E2E8F0;">';
        h += '<div style="font-weight:800;font-size:13px;margin-bottom:6px;color:'+col+'">📘 '+esc(s.name)+'</div>';
        if(s.classes && s.classes.length){
          h += '<div style="display:flex;gap:6px;flex-wrap:wrap;padding-right:10px;">';
          s.classes.forEach(function(c){
            h += '<div style="display:flex;align-items:center;gap:4px;background:#EFF6FF;color:#1E40AF;border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700;border:1px solid #BFDBFE;">';
            h += '<span>🏫 '+esc(c)+'</span>';
            // ✅ زر حذف دقيق للصف/الشعبة فقط
            h += '<button class="btn sm danger" style="width:auto;padding:2px 6px;font-size:10px;margin-left:4px;" onclick="removeSpecificClass(\''+escA(t.code)+'\',\''+escA(s.name)+'\',\''+escA(c)+'\')" title="حذف هذه الشعبة فقط">✕</button>';
            h += '</div>';
          });
          h += '</div>';
        }
        h += '</div>';
      });
      h += '</div>';
    }
    
    h += '<div style="display:flex;gap:12px;flex-wrap:wrap;padding-top:10px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B">';
    h += '<span>📊 آخر دخول: <b>'+last+'</b></span>';
    h += '<span>📝 درجات مرسلة: <b>'+arNum(t.sentCount||0)+'</b></span>';
    h += '<span>🏫 عدد الشعب: <b>'+arNum(cnt)+'</b></span>';
    h += '<span>📘 عدد المواد: <b>'+arNum(t.subjects?t.subjects.length:0)+'</b></span>';
    h += '</div>';
    
    h += '<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">';
    h += '<button class="btn sm" style="background:#7C3AED;color:#fff" onclick="editT(\''+escA(t.code)+'\')">✏️ تعديل شامل</button>';
    h += '<button class="btn sm" style="background:#0891B2;color:#fff" onclick="openTeacherRecord(\''+escA(t.code)+'\')">📊 كشف المعلم</button>';
    h += '<button class="btn sm" style="background:#059669;color:#fff" onclick="exportTeacherExcel(\''+escA(t.code)+'\')">📥 Excel</button>';
    h += '<button class="btn sm danger" onclick="delT(\''+escA(t.code)+'\')">🗑 حذف المعلم</button>';
    h += '</div></div>';
  });
  el.innerHTML = h;
}

// ✅ حذف صف/شعبة محددة فقط
function removeSpecificClass(code, subject, cls){
  confirmDlg('حذف الشعبة "'+cls+'" من مادة "'+subject+'" فقط؟', function(){
    api({action:'removeTeacherClass', key:key(), code:code, subject:subject, cls:cls}).then(function(r){
      if(r.ok){ toast('✓ '+r.message, 'ok'); loadTeachers(); }
      else{ toast('❌ '+r.error, 'err'); }
    });
  }, 'حذف الشعبة');
}

function sendWA(code,name){
  var msg='مرحباً '+name+' 👋\n\nكودك في تطبيق «درجاتي»:\n\n🔑 '+code+'\n\nثبّت التطبيق وأدخل هذا الكود.';
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

/* ═══ كشف المعلم التفاعلي ═══ */
function openTeacherRecord(code){
  var t = TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  
  $('#trTeacherName').textContent = t.name;
  $('#trTableContainer').style.display = 'none';
  $('#trEmpty').style.display = 'none';
  
  var listEl = $('#trSubjectsList');
  listEl.innerHTML = '';
  
  if(!t.subjects || t.subjects.length === 0){
    $('#trEmpty').style.display = 'block';
  } else {
    t.subjects.forEach(function(s){
      var btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.cssText = 'width:auto; flex:1; min-width:120px; background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE;';
      btn.textContent = '📘 ' + s.name;
      btn.onclick = function(){ showSubjectRecord(code, s.name, t.name); };
      listEl.appendChild(btn);
    });
  }
  
  $('#teacherRecordModal').classList.add('show');
}

function showSubjectRecord(code, subjectName, teacherName){
  $('#trTableContainer').style.display = 'none';
  $('#trLoading').style.display = 'block';
  $('#trSubjectTitle').textContent = '📘 ' + subjectName;
  
  api({action:'teacherGrades', key:key(), code:code}).then(function(r){
    $('#trLoading').style.display = 'none';
    if(!r.ok || !r.rows.length){
      $('#trTableContainer').style.display = 'block';
      $('#trTableBody').innerHTML = '<tr><td colspan="14" style="text-align:center;padding:20px;color:#64748B;">لا توجد درجات مسجلة لهذه المادة بعد.</td></tr>';
      return;
    }
    
    CURRENT_TEACHER_GRADES = r.rows;
    var subjectRows = r.rows.filter(function(row){ return row.subject === subjectName; });
    
    if(subjectRows.length === 0){
      $('#trTableContainer').style.display = 'block';
      $('#trTableBody').innerHTML = '<tr><td colspan="14" style="text-align:center;padding:20px;color:#64748B;">لا توجد درجات مسجلة لهذه المادة بعد.</td></tr>';
      return;
    }
    
    // تجميع حسب الصف والشعبة
    var byClass = {};
    subjectRows.forEach(function(row){
      var clsKey = row.grade + ' ' + row.section;
      if(!byClass[clsKey]) byClass[clsKey] = [];
      byClass[clsKey].push(row);
    });
    
    var html = '';
    Object.keys(byClass).sort().forEach(function(clsKey){
      var rows = byClass[clsKey];
      html += '<tr style="background:#F1F5F9;"><td colspan="14" style="padding:8px;font-weight:900;color:#0F172A;text-align:right;border:1px solid #0F172A;">🏫 ' + esc(clsKey) + '</td></tr>';
      
      rows.forEach(function(row, idx){
        var hasGrades = (row.m1!=null || row.m2!=null || row.m3!=null || row.m4!=null || row.m5!=null);
        var bg = hasGrades ? '#fff' : '#F8FAFC';
        
        html += '<tr style="background:'+bg+';">';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-size:12px;">-</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;">'+arNum(idx+1)+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:right;font-weight:bold;">'+esc(row.name)+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#EFF6FF;">'+(row.m1!=null?arNum(row.m1):'—')+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#EFF6FF;">'+(row.m2!=null?arNum(row.m2):'—')+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#EFF6FF;">'+(row.m3!=null?arNum(row.m3):'—')+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#ECFEFF;">'+(row.m4!=null?arNum(row.m4):'—')+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#ECFEFF;">'+(row.m5!=null?arNum(row.m5):'—')+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;background:#FEF3C7;">'+(row.a1!=null?arNum(row.a1):'—')+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;">'+(row.half!=null?arNum(row.half):'—')+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;background:#FEF3C7;">'+(row.a2!=null?arNum(row.a2):'—')+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;background:#FEF3C7;">'+(row.annual!=null?arNum(row.annual):'—')+'</td>';
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;">'+(row.exam!=null?arNum(row.exam):'—')+'</td>';
        
        var finColor = (row.final != null && row.final >= (row.max||100)/2) ? '#D1FAE5;color:#047857' : (row.final != null ? '#FEE2E2;color:#DC2626' : '');
        html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:900;'+finColor+';">'+(row.final!=null?arNum(row.final):'—')+'</td>';
        html += '</tr>';
      });
    });
    
    $('#trTableBody').innerHTML = html;
    $('#trTableContainer').style.display = 'block';
    
  }).catch(function(){
    $('#trLoading').style.display = 'none';
    toast('تعذر تحميل الدرجات', 'err');
  });
}

/* ═══ تصدير Excel للمعلم ═══ */
function exportTeacherExcel(code){
  var t = TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  
  toast('⏳ جاري تجهيز ملف Excel...', '');
  
  api({action:'teacherGrades', key:key(), code:code}).then(function(r){
    var h = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" dir="rtl"><head><meta charset="utf-8"><style>table{border-collapse:collapse;width:100%;} th,td{border:1px solid #000;padding:6px;text-align:center;font-family:Arial;} th{background:#1E40AF;color:#fff;}</style></head><body>';
    h += '<h2 style="text-align:center;color:#1E40AF;">كشف درجات المعلم: ' + esc(t.name) + ' (' + esc(t.code) + ')</h2>';
    h += '<p style="text-align:center;">السنة الدراسية: ' + esc(getStudyYear()) + '</p><br>';
    
    if(r.ok && r.rows && r.rows.length > 0){
      var bySubject = {};
      r.rows.forEach(function(row){
        if(!bySubject[row.subject]) bySubject[row.subject] = {};
        var clsKey = row.grade + ' ' + row.section;
        if(!bySubject[row.subject][clsKey]) bySubject[row.subject][clsKey] = [];
        bySubject[row.subject][clsKey].push(row);
      });
      
      Object.keys(bySubject).forEach(function(subj){
        h += '<h3 style="color:#047857;border-bottom:2px solid #047857;">📘 ' + esc(subj) + '</h3>';
        Object.keys(bySubject[subj]).sort().forEach(function(clsKey){
          h += '<h4 style="margin-top:15px;">🏫 ' + esc(clsKey) + '</h4>';
          h += '<table><thead><tr><th>ت</th><th>اسم التلميذ</th><th>ت١</th><th>ت٢</th><th>ك١</th><th>آذار</th><th>نيسان</th><th>معدل ف١</th><th>نصف السنة</th><th>معدل ف٢</th><th>السعي السنوي</th><th>نهاية السنة</th><th>النهائية</th></tr></thead><tbody>';
          
          var rows = bySubject[subj][clsKey];
          rows.forEach(function(row, idx){
            h += '<tr>';
            h += '<td>' + arNum(idx+1) + '</td>';
            h += '<td style="text-align:right;font-weight:bold;">' + esc(row.name) + '</td>';
            h += '<td>' + (row.m1!=null?row.m1:'') + '</td>';
            h += '<td>' + (row.m2!=null?row.m2:'') + '</td>';
            h += '<td>' + (row.m3!=null?row.m3:'') + '</td>';
            h += '<td>' + (row.m4!=null?row.m4:'') + '</td>';
            h += '<td>' + (row.m5!=null?row.m5:'') + '</td>';
            h += '<td style="font-weight:bold;background:#FEF3C7;">' + (row.a1!=null?row.a1:'') + '</td>';
            h += '<td>' + (row.half!=null?row.half:'') + '</td>';
            h += '<td style="font-weight:bold;background:#FEF3C7;">' + (row.a2!=null?row.a2:'') + '</td>';
            h += '<td style="font-weight:bold;background:#FEF3C7;">' + (row.annual!=null?row.annual:'') + '</td>';
            h += '<td>' + (row.exam!=null?row.exam:'') + '</td>';
            h += '<td style="font-weight:900;">' + (row.final!=null?row.final:'') + '</td>';
            h += '</tr>';
          });
          h += '</tbody></table><br>';
        });
      });
    } else {
      h += '<p style="text-align:center;color:#DC2626;">لا توجد درجات مسجلة لهذا المعلم حتى الآن.</p>';
    }
    
    h += '</body></html>';
    
    var blob = new Blob(['\uFEFF' + h], {type: 'application/vnd.ms-excel;charset=utf-8;'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'كشف_المعلم_' + t.name.replace(/\s+/g, '_') + '.xls';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 5000);
    toast('✓ تم تصدير ملف Excel بنجاح', 'ok');
    
  }).catch(function(){
    toast('⚠️ تعذر تجهيز الملف', 'err');
  });
}

// ... (أبقِ على دوال editT, renderEditSubjects, addEditSubjectRow, updateEditSubject, removeEditSubject, saveEditedTeacher, delT, addNewTeacher, printTeachersList, exportTeachersListExcel, onSearchChange, onFilterSubjectChange, onFilterClassChange كما هي من الكود السابق)
