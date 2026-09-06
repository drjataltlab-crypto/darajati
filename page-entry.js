/* ═══ page-entry.js — الإدخال اليدوي بالأزرار والحساب الإلكتروني ═══ */

var ENT={teacher:null,subject:null,cls:null,names:[],rows:[]};

function rnd(x){return Math.round(x);}
function pnum(v){if(v===null||v===undefined||v==='')return null;var n=+v;return isNaN(n)?null:n;}

/* ═══ تحليل صفوف المعلم من نص أو مصفوفة ═══ */
function entParseOne(p){
  p=String(p||'').trim();if(!p)return null;
  var g='';
  if(p.indexOf('الخامس')>-1)g='الخامس';
  else if(p.indexOf('السادس')>-1)g='السادس';
  if(!g)return null;
  var m=p.match(/[أبج]/);
  return {grade:g,section:m?m[0]:''};
}
function entParseClasses(t){
  var out=[];
  if(!t)return out;
  if(Array.isArray(t.classes)){
    t.classes.forEach(function(c){
      if(typeof c==='string'){var o=entParseOne(c);if(o)out.push(o);}
      else if(c&&c.grade){out.push({grade:c.grade,section:c.section||''});}
    });
    return out;
  }
  String(t.classes||'').split(/[,،\n]+/).forEach(function(p){
    var o=entParseOne(p);if(o)out.push(o);
  });
  return out;
}

/* ═══ الحساب الإلكتروني: معدل ف١، ف٢، السعي، النهائية ═══ */
function entCalc(r){
  var n1=[r.m1,r.m2,r.m3].filter(function(v){return v!=null;});
  r.a1=n1.length?rnd(n1.reduce(function(a,b){return a+b;},0)/n1.length):null;
  var n2=[r.m4,r.m5].filter(function(v){return v!=null;});
  r.a2=n2.length?rnd(n2.reduce(function(a,b){return a+b;},0)/n2.length):null;
  r.annual=(r.a1!=null&&r.half!=null&&r.a2!=null)?rnd((r.a1+r.half+r.a2)/3):null;
  r.final=(r.annual!=null&&r.exam!=null)?rnd((r.annual+r.exam)/2):null;
}

registerPage('entry',{
  enter:function(){
    ENT={teacher:null,subject:null,cls:null,names:[],rows:[]};
    if(ADM.teachers&&ADM.teachers.length){entRenderTeachers();}
    else{
      $('#entBox').innerHTML='<div class="empty">⏳ تحميل...</div>';
      api({action:'adminData',key:key()}).then(function(r){
        if(r.ok){ADM.teachers=r.teachers||[];}
        entRenderTeachers();
      }).catch(function(){$('#entBox').innerHTML='<div class="empty">⚠️ تعذر الاتصال</div>';});
    }
  }
});

/* ═══ ١) أزرار المعلمين ═══ */
function entRenderTeachers(){
  var h='<div class="card" style="border-right:5px solid var(--th)">'
    +'<div class="ct" style="color:var(--th)">١) اختر المعلم</div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">';
  ADM.teachers.forEach(function(t){
    h+='<button class="btn ghost" style="width:auto;flex:1;min-width:160px" onclick="entSelectTeacher(\''+escA(t.code)+'\')">👨‍🏫 '+esc(t.name)+'</button>';
  });
  h+='</div></div>';
  $('#entBox').innerHTML=h;
}

/* ═══ ٢) مواد المعلم ═══ */
function entSelectTeacher(code){
  ENT.teacher=null;
  for(var i=0;i<ADM.teachers.length;i++){if(ADM.teachers[i].code===code){ENT.teacher=ADM.teachers[i];break;}}
  if(!ENT.teacher)return;
  ENT.subject=null;ENT.cls=null;ENT.names=[];ENT.rows=[];
  var subs=[];
  if(ENT.teacher.subject)subs.push(ENT.teacher.subject);
  var h='<div class="card" style="border-right:5px solid var(--th)">'
    +'<div class="ct" style="color:var(--th)">١) المعلم: '+esc(ENT.teacher.name)+'</div>'
    +'<button class="btn ghost sm" style="margin-top:6px" onclick="entRenderTeachers()">↩ تغيير المعلم</button>'
    +'</div>';
  h+='<div class="card" style="border-right:5px solid var(--th)">'
    +'<div class="ct" style="color:var(--th)">٢) اختر المادة</div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">';
  subs.forEach(function(s){
    h+='<button class="btn ok" style="width:auto;flex:1;min-width:140px" onclick="entSelectSubject(\''+escA(s)+'\')">📘 '+esc(s)+'</button>';
  });
  h+='</div></div>';
  h+='<div id="entClsCard" style="display:none"></div>';
  h+='<div id="entTableCard"></div>';
  $('#entBox').innerHTML=h;
}

