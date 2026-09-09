/* ═══ page-results.js — صفحة نتائج التلاميذ ═══ */

var ADM = {teachers:[], tv:null, res:null};
window._classData = [];
window._selectedForDual = [];

/* ═══ دوال الطباعة الأساسية ═══ */
function printSingle(){
  if(!ADM.res || !ADM.res.rows){toast('لا توجد نتيجة للطباعة','err');return;}
  var html = resultTable(ADM.res.rows, {compact:false});
  printWin(html);
}

function printTwo(){
  if(!ADM.res || !ADM.res.second){toast('أضف تلميذ ثاني أولاً','err');return;}
  var html = resultTable(ADM.res.rows, {compact:true, secondRows:ADM.res.second.rows, hideFirstSignatures:true});
  printWin(html);
}

/* ═══ طباعة كل التلاميذ المحددين ═══ */
function printAllSelected(){
  var selected = window._selectedForDual;
  if(!selected.length){toast('لم يتم تحديد أي تلميذ','err');return;}
  
  var printMode = $('#printModeSelect').value;
  var allHtml = '<div style="width:190mm;margin:0 auto">';
  
  if(printMode === 'single'){
    // طباعة كل تلميذ في ورقة منفصلة
    selected.forEach(function(name, i){
      var student = window._classData.find(function(s){return s.name === name;});
      if(student && student.rows.length){
        if(i > 0) allHtml += '<div style="page-break-after:always"></div>';
        allHtml += buildOneResult(student.rows, false, false);
      }
    });
  } else {
    // طباعة كل تلميذين في ورقة واحدة
    for(var i = 0; i < selected.length; i += 2){
      if(i > 0) allHtml += '<div style="page-break-after:always"></div>';
      
      var s1 = window._classData.find(function(s){return s.name === selected[i];});
      var s2 = (i + 1 < selected.length) ? window._classData.find(function(s){return s.name === selected[i+1];}) : null;
      
      if(s1 && s1.rows.length){
        if(s2 && s2.rows.length){
          allHtml += buildOneResult(s1.rows, true, true);
          allHtml += '<div style="border-top:2px dashed #94A3B8;margin:10px 0;page-break-after:avoid"></div>';
          allHtml += buildOneResult(s2.rows, true, false);
        } else {
          allHtml += buildOneResult(s1.rows, false, false);
        }
      }
    }
  }
  allHtml += '</div>';
  printWin(allHtml);
}

/* ═══ دالة البحث الموحّدة ═══ */
function performUnifiedSearch(){
  var name = $('#uniSearchName').value.trim();
  var grade = $('#uniSearchGrade').value;
  var section = $('#uniSearchSec').value;
  
  if(name){
    $('#dynamicResultsArea').innerHTML = '<div class="empty">⏳ جاري البحث...</div>';
    api({action:'searchStudent', key:key(), name:name, grade:grade, section:section}).then(function(r){
      if(!r.ok || !r.rows.length){
        $('#dynamicResultsArea').innerHTML='<div class="empty">لا توجد درجات مسجلة لـ '+esc(name)+'</div>';
        return;
      }
      ADM.res = {name:r.rows[0].name, grade:r.rows[0].grade, section:r.rows[0].section, rows:r.rows, second:null};
      renderSpecificStudent();
    }).catch(function(){$('#dynamicResultsArea').innerHTML='<div class="empty">⚠️ تعذر الاتصال</div>';});
    
  } else if(grade && section){
    loadClassResults(grade, section);
  } else {
    toast('اكتب اسم التلميذ أو اختر الصف والشعبة','err');
  }
}

function searchStudent(){
  performUnifiedSearch();
}

function renderSpecificStudent(){
  if(!ADM.res || !ADM.res.name) return;
  
  var h = '<div class="card" style="border-right:5px solid var(--th);margin-top:12px">';
  h += '<div class="ct" style="color:var(--th)">🎓 نتيجة التلميذ: '+esc(ADM.res.name)+'</div>';
  h += '<div class="cs">الصف: '+esc(ADM.res.grade)+' '+esc(ADM.res.section)+'</div>';
  h += resultCard(ADM.res.name, ADM.res.grade, ADM.res.section, ADM.res.rows);
  
  h += '<div class="grid2" style="margin-top:12px">';
  h += '<button class="btn ok" onclick="printSingle()">🖨️ طباعة النتيجة</button>';
  h += '<button class="btn ghost" onclick="showSecondFormForCurrent()">➕ أضف تلميذ ثاني</button>';
  h += '</div></div>';
    
  $('#dynamicResultsArea').innerHTML = h;
}

