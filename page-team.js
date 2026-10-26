/* ═══ page-team.js — صفحة المعلمين (35 تلميذ + ألوان مضمونة) ═══ */

var TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };
var EDIT_SUBJECTS = [];
var CURRENT_TEACHER_GRADES = [];
var PRINT_SETTINGS = {
  schoolName: localStorage.getItem('print_school_name') || 'مدرسة المنهل الابتدائية',
  schoolYear: localStorage.getItem('print_school_year') || '٢٠٢٥ - ٢٠٢٦',
  schoolType: localStorage.getItem('print_school_type') || 'للبنين'
};
var CURRENT_PRINT_DATA = null;

function toArabicNumerals(num) {
  if (num === null || num === undefined || num === '') return '';
  var arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(num).replace(/[0-9]/g, function(d) { return arabicDigits[parseInt(d)]; });
}

registerPage('team', {
  enter: function() {
    TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };
    loadTeachers();
  }
});

(function(){
  if(document.getElementById('teamProStyles')) return;
  var s = document.createElement('style'); 
  s.id = 'teamProStyles';
  s.textContent = 
  '.team-teacher-card{position:relative;overflow:hidden;border-radius:20px;padding:20px;box-shadow:0 10px 30px rgba(15,23,42,.12);transition:.25s;color:#fff;margin-bottom:16px}'+
  '.team-teacher-card:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(0,0,0,.18)}'+
  '.team-top{display:flex;align-items:center;gap:14px;margin-bottom:14px}'+
  '.team-avatar{width:60px;height:60px;display:grid;place-items:center;border-radius:16px;font-size:28px;font-weight:900;flex:none;box-shadow:0 6px 16px rgba(0,0,0,.15);background:rgba(255,255,255,.95)}'+
  '.team-main{min-width:0;flex:1}'+
  '.team-name{font-size:19px;font-weight:900;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.2);white-space:normal;word-wrap:break-word;line-height:1.3;margin-bottom:4px}'+
  '.team-code{font-size:12px;color:rgba(255,255,255,.9);font-family:monospace;font-weight:700}'+
  '.team-status{font-size:11px;font-weight:900;padding:7px 12px;border-radius:999px;white-space:nowrap;background:rgba(255,255,255,.95);box-shadow:0 2px 8px rgba(0,0,0,.1)}'+
  '.team-status.open{color:#047857}'+
  '.team-status.locked{color:#dc2626}'+
  '.team-meta{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}'+
  '.team-meta-item{padding:7px 12px;border-radius:11px;background:rgba(255,255,255,.2);font-size:12px;color:#fff;font-weight:700;display:flex;align-items:center;gap:5px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15)}'+
  '.team-actions{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}'+
  '.team-btn{flex:1;min-width:80px;padding:9px 8px;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;transition:.2s;display:flex;align-items:center;justify-content:center;gap:5px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.15);color:#fff}'+
  '.team-btn:hover{background:rgba(255,255,255,.3)}'+
  '.team-btn.danger{background:rgba(255,255,255,.95);color:#dc2626;border-color:transparent}'+
  '.team-btn.danger:hover{background:#fff}'+
  '.team-btn.success{background:rgba(255,255,255,.95);color:#047857;border-color:transparent}'+
  '.team-btn.success:hover{background:#fff}'+
  '.team-subjects-box{background:rgba(255,255,255,.15);border-radius:14px;padding:14px;margin-top:14px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.15)}'+
  '.team-subject-item{margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.15)}'+
  '.team-subject-item:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}'+
  '.team-subject-name{font-weight:800;font-size:13px;margin-bottom:6px;color:#fff}'+
  '.team-class-badge{display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,.9);color:#1d4ed8;border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700;margin:3px}'+
  '.team-class-badge button{width:18px;height:18px;border-radius:50%;background:#dc2626;color:#fff;border:none;font-size:10px;cursor:pointer;display:grid;place-items:center;margin-right:4px}'+
  '@media(max-width:600px){.team-actions{flex-direction:column}.team-btn{width:100%}}';
  document.head.appendChild(s);
})();

function loadTeachers() {
  var el = $('#teamList');
  if (!el) return;
  el.innerHTML = '<div class="empty" style="padding:40px;text-align:center">⏳ جاري تحميل بيانات المعلمين...</div>';
  
  api({action:'adminData', key:key()}).then(function(r){
    if(!r.ok){ toast('❌ '+r.error, 'err'); return; }
    TEAM.teachers = r.teachers || [];
    applyFilters();
  }).catch(function(err){
    console.error('Load teachers error:', err);
    toast('تعذر الاتصال', 'err');
    if(el) el.innerHTML = '<div class="empty" style="padding:40px;text-align:center">️ تعذر الاتصال بالخادم</div>';
  });
}

function applyFilters(){
  TEAM.filtered = TEAM.teachers.filter(function(t){
    var s1 = !TEAM.search || t.name.indexOf(TEAM.search)!==-1 || t.code.indexOf(TEAM.search)!==-1;
    var s2 = !TEAM.filterSubject || (t.subjects && t.subjects.some(function(x){return x.name===TEAM.filterSubject;}));
    var s3 = !TEAM.filterClass || (t.subjects && t.subjects.some(function(x){return x.classes && x.classes.indexOf(TEAM.filterClass)!==-1;}));
    return s1 && s2 && s3;
  });
  renderTeachers();
}

