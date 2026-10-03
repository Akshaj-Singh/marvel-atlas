/* MARVEL ATLAS • Static canvas explorer • No backend or third-party runtime dependencies. */
(()=>{'use strict';
const DATA=window.MARVEL_DATA;if(!DATA){document.body.textContent='Dataset missing. Keep data.js next to index.html.';return;}
const $=id=>document.getElementById(id), canvas=$('graph'),ctx=canvas.getContext('2d',{alpha:false});
if(!ctx){document.body.textContent='This browser does not support Canvas 2D.';return;}
const U={mcu:{name:'Marvel Studios / MCU',color:'#fb5268',pos:[0,0]},tv:{name:'Marvel Television',color:'#edb974',pos:[-1630,-930]},fox:{name:'Fox / Mutants',color:'#6cd4c8',pos:[1700,-900]},raimi:{name:'Raimi Spider-Man',color:'#f29e60',pos:[-1640,870]},asm:{name:'Amazing Spider-Man',color:'#73b3ec',pos:[-750,1590]},ssu:{name:'Sony spin-offs',color:'#ba91f9',pos:[1700,1000]},sv:{name:'Spider-Verse animation',color:'#fd8dc0',pos:[400,-1800]},x:{name:'Cross-continuity',color:'#b4b5d3',pos:[0,2100]}},
 TYPES={project:'Film / series',character:'Character',actor:'Performer',artifact:'Artifact',callback:'Callback / parallel',creator:'Creator / filmmaker',event:'Event',dialogue:'Dialogue',discovery:'Discovery',place:'Place',organization:'Organization / team',collection:'Collection',identity:'Identity',music:'Music'},
 COLORS={project:null,character:'#8cbbff',actor:'#cba6fb',artifact:'#f1c777',callback:'#f3ab89',creator:'#d9a5fd',event:'#8bd9c8',dialogue:'#9aefd0',discovery:'#b09aea',place:'#86cdc9',organization:'#79d4c4',collection:'#697397',identity:'#e39fcd',music:'#f1a5d6'},
 EDGE={continuation:['Story continuation','↗','#fd657d'],character:['Character connection','◇','#8eb8f1'],appearance:['Appearance','◌','#98d0ff'],actor:['Cast / character','◉','#d0a8f4'],cast:['Production credit','▧','#a7a4de'],portrayal:['Portrayal','◉','#caaaff'],family:['Family','♡','#fd95c4'],identity:['Identity','◇','#fd95c4'],dialogue:['Dialogue callback','❞','#b3edc8'],crossover:['Crossover','⧉','#f6af76'],cameo:['Cameo','✦','#f3b775'],artifact:['Object / artifact','◆','#f2d28c'],object:['Object / artifact','◆','#f2d28c'],reference:['Reference','↗','#9b9ab5'],story:['Story thread','⌁','#d3b6eb'],production:['Production relation','▧','#a6b3f5'],bts:['Behind the scenes','▧','#a6b3f5'],alternate:['Alternate reality','◈','#af9bff'],theme:['Thematic parallel','≈','#d8b48c'],visual:['Visual parallel','◫','#8cdac7'],catalogue:['Catalogue membership','·','#454f72'],place:['Place','⌖','#8bc9ba'],music:['Music / motif','♫','#f7a8df'],postcredit:['Post-credit scene','✧','#eac88d'],easter_egg:['Easter egg','✦','#f7b87f'],'easter-egg':['Easter egg','✦','#f7b87f'],same:['Same universe','◎','#abc3e5'],'same-universe':['Same universe','◎','#abc3e5'],alt:['Alternate reality','◈','#af9bff'],ref:['Reference','↗','#9b9ab5'],egg:['Easter egg','✦','#f7b87f']};
const nmap=new Map(DATA.nodes.map(n=>[n.id,n]));let edges=DATA.edges.filter(e=>nmap.has(e.a)&&nmap.has(e.b)&&e.a!==e.b);edges.forEach((e,i)=>e.idx=i);
const adj=new Map(DATA.nodes.map(n=>[n.id,[]]));for(const e of edges){adj.get(e.a).push(e);adj.get(e.b).push(e)};const globalMajor=new Set(DATA.nodes.filter(n=>n.type==='project').sort((a,b)=>adj.get(b.id).length-adj.get(a.id).length).slice(0,35).map(n=>n.id));
const factsBy=new Map,cbBy=new Map(DATA.callbacks.map(x=>[x.id,x]));for(const f of DATA.facts){if(!factsBy.has(f.project))factsBy.set(f.project,[]);factsBy.get(f.project).push(f)}
const factSearchIndex=new Map([...factsBy].map(([key,rows])=>[key,rows.map(f=>({text:f.text.toLowerCase(),spoiler:f.spoiler}))]));
const $q=$('search'),$results=$('results'),$panel=$('panel'),$body=$('panelBody'),$tip=$('tooltip'),$sidebar=$('sidebar');
const state={mode:'global',selected:null,edge:null,edgeFrom:null,history:[],filters:{universe:'all',type:'all',edge:'all'},spoilers:3,revealed:new Set(),showCatalogue:false,discovery:{density:14,bridges:40,labels:32,neighbors:16},secondHop:false,pathFrom:null,pathTo:null,path:[],tab:'overview',shownFacts:12,query:'',mouse:{x:0,y:0},hover:null,drag:null,rect:{},positions:new Map(),visibleNodes:[],visibleEdges:[],vset:new Set(),transform:{x:0,y:0,k:1},anim:0,layout:'global',viewNodes:[],viewEdges:[],stars:[],renderPending:false,searchResults:[],activeResult:0};
const H=(s)=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const color=n=>n.type==='project'?(U[n.universe]?.color||'#eaa'):(COLORS[n.type]||'#adb3ca');
const typeLabel=n=>TYPES[n.type]||n.type;const edgeCfg=e=>EDGE[e.type]||[e.type.replace(/-/g,' '),'↗','#989bb9'];
const noSpoilerNode=n=>!n.spoiler||n.spoiler<=state.spoilers||state.revealed.has('n:'+n.id);
const relationAllowed=e=>e.type!=='catalogue'||state.showCatalogue||state.mode==='global'&&state.discovery.density>=100;
const groupType=e=>{if(['crossover','cameo'].includes(e.type))return'crossover';if(['actor','cast','portrayal','production','bts'].includes(e.type))return'production';if(['reference','ref','egg','easter-egg','postcredit'].includes(e.type))return'reference';if(['theme','visual'].includes(e.type))return'dialogue';if(e.type==='story')return'story';if(['character','appearance','family','identity','place'].includes(e.type))return'appearance';if(['artifact','object','music'].includes(e.type))return'artifact';if(['alt','alternate','same-universe','same'].includes(e.type))return'alternate';return e.type};
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0}
const jitter=(id,m=1)=>(hash(id)%1000/1000-.5)*m;
// V5.1: restore the compact V4 global layout. All relationship geometry uses
// this exact coordinate system; presentation labels are not graph entities.
function globalLayout(){
 const g=new Map(),groups={};
 for(const n of DATA.nodes)(groups[n.universe]??=[]).push(n);
 for(const [u,list] of Object.entries(groups)){
  const ctr=U[u]?.pos||[0,0],projects=list.filter(n=>n.type==='project'),other=list.filter(n=>n.type!=='project');
  const radius=u==='mcu'?1000:u==='x'?900:570;
  projects.sort((a,b)=>(a.year??3000)-(b.year??3000)||a.label.localeCompare(b.label));
  projects.forEach((n,i)=>{const a=i*2.39996323-1.5,r=Math.min(80+Math.sqrt(i+1)*(u==='mcu'?76:46),radius);g.set(n.id,{x:ctr[0]+Math.cos(a)*r,y:ctr[1]+Math.sin(a)*r*.82})});
  other.sort((a,b)=>a.label.localeCompare(b.label));
  other.forEach((n,i)=>{const a=i*2.39996323+.5,r=(u==='mcu'?300:220)+Math.sqrt(i+1)*(u==='mcu'?47:39);g.set(n.id,{x:ctr[0]+Math.cos(a)*r+38*jitter(n.id),y:ctr[1]+Math.sin(a)*r*.83+30*jitter(n.label)})});
 }
 for(const u of Object.keys(U)){const hub=g.get('hub-'+u);if(hub){hub.x=U[u].pos[0];hub.y=U[u].pos[1]}}
 return g;
}
const isDecorativeHub=n=>Boolean(n&&(n.isHub||n.type==='collection'));
const bridgeType=e=>{
 const a=nmap.get(e.a)?.universe,b=nmap.get(e.b)?.universe;
 return a!==b&&a!=='x'&&b!=='x'?'continuity':a!==b?'shared':'local';
};
// One geometry definition for painting and shielding passive universe captions.
const universeLabelPosition=u=>{
 const c=U[u];return {x:c.pos[0],y:c.pos[1]-(u==='mcu'?663:346)};
};
function universeCaptionBox(u,t){
 const p=universeLabelPosition(u),name=U[u].name.toUpperCase();
 const width=Math.max(96,name.length*7.1+18);
 return {sx:Math.min(Math.max(t.x+p.x*t.k,width/2+9),window.innerWidth-width/2-9),
         sy:t.y+p.y*t.k,width};
}
// Decorative headings take no clicks, even when a long link passes below.
function overUniverseLabel(px,py){
 if(state.mode!=='global'||state.filters.universe!=='all')return false;
 for(const u of Object.keys(U)){
  if(u==='x')continue;
  const b=universeCaptionBox(u,state.transform);
  if(Math.abs(px-b.sx)<=b.width/2+7&&Math.abs(py-b.sy)<=15)return true;
 }
 return false;
}
const globalPos=globalLayout();
// Deliberately distinguish editorial graph size from what we draw by default.
const EDGE_PRIORITY={continuation:100,story:99,crossover:98,postcredit:94,dialogue:92,visual:91,theme:87,cameo:87,easter_egg:84,'easter-egg':84,artifact:79,object:79,music:78,reference:72,identity:73,alternate:70,character:68,appearance:64,family:69,place:62,actor:55,portrayal:52,cast:50,bts:47,production:42,ref:42,same:41,'same-universe':41,catalogue:0};
const rankEdge=e=>{
 const a=nmap.get(e.a),b=nmap.get(e.b);let score=EDGE_PRIORITY[e.type]??45;
 if(a.type==='project'&&b.type==='project')score+=27;
 else if(a.type==='project'||b.type==='project')score+=9;
 if(e.sources?.length||e.source)score+=5;
 if(e.provenance==='confirmed')score+=9;
 if(e.provenance==='disputed')score-=8;
 const da=adj.get(e.a)?.length||0,db=adj.get(e.b)?.length||0;
 score-=Math.log2(1+da)*1.8+Math.log2(1+db)*1.8;
 return score;
};
function selectDiscoveryEdges(pool){
 const v=state.discovery;
 if(v.density>=100)return pool;
 if(!pool.length)return [];
 // Graduated growth: calm reveals ~100 rather than drawing all 3,000 lines.
 const total=Math.min(pool.length,Math.max(14,Math.round(36+Math.pow(v.density/100,1.65)*Math.max(0,pool.length-36))));
 const groups={cross:[],local:[],shared:[]};
 for(const e of pool){if(e.type==='catalogue')continue;const bridge=bridgeType(e);groups[bridge==='continuity'?'cross':bridge==='shared'?'shared':'local'].push(e)}
 const ordering=(a,b)=>rankEdge(b)-rankEdge(a)||a.idx-b.idx;
 Object.values(groups).forEach(arr=>arr.sort(ordering));
 let bridges=Math.min(groups.cross.length,Math.round(total*.63*v.bridges/100));
 // A nonzero bridge setting always shows some distinct continuity crossings.
 if(v.bridges>0&&groups.cross.length&&total>=12)bridges=Math.max(1,bridges);
 const selected=[],seen=new Set,exposure=new Map,universeExposure=new Map;
 function add(e){if(seen.has(e.idx))return;selected.push(e);seen.add(e.idx);for(const id of [e.a,e.b])exposure.set(id,(exposure.get(id)||0)+1);for(const u of new Set([nmap.get(e.a).universe,nmap.get(e.b).universe]))universeExposure.set(u,(universeExposure.get(u)||0)+1)}
 function take(arr,want){
  if(!want||!arr.length)return;
  const remaining=arr.slice();
  for(let j=0;j<want&&remaining.length;j++){
   // Encourage a web spread across films/continuities, not 50 spokes from Endgame.
   let best=0,bestScore=-Infinity;
   for(let i=0;i<remaining.length;i++){
    const e=remaining[i],aa=nmap.get(e.a),bb=nmap.get(e.b);
    const score=rankEdge(e)-5*(exposure.get(e.a)||0)-5*(exposure.get(e.b)||0)
      -1.4*((universeExposure.get(aa.universe)||0)+(aa.universe!==bb.universe?(universeExposure.get(bb.universe)||0):0))
      +(exposure.has(e.a)?0:8)+(exposure.has(e.b)?0:8);
    if(score>bestScore){bestScore=score;best=i}
   }
   add(remaining.splice(best,1)[0]);
  }
 }
 take(groups.cross,bridges);
 // Keep compelling local chains even if distant universes are in the dataset.
 const remaining=groups.local.concat(groups.shared).sort(ordering);
 take(remaining,total-selected.length);
 if(selected.length<total)take(groups.cross,total-selected.length);
 // Optional collection spokes are only present at maximum density.
 return selected;
}
function discoveryLabelIds(){
 const budget=Math.round(state.discovery.labels/100*Math.min(135,DATA.nodes.length));
 if(budget===0)return new Set;
 return new Set(DATA.nodes.filter(n=>n.type==='project'&&state.vset.has(n.id))
   .sort((a,b)=>adj.get(b.id).length-adj.get(a.id).length||a.label.localeCompare(b.label))
   .slice(0,budget).map(n=>n.id));
}

function nodePasses(n){if(isDecorativeHub(n)&&state.mode!=='global')return false;return (state.filters.universe==='all'||n.universe===state.filters.universe||n.universe==='x'&&n.id===state.selected)&&(state.filters.type==='all'||(state.filters.type==='other'?!['project','character','actor','callback','artifact'].includes(n.type):n.type===state.filters.type))&&noSpoilerNode(n)}
function edgePasses(e){return (e.spoiler<=state.spoilers||state.revealed.has('e:'+e.idx))&&relationAllowed(e)&&(state.filters.edge==='all'||groupType(e)===state.filters.edge)&&nodePasses(nmap.get(e.a))&&nodePasses(nmap.get(e.b))}
function focusLayout(){const seed=nmap.get(state.selected);if(!seed)return globalLayout();const sortWeight=e=>{const target=nmap.get(e.a===seed.id?e.b:e.a);const typ=e.type;
 if(typ==='catalogue')return 100;if(target.type==='project'&&['story','continuation','crossover','dialogue','theme','visual'].includes(typ))return 0;
 if(target.id.startsWith('thread-'))return 1;if(target.type==='callback')return 2;
 if(['artifact','music','event','identity'].includes(target.type))return 3;
 if(target.type==='project')return 4;if(target.type==='character')return 5;
 if(target.type==='discovery')return 7;if(target.type==='actor')return 8;return 6};
 const nei=adj.get(seed.id).filter(edgePasses).sort((a,b)=>sortWeight(a)-sortWeight(b)||(b.provenance==='confirmed')-(a.provenance==='confirmed')||a.spoiler-b.spoiler);
 const ids=new Set([seed.id]);const cap=12+Math.round(state.discovery.neighbors/100*(state.filters.edge==='all'?143:170));
 for(const e of nei){if(ids.size>=cap)break;ids.add(e.a===seed.id?e.b:e.a)};
 if(state.secondHop){for(const id of [...ids]){if(id===seed.id)continue;for(const e of adj.get(id).filter(edgePasses).sort((a,b)=>(a.type==='catalogue')-(b.type==='catalogue'))){if(ids.size>=Math.max(30,cap*2))break;ids.add(e.a===id?e.b:e.a)}}}
 const nlist=[...ids].map(id=>nmap.get(id)).filter(nodePasses),direct=nlist.filter(n=>n.id!==seed.id&&nei.some(e=>e.a===n.id||e.b===n.id)),rest=nlist.filter(n=>n.id!==seed.id&&!direct.includes(n));
 const pos=new Map([[seed.id,{x:0,y:0}]]);
 // Separate direct neighbors into sectors: projects on top/right, people left, lore bottom.
 const buckets={projects:direct.filter(n=>n.type==='project'),people:direct.filter(n=>['character','actor','creator'].includes(n.type)),lore:direct.filter(n=>!['project','character','actor','creator'].includes(n.type))};
 function sector(list,start,end,min,max){for(let i=0;i<list.length;i++){const n=list[i],t=(i+.5)/list.length,angle=start+(end-start)*t,ring=Math.floor(i/18),r=Math.min(max*2,2*min+ring*230+(i%3)*63);pos.set(n.id,{x:Math.cos(angle)*r,y:Math.sin(angle)*r})}}
 sector(buckets.projects,-2.65,.35,290,980);sector(buckets.people,.53,3.53,300,1030);sector(buckets.lore,3.7,5.88,260,975);
 for(let i=0;i<rest.length;i++){const n=rest[i],parent=adj.get(n.id).find(e=>ids.has(e.a===n.id?e.b:e.a)&&pos.has(e.a===n.id?e.b:e.a)),p=parent?pos.get(parent.a===n.id?parent.b:parent.a):{x:0,y:0};const a=i*2.39996323,r=350+Math.floor(i/35)*35;pos.set(n.id,{x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r})}
 // Collision settling, only in focus layout (computed once per click)
 const arr=nlist.filter(n=>n.id!==seed.id);for(let iter=0;iter<24;iter++){for(let i=0;i<arr.length;i++){const p=pos.get(arr[i].id);for(let j=i+1;j<arr.length;j++){const q=pos.get(arr[j].id),dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy)||1,min=arr[i].type==='project'||arr[j].type==='project'?130:95;if(d<min){const r=(min-d)/d*.2,xx=dx*r,yy=dy*r;p.x-=xx;p.y-=yy;q.x+=xx;q.y+=yy}}}}
 return pos}
