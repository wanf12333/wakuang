/* Continuous vector rim/paper: no raster nine-slice seams at fractional zoom.
   The approved wooden plaque is reused with a curved source-space silhouette. */
(()=>{
 const root=document.getElementById('phone')||document.getElementById('scene');if(!root)return;
 const ns='http://www.w3.org/2000/svg',art=new URL('assets/visual/warehouse-shell-exact.png',document.baseURI).href;
 let sequence=0;
 function draw(el){
  const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
  let svg=el.querySelector(':scope > .smooth-frame');
  if(root.dataset.uiKit==='mining-modular-v1'&&(el.id==='game'||el.classList.contains('modal'))){svg?.remove();return;}
  if(svg&&svg.dataset.size===w+','+h)return;
  if(!svg){svg=document.createElementNS(ns,'svg');svg.classList.add('smooth-frame');svg.setAttribute('aria-hidden','true');el.prepend(svg)}
  const compact=el.classList.contains('home-status-card');
  const id='smooth-'+(++sequence),large=el.id==='game'||root.dataset.modal==='pass',top=compact?3:large?54:52;
  const titleWidth=w*(large?.69:.72),titleHeight=large?126:112;
  svg.dataset.size=w+','+h;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  svg.innerHTML=`<defs>
   <linearGradient id="${id}-rim" x2="0" y2="1"><stop stop-color="#b7f3ff"/><stop offset=".35" stop-color="#52c9ef"/><stop offset="1" stop-color="#75ddf5"/></linearGradient>
   <linearGradient id="${id}-paper" x2="1" y2="1"><stop stop-color="#fff7df"/><stop offset="1" stop-color="#fff0cf"/></linearGradient>
   <linearGradient id="${id}-gold" x2="0" y2="1"><stop stop-color="#fff0a4"/><stop offset=".45" stop-color="#d7a647"/><stop offset="1" stop-color="#8f5b21"/></linearGradient>
   <pattern id="${id}-grain" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><path d="M0 4H22 M0 18H22" stroke="#b58a4a" stroke-width="1" opacity=".08"/></pattern>
   <clipPath id="${id}-plaque"><path d="M167 102 Q168 91 187 83 Q178 63 188 48 Q200 41 222 54 Q232 24 256 22 L688 22 Q711 24 720 54 Q742 42 753 52 Q762 65 752 83 Q776 91 773 103 Q783 115 756 124 Q755 146 725 140 L704 150 Q697 163 675 166 L264 166 Q241 165 230 149 L209 143 Q187 152 185 130 Q163 125 167 102Z"/></clipPath>
  </defs>
  <rect x="3" y="${top}" width="${w-6}" height="${h-top-3}" rx="28" fill="url(#${id}-rim)" stroke="#168bd0" stroke-width="4"/>
  <rect x="8" y="${top+5}" width="${w-16}" height="${h-top-13}" rx="24" fill="none" stroke="#c7f6ff" stroke-width="3"/>
  <rect x="18" y="${top+19}" width="${w-36}" height="${h-top-38}" rx="22" fill="url(#${id}-paper)" stroke="#b69a63" stroke-width="2"/>
  <rect x="21" y="${top+22}" width="${w-42}" height="${h-top-44}" rx="19" fill="url(#${id}-grain)"/>
  ${el.classList.contains('modal')?`<rect x="24" y="${top+25}" width="${w-48}" height="${h-top-50}" rx="17" fill="none" stroke="url(#${id}-gold)" stroke-width="2" opacity=".9"/>
  <g class="frame-rivets" fill="#e5b957" stroke="#80501e" stroke-width="2"><circle cx="31" cy="${top+32}" r="5"/><circle cx="${w-31}" cy="${top+32}" r="5"/><circle cx="31" cy="${h-27}" r="5"/><circle cx="${w-31}" cy="${h-27}" r="5"/></g>`:''}
  <path d="M20 ${top+15} H${w-20}" fill="none" stroke="#369fce" stroke-width="3"/>
  <ellipse cx="16" cy="${top+16}" rx="4" ry="6" fill="#e2fbff"/><ellipse cx="${w-16}" cy="${top+16}" rx="4" ry="6" fill="#e2fbff"/>
  ${compact?'':`<svg x="${(w-titleWidth)/2}" y="0" width="${titleWidth}" height="${titleHeight}" viewBox="157 18 626 154" preserveAspectRatio="none"><image href="${art}" width="941" height="1672" clip-path="url(#${id}-plaque)"/></svg>`}`;
 }
 const tracked=new WeakSet(),resize=new ResizeObserver(entries=>entries.forEach(x=>draw(x.target)));
 function scan(){root.querySelectorAll('#game,.modal,.home-status-card').forEach(el=>{if(!tracked.has(el)){tracked.add(el);resize.observe(el)}draw(el)})}
 new MutationObserver(scan).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['data-modal']});scan();
})();
