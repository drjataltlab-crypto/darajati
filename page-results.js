/* ═══ page-results.js — صفحة نتائج التلاميذ (محدّث) ═══ */

var ADM = {teachers:[], tv:null, res:null}; // للتوافق

function searchStudent(){
  var name = $('#rsName').value.trim();
  if(!name){toast('اكتب اسم التلميذ','err');return;}
  var grade = $('#rsGrade').value, section = $('#rsSec').value;
  $('#resBox').innerHTML = '<div class="empty">⏳ بحث...</div>';
  
  api({action:'searchStudent', key:key(), name:name, grade:grade, section:section}).then(function(r){
    if(!r.ok){toast(r.error,'err');$('#resBox').innerHTML='';return;}
    if(!r.rows.length){$('#resBox').innerHTML='<div class="empty">لا توجد درجات مسجلة لهذا التلميذ بعد</div>';return;}
    ADM.res = {name:r.rows[0].name, grade:r.rows[0].grade, section:r.rows[0].section, rows:r.rows, second:null, showSecondForm:false};
    renderResults();
  }).catch(function(){$('#resBox').innerHTML='<div class="empty">⚠️ تعذر الاتصال</div>';});
}

function showSecondForm(){ADM.res.showSecondForm=true;renderResults();}
function hideSecondForm(){ADM.res.showSecondForm=false;renderResults();}

function searchSecondStudent(){
  var name = $('#secondName').value.trim();
  if(!name){toast('اكتب اسم التلميذ الثاني','err');return;}
  var grade = $('#secondGrade').value, section = $('#secondSec').value;
  toast('⏳ بحث عن التلميذ الثاني...','');
  api({action:'searchStudent', key:key(), name:name, grade:grade, section:section}).then(function(r){
    if(!r.ok){toast('❌ '+r.error,'err');return;}
    if(!r.rows.length){toast('❌ لم يُعثر على التلميذ الثاني','err');return;}
    ADM.res.second = {name:r.rows[0].name, grade:r.rows[0].grade, section:r.rows[0].section, rows:r.rows};
    ADM.res.showSecondForm = false;
    toast('✓ تم إضافة التلميذ الثاني','ok');
    renderResults();
  }).catch(function(){toast('تعذر الاتصال','err');});
}

function removeSecondStudent(){ADM.res.second=null;renderResults();}

function toggleSetPanel(){
  var open = localStorage.getItem('set_panel_open')==='1';
  localStorage.setItem('set_panel_open', open?'0':'1');
  renderResults();
}

/* ═══ صف تحكم: عنصر / لون / حجم / محاذاة ═══ */
function cfgRow(label,prefix,curColor,curSize,curAlign,opts){
  opts=opts||{};
  var cCell = opts.noColor ? '<td style="padding:8px;border-bottom:1px solid var(--line);color:var(--mut);text-align:center">—</td>'
    : '<td style="padding:8px;border-bottom:1px solid var(--line);text-align:center"><input type="color" id="'+prefix+'Color" value="'+curColor+'" style="width:56px;height:30px;margin:0;padding:2px;border:1px solid var(--line);border-radius:6px"></td>';
  var sCell = opts.noSize ? '<td style="padding:8px;border-bottom:1px solid var(--line);color:var(--mut);text-align:center">—</td>'
    : '<td style="padding:8px;border-bottom:1px solid var(--line);text-align:center"><input type="number" id="'+prefix+'Size" value="'+curSize+'" min="'+(opts.minSize||8)+'" max="'+(opts.maxSize||60)+'" style="width:70px;margin:0;padding:6px;border:1px solid var(--line);border-radius:6px;text-align:center"></td>';
  var aCell = opts.noAlign ? '<td style="padding:8px;border-bottom:1px solid var(--line);color:var(--mut);text-align:center">—</td>'
    : '<td style="padding:8px;border-bottom:1px solid var(--line);text-align:center"><select id="'+prefix+'Align" style="width:90px;margin:0;padding:6px;border:1px solid var(--line);border-radius:6px">'
    +'<option value="right" '+(curAlign==='right'?'selected':'')+'>يمين</option>'
    +'<option value="center" '+(curAlign==='center'?'selected':'')+'>وسط</option>'
    +'<option value="left" '+(curAlign==='left'?'selected':'')+'>يسار</option>'
    +'</select></td>';
  return '<tr><td style="padding:8px;border-bottom:1px solid var(--line);font-weight:700;font-size:12px">'+label+'</td>'+cCell+sCell+aCell+'</tr>';
}

