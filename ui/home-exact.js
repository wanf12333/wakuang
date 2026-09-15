/* Home inside the original interactive canvas. Art is layered; values and
   actions and building progression belong to ReviewEngine. */
(()=>{
 const prior=window.productionUI;
 const art='assets/home-layered/concept-debt-reference.png';
 function shape(kind,w,h){
  if(kind==='ellipse')return `<ellipse cx="${w/2}" cy="${h/2}" rx="${w/2-2}" ry="${h/2-1}"/>`;
  return `<rect x="2" y="2" width="${w-4}" height="${h-4}" rx="${kind==='pill'?h*.45:28}"/>`;
 }
 function control(id,label,x,y,w,h,kind,action,live='',state=''){
  const entries={ranking:['trophy','排行榜'],gems:['amethyst','宝石交易所'],warehouse:['warehouse','仓库图鉴'],pass:['vip_badge-v2','VIP证'],guild:['guild_shield','矿工协会']};
  if(entries[id]){const [icon,title]=entries[id],display=id==='pass'&&live?live:title;return `<button type="button" class="hc-control hc-${id} hc-native-entry ${state}" data-action="${action}" aria-label="${label}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><img src="${id==='gems'?'assets/visual/gem-exchange-icon-v2.png':'assets/icons/'+icon+'.png'}" alt=""><span ${id==='pass'?'data-vip-countdown':''}>${display}</span></button>`;}
  const tag=action?'button':'span';
  const source=`<image href="${art}" x="${-x}" y="${-y}" width="941" height="1672"/>`;
  return `<${tag} class="hc-control hc-${id}" ${action?`type="button" data-action="${action}"`:'role="img"'} aria-label="${label}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><clipPath id="hc-clip-${id}">${shape(kind,w,h)}</clipPath></defs><g clip-path="url(#hc-clip-${id})">${source}${live}</g></svg></${tag}>`;
 }
 function text(value,x,y,size,fill='#fff1c8',stroke='#533713'){
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${size>30?3:1}" paint-order="stroke fill" text-anchor="middle" font-weight="bold">${value}</text>`;
 }
 function passCountdown(hours){const minutes=Math.max(0,Math.ceil(hours*60)),h=Math.floor(minutes/60),m=minutes%60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');}
 window.productionUI={...prior,
  hud(c){return c.s.page==='home'?'':prior.hud?.(c)},
  compare(s){
   if(s.page!=='home'||s.modal)return prior.compare?.(s);
   document.getElementById('concept-compare').hidden=false;
   document.getElementById('concept-image').src=art;
   document.getElementById('concept-note').textContent='首页保留固定背景与概念图 UI；鼹鼠在监狱栏杆后左右走动。点击建筑打开横向升级列表，消耗金币升级并解锁更深关卡；“开始挖矿”打开金币选关弹窗。';
  },
  modal(c){
   return prior.modal(c);
  },
  screen(c){
   if(c.s.page!=='home')return prior.screen(c);
   const {s,num,engine}=c,building=engine.buildingInfo(),buildingLevel=building.level;
   const guildLive=`<rect x="20" y="19" width="196" height="78" rx="14" fill="#588321" stroke="#9ba441" stroke-width="3"/><image href="assets/icons/guild_shield.png" x="25" y="24" width="67" height="67"/>${text('矿工协会',155,65,26)}`;
   return `<section class="home-concept-scene" aria-label="分层主界面">
    <img class="hc-background" src="assets/home-layered/background-native-platform-v3.png" alt="牢房平台、电梯井与深层矿区背景">
    <button type="button" class="hc-architecture" data-action="home.building.open" data-building-level="${buildingLevel}" aria-label="建筑升级，当前 Lv.${buildingLevel}，已解锁至 ${building.maxDepth} 米">${HomePrison.render({level:buildingLevel,expression:HomePrison.expression(s),speech:true,freed:s.debt===0})}<span class="building-entry-label">Lv.${buildingLevel} · 升级</span></button>
    <img class="hc-character" src="assets/visual/mole-full.png" alt="鼹鼠矿工">
    ${HomeBorrowers.render(s)}
    <div class="hc-interface">
    ${HomeProfile.render(c)}
    <div class="native-coins" aria-label="金币 ${num(s.coins)}"><img src="assets/native-ui/coin.png" alt=""><span>${num(s.coins)}</span></div>
    ${HomeStatusCard.render(c)}
    <button class="hc-control hc-native-entry hc-checkin" type="button" data-action="home.checkin.open" aria-label="签到"><img src="assets/visual/checkin-icon-v2.png" alt=""><span>签到</span></button>
    <button class="hc-control hc-native-entry hc-achievements" type="button" data-action="home.achievements.open" aria-label="成就"><img src="assets/visual/achievement-icon-v2.png" alt=""><span>成就</span></button>
    <button class="hc-control hc-native-entry hc-wardrobe" type="button" data-action="home.wardrobe.open" aria-label="衣橱"><img src="assets/visual/wardrobe-icon-v2.png" alt=""><span>衣橱</span></button>
    <button class="hc-control hc-native-entry hc-homestead" type="button" data-action="home.building.open" aria-label="家园"><i class="homestead-icon" aria-hidden="true"></i><span>家园</span></button>
    ${control('ranking','排行榜',707,1067,234,133,'round','home.ranking.open')}
    ${control('gems','宝石交易所',707,1203,234,114,'round','home.locked_feature')}
    ${control('warehouse','仓库图鉴',707,1319,234,117,'round','home.warehouse.open')}
    ${control('pass','VIP证，'+(engine.pass()?'已激活，剩余 '+passCountdown(engine.passRemaining()):'未激活'),707,1439,234,113,'round','home.miner_pass',passCountdown(engine.passRemaining()),engine.pass()?'is-vip-active':'is-vip-inactive')}
    ${control('guild',s.joined?'矿工协会':'申请加入协会',707,1556,234,116,'round','home.guild.open',guildLive)}
    <button class="hc-control hc-native-entry hc-beauty" type="button" data-action="home.beauty.open" aria-label="美容院"><img src="assets/visual/beauty-icon-v2.png" alt=""><span>美容院</span></button>
    ${HomeStartButton.render({currentDepth:s.depth,maxDepth:engine.equipment().maxDepth})}
    </div>
   </section>`;
  }
 };
 let vipClock=0;
 function syncVipCountdown(){const engine=window.review;if(!engine)return;const active=engine.pass(),value=passCountdown(engine.passRemaining());document.querySelectorAll('.hc-pass').forEach(entry=>{entry.classList.toggle('is-vip-active',active);entry.classList.toggle('is-vip-inactive',!active);entry.setAttribute('aria-label',active?'VIP证，已激活，剩余 '+value:'VIP证，未激活');const output=entry.querySelector('[data-vip-countdown]');if(output)output.textContent=value;});}
 window.HomeVIPUI={mount(){syncVipCountdown();if(!vipClock)vipClock=setInterval(syncVipCountdown,1000)}};
})();