function pathLayout(){
 const result=new Map();const count=state.path.length,space=count>9?380:480;
 state.path.forEach((step,i)=>result.set(step.id,{x:(i-(count-1)/2)*space,y:(i%2?42:-42)}));
 return result;
}
function timelineLayout(){const base=globalLayout(),projects=DATA.nodes.filter(n=>n.type==='project'&&nodePasses(n)).sort((a,b)=>(a.year??9999)-(b.year??9999)||a.label.localeCompare(b.label));let yearPos=new Map(),points=new Map;for(let i=0;i<projects.length;i++){const n=projects[i],yr=n.year??2030,count=yearPos.get(yr)||0;yearPos.set(yr,count+1);points.set(n.id,{x:(yr-2000)*190-2800+((count%2)*25),y:(count-2)*120+130*jitter(n.id,1)})};for(const n of DATA.nodes){if(points.has(n.id))continue;points.set(n.id,base.get(n.id)||{x:0,y:0})}return points}
function rebuild(){let layout=state.mode==='path'&&state.path.length?pathLayout():state.mode==='focus'&&state.selected?focusLayout():state.mode==='timeline'?timelineLayout():globalPos;state.positions=layout;state.visibleNodes=DATA.nodes.filter(n=>layout.has(n.id)&&nodePasses(n));state.vset=new Set(state.visibleNodes.map(n=>n.id));if(state.mode==='focus'&&state.selected){const ids=new Set(layout.keys());state.visibleNodes=state.visibleNodes.filter(n=>ids.has(n.id));state.vset=new Set(state.visibleNodes.map(n=>n.id))}
 const eligible=edges.filter(e=>state.vset.has(e.a)&&state.vset.has(e.b)&&edgePasses(e));
 state.visibleEdges=state.mode==='global'?selectDiscoveryEdges(eligible):eligible;
 if(state.mode==='global'&&state.discovery.density<100){
  const endpoints=new Set(state.visibleEdges.flatMap(e=>[e.a,e.b]));
  state.visibleNodes=state.visibleNodes.filter(n=>n.type==='project'||endpoints.has(n.id));
  state.vset=new Set(state.visibleNodes.map(n=>n.id));
 }
 state.discoveryLabels=discoveryLabelIds();
 updateDiscoveryOutputs();
 // On large dossiers label only the leading project relationships until hover.
 // The other points and their explanations remain selectable and listed in the panel.
 state.focusLabels=new Set;
 if(state.mode==='focus'&&state.selected){for(const e of adj.get(state.selected).filter(edgePasses)){
  const id=e.a===state.selected?e.b:e.a,n=nmap.get(id);
  if(n.type==='project'&&['story','continuation','dialogue','crossover','visual','theme'].includes(e.type)&&!state.focusLabels.has(id))state.focusLabels.add(id);
  if(state.focusLabels.size>=11)break;
 }}
 state.layout=state.mode;updateTitle();requestDraw()}