/* ═══ متغيرات قائمة الصف الكامل ═══ */
window._classData = [];
window._selectedForDual = [];

function loadClassResults(){
  var g = $('#resClassGrade').value;
  var s = $('#resClassSec').value;
  if(!g || !s){toast('اختر الصف والشعبة أولاً','err');return;}
  
  $('#classResultsBox').innerHTML = '<div class="empty">⏳ جاري تحميل بيانات الصف...</div>';
  window._selectedForDual = [];
  
  Promise.all([
    api({action:'getStudents', key:key(), grade:g, section:s, cls:{grade:g, section:s}}),
    api({action:'allGrades', key:key()})
  ]).then(function(res){
    var names = (res[0] && res[0].names) ? res[0].names : [];
    var allGrades = (res[1] && res[1].rows) ? res[1].rows : [];
    
    window._classData = names.map(function(name){
      var rows = allGrades.filter(function(r){
        return r.name === name && r.grade === g && r.section === s;
      });
      return {name:name, grade:g, section:s, rows:rows};
    });
    
    renderClassList();
  }).catch(function(){
    $('#classResultsBox').innerHTML = '<div class="empty">⚠️ تعذر الاتصال بالخادم</div>';
  });
}

function renderClassList(){
  var data = window._classData;
  if(!data || !data.length){
    $('#classResultsBox').innerHTML = '<div class="empty">لا يوجد تلاميذ مسجلون في هذا الصف والشعبة</div>';
    return;
  }
  
  var h = '<div class="tbl" style="margin-top:12px"><table class="pt"><thead><tr>';
  h += '<th style="width:50px">تحديد</th><th style="width:50px">ت</th><th>اسم التلميذ</th><th style="width:180px">إجراءات</th>';
  h += '</tr></thead><tbody>';
  
  data.forEach(function(student, i){
    var isChecked = window._selectedForDual.includes(student.name) ? 'checked' : '';
    var hasGrades = student.rows && student.rows.length > 0;
    
    h += '<tr>';
    h += '<td style="text-align:center"><input type="checkbox" class="dual-check" data-name="'+escA(student.name)+'" '+isChecked+' onchange="toggleDualSelect(this)" '+(window._selectedForDual.length>=2 && !isChecked?'disabled':'')+'></td>';
    h += '<td style="text-align:center;font-weight:800">'+arNum(i+1)+'</td>';
    h += '<td class="nm">'+esc(student.name) + (hasGrades?'':' <span class="hint">(لا توجد درجات)</span>')+'</td>';
    h += '<td style="text-align:center;white-space:nowrap">';
    if(hasGrades){
      h += '<button class="btn sm" onclick="printSingleClassStudent(\''+escA(student.name)+'\')">🖨️ طباعة</button>';
    } else {
      h += '<button class="btn sm ghost" disabled>لا توجد بيانات</button>';
    }
    h += '</td></tr>';
  });
  h += '</tbody></table></div>';
  
  h += '<div style="margin-top:14px;padding:12px;background:#F8FAFC;border-radius:8px;border:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">';
  h += '<span class="hint" id="dualSelectCount" style="font-weight:700;color:#475569">المحدد للطباعة الثنائية: ٠ / ٢</span>';
  h += '<button class="btn ok" id="btnPrintDualClass" style="display:'+(window._selectedForDual.length===2?'inline-block':'none')+'" onclick="printSelectedDualClass()">📑 طباعة المحددين (٢) في ورقة واحدة</button>';
  h += '</div>';
  
  $('#classResultsBox').innerHTML = h;
}

