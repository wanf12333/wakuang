/* Shared, testable progression rules for the V6 playable prototype. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else{root.MineProgression=api;api.install(root.MoleReview);}})(typeof window!=='undefined'?window:globalThis,function(){
 const TOTAL=50000,CHAPTER=10000;
 const HOUSES=['矿区监狱','小木屋','温馨小屋','精致庭院','矿主庄园','辉煌宅邸'];
 const CONTRACTS=[{credit:'S',risk:0,rate:.006},{credit:'B',risk:.02,rate:.045},{credit:'S',risk:.04,rate:.09},{credit:'C',risk:.01,rate:.025},{credit:'A',risk:.08,rate:.20}];
 const houseAt=[1,3,10,25,50,100],houseCosts=[0,120,400,1200,4000,12000];
 const missions=[
  {id:'first',title:'第一份收获',text:'完成第1关，领取矿石。',reward:80,done:e=>e.s.highestCleared>=1,action:'home.play'},
  {id:'sale',title:'矿石变金币',text:'在仓库出售一次矿石。',reward:100,done:e=>e.s.saleCount>0,action:'home.warehouse.open'},
  {id:'gear',title:'磨好手中的镐',text:'将矿镐升到 Lv.2。',reward:150,done:e=>e.equipment().level>=2,action:'home.workshop.open'},
  {id:'debt',title:'还清第一笔债务',text:'攒够金币，到账房偿还债务。',reward:200,done:e=>e.s.debt===0,action:'home.debt.open'},
  {id:'house',title:'告别监狱',text:'完成建筑升级，拥有小木屋。',reward:300,done:e=>e.s.buildingLevel>=2,action:'home.building.open'},
  {id:'ten',title:'初露锋芒',text:'通关第10关，抵达100米。',reward:300,done:e=>e.s.highestCleared>=10,action:'home.play'},
  {id:'beauty',title:'换一种生活',text:'升级到温馨小屋，开放美容院。',reward:500,done:e=>e.s.buildingLevel>=3,action:'home.building.open'},
  {id:'wardrobe',title:'置办新衣',text:'升级到精致庭院，开放衣橱。',reward:800,done:e=>e.s.buildingLevel>=4,action:'home.building.open'},
  {id:'guild',title:'结识矿友',text:'升级到矿主庄园，开放矿工协会。',reward:1200,done:e=>e.s.buildingLevel>=5,action:'home.building.open'},
  {id:'hundred',title:'深入矿区',text:'完成第100关，抵达1000米。',reward:1500,done:e=>e.s.highestCleared>=100,action:'home.play'},
  {id:'thousand',title:'深岩开拓者',text:'完成第1000关，抵达10000米。',reward:5000,done:e=>e.s.highestCleared>=1000,action:'home.play'},
  {id:'graduate',title:'第一远征毕业',text:'完成第10000关，开启第二远征。',reward:20000,done:e=>e.s.highestCleared>=10000,action:'home.play'},
  {id:'end',title:'地心传奇',text:'完成五段远征，共50000关。',reward:100000,done:e=>e.s.highestCleared>=TOTAL,action:'home.play'}
 ];
 function install(api){
 const P=api.ReviewEngine.prototype;if(P.progressionInstalled)return;P.progressionInstalled=true;
 P.initializeProgression=function(){
  const s=this.s;if(s.progressionVersion===1)return;
  try{if(globalThis.localStorage){const old=localStorage.getItem(this.saveKey);if(old&&!localStorage.getItem(this.saveKey+'-before-progression'))localStorage.setItem(this.saveKey+'-before-progression',old);}}catch{}
  if(this.journey){Object.assign(s,{buildingLevel:1,buildingBrowse:1,buildingRanks:{1:1},coins:200,debt:600,wealth:1,depth:10,level:1,n:4,shovels:12,inventory:api.ITEMS.map(()=>0),joined:false,president:false,notes:[],history:[],contribution:0,vipAds:0,passUntil:0,passUntilWall:0,pickaxeLevel:1,pickaxeEnhance:0,highestCleared:0,wardrobeOwned:[],activityRewards:undefined});}
  else{s.highestCleared=Math.min(TOTAL,Math.max(0,s.highestCleared??Math.floor((s.depth||10)/10)));s.level=Math.min(TOTAL,Math.max(1,Math.ceil((s.depth||10)/10)));s.depth=Math.max(10,s.highestCleared*10);s.pickaxeLevel=Math.max(s.pickaxeLevel||1,Math.ceil((Math.min(CHAPTER,s.highestCleared)-10)/(20*(1+(s.pickaxeEnhance||0)*.25)))+1);}
  s.missionClaims=s.missionClaims||[];s.saleCount=s.saleCount||0;s.progressionVersion=1;
  s.offers.forEach((o,i)=>{if(!o.signed)Object.assign(o,CONTRACTS[i%CONTRACTS.length]);});
  s.contractRulesVersion=1;s.snapshot=null;delete s.roundLayout;delete s.roundDrops;delete s.roundDropLevel;
 };
 P.zone=function(level=this.s.level){if(level<11)return {id:'training',name:'浅层矿区',note:'每行一份矿藏，空格数字表示同一行距离',bonus:1};if(level%10===0)return {id:'hard',name:'坚岩挑战',note:'铲数减少2次，首通金币增加50%',bonus:1.5};if(level%5===0)return {id:'crystal',name:'水晶矿脉',note:'通关额外获得1份本层矿石',bonus:1};return {id:'normal',name:'勘探矿层',note:'每行一份矿藏，数字给出同一行距离',bonus:1};};
 P.equipment=function(){const level=Math.min(500,Math.max(1,this.s.pickaxeLevel||1)),enhance=Math.min(5,Math.max(0,this.s.pickaxeEnhance||0)),multiplier=1+enhance*.25,capacity=Math.min(CHAPTER,10+Math.floor((level-1)*20*multiplier)),chapter=Math.min(4,Math.floor((this.s.highestCleared||0)/CHAPTER)),baseDepth=(10+(level-1)*20)*10;
  return {level,enhance,multiplier,baseDepth,capacity,maxLevel:Math.min(TOTAL,chapter*CHAPTER+capacity),maxDepth:(chapter*CHAPTER+capacity)*10,upgradeCost:100+(level-1)*30,advanceCost:(enhance+1)*600,ironCost:(enhance+1)*10,copperCost:(enhance+1)*5,nextUpgradeDepth:(chapter*CHAPTER+Math.min(CHAPTER,10+Math.floor(level*20*multiplier)))*10,nextAdvanceDepth:(chapter*CHAPTER+Math.min(CHAPTER,10+Math.floor((level-1)*20*(1+Math.min(5,enhance+1)*.25))))*10};};
 P.levelInfo=function(level=this.s.level){const available=Number.isInteger(level)&&level>=1&&level<=TOTAL,n=level<=10?4:6,maxUnlocked=Math.min(TOTAL,this.equipment().maxLevel,(this.s.highestCleared||0)+1),zone=this.zone(level);return {level,n,available,unlocked:available&&level<=maxUnlocked,maxUnlocked,maxLevel:TOTAL,depth:available?level*10:null,coinCost:available?api.MINING_COIN_COSTS[level-1]:null,shovels:n*3-(zone.id==='hard'?2:0),requiredBuilding:null,zone};};
 P.buildingInfo=function(level=this.s.buildingLevel||1){return {level,name:HOUSES[level-1],cost:houseCosts[level-1],requiredClear:houseAt[level-1],maxLevel:level===6?TOTAL:houseAt[level],maxDepth:(level===6?TOTAL:houseAt[level])*10};};
 P.buildings=function(){return HOUSES.map((_,i)=>this.buildingInfo(i+1));};
 P.buildingGrowth=function(level=this.s.buildingLevel){const owned=level<=this.s.buildingLevel,rank=owned?Math.min(3,this.s.buildingRanks?.[level]??(level<this.s.buildingLevel?3:1)):0;return {rank,max:3,cost:rank>=3?0:level*20*rank};};
 P.buildingMaterials=function(level){return ([[],[[0,12]],[[1,5]],[[1,12],[2,5]],[[2,15],[3,3]],[[3,10],[4,5]]][level-1]||[]).map(([index,amount])=>({index,amount,icon:api.ITEMS[index][0],name:api.ITEMS[index][1],owned:this.s.inventory[index]||0}));};
 P.generateRound=function(level,n){const s=this.s,layout=Array.from({length:n},(_,row)=>{const value=this.random();if(!Number.isFinite(value)||value<0||value>=1)throw new RangeError('Invalid round random value');return row*n+Math.floor(value*n);});s.roundLayout=layout;s.roundLayoutLevel=level;s.roundLayoutN=n;s.roundId=(s.roundId||0)+1;delete s.roundDrops;delete s.roundDropLevel;s.roundSalvaged=false;};
 P.treasures=function(n=this.s.n){const s=this.s;if(!s.roundLayout||s.roundLayoutN!==n||s.roundLayoutLevel!==s.level)this.generateRound(s.level,n);return s.roundLayout;};
 P.distanceClue=function(cell){const n=this.s.n,target=this.treasures().find(i=>Math.floor(i/n)===Math.floor(cell/n));return Math.abs(target%n-cell%n);};
 P.currentMission=function(){this.initializeProgression();return missions.find(m=>!this.s.missionClaims.includes(m.id))||null;};
 const settle=P.settleTime;
 P.settleTime=function(){let changed=false;for(const n of this.s.notes)if(n.status==='active'&&this.noteRemaining(n)===0){n.status=Number.isFinite(n.defaultRoll)&&n.defaultRoll<(n.risk||0)?'runaway':'matured';n.settledAt=Date.now();changed=true;}settle.call(this);if(changed)this.saveWardrobeProgress();};
 const perform=P.perform;
 P.perform=function(id,payload){
  const s=this.s;this.initializeProgression();this.settleTime();
  const fail=text=>this.result(id,false,text),ok=text=>this.result(id,true,text);
  if(id==='progression.mission.open'){this.open('mission');return ok('查看当前目标');}
  if(id==='progression.mission.go'){const m=this.currentMission();if(!m||s.modal!=='mission')return fail('目标已变化');s.modal=null;if(m.action==='home.play')s.level=Math.min(TOTAL,(s.highestCleared||0)+1);return this.perform(m.action);}
  if(id==='progression.mission.claim'){const m=this.currentMission();if(s.modal!=='mission'||!m||payload!==m.id||!m.done(this))return fail('目标未完成或已领取');if(s.txMode!=='success'){s.txMode='success';return fail('保存失败，请重试');}s.missionClaims.push(m.id);s.coins+=m.reward;this.reward([['coin','目标奖励',m.reward]],'home');return ok('目标完成，获得 '+m.reward+' 金币');}
  if(id==='progression.level.jump')return this.perform('progression.level.page',Number(s.levelJump));
  if(id==='progression.level.resume'){if(s.modal!=='lockedLevel')return fail('请先选择矿层');s.modal=null;return this.perform('home.play');}
  if(id==='progression.level.page'){const target=Number(payload);if(s.modal!=='levels'||!Number.isInteger(target)||target<1||target>TOTAL)return fail('无效矿层');s.level=target;return ok('已切换矿层');}
  if(id==='progression.salvage'){if(s.modal!=='failed'||s.won||s.roundSalvaged)return fail('本轮不能再次回收');if(s.txMode!=='success'){s.txMode='success';return fail('保存失败，请重试');}const drops=this.ensureRoundDrops(),found=this.treasures().filter(i=>s.dug.includes(i)),reward=[];for(const cell of found){const index=drops[cell];s.inventory[index]++;reward.push([api.ITEMS[index][0],api.ITEMS[index][1],1]);}s.roundSalvaged=true;s.claimed=true;this.reward(reward.length?reward:[['stone','未挖到矿石',0]],'home');return ok('带回已发现的矿石；浅层前10关免费进入');}
  if(id==='building.upgrade.commit'){const target=Number(payload),required=houseAt[target-1];if(target===2&&s.debt>0)return fail('请先到帐房还清债务');if((s.highestCleared||0)<required)return fail('通关第 '+required+' 关后可进阶');}
  if(id==='equipment.upgrade.commit'&&this.equipment().capacity>=CHAPTER)return fail('矿镐已覆盖本段全部矿层；继续通关开启下一远征');
  if(id==='gameplay.level.enter'&&!this.levelInfo().unlocked){s.lockedTargetLevel=s.level;this.open('lockedLevel');return fail('先完成前一关，并确认矿镐可达深度');}
  if(id==='home.play')s.level=Math.min(TOTAL,(s.highestCleared||0)+1);
  if(id==='gameplay.tile.dig'&&(s.page!=='gameplay'||s.modal))return fail('请先进入矿层');
  if(id==='lending.loan.commit'){
   const o=s.offers[s.selectedOffer],snap=s.snapshot;
   if(s.modal!=='loan'||!snap||!o||o.signed||s.debt||this.activeNotes().length>=this.slots()||s.coins<snap.principal)return fail('合同条件已变化');
   if(['id','batch','principal','hours','rate','credit','risk'].some(k=>o[k]!==snap[k]))return fail('合同已刷新，请重新确认');
   if(!Number.isFinite(snap.risk)||snap.risk<0||snap.risk>1||!Number.isFinite(snap.interest)||snap.interest<0)return fail('合同数据无效');
   if(s.txMode!=='success'){s.txMode='success';return fail('保存失败，未扣本金');}
   const roll=this.random();if(!Number.isFinite(roll)||roll<0||roll>=1)return fail('结算数据不可用');
   s.coins-=snap.principal;o.signed=true;const n={...snap,id:s.nextNote++,offer:o.id,defaultRoll:roll,due:s.clock+snap.hours,dueWall:Date.now()+snap.hours*3600000,status:'active',riskRulesVersion:1};s.notes.push(n);s.selectedNote=n.id;s.snapshot=null;this.go('notes');return ok('合同已锁定；到期判定还款或本金全损');
  }
  const wasFirst=id==='gameplay.success.collect'&&s.level>(s.highestCleared||0),cleared=s.level;
  const result=perform.call(this,id,payload);
  if(result.ok&&id==='warehouse_sell.commit')s.saleCount=(s.saleCount||0)+1;
  if(result.ok&&id==='gameplay.success.collect'){
   s.highestCleared=Math.max(s.highestCleared||0,cleared);s.depth=Math.max(s.depth,cleared*10);
   const base=40+Math.min(600,Math.floor(cleared/10)*5),coins=Math.floor(base*(wasFirst?this.zone(cleared).bonus:.2));s.coins+=coins;s.reward.push(['coin',wasFirst?'首通奖励':'通关奖励',coins]);
   if(this.zone(cleared).id==='crystal'){const index=this.ensureRoundDrops()[this.treasures()[0]];s.inventory[index]++;s.reward.push([api.ITEMS[index][0],'矿脉加赠 · '+api.ITEMS[index][1],1]);}
   s.wealth=Math.max(s.wealth,Math.min(20,1+Math.floor(Math.log2(1+s.coins/500))));
  }
  if(result.ok)this.saveWardrobeProgress();return result;
 };
 }
 return {install,TOTAL,CHAPTER,HOUSES,CONTRACTS,missions};
});