function fit(instant=false){if(!state.visibleNodes.length)return;const list=state.visibleNodes.map(n=>state.positions.get(n.id));const x1=Math.min(...list.map(p=>p.x)),x2=Math.max(...list.map(p=>p.x)),y1=Math.min(...list.map(p=>p.y)),y2=Math.max(...list.map(p=>p.y));const b=stageBounds();let k=Math.min((b.width-75)/Math.max(140,x2-x1+140),(b.height-110)/Math.max(140,y2-y1+140));k=Math.max(.065,Math.min(k,1.85));moveCamera((x1+x2)/2,(y1+y2)/2,k,instant)}
function stageBounds(){const w=window.innerWidth,h=window.innerHeight,side=w>780?(w>1150?283:238):0,pan=$panel.classList.contains('open');const width=Math.max(180,w-side-(pan&&w>780?(w>1150?410:370):0)),height=Math.max(180,h-(w>780?75:65)-(pan&&w<=780?Math.min(h*.44,440):0));return {x:side,y:w>780?75:65,width,height}}
function moveCamera(cx,cy,k,instant=false){const b=stageBounds(),tx=b.x+b.width/2-cx*k,ty=b.y+b.height/2-cy*k;const from={...state.transform},to={x:tx,y:ty,k};if(state.anim)cancelAnimationFrame(state.anim);if(instant){state.transform=to;requestDraw();return}const t0=performance.now();const run=(now)=>{let t=Math.max(0,Math.min((now-t0)/460,1)),e=1-(1-t)**3;state.transform={x:from.x+(to.x-from.x)*e,y:from.y+(to.y-from.y)*e,k:from.k+(to.k-from.k)*e};requestDraw();if(t<1)state.anim=requestAnimationFrame(run)};state.anim=requestAnimationFrame(run)}
function focusCamera(instant=false){const p=state.positions.get(state.selected);if(!p)return fit(instant);const b=stageBounds(),k=Math.min(1.55,Math.max(.68,Math.min(b.width/860,b.height/750)));const focusSize=state.visibleNodes.length;if(focusSize>24){fit(instant);return}moveCamera(p.x,p.y,k,instant)}
function requestDraw(){if(state.renderPending)return;state.renderPending=true;requestAnimationFrame(()=>{state.renderPending=false;draw()})}
let DPR=1,W=0,HEIGHT=0;
function resize(){W=window.innerWidth;HEIGHT=window.innerHeight;DPR=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(W*DPR);canvas.height=Math.round(HEIGHT*DPR);requestDraw()}
function world(x,y){const t=state.transform;return{x:(x-t.x)/t.k,y:(y-t.y)/t.k}}
function nodeR(n){return n.isHub?15:n.type==='project'?8+Math.min(7,Math.sqrt(adj.get(n.id).length)):(n.type==='character'?7:n.type==='actor'?6:5.3)}
function renderStars(){const {width,height}=canvas,realW=width/DPR,realH=height/DPR;ctx.fillStyle='#080a13';ctx.fillRect(0,0,realW,realH);let grad=ctx.createRadialGradient(realW*.56,realH*.44,30,realW*.56,realH*.44,Math.max(realW,realH)*.7);grad.addColorStop(0,'#191329');grad.addColorStop(.46,'#0b1020');grad.addColorStop(1,'#070911');ctx.fillStyle=grad;ctx.fillRect(0,0,realW,realH);for(const s of state.stars){ctx.globalAlpha=s[2];ctx.fillStyle='#b3bdff';ctx.fillRect(s[0]*realW,s[1]*realH,s[3],s[3])}ctx.globalAlpha=1}
function draw(){const t=state.transform;ctx.setTransform(DPR,0,0,DPR,0,0);renderStars();ctx.save();ctx.translate(t.x,t.y);ctx.scale(t.k,t.k);
 // Universe names are inert cluster headings, not clickable category nodes.
 if(state.mode==='global'&&state.filters.universe==='all'){
  for(const [u,c] of Object.entries(U)){
   if(u==='x')continue;
   const p=universeLabelPosition(u);
   ctx.globalAlpha=.13;ctx.strokeStyle=c.color;ctx.beginPath();
   ctx.ellipse(c.pos[0],c.pos[1],u==='mcu'?740:350,u==='mcu'?645:320,0,0,Math.PI*2);
   ctx.setLineDash([5,15]);ctx.lineWidth=1/t.k;ctx.stroke();ctx.setLineDash([]);
  }
 }
 if(state.mode==='timeline'){ctx.fillStyle='#9ca3c5';ctx.textAlign='center';ctx.font='600 22px system-ui';for(let y=2000;y<=2028;y+=5){const x=(y-2000)*98-1450;ctx.globalAlpha=.4;ctx.fillText(y,x,-370);ctx.strokeStyle='#5c5f80';ctx.lineWidth=1/t.k;ctx.beginPath();ctx.moveTo(x,-345);ctx.lineTo(x,650);ctx.stroke()}}
 const selected=state.selected,hot=state.hover;const neighborhood=new Set(selected?[selected]:[]);if(selected){for(const e of adj.get(selected))if(state.vset.has(e.a)&&state.vset.has(e.b)){neighborhood.add(e.a);neighborhood.add(e.b)}}
 let pathEdges=new Set(state.path.map(x=>x.edge?.idx).filter(x=>x!==undefined));const occupiedLabels=[];
 // Render the curated discovery subset, with all relationships still queryable.
 // Edge picking uses this same set so every visible line remains interactive.
 const displayed=state.visibleEdges;
 const cross=[];const local=[];const catalog=[];
 for(const e of displayed){
  if(e.type==='catalogue')catalog.push(e);
  else if(bridgeType(e)==='continuity')cross.push(e);
  else local.push(e);
 }
 // Paint quiet same-continuity threads first, then visibly bridge clusters.
 for(const e of [...catalog,...local,...cross]){
  const a=state.positions.get(e.a),b=state.positions.get(e.b);
  if(!a||!b)continue;
  const direct=selected&&(e.a===selected||e.b===selected);
  const picked=state.edge?.idx===e.idx,hover=hot?.type==='edge'&&hot.id===e.idx,onPath=pathEdges.has(e.idx);
  const dominant=picked||hover||onPath||direct,fade=selected&&!direct&&!onPath;
  const bridge=bridgeType(e),global=state.mode==='global';
  let alpha=dominant?.92:fade?.07:global?(e.type==='catalogue'?.085:bridge==='continuity'?.39:bridge==='shared'?.15:.17):.20;
  if(e.type==='catalogue'&&!global)alpha*=.4;
  ctx.globalAlpha=alpha;
  ctx.strokeStyle=onPath?'#ffd88b':edgeCfg(e)[2];
  ctx.lineWidth=(global?(e.type==='catalogue'?.55:bridge==='continuity'?1.45:1.0):(onPath?3.1:picked||hover?2.9:direct?1.65:.87))/Math.max(.12,t.k);
  ctx.setLineDash(e.provenance==='disputed'?[4/t.k,5/t.k]:['theme','visual'].includes(e.type)?[3/t.k,4/t.k]:e.type==='catalogue'?[2/t.k,5/t.k]:[]);
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);
  if((hover||picked)&&t.k>.6){
   ctx.fillStyle='#f9f4ff';ctx.font=`${11/t.k}px system-ui`;ctx.textAlign='center';ctx.globalAlpha=1;
   ctx.fillText(edgeCfg(e)[1]+' '+(e.spoiler>state.spoilers?'Hidden connection':e.title).slice(0,35),(a.x+b.x)/2,(a.y+b.y)/2-10/t.k);
  }
 }
 state.renderedEdgeCount=displayed.length;
 state.renderedCrossContinuityCount=cross.length;
 const nodeCount=state.visibleNodes.length;
 for(const n of state.visibleNodes){if(isDecorativeHub(n))continue;const p=state.positions.get(n.id);if(!p)continue;const isSelected=selected===n.id,isHover=hot?.type==='node'&&hot.id===n.id,connected=selected?neighborhood.has(n.id):true;
 ctx.globalAlpha=connected?1:(state.mode==='focus'?.22:.29);if(!selected)ctx.globalAlpha=1;
 const r=state.mode==='global'?Math.max(nodeR(n),(state.discoveryLabels.has(n.id)?4.4:2.45)/t.k):nodeR(n);ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fillStyle=color(n);ctx.shadowColor=color(n);ctx.shadowBlur=isSelected?32:isHover?20:n.type==='project'?6:2;ctx.fill();ctx.shadowBlur=0;
 if(isSelected||isHover){ctx.strokeStyle='#f7f1ff';ctx.lineWidth=1.3/t.k;ctx.beginPath();ctx.arc(p.x,p.y,r+5/t.k,0,Math.PI*2);ctx.stroke()}
 if(n.status==='upcoming'){ctx.strokeStyle='#e5d7a1';ctx.lineWidth=1/t.k;ctx.setLineDash([3/t.k,4/t.k]);ctx.beginPath();ctx.arc(p.x,p.y,r+4/t.k,0,Math.PI*2);ctx.stroke();ctx.setLineDash([])}
 const label=state.mode==='global'?(isSelected||isHover||state.discoveryLabels.has(n.id)):state.mode==='path'?true:state.mode==='focus'&&nodeCount>34?(isSelected||isHover||(n.type==='project'&&state.focusLabels.has(n.id)&&t.k>.4)):(state.mode==='focus'&&(nodeCount<=45||n.type==='project'||isSelected||isHover||t.k>1.15))||isSelected||isHover||(state.mode==='timeline'&&n.type==='project')||(nodeCount<90&&n.type==='project')||(n.type==='project'&&(t.k>.65||adj.get(n.id).length>=11))||(t.k>1.05&&n.type!=='collection');
 if(label){const fs=(state.mode==='global'?11/Math.max(.01,t.k):state.mode==='focus'&&t.k<.45&&((isSelected||isHover)||state.focusLabels.has(n.id))?11/Math.max(.01,t.k):(n.type==='project'||isSelected||isHover?12:10)/Math.max(.65,Math.min(t.k,1.4)));ctx.font=(isSelected||n.isHub?'700 ':'500 ')+fs+'px system-ui';const copy=n.label.length>32&&state.mode==='global'&&!isHover?n.label.slice(0,29)+'…':n.label;const sx=t.x+p.x*t.k,sy=t.y+(p.y+r+14/t.k)*t.k,sw=ctx.measureText(copy).width*t.k,sh=fs*t.k;const box=[sx-sw/2-5,sy-sh-3,sx+sw/2+5,sy+3];const priority=isSelected||isHover||state.mode==='path';const collision=occupiedLabels.some(q=>!(box[2]<q[0]||box[0]>q[2]||box[3]<q[1]||box[1]>q[3]));if(priority||!collision){occupiedLabels.push(box);ctx.textAlign='center';ctx.fillStyle=isSelected?'#ffffff':connected?'#cdd0e2':'#9a9ab1';ctx.globalAlpha=connected?1:.26;ctx.fillText(copy,p.x,p.y+r+14/t.k)}}}
 // Draw passive continuity headings last so crossings cannot obscure them.
 if(state.mode==='global'&&state.filters.universe==='all'){
  ctx.textAlign='center';ctx.lineJoin='round';
  for(const [u,c] of Object.entries(U)){
   if(u==='x')continue;
   const title=universeCaptionBox(u,t);
   const x=(title.sx-t.x)/t.k,y=(title.sy-t.y)/t.k;
   ctx.globalAlpha=.98;ctx.font=`750 ${11.5/t.k}px system-ui`;
   ctx.strokeStyle='#080a13';ctx.lineWidth=3.2/t.k;
   ctx.strokeText(c.name.toUpperCase(),x,y);
   ctx.fillStyle=c.color;ctx.fillText(c.name.toUpperCase(),x,y);
  }
 }
 ctx.restore();ctx.globalAlpha=1;}
