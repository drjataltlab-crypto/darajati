/* ═══ core.js — الأساس المشترك ═══ */
window.addEventListener('error',function(e){var d=document.getElementById('errbar');if(d){d.style.display='block';d.textContent='ERROR line '+e.lineno+': '+e.message;}});

var SUBJECTS=['التربية الإسلامية','اللغة العربية','اللغة الانكليزية','الرياضيات','الاجتماعيات','العلوم','الفنية','الرياضة'];
var ARD=['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];

var THEMES={
  dash:['#1D4ED8','#DBEAFE'],res:['#B45309','#FDE68A'],team:['#047857','#A7F3D0'],
  entry:['#7E22CE','#DDD6FE'],studs:['#0E7490','#A5F3FC'],keys:['#BE123C','#FECDD3'],set:['#475569','#E2E8F0']
};
var AV=['#1D4ED8','#7E22CE','#047857','#B45309','#BE123C','#0E7490','#DB2777','#65A30D'];
var Pages={};
var ADM={teachers:[],tv:null,res:null};
var ROLE='',toastT,_yes=null;

function arNum(x){if(x===null||x===undefined||x==='')return'—';return String(x).replace(/\d/g,function(d){return ARD[+d];});}
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

function getPrintCfg(){
  var g=function(k,d){return localStorage.getItem(k)||d;};
  return {
    schoolColor:g('pc_school_color','#1E40AF'),schoolSize:g('pc_school_size','22'),schoolAlign:g('pc_school_align','center'),
    titleColor:g('pc_title_color','#1E40AF'),titleSize:g('pc_title_size','26'),
    subColor:g('pc_sub_color','#B45309'),subSize:g('pc_sub_size','17'),
    yearColor:g('pc_year_color','#475569'),yearSize:g('pc_year_size','15'),
    logoSize:g('pc_logo_size','110'),
    studentAlign:g('pc_student_align','right'),
    classAlign:g('pc_class_align','center'),
    dateAlign:g('pc_date_align','left'),
    tableFontSize:g('pc_table_font','13'),
    cellHeight:g('pc_cell_height','32'),
    cellPad:g('pc_cell_pad','5'),
    subjectWidth:g('pc_subject_width','140'),
    guideAlign:g('pc_guide_align','right'),
    principalAlign:g('pc_principal_align','left'),
    signFontSize:g('pc_sign_font','15')
  };
}

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

/* ═══ بطاقة نتيجة واحدة — عرض 190mm يدخل A4 بالضبط ═══ */
function buildOneResult(rows,compact){
  var bySub={};rows.forEach(function(r){bySub[r.subject]=r;});
  var halfRes=calcHalfResult(bySub);
  var finalRes=calcFinalResult(bySub);
  var C=getPrintCfg();

  var schoolName=localStorage.getItem('school_name')||'مدرسة المنهل الابتدائية';
  var schoolLogo=localStorage.getItem('school_logo')||'';
  var guideName=localStorage.getItem('guide_name')||'....................';
  var principalName=localStorage.getItem('principal_name')||'....................';
  var studyYear=getStudyYear();
  var name=rows.length?rows[0].name:'';
  var grade=rows.length?rows[0].grade:'';
  var section=rows.length?rows[0].section:'';

  var scale=compact?0.78:1;
  var schoolSz=Math.round(parseInt(C.schoolSize)*scale);
  var titleSz=Math.round(parseInt(C.titleSize)*scale);
  var subSz=Math.round(parseInt(C.subSize)*scale);
  var yearSz=Math.round(parseInt(C.yearSize)*scale);
  var logoSz=Math.round(parseInt(C.logoSize)*scale);
  var tableFs=Math.round(parseInt(C.tableFontSize)*scale);
  var cellH=Math.round(parseInt(C.cellHeight)*scale);
  var cellPd=Math.round(parseInt(C.cellPad)*scale);
  var subjW=Math.round(parseInt(C.subjectWidth)*scale);
  var signFs=Math.round(parseInt(C.signFontSize)*scale);

  var bord='#0F172A';

  var h='<div style="font-family:Tajawal,Arial,sans-serif;width:190mm;box-sizing:border-box;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;margin:0 auto">';

  /* الشريط العلوي */
  h+='<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px double '+C.schoolColor+';padding-bottom:10px;margin-bottom:14px;gap:12px">';
  h+='<div style="flex:1;text-align:'+C.schoolAlign+';font-weight:900;font-size:'+schoolSz+'px;color:'+C.schoolColor+';line-height:1.5;word-break:break-word">ادارة<br>'+esc(schoolName)+'<br>للبنين</div>';
  h+='<div style="flex:1;text-align:center">';
  h+='<div style="font-size:'+titleSz+'px;font-weight:900;color:'+C.titleColor+'">بطاقة درجات</div>';
  h+='<div style="font-size:'+subSz+'px;font-weight:800;color:'+C.subColor+';margin-top:3px">الصف الخامس والسادس الابتدائي</div>';
  h+='<div style="font-size:'+yearSz+'px;font-weight:700;color:'+C.yearColor+';margin-top:3px">للعام الدراسي '+esc(studyYear)+'</div>';
  h+='</div>';
  h+='<div style="flex:1;text-align:center">';
  if(schoolLogo){
    h+='<img src="'+schoolLogo+'" style="width:'+logoSz+'px;height:'+logoSz+'px;object-fit:contain;border:2px solid '+C.schoolColor+';border-radius:8px">';
  }else{
    h+='<div style="width:'+logoSz+'px;height:'+logoSz+'px;border:2px dashed #CBD5E1;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94A3B8;font-size:11px;margin:0 auto">شعار<br>المدرسة</div>';
  }
  h+='</div></div>';

  /* شريط بيانات التلميذ — خط كبير واضح */
  h+='<div style="display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);padding:10px 14px;border-radius:8px;margin-bottom:14px;border:1px solid #BFDBFE;flex-wrap:wrap;gap:8px">';
  h+='<div style="flex:1;min-width:150px;text-align:'+C.studentAlign+';font-size:16px;font-weight:800"><b style="color:#1E40AF">التلميذ:</b> <span style="font-weight:900;color:#0F172A">'+esc(name)+'</span></div>';
  h+='<div style="flex:1;min-width:150px;text-align:'+C.classAlign+';font-size:16px;font-weight:800"><b style="color:#1E40AF">الصف والشعبة:</b> <span style="font-weight:900;color:#0F172A">'+esc(grade||'—')+' '+esc(section||'')+'</span></div>';
  h+='<div style="flex:1;min-width:130px;text-align:'+C.dateAlign+';font-size:14px;font-weight:700"><b style="color:#1E40AF">التاريخ:</b> <span style="font-weight:800">'+new Date().toLocaleDateString('ar')+'</span></div>';
  h+='</div>';

  /* جدول الدرجات */
  h+='<table style="width:100%;border-collapse:collapse;border:2px solid '+bord+';font-size:'+tableFs+'px;box-sizing:border-box">';
  var thStyle='border:1px solid '+bord+';color:#fff;padding:'+cellPd+'px 2px;font-size:'+tableFs+'px;font-weight:bold;text-align:center;vertical-align:middle';
  h+='<thead>';
  h+='<tr>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#1E40AF,#2563EB)" rowspan="2">ت</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#1E40AF,#2563EB)" rowspan="2">الدروس</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#1D4ED8,#3B82F6)" colspan="3">الفصل الأول</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#B45309,#D97706)" rowspan="2">معدل ف١</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#1E40AF,#2563EB)" rowspan="2">نصف السنة</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#0E7490,#06B6D4)" colspan="2">الفصل الثاني</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#B45309,#D97706)" rowspan="2">معدل ف٢</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#B45309,#D97706)" rowspan="2">السعي السنوي</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#1E40AF,#2563EB)" rowspan="2">نهاية السنة</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#BE123C,#E11D48)" rowspan="2">الدرجة النهائية</th>'
    +'</tr>';
  h+='<tr>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#1D4ED8,#3B82F6)">ت١</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#1D4ED8,#3B82F6)">ت٢</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#1D4ED8,#3B82F6)">ك١</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#0E7490,#06B6D4)">آذار</th>'
    +'<th style="'+thStyle+';background:linear-gradient(135deg,#0E7490,#06B6D4)">نيسان</th>'
    +'</tr></thead><tbody>';

  var tdStyle='border:1px solid '+bord+';padding:'+cellPd+'px 2px;text-align:center;font-size:'+tableFs+'px;background:#fff;height:'+cellH+'px';
  var tdnStyle='border:1px solid '+bord+';padding:'+cellPd+'px 4px;text-align:right;font-size:'+tableFs+'px;font-weight:bold;background:#fff;width:'+subjW+'px;height:'+cellH+'px';

  SUBJECTS.forEach(function(s,i){
    var r=bySub[s];
    function td(v){return(v==null||v==='')?'<td style="'+tdStyle+';color:#CBD5E1">—</td>':'<td style="'+tdStyle+'">'+arNum(v)+'</td>';}
    var fin=r&&r.final!=null;
    var finStyle=tdStyle+(fin?(r.final>=(r.max||100)/2?';color:#047857;font-weight:bold;background:#D1FAE5':';color:#DC2626;font-weight:bold;background:#FEE2E2'):'');
    h+='<tr style="'+(i%2===1?'background:#F8FAFC':'')+'">'
      +'<td style="'+tdStyle+'">'+arNum(i+1)+'</td>'
      +'<td style="'+tdnStyle+'">'+s+'</td>'
      +td(r?r.m1:null)+td(r?r.m2:null)+td(r?r.m3:null)
      +'<td style="'+tdStyle+';background:#FEF3C7;font-weight:bold;color:#B45309">'+(r?arNum(r.a1):'—')+'</td>'
      +td(r?r.half:null)+td(r?r.m4:null)+td(r?r.m5:null)
      +'<td style="'+tdStyle+';background:#FEF3C7;font-weight:bold;color:#B45309">'+(r?arNum(r.a2):'—')+'</td>'
      +'<td style="'+tdStyle+';background:#FEF3C7;font-weight:bold;color:#B45309">'+(r?arNum(r.annual):'—')+'</td>'
      +td(r?r.exam:null)
      +'<td style="'+finStyle+'">'+(r?arNum(r.final):'—')+'</td>'
      +'</tr>';
  });
  h+='</tbody></table>';

  /* سطر النتيجة — منفصل عن الجدول */
  function resSpan(res){
    var color=res.cls==='pass'?'#047857':res.cls==='fail'?'#DC2626':res.cls==='warn'?'#B45309':'#64748B';
    var bg=res.cls==='pass'?'#D1FAE5':res.cls==='fail'?'#FEE2E2':res.cls==='warn'?'#FEF3C7':'#F1F5F9';
    return '<span style="background:'+bg+';color:'+color+';padding:4px 14px;border-radius:10px;font-weight:900;margin:0 6px;border:2px solid '+color+';font-size:'+Math.round(tableFs*1.1)+'px">'+res.text+'</span>';
  }
  h+='<div style="display:flex;gap:10px;margin-top:14px">';
  h+='<div style="flex:1;background:linear-gradient(135deg,#1E3A8A,#1E40AF);color:#fff;font-weight:900;font-size:'+Math.round(tableFs*1.15)+'px;padding:10px;border-radius:8px;text-align:center;border:2px solid #0F172A">';
  h+='نتيجة نصف السنة: '+resSpan(halfRes)+'</div>';
  h+='<div style="flex:1;background:linear-gradient(135deg,#1E3A8A,#1E40AF);color:#fff;font-weight:900;font-size:'+Math.round(tableFs*1.15)+'px;padding:10px;border-radius:8px;text-align:center;border:2px solid #0F172A">';
  h+='نتيجة نهاية السنة: '+resSpan(finalRes)+'</div>';
  h+='</div>';

  /* التوقيعات */
  h+='<div style="display:flex;justify-content:space-between;margin-top:28px;padding:0 6px;font-size:'+signFs+'px;font-weight:800;color:#0F172A;flex-wrap:wrap;gap:14px">';
  h+='<div style="flex:1;text-align:'+C.guideAlign+';min-width:200px;word-break:break-word">مرشد الصف : <span style="color:#1E40AF;font-weight:900">'+esc(guideName)+'</span></div>';
  h+='<div style="flex:1;text-align:'+C.principalAlign+';min-width:200px;word-break:break-word">مدير المدرسة : <span style="color:#1E40AF;font-weight:900">'+esc(principalName)+'</span></div>';
  h+='</div>';

  h+='</div>';
  return h;
}

function resultTable(rows,opts){
  opts=opts||{};
  var compact=!!opts.compact;
  var secondRows=opts.secondRows||null;
  if(secondRows&&secondRows.length){
    var h='';
    h+=buildOneResult(rows,true);
    h+='<div style="border-top:2px dashed #94A3B8;margin:14px 0;page-break-after:always"></div>';
    h+=buildOneResult(secondRows,true);
    return h;
  }else{
    return buildOneResult(rows,false);
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
  setTimeout(function(){URL.revokeObjectURL(a.href);},5000);
  toast('✓ تم التنزيل — افتحه في Excel','ok');
}

/* ═══ طباعة نظيفة: بدون رابط وبدون عنوان وبلا قص ═══ */
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
  doc.write('<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title> </title>'
    +'<style>'
    +'@page{size:A4;margin:0}'
    +'*{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;box-sizing:border-box}'
    +'html,body{margin:0;padding:0}'
    +'body{font-family:Tajawal,Arial,sans-serif;padding:10mm}'
    +'table{page-break-inside:avoid;width:100%;border-collapse:collapse}'
    +'</style>'
    +'</head><body>'+html+'</body></html>');
  doc.close();
  setTimeout(function(){
    try{f.contentWindow.focus();f.contentWindow.print();}catch(e){}
  },600);
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
    if(!r.ok){toast('❌ '+r.error,'err');return;}
    ROLE=r.role;localStorage.setItem('d_key',k);localStorage.setItem('d_admin',ROLE);
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
