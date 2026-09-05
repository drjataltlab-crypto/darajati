/* ═══ page-team.js — صفحة المعلمون ═══ */

function doAddTeacher(){
  var name=$('#ntName').value.trim(),subject=$('#ntSub').value,classes=$('#ntCls').value.trim();
  if(!name){toast('اسم المعلم مطلوب','err');return;}
  api({action:'addTeacher',key:key(),name:name,subject:subject,classes:classes}).then(function(r){
    if(!r.ok){toast(r.error,'err');return;}
    $('#ntName').value='';$('#ntCls').value='';
    $('#ntRes').innerHTML='<div style="background:var(--accb);color:var(--acc);border-radius:11px;padding:12px;margin-top:9px;font-weight:800;text-align:center">✅ '+esc(name)+' — كوده: <span class="codechip">'+esc(r.code)+'</span></div>'
      +'<div class="grid2"><button class="btn ghost" onclick="copyText(\''+escA(r.code)+'\')">📄 نسخ</button><button class="btn ok" onclick="shareWa(\''+escA(r.code)+'\',\''+escA(name)+'\')">💬 واتساب</button></div>';
    loadDash(true);
    toast('✓ تمت الإضافة','ok');
  }).catch(function(){toast('تعذر الاتصال','err');});
}

function renderTeam(){
  var box=$('#teamList');
  if(!ADM.teachers||!ADM.teachers.length){box.innerHTML='<div class="empty">أضف أول معلم من النموذج أعلاه ☝️</div>';return;}
  box.innerHTML=ADM.teachers.map(function(t,i){
    return'<div class="titem"><div class="ava" style="background:'+AV[i%AV.length]+'">'+esc((t.name||'؟').charAt(0))+'</div>'
    +'<div class="body"><div class="nm">'+esc(t.name)+' <span class="dot '+(t.lastLogin>0?'on':'off')+'" title="'+(t.lastLogin>0?'فتح حسابه':'لم يفتح حسابه')+'"></span>'+(t.locked?'<span class="pill lock">🔒</span>':'')+' <span class="pill subj">'+esc(t.subject)+'</span> <span class="codechip">'+esc(t.code)+'</span></div>'
    +'<div class="sub">'+(t.classes?esc(t.classes):'—')+'</div></div>'
    +'<div class="actions">'
    +'<button class="ib" title="نسخ الكود" onclick="copyText(\''+escA(t.code)+'\')">📄</button>'
    +'<button class="ib" title="إرسال واتساب" onclick="shareWa(\''+escA(t.code)+'\',\''+escA(t.name)+'\')">💬</button>'
    +'<button class="ib" title="تعديل" onclick="openEdit(\''+escA(t.code)+'\')">'+ICONS.edit+'</button>'
    +'<button class="ib" title="قفل/فتح" onclick="toggleLock(\''+escA(t.code)+'\')">'+(t.locked?ICONS.unlock:ICONS.lock)+'</button>'
    +'<button class="ib" title="حذف" onclick="delTeacherCode(\''+escA(t.code)+'\')" style="color:var(--red)">'+ICONS.del+'</button>'
    +'</div></div>';
  }).join('');
}

function openEdit(code){
  var t=ADM.teachers.find(function(x){return x.code===code;});
  if(!t)return;
  $('#edName').value=t.name;
  $('#edSub').value=t.subject;
  $('#edCls').value=t.classes;
  $('#editModal').dataset.code=code;
  $('#editModal').classList.add('show');
}

function doEditTeacher(){
  var code=$('#editModal').dataset.code;
  var t=ADM.teachers.find(function(x){return x.code===code;});
  api({action:'updateTeacher',key:key(),code:code,name:$('#edName').value,subject:$('#edSub').value,classes:$('#edCls').value}).then(function(r){
    toast(r.ok?'✓ تم التعديل':'❌ '+r.error,r.ok?'ok':'err');
    if(r.ok){
      if(t){t.name=$('#edName').value;t.subject=$('#edSub').value;t.classes=$('#edCls').value;}
      hideModal('editModal');
      renderDash();renderTeam();
    }
  }).catch(function(){toast('تعذر الاتصال','err');});
}

function toggleLock(code){
  var t=ADM.teachers.find(function(x){return x.code===code;});
  if(!t)return;
  var lock=!t.locked;
  confirmDlg(lock?'قفل حساب «'+t.name+'»؟ لن يستطيع الدخول أو الإرسال حتى يُفتح.':'فتح حساب «'+t.name+'»؟',function(){
    api({action:'toggleLock',key:key(),code:code}).then(function(r){
      toast(r.ok?(r.locked?'🔒 تم قفل الحساب':'🔓 تم فتح الحساب'):r.error,r.ok?'ok':'err');
      if(r.ok&&t){t.locked=r.locked;renderDash();renderTeam();}
    }).catch(function(){toast('تعذر الاتصال','err');});
  },lock?'قفل حساب':'فتح حساب');
}

function delTeacherCode(code){
  var t=ADM.teachers.find(function(x){return x.code===code;});
  if(!t)return;
  confirmDlg('حذف المعلم «'+t.name+'»؟ (درجاته تبقى محفوظة في الجدول)',function(){
    api({action:'delTeacher',key:key(),code:code}).then(function(r){
      toast(r.ok?'✓ تم الحذف':r.error,r.ok?'ok':'err');
      if(r.ok){
        ADM.teachers=ADM.teachers.filter(function(x){return x.code!==code;});
        renderDash();renderTeam();
      }
    }).catch(function(){toast('تعذر الاتصال','err');});
  },'حذف معلم');
}

registerPage('team',{
  enter:function(){renderTeam();}
});