function toggleDualSelect(checkbox){
  var name = checkbox.getAttribute('data-name');
  if(checkbox.checked){
    if(window._selectedForDual.length >= 2){
      checkbox.checked = false;
      toast('يمكن تحديد تلميذين فقط للطباعة الثنائية','err');
      return;
    }
    window._selectedForDual.push(name);
  } else {
    window._selectedForDual = window._selectedForDual.filter(function(n){return n !== name;});
  }
  
  // تحديث حالة الأزرار
  var count = window._selectedForDual.length;
  $('#dualSelectCount').textContent = 'المحدد للطباعة الثنائية: ' + arNum(count) + ' / ٢';
  var btn = $('#btnPrintDualClass');
  if(btn) btn.style.display = (count === 2) ? 'inline-block' : 'none';
  
  $$('.dual-check').forEach(function(cb){
    if(!cb.checked) cb.disabled = (count >= 2);
  });
}

function printSingleClassStudent(name){
  var student = window._classData.find(function(s){return s.name === name;});
  if(!student || !student.rows.length){toast('لا توجد درجات لهذا التلميذ','err');return;}
  
  var oldRes = ADM.res;
  ADM.res = {name:student.name, grade:student.grade, section:student.section, rows:student.rows, second:null};
  printSingle();
  ADM.res = oldRes;
}

function printSelectedDualClass(){
  if(window._selectedForDual.length !== 2){toast('يجب تحديد تلميذين بالضبط','err');return;}
  
  var s1 = window._classData.find(function(s){return s.name === window._selectedForDual[0];});
  var s2 = window._classData.find(function(s){return s.name === window._selectedForDual[1];});
  
  if(!s1 || !s2 || !s1.rows.length || !s2.rows.length){
    toast('تأكد من وجود درجات للتلميذين المحددين','err');return;
  }
  
  var oldRes = ADM.res;
  ADM.res = {
    name: s1.name, grade: s1.grade, section: s1.section, rows: s1.rows,
    second: {name: s2.name, grade: s2.grade, section: s2.section, rows: s2.rows}
  };
  printTwo();
  ADM.res = oldRes;
}

