/* Concept UI is rendered as independent cropped SVG art controls, never as a
   full-screen bitmap. Scene, building and character remain separate layers. */
const scene=document.getElementById('scene'),architecture=document.getElementById('architecture');
architecture.innerHTML=HomePrison.render({level:1});
const ui=document.getElementById('concept-ui'),art='assets/home-layered/concept-debt-reference.png';
const specs=[
 ['coins','金币 25,634，点击补充',24,45,264,80,'round','home.wealth.open'],
 ['ranking','排行榜',707,1067,234,133,'round','home.ranking.open'],
 ['gems','宝石交易所，尚未解锁',707,1203,234,114,'round','home.locked_feature'],
 ['warehouse','仓库图鉴',707,1319,234,117,'round','home.warehouse.open'],
 ['pass','VIP证',707,1439,234,113,'round','home.miner_pass'],
 ['guild','矿工协会，尚未解锁',707,1556,234,116,'round','home.guild.open'],
];
function shape(kind,w,h){
 if(kind==='ellipse')return `<ellipse cx="${w/2}" cy="${h/2}" rx="${w/2-2}" ry="${h/2-1}"/>`;
 return `<rect x="2" y="2" width="${w-4}" height="${h-4}" rx="${kind==='pill'?h*.45:28}"/>`;
}
for(const [id,label,x,y,w,h,kind,action] of specs){
 const el=document.createElement(action?'a':id==='pin'?'span':'button');el.className='art-control';el.id='ui-'+id;
 el.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
 el.setAttribute('aria-label',label);if(action)el.href='index.html?action='+action;
 if(id==='pin')el.setAttribute('role','img');
 const source=`<image href="${art}" x="${-x}" y="${-y}" width="941" height="1672"/>`;
 el.innerHTML=`<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><defs><clipPath id="clip-${id}">${shape(kind,w,h)}</clipPath></defs><g clip-path="url(#clip-${id})">${source}</g></svg>`;
 if(!action&&id!=='pin')el.onclick=()=>notify(id==='settings'?'设置入口 · 本页为美术预览':'矿工头像 · 本页为美术预览');
 if(id==='coins'){el.classList.add('native-coins');el.innerHTML='<img src="assets/native-ui/coin.png" alt=""><span>25,634</span>';el.setAttribute('aria-label','金币 25,634');}
 const entries={ranking:['trophy','排行榜'],gems:['amethyst','宝石交易所'],warehouse:['warehouse','仓库图鉴'],pass:['loan_contract','VIP证'],guild:['guild_shield','矿工协会']};
 if(entries[id]){const [icon,title]=entries[id];el.classList.add('native-entry');if(id==='gems')el.classList.add('is-locked');el.innerHTML=`<img src="assets/icons/${icon}.png" alt=""><span>${title}</span>`;}
 ui.append(el);
}
ui.insertAdjacentHTML('beforeend',HomeStartButton.render({preview:true}));
ui.insertAdjacentHTML('beforeend',HomeStatusCard.render({s:{debt:163899,notes:[],clock:0},engine:{pass:()=>true},num:n=>Number(n).toLocaleString('zh-CN'),esc:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')},{preview:true}));
let timeout;function notify(text){const toast=document.getElementById('toast');toast.textContent=text;toast.hidden=false;clearTimeout(timeout);timeout=setTimeout(()=>toast.hidden=true,2200)}
document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{const level=Number(b.dataset.level);architecture.dataset.buildingLevel=String(level);architecture.innerHTML=HomePrison.render({level});document.getElementById('status').textContent='当前：'+(level===1?'矿区监狱':'加固监狱')+' · Lv.'+level;document.querySelectorAll('[data-level]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
document.getElementById('background-only').onchange=e=>scene.classList.toggle('layers-off',e.target.checked);
document.getElementById('hide-ui').onchange=e=>scene.classList.toggle('hide-ui',e.target.checked);
const wrap=document.querySelector('.wrap');function fit(){const width=Math.min(432,window.innerWidth-32);wrap.style.width=width+'px';wrap.style.height=width*1672/941+'px';scene.style.transform='scale('+width/941+')'}window.addEventListener('resize',fit);fit();
