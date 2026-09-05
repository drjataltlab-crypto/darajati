/* ═══ page-results.js — صفحة نتائج التلاميذ ═══ */

function searchStudent(){
  var name=$('#rsName').value.trim();
  if(!name){toast('اكتب اسم التلميذ','err');return;}
  var grade=$('#rsGrade').value,section=$('#rsSec').value;
  $('#resBox').innerHTML='<div class="empty">⏳ بحث...</div>';
  api({action:'searchStudent',key:key(),name:name,grade:grade,section:section}).then(function(r){
    if(!r.ok){toast(r.error,'err');$('#resBox').innerHTML='';return;}
    if(!r.rows.length){$('#resBox').innerHTML='<div class="empty">لا توجد درجات مسجلة لهذا التلميذ بعد</div>';return;}
    ADM.res={name:r.rows[0].name,grade:r.rows[0].grade,section:r.rows[0].section,rows:r.rows};
    renderResults();
  }).catch(function(){$('#resBox').innerHTML='<div class="empty">⚠️ تعذر الاتصال</div>';});
}

function renderResults(){
  var html=resultCard(ADM.res.name,ADM.res.grade,ADM.res.section,ADM.res.rows);
  html+='<div class="grid2"><button class="btn" onclick="printResults()">🖨️ طباعة النتيجة</button>'
    +'<button class="btn ok" onclick="excelResults()">⬇️ تنزيل Excel</button></div>';
  $('#resBox').innerHTML=html;
}

function printResults(){
  if(!ADM.res){toast('اعرض النتيجة أولًا','err');return;}
  printWin('<h2>بطاقة نتيجة: '+esc(ADM.res.name)+' — '+esc(ADM.res.grade||'')+' '+esc(ADM.res.section||'')+'</h2>'+resultTable(ADM.res.rows));
}

function excelResults(){
  if(!ADM.res){toast('اعرض النتيجة أولًا','err');return;}
  downloadXLS('نتيجة-'+ADM.res.name,'بطاقة نتيجة: '+ADM.res.name+' — السنة '+YEAR,resultTable(ADM.res.rows));
}

registerPage('res',{
  enter:function(){}
});