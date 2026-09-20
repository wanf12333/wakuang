// Visual-only baseline captured from the actual Cocos GameScene. No game simulation.
(()=>{
 const names={'gameplay-no-stamina':'主玩法',settings:'设置与暂停',success:'开采成功',failed:'开采未完成',hint:'宝藏提示'};
 const host=document.createElement('div');host.id='cocos-gameplay-visual';host.innerHTML='<img alt="Cocos 主玩法实装效果">';document.getElementById('phone').append(host);
 const controls=document.createElement('div');controls.className='cocos-visual-controls';controls.innerHTML='<strong>Cocos 实装效果 · 静态设计基准</strong><p>只检查界面，不执行挖掘、广告、奖励或关卡验证。</p><div>'+Object.entries(names).map(([k,v])=>`<button type="button" data-visual="${k}">${v}</button>`).join('')+'</div>';
 document.querySelector('.stage-top').after(controls);
 let selected='gameplay-no-stamina';
 function select(key){selected=key;host.querySelector('img').src='../reference/gameplay/'+key+'.png';host.querySelector('img').alt='Cocos 实装：'+names[key];controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.visual===key)));}
 controls.addEventListener('click',e=>{const button=e.target.closest('[data-visual]');if(button)select(button.dataset.visual);});
 function fitGameplay(){
  if(!document.body.classList.contains('native-gameplay-preview'))return;
  const wrap=document.getElementById('phone-wrap'),phone=document.getElementById('phone');
  const stage=document.querySelector('.stage'),top=document.querySelector('.stage-top');
  const reserved=(controls.offsetHeight||0)+(top.offsetHeight||0)+48;
  const maxWidth=Math.max(240,Math.min(720,stage.clientWidth-16));
  const maxHeight=Math.max(426,window.innerHeight-reserved);
  const width=Math.floor(Math.min(maxWidth,maxHeight*720/1280));
  wrap.style.width=width+'px';wrap.style.height=(width*1280/720)+'px';
  phone.style.transform=`scale(${width/720})`;
 }
 function sync(){
  const active=window.review?.s.page==='gameplay',wasActive=document.body.classList.contains('native-gameplay-preview');
  if(active!==wasActive){document.body.classList.toggle('native-gameplay-preview',active);if(active){select('gameplay-no-stamina');requestAnimationFrame(fitGameplay);}else window.dispatchEvent(new Event('resize'));}
 }
 // Go directly to the visual baseline from the design navigation, with no entry prerequisites.
 document.addEventListener('click',e=>{if(!e.target.closest('[data-route="gameplay"]'))return;e.preventDefault();e.stopImmediatePropagation();window.review.s.page='gameplay';window.review.s.modal=null;window.reviewAct('__visual_preview__');sync();},true);
 const observer=new MutationObserver(sync);observer.observe(document.getElementById('game'),{childList:true});sync();
 window.addEventListener('resize',()=>requestAnimationFrame(fitGameplay));
})();
