'use strict';
const assert=require('node:assert/strict');global.window={};
for(const file of ['data','curated','lore','narrative','fact_bridges','bridge_runtime','extras'])require('../'+file+'.js');
const D=window.MARVEL_DATA,by=new Map(D.nodes.map(n=>[n.id,n]));
assert.equal(by.size,D.nodes.length,'Duplicate nodes');
assert.equal(D.facts.length,1380,'The 1,380 original observations must remain intact');
assert.equal(D.callbacks.length,50,'All 50 user-supplied callback notes must remain');
assert(D.nodes.length>=700&&D.edges.length>=2700,'Expected substantial expanded graph');
for(const e of D.edges){assert(by.has(e.a),`Missing start ${e.a} (${e.title})`);assert(by.has(e.b),`Missing end ${e.b} (${e.title})`);assert.notEqual(e.a,e.b,'Self-edge');assert(e.title,'Unnamed edge');assert(typeof e.detail==='string'&&e.detail.trim().length>7,'Unexplained edge '+e.title);assert(Number.isInteger(e.spoiler)&&e.spoiler>=0&&e.spoiler<=3,'Invalid spoiler level '+e.title);}
const projects=D.nodes.filter(n=>n.type==='project'),beats=D.nodes.filter(n=>n.id.startsWith('thread-'));
for(const project of projects){assert(D.edges.some(e=>(e.a===project.id&&e.b.startsWith('thread-')||e.b===project.id&&e.a.startsWith('thread-'))&&e.type!=='catalogue'),`Missing named thread for ${project.label}`);}
for(const cb of D.callbacks){assert(by.has(cb.id),'Missing callback card '+cb.id);assert(cb.originalDescription&&cb.originalDescription.length>15,'Original callback note was lost: '+cb.id);assert(cb.description&&cb.description.length>30,'No corrected/curated comparison '+cb.id);assert(cb.projects.length>=1,'No callback endpoints '+cb.id);for(const id of cb.projects)assert(by.has(id),'Unrecognized callback endpoint '+cb.id+' '+id);}
const single=D.callbacks.filter(c=>c.projects.length===1).map(c=>c.id);
assert.deepEqual(single,['cb9','cb17','cb34','cb44','cb50'],'Only the five genuine same-work comparisons should have one endpoint');
const matchingCSV=D.nodes.filter(n=>n.id.startsWith('csv-bridge-'));assert.equal(matchingCSV.length,D.v4.bridgedFacts);assert(matchingCSV.length>=100);
const has=(a,b,t)=>D.edges.some(e=>(e.a===a&&e.b===b||e.a===b&&e.b===a)&&(!t||e.type===t));
for(const [a,b,t]of [
 ['aou','infwar','story'],['infwar','wandav','story'],['wandav','agatha-all-along','continuation'],['agatha-all-along','visionquest','continuation'],
 ['aou','visionquest','story'],['ironman','endgame','dialogue'],['tws','endgame','dialogue'],
 ['tws','endgame','visual'],['aou','endgame','dialogue'],['thor','endgame','visual'],
 ['ironman','ten-rings-organization','appearance'],['ten-rings-organization','role-wenwu','character'],
 ['ff05','dpw','crossover'],['role-johnny-2005','dpw','cameo'],['role-johnny-2025','ff','appearance'],
 ['ff','doomsday','continuation'],['x-men-97','xmen','production'],['cloak-dagger','runaways','story'],
 ['infwar','endgame','continuation'],['black-widow','hawkeye','story'],['guardians-of-the-galaxy','endgame','story'],
 ['endgame','loki','story']])assert(has(a,b,t),`Missing significant connection ${a} → ${b} (${t})`);
assert(D.edges.filter(e=>e.type==='dialogue').length>=80,'Insufficient line callbacks');
assert(D.edges.filter(e=>e.type==='theme').length>=80,'Insufficient thematic parallels');
assert(D.edges.filter(e=>e.type==='story').length>=450,'Insufficient explained cross-media story threads');
assert(D.edges.filter(e=>e.type==='visual').length>=10,'Insufficient visual parallels');
assert(D.edges.filter(e=>e.type==='music').length>=15,'Incomplete music references');
assert(D.edges.filter(e=>['easter-egg','easter_egg'].includes(e.type)).length>=45,'Incomplete additional discoveries');
assert(D.nodes.filter(n=>n.id.startsWith('detail-')).length>=50,'Missing new post-credit and musical detail nodes');
for(const e of D.edges.filter(e=>e.source==='Marvel official'))assert(e.sourceUrl&&/^https:\/\/(www\.marvel\.com|apnews\.com|www\.reuters\.com)\//.test(e.sourceUrl),'Official label without official URL: '+e.title);
const metrics={projects:projects.length,entities:D.nodes.length,relationships:D.edges.length,beats:beats.length,callbacks:D.callbacks.length,callbackWithTwoOrMoreEndpoints:50-single.length,originalCSVFacts:D.facts.length,exactCSVBridges:matchingCSV.length,types:Object.fromEntries([...new Set(D.edges.map(e=>e.type))].sort().map(t=>[t,D.edges.filter(e=>e.type===t).length])),officialLinkedEdges:D.edges.filter(e=>e.source==='Marvel official').length,additionalDetailNodes:D.nodes.filter(n=>n.id.startsWith('detail-')).length,unconfirmedImportedFacts:D.facts.filter(x=>x.origin==='User-provided CSV').length};
require('node:fs').writeFileSync(require('node:path').join(__dirname,'coverage.json'),JSON.stringify(metrics,null,2)+'\n');
console.log('PASS: all',projects.length,'projects have a named thread; all edges have endpoints, explanations, spoiler levels.');
console.log('PASS:',beats.length,'named story/production threads;',D.callbacks.length,'callback cards with original notes retained;',50-single.length,'cross-work callbacks.');
console.log('PASS:',D.facts.length,'original CSV entries;',matchingCSV.length,'exact-titled source-to-target cross-references.');
console.log('PASS: Doomsday, Fox Human Torch, Ten Rings, Infinity saga, Wanda / Agatha / Vision and lesser-known adaptations.');
console.log('COVERAGE',JSON.stringify({projects:metrics.projects,entities:metrics.entities,relationships:metrics.relationships,beats:metrics.beats,callbacks:metrics.callbacks,exactCSVBridges:metrics.exactCSVBridges,officialLinkedEdges:metrics.officialLinkedEdges}));
