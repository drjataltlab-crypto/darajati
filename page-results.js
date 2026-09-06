/* ═══ page-results.js — صفحة نتائج التلاميذ ═══ */

function searchStudent(){
  var name=$('#rsName').value.trim();
  if(!name){toast('اكتب اسم التلميذ','err');return;}
  var grade=$('#rsGrade').value,section=$('#rsSec').value;
  $('#resBox').innerHTML='<div class="empty">⏳ بحث...</div>';
  api({action:'searchStudent',key:key(),name:name,grade:grade,section:section}).then(function(r){
    if(!r.ok){toast(r.error,'err');$('#resBox').innerHTML='';return;}
    if(!r.rows.length){$('#resBox').innerHTML='<div class="empty">لا توجد درجات مسجلة لهذا التلميذ بعد</div>';return;}
    ADM.res={name:r.rows[0].name,grade:r.rows[0].grade,section:r.rows[0].section,rows:r.rows,second:null,showSecondForm:false};
    renderResults();
  }).catch(function(){$('#resBox').innerHTML='<div class="empty">⚠️ تعذر الاتصال</div>';});
}

function showSecondForm(){ADM.res.showSecondForm=true;renderResults();}
function hideSecondForm(){ADM.res.showSecondForm=false;renderResults();}

function searchSecondStudent(){
  var name=$('#secondName').value.trim();
  if(!name){toast('اكتب اسم التلميذ الثاني','err');return;}
  var grade=$('#secondGrade').value,section=$('#secondSec').value;
  toast('⏳ بحث عن التلميذ الثاني...','');
  api({action:'searchStudent',key:key(),name:name,grade:grade,section:section}).then(function(r){
    if(!r.ok){toast('❌ '+r.error,'err');return;}
    if(!r.rows.length){toast('❌ لم يُعثر على التلميذ الثاني','err');return;}
    ADM.res.second={name:r.rows[0].name,grade:r.rows[0].grade,section:r.rows[0].section,rows:r.rows};
    ADM.res.showSecondForm=false;
    toast('✓ تم إضافة التلميذ الثاني','ok');
    renderResults();
  }).catch(function(){toast('تعذر الاتصال','err');});
}

function removeSecondStudent(){ADM.res.second=null;renderResults();}

/* ═══ مساعد لبناء صف تحكم (لون + حجم + محاذاة) ═══ */
function cfgRow(label,prefix,currentColor,currentSize,currentAlign,opts){
  opts=opts||{};
  var colorCell=opts.noColor?'<td style="padding:8px;border-bottom:1px solid var(--line);color:var(--mut)">—</td>':
    '<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="color" id="'+prefix+'Color" value="'+currentColor+'" style="width:56px;height:30px;margin:0;padding:2px"></td>';
  var sizeCell=opts.noSize?'<td style="padding:8px;border-bottom:1px solid var(--line);color:var(--mut)">—</td>':
    '<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="number" id="'+prefix+'Size" value="'+currentSize+'" min="'+(opts.minSize||8)+'" max="'+(opts.maxSize||60)+'" style="width:70px;margin:0"></td>';
  var alignCell=opts.noAlign?'<td style="padding:8px;border-bottom:1px solid var(--line);color:var(--mut)">—</td>':
    '<td style="padding:8px;border-bottom:1px solid var(--line)">'
    +'<select id="'+prefix+'Align" style="width:90px;margin:0;padding:6px">'
    +'<option value="right" '+(currentAlign==='right'?'selected':'')+'>يمين</option>'
    +'<option value="center" '+(currentAlign==='center'?'selected':'')+'>وسط</option>'
    +'<option value="left" '+(currentAlign==='left'?'selected':'')+'>يسار</option>'
    +'</select></td>';
  return '<tr>'    +'<td style="padding:8px;border-bottom:1px solid var(--line);font-weight:700;font-size:12px">'+label+'</td>'
    +colorCell+sizeCell+alignCell
    +'</tr>';
}

