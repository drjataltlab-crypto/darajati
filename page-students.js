/* ═══ page-students.js — قوائم التلاميذ — الإصدار v8 ═══ */

var ST={grade:'',section:'',names:[]};

registerPage('studs',{
  enter:function(){
    ST={grade:'',section:'',names:[]};
    stRenderSelect();
  }
});

/* ═══ المفاتيح المحلية ═══ */
function stDraftKey(){return 'st_draft_'+ST.grade+'_'+ST.section;}
function stSavedKey(){return 'st_saved_'+ST.grade+'_'+ST.section;}

/* ═══ الحفظ المحلي الدائم (لا يُحذف إلا بالحذف الصريح) ═══ */
function stSaveLocal(){
  if(!ST.grade||!ST.section)return;
  localStorage.setItem(stDraftKey(),JSON.stringify(ST.names));
  localStorage.setItem(stSavedKey(),JSON.stringify(ST.names));
  localStorage.setItem('st_last_grade',ST.grade);
  localStorage.setItem('st_last_section',ST.section);
}

/* ═══ قراءة المسودة (مؤقتة) ═══ */
function stLoadDraft(){
  try{var d=localStorage.getItem(stDraftKey());return d?JSON.parse(d):null;}catch(e){return null;}
}

/* ═══ قراءة الحفظ الدائم ═══ */
function stLoadSaved(){
  try{var d=localStorage.getItem(stSavedKey());return d?JSON.parse(d):null;}catch(e){return null;}
}

/* ═══ مسح المسودة فقط (عند نجاح الحفظ في الخادم) ═══ */
function stClearDraft(){localStorage.removeItem(stDraftKey());}

/* ═══ شاشة الاختيار — زر الصف يبدأ فارغًا ═══ */
function stRenderSelect(){
  var box=$('#studsBox');
  if(!box)return;
  var lg=localStorage.getItem('st_last_grade')||'';
  var ls=localStorage.getItem('st_last_section')||'';
  box.innerHTML=
    '<div class="card" style="border-right:5px solid var(--th)">'
    +'<div class="ct" style="color:var(--th)">🎓 اختر الصف والشعبة <span class="chip g">v8</span></div>'
    +'<div class="cs">بعد الاختيار تُفتح إدارة القائمة تلقائيًا</div>'
    +'<div class="grid2" style="margin-top:10px">'
    +'<select id="stGrade" onchange="stTryLoad()"><option value="">— الصف —</option><option'+(lg==='الخامس'?' selected':'')+'>الخامس</option><option'+(lg==='السادس'?' selected':'')+'>السادس</option></select>'
    +'<select id="stSection" onchange="stTryLoad()"><option value="">— الشعبة —</option><option'+(ls==='أ'?' selected':'')+'>أ</option><option'+(ls==='ب'?' selected':'')+'>ب</option><option'+(ls==='ج'?' selected':'')+'>ج</option></select>'
    +'</div></div>';
}

function stTryLoad(){
  var gEl=$('#stGrade'),sEl=$('#stSection');
  if(!gEl||!sEl)return;
  var g=gEl.value,s=sEl.value;
  if(!g||!s)return;
  ST.grade=g;ST.section=s;
  stLoad();
}

/* ═══ تحميل القائمة: الخادم ← الحفظ المحلي ← المسودة ═══ */
function stLoad(){
  var box=$('#studsBox');
  if(box)box.innerHTML='<div class="empty">⏳ تحميل القائمة...</div>';
  
  api({action:'getStudents',key:key(),cls:{grade:ST.grade,section:ST.section},grade:ST.grade,section:ST.section,clsStr:ST.grade+' '+ST.section}).then(function(r){
    var serverNames=(r&&r.names)?r.names.slice():[];
    
    if(serverNames.length){
      ST.names=serverNames;
      stSaveLocal();
      toast('✓ تم تحميل '+arNum(ST.names.length)+' تلميذ من الخادم','ok');
    }else{
      var saved=stLoadSaved();
      var draft=stLoadDraft();
      if(saved&&saved.length){
        ST.names=saved;
        toast('️ الخادم فارغ — عرض من الحفظ المحلي ('+arNum(ST.names.length)+' تلميذ)','');
      }else if(draft&&draft.length){
        ST.names=draft;
        toast('⚠️ عرض من المسودة المؤقتة ('+arNum(ST.names.length)+' تلميذ)','');
      }else{
        ST.names=[];
      }
    }
    stRenderMain();
  }).catch(function(){
    var saved=stLoadSaved();
    var draft=stLoadDraft();
    ST.names=saved||draft||[];
    if(ST.names.length){
      toast('⚠️ تعذر الاتصال — عرض من الحفظ المحلي ('+arNum(ST.names.length)+' تلميذ)','');
    }
    stRenderMain();
  });
}