/* ═══ ٣) صفوف المعلم وشعبه ═══ */
function entSelectSubject(s){
  ENT.subject=s;
  ENT.cls=null;ENT.names=[];ENT.rows=[];
  var h='<div class="card" style="border-right:5px solid var(--th)">'
    +'<div class="ct" style="color:var(--th)">٣) اختر الصف والشعبة</div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">';
  var cls=entParseClasses(ENT.teacher);
  if(!cls.length){h+='<div class="hint">لا توجد صفوف مسجلة لهذا المعلم — أضفها من صفحة المعلمين</div>';}
  cls.forEach(function(c){
    var label=(c.grade||'')+' '+(c.section||'');
    h+='<button class="btn" style="width:auto;flex:1;min-width:120px" onclick="entSelectClass(\''+escA(c.grade||'')+'\',\''+escA(c.section||'')+'\')">🏫 '+esc(label)+'</button>';
  });
  h+='</div></div>';
  var card=$('#entClsCard');
  card.style.display='block';
  card.innerHTML=h;
  $('#entTableCard').innerHTML='';
}

/* ═══ ٤) تحميل التلاميذ والدرجات ═══ */
function entSelectClass(g,s){
  ENT.cls={grade:g,section:s};
  $('#entTableCard').innerHTML='<div class="empty">⏳ تحميل التلاميذ والدرجات...</div>';
  Promise.all([
    api({action:'getStudents',key:key(),cls:ENT.cls}),
    api({action:'allGrades',key:key()})
  ]).then(function(rs){
    var names=(rs[0]&&rs[0].names)?rs[0].names:[];
    var all=(rs[1]&&rs[1].rows)?rs[1].rows:[];
    var byName={};
    all.forEach(function(r){
      if(r.subject===ENT.subject&&r.grade===g&&r.section===s){byName[r.name]=r;}
    });
    ENT.names=names;
    ENT.rows=names.map(function(n){
      var r=byName[n]||{};
      var o={name:n,
        m1:pnum(r.m1),m2:pnum(r.m2),m3:pnum(r.m3),
        half:pnum(r.half),m4:pnum(r.m4),m5:pnum(r.m5),
        exam:pnum(r.exam),max:r.max||100};
      entCalc(o);
      if(r.a1!=null&&o.a1==null)o.a1=pnum(r.a1);
      if(r.a2!=null&&o.a2==null)o.a2=pnum(r.a2);
      if(r.annual!=null&&o.annual==null)o.annual=pnum(r.annual);
      if(r.final!=null&&o.final==null)o.final=pnum(r.final);
      return o;
    });
    entRenderTable();
  }).catch(function(){$('#entTableCard').innerHTML='<div class="empty">⚠️ تعذر الاتصال</div>';});
}

