/* ═══ page-results.js — صفحة نتائج التلاميذ ═══ */

function searchStudent(){
  var name=$('#rsName').value.trim();
  if(!name){toast('اكتب اسم التلميذ','err');return;}
  var grade=$('#rsGrade').value,section=$('#rsSec').value;
  $('#resBox').innerHTML='<div class="empty">⏳ بحث...</div>';
  api({action:'searchStudent',key:key(),name:name,grade:grade,section:section}).then(function(r){
    if(!r.ok){toast(r.error,'err');$('#resBox').innerHTML='';return;}
    if(!r.rows.length){$('#resBox').innerHTML='<div class="empty">لا توجد درجات مسجلة لهذا التلميذ بعد</div>';return;}
    ADM.res={name:r.rows[0].name,grade:r.rows[0].grade,section:r.rows[0].section,rows:r.rows,second:null};
    renderResults();
  }).catch(function(){$('#resBox').innerHTML='<div class="empty">⚠️ تعذر الاتصال</div>';});
}

function addSecondStudent(){
  var name=prompt('اكتب اسم التلميذ الثاني الذي تريد طباعته معه في ورقة واحدة:');
  if(!name||!name.trim())return;
  var grade=$('#rsGrade').value,section=$('#rsSec').value;
  toast('⏳ بحث عن التلميذ الثاني...','');
  api({action:'searchStudent',key:key(),name:name.trim(),grade:grade,section:section}).then(function(r){
    if(!r.ok||!r.rows.length){toast('❌ لم يُعثر على التلميذ الثاني','err');return;}
    ADM.res.second={name:r.rows[0].name,grade:r.rows[0].grade,section:r.rows[0].section,rows:r.rows};
    toast('✓ تم إضافة التلميذ الثاني','ok');
    renderResults();
  }).catch(function(){toast('تعذر الاتصال','err');});
}

function removeSecondStudent(){
  ADM.res.second=null;
  renderResults();
}

function renderResults(){
  var schoolName=localStorage.getItem('school_name')||'';
  var schoolLogo=localStorage.getItem('school_logo')||'';
  var guideName=localStorage.getItem('guide_name')||'';
  var principalName=localStorage.getItem('principal_name')||'';
  var studyYear=localStorage.getItem('study_year')||'٢٠٢٥ - ٢٠٢٦';

  var settings='<div class="card" style="border-right:5px solid var(--th)">'
    +'<div class="ct">🏫 بيانات المدرسة (تظهر في بطاقة الطباعة)</div>'
    +'<div class="cs">هذه البيانات تُحفظ محليًا على جهازك فقط</div>'
    +'<div class="grid2">'
    +'<div><label class="label">اسم المدرسة</label>'
    +'<input id="setName" placeholder="مثال: مدرسة المنهل الابتدائية" value="'+escA(schoolName)+'"></div>'
    +'<div><label class="label">العام الدراسي</label>'
    +'<input id="setYear" placeholder="مثال: ٢٠٢٥ - ٢٠٢٦" value="'+escA(studyYear)+'"></div>'
    +'<div><label class="label">شعار المدرسة (صورة)</label>'
    +'<div style="display:flex;gap:8px;align-items:center">'    +(schoolLogo?'<img src="'+schoolLogo+'" style="width:50px;height:50px;object-fit:contain;border:1px solid var(--line);border-radius:8px">':'<div style="width:50px;height:50px;background:#F1F5F9;border:1px dashed var(--line);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:11px">لا يوجد</div>')
    +'<button class="btn sm" onclick="pickSchoolLogo()">📷 اختر</button>'
    +(schoolLogo?'<button class="btn sm danger" onclick="clearSchoolLogo()">🗑</button>':'')
    +'</div></div>'
    +'<div><label class="label">اسم مرشد الصف</label>'
    +'<input id="setGuide" placeholder="مثال: أحمد حسن" value="'+escA(guideName)+'"></div>'
    +'<div style="grid-column:span 2"><label class="label">اسم مدير المدرسة</label>'
    +'<input id="setPrincipal" placeholder="مثال: أحمد حسن" value="'+escA(principalName)+'"></div>'
    +'</div>'
    +'<button class="btn ok" style="margin-top:10px" onclick="saveSchoolInfo()">💾 حفظ البيانات</button>'
    +'</div>';

  var hasSecond=ADM.res.second&&ADM.res.second.rows&&ADM.res.second.rows.length;

  var secondCard='';
  if(hasSecond){
    secondCard='<div class="card" style="border-right:5px solid #B45309">'
      +'<div class="ct">👥 تلميذان في ورقة واحدة — التلميذ الثاني</div>'
      +'<div class="cs">'+esc(ADM.res.second.name)+' — '+esc(ADM.res.second.grade)+' '+esc(ADM.res.second.section)+'</div>'
      +'<button class="btn danger" onclick="removeSecondStudent()">🗑 حذف التلميذ الثاني</button>'
      +'</div>';
  }

  var printOpts=hasSecond?{compact:true,secondRows:ADM.res.second.rows}:{};
  var html=settings+secondCard+resultCard(ADM.res.name,ADM.res.grade,ADM.res.section,ADM.res.rows);

  html+='<div class="grid3" style="margin-top:12px">'
    +'<button class="btn" onclick="printSingle()">🖨️ طباعة تلميذ واحد (A4)</button>'
    +(hasSecond?'<button class="btn ok" onclick="printTwo()">📄 طباعة تلميذين في ورقة</button>':'<button class="btn ghost" onclick="addSecondStudent()">➕ أضف تلميذ ثاني للورقة</button>')
    +'<button class="btn ok" onclick="excelResults()">⬇️ تنزيل Excel</button>'
    +'</div>';
  $('#resBox').innerHTML=html;
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
}function clearSchoolLogo(){
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
