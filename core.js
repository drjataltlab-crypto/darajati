/* ═══ Code.gs — الخادم الرئيسي (محدث لدعم إضافة المواد والصفوف) ═══ */

var SS_ID = ''; // ضع معرف Google Sheets هنا (اختياري، سيستخدم الملف المرتبط تلقائياً)
var SH_T = 'المعلمون';
var SH_G = 'السجل';
var SH_S = 'التلاميذ';
var SH_D = 'الدرجات';
var SH_K = 'الكلمات';

var T_HEAD = ['الكود','الاسم','المواد','الكلمة','مقفل'];
var G_HEAD = ['التاريخ','الوقت','الكود','المادة','الصف','الشعبة','النوع','القيمة'];
var S_HEAD = ['الصف','الشعبة','الأسماء'];
var D_HEAD = ['الاسم','المادة','الصف','الشعبة','م1','م2','م3','ك1','نصف_السنة','م4','م5','نهاية_السنة','الامتحان','النهائية','الحد_الأقصى'];
var K_HEAD = ['النوع','الكلمة'];

var SUBJECTS = ['التربية الإسلامية','اللغة العربية','اللغة الانكليزية','الرياضيات','الاجتماعيات','العلوم','الفنية','الرياضة'];

function getSS() {
  return SS_ID ? SpreadsheetApp.openById(SS_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function sheet(name, head) {
  var ss = getSS();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (head && head.length) sh.appendRow(head);
  }
  return sh;
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function rand4() {
  return Math.floor(1000 + Math.random() * 9000);
}

function doGet() {
  return out({ ok: true, app: 'درجاتي', time: new Date().toISOString() });
}

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    return route(d || {});
  } catch (err) {
    return out({ ok: false, error: 'خطأ: ' + err.message });
  }
}

function route(d) {
  var a = String(d.action || '');
  
  if (a === 'adminLogin') return adminLogin(d);
  if (a === 'adminData') return adminData();
  if (a === 'addTeacher') return addTeacher(d);
  if (a === 'updateTeacher') return updateTeacher(d);
  if (a === 'delTeacher') return delTeacher(d);
  if (a === 'toggleLock') return toggleLock(d);
  if (a === 'getStudents') return getStudents(d);
  if (a === 'allGrades') return allGrades(d);
  if (a === 'adminSubmit') return adminSubmit(d);
  if (a === 'changeKey') return changeKey(d);
  
  return out({ ok: false, error: 'إجراء غير معروف: ' + a });
}

/* ═══ تسجيل الدخول ═══ */
function adminLogin(d) {
  var key = String(d.key || '').trim();
  if (!key) return out({ ok: false, error: 'كلمة المرور مطلوبة' });
  
  var sh = sheet(SH_K, K_HEAD);
  var data = sh.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === key) {
      var role = String(data[i][0]).trim().toUpperCase();
      return out({ ok: true, role: role });
    }
  }
  
  return out({ ok: false, error: 'كلمة المرور غير صحيحة' });
}

/* ═══ بيانات الإدارة ═══ */
function adminData() {
  var teachers = sheet(SH_T, T_HEAD).getDataRange().getValues().slice(1)
    .filter(function(r) { return String(r[0]).trim() !== ''; })
    .map(function(r) {
      var code = String(r[0]).trim();
      var name = String(r[1]).trim();
      var subjectsData = String(r[2]).trim();
      
      var subjects = [];
      if (subjectsData) {
        subjectsData.split('|').forEach(function(subjectBlock) {
          var parts = subjectBlock.split(':');
          if (parts.length === 2) {
            var subjectName = parts[0].trim();
            var classes = parts[1].split('،').map(function(c) { return c.trim(); }).filter(Boolean);
            subjects.push({ name: subjectName, classes: classes });
          }
        });
      }
      
      return {
        code: code, name: name, subjects: subjects,
        locked: isLocked(r),
        lastLogin: r.length > 5 && r[5] ? new Date(r[5]).getTime() : 0
      };
    });
  
  var g = sheet(SH_G, G_HEAD).getDataRange().getValues();
  var stats = {};
  for (var i = 1; i < g.length; i++) {
    var r = g[i], c = String(r[2]).toUpperCase();
    var tm = (r[0] instanceof Date ? r[0] : new Date(r[0])).getTime();
    if (!stats[c]) stats[c] = { count: 0, last: 0 };
    stats[c].count++;
    if (tm > stats[c].last) stats[c].last = tm;
  }
  
  var list = teachers.map(function(t) {
    var s = stats[t.code.toUpperCase()] || null;
    return {
      code: t.code, name: t.name, subjects: t.subjects, locked: t.locked,
      lastLogin: t.lastLogin, sentCount: s ? s.count : 0, lastSent: s ? s.last : 0
    };
  });
  
  return out({ ok: true, teachers: list, subjects: SUBJECTS });
}