/* ═══ دالة renderResults الرئيسية ═══ */
function renderResults(){
  var schoolName=localStorage.getItem('school_name')||'';
  var schoolLogo=localStorage.getItem('school_logo')||'';
  var guideName=localStorage.getItem('guide_name')||'';
  var principalName=localStorage.getItem('principal_name')||'';
  var studyYear=localStorage.getItem('study_year')||'٢٠٢٥ - ٢٠٢٦';

  var g=function(k,d){return localStorage.getItem(k)||d;};
  var pc={
    schoolColor:g('pc_school_color','#1E40AF'),schoolSize:g('pc_school_size','22'),schoolAlign:g('pc_school_align','center'),
    titleColor:g('pc_title_color','#1E40AF'),titleSize:g('pc_title_size','26'),
    subColor:g('pc_sub_color','#B45309'),subSize:g('pc_sub_size','17'),
    yearColor:g('pc_year_color','#475569'),yearSize:g('pc_year_size','15'),
    logoSize:g('pc_logo_size','110'),
    studentAlign:g('pc_student_align','right'),
    classAlign:g('pc_class_align','center'),
    dateAlign:g('pc_date_align','left'),
    tableFont:g('pc_table_font','13'),
    cellHeight:g('pc_cell_height','32'),
    cellPad:g('pc_cell_pad','5'),
    subjectWidth:g('pc_subject_width','140'),
    guideAlign:g('pc_guide_align','right'),
    principalAlign:g('pc_principal_align','left'),
    signFont:g('pc_sign_font','15')
  };

  /* ═══ بطاقة بيانات المدرسة ═══ */
  var settings='<div class="card" style="border-right:5px solid #B45309">'
    +'<div class="ct" style="color:#B45309;font-size:16px">🏫 بيانات المدرسة</div>'
    +'<div class="grid2">'
    +'<div><label class="label">📅 العام الدراسي</label><input id="setYear" value="'+escA(studyYear)+'"></div>'
    +'<div><label class="label">🏫 اسم المدرسة</label><input id="setName" value="'+escA(schoolName)+'"></div>'
    +'<div><label class="label">🖼️ شعار المدرسة</label>'
    +'<div style="display:flex;gap:8px;align-items:center">'
    +(schoolLogo?'<img src="'+schoolLogo+'" style="width:50px;height:50px;object-fit:contain;border:1px solid var(--line);border-radius:8px">':'<div style="width:50px;height:50px;background:#F1F5F9;border:1px dashed var(--line);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:11px">لا يوجد</div>')
    +'<button class="btn sm" onclick="pickSchoolLogo()">📷 اختر</button>'
    +(schoolLogo?'<button class="btn sm danger" onclick="clearSchoolLogo()">🗑</button>':'')
    +'</div></div>'
    +'<div><label class="label">👨‍🏫 مرشد الصف</label><input id="setGuide" value="'+escA(guideName)+'"></div>'
    +'<div style="grid-column:span 2"><label class="label">🎓 مدير المدرسة</label><input id="setPrincipal" value="'+escA(principalName)+'"></div>'
    +'</div>'
    +'<button class="btn ok" style="margin-top:10px" onclick="saveSchoolInfo()">💾 حفظ بيانات المدرسة</button>'
    +'</div>';

  /* ═══ بطاقة التحكم الكامل بالتنسيق ═══ */
  var ctrlCard='<div class="card" style="border-right:5px solid #7C3AED">'
    +'<div class="ct" style="color:#7C3AED;font-size:16px">🎨 التحكم الكامل في التنسيق</div>'
    +'<div class="cs">خصص كل عنصر: اللون، الحجم، والمحاذاة</div>'
    +'<div style="margin-top:12px;font-weight:900;color:#7C3AED;font-size:14px;border-top:2px dashed var(--line);padding-top:10px">📌 العناوين والشعار</div>'
    +'<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:6px">'
    +'<tr style="background:#F8FAFC"><th style="padding:8px;text-align:right;border-bottom:2px solid var(--line);font-size:12px;width:40%">العنصر</th>'
    +'<th style="padding:8px;text-align:center;border-bottom:2px solid var(--line);font-size:12px;width:20%">اللون</th>'
    +'<th style="padding:8px;text-align:center;border-bottom:2px solid var(--line);font-size:12px;width:20%">الحجم</th>'
    +'<th style="padding:8px;text-align:center;border-bottom:2px solid var(--line);font-size:12px;width:20%">المحاذاة</th></tr>'
    +cfgRow('🏫 اسم المدرسة','pcSchool',pc.schoolColor,pc.schoolSize,pc.schoolAlign,{minSize:12,maxSize:36})
    +cfgRow('📜 بطاقة درجات','pcTitle',pc.titleColor,pc.titleSize,'center',{noAlign:true,minSize:14,maxSize:50})
    +cfgRow('📚 الصف الخامس والسادس','pcSub',pc.subColor,pc.subSize,'center',{noAlign:true,minSize:10,maxSize:30})
    +cfgRow('📅 العام الدراسي','pcYear',pc.yearColor,pc.yearSize,'center',{noAlign:true,minSize:10,maxSize:24})
    +cfgRow('🖼️ حجم الشعار','pcLogo',pc.schoolColor,pc.logoSize,'center',{noColor:true,noAlign:true,minSize:50,maxSize:200})
    +'</table>'
    +'<div style="margin-top:16px;font-weight:900;color:#7C3AED;font-size:14px;border-top:2px dashed var(--line);padding-top:10px">📋 شريط بيانات التلميذ</div>'
    +'<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:6px">'
    +cfgRow('👤 التلميذ','pcStudent',pc.schoolColor,16,pc.studentAlign,{noColor:true,noSize:true})
    +cfgRow('🏫 الصف والشعبة','pcClass',pc.schoolColor,16,pc.classAlign,{noColor:true,noSize:true})
    +cfgRow('📅 التاريخ','pcDate',pc.schoolColor,14,pc.dateAlign,{noColor:true,noSize:true})
    +'</table>'
    +'<div style="margin-top:16px;font-weight:900;color:#7C3AED;font-size:14px;border-top:2px dashed var(--line);padding-top:10px">📊 جدول الدرجات</div>'
    +'<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:6px">'
    +cfgRow('🔤 حجم خط الجدول','pcTableFont','#1E40AF',pc.tableFont,'center',{noColor:true,noAlign:true,minSize:8,maxSize:20})
    +cfgRow('📏 ارتفاع الخلية','pcCellH','#1E40AF',pc.cellHeight,'center',{noColor:true,noAlign:true,minSize:20,maxSize:60})
    +cfgRow('📐 تباعد الخلية','pcCellP','#1E40AF',pc.cellPad,'center',{noColor:true,noAlign:true,minSize:2,maxSize:12})
    +cfgRow('📖 عرض عمود الدروس','pcSubjW','#1E40AF',pc.subjectWidth,'center',{noColor:true,noAlign:true,minSize:80,maxSize:300})
    +'</table>'
    +'<div style="margin-top:16px;font-weight:900;color:#7C3AED;font-size:14px;border-top:2px dashed var(--line);padding-top:10px">✍️ التوقيعات</div>'
    +'<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:6px">'
    +cfgRow('👨‍🏫 مرشد الصف','pcGuide',pc.schoolColor,pc.signFont,pc.guideAlign,{noColor:true,minSize:10,maxSize:24})
    +cfgRow('🎓 مدير المدرسة','pcPrincipal',pc.schoolColor,pc.signFont,pc.principalAlign,{noColor:true,minSize:10,maxSize:24})
    +'</table>'
    +'<div class="grid2" style="margin-top:14px">'
    +'<button class="btn ok" style="background:linear-gradient(135deg,#7C3AED,#A78BFA)" onclick="savePrintCfg()">💾 حفظ كل التخصيصات</button>'
    +'<button class="btn ghost" onclick="resetPrintCfg()">🔄 استعادة الافتراضي</button>'
    +'</div>'
    +'</div>';

  var hasSecond = ADM.res && ADM.res.second && ADM.res.second.rows && ADM.res.second.rows.length;
  var showForm = ADM.res && ADM.res.showSecondForm;

  var secondCard='';
  if(hasSecond){
    secondCard='<div class="card" style="border-right:5px solid #7E22CE;background:linear-gradient(135deg,#FAF5FF,#F5F3FF)">'
      +'<div class="ct" style="color:#7E22CE;font-size:16px">👥 تم إضافة تلميذ ثاني للورقة</div>'
      +'<div class="cs" style="font-size:14px"><b>'+esc(ADM.res.second.name)+'</b> — '+esc(ADM.res.second.grade)+' '+esc(ADM.res.second.section)+'</div>'
      +'<button class="btn danger" style="margin-top:8px" onclick="removeSecondStudent()">🗑 حذف التلميذ الثاني</button>'
      +'</div>';
  }

  var secondForm='';
  if(!hasSecond && showForm){
    secondForm='<div class="card" style="border-right:5px solid #7E22CE;background:linear-gradient(135deg,#FAF5FF,#F5F3FF)">'
      +'<div class="ct" style="color:#7E22CE;font-size:16px">➕ إضافة تلميذ ثاني للورقة</div>'
      +'<div class="grid3" style="margin-top:8px">'
      +'<div><label class="label">📝 اسم التلميذ</label><input id="secondName" placeholder="اكتب الاسم الكامل" autofocus></div>'
      +'<div><label class="label">🏫 الصف</label>'
      +'<select id="secondGrade"><option value="">كل الصفوف</option><option>الخامس</option><option>السادس</option></select></div>'
      +'<div><label class="label">👥 الشعبة</label>'
      +'<select id="secondSec"><option value="">كل الشعب</option><option>أ</option><option>ب</option><option>ج</option></select></div>'
      +'</div>'
      +'<div class="grid2" style="margin-top:10px">'
      +'<button class="btn ok" onclick="searchSecondStudent()">🔍 بحث وإضافة</button>'
      +'<button class="btn ghost" onclick="hideSecondForm()">❌ إلغاء</button>'
      +'</div></div>';
  }

  /* ═══ زر الإعدادات الواحد + اللوحة المخفية ═══ */
  var panelOpen = localStorage.getItem('set_panel_open')==='1';
  var html = '<div class="card" style="border-right:5px solid #0E7490;background:linear-gradient(135deg,#ECFEFF,#CFFAFE)">'
    +'<button class="btn" style="background:linear-gradient(135deg,#0E7490,#06B6D4);font-size:15px;padding:13px" onclick="toggleSetPanel()">'
    +(panelOpen?'🔼 إغلاق الإعدادات':'⚙️ الإعدادات — بيانات المدرسة والتنسيق')
    +'</button></div>';
  html += '<div id="setPanel" style="display:'+(panelOpen?'block':'none')+'">'+settings+ctrlCard+'</div>';
  
  /* ═══ بطاقة البحث الفردي ═══ */
  html += '<div class="card" style="border-right:5px solid var(--th)">'
    +'<div class="ct" style="color:var(--th)">🔍 بحث عن تلميذ محدد</div>'
    +'<div class="row2" style="margin-top:10px">'
    +'<input id="rsName" placeholder="✍️ اسم التلميذ...">'
    +'<select id="rsGrade"><option value="">كل الصفوف</option><option>الخامس</option><option>السادس</option></select>'
    +'<select id="rsSec"><option value="">كل الشعب</option><option>أ</option><option>ب</option><option>ج</option></select>'
    +'</div>'
    +'<button class="btn" style="margin-top:10px;width:100%" onclick="searchStudent()">🔍 عرض نتيجة التلميذ</button>'
    +'</div>';

  /* ═══ بطاقة عرض الصف الكامل (الجديدة) ═══ */
  html += '<div class="card" style="border-right:5px solid #059669">'
    +'<div class="ct" style="color:#059669">📋 عرض نتائج صف كامل</div>'
    +'<div class="grid3" style="margin-top:10px">'
    +'<select id="resClassGrade"><option value="">— الصف —</option><option>الخامس</option><option>السادس</option></select>'
    +'<select id="resClassSec"><option value="">— الشعبة —</option><option>أ</option><option>ب</option><option>ج</option></select>'
    +'<button class="btn ok" onclick="loadClassResults()">📊 عرض القائمة</button>'
    +'</div>'
    +'<div id="classResultsBox"></div>'
    +'</div>';

  html += secondCard + secondForm;
  
  if(ADM.res && ADM.res.name){
    html += resultCard(ADM.res.name, ADM.res.grade, ADM.res.section, ADM.res.rows);
    html += '<div class="card" style="border-right:5px solid var(--th);background:linear-gradient(135deg,#EFF6FF,#DBEAFE)">'
      +'<div class="ct" style="color:var(--th);font-size:16px">🖨️ خيارات الطباعة</div>'
      +'<div class="grid3" style="margin-top:10px">'
      +'<button class="btn" style="padding:14px;font-size:14px" onclick="printSingle()">📄 طباعة تلميذ واحد</button>';
    if(hasSecond){
      html += '<button class="btn ok" style="padding:14px;font-size:14px;background:linear-gradient(135deg,#7E22CE,#A78BFA)" onclick="printTwo()">📑 طباعة تلميذين في ورقة</button>';
    }else{
      html += '<button class="btn ghost" style="padding:14px;font-size:14px;border:2px solid #7E22CE;color:#7E22CE" onclick="showSecondForm()">➕ أضف تلميذ ثاني</button>';
    }
    html += '<button class="btn ok" style="padding:14px;font-size:14px;background:linear-gradient(135deg,#059669,#10B981)" onclick="excelResults()">⬇️ تنزيل Excel</button>'
      +'</div></div>';
  }

  $('#resBox').innerHTML = html;
  if(showForm){setTimeout(function(){var el=$('#secondName');if(el)el.focus();},100);}
}

