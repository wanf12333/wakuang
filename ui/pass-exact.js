/* Portrait-free, swipeable VIP membership cards. */
(()=>{
 const previous=window.productionUI;
 const compact=value=>Number.isInteger(value)?String(value):String(value).replace(/\.0$/,'');
 const countdown=hours=>{const minutes=Math.max(0,Math.ceil(hours*60)),hh=String(Math.floor(minutes/60)).padStart(2,'0'),mm=String(minutes%60).padStart(2,'0');return `${hh}:${mm}`;};
 window.productionUI={...previous,modal(c){
  if(c.s.modal!=='pass')return previous.modal(c);
  const {engine,btn,img}=c,vip=engine.vipInfo(),valid=engine.pass(),watched=engine.passProgress().today,tiers=engine.vipTiers(),next=vip.next;
  const remaining=countdown(engine.passRemaining());
  const initialLevel=Math.max(1,Math.min(5,vip.level||1));
  const currentTier=tiers.find(tier=>tier.level===vip.level);
  const progressStart=currentTier?.ads||0;
  const progressMax=next?Math.max(1,next.ads-progressStart):1;
  const progressValue=next?Math.max(0,Math.min(progressMax,vip.totalAds-progressStart)):1;
  const progressCopy=next?`再看 ${Math.max(0,next.ads-vip.totalAds)} 次升级 VIP${next.level}`:'已达最高等级';
  const progressGoal=`<b class="vip-progress-value" aria-label="${progressCopy}">${next?progressValue+' / '+progressMax:vip.totalAds+' / '+(currentTier?.ads||vip.totalAds)}</b>`;
  const slides=tiers.map(tier=>{
   const unlocked=tier.level<=vip.level,current=tier.level===vip.level;
   const benefits=[
    ['assets/visual/ledger-icon-v2.png','账房利息','借据收益','+'+(tier.level*10)+'%'],
    ['assets/icons/coin.png','广告奖励','每次观看',tier.gold.toLocaleString('en-US')],
    ['assets/icons/diamond.png','稀有掉落','品质权重','+'+Math.round(tier.drop*100)+'%'],
    ['assets/visual/achievement-icon-v2.png','在线奖励','领取倍率','×'+compact(2*tier.online)+'～'+compact(4*tier.online)],
   ];
   const state=current?(valid?'当前生效':'待激活'):unlocked?'已解锁':`${tier.ads}次解锁`;
   return `<article class="vip-slide ${unlocked?'is-unlocked':''} ${current?'is-current':''}" data-vip-level="${tier.level}" ${tier.level===initialLevel?'data-vip-current="true"':''} aria-label="VIP ${tier.level}">
    <section class="vip-hero">
     <div class="vip-hero-copy"><small>MOLE MINE · VIP MEMBER</small><div><strong>VIP ${tier.level}</strong><span class="vip-card-state">${state}</span></div><p class="vip-hero-countdown"><span>权益剩余时间</span><b data-vip-modal-countdown>${remaining}</b></p></div>
     <div class="vip-hero-emblem"><img class="vip-hero-badge" src="assets/icons/vip_badge-v2.png" alt=""><b>V${tier.level}</b></div>
    </section>
    <nav class="vip-levels" aria-label="查看VIP等级">${tiers.map(t=>`<button type="button" class="${t.level<=vip.level?'is-earned':''}" data-vip-page="${t.level}" aria-label="查看VIP ${t.level}，累计${t.ads}次广告解锁"><span>VIP${t.level}</span><small>${t.ads}次</small></button>`).join('')}</nav>
    <section class="vip-account-progress">
     <div><span>成长进度</span>${progressGoal}</div>
     <progress max="${progressMax}" value="${progressValue}" aria-label="${progressCopy}"></progress>
    </section>
    <section class="vip-benefits-section">
     <header><div><small>MEMBER BENEFITS</small><h3>VIP ${tier.level} 专属权益</h3></div></header>
     <div class="vip-benefit-grid">${benefits.map(([icon,name,note,value])=>`<div class="vip-benefit"><i aria-hidden="true"><img src="${icon}" alt=""></i><span><b>${name}</b><small>${note}</small></span><strong>${value}</strong></div>`).join('')}</div>
    </section>
   </article>`;
  }).join('');
  return `<div class="pass-exact vip-deck" data-initial-vip="${initialLevel}">
   <div class="vip-composite"><div class="vip-carousel-shell"><div class="vip-carousel" tabindex="0" aria-label="VIP等级卡片，可左右滑动">${slides}</div></div></div>
   <div class="pass-bottom">
    <div class="vip-daily-status ${watched?'is-done':'is-pending'}"><b>${watched?'今日已鼓励':'今日未鼓励'}</b><span>${watched?'已获得':'鼓励后'} VIP时间 <strong>+24小时</strong></span></div>
    ${btn(img('radar_ad')+(watched?'今日已鼓励':'鼓励下'),'home.miner_pass.renew_ad','','',watched)}
   </div>
  </div>`;
 }};

 let countdownTimer=0;
 const syncCountdown=()=>{const engine=window.review;if(!engine)return;const valid=engine.pass(),value=countdown(engine.passRemaining());document.querySelectorAll('.vip-deck').forEach(root=>{root.classList.toggle('is-expired',!valid);root.querySelectorAll('[data-vip-modal-countdown]').forEach(node=>node.textContent=value);const state=root.querySelector('[data-vip-current] .vip-card-state');if(state)state.textContent=valid?'当前生效':'待激活';});};
 window.VIPPassUI={mount(){
  syncCountdown();
  if(!countdownTimer)countdownTimer=setInterval(syncCountdown,1000);
  document.querySelectorAll('.vip-deck:not([data-vip-mounted])').forEach(root=>{
   root.dataset.vipMounted='true';
   const rail=root.querySelector('.vip-carousel'),slides=[...root.querySelectorAll('.vip-slide')],dots=[...root.querySelectorAll('[data-vip-page]')];
   let index=Math.max(0,slides.findIndex(slide=>slide.hasAttribute('data-vip-current'))),frame=0;
   const update=()=>{
    slides.forEach((slide,i)=>slide.setAttribute('aria-hidden',i===index?'false':'true'));
    dots.forEach(dot=>{const page=Number(dot.dataset.vipPage)-1,active=dot.closest('.vip-slide')===slides[index];dot.classList.toggle('is-selected',page===index);dot.setAttribute('aria-current',active&&page===index?'true':'false');dot.tabIndex=active?0:-1});
   };
   const go=(target,smooth=true)=>{
    index=Math.max(0,Math.min(slides.length-1,target));
    rail.scrollTo({left:slides[index].offsetLeft,behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto'});
    update();
   };
   dots.forEach(dot=>dot.addEventListener('click',()=>go(Number(dot.dataset.vipPage)-1)));
   rail.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const nearest=slides.reduce((best,slide,i)=>Math.abs(slide.offsetLeft-rail.scrollLeft)<Math.abs(slides[best].offsetLeft-rail.scrollLeft)?i:best,0);if(nearest!==index){index=nearest;update();}})},{passive:true});
   rail.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();go(index+(event.key==='ArrowRight'?1:-1));}});
   requestAnimationFrame(()=>go(index,false));
  });
 }};
})();