function isLocked(r) {
  if (r.length > 4) {
    var v = r[4];
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1';
    if (typeof v === 'number') return v === 1;
  }
  return false;
}

/* ═══ إضافة معلم (محدث لدعم إضافة المواد والصفوف) ═══ */
function addTeacher(d) {
  var name = String(d.name || '').trim();
  var subject = String(d.subject || '').trim();
  var cls = String(d.cls || '').trim();
  
  if (!name || !subject || !cls) {
    return out({ ok: false, error: 'الاسم والمادة والصف مطلوبة' });
  }
  
  var sh = sheet(SH_T, T_HEAD);
  var data = sh.getDataRange().getValues();
  var rowIndex = -1;
  var currentSubjects = '';
  var existingCode = '';
  
  // البحث عن المعلم بالاسم
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === name) {
      rowIndex = i + 1;
      currentSubjects = String(data[i][2]).trim();
      existingCode = String(data[i][0]).trim();
      break;
    }
  }
  
  var newAssignment = subject + ':' + cls;
  
  if (rowIndex > 0) {
    // المعلم موجود: نضيف المادة والصف إذا لم يكونا موجودين
    var assignments = currentSubjects ? currentSubjects.split('|').map(function(s) { return s.trim(); }).filter(Boolean) : [];
    if (assignments.indexOf(newAssignment) === -1) {
      assignments.push(newAssignment);
      sh.getRange(rowIndex, 3).setValue(assignments.join(' | '));
    }
    return out({ ok: true, code: existingCode, message: 'تمت إضافة المادة والصف لسجل المعلم بنجاح' });
  } else {
    // معلم جديد
    var existingCodes = {};
    for (var i = 1; i < data.length; i++) {
      existingCodes[String(data[i][0]).trim().toUpperCase()] = 1;
    }
    
    var code = String(d.code || '').trim().toUpperCase();
    if (!code) {
      do { code = 'T-' + rand4(); } while (existingCodes[code]);
    } else if (existingCodes[code]) {
      return out({ ok: false, error: 'الكود مستخدم مسبقاً' });
    }
    
    sh.appendRow([code, name, newAssignment, '', '']);
    return out({ ok: true, code: code, message: 'تم إضافة المعلم الجديد بنجاح' });
  }
}

/* ═══ تحديث معلم ═══ */
function updateTeacher(d) {
  var code = String(d.code || '').trim().toUpperCase();
  var name = String(d.name || '').trim();
  var subjectsData = String(d.subjectsData || '').trim();
  
  var t = findTeacher(code);
  if (!t) return out({ ok: false, error: 'المعلم غير موجود' });
  if (!name || !subjectsData) return out({ ok: false, error: 'الاسم والبيانات مطلوبة' });
  
  var sh = sheet(SH_T, T_HEAD);
  sh.getRange(t.rowIndex, 2).setValue(name);
  sh.getRange(t.rowIndex, 3).setValue(subjectsData);
  return out({ ok: true });
}

/* ═══ حذف معلم ═══ */
function delTeacher(d) {
  var code = String(d.code || '').trim().toUpperCase();
  var t = findTeacher(code);
  if (!t) return out({ ok: false, error: 'المعلم غير موجود' });
  sheet(SH_T, T_HEAD).deleteRow(t.rowIndex);
  return out({ ok: true });
}