/* ═══ الشاشة الرئيسية ═══ */
function stRenderMain(){
  var box=$('#studsBox');
  if(!box)return;
  var h='<div class="card" style="border-right:5px solid var(--th);background:linear-gradient(135deg,#EFF6FF,#DBEAFE)">'
    +'<div class="ct" style="color:var(--th)">🏫 إدارة القائمة <span class="chip g">v8</span> — '+arNum(ST.names.length)+' تلميذ</div>'
    +'<div class="grid2" style="margin:10px 0">'
    +'<select id="stGrade2" onchange="stSwitch()"><option value="">— الصف —</option><option'+(ST.grade==='الخامس'?' selected':'')+'>الخامس</option><option'+(ST.grade==='السادس'?' selected':'')+'>السادس</option></select>'
    +'<select id="stSection2" onchange="stSwitch()"><option value="">— الشعبة —</option><option'+(ST.section==='أ'?' selected':'')+'>أ</option><option'+(ST.section==='ب'?' selected':'')+'>ب</option><option'+(ST.section==='ج'?' selected':'')+'>ج</option></select>'
    +'</div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap">'
    +'<button class="btn sm" onclick="stTogglePaste()">📥 لصق أسماء</button>'
    +'<button class="btn sm" style="background:linear-gradient(135deg,#059669,#10B981)" onclick="stImportFile()">📂 استيراد Excel</button>'
    +'<button class="btn sm" style="background:linear-gradient(135deg,#7C3AED,#A78BFA)" onclick="stSort()">🔤 ترتيب أبجدي</button>'
    +'<button class="btn sm ok" onclick="stSaveWith(\''+escA(ST.grade)+'\',\''+escA(ST.section)+'\')">💾 حفظ القائمة</button>'
    +'</div></div>';

  h+='<div class="card" id="stPasteCard" style="display:none;border-right:5px solid #7C3AED">'
    +'<div class="ct" style="color:#7C3AED">📥 لصق الأسماء — كل اسم في سطر</div>'
    +'<textarea id="stPasteBox" rows="6" placeholder="أحمد محمد&#10;علي حسن"></textarea>'
    +'<div class="grid2">'
    +'<button class="btn" onclick="stApplyPaste(true)">➕ إضافة للقائمة</button>'
    +'<button class="btn ghost" onclick="stApplyPaste(false)">🔄 استبدال القائمة</button>'
    +'</div></div>';

  h+='<div class="card"><div class="ct">📋 قائمة التلاميذ — '+esc(ST.grade)+' '+esc(ST.section)+'</div>'
    +'<div class="tbl"><table class="pt"><thead><tr>'
    +'<th style="width:40px"><input type="checkbox" onclick="stToggleAll(this.checked)" style="width:auto;margin:0"></th>'
    +'<th style="width:56px">ت</th>'
    +'<th>اسم التلميذ</th>'
    +'<th style="width:110px">إجراءات</th>'
    +'</tr></thead><tbody>';
  if(!ST.names.length){
    h+='<tr><td colspan="4" style="padding:24px;text-align:center;color:var(--mut)">لا توجد أسماء — الصق أو استورد ثم اضغط حفظ</td></tr>';
  }
  ST.names.forEach(function(n,i){
    h+='<tr>'
      +'<td style="text-align:center"><input type="checkbox" class="stChk" data-i="'+i+'" onchange="stUpdateCount()" style="width:auto;margin:0"></td>'
      +'<td style="text-align:center;font-weight:800">'+arNum(i+1)+'</td>'
      +'<td class="nm" id="stName_'+i+'">'+esc(n)+'</td>'
      +'<td style="text-align:center;white-space:nowrap">'
      +'<button class="btn sm ghost" onclick="stEdit('+i+')" title="تعديل">✏️</button> '
      +'<button class="btn sm danger" onclick="stDel('+i+')" title="حذف">🗑</button>'
      +'</td></tr>';
  });
  h+='</tbody></table></div>'
    +'<div style="display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap">'
    +'<span class="chip" id="stSelCount">المحدد: </span>'
    +'<button class="btn sm danger" onclick="stDelSelected()">🗑 مسح المحدد</button>'
    +'</div></div>';

  box.innerHTML=h;
}

