/* Reuse concept illustrations as SVG viewports, never flatten the interactive
   screen. Per-level gold entry fees are supplied by ReviewEngine. */
(()=>{
 const prior=window.productionUI;
 const compactDepth=depth=>depth>=1000?`${Number((depth/1000).toFixed(2))}k`:String(depth);
 const lockArt='<svg class="depth-lock-art" viewBox="124 162 182 166" role="img" aria-label="未解锁的山峰矿洞"><defs><clipPath id="depth-lock-art-clip"><ellipse cx="215" cy="253" rx="88" ry="90"/></clipPath></defs><image href="assets/visual/depth-locked-reference.png" width="413" height="745" clip-path="url(#depth-lock-art-clip)"/></svg>';
 window.productionUI={...prior,
  compare(s){if(!['levels','lockedLevel'].includes(s.modal))return prior.compare(s);document.getElementById('concept-compare').hidden=false;document.getElementById('concept-image').src='assets/visual/'+(s.modal==='levels'?'level-entry-reference.png':'depth-locked-reference.png');document.getElementById('concept-note').textContent='选关仅展示本关产出和各品质概率，复用仓库图标与品质。阶段深度映射及概率是新增的暂定评审配置，不是贸易解锁表；预览、挖出物和结算共用一份产出配置。入场仍按所选关卡支付金币。';},
  modal(c){
   const {s,engine,btn,img,num,esc}=c;
   if(['levels','levelDetails'].includes(s.modal)){
    const info=engine.levelInfo(),pageStart=Math.max(1,Math.min(49981,s.level-10));
    const tiles=Array.from({length:20},(_,i)=>{const level=pageStart+i,entry=engine.levelInfo(level),active=level===s.level;return `<button type="button" class="level-option ${active?'is-selected':''} ${entry.unlocked?'':'is-locked'}" data-action="gameplay.level.select" data-payload="${level}" aria-label="${entry.depth?entry.depth+'m':'后续矿层'}${entry.unlocked?'':entry.available?'，需完成前关并强化矿镐':'，未开放'}" aria-pressed="${active}"><span class="depth-ticks" aria-hidden="true"></span><strong>${compactDepth(entry.depth)}</strong><small>${entry.unlocked?'m':'🔒'}</small></button>`}).join('');
    const drops=engine.levelDrops(),rate=bps=>String(Number((bps/100).toFixed(2)))+'%';
    const displayGroups=MoleDrops.QUALITY_ORDER.map(quality=>drops.groups.find(g=>g.quality===quality)||{quality,chanceBps:0,items:MoleReview.ITEMS.map((item,index)=>({index,icon:item[0],name:item[1],quality:item[2],firstDepth:item[4]})).filter(item=>item.icon!=='treasure_chest'&&item.quality===quality)});
    const baseDrops=MoleDrops.levelDrops(MoleReview.ITEMS,s.level);
    const probabilityDelta=group=>{const base=baseDrops.groups.find(g=>g.quality===group.quality)?.chanceBps||0;const delta=base?Number(((group.chanceBps/base-1)*100).toFixed(2)):0;return `<small class="drop-rate-change ${delta>0?'is-positive':delta<0?'is-negative':''}" title="相对基础概率的变化">(${delta>=0?'+':''}${delta}%)</small>`;};
    const totalBoost=engine.passDropBoost()+(engine.beautyActive()?.boost||0)+engine.wardrobeBoost();
    const outputs=`<section class="level-drops" aria-label="关卡产出"><header class="depth-output-title"><span>各品质矿物</span><span>上下滑动查看全部</span></header><div class="drop-quality-list" tabindex="0" role="region" aria-label="各品质矿石产出概率">${displayGroups.map(group=>`<div class="drop-quality-row ${group.chanceBps===0?'is-zero':''}" data-quality="${group.quality}" data-chance-bps="${group.chanceBps}" title="${esc(group.items.map(item=>item.name).join('、'))} · ${group.quality}级总概率 ${rate(group.chanceBps)}"><b class="drop-quality-tag">${group.quality}级</b><span class="drop-bonus ${['C','B','A','S'].includes(group.quality)&&totalBoost>0?'is-active':''}" title="该品质掉落权重加成" aria-label="${group.quality}级权重加成 ${['C','B','A','S'].includes(group.quality)?Math.round(totalBoost*100):0}%">${['C','B','A','S'].includes(group.quality)&&totalBoost>0?'权重 +'+Math.round(totalBoost*100)+'%':'权重无加成'}</span><div class="drop-items">${group.items.map(item=>`<div class="drop-item" data-item-index="${item.index}" title="${esc(item.name)} · ${item.quality}级 · ${item.firstDepth}米首次出现">${img(item.icon)}<span>${esc(item.name)}</span></div>`).join('')}</div><strong class="drop-rate">${rate(group.chanceBps)} ${probabilityDelta(group)}</strong></div>`).join('')}</div></section>`;
    if(s.modal==='levelDetails')return `<div class="level-select-concept is-designed level-details"><div class="level-detail-depth">${compactDepth(info.depth)} m · 产出概率</div>${outputs}<button class="game-btn" data-action="nav.back">返回选择矿层</button></div>`;
    const insufficient=info.unlocked&&s.coins<info.coinCost,entryLabel=insufficient?'金币不足，需要 '+num(info.coinCost)+' 金币':'消耗 '+num(info.coinCost)+' 金币，进入第 '+s.level+' 关';
    const entryButton=`<button type="button" class="game-btn level-enter" data-action="gameplay.level.enter" aria-label="${entryLabel}" title="${entryLabel}" ${insufficient?'disabled':''}>${img('coin')}<span aria-hidden="true">开始挖矿 · ${num(info.coinCost)}</span></button>`;
    return `<div class="level-select-concept is-designed"><div class="depth-explore-layout"><section class="depth-column"><div class="depth-column-title">深度 <small>m</small></div><div class="depth-ruler"><div class="depth-ruler-focus" aria-hidden="true"></div><div class="level-options depth-ruler-scroll" tabindex="0" role="region" aria-label="上下滑动选择本页矿层深度">${tiles}</div></div><div class="depth-gesture-hint">第 ${s.level.toLocaleString()} 关 / 50,000</div></section></div><div class="level-output-summary"><span>本层产出</span><div>${drops.groups.flatMap(g=>g.items).slice(0,5).map(item=>img(item.icon)).join('')}</div><button type="button" data-action="gameplay.level.details">产出详情 ›</button></div><footer class="level-entry-footer">${entryButton}</footer></div>`;
   }
   if(s.modal==='lockedLevel'){
    const target=s.lockedTargetLevel||21,info=engine.levelInfo(target),building=engine.equipment();
    const row=(label,value,cls='')=>`<div><span>${label}</span><strong class="${cls}">${value}</strong></div>`;
    return `<div class="depth-lock-concept"><div class="depth-lock-heading">${info.available?'升级十字镐解锁':'后续矿层暂未开放'}</div><div class="depth-lock-medallion">${lockArt}<strong>第 ${target} 关${info.depth?' · '+num(info.depth)+' 米':''}</strong></div><section class="depth-lock-requirements">${row('当前十字镐','Lv.'+building.level)}${info.available?row('所需深度',num(info.depth)+' 米','is-short'):''}${row('已解锁深度',num(building.maxDepth)+' 米')}</section><div class="actions depth-lock-actions">${btn('知道了','nav.back','','secondary')}${info.available?btn('前往升级','home.workshop.open'):''}</div></div>`;
   }
   return prior.modal(c);
  }
 };
 window.LevelDepthRuler={mount(s){
  if(s.modal!=='levels')return;
  const el=document.querySelector('.depth-ruler-scroll');if(!el)return;
  const rows=[...el.querySelectorAll('.level-option')],step=108;
  el.scrollTop=Math.max(0,rows.findIndex(row=>Number(row.dataset.payload)===s.level))*step;
  let timer,interacting=false;
  for(const event of ['wheel','pointerdown','touchstart','keydown'])el.addEventListener(event,()=>{interacting=true;},{passive:true});
  el.addEventListener('scroll',()=>{
   if(!interacting)return;clearTimeout(timer);
   timer=setTimeout(()=>{
    if(!el.isConnected||window.review.s.modal!=='levels')return;
    const index=Math.max(0,Math.min(rows.length-1,Math.round(el.scrollTop/step))),row=rows[index];
    if(Number(row.dataset.payload)!==window.review.s.level){interacting=false;window.reviewAct(row.dataset.action,row.dataset.payload);}
   },220);
  },{passive:true});
 }};
})();
