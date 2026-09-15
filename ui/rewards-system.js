(function(root){
'use strict';
const daily=[500,800,1000,1500,2000,2500,5000];
const online=[{minutes:5,coins:300,passMultiplier:2},{minutes:15,coins:600,passMultiplier:2.5},{minutes:30,coins:1000,passMultiplier:3},{minutes:60,coins:2000,passMultiplier:3.5},{minutes:180,coins:5000,passMultiplier:4}];
const categories=[{id:'wealth',name:'财富成长',icon:'coin',targets:[2,4,8,12,20]},{id:'levels',name:'矿层征服',icon:'equipment',targets:[1,5,10,15,20]},{id:'ores',name:'矿石收藏',icon:'amethyst',targets:[3,6,10,16,24]},{id:'skins',name:'皮肤收藏',icon:'trophy',targets:[1,3,5,8,12]}];
function install(Engine,items){
 const proto=Engine.prototype,perform=proto.perform;
 proto.rewardDay=function(){return Math.floor((Date.now()+8*3600000)/86400000);};
 proto.rewardState=function(){const s=this.s,r=s.activityRewards||(s.activityRewards={signedDays:[],onlineDay:this.rewardDay(),seconds:0,onlineClaims:[],achievementClaims:[],clearedLevels:[],ores:[],skins:[],maxWealth:0});if(r.onlineDay!==this.rewardDay()){r.onlineDay=this.rewardDay();r.seconds=0;r.onlineClaims=[];r.onlineReceipts={};}r.ores=r.ores.filter(name=>name!=='矿石宝箱');r.maxWealth=Math.max(r.maxWealth,s.wealth||0);for(let i=0;i<items.length;i++)if(items[i][0]!=='treasure_chest'&&s.inventory[i]>0&&!r.ores.includes(items[i][1]))r.ores.push(items[i][1]);for(const id of s.wardrobeOwned||[])if(!r.skins.includes('wardrobe:'+id))r.skins.push('wardrobe:'+id);if(s.beauty?.id&&!r.skins.includes('face:'+s.beauty.id))r.skins.push('face:'+s.beauty.id);return r;};
 proto.onlineReward=function(minutes){const config=online.find(x=>x.minutes===Number(minutes));if(!config)return null;const passMultiplier=config.passMultiplier*Math.max(1,this.vipInfo().online);const r=this.rewardState(),claimed=r.onlineClaims.includes(config.minutes),receipt=r.onlineReceipts?.[config.minutes],multiplier=claimed?(receipt?.multiplier||1):(this.pass()?passMultiplier:1);return {...config,passMultiplier,claimed,multiplier,coins:claimed?(receipt?.coins??config.coins):Math.floor(config.coins*multiplier)};};
 proto.addOnlineTime=function(seconds){const r=this.rewardState();if(Number.isFinite(seconds)&&seconds>0)r.seconds+=seconds;};
 proto.achievementRows=function(){const r=this.rewardState(),values={wealth:r.maxWealth,levels:r.clearedLevels.length,ores:r.ores.length,skins:r.skins.length};return categories.flatMap(c=>c.targets.map((target,i)=>({...c,key:c.id+':'+target,target,value:values[c.id],coins:[1000,2000,4000,8000,16000][i],claimed:r.achievementClaims.includes(c.id+':'+target)})));};
 proto.perform=function(id,payload){
  if(id==='nav.back'&&this.s.modal==='onlineConfirm'){delete this.s.onlineConfirmation;this.open('checkin');return this.result(id,true,'返回签到');}
  if(id==='rewards.online.open'){const reward=this.onlineReward(payload),r=this.rewardState();if(this.s.modal!=='checkin'||!reward||reward.claimed||r.seconds<reward.minutes*60)return this.result(id,false,'尚未达成或已领取');this.s.onlineConfirmation={minutes:reward.minutes,coins:reward.coins,day:this.rewardDay()};this.open('onlineConfirm');return this.result(id,true,'请确认领取');}
  if(id==='home.checkin.open'||id==='home.achievements.open'){this.rewardState();this.s.rewardTab=id.includes('achievements')?'wealth':'daily';this.open(id.includes('achievements')?'achievements':'checkin');return this.result(id,true,'已打开');}
  if(id==='rewards.tab'){const allowed=this.s.modal==='checkin'?['daily','online']:this.s.modal==='achievements'?categories.map(c=>c.id):[];if(!allowed.includes(payload))return this.result(id,false,'无效页签');this.s.rewardTab=payload;return this.result(id,true,'已切换');}
  if(id.startsWith('rewards.claim.')){const r=this.rewardState();let coins=0,commit;const fail=message=>this.result(id,false,message);
   if(id==='rewards.claim.daily'){if(this.s.modal!=='checkin'||r.signedDays.includes(this.rewardDay()))return fail('今日已签到或入口无效');coins=daily[r.signedDays.length%7];commit=()=>r.signedDays.push(this.rewardDay());}
   else if(id==='rewards.claim.online'){const reward=this.onlineReward(payload);if(this.s.modal!=='onlineConfirm'||this.s.onlineConfirmation?.day!==this.rewardDay()||this.s.onlineConfirmation?.minutes!==Number(payload)||this.s.onlineConfirmation?.coins!==reward?.coins||!reward||r.seconds<reward.minutes*60||r.onlineClaims.includes(reward.minutes))return fail('尚未达成或已领取');coins=reward.coins;commit=()=>{delete this.s.onlineConfirmation;this.open('checkin');r.onlineClaims.push(reward.minutes);r.onlineReceipts=r.onlineReceipts||{};r.onlineReceipts[reward.minutes]={coins:reward.coins,multiplier:reward.multiplier};};}
   else if(id==='rewards.claim.achievement'){const row=this.achievementRows().find(x=>x.key===payload);if(this.s.modal!=='achievements'||!row||row.claimed||row.value<row.target)return fail('尚未达成或已领取');coins=row.coins;commit=()=>r.achievementClaims.push(row.key);}
   else return fail('无效奖励');
   if(this.s.txMode!=='success'){this.s.txMode='success';return fail('领取失败，请重试');}commit();this.s.coins+=coins;return this.result(id,true,'获得 '+coins.toLocaleString('en-US')+' 金币');
  }
  this.rewardState();const level=this.s.level,result=perform.call(this,id,payload);if(result.ok){const r=this.rewardState();if(id==='gameplay.success.collect'&&!r.clearedLevels.includes(level))r.clearedLevels.push(level);this.saveWardrobeProgress();}return result;
 };
}
const api={daily,online,categories,install};if(typeof module!=='undefined'&&module.exports)module.exports=api;else{root.ActivityRewards=api;install(root.MoleReview.ReviewEngine,root.MoleReview.ITEMS);}
})(typeof window!=='undefined'?window:globalThis);
