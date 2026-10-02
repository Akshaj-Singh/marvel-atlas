/* An exact-phrase concordance of the supplied CSV. This layer does NOT fact-check it.
   Original statements are preserved in data.js and remain visibly user-supplied. */
(()=>{'use strict';
const D=window.MARVEL_DATA,R=window.MARVEL_FACT_BRIDGES||[];const by=new Map(D.nodes.map(n=>[n.id,n]));const key=new Set(D.edges.map(e=>[e.a,e.b].sort().join(':')+'|'+e.type+'|'+e.title));
function edge(a,b,type,title,detail){if(!by.has(a)||!by.has(b)||a===b)throw Error('Unrecognized CSV bridge '+a+' / '+b);let k=[a,b].sort().join(':')+'|'+type+'|'+title;if(key.has(k))return;key.add(k);D.edges.push({a,b,type,title,detail,spoiler:2,provenance:'editorial',source:'User-provided CSV · exact title cross-reference; independent verification not completed'});}
let count=0;
for(const row of R){const a=D.aliases[row.source_title];if(!a||!by.has(a))throw Error('Missing CSV source '+row.source_title);const bs=row.targets.filter(t=>by.has(t)&&t!==a);if(!bs.length)continue;
 const id=row.id;const n={id,type:'discovery',label:row.title,universe:by.get(a).universe,spoiler:2,description:row.detail,origin:'Exact named cross-reference extracted from original user CSV; NOT independently corroborated',source:'User-provided CSV',keywords:['fact '+row.number,row.kind]};
 if(by.has(id))throw Error('CSV fact duplicated '+id);by.set(id,n);D.nodes.push(n);
 const type=row.kind.toLowerCase().includes('easter')?'easter-egg':row.kind.toLowerCase().includes('post-credit')?'reference':'reference';
 edge(id,a,type,'Original observation from '+row.source_title,row.detail);
 for(const b of bs){edge(id,b,type,'Mentions '+by.get(b).label,row.detail);edge(a,b,type,'CSV observation #'+row.number,row.detail)}
 count++;
}
D.v4.bridgedFacts=count;
})();
