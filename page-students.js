/* ═══ page-students.js — قوائم التلاميذ لكل صف وشعبة ═══ */

registerPage('studs',{
  enter:function(){
    stInjectImport();
    var box=$('#stBox');
    if(box){box.oninput=stPreview;}
    loadStudents();
  }
});

/* زر الاستيراد يُحقن مرة واحدة فوق صندوق اللصق */
function stInjectImport(){
  if($('#stImportBtn'))return;
  var box=$('#stBox');
  if(!box)return;
  box.insertAdjacentHTML('beforebegin',
    '<div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">'
    +'<button class="btn sm" id="stImportBtn" onclick="stImportFile()">📂 استيراد من ملف</button>'
    +'<button class="btn sm ghost" onclick="toast(\'الصق كل اسم في سطر مستقل داخل الصندوق\',\'\')">❓ طريقة اللصق</button>'
    +'</div>');
}

/* ═══ استيراد ملف txt أو csv ═══ */
function stImportFile(){
  var inp=document.createElement('input');
  inp.type='file';inp.accept='.txt,.csv,text/plain';
  inp.onchange=function(){
    var f=inp.files[0];if(!f)return;
    var r=new FileReader();
    r.onload=function(e){
      var lines=String(e.target.result).split(/\r?\n/)
        .map(function(s){return s.split(/[,،\t;]/)[0].trim();})
        .filter(function(s){return s&&s.toLowerCase()!=='name'&&s!=='الاسم';});
      $('#stBox').value=lines.join('\n');
      stPreview();
      toast('✓ تم استيراد '+arNum(lines.length)+' اسمًا — اضغط حفظ','ok');
    };
    r.readAsText(f,'utf-8');
  };
  inp.click();
}

/* ═══ تحميل القائمة المحفوظة ═══ */
function loadStudents(){
  var cls={grade:$('#stCls').value,section:$('#stSec').value};
  $('#stCount').textContent='⏳ تحميل...';
  api({action:'getStudents',key:key(),cls:cls}).then(function(r){
    var names=(r&&r.names)?r.names:[];
    $('#stBox').value=names.join('\n');
    stPreview();
  }).catch(function(){
    $('#stCount').textContent='⚠️ تعذر الاتصال';
    $('#stList').innerHTML='';
  });
}

/* ═══ معاينة فورية أثناء اللصق ═══ */
function stNames(){
  return $('#stBox').value.split(/\r?\n/)
    .map(function(s){return s.trim();})
    .filter(function(s){return s;});
}
function stPreview(){
  var names=stNames();
  $('#stCount').textContent='👥 عدد التلاميذ: '+arNum(names.length);
  var h='';
  names.forEach(function(n,i){
    h+='<span class="chip">'+arNum(i+1)+') '+esc(n)+'</span>';
  });
  $('#stList').innerHTML=h||'<span class="hint">لا توجد أسماء بعد</span>';
}

/* ═══ حفظ القائمة ═══ */
function saveStudents(){
  var cls={grade:$('#stCls').value,section:$('#stSec').value};
  var names=stNames();
  if(!names.length){toast('القائمة فارغة — الصق أو استورد أولًا','err');return;}
  toast('⏳ حفظ...','');
  api({action:'setStudents',key:key(),cls:cls,names:names}).then(function(r){
    if(r.ok){toast('✓ تم حفظ '+arNum(names.length)+' تلميذ في '+cls.grade+' '+cls.section,'ok');}
    else{toast('❌ '+r.error,'err');}
  }).catch(function(){toast('تعذر الاتصال','err');});
}

/* ═══ مسح الصندوق ═══ */
function clearStudents(){
  confirmDlg('مسح الأسماء من الصندوق؟ (لا يحذف المحفوظ)',function(){
    $('#stBox').value='';
    stPreview();
  },'تأكيد');
}