function renderTeachers(){
  var el = $('#teamList');
  if(!el) return;
  if(!TEAM.filtered.length){
    el.innerHTML = '<div class="empty" style="padding:40px;text-align:center">📭 لا يوجد معلمون مطابقون للبحث</div>';
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
  
  var h = '';
  TEAM.filtered.forEach(function(t,i){
    var theme = colors[i%colors.length];
    var last = t.lastLogin ? ago(t.lastLogin) : 'لم يدخل بعد';
    var cnt = 0;
    if(t.subjects) t.subjects.forEach(function(s){ if(s.classes) cnt+=s.classes.length; });
    
    h += '<div class="team-teacher-card" style="background:'+theme.gradient+'">';
    h += '<div class="team-top">';
    h += '<div class="team-avatar" style="color:'+theme.accent+'">'+esc((t.name||'?').trim().charAt(0))+'</div>';
    h += '<div class="team-main">';
    h += '<div class="team-name">'+esc(t.name)+'</div>';
    h += '<div class="team-code">🔑 '+esc(t.code)+'</div>';
    h += '</div>';
    h += '<div class="team-status '+(t.locked?'locked':'open')+'">'+(t.locked?'🔒 مقفل':'🟢 مفتوح')+'</div>';
    h += '</div>';
    
    if(t.subjects && t.subjects.length){
      h += '<div class="team-subjects-box">';
      t.subjects.forEach(function(s){
        h += '<div class="team-subject-item">';
        h += '<div class="team-subject-name">📘 '+esc(s.name)+'</div>';
        if(s.classes && s.classes.length){
          s.classes.forEach(function(c){
            h += '<span class="team-class-badge">🏫 '+esc(c)+' <button onclick="event.stopPropagation();removeSpecificClass(\''+escA(t.code)+'\',\''+escA(s.name)+'\',\''+escA(c)+'\')" title="حذف">✕</button></span>';
          });
        }
        h += '</div>';
      });
      h += '</div>';
    }
    
    h += '<div class="team-meta">';
    h += '<div class="team-meta-item">📊 آخر دخول: '+esc(last)+'</div>';
    h += '<div class="team-meta-item">📝 درجات: '+arNum(t.sentCount||0)+'</div>';
    h += '<div class="team-meta-item"> شعب: '+arNum(cnt)+'</div>';
    h += '</div>';
    
    h += '<div class="team-actions">';
    h += '<button class="team-btn" onclick="event.stopPropagation();copyText(\''+escA(t.code)+'\')">📋 نسخ</button>';
    h += '<button class="team-btn success" onclick="event.stopPropagation();sendWA(\''+escA(t.code)+'\',\''+escA(t.name)+'\')">📱 واتساب</button>';
    h += '<button class="team-btn" onclick="event.stopPropagation();showQRCode(\''+escA(t.code)+'\',\''+escA(t.name)+'\')">📱 باركود</button>';
    h += '<button class="team-btn" onclick="event.stopPropagation();editT(\''+escA(t.code)+'\')">✏️ تعديل</button>';
    h += '<button class="team-btn" onclick="event.stopPropagation();openTeacherRecord(\''+escA(t.code)+'\')">📊 الكشف</button>';
    h += '<button class="team-btn success" onclick="event.stopPropagation();openExportExcelSelection(\''+escA(t.code)+'\')">📥 Excel</button>';
    
    if(t.locked){
      h += '<button class="team-btn success" onclick="event.stopPropagation();toggleLock(\''+escA(t.code)+'\')">🔓 فتح</button>';
    }else{
      h += '<button class="team-btn danger" onclick="event.stopPropagation();toggleLock(\''+escA(t.code)+'\')"> قفل</button>';
    }
    h += '<button class="team-btn danger" onclick="event.stopPropagation();delT(\''+escA(t.code)+'\')">🗑 حذف</button>';
    h += '</div>';
    h += '</div>';
  });
  el.innerHTML = h;
}

function showQRCode(code, name){
  var currentUrl = window.location.href;
  var appUrl = currentUrl.replace('admin.html', 'index.html');
  if(appUrl === currentUrl) appUrl = window.location.origin + '/darajati/index.html';
  
  var qrData = 'مرحباً ' + name + '\nكودك في تطبيق درجاتي: ' + code + '\nرابط التحميل: ' + appUrl;
  var qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(qrData);
  
  var modalHtml = 
    '<div class="ovl show" id="qrModal" style="z-index:2000;">'+
      '<div class="modal" style="max-width:350px;text-align:center;">'+
        '<h3 style="margin-bottom:15px;color:#1E40AF">📱 باركود المعلم</h3>'+
        '<div style="background:#fff;padding:15px;border-radius:12px;display:inline-block;margin-bottom:15px;">'+
          '<img src="'+qrApiUrl+'" alt="QR Code" style="width:200px;height:200px;">'+
        '</div>'+
        '<div style="background:#F8FAFC;padding:12px;border-radius:10px;margin-bottom:15px;text-align:right;font-size:13px;line-height:1.6;">'+
          '<div><b>الاسم:</b> '+esc(name)+'</div>'+
          '<div><b>الكود:</b> <span dir="ltr" style="font-family:monospace;font-weight:900;color:#1E40AF">'+esc(code)+'</span></div>'+
        '</div>'+
        '<button class="btn ok" style="width:100%;margin:0" onclick="document.getElementById(\'qrModal\').remove()">إغلاق</button>'+
      '</div>'+
    '</div>';
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function sendWA(code,name){
  var currentUrl = window.location.href.replace('admin.html', 'index.html');
  var msg='مرحباً '+name+' \n\nكودك في تطبيق «درجاتي»:\n\n 🔑 '+code+'\n\nرابط التطبيق:\n'+currentUrl+'\n\nثبّت التطبيق وأدخل هذا الكود.';
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
}

function copyText(text){
  if(navigator.clipboard){
    navigator.clipboard.writeText(text).then(function(){ toast('✓ تم نسخ الكود', 'ok'); });
  }
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

function removeSpecificClass(code, subject, cls){
  confirmDlg('حذف الشعبة "'+cls+'" من مادة "'+subject+'" فقط؟', function(){
    api({action:'removeTeacherClass', key:key(), code:code, subject:subject, cls:cls}).then(function(r){
      if(r.ok){ toast('✓ '+r.message, 'ok'); loadTeachers(); }
      else{ toast('❌ '+r.error, 'err'); }
    });
  }, 'حذف الشعبة');
}

function editT(code){
  var t = TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  var nameEl = $('#editTName');
  var codeEl = $('#editTCode');
  if(nameEl) nameEl.value = t.name;
  if(codeEl) codeEl.value = t.code;
  
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
  renderEditSubjects();
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

function addEditSubjectRow(){ EDIT_SUBJECTS.push({subject: '', cls: ''}); renderEditSubjects(); }
function updateEditSubject(idx, field, value){ if(EDIT_SUBJECTS[idx]){ EDIT_SUBJECTS[idx][field] = value; } }
function removeEditSubject(idx){ EDIT_SUBJECTS.splice(idx, 1); renderEditSubjects(); }

function saveEditedTeacher(){
  var nameEl = $('#editTName');
  var codeEl = $('#editTCode');
  if(!nameEl || !codeEl){ toast('خطأ في العناصر', 'err'); return; }
  
  var name = nameEl.value.trim();
  var newCode = codeEl.value.trim();
  if(!name){ toast('⚠️ اسم المعلم مطلوب', 'err'); return; }
  if(!newCode){ toast('⚠️ رمز الدخول مطلوب', 'err'); return; }
  
  var validSubjects = EDIT_SUBJECTS.filter(function(s){ return s.subject && s.cls; });
  if(validSubjects.length === 0){ toast('⚠️ يجب إضافة مادة واحدة على الأقل', 'err'); return; }
  
  var subjectsBySubject = {};
  validSubjects.forEach(function(s){
    if(!subjectsBySubject[s.subject]) subjectsBySubject[s.subject] = [];
    if(subjectsBySubject[s.subject].indexOf(s.cls) === -1){ subjectsBySubject[s.subject].push(s.cls); }
  });
  
  var subjectsData = Object.keys(subjectsBySubject).map(function(subj){
    return subj + ':' + subjectsBySubject[subj].join('،');
  }).join(' | ');
  
  toast(' جاري الحفظ...', '');
  var oldCode = '';
  var existingTeacher = TEAM.teachers.find(function(t){ return t.name === name; });
  if(existingTeacher) oldCode = existingTeacher.code;
  
  api({ action: 'updateTeacherFull', key: key(), code: newCode, oldCode: oldCode, name: name, subjectsData: subjectsData }).then(function(r){
    if(r.ok){ toast('✓ تم الحفظ بنجاح', 'ok'); hideModal('editTeacherModal'); loadTeachers(); }
    else { toast('❌ '+r.error, 'err'); }
  }).catch(function(err){ console.error('Save error:', err); toast('️ تعذر الاتصال', 'err'); });
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

function addNewTeacher(){
  var nameEl = document.getElementById('ntName');
  var subjectEl = document.getElementById('ntSubject');
  var clsEl = document.getElementById('ntCls');
  if(!nameEl || !subjectEl || !clsEl){ alert('خطأ: لم يتم العثور على حقول الإدخال'); return; }
  
  var name = String(nameEl.value || '').trim();
  var subject = String(subjectEl.value || '').trim();
  var clsVal = String(clsEl.value || '').trim();
  if(!name){ toast('️ اكتب اسم المعلم', 'err'); nameEl.focus(); return; }
  if(!subject){ toast('️ اختر المادة', 'err'); subjectEl.focus(); return; }
  if(!clsVal){ toast('⚠️ اختر الصف', 'err'); clsEl.focus(); return; }
  
  toast(' جاري الإضافة...', '');
  api({action:'addTeacher', key:key(), name:name, subject:subject, cls:clsVal}).then(function(r){
    if(r.ok){
      toast('✓ '+(r.message||'تمت الإضافة! الكود: '+r.code), 'ok');
      subjectEl.value = ''; clsEl.value = ''; subjectEl.focus(); loadTeachers();
    } else { toast('❌ '+(r.error||'خطأ'), 'err'); }
  }).catch(function(err){ console.error('Add teacher error:', err); toast('⚠️ تعذر الاتصال', 'err'); });
}

/* ═══ كشف المعلم ═══ */
function openTeacherRecord(code){
  var t = TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  $('#trTeacherName').textContent = t.name;
  $('#trTableContainer').style.display = 'none';
  $('#trEmpty').style.display = 'none';
  $('#trLoading').style.display = 'none';
  $('#trSubjectsList').innerHTML = '';
  
  if(!t.subjects || t.subjects.length === 0){
    $('#trEmpty').style.display = 'block';
    $('#trEmpty').textContent = 'لا توجد مواد مسجلة لهذا المعلم.';
  } else {
    t.subjects.forEach(function(s){
      var btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.cssText = 'width:auto; flex:1; min-width:120px; background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE;';
      btn.textContent = '📘 ' + s.name;
      btn.onclick = function(){ showSubjectClasses(code, s.name, t.name, s.classes || []); };
      $('#trSubjectsList').appendChild(btn);
    });
  }
  $('#teacherRecordModal').classList.add('show');
}

function showSubjectClasses(code, subjectName, teacherName, classes){
  if(!classes || classes.length === 0){ toast('⚠️ لا توجد شعب مسجلة', 'err'); return; }
  var listEl = $('#trSubjectsList');
  listEl.innerHTML = '';
  
  var backBtn = document.createElement('button');
  backBtn.className = 'btn';
  backBtn.style.cssText = 'width:auto; background:#F1F5F9; color:#475569; border:1px solid #E2E8F0; margin-bottom:10px;';
  backBtn.textContent = '→ رجوع للمواد';
  backBtn.onclick = function(){ openTeacherRecord(code); };
  listEl.appendChild(backBtn);
  
  var title = document.createElement('div');
  title.style.cssText = 'width:100%; text-align:center; font-weight:900; font-size:16px; color:#0F172A; margin:10px 0;';
  title.textContent = '📘 ' + subjectName + ' - اختر الشعبة';
  listEl.appendChild(title);
  
  if(classes.length === 1){
    showSubjectRecord(code, subjectName, teacherName, classes);
    return;
  }
  
  classes.forEach(function(cls){
    var btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.cssText = 'width:auto; flex:1; min-width:120px; background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;';
    btn.textContent = '  ' + cls;
    btn.onclick = function(){ showSubjectRecord(code, subjectName, teacherName, [cls]); };
    listEl.appendChild(btn);
  });
  
  var allBtn = document.createElement('button');
  allBtn.className = 'btn';
  allBtn.style.cssText = 'width:auto; background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE; margin-top:10px;';
  allBtn.textContent = '📋 عرض كل الشعب';
  allBtn.onclick = function(){ showSubjectRecord(code, subjectName, teacherName, classes); };
  listEl.appendChild(allBtn);
}

function showSubjectRecord(code, subjectName, teacherName, classes){
  $('#trTableContainer').style.display = 'none';
  $('#trLoading').style.display = 'block';
  $('#trSubjectTitle').textContent = '📘 ' + subjectName;
  $('#trTableBody').innerHTML = '';
  
  api({action:'teacherGrades', key:key(), code:code}).then(function(r){
    if(!r.ok){ $('#trLoading').style.display = 'none'; toast('❌ '+r.error, 'err'); return; }
    
    var allGrades = r.rows || [];
    var subjectGrades = allGrades.filter(function(g){ return (g.subject||'').trim() === subjectName.trim(); });
    
    if(!classes || classes.length === 0){
      $('#trLoading').style.display = 'none';
      $('#trTableContainer').style.display = 'block';
      $('#trTableBody').innerHTML = '<tr><td colspan="14" style="text-align:center;padding:20px;color:#64748B;">لا توجد صفوف مسجلة.</td></tr>';
      return;
    }
    
    var allStudentData = [];
    var completedRequests = 0;
    var totalFetched = 0;
    
    classes.forEach(function(cls){
      api({action:'getStudents', key:key(), code:code, cls:cls}).then(function(sr){
        completedRequests++;
        var count = sr.names ? sr.names.length : 0;
        totalFetched += count;
        
        if(sr.ok && sr.names && sr.names.length > 0){
          var grade = (sr.grade || cls.split(' ')[0] || '').trim();
          var section = (sr.section || cls.split(' ')[1] || '').trim();
          var targetCls = cls.trim();
          
          sr.names.forEach(function(studentName){
            var sName = (studentName || '').trim();
            var gradeRow = subjectGrades.find(function(g){
              var gName = (g.name || '').trim();
              var gCls = (g.cls || '').trim();
              var gGrade = (g.grade || '').trim();
              var gSection = (g.section || '').trim();
              return gName === sName && (gCls === targetCls || (gGrade === grade && gSection === section));
            });
            allStudentData.push({ grade: grade, section: section, name: studentName, grades: gradeRow || null });
          });
        }
        
        if(completedRequests === classes.length){
          if(totalFetched === 0){
            $('#trLoading').style.display = 'none';
            $('#trTableContainer').style.display = 'block';
            $('#trTableBody').innerHTML = '<tr><td colspan="14" style="text-align:center;padding:30px;"><div style="font-size:48px;margin-bottom:10px;">📭</div><div style="font-size:16px;font-weight:800;color:#DC2626;margin-bottom:8px;">لا توجد أسماء تلاميذ</div><div style="font-size:13px;color:#64748B;">اذهب إلى صفحة "التلاميذ" وأضف الأسماء.</div></td></tr>';
          } else {
            renderTeacherRecordTable(subjectName, allStudentData, classes);
          }
        }
      }).catch(function(err){
        completedRequests++;
        if(completedRequests === classes.length){
          if(totalFetched === 0){
            $('#trLoading').style.display = 'none';
            $('#trTableContainer').style.display = 'block';
            $('#trTableBody').innerHTML = '<tr><td colspan="14" style="text-align:center;padding:20px;">⚠️ خطأ في جلب البيانات</td></tr>';
          } else {
            renderTeacherRecordTable(subjectName, allStudentData, classes);
          }
        }
      });
    });
  }).catch(function(err){
    $('#trLoading').style.display = 'none';
    toast('️ تعذر تحميل البيانات', 'err');
  });
}

function renderTeacherRecordTable(subjectName, studentData, classes){
  $('#trLoading').style.display = 'none';
  $('#trTableContainer').style.display = 'block';
  if(studentData.length === 0){
    $('#trTableBody').innerHTML = '<tr><td colspan="14" style="text-align:center;padding:20px;"> لا توجد بيانات.</td></tr>';
    return;
  }
  
  var byClass = {};
  studentData.forEach(function(s){
    var clsKey = (s.grade || '') + ' ' + (s.section || '');
    clsKey = clsKey.trim();
    if(!byClass[clsKey]) byClass[clsKey] = [];
    byClass[clsKey].push(s);
  });
  
  var html = '';
  var globalIndex = 1;
  Object.keys(byClass).sort().forEach(function(clsKey){
    var rows = byClass[clsKey];
    html += '<tr style="background:#F1F5F9;"><td colspan="14" style="padding:8px;font-weight:900;color:#0F172A;text-align:right;border:1px solid #0F172A;">🏫 ' + esc(clsKey) + '</td></tr>';
    rows.forEach(function(s){
      var g = s.grades;
      var hasGrades = g && (g.m1!=null || g.m2!=null || g.m3!=null || g.m4!=null || g.m5!=null);
      var bg = hasGrades ? '#fff' : '#F8FAFC';
      
      html += '<tr style="background:'+bg+';">';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;font-size:13px;font-weight:700;color:#000;">'+arNum(globalIndex)+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:right;font-weight:800;color:#000;font-size:12px;">'+esc(s.name)+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;background:#EFF6FF;font-size:13px;font-weight:700;color:#000;">'+(g&&g.m1!=null?arNum(g.m1):'—')+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;background:#EFF6FF;font-size:13px;font-weight:700;color:#000;">'+(g&&g.m2!=null?arNum(g.m2):'—')+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;background:#EFF6FF;font-size:13px;font-weight:700;color:#000;">'+(g&&g.m3!=null?arNum(g.m3):'—')+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;font-weight:800;background:#FEF3C7;font-size:13px;color:#000;">'+(g&&g.a1!=null?arNum(g.a1):'—')+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;font-size:13px;font-weight:700;color:#000;">'+(g&&g.half!=null?arNum(g.half):'—')+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;background:#ECFEFF;font-size:13px;font-weight:700;color:#000;">'+(g&&g.m4!=null?arNum(g.m4):'—')+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;background:#ECFEFF;font-size:13px;font-weight:700;color:#000;">'+(g&&g.m5!=null?arNum(g.m5):'—')+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;font-weight:800;background:#FEF3C7;font-size:13px;color:#000;">'+(g&&g.a2!=null?arNum(g.a2):'—')+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;font-weight:800;background:#FEF3C7;font-size:13px;color:#000;">'+(g&&g.annual!=null?arNum(g.annual):'—')+'</td>';
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;font-size:13px;font-weight:700;color:#000;">'+(g&&g.exam!=null?arNum(g.exam):'—')+'</td>';
      var finColor = (g && g.final != null && g.final >= (g.max||100)/2) ? '#D1FAE5;color:#047857' : (g && g.final != null ? '#FEE2E2;color:#DC2626' : 'color:#000');
      html += '<td style="padding:8px;border:1px solid #CBD5E1;text-align:center;font-weight:900;font-size:14px;'+finColor+';">'+(g&&g.final!=null?arNum(g.final):'—')+'</td>';
      html += '</tr>';
      globalIndex++;
    });
  });
  $('#trTableBody').innerHTML = html;
  CURRENT_PRINT_DATA = { subjectName: subjectName, classes: classes, students: studentData, byClass: byClass };
}

/* ═══ الطباعة (35 تلميذ + ألوان مضمونة + تسلسل صغير) ══ */
function openPrintSettings(){
  if(!CURRENT_PRINT_DATA){ toast('️ لا توجد بيانات للطباعة', 'err'); return; }
  $('#printSchoolName').value = PRINT_SETTINGS.schoolName;
  $('#printSchoolYear').value = PRINT_SETTINGS.schoolYear;
  $('#printSchoolType').value = PRINT_SETTINGS.schoolType;
  $('#printSettingsModal').classList.add('show');
}

function savePrintSettingsAndPrint(){
  PRINT_SETTINGS.schoolName = $('#printSchoolName').value.trim() || 'مدرسة المنهل الابتدائية';
  PRINT_SETTINGS.schoolYear = $('#printSchoolYear').value.trim() || '٢٠٢٥ - ٢٠٢٦';
  PRINT_SETTINGS.schoolType = $('#printSchoolType').value.trim() || 'للبنين';
  localStorage.setItem('print_school_name', PRINT_SETTINGS.schoolName);
  localStorage.setItem('print_school_year', PRINT_SETTINGS.schoolYear);
  localStorage.setItem('print_school_type', PRINT_SETTINGS.schoolType);
  hideModal('printSettingsModal');
  printSubjectRecord();
}

/* ═══ الطباعة (ألوان مضمونة + عناوين صحيحة + درجات المعلم) ═══ */
/* ═══ الطباعة (ألوان مضمونة 100% باستخدام Gradients) ═══ */
/* ═══ الطباعة (ألوان مضمونة 100% باستخدام bgcolor) ═══ */
/* ═══ الطباعة (تلوين كامل الأعمدة) ═══ */
/* ═══ الطباعة (درجات سوداء + حجم 12 + خط واضح) ═══ */
/* ═══ الطباعة (درجات 11pt + تسلسل 11pt + أسماء 10pt) ═══ */
/* ═══ الطباعة (درجات 11pt + تسلسل 11pt + أسماء 9pt) ═══ */
/* ═══ الطباعة (تسلسل 9pt + أسماء 8pt + درجات 10pt) ═══ */
function printSubjectRecord(){
  if(!CURRENT_PRINT_DATA){ toast('⚠️ لا توجد بيانات', 'err'); return; }
  var data = CURRENT_PRINT_DATA;
  var subjectName = data.subjectName;
  var byClass = data.byClass;
  var classKeys = Object.keys(byClass).sort();
  
  var teacherName = $('#trTeacherName') ? $('#trTeacherName').textContent.trim() : '';
  
  var h = '';
  
  h += '<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>درجات المعلم</title>';
  h += '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap" rel="stylesheet">';
  h += '<style>';
  
  h += '@page { size: A4 portrait; margin: 4mm 4mm 4mm 4mm; ';
  h += '@top-left { content: none !important; } @top-center { content: none !important; } @top-right { content: none !important; } ';
  h += '@bottom-left { content: none !important; } @bottom-center { content: none !important; } @bottom-right { content: none !important; } }';
  
  h += '* { box-sizing: border-box; margin: 0; padding: 0; }';
  h += 'html, body { width: 100%; font-family: "Tajawal", "Arial", sans-serif; background: #fff; color: #000; }';
  
  h += '.print-page { width: 100%; max-width: 200mm; margin: 0 auto; padding: 0; }';
  
  h += '.print-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2mm; padding-bottom: 1.5mm; border-bottom: 2px solid #1E40AF; }';
  h += '.print-header-right, .print-header-center { flex: 1; text-align: center; }';
  h += '.print-header-left { flex: 1; text-align: right; }';
  h += '.print-school-name { font-size: 9pt; font-weight: 900; color: #1E40AF; line-height: 1.2; }';
  h += '.print-school-name .line1 { display: block; font-size: 8pt; }';
  h += '.print-school-name .line2 { display: block; font-size: 10pt; }';
  h += '.print-school-name .line3 { display: block; font-size: 8pt; }';
  h += '.print-title { font-size: 11pt; font-weight: 900; color: #1E40AF; margin: 0; }';
  h += '.print-year { font-size: 8pt; color: #64748B; font-weight: 700; }';
  h += '.print-info-box { font-size: 8pt; line-height: 1.4; color: #0F172A; }';
  h += '.print-info-row { margin-bottom: 0.5mm; font-weight: 700; }';
  h += '.print-info-row b { color: #1E40AF; font-weight: 900; }';
  
  h += '.print-table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed !important; }';
  h += '.print-table thead { display: table-header-group !important; }';
  h += '.print-table tbody { display: table-row-group !important; }';
  
  h += '.print-table th, .print-table td { border: 0.5px solid #000 !important; padding: 1.5mm 0.8mm !important; text-align: center; vertical-align: middle; line-height: 1.1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }';
  
  h += '.print-table th { font-weight: 900 !important; font-size: 8pt !important; white-space: normal !important; word-wrap: break-word !important; }';
  
  h += '.th-seq { width: 10mm !important; }';
  h += '.th-name { width: 42mm !important; text-align: right !important; padding-right: 1mm !important; white-space: normal !important; word-wrap: break-word !important; font-size: 8pt !important; }';
  h += '.th-sub { font-size: 7.5pt !important; }';
  h += '.th-annual, .th-final { font-size: 7pt !important; }';
  
  // ✅ جميع خلايا الدرجات: أسود + حجم 10pt + خط عريض واضح
  h += '.print-table tbody td { ';
  h += '  color: #000000 !important; ';
  h += '  font-size: 10pt !important; ';
  h += '  font-weight: 700 !important; ';
  h += '  font-family: "Tajawal", Arial, sans-serif !important; ';
  h += '}';
  
  // ✅ التسلسل: 9pt
  h += '.seq-num { font-size: 9pt !important; font-weight: 900 !important; color: #000000 !important; }';
  
  // ✅ أسماء التلاميذ: 8pt
  h += '.td-name { text-align: right !important; font-weight: 700 !important; padding-right: 1mm !important; font-size: 8pt !important; color: #000 !important; }';
  
  h += '.print-table tbody tr { page-break-inside: avoid !important; }';
  
  h += '.print-footer { margin-top: 3mm; display: flex; justify-content: flex-end; padding-right: 5mm; page-break-inside: avoid !important; }';
  h += '.print-signature { text-align: right; width: 70mm; }';
  h += '.print-signature .sig-text { font-size: 10pt; font-weight: 700; color: #0F172A; }';
  h += '.print-signature .sig-name { font-size: 11pt; font-weight: 900; color: #1E40AF; margin-right: 2mm; }';
  
  h += '</style></head><body>';
  
  h += '<div class="print-page">';
  
  var totalAll = 0;
  classKeys.forEach(function(ck){ totalAll += byClass[ck].length; });
  
  var classesText = classKeys.map(function(ck){ return esc(ck); }).join(' - ');
  
  h += '<div class="print-header">';
  h += '<div class="print-header-right"><div class="print-school-name"><span class="line1">إدارة</span><span class="line2">' + esc(PRINT_SETTINGS.schoolName) + '</span><span class="line3">' + esc(PRINT_SETTINGS.schoolType) + '</span></div></div>';
  h += '<div class="print-header-center"><div class="print-title">درجات المعلم</div><div class="print-year">للعام الدراسي ' + esc(PRINT_SETTINGS.schoolYear) + '</div></div>';
  h += '<div class="print-header-left"><div class="print-info-box">';
  h += '<div class="print-info-row"><b>الصف والشعبة:</b> ' + classesText + '</div>';
  h += '<div class="print-info-row"><b>المادة:</b> ' + esc(subjectName) + '</div>';
  h += '<div class="print-info-row"><b>العدد الكلي:</b> ' + arNum(totalAll) + ' تلميذ</div>';
  h += '</div></div>';
  h += '</div>';
  
  h += '<table class="print-table">';
  
  h += '<thead><tr>';
  h += '<th rowspan="2" class="th-seq" bgcolor="#FDE047" style="background:#FDE047 !important;">ت</th>';
  h += '<th rowspan="2" class="th-name" bgcolor="#ffffff" style="background:#ffffff !important;">اسم التلميذ</th>';
  h += '<th colspan="3" bgcolor="#1D4ED8" style="background:#1D4ED8 !important; color:#fff !important;">الفصل الأول</th>';
  h += '<th rowspan="2" bgcolor="#B45309" style="background:#B45309 !important; color:#fff !important;">معدل<br>ف١</th>';
  h += '<th rowspan="2" bgcolor="#7C3AED" style="background:#7C3AED !important; color:#fff !important;">نصف<br>السنة</th>';
  h += '<th colspan="2" bgcolor="#0E7490" style="background:#0E7490 !important; color:#fff !important;">الفصل الثاني</th>';
  h += '<th rowspan="2" bgcolor="#B45309" style="background:#B45309 !important; color:#fff !important;">معدل<br>ف٢</th>';
  h += '<th rowspan="2" class="th-annual" bgcolor="#059669" style="background:#059669 !important; color:#fff !important;">السعي<br>السنوي</th>';
  h += '<th rowspan="2" bgcolor="#DC2626" style="background:#DC2626 !important; color:#fff !important;">نهاية<br>السنة</th>';
  h += '<th rowspan="2" class="th-final" bgcolor="#BE123C" style="background:#BE123C !important; color:#fff !important;">الدرجة<br>النهائية</th>';
  h += '</tr>';
  
  h += '<tr>';
  h += '<th class="th-sub" bgcolor="#E0E7FF" style="background:#E0E7FF !important; color:#1E40AF !important;">ت١</th>';
  h += '<th class="th-sub" bgcolor="#E0E7FF" style="background:#E0E7FF !important; color:#1E40AF !important;">ت٢</th>';
  h += '<th class="th-sub" bgcolor="#E0E7FF" style="background:#E0E7FF !important; color:#1E40AF !important;">ك١</th>';
  h += '<th class="th-sub" bgcolor="#E0E7FF" style="background:#E0E7FF !important; color:#1E40AF !important;">آذار</th>';
  h += '<th class="th-sub" bgcolor="#E0E7FF" style="background:#E0E7FF !important; color:#1E40AF !important;">نيسان</th>';
  h += '</tr></thead>';
  
  h += '<tbody>';
  
  var globalIndex = 1;
  classKeys.forEach(function(clsKey){
    var rows = byClass[clsKey];
    
    rows.forEach(function(s){
      var g = s.grades;
      h += '<tr>';
      
      // ✅ تسلسل 9pt
      h += '<td class="seq-num" bgcolor="#FEF3C7" style="background:#FEF3C7 !important;">' + arNum(globalIndex) + '</td>';
      
      // ✅ اسم التلميذ 8pt
      h += '<td class="td-name" bgcolor="#ffffff" style="background:#ffffff !important;">' + esc(s.name) + '</td>';
      
      // ✅ جميع الدرجات 10pt
      h += '<td bgcolor="#DBEAFE" style="background:#DBEAFE !important;">' + (g&&g.m1!=null?arNum(g.m1):'') + '</td>';
      h += '<td bgcolor="#DBEAFE" style="background:#DBEAFE !important;">' + (g&&g.m2!=null?arNum(g.m2):'') + '</td>';
      h += '<td bgcolor="#DBEAFE" style="background:#DBEAFE !important;">' + (g&&g.m3!=null?arNum(g.m3):'') + '</td>';
      h += '<td bgcolor="#FEF3C7" style="background:#FEF3C7 !important;">' + (g&&g.a1!=null?arNum(g.a1):'') + '</td>';
      h += '<td bgcolor="#EDE9FE" style="background:#EDE9FE !important;">' + (g&&g.half!=null?arNum(g.half):'') + '</td>';
      h += '<td bgcolor="#CFFAFE" style="background:#CFFAFE !important;">' + (g&&g.m4!=null?arNum(g.m4):'') + '</td>';
      h += '<td bgcolor="#CFFAFE" style="background:#CFFAFE !important;">' + (g&&g.m5!=null?arNum(g.m5):'') + '</td>';
      h += '<td bgcolor="#FEF3C7" style="background:#FEF3C7 !important;">' + (g&&g.a2!=null?arNum(g.a2):'') + '</td>';
      h += '<td bgcolor="#D1FAE5" style="background:#D1FAE5 !important;">' + (g&&g.annual!=null?arNum(g.annual):'') + '</td>';
      h += '<td bgcolor="#FEE2E2" style="background:#FEE2E2 !important;">' + (g&&g.exam!=null?arNum(g.exam):'') + '</td>';
      
      var finalVal = (g && g.final != null) ? g.final : null;
      var isPass = finalVal != null && finalVal >= (g.max||100)/2;
      var isFail = finalVal != null && finalVal < (g.max||100)/2;
      var finalBg = isPass ? '#BBF7D0' : (isFail ? '#FECACA' : '#ffffff');
      
      h += '<td bgcolor="' + finalBg + '" style="background:' + finalBg + ' !important;">' + (finalVal!=null?arNum(finalVal):'') + '</td>';
      
      h += '</tr>';
      globalIndex++;
    });
  });
  
  h += '</tbody></table>';
  
  h += '<div class="print-footer">';
  h += '<div class="print-signature">';
  h += '<span class="sig-text">معلم المادة: </span>';
  h += '<span class="sig-name">' + esc(teacherName) + '</span>';
  h += '</div>';
  h += '</div>';
  
  h += '</div>';
  h += '</body></html>';
  
  var oldFrame = document.getElementById('printFrame');
  if (oldFrame) oldFrame.remove();
  var f = document.createElement('iframe');
  f.id = 'printFrame';
  f.style.position = 'fixed'; f.style.left = '-10000px'; f.style.width = '0'; f.style.height = '0'; f.style.border = '0';
  document.body.appendChild(f);
  var doc = f.contentWindow.document;
  doc.open(); doc.write(h); doc.close();
  setTimeout(function() { 
    try { 
      f.contentWindow.focus(); 
      f.contentWindow.print(); 
    } catch (e) {} 
  }, 800);
}

/* ═══ تصدير Excel الذكي ══ */
function openExportExcelSelection(code) {
  var t = TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  
  var modalHtml = '<div class="ovl show" id="excelSelectionModal" style="z-index: 1000;"><div class="modal" style="max-width:500px;"><h3>📥 تصدير Excel - اختر المادة والشعبة</h3><div id="excelSelectionContent" style="max-height:60vh;overflow-y:auto;padding:10px;"></div><div class="mrow" style="margin-top:16px"><button class="btn ghost" style="margin:0" onclick="document.getElementById(\'excelSelectionModal\').remove()">إلغاء</button></div></div></div>';
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  var content = document.getElementById('excelSelectionContent');
  if(!t.subjects || t.subjects.length === 0) {
    content.innerHTML = '<div class="empty">لا توجد مواد مسجلة لهذا المعلم.</div>';
    return;
  }
  
  t.subjects.forEach(function(s) {
    var div = document.createElement('div');
    div.style.marginBottom = '15px';
    div.style.borderBottom = '1px solid #E2E8F0';
    div.style.paddingBottom = '10px';
    div.innerHTML = '<div style="font-weight:800;color:#1E40AF;margin-bottom:8px;font-size:14px;">📘 ' + esc(s.name) + '</div>';
    
    if(s.classes && s.classes.length > 0) {
      s.classes.forEach(function(c) {
        var btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.cssText = 'width:100%; margin-bottom:6px; background:#EFF6FF; color:#1E40AF; border:1px solid #BFDBFE; text-align:right; padding:10px 12px; display:flex; justify-content:space-between; align-items:center;';
        btn.innerHTML = '<span>🏫 ' + esc(c) + '</span> <span style="background:#1E40AF;color:#fff;padding:4px 10px;border-radius:6px;font-size:12px;">📥 تنزيل</span>';
        btn.onclick = function() {
          document.getElementById('excelSelectionModal').remove();
          generateTeacherExcelFile(code, t.name, t.code, s.name, c);
        };
        div.appendChild(btn);
      });
    } else {
      div.innerHTML += '<div style="color:#DC2626;font-size:12px;">لا توجد شعب مسجلة</div>';
    }
    content.appendChild(div);
  });
}

function generateTeacherExcelFile(code, teacherName, teacherCode, subjectName, className) {
  toast(' جاري تجهيز ملف Excel...', '');
  
  // ✅ 1. جلب قائمة التلاميذ الرسمية أولاً (لضمان الترتيب الصحيح)
  api({action:'getStudents', code:code, cls:className}).then(function(studentsRes){
    if(!studentsRes.ok || !studentsRes.names || studentsRes.names.length === 0){
      toast('️ لا توجد قائمة تلاميذ لهذه الشعبة', 'err');
      return;
    }
    
    // ✅ 2. جلب درجات المعلم
    api({action:'teacherGrades', key:key(), code:code}).then(function(r){
      if(!r.ok || !r.rows) {
        toast('⚠️ لا توجد درجات مسجلة لهذا المعلم في النظام', 'err');
        return;
      }
      
      var parts = className.split(' ');
      var grade = (parts[0] || '').trim();
      var section = (parts[1] || '').trim();
      var targetCls = className.trim();
      var targetSubj = subjectName.trim();
      
      // ✅ 3. بناء خريطة الدرجات للمطابقة السريعة
      var gradesMap = {};
      r.rows.forEach(function(row){
        var rowSubj = (row.subject || '').trim();
        var rowCls = (row.cls || '').trim();
        var rowGrade = (row.grade || '').trim();
        var rowSection = (row.section || '').trim();
        var subjectMatch = (rowSubj === targetSubj);
        var classMatch = (rowCls === targetCls) || (rowGrade === grade && rowSection === section);
        if(subjectMatch && classMatch){
          gradesMap[row.name.trim()] = row;
        }
      });
      
      // ✅ 4. بناء قائمة التلاميذ بالترتيب الرسمي مع درجاتهم
      var orderedRows = [];
      studentsRes.names.forEach(function(name){
        var cleanName = name.trim();
        var g = gradesMap[cleanName];
        if(g){
          orderedRows.push(g);
        } else {
          // تلميذ بدون درجات - نضيفه ببيانات فارغة
          orderedRows.push({
            name: cleanName,
            m1:null, m2:null, m3:null, a1:null, half:null,
            m4:null, m5:null, a2:null, annual:null, exam:null, final:null, max:100
          });
        }
      });
      
      if(orderedRows.length === 0) {
        toast('⚠️ لا توجد بيانات لهذه الشعبة', 'err');
        return;
      }
      
      // ✅ 5. بناء ملف Excel بنفس التصميم الأصلي
      var h = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" dir="rtl">';
      h += '<head><meta charset="utf-8">';
      h += '<style>';
      h += 'table{border-collapse:collapse;width:100%;font-family:Arial,sans-serif;}';
      h += 'th,td{border:1px solid #000;padding:5px;text-align:center;font-size:11pt;}';
      h += 'th{color:#fff;font-weight:bold;}';
      h += '.th-f1{background-color:#1D4ED8;}';
      h += '.th-f2{background-color:#0E7490;}';
      h += '.th-avg{background-color:#B45309;color:#fff;}';
      h += '.th-half{background-color:#7C3AED;color:#fff;}';
      h += '.th-annual{background-color:#059669;color:#fff;}';
      h += '.th-exam{background-color:#DC2626;color:#fff;}';
      h += '.th-final{background-color:#BE123C;color:#fff;}';
      h += '.th-sub{background-color:#E0E7FF;color:#1E40AF;font-weight:bold;}';
      h += '.th-seq{background-color:#FDE047;color:#000;width:40px;}';
      h += '.th-name{background-color:#fff;color:#000;width:180px;}';
      h += '.td-name{text-align:right;font-weight:bold;padding-right:5px;}';
      h += '.td-final-pass{background-color:#D1FAE5;color:#047857;font-weight:bold;}';
      h += '.td-final-fail{background-color:#FEE2E2;color:#DC2626;font-weight:bold;}';
      h += '.header-right{text-align:right;font-size:14pt;font-weight:bold;color:#1E40AF;}';
      h += '.header-center{text-align:center;font-size:16pt;font-weight:bold;color:#1E40AF;}';
      h += '.header-left{text-align:left;font-size:11pt;color:#0F172A;}';
      h += '.info-row{margin:3px 0;font-weight:bold;}';
      h += '</style></head><body>';
      
      h += '<table style="border:none;width:100%;margin-bottom:10px;">';
      h += '<tr style="border:none;">';
      h += '<td style="border:none;" class="header-right">إدارة<br>' + esc(PRINT_SETTINGS.schoolName) + '<br>' + esc(PRINT_SETTINGS.schoolType) + '</td>';
      h += '<td style="border:none;" class="header-center">كشف درجات المعلم<br><span style="font-size:11pt;color:#64748B;">للعام الدراسي ' + esc(PRINT_SETTINGS.schoolYear) + '</span></td>';
      h += '<td style="border:none;" class="header-left">';
      h += '<div class="info-row">المادة: ' + esc(subjectName) + '</div>';
      h += '<div class="info-row">الصف والشعبة: ' + esc(className) + '</div>';
      h += '<div class="info-row">عدد التلاميذ: ' + toArabicNumerals(orderedRows.length) + '</div>';
      h += '</td>';
      h += '</tr></table>';
      
      h += '<table>';
      h += '<thead>';
      h += '<tr>';
      h += '<th rowspan="2" class="th-seq">ت</th>';
      h += '<th rowspan="2" class="th-name">اسم التلميذ</th>';
      h += '<th colspan="3" class="th-f1">الفصل الأول</th>';
      h += '<th rowspan="2" class="th-avg">معدل<br>ف١</th>';
      h += '<th rowspan="2" class="th-half">نصف<br>السنة</th>';
      h += '<th colspan="2" class="th-f2">الفصل الثاني</th>';
      h += '<th rowspan="2" class="th-avg">معدل<br>ف٢</th>';
      h += '<th rowspan="2" class="th-annual">السعي<br>السنوي</th>';
      h += '<th rowspan="2" class="th-exam">نهاية<br>السنة</th>';
      h += '<th rowspan="2" class="th-final">الدرجة<br>النهائية</th>';
      h += '</tr>';
      h += '<tr>';
      h += '<th class="th-sub">ت١</th>';
      h += '<th class="th-sub">ت٢</th>';
      h += '<th class="th-sub">ك١</th>';
      h += '<th class="th-sub">آذار</th>';
      h += '<th class="th-sub">نيسان</th>';
      h += '</tr>';
      h += '</thead>';
      h += '<tbody>';
      
      // ✅ 6. بناء الصفوف بالترتيب الرسمي
      orderedRows.forEach(function(row, idx){
        var finalClass = (row.final != null && row.final >= (row.max||100)/2) ? 'td-final-pass' : (row.final != null ? 'td-final-fail' : '');
        h += '<tr>';
        h += '<td>' + toArabicNumerals(idx+1) + '</td>';
        h += '<td class="td-name">' + esc(row.name) + '</td>';
        h += '<td>' + toArabicNumerals(row.m1!=null?row.m1:'') + '</td>';
        h += '<td>' + toArabicNumerals(row.m2!=null?row.m2:'') + '</td>';
        h += '<td>' + toArabicNumerals(row.m3!=null?row.m3:'') + '</td>';
        h += '<td style="font-weight:bold;">' + toArabicNumerals(row.a1!=null?row.a1:'') + '</td>';
        h += '<td>' + toArabicNumerals(row.half!=null?row.half:'') + '</td>';
        h += '<td>' + toArabicNumerals(row.m4!=null?row.m4:'') + '</td>';
        h += '<td>' + toArabicNumerals(row.m5!=null?row.m5:'') + '</td>';
        h += '<td style="font-weight:bold;">' + toArabicNumerals(row.a2!=null?row.a2:'') + '</td>';
        h += '<td style="font-weight:bold;">' + toArabicNumerals(row.annual!=null?row.annual:'') + '</td>';
        h += '<td>' + toArabicNumerals(row.exam!=null?row.exam:'') + '</td>';
        h += '<td class="' + finalClass + '">' + toArabicNumerals(row.final!=null?row.final:'') + '</td>';
        h += '</tr>';
      });
      
      h += '</tbody></table>';
      
      h += '<table style="border:none;width:100%;margin-top:20px;">';
      h += '<tr style="border:none;">';
      h += '<td style="border:none;text-align:center;width:50%;padding-top:30px;"><div style="border-top:1px solid #000;padding-top:5px;">توقيع المعلم</div></td>';
      h += '<td style="border:none;text-align:center;width:50%;padding-top:30px;"><div style="border-top:1px solid #000;padding-top:5px;">توقيع المدير</div></td>';
      h += '</tr></table>';
      
      h += '</body></html>';
      
      var blob = new Blob(['\uFEFF' + h], {type: 'application/vnd.ms-excel;charset=utf-8;'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      var fileName = 'كشف_' + esc(teacherName).replace(/\s+/g, '_') + '_' + esc(subjectName).replace(/\s+/g, '_') + '_' + esc(className).replace(/\s+/g, '_') + '.xls';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function(){ URL.revokeObjectURL(a.href); }, 5000);
      toast('✓ تم تصدير Excel بنجاح بالترتيب الصحيح', 'ok');
      
    }).catch(function(err){
      console.error('Export error:', err);
      toast('️ تعذر جلب الدرجات', 'err');
    });
  }).catch(function(err){
    console.error('Students error:', err);
    toast('⚠️ تعذر جلب قائمة التلاميذ', 'err');
  });
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
    h+='<td style="padding:8px;border:1px solid #0F172A;text-align:center">'+(t.locked?' مقفل':'🔓 مفتوح')+'</td></tr>';
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

function onSearchChange(){var e=$('#teamSearch');TEAM.search=e?e.value.trim():'';applyFilters();}
function onFilterSubjectChange(){var e=$('#filterSubject');TEAM.filterSubject=e?e.value:'';applyFilters();}
function onFilterClassChange(){var e=$('#filterClass');TEAM.filterClass=e?e.value:'';applyFilters();}
