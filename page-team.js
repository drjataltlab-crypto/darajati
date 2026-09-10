/* ═══ page-team.js — صفحة المعلمين (تطوير كامل) ═══ */

var TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };

registerPage('team', {
  enter: function() {
    TEAM = { teachers: [], filtered: [], search: '', filterSubject: '', filterClass: '' };
    loadTeachers();
  }
});

function loadTeachers() {
  var teamListEl = $('#teamList');
  if (!teamListEl) {
    console.error('عنصر teamList غير موجود في HTML');
    return;
  }
  teamListEl.innerHTML = '<div class="empty">⏳ تحميل...</div>';
  
  api({ action: 'adminData', key: key() }).then(function(r) {
    if (!r.ok) {
      toast('❌ ' + r.error, 'err');
      teamListEl.innerHTML = '<div class="empty">حدث خطأ في تحميل البيانات</div>';
      return;
    }
    TEAM.teachers = r.teachers || [];
    
    // تحديث قائمة تصفية المواد
    updateSubjectFilter();
    
    applyFilters();
  }).catch(function() {
    toast('تعذر الاتصال', 'err');
    teamListEl.innerHTML = '<div class="empty">⚠️ تعذر الاتصال بالخادم</div>';
  });
}

/* ═══ تحديث قائمة تصفية المواد ═══ */
function updateSubjectFilter() {
  var filterEl = $('#filterSubject');
  if (!filterEl) return;
  
  // جمع كل المواد الفريدة
  var subjectsSet = {};
  TEAM.teachers.forEach(function(t) {
    if (t.subjects && Array.isArray(t.subjects)) {
      t.subjects.forEach(function(s) {
        subjectsSet[s.name] = true;
      });
    }
  });
  
  var html = '<option value="">كل المواد</option>';
  Object.keys(subjectsSet).sort().forEach(function(subj) {
    html += '<option>' + esc(subj) + '</option>';
  });
  
  filterEl.innerHTML = html;
}

/* ═══ تطبيق الفلاتر ═══ */
function applyFilters() {
  TEAM.filtered = TEAM.teachers.filter(function(t) {
    var matchSearch = !TEAM.search || 
      t.name.indexOf(TEAM.search) !== -1 || 
      t.code.indexOf(TEAM.search) !== -1;
    
    var matchSubject = !TEAM.filterSubject || 
      (t.subjects && t.subjects.some(function(s) { return s.name === TEAM.filterSubject; }));
    
    var matchClass = !TEAM.filterClass || 
      (t.subjects && t.subjects.some(function(s) { return s.classes.indexOf(TEAM.filterClass) !== -1; }));
    
    return matchSearch && matchSubject && matchClass;
  });
  
  renderTeachers();
}

