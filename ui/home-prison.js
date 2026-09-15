/* Shared prison artwork for the live home scene and layered art preview. */
(()=>{
 const sayings=[
 ['我要还清债务，迎娶小美！','打工是不可能打工的，只能挖矿维持下生活。','别人挖到金，我挖到新的还款计划。','我不是穷，我的金币还埋在地下。'],
 ['今天多挖一铲，明天少欠一点！','矿可以不出，气势不能输。','小美再等等，我正在跟石头谈工资。','别人靠山吃山，我靠山还款。'],
 ['快还清了！小美，婚礼先别取消！','这不是煤灰，是通往富豪的眼影。','再挖一块，债主就得改口叫老板！','离财务自由，就差最后几铲。'],
 ['债还清了！小美，我来啦！','终于不是负翁，是富翁了！','以前挖矿还债，现在挖矿随缘。','今天的腰杆，比矿镐还直！']
 ];
 const faceSayings={
  S:['本喵亲自下矿，宝石还不快现身！','今天不抓老鼠，改抓矿脉。','这块矿石，已经被本喵盯上了。','喵准深处，一铲入魂！'],
  'meme-trainee':['球和矿镐，我都能转起来！','这段矿道，看我一铲练习到位。','今天的矿场，由我来控场！','挖矿也要卡准节拍。'],
  'meme-master':['年轻矿工，挖矿要讲矿德。','先看矿脉，再稳稳出铲。','这块石头来势很猛，我不大意。','功夫到家，顽石也得让路。'],
  'meme-star':['颜值负责发光，矿镐负责开路。','镜头先别急，等我挖出钻石。','矿洞再深，也挡不住主角登场。','今天的最佳角度，是向下十米。'],
  'meme-yujie':['这矿够硬？俺也去会会它！','别看坑深，姐下去就是干！','这一铲下去，指定有好东西。','矿石别躲了，姐都看见你了！']
 };
 const speechLines=mood=>{const look=window.review?.beautyActive?.();return look?.grade==='S'&&faceSayings[look.id]?faceSayings[look.id]:(sayings[Number(mood)]||sayings[0]);};
 let quoteIndex=0;
 const syncSpeech=()=>document.querySelectorAll('.prison-speech').forEach(el=>{const lines=speechLines(el.dataset.mood),look=window.review?.beautyActive?.();el.textContent=lines[quoteIndex%lines.length];el.dataset.voice=look?.grade==='S'&&faceSayings[look.id]?look.id:'default';});
 setInterval(()=>{if(document.hidden)return;quoteIndex++;syncSpeech();},8000);
 window.HomePrison={residenceNames:['小木屋','温馨木屋','石砌小楼','矿主宅邸','豪华庄园','辉煌宅邸'],expression(s={}){const total=s.debtTotal||1000000,paid=Math.max(0,total-(s.debt??total));return s.debt===0?3:paid>=total*.9?2:paid>=Math.min(5000,total*.25)?1:0;},render({level=1,expression=0,speech=false,freed=false}={}){
  const buildingLevel=Number.isInteger(Number(level))?Math.max(1,Math.min(6,Number(level))):1;
  const reinforced=buildingLevel>=2;
  return `<div class="prison-scene${freed?' is-free':reinforced?' is-reinforced':''}" data-building-level="${buildingLevel}" role="img" aria-label="${freed?HomePrison.residenceNames[buildingLevel-1]+'，主角已出狱':reinforced?'加固矿区监狱':'矿区监狱'}，牢房中的鼹鼠矿工">
   ${freed?`<span class="residence-building" style="--house-x:${(buildingLevel-1)%3*50}%;--house-y:${Math.floor((buildingLevel-1)/3)*100}%"></span>`:'<img class="prison-building hc-building building" src="assets/home-layered/prison-v1.png" alt="" draggable="false">'}
   <span class="prison-name" aria-hidden="true"><strong>矿区监狱</strong><small>Lv.${buildingLevel}</small></span>
   ${speech?`<span class="prison-speech-anchor"><span class="prison-speech" data-mood="${expression}">${speechLines(expression)[quoteIndex%speechLines(expression).length]}</span></span>`:''}
   <div class="prison-cell" aria-hidden="true">
    <div class="prison-patrol">
     <span class="prison-shadow"></span>
     <div class="prison-facing" data-outfit="${freed?'miner':'prisoner'}"><div class="hero-rig"><span class="prison-mole panda-miner" data-anchor="clothes" data-expression="${expression}" style="--panda-x:${expression%2*100}%;--panda-y:${Math.floor(expression/2)*100}%"></span><span class="hero-base-head" style="--panda-x:${expression%2*100}%;--panda-y:${Math.floor(expression/2)*100}%"></span><span class="hero-beauty-head" data-anchor="face" hidden></span><span class="hero-helmet" data-anchor="helmet"></span><span class="hero-pickaxe" data-anchor="pickaxe"></span></div></div>
    </div>
   </div>
   <div class="prison-bars" aria-hidden="true">
    <span class="prison-bar" style="--bar-position:9%"></span>
    <span class="prison-bar" style="--bar-position:29.5%"></span>
    <span class="prison-bar" style="--bar-position:50%"></span>
    <span class="prison-bar" style="--bar-position:70.5%"></span>
    <span class="prison-bar" style="--bar-position:91%"></span>
    <span class="prison-crossbar prison-crossbar-top"></span>
    <span class="prison-crossbar prison-crossbar-bottom"></span>
    <span class="prison-lock"></span>
   </div>
   <span class="prison-reinforcement prison-reinforcement-left" aria-hidden="true"></span>
   <span class="prison-reinforcement prison-reinforcement-right" aria-hidden="true"></span>
  </div>`;
 },speechLines,syncSpeech};
})();