function pickSchoolLogo(){
  var inp=document.createElement('input');
  inp.type='file';inp.accept='image/*';
  inp.onchange=function(){
    var f=inp.files[0];if(!f)return;
    if(f.size>500000){toast('الصورة كبيرة (أقصى ٥٠٠ كيلو)','err');return;}
    var reader=new FileReader();
    reader.onload=function(e){
      localStorage.setItem('school_logo',e.target.result);
      toast('✓ تم حفظ الشعار','ok');
      renderResults();
    };
    reader.readAsDataURL(f);
  };
  inp.click();
}
function clearSchoolLogo(){
  localStorage.removeItem('school_logo');
  toast('✓ تم حذف الشعار','ok');
  renderResults();
}
function saveSchoolInfo(){
  var n=$('#setName').value.trim();
  var gd=$('#setGuide').value.trim();
  var p=$('#setPrincipal').value.trim();
  var y=$('#setYear').value.trim();
  if(n)localStorage.setItem('school_name',n);else localStorage.removeItem('school_name');
  if(gd)localStorage.setItem('guide_name',gd);else localStorage.removeItem('guide_name');
  if(p)localStorage.setItem('principal_name',p);else localStorage.removeItem('principal_name');
  if(y)localStorage.setItem('study_year',y);else localStorage.removeItem('study_year');
  toast('✓ تم حفظ بيانات المدرسة','ok');
  renderResults();
}

