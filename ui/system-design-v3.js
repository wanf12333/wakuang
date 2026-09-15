/* Reuses project art and real actions; this module never changes resource rules. */
(()=>{
 const prior=window.productionUI;
 window.productionUI={...prior,modal(c){
  if(c.s.modal==='reward')return c.s.reward?.length?`<div class="sv-rewards"><img class="sv-reward-hero" src="assets/popup-v2/coin-pouch.png" alt="奖励"><p>本次收获</p><div class="reward-list">${c.s.reward.map(r=>`<div class="reward-item">${c.img(r[0],'')}<div>${c.esc(r[1])}</div><b>× ${c.num(r[2])}</b></div>`).join('')}</div></div>`:'<div class="reward-empty">暂无奖励</div>';
  if(c.s.modal!=='mission')return prior.modal(c);
  const {s,engine,btn,esc,num}=c,m=engine.currentMission();
  if(!m)return '<div class="sv-mission"><div class="sv-mission-hero"><img src="assets/popup-v2/medal.png" alt=""><div><small>矿工逆袭</small><h3>主线目标已完成</h3><p>继续探索更深处的矿藏。</p></div></div></div>';
  const materials=m.action==='home.building.open'?engine.buildingMaterials(Math.min(6,s.buildingLevel+1)):[];
  return `<div class="sv-mission"><div class="sv-mission-hero"><img src="assets/popup-v2/medal.png" alt="目标勋章"><div><small>矿工逆袭 · 主线目标</small><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p></div></div><div class="mission-progress">已通关 ${num(s.highestCleared||0)} 关 · 最深 ${num(s.depth)}m<br>矿镐 Lv.${engine.equipment().level} · ${esc(engine.buildingInfo().name)}${m.id==='debt'?'<br>剩余债务 '+num(s.debt)+' 金币':''}</div>${materials.length?`<div class="mission-materials">${materials.map(x=>`<span>${esc(x.name)} ${x.owned}/${x.amount} · ${engine.levelInfo(Math.ceil(MoleReview.ITEMS[x.index][4]/10)).depth}m起产出</span>`).join('')}</div>`:''}<div class="sv-mission-reward"><span>目标奖励</span><b>${num(m.reward)} 金币</b></div>${m.done(engine)?btn('领取目标奖励','progression.mission.claim',m.id):btn('前往完成','progression.mission.go')}</div>`;
 }};
})();
