/* ═══ page-team.js — صفحة المعلمين (نسخة محسّنة مع مطابقة دقيقة) ═══ */

var TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };
var EDIT_SUBJECTS = [];
var CURRENT_TEACHER_GRADES = [];
var PRINT_SETTINGS = {
  schoolName: localStorage.getItem('print_school_name') || 'مدرسة المنهل الابتدائية',
  schoolYear: localStorage.getItem('print_school_year') || '٢٠٢٥ - ٢٠٢٦',
  schoolType: localStorage.getItem('print_school_type') || 'للبنين'
};
var CURRENT_PRINT_DATA = null;

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
  }).catch(function(err){
    console.error('Load teachers error:', err);
    toast('تعذر الاتصال', 'err');
    if(el) el.innerHTML = '<div class="empty">⚠️ تعذر الاتصال بالخادم</div>';
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
    h += '<button class="btn sm" style="background:#059669;color:#fff" onclick="openExportExcelSelection(\''+escA(t.code)+'\')">📥 Excel</button>';
    h += '<button class="btn sm danger" onclick="delT(\''+escA(t.code)+'\')">🗑 حذف المعلم</button>';
    h += '</div></div>';
  });
  el.innerHTML = h;
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
  
  toast('⏳ جاري الحفظ...', '');
  var oldCode = '';
  var existingTeacher = TEAM.teachers.find(function(t){ return t.name === name; });
  if(existingTeacher) oldCode = existingTeacher.code;
  
  api({ action: 'updateTeacherFull', key: key(), code: newCode, oldCode: oldCode, name: name, subjectsData: subjectsData }).then(function(r){
    if(r.ok){ toast('✓ تم الحفظ بنجاح', 'ok'); hideModal('editTeacherModal'); loadTeachers(); }
    else { toast('❌ '+r.error, 'err'); }
  }).catch(function(err){ console.error('Save error:', err); toast('⚠️ تعذر الاتصال', 'err'); });
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
  if(!name){ toast('⚠️ اكتب اسم المعلم', 'err'); nameEl.focus(); return; }
  if(!subject){ toast('⚠️ اختر المادة', 'err'); subjectEl.focus(); return; }
  if(!clsVal){ toast('⚠️ اختر الصف', 'err'); clsEl.focus(); return; }
  
  toast('⏳ جاري الإضافة...', '');
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
    btn.textContent = '🏫 ' + cls;
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
            
            // ✅ مطابقة دقيقة مع إزالة المسافات الزائدة
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
    toast('⚠️ تعذر تحميل البيانات', 'err');
  });
}

function renderTeacherRecordTable(subjectName, studentData, classes){
  $('#trLoading').style.display = 'none';
  $('#trTableContainer').style.display = 'block';
  if(studentData.length === 0){
    $('#trTableBody').innerHTML = '<tr><td colspan="14" style="text-align:center;padding:20px;">📭 لا توجد بيانات.</td></tr>';
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
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;">'+arNum(globalIndex)+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:right;font-weight:bold;">'+esc(s.name)+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#EFF6FF;">'+(g&&g.m1!=null?arNum(g.m1):'—')+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#EFF6FF;">'+(g&&g.m2!=null?arNum(g.m2):'—')+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#EFF6FF;">'+(g&&g.m3!=null?arNum(g.m3):'—')+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;background:#FEF3C7;">'+(g&&g.a1!=null?arNum(g.a1):'—')+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;">'+(g&&g.half!=null?arNum(g.half):'—')+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#ECFEFF;">'+(g&&g.m4!=null?arNum(g.m4):'—')+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;background:#ECFEFF;">'+(g&&g.m5!=null?arNum(g.m5):'—')+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;background:#FEF3C7;">'+(g&&g.a2!=null?arNum(g.a2):'—')+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:bold;background:#FEF3C7;">'+(g&&g.annual!=null?arNum(g.annual):'—')+'</td>';
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;">'+(g&&g.exam!=null?arNum(g.exam):'—')+'</td>';
      var finColor = (g && g.final != null && g.final >= (g.max||100)/2) ? '#D1FAE5;color:#047857' : (g && g.final != null ? '#FEE2E2;color:#DC2626' : '');
      html += '<td style="padding:6px;border:1px solid #CBD5E1;text-align:center;font-weight:900;'+finColor+';">'+(g&&g.final!=null?arNum(g.final):'—')+'</td>';
      html += '</tr>';
      globalIndex++;
    });
  });
  $('#trTableBody').innerHTML = html;
  CURRENT_PRINT_DATA = { subjectName: subjectName, classes: classes, students: studentData, byClass: byClass };
}

