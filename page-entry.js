/* ═══ page-entry.js — صفحة إدخال درجات الإدارة ═══ */

function parseClsE(cls){
  cls=String(cls).trim();
  var i=cls.lastIndexOf(' ');
  if(i===-1)return{grade:cls,section:''};
  return{grade:cls.slice(0,i),section:cls.slice(i+1)};
}

function populateEntryClasses(){
  var sel=$('#enCls');
  var classes={};
  (ADM.teachers||[]).forEach(function(t){
    (t.classes||'').split(/[,،]/).map(function(s){return s.trim();}).filter(Boolean).forEach(function(c){classes[c]=1;});
  });
  sel.innerHTML='<option value="">اختر الصف...</option>'+Object.keys(classes).map(function(c){return'<option>'+c+'</option>';}).join('');
}

function loadEntry(){
  var cls=$('#enCls').value.trim();
  if(!cls){toast('اختر الصف أولًا','err');return;}
  toast('⏳ تحميل الدرجات...','');
  api({action:'allGrades',key:key()}).then(function(r){
    if(!r.ok){toast(r.error,'err');return;}
    var p=parseClsE(cls);
    var filtered=r.rows.filter(function(row){return row.grade===p.grade&&row.section===p.section;});
    if(!filtered.length){$('#entryBox').innerHTML='<div class="empty">لا توجد درجات مرسلة لهذا الصف بعد</div>';return;}
    var bySub={};
    filtered.forEach(function(row){(bySub[row.subject]=bySub[row.subject]||[]).push(row);});
    var html='<div class="card"><div class="ct">✍️ '+esc(cls)+' — '+arNum(filtered.length)+' تلميذ</div><div class="cs">الأعمدة البنفسجية تُدخلها الإدارة — احفظ كل مادة بعد التعديل.</div></div>';
    var idx=0;
    Object.keys(bySub).forEach(function(sub){
      var rows=bySub[sub];var i=idx;idx++;
      html+='<div class="card"><div class="ghead"><b>📚 '+esc(sub)+'</b><span>'+arNum(rows.length)+' تلميذ</span></div>'
        +'<div class="tbl"><table class="pt" id="enTbl_'+i+'"><tr><th>#</th><th>الاسم</th><th class="enter">ت١</th><th class="enter">ت٢</th><th class="enter">ك١</th><th class="calc">معدل ف١</th><th class="enter">آذار</th><th class="enter">نيسان</th><th class="calc">معدل ف٢</th><th class="admin">نصف</th><th class="admin">السعي</th><th class="admin">نهاية</th><th class="fin">النهائية</th></tr>';
      rows.forEach(function(r,j){
        html+='<tr data-name="'+escA(r.name)+'"><td>'+arNum(j+1)+'</td><td class="nm">'+esc(r.name)+'</td>'
          +'<td>'+arNum(r.m1)+'</td><td>'+arNum(r.m2)+'</td><td>'+arNum(r.m3)+'</td><td>'+arNum(r.a1)+'</td>'
          +'<td>'+arNum(r.m4)+'</td><td>'+arNum(r.m5)+'</td><td>'+arNum(r.a2)+'</td>'
          +'<td><input class="admin-i" type="number" data-k="half" value="'+(r.half===null||r.half===undefined?'':r.half)+'"></td>'
          +'<td><input class="admin-i" type="number" data-k="annual" value="'+(r.annual===null||r.annual===undefined?'':r.annual)+'"></td>'
          +'<td><input class="admin-i" type="number" data-k="exam" value="'+(r.exam===null||r.exam===undefined?'':r.exam)+'"></td>'
          +'<td><input class="admin-i" type="number" data-k="final" value="'+(r.final===null||r.final===undefined?'':r.final)+'"></td></tr>';
      });
      html+='</table></div><button class="btn ok" style="margin-top:10px" onclick="saveEntry('+i+',\''+escA(sub)+'\')">💾 حفظ درجات '+esc(sub)+'</button></div>';
    });
    $('#entryBox').innerHTML=html;
  }).catch(function(){toast('تعذر الاتصال','err');});
}

function saveEntry(i,sub){
  var table=$('#enTbl_'+i);
  if(!table){toast('حمّل الصف أولًا','err');return;}
  var rows=[];
  table.querySelectorAll('tr[data-name]').forEach(function(tr){
    var row={name:tr.dataset.name};
    tr.querySelectorAll('input.admin-i').forEach(function(inp){
      var v=inp.value.trim();
      row[inp.dataset.k]=v===''?null:Number(v);
    });
    rows.push(row);
  });
  toast('⏳ حفظ...','');
  api({action:'adminSubmit',key:key(),cls:$('#enCls').value,rows:rows}).then(function(r){
    toast(r.ok?'✓ تم حفظ '+arNum(r.updated)+' درجة في '+sub:r.error,r.ok?'ok':'err');
  }).catch(function(){toast('تعذر الاتصال','err');});
}

registerPage('entry',{
  enter:function(){populateEntryClasses();}
});