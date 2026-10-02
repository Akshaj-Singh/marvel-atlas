/**
 * MARVEL ATLAS V3 — SOURCED RELATIONSHIP EXPANSION
 * Maintained separately from the original user's CSV and callback notes.
 * This is an editorial *index*, not a mirrored copy of a fandom wiki.
 * Added edges explain one actual relationship. Actor identity != character identity;
 * team inheritance != identical person; same adaptation != same timeline.
 * Last source audit: 2026-10-02. See sources/RESEARCH.md.
 */
(()=>{'use strict';
const D=window.MARVEL_DATA;if(!D)throw Error('Load data.js and curated.js before lore.js');
const nodes=D.nodes,edges=D.edges,by=new Map(nodes.map(n=>[n.id,n])),aliases=D.aliases;
const SRC={
 doomsday:'https://www.marvel.com/movies/avengers-doomsday',
 cast:'https://apnews.com/article/avengers-doomsday-cast-4352aa2dbe3179662189a8957c2ef5a4',
 evans:'https://www.reuters.com/business/media-telecom/robert-downey-jr-chris-evans-unite-marvels-doomsday-2026-04-17/',
 four:'https://www.marvel.com/articles/movies/fantastic-four-first-steps-avengers-doomsday-kevin-feige',
 wikiDoom:'https://marvelcinematicuniverse.fandom.com/wiki/Avengers:_Doomsday/Credits',
 wikiDpw:'https://marvelcinematicuniverse.fandom.com/wiki/Deadpool_%26_Wolverine/Credits',
 wikiTen:'https://marvelcinematicuniverse.fandom.com/wiki/Ten_Rings_(Organization)',
 wikiWeapons:'https://marvelcinematicuniverse.fandom.com/wiki/Ten_Rings_(Weapons)',
 wikiOneShot:'https://marvelcinematicuniverse.fandom.com/wiki/Marvel_One-Shot:_All_Hail_the_King',
 wikiEvans:'https://marvelcinematicuniverse.fandom.com/wiki/Chris_Evans',
 wikiDPW:'https://marvelcinematicuniverse.fandom.com/wiki/Deadpool_%26_Wolverine',
 comics:'https://www.marvel.com/'
};
const exists=id=>by.has(id);
const resolve=id=>aliases[id]||id;
function entity(id,type,label,universe='x',description='',opts={}){
 if(by.has(id)){let n=by.get(id); if(!n.description&&description)n.description=description;if(!n.short&&opts.short)n.short=opts.short;return n}
 const n={id,type,label,universe,description,...opts};by.set(id,n);nodes.push(n);return n;
}
function project(title,universe='mcu',year,status='released',description=''){
 const id=resolve(title);if(exists(id))return id;
 let generated='project-'+title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 entity(generated,'project',title,universe,description,{year,status,media:'film / series'});
 aliases[title]=generated;return generated;
}
function edge(x,y,type,title,detail,spoiler=0,source='editorial',url){
 const a=resolve(x),b=resolve(y);if(!by.has(a)||!by.has(b))throw Error('Unknown endpoint '+a+' -> '+b+' : '+title);
 if(a===b)throw Error('Self link '+a+' '+title);
 const key=[a,b].sort().join('|')+'|'+type+'|'+title;
 if(D.__LORE_KEYS.has(key))return;
 D.__LORE_KEYS.add(key);
 let provenance=source==='official'?'confirmed':source==='wiki'?'community':source==='reported'?'reported':source==='production'?'production':source==='interpretation'?'editorial':'editorial';
 let label=source==='official'?'Marvel official':source==='wiki'?'MCU Wiki · community compiled':source==='reported'?'Reported / not officially announced':source==='production'?'Documented production credit':'Editorial cross-reference';
 edges.push({a,b,type,title,detail,spoiler,provenance,source:label,sourceUrl:url||(source==='official'?SRC.doomsday:source==='wiki'?SRC.wikiDoom:undefined)});
}
D.__LORE_KEYS=new Set(edges.map(e=>[e.a,e.b].sort().join('|')+'|'+e.type+'|'+e.title));
function connectList(node,projects,type,title,explain,spoiler=1,source='wiki',url){
 for(const p of projects){if(!exists(resolve(p)))continue;
  edge(node,p,type,title,typeof explain==='function'?explain(p):explain,spoiler,source,url);
 }
}
function appearance(c,p,reason,sp=1,url=SRC.wikiDoom,level='wiki'){edge(c,p,'appearance','Appears: '+reason,reason,sp,level,url)}
function person(id,name){return entity('cast-'+id,'actor',name,'x','Screen performer. A casting credit does not imply different roles are the same individual.')}
function character(id,name,u='mcu',about=''){return entity('role-'+id,'character',name,u,about)}
function withCast(c,a,films,firstNote='',url=SRC.wikiDoom){
 edge(c,a,'portrayal','Portrayed by '+by.get(a).label,by.get(a).label+' plays '+by.get(c).label+' in the listed screen projects. Distinct characters and alternate incarnations remain separate nodes.',0,'wiki',url);
 for(const f of films){if(!exists(resolve(f)))continue;edge(c,f,'appearance','On-screen character: '+by.get(c).label,firstNote||by.get(c).label+' is portrayed on screen in '+by.get(resolve(f)).label+'.',1,'wiki',url)}
}
// ━━━━━━━━━━━━━ 1. DOOMSDAY: 2025 MARVEL REVEAL + REUTERS 2026 ━━━━━━━━━━━━━
// Actor / screen identity / formative project. These names are official-announced;
// this DOES NOT assert the characters meet or that their fates are known.
const R=[
 ['rdj','Robert Downey Jr.','doom','Victor von Doom / Doctor Doom',[], 'x'],
 ['chris-hemsworth','Chris Hemsworth','thor-odinson','Thor',['Thor','The Avengers','Thor: Ragnarok','Avengers: Endgame','Thor: Love and Thunder'],'mcu'],
 ['vanessa-kirby','Vanessa Kirby','sue-2025','Sue Storm / Invisible Woman',['The Fantastic Four: First Steps'],'mcu'],
 ['anthony-mackie','Anthony Mackie','sam-wilson','Sam Wilson / Captain America',['Captain America: The Winter Soldier','The Falcon and the Winter Soldier','Captain America: Brave New World'],'mcu'],
 ['sebastian-stan','Sebastian Stan','bucky-barnes','Bucky Barnes / Winter Soldier',['Captain America: The First Avenger','Captain America: The Winter Soldier','The Falcon and the Winter Soldier','Thunderbolts*'],'mcu'],
 ['letitia-wright','Letitia Wright','shuri','Shuri / Black Panther',['Black Panther','Black Panther: Wakanda Forever','Avengers: Infinity War'],'mcu'],
 ['paul-rudd','Paul Rudd','scott-lang','Scott Lang / Ant-Man',['Ant-Man','Ant-Man and the Wasp','Avengers: Endgame','Ant-Man and the Wasp: Quantumania'],'mcu'],
 ['wyatt-russell','Wyatt Russell','john-walker','John Walker / U.S. Agent',['The Falcon and the Winter Soldier','Thunderbolts*'],'mcu'],
 ['tenoch-huerta','Tenoch Huerta Mejía','namor','Namor',['Black Panther: Wakanda Forever'],'mcu'],
 ['ebon-moss-bachrach','Ebon Moss-Bachrach','ben-2025','Ben Grimm / The Thing',['The Fantastic Four: First Steps'],'mcu'],
 ['simu-liu','Simu Liu','shang-chi','Shang-Chi',['Shang-Chi and the Legend of the Ten Rings'],'mcu'],
 ['florence-pugh','Florence Pugh','yelena-belova','Yelena Belova',['Black Widow','Hawkeye','Thunderbolts*'],'mcu'],
 ['kelsey-grammer','Kelsey Grammer','beast-fox','Hank McCoy / Beast',['X-Men: The Last Stand','X-Men: Days of Future Past','The Marvels'],'fox'],
 ['lewis-pullman','Lewis Pullman','bob-sentry','Bob Reynolds / Sentry',['Thunderbolts*'],'mcu'],
 ['danny-ramirez','Danny Ramirez','joaquin-torres','Joaquín Torres / Falcon',['The Falcon and the Winter Soldier','Captain America: Brave New World'],'mcu'],
 ['joseph-quinn','Joseph Quinn','johnny-2025','Johnny Storm / Human Torch (2025)',['The Fantastic Four: First Steps'],'mcu'],
 ['david-harbour','David Harbour','red-guardian','Alexei Shostakov / Red Guardian',['Black Widow','Thunderbolts*'],'mcu'],
 ['winston-duke','Winston Duke','mbaku','M’Baku',['Black Panther','Black Panther: Wakanda Forever'],'mcu'],
 ['hannah-john-kamen','Hannah John-Kamen','ghost','Ava Starr / Ghost',['Ant-Man and the Wasp','Thunderbolts*'],'mcu'],
 ['hiddleston','Tom Hiddleston','loki-variant','Loki',['Thor','The Avengers','Loki','Avengers: Infinity War'],'mcu'],
 ['patrick-stewart','Patrick Stewart','xavier-fox','Charles Xavier / Professor X (Fox)',['X-Men','X2','X-Men: Days of Future Past','Logan'],'fox'],
 ['ian-mckellen','Ian McKellen','magneto-fox','Erik Lehnsherr / Magneto (Fox)',['X-Men','X2','X-Men: Days of Future Past'],'fox'],
 ['alan-cumming','Alan Cumming','nightcrawler-fox','Kurt Wagner / Nightcrawler',['X2'],'fox'],
 ['rebecca-romijn','Rebecca Romijn','mystique-fox','Raven Darkhölme / Mystique',['X-Men','X2','X-Men: The Last Stand'],'fox'],
 ['james-marsden','James Marsden','cyclops-fox','Scott Summers / Cyclops',['X-Men','X2','X-Men: The Last Stand','X-Men: Days of Future Past'],'fox'],
 ['channing-tatum','Channing Tatum','gambit-dpw','Remy LeBeau / Gambit',['Deadpool & Wolverine'],'x'],
 ['pedro-pascal','Pedro Pascal','reed-2025','Reed Richards / Mister Fantastic',['The Fantastic Four: First Steps'],'mcu']
];
const actorsToRole={};
for(const [aid,an,cid,cn,film,u] of R){
 const a=by.get(aid)?.type==='actor'?aid:person(aid,an).id;
 const c=character(cid,cn,u,'The '+cn+' screen incarnation portrayed by '+an+'.');actorsToRole[aid]={actor:a,character:c.id};
 const officialInfo='Announced for Avengers: Doomsday: '+an+' as '+cn+'. Casting is confirmed; exact plot interactions are not. This is not evidence that multiple universes have merged into one timeline.';
 edge(c.id,'doomsday','appearance','Officially announced Doomsday role',officialInfo,0,'official',SRC.doomsday);
 edge(a,'doomsday','cast','Officially announced cast',an+' is an announced performer in Avengers: Doomsday. Cast membership does not itself confirm who meets whom.',0,'official',SRC.cast);
 edge(a,c.id,'portrayal','Portrays '+cn,an+' portrays '+cn+'. Casting is not proof of shared identity with similarly named characters from other continuities.',0,'official',SRC.cast);
 for(const f of film){if(!exists(resolve(f)))continue;edge(c.id,f,'appearance','Earlier screen appearance',cn+' is featured in '+by.get(resolve(f)).label+'. This is background for the announced Doomsday character, not confirmation of the Doomsday plot.',0,'wiki',SRC.wikiDoom)}
}
// Announcement made subsequently: Steve Rogers, not an assertion of Johnny Storm in Doomsday.
edge('evans','doomsday','cast','Chris Evans returns as Steve Rogers','Reuters reported on April 17, 2026 that Chris Evans returns as Steve Rogers in Doomsday; separate from his earlier Fox Human Torch role.',0,'official',SRC.evans);
edge('steve','doomsday','appearance','Steve Rogers returns','Chris Evans returns as Steve Rogers, distinct from Sam Wilson’s Captain America mantle.',0,'official',SRC.evans);
edge('evans','steve','portrayal','Captain America actor','Chris Evans portrays Steve Rogers; he also portrayed a separate incarnation of Johnny Storm in Fox films and in Deadpool & Wolverine.',0,'wiki',SRC.wikiEvans);
const doom=character('doctor-doom','Doctor Doom / Victor von Doom','x','Victor von Doom is the principal antagonist announced for Doomsday; RDJ plays Doom, not a confirmed Tony Stark variant.');
edge('rdj',doom.id,'portrayal','One actor, different characters','Robert Downey Jr. portrays Tony Stark in the Infinity Saga and has been cast as Victor von Doom in Doomsday. The same actor is not proof Doom is a Tony Stark variant.',0,'official',SRC.cast);
edge('tony',doom.id,'alternate','Different roles, no confirmed identity','Tony Stark and Victor von Doom are distinct characters; the actor’s return does not establish a Stark variant or an in-universe family relationship.',0,'editorial');
edge('doomsday',doom.id,'appearance','Doctor Doom arrives','Victor von Doom is confirmed as the villain of Avengers: Doomsday; plot particulars remain unreleased.',0,'official',SRC.doomsday);
// Reuse existing character seed nodes as concrete links to the exact screen versions.
for(const [a,b] of [['thor-odinson','thor'],['loki-variant','lokic'],['shuri','black-panther-wakanda-forever'],['bucky-barnes','tws'],['gambit-dpw','dpw']]){
 const id='role-'+a,other=resolve(b);if(exists(other))edge(id,other,'character','Established screen arc','The returning character’s history can be explored through this related screen story.',0,'editorial');
}
// Additional names in the requested *community-maintained* MCU Wiki roster.
// Not elevated to Marvel-announced casting without a separate primary source.
const wikiRoster=[
 ['Benedict Cumberbatch','Stephen Strange / Doctor Strange','Doctor Strange'],
 ['Ryan Reynolds','Wade Wilson / Deadpool','Deadpool & Wolverine'],
 ['Hayley Atwell','Peggy Carter','Captain America: The First Avenger'],
 ['Xochitl Gomez','America Chavez','Doctor Strange in the Multiverse of Madness'],
 ['Kathryn Newton','Cassie Lang','Ant-Man and the Wasp: Quantumania'],
 ['Mabel Cadena','Namora','Black Panther: Wakanda Forever'],
 ['Alex Livinalli','Attuma','Black Panther: Wakanda Forever'],
 ['Matthew Wood','H.E.R.B.I.E. (voice)','The Fantastic Four: First Steps'],
 ['India Rose Hemsworth','Love','Thor: Love and Thunder']
];
for(const [performer,roleName,previous] of wikiRoster){
 const a=person(performer.toLowerCase().replace(/[^a-z0-9]+/g,'-'),performer);
 const c=character('wiki-'+roleName.toLowerCase().replace(/[^a-z0-9]+/g,'-'),roleName,'mcu','This character is listed in a community-maintained Doomsday cast wiki. Check official announcements before treating future appearance as confirmed.');
 edge(a.id,c.id,'portrayal','Existing screen portrayal',performer+' is associated with '+roleName+' in earlier screen Marvel material; a future Doomsday appearance is NOT independently announced by the sources used for this row.',0,'wiki',SRC.wikiDoom);
 edge(a.id,'doomsday','reference','Wiki-only casting · not studio-confirmed',performer+' appears in the community-maintained MCU Wiki roster; verify any casting in a studio announcement before relying on it.',0,'reported',SRC.wikiDoom);
 edge(c.id,'doomsday','reference','Wiki-listed Doomsday character · unverified',roleName+' appears on the MCU Wiki cast list, but was not established by the cited March 2025 27-person studio announcement or the separate verified Steve Rogers update. Do not treat this as an officially confirmed appearance.',0,'reported',SRC.wikiDoom);
 if(exists(resolve(previous)))edge(c.id,previous,'appearance','Earlier screen credit',roleName+' has a prior on-screen association with '+previous+'. This does not confirm an appearance in Doomsday.',0,'wiki',SRC.wikiDoom);
}
// Announced groups: label as cast-franchise intersections, never alleged encounters.
const strands=[
 ['The Fantastic Four: First Steps','First Steps cast is announced for Doomsday. Marvel additionally confirms the four inhabit a separate reality at the start of their MCU introduction.',SRC.four],
 ['Thunderbolts*','The New Avengers / Thunderbolts* cast includes Yelena, Bucky, Ghost, Red Guardian, U.S. Agent and Sentry, all announced for Doomsday.',SRC.cast],
 ['Shang-Chi and the Legend of the Ten Rings','Simu Liu is among the announced Doomsday cast. The Ten Rings are a separate object/story thread, not proof of a particular plot.',SRC.cast],
 ['Black Panther: Wakanda Forever','Shuri, Namor and M’Baku actors are announced for Doomsday. This confirms performer continuity, not a specific alliance.',SRC.cast],
 ['Captain America: Brave New World','Sam Wilson and Joaquín Torres performers are announced for Doomsday.',SRC.cast],
 ['Loki','Tom Hiddleston is announced for Doomsday; the show supplies multiverse/TVA context without confirming the film’s storyline.',SRC.cast],
 ['Deadpool & Wolverine','Channing Tatum’s Gambit from Deadpool & Wolverine is announced for Doomsday. This does not confirm Wade Wilson or Logan themselves appear.',SRC.cast],
 ['X-Men','Original Fox-era X-Men performers are announced for Doomsday. Their precise narrative timeline is not fully established by a cast list.',SRC.cast],
 ['X2','Alan Cumming (Nightcrawler) and other actors from X2 are announced for Doomsday. Casting alone does not settle timeline questions.',SRC.cast],
 ['The Marvels','Kelsey Grammer’s Beast appears in the film’s credits scene; that actor is announced for Doomsday.',SRC.cast],
 ['Avengers: Endgame','Doomsday follows the Avengers saga; Marvel has confirmed RDJ will play Doom rather than automatically reprising Tony Stark.',SRC.doomsday]
];
for(const [p,d,url] of strands)if(exists(resolve(p)))edge('doomsday',p,'crossover','Doomsday cast / franchise bridge',d,0,'official',url);
by.get('doomsday').year=2026;by.get('doomsday').status='upcoming';
Object.assign(by.get('doomsday'),{short:'The Avengers, the Fantastic Four, and several Fox-era X-Men performers converge in a confirmed cast. Individual encounters, outcomes, and any additional casting must be checked separately.',watch:[resolve('The Fantastic Four: First Steps'),resolve('Thunderbolts*'),resolve('Shang-Chi and the Legend of the Ten Rings'),resolve('Deadpool & Wolverine'),resolve('Loki')],sources:[SRC.doomsday,SRC.cast,SRC.evans,SRC.four,SRC.wikiDoom],keywords:['Doctor Doom','Robert Downey Jr','X-Men','Fantastic Four','Shang-Chi','Thunderbolts','Steve Rogers','2026']});
// ━━━━━━━━━━━━━ 2. TEN RINGS: ACTUAL 2008 → 2021 CHAIN ━━━━━━━━━━━━━
const org=entity('ten-rings-organization','organization','The Ten Rings · organization','mcu','The clandestine network that captures Tony Stark in Iron Man. Later revealed to have been founded and led by Xu Wenwu. Do not confuse the organization with Wenwu’s ten weapons.',{short:'First seen in Iron Man (2008); the organizational thread is developed through Iron Man 3, All Hail the King and Shang-Chi.',sources:[SRC.wikiTen]});
const weapons=entity('ten-rings-weapons','artifact','The Ten Rings · mystical weapons','mcu','The ten arm-worn artifacts possessed by Wenwu, later inherited by Shang-Chi. These artifacts gave the Ten Rings organization its name; they are not shown wielded in Iron Man (2008).',{sources:[SRC.wikiWeapons]});
const wenwu=character('wenwu','Xu Wenwu / the real Mandarin','mcu','Ancient wielder of the Ten Rings and founder of the organization. Distinct from Trevor Slattery’s staged Mandarin persona.');
const xialing=character('xialing','Xu Xialing','mcu','Wenwu’s daughter who eventually takes charge of the Ten Rings organization.');
const trevor=character('trevor','Trevor Slattery','mcu','The actor hired to impersonate the Mandarin in Iron Man 3; the real organization reacts to the impersonation.');
const killian=character('killian','Aldrich Killian','mcu','Extremis/A.I.M. mastermind who uses the Mandarin persona as a public-facing decoy in Iron Man 3.');
const raza=character('raza','Raza','mcu','Leader of the Ten Rings cell involved in Tony Stark’s kidnapping in Iron Man.');
const xorg=entity('aim','organization','A.I.M. / Advanced Idea Mechanics','mcu','Aldrich Killian’s research enterprise behind the staged Mandarin terrorism of Iron Man 3; do not mistake it for the real Ten Rings.');
const ironGang=entity('iron-gang','organization','Iron Gang','mcu','Another group connected to Wenwu’s family history in Shang-Chi.');
const shot=project('Marvel One-Shot: All Hail the King','mcu',2014,'released','Trevor Slattery meets an interviewer who reveals that the real Ten Rings organization is unhappy with his impersonation.');
const beacon=entity('rings-beacon','event','Unidentified signal from the Ten Rings','mcu','The Shang-Chi mid-credits scene shows the rings emitting a signal whose destination is not identified there. Do not label it a Doomsday/Doctor Doom signal without confirmation.',{spoiler:3});
const mandarin=entity('mandarin-persona','identity','The Mandarin: real leader vs staged persona','mcu','Iron Man 3 presents a staged Mandarin played by Trevor Slattery; Shang-Chi identifies Xu Wenwu as leader of the genuine Ten Rings.');
for(const [p,detail] of [
 ['Iron Man','A cell of the Ten Rings ambushes Tony Stark in Afghanistan, holds him captive, and inadvertently catalyzes the creation of Iron Man. This is the organization’s first on-screen appearance.'],
 ['Iron Man 2','The group’s imagery appears in the franchise’s wider early-MCU continuity; a smaller connection than the original kidnapping.'],
 ['Iron Man 3','Aldrich Killian exploits the Mandarin and Ten Rings imagery as a diversion; the villain publicly presented is not the real founder Wenwu.'],
 [shot,'A genuine Ten Rings agent reveals Trevor Slattery has angered the real leader; this One-Shot bridges Iron Man 3 to Shang-Chi.'],
 ['Ant-Man','A Ten Rings buyer is present during the Yellowjacket technology presentation; this is a background organizational appearance.'],
 ['Ms. Marvel','The organization’s symbol appears in the Kamala Khan / Noor Dimension history context; treat this as an emblem/reference, not a main-story crossover.'],
 ['Shang-Chi and the Legend of the Ten Rings','Shang-Chi identifies Xu Wenwu as the long-standing leader, revealing the organization and its namesake artifacts and passing the organization to Xu Xialing.']
]){edge(org.id,p,'appearance','Ten Rings organization on screen',detail,0,'wiki',SRC.wikiTen)}
edge(org.id,'ironman','story','The 2008 kidnapping changes MCU history','The same fictional organization that kidnaps Tony Stark in Iron Man is expanded upon in Shang-Chi. Tony first builds the suit while imprisoned by this group.',1,'wiki',SRC.wikiTen);
edge(org.id,weapons.id,'identity','The organization is named for the artifacts','Wenwu’s mystical rings provide the name and emblem of the Ten Rings organization. Distinct fictional entities: a criminal network and ten supernatural arm-rings.',0,'wiki',SRC.wikiWeapons);
edge(org.id,wenwu.id,'character','Founder and leader','Xu Wenwu founded the secret organization centuries before Iron Man and leads its history revealed in Shang-Chi.',1,'wiki',SRC.wikiTen);
edge(org.id,xialing.id,'character','New leader','After Wenwu’s death, Xu Xialing takes over and redirects the organization. This is a character-to-organization relation.',3,'wiki',SRC.wikiTen);
edge(org.id,raza.id,'character','Afghanistan cell commander','Raza leads the Ten Rings cell that captures Tony Stark; his role is not the same as Wenwu’s leadership of the whole network.',1,'wiki',SRC.wikiTen);
edge(wenwu.id,weapons.id,'artifact','Wenwu wields the rings','Wenwu’s supernatural weapons grant him long life and immense combat power. The rings are not the Infinity Stones.',0,'wiki',SRC.wikiWeapons);
edge(weapons.id,'role-shang-chi','artifact','Shang-Chi inherits the rings','In the film’s climax Shang-Chi gains control of Wenwu’s weapons. He is their current live-action screen wielder.',3,'wiki',SRC.wikiWeapons);
edge(wenwu.id,'role-shang-chi','family','Father and son','Wenwu trains his son but their conflict drives the main Shang-Chi story.',1,'wiki',SRC.wikiWeapons);
edge(wenwu.id,xialing.id,'family','Father and daughter','Xu Xialing is Wenwu’s daughter and Shang-Chi’s sister; she later becomes the organization’s leader.',1,'wiki',SRC.wikiTen);
edge(xialing.id,'role-shang-chi','family','Siblings','Shang-Chi and Xialing share Wenwu as their father and reunite during the film’s events.',1,'wiki',SRC.wikiTen);
edge(org.id,trevor.id,'character','Trevor impersonates its legendary leader','Trevor plays the Mandarin for Killian’s scheme; the authentic Ten Rings organization later confronts him.',2,'wiki',SRC.wikiOneShot);
edge(trevor.id,killian.id,'character','Impostor employed by Killian','Aldrich Killian employs Trevor Slattery to perform the fake Mandarin threat.',2,'wiki',SRC.wikiOneShot);
edge(killian.id,xorg.id,'character','A.I.M. mastermind','Killian’s A.I.M. operations exploit fear of the Mandarin, who is played by Trevor Slattery.',2,'wiki',SRC.wikiOneShot);
edge(org.id,xorg.id,'reference','Impostor branding is not organizational identity','A.I.M. borrows the image of the Ten Rings in Iron Man 3, but that does not establish Killian as founder or leader of the real organization.',2,'wiki',SRC.wikiOneShot);
edge(org.id,mandarin.id,'identity','Who is the real Mandarin?','The label is used for different portrayals and a real figure; the One-Shot and Shang-Chi clarify the distinction.',2,'wiki',SRC.wikiOneShot);
edge(mandarin.id,wenwu.id,'identity','Wenwu’s moniker','The genuine Ten Rings leader is Xu Wenwu; his story distinguishes him from Trevor’s performance.',2,'wiki',SRC.wikiTen);
edge(mandarin.id,trevor.id,'identity','Fictional media persona','Trevor’s Mandarin is an actor’s stage persona, not a separately established criminal mastermind.',2,'wiki',SRC.wikiOneShot);
edge(trevor.id,shot,'appearance','Central One-Shot character','Trevor is interviewed by Ten Rings operative Jackson Norriss, connecting the two Iron Man 3 depictions.',1,'wiki',SRC.wikiOneShot);
edge(trevor.id,'Iron Man 3','appearance','Actor playing the Mandarin','Trevor is exposed as a performer in Killian’s operation.',2,'wiki',SRC.wikiOneShot);
edge(trevor.id,'Shang-Chi and the Legend of the Ten Rings','appearance','Trevor returns','Trevor appears in Shang-Chi as Wenwu’s long-term captive, bridging the 2013 and 2021 films.',1,'wiki',SRC.wikiOneShot);
edge(shot,'Iron Man 3','continuation','Direct Trevor Slattery epilogue','All Hail the King follows the imprisonment of Iron Man 3’s fake Mandarin.',0,'wiki',SRC.wikiOneShot);
edge(shot,'Shang-Chi and the Legend of the Ten Rings','continuation','The real Mandarin bridge','The One-Shot reveals an active Ten Rings group beyond Trevor’s performance and foreshadows its actual leader.',0,'wiki',SRC.wikiOneShot);
edge('Iron Man','Shang-Chi and the Legend of the Ten Rings','reference','13-year Ten Rings payoff','The 2008 kidnappers are part of the organization whose founder and mystical weapons become central to Shang-Chi (2021). That is a concrete long-running franchise connection.',0,'wiki',SRC.wikiTen);
edge('Iron Man 3','Shang-Chi and the Legend of the Ten Rings','reference','The Mandarin mythology explained','Shang-Chi reveals the real Wenwu and reconnects Trevor Slattery’s staged Mandarin from Iron Man 3.',1,'wiki',SRC.wikiTen);
edge('Ant-Man','Shang-Chi and the Legend of the Ten Rings','reference','Background Ten Rings operative','An operative of the organization seen in Ant-Man’s Yellowjacket sale links the hidden network to its Shang-Chi portrayal.',1,'wiki',SRC.wikiTen);
edge(weapons.id,'Shang-Chi and the Legend of the Ten Rings','artifact','Namesake weapons finally shown','These mystical wrist-rings take center stage in the 2021 film. The 2008 Iron Man terrorists do not visibly use Wenwu’s weapons.',0,'wiki',SRC.wikiWeapons);
edge(weapons.id,beacon.id,'story','The mysterious signal','The film’s mid-credits discussion notes the artifacts send a signal of unknown destination.',3,'wiki',SRC.wikiWeapons);
edge(beacon.id,'Shang-Chi and the Legend of the Ten Rings','story','Mid-credits mystery','Wong, Bruce Banner, and Carol Danvers examine the rings and learn they emit a signal. The on-screen recipient has not been confirmed.',3,'wiki',SRC.wikiWeapons);
edge(beacon.id,'doomsday','theme','Unresolved, NOT confirmed Doomsday setup','Fans may connect the unexplained beacon to later multiverse plots, but the cited film material does not establish Doctor Doom as its source or target.',2,'interpretation');
for(const [ch,actorName,films] of [[wenwu.id,'Tony Leung',['Shang-Chi and the Legend of the Ten Rings']],[xialing.id,'Meng’er Zhang',['Shang-Chi and the Legend of the Ten Rings']],[trevor.id,'Ben Kingsley',['Iron Man 3',shot,'Shang-Chi and the Legend of the Ten Rings','Wonder Man']],[killian.id,'Guy Pearce',['Iron Man 3']],[raza.id,'Faran Tahir',['Iron Man']]]){
 const actorId='cast-'+actorName.toLowerCase().replace(/[^a-z0-9]+/g,'-');const a=person(actorId.substring(5),actorName);
 edge(a.id,ch,'portrayal','Screen portrayal',actorName+' portrays '+by.get(ch).label+' in the MCU.',0,'wiki',SRC.wikiTen);
 connectList(ch,films,'appearance','Character returns',p=>by.get(ch).label+' appears in '+by.get(resolve(p)).label+'.',1,'wiki',SRC.wikiTen);
}
Object.assign(by.get('ironman'),{keywords:['Ten Rings organization','Raza','Xu Wenwu','Obadiah Stane','Yinsen','Tony Stark kidnapped','Arc Reactor'],sources:[SRC.wikiTen]});
Object.assign(by.get(resolve('Shang-Chi and the Legend of the Ten Rings')),{keywords:['Ten Rings organization','Ten Rings weapons','Mandarin','Wenwu','Xialing','Trevor Slattery','beacon'],sources:[SRC.wikiTen,SRC.wikiWeapons]});
// ━━━━━━━━━━━━━ 3. FANTASTIC FOUR: THREE DIFFERENT JOHNNYS / ACTOR CALLBACK ━━━━━━━━━━━━━
const torch2005=character('johnny-2005','Johnny Storm / Human Torch (2005 continuity)','fox','Chris Evans’ Human Torch from the 2005 Fantastic Four films. The Void cameo in Deadpool & Wolverine is associated with this Fox-era screen iteration, not Joseph Quinn’s 2025 version.');
const torch2015=character('johnny-2015','Johnny Storm / Human Torch (2015 continuity)','fox','Michael B. Jordan’s character from the 2015 reboot. Another separate adaptation.');
const rdjr=actorsToRole['rdj'].actor;
const f2005=resolve('Fantastic Four (2005)'),rise=resolve('Fantastic Four: Rise of the Silver Surfer'),f2025=resolve('The Fantastic Four: First Steps');
const f2015=resolve('Fantastic Four (2015)');
edge(torch2005.id,'evans','portrayal','Chris Evans as Johnny Storm','Chris Evans played Johnny Storm in the Fox Fantastic Four duology, years before his Marvel Studios role as Steve Rogers.',0,'wiki',SRC.wikiEvans);
edge(torch2005.id,f2005,'appearance','The original live-action Torch','The 2005 film introduces Chris Evans as Johnny Storm alongside that adaptation’s Fantastic Four.',0,'wiki',SRC.wikiEvans);
edge(torch2005.id,rise,'appearance','2007 sequel','Chris Evans returns as the same Fox-era Human Torch in Rise of the Silver Surfer.',0,'wiki',SRC.wikiEvans);
edge(torch2005.id,'dpw','cameo','The Void brings back Johnny Storm','Chris Evans reprises Johnny Storm in Deadpool & Wolverine. A shock because MCU viewers associate Evans with Captain America.',3,'wiki',SRC.wikiDpw);
edge('dpw',f2005,'crossover','Human Torch (Chris Evans) returns','Deadpool & Wolverine includes Chris Evans’ Johnny Storm from the 2000s Fantastic Four film lineage in the Void. The cameo connects Fox’s First Family to this multiversal film.',3,'wiki',SRC.wikiDpw);
edge('dpw',rise,'crossover','Human Torch’s Fox sequel lineage','The Void-era Johnny Storm played by Chris Evans is associated with the Human Torch he portrayed in Fantastic Four (2005) and its 2007 sequel; this is not the Joseph Quinn continuity.',3,'wiki',SRC.wikiEvans);
edge('evans','dpw','cast','Surprise Human Torch casting','Chris Evans returns to the Human Torch role rather than simply appearing as Steve Rogers; this is a production / character reveal.',3,'wiki',SRC.wikiDpw);
edge('evans',f2005,'cast','Fox-era Human Torch performance','Chris Evans played Johnny Storm in 2005, then Steve Rogers in the MCU and Johnny again in Deadpool & Wolverine.',0,'wiki',SRC.wikiEvans);
edge('evans',rise,'cast','Fox-era sequel','Evans returns as Johnny Storm in the 2007 Fantastic Four sequel.',0,'wiki',SRC.wikiEvans);
edge('evans','steve','portrayal','Also plays Steve Rogers','The same actor plays Steve Rogers (Marvel Studios) and Johnny Storm (Fox-era films), but these are different characters.',0,'wiki',SRC.wikiEvans);
edge(torch2005.id,'role-johnny-2025','alternate','Same comic hero, different screen versions','Chris Evans’ Fox-era Johnny and Joseph Quinn’s MCU Fantastic Four Johnny are distinct onscreen interpretations, not an automatically identical person.',0,'official',SRC.four);
edge(torch2015.id,f2015,'appearance','2015 reboot incarnation','Michael B. Jordan portrays Johnny in the 2015 Fantastic Four reboot; separate from both Chris Evans and Joseph Quinn.',0,'editorial');
edge(torch2015.id,'role-johnny-2025','alternate','Separate reboot','The 2015 and 2025 Johnny Storm versions have different actors and do not share an established narrative history.',0,'editorial');
const jordan=person('michael-b-jordan','Michael B. Jordan');edge(jordan.id,torch2015.id,'portrayal','Johnny Storm in the 2015 reboot','Michael B. Jordan portrays Johnny Storm in Fantastic Four (2015), and separately plays Erik Killmonger in Black Panther.',0,'editorial');
const killmonger=character('killmonger','Erik Killmonger','mcu');edge(jordan.id,killmonger.id,'portrayal','Same actor, different Marvel hero and villain','Michael B. Jordan portrays Erik Killmonger in the MCU and Johnny Storm in a distinct Fantastic Four film.',0,'editorial');
edge(killmonger.id,'Black Panther','appearance','Killmonger challenges T’Challa','Erik Killmonger is a major antagonist in the first Black Panther film.',1,'editorial');
edge(killmonger.id,'Black Panther: Wakanda Forever','appearance','Killmonger reappears','Killmonger appears in Wakanda Forever during Shuri’s Ancestral Plane experience.',3,'editorial');
// The older Blade, Daredevil and Elektra films are distinct screen projects, not
// subplots of Charlie Cox's Netflix series or the planned Blade reboot.
project('Blade (1998)','fox',1998,'released','Wesley Snipes plays the vampire hunter who later reappears in Deadpool & Wolverine.');
project('Blade II','fox',2002,'released','The second Wesley Snipes Blade film.');
project('Blade: Trinity','fox',2004,'released','The third Wesley Snipes Blade film.');
project('Daredevil (2003)','fox',2003,'released','Ben Affleck portrays Matt Murdock in a separate continuity from the Netflix Daredevil.');
project('Elektra','fox',2005,'released','Jennifer Garner reprises Elektra in a spin-off of the 2003 Daredevil continuity.');
edge('Blade (1998)','Blade II','continuation','Blade sequel','Wesley Snipes reprises his vampire-hunting character in the direct sequel.',0,'wiki',SRC.wikiDpw);
edge('Blade II','Blade: Trinity','continuation','Blade trilogy concludes','The third film follows Wesley Snipes’ Blade series, revisited by the 2024 cameo.',0,'wiki',SRC.wikiDpw);
edge('Daredevil (2003)','Elektra','continuation','Garner’s Elektra spin-off','Jennifer Garner returns as Elektra in the 2005 spin-off after her role in Daredevil (2003).',0,'wiki',SRC.wikiDpw);
edge('Daredevil (2003)','Daredevil','alternate','Two Matt Murdock continuities','Ben Affleck’s 2003 Daredevil and Charlie Cox’s Netflix/Marvel Studios Daredevil are different screen continuities.',0,'editorial');
const stewart838=character('professor-x-838','Charles Xavier / Professor X (Earth-838)','mcu','Patrick Stewart portrays a Professor X variant in the Illuminati of Earth-838; do not assume this is the Fox timeline’s same individual.');
edge(stewart838.id,'Doctor Strange in the Multiverse of Madness','appearance','Earth-838 Illuminati','Professor X appears as a member of the Illuminati in the alternate Earth-838 reality.',3,'editorial');
edge(stewart838.id,'role-xavier-fox','alternate','Shared performer, separate reality','Stewart portrays multiple Professor X incarnations, but the Earth-838 Illuminati member must not automatically be identified as the Fox-film Xavier.',2,'editorial');
edge(stewart838.id,actorsToRole['patrick-stewart'].actor,'portrayal','Patrick Stewart returns as Professor X','Patrick Stewart plays the Earth-838 incarnation in Multiverse of Madness, separately from his earlier Fox timeline work.',2,'editorial');
const voidLoc=entity('the-void','place','The Void (TVA wasteland)','x','A realm used to prune discarded timelines and populated by displaced people and entities; appears in Loki and Deadpool & Wolverine.',{sources:[SRC.wikiDPW]});
const tva=entity('time-variance-authority','organization','Time Variance Authority (TVA)','mcu','The institution associated with temporal pruning in Loki and Deadpool & Wolverine.');
edge('dpw',voidLoc.id,'place','The Void team-up','Deadpool and a Wolverine variant meet legacy Marvel characters in the TVA’s wasteland.',2,'wiki',SRC.wikiDPW);
edge('loki',voidLoc.id,'place','Pruned timelines','The Void is introduced in Loki and later provides the setting for legacy-character cameos in Deadpool & Wolverine.',2,'wiki',SRC.wikiDPW);
edge(tva.id,'loki','appearance','TVA introduced','Loki explores the TVA’s management of variant timelines.',0,'editorial');
edge(tva.id,'dpw','appearance','TVA reaches Deadpool’s universe','TVA personnel attempt to redirect Wade Wilson into a new multiversal situation.',1,'wiki',SRC.wikiDPW);
edge(tva.id,voidLoc.id,'place','Place where timelines are pruned','The Void is associated with the TVA’s process of pruning timelines and variants.',1,'wiki',SRC.wikiDPW);
for(const [id,name,actorName,films,special] of [
 ['blade-snipes','Blade / Eric Brooks (Wesley Snipes)','Wesley Snipes',['Blade (1998)','Blade II','Blade: Trinity'],'Reprises the pre-MCU Blade films’ vampire hunter.'],
 ['elektra-garner','Elektra Natchios (Jennifer Garner)','Jennifer Garner',['Daredevil (2003)','Elektra'],'Returns from the 2003 Daredevil / 2005 Elektra film continuity; not the Charlie Cox Daredevil timeline.'],
 ['x23-laura','Laura / X-23','Dafne Keen',['Logan'],'Laura from Logan joins the Void-era legacy group.'],
 ['gambit-void','Gambit / Remy LeBeau','Channing Tatum',[],'The live-action version portrayed by Channing Tatum debuts in Deadpool & Wolverine.'],
 ['pyro-fox','Pyro / John Allerdyce','Aaron Stanford',['X2','X-Men: The Last Stand'],'A villain from the Fox X-Men films returns in the Void.'],
 ['sabretooth-fox','Sabretooth / Victor Creed','Tyler Mane',['X-Men'],'Tyler Mane reprises his Sabretooth characterization from the original X-Men.'],
 ['cassandra-nova','Cassandra Nova','Emma Corrin',[],'The Void antagonist from Deadpool & Wolverine; narratively associated with Professor X.'],
 ['happy-hogan','Happy Hogan','Jon Favreau',['Iron Man','Iron Man 2','Iron Man 3','Spider-Man: Homecoming'],'Happy connects Wade Wilson’s job interview to the wider MCU.']
]){
 const c=character(id,name,id==='gambit-void'?'x':'fox',special),a=person(actorName.toLowerCase().replace(/[^a-z0-9]+/g,'-'),actorName);
 edge(c.id,'dpw','cameo','Legacy character in the Void',special,2,'wiki',SRC.wikiDpw);
 edge(a.id,c.id,'portrayal','Played by '+actorName,actorName+' portrays this incarnation in Deadpool & Wolverine.',0,'wiki',SRC.wikiDpw);
 connectList(c.id,films,'appearance','Original screen lineage',p=>name+' is connected to '+p+' in the earlier cinematic continuity.',0,'wiki',SRC.wikiDpw);
 edge(c.id,voidLoc.id,'place','Crosses the Void',name+' appears in the Void / TVA-related Deadpool & Wolverine narrative.',2,'wiki',SRC.wikiDPW);
}
for(const [p,detail] of [
 ['Blade (1998)','Wesley Snipes returns as Blade in the Void; this is not proof that the MCU’s announced Blade reboot shares the same continuity.'],
 ['Blade II','Wesley Snipes’ Blade trilogy is referenced by his Deadpool & Wolverine reprisal.'],
 ['Blade: Trinity','The original Snipes Blade trilogy’s cinematic history is revisited in the 2024 multiverse film.'],
 ['Daredevil (2003)','Jennifer Garner’s Elektra returns; this is a different screen lineage from Charlie Cox’s Matt Murdock.'],
 ['Elektra','Jennifer Garner reprises the role from the 2005 Elektra movie.'],
 ['Logan','Dafne Keen’s Laura/X-23 returns; the Wolverine headlining Deadpool & Wolverine is a variant, not simply undoing Logan’s ending.'],
 ['X-Men','Tyler Mane’s Sabretooth reappears in Deadpool & Wolverine.'],
 ['X2','Aaron Stanford’s Pyro returns from the Fox X-Men movies.']
])if(exists(resolve(p)))edge('dpw',p,'crossover','Legacy cameo / Fox film bridge',detail,2,'wiki',SRC.wikiDpw);
edge('role-gambit-void','role-gambit-dpw','identity','Same Gambit role represented in two trails','Both nodes describe Channing Tatum’s Remy LeBeau; this explicit identity relation prevents mistaken duplicate characters.',0,'wiki',SRC.wikiDpw);
edge('role-x23-laura','wolverine','family','Laura and Logan','The Laura incarnation is connected to Logan’s story. Her appearance in the Void does not make the Deadpool film’s Wolverine identical to the Logan film’s older Wolverine.',2,'wiki',SRC.wikiDPW);
edge('role-cassandra-nova','role-xavier-fox','family','Cassanda Nova and Xavier','The antagonist is linked to the mythology of Charles Xavier, without asserting she shares every Fox Professor X timeline.',2,'wiki',SRC.wikiDPW);
edge('dpw','ff','alternate','Two Fantastic Four strands — not one team','Chris Evans’ 2005-era Johnny Storm appears in Deadpool & Wolverine; Joseph Quinn’s 2025 Fantastic Four exists as a different adaptation. This is an adaptation/actor bridge, not a team encounter.',3,'editorial');
// ━━━━━━━━━━━━━ 4. MORE SCREEN HISTORY: RELATIONSHIPS BEYOND A FILM CHAIN ━━━━━━━━━━━━━
// Connections below are conservative character, prop, team, story, or post-credit links;
// avoid asserting an intentional dialogue quote unless primary material backs it up.
function storyline(entityId,type,label,description,films,sp=1,source='editorial',url){
 entity(entityId,type,label,'mcu',description);
 for(const [p,reason]of films)if(exists(resolve(p)))edge(entityId,p,'story',label+' in '+p,reason,sp,source,url);
}
storyline('sokovia-accords','event','Sokovia Accords','A legal framework responding to Avengers-caused collateral damage, important across several MCU stories.',[
 ['Avengers: Age of Ultron','Sokovia’s devastation supplies context for later superhero oversight.'],
 ['Captain America: Civil War','The Accords trigger the central ideological conflict between Steve and Tony.'],
 ['Black Widow','Natasha is pursued following the Civil War-era rupture.'],
 ['The Falcon and the Winter Soldier','Post-Blip institutional treatment of super-soldiers and heroes continues the debate about oversight.']],1);
storyline('project-insight','event','Project Insight','HYDRA’s plan to use helicarriers to preemptively eliminate targets.',[
 ['Captain America: The Winter Soldier','The HYDRA operation is uncovered and dismantled.'],
 ['Agents of S.H.I.E.L.D.','The television show responds to HYDRA’s infiltration of S.H.I.E.L.D.']],2);
storyline('quantum-realm','place','Quantum Realm','Subatomic environment involved in the Ant-Man films and in the Avengers time heist.',[
 ['Ant-Man','Scott’s shrinking brings him into the Quantum Realm.'],
 ['Ant-Man and the Wasp','Janet van Dyne and a quantum rescue expand the realm’s role.'],
 ['Avengers: Endgame','Avengers use quantum travel and Pym particles in their time-heist plan.'],
 ['Ant-Man and the Wasp: Quantumania','The team enters the realm and confronts Kang.']],1);
storyline('vibranium','artifact','Vibranium','Wakandan extraterrestrial metal connecting Wakanda, Captain America’s shield and Ultron’s pursuit of a synthetic body.',[
 ['Captain America: The First Avenger','Howard Stark supplies Steve Rogers with a vibranium shield.'],
 ['Avengers: Age of Ultron','Ultron seeks vibranium, and the material helps shape Vision’s origin.'],
 ['Black Panther','Wakanda’s technology and economy draw on vibranium.'],
 ['Black Panther: Wakanda Forever','The pursuit and protection of vibranium shape the conflict.']],1);
storyline('heart-shaped-herb','artifact','Heart-shaped herb','Wakandan plant that transfers the mantle of the Black Panther.',[
 ['Black Panther','T’Challa undergoes the ritual and meets ancestors.'],
 ['Black Panther: Wakanda Forever','Shuri restores the herb through her scientific work.']],2);
storyline('dark-dimension','place','Dark Dimension','Mystical realm associated with Dormammu and threats confronted by Doctor Strange.',[
 ['Doctor Strange','Strange negotiates with Dormammu through repeated temporal loops.'],
 ['Doctor Strange in the Multiverse of Madness','Strange and Clea’s later appearance connects multiversal magic and the Dark Dimension, but plot details are spoiler gated.']],2);
storyline('sacred-timeline','event','Sacred Timeline / branching reality','TVA terminology distinguishing pruned branches from alternate realities.',[
 ['Loki','The TVA’s narrative of the Sacred Timeline is questioned across the series.'],
 ['Avengers: Endgame','Time travel creates a branching Loki variant followed in Loki.'],
 ['Deadpool & Wolverine','The TVA’s management of timelines reaches a Fox-associated character world.']],2);
storyline('blip-aftermath','event','The Blip aftermath','The social and personal consequences of the five-year disappearance and return.',[
 ['Avengers: Infinity War','Thanos eliminates half of living beings in the Snap.'],
 ['Avengers: Endgame','The snap is reversed, creating the Blip return.'],
 ['The Falcon and the Winter Soldier','The Flag Smashers’ political circumstances arise from the Blip.'],
 ['Spider-Man: Far From Home','Peter returns after the Blip and resumes ordinary teenage life.'],
 ['WandaVision','Monica Rambeau returns from the Blip and discovers her mother is gone.'],
 ['Hawkeye','Clint’s family losses and recovery are part of the post-Blip story.']],2);
storyline('infinity-gauntlet','artifact','Infinity Gauntlet','Object used to wield six Infinity Stones; representations in earlier films need continuity distinctions.',[
 ['Thor','A gauntlet prop appears in Odin’s vault; Ragnarok later clarifies it is a fake.'],
 ['Avengers: Age of Ultron','Thanos retrieves a gauntlet in a post-credit scene.'],
 ['Avengers: Infinity War','Thanos uses the gauntlet to execute the Snap.'],
 ['Avengers: Endgame','Stark builds a separate gauntlet for the Stones.']],2);
storyline('sling-ring','artifact','Sling Ring','Mystic Arts tool used to open portals, prominently connecting Strange to the Avengers crossover.',[
 ['Doctor Strange','Sorcerers learn to form portals using the rings.'],
 ['Avengers: Infinity War','Strange’s magic supports travel and interplanetary encounters.'],
 ['Avengers: Endgame','Portal arrivals gather the returned heroes for the final battle.'],
 ['Spider-Man: No Way Home','Ned creates portals while using a sling ring.']],1);
storyline('pym-particles','artifact','Pym particles','Size-changing technology connecting Ant-Man and the quantum time-heist.',[
 ['Ant-Man','Hank Pym recruits Scott Lang to use his size-changing technology.'],
 ['Captain America: Civil War','Scott uses size-changing technology in the airport fight.'],
 ['Ant-Man and the Wasp','Continued experiments enable the quantum rescue.'],
 ['Avengers: Endgame','Pym particle supply is crucial to the time heist.']],1);
storyline('super-soldier-serum','artifact','Super Soldier Serum','Enhancement formula with different versions and consequences across eras.',[
 ['Captain America: The First Avenger','Erskine’s serum transforms Steve Rogers.'],
 ['The Incredible Hulk','Banner’s experiment is a different gamma-related attempt associated with the super-soldier legacy.'],
 ['Captain America: The Winter Soldier','Bucky’s HYDRA enhancement relates to the super-soldier program.'],
 ['Captain America: Civil War','The Winter Soldier program and Zemo’s hunt of supersoldiers recur.'],
 ['The Falcon and the Winter Soldier','Zemo, John Walker, Isaiah Bradley and the Flag Smashers revisit the legacy.'],
 ['Black Widow','Red Guardian’s serum-enhanced capabilities feature in his backstory.']],2);
storyline('ta-lo','place','Ta Lo','Mystical realm protected by the Great Protector and central to Shang-Chi.',[
 ['Shang-Chi and the Legend of the Ten Rings','Wenwu tries to breach Ta Lo to rescue the voice he believes to be his wife.'],
 ['What If...?','Different versions of mythical figures and mystical worlds can be explored without asserting it is the same timeline.']],1);
const teams=[
 ['new-avengers','New Avengers / Thunderbolts*','Thunderbolts*','A group composed of Yelena, Bucky, U.S. Agent, Red Guardian, Ghost and Bob Reynolds, later framed as the New Avengers.'],
 ['fantastic-four-2025','Fantastic Four (2025 team)','The Fantastic Four: First Steps','The Reed/Sue/Johnny/Ben team from a separate retro-futuristic reality.'],
 ['fox-x-men-team','X-Men (Fox cinematic team)','X-Men','The Fox live-action mutant ensemble whose performers recur in Doomsday.'],
 ['defenders-team','The Defenders','The Defenders','Street-level heroes whose stories cross through New York.'],
 ['guardians-team','Guardians of the Galaxy','Guardians of the Galaxy','A shifting band of cosmic misfits whose adventures intersect the Avengers.']
];
for(const [id,name,p,desc] of teams){entity(id,'organization',name,resolve(p)==='xmen'?'fox':'mcu',desc);edge(id,p,'appearance','Team introduced',desc,0,'editorial')}
for(const c of ['role-yelena-belova','role-bucky-barnes','role-john-walker','role-red-guardian','role-ghost','role-bob-sentry'])edge(c,'new-avengers','character','New Avengers ensemble',by.get(c).label+' is a member of the Thunderbolts*/New Avengers constellation.',1,'editorial');
for(const c of ['role-reed-2025','role-sue-2025','role-johnny-2025','role-ben-2025'])edge(c,'fantastic-four-2025','character','The 2025 Fantastic Four',by.get(c).label+' is part of the 2025 First Family team, distinct from Fox’s 2005 and 2015 adaptations.',0,'official',SRC.four);
for(const c of ['role-xavier-fox','role-magneto-fox','role-beast-fox','role-mystique-fox','role-cyclops-fox','role-nightcrawler-fox'])edge(c,'fox-x-men-team','character','Fox X-Men lineage',by.get(c).label+' is associated with the returning Fox-era X-Men cast.',0,'wiki',SRC.wikiDoom);
for(const [a,b,title,description] of [
 ['new-avengers','doomsday','The New Avengers appear','Multiple actors from the Thunderbolts*/New Avengers team are among the announced Doomsday ensemble.'],
 ['fantastic-four-2025','doomsday','The First Family joins Doomsday','Marvel officially confirms all four First Steps actors will return for Doomsday.'],
 ['fox-x-men-team','doomsday','Classic Fox cast returns','Original X-Men performers including Stewart, McKellen, Romijn, Marsden and Cumming join the announced cast.'],
 ['new-avengers','role-sam-wilson','Different hero groupings','Sam Wilson and the Thunderbolts/New Avengers have related franchise histories; specific Doomsday relationships remain unknown.']
])edge(a,b,'character',title,description,0,a==='fantastic-four-2025'?'official':'wiki',a==='fantastic-four-2025'?SRC.four:SRC.wikiDoom);
// Known story-thread links between projects, each with an explicit causal/visual reason.
const plotLinks=[
 ['Captain America: The First Avenger','Captain America: The Winter Soldier','Bucky becomes the Winter Soldier','Bucky’s apparent wartime death and HYDRA’s conditioning are central to the later film.',2],
 ['Captain America: The Winter Soldier','Avengers: Age of Ultron','HYDRA’s scepter research','The HYDRA revelations and Scepter experimentation involving the Maximoff twins form setup for Age of Ultron.',2],
 ['Avengers: Age of Ultron','WandaVision','Vision and Wanda’s origins','Ultron creates Vision’s body; Wanda and Vision’s relationship grows from their Age of Ultron meeting.',1],
 ['Avengers: Infinity War','WandaVision','Vision’s loss drives Wanda','Vision’s fate supplies the emotional origin of Wanda’s Westview reality.',3],
 ['WandaVision','Agatha All Along','Westview consequences','Agatha’s own story grows directly from the spell that confines her at WandaVision’s end.',1],
 ['Avengers: Endgame','The Falcon and the Winter Soldier','Passing the shield','Steve passes his shield to Sam at the end of Endgame, triggering Sam’s hesitation and eventual acceptance.',2],
 ['The Falcon and the Winter Soldier','Captain America: Brave New World','Sam’s new mantle','Sam returns as Captain America after accepting the shield during the Disney+ series.',0],
 ['Captain America: Civil War','Black Panther','T’Challa confronts Zemo','T’Challa’s father dies during Civil War; his pursuit of Zemo influences the ethics of his standalone story.',2],
 ['Captain America: Civil War','Black Widow','Natasha after the split','Natasha faces the consequences of the Avengers’ Civil War conflict during the film’s main period.',1],
 ['Black Widow','Hawkeye','Yelena’s assignment','The Black Widow post-credit scene sets up Yelena Belova’s confrontation with Clint Barton in Hawkeye.',3],
 ['Hawkeye','Echo','Maya Lopez follows the Fisk thread','Maya is introduced in Hawkeye; Echo continues her relationship to Wilson Fisk.',1],
 ['Echo','Daredevil: Born Again','Wilson Fisk’s New York power','Kingpin’s street-level role continues into the Daredevil series; these are connected plot lines rather than identical scenes.',1],
 ['She-Hulk: Attorney at Law','Daredevil: Born Again','Matt Murdock crosses series','Charlie Cox portrays Matt Murdock in She-Hulk and again in Born Again.',1],
 ['Captain Marvel','WandaVision','Monica’s adult arc','Monica Rambeau grows from the child Carol knew to the adult S.W.O.R.D. agent in WandaVision.',1],
 ['WandaVision','The Marvels','Monica Rambeau joins the trio','Monica’s energy powers established in WandaVision are used in The Marvels.',1],
 ['Ms. Marvel','The Marvels','Kamala’s first film','Kamala Khan becomes part of the central trio after her own series.',0],
 ['Captain Marvel','Secret Invasion','Nick Fury and the Skrulls','The prior Skrull refugee storyline is background for the later invasion series.',1],
 ['The Avengers','Iron Man 3','After New York anxiety','Tony’s post-invasion trauma influences his obsession with new suits.',1],
 ['Iron Man 3','Avengers: Age of Ultron','Tony’s defense obsession','Tony’s fear and technology ambitions help contextualize Ultron’s origin.',1],
 ['Avengers: Age of Ultron','Captain America: Civil War','Sokovia and accountability','Ultron’s destruction of Sokovia becomes a central justification for the Sokovia Accords.',1],
 ['Captain America: Civil War','Spider-Man: Homecoming','Tony recruits Peter','Tony meets Peter during Civil War, making Homecoming a follow-up to their mentor relationship.',0],
 ['Avengers: Endgame','Spider-Man: Far From Home','Tony’s legacy weighs on Peter','Peter’s grief over Tony forms important context for Far From Home.',2],
 ['Spider-Man: Far From Home','Spider-Man: No Way Home','The exposed identity cliffhanger','Far From Home’s post-credits reveal drives the premise of No Way Home.',3],
 ['Spider-Man: No Way Home','Venom: The Last Dance','The symbiote remnants','Venom’s Sony-to-MCU hop and the left-behind symbiote thread complicate the otherwise separate Sony continuity.',3],
 ['Thor','The Avengers','Loki and Earth','Thor’s brother Loki becomes the invader fought in The Avengers.',1],
 ['The Avengers','Thor: The Dark World','Loki’s imprisonment','Loki returns to Asgard after the battle in New York.',1],
 ['Thor: The Dark World','Guardians of the Galaxy','Collector and an Infinity Stone','The Aether/Reality Stone is taken to the Collector, whose cosmic base appears in Guardians.',3],
 ['Guardians of the Galaxy','Avengers: Infinity War','Guardians meet Thor','The Guardians rescue Thor and their conflict intersects Thanos’s pursuit of the Infinity Stones.',1],
 ['Thor: Ragnarok','Avengers: Infinity War','Asgardian refugees attacked','Infinity War begins soon after Ragnarok’s refugee-ship ending.',2],
 ['Thor: Ragnarok','Loki','The Tesseract and Loki','Loki’s history, choices and later TVA variant are useful context for exploring the multiverse.',1],
 ['Doctor Strange','Avengers: Infinity War','Time Stone joins the hunt','Strange’s mystical artifact becomes important to Thanos’s quest.',1],
 ['Doctor Strange in the Multiverse of Madness','The Marvels','Incursion and multiversal risk','Both films explore crossings between realities; precise continuity and cause should not be inferred without further evidence.',2],
 ['Loki','Deadpool & Wolverine','TVA reappears','The TVA established in Loki plays a direct narrative role in Deadpool & Wolverine.',1],
 ['Black Panther','Avengers: Infinity War','Wakanda hosts the battle','The Avengers bring Vision to Wakanda; T’Challa and his forces defend against Thanos’s army.',1],
 ['Black Panther: Wakanda Forever','Ironheart','Riri’s technology','Riri Williams is introduced in Wakanda Forever and receives her own series.',1],
 ['Shang-Chi and the Legend of the Ten Rings','She-Hulk: Attorney at Law','Abomination and Wong','Wong and Emil Blonsky appear across these projects; Shang-Chi’s fight-club appearance precedes She-Hulk.',1],
 ['The Incredible Hulk','Shang-Chi and the Legend of the Ten Rings','Abomination returns','Emil Blonsky / Abomination first appears in The Incredible Hulk and later fights Wong in a clandestine club.',1],
 ['The Incredible Hulk','She-Hulk: Attorney at Law','Banner and Blonsky return','Jennifer Walters is related to Bruce Banner and becomes counsel for his former enemy Emil Blonsky.',1],
 ['Ant-Man and the Wasp','Avengers: Endgame','Quantum Realm rescue plans','Scott is trapped when the Snap strikes; his return inspires the time-heist plan.',2],
 ['Ant-Man and the Wasp: Quantumania','Loki','Kang / He Who Remains variants','The films and series use related temporal-variant mythology, without equating every variant.',1],
 ['Eternals','Captain America: Brave New World','Celestial consequences','The emergence of Tiamut in Eternals later affects international competition over the new landmass.',1],
 ['What If...?','Marvel Zombies','Animated zombie continuity','Marvel Zombies develops the undead alternate-reality premise seen in What If...?',1],
 ['X-Men: Days of Future Past','Logan','Timeline interpretation debated','Logan’s precise place relative to the altered Days of Future Past timeline is not settled by simple release-order links.',3]
];
for(const [a,b,title,detail,sp]of plotLinks)if(exists(resolve(a))&&exists(resolve(b)))edge(a,b,'continuation',title,detail,sp,'editorial');
// ━━━━━━━━━━━━━ 5. SEQUEL / TEAM / MULTIVERSE OBJECTS AND RELATIONS ━━━━━━━━━━━━━
const extraCharacters=[
 ['pepper-potts','Pepper Potts','Gwyneth Paltrow',['Iron Man','Iron Man 2','Iron Man 3','Avengers: Endgame']],
 ['james-rhodes','James Rhodes / War Machine','Don Cheadle',['Iron Man 2','Iron Man 3','Avengers: Age of Ultron','Captain America: Civil War','Avengers: Infinity War','Avengers: Endgame','Secret Invasion']],
 ['nick-fury','Nick Fury','Samuel L. Jackson',['Iron Man','The Avengers','Captain America: The Winter Soldier','Captain Marvel','Spider-Man: Far From Home','Secret Invasion','The Marvels']],
 ['phil-coulson','Phil Coulson','Clark Gregg',['Iron Man','Iron Man 2','Thor','The Avengers','Agents of S.H.I.E.L.D.']],
 ['ho-yinsen','Ho Yinsen','Shaun Toub',['Iron Man','Iron Man 3']],
 ['obadiah-stane','Obadiah Stane','Jeff Bridges',['Iron Man']],
 ['bruce-banner','Bruce Banner / Hulk','Mark Ruffalo',['The Avengers','Avengers: Age of Ultron','Thor: Ragnarok','Avengers: Infinity War','Avengers: Endgame','She-Hulk: Attorney at Law']],
 ['natasha-romanoff','Natasha Romanoff / Black Widow','Scarlett Johansson',['Iron Man 2','The Avengers','Captain America: The Winter Soldier','Avengers: Age of Ultron','Captain America: Civil War','Avengers: Infinity War','Avengers: Endgame','Black Widow']],
 ['clint-barton','Clint Barton / Hawkeye','Jeremy Renner',['Thor','The Avengers','Avengers: Age of Ultron','Captain America: Civil War','Avengers: Endgame','Hawkeye']],
 ['peter-quill','Peter Quill / Star-Lord','Chris Pratt',['Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','Avengers: Infinity War','Avengers: Endgame','The Guardians of the Galaxy Holiday Special','Guardians of the Galaxy Vol. 3']],
 ['gamora','Gamora','Zoe Saldaña',['Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','Avengers: Infinity War','Avengers: Endgame','Guardians of the Galaxy Vol. 3']],
 ['rocket','Rocket Raccoon','Bradley Cooper',['Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','Avengers: Infinity War','Avengers: Endgame','Guardians of the Galaxy Vol. 3']],
 ['groot','Groot','Vin Diesel',['Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','Avengers: Infinity War','Avengers: Endgame','Guardians of the Galaxy Vol. 3','I Am Groot']],
 ['drax','Drax the Destroyer','Dave Bautista',['Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','Avengers: Infinity War','Avengers: Endgame','Guardians of the Galaxy Vol. 3']],
 ['mantis','Mantis','Pom Klementieff',['Guardians of the Galaxy Vol. 2','Avengers: Infinity War','Avengers: Endgame','The Guardians of the Galaxy Holiday Special','Guardians of the Galaxy Vol. 3']],
 ['nebula','Nebula','Karen Gillan',['Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','Avengers: Infinity War','Avengers: Endgame','Guardians of the Galaxy Vol. 3']],
 ['yondu','Yondu Udonta','Michael Rooker',['Guardians of the Galaxy','Guardians of the Galaxy Vol. 2']],
 ['carol-danvers','Carol Danvers / Captain Marvel','Brie Larson',['Captain Marvel','Avengers: Endgame','The Marvels']],
 ['monica-rambeau','Monica Rambeau','Teyonah Parris',['WandaVision','The Marvels']],
 ['kamala-khan','Kamala Khan / Ms. Marvel','Iman Vellani',['Ms. Marvel','The Marvels']],
 ['america-chavez','America Chavez','Xochitl Gomez',['Doctor Strange in the Multiverse of Madness']],
 ['wong','Wong','Benedict Wong',['Doctor Strange','Avengers: Infinity War','Avengers: Endgame','Shang-Chi and the Legend of the Ten Rings','Spider-Man: No Way Home','Doctor Strange in the Multiverse of Madness','She-Hulk: Attorney at Law']],
 ['emil-blonsky','Emil Blonsky / Abomination','Tim Roth',['The Incredible Hulk','Shang-Chi and the Legend of the Ten Rings','She-Hulk: Attorney at Law']],
 ['jennifer-walters','Jennifer Walters / She-Hulk','Tatiana Maslany',['She-Hulk: Attorney at Law']],
 ['riri-williams','Riri Williams / Ironheart','Dominique Thorne',['Black Panther: Wakanda Forever','Ironheart']],
 ['maya-lopez','Maya Lopez / Echo','Alaqua Cox',['Hawkeye','Echo']],
 ['kate-bishop','Kate Bishop','Hailee Steinfeld',['Hawkeye']],
 ['wilson-fisk','Wilson Fisk / Kingpin','Vincent D’Onofrio',['Daredevil','Hawkeye','Echo','Daredevil: Born Again']],
 ['matt-murdock','Matt Murdock / Daredevil','Charlie Cox',['Daredevil','The Defenders','Spider-Man: No Way Home','She-Hulk: Attorney at Law','Daredevil: Born Again']],
 ['frank-castle','Frank Castle / The Punisher','Jon Bernthal',['Daredevil','The Punisher','Daredevil: Born Again']],
 ['jessica-jones','Jessica Jones','Krysten Ritter',['Jessica Jones','The Defenders']],
 ['luke-cage','Luke Cage','Mike Colter',['Luke Cage','The Defenders','Jessica Jones']],
 ['danny-rand','Danny Rand / Iron Fist','Finn Jones',['Iron Fist','The Defenders','Luke Cage']],
 ['peggy-carter','Peggy Carter','Hayley Atwell',['Captain America: The First Avenger','Agent Carter','Avengers: Endgame']],
 ['pietro-maximoff','Pietro Maximoff / Quicksilver','Aaron Taylor-Johnson',['Avengers: Age of Ultron']],
 ['tchalla','T’Challa / Black Panther','Chadwick Boseman',['Captain America: Civil War','Black Panther','Avengers: Infinity War','Avengers: Endgame']],
 ['okoye','Okoye','Danai Gurira',['Black Panther','Avengers: Infinity War','Avengers: Endgame','Black Panther: Wakanda Forever']],
 ['valentina','Valentina Allegra de Fontaine','Julia Louis-Dreyfus',['The Falcon and the Winter Soldier','Black Widow','Black Panther: Wakanda Forever','Thunderbolts*']],
 ['yelena','Yelena Belova','Florence Pugh',['Black Widow','Hawkeye','Thunderbolts*']],
 ['cassie-lang','Cassie Lang','Kathryn Newton',['Ant-Man and the Wasp: Quantumania']],
 ['janet-van-dyne','Janet van Dyne','Michelle Pfeiffer',['Ant-Man and the Wasp','Ant-Man and the Wasp: Quantumania']],
 ['hope-van-dyne','Hope van Dyne / Wasp','Evangeline Lilly',['Ant-Man','Ant-Man and the Wasp','Avengers: Endgame','Ant-Man and the Wasp: Quantumania']],
 ['kang','Kang / variant','Jonathan Majors',['Ant-Man and the Wasp: Quantumania','Loki']],
 ['cassandra-lang','Cassie Lang (younger portrayal)','Emma Fuhrmann',['Avengers: Endgame']],
 ['mysterio','Quentin Beck / Mysterio','Jake Gyllenhaal',['Spider-Man: Far From Home']],
 ['vulture','Adrian Toomes / Vulture','Michael Keaton',['Spider-Man: Homecoming','Morbius']],
 ['miles-morales','Miles Morales','Shameik Moore',['Spider-Man: Into the Spider-Verse','Spider-Man: Across the Spider-Verse']],
 ['gwen-stacy','Gwen Stacy / Spider-Woman','Hailee Steinfeld',['Spider-Man: Into the Spider-Verse','Spider-Man: Across the Spider-Verse']],
 ['miguel-ohara','Miguel O’Hara / Spider-Man 2099','Oscar Isaac',['Spider-Man: Across the Spider-Verse']],
 ['eddie-brock','Eddie Brock / Venom','Tom Hardy',['Venom','Venom: Let There Be Carnage','Venom: The Last Dance']],
 ['norman-osborn','Norman Osborn / Green Goblin','Willem Dafoe',['Spider-Man (2002)','Spider-Man: No Way Home']],
 ['otto-octavius','Otto Octavius / Doctor Octopus','Alfred Molina',['Spider-Man 2','Spider-Man: No Way Home']],
 ['flint-marko','Flint Marko / Sandman','Thomas Haden Church',['Spider-Man 3','Spider-Man: No Way Home']],
 ['max-dillon','Max Dillon / Electro','Jamie Foxx',['The Amazing Spider-Man 2','Spider-Man: No Way Home']],
 ['curt-connors','Curt Connors / Lizard','Rhys Ifans',['The Amazing Spider-Man','Spider-Man: No Way Home']]
];
for(const [id,label,act,films]of extraCharacters){
 const c=character(id,label,id.includes('miles')||id.includes('gwen')?'sv':id.includes('norman')||id.includes('otto')||id.includes('flint')?'raimi':'mcu',label+' as portrayed on screen by '+act+'.');
 const a=person(act.toLowerCase().replace(/[^a-z0-9]+/g,'-'),act);
 edge(c.id,a.id,'portrayal','Screen actor',act+' portrays '+label+' in the listed screen productions.',0,'production');
 for(const p of films)if(exists(resolve(p)))edge(c.id,p,'appearance','Character appears in '+by.get(resolve(p)).label,label+' features in '+by.get(resolve(p)).label+'. This indexed screen appearance does not assert the performer or variant is identical across every incarnation.',1,'editorial');
}
// Explicit connections between character concepts, matched without auto-claiming continuity.
for(const [a,b,cat,heading,detail,sp]of [
 ['role-bruce-banner','role-jennifer-walters','family','Cousins','Bruce and Jennifer are cousins, and Bruce’s blood is involved in Jennifer’s transformation.',1],
 ['role-clint-barton','role-kate-bishop','character','Hawkeye legacy','Kate trains with Clint and eventually takes up the Hawkeye role.',1],
 ['role-natasha-romanoff','role-yelena-belova','family','Sister figures','Natasha and Yelena grew up together under the Red Room’s arranged family cover.',1],
 ['role-tchalla','role-shuri','family','Wakandan siblings','Shuri and T’Challa are siblings; Shuri later assumes the mantle of Black Panther.',2],
 ['role-tchalla','role-namor','character','Wakandan succession vs Talokan','T’Challa’s era precedes the conflict involving Shuri and Namor; it does not claim they met.',1],
 ['role-peter-quill','role-gamora','family','Guardians bond','Peter and Gamora form a relationship, complicated by the time-displaced Gamora encountered after Endgame.',2],
 ['role-rocket','role-groot','character','Guardians bond','Rocket and Groot share a relationship that is explored through Guardians films.',1],
 ['role-peter-quill','role-yondu','family','Found family','Yondu raised Peter in the Ravagers and becomes a father figure.',2],
 ['role-wilson-fisk','role-maya-lopez','family','Crime-family relationship','Maya’s history with Wilson Fisk is the connective tissue between Hawkeye and Echo.',1],
 ['role-wilson-fisk','role-matt-murdock','character','Hell’s Kitchen rivalry','Daredevil and Kingpin are long-standing enemies, central to the Netflix series and Born Again.',1],
 ['role-cassie-lang','role-scott-lang','family','Scott and Cassie','Scott’s relationship with his daughter drives the emotional dimension of the Ant-Man films.',0],
 ['role-sam-wilson','role-steve-rogers','identity','Captain America passes on','Steve entrusts the shield to Sam, who must decide what inheriting the mantle means.',2],
 ['role-xavier-fox','role-magneto-fox','character','Professor X vs Magneto','The ideological rivalry between the school’s founder and Magneto drives the Fox X-Men films.',1],
 ['role-sue-2025','role-johnny-2025','family','Storm siblings','Sue and Johnny are siblings in the 2025 Fantastic Four.',0],
 ['role-reed-2025','role-sue-2025','family','Reed and Sue','Reed and Sue are married in First Steps.',0],
 ['role-reed-2025','role-ben-2025','character','The team’s old friendship','Ben is Reed’s longtime friend in the First Family.',0],
 ['role-shang-chi','role-wenwu','family','Shang-Chi and Wenwu','Father and son; their opposing use of the Ten Rings drives the film.',1]
])if(exists(a)&&exists(b))edge(a,b,cat,heading,detail,sp,'editorial');
// Cross-universe / legacy role reuse: distinct versions of similarly named hero.
for(const [a,b,title,detail]of [
 ['role-johnny-2005','role-johnny-2025','Different Human Torches','Chris Evans and Joseph Quinn portray separate Johnny Storm interpretations.'],
 ['role-johnny-2015','role-johnny-2005','Different Fox reboots','The 2005 and 2015 Johnny Storm films are separate adaptations.'],
 ['role-wilson-fisk','kingpin','Wilson Fisk identity','Seed and enriched Fisk nodes represent the same screen character concept; canonical status is treated separately by source.'],
 ['role-matt-murdock','daredevil','Matt Murdock identity','The seed Daredevil entry and this enriched version refer to the same Charlie Cox character.'],
 ['role-miles-morales','miles','Miles Morales identity','The original Miles entry and the expanded animated Miles entry are the same character concept.'],
 ['role-natasha-romanoff','role-yelena','Red Room family','The two characters were raised as sisters within an arranged family cover.']
])if(exists(a)&&exists(b))edge(a,b,'identity',title,detail,1,'editorial');
// 10+ curated browse trails. Each is a true series of relationship steps, not a global index.
D.trails=[
 {name:'Doomsday: confirmed ensemble',icon:'✶',from:'doomsday',description:'Official cast → who they play → the films that introduced them',path:['doomsday','role-doctor-doom','rdj','tony','ironman']},
 {name:'Ten Rings, 2008 → 2021',icon:'◎',from:'ten-rings-organization',description:'Iron Man → Wenwu → Shang-Chi → hidden One-Shot',path:['ironman','ten-rings-organization','role-wenwu','ten-rings-weapons','role-shang-chi']},
 {name:'Chris Evans, two heroes',icon:'◈',from:'role-johnny-2005',description:'Fantastic Four → Deadpool → Cap → Doomsday',path:['ff05','role-johnny-2005','evans','steve','doomsday']},
 {name:'The Fox-to-MCU bridge',icon:'⧉',from:'dpw',description:'Legacy cameos, Deadpool, X-Men and TVA',path:['xmen','dpw','the-void','loki','doomsday']},
 {name:'Wanda, Agatha and Vision',icon:'☾',from:'agatha-all-along',description:'An official three-series television trilogy',path:['wandav','agatha-all-along','visionquest']},
 {name:'The Stark legacy',icon:'◆',from:'ironman',description:'From Afghanistan to the Endgame sacrifice',path:['ironman','avengers','infwar','endgame']}
];
D.importantSources=[
 {name:'Marvel Studios: Doomsday film and cast',url:SRC.doomsday},
 {name:'Associated Press: 2025 announced cast',url:SRC.cast},
 {name:'Reuters: Chris Evans returns as Steve Rogers (2026)',url:SRC.evans},
 {name:'Marvel: First Steps and Doomsday continuity',url:SRC.four},
 {name:'MCU Wiki: Ten Rings organization',url:SRC.wikiTen},
 {name:'MCU Wiki: Ten Rings weapons',url:SRC.wikiWeapons},
 {name:'MCU Wiki: Deadpool & Wolverine credits',url:SRC.wikiDpw},
 {name:'MCU Wiki: All Hail the King',url:SRC.wikiOneShot}
];
D.sources=[...(D.sources||[]),...D.importantSources];
D.researchGenerated='2026-10-02';
D.stats={...D.stats,researchedExpansion:edges.filter(e=>e.source==='Marvel official'||e.source==='MCU Wiki · community compiled'||e.source==='Reported / not officially announced').length};
delete D.__LORE_KEYS;
})();
