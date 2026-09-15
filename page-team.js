/* ═══ page-team.js — صفحة المعلمين (نسخة نهائية) ═══ */

var TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };
var EDIT_SUBJECTS = []; // مصفوفة لتخزين المواد والصفوف أثناء التعديل

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
      h += '<button class="btn sm danger" onclick="toggleLock(\''+escA(t.code)+'\')"> قفل</button>';
    }
    h += '</div></div>';
    if(t.subjects && t.subjects.length){
      h += '<div style="margin:10px 0;padding:10px;background:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0">';
      t.subjects.forEach(function(s){
        h += '<div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed #E2E8F0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">';
        h += '<div>';
        h += '<div style="font-weight:800;font-size:13px;margin-bottom:4px;color:'+col+'">📘 '+esc(s.name)+'</div>';
        if(s.classes && s.classes.length){
          h += '<div style="display:flex;gap:4px;flex-wrap:wrap;padding-right:10px">';
          s.classes.forEach(function(c){
            h += '<span style="background:#EFF6FF;color:#1E40AF;border-radius:8px;padding:3px 8px;font-size:11px;font-weight:700;border:1px solid #BFDBFE"> '+esc(c)+'</span>';
          });
          h += '</div>';
        }
        h += '</div>';
        var assignStr = s.name + ':' + s.classes.join('،');
        h += '<button class="btn sm danger" style="width:auto;padding:4px 8px;font-size:10px" onclick="removeAssignment(\''+escA(t.code)+'\',\''+escA(assignStr)+'\')" title="حذف هذه المادة والصف فقط">🗑 حذف المادة</button>';
        h += '</div>';
      });
      h += '</div>';
    }
    h += '<div style="display:flex;gap:12px;flex-wrap:wrap;padding-top:10px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B">';
    h += '<span>📊 آخر دخول: <b>'+last+'</b></span>';
    h += '<span>📝 درجات مرسلة: <b>'+arNum(t.sentCount||0)+'</b></span>';
    h += '<span> عدد الصفوف: <b>'+arNum(cnt)+'</b></span>';
    h += '<span>📘 عدد المواد: <b>'+arNum(t.subjects?t.subjects.length:0)+'</b></span>';
    h += '</div>';
    h += '<div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">';
    h += '<button class="btn sm" style="background:#7C3AED;color:#fff" onclick="editT(\''+escA(t.code)+'\')">✏️ تعديل شامل</button>';
    h += '<button class="btn sm" style="background:#0891B2;color:#fff" onclick="printTeacherRecord(\''+escA(t.code)+'\')">🖨️ كشف المعلم</button>';
    h += '<button class="btn sm danger" onclick="delT(\''+escA(t.code)+'\')">🗑 حذف المعلم</button>';
    h += '</div></div>';
  });
  el.innerHTML = h;
}

