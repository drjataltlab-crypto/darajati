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

function renderResults(){
  var schoolName=localStorage.getItem('school_name')||'';
  var schoolLogo=localStorage.getItem('school_logo')||'';
  var guideName=localStorage.getItem('guide_name')||'';
  var principalName=localStorage.getItem('principal_name')||'';
  var studyYear=localStorage.getItem('study_year')||'٢٠٢٥ - ٢٠٢٦';
  
  /* جلب إعدادات العناوين */
  var hdrSchoolColor=localStorage.getItem('hdr_school_color')||'#1E40AF';
  var hdrSchoolSize=localStorage.getItem('hdr_school_size')||'18';
  var hdrTitleColor=localStorage.getItem('hdr_title_color')||'#1E40AF';
  var hdrTitleSize=localStorage.getItem('hdr_title_size')||'22';
  var hdrSubColor=localStorage.getItem('hdr_subtitle_color')||'#B45309';
  var hdrSubSize=localStorage.getItem('hdr_subtitle_size')||'15';
  var hdrYearColor=localStorage.getItem('hdr_year_color')||'#475569';  var hdrYearSize=localStorage.getItem('hdr_year_size')||'13';
  var hdrLogoSize=localStorage.getItem('hdr_logo_size')||'105';

  /* ═══ بطاقة بيانات المدرسة ═══ */
  var settings='<div class="card" style="border-right:5px solid #B45309">'
    +'<div class="ct" style="color:#B45309;font-size:16px">🏫 بيانات المدرسة والعام الدراسي</div>'
    +'<div class="cs">تظهر في بطاقة الطباعة — تُحفظ محليًا</div>'
    +'<div class="grid2">'
    +'<div><label class="label">📅 العام الدراسي</label>'
    +'<input id="setYear" placeholder="٢٠٢٥ - ٢٠٢٦" value="'+escA(studyYear)+'"></div>'
    +'<div><label class="label">🏫 اسم المدرسة</label>'
    +'<input id="setName" placeholder="مدرسة المنهل الابتدائية" value="'+escA(schoolName)+'"></div>'
    +'<div><label class="label">🖼️ شعار المدرسة</label>'
    +'<div style="display:flex;gap:8px;align-items:center">'
    +(schoolLogo?'<img src="'+schoolLogo+'" style="width:50px;height:50px;object-fit:contain;border:1px solid var(--line);border-radius:8px">':'<div style="width:50px;height:50px;background:#F1F5F9;border:1px dashed var(--line);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:11px">لا يوجد</div>')
    +'<button class="btn sm" onclick="pickSchoolLogo()">📷 اختر</button>'
    +(schoolLogo?'<button class="btn sm danger" onclick="clearSchoolLogo()">🗑</button>':'')
    +'</div></div>'
    +'<div><label class="label">👨‍🏫 مرشد الصف</label>'
    +'<input id="setGuide" placeholder="أحمد حسن" value="'+escA(guideName)+'"></div>'
    +'<div style="grid-column:span 2"><label class="label">🎓 مدير المدرسة</label>'
    +'<input id="setPrincipal" placeholder="أحمد حسن محمد علي" value="'+escA(principalName)+'"></div>'
    +'</div>'
    +'<button class="btn ok" style="margin-top:10px" onclick="saveSchoolInfo()">💾 حفظ بيانات المدرسة</button>'
    +'</div>';

  /* ═══ بطاقة تخصيص العناوين (ميزة جديدة) ═══ */
  var hdrSettings='<div class="card" style="border-right:5px solid #7C3AED">'
    +'<div class="ct" style="color:#7C3AED;font-size:16px">🎨 تخصيص العناوين والشعار في أعلى البطاقة</div>'
    +'<div class="cs">اختر اللون والحجم المناسب لكل عنوان</div>'
    +'<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px">'
    +'<tr style="background:#F8FAFC"><th style="padding:8px;text-align:right;border-bottom:1px solid var(--line)">العنوان</th><th style="padding:8px;border-bottom:1px solid var(--line)">اللون</th><th style="padding:8px;border-bottom:1px solid var(--line)">الحجم (px)</th></tr>'
    
    +'<tr><td style="padding:8px;border-bottom:1px solid var(--line);font-weight:700">🏫 اسم المدرسة</td>'
    +'<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="color" id="hSchoolColor" value="'+hdrSchoolColor+'" style="width:60px;height:32px;margin:0;padding:2px"></td>'
    +'<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="number" id="hSchoolSize" value="'+hdrSchoolSize+'" min="10" max="40" style="width:80px;margin:0"></td></tr>'
    
    +'<tr><td style="padding:8px;border-bottom:1px solid var(--line);font-weight:700">📜 بطاقة درجات</td>'
    +'<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="color" id="hTitleColor" value="'+hdrTitleColor+'" style="width:60px;height:32px;margin:0;padding:2px"></td>'
    +'<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="number" id="hTitleSize" value="'+hdrTitleSize+'" min="12" max="50" style="width:80px;margin:0"></td></tr>'
    
    +'<tr><td style="padding:8px;border-bottom:1px solid var(--line);font-weight:700">📚 الصف الخامس والسادس</td>'
    +'<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="color" id="hSubColor" value="'+hdrSubColor+'" style="width:60px;height:32px;margin:0;padding:2px"></td>'
    +'<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="number" id="hSubSize" value="'+hdrSubSize+'" min="10" max="30" style="width:80px;margin:0"></td></tr>'
    
    +'<tr><td style="padding:8px;border-bottom:1px solid var(--line);font-weight:700">📅 العام الدراسي</td>'
    +'<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="color" id="hYearColor" value="'+hdrYearColor+'" style="width:60px;height:32px;margin:0;padding:2px"></td>'
    +'<td style="padding:8px;border-bottom:1px solid var(--line)"><input type="number" id="hYearSize" value="'+hdrYearSize+'" min="10" max="24" style="width:80px;margin:0"></td></tr>'
    
    +'<tr><td style="padding:8px;font-weight:700">🖼️ حجم الشعار</td>'    +'<td style="padding:8px;color:var(--mut);font-size:12px" colspan="2">الحجم بالبكسل (العرض = الارتفاع)</td>'
    +'</tr>'
    +'<tr><td></td><td colspan="2" style="padding:4px 8px"><input type="number" id="hLogoSize" value="'+hdrLogoSize+'" min="50" max="200" style="width:100px;margin:0"></td></tr>'
    
    +'</table>'
    +'<div class="grid2" style="margin-top:10px">'
    +'<button class="btn ok" style="background:linear-gradient(135deg,#7C3AED,#A78BFA)" onclick="saveHeaderCfg()">💾 حفظ التخصيصات</button>'
    +'<button class="btn ghost" onclick="resetHeaderCfg()">🔄 استعادة الافتراضي</button>'
    +'</div>'
    +'</div>';

  var hasSecond=ADM.res.second&&ADM.res.second.rows&&ADM.res.second.rows.length;
  var showForm=ADM.res.showSecondForm;

  var secondCard='';
  if(hasSecond){
    secondCard='<div class="card" style="border-right:5px solid #7E22CE;background:linear-gradient(135deg,#FAF5FF,#F5F3FF)">'
      +'<div class="ct" style="color:#7E22CE;font-size:16px">👥 تم إضافة تلميذ ثاني للورقة</div>'
      +'<div class="cs" style="font-size:14px"><b>'+esc(ADM.res.second.name)+'</b> — '+esc(ADM.res.second.grade)+' '+esc(ADM.res.second.section)+'</div>'
      +'<button class="btn danger" style="margin-top:8px" onclick="removeSecondStudent()">🗑 حذف التلميذ الثاني</button>'
      +'</div>';
  }

  var secondForm='';
  if(!hasSecond&&showForm){
    secondForm='<div class="card" style="border-right:5px solid #7E22CE;background:linear-gradient(135deg,#FAF5FF,#F5F3FF)">'
      +'<div class="ct" style="color:#7E22CE;font-size:16px">➕ إضافة تلميذ ثاني للورقة</div>'
      +'<div class="cs">ابحث عن التلميذ الثاني لإضافته إلى نفس ورقة الطباعة</div>'
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

  var html=settings+hdrSettings+secondCard+secondForm+resultCard(ADM.res.name,ADM.res.grade,ADM.res.section,ADM.res.rows);

  html+='<div class="card" style="border-right:5px solid var(--th);background:linear-gradient(135deg,#EFF6FF,#DBEAFE)">'
    +'<div class="ct" style="color:var(--th);font-size:16px">🖨️ خيارات الطباعة</div>'
    +'<div class="grid3" style="margin-top:10px">'
    +'<button class="btn" style="padding:14px;font-size:14px" onclick="printSingle()">📄 طباعة تلميذ واحد<br><small style="font-size:11px;opacity:.8">ورقة A4 كاملة</small></button>';
  if(hasSecond){
    html+='<button class="btn ok" style="padding:14px;font-size:14px;background:linear-gradient(135deg,#7E22CE,#A78BFA)" onclick="printTwo()">📑 طباعة تلميذين<br><small style="font-size:11px;opacity:.8">في ورقة واحدة</small></button>';  }else{
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

/* ═══ دوال حفظ/استعادة تخصيصات العناوين ═══ */
function saveHeaderCfg(){
  localStorage.setItem('hdr_school_color',$('#hSchoolColor').value);
  localStorage.setItem('hdr_school_size',$('#hSchoolSize').value);
  localStorage.setItem('hdr_title_color',$('#hTitleColor').value);
  localStorage.setItem('hdr_title_size',$('#hTitleSize').value);  localStorage.setItem('hdr_subtitle_color',$('#hSubColor').value);
  localStorage.setItem('hdr_subtitle_size',$('#hSubSize').value);
  localStorage.setItem('hdr_year_color',$('#hYearColor').value);
  localStorage.setItem('hdr_year_size',$('#hYearSize').value);
  localStorage.setItem('hdr_logo_size',$('#hLogoSize').value);
  toast('✓ تم حفظ تخصيصات العناوين','ok');
  renderResults();
}
function resetHeaderCfg(){
  ['hdr_school_color','hdr_school_size','hdr_title_color','hdr_title_size',
   'hdr_subtitle_color','hdr_subtitle_size','hdr_year_color','hdr_year_size','hdr_logo_size']
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

registerPage('res',{
  enter:function(){}
});
