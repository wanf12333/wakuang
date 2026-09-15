/* One reusable mining CTA for the live canvas and the layered art preview. */
(()=>{
 window.HomeStartButton={render({preview=false,currentDepth=0,maxDepth=1800}={}){
  const label='开始挖矿';
  const depth=Number.isFinite(Number(maxDepth))?Math.max(0,Number(maxDepth)):0;
  const reached=Number.isFinite(Number(currentDepth))?Math.max(0,Number(currentDepth)):0;
  const compact=n=>n>=1000?Number((n/1000).toFixed(2))+'K':String(n);
  const body=`<span class="mining-max-depth" title="已达到 ${reached} 米 / 最大可挖 ${depth} 米">深度：${compact(reached)}/${compact(depth)}</span><strong class="mining-start-label">开始挖矿</strong>`;
  return preview?`<a class="art-control start home-start-button" href="index.html?action=home.play" aria-label="${label}">${body}</a>`:`<button class="hc-control hc-native-entry hc-workshop depth-workshop" type="button" data-action="home.workshop.open" aria-label="深度 ${reached} 米，最大可挖 ${depth} 米，点击升级矿镐"><img src="assets/visual/equipment-pickaxe.svg" alt=""><strong class="mining-max-depth">深度：${compact(reached)}/${compact(depth)}</strong><i aria-hidden="true">›</i></button><button class="hc-start home-start-button" type="button" data-action="home.play" aria-label="${label}"><strong class="mining-start-label">开始挖矿</strong></button>`;
 }};
})();
