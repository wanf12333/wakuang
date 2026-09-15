/* Small additions to existing panels; no new art atlas required. */
(()=>{
 HomePrison.residenceNames=MineProgression.HOUSES;
 const prior=window.productionUI;
 window.productionUI={...prior,
 screen(c){
  const {s,engine,esc,img}=c;
  if(s.page==='home'){
   const html=prior.screen(c),m=engine.currentMission();
   const goal=m?`<button class="hc-control journey-goal" data-action="progression.mission.open"><small>当前目标</small><strong>${esc(m.title)}</strong><span>${m.done(engine)?'已完成 · 领奖':'查看进度'} ›</span></button>`:`<div class="journey-goal"><strong>地心传奇 · 五段远征已完成</strong></div>`;
   return html.replace('<div class="hc-interface">','<div class="hc-interface">'+goal);
  }
  if(s.page!=='gameplay')return prior.screen(c);
  const zone=engine.zone(),treasures=engine.treasures();
  return `<div class="journey-play"><header><strong>第 ${s.level.toLocaleString()} 关 · ${s.level*10}m</strong><span>${zone.name}</span></header><div class="journey-play-count"><b>矿藏 ${engine.found()} / ${s.n}</b><b>剩余 ${s.shovels} 铲</b></div><p class="journey-rule">每行一份矿藏；空格数字＝同一行离矿藏的格数。<br>单击标记 · 双击挖掘</p><div class="board journey-board" style="--n:${s.n}">${Array.from({length:s.n*s.n},(_,i)=>{const dug=s.dug.includes(i),found=dug&&treasures.includes(i);return `<button class="tile ${dug?'dug':''} ${s.flags.includes(i)?'flagged':''} ${s.hint===i?'hint':''}" data-tile="${i}" aria-label="第${Math.floor(i/s.n)+1}行第${i%s.n+1}列${dug?found?'，矿藏':'，距离'+engine.distanceClue(i):''}">${found?img(engine.treasureItem(i)[0],''):dug?`<strong class="distance-clue">${engine.distanceClue(i)}</strong>`:''}</button>`;}).join('')}</div><p class="journey-zone-note">${zone.note}</p><button class="game-btn" data-action="gameplay.radar.watch_ad">雷达定位 · 看广告</button></div>`;
 },
 modal(c){
  const {s,engine,btn,esc,num}=c;
  if(s.modal==='mission'){
   const m=engine.currentMission();if(!m)return '<p>全部主线目标已完成。</p>';
   const materials=m.action==='home.building.open'?engine.buildingMaterials(Math.min(6,s.buildingLevel+1)):[];
   return `<div class="journey-mission"><small>矿工逆袭 · 主线目标</small><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p><div class="mission-progress">已通关 ${num(s.highestCleared||0)} 关 · 最深 ${num(s.depth)}m<br>矿镐 Lv.${engine.equipment().level} · ${esc(engine.buildingInfo().name)}${m.id==='debt'?'<br>剩余债务 '+num(s.debt)+' 金币':''}</div>${materials.length?`<div class="mission-materials">${materials.map(m=>`<span>${esc(m.name)} ${m.owned}/${m.amount} · ${engine.levelInfo(Math.ceil(MoleReview.ITEMS[m.index][4]/10)).depth}m起产出</span>`).join('')}</div>`:''}<p>目标奖励：${num(m.reward)} 金币</p>${m.done(engine)?btn('领取目标奖励','progression.mission.claim',m.id):btn('前往完成','progression.mission.go')}</div>`;
  }
  if(s.modal==='tutorial')return `<div class="journey-mission"><h3>看线索，找矿藏</h3><p>每一行只有一份矿藏，位置每局变化。</p><p>挖到空格会出现数字：例如“2”，表示矿藏在这一行左边或右边两格的位置。超出棋盘的一侧可以排除。</p><p>单击插旗做标记，双击消耗一铲挖掘。找到全部矿藏即可通关。</p>${btn('开始勘探','nav.back')}</div>`;
  if(s.modal==='failed')return `<div class="journey-mission"><h3>铲子用完了</h3><p>已找到 ${engine.found()}/${s.n} 份矿藏。可以继续勘探，或带回已找到的矿石。</p>${btn('补充2铲 · 看广告','gameplay.fail.revive')}${btn('带回矿石','progression.salvage')}<small>前10关免费采矿，金币不足也能继续。</small></div>`;
  if(s.modal==='lockedLevel'){
   const target=s.lockedTargetLevel||s.level,chronological=target>(s.highestCleared||0)+1;
   return `<div class="journey-mission"><h3>第 ${num(target)} 关 · ${num(target*10)}m</h3><p>${chronological?'请先完成第 '+num((s.highestCleared||0)+1)+' 关，再继续深入。':'矿镐尚未达到这一深度，请前往强化。'}</p><p>当前矿镐可达 ${num(engine.equipment().maxDepth)}m</p>${chronological?btn('前往下一关','progression.level.resume'):btn('前往强化','home.workshop.open')}</div>`;
  }
  let html=prior.modal(c);
  if(s.modal==='buildingUpgrade'){const next=engine.buildings()[s.buildingLevel];if(next)html+=`<p class="journey-zone-note">进阶条件：通关第 ${next.requiredClear} 关${next.level===2?'，并还清债务':''}。</p>`;}
  if(s.modal==='loan')html+=`<p class="journey-zone-note">风险指本次合同到期本金全损概率；信用为档案评级，不替代风险。签约后利率、风险与结果锁定。</p>`;
  if(s.modal==='note'){const n=engine.note();if(n?.riskRulesVersion)html+=`<p class="journey-zone-note">签约信用 ${esc(n.credit)} · 锁定风险 ${Number((n.risk*100).toFixed(2))}%${n.status==='runaway'?' · 本金已在签约时扣除，本次不重复扣款':''}</p>`;}
  return html;
 }};
})();