/* ═══ الحفظ — محلي + خادم ═══ */
function stSaveWith(g,s){
  try{
    g=g||ST.grade||localStorage.getItem('st_last_grade')||'';
    s=s||ST.section||localStorage.getItem('st_last_section')||'';
    if(!g||!s){toast('⚠️ الصف/الشعبة غير محددين','err');return;}
    ST.grade=g;ST.section=s;
    if(!ST.names.length){
      var saved=stLoadSaved();
      var draft=stLoadDraft();
      if(saved&&saved.length){ST.names=saved;}
      else if(draft&&draft.length){ST.names=draft;}
    }
    if(!ST.names.length){toast('القائمة فارغة — أضف أسماء أولًا','err');return;}
    
    /* حفظ محلي دائم أولاً */
    stSaveLocal();
    
    toast('⏳ حفظ...','');
    api({action:'setStudents',key:key(),cls:{grade:g,section:s},grade:g,section:s,clsStr:g+' '+s,names:ST.names}).then(function(r){
      if(r.ok){
        stClearDraft();
        toast('✓ تم حفظ '+arNum(ST.names.length)+' تلميذ في '+g+' '+s,'ok');
      }else{
        toast('⚠️ الحفظ المحلي تم ✓ — الخادم: '+r.error,'');
      }
      stRenderMain();
    }).catch(function(){
      toast('⚠️ الحفظ المحلي تم ✓ — تعذر الاتصال بالخادم','');
      stRenderMain();
    });
  }catch(e){
    toast('خطأ بالحفظ: '+e.message,'err');
  }
}
function stSave(){
  var gEl=$('#stGrade2'),sEl=$('#stSection2');
  stSaveWith(gEl?gEl.value:'',sEl?sEl.value:'');
}

/* ═══ تبديل الصف/الشعبة ══ */
function stSwitch(){
  var gEl=$('#stGrade2'),sEl=$('#stSection2');
  if(!gEl||!sEl)return;
  var g=gEl.value,s=sEl.value;
  if(!g||!s){toast('اختر الصف والشعبة','err');return;}
  if(g===ST.grade&&s===ST.section)return;
  stSaveLocal();
  ST.grade=g;ST.section=s;
  stLoad();
}

/* ═══ التحديد ═══ */
function stUpdateCount(){
  var c=0;
  $$('.stChk').forEach(function(x){if(x.checked)c++;});
  var el=$('#stSelCount');
  if(el)el.textContent='المحدد: '+arNum(c);
}
function stToggleAll(v){
  $$('.stChk').forEach(function(x){x.checked=v;});
  stUpdateCount();
}

/* ═══ الترتيب الأبجدي ═══ */
function stSort(){
  if(!ST.names.length){toast('لا توجد أسماء للترتيب','err');return;}
  ST.names.sort(function(a,b){return a.localeCompare(b,'ar');});
  stSaveLocal();
  stRenderMain();
  toast('✓ تم الترتيب أبجديًا — تم الحفظ تلقائيًا','ok');
}

