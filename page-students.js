/* ═══ page-students.js — قوائم التلاميذ الاحترافية ═══ */

var ST={grade:'',section:'',names:[]};

registerPage('studs',{
  enter:function(){
    ST={grade:'',section:'',names:[]};
    stRenderSelect();
  }
});

/* ═══ المسودة التلقائية (لمنع ضياع الأسماء) ═══ */
function stKey(){return 'st_draft_'+ST.grade+'_'+ST.section;}
function stSaveDraft(){
  if(!ST.grade||!ST.section)return;
  localStorage.setItem(stKey(),JSON.stringify(ST.names));
  localStorage.setItem('st_last_grade',ST.grade);
  localStorage.setItem('st_last_section',ST.section);
}
function stLoadDraft(){
  try{var d=localStorage.getItem(stKey());return d?JSON.parse(d):null;}catch(e){return null;}
}
function stClearDraft(){localStorage.removeItem(stKey());}

/* ═══ الخطوة ١: اختيار الصف والشعبة ═══ */
function stRenderSelect(){
  var box=$('#studsBox');
  if(!box)return;
  var lg=localStorage.getItem('st_last_grade')||'';
  var ls=localStorage.getItem('st_last_section')||'';
  box.innerHTML=
    '<div class="card" style="border-right:5px solid var(--th)">'
    +'<div class="ct" style="color:var(--th)">🎓 اختر الصف والشعبة</div>'
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

function stLoad(){
  var box=$('#studsBox');
  if(box)box.innerHTML='<div class="empty">⏳ تحميل القائمة...</div>';
  api({action:'getStudents',key:key(),cls:{grade:ST.grade,section:ST.section}}).then(function(r){
    ST.names=(r&&r.names)?r.names.slice():[];
    var draft=stLoadDraft();
    if(draft&&draft.length&&JSON.stringify(draft)!==JSON.stringify(ST.names)){
      ST.names=draft;
      toast('⚠️ وجدت قائمة غير محفوظة — اضغط 💾 حفظ لاعتمادها','');
    }
    stRenderMain();
  }).catch(function(){
    var draft=stLoadDraft();
    ST.names=draft||[];
    stRenderMain();
  });
}

/* ═══ الصفحة الرئيسية للقائمة ═══ */
function stRenderMain(){
  var box=$('#studsBox');
  if(!box)return;
  var h='<div class="card" style="border-right:5px solid var(--th);background:linear-gradient(135deg,#EFF6FF,#DBEAFE)">'
    +'<div class="ct" style="color:var(--th)">🏫 '+esc(ST.grade)+' '+esc(ST.section)+' — '+arNum(ST.names.length)+' تلميذ</div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">'
    +'<button class="btn sm ghost" onclick="stRenderSelect()">↩ تغيير الصف</button>'
    +'<button class="btn sm" onclick="stTogglePaste()">📥 لصق أسماء</button>'
    +'<button class="btn sm" style="background:linear-gradient(135deg,#059669,#10B981)" onclick="stImportFile()">📂 استيراد Excel</button>'
    +'<button class="btn sm" style="background:linear-gradient(135deg,#7C3AED,#A78BFA)" onclick="stSort()">🔤 ترتيب أبجدي</button>'
    +'<button class="btn sm ok" onclick="stSave()">💾 حفظ القائمة</button>'
    +'</div></div>';

  /* لوحة اللصق */
  h+='<div class="card" id="stPasteCard" style="display:none;border-right:5px solid #7C3AED">'
    +'<div class="ct" style="color:#7C3AED">📥 لصق الأسماء — كل اسم في سطر</div>'
    +'<textarea id="stPasteBox" rows="6" placeholder="أحمد محمد&#10;علي حسن"></textarea>'
    +'<div class="grid2">'
    +'<button class="btn" onclick="stApplyPaste(true)">➕ إضافة للقائمة</button>'
    +'<button class="btn ghost" onclick="stApplyPaste(false)">🔄 استبدال القائمة</button>'
    +'</div></div>';

  /* جدول الأسماء */
  h+='<div class="card"><div class="ct">📋 قائمة التلاميذ</div>'
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
    +'<span class="chip" id="stSelCount">المحدد: ٠</span>'
    +'<button class="btn sm danger" onclick="stDelSelected()">🗑 مسح المحدد</button>'
    +'</div></div>';

  box.innerHTML=h;
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
  stSaveDraft();
  stRenderMain();
  toast('✓ تم الترتيب أبجديًا — اضغط 💾 حفظ','ok');
}

/* ═══ تعديل اسم ═══ */
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
  stSaveDraft();
  stRenderMain();
  toast('✓ تم التعديل — اضغط 💾 حفظ','ok');
}

/* ═══ حذف فردي / جماعي ═══ */
function stDel(i){
  confirmDlg('حذف الاسم: '+ST.names[i]+' ؟',function(){
    ST.names.splice(i,1);
    stSaveDraft();
    stRenderMain();
    toast('✓ تم الحذف — اضغط 💾 حفظ','ok');
  },'تأكيد');
}
function stDelSelected(){
  var idx=[];
  $$('.stChk').forEach(function(x){if(x.checked)idx.push(+x.getAttribute('data-i'));});
  if(!idx.length){toast('لم تحدد أي اسم','err');return;}
  confirmDlg('حذف '+arNum(idx.length)+' اسمًا محددًا؟',function(){
    idx.sort(function(a,b){return b-a;});
    idx.forEach(function(i){ST.names.splice(i,1);});
    stSaveDraft();
    stRenderMain();
    toast('✓ تم حذف المحدد — اضغط 💾 حفظ','ok');
  },'تأكيد');
}

/* ═══ اللصق ═══ */
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
  stSaveDraft();
  stRenderMain();
  toast('✓ '+arNum(lines.length)+' اسمًا — اضغط 💾 حفظ','ok');
}

/* ═══ استيراد Excel / CSV / TXT ═══ */
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
        }catch(err){toast('❌ ملف غير صالح','err');}
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
  stSaveDraft();
  stRenderMain();
  toast('✓ تم استيراد '+arNum(lines.length)+' اسمًا — اضغط 💾 حفظ','ok');
}

/* ═══ حفظ القائمة (محفوظ ضد كل الحالات) ═══ */
function stSave(){
  var gEl=$('#stGrade'),sEl=$('#stSection');
  var g=ST.grade||(gEl?gEl.value:'')||localStorage.getItem('st_last_grade')||'';
  var s=ST.section||(sEl?sEl.value:'')||localStorage.getItem('st_last_section')||'';
  if(!g||!s){toast('اختر الصف والشعبة أولًا','err');return;}
  ST.grade=g;ST.section=s;
  if(!ST.names.length){toast('القائمة فارغة — أضف أسماء أولًا','err');return;}
  toast('⏳ حفظ...','');
  api({action:'setStudents',key:key(),cls:{grade:g,section:s},names:ST.names}).then(function(r){
    if(r.ok){
      stClearDraft();
      toast('✓ تم حفظ '+arNum(ST.names.length)+' تلميذ في '+g+' '+s,'ok');
      stRenderMain();
    }
    else{toast('❌ '+r.error,'err');}
  }).catch(function(){toast('تعذر الاتصال — القائمة محفوظة كمسودة','err');});
}