function showSecondFormForCurrent(){
  var h = '<div class="card" style="border-right:5px solid #7E22CE;background:linear-gradient(135deg,#FAF5FF,#F5F3FF);margin-top:12px">';
  h += '<div class="ct" style="color:#7E22CE;font-size:16px">➕ إضافة تلميذ ثاني</div>';
  h += '<div class="grid3" style="margin-top:8px">';
  h += '<div><label class="label">📝 اسم التلميذ الثاني</label><input id="secondName" placeholder="اكتب الاسم الكامل" autofocus></div>';
  h += '<div><label class="label">🏫 الصف</label><select id="secondGrade"><option value="">كل الصفوف</option><option>الخامس</option><option>السادس</option></select></div>';
  h += '<div><label class="label">👥 الشعبة</label><select id="secondSec"><option value="">كل الشعب</option><option>أ</option><option>ب</option><option>ج</option></select></div>';
  h += '</div>';
  h += '<div class="grid2" style="margin-top:10px">';
  h += '<button class="btn ok" onclick="searchSecondStudent()">🔍 بحث وإضافة</button>';
  h += '<button class="btn ghost" onclick="hideSecondForm()">❌ إلغاء</button>';
  h += '</div></div>';
  
  $('#dynamicResultsArea').insertAdjacentHTML('beforeend', h);
  setTimeout(function(){var el=$('#secondName');if(el)el.focus();},100);
}

function searchSecondStudent(){
  var name = $('#secondName').value.trim();
  if(!name){toast('اكتب اسم التلميذ الثاني','err');return;}
  var grade = $('#secondGrade').value, section = $('#secondSec').value;
  toast('⏳ بحث...','');
  
  api({action:'searchStudent', key:key(), name:name, grade:grade, section:section}).then(function(r){
    if(!r.ok || !r.rows.length){toast('❌ لم يُعثر على التلميذ الثاني','err');return;}
    ADM.res.second = {name:r.rows[0].name, grade:r.rows[0].grade, section:r.rows[0].section, rows:r.rows};
    
    var h = '<div class="card" style="border-right:5px solid var(--th);margin-top:12px">';
    h += '<div class="ct" style="color:var(--th)">🎓 نتيجة التلميذ: '+esc(ADM.res.name)+'</div>';
    h += resultCard(ADM.res.name, ADM.res.grade, ADM.res.section, ADM.res.rows);
    h += '<div class="card" style="border-right:5px solid #7E22CE;margin-top:12px">';
    h += '<div class="ct" style="color:#7E22CE">🎓 التلميذ الثاني: '+esc(ADM.res.second.name)+'</div>';
    h += resultCard(ADM.res.second.name, ADM.res.second.grade, ADM.res.second.section, ADM.res.second.rows);
    h += '</div>';
    h += '<button class="btn ok" style="margin-top:12px;width:100%" onclick="printTwo()">📑 طباعة التلميذين في ورقة واحدة</button>';
    h += '</div>';
    
    $('#dynamicResultsArea').innerHTML = h;
    toast('✓ تم إضافة التلميذ الثاني','ok');
  }).catch(function(){toast('تعذر الاتصال','err');});
}

function hideSecondForm(){
  renderSpecificStudent();
}

function loadClassResults(g, s){
  $('#dynamicResultsArea').innerHTML = '<div class="empty">⏳ جاري تحميل بيانات الصف...</div>';
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
    $('#dynamicResultsArea').innerHTML = '<div class="empty">️ تعذر الاتصال بالخادم</div>';
  });
}

