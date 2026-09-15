/* Growth accounting is live; only the next configured benefit is previewed. */
(()=>{const prev=window.productionUI;window.productionUI={...prev,modal(c){
 if(c.s.modal!=='guildGrowth')return prev.modal(c);
 const {s,engine,img,num,esc,btn}=c,g=engine.guildGrowth();
 const perks={4:['treasure_chest','联合开采','矿石产出 +10%'],5:['shop','每日补给','限购次数 +1'],6:['ore_iron','物资互助','单次申请数量 +5']};
 const perk=perks[g.level+1];
 return `<div class="guild-growth-panel growth-simple"><header>${img('guild_shield','')}<strong>${esc(s.guildName)} <b>Lv.${g.level}</b></strong></header>
 <section class="growth-meter"><div><strong>${g.next?'升级至 Lv.'+(g.level+1):'已达最高等级'}</strong></div>
 ${g.next?`<p class="growth-needed">还需 <b>${num(g.remaining)}</b> 贡献</p><progress value="${g.total-g.floor}" max="${g.next-g.floor}"></progress><p>本级贡献 ${num(g.total-g.floor)} / ${num(g.next-g.floor)}</p>`:'<p>协会等级已满</p>'}</section>
 ${g.next?`<h3>下一等级权益</h3><div class="growth-perks">${perk?`<article>${img(perk[0],'')}<div><strong>${perk[1]}</strong><small>${perk[2]}</small></div></article>`:'<article><div><strong>暂无新增权益配置</strong></div></article>'}</div>${perk?'<p class="growth-disclaimer">权益预览 · 尚未生效</p>':''}`:''}
 ${g.next?`<footer>${btn('贡献金币','guild_shop.contribute.open')}</footer>`:''}</div>`;
}};})();