function renderResults(){
  var schoolName=localStorage.getItem('school_name')||'';
  var schoolLogo=localStorage.getItem('school_logo')||'';
  var guideName=localStorage.getItem('guide_name')||'';
  var principalName=localStorage.getItem('principal_name')||'';
  var studyYear=localStorage.getItem('study_year')||'٢٠٢٥ - ٢٠٢٦';
  
  /* جلب الإعدادات الحالية */
  var g=function(k,d){return localStorage.getItem(k)||d;};
  var pc={
    schoolColor:g('pc_school_color','#1E40AF'), schoolSize:g('pc_school_size','20'), schoolAlign:g('pc_school_align','center'),
    titleColor:g('pc_title_color','#1E40AF'), titleSize:g('pc_title_size','24'),
    subColor:g('pc_sub_color','#B45309'), subSize:g('pc_sub_size','16'),
    yearColor:g('pc_year_color','#475569'), yearSize:g('pc_year_size','14'),
    logoSize:g('pc_logo_size','110'),
    studentAlign:g('pc_student_align','right'),
    classAlign:g('pc_class_align','center'),
    dateAlign:g('pc_date_align','left'),
    tableFont:g('pc_table_font','11'),
    cellHeight:g('pc_cell_height','28'),
    cellPad:g('pc_cell_pad','4'),
    subjectWidth:g('pc_subject_width','140'),
    guideAlign:g('pc_guide_align','right'),
    principalAlign:g('pc_principal_align','left'),
    signFont:g('pc_sign_font','14')
  };

  /* ═══ بطاقة بيانات المدرسة ═══ */
  var settings='<div class="card" style="border-right:5px solid #B45309">'
    +'<div class="ct" style="color:#B45309;font-size:16px">🏫 بيانات المدرسة</div>'
    +'<div class="grid2">'
    +'<div><label class="label">📅 العام الدراسي</label>'
    +'<input id="setYear" value="'+escA(studyYear)+'"></div>'
    +'<div><label class="label">🏫 اسم المدرسة</label>'
    +'<input id="setName" value="'+escA(schoolName)+'"></div>'
    +'<div><label class="label">🖼️ شعار المدرسة</label>'
    +'<div style="display:flex;gap:8px;align-items:center">'
    +(schoolLogo?'<img src="'+schoolLogo+'" style="width:50px;height:50px;object-fit:contain;border:1px solid var(--line);border-radius:8px">':'<div style="width:50px;height:50px;background:#F1F5F9;border:1px dashed var(--line);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:11px">لا يوجد</div>')
    +'<button class="btn sm" onclick="pickSchoolLogo()">📷 اختر</button>'
    +(schoolLogo?'<button class="btn sm danger" onclick="clearSchoolLogo()">🗑</button>':'')
    +'</div></div>'
    +'<div><label class="label">👨‍🏫 مرشد الصف</label>'
    +'<input id="setGuide" value="'+escA(guideName)+'"></div>'
    +'<div style="grid-column:span 2"><label class="label">🎓 مدير المدرسة</label>'
    +'<input id="setPrincipal" value="'+escA(principalName)+'"></div>'    +'</div>'
    +'<button class="btn ok" style="margin-top:10px" onclick="saveSchoolInfo()">💾 حفظ بيانات المدرسة</button>'
    +'</div>';

  /* ═══ بطاقة التحكم الكامل في التنسيق ═══ */
  var ctrlCard='<div class="card" style="border-right:5px solid #7C3AED">'
    +'<div class="ct" style="color:#7C3AED;font-size:16px">🎨 التحكم الكامل في التنسيق</div>'
    +'<div class="cs">خصص كل عنصر: اللون، الحجم، والمحاذاة</div>'
    +'<div style="overflow-x:auto;margin-top:8px"><table style="width:100%;border-collapse:collapse;font-size:13px">'
    +'<tr style="background:#F8FAFC"><th style="padding:8px;text-align:right;border-bottom:2px solid var(--line);font-size:12px">العنصر</th>'
    +'<th style="padding:8px;border-bottom:2px solid var(--line);font-size:12px">اللون</th>'
    +'<th style="padding:8px;border-bottom:2px solid var(--line);font-size:12px">الحجم (px)</th>'
    +'<th style="padding:8px;border-bottom:2px solid var(--line);font-size:12px">المحاذاة</th></tr>'
    +cfgRow('🏫 اسم المدرسة','pcSchool',pc.schoolColor,pc.schoolSize,pc.schoolAlign,{minSize:12,maxSize:36})
    +cfgRow('📜 بطاقة درجات','pcTitle',pc.titleColor,pc.titleSize,'center',{noAlign:true,minSize:14,maxSize:50})
    +cfgRow('📚 الصف الخامس والسادس','pcSub',pc.subColor,pc.subSize,'center',{noAlign:true,minSize:10,maxSize:30})
    +cfgRow('📅 العام الدراسي','pcYear',pc.yearColor,pc.yearSize,'center',{noAlign:true,minSize:10,maxSize:24})
    +cfgRow('🖼️ حجم الشعار','pcLogo',pc.schoolColor,pc.logoSize,'center',{noColor:true,noAlign:true,minSize:50,maxSize:200})
    +'</table></div>'
    +'<div style="margin-top:12px;font-weight:900;color:#1E40AF;font-size:14px;border-top:2px dashed var(--line);padding-top:10px">📋 شريط بيانات التلميذ</div>'
    +'<div style="overflow-x:auto;margin-top:6px"><table style="width:100%;border-collapse:collapse;font-size:13px">'
    +cfgRow('👤 التلميذ','pcStudent',pc.schoolColor,14,pc.studentAlign,{noColor:true,noSize:true})
    +cfgRow('🏫 الصف والشعبة','pcClass',pc.schoolColor,14,pc.classAlign,{noColor:true,noSize:true})
    +cfgRow('📅 التاريخ','pcDate',pc.schoolColor,13,pc.dateAlign,{noColor:true,noSize:true})
    +'</table></div>'
    +'<div style="margin-top:12px;font-weight:900;color:#1E40AF;font-size:14px;border-top:2px dashed var(--line);padding-top:10px">📊 جدول الدرجات</div>'
    +'<div style="overflow-x:auto;margin-top:6px"><table style="width:100%;border-collapse:collapse;font-size:13px">'
    +cfgRow('🔤 حجم خط الجدول','pcTableFont','#1E40AF',pc.tableFont,'center',{noColor:true,noAlign:true,minSize:8,maxSize:18})
    +cfgRow('📏 ارتفاع الخلية','pcCellHeight','#1E40AF',pc.cellHeight,'center',{noColor:true,noAlign:true,minSize:20,maxSize:60})
    +cfgRow('📐 تباعد الخلية','pcCellPad','#1E40AF',pc.cellPad,'center',{noColor:true,noAlign:true,minSize:2,maxSize:12})
    +cfgRow('📖 عرض عمود الدروس','pcSubjectWidth','#1E40AF',pc.subjectWidth,'center',{noColor:true,noAlign:true,minSize:80,maxSize:300})
    +'</table></div>'
    +'<div style="margin-top:12px;font-weight:900;color:#1E40AF;font-size:14px;border-top:2px dashed var(--line);padding-top:10px">✍️ التوقيعات</div>'
    +'<div style="overflow-x:auto;margin-top:6px"><table style="width:100%;border-collapse:collapse;font-size:13px">'
    +cfgRow('👨‍🏫 مرشد الصف','pcGuide',pc.schoolColor,pc.signFont,pc.guideAlign,{noColor:true,minSize:10,maxSize:24})
    +cfgRow('🎓 مدير المدرسة','pcPrincipal',pc.schoolColor,pc.signFont,pc.principalAlign,{noColor:true,minSize:10,maxSize:24})
    +'</table></div>'
    +'<div class="grid2" style="margin-top:12px">'
    +'<button class="btn ok" style="background:linear-gradient(135deg,#7C3AED,#A78BFA)" onclick="savePrintCfg()">💾 حفظ كل التخصيصات</button>'
    +'<button class="btn ghost" onclick="resetPrintCfg()">🔄 استعادة الافتراضي</button>'
    +'</div>'
    +'</div>';

  var hasSecond=ADM.res.second&&ADM.res.second.rows&&ADM.res.second.rows.length;
  var showForm=ADM.res.showSecondForm;

  var secondCard='';
  if(hasSecond){
    secondCard='<div class="card" style="border-right:5px solid #7E22CE;background:linear-gradient(135deg,#FAF5FF,#F5F3FF)">'
      +'<div class="ct" style="color:#7E22CE;font-size:16px">👥 تم إضافة تلميذ ثاني للورقة</div>'      +'<div class="cs" style="font-size:14px"><b>'+esc(ADM.res.second.name)+'</b> — '+esc(ADM.res.second.grade)+' '+esc(ADM.res.second.section)+'</div>'
      +'<button class="btn danger" style="margin-top:8px" onclick="removeSecondStudent()">🗑 حذف التلميذ الثاني</button>'
      +'</div>';
  }

  var secondForm='';
  if(!hasSecond&&showForm){
    secondForm='<div class="card" style="border-right:5px solid #7E22CE;background:linear-gradient(135deg,#FAF5FF,#F5F3FF)">'
      +'<div class="ct" style="color:#7E22CE;font-size:16px">➕ إضافة تلميذ ثاني للورقة</div>'
      +'<div class="grid3" style="margin-top:8px">'
      +'<div><label class="label">📝 اسم التلميذ</label>'
      +'<input id="secondName" placeholder="اكتب الاسم الكامل" autofocus></div>'
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

  var html=settings+ctrlCard+secondCard+secondForm+resultCard(ADM.res.name,ADM.res.grade,ADM.res.section,ADM.res.rows);

  html+='<div class="card" style="border-right:5px solid var(--th);background:linear-gradient(135deg,#EFF6FF,#DBEAFE)">'
    +'<div class="ct" style="color:var(--th);font-size:16px">🖨️ خيارات الطباعة</div>'
    +'<div class="grid3" style="margin-top:10px">'
    +'<button class="btn" style="padding:14px;font-size:14px" onclick="printSingle()">📄 طباعة تلميذ واحد<br><small style="font-size:11px;opacity:.8">ورقة A4 كاملة</small></button>';
  if(hasSecond){
    html+='<button class="btn ok" style="padding:14px;font-size:14px;background:linear-gradient(135deg,#7E22CE,#A78BFA)" onclick="printTwo()">📑 طباعة تلميذين<br><small style="font-size:11px;opacity:.8">في ورقة واحدة</small></button>';
  }else{
    html+='<button class="btn ghost" style="padding:14px;font-size:14px;border:2px solid #7E22CE;color:#7E22CE" onclick="showSecondForm()">➕ أضف تلميذ ثاني<br><small style="font-size:11px;opacity:.8">للورقة نفسها</small></button>';
  }
  html+='<button class="btn ok" style="padding:14px;font-size:14px;background:linear-gradient(135deg,#059669,#10B981)" onclick="excelResults()">⬇️ تنزيل Excel<br><small style="font-size:11px;opacity:.8">ملف للتعديل</small></button>'
    +'</div></div>';
  
  $('#resBox').innerHTML=html;
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
      localStorage.setItem('school_logo',e.target.result);      toast('✓ تم حفظ الشعار','ok');
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
  var g=$('#setGuide').value.trim();
  var p=$('#setPrincipal').value.trim();
  var y=$('#setYear').value.trim();
  if(n)localStorage.setItem('school_name',n);else localStorage.removeItem('school_name');
  if(g)localStorage.setItem('guide_name',g);else localStorage.removeItem('guide_name');
  if(p)localStorage.setItem('principal_name',p);else localStorage.removeItem('principal_name');
  if(y)localStorage.setItem('study_year',y);else localStorage.removeItem('study_year');
  toast('✓ تم حفظ بيانات المدرسة','ok');
  renderResults();
}

/* ═══ حفظ/استعادة تخصيصات التنسيق ═══ */
function savePrintCfg(){
  var set=function(id,key){var el=$('#'+id);if(el)localStorage.setItem(key,el.value);};
  /* العناوين */
  set('pcSchoolColor','pc_school_color');set('pcSchoolSize','pc_school_size');set('pcSchoolAlign','pc_school_align');
  set('pcTitleColor','pc_title_color');set('pcTitleSize','pc_title_size');
  set('pcSubColor','pc_sub_color');set('pcSubSize','pc_sub_size');
  set('pcYearColor','pc_year_color');set('pcYearSize','pc_year_size');
  set('pcLogoSize','pc_logo_size');
  /* شريط التلميذ */
  set('pcStudentAlign','pc_student_align');
  set('pcClassAlign','pc_class_align');
  set('pcDateAlign','pc_date_align');
  /* الجدول */
  set('pcTableFontSize','pc_table_font');
  set('pcCellHeight','pc_cell_height');
  set('pcCellPadding','pc_cell_pad');
  set('pcSubjectWidth','pc_subject_width');
  /* التوقيعات */
  set('pcGuideAlign','pc_guide_align');set('pcGuideSize','pc_sign_font');
  set('pcPrincipalAlign','pc_principal_align');set('pcPrincipalSize','pc_sign_font');
  toast('✓ تم حفظ كل تخصيصات التنسيق','ok');
  renderResults();
}
function resetPrintCfg(){  var keys=['pc_school_color','pc_school_size','pc_school_align','pc_title_color','pc_title_size',
    'pc_sub_color','pc_sub_size','pc_year_color','pc_year_size','pc_logo_size',
    'pc_student_align','pc_class_align','pc_date_align',
    'pc_table_font','pc_cell_height','pc_cell_pad','pc_subject_width',
    'pc_guide_align','pc_principal_align','pc_sign_font'];
  keys.forEach(function(k){localStorage.removeItem(k);});
  toast('✓ تم استعادة كل القيم الافتراضية','ok');
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

registerPage('res',{
  enter:function(){}
});