function savePrintCfg(){
  var set=function(id,key){var el=$('#'+id);if(el)localStorage.setItem(key,el.value);};
  set('pcSchoolColor','pc_school_color');set('pcSchoolSize','pc_school_size');set('pcSchoolAlign','pc_school_align');
  set('pcTitleColor','pc_title_color');set('pcTitleSize','pc_title_size');
  set('pcSubColor','pc_sub_color');set('pcSubSize','pc_sub_size');
  set('pcYearColor','pc_year_color');set('pcYearSize','pc_year_size');
  set('pcLogoSize','pc_logo_size');
  set('pcStudentAlign','pc_student_align');
  set('pcClassAlign','pc_class_align');
  set('pcDateAlign','pc_date_align');
  set('pcTableFontSize','pc_table_font');
  set('pcCellHSize','pc_cell_height');
  set('pcCellPSize','pc_cell_pad');
  set('pcSubjWSize','pc_subject_width');
  set('pcGuideAlign','pc_guide_align');set('pcGuideSize','pc_sign_font');
  set('pcPrincipalAlign','pc_principal_align');set('pcPrincipalSize','pc_sign_font');
  toast('✓ تم حفظ كل تخصيصات التنسيق','ok');
  renderResults();
}
function resetPrintCfg(){
  ['pc_school_color','pc_school_size','pc_school_align','pc_title_color','pc_title_size',
   'pc_sub_color','pc_sub_size','pc_year_color','pc_year_size','pc_logo_size',
   'pc_student_align','pc_class_align','pc_date_align',
   'pc_table_font','pc_cell_height','pc_cell_pad','pc_subject_width',
   'pc_guide_align','pc_principal_align','pc_sign_font']
   .forEach(function(k){localStorage.removeItem(k);});
  toast('✓ تم استعادة القيم الافتراضية','ok');
  renderResults();
}

function printSingle(){
  if(!ADM.res)return;
  printWin(resultTable(ADM.res.rows,{compact:false}));
}
function printTwo(){
  if(!ADM.res||!ADM.res.second||!ADM.res.second.rows.length){toast('أضف تلميذ ثاني أولًا','err');return;}
  printWin(resultTable(ADM.res.rows,{compact:true,secondRows:ADM.res.second.rows}));
}
function excelResults(){
  if(!ADM.res)return;
  downloadXLS('نتيجة-'+ADM.res.name,'بطاقة نتيجة: '+ADM.res.name+' — السنة '+getStudyYear(),resultTable(ADM.res.rows));
}

registerPage('res',{enter:function(){}});
