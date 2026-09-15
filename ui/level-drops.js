(function(root,factory){
'use strict';
const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MoleDrops=api;
})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
// 暂定 V6 评审模型：关卡深度与概率尚不是正式 Cocos 配置。
// 物品名称、品质、图标及首次出现深度均从现有 ITEMS 传入，不另建目录。
const LEVEL_DEPTHS=Object.freeze(Array.from({length:50000},(_,i)=>(i+1)*10));
const QUALITY_ORDER=Object.freeze(['F','E','D','C','B','A','S']);
const STAGE_WEIGHTS=Object.freeze([
 Object.freeze({through:10,F:80,E:20}),
 Object.freeze({through:50,F:60,E:20,D:20}),
 Object.freeze({through:200,F:40,E:20,D:25,C:12,B:2,A:1}),
 Object.freeze({through:1000,F:25,E:20,D:22,C:15,B:8,A:9,S:1}),
 Object.freeze({through:50000,F:15,E:15,D:20,C:18,B:10,A:18,S:4})
]);
function levelDrops(items,level){
 if(!Number.isInteger(level)||level<1||level>LEVEL_DEPTHS.length)return {level,depth:null,provisional:true,groups:[]};
 const depth=LEVEL_DEPTHS[level-1],weights=STAGE_WEIGHTS.find(stage=>level<=stage.through);
 const pool=items.map((item,index)=>({index,icon:item[0],name:item[1],quality:item[2],firstDepth:item[4]})).filter(item=>item.icon!=='treasure_chest'&&item.firstDepth<=depth);
 const groups=QUALITY_ORDER.map(quality=>({quality,weight:weights[quality]||0,items:pool.filter(item=>item.quality===quality)})).filter(group=>group.weight>0&&group.items.length>0);
 const total=groups.reduce((sum,group)=>sum+group.weight,0);
 if(!total)return {level,depth,provisional:true,groups:[]};
 // 最大余数法，以万分比整数存储，避免展示与抽取的浮点舍入差异。
 const allocations=groups.map((group,index)=>{const numerator=group.weight*10000;return {index,chanceBps:Math.floor(numerator/total),remainder:numerator%total};});
 let remaining=10000-allocations.reduce((sum,row)=>sum+row.chanceBps,0);
 const order=[...allocations].sort((a,b)=>b.remainder-a.remainder||a.index-b.index);
 for(let i=0;i<remaining;i++)order[i].chanceBps++;
 return {level,depth,provisional:true,groups:groups.map((group,index)=>({quality:group.quality,chanceBps:allocations[index].chanceBps,items:group.items}))};
}
function unit(random){const value=random();if(!Number.isFinite(value)||value<0||value>=1)throw new RangeError('Drop random value must be in [0, 1).');return value;}
function roll(profile,random=Math.random){
 if(!profile.groups.length||profile.groups.reduce((sum,group)=>sum+group.chanceBps,0)!==10000)throw new RangeError('A complete level drop profile is required.');
 let ticket=Math.floor(unit(random)*10000);
 const group=profile.groups.find(candidate=>{if(ticket<candidate.chanceBps)return true;ticket-=candidate.chanceBps;return false;});
 // 每份宝藏只抽取一件；先抽品质，再在该品质的已解锁物品内等概率抽取。
 return group.items[Math.floor(unit(random)*group.items.length)];
}
return {LEVEL_DEPTHS,QUALITY_ORDER,STAGE_WEIGHTS,levelDrops,roll};
});
