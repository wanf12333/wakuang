/* Two independent aid slots, sharing the concept card skin. */
(()=>{const prev=window.productionUI;window.productionUI={...prev,
 hud(c){return c.s.page==='aid'?'':prev.hud(c);},
 screen(c){
  if(c.s.page!=='aid')return prev.screen(c);
  const {s,engine,img,btn}=c;engine.syncAid();
  const header=MoleReview.guildModuleShell(c,'aid','aid-exact');
  const requests=engine.aidSlots().map((r,i)=>{
   const material=MoleReview.ITEMS[r.item],quantity=r.quantity||5;
   return `<section class="aid-concept-request" aria-label="我的申请 ${i+1}"><h3>我的申请 ${i+1}</h3><div class="aid-concept-resource">${img(material[0],'')}<div><strong>${material[1]}</strong><b>${r.ready?quantity:0}<small>/${quantity}</small></b></div></div><progress max="${quantity}" value="${r.ready?quantity:0}"></progress><span class="aid-concept-status">${r.ready?'物资已送达':r.posted?'预计完成 · '+engine.aidRemaining(i)+'分钟':'选择所需材料'}</span>${btn(r.ready?'领取物资':r.posted?'等待送达':'发布申请',r.ready?'extra.aid.collect':'extra.aid.request',i,'aid-slot-action',r.posted&&!r.ready)}</section>`;
  }).join('');
  const orders=engine.aidOrders().map((o,i)=>{const done=!!s.aidOrdersDone?.[i];return `<article><h3>${o.name}需要</h3>${img(o.icon,'')}<strong>${o.item}</strong><b class="aid-order-count">${done?o.total:o.received}<small>/${o.total}</small></b><progress max="${o.total}" value="${done?o.total:o.received}"></progress><span>贡献奖励</span><b class="aid-order-reward">${img('guild_shield')}${o.reward}</b>${btn(done?'已捐赠':'捐赠 '+(o.total-o.received)+' 个','extra.aid.order.donate',i,'',done)}</article>`;}).join('');
  return header+'</div>'+ `<div class="aid-content-scroll"><div class="aid-content-height"><div class="aid-concept"><div class="aid-own-grid">${requests}</div><h3 class="aid-concept-orders-title">矿友订单</h3><div class="aid-concept-orders">${orders}</div></div></div></div>`;
 }
};})();