/* ═══ عرض المعلمين ═══ */
function renderTeachers() {
  var teamListEl = $('#teamList');
  if (!teamListEl) return;
  
  if (!TEAM.filtered.length) {
    teamListEl.innerHTML = '<div class="empty">لا يوجد معلمون</div>';
    return;
  }
  
  var colors = ['#1E40AF', '#047857', '#B45309', '#7E22CE', '#BE123C', '#0E7490'];
  var h = '';
  
  TEAM.filtered.forEach(function(t, i) {
    var color = colors[i % colors.length];
    var lastLoginStr = t.lastLogin ? ago(t.lastLogin) : 'لم يدخل بعد';
    var totalClasses = 0;
    if (t.subjects && Array.isArray(t.subjects)) {
      t.subjects.forEach(function(s) {
        if (s.classes && Array.isArray(s.classes)) {
          totalClasses += s.classes.length;
        }
      });
    }
    
    h += '<div class="teacher-card" style="border-right:5px solid ' + color + '">';
    
    // الرأس
    h += '<div class="teacher-card-header">';
    h += '<div style="flex:1">';
    h += '<div class="teacher-name">' + esc(t.name) + '</div>';
    h += '<div class="teacher-code-row">';
    h += '<span class="chip code">🔑 ' + esc(t.code) + '</span>';
    h += '<button class="btn sm btn-copy" onclick="copyCode(\'' + escA(t.code) + '\')" title="نسخ الكود">📋 نسخ</button>';
    h += '<button class="btn sm btn-whatsapp" onclick="sendWhatsApp(\'' + escA(t.code) + '\',\'' + escA(t.name) + '\')" title="إرسال عبر واتساب">📱 واتساب</button>';
    h += '</div>';
    h += '</div>';
    h += '<div style="display:flex;gap:6px;align-items:center">';
    if (t.locked) {
      h += '<span class="chip locked">🔒 مقفل</span>';
      h += '<button class="btn sm ok" onclick="toggleLock(\'' + escA(t.code) + '\')">🔑 فتح</button>';
    } else {
      h += '<span class="chip unlocked">🔓 مفتوح</span>';
      h += '<button class="btn sm danger" onclick="toggleLock(\'' + escA(t.code) + '\')">🔒 قفل</button>';
    }
    h += '</div>';
    h += '</div>';
    
    // المواد والصفوف
    if (t.subjects && t.subjects.length > 0) {
      h += '<div class="subjects-container">';
      t.subjects.forEach(function(s) {
        h += '<div class="subject-block">';
        h += '<div class="subject-name" style="color:' + color + '">📘 ' + esc(s.name) + '</div>';
        if (s.classes && s.classes.length > 0) {
          h += '<div class="classes-list">';
          s.classes.forEach(function(c) {
            h += '<span class="class-chip">🏫 ' + esc(c) + '</span>';
          });
          h += '</div>';
        }
        h += '</div>';
      });
      h += '</div>';
    }
    
    // الإحصائيات
    h += '<div class="teacher-stats">';
    h += '<span> آخر دخول: <b>' + lastLoginStr + '</b></span>';
    h += '<span>📝 درجات مرسلة: <b>' + arNum(t.sentCount || 0) + '</b></span>';
    h += '<span>🏫 عدد الصفوف: <b>' + arNum(totalClasses) + '</b></span>';
    h += '<span>📘 عدد المواد: <b>' + arNum(t.subjects ? t.subjects.length : 0) + '</b></span>';
    h += '</div>';
    
    // أزرار الإجراءات
    h += '<div class="teacher-actions">';
    h += '<button class="btn sm" onclick="editTeacher(\'' + escA(t.code) + '\')">✏️ تعديل</button>';
    h += '<button class="btn sm danger" onclick="deleteTeacher(\'' + escA(t.code) + '\')">🗑 حذف</button>';
    h += '</div>';
    
    h += '</div>';
  });
  
  teamListEl.innerHTML = h;
}

/* ═══ نسخ الكود ═══ */
function copyCode(code) {
  copyText(code);
  toast('✓ تم نسخ الكود: ' + code, 'ok');
}