/* ═══ ٥) جدول الدرجات ═══ */
function entCell(v){return v==null?'—':arNum(v);}
function entRenderTable(){
  var inp='style="width:52px;border:1.5px solid #93C5FD;border-radius:7px;padding:6px 2px;text-align:center;font-weight:700;background:#EFF6FF;color:#1E40AF;margin:0"';
  var h='<div class="card" style="border-right:5px solid var(--th)">'
    +'<div class="ct" style="color:var(--th)">📊 '+esc(ENT.subject)+' — '+esc(ENT.cls.grade)+' '+esc(ENT.cls.section)+'</div>'
    +'<div class="cs">الأعمدة الذهبية تُحسب تلقائيًا — اكتب الدرجات في الخانات الزرقاء فقط</div>'
    +'<div class="tbl"><table class="pt"><thead><tr>'
    +'<th>ت</th><th>التلميذ</th><th class="enter">ت١</th><th class="enter">ت٢</th><th class="enter">ك١</th>'
    +'<th class="calc">معدل ف١</th><th class="enter">نصف السنة</th><th class="enter">آذار</th><th class="enter">نيسان</th>'
    +'<th class="calc">معدل ف٢</th><th class="calc">السعي السنوي</th><th class="enter">نهاية السنة</th><th class="fin">النهائية</th>'
    +'</tr></thead><tbody>';
  ENT.rows.forEach(function(r,i){
    h+='<tr>'
      +'<td>'+arNum(i+1)+'</td>'
      +'<td class="nm">'+esc(r.name)+'</td>'
      +'<td><input type="number" '+inp+' id="e_m1_'+i+'" value="'+(r.m1==null?'':r.m1)+'" oninput="entUpd('+i+',\'m1\',this.value)"></td>'
      +'<td><input type="number" '+inp+' id="e_m2_'+i+'" value="'+(r.m2==null?'':r.m2)+'" oninput="entUpd('+i+',\'m2\',this.value)"></td>'
      +'<td><input type="number" '+inp+' id="e_m3_'+i+'" value="'+(r.m3==null?'':r.m3)+'" oninput="entUpd('+i+',\'m3\',this.value)"></td>'
      +'<td class="pass" id="e_a1_'+i+'">'+entCell(r.a1)+'</td>'
      +'<td><input type="number" '+inp+' id="e_half_'+i+'" value="'+(r.half==null?'':r.half)+'" oninput="entUpd('+i+',\'half\',this.value)"></td>'
      +'<td><input type="number" '+inp+' id="e_m4_'+i+'" value="'+(r.m4==null?'':r.m4)+'" oninput="entUpd('+i+',\'m4\',this.value)"></td>'
      +'<td><input type="number" '+inp+' id="e_m5_'+i+'" value="'+(r.m5==null?'':r.m5)+'" oninput="entUpd('+i+',\'m5\',this.value)"></td>'
      +'<td class="pass" id="e_a2_'+i+'">'+entCell(r.a2)+'</td>'
      +'<td class="pass" id="e_an_'+i+'">'+entCell(r.annual)+'</td>'
      +'<td><input type="number" '+inp+' id="e_exam_'+i+'" value="'+(r.exam==null?'':r.exam)+'" oninput="entUpd('+i+',\'exam\',this.value)"></td>'
      +'<td class="pass" id="e_fin_'+i+'">'+entCell(r.final)+'</td>'
      +'</tr>';
  });
  h+='</tbody></table></div>'
    +'<div class="grid3" style="margin-top:12px">'
    +'<button class="btn ok" onclick="entSave()">💾 حفظ الدرجات</button>'
    +'<button class="btn" onclick="entPrint()">🖨️ طباعة المادة</button>'
    +'<button class="btn ok" style="background:linear-gradient(135deg,#059669,#10B981)" onclick="entExcel()">⬇️ Excel للمادة</button>'
    +'</div></div>';
  $('#entTableCard').innerHTML=h;
}

function entUpd(i,f,v){
  ENT.rows[i][f]=pnum(v);
  entCalc(ENT.rows[i]);
  var r=ENT.rows[i];
  $('#e_a1_'+i).textContent=entCell(r.a1);
  $('#e_a2_'+i).textContent=entCell(r.a2);
  $('#e_an_'+i).textContent=entCell(r.annual);
  $('#e_fin_'+i).textContent=entCell(r.final);
}

/* ═══ حفظ ═══ */
function entSave(){
  if(!ENT.cls||!ENT.subject){toast('اختر المادة والصف أولًا','err');return;}
  var rows=ENT.rows.map(function(r){
    return {name:r.name,subject:ENT.subject,
      m1:r.m1,m2:r.m2,m3:r.m3,half:r.half,m4:r.m4,m5:r.m5,
      a1:r.a1,a2:r.a2,annual:r.annual,exam:r.exam,final:r.final,max:r.max||100};
  });
  toast('⏳ حفظ...','');
  api({action:'adminSubmit',key:key(),cls:ENT.cls,rows:rows}).then(function(r){
    if(r.ok){toast('✓ تم حفظ درجات '+ENT.subject,'ok');}
    else{toast('❌ '+r.error,'err');}
  }).catch(function(){toast('تعذر الاتصال','err');});
}