function pick(x,y){
 if(overUniverseLabel(x,y))return null;
 const p=world(x,y),t=state.transform;let best=null,dist=18/t.k;
 for(const n of state.visibleNodes){
  if(isDecorativeHub(n))continue;
  const a=state.positions.get(n.id);if(!a)continue;
  const d=Math.hypot(p.x-a.x,p.y-a.y);
  if(d<nodeR(n)+9/t.k&&d<dist+nodeR(n)){best={type:'node',id:n.id};dist=d}
 }
 if(best)return best;
 let chosen=null,min=10/t.k;
 // Match the lines on screen: NO special 'project only' or distance filter.
 // Catalogue spokes cannot select a decorative collection hub.
 for(const e of state.visibleEdges){
  if(e.type==='catalogue')continue;
  const a=state.positions.get(e.a),b=state.positions.get(e.b);if(!a||!b)continue;
  const dx=b.x-a.x,dy=b.y-a.y,mag=dx*dx+dy*dy||1;
  const lam=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/mag));
  const d=Math.hypot(a.x+lam*dx-p.x,a.y+lam*dy-p.y);
  if(d<min){min=d;chosen={type:'edge',id:e.idx}}
 }
 return chosen;
}
function tooltip(point){if(!point){$tip.classList.add('hidden');canvas.style.cursor=state.drag?'grabbing':'grab';return}canvas.style.cursor='pointer';$tip.classList.remove('hidden');$tip.style.left=Math.max(10,Math.min(W-270,state.mouse.x+15))+'px';$tip.style.top=Math.max(10,Math.min(HEIGHT-95,state.mouse.y+16))+'px';if(point.type==='node'){const n=nmap.get(point.id);$tip.innerHTML='<b>'+H(n.label)+'</b><br><small>'+H(typeLabel(n))+' · '+H(U[n.universe]?.name||'Related')+'</small><br><small>'+adj.get(n.id).filter(e=>e.type!=='catalogue').length+' explicit relationships</small>'}else{const e=edges[point.id];$tip.innerHTML='<b>'+H(edgeCfg(e)[0])+'</b><br><small>'+H(nmap.get(e.a).label)+' → '+H(nmap.get(e.b).label)+'</small><br><small>'+H(e.spoiler>state.spoilers?'Spoiler-protected explanation':'Click for the relationship dossier')+'</small>'}}
function updateTitle(){const n=nmap.get(state.selected);$('viewTitle').textContent=state.mode==='path'?'CONNECTION PATH':state.mode==='timeline'?'RELEASE TIMELINE':state.mode==='focus'&&n?'FOCUS • '+n.label.toUpperCase():'UNIVERSE MAP';$('viewSubtitle').textContent=state.mode==='path'?'Click a path node or connecting line for details':state.mode==='focus'?'Only explicit graph relationships are shown':state.mode==='timeline'?'Placement uses known release years':'Showing '+state.visibleEdges.length+' of '+edges.length+' relationships · '+state.visibleEdges.filter(e=>bridgeType(e)==='continuity').length+' cross-continuity bridges';$('globalMode').classList.toggle('active',state.mode==='global');$('focusMode').classList.toggle('active',state.mode==='focus');$('timelineMode').classList.toggle('active',state.mode==='timeline')}
function setMode(mode,fitView=true){if(window.MARVEL_RACER?.active){toast('Finish or exit WikiRacer before switching modes.');return;}if(mode==='focus'&&!state.selected){toast('Select an entity or search before entering focus mode.');return}state.mode=mode;rebuild();if(fitView){if(mode==='focus')focusCamera();else fit()}renderBreadcrumb()}
function selectNode(id,opts={}){
 const n=nmap.get(id);if(!n||isDecorativeHub(n))return;
 if(window.MARVEL_RACER?.blockVisit?.(id,opts))return;
 if(state.selected&&state.selected!==id&&!opts.back)state.history.push(state.selected);
 if(state.pathFrom&&state.pathFrom!==id&&!opts.pathStep){state.pathTo=id;solvePath(state.pathFrom,id)}
 state.selected=id;state.edge=null;state.edgeFrom=null;state.tab='overview';state.shownFacts=12;
 state.mode=state.pathFrom&&state.path.length?'path':'focus';
 rebuild();renderNode();renderBreadcrumb();
 if(state.mode==='path')fit();else{const b=stageBounds();const k=Math.max(.67,Math.min(1.2,Math.min(b.width/830,b.height/710)));moveCamera(0,0,k)}
 $sidebar.classList.remove('mobile-open');
 window.MARVEL_RACER?.afterVisit?.(id,opts);
}
function selectEdge(idx){const e=edges[idx];if(!e||e.type==='catalogue')return;state.edgeFrom=state.selected;state.edge=e;state.selected=null;state.tab='overview';renderEdge();renderBreadcrumb();requestDraw()}
function closePanel(){state.edge=null;state.edgeFrom=null;$panel.classList.remove('open');$panel.setAttribute('aria-hidden','true');requestDraw()}
function resetMap(){window.MARVEL_RACER?.exitIfActive?.();state.selected=null;state.edge=null;state.edgeFrom=null;state.path=[];state.pathFrom=null;state.pathTo=null;state.history=[];state.mode='global';state.filters={universe:'all',type:'all',edge:'all'};syncFilters();closePanel();renderBreadcrumb();rebuild();fit();$('pathResult').innerHTML='';$('pathDock').classList.add('hidden');$('pathDock').innerHTML='';$q.value='';$results.classList.add('hidden')}
function openPanel(){ $panel.classList.add('open');$panel.setAttribute('aria-hidden','false')}
function renderBreadcrumb(){let crumbs=state.history.slice(-4);let s=crumbs.map(id=>'<button data-open="'+H(id)+'">'+H(nmap.get(id)?.label||id)+'</button><span style="color:#6f7692">/</span>').join('');if(state.selected)s+='<button>'+H(nmap.get(state.selected).label)+'</button>'; $('breadcrumb').innerHTML=s}
function providerLabel(e){if(e.source==='Associated Press reporting')return'<span class="pill green">AP REPORTING</span>';if(e.source==='Reuters reporting')return'<span class="pill green">REUTERS REPORTING</span>';if(e.source==='Marvel official')return'<span class="pill green">'+(e.sourceUrl?.includes('marvel.com')?'MARVEL OFFICIAL':'CONFIRMED ANNOUNCEMENT')+'</span>';if(e.source==='MCU Wiki · community compiled')return'<span class="pill muted">FAN WIKI REFERENCE</span>';if(e.source==='Reported / not officially announced')return'<span class="pill gold">REPORTED / NOT VERIFIED</span>';if(e.provenance==='disputed')return'<span class="pill gold">DISPUTED</span>';if(e.provenance==='reported')return'<span class="pill gold">REPORTED</span>';if(e.provenance==='theory')return'<span class="pill gold">FAN THEORY</span>';if(e.provenance==='production')return'<span class="pill">PRODUCTION INFO</span>';return'<span class="pill muted">EDITORIAL / SUPPLIED</span>'}
function spoilerGate(key,level){return'<button class="spoiler-gate" data-reveal="'+H(key)+'">⚠ This contains level '+level+' spoilers. Click to reveal this particular item.</button>'}
function displayEdgeList(e,from){const target=e.a===from?e.b:e.a,n=nmap.get(target),locked=e.spoiler>state.spoilers&&!state.revealed.has('e:'+e.idx);return'<button class="link-row" data-edge="'+e.idx+'"><span class="mini-icon" style="color:'+edgeCfg(e)[2]+'">'+edgeCfg(e)[1]+'</span><span style="min-width:0"><span class="lead">'+H(locked?'Spoiler-protected connection':n.label)+'</span><span class="sub">'+H(edgeCfg(e)[0])+' · '+H(locked?'Reveal to read':e.title)+'</span></span><span class="end">↗</span></button>'}
function renderNode(){const n=nmap.get(state.selected);if(!n)return;openPanel();const facts=factsBy.get(n.id)||[],relevant=adj.get(n.id).filter(e=>relationAllowed(e));const explicit=relevant.filter(e=>e.type!=='catalogue'),collections=relevant.filter(e=>e.type==='catalogue');const status=n.status==='upcoming'?'<span class="pill gold">UPCOMING</span>':n.status==='released'?'<span class="pill green">RELEASED</span>':'';let head='<div class="node-kicker"><span class="pill red">'+H(typeLabel(n)).toUpperCase()+'</span><span class="pill">'+H(U[n.universe]?.name||'Cross-continuity')+'</span>'+status+'</div><h2 class="node-heading">'+H(n.label)+'</h2><div class="meta-line">'+(n.year?'<span>'+n.year+'</span>':'')+(n.media?'<span>'+H(n.media)+'</span>':'')+'<span>'+explicit.length+' explicit connections</span>'+(facts.length?'<span>'+facts.length+' observations</span>':'')+'</div><p class="node-description">'+H(n.short||n.description||(facts.find(f=>f.spoiler<=state.spoilers)?.text)||'Explore this entity through its documented and editorial links. Select a relationship to find out exactly how the two entities connect.')+'</p>';
 head+='<div class="panel-buttons"><button class="button primary" data-action="path">'+(state.pathFrom===n.id?'● Path start chosen':'◎ Find path from here')+'</button><button class="button" data-action="share">↗ Copy link</button><button class="button" data-action="global">⤢ All Marvel</button></div>';
 const tab=state.tab;let tabs='<div class="tabs"><button data-tab="overview" class="'+(tab==='overview'?'active':'')+'">Overview</button><button data-tab="threads" class="'+(tab==='threads'?'active':'')+'">Story threads</button><button data-tab="connections" class="'+(tab==='connections'?'active':'')+'">All links <span class="count-tag">'+explicit.length+'</span></button><button data-tab="discoveries" class="'+(tab==='discoveries'?'active':'')+'">Discoveries <span class="count-tag">'+(facts.length+(cbBy.has(n.id)?1:0))+'</span></button></div>';
 let html='';
 if(tab==='overview'){
  const projectConnections=explicit.filter(e=>nmap.get(e.a===n.id?e.b:e.a).type==='project').sort((a,b)=>
 {const score=e=>['story','continuation','dialogue','visual','theme','crossover','cameo','artifact','reference','appearance','cast','production','catalogue'].indexOf(e.type);
 return score(a)-score(b)||(b.provenance==='confirmed')-(a.provenance==='confirmed')||a.spoiler-b.spoiler});
  const seenProjects=new Set;const trusted=projectConnections.filter(e=>{const target=e.a===n.id?e.b:e.a;if(seenProjects.has(target))return false;seenProjects.add(target);return true}).slice(0,9);
  if(n.id==='doomsday'){
   const roles=adj.get('doomsday').filter(e=>e.type==='appearance'&&e.title==='Officially announced Doomsday role').map(e=>e.a==='doomsday'?e.b:e.a);
   // Chris Evans as Steve Rogers was a later independently confirmed addition.
   roles.push('steve');
   const unique=[...new Set(roles)];
   const table=unique.map(id=>{const c=nmap.get(id),roleEdges=adj.get(id).filter(e=>e.type==='portrayal'),castEdge=roleEdges.find(e=>nmap.get(e.a===id?e.b:e.a)?.type==='actor');const actor=castEdge&&nmap.get(castEdge.a===id?castEdge.b:castEdge.a);return'<div class="ensemble-row"><button data-open="'+H(id)+'" title="Open character">'+H(c?.label||id)+'</button><span class="end">↔</span>'+(actor?'<button data-open="'+H(actor.id)+'" title="Open performer">'+H(actor.label)+'</button>':'<span class="muted">Performer not indexed</span>')+'</div>'}).join('');
   html+='<details class="ensemble" open><summary>★ ANNOUNCED CAST & CHARACTER CONNECTIONS <span class="count-tag">'+unique.length+'</span></summary><p class="empty-note">The public casting announcements confirm these performers and roles. They do not establish who shares a scene, who dies, or whether characters from different timelines are one person.</p><div class="ensemble-rows">'+table+'</div><p class="data-note">Sources: Marvel Studios / AP (2025) and Reuters (Chris Evans, 2026). Fan-wiki-only entries are not automatically promoted to the confirmed roster.</p></details>';
   const unverified=adj.get('doomsday').filter(e=>e.title==='Wiki-listed Doomsday character · unverified').map(e=>e.a==='doomsday'?e.b:e.a);
   if(unverified.length){html+='<details class="ensemble wiki-ensemble"><summary>◇ MCU WIKI ROSTER — NOT STUDIO-CONFIRMED <span class="count-tag">'+unverified.length+'</span></summary><p class="empty-note">These names appear in a fan-maintained credits list, not the studio-announced roster cited above. They may change; do not treat them as confirmed appearances.</p><div class="ensemble-rows">'+unverified.map(id=>'<div class="ensemble-row"><button data-open="'+H(id)+'">'+H(nmap.get(id).label)+'</button><span class="end">↗</span><span class="muted">Community wiki listing</span></div>').join('')+'</div></details>';}

  }
  if(n.watch?.length){html+='<div class="panel-h3">ESSENTIAL CONTEXT</div>'+n.watch.map(id=>'<button class="link-row" data-open="'+H(id)+'"><span class="mini-icon">◀</span><span><span class="lead">'+H(nmap.get(id)?.label||id)+'</span><span class="sub">Useful before exploring this story</span></span><span class="end">↗</span></button>').join('')}
  html+='<div class="panel-h3">EXPLORE THE BIG CONNECTIONS <button class="inline-action" data-tab="threads">ALL STORY THREADS ↗</button></div>'+(trusted.length?'<div class="cards-list">'+trusted.map(e=>displayEdgeList(e,n.id)).join('')+'</div>':'<p class="empty-note">No direct project-to-project links recorded. Explore the character, actor and lore connections below.</p>');
  const others=explicit.filter(e=>nmap.get(e.a===n.id?e.b:e.a).type!=='project');if(others.length)html+='<div class="panel-h3">CHARACTERS · CAST · LORE</div><div class="cards-list">'+others.slice(0,9).map(e=>displayEdgeList(e,n.id)).join('')+'</div>';
  if(facts.length)html+='<div class="panel-h3">THINGS YOU MIGHT HAVE MISSED</div><p class="empty-note">'+facts.length+' imported notes. They are user-supplied research notes, not automatically fact-checked.</p>'+facts.slice(0,3).map((f,i)=>factRow(f,i)).join('')+'<div class="panel-buttons"><button class="button" data-tab="discoveries">Explore all '+facts.length+' discoveries →</button></div>';
  if(n.callbackId){const cb=cbBy.get(n.callbackId),locked=state.spoilers<2&&!state.revealed.has('callback:'+n.id);html+='<div class="panel-h3">ORIGINAL EDITORIAL COMPARISON</div>'+(locked?spoilerGate('callback:'+n.id,2):'<div class="panel-card" style="white-space:pre-wrap;line-height:1.7">'+H(cb?.description||'')+(cb?.originalDescription?'<details class="fact-row"><summary>Read supplied original note (unverified text)</summary><p>'+H(cb.originalDescription)+'</p></details>':'')+'</div>')+'<p class="data-note">User-supplied comparison, not independently confirmed word for word.</p>'}
  html+=sourceBlock(n,relevant);
 }else if(tab==='threads'){
  // Named narrative edges are distinct from generic character appearances.  Every
  // row opens the actual explanation; the complete inventory remains in All links.
  const sections=[
   ['STORY CONTINUATIONS',e=>['story','continuation'].includes(e.type) || nmap.get(e.a===n.id?e.b:e.a).id.startsWith('thread-')],
   ['CALLBACKS · DIALOGUE · VISUAL PARALLELS',e=>['dialogue','visual','theme'].includes(e.type)||nmap.get(e.a===n.id?e.b:e.a).type==='callback'],
   ['CROSSOVERS & CAMEOS',e=>['crossover','cameo'].includes(e.type)],
   ['POST-CREDIT SCENES & EASTER EGGS',e=>['postcredit','easter-egg','easter_egg'].includes(e.type)],
   ['ARTIFACTS & SOUNDTRACKS',e=>['artifact','object','music'].includes(e.type)],
   ['PRODUCTION & CONTINUITY CONTEXT',e=>['production','bts','reference','alternate','same','same-universe'].includes(e.type)]
  ];
  const used=new Set;const totalNarrative=explicit.filter(e=>sections.some(([_,fn])=>fn(e))).length;
  html+='<p class="data-note">'+totalNarrative+' named connections are indexed for this entity. Story threads, dialogue callbacks and visual or thematic parallels are separately identified. Click a relationship for its full explanation and evidence label. This is a curated index, not a guarantee of official confirmation.</p>';
  for(const [heading,test] of sections){const items=explicit.filter(e=>test(e)&&!used.has(e.idx));for(const e of items)used.add(e.idx);if(!items.length)continue;
   // This tab intentionally shows the strongest 36 within each group rather than
   // freezing the panel with hundreds of cards. All links contains the full set.
   const visible=items.slice(0,36);
   html+='<div class="panel-h3">'+H(heading)+' <span class="count-tag">'+items.length+'</span></div><div class="cards-list">'+visible.map(e=>displayEdgeList(e,n.id)).join('')+'</div>';
   if(items.length>visible.length)html+='<p class="data-note">Showing '+visible.length+' of '+items.length+' in this group. Open <b>All links</b> to browse every relationship.</p>';
  }
  if(!totalNarrative)html+='<p class="empty-note">No dedicated story thread has been recorded for this particular entity yet. Its character, actor and catalogue associations remain available in All links.</p>';
  html+='<div class="panel-buttons"><button class="button" data-tab="connections">VIEW ALL '+explicit.length+' RELATIONSHIPS →</button></div>';
  html+=sourceBlock(n,relevant);
 }else if(tab==='connections'){
  html+='<p class="data-note">Each row is a distinct, typed connection. Click a row to read <b>why</b> the entities connect. Catalogue membership is separated from story links.</p>';
  const groups=new Map;for(const e of explicit){let type=edgeCfg(e)[0];if(!groups.has(type))groups.set(type,[]);groups.get(type).push(e)}
  for(const [name,list]of groups)html+='<div class="panel-h3">'+H(name.toUpperCase())+' <span class="count-tag">'+list.length+'</span></div><div class="cards-list">'+list.map(e=>displayEdgeList(e,n.id)).join('')+'</div>';
  if(collections.length)html+='<div class="panel-h3">CATALOGUE / BROWSING ONLY</div><div class="cards-list">'+collections.map(e=>displayEdgeList(e,n.id)).join('')+'</div>';
 }else if(tab==='discoveries'){
  if(n.callbackId){const cb=cbBy.get(n.callbackId);html+='<div class="panel-h3">THE COMPARISON</div>'+(!state.revealed.has('callback:'+n.id)&&state.spoilers<2?spoilerGate('callback:'+n.id,2):'<div class="panel-card" style="white-space:pre-wrap;line-height:1.7">'+H(cb?.description||'')+(cb?.originalDescription?'<details class="fact-row"><summary>Read supplied original note (unverified text)</summary><p>'+H(cb.originalDescription)+'</p></details>':'')+'</div>')}
  if(!facts.length&&!n.callbackId)html+='<p class="empty-note">No separate editorial observations for this entity yet. Its confirmed or curated links are in Connections.</p>';
  if(facts.length){html+='<p class="data-note">'+facts.length+' imported observations. Their evidence fields preserve the limitations in the supplied CSV. Expand an entry for details.</p>';for(const f of facts.slice(0,state.shownFacts))html+=factRow(f);if(facts.length>state.shownFacts)html+='<button class="button" style="width:100%;margin-top:15px" data-action="more-facts">Load more observations ('+(facts.length-state.shownFacts)+' remaining)</button>'}
  html+=sourceBlock(n,relevant);
 }
 $body.innerHTML=head+tabs+html+'<div class="dossier-footer">Marvel Atlas · Treat official, editorial, and community connections as different kinds of evidence.</div>';$body.scrollTop=0;
}
function factRow(f){const locked=state.spoilers<f.spoiler&&!state.revealed.has('f:'+f.id);return'<details class="fact-row" data-fact="'+H(f.id)+'"><summary>'+H(f.kind)+' <span style="color:#747894;margin-left:auto;font-size:10px">'+H(locked?'⚠ possible spoilers':'EXPAND')+'</span></summary>'+(locked?spoilerGate('f:'+f.id,f.spoiler):'<p>'+H(f.text)+'</p>')+'<p class="fact-evidence">'+H(f.evidence||'Evidence not provided')+' · '+H(f.origin)+(f.sourceUrl?'<br><a target="_blank" rel="noopener noreferrer" href="'+H(f.sourceUrl)+'">Open supplied source ↗</a>':'')+'</p></details>'}
function sourceBlock(n,rel){let urls=new Set(n.sources||[]);if(n.sourceUrl)urls.add(n.sourceUrl);for(const e of rel)if(e.sourceUrl)urls.add(e.sourceUrl);let html='<div class="panel-h3">SOURCES & DATA STATUS</div><p class="data-note">'+(n.source==='csv'?'This production was imported from the user-supplied CSV. ':n.source==='seed'?'This entity originates in the prototype seed graph. ':'')+'Only entries that explicitly link to an official source are marked as such. No automated scraping occurs in your browser.</p>';for(const u of [...urls].slice(0,11))html+='<a class="source-link" href="'+H(u)+'" target="_blank" rel="noopener noreferrer">'+H(u)+'</a>';return html}
function renderEdge(){const e=state.edge;if(!e)return;openPanel();let a=nmap.get(e.a),b=nmap.get(e.b),reveal=e.spoiler<=state.spoilers||state.revealed.has('e:'+e.idx);let html='<div class="node-kicker"><span class="pill red">'+H(edgeCfg(e)[0]).toUpperCase()+'</span>'+providerLabel(e)+'</div><h2 class="node-heading">'+H(reveal?e.title:'Hidden relationship')+'</h2><p class="node-description">'+(reveal?H(e.detail||'An editorial link between these entities.'): 'The explanation and potentially surprising relationship are behind your spoiler setting.')+'</p>'+(reveal?'':spoilerGate('e:'+e.idx,e.spoiler))+(reveal?'<div class="panel-h3">CONNECTED ENTITIES</div><button data-open="'+H(a.id)+'" class="link-row"><span class="mini-icon">◉</span><span><span class="lead">'+H(a.label)+'</span><span class="sub">'+H(typeLabel(a))+'</span></span><span class="end">↗</span></button><div style="height:8px"></div><button data-open="'+H(b.id)+'" class="link-row"><span class="mini-icon">◉</span><span><span class="lead">'+H(b.label)+'</span><span class="sub">'+H(typeLabel(b))+'</span></span><span class="end">↗</span></button>':'<p class="empty-note">Reveal this spoiler-protected relationship to see both endpoints and navigate through it.</p>')+'<div class="panel-h3">WHAT KIND OF CONNECTION?</div><p class="node-description">'+H(edgeCfg(e)[0])+'. '+(e.type==='catalogue'?'This is collection membership for browsing, NOT a story crossover or guarantee of shared continuity.':e.provenance==='confirmed'?'A supporting source is linked for this particular claim; a third-party or fan-wiki article is not a Marvel Studios announcement.':e.provenance==='disputed'?'Continuity or interpretation is not settled.':'A curator or supplied dataset describes this relationship; the site does not present it as independently verified canon.')+'</p>';
 if(e.sourceUrl)html+='<a class="source-link" href="'+H(e.sourceUrl)+'" target="_blank" rel="noopener noreferrer">'+H(e.sourceLabel||'Linked research source')+' ↗ '+H(e.sourceUrl)+'</a>'+(e.sourceNote?'<p class="data-note"><b>Source scope:</b> '+H(e.sourceNote)+'</p>':'');else html+='<div class="data-note">Original source: '+H(e.source||'Editorial seed')+'. No independently verified reference URL is attached to this edge.</div>';
 html+='<div class="panel-buttons"><button class="button primary" data-open="'+H(a.id)+'">Explore '+H(a.label.slice(0,16))+' →</button><button class="button" data-open="'+H(b.id)+'">Explore '+H(b.label.slice(0,16))+' →</button></div>';$body.innerHTML=html;$body.scrollTop=0}