/* ═══ تعديل / حذف ═══ */
function stEdit(i){
  var cell=$('#stName_'+i);
  if(!cell)return;
  cell.innerHTML='<input id="stEd_'+i+'" value="'+escA(ST.names[i])+'" style="margin:0">'
    +' <button class="btn sm ok" onclick="stEditSave('+i+')">✔</button>';
  var el=$('#stEd_'+i);
  if(el)el.focus();
}
function stEditSave(i){
  var el=$('#stEd_'+i);
  var v=el?el.value.trim():'';
  if(!v){toast('الاسم فارغ','err');return;}
  ST.names[i]=v;
  stSaveLocal();
  stRenderMain();
  toast('✓ تم التعديل والحفظ تلقائيًا','ok');
}
function stDel(i){
  confirmDlg('حذف الاسم: '+ST.names[i]+' ؟',function(){
    ST.names.splice(i,1);
    stSaveLocal();
    stRenderMain();
    toast('✓ تم الحذف والحفظ تلقائيًا','ok');
  },'تأكيد');
}
function stDelSelected(){
  var idx=[];
  $$('.stChk').forEach(function(x){if(x.checked)idx.push(+x.getAttribute('data-i'));});
  if(!idx.length){toast('لم تحدد أي اسم','err');return;}
  confirmDlg('حذف '+arNum(idx.length)+' اسمًا محددًا؟',function(){
    idx.sort(function(a,b){return b-a;});
    idx.forEach(function(i){ST.names.splice(i,1);});
    stSaveLocal();
    stRenderMain();
    toast('✓ تم حذف المحدد والحفظ تلقائيًا','ok');
  },'تأكيد');
}

/* ═══ اللصق — مع حفظ تلقائي ═══ */
function stTogglePaste(){
  var c=$('#stPasteCard');
  if(c)c.style.display=(c.style.display==='none')?'block':'none';
}
function stApplyPaste(add){
  var boxEl=$('#stPasteBox');
  var lines=boxEl?boxEl.value.split(/\r?\n/):[];
  lines=lines.map(function(s){return s.trim();}).filter(Boolean);
  if(!lines.length){toast('لا توجد أسماء في الصندوق','err');return;}
  if(add){ST.names=ST.names.concat(lines);}else{ST.names=lines;}
  stSaveLocal();
  stRenderMain();
  toast('✓ تم لصق '+arNum(lines.length)+' اسمًا وحفظها تلقائيًا','ok');
}

/* ═══ استيراد Excel / CSV / TXT — مع حفظ تلقائي ═══ */
function stEnsureXLSX(cb){
  if(window.XLSX){cb();return;}
  var s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  s.onload=cb;
  s.onerror=function(){toast('تعذر تحميل مكتبة Excel — تحقق من الإنترنت','err');};
  document.head.appendChild(s);
}
function stImportFile(){
  var inp=document.createElement('input');
  inp.type='file';
  inp.accept='.xlsx,.xls,.csv,.txt';
  inp.onchange=function(){
    var f=inp.files[0];if(!f)return;
    if(/\.txt$/i.test(f.name)){
      var rt=new FileReader();
      rt.onload=function(e){stAddNames(String(e.target.result).split(/\r?\n/));};
      rt.readAsText(f,'utf-8');
      return;
    }
    stEnsureXLSX(function(){
      var rb=new FileReader();
      rb.onload=function(e){
        try{
          var wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
          var ws=wb.Sheets[wb.SheetNames[0]];
          var rows=XLSX.utils.sheet_to_json(ws,{header:1});
          var names=[];
          rows.forEach(function(row){
            if(!row||!row.length)return;
            var v=null;
            for(var c=0;c<row.length;c++){
              var cell=row[c];
              if(cell!==null&&cell!==undefined&&String(cell).trim()){v=String(cell).trim();break;}
            }
            if(!v)return;
            if(v==='الاسم'||v==='اسم التلميذ'||v.toLowerCase()==='name')return;
            names.push(v);
          });
          stAddNames(names);
        }catch(err){toast(' ملف غير صالح','err');}
      };
      rb.readAsArrayBuffer(f);
    });
  };
  inp.click();
}
function stAddNames(arr){
  var lines=(Array.isArray(arr)?arr:String(arr).split(/\r?\n/))
    .map(function(s){return String(s||'').trim();})
    .filter(Boolean);
  if(!lines.length){toast('لا توجد أسماء في الملف','err');return;}
  ST.names=ST.names.concat(lines);
  stSaveLocal();
  stRenderMain();
  toast('✓ تم استيراد '+arNum(lines.length)+' اسمًا وحفظها تلقائيًا','ok');
}