/* ═══ كشف الطباعة/Excel بنفس التصميم ═══ */
function entPrintHTML(){
  var B='1px solid #0F172A';
  var th='border:'+B+';background:linear-gradient(135deg,#1E40AF,#2563EB);color:#fff;padding:6px 4px;font-size:11px;font-weight:bold;text-align:center';
  var thC='border:'+B+';background:linear-gradient(135deg,#B45309,#D97706);color:#fff;padding:6px 4px;font-size:11px;font-weight:bold;text-align:center';
  var thF='border:'+B+';background:linear-gradient(135deg,#BE123C,#E11D48);color:#fff;padding:6px 4px;font-size:11px;font-weight:bold;text-align:center';
  var td='border:'+B+';padding:6px 4px;text-align:center;font-size:12px;background:#fff';
  var schoolName=localStorage.getItem('school_name')||'مدرسة المنهل الابتدائية';
  var h='<div style="font-family:Tajawal,Arial,sans-serif;width:190mm;margin:0 auto;box-sizing:border-box">';
  h+='<div style="text-align:center;font-weight:900;font-size:20px;color:#1E40AF;border-bottom:3px double #1E40AF;padding-bottom:8px;margin-bottom:12px">'
    +esc(schoolName)+' — كشف درجات '+esc(ENT.subject)+'<br>'
    +'<span style="font-size:14px;color:#B45309">الصف: '+esc(ENT.cls.grade)+' '+esc(ENT.cls.section)+' — العام الدراسي '+esc(getStudyYear())+'</span></div>';
  h+='<table style="width:100%;border-collapse:collapse;border:2px solid #0F172A"><thead><tr>'
    +'<th style="'+th+'">ت</th><th style="'+th+'">التلميذ</th><th style="'+th+'">ت١</th><th style="'+th+'">ت٢</th><th style="'+th+'">ك١</th>'
    +'<th style="'+thC+'">معدل ف١</th><th style="'+th+'">نصف السنة</th><th style="'+th+'">آذار</th><th style="'+th+'">نيسان</th>'
    +'<th style="'+thC+'">معدل ف٢</th><th style="'+thC+'">السعي السنوي</th><th style="'+th+'">نهاية السنة</th><th style="'+thF+'">النهائية</th>'
    +'</tr></thead><tbody>';
  ENT.rows.forEach(function(r,i){
    h+='<tr><td style="'+td+'">'+arNum(i+1)+'</td>'
      +'<td style="'+td+';text-align:right;font-weight:bold">'+esc(r.name)+'</td>'
      +'<td style="'+td+'">'+entCell(r.m1)+'</td><td style="'+td+'">'+entCell(r.m2)+'</td><td style="'+td+'">'+entCell(r.m3)+'</td>'
      +'<td style="'+td+';background:#FEF3C7;font-weight:bold">'+entCell(r.a1)+'</td>'
      +'<td style="'+td+'">'+entCell(r.half)+'</td><td style="'+td+'">'+entCell(r.m4)+'</td><td style="'+td+'">'+entCell(r.m5)+'</td>'
      +'<td style="'+td+';background:#FEF3C7;font-weight:bold">'+entCell(r.a2)+'</td>'
      +'<td style="'+td+';background:#FEF3C7;font-weight:bold">'+entCell(r.annual)+'</td>'
      +'<td style="'+td+'">'+entCell(r.exam)+'</td>'
      +'<td style="'+td+';background:#D1FAE5;font-weight:bold;color:#047857">'+entCell(r.final)+'</td></tr>';
  });
  h+='</tbody></table></div>';
  return h;
}
function entPrint(){
  if(!ENT.rows.length){toast('لا توجد درجات للطباعة','err');return;}
  printWin(entPrintHTML());
}
function entExcel(){
  if(!ENT.rows.length){toast('لا توجد درجات للتصدير','err');return;}
  downloadXLS('درجات-'+ENT.subject+'-'+ENT.cls.grade+ENT.cls.section,
    'كشف درجات '+ENT.subject+' — '+ENT.cls.grade+' '+ENT.cls.section+' — '+getStudyYear(),
    entPrintHTML());
}
