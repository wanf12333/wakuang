(()=>{
 const animals=['熊','狐狸','浣熊','仓鼠'];
 const moods=new Map();
 function mood(n){const key=n.avatar||n.name||String(n.offer??n.id);if(!moods.has(key))moods.set(key,Math.random()<.5?0:1);return moods.get(key);}
 const time=seconds=>[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(v=>String(v).padStart(2,'0')).join(':');
 const countdown=(n,s)=>n.status==='matured'?'可收款':'收款倒计时 '+time(window.review?.s===s?window.review.noteRemaining(n):Math.max(0,Math.ceil((n.due-s.clock)*3600)));
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function species(n){return ({mole_veteran:0,mole_explorer:1,mole_engineer:2,mole_foreman:3,mole_leader:2})[n.avatar]??Math.abs(Number(n.offer??n.id)||0)%4;}
 function portrait(n,cls=''){const i=species(n),m=mood(n);return `<span class="borrower-sprite ${cls}" data-animal="${i}" data-mood="${m}" style="--animal-x:${i%2*100}%;--animal-y:${Math.floor(i/2)*100}%" role="img" aria-label="${animals[i]}借款人"></span>`;}
 function render(s){if(s.debt>0)return '';const notes=(s.notes||[]).filter(n=>['active','matured'].includes(n.status));
 return `<div class="platform-borrowers" aria-label="平台上的借款人">${notes.map((n,i)=>`<div class="borrower-patrol" style="--duration:${13+i%4*2}s;--phase:-${(Number(n.id)||i)*3}s;--start:${i%3*170}px;--lane:${Math.floor(i/3)*24}px" data-note="${escape(n.id)}"><button type="button" class="borrower-person" data-action="lending.tab.notes" data-payload="${escape(n.id)}" aria-label="进入账房，查看${escape(n.name)}借据"><span class="borrower-shadow"></span><span class="borrower-facing">${portrait(n)}<span class="borrower-pickaxe" data-anchor="pickaxe"></span></span><span class="borrower-name">${escape(n.name)}<small class="borrower-countdown ${n.status==='matured'?'is-ready':''}">${countdown(n,s)}</small></span></button></div>`).join('')}</div>`;}
 window.HomeBorrowers=Object.freeze({species,portrait,render});
 setInterval(()=>{const engine=window.review;if(!engine)return;engine.settleTime();document.querySelectorAll('.borrower-patrol').forEach(el=>{const n=engine.s.notes.find(n=>String(n.id)===el.dataset.note);if(!n)return;const label=el.querySelector('.borrower-countdown');if(label){label.textContent=countdown(n,engine.s);label.classList.toggle('is-ready',n.status==='matured');}const button=el.querySelector('.borrower-person');if(button&&['active','matured'].includes(n.status))button.dataset.action=`lending.tab.notes`;});},1000);
})();
