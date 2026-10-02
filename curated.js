/* Editorial enrichment. Every relation below has its own meaning; grouping links are not canon claims. */
(function(){
'use strict';
const D=window.MARVEL_DATA, nodes=D.nodes, edges=D.edges,by=new Map(nodes.map(n=>[n.id,n])), aliases=D.aliases;
const SOURCES={
 agatha:'https://www.marvel.com/tv-shows/agatha-all-along/1',
 vision:'https://www.marvel.com/articles/tv-shows/marvel-television-visionquest-release-date',
 marvelTV:'https://www.marvel.com/tv-shows/',
 dd:'https://www.marvel.com/tv-shows/daredevil-born-again/1',
 spider:'https://www.marvel.com/characters/spider-man-peter-parker',
 marvelHome:'https://www.marvel.com/'
};
D.sources=[{name:'Marvel • Agatha All Along series page',url:SOURCES.agatha},{name:'Marvel • VisionQuest announcement (May 12, 2026)',url:SOURCES.vision},{name:'Marvel • TV and animation catalogue',url:SOURCES.marvelTV},{name:'Marvel • Daredevil: Born Again',url:SOURCES.dd},{name:'Marvel • Spider-Man screen profile',url:SOURCES.spider}];
const pid=s=>aliases[s]||s;
function add(id,type,label,universe='x',description='',options={}){if(by.has(id)){const n=by.get(id);if(description&&!n.description)n.description=description;Object.assign(n,options);return n}let n={id,type,label,universe,description,...options};nodes.push(n);by.set(id,n);return n}
function link(a,b,type,title,detail,spoiler=0,source='editorial',url=''){
 a=pid(a);b=pid(b);
 if(!by.has(a)||!by.has(b))throw Error('Unknown node '+a+' -> '+b+' ('+title+')');
 if(a===b)throw Error('self-edge '+a);
 const duplicate=edges.find(e=>((e.a===a&&e.b===b)||(e.a===b&&e.b===a))&&e.type===type&&e.title===title);
 if(duplicate)return;
 edges.push({a,b,type,title,detail,spoiler,provenance:source==='verified'?'confirmed':source==='official'?'confirmed':source==='community'?'community':source==='interpretation'?'editorial':source==='production'?'production':'editorial',source:source==='verified'||source==='official'?'Marvel official':source==='interpretation'?'Editorial interpretation':source==='csv'?'User-supplied CSV':'Curated contextual connection',sourceUrl:url||undefined});
}
// Distinct catalogue anchors show shared indexing without claiming one canon.
const groups=[['mcu','Marvel Studios collection','#ff485c'],['tv','Marvel Television collection','#eab97d'],['raimi','Raimi Spider-Man films','#e89e61'],['asm','Amazing Spider-Man films','#6ba6ef'],['ssu','Sony-produced Spider-Man spin-offs','#a98de6'],['sv','Animated Spider-Verse collection','#f29cc4'],['fox','Fox-era Marvel adaptations','#79e0cc']];
for(const [u,label] of groups)add('hub-'+u,'collection',label,u,'A browsing collection. Membership is not, by itself, a same-universe or canon connection.',{isHub:true});
function cast(character,actor,projects,desc=''){add(character,'character',character.replace(/^char-/,'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),'mcu',desc);if(actor){add(actor,'actor',actor.replace(/^actor-/,'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),'x');link(character,actor,'portrayal','Played by','This performer portrays this screen character in the linked projects. This is an actor–character relationship, not a canon bridge.',0)}for(const p of projects){link(character,p,'appearance','Character appears','The character is featured in this project.',1)}}
function char(id,label,universe='mcu',description=''){return add(id,'character',label,universe,description)}
function actor(id,label){return add(id,'actor',label,'x')}
function role(c,a,projects,description=''){char(c,by.get(c)?.label||c,'mcu',description);actor(a,by.get(a)?.label||a);link(c,a,'portrayal','Screen portrayal','This actor portrays this character. Actor identity is separate from in-universe character identity.',0);for(const p of projects)link(c,p,'appearance','Appears in','Character appears in this project.',1)}
// ==== Magic / Agatha: multi-hop genuinely specific connections ====
add('agatha-all-along','project','Agatha All Along','mcu','Agatha recruits a coven to walk the Witches’ Road after escaping a distorted spell.',{year:2024,status:'released',media:'series',sourceUrl:SOURCES.agatha});
add('visionquest','project','VisionQuest','mcu','Vision’s story continues in a series announced as the concluding chapter of a television trilogy.',{year:2026,status:'upcoming',media:'series',sourceUrl:SOURCES.vision});
char('agatha-harkness','Agatha Harkness','mcu','A centuries-old witch who plays a major role in WandaVision and leads the coven in Agatha All Along.');
char('billy-maximoff','Billy Maximoff / Wiccan','mcu','Billy’s connection to the Maximoff family becomes a crucial Agatha All Along revelation.');by.get('billy-maximoff').spoiler=3;
char('tommy-maximoff','Tommy Maximoff / Speed','mcu','Billy’s twin brother, relevant to the Agatha story.');
char('rio-vidal','Rio Vidal','mcu','The enigmatic green witch in Agatha All Along.');
char('vision','Vision','mcu','An android whose story runs through Age of Ultron, Infinity War and WandaVision.');
char('ultron','Ultron','mcu','The AI antagonist introduced in Avengers: Age of Ultron.');
char('lilia-calderu','Lilia Calderu');char('jennifer-kale','Jennifer Kale');char('alice-wu-gulliver','Alice Wu-Gulliver');
add('witches-road','event','The Witches’ Road','mcu','Central magical journey, trials, and revelations in Agatha All Along.');
add('darkhold','artifact','Darkhold','mcu','Forbidden magical book central to Wanda’s story.');
add('westview','place','Westview','mcu','The town at the centre of WandaVision and Agatha’s situation.');
add('scarlet-witch','identity','The Scarlet Witch','mcu','Wanda’s magical identity, a major cross-project concept.');
add('witches-ballad','music','The Ballad of the Witches’ Road','mcu','A song performed and reinterpreted throughout Agatha All Along.');
link('wandav','agatha-all-along','continuation','Direct story continuation','Agatha’s predicament is the direct consequence of Wanda’s spell in WandaVision. The later series revisits Westview and its residents.',1,'official',SOURCES.agatha);
link('agatha-all-along','visionquest','continuation','Television trilogy: part 2 → 3','Marvel explicitly presents VisionQuest as the final installment following WandaVision and Agatha All Along. This is a production/story-franchise link, not proof every character meets.',0,'official',SOURCES.vision);
link('wandav','visionquest','continuation','Television trilogy: part 1 → 3','Marvel identifies WandaVision, Agatha All Along, and VisionQuest as a connected television trilogy.',0,'official',SOURCES.vision);
link('agatha-all-along','agatha-harkness','appearance','Series lead','Agatha seeks to regain her powers and leads the coven.',0,'official',SOURCES.agatha);
link('wandav','agatha-harkness','appearance','Wanda’s neighbor and rival','Agatha enters Wanda’s Westview story, setting up her own series.',2,'editorial');
link('agatha-all-along','billy-maximoff','appearance','Who is Teen?','The mysterious Teen’s identity connects the show to Wanda’s family.',3,'editorial');
link('billy-maximoff','wandav','appearance','Westview family','Billy’s origin ties to Wanda and Vision in WandaVision.',2,'editorial');
link('billy-maximoff','tommy-maximoff','family','Twin brothers','The twins are central to Billy’s personal journey and Wanda’s story.',2,'editorial');
link('tommy-maximoff','wandav','appearance','Wanda’s other son','Tommy is part of Wanda and Vision’s Westview family.',2,'editorial');
link('agatha-all-along','rio-vidal','appearance','The green witch','Rio’s relationship to Agatha becomes an important part of the series.',2,'editorial');
link('agatha-all-along','witches-road','story','The Road and its trials','The coven travels through a sequence of magical trials with a major final revelation.',2,'official',SOURCES.agatha);
link('agatha-all-along','witches-ballad','music','The recurring song','The Ballad of the Witches’ Road recurs with different context and meaning.',1,'editorial');
link('agatha-all-along','westview','place','Return to Westview','The series starts after the events surrounding Wanda’s spell in Westview.',0,'official',SOURCES.agatha);
link('wandav','westview','place','The Hex around Westview','The town is the centre of WandaVision’s reality-warping premise.',1,'editorial');
link('agatha-harkness','wanda','character','Magic mentor and adversary','Agatha’s relationship with Wanda changes across their intertwined stories.',2,'editorial');
link('wanda','scarlet-witch','identity','Scarlet Witch identity','Wanda is the Scarlet Witch in the MCU.',1,'editorial');
link('wanda','billy-maximoff','family','Wanda and Billy','The character relationship spans WandaVision and Agatha All Along.',2,'editorial');
link('wandav','darkhold','artifact','Forbidden magic','The Darkhold is important to the finale and Wanda’s subsequent story.',3,'editorial');
link('dsmom','darkhold','artifact','Consequences of the Darkhold','The magic book helps bridge WandaVision and Multiverse of Madness.',2,'editorial');
link('agatha-harkness','darkhold','artifact','Agatha’s book','Agatha’s pursuit of magic draws attention to the Darkhold.',2,'editorial');
link('aou','vision','appearance','Vision is created','Vision first appears in Age of Ultron.',2,'editorial');
link('wandav','vision','appearance','Vision’s Westview story','The Vision central to Westview’s domestic fiction intersects with the android’s history.',1,'editorial');
link('visionquest','vision','appearance','Vision returns','Paul Bettany reprises Vision in VisionQuest.',0,'official',SOURCES.vision);
link('visionquest','ultron','appearance','Ultron returns','James Spader reprises Ultron in the announced VisionQuest series.',0,'official',SOURCES.vision);
link('ultron','aou','appearance','Ultron’s origin','The AI villain is introduced in Age of Ultron.',0,'editorial');
// Production professionals have their own nodes, not mistakenly classified as performers.
add('jac-schaeffer','creator','Jac Schaeffer','x','Creator and showrunner of Agatha All Along; also created WandaVision.');
add('terry-matalas','creator','Terry Matalas','x','Showrunner of the announced VisionQuest series.');
link('jac-schaeffer','agatha-all-along','production','Creator / showrunner','The Agatha All Along official series page credits Jac Schaeffer as creator and showrunner.',0,'official',SOURCES.agatha);
link('jac-schaeffer','wandav','production','Creator of WandaVision','Jac Schaeffer created WandaVision and later Agatha All Along, a real-world production connection, not a story event.',0,'production');
link('terry-matalas','visionquest','production','VisionQuest showrunner','Marvel identifies Terry Matalas as showrunner of VisionQuest.',0,'official',SOURCES.vision);
char('nicholas-scratch','Nicholas Scratch','mcu','Agatha’s son, whose history becomes central to the later episodes of Agatha All Along.');
by.get('nicholas-scratch').spoiler=3;
link('agatha-all-along','nicholas-scratch','appearance','Agatha’s son','Nicholas Scratch’s story explains important choices Agatha has made.',3,'editorial');
link('nicholas-scratch','agatha-harkness','family','Agatha and Nicholas','A defining family relationship at the centre of Agatha’s arc.',3,'editorial');
for(const [id] of [['lilia-calderu'],['jennifer-kale'],['alice-wu-gulliver']])link(id,'agatha-all-along','appearance','Member of the coven','A witch who participates in the Witches’ Road story.',1,'editorial');
for(const [a,name,c,projects] of [
 ['kathryn-hahn','Kathryn Hahn','agatha-harkness',['wandav','agatha-all-along']],
 ['joe-locke','Joe Locke','billy-maximoff',['agatha-all-along']],
 ['aubrey-plaza','Aubrey Plaza','rio-vidal',['agatha-all-along']],
 ['paul-bettany','Paul Bettany','vision',['aou','infwar','wandav','visionquest']],
 ['james-spader','James Spader','ultron',['aou','visionquest']],
 ['patti-lupone','Patti LuPone','lilia-calderu',['agatha-all-along']],
 ['sasheer-zamata','Sasheer Zamata','jennifer-kale',['agatha-all-along']],
 ['ali-ahn','Ali Ahn','alice-wu-gulliver',['agatha-all-along']]]){
 actor(a,name);link(a,c,'portrayal','Portrays '+by.get(c).label,name+' portrays '+by.get(c).label+'. This is production casting data.',0,'production');
 for(const p of projects)link(a,p,'cast','Screen credit',name+' appears in this project.',0,'production');
}
// ==== connected movie clusters ==== 
function chain(names,reason,spoiler=0){for(let i=1;i<names.length;i++)link(names[i-1],names[i],'continuation','Part of the continuing arc',reason,spoiler)}
chain(['Iron Man','Iron Man 2','The Avengers','Iron Man 3','Avengers: Age of Ultron','Captain America: Civil War','Avengers: Infinity War','Avengers: Endgame'],'Tony Stark’s ongoing arc crosses standalone films and team-ups.',1);
chain(['Captain America: The First Avenger','The Avengers','Captain America: The Winter Soldier','Captain America: Civil War','Avengers: Infinity War','Avengers: Endgame','The Falcon and the Winter Soldier','Captain America: Brave New World'],'The Captain America identity and its consequences recur in these projects.',1);
chain(['Thor','Thor: The Dark World','Thor: Ragnarok','Avengers: Infinity War','Avengers: Endgame','Thor: Love and Thunder'],'Thor’s family, power and responsibilities evolve across these stories.',1);
chain(['Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','Avengers: Infinity War','Avengers: Endgame','The Guardians of the Galaxy Holiday Special','Guardians of the Galaxy Vol. 3'],'The Guardians’ relationships change across their standalone and crossover adventures.',1);
chain(['Ant-Man','Ant-Man and the Wasp','Avengers: Endgame','Ant-Man and the Wasp: Quantumania'],'Scott Lang’s introduction to quantum technology becomes important to the wider MCU.',1);
chain(['Captain Marvel','The Marvels'],'Carol Danvers’ story continues with Kamala Khan and Monica Rambeau.',0);
chain(['Black Panther','Avengers: Infinity War','Black Panther: Wakanda Forever'],'Wakanda’s history and leadership underpin the subsequent stories.',1);
chain(['Spider-Man: Homecoming','Spider-Man: Far From Home','Spider-Man: No Way Home','Spider-Man: Brand New Day'],'Peter Parker’s MCU journey continues through these films.',0);
chain(['Venom','Venom: Let There Be Carnage','Venom: The Last Dance'],'Tom Hardy’s Eddie Brock and his symbiote continue across the Venom trilogy.',0);
chain(['X-Men','X2','X-Men: The Last Stand','X-Men: Days of Future Past'],'Fox’s original X-Men ensemble and its timeline changes connect these films.',1);
chain(['X-Men: First Class','X-Men: Days of Future Past','X-Men: Apocalypse','Dark Phoenix'],'The younger X-Men cast and timeline continue through these films.',1);
chain(['X-Men Origins: Wolverine','The Wolverine','Logan'],'Different chapters of Wolverine’s Fox-era film history; timeline relationships are complex.',0);
chain(['Fantastic Four (2005)','Fantastic Four: Rise of the Silver Surfer'],'Direct film sequel in the 2000s Fantastic Four continuity.',0);
chain(['Deadpool','Deadpool 2','Deadpool & Wolverine'],'Reynolds’ Deadpool continues from his Fox films into a TVA-related MCU film.',1);
chain(['Spider-Man: Into the Spider-Verse','Spider-Man: Across the Spider-Verse','Spider-Man: Beyond the Spider-Verse'],'Miles Morales’ animated story unfolds across the Spider-Verse trilogy.',0);
chain(['Daredevil','The Defenders','Daredevil: Born Again','Daredevil: Born Again Season 2'],'Matt Murdock’s on-screen history links earlier street-level series and Marvel Television’s continuation.',1);
chain(['Hawkeye','Echo','Daredevil: Born Again'],'Maya Lopez’s story and Wilson Fisk bridge these street-level series.',1);
chain(['Ms. Marvel','The Marvels'],'Kamala Khan crosses over from her Disney+ introduction into the film.',0);
chain(['WandaVision','Agatha All Along','VisionQuest'],'Marvel identifies these three series as a television trilogy.',0);
// missing explicitly titled season 2 title
if(!by.has(pid('Daredevil: Born Again Season 2')))throw Error('missing born again 2');
// Additional explicit context for otherwise isolated screen projects. These are NOT invented same-canon links.
link('Helstrom','Werewolf by Night','theme','Supernatural adaptations','Both explore Marvel supernatural horror, but they do not have a confirmed shared-screen-canon crossover.',0,'interpretation');
link('Hit-Monkey','M.O.D.O.K.','production','Adult Marvel animation','Both are adult-oriented Marvel animated television productions. This is production/category context, not a shared plot.',0,'editorial');
link('I Am Groot','Guardians of the Galaxy Vol. 2','character','Baby Groot short adventures','The animated shorts follow Groot, familiar from Guardians of the Galaxy movies.',0,'editorial');
link('Madame Web','Venom','production','Sony Marvel productions','Both were produced under Sony’s Marvel film initiatives, but their stories are not assumed to share a continuity.',0,'editorial');
link('Spider-Ham: Caught in a Ham','Spider-Man: Into the Spider-Verse','continuation','Spider-Ham short','The animated Spider-Ham short relates to the character featured in Into the Spider-Verse.',0,'editorial');
link('The Incredible Hulk','The Avengers','character','Bruce Banner reappears','The MCU Hulk later joins the Avengers, with a different actor portraying Bruce Banner.',0,'editorial');
link('The Incredible Hulk','She-Hulk: Attorney at Law','character','Bruce Banner and Jennifer Walters','Bruce Banner appears in the later She-Hulk series.',0,'editorial');
// Critical crossovers
link('Captain America: Civil War','Black Panther','appearance','T’Challa’s introduction','Black Panther first enters the MCU film narrative during the Avengers’ conflict.',1);
link('Captain America: Civil War','Spider-Man: Homecoming','continuation','Peter’s introduction','Peter Parker is recruited during Civil War, before his standalone Homecoming story.',0);
link('Black Widow','Iron Man 2','continuation','Natasha’s earlier MCU appearance','Natasha Romanoff appears in Iron Man 2 before her own film explores earlier chapters.',1);
link('Black Widow','Hawkeye','character','Natasha and Clint','The characters’ shared history carries into Clint’s later series.',1);
link('Black Widow','The Falcon and the Winter Soldier','continuation','Valentina / post-credit thread','A post-credit scene helps establish a later network of operatives and recruits.',3);
link('Thunderbolts*','Black Widow','continuation','Yelena and Red Guardian','Characters introduced in Black Widow take central roles in Thunderbolts*.',1);
link('Thunderbolts*','The Falcon and the Winter Soldier','continuation','John Walker returns','The earlier series introduces a future Thunderbolts* member.',1);
link('Thunderbolts*','Ant-Man and the Wasp','character','Ghost returns','Ghost’s history from Ant-Man and the Wasp matters to the ensemble.',1);
link('Shang-Chi and the Legend of the Ten Rings','Iron Man','reference','Ten Rings name','The Ten Rings organization name connects back to Tony’s origin film, though its screen depiction develops over time.',1);
link('Shang-Chi and the Legend of the Ten Rings','Iron Man 3','continuation','The Mandarin identity','The film revisits the Mandarin mythology surrounding the earlier impostor story.',2);

link('The Marvels','WandaVision','character','Monica Rambeau','Monica’s powers and history emerge in WandaVision before the team-up.',1);
link('The Marvels','Captain Marvel','continuation','Carol and Monica','The sequel reopens Carol’s past connection to the Rambeau family.',1);
link('Hawkeye','Black Widow','character','Yelena confronts Clint','Yelena’s pursuit of Clint carries over from a Black Widow post-credit scene.',3);
link('Echo','Daredevil','character','Kingpin’s street-level world','Maya and Matt operate within stories connected through Wilson Fisk, not through an asserted shared on-screen scene.',1);
link('She-Hulk: Attorney at Law','Daredevil: Born Again','appearance','Matt Murdock’s MCU appearances','Charlie Cox reprises Matt Murdock in She-Hulk and Born Again.',1,'production',SOURCES.dd);
link('Spider-Man: No Way Home','Daredevil: Born Again','appearance','Matt Murdock’s appearance','Matt briefly appears in No Way Home before the newer Daredevil series.',3);
link('Moon Knight','Werewolf by Night','theme','Supernatural corner','Both explore the MCU’s supernatural side; this is a thematic grouping, not an established story crossover.',0,'interpretation');
link('Eternals','Guardians of the Galaxy','theme','Cosmic Marvel','Both explore cosmic aspects of the MCU, but this link is a thematic guide rather than a direct event.',0,'interpretation');
link('Eyes of Wakanda','Black Panther','story','Wakandan history','The animated project explores stories associated with Wakanda and its past.',0);
link("X-Men '97",'X-Men','alternate','Different screen continuities','The 2024 animated revival continues X-Men: The Animated Series, not the Fox live-action film chronology.',0);
link('Marvel Zombies','What If...?','alternate','Animated zombie scenario','Marvel Zombies expands an alternate-reality zombie premise associated with What If...?.',1);
link('Your Friendly Neighborhood Spider-Man','Spider-Man: Homecoming','alternate','Different versions of Peter','This animated take on Peter Parker is a separate continuity, not a scene-by-scene MCU origin retelling.',0);
link('Spider-Man: Across the Spider-Verse','Venom','reference','Live-action multiverse imagery','The Spider-Verse movies juxtapose animation with other screen universes. Treat precise shared-canon claims cautiously.',1,'editorial');
link('The New Mutants','X-Men','production','Fox mutant adaptation','The New Mutants belongs to Fox-era Marvel film production; its timeline connections are less explicit.',0);
link('Legion','X-Men','production','X-Men-derived television','Legion is adapted from X-Men comic mythology, but it is not placed in the live-action films’ canon by this link.',0);
link('The Gifted','X-Men','production','Mutant television world','Fox series draws on X-Men mythology; this is not a direct shared-film-continuity claim.',0);
link('Generation X','X-Men','production','Older mutant pilot','A separate on-screen adaptation of mutant material from Marvel comics.',0);
link('Inhumans','Agents of S.H.I.E.L.D.','theme','Inhuman concepts on television','Both involve Inhuman mythology, with distinct narrative treatment.',0);
link('Cloak & Dagger','Runaways','crossover','Television crossover','The lead characters from Cloak & Dagger appear in Runaways season three.',2);
link('Jessica Jones','The Defenders','crossover','Defenders team','Jessica is one of the central heroes of the Defenders team-up.',1);
link('Luke Cage','The Defenders','crossover','Defenders team','Luke is one of the central heroes of the Defenders team-up.',1);
link('Iron Fist','The Defenders','crossover','Defenders team','Danny Rand joins the Defenders.',1);
link('The Punisher','Daredevil','continuation','Frank Castle introduced','Frank Castle appears in Daredevil before starring in his own series.',1);
link('The Punisher','The Punisher: One Last Kill','continuation','Frank Castle’s story','Marvel catalogues a later standalone Punisher project.',0,'official',SOURCES.marvelTV);
link('Wonder Man','Shang-Chi and the Legend of the Ten Rings','cast','Trevor Slattery connection','Ben Kingsley reprises Trevor Slattery in Wonder Man; this is a returning-character connection, not a direct sequel.',0);
link('Ironheart','Black Panther: Wakanda Forever','continuation','Riri Williams','Riri is introduced in Wakanda Forever before her Disney+ series.',1);
link('Secret Invasion','Captain Marvel','character','Fury and Skrulls','The Skrulls and Nick Fury’s history from Captain Marvel provide context for the series.',1);
link('Ant-Man and the Wasp: Quantumania','Loki','character','Kang and variants','Different variants and multiverse ideas link the projects, with no guarantee that every variant shares an identical history.',2);
link('The Fantastic Four: First Steps','Fantastic Four (2015)','alternate','Another Fantastic Four adaptation','Distinct versions of the team; this link is about screen adaptations, not shared history.',0);
link('The Fantastic Four: First Steps','Fantastic Four (2005)','alternate','Earlier Fantastic Four adaptation','A different screen continuity of Marvel’s First Family.',0);
link('Deadpool & Wolverine','X-Men: Days of Future Past','reference','Fox film multiverse','The crossover makes Fox-era mutant screen history useful background without merging every Fox timeline.',2);
link('Deadpool & Wolverine','The New Mutants','production','Fox-era mutant catalog','A shared former studio/catalogue, not evidence for a plot crossover.',0);
link('Avengers: Doomsday','Avengers: Secret Wars','continuation','Announced Avengers follow-up','Two announced Avengers films; story specifics remain limited. Avoid treating fan theories as confirmed.',0,'editorial');
link('VisionQuest','Avengers: Age of Ultron','character','Ultron returns','Marvel confirmed James Spader will return as Ultron in VisionQuest.',0,'official',SOURCES.vision);
// Explicit cross-film observations imported from the user-provided CSV. Conservative phrase matching only.
// No inferred target = no graph line. These NEVER receive an official-confirmation badge.
const targetedMentions=[
 ['Avengers: Endgame',/\bEndgame\b/i],['Avengers: Infinity War',/\bInfinity War\b/i],
 ['Captain America: The Winter Soldier',/\bThe Winter Soldier\b/i],
 ['Avengers: Age of Ultron',/\bAge of Ultron\b/i],
 ['Captain America: Civil War',/\bCivil War\b/i],
 ['Thor: Ragnarok',/\bRagnarok\b/i],['Thor: The Dark World',/\bThe Dark World\b/i],
 ['Iron Man 3',/\bIron Man 3\b/i],['Iron Man 2',/\bIron Man 2\b/i],
 ['Shang-Chi and the Legend of the Ten Rings',/\bShang-Chi\b/i],
 ['WandaVision',/\bWandaVision\b/i],['Agatha All Along',/\bAgatha All Along\b/i],
 ['Spider-Man: No Way Home',/\bNo Way Home\b/i],['Spider-Man: Far From Home',/\bFar From Home\b/i],
 ['Spider-Man: Homecoming',/\bHomecoming\b/i],
 ['Spider-Man 2 (2004)',/\bSpider-Man 2\b/i],
 ['Spider-Man (2002)',/\bSpider-Man(?: \(2002\))?\b(?![:\s]*[23])/i],
 ['Black Panther: Wakanda Forever',/\bWakanda Forever\b/i],['Black Panther',/\bBlack Panther\b/i],
 ['The Falcon and the Winter Soldier',/\bThe Falcon and the Winter Soldier\b/i],
 ['The Marvels',/\bThe Marvels\b/i],['Captain Marvel',/\bCaptain Marvel\b/i],
 ['The Incredible Hulk',/\bThe Incredible Hulk\b/i],['She-Hulk: Attorney at Law',/\bShe-Hulk\b/i],
 ['Hawkeye',/\bHawkeye\b/i],['Loki',/\bLoki\b/i],['Eternals',/\bEternals\b/i],
 ['Agents of S.H.I.E.L.D.',/\bAgents of S\.?H\.?I\.?E\.?L\.?D\.?\b/i],
 ['The Avengers',/\bThe Avengers\b/i],['Daredevil',/\bDaredevil\b/i],
 ['Guardians of the Galaxy Vol. 3',/\bGuardians of the Galaxy Vol\.? 3\b/i],
 ['The Fantastic Four: First Steps',/\bFirst Steps\b/i]
];
const csvImported=DATA=>DATA.facts.filter(f=>f.kind==='Cross-film connection');
for(const f of csvImported(D)){
 const chosen=[];
 for(const [title,re]of targetedMentions){const target=pid(title);if(target!==f.project&&by.has(target)&&re.test(f.text)&&!chosen.includes(target))chosen.push(target);if(chosen.length===2)break}
 for(const target of chosen)link(f.project,target,'reference','Reader observation: '+f.text.slice(0,67),f.text+' (User-provided CSV, original evidence note: '+(f.evidence||'none supplied')+'). This observation is not independently verified.',2,'csv');
}
// Prefer precise explanations to vague legacy/chain duplicates between the same two endpoints.
const best=new Map;
function rank(e){return(e.source==='Marvel official'?100:0)+(e.source==='User-supplied CSV'?10:0)+(e.title==='Part of the continuing arc'?-35:0)+(e.title==='Television trilogy: part 2 → 3'?20:0)}
for(const e of edges){
 if(e.type!=='continuation')continue;
 const key=[e.a,e.b].sort().join('|')+'|continuation',prev=best.get(key);
 if(!prev||rank(e)>rank(prev))best.set(key,e);
}
for(let i=edges.length-1;i>=0;i--){const e=edges[i];if(e.type==='continuation'){const key=[e.a,e.b].sort().join('|')+'|continuation';if(best.get(key)!==e)edges.splice(i,1)}}
// Dedicated collections bridge only otherwise isolated titles, never mistaken for story links.
for(const n of [...nodes]){
 if(n.type!=='project')continue;
 const hub='hub-'+n.universe;
 if(by.has(hub))link(n.id,hub,'catalogue','Browse production collection','This title is indexed in the '+by.get(hub).label+'. This is a browsing grouping and does not assert shared canon, chronology, or story continuity.',0,'editorial');
}
// Metadata / source labels: on-screen research is separate from user-supplied notes.
const enrich={
 'agatha-all-along':{short:'A coven, an impossible road, and the mysteries left behind in Westview.',sources:[SOURCES.agatha,SOURCES.vision],watch:['wandav'],keywords:['Agatha Harkness','Billy Maximoff','Wiccan','Witches Road','Kathryn Hahn','Rio Vidal','Westview']},
 'visionquest':{short:'Vision’s continuing story; announced for October 14, 2026.',sources:[SOURCES.vision],watch:['wandav','agatha-all-along','aou'],keywords:['Vision','Paul Bettany','Ultron','James Spader']},
 'wandav':{short:'A strange sitcom reality conceals grief, magic, and a mystery in Westview.',watch:['aou','infwar'],keywords:['Agatha','Vision','Billy','Tommy','Westview']},
 'bornagain':{sources:[SOURCES.dd],watch:['dd','defenders']},
 'spidey':{sources:[SOURCES.spider]}
};
for(const [id,meta]of Object.entries(enrich))if(by.has(id))Object.assign(by.get(id),meta);
// New callback note items. These are editorial comparisons, not verified word-for-word quotations.
for(const cb of D.callbacks){const id=cb.id;if(by.has(id))continue;add(id,'callback',cb.title,'x','User-provided editorial comparison. Open its card to see original notes.',{callbackId:id,spoiler:cb.spoiler,origin:cb.origin});
 for(const p of cb.projects)if(by.has(p))link(id,p,'dialogue','Callback / parallel context','User-supplied comparison associated with '+by.get(p).label+'. Intentionality and exact wording were not independently verified.',2,'interpretation');
}
D.stats={seedProjects:nodes.filter(n=>n.type==='project').length,curatedRelations:edges.filter(e=>e.source==='Marvel official'||e.source==='Curated contextual connection'||e.source==='Editorial interpretation').length};
})();
