/* ═══ page-dash.js — النظرة العامة وكشف المعلم ═══ */

function loadDash(silent){
  if(!key())return;
  if(!silent)$('#dashList').innerHTML='<div class="empty">⏳ تحميل...</div>';
  api({action:'adminData',key:key()}).then(function(r){
    if(!r.ok){
      if(/كلمة المرور/.test(r.error)){localStorage.removeItem('d_admin');go('s-login');}
      else if(!silent)toast(r.error,'err');
      return;
    }
    ADM.teachers=r.teachers;
    renderDash();
    if(window.renderTeam)renderTeam();
  }).catch(function(){
    if(!silent)$('#dashList').innerHTML='<div class="empty">⚠️ تعذر الاتصال بالخادم</div>';
  });
}

function renderDash(){
  var list=ADM.teachers.slice().sort(function(a,b){return(b.lastSent||0)-(a.lastSent||0);});
  var opened=ADM.teachers.filter(function(t){return t.lastLogin>0;}).length;
  var sent=ADM.teachers.filter(function(t){return t.sentCount>0;}).length;
  var locked=ADM.teachers.filter(function(t){return t.locked;}).length;
  $('#admSub').textContent=arNum(ADM.teachers.length)+' معلم';
  $('#dashKpi').innerHTML=
    '<div class="k k1"><div class="ic">👥</div><div><b>'+arNum(ADM.teachers.length)+'</b><small>كل المعلمين</small></div></div>'
    +'<div class="k k2"><div class="ic">🟢</div><div><b>'+arNum(opened)+'</b><small>فتحوا حسابهم</small></div></div>'
    +'<div class="k k3"><div class="ic">📤</div><div><b>'+arNum(sent)+'</b><small>أرسلوا درجات</small></div></div>'
    +'<div class="k k4"><div class="ic">🔒</div><div><b>'+arNum(locked)+'</b><small>مقفلون</small></div></div>';
  var box=$('#dashList');
  if(!list.length){box.innerHTML='<div class="empty">لا يوجد معلمون — أضفهم من تبويب «المعلمون»</div>';return;}
  box.innerHTML=list.map(function(t,i){
    var has=t.sentCount>0,openedAcc=t.lastLogin>0;
    return'<div class="tcard" style="--tc:'+AV[i%AV.length]+'">'
      +'<div class="ava" style="background:'+AV[i%AV.length]+'">'+esc((t.name||'؟').charAt(0))+'</div>'
      +'<div class="body" onclick="openTeacher(\''+escA(t.code)+'\')">'
      +'<div class="nm">'+esc(t.name)+' <span class="dot '+(openedAcc?'on':'off')+'" title="'+(openedAcc?'فتح حسابه':'لم يفتح حسابه')+'"></span>'+(t.locked?'<span class="pill lock">🔒 مقفل</span>':'')+' <span class="pill subj">'+esc(t.subject)+'</span></div>'
      +'<div class="sub">'+(t.classes?esc(t.classes):'بدون صفوف')+' • <span class="codechip">'+esc(t.code)+'</span></div>'
      +'<div class="meta">'+(has?('✓ '+arNum(t.sentCount)+' تلميذ — '+ago(t.lastSent)):(openedAcc?'فتح حسابه ولم يرسل':'لم يفتح حسابه بعد'))+'</div>'
      +'</div><div class="acts">'
      +'<div class="r"><button class="ib" title="ملخص النتائج" onclick="showSummary(\''+escA(t.code)+'\')">'+ICONS.summary+'</button><button class="ib" title="طباعة قائمة التلاميذ" onclick="printRoster(\''+escA(t.code)+'\')">'+ICONS.print+'</button><button class="ib" title="قالب Excel للمعلم" onclick="teacherTemplate(\''+escA(t.code)+'\')">'+ICONS.xls+'</button></div>'
      +'<div class="r"><button class="ib" title="تعديل" onclick="openEdit(\''+escA(t.code)+'\')">'+ICONS.edit+'</button><button class="ib" title="قفل/فتح" onclick="toggleLock(\''+escA(t.code)+'\')">'+(t.locked?ICONS.unlock:ICONS.lock)+'</button><button class="ib" title="حذف" onclick="delTeacherCode(\''+escA(t.code)+'\')" style="color:var(--red)">'+ICONS.del+'</button></div>'
      +'</div></div>';
  }).join('');
}