function handleReveal(key){state.revealed.add(key);if(key.startsWith('n:')){rebuild();renderNode()}else if(state.edge)renderEdge();else if(key.startsWith('callback:')&&state.selected)renderNode();else if(state.selected){renderNode();if(key.startsWith('f:')){const detail=$body.querySelector('[data-fact="'+key.slice(2)+'"]');if(detail){detail.open=true;detail.scrollIntoView({block:'nearest'})}}}}
function syncFilters(){$('universeFilter').value=state.filters.universe;$('typeFilter').value=state.filters.type;$('edgeFilter').value=state.filters.edge;$('spoilerLevel').value=String(state.spoilers);$('secondHop').checked=state.secondHop;$('showCatalogue').checked=state.showCatalogue;$('revealEverything').innerHTML=state.spoilers===3?'✦ Spoilers enabled <span>Change below anytime</span>':'✦ Reveal the complete graph <span>⚠ Full spoilers</span>'}
function toast(msg){const wrap=$('toasts'),d=document.createElement('div');d.className='toast';d.textContent=msg;wrap.append(d);setTimeout(()=>d.remove(),3200)}
function searchScore(n,q){const evidenceHit=(n.type==='project'&&(factSearchIndex.get(n.id)||[]).some(f=>f.spoiler<=state.spoilers&&f.text.includes(q)));const text=[n.label,n.id,n.description||'',...(n.keywords||[])].join(' ').toLowerCase(),title=n.label.toLowerCase();if(title===q)return-100;if(title.startsWith(q))return-50;if(title.split(/[\s:\-]+/).some(w=>w.startsWith(q)))return-35;if(title.includes(q))return-20;if(text.includes(q))return 0;if(evidenceHit)return 5;let p=0;for(const c of text)if(c===q[p])p++;return p===q.length?20:1000}
function search(q){const v=q.trim().toLowerCase();state.query=v;if(!v){$results.classList.add('hidden');return}const matched=DATA.nodes.filter(n=>!isDecorativeHub(n)).map(n=>({n,score:searchScore(n,v)+(n.type==='project'?-4:0)})).filter(x=>x.score<1000&&(noSpoilerNode(x.n)||x.n.label.toLowerCase().includes(v))).sort((a,b)=>a.score-b.score||b.n.year-a.n.year).slice(0,12);state.searchResults=matched.map(x=>x.n);state.activeResult=0;$results.innerHTML=matched.length?matched.map((x,i)=>'<button class="result '+(i===0?'active':'')+'" data-result="'+H(x.n.id)+'"><span class="emblem" style="background:'+color(x.n)+'"></span><span class="result-text"><strong>'+H(x.n.label)+'</strong><small>'+H(U[x.n.universe]?.name||'Cross-continuity')+(x.n.year?' · '+x.n.year:'')+'</small></span><span class="result-type">'+H(typeLabel(x.n))+'</span></button>').join(''):'<div class="result-empty">No matches. Try a shorter title or a character name.</div>';$results.classList.remove('hidden')}
function pickSearch(id){if(window.MARVEL_RACER?.active){toast('WikiRacer: navigate through the connected graph, not search.');return;}if(!nmap.has(id)||isDecorativeHub(nmap.get(id)))return;if(!noSpoilerNode(nmap.get(id)))state.revealed.add('n:'+id);$results.classList.add('hidden');$q.value=nmap.get(id).label;state.filters={universe:'all',type:'all',edge:'all'};syncFilters();selectNode(id);$q.blur()}
function renderPathDock(){
 const dock=$('pathDock');
 if(!state.pathFrom){dock.classList.add('hidden');dock.innerHTML='';return}
 const origin=nmap.get(state.pathFrom),target=nmap.get(state.pathTo);
 let header='<div class="path-dock-header"><div class="path-dock-title">◎ CONNECTION FINDER</div><button class="path-close" data-action="clear-path" title="Exit path finder" aria-label="Exit path finder">×</button></div>';
 if(!target){dock.innerHTML=header+'<div class="path-dock-summary"><b>'+H(origin.label)+'</b> → Choose a destination</div><p class="path-dock-hint">Search above or click a graph node. Select an entity to calculate its connections.</p><button class="button path-dock-search" data-action="path-search">⌕ Search destination</button>';dock.classList.remove('hidden');return}
 let middle='';if(state.path.length){
  middle='<div class="path-dock-summary"><b>'+H(origin.label)+'</b> → <b>'+H(target.label)+'</b> · '+(state.path.length-1)+' connection'+(state.path.length===2?'':'s')+'</div><div class="path-dock-steps">'+state.path.map((entry,i)=>'<button class="path-dock-step" data-path-step="'+H(entry.id)+'" title="Explore '+H(nmap.get(entry.id).label)+'"><span class="path-dock-order">'+(i+1)+'</span>'+H(nmap.get(entry.id).label)+'</button>'+(i<state.path.length-1?'<button class="path-dock-link" data-path-edge="'+state.path[i+1].edge.idx+'" aria-label="Connection details">→</button>':'')).join('')+'</div>';
 }else{
  middle='<div class="path-dock-summary"><b>'+H(origin.label)+'</b> → <b>'+H(target.label)+'</b></div><p class="path-dock-hint">No spoiler-safe non-catalogue path was found. Check the spoiler setting or try a different destination.</p>'+(state.spoilers<3?'<button class="button" data-action="path-reveal">⚠ Reveal spoilers and retry</button>':'');
 }
 dock.innerHTML=header+middle+'<div class="path-dock-actions"><button class="button" data-action="path-map">◎ Show graph</button><button class="button" data-action="path-search">⌕ New destination</button><button class="button" data-action="path-restart">⇄ Swap endpoints</button><button class="button" data-action="clear-path">Close route</button></div>';
 dock.classList.remove('hidden');
}
function clearPath(){state.pathFrom=null;state.pathTo=null;state.path=[];$('pathResult').innerHTML='';renderPathDock();if(state.mode==='path'){state.mode=state.selected?'focus':'global';rebuild();if(state.selected)focusCamera();else fit()}requestDraw()}
function solvePath(from,to){
 if(!nmap.has(from)||!nmap.has(to))return;
 const dist=new Map([[from,0]]),prev=new Map,used=new Set,queue=[[from,0]];
 while(queue.length){queue.sort((a,b)=>a[1]-b[1]);const [id,d]=queue.shift();if(used.has(id))continue;used.add(id);if(id===to)break;
 for(const e of adj.get(id)){
  if(e.type==='catalogue'||(e.spoiler>state.spoilers&&!state.revealed.has('e:'+e.idx)))continue;
  const other=e.a===id?e.b:e.a;if(!noSpoilerNode(nmap.get(other)))continue;
  const weight=['continuation','crossover','story','dialogue'].includes(e.type)?.9:['appearance','character'].includes(e.type)?2.2:['theme','production'].includes(e.type)?3:1.5;
  if(d+weight<(dist.get(other)??Infinity)){dist.set(other,d+weight);prev.set(other,{id,edge:e});queue.push([other,d+weight])}
 }}
 let path=[];
 if(dist.has(to)){let current=to;while(current!==from){const prior=prev.get(current);if(!prior){path=[];break}path.push({id:current,edge:prior.edge});current=prior.id}if(current===from){path.push({id:from});path.reverse()}}
 state.path=path;
 const tgt=$('pathResult');
 if(path.length){tgt.innerHTML='<div class="data-note">Path found · '+(path.length-1)+' connections. Follow the highlighted route on the map or click any step below.</div>'+path.map((step,i)=>'<button class="pathstep" data-open="'+H(step.id)+'">'+H(nmap.get(step.id).label)+(i?'<small>↑ '+H(edgeCfg(step.edge)[0])+': '+H(step.edge.title)+'</small>':'<small>Starting point</small>')+'</button>').join('')+'<div class="path-actions"><button class="button" data-action="clear-path">Clear path</button></div>'}
 else{tgt.innerHTML='<div class="data-note">No available non-catalogue route at your current spoiler setting. This does not establish that the two entities are unrelated.</div><button class="button" data-action="clear-path">Clear path</button>'}
 renderPathDock();requestDraw();
}
function startPath(){
 if(!state.selected)return;
 state.pathFrom=state.selected;state.pathTo=null;state.path=[];
 $('pathResult').innerHTML='<div class="data-note">Start: '+H(nmap.get(state.selected).label)+'. Search and open another entity.</div><button class="button" data-action="clear-path">Clear path</button>';
 renderPathDock();renderNode();$q.value='';$q.focus();toast('Start selected. Search for your destination.');
}
function route(){const hash=decodeURIComponent(location.hash.slice(1));if(hash&&nmap.has(hash)){selectNode(hash)}}
// Discovery controls are independent of data filtering, WikiRacer and pathfinding.
const DISCOVERY_PRESETS={calm:{density:14,bridges:40,labels:32,neighbors:16},explore:{density:37,bridges:60,labels:52,neighbors:62},all:{density:100,bridges:100,labels:100,neighbors:100}};
let discoverySaveTimer=0;
function updateDiscoveryOutputs(){
 const d=state.discovery;const ids={density:'densitySlider',bridges:'bridgeSlider',labels:'labelSlider',neighbors:'neighborSlider'};
 for(const [key,id] of Object.entries(ids)){
  const el=$(id);if(!el)continue;el.value=d[key];el.style.setProperty('--progress',d[key]+'%');
 }
 const total=state.visibleEdges.length, cross=state.visibleEdges.filter(e=>bridgeType(e)==='continuity').length;
 $('densityOutput').textContent=total.toLocaleString()+' / '+edges.length.toLocaleString();
 $('bridgeOutput').textContent=cross+' visible';
 $('labelOutput').textContent=state.discoveryLabels?.size+' titles' || '0 titles';
 $('neighborOutput').textContent=(12+Math.round(d.neighbors/100*143))+' nearby nodes';
 $('discoveryPreview').innerHTML=state.mode==='global'?'<strong>'+total.toLocaleString()+'</strong> relationships currently drawn · <b>'+cross+' bridges</b> across named continuities.':
  '<strong>'+state.visibleEdges.length+'</strong> relationships in '+(state.mode==='focus'?'focus':'current')+' mode. Return to Universe to adjust the global density.';
 $('discoveryCount').textContent=state.mode==='global'?total.toLocaleString():'Tune';
 $('discoverySidebarSummary').textContent=total.toLocaleString()+' connections currently shown'+(state.mode==='global'?' across the universe.':'.');
 const match=Object.keys(DISCOVERY_PRESETS).find(key=>Object.keys(d).every(k=>DISCOVERY_PRESETS[key][k]===d[k]));
 document.querySelectorAll('[data-preset]').forEach(b=>b.classList.toggle('active',b.dataset.preset===match));
}
function updateDiscovery(update,recenter=false){
 Object.assign(state.discovery,update);
 rebuild();
 if(state.mode==='global'&&recenter)fit();
 else if(state.mode==='focus'&&('neighbors' in update)){rebuild();focusCamera();}
 requestDraw();
 // Persist preferences locally, not in a service or account.
 try{localStorage.setItem('marvel-atlas:discovery-v5-2',JSON.stringify(state.discovery))}catch(_){ }
}
function toggleDiscovery(force){
 const pop=$('discoveryPopover'),opening=typeof force==='boolean'?force:pop.classList.contains('hidden');
 pop.classList.toggle('hidden',!opening);
 for(const id of ['discoveryBtn','discoveryFloat'])$(id).setAttribute('aria-expanded',String(opening));
 if(opening){$sidebar.classList.remove('mobile-open');updateDiscoveryOutputs();}
}
$('discoveryBtn').onclick=()=>toggleDiscovery();$('discoveryFloat').onclick=()=>toggleDiscovery();$('discoverySide').onclick=()=>toggleDiscovery(true);
$('closeDiscovery').onclick=$('discoveryDone').onclick=()=>toggleDiscovery(false);
$('discoveryReset').onclick=()=>updateDiscovery(DISCOVERY_PRESETS.calm,true);
for(const b of document.querySelectorAll('[data-preset]'))b.onclick=()=>updateDiscovery(DISCOVERY_PRESETS[b.dataset.preset],true);
for(const [id,key] of [['densitySlider','density'],['bridgeSlider','bridges'],['labelSlider','labels'],['neighborSlider','neighbors']]){
 $(id).oninput=e=>updateDiscovery({[key]:+e.target.value});
}
document.addEventListener('pointerdown',e=>{if(!$('discoveryPopover').contains(e.target)&&![...document.querySelectorAll('#discoveryBtn,#discoveryFloat,#discoverySide')].some(x=>x.contains(e.target)))toggleDiscovery(false)});
// interactions
$body.addEventListener('click',e=>{const el=e.target.closest('[data-open],[data-edge],[data-tab],[data-reveal],[data-action]');if(!el)return;if(el.dataset.open){selectNode(el.dataset.open);return}if(el.dataset.edge!==undefined){selectEdge(+el.dataset.edge);return}if(el.dataset.tab){state.tab=el.dataset.tab;state.shownFacts=12;renderNode();return}if(el.dataset.reveal){handleReveal(el.dataset.reveal);return}switch(el.dataset.action){case'path':startPath();break;case'global':resetMap();break;case'more-facts':state.shownFacts+=20;renderNode();break;case'share':{const url=location.href.split('#')[0]+'#'+encodeURIComponent(state.selected);if(navigator.clipboard?.writeText)navigator.clipboard.writeText(url).then(()=>toast('Link copied.')).catch(()=>toast(url));else toast(url);break}}});
$('pathDock').addEventListener('click',e=>{
 const el=e.target.closest('[data-path-step],[data-path-edge],[data-action]');if(!el)return;
 if(el.dataset.pathStep){selectNode(el.dataset.pathStep,{pathStep:true});return}
 if(el.dataset.pathEdge!==undefined){const idx=+el.dataset.pathEdge;if(Number.isFinite(idx)&&edges[idx])selectEdge(idx);return}
 switch(el.dataset.action){
  case 'clear-path':clearPath();break;
  case 'path-search':$q.value='';$q.focus();break;
  case 'path-map':closePanel();if(state.path.length){state.mode='path';rebuild();fit()}break;
  case 'path-reveal':state.spoilers=3;syncFilters();if(state.pathFrom&&state.pathTo)solvePath(state.pathFrom,state.pathTo);state.mode=state.path.length?'path':state.selected?'focus':'global';rebuild();if(state.selected)renderNode();if(state.mode==='path')fit();break;
  case 'path-restart':if(state.pathTo){const swap=state.pathFrom;state.pathFrom=state.pathTo;state.pathTo=swap;solvePath(state.pathFrom,state.pathTo);state.selected=state.pathTo;state.mode=state.path.length?'path':'focus';rebuild();if(state.selected)renderNode();fit()}break;
 }
});
$('pathResult').onclick=e=>{const el=e.target.closest('[data-open],[data-action]');if(!el)return;if(el.dataset.open)selectNode(el.dataset.open,{pathStep:state.path.some(step=>step.id===el.dataset.open)});if(el.dataset.action==='clear-path')clearPath()};
$('breadcrumb').onclick=e=>{const el=e.target.closest('[data-open]');if(el)selectNode(el.dataset.open,{back:true})};
$('backBtn').onclick=()=>{const previous=state.edgeFrom||state.history.pop();if(previous)selectNode(previous,{back:true});else resetMap()};$('closeBtn').onclick=closePanel;$('logo').onclick=resetMap;$('resetBtn').onclick=resetMap;$('fitBtn').onclick=()=>state.mode==='focus'?focusCamera():fit();
$('globalMode').onclick=()=>setMode('global');$('focusMode').onclick=()=>setMode('focus');$('timelineMode').onclick=()=>setMode('timeline');
$('zoomIn').onclick=()=>zoom(W*.55,HEIGHT*.5,1.3);$('zoomOut').onclick=()=>zoom(W*.55,HEIGHT*.5,.77);
$('resetFilters').onclick=()=>{state.filters={universe:'all',type:'all',edge:'all'};state.showCatalogue=false;state.secondHop=false;syncFilters();rebuild();state.mode==='focus'?focusCamera():fit()};
for(const [id,key]of [['universeFilter','universe'],['typeFilter','type'],['edgeFilter','edge']])$(id).onchange=e=>{state.filters[key]=e.target.value;rebuild();state.mode==='focus'?focusCamera():fit()};
$('revealEverything').onclick=()=>{state.spoilers=3;state.revealed.clear();syncFilters();if(state.pathTo)solvePath(state.pathFrom,state.pathTo);rebuild();if(state.selected)renderNode();else if(state.edge)renderEdge();if(state.mode==='global')fit();toast('Full spoiler exploration enabled.');};$('spoilerLevel').onchange=e=>{state.spoilers=+e.target.value;if(state.pathTo)solvePath(state.pathFrom,state.pathTo);rebuild();if(state.selected)renderNode();else if(state.edge)renderEdge()};$('secondHop').onchange=e=>{state.secondHop=e.target.checked;if(state.mode==='focus'){rebuild();focusCamera()}};$('showCatalogue').onchange=e=>{state.showCatalogue=e.target.checked;rebuild();requestDraw()};
for(const button of document.querySelectorAll('[data-trail]'))button.addEventListener('click',()=>{const id={doomsday:'doomsday',rings:'ten-rings-organization',torch:'role-johnny-2005',agatha:'agatha-all-along',spider:'nwh',daredevil:'bornagain',tony:'ironman',vision:'visionquest',endgame:'endgame'}[button.dataset.trail];state.filters={universe:'all',type:'all',edge:'all'};syncFilters();selectNode(id)});
$('randomBtn').onclick=()=>{const arr=DATA.nodes.filter(n=>n.type==='project'&&!n.isHub),id=arr[Math.floor(Math.random()*arr.length)].id;selectNode(id)};
$('aboutBtn').onclick=()=>$('about').classList.remove('hidden');$('closeAbout').onclick=$('aboutExplore').onclick=()=>$('about').classList.add('hidden');$('about').addEventListener('click',e=>{if(e.target.id==='about')$('about').classList.add('hidden')});$('toggleSettings').onclick=()=>$sidebar.classList.toggle('mobile-open');
$q.addEventListener('input',e=>search(e.target.value));$q.addEventListener('keydown',e=>{if(e.key==='Escape'){$results.classList.add('hidden');$q.blur()}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const m=state.searchResults.length;if(!m)return;state.activeResult=(state.activeResult+(e.key==='ArrowDown'?1:m-1))%m;[...$results.querySelectorAll('.result')].forEach((b,i)=>b.classList.toggle('active',i===state.activeResult))}if(e.key==='Enter'&&state.searchResults.length){pickSearch(state.searchResults[state.activeResult].id)}});$results.addEventListener('click',e=>{const el=e.target.closest('[data-result]');if(el)pickSearch(el.dataset.result)});document.addEventListener('pointerdown',e=>{if(!$('searchBox').contains(e.target))$results.classList.add('hidden')});
document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement!==$q&&!e.ctrlKey&&!e.metaKey){e.preventDefault();$q.focus()}if(e.key==='Escape'){if(!$('discoveryPopover').classList.contains('hidden'))toggleDiscovery(false);else if(!$('about').classList.contains('hidden'))$('about').classList.add('hidden');else if(!$results.classList.contains('hidden'))$results.classList.add('hidden');else if($panel.classList.contains('open'))closePanel()}});
function zoom(x,y,f){const t=state.transform,nk=Math.max(.13,Math.min(3.5,t.k*f)),ratio=nk/t.k;t.x=x-(x-t.x)*ratio;t.y=y-(y-t.y)*ratio;t.k=nk;requestDraw()}
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(e.clientX,e.clientY,Math.exp(-e.deltaY*.0012))},{passive:false});
canvas.addEventListener('pointerdown',e=>{state.drag={x:e.clientX,y:e.clientY,tx:state.transform.x,ty:state.transform.y,delta:0};canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing'});
canvas.addEventListener('pointermove',e=>{state.mouse={x:e.clientX,y:e.clientY};if(state.drag){const dx=e.clientX-state.drag.x,dy=e.clientY-state.drag.y;state.drag.delta=Math.max(state.drag.delta,Math.abs(dx)+Math.abs(dy));if(state.drag.delta>4){state.transform.x=state.drag.tx+dx;state.transform.y=state.drag.ty+dy;requestDraw()}return}const h=pick(e.clientX,e.clientY);if(h?.type!==state.hover?.type||h?.id!==state.hover?.id){state.hover=h;requestDraw()}tooltip(h)});
canvas.addEventListener('pointerup',e=>{if(state.drag&&state.drag.delta<6){const h=pick(e.clientX,e.clientY);if(h?.type==='node')selectNode(h.id);else if(h?.type==='edge')selectEdge(h.id)}state.drag=null;canvas.style.cursor='grab'});canvas.addEventListener('pointerleave',()=>{state.hover=null;tooltip(null);requestDraw()});
let touchDist=0;canvas.addEventListener('touchstart',e=>{if(e.touches.length===2)touchDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)},{passive:true});canvas.addEventListener('touchmove',e=>{if(e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),centerX=(e.touches[0].clientX+e.touches[1].clientX)/2,centerY=(e.touches[0].clientY+e.touches[1].clientY)/2;if(touchDist)zoom(centerX,centerY,d/touchDist);touchDist=d}},{passive:true});
window.addEventListener('resize',()=>{resize();state.mode==='focus'&&state.selected?focusCamera(true):fit(true)});window.addEventListener('hashchange',route);
for(let i=0;i<300;i++){state.stars.push([hash('starx'+i)%10000/10000,hash('stary'+i*13)%10000/10000,(hash('alpha'+i)%1000/1000)*.23+.03,(hash('px'+i)%1000/1000)*1.3+.2])}
const stats=`<div><b>${DATA.nodes.filter(n=>n.type==='project').length}</b><small>PROJECTS</small></div><div><b>${DATA.nodes.length}</b><small>ENTITIES</small></div><div><b>${edges.length}</b><small>CONNECTIONS</small></div>`;$('stats').innerHTML=stats;$('aboutCounts').textContent=`${DATA.nodes.length} nodes · ${edges.length} typed connections · ${DATA.facts.length} imported observations · ${DATA.callbacks.length} editorial callback comparisons.`;
try{
 const saved=JSON.parse(localStorage.getItem('marvel-atlas:discovery-v5-2')||'null');
 if(saved&&Object.keys(DISCOVERY_PRESETS.calm).every(key=>Number.isFinite(saved[key])&&saved[key]>=0&&saved[key]<=100))state.discovery={...saved};
}catch(_){/* Private browsing: fall back to calm presets. */}
syncFilters();resize();rebuild();fit(true);route();
window.__MARVEL_DEBUG={DATA,state,nmap,adj,rebuild,selectNode,selectEdge,search,solvePath,resetMap,edgeCfg,edges,toast,setMode,pick,overUniverseLabel,isDecorativeHub,bridgeType,globalPos,fit};
})();
