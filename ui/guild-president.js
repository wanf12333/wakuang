/* President-only landing; approved application and member views stay unchanged. */
(()=>{const prior=window.productionUI;
 const original=MoleReview.ReviewEngine.prototype.perform;
 MoleReview.ReviewEngine.prototype.perform=function(id,payload){
  const s=this.s;
  const stage=this.featureStage(id);
  if(this.buildingInfo().level<stage)return this.result(id,false,'主建筑进阶至第 '+stage+' 阶后开放');
  if(id==='nav.back'&&!s.modal&&['shop','aid','mine'].includes(s.page)){
   s.managementTrail=[];this.go('home');return this.result(id,true,'返回主界面');
  }
  if(id==='guild.manage.open'){
   if(!s.joined||!s.president)return this.result(id,false,'仅会长可管理协会');
   s.managementTrail=[];this.open('guildManage');return this.result(id,true,'打开协会管理');
  }
  const inManagement=s.modal==='guildManage'||s.managementTrail?.length;
  if(inManagement&&id==='nav.back'){
   const previous=s.managementTrail?.pop();s.modal=previous||null;
   return this.result(id,true,'返回上一级');
  }
  const routes={'guild.members.open':'guildMembers','extra.audit.open':'guildAudit','extra.notice.open':'notice','guild.growth.open':'guildGrowth'};
  if(inManagement&&routes[id]){
   if(!s.joined||!s.president)return this.result(id,false,'没有管理权限');
   (s.managementTrail??=[]).push(s.modal);if(id==='extra.notice.open')s.noticeDraft=s.notice;
   this.open(routes[id]);return this.result(id,true,'打开管理详情');
  }
  const before=s.modal,page=s.page,result=original.call(this,id,payload);
  if(inManagement&&result.ok){
   s.page=page;
   if(id==='extra.notice.save'){s.modal=s.managementTrail.pop()||'guildManage';}
   else if(id==='guild.member.kick.commit'){s.managementTrail=['guildManage'];s.modal='guildMembers';}
   else if(s.modal!==before&&['guild.member.open','guild.member.role.open','guild.member.kick.open'].includes(id)){s.managementTrail.push(before);}
   else if(id==='guild.member.role.commit'){s.modal=s.managementTrail.pop()||'guildMembers';}
  }
  return result;
 };
 function management(c){
 const {s,engine,img,btn,esc,num}=c;
 const growth=engine.guildGrowth(),pending=s.auditDone?0:1;
 return `<section class="president-home" aria-label="会长工作台">
 <header class="president-identity">${img('guild_shield')}<div><h3>${esc(s.guildName)} <small>Lv.${growth.level}</small></h3><span>会长工作台</span></div></header>
 <div class="president-summary"><span>协会成员 <b>${s.members.length}/30</b></span><span>我的贡献 <b>${num(s.contribution)}</b></span></div>
 <section class="president-review"><div><h3>入会申请 <b>${pending}</b></h3><p>${pending?'有矿工等待你的审核':'暂无待处理申请'}</p></div>${btn(pending?'去审核':'查看申请','extra.audit.open')}</section>
 <div class="president-tools">${btn('成员管理 <small>职务 · 权限 · 移出</small>','guild.members.open')}${btn('协会成长 <small>等级 · 累计贡献</small>','guild.growth.open')}</div>
 <section class="president-notice"><header><h3>协会公告</h3>${btn('编辑','extra.notice.open')}</header><p>${esc(s.notice)||'尚未发布公告'}</p></section>
 ${engine.pass()?'':'<p class="president-pass">VIP证已过期，互助与开采暂停；协会管理仍可使用。</p>'}
 </section>`;
 }
 window.productionUI={...prior,screen(c){
  const content=prior.screen(c);
  if(c.s.joined&&c.s.president&&['shop','aid','mine'].includes(c.s.page))return content+`<button class="guild-management-small" data-action="guild.manage.open">管理</button>`;
  return content;
 },modal(c){
  if(c.s.modal==='guildManage')return management(c);
  if(c.s.modal==='guildMembers'||c.s.modal==='guildAudit'){
   // Reuse existing member and audit controls inside the management overlay.
   if(c.s.modal==='guildMembers')return `<div class="stack">${c.s.members.map(m=>`<button class="paper member" data-action="guild.member.open" data-payload="${m.id}">${c.img(m.avatar,'avatar','avatars')}<span>${c.esc(m.name)} · ${c.esc(m.role)}</span></button>`).join('')}</div>`;
   return c.s.auditDone?'<div class="paper">暂无待处理申请</div>':`<div class="paper"><h3>矿工小石</h3><p>申请加入协会</p><div class="actions">${c.btn('拒绝','extra.audit.reject','','secondary')}${c.btn('通过','extra.audit.accept')}</div></div>`;
  }
  return prior.modal(c);
 }};})();