/* ── كشف المعلم ── */
function openTeacher(code){
  var t=ADM.teachers.find(function(x){return x.code===code;});  $('#tvName').textContent=t?t.name:code;
  $('#tvSub').textContent=(t?t.subject+' • ':'')+'كود: '+code;
  $('#tvBox').innerHTML='<div class="empty">⏳ تحميل...</div>';
  go('s-tview');
  api({action:'teacherGrades',key:key(),code:code}).then(function(r){
    if(!r.ok){toast(r.error,'err');return;}
    ADM.tv={code:code,name:t?t.name:code,rows:r.rows};
    renderTView();
  }).catch(function(){$('#tvBox').innerHTML='<div class="empty">⚠️ تعذر الاتصال</div>';});
}
function renderTView(){
  var g={};
  ADM.tv.rows.forEach(function(r){(g[r.cls]=g[r.cls]||[]).push(r);});
  var groups=Object.keys(g).map(function(cls){
    return{cls:cls,rs:g[cls],last:Math.max.apply(null,g[cls].map(function(r){return r.time;}))};
  }).sort(function(a,b){return b.last-a.last;});
  if(!groups.length){$('#tvBox').innerHTML='<div class="empty">لا توجد درجات لهذا المعلم بعد</div>';return;}
  function td(v){return(v===null||v==='')?'<td class="none">—</td>':'<td>'+arNum(v)+'</td>';}
  $('#tvBox').innerHTML=groups.map(function(gr){
    return'<div class="card"><div class="ghead"><b>🏫 '+esc(gr.cls)+' — '+esc(gr.rs[0].subject)+'</b><span>👥 '+arNum(gr.rs.length)+' تلميذ • '+fmtDate(gr.last)+'</span></div><div class="tbl"><table class="pt"><tr><th>#</th><th>الاسم</th><th class="enter">ت١</th><th class="enter">ت٢</th><th class="enter">ك١</th><th class="calc">معدل ف١</th><th class="enter">آذار</th><th class="enter">نيسان</th><th class="calc">معدل ف٢</th><th class="admin">نصف</th><th class="admin">السعي</th><th class="admin">نهاية</th><th class="fin">النهائية</th></tr>'
    +gr.rs.map(function(r,i){
      return'<tr><td>'+arNum(i+1)+'</td><td class="nm">'+esc(r.name)+'</td>'+td(r.m1)+td(r.m2)+td(r.m3)+'<td class="pass">'+arNum(r.a1)+'</td>'+td(r.m4)+td(r.m5)+'<td class="pass">'+arNum(r.a2)+'</td>'+td(r.half)+td(r.annual)+td(r.exam)+'<td class="'+(r.final!==null&&r.final!==undefined?(r.final>=(r.max||100)/2?'pass':'fail'):'none')+'">'+arNum(r.final)+'</td></tr>';
    }).join('')+'</table></div></div>';
  }).join('');
  ADM.tv.printHtml='<h2>كشف درجات: '+esc(ADM.tv.name)+'</h2>'+groups.map(function(gr){return'<h3>'+esc(gr.cls)+'</h3>'+resultTable(gr.rs);}).join('');
}
function printTView(){
  if(!ADM.tv||!ADM.tv.printHtml){toast('لا توجد درجات','err');return;}
  printWin(ADM.tv.printHtml);
}

/* ── ملخص النتائج ── */
function showSummary(code){
  var t=ADM.teachers.find(function(x){return x.code===code;});
  toast('⏳ حساب الملخص...','');
  api({action:'teacherGrades',key:key(),code:code}).then(function(r){
    if(!r.ok){toast(r.error,'err');return;}
    var per={};
    r.rows.forEach(function(row){
      var k=row.cls+'¦'+row.name;
      if(!per[k])per[k]={name:row.name,max:row.max,val:null};
      var v=(row.final!==null&&row.final!==undefined)?row.final:((row.annual!==null&&row.annual!==undefined)?row.annual:null);
      if(v!==null)per[k].val=v;
    });
    var list=Object.keys(per).map(function(k){return per[k];});
    var graded=list.filter(function(s){return s.val!==null;});
    var pass=graded.filter(function(s){return s.val>=s.max/2;});
    var fail=graded.filter(function(s){return s.val<s.max/2;});
    var pct=graded.length?Math.round(pass.length/graded.length*100):0;
    $('#sumBox').innerHTML='<div class="sumbox"><div class="pct">'+arNum(pct)+'٪</div><small>نسبة النجاح — '+esc(t?t.name:code)+' ('+esc(t?t.subject:'')+")</small></div>"      +'<div class="sumcols"><div class="sc2 g"><b>'+arNum(pass.length)+'</b>ناجحون</div><div class="sc2 r"><b>'+arNum(fail.length)+'</b>راسبون</div></div>'
      +'<label class="label">✅ الناجحون</label><div class="chips">'+(pass.length?pass.map(function(s){return'<span class="chip g">'+esc(s.name)+'</span>';}).join(''):'<span class="hint">لا أحد</span>')+'</div>'
      +'<label class="label">❌ الراسبون</label><div class="chips">'+(fail.length?fail.map(function(s){return'<span class="chip r">'+esc(s.name)+'</span>';}).join(''):'<span class="hint">لا أحد</span>')+'</div>';
    $('#sumModal').classList.add('show');
  }).catch(function(){toast('تعذر الاتصال','err');});
}

