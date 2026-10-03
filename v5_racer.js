/* MARVEL ATLAS V5 • WikiRacer — graph-only traversal, no service / accounts */
(()=>{'use strict';
const $=id=>document.getElementById(id),api=window.__MARVEL_DEBUG;
if(!api)return;
const {DATA,nmap,adj,edges}=api;
const game={active:false,finished:false,from:null,to:null,visits:[],steps:0,startAt:0,best:0,elapsed:0,record:null};
const candidates=[
 ['ironman','agatha-all-along'],['aou','ff05'],['visionquest','dpw'],
 ['wandav','sm1'],['tws','xmen'],['nwh','black-panther'],
 ['thor','bornagain'],['captain-marvel','iron-man-3'],
 ['the-marvels','guardians-of-the-galaxy'],['avengers','logan'],
 ['loki','ironheart'],['ant-man','morbius'],['hawkeye','dark-phoenix'],
 ['doomsday','cloak-dagger'],['ms-marvel','she-hulk-attorney-at-law'],
 ['eyes-of-wakanda','eternals']
].filter(([a,b])=>nmap.has(a)&&nmap.has(b));
const safeEdge=e=>e.type!=='catalogue'&&e.provenance!=='theory'&&e.provenance!=='fan-theory'&&['story','continuation','appearance','character','identity','family','artifact','object','crossover','cameo','reference','postcredit','easter-egg','dialogue','visual','theme','alternate','same-universe','actor','portrayal','cast','music','place','production'].includes(e.type);
const races=candidates.filter(([a,b])=>a!==b&&shortest(a,b)?.length>=4);
function shortest(start,goal){let queue=[start],parents=new Map([[start,null]]);for(let i=0;i<queue.length;i++){const a=queue[i];if(a===goal)break;for(const e of adj.get(a)||[]){if(!safeEdge(e))continue;let b=e.a===a?e.b:e.a;if(parents.has(b))continue;parents.set(b,a);queue.push(b)}}if(!parents.has(goal))return null;let list=[goal];while(parents.get(list.at(-1)))list.push(parents.get(list.at(-1)));return list.reverse()}
function fmt(s){const n=Math.max(0,Math.floor(s));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function setPair(pair){$('raceFrom').value=pair[0];$('raceTo').value=pair[1];displayShortest()}
function displayShortest(){const a=$('raceFrom').value,b=$('raceTo').value,p=shortest(a,b);$('raceSummary').textContent=a===b?'Start and destination must differ.':p?`A route exists. Your goal is to discover it in as few moves as possible.`:'No eligible route currently found. Choose another pair.';$('raceStart').disabled=!p||a===b}
function open(){if(game.active){$('raceHUD').classList.remove('hidden');return}const options=DATA.nodes.filter(n=>n.type==='project'&&!n.isHub).sort((a,b)=>a.label.localeCompare(b.label));let rows=options.map(n=>`<option value="${n.id}">${n.label}</option>`).join('');$('raceFrom').innerHTML=rows;$('raceTo').innerHTML=rows;setPair(races[0]);$('raceModal').classList.remove('hidden');$('raceHUD').classList.add('hidden');$('sidebar').classList.remove('mobile-open')}
function closeModal(){$('raceModal').classList.add('hidden')}
function random(){let p=races[Math.floor(Math.random()*races.length)];if(p[0]===$('raceFrom').value&&p[1]===$('raceTo').value)p=races[(races.indexOf(p)+1)%races.length];setPair(p)}
function restoreState(){if(!game.active&&!game.finished)return;game.active=false;game.finished=false;$('raceHUD').classList.add('hidden');document.body.classList.remove('racing');const panel=$('raceResultCard');if(panel)panel.remove()}
function exitIfActive(){restoreState()}
function elapsed(){return game.finished?game.elapsed:(performance.now()-game.startAt)/1000}
function hud(){const from=nmap.get(game.from),to=nmap.get(game.to),at=nmap.get(game.visits.at(-1));if(!from||!to)return;$('raceHUD').innerHTML=`<div class="race-hud-main"><small>${game.finished?'✓ CHALLENGE COMPLETE':'⌁ WIKIRACER · NAVIGATE ONLY THROUGH CONNECTED NODES'}</small><b><strong>${from.label}</strong> → ${to.label}</b><small>Current: ${at.label} · ${game.steps} move${game.steps!==1?'s':''}</small></div><div class="race-hud-meta"><span id="raceTime">${fmt(elapsed())}</span><button id="raceHint" title="Show one hint">Hint</button><button id="raceGiveUp" title="Exit race">✕ Exit</button></div>`;
$('raceGiveUp').onclick=()=>{restoreState();api.toast('WikiRacer exited. Your atlas is back in explorer mode.')};
$('raceHint').onclick=()=>{if(game.finished)return;const curr=game.visits.at(-1),p=shortest(curr,game.to);if(!p||p.length<2)api.toast('You are already at the destination.');else api.toast('Hint: explore '+nmap.get(p[1]).label+' next.');};
}
function win(){game.active=false;game.finished=true;game.elapsed=(performance.now()-game.startAt)/1000;hud();const moves=game.steps,shortestMoves=game.record.length-1,route=game.visits.map(id=>nmap.get(id).label).join(' → ');let best='';try{const key=`marvel-race-v5:${game.from}:${game.to}`,old=JSON.parse(localStorage.getItem(key)||'null');if(!old||moves<old.moves||moves===old.moves&&game.elapsed<old.seconds){localStorage.setItem(key,JSON.stringify({moves,seconds:Math.round(game.elapsed)}));best='New personal best!'}else best=`Personal best: ${old.moves} moves, ${fmt(old.seconds)}.`;}catch(_){}
const card=document.createElement('div');card.id='raceResultCard';card.className='race-modal';card.innerHTML=`<div class="race-dialog"><button class="race-x" id="raceResultClose">×</button><p class="race-eyebrow">CONNECTION DISCOVERED</p><h2>YOU MADE IT. ✦</h2><p class="race-won">${moves} moves · ${fmt(game.elapsed)} · theoretical shortest ${shortestMoves} moves</p><p id="racePlayedRoute"></p><div class="race-summary">${best}</div><div class="race-menu-actions"><button id="raceReplay" class="button primary">Play another →</button><button id="raceExplore" class="button">Explore the map</button></div></div>`;document.body.append(card);card.querySelector('#racePlayedRoute').textContent=route;card.querySelector('#raceReplay').onclick=()=>{card.remove();game.finished=false;open();random()};card.querySelector('#raceExplore').onclick=()=>{card.remove();restoreState()};card.querySelector('#raceResultClose').onclick=()=>{card.remove();restoreState()};}
function start(){const from=$('raceFrom').value,to=$('raceTo').value,p=shortest(from,to);if(!p||from===to){displayShortest();return}restoreState();closeModal();game.from=from;game.to=to;game.visits=[from];game.steps=0;game.startAt=performance.now();game.elapsed=0;game.record=p;game.finished=false;api.state.filters={universe:'all',type:'all',edge:'all'};api.state.spoilers=3;$('spoilerLevel').value='3';api.state.pathFrom=null;api.state.pathTo=null;api.state.path=[];document.body.classList.add('racing');api.selectNode(from,{raceStart:true});game.active=true;hud();$('raceHUD').classList.remove('hidden');api.toast('WikiRacer started. Choose linked entities to reach the destination.');}
function canVisit(id,opts){if(!game.active)return false;if(opts.raceStart)return false;const current=game.visits.at(-1);if(id===current)return false;const valid=(adj.get(current)||[]).some(e=>safeEdge(e)&&(e.a===id||e.b===id));if(!valid){api.toast('No direct connection from '+nmap.get(current).label+' to '+nmap.get(id).label+'. Follow one of its actual edges.');return true}return false}
function afterVisit(id){if(!game.active||game.finished)return;const last=game.visits.at(-1);if(last===id)return;game.visits.push(id);game.steps++;hud();if(id===game.to)win()}
window.MARVEL_RACER={get active(){return game.active},get finished(){return game.finished},get game(){return game},open,closeModal,canVisit,blockVisit:canVisit,afterVisit,exitIfActive};
$('raceBtn').onclick=open;$('raceSide').onclick=open;$('raceClose').onclick=closeModal;$('raceRandom').onclick=random;$('raceStart').onclick=start;$('raceFrom').onchange=displayShortest;$('raceTo').onchange=displayShortest;$('raceModal').addEventListener('click',e=>{if(e.target.id==='raceModal')closeModal()});
$('expandPanel').onclick=()=>{const panel=$('panel'),on=panel.classList.toggle('expanded');$('expandPanel').textContent=on?'⌄':'⌃';$('expandPanel').setAttribute('aria-expanded',on?'true':'false');api.rebuild()};
window.setInterval(()=>{if(game.active){const el=$('raceTime');if(el)el.textContent=fmt(elapsed())}},250);
})();
