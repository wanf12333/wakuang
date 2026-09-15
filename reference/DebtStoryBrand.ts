import { Node, UITransform, Graphics, Label, LabelOutline, Color, Sprite, SpriteFrame, resources, isValid } from 'cc';
import { MineBackdrop } from './MineBackdrop';

/** Shared native title treatment. Story artwork remains an unmodified source asset. */
export class DebtStoryBrand {
 static node(parent:Node,name:string,w:number,h:number,x=0,y=0){
  const n=parent.getChildByName(name)||new Node(name);n.layer=parent.layer;n.parent=parent;n.setPosition(x,y);(n.getComponent(UITransform)||n.addComponent(UITransform)).setContentSize(w,h);return n;
 }
 static label(parent:Node,name:string,text:string,w:number,h:number,y:number,size:number,color='#FFE6A1'){
  const n=this.node(parent,name,w,h,0,y),l=n.getComponent(Label)||n.addComponent(Label);l.string=text;l.fontFamily='Microsoft YaHei';l.fontSize=size;l.lineHeight=size*1.25;l.isBold=true;l.color=new Color(color);l.horizontalAlign=Label.HorizontalAlign.CENTER;l.verticalAlign=Label.VerticalAlign.CENTER;l.overflow=Label.Overflow.SHRINK;return l;
 }
 static plate(parent:Node,name:string,w:number,h:number,y:number){
  const n=this.node(parent,name,w,h,0,y),g=n.addComponent(Graphics);
  g.fillColor=new Color('#1D1712');g.roundRect(-w/2-5,-h/2-7,w+10,h+10,16);g.fill();
  g.fillColor=new Color('#59361E');g.strokeColor=new Color('#D4A151');g.lineWidth=3;g.roundRect(-w/2,-h/2,w,h,12);g.fill();g.stroke();
  g.fillColor=new Color('#714625');g.roundRect(-w/2+8,0,w-16,h/2-8,7);g.fill();
  g.strokeColor=new Color('#996B35');g.lineWidth=1;
  for(const y1 of [-h*.26,h*.24]){g.moveTo(-w/2+24,y1);g.bezierCurveTo(-w*.2,y1+9,w*.2,y1-8,w/2-24,y1+2);g.stroke();}
  for(const x of [-w/2+17,w/2-17])for(const y1 of [-h/2+17,h/2-17]){g.fillColor=new Color('#E7B963');g.circle(x,y1,4);g.fill();}
  return n;
 }
 static title(parent:Node,y:number,compact=false){
  const board=this.plate(parent,'DebtStoryTitle',compact?510:620,compact?64:146,y);
  this.label(board,'GameTitle','挖矿还债记',compact?460:564,compact?54:90,compact?2:14,compact?39:65);
  if(!compact)this.label(board,'StoryTagline','一铲换一天自由',520,34,-44,22,'#D6B47B');
  return board;
 }
 static loading(canvas:Node){
  const root=this.node(canvas,'DebtStoryLoading',720,1280);root.setSiblingIndex(0);
  const artReady=MineBackdrop.attach(canvas);
  const foregroundReady=Promise.all([
   ['LoadingGround','loading-road',720,780,0,-450],
   ['LoadingCat','loading-cat',450,650,-115,-20],
   ['LoadingCart','loading-cart-treasure',390,405,125,-157]
  ].map(([name,asset,w,h,x,y])=>new Promise<void>(resolve=>{
   const n=this.node(root,String(name),Number(w),Number(h),Number(x),Number(y));
   const s=n.getComponent(Sprite)||n.addComponent(Sprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.trim=false;
   resources.load('game-skin-v1/'+asset+'/spriteFrame',SpriteFrame,(err,f)=>{if(isValid(s)&&f)s.spriteFrame=f;if(err)console.warn('[Loading layer]',asset,err);resolve();});
  })));
  const logo=this.node(root,'DebtStoryTitle',640,214,0,500);
  const title=this.label(logo,'GameTitle','挖矿还债记',630,112,0,76,'#FFE394');
  const outline=title.node.addComponent(LabelOutline);outline.color=new Color('#563012');outline.width=3;
  const logoNode=this.node(logo,'DesignedLogo',640,214),logoSprite=logoNode.getComponent(Sprite)||logoNode.addComponent(Sprite);logoSprite.sizeMode=Sprite.SizeMode.CUSTOM;logoSprite.trim=false;
  const logoReady=new Promise<void>(resolve=>resources.load('debt-story-logo-v2/spriteFrame',SpriteFrame,(err,frame)=>{
   if(isValid(logoSprite)&&frame){logoSprite.spriteFrame=frame;title.node.active=false;}
   if(err)console.warn('[Loading] Logo未加载，保留文字备用',err);resolve();
  }));
  const progress=this.node(root,'LoadingProgressCard',610,80,0,-535);
  const track=this.node(progress,'ProgressTrack',500,24,0,-7);
  const trackSprite=track.getComponent(Sprite)||track.addComponent(Sprite);trackSprite.sizeMode=Sprite.SizeMode.CUSTOM;trackSprite.type=Sprite.Type.SIMPLE;
  const fill=this.node(track,'ProgressFill',494,18,-247,0);fill.getComponent(UITransform)!.setAnchorPoint(0,.5);
  const fillSprite=fill.getComponent(Sprite)||fill.addComponent(Sprite);fillSprite.sizeMode=Sprite.SizeMode.CUSTOM;fillSprite.trim=false;fillSprite.type=Sprite.Type.FILLED;fillSprite.fillType=Sprite.FillType.HORIZONTAL;fillSprite.fillStart=0;fillSprite.fillRange=0;
  const barReady=Promise.all([[trackSprite,'progress-track'],[fillSprite,'progress-fill']].map(([target,asset])=>new Promise<void>(resolve=>resources.load('game-skin-v1/'+asset+'/spriteFrame',SpriteFrame,(err,f)=>{if(isValid(target as Sprite)&&f)(target as Sprite).spriteFrame=f;if(err)console.warn('[Loading bar]',err);resolve();}))));
  const ready=Promise.all([artReady,foregroundReady,logoReady,barReady]).then(()=>{});
  const label=this.label(progress,'LoadingPercent','0%',550,25,-38,18,'#D6B47B');
  const caption=this.label(progress,'LoadingContent','正在读取游戏配置…',560,28,24,20,'#FFE7AD');
  const resize=()=>{const s=canvas.getComponent(UITransform)!.contentSize,scale=Math.min(s.width/720,s.height/1280);root.setScale(scale,scale,1);};resize();canvas.on(Node.EventType.SIZE_CHANGED,resize);
  return {root,ready,label,caption,setStatus:(text:string)=>{caption.string=text;},setProgress:(value:number)=>{const p=Math.max(0,Math.min(1,value));fillSprite.fillRange=p;fill.active=p>0;label.string=Math.floor(p*100)+'%';},dispose:()=>canvas.off(Node.EventType.SIZE_CHANGED,resize)};
 }
}