/* ═══ قفل/فتح معلم ═══ */
function toggleLock(d) {
  var code = String(d.code || '').trim().toUpperCase();
  var t = findTeacher(code);
  if (!t) return out({ ok: false, error: 'المعلم غير موجود' });
  
  var sh = sheet(SH_T, T_HEAD);
  var current = isLocked(t.raw);
  sh.getRange(t.rowIndex, 5).setValue(!current);
  return out({ ok: true });
}

function findTeacher(code) {
  var data = sheet(SH_T, T_HEAD).getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === code) {
      return { rowIndex: i + 1, raw: data[i] };
    }
  }
  return null;
}

/* ═══ جلب التلاميذ ═══ */
function getStudents(d) {
  var grade = String(d.grade || '').trim();
  var section = String(d.section || '').trim();
  
  var sh = sheet(SH_S, S_HEAD);
  var data = sh.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === grade && String(data[i][1]).trim() === section) {
      var names = String(data[i][2] || '').split('\n').map(function(n) { return n.trim(); }).filter(Boolean);
      return out({ ok: true, names: names });
    }
  }
  
  return out({ ok: true, names: [] });
}

/* ═══ جلب كل الدرجات ═══ */
function allGrades(d) {
  var rows = sheet(SH_D, D_HEAD).getDataRange().getValues().slice(1).map(function(r) {
    return {
      name: String(r[0]).trim(),
      subject: String(r[1]).trim(),
      grade: String(r[2]).trim(),
      section: String(r[3]).trim(),
      m1: r[4] != null ? Number(r[4]) : null,
      m2: r[5] != null ? Number(r[5]) : null,
      m3: r[6] != null ? Number(r[6]) : null,
      half: r[7] != null ? Number(r[7]) : null,
      m4: r[8] != null ? Number(r[8]) : null,
      m5: r[9] != null ? Number(r[9]) : null,
      exam: r[10] != null ? Number(r[10]) : null,
      final: r[11] != null ? Number(r[11]) : null,
      max: r[12] != null ? Number(r[12]) : 100
    };
  });
  
  return out({ ok: true, rows: rows });
}

/* ═══ حفظ الدرجات من الإدارة ═══ */
function adminSubmit(d) {
  var cls = d.cls || {};
  var grade = String(cls.grade || d.grade || '').trim();
  var section = String(cls.section || d.section || '').trim();
  var subject = String(d.subject || '').trim();
  var rows = d.rows || [];
  
  if (!grade || !section || !subject || !rows.length) {
    return out({ ok: false, error: 'بيانات غير مكتملة' });
  }
  
  var sh = sheet(SH_D, D_HEAD);
  var data = sh.getDataRange().getValues();
  var updated = 0, created = 0;
  
  rows.forEach(function(r) {
    var name = String(r.name || '').trim();
    if (!name) return;
    
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === name && 
          String(data[i][1]).trim() === subject && 
          String(data[i][2]).trim() === grade && 
          String(data[i][3]).trim() === section) {
        rowIndex = i + 1;
        break;
      }
    }
    
    var row = [
      name, subject, grade, section,
      r.m1, r.m2, r.m3, r.half, r.m4, r.m5, r.exam, r.final, r.max || 100
    ];
    
    if (rowIndex > 0) {
      sh.getRange(rowIndex, 1, 1, row.length).setValues([row]);
      updated++;
    } else {
      sh.appendRow(row);
      created++;
    }
  });
  
  // تسجيل في السجل
  var gsh = sheet(SH_G, G_HEAD);
  var now = new Date();
  rows.forEach(function(r) {
    gsh.appendRow([now, now.toTimeString(), '', subject, grade, section, 'admin', 'submit']);
  });
  
  return out({ ok: true, updated: updated, created: created });
}

/* ═══ تغيير كلمة المرور ═══ */
function changeKey(d) {
  var role = String(d.role || '').trim().toUpperCase();
  var newKey = String(d.newKey || '').trim();
  
  if (!role || !newKey) return out({ ok: false, error: 'بيانات غير مكتملة' });
  
  var sh = sheet(SH_K, K_HEAD);
  var data = sh.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === role) {
      sh.getRange(i + 1, 2).setValue(newKey);
      return out({ ok: true });
    }
  }
  
  sh.appendRow([role, newKey]);
  return out({ ok: true });
}
