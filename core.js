/* ═══ core.js — الأساس المشترك ═══ */
window.addEventListener('error',function(e){var d=document.getElementById('errbar');if(d){d.style.display='block';d.textContent='ERROR line '+e.lineno+': '+e.message;}});

var SUBJECTS=['التربية الإسلامية','اللغة العربية','اللغة الانكليزية','الرياضيات','الاجتماعيات','العلوم','الفنية','الرياضة'];
var AR='٠١٢٣٤٥٦٧٨٩';

var THEMES={
  dash:['#1D4ED8','#DBEAFE'],res:['#B45309','#FDE68A'],team:['#047857','#A7F3D0'],
  entry:['#7E22CE','#DDD6FE'],studs:['#0E7490','#A5F3FC'],keys:['#BE123C','#FECDD3'],set:['#475569','#E2E8F0']
};
var AV=['#1D4ED8','#7E22CE','#047857','#B45309','#BE123C','#0E7490','#DB2777','#65A30D'];
var Pages={};
var ADM={teachers:[],tv:null,res:null};
var ROLE='',toastT,_yes=null;

function arNum(x){if(x===null||x===undefined||x==='')return'—';return String(x).replace(/\d/g,function(d){return AR[d];});}
function $(s){return document.querySelector(s);}
function $$(s){return document.querySelectorAll(s);}
function url(){return localStorage.getItem('d_url')||(typeof SERVER_URL!=='undefined'?SERVER_URL:'');}
function key(){return localStorage.getItem('d_key')||'';}
function registerPage(id,obj){Pages[id]=obj;}
function go(id){$$('.screen').forEach(function(s){s.classList.remove('active');});$('#'+id).classList.add('active');}
function toast(m,t){var e=$('#toast');e.textContent=m;e.className='toast show'+(t==='err'?' err':t==='ok'?' ok':'');clearTimeout(toastT);toastT=setTimeout(function(){e.className='toast';},3200);}
function hideModal(id){$('#'+id).classList.remove('show');}
function confirmDlg(m,f,t){$('#cfTitle').textContent=t||'تأكيد';$('#cfMsg').textContent=m;_yes=f;$('#confirmOvl').classList.add('show');}
function confirmYes(){hideModal('confirmOvl');if(_yes)_yes();_yes=null;}
function esc(s){return String(s===null||s===undefined?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function escA(s){return esc(s).replace(/"/g,'&quot;');}
function ago(ms){if(!ms)return'';var s=Math.floor((Date.now()-ms)/1000);if(s<60)return'الآن';var m=Math.floor(s/60);if(m<60)return'قبل '+arNum(m)+' د';var h=Math.floor(m/60);if(h<24)return'قبل '+arNum(h)+' س';var d=Math.floor(h/24);return d<30?'قبل '+arNum(d)+' يوم':new Date(ms).toLocaleDateString('ar');}
function fmtDate(ms){return new Date(ms).toLocaleString('ar',{dateStyle:'medium',timeStyle:'short'});}
function copyText(s){if(navigator.clipboard){navigator.clipboard.writeText(s).then(function(){toast('✓ تم النسخ','ok');});}else{var ta=document.createElement('textarea');ta.value=s;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('✓ تم النسخ','ok');}}
function shareWa(code,name){window.open('https://wa.me/?text='+encodeURIComponent('مرحباً '+(name||'أستاذي')+' 👋\nكودك في تطبيق «درجاتي»:\n\n🔑 '+code+'\n\nثبّت التطبيق وأدخل هذا الكود.'),'_blank');}
function api(p,ms){
  if(!url())return Promise.reject(new Error('no-url'));
  var c=new AbortController();var t=setTimeout(function(){c.abort();},ms||30000);
  return fetch(url(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(p),signal:c.signal})
    .then(function(r){return r.json();}).finally(function(){clearTimeout(t);});
}

function getStudyYear(){return localStorage.getItem('study_year')||'٢٠٢٥ - ٢٠٢٦';}

/* ═══ أنماط الجدول ═══ */
function getTableStyles(compact){
  var sz=compact?'9px':'11px';
  var szd=compact?'10px':'12px';
  var p=compact?'3px 1px':'5px 2px';
  var pd=compact?'3px 2px':'5px 3px';
  var bord='1px solid #1E293B';
  return {
    TH:'border:'+bord+';background:linear-gradient(135deg,#1E40AF,#2563EB);color:#fff;padding:'+p+';font-size:'+sz+';font-weight:bold;text-align:center;vertical-align:middle',    TH1:'border:'+bord+';background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:#fff;padding:'+p+';font-size:'+sz+';font-weight:bold;text-align:center;vertical-align:middle',
    TH2:'border:'+bord+';background:linear-gradient(135deg,#0E7490,#06B6D4);color:#fff;padding:'+p+';font-size:'+sz+';font-weight:bold;text-align:center;vertical-align:middle',
    THC:'border:'+bord+';background:linear-gradient(135deg,#B45309,#D97706);color:#fff;padding:'+p+';font-size:'+sz+';font-weight:bold;text-align:center;vertical-align:middle',
    THF:'border:'+bord+';background:linear-gradient(135deg,#BE123C,#E11D48);color:#fff;padding:'+p+';font-size:'+sz+';font-weight:bold;text-align:center;vertical-align:middle',
    TD:'border:'+bord+';padding:'+pd+';text-align:center;font-size:'+szd+';background:#fff',
    TDN:'border:'+bord+';padding:'+pd+';text-align:right;font-size:'+szd+';font-weight:bold;background:#fff'
  };
}

/* ═══ منطق النتيجة ═══ */
function calcHalfResult(bySub){
  var graded=0,failedNames=[];
  SUBJECTS.forEach(function(s){
    var r=bySub[s];if(!r)return;
    var v=(r.half!=null)?r.half:((r.a1!=null)?r.a1:null);
    if(v==null)return;
    graded++;
    if(v<(r.max||100)/2)failedNames.push(s);
  });
  if(!graded)return{text:'—',cls:'none'};
  if(failedNames.length===0)return{text:'ناجح',cls:'pass'};
  if(failedNames.length<=2)return{text:'مكمل من '+failedNames.join(' و '),cls:'warn'};
  return{text:'راسب',cls:'fail'};
}
function calcFinalResult(bySub){
  var graded=0,failedNames=[];
  SUBJECTS.forEach(function(s){
    var r=bySub[s];if(!r)return;
    if(r.final==null)return;
    graded++;
    if(r.final<(r.max||100)/2)failedNames.push(s);
  });
  if(!graded)return{text:'—',cls:'none'};
  if(failedNames.length===0)return{text:'ناجح',cls:'pass'};
  if(failedNames.length<=2)return{text:'مكمل من '+failedNames.join(' و '),cls:'warn'};
  return{text:'راسب',cls:'fail'};
}

/* ═══ بناء بطاقة نتيجة واحدة ═══ */
function buildOneResult(rows,compact){
  var bySub={};rows.forEach(function(r){bySub[r.subject]=r;});
  var halfRes=calcHalfResult(bySub);
  var finalRes=calcFinalResult(bySub);
  var S=getTableStyles(compact);

  var schoolName=localStorage.getItem('school_name')||'مدرسة المنهل الابتدائية';
  var schoolLogo=localStorage.getItem('school_logo')||'';
  var guideName=localStorage.getItem('guide_name')||'....................';
  var principalName=localStorage.getItem('principal_name')||'....................';
  var studyYear=getStudyYear();  var name=rows.length?rows[0].name:'';
  var grade=rows.length?rows[0].grade:'';
  var section=rows.length?rows[0].section:'';

  var pad=compact?'10px':'16px';
  var titleSize=compact?'13px':'16px';
  var subSize=compact?'11px':'13px';
  var logoSize=compact?'65px':'85px';
  var mbInfo=compact?'8px':'12px';
  var mTopSign=compact?'14px':'28px';

  var h='<div style="font-family:Tajawal,Arial,sans-serif;width:100%;padding:'+pad+';background:#fff;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact">';

  /* ═══ الشريط العلوي ═══ */
  h+='<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px double #1E40AF;padding-bottom:8px;margin-bottom:'+mbInfo+'">';
  h+='<div style="flex:1;text-align:center;font-weight:900;font-size:'+(compact?'12px':'14px')+';color:#1E40AF;line-height:1.6">ادارة<br>'+esc(schoolName)+'<br>للبنين</div>';
  h+='<div style="flex:1;text-align:center">';
  h+='<div style="font-size:'+titleSize+';font-weight:900;color:#1E40AF">بطاقة درجات</div>';
  h+='<div style="font-size:'+subSize+';font-weight:800;color:#B45309;margin-top:2px">الصف الخامس والسادس الابتدائي</div>';
  h+='<div style="font-size:'+(compact?'10px':'11px')+';font-weight:700;color:#64748B;margin-top:2px">للعام الدراسي '+esc(studyYear)+'</div>';
  h+='</div>';
  h+='<div style="flex:1;text-align:center">';
  if(schoolLogo){
    h+='<img src="'+schoolLogo+'" style="width:'+logoSize+';height:'+logoSize+';object-fit:contain;border:2px solid #1E40AF;border-radius:8px">';
  }else{
    h+='<div style="width:'+logoSize+';height:'+logoSize+';border:2px dashed #CBD5E1;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:10px;margin:0 auto">شعار<br>المدرسة</div>';
  }
  h+='</div></div>';

  /* ═══ شريط بيانات التلميذ ═══ */
  var infoPad=compact?'6px 10px':'9px 14px';
  var infoFs=compact?'11px':'13px';
  h+='<div style="display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);padding:'+infoPad+';border-radius:8px;margin-bottom:'+mbInfo+';border:1px solid #BFDBFE;flex-wrap:wrap;gap:4px">';
  h+='<div style="flex:1;min-width:120px;text-align:right;font-size:'+infoFs+';white-space:nowrap"><b style="color:#1E40AF">التلميذ:</b> <span style="font-weight:800;color:#0F172A">'+esc(name)+'</span></div>';
  h+='<div style="flex:1;min-width:120px;text-align:center;font-size:'+infoFs+';white-space:nowrap"><b style="color:#1E40AF">الصف والشعبة:</b> <span style="font-weight:800;color:#0F172A">'+esc(grade||'—')+' '+esc(section||'')+'</span></div>';
  h+='<div style="flex:1;min-width:100px;text-align:left;font-size:'+(compact?'10px':'11px')+';white-space:nowrap"><b style="color:#1E40AF">التاريخ:</b> <span style="font-weight:700">'+new Date().toLocaleDateString('ar')+'</span></div>';
  h+='</div>';

  /* ═══ جدول الدرجات — العناوين الصحيحة بالترتيب مع rowspan ═══ */
  h+='<table style="width:100%;border-collapse:collapse;border:2px solid #1E293B;table-layout:fixed"><thead>';
  
  /* الصف الأول من الرؤوس — كل عمود إما rowspan=2 أو colspan */
  h+='<tr>'
    +'<th style="'+S.TH+';width:2%" rowspan="2">ت</th>'
    +'<th style="'+S.TH+';width:10%" rowspan="2">الدروس</th>'
    +'<th style="'+S.TH1+'" colspan="3">الفصل الأول</th>'
    +'<th style="'+S.THC+';width:7%" rowspan="2">معدل<br>ف١</th>'
    +'<th style="'+S.TH+';width:5%" rowspan="2">نصف<br>السنة</th>'
    +'<th style="'+S.TH2+'" colspan="2">الفصل الثاني</th>'
    +'<th style="'+S.THC+';width:7%" rowspan="2">معدل<br>ف٢</th>'    +'<th style="'+S.THC+';width:7%" rowspan="2">السعي<br>السنوي</th>'
    +'<th style="'+S.TH+';width:6%" rowspan="2">نهاية<br>السنة</th>'
    +'<th style="'+S.THF+';width:8%" rowspan="2">الدرجة<br>النهائية</th>'
    +'</tr>';
  
  /* الصف الثاني من الرؤوس — فقط تحت الفصل الأول والفصل الثاني */
  h+='<tr>'
    +'<th style="'+S.TH1+';width:6%">ت١</th>'
    +'<th style="'+S.TH1+';width:6%">ت٢</th>'
    +'<th style="'+S.TH1+';width:6%">ك١</th>'
    +'<th style="'+S.TH2+';width:7%">آذار</th>'
    +'<th style="'+S.TH2+';width:7%">نيسان</th>'
    +'</tr></thead><tbody>';

  SUBJECTS.forEach(function(s,i){
    var r=bySub[s];
    function td(v){return(v==null||v==='')?'<td style="'+S.TD+';color:#CBD5E1">—</td>':'<td style="'+S.TD+'">'+arNum(v)+'</td>';}
    var fin=r&&r.final!=null;
    var finStyle=S.TD+(fin?(r.final>=(r.max||100)/2?';color:#047857;font-weight:bold;background:#D1FAE5':';color:#DC2626;font-weight:bold;background:#FEE2E2'):'');
    h+='<tr style="'+(i%2===1?'background:#F8FAFC':'')+'">'
      +'<td style="'+S.TD+'">'+arNum(i+1)+'</td>'
      +'<td style="'+S.TDN+'">'+s+'</td>'
      +td(r?r.m1:null)+td(r?r.m2:null)+td(r?r.m3:null)
      +'<td style="'+S.TD+';background:#FEF3C7;font-weight:bold;color:#B45309">'+(r?arNum(r.a1):'—')+'</td>'
      +td(r?r.half:null)+td(r?r.m4:null)+td(r?r.m5:null)
      +'<td style="'+S.TD+';background:#FEF3C7;font-weight:bold;color:#B45309">'+(r?arNum(r.a2):'—')+'</td>'
      +'<td style="'+S.TD+';background:#FEF3C7;font-weight:bold;color:#B45309">'+(r?arNum(r.annual):'—')+'</td>'
      +td(r?r.exam:null)
      +'<td style="'+finStyle+'">'+(r?arNum(r.final):'—')+'</td>'
      +'</tr>';
  });

  /* ═══ سطر النتيجة ═══ */
  function resSpan(res){
    var color=res.cls==='pass'?'#047857':res.cls==='fail'?'#DC2626':res.cls==='warn'?'#B45309':'#64748B';
    var bg=res.cls==='pass'?'#D1FAE5':res.cls==='fail'?'#FEE2E2':res.cls==='warn'?'#FEF3C7':'#F1F5F9';
    return '<span style="background:'+bg+';color:'+color+';padding:2px 10px;border-radius:8px;font-weight:900;margin-right:4px;border:1px solid '+color+'">'+res.text+'</span>';
  }
  var resFs=compact?'11px':'13px';
  h+='<tr style="background:#1E3A8A;color:#fff;font-weight:900;font-size:'+resFs+'">'
    +'<td colspan="6" style="border:1px solid #1E293B;padding:8px;text-align:center">نتيجة نصف السنة: '+resSpan(halfRes)+'</td>'
    +'<td colspan="7" style="border:1px solid #1E293B;padding:8px;text-align:center">نتيجة نهاية السنة: '+resSpan(finalRes)+'</td>'
    +'</tr>';
  h+='</tbody></table>';

  /* ═══ التوقيعات ═══ */
  var signFs=compact?'12px':'14px';
  h+='<div style="display:flex;justify-content:space-between;margin-top:'+mTopSign+';padding:0 10px;font-size:'+signFs+';font-weight:800;color:#0F172A">';
  h+='<div style="white-space:nowrap">مرشد الصف : <span style="color:#1E40AF">'+esc(guideName)+'</span></div>';
  h+='<div style="white-space:nowrap">مدير المدرسة : <span style="color:#1E40AF">'+esc(principalName)+'</span></div>';  h+='</div>';

  h+='</div>';
  return h;
}

/* ═══ بطاقة النتيجة العامة ═══ */
function resultTable(rows,opts){
  opts=opts||{};
  var compact=!!opts.compact;
  var secondRows=opts.secondRows||null;
  
  if(secondRows&&secondRows.length){
    var h='<div style="width:794px;margin:0 auto">';
    h+=buildOneResult(rows,true);
    h+='<div style="border-top:2px dashed #94A3B8;margin:10px 0"></div>';
    h+=buildOneResult(secondRows,true);
    h+='</div>';
    return h;
  }else{
    return '<div style="width:794px;margin:0 auto">'+buildOneResult(rows,false)+'</div>';
  }
}

function resultCard(name,grade,section,rows){
  var finals=rows.map(function(r){return r.final;}).filter(function(v){return v!=null;});
  var max=rows.length?rows[0].max||100:100;
  var pass=finals.filter(function(v){return v>=max/2;}).length;
  var avg=finals.length?Math.round(finals.reduce(function(a,b){return a+b;},0)/finals.length):null;
  var isPass=avg!==null&&avg>=max/2;
  return '<div class="rescard">'
    +'<div class="rc-top"><div class="t">🎓 بطاقة نتيجة التلميذ</div><div class="y">السنة الدراسية '+esc(getStudyYear())+'</div></div>'
    +'<div class="rc-info"><span>التلميذ: <b>'+esc(name)+'</b></span>'
    +(grade?'<span>الصف: <b>'+esc(grade)+' '+esc(section||'')+'</b></span>':'')
    +'<span>المعدل العام: <b>'+(avg!==null?arNum(avg):'—')+'</b></span>'
    +'<span>ناجح في: <b>'+arNum(pass)+'</b> من <b>'+arNum(rows.length)+'</b></span>'
    +(avg!==null?'<span class="verdict '+(isPass?'pass':'fail')+'">'+(isPass?'ناجح ✔':'راسب ✘')+'</span>':'')
    +'</div>'
    +'<div class="rc-body" style="background:#E2E8F0;padding:20px;overflow-x:auto">'+resultTable(rows)+'</div>'
    +'</div>';
}

function downloadXLS(filename,title,tablesHTML){
  var html='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" dir="rtl"><head><meta charset="utf-8">'
    +'<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>الدرجات</x:Name><x:WorksheetOptions><x:DisplayRightToLeft/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->'
    +'</head><body><h2 style="font-family:Tahoma;color:#1E40AF">'+title+'</h2>'+tablesHTML+'</body></html>';
  var blob=new Blob(['\uFEFF'+html],{type:'application/vnd.ms-excel;charset=utf-8;'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename+'.xls';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(a.href);},5000);  toast('✓ تم التنزيل — افتحه في Excel','ok');
}

function printWin(html){
  var old=document.getElementById('printFrame');
  if(old)old.remove();
  var f=document.createElement('iframe');
  f.id='printFrame';
  f.style.position='fixed';
  f.style.left='-10000px';
  f.style.width='0';
  f.style.height='0';
  f.style.border='0';
  document.body.appendChild(f);
  var doc=f.contentWindow.document;
  doc.open();
  doc.write('<html dir="rtl"><head><meta charset="utf-8"><title>طباعة</title>'
    +'<style>'
    +'@page{size:A4;margin:6mm}'
    +'*{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    +'body{font-family:Tajawal,Arial,sans-serif;margin:0;padding:0}'
    +'table{page-break-inside:avoid}'
    +'</style>'
    +'</head><body>'+html+'</body></html>');
  doc.close();
  setTimeout(function(){
    f.contentWindow.focus();
    f.contentWindow.print();
  },500);
}

var ICONS={
  summary:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/></svg>',
  print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  unlock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
  del:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  xls:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
};

function adminLogin(){
  var k=$('#keyIn').value.trim();
  if(!k){toast('أدخل كلمة المرور','err');return;}
  if(!url()){toast('⚠️ رابط الخادم مفقود — ضعه في config.js','err');return;}
  var btn=$('#loginBtn');btn.disabled=true;btn.textContent='⏳ تحقق...';
  api({action:'adminLogin',key:k},20000).then(function(r){
    if(!r.ok){toast('❌ '+r.error,'err');return;}    ROLE=r.role;localStorage.setItem('d_key',k);localStorage.setItem('d_admin',ROLE);
    enterAdmin();
  }).catch(function(){toast('تعذر الاتصال بالخادم','err');})
  .finally(function(){btn.disabled=false;btn.textContent='دخول';});
}
function enterAdmin(){
  ROLE=localStorage.getItem('d_admin')||'';
  if(!ROLE){go('s-login');return;}
  $('#setUrl').value=url();
  fillSubjectSelects();applyRole();
  go('s-main');adminTab('dash');
  setInterval(function(){if(!$('#tab-dash').hidden&&Pages.dash&&Pages.dash.silent)Pages.dash.silent();},60000);
}
function fillSubjectSelects(){
  var opts=SUBJECTS.map(function(s){return'<option>'+s+'</option>';}).join('');
  $('#ntSub').innerHTML=opts;$('#edSub').innerHTML=opts;
}
function applyRole(){
  var dev=ROLE==='dev';
  $$('[data-dev]').forEach(function(el){el.style.display=dev?'':'none';});
  var rc=$('#roleCard');
  rc.className='rolecard '+(dev?'dev':'mgr');
  $('#roleDot').textContent=dev?'🛠️':'👔';
  $('#roleLabel').textContent=dev?'المطور':'المدير';
  $('#roleSub').textContent=dev?'صلاحيات كاملة':'عرض الدرجات';
}
function logoutAdmin(){confirmDlg('تسجيل الخروج؟',function(){localStorage.removeItem('d_admin');localStorage.removeItem('d_key');ROLE='';go('s-login');$('#keyIn').value='';},'خروج');}
function refresh(){toast('⏳ تحديث...','');if(Pages.dash&&Pages.dash.enter)Pages.dash.enter();}
function adminTab(t){
  ['dash','res','team','entry','studs','keys','set'].forEach(function(x){
    $('#tab-'+x).hidden=x!==t;
    $$('[data-tab="'+x+'"]').forEach(function(b){b.classList.toggle('act',x===t);});
  });
  var th=THEMES[t];
  document.documentElement.style.setProperty('--th',th[0]);
  document.documentElement.style.setProperty('--thb',th[1]);
  document.body.setAttribute('data-page',t);
  $('#tbTitle').textContent={dash:'نظرة عامة',res:'نتائج التلاميذ',team:'المعلمون',entry:'إدخال إداري',studs:'التلاميذ',keys:'كلمات المرور',set:'الإعدادات'}[t];
  if(Pages[t]&&Pages[t].enter)Pages[t].enter();
}

(function init(){
  try{
    $('#keyIn').addEventListener('keydown',function(e){if(e.key==='Enter')adminLogin();});
    if(localStorage.getItem('d_admin'))enterAdmin();
  }catch(e){var d=document.getElementById('errbar');d.style.display='block';d.textContent='INIT ERROR: '+e.message;}
})();
