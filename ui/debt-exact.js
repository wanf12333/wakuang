/* Concept-specific debt screen. Artwork has no baked figures or controls. */
(()=>{const previous=window.productionUI;
 const names=['开始还款','逐步偿还','债务减半','即将还清','全部还清'];
 window.productionUI={...previous,screen(c){if(c.s.page!=='debt')return previous.screen(c);const {s,img,btn,num}=c;
 const total=s.debtTotal||1000000,paid=Math.max(0,total-s.debt),hut=paid>=5000,cleared=s.debt===0;
 const thresholds=[0,Math.min(5000,total*.25),total*.5,total*.9,total];
 const stage=cleared?4:paid>=thresholds[3]?3:paid>=thresholds[2]?2:paid>=thresholds[1]?1:0,next=Math.min(4,stage+1);
 const progress=cleared?100:(stage+(paid-thresholds[stage])/(thresholds[next]-thresholds[stage]))*25;
 const sprite=i=>{const e=[0,1,1,2,3][i];return `<span class="debt-stage-icon panda-stage" data-expression="${e}" data-outfit="${i===4?'miner':'prisoner'}" style="--panda-x:${e%2*100}%;--panda-y:${Math.floor(e/2)*100}%" role="img" aria-label="${names[i]}，${i===4?'脱下囚服，矿工装':'穿着囚服'}：${['哭丧','苦笑','得意','开心'][e]}"></span>`;};
 return `<div class="debt-exact"><section class="debt-totals"><div><span>总债务</span><b>${num(total)}</b></div><div><span>已偿还</span><b class="paid">${num(paid)}</b></div><div><span>剩余</span><b>${num(s.debt)}</b></div></section>
 <section class="debt-milestones"><div class="debt-stage-icons">${names.map((n,i)=>sprite(i)).join('')}</div><div class="debt-track"><i style="width:${progress}%"></i></div><div class="debt-stage-labels">${names.map((n,i)=>`<div><i class="${i<=stage?'lit':''}"></i><span>${n}${i===4?'<small>解锁放贷业务</small>':''}</span></div>`).join('')}</div></section>
 <div class="debt-near">${cleared?'全部债务已还清 · 持证解锁放贷':`再还 <b>${num(Math.ceil(thresholds[next]-paid))}</b> 金币 · ${names[next]}`}</div>
 <section class="debt-final-goal"><span class="debt-contract"><img src="assets/visual/debt-contract.png" alt="握手合同"><b>放贷合同</b></span><div><small>★ ★ 最终目标 ★ ★</small><h3>还清全部债务</h3><strong>解锁放贷业务 · VIP提升利息</strong></div></section>
 <section class="debt-outfit-comparison ${cleared?'is-cleared':''}" aria-label="还债阶段着装对比"><div class="debt-outfit-card"><span class="debt-outfit-label">${cleared?'当前 · 全部还清':'当前 · '+names[stage]}</span>${sprite(stage)}<small>${cleared?'脱下囚服 · 自由生活':'身穿囚服 · 努力还债'}</small></div>${!cleared?`<span class="debt-outfit-arrow" aria-hidden="true">➜</span><div class="debt-outfit-card is-future"><span class="debt-outfit-label">下一阶段 · ${names[next]}</span>${sprite(next)}<small>${next===4?'脱下囚服 · 入住新家':'继续还债 · 暂穿囚服'}</small></div>`:''}</section>
 <section class="debt-payment"><div class="debt-payment-right"><h3>还款金额</h3><div class="quantity">${btn('−','debt.amount.minus','','small',s.amount<=100)}<output>${num(s.amount)}</output>${btn('+','debt.amount.plus','','small',s.amount>=Math.min(s.coins,s.debt))}${btn('最大','debt.amount.max','','small',!s.debt)}</div></div></section>
 <div class="debt-submit">${btn(cleared?'进入放贷':'确认手动偿还',cleared?'home.lending.open':'debt.repay.open','','',!cleared&&(s.amount<=0||s.coins<=0))}</div></div>`;
 },modal(c){const {s,btn,img,num,engine}=c;
 if(!['repay','repaid','debtCleared'].includes(s.modal))return previous.modal(c);
 const confirm=s.modal==='repay',amount=s.snapshot?.amount||0;
 return `<div class="debt-dialog-hero"><img src="assets/visual/debt-contract.png" alt="放贷合同"><div><span>${confirm?'本次偿还':s.modal==='repaid'?'偿还成功':'全部债务已还清'}</span>${confirm?`<strong>${img('coin')} ${num(amount)}</strong>`:'<strong class="debt-dialog-success">✓</strong>'}</div></div><div class="debt-dialog-summary"><div><span>${confirm?'偿还后债务':'剩余债务'}</span><b>${num(confirm?s.debt-amount:s.debt)}</b></div><div><span>${confirm?'偿还后金币':'可用金币'}</span><b>${num(confirm?s.coins-amount:s.coins)}</b></div></div>${s.modal==='debtCleared'?`<p class="debt-dialog-pass">还清债务即可办理放贷</p>`:''}${confirm?`<div class="actions">${btn('偿还 '+num(amount)+' 金币','debt.repay.commit')}</div>`:s.modal==='debtCleared'?`<div class="actions">${btn('进入放贷','home.lending.open')}</div>`:''}`;
 }};
})();
