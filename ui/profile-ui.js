(()=>{
 const profileLook=(s,engine)=>{
  const list=engine.beautyCatalog?.()||[];
  return (s.profileAvatarManual&&list.find(x=>x.id===s.profileAvatarId))||engine.beautyActive?.()||list.find(x=>x.id==='F')||list[0];
 };
 const face=(look,cls='')=>window.BeautyUI?.face?window.BeautyUI.face(look,cls):`<span class="beauty-face ${cls}" role="img" aria-label="${look?.name||'默认头像'}"></span>`;
 function render(c){
  const {s,engine,esc}=c;
  const member=s.members?.find(x=>x.id===0);
  const name=s.nickname||'深岩小矿工';
  const role=member?.role||'矿洞探险家';
  const vip=engine.pass();
  const look=profileLook(s,engine);
  return `<button type="button" class="hc-control home-profile-entry" data-action="home.profile.open" aria-label="角色档案，${esc(name)}，点击查看角色详情">
   ${face(look,'profile-entry-avatar')}
   <span class="profile-entry-copy"><strong>${esc(name)}</strong><small>${esc(role)} · ${vip?'VIP有效':'普通矿工'}</small><em>查看角色档案</em></span>
   <i class="profile-entry-arrow" aria-hidden="true">›</i>
  </button>`;
 }
 function modal(c){
  const {s,engine,img,num,esc}=c;
  const member=s.members?.find(x=>x.id===0),name=s.nickname||'深岩小矿工',role=member?.role||'矿洞探险家',look=profileLook(s,engine),gear=engine.equipment(),wealthRank=s.emptyRank?'10,000+':'278';
  const rows=engine.achievementRows?.()||[];
  const completed=rows.filter(x=>x.value>=x.target).length;
  const total=rows.length;
  const highlights=rows.slice(0,4).map(row=>{
   const value=Math.max(0,Number(row.value)||0),target=Math.max(1,Number(row.target)||1),percent=Math.min(100,value/target*100);
   const suffix=row.id==='wealth'?'级':row.id==='levels'?'关':'种';
   return `<div class="profile-achievement-row"><div class="profile-achievement-copy"><strong>${esc(row.name)} · ${row.target}${suffix}</strong><span>${num(value)} / ${num(row.target)} · ${row.claimed?'已领取':value>=row.target?'已达成':'进行中'}</span><div class="profile-progress"><i style="width:${percent}%"></i></div></div><img src="assets/icons/coin.png" alt="金币"><b>${num(row.coins)}</b></div>`;
  }).join('');
  return `<div class="profile-sheet">
   <section class="profile-identity">
    <button type="button" class="profile-identity-avatar" data-action="profile.avatar.open" aria-label="更换头像">${face(look,'profile-identity-avatar-face')}<span>换头像</span></button>
    <div class="profile-identity-copy"><small>MINER PROFILE · 矿洞档案</small><button type="button" class="profile-name-edit" data-action="profile.nickname.edit" aria-label="修改昵称"><h3>${esc(name)}</h3><i aria-hidden="true">✎</i></button><p>${esc(role)} · ${engine.pass()?'VIP证有效':'VIP证未激活'}</p></div>
    <div class="profile-achievement-badge"><img src="assets/visual/achievement-icon-v2.png" alt="成就徽章"><strong>成就徽章</strong><small>${completed}/${total}</small></div>
   </section>
   <section class="profile-stat-grid" aria-label="角色数据">
    <div class="profile-stat">${img('coin')}<span>金币数量<strong>${num(s.coins)}</strong></span></div>
    <div class="profile-stat">${img('trophy')}<span>财富排名<strong>第 ${wealthRank} 名</strong></span></div>
    <div class="profile-stat">${img('shovel_energy')}<span>最深深度<strong>${num(s.depth)} 米</strong></span></div>
    <div class="profile-stat">${img('vip_badge-v2')}<span>VIP等级<strong>VIP ${num(engine.vipInfo().level)}</strong></span></div>
    <div class="profile-stat profile-pickaxe-stat"><img src="${gear.enhance?'assets/popup-v3/pickaxe-tier'+gear.enhance+'.png':'assets/popup-v2/pickaxe.png'}" alt="矿镐"><span>矿镐等级<strong>Lv.${num(gear.level)}</strong></span></div>
    <div class="profile-stat">${img('achievement-icon-v2','','visual')}<span>成就完成<strong>${completed} / ${total}</strong></span></div>
   </section>
   <section class="profile-achievements" aria-label="成就进度">
    <div class="profile-section-heading"><h3>成就进度</h3><b>${completed} / ${total} 已完成</b></div>
    <div class="profile-achievement-list">${highlights||'<p class="profile-empty">暂时还没有成就记录</p>'}</div>
   </section>
   <button type="button" class="game-btn profile-return" data-action="nav.back">返回矿洞</button>
  </div>`;
 }
 function avatarModal(c){
  const {s,engine}=c,list=engine.beautyCatalog?.()||[],current=profileLook(s,engine);
  return `<div class="profile-avatar-panel"><p class="profile-panel-note">头像沿用美容院的脸型资源，可随时切换，不消耗金币。</p><div class="profile-avatar-grid">${list.map(look=>`<button type="button" class="profile-avatar-choice ${look.id===current.id?'is-selected':''}" data-action="profile.avatar.select" data-payload="${look.id}" data-grade="${look.grade}" aria-label="${look.grade}级 ${look.name}" aria-pressed="${look.id===current.id}">${face(look,'profile-avatar-choice-face')}<b>${look.grade}</b><span>${look.name}</span>${look.id===current.id?'<i>当前</i>':''}</button>`).join('')}</div></div>`;
 }
 function nicknameModal(c){
  const {s,esc}=c;
  return `<div class="profile-nickname-editor"><p class="profile-panel-note">给矿工取一个响亮的名字吧，2–12 个字。</p><label class="profile-nickname-label">矿工昵称<input class="game-input" data-field="nicknameDraft" maxlength="12" value="${esc(s.nicknameDraft??s.nickname??'深岩小矿工')}" autofocus></label><div class="actions"><button class="game-btn secondary" data-action="nav.back">取消</button><button class="game-btn" data-action="profile.nickname.save">保存昵称</button></div></div>`;
 }
 window.HomeProfile=Object.freeze({render,modal,avatarModal,nicknameModal});
 const prior=window.productionUI;
 window.productionUI={...prior,modal(c){if(c.s.modal==='profile')return HomeProfile.modal(c);if(c.s.modal==='profileAvatar')return HomeProfile.avatarModal(c);if(c.s.modal==='profileNickname')return HomeProfile.nicknameModal(c);return prior.modal(c);}};
})();