/* ═══ الطباعة ═══ */
function openPrintSettings(){
  if(!CURRENT_PRINT_DATA){ toast('⚠️ لا توجد بيانات للطباعة', 'err'); return; }
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

function printSubjectRecord(){
  if(!CURRENT_PRINT_DATA){ toast('⚠️ لا توجد بيانات', 'err'); return; }
  var data = CURRENT_PRINT_DATA;
  var subjectName = data.subjectName;
  var byClass = data.byClass;
  var classKeys = Object.keys(byClass).sort();
  var h = '';
  
  h += '<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>سجل درجات</title>';
  h += '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap" rel="stylesheet">';
  h += '<style>';
  h += '@page { size: A4 portrait; margin: 8mm 8mm; }';
  h += '* { box-sizing: border-box; margin: 0; padding: 0; }';
  h += 'body { font-family: "Tajawal", "Arial", sans-serif; background: #fff; color: #000; }';
  h += '.print-page { width: 100%; padding: 2mm 0; page-break-after: always; }';
  h += '.print-page:last-child { page-break-after: auto; }';
  h += '.print-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4mm; padding-bottom: 2mm; border-bottom: 2px solid #1E40AF; }';
  h += '.print-header-right, .print-header-center { flex: 1; text-align: center; }';
  h += '.print-header-left { flex: 1; text-align: right; }';
  h += '.print-school-name { font-size: 11pt; font-weight: 900; color: #1E40AF; line-height: 1.4; }';
  h += '.print-school-name .line1 { display: block; font-size: 10pt; }';
  h += '.print-school-name .line2 { display: block; font-size: 12pt; }';
  h += '.print-school-name .line3 { display: block; font-size: 10pt; }';
  h += '.print-title { font-size: 15pt; font-weight: 900; color: #1E40AF; margin-bottom: 1mm; }';
  h += '.print-year { font-size: 10pt; color: #64748B; font-weight: 700; }';
  h += '.print-info-box { font-size: 9pt; line-height: 1.6; color: #0F172A; }';
  h += '.print-info-row { margin-bottom: 0.5mm; font-weight: 700; }';
  h += '.print-info-row b { color: #1E40AF; font-weight: 900; }';
  h += '.print-table { width: 100%; border-collapse: collapse; font-size: 8pt; margin-bottom: 5mm; }';
  h += '.print-table th, .print-table td { border: 1px solid #000; padding: 1.2mm 0.5mm; text-align: center; vertical-align: middle; }';
  h += '.print-table th { font-weight: 900; font-size: 8pt; color: #fff; }';
  h += '.th-seq { width: 8mm; background-color: #FDE047 !important; color: #000 !important; font-weight: 900; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.th-name { width: 40mm; background-color: #fff !important; color: #000 !important; font-weight: 900; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.th-f1 { background-color: #1D4ED8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.th-f2 { background-color: #0E7490 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.th-avg1, .th-avg2 { background-color: #B45309 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.th-half { background-color: #7C3AED !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.th-annual { background-color: #059669 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.th-exam { background-color: #DC2626 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.th-final { background-color: #BE123C !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.th-sub { background-color: #E0E7FF !important; color: #1E40AF !important; font-weight: 900; font-size: 8pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.td-name { text-align: right; font-weight: 700; padding-right: 1mm; font-size: 8pt; color: #000 !important; }';
  h += '.td-final-pass { background-color: #D1FAE5 !important; color: #047857 !important; font-weight: 900; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.td-final-fail { background-color: #FEE2E2 !important; color: #DC2626 !important; font-weight: 900; -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
  h += '.print-footer { display: flex; justify-content: space-between; margin-top: 8mm; }';
  h += '.print-signature { text-align: center; width: 40mm; }';
  h += '.print-signature div:first-child { font-size: 9pt; font-weight: 700; color: #0F172A; margin-bottom: 8mm; }';
  h += '.signature-line { border-top: 1px solid #0F172A; width: 100%; }';
  h += '</style></head><body>';
  
  classKeys.forEach(function(clsKey, clsIndex){
    var rows = byClass[clsKey];
    var parts = clsKey.split(' ');
    var grade = parts[0] || '';
    var section = parts[1] || '';
    var totalStudents = rows.length;
    var CHUNK_SIZE = 30;
    var totalPages = Math.ceil(totalStudents / CHUNK_SIZE);
    
    for(var pageIdx = 0; pageIdx < totalPages; pageIdx++){
      var startIdx = pageIdx * CHUNK_SIZE;
      var endIdx = Math.min(startIdx + CHUNK_SIZE, totalStudents);
      var pageRows = rows.slice(startIdx, endIdx);
      
      h += '<div class="print-page">';
      h += '<div class="print-header">';
      h += '<div class="print-header-right"><div class="print-school-name"><span class="line1">إدارة</span><span class="line2">' + esc(PRINT_SETTINGS.schoolName) + '</span><span class="line3">' + esc(PRINT_SETTINGS.schoolType) + '</span></div></div>';
      h += '<div class="print-header-center"><div class="print-title">سجل درجات المعلم</div><div class="print-year">للعام الدراسي ' + esc(PRINT_SETTINGS.schoolYear) + '</div></div>';
      h += '<div class="print-header-left"><div class="print-info-box"><div class="print-info-row"><b>الصف والشعبة:</b> ' + esc(grade) + ' ' + esc(section) + '</div><div class="print-info-row"><b>المادة:</b> ' + esc(subjectName) + '</div><div class="print-info-row"><b>العدد:</b> ' + arNum(totalStudents) + ' تلميذ</div></div></div>';
      h += '</div>';
      
      h += '<table class="print-table"><thead><tr><th rowspan="2" class="th-seq">ت</th><th rowspan="2" class="th-name">اسم التلميذ</th><th colspan="3" class="th-f1">الفصل الأول</th><th rowspan="2" class="th-avg1">معدل<br>ف١</th><th rowspan="2" class="th-half">نصف<br>السنة</th><th colspan="2" class="th-f2">الفصل الثاني</th><th rowspan="2" class="th-avg2">معدل<br>ف٢</th><th rowspan="2" class="th-annual">السعي<br>السنوي</th><th rowspan="2" class="th-exam">نهاية<br>السنة</th><th rowspan="2" class="th-final">الدرجة<br>النهائية</th></tr><tr><th class="th-sub">ت١</th><th class="th-sub">ت٢</th><th class="th-sub">ك١</th><th class="th-sub">آذار</th><th class="th-sub">نيسان</th></tr></thead><tbody>';
      
      pageRows.forEach(function(s, idx){
        var g = s.grades;
        var globalIdx = startIdx + idx + 1;
        h += '<tr><td>' + arNum(globalIdx) + '</td><td class="td-name">' + esc(s.name) + '</td><td>' + (g&&g.m1!=null?arNum(g.m1):'') + '</td><td>' + (g&&g.m2!=null?arNum(g.m2):'') + '</td><td>' + (g&&g.m3!=null?arNum(g.m3):'') + '</td><td style="font-weight:bold;">' + (g&&g.a1!=null?arNum(g.a1):'') + '</td><td>' + (g&&g.half!=null?arNum(g.half):'') + '</td><td>' + (g&&g.m4!=null?arNum(g.m4):'') + '</td><td>' + (g&&g.m5!=null?arNum(g.m5):'') + '</td><td style="font-weight:bold;">' + (g&&g.a2!=null?arNum(g.a2):'') + '</td><td>' + (g&&g.annual!=null?arNum(g.annual):'') + '</td><td>' + (g&&g.exam!=null?arNum(g.exam):'') + '</td>';
        var finalClass = (g && g.final != null && g.final >= (g.max||100)/2) ? 'td-final-pass' : (g && g.final != null ? 'td-final-fail' : '');
        h += '<td class="' + finalClass + '">' + (g&&g.final!=null?arNum(g.final):'') + '</td></tr>';
      });
      
      h += '</tbody></table>';
      if(pageIdx === totalPages - 1){
        h += '<div class="print-footer"><div class="print-signature"><div>توقيع المعلم</div><div class="signature-line"></div></div><div class="print-signature"><div>توقيع المدير</div><div class="signature-line"></div></div></div>';
      }
      h += '</div>';
    }
  });
  h += '</body></html>';
  
  var oldFrame = document.getElementById('printFrame');
  if (oldFrame) oldFrame.remove();
  var f = document.createElement('iframe');
  f.id = 'printFrame';
  f.style.position = 'fixed'; f.style.left = '-10000px'; f.style.width = '0'; f.style.height = '0'; f.style.border = '0';
  document.body.appendChild(f);
  var doc = f.contentWindow.document;
  doc.open(); doc.write(h); doc.close();
  setTimeout(function() { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) {} }, 800);
}