function renderClassList(){
  var data = window._classData;
  if(!data || !data.length){
    $('#dynamicResultsArea').innerHTML = '<div class="empty">لا يوجد تلاميذ مسجلون في هذا الصف والشعبة</div>';
    return;
  }
  
  var h = '<div class="card" style="border-right:5px solid #059669;margin-top:12px">';
  h += '<div class="ct" style="color:#059669">📋 قائمة الصف: '+esc(data[0].grade)+' '+esc(data[0].section)+'</div>';
  h += '<div class="tbl" style="margin-top:12px"><table class="pt"><thead><tr>';
  
  var allChecked = (window._selectedForDual.length === data.length && data.length > 0) ? 'checked' : '';
  h += '<th style="width:50px"><input type="checkbox" id="selectAllStudents" '+allChecked+' onchange="toggleSelectAll(this)"></th>';
  h += '<th style="width:50px">ت</th><th>اسم التلميذ</th><th style="width:120px">إجراءات</th>';
  h += '</tr></thead><tbody>';
  
  data.forEach(function(student, i){
    var isChecked = window._selectedForDual.includes(student.name) ? 'checked' : '';
    var hasGrades = student.rows && student.rows.length > 0;
    
    h += '<tr>';
    h += '<td style="text-align:center"><input type="checkbox" class="dual-check" data-name="'+escA(student.name)+'" '+isChecked+' onchange="toggleDualSelect(this)"></td>';
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
  
  var count = window._selectedForDual.length;
  h += '<div style="margin-top:14px;padding:12px;background:#F8FAFC;border-radius:8px;border:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">';
  h += '<span class="hint" id="dualSelectCount" style="font-weight:700;color:#475569">المحدد: ' + arNum(count) + '</span>';
  
  if(count > 0){
    h += '<select id="printModeSelect" style="padding:8px;border:1px solid var(--line);border-radius:6px">';
    h += '<option value="dual">📑 طباعة ثنائية (تلميذان في ورقة)</option>';
    h += '<option value="single">📄 طباعة أحادية (كل تلميذ في ورقة)</option>';
    h += '</select>';
    h += '<button class="btn ok" onclick="printAllSelected()">🖨️ طباعة الكل ('+arNum(count)+')</button>';
  } else {
    h += '<button class="btn ghost" disabled>اختر تلاميذ للطباعة</button>';
  }
  h += '</div></div>';
  
  $('#dynamicResultsArea').innerHTML = h;
}

function toggleSelectAll(checkbox){
  var isChecked = checkbox.checked;
  window._selectedForDual = []; 
  
  $$('.dual-check').forEach(function(cb){
    if(isChecked){
      cb.checked = true;
      window._selectedForDual.push(cb.getAttribute('data-name'));
    } else {
      cb.checked = false;
    }
  });
  updateDualPrintUI();
}

function toggleDualSelect(checkbox){
  var name = checkbox.getAttribute('data-name');
  if(checkbox.checked){
    if(!window._selectedForDual.includes(name)){
      window._selectedForDual.push(name);
    }
  } else {
    window._selectedForDual = window._selectedForDual.filter(function(n){return n !== name;});
    var selectAllCb = $('#selectAllStudents');
    if(selectAllCb) selectAllCb.checked = false;
  }
  updateDualPrintUI();
}

function updateDualPrintUI(){
  renderClassList(); 
}

function printSingleClassStudent(name){
  var student = window._classData.find(function(s){return s.name === name;});
  if(!student || !student.rows.length){toast('لا توجد درجات لهذا التلميذ','err');return;}
  ADM.res = {name:student.name, grade:student.grade, section:student.section, rows:student.rows, second:null};
  printSingle();
}

function renderResults(){
  var schoolName=localStorage.getItem('school_name')||'';
  var schoolLogo=localStorage.getItem('school_logo')||'';
  var guideName=localStorage.getItem('guide_name')||'';
  var principalName=localStorage.getItem('principal_name')||'';
  var studyYear=localStorage.getItem('study_year')||'٢٠٢ - ٢٠٢٦';

  var g=function(k,d){return localStorage.getItem(k)||d;};
  var pc={
    schoolColor:g('pc_school_color','#1E40AF'),schoolSize:g('pc_school_size','22'),schoolAlign:g('pc_school_align','center'),
    titleColor:g('pc_title_color','#1E40AF'),titleSize:g('pc_title_size','26'),
    subColor:g('pc_sub_color','#B45309'),subSize:g('pc_sub_size','17'),
    yearColor:g('pc_year_color','#475569'),yearSize:g('pc_year_size','15'),
    logoSize:g('pc_logo_size','110'),
    studentAlign:g('pc_student_align','right'), classAlign:g('pc_class_align','center'), dateAlign:g('pc_date_align','left'),
    tableFont:g('pc_table_font','13'), cellHeight:g('pc_cell_height','32'), cellPad:g('pc_cell_pad','5'), subjectWidth:g('pc_subject_width','140'),
    guideAlign:g('pc_guide_align','right'), principalAlign:g('pc_principal_align','left'), signFont:g('pc_sign_font','15')
  };

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
    +'<div><label class="label">👨‍ مرشد الصف</label><input id="setGuide" value="'+escA(guideName)+'"></div>'
    +'<div style="grid-column:span 2"><label class="label">🎓 مدير المدرسة</label><input id="setPrincipal" value="'+escA(principalName)+'"></div>'
    +'</div>'
    +'<button class="btn ok" style="margin-top:10px" onclick="saveSchoolInfo()">💾 حفظ بيانات المدرسة</button></div>';

  var ctrlCard='<div class="card" style="border-right:5px solid #7C3AED">'
    +'<div class="ct" style="color:#7C3AED;font-size:16px">🎨 التحكم في التنسيق</div>'
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
    +'<div class="grid2" style="margin-top:14px">'
    +'<button class="btn ok" style="background:linear-gradient(135deg,#7C3AED,#A78BFA)" onclick="savePrintCfg()"> حفظ التخصيصات</button>'
    +'<button class="btn ghost" onclick="resetPrintCfg()">🔄 استعادة الافتراضي</button>'
    +'</div></div>';

  var panelOpen = localStorage.getItem('set_panel_open')==='1';
  var html = '<div class="card" style="border-right:5px solid #0E7490;background:linear-gradient(135deg,#ECFEFF,#CFFAFE)">'
    +'<button class="btn" style="background:linear-gradient(135deg,#0E7490,#06B6D4);font-size:15px;padding:13px;width:100%" onclick="toggleSetPanel()">'
    +(panelOpen?'🔼 إغلاق الإعدادات':'⚙️ الإعدادات — بيانات المدرسة والتنسيق')
    +'</button></div>';
    
  html += '<div id="setPanel" style="display:'+(panelOpen?'block':'none')+'">'+settings+ctrlCard+'</div>';
  
  html += '<div class="card" style="border-right:5px solid var(--th);margin-top:12px">'
    +'<div class="ct" style="color:var(--th)">🔍 البحث وعرض النتائج</div>'
    +'<div class="cs">اكتب اسم التلميذ للبحث الفردي، أو اختر الصف والشعبة فقط لعرض القائمة الكاملة</div>'
    +'<div class="grid3" style="margin-top:10px">'
    +'<input id="uniSearchName" placeholder="اسم التلميذ (اختياري)">'
    +'<select id="uniSearchGrade"><option value="">— الصف —</option><option>الخامس</option><option>السادس</option></select>'
    +'<select id="uniSearchSec"><option value="">— الشعبة —</option><option>أ</option><option>ب</option><option>ج</option></select>'
    +'</div>'
    +'<button class="btn" style="margin-top:12px;width:100%;padding:12px;font-size:15px" onclick="performUnifiedSearch()">🔍 بحث / عرض النتائج</button>'
    +'</div>';

  html += '<div id="dynamicResultsArea"></div>';
  $('#resBox').innerHTML = html;
}

function toggleSetPanel(){
  localStorage.setItem('set_panel_open', localStorage.getItem('set_panel_open')==='1'?'0':'1');
  renderResults();
}
function cfgRow(label,prefix,curColor,curSize,curAlign,opts){
  opts=opts||{};
  var cCell = opts.noColor ? '<td style="padding:8px;border-bottom:1px solid var(--line);color:var(--mut);text-align:center">—</td>' : '<td style="padding:8px;border-bottom:1px solid var(--line);text-align:center"><input type="color" id="'+prefix+'Color" value="'+curColor+'" style="width:56px;height:30px;margin:0;padding:2px;border:1px solid var(--line);border-radius:6px"></td>';
  var sCell = opts.noSize ? '<td style="padding:8px;border-bottom:1px solid var(--line);color:var(--mut);text-align:center">—</td>' : '<td style="padding:8px;border-bottom:1px solid var(--line);text-align:center"><input type="number" id="'+prefix+'Size" value="'+curSize+'" min="'+(opts.minSize||8)+'" max="'+(opts.maxSize||60)+'" style="width:70px;margin:0;padding:6px;border:1px solid var(--line);border-radius:6px;text-align:center"></td>';
  var aCell = opts.noAlign ? '<td style="padding:8px;border-bottom:1px solid var(--line);color:var(--mut);text-align:center">—</td>' : '<td style="padding:8px;border-bottom:1px solid var(--line);text-align:center"><select id="'+prefix+'Align" style="width:90px;margin:0;padding:6px;border:1px solid var(--line);border-radius:6px"><option value="right" '+(curAlign==='right'?'selected':'')+'>يمين</option><option value="center" '+(curAlign==='center'?'selected':'')+'>وسط</option><option value="left" '+(curAlign==='left'?'selected':'')+'>يسار</option></select></td>';
  return '<tr><td style="padding:8px;border-bottom:1px solid var(--line);font-weight:700;font-size:12px">'+label+'</td>'+cCell+sCell+aCell+'</tr>';
}
function pickSchoolLogo(){
  var inp=document.createElement('input');inp.type='file';inp.accept='image/*';
  inp.onchange=function(){
    var f=inp.files[0];if(!f)return;
    if(f.size>500000){toast('الصورة كبيرة (أقصى ٥٠٠ كيلو)','err');return;}
    var reader=new FileReader();
    reader.onload=function(e){localStorage.setItem('school_logo',e.target.result);toast('✓ تم حفظ الشعار','ok');renderResults();};
    reader.readAsDataURL(f);
  };
  inp.click();
}
function clearSchoolLogo(){localStorage.removeItem('school_logo');toast('✓ تم حذف الشعار','ok');renderResults();}
function saveSchoolInfo(){
  var n=$('#setName').value.trim(), gd=$('#setGuide').value.trim(), p=$('#setPrincipal').value.trim(), y=$('#setYear').value.trim();
  if(n)localStorage.setItem('school_name',n);else localStorage.removeItem('school_name');
  if(gd)localStorage.setItem('guide_name',gd);else localStorage.removeItem('guide_name');
  if(p)localStorage.setItem('principal_name',p);else localStorage.removeItem('principal_name');
  if(y)localStorage.setItem('study_year',y);else localStorage.removeItem('study_year');
  toast('✓ تم حفظ بيانات المدرسة','ok');renderResults();
}
function savePrintCfg(){
  var set=function(id,key){var el=$('#'+id);if(el)localStorage.setItem(key,el.value);};
  set('pcSchoolColor','pc_school_color');set('pcSchoolSize','pc_school_size');set('pcSchoolAlign','pc_school_align');
  set('pcTitleColor','pc_title_color');set('pcTitleSize','pc_title_size');set('pcSubColor','pc_sub_color');set('pcSubSize','pc_sub_size');
  set('pcYearColor','pc_year_color');set('pcYearSize','pc_year_size');set('pcLogoSize','pc_logo_size');
  set('pcStudentAlign','pc_student_align');set('pcClassAlign','pc_class_align');set('pcDateAlign','pc_date_align');
  set('pcTableFontSize','pc_table_font');set('pcCellHSize','pc_cell_height');set('pcCellPSize','pc_cell_pad');set('pcSubjWSize','pc_subject_width');
  set('pcGuideAlign','pc_guide_align');set('pcGuideSize','pc_sign_font');set('pcPrincipalAlign','pc_principal_align');set('pcPrincipalSize','pc_sign_font');
  toast('✓ تم حفظ التخصيصات','ok');renderResults();
}
function resetPrintCfg(){
  ['pc_school_color','pc_school_size','pc_school_align','pc_title_color','pc_title_size','pc_sub_color','pc_sub_size','pc_year_color','pc_year_size','pc_logo_size','pc_student_align','pc_class_align','pc_date_align','pc_table_font','pc_cell_height','pc_cell_pad','pc_subject_width','pc_guide_align','pc_principal_align','pc_sign_font'].forEach(function(k){localStorage.removeItem(k);});
  toast('✓ تم استعادة الافتراضي','ok');renderResults();
}

registerPage('res',{enter:function(){renderResults();}});
