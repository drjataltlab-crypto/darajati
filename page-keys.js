/* ═══ page-keys.js — صفحة كلمات المرور ═══ */

function loadKeysInfo(){
  if(ROLE!=='dev')return;
  api({action:'getKeysInfo',key:key()}).then(function(r){
    if(r.ok){$('#kDevCur').value=r.dev;$('#kMgrCur').value=r.manager;}
  }).catch(function(){});
}

function doChangeKey(target){
  var inp=target==='DEV'?$('#kDevNew'):$('#kMgrNew');
  var nv=inp.value.trim();
  if(!nv||nv.length<4){toast('الكلمة الجديدة: ٤ أحرف على الأقل','err');return;}
  var label=target==='DEV'?'المطور':'المدير';
  confirmDlg('تغيير كلمة مرور «'+label+'» إلى الكلمة الجديدة؟',function(){
    api({action:'changeKey',key:key(),target:target,newValue:nv}).then(function(r){
      toast(r.ok?'✓ تم تغيير كلمة '+label:r.error,r.ok?'ok':'err');
      if(r.ok){
        inp.value='';
        loadKeysInfo();
        if(target==='DEV')localStorage.setItem('d_key',nv);
      }
    }).catch(function(){toast('تعذر الاتصال','err');});
  },'تغيير كلمة المرور');
}

registerPage('keys',{
  enter:function(){loadKeysInfo();}
});