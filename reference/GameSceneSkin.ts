import {Node,Sprite,SpriteFrame,UITransform,Graphics,Color,Label,resources,isValid,sp,Button} from 'cc';

/** GameScene-only appearance adapter. No transforms, layout, events or game state changes. */
export class GameSceneSkin {
 static async apply(canvas:Node){
  const load=(name:string)=>new Promise<SpriteFrame|null>(resolve=>resources.load('game-skin-v1/'+name+'/spriteFrame',SpriteFrame,(err,f)=>{if(err)console.warn('[GameSceneSkin]',name,err);resolve(f||null);}));
  const [background,frame,button,board]=await Promise.all(['background','frame','button','board-treasure'].map(load));
  if(!isValid(canvas))return;
  const before=this.layout(canvas);
  const replace=(path:string,source:SpriteFrame|null,sliced=false)=>{
   const n=canvas.getChildByPath(path),s=n?.getComponent(Sprite),t=n?.getComponent(UITransform);if(!s||!source||!t)return;
   const w=t.width,h=t.height;s.sizeMode=Sprite.SizeMode.CUSTOM;s.spriteFrame=source;s.trim=false;
   s.type=sliced?Sprite.Type.SLICED:Sprite.Type.SIMPLE;t.setContentSize(w,h);
  };
  replace('game_beijing',background);
  replace('game_manghe_1/BG2',background);
  replace('game_manghe_1/BG1',board);
  if(frame){frame.insetTop=frame.insetBottom=80;frame.insetLeft=frame.insetRight=80;}
  if(button){button.insetTop=button.insetBottom=84;button.insetLeft=button.insetRight=92;}
  const panels=['game_manghe_1/Node/zantingUI/Node','game_manghe_1/Tishitanchuang/Node',
   'fail/shengli_beijing/shengli_huode_bg','tilihuifu/tili_tanchuang'];
  for(const path of panels){
   const n=canvas.getChildByPath(path);if(!n||!frame)continue;replace(path,frame,true);
   const t=n.getComponent(UITransform)!;
   const fill=new Node('SkinPaper');fill.layer=n.layer;fill.parent=n;fill.setSiblingIndex(0);
   const g=fill.addComponent(Graphics);g.fillColor=new Color('#FFF0CD');g.roundRect(-t.width/2+22,-t.height/2+22,t.width-44,t.height-44,8);g.fill();
   for(const l of n.getComponentsInChildren(Label))if(l.color.r>180&&l.color.g>180&&l.color.b>180)l.color=new Color('#65411F');
  }
  for(const path of ['game_manghe_1/Node/zantingUI/backMain','game_manghe_1/Node/zantingUI/jixu','game_manghe_1/Tishitanchuang/anniu_lvse',
   'success/backMain','success/nextLevel','success/guangGaoBtn','fail/backMain','fail/chongshi','fail/fuhuo','tilihuifu/pifu_anniu']){
   replace(path,button,true);
   const n=canvas.getChildByPath(path);if(n)for(const l of n.getComponentsInChildren(Label))l.color=new Color('#573515');
  }
  // Keep original HUD icons, board region colours, digits, disabled states and hit areas.
  (canvas as any).__gameSkin={ready:!!background&&!!frame&&!!button&&!!board,layoutUnchanged:before===this.layout(canvas)};
  await this.popups(canvas);
 }
 private static async popups(canvas:Node){
  const names=['panel','paper','button','secondary'];
  const frames=await Promise.all(names.map(k=>new Promise<SpriteFrame|null>(r=>resources.load('shared-ui-v1/'+k+'/spriteFrame',SpriteFrame,(e,f)=>r(e?null:f)))));
  if(!isValid(canvas)||frames.some(f=>!f))return;
  const skin=(n:Node|null,k:string)=>{if(!n)return;const s=n.getComponent(Sprite)||n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.type=Sprite.Type.SLICED;s.spriteFrame=frames[names.indexOf(k)];s.color=Color.WHITE;n.getChildByName('SkinPaper')?.destroy();};
  const size=(n:Node,w:number,h:number,x:number,y:number)=>{n.setPosition(x,y);n.setScale(1,1,1);n.getComponent(UITransform)!.setContentSize(w,h);};
  const text=(parent:Node,name:string,value:string,w:number,h:number,x:number,y:number,font=28)=>{const n=new Node(name);n.layer=parent.layer;n.parent=parent;n.addComponent(UITransform);size(n,w,h,x,y);const l=n.addComponent(Label);l.string=value;l.isBold=font>=32;l.fontSize=font;l.lineHeight=font+10;l.color=new Color('#68421F');l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return n;};
  const title=(parent:Node,value:string,x:number,y:number)=>{text(parent,'SharedPopupTitle',value,420,60,x,y,38);const n=new Node('SharedTitleScroll');n.layer=parent.layer;n.parent=parent;n.setPosition(x,y);const g=n.addComponent(Graphics);g.strokeColor=new Color('#A77738');g.lineWidth=2.5;for(const side of [-1,1]){g.moveTo(side*238,0);g.bezierCurveTo(side*215,-22,side*174,-14,side*162,0);g.bezierCurveTo(side*154,9,side*170,13,side*171,3);g.stroke();g.moveTo(side*206,-11);g.bezierCurveTo(side*229,-30,side*246,-15,side*230,-8);g.stroke();}};
  const clean=(root:Node)=>{for(const l of root.getComponentsInChildren(Label)){l.color=new Color('#68421F');l.enableOutline=false;l.enableShadow=false;if(l.node.parent?.getComponent(Label))l.node.active=false;}for(const s of root.getComponentsInChildren(sp.Skeleton)){s.enabled=false;s.node.active=false;}for(const b of root.getComponentsInChildren(Button)){if(b.node.getComponent(Sprite)&&b.node.getComponent(UITransform)!.width<700)skin(b.node,'button');for(const l of b.node.getComponentsInChildren(Label)){l.fontSize=Math.min(l.fontSize,28);l.lineHeight=36;l.color=new Color('#4A2C10');}}};
  for(const key of ['success','fail']){
   const root=canvas.getChildByName(key);if(!root)continue;clean(root);
   const panel=root.getChildByName('shengli_beijing')!;skin(panel,'panel');size(panel,600,720,0,-30);
   const inner=panel.getChildByName('shengli_zhanshi_bg');if(inner)skin(inner,'paper');
   const old=panel.getChildByName('shengli_huode_bg');if(old){if(key==='fail')old.active=false;else {skin(old,'paper');for(const l of old.getComponentsInChildren(Label))l.string='本次获得';}}
   title(root,key==='success'?'开采成功':'开采未完成',0,260);
   if(key==='success'){
    const l=root.getChildByName('Label')?.getComponent(Label);if(l){l.string='宝藏已收集，收下本次战利品';l.fontSize=27;size(l.node,500,48,0,175);}
    for(const name of ['newLabel1','newLabel2']){const n=root.getChildByName(name);if(n)size(n,500,40,0,name==='newLabel1'?125:80);}
    if(old)size(old,480,42,0,48);if(inner)size(inner,500,118,0,-30);
   }else{
    const l=panel.getChildByName('Label')?.getComponent(Label);if(l){l.string='还有宝藏未发现，补充矿铲继续探索';l.fontSize=25;size(l.node,510,58,0,163);}
    const face=panel.getChildByName('shibai_shushu_xiaotouxiang');if(face)face.active=false;
    const remaining=panel.getChildByName('Label-001');if(remaining){remaining.getComponent(Label)!.string='剩余宝藏';size(remaining,170,44,-65,57);}const count=panel.getChildByName('shushuNum');if(count)size(count,90,44,95,57);
   }
   for(const name of ['backMain','nextLevel','guangGaoBtn','chongshi','fuhuo']){const n=root.getChildByName(name);if(!n)continue;const primary=(key==='success'?name==='nextLevel':name==='fuhuo');skin(n,primary?'button':'secondary');if(!primary)for(const l of n.getComponentsInChildren(Label))l.color=new Color('#FFF2CF');if(primary)size(n,480,72,0,-180);else size(n,230,66,name==='backMain'?-125:125,-275);}
   text(root,'ResultInstruction','请选择下方操作继续',480,36,0,-345,21);
  }
  const pause=canvas.getChildByPath('game_manghe_1/Node/zantingUI');if(pause){clean(pause);const panel=pause.getChildByName('Node')!;skin(panel,'panel');size(panel,580,760,308,-565);for(const n of pause.children){const l=n.getComponent(Label);if(l){if(l.string.includes('关闭')){l.string='点击任意区域关闭。';size(n,520,40,308,-990);}else n.active=false;}}title(pause,'设置与暂停',308,-250);text(pause,'PauseDismissHint','点击任意区域关闭。',520,40,308,-990,22).getComponent(Label)!.color=new Color('#FFF2CF');const shade=pause.getChildByName('Node-001');shade?.on(Node.EventType.TOUCH_END,()=>{const owner=canvas.components.find((c:any)=>c.closePausePanel) as any;owner?.closePausePanel();});
   for(const name of ['music','music2','virb','seruo','zt_kaiguan_bj']){const n=pause.getChildByName(name);if(!n)continue;skin(n,'paper');for(const l of n.getComponentsInChildren(Label)){l.enableOutline=false;l.fontSize=26;l.lineHeight=36;if(l.string==='开'||l.string==='关'){l.node.setPosition(0,0);l.node.getComponent(UITransform)!.setContentSize(100,40);l.horizontalAlign=Label.HorizontalAlign.CENTER;skin(l.node.parent,l.string==='开'?'button':'secondary');if(l.string==='关')l.color=new Color('#FFF2CF');}}}
  }
  const hint=canvas.getChildByPath('game_manghe_1/Tishitanchuang');if(hint){
   clean(hint);const panel=hint.getChildByName('Node')!;skin(panel,'panel');size(panel,580,500,0,-145);
   for(const l of hint.getComponentsInChildren(Label)){if(l.string==='显示鼠宝')l.node.active=false;if(l.string.includes('显示一只')){l.string='探测一处尚未发现的宝藏';l.fontSize=28;size(l.node,490,48,0,-175);}if(l.string.includes('点击')){l.string='点击任意区域关闭。';l.color=new Color('#FFF2CF');}}
   title(hint,'宝藏提示',0,42);
   const oldIcon=hint.getChildByName('tishi-001');if(oldIcon)oldIcon.active=false;
   const compass=new Node('MiningCompass');compass.layer=hint.layer;compass.parent=hint;compass.setPosition(0,-76);const g=compass.addComponent(Graphics);
   // Brass case, dark dial and cream needle share the mining UI palette.
   g.fillColor=new Color('#68421F');g.circle(0,0,62);g.fill();g.fillColor=new Color('#D7A54C');g.circle(0,0,58);g.fill();g.fillColor=new Color('#263A3A');g.circle(0,0,49);g.fill();g.strokeColor=new Color('#E9C77F');g.lineWidth=2;
   for(let i=0;i<12;i++){const a=i*Math.PI/6;g.moveTo(Math.sin(a)*39,Math.cos(a)*39);g.lineTo(Math.sin(a)*45,Math.cos(a)*45);g.stroke();}
   g.fillColor=new Color('#F6DE9A');g.moveTo(20,35);g.lineTo(-12,-2);g.lineTo(2,-11);g.close();g.fill();g.fillColor=new Color('#A87839');g.moveTo(-20,-35);g.lineTo(12,2);g.lineTo(-2,11);g.close();g.fill();g.fillColor=new Color('#EDC263');g.circle(0,0,7);g.fill();
   const button=hint.getChildByName('anniu_lvse');if(button){size(button,460,76,0,-282);skin(button,'button');for(const n of button.children)n.active=false;text(button,'HintActionLabel','看广告 · 获取提示',420,54,0,0,28);}
  }
  const energy=canvas.getChildByName('tilihuifu');if(energy)energy.active=false;
  const retry=canvas.getChildByPath('fail/chongshi');if(retry){for(const n of retry.children)n.active=false;text(retry,'RetryLabel','重新开采',210,50,0,0,27).getComponent(Label)!.color=new Color('#FFF2CF');}
  (canvas as any).__gamePopupSkin={ready:true,panels:4};
 }
 private static layout(root:Node){
  const rows:any[]=[];const visit=(n:Node)=>{if(n.name==='SkinPaper')return;const t=n.getComponent(UITransform);rows.push([n.uuid,n.position.x,n.position.y,n.scale.x,n.scale.y,n.angle,t?.width,t?.height,t?.anchorX,t?.anchorY]);for(const child of n.children)visit(child);};visit(root);return JSON.stringify(rows);
 }
}