function sendWA(code,name){
  var msg='مرحباً '+name+' 👋\n\nكودك في تطبيق «درجاتي»:\n\n '+code+'\n\nثبّت التطبيق وأدخل هذا الكود.';
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

function removeAssignment(code, assignment){
  confirmDlg('حذف هذه المادة والصف المحدد فقط؟\n\n'+assignment, function(){
    api({action:'removeTeacherAssignment', key:key(), code:code, assignment:assignment}).then(function(r){
      if(r.ok){ toast('✓ '+r.message, 'ok'); loadTeachers(); }
      else{ toast('❌ '+r.error, 'err'); }
    });
  }, 'حذف المادة');
}

/* ═══ تعديل معلم - نافذة ديناميكية ══ */
function editT(code){
  var t = TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  
  // ملء الحقول الأساسية
  var nameEl = $('#editTName');
  var codeEl = $('#editTCode');
  if(nameEl) nameEl.value = t.name;
  if(codeEl) codeEl.value = t.code;
  
  // بناء مصفوفة المواد والصفوف
  EDIT_SUBJECTS = [];
  if(t.subjects && t.subjects.length){
    t.subjects.forEach(function(s){
      if(s.classes && s.classes.length){
        s.classes.forEach(function(c){
          EDIT_SUBJECTS.push({subject: s.name, cls: c});
        });
      }
    });
  }
  
  // عرض الصفوف
  renderEditSubjects();
  
  // فتح النافذة
  var m = $('#editTeacherModal');
  if(m) m.classList.add('show');
}

function renderEditSubjects(){
  var container = $('#editSubjectsContainer');
  if(!container) return;
  
  if(EDIT_SUBJECTS.length === 0){
    container.innerHTML = '<div style="text-align:center; color:#94A3B8; padding:10px;">لا توجد مواد مضافة. اضغط "إضافة مادة" أدناه.</div>';
    return;
  }
  
  var html = '';
  EDIT_SUBJECTS.forEach(function(item, idx){
    html += '<div class="edit-subject-row">';
    html += '<span class="row-num">'+(idx+1)+'.</span>';
    html += '<select onchange="updateEditSubject('+idx+',\'subject\',this.value)">';
    html += '<option value="">اختر المادة</option>';
    var subjects = ['التربية الإسلامية','اللغة العربية','اللغة الانكليزية','الرياضيات','العلوم','الاجتماعيات'];
    subjects.forEach(function(s){
      html += '<option value="'+esc(s)+'"'+(item.subject===s?' selected':'')+'>'+esc(s)+'</option>';
    });
    html += '</select>';
    html += '<select onchange="updateEditSubject('+idx+',\'cls\',this.value)">';
    html += '<option value="">اختر الصف</option>';
    var classes = ['الخامس أ','الخامس ب','الخامس ج','السادس أ','السادس ب','السادس ج'];
    classes.forEach(function(c){
      html += '<option value="'+esc(c)+'"'+(item.cls===c?' selected':'')+'>'+esc(c)+'</option>';
    });
    html += '</select>';
    html += '<button class="remove-btn" onclick="removeEditSubject('+idx+')">🗑</button>';
    html += '</div>';
  });
  
  container.innerHTML = html;
}

function addEditSubjectRow(){
  EDIT_SUBJECTS.push({subject: '', cls: ''});
  renderEditSubjects();
}

function updateEditSubject(idx, field, value){
  if(EDIT_SUBJECTS[idx]){
    EDIT_SUBJECTS[idx][field] = value;
  }
}

function removeEditSubject(idx){
  EDIT_SUBJECTS.splice(idx, 1);
  renderEditSubjects();
}

function saveEditedTeacher(){
  var nameEl = $('#editTName');
  var codeEl = $('#editTCode');
  
  if(!nameEl || !codeEl){ toast('خطأ في العناصر', 'err'); return; }
  
  var name = nameEl.value.trim();
  var newCode = codeEl.value.trim();
  
  if(!name){ toast('⚠️ اسم المعلم مطلوب', 'err'); return; }
  if(!newCode){ toast('⚠️ رمز الدخول مطلوب', 'err'); return; }
  
  // التحقق من المواد والصفوف
  var validSubjects = EDIT_SUBJECTS.filter(function(s){ return s.subject && s.cls; });
  if(validSubjects.length === 0){
    toast('⚠️ يجب إضافة مادة واحدة على الأقل', 'err');
    return;
  }
  
  // بناء سلسلة المواد بالصيغة: مادة:صف | مادة:صف
  var subjectsBySubject = {};
  validSubjects.forEach(function(s){
    if(!subjectsBySubject[s.subject]) subjectsBySubject[s.subject] = [];
    if(subjectsBySubject[s.subject].indexOf(s.cls) === -1){
      subjectsBySubject[s.subject].push(s.cls);
    }
  });
  
  var subjectsData = Object.keys(subjectsBySubject).map(function(subj){
    return subj + ':' + subjectsBySubject[subj].join('،');
  }).join(' | ');
  
  toast('⏳ جاري الحفظ...', '');
  
  api({
    action: 'updateTeacherFull',
    key: key(),
    code: newCode,
    oldCode: TEAM.teachers.find(function(t){ return t.name === name; })?.code || '',
    name: name,
    subjectsData: subjectsData
  }).then(function(r){
    if(r.ok){
      toast('✓ تم الحفظ بنجاح', 'ok');
      hideModal('editTeacherModal');
      loadTeachers();
    } else {
      toast('❌ '+r.error, 'err');
    }
  }).catch(function(){
    toast('⚠️ تعذر الاتصال', 'err');
  });
}

function delT(code){
  var t = TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  confirmDlg('حذف المعلم '+t.name+' وجميع بياناته نهائياً؟',function(){
    api({action:'delTeacher',key:key(),code:code}).then(function(r){
      if(r.ok){toast('✓ تم الحذف','ok');loadTeachers();}
      else{toast('❌ '+r.error,'err');}
    });
  },'حذف نهائي');
}

/* ═══ إضافة معلم جديد ══ */
function addNewTeacher(){
  var nameEl = document.getElementById('ntName');
  var subjectEl = document.getElementById('ntSubject');
  var clsEl = document.getElementById('ntCls');
  
  if(!nameEl || !subjectEl || !clsEl){
    alert('خطأ: لم يتم العثور على حقول الإدخال');
    return;
  }
  
  var name = String(nameEl.value || '').trim();
  var subject = String(subjectEl.value || '').trim();
  var clsVal = String(clsEl.value || '').trim();
  
  if(!name){ toast('⚠️ اكتب اسم المعلم', 'err'); nameEl.focus(); return; }
  if(!subject){ toast('⚠️ اختر المادة', 'err'); subjectEl.focus(); return; }
  if(!clsVal){ toast('⚠️ اختر الصف', 'err'); clsEl.focus(); return; }
  
  toast('⏳ جاري الإضافة...', '');
  
  api({action:'addTeacher', key:key(), name:name, subject:subject, cls:clsVal}).then(function(r){
    if(r.ok){
      toast('✓ '+(r.message||'تمت الإضافة! الكود: '+r.code), 'ok');
      subjectEl.value = '';
      clsEl.value = '';
      subjectEl.focus();
      loadTeachers();
    } else {
      toast('❌ '+(r.error||'خطأ'), 'err');
    }
  }).catch(function(){
    toast('⚠️ تعذر الاتصال', 'err');
  });
}

/* ══ طباعة كشف المعلم ═══ */
function printTeacherRecord(code){
  var t = TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  
  var h = '<div style="font-family:Tajawal,Arial,sans-serif;width:190mm;margin:0 auto;padding:10mm">';
  h += '<h2 style="text-align:center;color:#1E40AF">كشف المعلم: '+esc(t.name)+'</h2>';
  h += '<p style="text-align:center;color:#64748B">الكود: <b>'+esc(t.code)+'</b> | السنة الدراسية: '+esc(getStudyYear())+'</p>';
  
  if(t.subjects && t.subjects.length){
    t.subjects.forEach(function(s){
      h += '<div style="margin-top:20px;page-break-inside:avoid">';
      h += '<h3 style="color:#047857;border-bottom:2px solid #047857;padding-bottom:5px">📘 '+esc(s.name)+'</h3>';
      if(s.classes && s.classes.length){
        s.classes.forEach(function(c){
          h += '<div style="margin:10px 0;padding:10px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0">';
          h += '<b>🏫 '+esc(c)+'</b>';
          h += '<table style="width:100%;border-collapse:collapse;margin-top:10px;border:1px solid #0F172A">';
          h += '<thead><tr style="background:#1E40AF;color:#fff">';
          h += '<th style="padding:6px;border:1px solid #0F172A">ت</th>';
          h += '<th style="padding:6px;border:1px solid #0F172A">اسم التلميذ</th>';
          h += '<th style="padding:6px;border:1px solid #0F172A">ت١</th>';
          h += '<th style="padding:6px;border:1px solid #0F172A">ت٢</th>';
          h += '<th style="padding:6px;border:1px solid #0F172A">ك١</th>';
          h += '<th style="padding:6px;border:1px solid #0F172A">آذار</th>';
          h += '<th style="padding:6px;border:1px solid #0F172A">نيسان</th>';
          h += '</tr></thead><tbody>';
          h += '<tr><td colspan="7" style="padding:20px;text-align:center;color:#64748B">يتم تعبئة الأسماء والدرجات من صفحة الإدخال الإداري</td></tr>';
          h += '</tbody></table></div>';
        });
      }
      h += '</div>';
    });
  } else {
    h += '<p style="text-align:center;color:#DC2626">لا توجد مواد مضافة لهذا المعلم</p>';
  }
  
  h += '</div>';
  printWin(h);
}

function printTeachersList(){
  if(!TEAM.filtered.length){toast('لا يوجد معلمون','err');return;}
  var h='<div style="font-family:Tajawal;width:190mm;margin:0 auto;padding:10mm">';
  h+='<h1 style="text-align:center;color:#1E40AF">قائمة المعلمين والمواد</h1>';
  h+='<table style="width:100%;border-collapse:collapse;border:2px solid #0F172A"><thead><tr style="background:#1E40AF;color:#fff">';
  h+='<th style="padding:8px;border:1px solid #0F172A">الكود</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">الاسم</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">المواد والصفوف</th>';
  h+='<th style="padding:8px;border:1px solid #0F172A">الحالة</th></tr></thead><tbody>';
  TEAM.filtered.forEach(function(t){
    var sub=t.subjects?t.subjects.map(function(s){return s.name+': '+(s.classes||[]).join('،');}).join(' | '):'';
    h+='<tr><td style="padding:8px;border:1px solid #0F172A;text-align:center">'+esc(t.code)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A">'+esc(t.name)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A;font-size:11px">'+esc(sub)+'</td>';
    h+='<td style="padding:8px;border:1px solid #0F172A;text-align:center">'+(t.locked?'🔒 مقفل':'🔓 مفتوح')+'</td></tr>';
  });
  h+='</tbody></table></div>';
  printWin(h);
}

function exportTeachersExcel(){
  if(!TEAM.filtered.length){toast('لا يوجد معلمون','err');return;}
  var h='<table dir="rtl"><thead><tr style="background:#1E40AF;color:#fff">';
  h+='<th>الكود</th><th>الاسم</th><th>المواد والصفوف</th><th>الحالة</th><th>آخر دخول</th><th>درجات مرسلة</th></tr></thead><tbody>';
  TEAM.filtered.forEach(function(t){
    var sub=t.subjects?t.subjects.map(function(s){return s.name+': '+(s.classes||[]).join('،');}).join(' | '):'';
    var last=t.lastLogin?fmtDate(t.lastLogin):'-';
    h+='<tr><td>'+esc(t.code)+'</td><td>'+esc(t.name)+'</td><td>'+esc(sub)+'</td>';
    h+='<td>'+(t.locked?'مقفل':'مفتوح')+'</td><td>'+last+'</td><td>'+arNum(t.sentCount||0)+'</td></tr>';
  });
  h+='</tbody></table>';
  downloadXLS('قائمة_المعلمين', 'قائمة المعلمين — ' + getStudyYear(), h);
}
