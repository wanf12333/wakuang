(function(root){
'use strict';
const DropModel=typeof module!=='undefined'&&module.exports?require('./level-drops.js'):root.MoleDrops;
const Beauty=typeof module!=='undefined'&&module.exports?require('./beauty-model.js'):root.BeautyModel;
const ITEMS=[['stone','石头','F',2,10,96],['ore_iron','铁矿石','F',8,100,63],['ore_copper','铜矿石','E',15,200,31],['ore_silver','银矿石','D',30,300,12],['gold_ingot','金块','D',80,400,8],['amethyst','紫水晶','C',120,600,5],['treasure_chest','矿石宝箱','C',150,800,0],['ore_copper','富铜矿','B',180,1000,0],['ore_silver','辉银矿','B',240,1200,0],['amethyst','晶簇','A',400,1500,0],['gold_ingot','精金块','A',500,1800,0],['stone','深层岩','S',800,2200,0]];
// Independent PNG icons; depth and prices remain review fixtures.
['孔雀石','海蓝宝石','黄水晶','石榴石','橄榄石','红宝石','蓝宝石','祖母绿','月光石','碧玺','黑曜石','钻石'].forEach((name,i)=>ITEMS.push([['malachite','aquamarine','citrine','garnet','peridot','ruby','sapphire','emerald','moonstone','tourmaline','obsidian','diamond'][i],name,i<6?'A':'S',1000+i*100,1000+i*100,0]));
const OFFERS=[['老矿灯','mole_veteran',10000,.15,6],['铜轮队长','mole_foreman',20000,.10,12],['深层勘探员','mole_explorer',15000,.25,24],['岩仔','mole_rookie',5000,.08,6],['工匠阿铜','mole_engineer',8000,.12,72]];
const GOODS=[['amethyst','紫水晶',80,3,1],['sapphire','蓝宝石',100,3,1],['citrine','黄水晶',150,2,1],['ruby','红宝石',200,2,1],['emerald','祖母绿',250,1,1],['diamond','钻石',300,1,1]];
// 前10关免费；后续入场费按进度缓增，上限100金币。
const MINING_COIN_COSTS=Object.freeze(Array.from({length:50000},(_,i)=>i<10?0:Math.min(100,5+Math.floor((i+1)/20))));
// 建筑解锁系统；矿镐能力和逐关通关进度共同决定可进入的矿层。
const BUILDING_TIERS=Object.freeze([
 {level:1,name:'矿区监狱',maxLevel:3,cost:0},
 {level:2,name:'小木屋',maxLevel:10,cost:120},
 {level:3,name:'温馨小屋',maxLevel:25,cost:400},
 {level:4,name:'精致庭院',maxLevel:50,cost:1200},
 {level:5,name:'矿主庄园',maxLevel:100,cost:4000},
 {level:6,name:'辉煌宅邸',maxLevel:50000,cost:12000}
].map(Object.freeze));
const clone=x=>JSON.parse(JSON.stringify(x));
// Reuse the existing lending-concept demo credit/risk pairs; settlement rules stay unchanged.
const OFFER_CREDIT_RISK=[['S',0],['B',.04],['S',.03],['C',.01],['A',.16]];
function initial(){return {page:'home',modal:null,nickname:'深岩小矿工',profileAvatarId:null,profileAvatarManual:false,buildingLevel:1,coins:9999999,stamina:60,debt:4500,passUntil:0,passRulesVersion:3,clock:0,wealth:8,depth:850,level:18,n:6,shovels:9,dug:[],flags:[],hint:-1,won:false,claimed:false,inventory:ITEMS.map(x=>x[5]),contribution:1280,joined:true,president:true,application:false,guildName:'深岩互助会',members:[{id:0,name:'你',avatar:'mole_leader',role:'会长',expired:false},{id:1,name:'老金',avatar:'mole_veteran',role:'副会长',expired:true},{id:2,name:'岩仔',avatar:'mole_rookie',role:'成员',expired:false},{id:3,name:'阿铜',avatar:'mole_engineer',role:'成员',expired:false}],permissions:{audit:true,notice:false,aid:true,kick:false},notice:'一起深入矿洞，发现新的宝藏。',offers:OFFERS.map((o,i)=>({id:i,name:o[0],avatar:o[1],principal:o[2],rate:o[3],hours:o[4],credit:OFFER_CREDIT_RISK[i][0],risk:OFFER_CREDIT_RISK[i][1],signed:false,batch:0})),batch:0,refreshAt:6,notes:[{id:1,offer:0,name:'老矿灯',avatar:'mole_veteran',principal:10000,interest:1500,due:6,status:'active'},{id:2,offer:1,name:'铜轮队长',avatar:'mole_foreman',principal:20000,interest:2000,due:0,status:'matured'},{id:3,offer:2,name:'深层勘探员',avatar:'mole_explorer',principal:15000,interest:0,due:0,status:'runaway'}],nextNote:4,history:[],selectedItem:1,selectedNote:1,selectedOffer:0,selectedMember:1,selectedGuild:0,selectedGood:0,amount:1,snapshot:null,rank:'wealth',mineDue:null,mineCycle:0,aidPosted:false,aidReady:false,aidDonated:false,stock:GOODS.map(g=>g[3]),adMode:'success',txMode:'success',events:[],seen:{},revision:0};}
function unlockReview(s){Object.assign(s,{buildingLevel:6,buildingBrowse:6,buildingRanks:{1:5,2:5,3:5,4:5,5:5,6:5},debt:0,vipAds:60,wealth:11,depth:5000,pickaxeLevel:10,pickaxeEnhance:5,joined:true,president:true});if(!s.reviewDailyVipSeedV1){s.passActivatedAtWall=Date.now();s.passUntil=s.clock+24;s.passUntilWall=s.passActivatedAtWall+24*3600000;s.reviewDailyVipSeedV1=true;}else if(s.passUntilWall&&!s.passActivatedAtWall)s.passActivatedAtWall=s.passUntilWall-24*3600000;s.permissions={audit:true,notice:true,aid:true,kick:true};return s;}
class ReviewEngine{
constructor(random=Math.random){this.random=random;this.journey=!!(root.location&&new URLSearchParams(root.location.search).get('mode')==='journey');this.saveKey=this.journey?'mining-journey-v1':'mining-wardrobe-progress-v1';this.s=initial();this.restoreWardrobeProgress();this.s.offers.forEach((o,i)=>{const defaults=OFFER_CREDIT_RISK[i];if(defaults){o.credit??=defaults[0];o.risk??=defaults[1];}});if(this.s.passRulesVersion!==3){this.s.passUntil=0;this.s.passUntilWall=0;delete this.s.vipAdDay;delete this.s.reviewDailyVipSeedV1;this.s.passRulesVersion=3;}if(!this.journey&&!this.restoredProgress&&!this.s.progressionVersion)unlockReview(this.s);this.initializeProgression();if(this.s.selectedItem===6)this.s.selectedItem=5;if(!this.journey&&!this.restoredProgress&&!this.s.testCoinsGrantV1){this.s.coins=9999999;this.s.testCoinsGrantV1=true;}this.saveWardrobeProgress();this.last={title:'开始评审',detail:'从系统入口开始，或从外侧清单准备检查场景。',ok:true};}
 restoreWardrobeProgress(){try{if(!root.localStorage)return;const saved=JSON.parse(root.localStorage.getItem(this.saveKey)||'null');if(saved?.version!==1||!saved.state||(saved.state.wardrobeOwned!==undefined&&!Array.isArray(saved.state.wardrobeOwned))||!Array.isArray(saved.state.inventory)||!Number.isFinite(saved.state.coins))return;this.s={...this.s,...saved.state,passRulesVersion:saved.state.passRulesVersion||1,page:'home',modal:null,adMode:'success',txMode:'success'};this.restoredProgress=true;}catch{}}
 saveWardrobeProgress(){try{if(!root.localStorage)return;if(this.s.passRulesVersion===3||this.s.wardrobeOwned?.length||this.s.passLastDay!==undefined){root.localStorage.setItem(this.saveKey,JSON.stringify({version:1,state:this.s}));}else root.localStorage.removeItem(this.saveKey);}catch{this.s.wardrobeSaveFailed=true;}}
 passRemaining(){return Math.max(0,Math.min(this.s.passUntil-this.s.clock,this.s.passUntilWall===undefined?Infinity:(this.s.passUntilWall-Date.now())/3600000));}
 pass(){return this.vipInfo().level>0&&this.passRemaining()>0;}
 passProgress(){const day=this.passStampDay(),last=this.s.passLastDay,today=this.s.vipAdDay===day,stamps=(last===day||last===day-1)?Math.min(5,this.s.passStamps||0):0;return {day,today,stamps:stamps===5&&last!==day?0:stamps};}
 guildGrowth(){const base=this.guilds().find(g=>g.name===this.s.guildName)?.level||1;const total=this.s.guildGrowthTotals?.[this.s.guildName]??base*(base-1)*500;let level=1;while(level<10&&total>=level*(level+1)*500)level++;const floor=level*(level-1)*500,next=level<10?level*(level+1)*500:null;return {level,total,floor,next,remaining:next===null?0:next-total};}
 addGuildGrowth(value){if(!this.s.joined||!Number.isFinite(value)||value<=0)return;const total=this.guildGrowth().total;this.s.guildGrowthTotals=this.s.guildGrowthTotals||{};this.s.guildGrowthTotals[this.s.guildName]=total+value;}
 guilds(){return [{name:'石灯矿友会',level:1,members:12,capacity:20,depth:100},{name:'深岩互助会',level:3,members:18,capacity:30,depth:500},{name:'黑铁开拓团',level:5,members:27,capacity:35,depth:1000},{name:'水晶勘探社',level:7,members:38,capacity:40,depth:2000},{name:'地心联合会',level:10,members:49,capacity:50,depth:5000}];}
 aidOrders(){return [{name:'阿岩',item:'石头',icon:'stone',index:0,total:30,received:20,reward:60},{name:'老金',item:'铁矿石',icon:'ore_iron',index:1,total:10,received:6,reward:80},{name:'小晶',item:'紫水晶',icon:'amethyst',index:5,total:3,received:1,reward:100}];}
 aidSlots(){const s=this.s;if(!s.aidRequests)s.aidRequests=[{item:s.aidItem??1,quantity:s.aidQuantity||5,posted:!!s.aidPosted,ready:!!s.aidReady,due:s.aidDue,dueWall:s.aidDueWall},{item:1,quantity:5,posted:false,ready:false}];return s.aidRequests;}
 aidRemaining(index=this.s.aidSlot??0){const r=this.aidSlots()[index],s=this.s;if(!r||!r.posted||r.ready)return 0;return Math.max(0,Math.ceil(Math.min(((r.due??s.clock+.2)-s.clock)*60,((r.dueWall??Date.now()+720000)-Date.now())/60000)));}
 syncAid(){this.aidSlots().forEach((r,i)=>{if(r.posted&&!r.ready&&this.aidRemaining(i)===0)r.ready=true;});const r=this.aidSlots()[this.s.aidSlot??0];Object.assign(this.s,{aidItem:r.item,aidQuantity:r.quantity,aidPosted:r.posted,aidReady:r.ready,aidDue:r.due,aidDueWall:r.dueWall});}
 slots(){return this.s.wealth>=11?6:this.s.wealth>=8?4:this.s.wealth>=4?3:1;}
 activeNotes(){return this.s.notes.filter(n=>['active','matured','runaway'].includes(n.status));}
 note(){return this.s.notes.find(n=>n.id===this.s.selectedNote);}
 member(){return this.s.members.find(m=>m.id===this.s.selectedMember);}
 maxAmount(){const s=this.s;return s.modal==='sell'?s.inventory[s.selectedItem]:s.modal==='contribute'?Math.floor(s.coins/100)*100:Math.min(s.coins,s.debt);}
 open(modal){this.s.modal=modal;}
 buildingInfo(level=this.s.buildingLevel??1){const tier=BUILDING_TIERS.find(t=>t.level===level)||BUILDING_TIERS[0];return {...tier,maxDepth:DropModel.LEVEL_DEPTHS[tier.maxLevel-1]};}
 buildingGrowth(level=this.buildingInfo().level){const owned=level<=this.buildingInfo().level,rank=owned?(this.s.buildingRanks?.[level]??(level<this.buildingInfo().level?5:1)):0;return {rank,max:5,cost:rank>=5?0:level*500*rank};}
 buildingMaterials(level){return ([[],[[0,20],[1,10]],[[1,25],[2,15]],[[2,30],[3,10]],[[3,20],[4,10]],[[4,20],[5,10]]][level-1]||[]).map(([index,amount])=>({index,amount,icon:ITEMS[index][0],name:ITEMS[index][1],owned:this.s.inventory[index]||0}));}
 buildings(){return BUILDING_TIERS.map(t=>this.buildingInfo(t.level));}
 levelInfo(level=this.s.level){const n=level<=2?4:6,available=Number.isInteger(level)&&level>=1&&level<=MINING_COIN_COSTS.length,building=this.buildingInfo(),required=available?BUILDING_TIERS.find(t=>level<=t.maxLevel):null;return {level,n,shovels:n+3,coinCost:available?MINING_COIN_COSTS[level-1]:null,maxLevel:MINING_COIN_COSTS.length,available,unlocked:available&&level<=this.equipment().maxLevel,requiredBuilding:required?.level??null,maxUnlocked:this.equipment().maxLevel,depth:available?DropModel.LEVEL_DEPTHS[level-1]:null};}
 equipment(){const level=Number.isSafeInteger(this.s.pickaxeLevel)&&this.s.pickaxeLevel>0?this.s.pickaxeLevel:1,enhance=Math.max(0,Math.min(5,Math.floor(this.s.pickaxeEnhance||0))),baseDepth=200+level*200,multiplier=1+enhance*.25,maxDepth=Math.floor(baseDepth*multiplier);return {level,enhance,baseDepth,multiplier,upgradeCost:level*800,advanceCost:(enhance+1)*2000,ironCost:(enhance+1)*10,copperCost:(enhance+1)*5,maxDepth,nextUpgradeDepth:Math.floor((baseDepth+200)*multiplier),nextAdvanceDepth:Math.floor(baseDepth*(multiplier+.25)),maxLevel:Math.max(1,DropModel.LEVEL_DEPTHS.filter(d=>d<=maxDepth).length)};}
 featureStage(id){if(/^(guild[._]|guild_apply\.|guild_shop\.|extra\.(aid|audit|notice)\.)/.test(id))return 5;if(id.startsWith('wardrobe.'))return 4;return {'home.ranking.open':2,'home.locked_feature':6,'home.guild.open':5,'home.beauty.open':3,'home.wardrobe.open':4}[id]||1;}
 characterStats(n=this.s.n){return {charm:Math.round((this.beautyActive()?.boost||0)*100),outfit:this.s.debt===0?'miner':'prisoner'};}
 beautyCatalog(){return Beauty.catalog;}
 beautyActive(){return Beauty.active(this.s);}
 wardrobeCatalog(){
  const designs=[
   ['C',20000,.15,'勘探工装','勘探安全帽','工具挂带 · 双筒探灯'],
   ['A',60000,.35,'熔金护甲','熔金安全帽','铆钉铜甲 · 隔热护檐'],
   ['S',150000,.7,'星辉战衣','星辉安全帽','星纹镶边 · 紫晶矿灯'],
   ['C',20000,.15,'赤焰救援服','救援安全帽','反光织带 · 十字救援灯'],
   ['A',60000,.35,'冰川防寒服','冰川护目帽','绒毛护领 · 防雪护目镜'],
   ['S',150000,.7,'蒸汽技师服','蒸汽技师帽','皮革工具袋 · 齿轮仪表'],
   ['A',60000,.35,'深潜探矿服','深潜探矿帽','密封护领 · 黄铜舷窗']
  ];
  return ['clothes','helmet'].flatMap(slot=>[{id:slot+'0',slot,name:slot==='clothes'?'原装衣服':'矿灯安全帽',grade:'F',cost:0,boost:0,art:slot==='clothes'?'wardrobe-clothes0.svg':'equipment-helmet.svg',theme:'经典矿工'},...designs.map(([grade,cost,boost,clothes,helmet,theme],i)=>({id:slot+(i+1),slot,grade,cost:slot==='helmet'?Math.round(cost*.8):cost,boost,name:slot==='clothes'?clothes:helmet,theme,art:'wardrobe-personal-'+slot+(i+1)+'.svg'}))]);
 }
 wardrobeOwned(id){return id==='clothes0'||id==='helmet0'||(this.s.wardrobeOwned||[]).includes(id);}
 wardrobeEquipped(slot){return this.wardrobeCatalog().find(x=>x.slot===slot&&x.id===this.s.wardrobeEquipped?.[slot]&&this.wardrobeOwned(x.id))||this.wardrobeCatalog().find(x=>x.id===slot+'0');}
 wardrobeBoost(){return this.wardrobeEquipped('clothes').boost+this.wardrobeEquipped('helmet').boost;}
 passStampDay(){return Math.floor((Date.now()+8*3600000)/86400000)+Math.floor(this.s.clock/24);}
 vipTiers(){return [{level:1,ads:1,gold:1000,drop:.2,online:1},{level:2,ads:5,gold:1200,drop:.3,online:1.25},{level:3,ads:15,gold:1500,drop:.4,online:1.5},{level:4,ads:30,gold:2000,drop:.6,online:1.75},{level:5,ads:60,gold:3000,drop:.8,online:2}];}
 vipInfo(){const ads=this.s.vipAds??Math.max(this.s.passStamps||0,this.s.passUntil>0?1:0),tiers=this.vipTiers(),tier=tiers.filter(t=>ads>=t.ads).at(-1)||{level:0,ads:0,gold:1000,drop:0,online:1};return {...tier,totalAds:ads,next:tiers.find(t=>t.level===tier.level+1)||null};}
 loanVipBoost(){return this.pass()?this.vipInfo().level*.1:0;}
 loanInterest(o){return Math.round(o.principal*o.rate*(1+this.loanVipBoost()));}
 passDropBoost(){return this.pass()?Math.max(.2,this.vipInfo().drop):0;}
 levelDrops(level=this.s.level){return Beauty.profile(DropModel.levelDrops(ITEMS,level),this.beautyActive(),this.passDropBoost()+this.wardrobeBoost());}
 makeRoundDrops(level=this.s.level,n=this.levelInfo(level).n){const profile=this.levelDrops(level);return Object.fromEntries(this.treasures(n).map(cell=>[cell,DropModel.roll(profile,this.random).index]));}
 clearMismatchedFixtureRound(){const s=this.s;if(s.roundDrops&&(s.roundDropLevel!==s.level||this.treasures().some(cell=>(s.roundDrops[cell]!==-1&&!ITEMS[s.roundDrops[cell]])))){delete s.roundDrops;delete s.roundDropLevel;}}
 ensureRoundDrops(){
  // prepare / scenario 的无开局评审场景只补抽一次；普通渲染、复活和重试绝不重抽。
  if(!this.s.roundDrops){this.s.roundDrops=this.makeRoundDrops();this.s.roundDropLevel=this.s.level;}
  for(const cell of Object.keys(this.s.roundDrops))if(this.s.roundDrops[cell]===-1)this.s.roundDrops[cell]=0;else if(this.s.roundDrops[cell]===6)this.s.roundDrops[cell]=5;
  return this.s.roundDrops;
 }
 treasureItem(cell){return this.treasures().includes(cell)?(ITEMS[this.ensureRoundDrops()[cell]]||ITEMS[0]):undefined;}
 go(page){this.s.page=page==='guild'?(this.s.joined?'shop':'apply'):page;this.s.modal=null;this.s.levelModalTrail=[];}
 result(id,ok,detail){this.last={title:id,ok,detail};this.s.seen[id]=ok?'已操作成功':'已触发异常';this.s.events.unshift({id,ok,detail,coins:this.s.coins,stamina:this.s.stamina,contribution:this.s.contribution,time:new Date().toLocaleTimeString('zh-CN')});this.s.events=this.s.events.slice(0,200);this.saveWardrobeProgress();return this.last;}
 reward(items,returnPage){this.s.reward=items;this.s.rewardReturn=returnPage||this.s.page;this.open('reward');}
 noteRemaining(n){const hours=Math.max(0,n.due-this.s.clock);if(!Number.isFinite(n.dueWall))n.dueWall=Date.now()+hours*3600000;return Math.max(0,Math.ceil(Math.min(hours*3600,(n.dueWall-Date.now())/1000)));}
 settleTime(){this.syncAid();const s=this.s;for(const n of s.notes)if(n.status==='active'&&this.noteRemaining(n)===0)n.status='matured';if(s.clock>=s.refreshAt){s.batch++;s.offers.forEach(o=>{o.batch=s.batch;o.signed=false});s.refreshAt=s.clock+6;}}
 perform(id,payload){const s=this.s;let detail='';const fail=t=>this.result(id,false,t);const good=t=>this.result(id,true,t);const needPass=()=>{if(!this.pass()){this.open('pass');return false;}return true;};
 const txn=fn=>{if(s.txMode!=='success'){const mode=s.txMode;s.txMode='success';return fail(mode==='stale'?'数据已变化，请重新打开并核对':'保存失败，资源未扣除，可重试');}const text=fn();return text===false?fail('条件已变化，资源未扣除'):good(text||'操作完成');};
 const ad=fn=>{if(s.adMode!=='success')return fail(s.adMode==='cancelled'?'广告未播放完成，未发放奖励':'广告暂不可用，请稍后重试');const message=fn();return good(typeof message==='string'?message:'广告完成，权益已更新');};
 const gate=this.featureStage(id);if(this.buildingInfo().level<gate)return fail('主建筑进阶至第 '+gate+' 阶后开放');
 if(s.debt>0&&(id.startsWith('lending.')||id.startsWith('home.loan.')||id==='home.lending.open')){this.go('debt');s.amount=Math.min(100,s.coins,s.debt);return fail('还清债务后开放放贷和借据');}
 switch(id){
 case 'building.stage.select':{const n=Number(payload);if(s.modal!=='buildingUpgrade'||!this.buildings().some(t=>t.level===n))return fail('无效阶段');s.buildingBrowse=n;break;}
 case 'home.workshop.open':s.levelModalTrail=s.modal==='lockedLevel'?[...(s.levelModalTrail||[]),'lockedLevel']:[];this.open('workshop');break;
 case 'home.building.open':{
  if(s.page!=='home'||(s.modal&&s.modal!=='lockedLevel'))return fail('请从主界面建筑进入升级');
  s.levelModalTrail=s.modal==='lockedLevel'?[...(s.levelModalTrail||[]),'lockedLevel']:[];
  s.selectedBuilding=null;s.buildingBrowse=this.buildingInfo().level;s.buildingNotice='';this.open('buildingUpgrade');break;
 }
 case 'home.profile.open':if(s.page!=='home'||s.modal)return fail('请从主界面打开角色档案');this.open('profile');break;
 case 'profile.avatar.open':if(s.modal!=='profile')return fail('请先打开角色档案');this.open('profileAvatar');break;
 case 'profile.avatar.select':{const look=this.beautyCatalog().find(x=>x.id===payload);if(s.modal!=='profileAvatar'||!look)return fail('请选择有效头像');s.profileAvatarId=look.id;s.profileAvatarManual=true;this.open('profile');break;}
 case 'profile.nickname.edit':if(s.modal!=='profile')return fail('请先打开角色档案');s.nicknameDraft=s.nickname||'深岩小矿工';this.open('profileNickname');break;
 case 'profile.nickname.save':{const value=String(s.nicknameDraft||'').trim();if(s.modal!=='profileNickname'||value.length<2||value.length>12)return fail('昵称需要为 2–12 个字');s.nickname=value;s.nicknameDraft='';this.open('profile');break;}
 case 'building.detail.open':{const level=Number(payload);if(s.modal!=='buildingUpgrade'||!this.buildings().some(t=>t.level===level))return fail('请选择有效建筑');s.selectedBuilding=level;break;}
 case 'home.beauty.open':s.beautyTab='face';s.beautySelected=this.beautyActive()?.id||'F';this.open('beauty');break;
 case 'beauty.tab':if(s.modal!=='beauty'||!['face','gear'].includes(payload))return fail('无效页签');s.beautyTab=payload;break;
 case 'home.wardrobe.open':s.wardrobeTab='clothes';s.wardrobeSelected=this.wardrobeEquipped('clothes').id;this.open('wardrobe');break;
 case 'wardrobe.tab':if(s.modal!=='wardrobe'||!['clothes','helmet'].includes(payload))return fail('无效分类');s.wardrobeTab=payload;s.wardrobeSelected=this.wardrobeEquipped(payload).id;break;
 case 'wardrobe.select':if(s.modal!=='wardrobe'||!this.wardrobeCatalog().some(x=>x.id===payload&&x.slot===(s.wardrobeTab||'clothes')))return fail('无效款式');s.wardrobeSelected=payload;break;
 case 'wardrobe.buy.commit':case 'wardrobe.equip':{
  const [itemId,rev]=String(payload).split(':'),item=this.wardrobeCatalog().find(x=>x.id===itemId),buy=id==='wardrobe.buy.commit';
  const valid=()=>s.page==='home'&&s.modal==='wardrobe'&&item&&s.wardrobeSelected===itemId&&item.slot===(s.wardrobeTab||'clothes')&&Number(rev)===(s.wardrobeRevision||0)&&(buy?!this.wardrobeOwned(itemId)&&Number.isFinite(s.coins)&&s.coins>=item.cost:this.wardrobeOwned(itemId));
  if(!valid())return fail('资源不足或款式状态已变化');
  const apply=()=>{if(!valid())return false;if(buy){s.coins-=item.cost;s.wardrobeOwned=[...(s.wardrobeOwned||[]),itemId];}s.wardrobeEquipped={...s.wardrobeEquipped,[item.slot]:itemId};s.wardrobeRevision=(s.wardrobeRevision||0)+1;return buy?'永久解锁并穿戴':'已穿戴';};
  if(buy)return txn(apply);return this.result(id,true,apply());
 }
 case 'workshop.tab':if(s.modal!=='workshop'||!['upgrade','advance'].includes(payload))return fail('无效页签');s.workshopTab=payload;break;
 case 'equipment.upgrade.commit':case 'equipment.enhance.commit':{
  const enhance=id==='equipment.enhance.commit',before=this.equipment(),revision=(s.equipmentRevision||0),valid=()=>{
   const gear=this.equipment();return s.page==='home'&&s.modal==='workshop'&&Number(payload)===revision&&(s.equipmentRevision||0)===revision&&(enhance?gear.enhance<5&&Number.isFinite(s.coins)&&s.coins>=gear.advanceCost&&(s.inventory[1]||0)>=gear.ironCost&&(s.inventory[2]||0)>=gear.copperCost:Number.isSafeInteger(gear.level+1)&&Number.isSafeInteger(gear.nextUpgradeDepth)&&Number.isFinite(s.coins)&&s.coins>=gear.upgradeCost);
  };
  if(!valid())return fail('已满级、资源不足或订单已变化');
  return txn(()=>{if(!valid())return false;if(enhance){s.coins-=before.advanceCost;s.inventory[1]-=before.ironCost;s.inventory[2]-=before.copperCost;s.pickaxeEnhance=before.enhance+1;}else{s.coins-=before.upgradeCost;s.pickaxeLevel=before.level+1;}s.equipmentRevision=revision+1;return enhance?'十字镐升阶成功':'十字镐升级成功';});
 }
 case 'beauty.select':if(s.modal!=='beauty'||!Beauty.catalog.some(x=>x.id===payload))return fail('请选择有效外观');s.beautySelected=payload;break;
 case 'beauty.buy.commit':{
  const [grade,rev]=String(payload).split(':'),look=Beauty.catalog.find(x=>x.id===grade);
  const valid=()=>s.page==='home'&&s.modal==='beauty'&&look&&s.beautySelected===grade&&Number(rev)===(s.beautyRevision||0)&&this.beautyActive()?.id!==grade&&Number.isFinite(s.coins)&&s.coins>=look.cost;
  if(!valid())return fail('金币不足、外观已生效或订单已变化');
  return txn(()=>{if(!valid())return false;s.coins-=look.cost;s.beauty={id:grade,until:Date.now()+look.minutes*60000,untilClock:s.clock+look.minutes/60};s.beautyRevision=(s.beautyRevision||0)+1;return look.name+'已生效，持续'+look.minutes+'分钟';});
 }
 case 'building.rank.commit':{
  const [level,rank]=String(payload).split(':').map(Number),growth=this.buildingGrowth(level);
  if(s.page!=='home'||s.modal!=='buildingUpgrade'||level!==this.buildingInfo().level||rank!==growth.rank||rank>=growth.max)return fail('请升级当前建筑，不能重复或越级');
  if(!Number.isFinite(s.coins)||s.coins<growth.cost)return fail('金币不足，需要 '+growth.cost+' 金币');
  return txn(()=>{const now=this.buildingGrowth(level);if(s.modal!=='buildingUpgrade'||this.buildingInfo().level!==level||now.rank!==rank||!Number.isFinite(s.coins)||s.coins<growth.cost)return false;s.coins-=growth.cost;s.buildingRanks=s.buildingRanks||{};s.buildingRanks[level]=rank+1;return '建筑提升至 Lv.'+(rank+1);});
 }
 case 'building.upgrade.commit':{
  const target=Number(payload),current=this.buildingInfo(),next=BUILDING_TIERS.find(t=>t.level===target);
  if(s.page!=='home'||s.modal!=='buildingUpgrade')return fail('请在建筑升级弹窗操作');
  if(!next||target!==current.level+1)return fail(current.level===BUILDING_TIERS.length?'建筑已满级':'请按顺序升级，不能跳级或重复购买');
  const materials=this.buildingMaterials(target);
  if(this.buildingGrowth().rank<this.buildingGrowth().max)return fail('当前建筑达到 Lv.'+this.buildingGrowth().max+' 后可解锁新建筑');
  if(materials.some(m=>m.owned<m.amount))return fail('解锁材料不足');
  if(!Number.isFinite(s.coins)||s.coins<next.cost)return fail('金币不足，需要 '+next.cost+' 金币');
  return txn(()=>{
   if(s.modal!=='buildingUpgrade'||this.buildingInfo().level!==current.level||this.buildingGrowth().rank<this.buildingGrowth().max||this.buildingMaterials(target).some(m=>m.owned<m.amount)||!Number.isFinite(s.coins)||s.coins<next.cost)return false;
   s.coins-=next.cost;for(const m of materials)s.inventory[m.index]-=m.amount;s.buildingRanks=s.buildingRanks||{};s.buildingRanks[current.level]=this.buildingGrowth().max;s.buildingRanks[target]=1;s.buildingLevel=target;s.buildingBrowse=target;
   s.buildingNotice='升级成功 · '+next.name+'，开放新的系统';
   const locked=s.lockedTargetLevel;
   if(s.levelModalTrail?.includes('lockedLevel')&&this.levelInfo(locked).unlocked){s.level=locked;s.n=this.levelInfo(locked).n;s.levelModalTrail=[];this.open('levels');}
   return s.buildingNotice+'，消耗 '+next.cost+' 金币';
  });
 }
 case 'guild.growth.open':if(!s.joined)return fail('加入协会后查看成长');this.open('guildGrowth');break;
 case 'home.wealth.open':if(s.modal==='lockedLevel')s.levelModalTrail=[...(s.levelModalTrail||[]),'lockedLevel'];else s.levelModalTrail=[];this.open('wealth');break;
 case 'home.ranking.open':case 'ranking.tab.wealth':s.rank='wealth';this.go('ranking');break;
 case 'ranking.tab.depth':s.rank='depth';this.go('ranking');break;
 case 'ranking.rules.open':this.open('rankingRules');break;
 case 'home.warehouse.open':this.go('warehouse');break;
 case 'home.debt.open':if(s.debt<=0){this.go('notes');break;}this.go('debt');s.amount=Math.min(100,s.debt,s.coins);break;
 case 'home.lending.open':case 'lending.tab.hall':case 'lending.slot.empty':if(s.debt>0){this.go('debt');s.amount=Math.min(100,s.coins,s.debt);return fail('先还清债务，才能新增放贷');}this.go('lending');break;
 case 'home.loan.active':case 'lending.tab.notes':this.go('notes');break;
 case 'home.loan.matured':{const n=s.notes.find(n=>n.status==='matured');if(!n)return fail('暂无到期借据');s.selectedNote=n.id;this.open('note');break;}
 case 'home.loan.runaway':{const n=s.notes.find(n=>n.status==='runaway');if(!n)return fail('暂无跑路借据');s.selectedNote=n.id;this.open('note');break;}
 case 'home.guild.open':this.go(s.joined?'guild':'apply');break;
 case 'home.miner_pass':this.open('pass');break;
 case 'home.miner_pass.renew_ad':case 'lending.pass.activate_ad':case 'guild_apply.pass.activate_ad':if(this.passProgress().today)return fail('今日已激活，每天只能观看一次');return ad(()=>{const before=this.vipInfo();s.vipAds=before.totalAds+1;s.vipAdDay=this.passStampDay();const vip=this.vipInfo();s.coins+=vip.gold;s.passActivatedAtWall=Date.now();s.passUntil=s.clock+24;s.passUntilWall=s.passActivatedAtWall+24*3600000;this.open('pass');return 'VIP已激活 24 小时 · 获得 '+vip.gold.toLocaleString('en-US')+' 金币 · '+(vip.level>before.level?'升级 VIP'+vip.level:'VIP'+vip.level+' · 累计 '+vip.totalAds+' 次');});
 case 'home.locked_feature':return fail('宝石交易所已解锁，交易功能开发中');
 case 'ranking.back':case 'nav.home':this.go('home');break;
 case 'gameplay.level.details':if(s.modal!=='levels')return fail('请先选择矿层');s.levelModalTrail=['levels'];this.open('levelDetails');break;
 case 'gameplay.level.previous':if(s.modal!=='levels')return fail('请先打开选关弹窗');if(s.level<=1)return fail('已是最浅关卡');s.level--;s.n=s.level<=2?4:6;break;
 case 'gameplay.level.next':if(s.modal!=='levels')return fail('请先打开选关弹窗');if(!this.levelInfo(s.level+1).unlocked){s.lockedTargetLevel=Math.min(s.level+1,50000);s.levelModalTrail=['levels'];this.open('lockedLevel');break;}s.level++;s.n=s.level<=2?4:6;break;
 case 'gameplay.level.select':{const target=Number(payload),info=this.levelInfo(target);if(s.modal!=='levels'||!info.available)return fail('请在选关弹窗选择有效矿层');s.level=target;s.n=info.n;break;}
 case 'gameplay.level.locked':{const target=Number(payload??Math.min(s.level+1,50000));if(s.modal!=='levels'||!Number.isInteger(target)||target<1||target>50000||this.levelInfo(target).unlocked)return fail('该关卡不是待解锁矿层');s.lockedTargetLevel=target;s.levelModalTrail=['levels'];this.open('lockedLevel');break;}
 case 'home.play':if(s.page!=='home'||s.modal)return fail('请从主界面开始挖矿');if(!this.levelInfo().unlocked){s.level=this.equipment().maxLevel;s.n=this.levelInfo().n;}s.levelModalTrail=[];this.open('levels');break;
 case 'gameplay.level.enter':case 'gameplay.fail.restart':{
  const restart=id==='gameplay.fail.restart',ready=()=>restart?s.page==='gameplay'&&s.modal==='failed'&&s.shovels===0&&!s.won:s.modal==='levels';
  if(!ready())return fail(restart?'请在本关失败后重开':'请先选择矿层');
  const info=this.levelInfo();if(!info.unlocked){if(!restart){s.lockedTargetLevel=s.level;s.levelModalTrail=['levels'];this.open('lockedLevel');}return fail(info.available?'请先在强化中升级十字镐':'该矿层尚未开放');}
  const cost=info.coinCost;if(!Number.isFinite(s.coins)||s.coins<cost)return fail('金币不足，需要 '+cost+' 金币');
  return txn(()=>{
   const current=this.levelInfo();if(!ready()||!current.unlocked||current.level!==info.level||current.coinCost!==cost||!Number.isFinite(s.coins)||s.coins<cost)return false;
   // 先完整构造新一轮产物；抽取异常不能先扣金币或破坏上一轮状态。
   const oldRound={roundLayout:s.roundLayout,roundLayoutLevel:s.roundLayoutLevel,roundLayoutN:s.roundLayoutN,roundId:s.roundId,roundSalvaged:s.roundSalvaged,roundDrops:s.roundDrops,roundDropLevel:s.roundDropLevel};
   let roundDrops;try{this.generateRound(current.level,current.n);roundDrops=this.makeRoundDrops(current.level,current.n);}catch(error){Object.assign(s,oldRound);return false;}
   s.coins-=cost;s.n=current.n;s.shovels=current.shovels;s.dug=[];s.flags=[];s.hint=-1;s.won=false;s.claimed=false;s.roundDrops=roundDrops;s.roundDropLevel=s.level;this.go('gameplay');
   if(s.level<=2&&!s.distanceTutorialSeen){s.tutorial=1;this.open('tutorial');s.distanceTutorialSeen=true;}return '扣除 '+cost+' 金币，初始铲子 '+s.shovels;
  });
 }
 case 'gameplay.tutorial.next':s.tutorial=(s.tutorial||1)+1;if(s.tutorial>2)s.modal=null;detail='教学推进';break;
 case 'gameplay.tile.flag':{const i=Number(payload);if(!Number.isInteger(i)||i<0||i>=s.n*s.n||s.dug.includes(i)||s.won)return fail('格子不可操作');s.flags=s.flags.includes(i)?s.flags.filter(x=>x!==i):[...s.flags,i];break;}
 case 'gameplay.tile.dig':{const i=Number(payload);if(!Number.isInteger(i)||i<0||i>=s.n*s.n||s.dug.includes(i)||s.won)return fail('该格不可重复挖掘');if(s.shovels<=0)return fail('铲子次数已用完');s.flags=s.flags.filter(x=>x!==i);s.shovels--;s.dug.push(i);const found=this.found();if(found===s.n){s.won=true;this.open('success');}else if(s.shovels===0)this.open('failed');detail='挖掘一次，剩余 '+s.shovels+' 铲；宝藏 '+found+'/'+s.n;break;}
 case 'gameplay.energy.info':this.open('energy');break;
 case 'gameplay.radar.watch_ad':if(this.found()===s.n)return fail('宝藏已全部发现');return ad(()=>{s.hint=this.treasures().find(i=>!s.dug.includes(i));});
 case 'gameplay.fail.revive':if(s.shovels>0||s.won)return fail('当前无需复活');return ad(()=>{s.shovels+=2;s.modal=null;});
 case 'gameplay.success.collect':if(!s.won||s.claimed)return fail('奖励不可领取或已领取');return txn(()=>{if(!s.won||s.claimed)return false;const drops=this.ensureRoundDrops(),counts=new Map();for(const cell of this.treasures())if(s.dug.includes(cell)){const index=ITEMS[drops[cell]]?drops[cell]:0;counts.set(index,(counts.get(index)||0)+1);}s.claimed=true;const rewards=[...counts].map(([index,count])=>{s.inventory[index]+=count;return [ITEMS[index][0],ITEMS[index][1],count];});this.reward(rewards,'home');return '本轮挖出的 '+rewards.reduce((sum,item)=>sum+item[2],0)+' 件产物已写入仓库，仅结算一次';});
 case 'gameplay.reward.dismiss':case 'warehouse_sell.reward.dismiss':if(s.modal!=='reward')return fail('没有待退出的奖励弹窗');this.go(s.rewardReturn||'home');break;
 case 'debt.amount.minus':case 'debt.amount.plus':case 'debt.amount.max':{const max=Math.min(s.coins,s.debt);const next=id.endsWith('max')?max:s.amount+(id.endsWith('plus')?100:-100);if(next<=0||next>max)return fail(next<=0?'已达最小还款金额':'金币不足或已达剩余债务');s.amount=next;break;}
 case 'debt.repay.open':if(s.amount<=0||s.amount>Math.min(s.coins,s.debt))return fail('还款金额无效');s.snapshot={amount:s.amount};this.open('repay');break;
 case 'debt.repay.commit':return txn(()=>{const n=s.snapshot?.amount;if(s.modal!=='repay'||!n||n>Math.min(s.coins,s.debt))return false;s.snapshot=null;s.coins-=n;s.debt-=n;s.amount=Math.min(100,s.coins,s.debt);this.open(s.debt===0?'debtCleared':'repaid');return '还款 '+n+' 金币，剩余债务 '+s.debt;});
 case 'debt.unlock.lending':if(s.debt!==0)return fail('债务尚未还清');this.open('debtCleared');break;
 case 'lending.refresh.ad':if(s.debt)return fail('还清债务后开放放贷');return ad(()=>{s.batch++;s.offers.forEach(o=>{o.batch=s.batch;o.signed=false});s.refreshAt=s.clock+6;});
 case 'lending.candidate.focus':{const o=s.offers[Number(payload)];if(!o||o.signed)return fail('候选合同不可选择');s.selectedOffer=o.id;detail='已选择 '+o.name;break;}
 case 'lending.candidate.select':{const o=s.offers[Number(payload??s.selectedOffer)];if(!o||o.signed)return fail('候选合同已签约或失效');if(s.debt)return fail('需要还清债务');if(this.activeNotes().length>=this.slots())return fail('借据槽位已满');if(s.coins<o.principal)return fail('金币不足');s.selectedOffer=o.id;s.snapshot={...clone(o),vipBoost:this.loanVipBoost(),interest:this.loanInterest(o)};this.open('loan');break;}
 case 'lending.candidate.loaned':{const o=s.offers[Number(payload??s.selectedOffer)];const n=s.notes.find(n=>n.offer===o?.id&&n.batch===o.batch);if(n)s.selectedNote=n.id;this.go('notes');break;}
 case 'lending.loan.commit':return txn(()=>{const o=s.offers[s.selectedOffer],snap=s.snapshot;if(s.debt||!snap||snap.batch!==o.batch||o.signed||s.coins<o.principal||this.activeNotes().length>=this.slots())return false;s.coins-=o.principal;o.signed=true;const n={id:s.nextNote++,offer:o.id,batch:o.batch,name:o.name,avatar:o.avatar,principal:o.principal,interest:snap.interest??this.loanInterest(o),vipBoost:snap.vipBoost??this.loanVipBoost(),due:s.clock+o.hours,status:'active'};s.notes.push(n);s.selectedNote=n.id;this.go('notes');return '已签署借据，本金扣除 '+o.principal;});
 case 'lending.note.active.open':case 'lending.note.matured.open':case 'lending.note.runaway.open':s.selectedNote=Number(payload??s.selectedNote);if(!this.note())return fail('借据不存在');this.open('note');break;
 case 'lending.note.collect':return txn(()=>{const n=payload!==undefined&&payload!==null&&payload!==''?s.notes.find(n=>n.id===Number(payload)):this.note();if(n?.status!=='matured')return false;s.selectedNote=n.id;n.status='collected';const sum=n.principal+n.interest;s.coins+=sum;s.history.unshift(clone(n));this.go('notes');return '本金与利息共 '+sum+' 已到账';});
 case 'lending.note.runaway.ack':return txn(()=>{const n=payload!==undefined&&payload!==null&&payload!==''?s.notes.find(n=>n.id===Number(payload)):this.note();if(n?.status!=='runaway')return false;s.selectedNote=n.id;n.status='loss_acknowledged';s.history.unshift(clone(n));this.go('notes');return '损失已记录，槽位释放；不重复扣本金';});
 case 'lending.history.open':if(!s.history.length)return fail('暂无已结算借据');this.open('loanHistory');break;
 case 'lending.history.item':s.historyIndex=Number(payload||0);this.open('historyDetail');break;
 case 'lending.slot.locked':this.open('slotLocked');break;
 case 'guild.members.open':if(!s.joined)return fail('尚未加入协会');this.go('members');break;
 case 'guild.member.open':s.selectedMember=Number(payload??1);if(!this.member())return fail('成员已离开');this.open('member');break;
 case 'guild.manage.open':if(!s.joined||!s.president)return fail('仅会长可管理协会');this.go('manage');break;
 case 'guild.member.kick.open':if(!s.president||s.selectedMember===0||!this.member())return fail('没有权限移出该成员');this.open('kick');break;
 case 'guild.member.kick.commit':return txn(()=>{if(!s.president||s.selectedMember===0||!this.member())return false;const name=this.member().name;s.members=s.members.filter(m=>m.id!==s.selectedMember);this.go('members');return name+' 已移出协会';});
 case 'guild.member.role.open':if(!s.president||s.selectedMember===0||!this.member())return fail('没有调整权限');s.roleDraft=this.member().role;s.permissionDraft=clone(s.permissions);this.open('role');break;
 case 'guild.member.role.commit':return txn(()=>{if(!s.president||!this.member()||s.selectedMember===0||!['成员','管理员','副会长'].includes(s.roleDraft))return false;this.member().role=s.roleDraft;s.permissions=clone(s.permissionDraft);this.open('member');return '职务与权限已保存';});
 case 'guild.module.aid':case 'guild.module.mine':if(!s.joined)return fail('尚未加入协会');if(!needPass())return fail('VIP证已过期');this.go(id.endsWith('aid')?'aid':'mine');break;
 case 'guild.mine.start':if(!s.joined||!needPass())return fail('需要有效VIP证');if(Number.isFinite(s.mineDue))return fail(s.clock>=s.mineDue?'请先发放本轮奖励':'联合开采正在进行');s.mineDue=s.clock+6;return good('联合开采已开始，6小时后完成');
 case 'guild.mine.collect':if(!s.joined||!needPass())return fail('需要有效VIP证');if(!Number.isFinite(s.mineDue))return fail('请先开始联合开采');if(s.clock<s.mineDue)return fail('自动开采尚未完成');return txn(()=>{s.inventory[1]+=12;s.inventory[2]+=5;s.inventory[3]+=3;s.mineDue=null;s.mineCycle++;this.reward([['ore_iron','铁矿石',12],['ore_copper','铜矿石',5],['ore_silver','银矿石',3]],'mine');return '本轮矿石已发放入库';});
 case 'guild.module.shop':if(!s.joined)return fail('尚未加入协会');this.go('shop');break;
 case 'guild_apply.guild.select':s.selectedGuild=Number(payload||0);if(!this.guilds()[s.selectedGuild])return fail('协会不存在');this.open('guildDetail');break;
 case 'guild_apply.submit':return txn(()=>{if(s.joined||!this.pass()||s.depth<(this.guilds()[s.selectedGuild]?.depth??Infinity)||s.application)return false;s.application=true;s.applicationGuild=s.selectedGuild;this.open('applied');return '申请已提交，等待审核';});
 case 'guild_apply.cancel_application':return txn(()=>{if(!s.application||s.joined)return false;s.application=false;this.go('apply');return '申请已撤回';});
 case 'guild_apply.create.open':if(s.joined||!this.pass()||s.depth<100||s.coins<10000)return fail('需未加入协会、有效VIP证、100 米深度与 10,000 金币');s.guildDraft='新矿工协会';this.open('createGuild');break;
 case 'guild_apply.create.commit':return txn(()=>{if(s.joined||!this.pass()||s.depth<100||s.coins<10000||!s.guildDraft?.trim()||s.guildDraft.trim().length>12)return false;s.coins-=10000;s.guildName=s.guildDraft.trim();s.joined=true;s.president=true;s.application=false;s.members=s.members.filter(m=>m.id===0);this.go('guild');return '协会已创建';});
 case 'guild_shop.category':{const tab=Number(payload);if(!Number.isInteger(tab)||tab<0||tab>3)return fail('分类不存在');s.shopTab=tab;break;}
 case 'guild_shop.contribute.open':if(!s.joined||s.coins<100)return fail('需要协会成员身份及至少 100 金币');s.amount=100;this.open('contribute');break;
 case 'guild_shop.contribute.minus':case 'guild_shop.contribute.plus':{const n=s.amount+(id.endsWith('plus')?100:-100);if(n<100||n>s.coins)return fail(n<100?'已达最小贡献金额':'金币不足');s.amount=n;break;}
 case 'guild_shop.contribute.commit':return txn(()=>{if(s.modal!=='contribute'||!s.joined||s.amount<100||s.amount>s.coins||s.amount%100)return false;const n=s.amount/10;s.coins-=s.amount;s.contribution+=n;this.addGuildGrowth(n);this.reward([['guild_shield','贡献值',n]],'shop');return '金币贡献成功，获得 '+n+' 贡献值';});
 case 'guild_shop.item.select':s.selectedGood=Number(payload||0);if(!s.joined||!GOODS[s.selectedGood]||s.stock[s.selectedGood]<=0)return fail('商品已售罄或未解锁');s.snapshot={stock:s.stock[s.selectedGood]};this.open('exchange');break;
 case 'guild_shop.item.exchange':return txn(()=>{const i=s.selectedGood,g=GOODS[i];if(!s.joined||!g||s.stock[i]<=0||s.contribution<g[2]||s.snapshot?.stock!==s.stock[i])return false;s.stock[i]--;s.contribution-=g[2];const itemIndex=ITEMS.findIndex(item=>item[0]===g[0]&&item[1]===g[1]);if(itemIndex>=0)s.inventory[itemIndex]+=g[4];else {s.shopBag=s.shopBag||{};s.shopBag[g[1]]=(s.shopBag[g[1]]||0)+g[4];}this.reward([[g[0],g[1],g[4]]],'shop');return '兑换成功，贡献扣除 '+g[2];});
 case 'warehouse.item.owned':case 'warehouse.item.unowned':s.selectedItem=Number(payload??s.selectedItem);if(!ITEMS[s.selectedItem]||s.selectedItem===6){s.selectedItem=5;return fail('物品不存在');};s.warehouseAmount=1;this.open(null);break;
 case 'warehouse.preview.minus':case 'warehouse.preview.plus':case 'warehouse.preview.max':{const max=s.inventory[s.selectedItem];if(max<=0)return fail('尚未拥有该物品');const n=s.warehouseAmount||1;s.warehouseAmount=Math.max(1,Math.min(max,id.endsWith('max')?max:n+(id.endsWith('plus')?1:-1)));break;}
 case 'warehouse.item.sell':if(s.inventory[s.selectedItem]<=0)return fail('没有可出售的物品');s.amount=s.modal==='item'?1:Math.min(s.inventory[s.selectedItem],s.warehouseAmount||1);s.snapshot={stock:s.inventory[s.selectedItem]};this.open('sell');break;
 case 'warehouse.scroll':detail='四列列表纵向滚动，保持选中物品';break;
 case 'warehouse_sell.amount.minus':case 'warehouse_sell.amount.plus':case 'warehouse_sell.amount.max':{const max=s.inventory[s.selectedItem];const n=id.endsWith('max')?max:s.amount+(id.endsWith('plus')?1:-1);if(n<1||n>max)return fail(n<1?'已达最小数量':'已达库存上限');s.amount=n;break;}
 case 'warehouse_sell.commit':return txn(()=>{const i=s.selectedItem;if(s.amount<1||s.amount>s.inventory[i]||s.snapshot?.stock!==s.inventory[i])return false;const n=s.amount*ITEMS[i][3];s.inventory[i]-=s.amount;s.coins+=n;this.reward([['coin','金币',n]],'warehouse');return '出售成功：库存减少 '+s.amount+'，金币增加 '+n;});
 case 'extra.aid.request':{const slot=Number(payload??0);if(!Number.isInteger(slot)||slot<0||slot>1)return fail('申请槽位不存在');if(!s.joined||!needPass()||this.aidSlots()[slot].posted)return fail('该槽位已有申请');s.aidSlot=slot;this.syncAid();s.aidDraft=this.aidSlots()[slot].item;this.open('aidRequest');break;}
 case 'extra.aid.material.select':{const i=Number(payload);if(s.modal!=='aidRequest'||!ITEMS[i]||i===6||!s.inventory[i])return fail('请选择已拥有的材料');s.aidDraft=i;break;}
 case 'extra.aid.request.submit':return txn(()=>{const i=s.aidDraft,r=this.aidSlots()[s.aidSlot??0];if(!s.joined||!this.pass()||r.posted||s.modal!=='aidRequest'||!ITEMS[i]||i===6||!s.inventory[i])return false;Object.assign(r,{item:i,quantity:5,posted:true,ready:false,due:s.clock+12/60,dueWall:Date.now()+12*60000});this.syncAid();this.go('aid');return '已申请 '+ITEMS[i][1]+' × 5，预计12分钟完成';});
 case 'extra.aid.order.donate':return txn(()=>{const i=Number(payload),o=this.aidOrders()[i];if(!o||!s.joined||!this.pass()||s.aidOrdersDone?.[i]||s.inventory[o.index]<o.total-o.received)return false;s.inventory[o.index]-=o.total-o.received;s.aidOrdersDone=s.aidOrdersDone||{};s.aidOrdersDone[i]=true;s.contribution+=o.reward;this.addGuildGrowth(o.reward);const day=Math.floor(s.clock/24);if(s.aidDailyDay!==day){s.aidDailyDay=day;s.aidDaily=0;}s.aidDaily+=o.reward;return '捐赠成功，获得 '+o.reward+' 贡献';});
 case 'extra.aid.donate':return txn(()=>{if(!s.joined||!this.pass()||s.aidDonated||s.inventory[1]<5)return false;s.inventory[1]-=5;s.aidDonated=true;s.contribution+=20;this.addGuildGrowth(20);detail='捐赠 5 铁矿石，获得 20 贡献';return detail;});
 case 'extra.aid.collect':return txn(()=>{const slot=Number(payload??s.aidSlot??0);if(!Number.isInteger(slot)||slot<0||slot>1)return false;this.syncAid();const r=this.aidSlots()[slot];if(!s.joined||!this.pass()||!r.posted||!r.ready)return false;const i=r.item,q=r.quantity;r.posted=false;r.ready=false;s.aidSlot=slot;this.syncAid();s.inventory[i]+=q;this.reward([[ITEMS[i][0],ITEMS[i][1],q]],'aid');return '互助物资已入库';});
 case 'extra.notice.open':if(!s.president)return fail('没有公告编辑权限');s.noticeDraft=s.notice;this.open('notice');break;
 case 'extra.notice.save':return txn(()=>{if(!s.president||!s.noticeDraft?.trim()||s.noticeDraft.length>60)return false;s.notice=s.noticeDraft.trim();s.modal=null;return '公告已更新';});
 case 'extra.audit.open':if(!s.president)return fail('没有审核权限');this.go('audit');break;
 case 'extra.audit.accept':case 'extra.audit.reject':return txn(()=>{if(!s.president||s.auditDone)return false;if(id.endsWith('accept'))s.members.push({id:9,name:'矿工小石',avatar:'mole_rookie',role:'成员',expired:false});s.auditDone=true;return id.endsWith('accept')?'申请已通过，成员人数增加':'申请已拒绝';});
case 'nav.back':if(s.modal==='buildingUpgrade'&&s.selectedBuilding){s.selectedBuilding=null;}else if(s.modal==='reward'){this.go(s.rewardReturn||'home');}else if(['levelDetails','lockedLevel','wealth','buildingUpgrade','workshop'].includes(s.modal)&&s.levelModalTrail?.length){this.open(s.levelModalTrail.pop());}else if(s.modal){s.modal=null;s.levelModalTrail=[];}else this.go(['members','manage','aid','mine','shop','audit'].includes(s.page)?'guild':'home');break;
 default:return fail('未实现动作：'+id);
 }
 return good(detail||'已切换至对应界面');
 }
 treasures(n=this.s.n){return n===4?[1,7,8,14]:[1,9,17,18,28,32];}
 found(){return this.s.dug.filter(i=>this.treasures().includes(i)).length;}
 scenario(name){const s=this.s;switch(name){case 'collection':s.inventory=ITEMS.map((it,i)=>s.inventory[i]||1);this.go('warehouse');break;case 'normal':this.s=this.journey?initial():unlockReview(initial());this.initializeProgression();break;case 'poor':s.coins=0;break;case 'tired':s.stamina=0;break;case 'expired':s.passUntil=s.clock;s.passUntilWall=Date.now();delete s.vipAdDay;break;case 'clearDebt':s.debt=0;break;case 'unjoined':s.joined=false;s.application=false;this.go('apply');break;case 'ordinary':s.president=false;break;case 'advance':s.clock+=24;this.settleTime();break;case 'aidReady':Object.assign(this.aidSlots()[s.aidSlot??0],{posted:true,ready:true});this.syncAid();this.go('aid');break;case 'approved':if(s.application){s.application=false;s.joined=true;s.guildName=this.guilds()[s.applicationGuild??s.selectedGuild].name;s.president=false;this.go('guild');}break;case 'win':this.clearMismatchedFixtureRound();this.go('gameplay');s.dug=this.treasures();s.won=true;s.claimed=false;s.modal='success';break;case 'lose':this.clearMismatchedFixtureRound();this.go('gameplay');s.shovels=0;s.won=false;s.modal='failed';break;case 'rich':s.coins=100000;s.contribution=3000;s.wealth=11;s.passUntil=s.clock+24;s.passUntilWall=Date.now()+24*3600000;break;case 'emptyRank':s.emptyRank=!s.emptyRank;this.go('ranking');break;}
 this.last={title:'准备检查场景',ok:true,detail:'评审环境已切换，不计入业务动作通过率'};
 }
 prepare(id){const ad=this.s.adMode,tx=this.s.txMode,seen=this.s.seen,events=this.s.events;this.s=unlockReview(initial());const s=this.s;s.adMode=ad;s.txMode=tx;s.seen=seen;s.events=events;s.debt=0;
 if(id.startsWith('gameplay.')){s.page='gameplay';if(id.includes('level.'))s.modal='levels';if(id.includes('fail.')){s.shovels=0;s.modal='failed';}if(id.includes('success.')){s.won=true;s.dug=this.treasures();s.modal='success';}if(id.includes('reward.')){s.claimed=true;s.reward=[['coin','金币',80]];s.rewardReturn='home';s.modal='reward';}if(id.includes('tutorial.')){s.tutorial=1;s.modal='tutorial';}}
 if(id.startsWith('home.')){s.page='home';if(id==='home.debt.open')s.debt=4500;if(id==='home.lending.open')s.notes=[];if(id==='home.loan.active')s.notes=s.notes.filter(n=>n.status==='active');if(id==='home.loan.matured')s.notes=s.notes.filter(n=>n.status==='matured');if(id.includes('renew_ad')){s.passUntil=0;s.modal='pass';}}
 if(id.startsWith('ranking.'))s.page='ranking';
 if(id.startsWith('debt.')){s.page='debt';s.debt=4500;s.amount=200;s.snapshot={amount:200};if(id.includes('commit'))s.modal='repay';if(id.includes('unlock')){s.debt=0;s.modal='debtCleared';}}
 if(id.startsWith('lending.')){s.page=id.includes('tab.hall')?'notes':'lending';if(/note\.|history|slot\.|tab.notes/.test(id))s.page='notes';if(id.includes('loan.commit')){s.snapshot=clone(s.offers[0]);s.modal='loan';}if(id.includes('pass.activate')){s.vipAds=0;s.passUntil=0;s.modal='pass';}if(id.includes('candidate.loaned')){s.offers[0].signed=true;s.notes[0].batch=0;}if(id.includes('note.matured')||id.includes('note.collect'))s.selectedNote=2;if(id.includes('runaway'))s.selectedNote=3;if(/note.collect|runaway.ack/.test(id))s.modal='note';if(id.includes('history')){s.history=[{...s.notes[1],status:'collected'}];if(id.endsWith('item'))s.modal='loanHistory';}}
 if(id.startsWith('guild.')){s.page='guild';if(id.includes('member.')){s.page='members';s.modal=id==='guild.member.open'?null:'member';}if(id.includes('kick.commit'))s.modal='kick';if(id.includes('role.commit')){s.modal='role';s.roleDraft='管理员';s.permissionDraft=clone(s.permissions);}if(id.includes('mine.collect')){s.page='mine';s.mineDue=0;}}
 if(id.startsWith('guild_apply.')){s.page='apply';s.joined=false;if(id.includes('submit'))s.modal='guildDetail';if(id.includes('create.commit')){s.modal='createGuild';s.guildDraft='新矿工协会';}if(id.includes('cancel')){s.application=true;s.modal='applied';}if(id.includes('pass.activate')){s.vipAds=0;s.passUntil=0;s.modal='pass';}}
 if(id.startsWith('guild_shop.')){s.page='shop';s.amount=200;if(id.includes('contribute.')&&!id.endsWith('open'))s.modal='contribute';if(id.includes('item.exchange')){s.modal='exchange';s.snapshot={stock:s.stock[0]};}}
 if(id.startsWith('warehouse')){s.page='warehouse';if(id.includes('unowned'))s.selectedItem=6;if(id==='warehouse.item.sell')s.modal='item';if(id.startsWith('warehouse_sell.')){s.modal='sell';s.amount=2;s.snapshot={stock:s.inventory[1]};}if(id.includes('reward.dismiss')){s.modal='reward';s.reward=[['coin','金币',16]];s.rewardReturn='warehouse';}}
 if(id.startsWith('extra.aid.')){s.page='aid';if(id.endsWith('collect')){Object.assign(this.aidSlots()[s.aidSlot??0],{posted:true,ready:true});this.syncAid();}}
 if(id.startsWith('extra.notice.')){s.page='manage';if(id.endsWith('save')){s.modal='notice';s.noticeDraft='欢迎新矿工加入协会';}}
 if(id.startsWith('extra.audit.')){s.page=id.endsWith('open')?'manage':'audit';}
 this.last={title:'已准备：'+id,ok:true,detail:'请点击手机中的对应控件；准备场景未计为完成。'};
 }
}
const api={ReviewEngine,ITEMS,OFFERS,GOODS,MINING_COIN_COSTS,BUILDING_TIERS};if(typeof module!=='undefined')module.exports=api;else root.MoleReview=api;
if(typeof module!=='undefined'&&module.exports)require('./progression.js').install(api);
})(typeof window!=='undefined'?window:globalThis);
