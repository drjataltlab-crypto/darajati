/* ═══ page-students.js — صفحة قوائم التلاميذ ═══ */

function loadStudents(){
  var grade=$('#stCls').value,section=$('#stSec').value;
  api({action:'getStudents',key:key(),cls:grade+' '+section}).then(function(r){
    if(!r.ok){toast(r.error,'err');return;}
    $('#stBox').value=r.names.join('\n');
    $('#stCount').innerHTML='المحفوظون لـ«'+grade+' '+section+'»: <b>'+arNum(r.names.length)+'</b> تلميذًا';
    $('#stList').innerHTML=r.names.length?r.names.map(function(n){return'<span class="chip">'+esc(n)+'</span>';}).join(''):'<span class="hint">لا توجد قائمة محفوظة بعد.</span>';
  }).catch(function(){toast('تعذر الاتصال','err');});
}

function saveStudents(){
  var grade=$('#stCls').value,section=$('#stSec').value;
  var names=$('#stBox').value.split(/\r?\n/).map(function(s){return s.trim();}).filter(Boolean);
  if(!names.length){toast('اكتب اسمًا واحدًا على الأقل','err');return;}
  api({action:'setStudents',key:key(),grade:grade,section:section,names:names}).then(function(r){
    toast(r.ok?'✓ تم حفظ '+arNum(names.length)+' تلميذ':r.error,r.ok?'ok':'err');
    if(r.ok)loadStudents();
  }).catch(function(){toast('تعذر الاتصال','err');});
}

function clearStudents(){
  var grade=$('#stCls').value,section=$('#stSec').value;
  confirmDlg('مسح قائمة «'+grade+' '+section+'» بالكامل؟',function(){
    api({action:'setStudents',key:key(),grade:grade,section:section,names:[]}).then(function(r){
      toast(r.ok?'✓ تم المسح':r.error,r.ok?'ok':'err');
      if(r.ok)loadStudents();
    }).catch(function(){toast('تعذر الاتصال','err');});
  },'مسح قائمة');
}

registerPage('studs',{
  enter:function(){}
});