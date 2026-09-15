(function(root){
 'use strict';
 const grades=['F','E','D','C','B','A','S'];
 const names=['洗尘换面','清爽笑脸','元气新颜','俊俏眉眼','魅力容颜','耀眼明星','猫咪本色'];
 const costs=[200,500,1200,3000,7000,15000,30000],minutes=[15,20,30,45,60,90,120],boosts=[0,.1,.25,.5,.8,1.2,2];
 const catalog=grades.map((grade,index)=>Object.freeze({id:grade,grade,index,name:names[index],cost:costs[index],minutes:minutes[index],boost:boosts[index]}));
 for(const [id,name,grade,art] of [
  ['meme-trainee','篮球练习生','S','beauty-meme-trainee-v1.webp'],
  ['meme-master','功夫宗师','S','beauty-meme-master-v1.webp'],
  ['meme-star','港风男神','S','beauty-meme-star-v1.webp'],
  ['meme-yujie','东北雨姐','S','beauty-meme-yujie-v1.webp']
 ]){const index=grades.indexOf(grade);catalog.push(Object.freeze({id,name,grade,index,art,cost:costs[index],minutes:minutes[index],boost:boosts[index]}));}
 function active(s,now=Date.now()){
  const saved=s.beauty,look=catalog.find(x=>x.id===saved?.id);
  if(!look)return null;
  const remaining=Math.min(saved.until-now,(saved.untilClock-s.clock)*3600000);
  return remaining>0?{...look,remaining:Math.ceil(remaining/1000)}:null;
 }
 function profile(base,look,passBoost=0){
  if(!base.groups.length)return base;
  const boost=(look?.boost??0)+passBoost,high=['C','B','A','S'];
  const groups=base.groups.map(g=>({...g,weight:g.chanceBps*(high.includes(g.quality)?1+boost:1)}));
  const total=groups.reduce((sum,g)=>sum+g.weight,0),budget=10000;
  const allocations=groups.map((g,index)=>({index,value:Math.floor(g.weight/total*budget),fraction:g.weight/total*budget%1}));
  const order=[...allocations].sort((a,b)=>b.fraction-a.fraction||a.index-b.index);
  for(let i=0,n=budget-allocations.reduce((sum,a)=>sum+a.value,0);i<n;i++)order[i].value++;
  return {...base,beauty:look?.id||null,emptyChance:0,groups:groups.map((g,i)=>({quality:g.quality,chanceBps:allocations[i].value,items:g.items}))};
 }
 const api={catalog,active,profile};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BeautyModel=api;
})(typeof window!=='undefined'?window:globalThis);