/* ═══ إرسال واتساب ═══ */
function sendWhatsApp(code, name) {
  var msg = 'مرحباً ' + name + ' \n\nكودك في تطبيق «درجاتي»:\n\n🔑 ' + code + '\n\nثبّت التطبيق وأدخل هذا الكود.';
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

/* ═══ قفل/فتح ═══ */
function toggleLock(code) {
  var t = TEAM.teachers.find(function(x) { return x.code === code; });
  if (!t) return;
  var action = t.locked ? 'فتح' : 'قفل';
  confirmDlg(action + ' حساب ' + t.name + '؟', function() {
    api({ action: 'toggleLock', key: key(), code: code }).then(function(r) {
      if (r.ok) {
        toast('✓ تم ' + action, 'ok');
        loadTeachers();
      } else {
        toast('❌ ' + r.error, 'err');
      }
    });
  }, action);
}

/* ═══ تعديل معلم ═══ */
function editTeacher(code) {
  var t = TEAM.teachers.find(function(x) { return x.code === code; });
  if (!t) return;
  
  // بناء صيغة المواد والصفوف
  var subjectsData = '';
  if (t.subjects && Array.isArray(t.subjects)) {
    subjectsData = t.subjects.map(function(s) {
      return s.name + ':' + (s.classes || []).join('،');
    }).join(' | ');
  }
  
  var edCode = $('#edCode');
  var edName = $('#edName');
  var edSubjectsData = $('#edSubjectsData');
  
  if (edCode) edCode.value = t.code;
  if (edName) edName.value = t.name;
  if (edSubjectsData) edSubjectsData.value = subjectsData;
  
  var modal = $('#editModal');
  if (modal) modal.classList.add('show');
}

/* ═══ حفظ التعديل ═══ */
function saveEditTeacher() {
  var codeEl = $('#edCode');
  var nameEl = $('#edName');
  var subjectsEl = $('#edSubjectsData');
  
  if (!codeEl || !nameEl || !subjectsEl) return;
  
  var code = codeEl.value.trim();
  var name = nameEl.value.trim();
  var subjectsData = subjectsEl.value.trim();
  
  if (!code || !name || !subjectsData) {
    toast('جميع الحقول مطلوبة', 'err');
    return;
  }
  
  api({ action: 'updateTeacher', key: key(), code: code, name: name, subjectsData: subjectsData }).then(function(r) {
    if (r.ok) {
      toast('✓ تم التعديل', 'ok');
      hideModal('editModal');
      loadTeachers();
    } else {
      toast('❌ ' + r.error, 'err');
    }
  });
}

/* ══ حذف معلم ═══ */
function deleteTeacher(code) {
  var t = TEAM.teachers.find(function(x) { return x.code === code; });
  if (!t) return;
  confirmDlg('حذف المعلم ' + t.name + '؟', function() {
    api({ action: 'delTeacher', key: key(), code: code }).then(function(r) {
      if (r.ok) {
        toast('✓ تم الحذف', 'ok');
        loadTeachers();
      } else {
        toast(' ' + r.error, 'err');
      }
    });
  }, 'حذف');
}

/* ═══ إضافة معلم جديد ═══ */
function showAddTeacherForm() {
  var ntName = $('#ntName');
  var ntSubjects = $('#ntSubjectsData');
  if (ntName) ntName.value = '';
  if (ntSubjects) ntSubjects.value = '';
  
  var modal = $('#addTeacherModal');
  if (modal) modal.classList.add('show');
}

function saveNewTeacher() {
  var nameEl = $('#ntName');
  var subjectsEl = $('#ntSubjectsData');
  
  if (!nameEl || !subjectsEl) return;
  
  var name = nameEl.value.trim();
  var subjectsData = subjectsEl.value.trim();
  
  if (!name || !subjectsData) {
    toast('جميع الحقول مطلوبة', 'err');
    return;
  }
  
  api({ action: 'addTeacher', key: key(), name: name, subjectsData: subjectsData }).then(function(r) {
    if (r.ok) {
      toast('✓ تم إضافة المعلم — الكود: ' + r.code, 'ok');
      hideModal('addTeacherModal');
      loadTeachers();
    } else {
      toast('❌ ' + r.error, 'err');
    }
  });
}

/* ═══ طباعة قائمة المعلمين ═══ */
function printTeachersList() {
  if (!TEAM.filtered.length) {
    toast('لا يوجد معلمون للطباعة', 'err');
    return;
  }
  
  var h = '<div style="font-family:Tajawal,Arial,sans-serif;width:190mm;margin:0 auto;padding:10mm">';
  h += '<div style="text-align:center;margin-bottom:20px">';
  h += '<h1 style="color:#1E40AF;font-size:24px">قائمة المعلمين</h1>';
  h += '<p style="color:#64748B;font-size:14px">السنة الدراسية ' + esc(getStudyYear()) + '</p>';
  h += '</div>';
  
  h += '<table style="width:100%;border-collapse:collapse;border:2px solid #0F172A">';
  h += '<thead><tr style="background:#1E40AF;color:#fff">';
  h += '<th style="padding:8px;border:1px solid #0F172A">الكود</th>';
  h += '<th style="padding:8px;border:1px solid #0F172A">الاسم</th>';
  h += '<th style="padding:8px;border:1px solid #0F172A">المواد والصفوف</th>';
  h += '<th style="padding:8px;border:1px solid #0F172A">الحالة</th>';
  h += '</tr></thead><tbody>';
  
  TEAM.filtered.forEach(function(t) {
    var subjectsStr = '';
    if (t.subjects && Array.isArray(t.subjects)) {
      subjectsStr = t.subjects.map(function(s) {
        return s.name + ': ' + (s.classes || []).join('، ');
      }).join(' | ');
    }
    
    h += '<tr>';
    h += '<td style="padding:8px;border:1px solid #0F172A;text-align:center;font-weight:bold">' + esc(t.code) + '</td>';
    h += '<td style="padding:8px;border:1px solid #0F172A">' + esc(t.name) + '</td>';
    h += '<td style="padding:8px;border:1px solid #0F172A;font-size:12px">' + esc(subjectsStr) + '</td>';
    h += '<td style="padding:8px;border:1px solid #0F172A;text-align:center">' + (t.locked ? ' مقفل' : '🔓 مفتوح') + '</td>';
    h += '</tr>';
  });
  
  h += '</tbody></table>';
  h += '</div>';
  
  printWin(h);
}

/* ═══ تصدير Excel ═══ */
function exportTeachersExcel() {
  if (!TEAM.filtered.length) {
    toast('لا يوجد معلمون للتصدير', 'err');
    return;
  }
  
  var h = '<table style="width:100%;border-collapse:collapse" dir="rtl">';
  h += '<thead><tr style="background:#1E40AF;color:#fff">';
  h += '<th style="padding:8px;border:1px solid #0F172A">الكود</th>';
  h += '<th style="padding:8px;border:1px solid #0F172A">الاسم</th>';
  h += '<th style="padding:8px;border:1px solid #0F172A">المواد والصفوف</th>';
  h += '<th style="padding:8px;border:1px solid #0F172A">الحالة</th>';
  h += '<th style="padding:8px;border:1px solid #0F172A">آخر دخول</th>';
  h += '<th style="padding:8px;border:1px solid #0F172A">درجات مرسلة</th>';
  h += '</tr></thead><tbody>';
  
  TEAM.filtered.forEach(function(t) {
    var subjectsStr = '';
    if (t.subjects && Array.isArray(t.subjects)) {
      subjectsStr = t.subjects.map(function(s) {
        return s.name + ': ' + (s.classes || []).join('، ');
      }).join(' | ');
    }
    var lastLoginStr = t.lastLogin ? fmtDate(t.lastLogin) : '-';
    
    h += '<tr>';
    h += '<td style="padding:8px;border:1px solid #0F172A">' + esc(t.code) + '</td>';
    h += '<td style="padding:8px;border:1px solid #0F172A">' + esc(t.name) + '</td>';
    h += '<td style="padding:8px;border:1px solid #0F172A">' + esc(subjectsStr) + '</td>';
    h += '<td style="padding:8px;border:1px solid #0F172A">' + (t.locked ? 'مقفل' : 'مفتوح') + '</td>';
    h += '<td style="padding:8px;border:1px solid #0F172A">' + lastLoginStr + '</td>';
    h += '<td style="padding:8px;border:1px solid #0F172A;text-align:center">' + arNum(t.sentCount || 0) + '</td>';
    h += '</tr>';
  });
  
  h += '</tbody></table>';
  
  downloadXLS('قائمة-المعلمين', 'قائمة المعلمين — ' + getStudyYear(), h);
}

/* ═══ البحث والتصفية ═══ */
function onSearchChange() {
  var el = $('#teamSearch');
  TEAM.search = el ? el.value.trim() : '';
  applyFilters();
}

function onFilterSubjectChange() {
  var el = $('#filterSubject');
  TEAM.filterSubject = el ? el.value : '';
  applyFilters();
}

function onFilterClassChange() {
  var el = $('#filterClass');
  TEAM.filterClass = el ? el.value : '';
  applyFilters();
}
