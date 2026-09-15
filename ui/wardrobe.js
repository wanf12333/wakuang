(()=>{const previous=window.productionUI;
const art=item=>`<img src="assets/visual/${item.art}" alt="${item.name}">`;
window.productionUI={...previous,modal(c){if(c.s.modal!=='wardrobe')return previous.modal(c);const {engine:e,s,num,img}=c,slot=s.wardrobeTab||'clothes',items=e.wardrobeCatalog().filter(x=>x.slot===slot),selected=items.find(x=>x.id===s.wardrobeSelected)||items[0],owned=e.wardrobeOwned(selected.id),equipped=e.wardrobeEquipped(slot).id===selected.id,other=e.wardrobeEquipped(slot==='clothes'?'helmet':'clothes'),revision=s.wardrobeRevision||0;
return `<div class="wardrobe-panel"><div class="tabs" role="tablist">${[['clothes','衣服'],['helmet','安全帽']].map(([id,label])=>`<button class="game-btn ${slot===id?'selected':'secondary'}" role="tab" aria-selected="${slot===id}" data-action="wardrobe.tab" data-payload="${id}">${label}</button>`).join('')}</div><div class="wardrobe-preview">${art(selected)}<h3>${selected.name} <small>${selected.grade}</small></h3><b>C级及以上矿石权重 +${Math.round(selected.boost*100)}%</b><small class="wardrobe-theme">${selected.theme||'永久款式'}</small></div><div class="wardrobe-grid">${items.map(item=>`<button class="wardrobe-item ${item.id===selected.id?'is-selected':''}" data-action="wardrobe.select" data-payload="${item.id}" aria-pressed="${item.id===selected.id}">${art(item)}<em class="wardrobe-item-name">${item.name}</em><b>${item.grade}</b><span>${e.wardrobeEquipped(slot).id===item.id?'已穿戴':e.wardrobeOwned(item.id)?'已拥有':num(item.cost)}</span></button>`).join('')}</div><p class="wardrobe-total">穿戴后衣橱加成 +${Math.round((selected.boost+other.boost)*100)}%</p><button class="game-btn wardrobe-buy" data-action="${owned?'wardrobe.equip':'wardrobe.buy.commit'}" data-payload="${selected.id}:${revision}" ${equipped||(!owned&&s.coins<selected.cost)?'disabled':''}>${equipped?'已穿戴':owned?'穿戴':s.coins<selected.cost?'金币不足':'购买并穿戴'}${owned?'':' · '+img('coin')+' '+num(selected.cost)}</button></div>`;
}};
window.WardrobeUI={sync(){
 const e=window.review;if(!e)return;
 const clothes=e.wardrobeEquipped('clothes'),helmet=e.wardrobeEquipped('helmet');
 document.querySelectorAll('.hero-rig').forEach(rig=>{
  rig.querySelector('.hero-wardrobe-clothes')?.remove();
  // Tint the original body layer, not a second sprite that can drift between frames.
  rig.dataset.clothes=clothes.id;
  const hat=rig.querySelector('.hero-helmet');if(hat)hat.style.backgroundImage=`url(assets/visual/${helmet.art})`;
 });
}};
})();