/* ── طباعة قائمة تلاميذ فارغة ── */
function printRoster(code){
  var t=ADM.teachers.find(function(x){return x.code===code;});
  if(!t||!t.classes||!t.classes.length){toast('لا صفوف مسجلة لهذا المعلم','err');return;}
  var html='<h2>قوائم: '+esc(t.name)+' — '+esc(t.subject)+'</h2>';
  var chain=Promise.resolve();
  t.classes.forEach(function(cls){
    chain=chain.then(function(){
      return api({action:'getStudents',key:key(),cls:cls}).then(function(r){
        var names=r.ok?r.names:[];
        html+='<h3>'+esc(cls)+' ('+arNum(names.length)+')</h3><table style="border-collapse:collapse"><tr><th style="'+TH+'">#</th><th style="'+TH+'">الاسم</th><th style="'+TH1+'">ت١</th><th style="'+TH1+'">ت٢</th><th style="'+TH1+'">ك١</th><th style="'+THC+'">معدل ف١</th><th style="'+TH2+'">آذار</th><th style="'+TH2+'">نيسان</th><th style="'+THC+'">معدل ف٢</th></tr>'
          +names.map(function(n,i){
            return'<tr><td style="'+TD+'">'+arNum(i+1)+'</td><td style="'+TDN+'">'+esc(n)+'</td><td style="'+TD+'">&nbsp;</td><td style="'+TD+'">&nbsp;</td><td style="'+TD+'">&nbsp;</td><td style="'+TD+'">&nbsp;</td><td style="'+TD+'">&nbsp;</td><td style="'+TD+'">&nbsp;</td><td style="'+TD+'">&nbsp;</td></tr>';
          }).join('')+'</table>';
      });
    });
  });
  chain.then(function(){printWin(html);}).catch(function(){toast('تعذر الاتصال','err');});
}

/* ── قالب Excel خاص بمعلم ── */
function teacherTemplate(code){
  var t=ADM.teachers.find(function(x){return x.code===code;});
  if(!t||!t.classes||!t.classes.length){toast('لا صفوف مسجلة لهذا المعلم','err');return;}
  toast('⏳ تجهيز القالب...','');
  var chain=Promise.resolve('');
  t.classes.forEach(function(cls){
    chain=chain.then(function(acc){
      return api({action:'getStudents',key:key(),cls:cls}).then(function(r){
        var names=r.ok?r.names:[];
        return acc+'<h3 style="font-family:Tahoma">'+esc(t.subject)+' — '+esc(cls)+'</h3><table style="border-collapse:collapse"><tr><th style="'+TH+'">#</th><th style="'+TH+'">اسم التلميذ</th><th style="'+TH1+'">ت١</th><th style="'+TH1+'">ت٢</th><th style="'+TH1+'">ك١</th><th style="'+THC+'">معدل ف١</th><th style="'+TH2+'">آذار</th><th style="'+TH2+'">نيسان</th><th style="'+THC+'">معدل ف٢</th></tr>'
          +names.map(function(n,i){
            return'<tr><td style="'+TD+'">'+arNum(i+1)+'</td><td style="'+TDN+'">'+esc(n)+'</td><td style="'+TD+'"></td><td style="'+TD+'"></td><td style="'+TD+'"></td><td style="'+TD+'"></td><td style="'+TD+'"></td><td style="'+TD+'"></td><td style="'+TD+'"></td></tr>';
          }).join('')+'</table><br>';
      });
    });
  });
  chain.then(function(html){
    downloadXLS('قالب-'+t.name,t.subject+' — '+t.name,html);
  }).catch(function(){toast('تعذر الاتصال','err');});
}

registerPage('dash',{  enter:function(){loadDash();},
  silent:function(){loadDash(true);}
});