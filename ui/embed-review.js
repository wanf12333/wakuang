// The comparison canvas embeds actual running UI, not a stale screenshot.
// Shared frame renderer is also used in embedded comparison canvases.
const frameStyle=document.createElement('link');frameStyle.rel='stylesheet';frameStyle.href='smooth-frame.css';document.head.append(frameStyle);
const nativeStyle=document.createElement('link');nativeStyle.rel='stylesheet';nativeStyle.href='native-theme.css?v=1';document.head.append(nativeStyle);
const polishStyle=document.createElement('link');polishStyle.rel='stylesheet';polishStyle.href='design-polish.css?v=1';document.head.append(polishStyle);
const dialogPolishStyle=document.createElement('link');dialogPolishStyle.rel='stylesheet';dialogPolishStyle.href='dialog-polish.css?v=1';document.head.append(dialogPolishStyle);
const modularThemeStyle=document.createElement('link');modularThemeStyle.rel='stylesheet';modularThemeStyle.href='mining-modular-theme.css?v=1';document.head.append(modularThemeStyle);
const dialogThemeStyle=document.createElement('link');dialogThemeStyle.rel='stylesheet';dialogThemeStyle.href='dialog-themes.css?v=1';document.head.append(dialogThemeStyle);
const artDetailsStyle=document.createElement('link');artDetailsStyle.rel='stylesheet';artDetailsStyle.href='reusable-art-details.css?v=1';document.head.append(artDetailsStyle);
const systemLayoutStyle=document.createElement('link');systemLayoutStyle.rel='stylesheet';systemLayoutStyle.href='system-layout-polish.css?v=1';document.head.append(systemLayoutStyle);
document.getElementById('phone')?.setAttribute('data-ui-kit','mining-modular-v1');
const frameScript=document.createElement('script');frameScript.src='smooth-frame.js';document.body.append(frameScript);
if(new URLSearchParams(location.search).get('embed')==='1'){
 const style=document.createElement('style');
 style.textContent='html,body{margin:0!important;padding:0!important;width:720px!important;height:1280px!important;overflow:hidden!important;background:transparent!important}.review-header,.left,.right,.stage-top,.stage-note,#concept-compare{display:none!important}.workspace,.stage{display:block!important;width:720px!important;height:1280px!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important}#phone-wrap{width:720px!important;height:1280px!important;margin:0!important;padding:0!important}#phone{transform:none!important}';
 document.head.append(style);
 const requested=new URLSearchParams(location.search).get('action');
 if(requested==='ranking.tab.depth'||requested==='ranking.tab.wealth')window.reviewAct(requested);
 window.addEventListener('message',event=>{if(event.source===window.parent&&event.data==='review:back')document.getElementById('back').click();});
}
