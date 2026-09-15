/* One state model and one card template. Main canvas and art preview share it;
   amounts/actions come from the current review state, not baked screenshots. */
(()=>{
 const formatTime=hours=>{const seconds=Math.round(Math.max(0,Number(hours)||0)*3600);return [Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':')};
 function describe({s,engine}){
  if(s.debt>0)return {id:'debt',title:'当前负债',icon:'loan_contract',caption:'还清债务，重获自由',amount:s.debt,action:'home.debt.open',button:'前往还款'};
  const note=['runaway','matured','active'].map(status=>s.notes.find(n=>n.status===status)).find(Boolean);
  if(note){
   const shared={note,icon:'loan_contract',amount:note.principal+note.interest};
   if(note.status==='runaway')return {...shared,id:'runaway',title:'借款人跑路',caption:note.name+' · 本金损失',action:'home.loan.runaway',button:'确认损失'};
   if(note.status==='matured')return {...shared,id:'matured',title:'回款待领取',icon:'coin',caption:note.name+' · 已归还',action:'home.loan.matured',button:'领取回款'};
   return {...shared,id:'active',title:'借据进行中',caption:note.name+' · 利率 '+(note.principal?Math.round(note.interest/note.principal*100):0)+'%',remaining:formatTime(note.due-s.clock),action:'home.loan.active',button:'查看借据'};
  }
  return {id:'cleared',title:'债务已还清',icon:'loan_contract',caption:'矿区信贷所已解锁',action:'home.lending.open',button:engine.pass()?'进入放贷':'查看VIP证',pass:engine.pass()};
 }
 function render(c,{preview=false}={}){
  const {num,esc}=c,m=describe(c);
  const row=(label,value,kind='')=>`<span class="status-row"><span>${label}</span><b class="${kind}" style="font-size:${Math.min(25,Math.floor(200/String(value).length))}px">${value}</b></span>`;
  let body;
  if(m.id==='debt')body=`<span class="status-main-value status-loss" style="font-size:${Math.min(49,Math.floor(330/num(m.amount).length))}px">${num(m.amount)}</span><span class="status-help">还清全部债务后<br>持VIP证开启放贷</span>`;
  if(m.id==='cleared')body='<span class="status-check" aria-hidden="true">✓</span><span class="status-help">'+(m.pass?'现在可以办理放贷<br>赚取利息回款':'办理放贷前<br>需激活有效VIP证')+'</span>';
  if(m.id==='active')body=row('本金',num(m.note.principal))+row('剩余',m.remaining,'status-time')+row('到期应收',num(m.amount),'status-gain');
  if(m.id==='matured')body=row('本金','+'+num(m.note.principal),'status-gain')+row('利息','+'+num(m.note.interest),'status-gain')+`<span class="status-total"><small>合计回款</small><b style="font-size:${Math.min(38,Math.floor(330/num(m.amount).length))}px">${num(m.amount)}</b></span>`;
  if(m.id==='runaway')body=row('本金','−'+num(m.note.principal),'status-loss')+row('利息','0')+'<span class="status-help status-loss">待确认本金损失</span>';
  const label=[m.title,m.caption,m.id==='debt'?num(m.amount):'',m.id==='active'?m.remaining:'',m.button].filter(Boolean).join('，');
  const tag=preview?'a':'button';m.action=c.s.debt>0?'home.debt.open':'lending.tab.notes';
  return `<${tag} ${preview?`href="index.html?action=${m.action}"`:`type="button" data-action="${m.action}"`} class="hc-control hc-debt home-status-card home-ledger-entry" data-status="${m.id}" aria-label="账房，${esc(label)}"><img class="ledger-icon" src="assets/visual/ledger-icon-v2.png" alt=""><strong class="ledger-label">账房</strong>${['matured','runaway'].includes(m.id)?'<i class="ledger-dot" aria-hidden="true"></i>':''}</${tag}>`;
 }
 window.HomeStatusCard=Object.freeze({describe,render,formatTime});
})();
