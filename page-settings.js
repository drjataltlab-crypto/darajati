/* ═══ page-settings.js — الإعدادات وقوالب Excel ═══ */

function downloadTemplate(fill){
  toast('⏳ بناء القالب...','');
  var combos=[['الخامس','أ'],['الخامس','ب'],['الخامس','ج'],['السادس','أ'],['السادس','ب'],['السادس','ج']];
  var rosterP=combos.map(function(c){
    return api({action:'getStudents',key:key(),cls:c[0]+' '+c[1]}).then(function(r){
      return r.ok?r.names.map(function(n){return{grade:c[0],section:c[1],name:n};}):[];
    }).catch(function(){return[];});
  });
  var gradesP=fill?api({action:'allGrades',key:key()}):Promise.resolve({ok:true,rows:[]});
  Promise.all([Promise.all(rosterP),gradesP]).then(function(res){
    var roster=[];res[0].forEach(function(a){roster=roster.concat(a);});
    var grades={};
    (res[1].rows||[]).forEach(function(row){grades[row.subject+'¦'+row.grade+' '+row.section+'¦'+row.name]=row;});
    var html='';
    SUBJECTS.forEach(function(sub){
      html+='<h3 style="font-family:Tahoma;color:#065F46">📚 '+sub+'</h3><table style="border-collapse:collapse"><tr><th style="'+TH+'">#</th><th style="'+TH+'">الصف</th><th style="'+TH+'">الشعبة</th><th style="'+TH+'">اسم التلميذ</th><th style="'+TH1+'">ت١</th><th style="'+TH1+'">ت٢</th><th style="'+TH1+'">ك١</th><th style="'+THC+'">معدل ف١</th><th style="'+TH2+'">آذار</th><th style="'+TH2+'">نيسان</th><th style="'+THC+'">معدل ف٢</th><th style="'+TH+'">نصف السنة</th><th style="'+THC+'">السعي</th><th style="'+TH+'">نهاية</th><th style="'+THF+'">النهائية</th></tr>';
      var n=0;
      roster.forEach(function(s){
        var g=fill?grades[sub+'¦'+s.grade+' '+s.section+'¦'+s.name]:null;
        function td(v){return'<td style="'+TD+'">'+((v===null||v===undefined||v==='')?'':v)+'</td>';}
        n++;
        html+='<tr><td style="'+TD+'">'+n+'</td><td style="'+TD+'">'+s.grade+'</td><td style="'+TD+'">'+s.section+'</td><td style="'+TDN+'">'+esc(s.name)+'</td>'
          +td(g?g.m1:null)+td(g?g.m2:null)+td(g?g.m3:null)+td(g?g.a1:null)+td(g?g.m4:null)+td(g?g.m5:null)+td(g?g.a2:null)+td(g?g.half:null)+td(g?g.annual:null)+td(g?g.exam:null)+td(g?g.final:null)+'</tr>';
      });
      html+='</table><br>';
    });
    downloadXLS(fill?'درجاتي-معبأ':'درجاتي-قالب','درجاتي — السنة '+YEAR,html);
  }).catch(function(e){toast('خطأ: '+e.message,'err');});
}

function saveSettings(){
  var v=$('#setUrl').value.trim();
  if(!v){toast('ألصق الرابط أولًا','err');return;}
  localStorage.setItem('d_url',v);
  $('#connRes').innerHTML='<p class="hint">⏳ اختبار...</p>';
  api({action:'ping'},15000).then(function(r){
    $('#connRes').innerHTML=r.ok?'<p class="hint" style="color:#047857;font-weight:800">✓ متصل بالخادم</p>':'<p class="hint" style="color:var(--red)">❌ استجابة غير متوقعة</p>';
  }).catch(function(){$('#connRes').innerHTML='<p class="hint" style="color:var(--red)">❌ تعذر الاتصال</p>';});
}

registerPage('set',{
  enter:function(){}
});