/* ═══ تصدير Excel الذكي ═══ */
function openExportExcelSelection(code) {
  var t = TEAM.teachers.find(function(x){return x.code===code;});
  if(!t) return;
  
  var modalHtml = `
    <div class="ovl show" id="excelSelectionModal" style="z-index: 1000;">
      <div class="modal" style="max-width:500px;">
        <h3>📥 تصدير Excel - اختر المادة والشعبة</h3>
        <div id="excelSelectionContent" style="max-height:60vh;overflow-y:auto;padding:10px;"></div>
        <div class="mrow" style="margin-top:16px">
          <button class="btn ghost" style="margin:0" onclick="document.getElementById('excelSelectionModal').remove()">إلغاء</button>
        </div>
      </div>
    </div>
  `;
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
  toast('⏳ جاري تجهيز ملف Excel...', '');
  
  api({action:'teacherGrades', key:key(), code:code}).then(function(r){
    if(!r.ok || !r.rows || r.rows.length === 0) {
      toast('⚠️ لا توجد درجات مسجلة لهذا المعلم في النظام', 'err');
      return;
    }
    
    var parts = className.split(' ');
    var grade = (parts[0] || '').trim();
    var section = (parts[1] || '').trim();
    var targetCls = className.trim();
    var targetSubj = subjectName.trim();
    
    // ✅ تصفية الدرجات مع تنظيف المسافات لضمان المطابقة
    var filteredRows = r.rows.filter(function(row) {
      var rowSubj = (row.subject || '').trim();
      var rowCls = (row.cls || '').trim();
      var rowGrade = (row.grade || '').trim();
      var rowSection = (row.section || '').trim();
      
      var subjectMatch = (rowSubj === targetSubj);
      var classMatch = (rowCls === targetCls) || (rowGrade === grade && rowSection === section);
      
      return subjectMatch && classMatch;
    });
    
    if(filteredRows.length === 0) {
      toast('⚠️ لا توجد درجات مسجلة لهذه الشعبة تحديداً (' + className + ')', 'err');
      console.log('Debug: Target Subj:', targetSubj, 'Target Cls:', targetCls);
      console.log('Debug: Available rows:', r.rows.map(function(r){ return r.subject + ' - ' + r.cls; }));
      return;
    }
    
    var h = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" dir="rtl"><head><meta charset="utf-8"><style>table{border-collapse:collapse;width:100%;} th,td{border:1px solid #000;padding:6px;text-align:center;font-family:Arial,sans-serif;} th{background:#1E40AF;color:#fff;font-weight:bold;}</style></head><body>';
    h += '<h2 style="text-align:center;color:#1E40AF;font-family:Arial;">كشف درجات: ' + esc(teacherName) + '</h2>';
    h += '<p style="text-align:center;font-family:Arial;">المادة: ' + esc(subjectName) + ' | الصف والشعبة: ' + esc(className) + '</p>';
    h += '<p style="text-align:center;font-family:Arial;">السنة الدراسية: ' + esc(getStudyYear()) + '</p><br>';
    
    h += '<table><thead><tr><th>ت</th><th>اسم التلميذ</th><th>ت١</th><th>ت٢</th><th>ك١</th><th>آذار</th><th>نيسان</th><th>معدل ف١</th><th>نصف السنة</th><th>معدل ف٢</th><th>السعي السنوي</th><th>نهاية السنة</th><th>النهائية</th></tr></thead><tbody>';
    
    filteredRows.forEach(function(row, idx){
      h += '<tr>';
      h += '<td>' + (idx+1) + '</td>';
      h += '<td style="text-align:right;font-weight:bold;">' + esc(row.name) + '</td>';
      h += '<td>' + (row.m1!=null?row.m1:'') + '</td>';
      h += '<td>' + (row.m2!=null?row.m2:'') + '</td>';
      h += '<td>' + (row.m3!=null?row.m3:'') + '</td>';
      h += '<td>' + (row.m4!=null?row.m4:'') + '</td>';
      h += '<td>' + (row.m5!=null?row.m5:'') + '</td>';
      h += '<td style="font-weight:bold;">' + (row.a1!=null?row.a1:'') + '</td>';
      h += '<td>' + (row.half!=null?row.half:'') + '</td>';
      h += '<td style="font-weight:bold;">' + (row.a2!=null?row.a2:'') + '</td>';
      h += '<td style="font-weight:bold;">' + (row.annual!=null?row.annual:'') + '</td>';
      h += '<td>' + (row.exam!=null?row.exam:'') + '</td>';
      h += '<td style="font-weight:900;">' + (row.final!=null?row.final:'') + '</td>';
      h += '</tr>';
    });
    
    h += '</tbody></table></body></html>';
    
    var blob = new Blob(['\uFEFF' + h], {type: 'application/vnd.ms-excel;charset=utf-8;'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    var fileName = 'كشف_' + esc(teacherName).replace(/\s+/g, '_') + '_' + esc(subjectName).replace(/\s+/g, '_') + '_' + esc(className).replace(/\s+/g, '_') + '.xls';
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 5000);
    toast('✓ تم تصدير Excel بنجاح', 'ok');
    
  }).catch(function(err){
    console.error('Export error:', err);
    toast('⚠️ تعذر التصدير', 'err');
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

function onSearchChange(){var e=$('#teamSearch');TEAM.search=e?e.value.trim():'';applyFilters();}
function onFilterSubjectChange(){var e=$('#filterSubject');TEAM.filterSubject=e?e.value:'';applyFilters();}
function onFilterClassChange(){var e=$('#filterClass');TEAM.filterClass=e?e.value:'';applyFilters();}
