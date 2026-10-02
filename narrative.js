/**
 * MARVEL ATLAS V4 — HAND-EDITED STORY / CALLBACK / PROP CONNECTIONS
 * The user-supplied 50 callback notes are editorial interpretations, NOT quotations
 * authenticated against released scripts. Story beats have specific endpoints;
 * no generated 'same universe' filler. Individual source URLs are supplied only
 * where the linked article actually supports that connection.
 */
(()=>{'use strict';
const D=window.MARVEL_DATA;if(!D)throw Error('data.js missing');
const by=new Map(D.nodes.map(n=>[n.id,n]));const aliases=D.aliases;
const REF={
 iron:'https://www.marvel.com/comics/issue/56902/guidebook_to_the_marvel_cinematic_universe_2015_1',
 end:'https://www.marvel.com/articles/tv-shows/loki-episode-1-event-report-recap',
 vision:'https://www.marvel.com/articles/tv-shows/marvel-television-visionquest-release-date',
 ff:'https://www.marvel.com/articles/movies/fantastic-four-first-steps-avengers-doomsday-kevin-feige',
 yelena:'https://www.marvel.com/characters/yelena-belova',
 war:'https://www.marvel.com/characters/war-machine-james-rhodes/on-screen/',
 ironquote:'https://www.marvel.com/articles/movies/iron-man-kevin-feige-jon-favreau-15-anniversary-interview',
 ten:'https://marvelcinematicuniverse.fandom.com/wiki/Ten_Rings_(Organization)',
 mcu:'https://marvelcinematicuniverse.fandom.com/wiki/Marvel_Cinematic_Universe_Wiki',
 marveltv:'https://www.marvel.com/tv-shows'
};
const id=x=>aliases[x]||x;
function add(code,kind,name,uni='x',description='',sp=0){if(by.has(code)){const n=by.get(code);if(!n.description)n.description=description;return code}const n={id:code,type:kind,label:name,universe:uni,description,spoiler:sp,origin:'V4 contextual editorial index'};by.set(code,n);D.nodes.push(n);return code}
const KEY=new Set(D.edges.map(e=>[e.a,e.b].sort().join('|')+'|'+e.type+'|'+e.title));
function link(a,b,type,title,detail,spoiler=1,prov='editorial',url=''){
 a=id(a);b=id(b);if(!by.has(a)||!by.has(b))throw Error('V4 unknown '+a+' / '+b+' : '+title);if(a===b)return;
 const key=[a,b].sort().join('|')+'|'+type+'|'+title;if(KEY.has(key))return;KEY.add(key);
 D.edges.push({a,b,type,title,detail,spoiler,provenance:prov==='official'?'confirmed':prov==='community'?'community':prov==='production'?'production':prov==='disputed'?'disputed':'editorial',source:prov==='official'?'Marvel official':prov==='community'?'MCU Wiki · community compiled':prov==='production'?'Production fact':prov==='disputed'?'Editorial continuity caution':'Curated on-screen editorial observation',...(url?{sourceUrl:url}:{})});
}
function story(code,name,desc,projects,opts={}){
 const uni=opts.universe||'mcu',s=opts.spoiler??2;const beat=add('thread-'+code,opts.type||'event',name,uni,desc,s);
 const ps=[...new Set(projects.map(id))];for(const p of ps)link(beat,p,'story',name,desc,s,opts.source?'official':'editorial',opts.source||'');
 if(ps.length>1){for(let j=1;j<ps.length;j++)link(ps[j-1],ps[j],opts.edgeType||'story',name,desc,s,opts.source?'official':'editorial',opts.source||'')}
 for(const c of opts.actors||[])if(by.has(id(c)))link(beat,c,'character','Involved in '+name,desc,s,'editorial');
 for(const c of opts.props||[])if(by.has(id(c)))link(beat,c,'artifact','Object involved in '+name,desc,s,'editorial');
 return beat;
}
// ── All fifty supplied notes now connect to both source and destination whenever
// there really are two distinct works. Single-work repeats remain in one work.
const CALLBACKS=[
[1,['ironman','endgame'],'Tony announces his identity in the first film; his last battlefield declaration reinterprets that identity as sacrifice.'],
[2,['avengers','endgame'],'Steve questions Tony’s readiness to make the ultimate sacrifice. Endgame resolves that conflict through Tony’s final choice.'],
[3,['avengers','iron-man-3','homecoming'],'Steve challenges what Tony is without armor. Later films explore the person behind the technology; Tony applies that lesson to Peter.'],
[4,['ironman','endgame'],'A joking warning about publicity and a later private farewell recording provide a tonal contrast, not a repeated line.'],
[5,['ironman','aou'],'Tony’s weapons-first approach grows into an attempt at global automated protection, with destructive consequences.'],
[6,['captain-america-civil-war','infwar','endgame'],'The Sokovia Accords and Tony’s concerns about external threats feed into the divided Avengers and their later reunion.'],
[7,['iron-man-2','endgame'],'Tony initially distrusts Natasha but later regards her as part of the team and grieves her loss.'],
[8,['ironman','endgame'],'Tony requests a cheeseburger after his rescue; Morgan echoes that preference in the funeral sequence.'],
[9,['endgame'],'Tony’s family exchanges are echoed within Endgame’s own final holographic farewell.'],
[10,['ironman','endgame'],'Yinsen’s reassurance during Tony’s early ordeal and Pepper’s final reassurance form a thematic bookend, not an exact repeated quotation.'],
[11,['ca1','captain-america-civil-war','endgame'],'Steve’s refusal to quit is repeated in successive films, then turned into a joke when he meets his earlier self.'],
[12,['ca1','endgame'],'Steve misses a dance with Peggy after waking in the present, while Endgame closes the personal arc.'],
[13,['tws','endgame'],'Sam’s running joke becomes a battlefield signal at the portals moment.'],
[14,['tws','endgame'],'Steve re-enters an elevator with Hydra agents and uses a different strategy during the Time Heist.'],
[15,['captain-america-civil-war','thor-ragnarok'],'Different films use the notion of a familiar teammate as both a tragic conflict and a comic reunion; this is a thematic comparison.'],
[16,['ca1','tws'],'Bucky and Steve’s shared promise becomes the heart of Steve’s attempt to reach his old friend.'],
[17,['endgame'],'An early uniform joke and Steve’s later encounter with his 2012 self are two moments within Endgame.'],
[18,['ca1','the-falcon-and-the-winter-soldier'],'Erskine values Steve’s character over his abilities; Sam’s shield dilemma returns to the question of what makes Captain America.'],
[19,['aou','endgame'],'Age of Ultron withholds the full team rally, while Endgame delivers the famous assembly.'],
[20,['avengers','thor-ragnarok'],'Thor’s quick family joke about Loki is revisited with the brothers’ shifting public presentation in Ragnarok.'],
[21,['infwar','endgame'],'Thanos criticizes Thor’s strike in Infinity War; Thor explicitly refers to that failure in Endgame.'],
[22,['thor','thor-ragnarok'],'Early Thor relies on his hammer; Odin’s counsel in Ragnarok disentangles Thor’s worth from the weapon.'],
[23,['avengers','thor-ragnarok'],'The Hulk’s treatment of Loki becomes a mirrored comic moment when the Hulk faces Thor in the arena.'],
[24,['thor','endgame'],'Thor’s original loss of worthiness is contrasted with his renewed assurance during the Asgard Time Heist.'],
[25,['thor-ragnarok','infwar'],'Thor and Loki’s reconciliation gives extra emotional weight to Loki’s final encouragement; wording is not a direct Ragnarok quote.'],
[26,['avengers','endgame'],'Natasha and Clint refer to the Budapest assignment in both films, giving earlier friendship a tragic context.'],
[27,['avengers','endgame'],'Natasha’s sense of an unpaid moral debt becomes a story of belonging and sacrifice; this is thematic rather than verbatim.'],
[28,['aou','endgame'],'The supplied note compares Natasha’s protective behavior in Ultron with her decision on Vormir; it is not a repeated line.'],
[29,['endgame','hawkeye'],'Clint’s grief after the Snap carries into his later struggle with loss in the Hawkeye series.'],
[30,['homecoming','nwh'],'Tony’s lesson about a hero without a high-tech suit pays off when Peter begins again with a self-made suit.'],
[31,['homecoming','nwh'],'Peter’s determination under the Homecoming rubble is compared with his later choices; thematic interpretation.'],
[32,['homecoming','spider-man-far-from-home'],'Peter’s early desire to imitate Tony develops into the pressure of Stark’s legacy after Endgame.'],
[33,['infwar','wandav'],'Wanda’s loss of Vision leads into a Westview scene in which she confronts what remains of him.'],
[34,['wandav'],'A light sitcom description of Wanda and Vision’s relationship takes on different meaning in the finale of the same series.'],
[35,['aou','wandav'],'Wanda’s earlier grief and Vision’s reflections on loss form a long-running emotional motif.'],
[36,['guardians-of-the-galaxy','infwar'],'Groot’s earlier self-sacrifice and his later fate prompt a thematic comparison of found family and loss.'],
[37,['guardians-of-the-galaxy-vol-2','guardians-of-the-galaxy-vol-3'],'Yondu’s lesson about chosen family informs Peter Quill’s eventual return to his remaining Earth family.'],
[38,['black-panther','black-panther-wakanda-forever'],'The national salute changes emotional weight after the loss of T’Challa.'],
[39,['captain-america-civil-war','black-panther'],'T’Challa’s choice not to be governed by vengeance resonates with his approach to Killmonger.'],
[40,['aou','endgame'],'Thanos moves from the Gauntlet teaser to a desperate physical confrontation; the thematic link is editorial.'],
[41,['avengers','tws'],'Nick Fury challenges institutional commands in both films, but the scenes and conflicts differ.'],
[42,['aou','wandav','dsmom'],'Ultron’s desire to break imposed restraints can be compared to Wanda’s later choices; this is interpretation, not an intentional dialogue callback.'],
[43,['doctor-strange','nwh'],'Strange’s control of time against Dormammu contrasts with his attempt to limit Peter’s spell; thematic parallel.'],
[44,['aou'],'Rhodey’s repeated running joke takes place within Age of Ultron itself, not a cross-film callback.'],
[45,['thor','thor-love-and-thunder'],'Asgardian science and Jane’s eventual role as Mighty Thor share an idea; the supplied wording requires checking and is not asserted as a literal repeated line.'],
[46,['thor-ragnarok','infwar'],'The brothers’ Get Help routine gives emotional context to Thor losing Loki; interpretive link rather than quoted repetition.'],
[47,['black-panther','black-panther-wakanda-forever'],'Wakanda’s symbolic challenges and leadership changes are compared as a visual/thematic echo.'],
[48,['ca1','endgame'],'Steve’s refusal to give up in his origin story frames his endurance against Thanos.'],
[49,['ironman','black-widow'],'Two characters use sardonic deflection in different films; loose stylistic observation, not a verified dialogue reuse.'],
[50,['endgame'],'Tony’s closing reflections and the film’s conclusion create an internal framing motif.']
];
const LITERAL_ECHO=new Set([1,8,11,13,14,16,19,21,23,24,26,30,33,34,44]);const VISUAL_ECHO=new Set([14,23,24,47]);
for(const [number,ps,explanation]of CALLBACKS){
 const code='cb'+number,c=D.callbacks.find(c=>c.id===code);if(!c)throw Error('missing supplied callback '+code);
 const all=[...new Set(ps.map(id))];c.projects=all;c.originalDescription=c.description;c.description=explanation;c.analysisStatus='Editorial comparison; wording and deliberate intent not independently authenticated';
 const target=by.get(code);target.description=explanation;target.origin='User-supplied thematic / callback notes';target.spoiler=number===9||number===17||number===44?2:2;
 const noteTitle=c.title.replace(/^['“”]|['“”]$/g,'');const kind=VISUAL_ECHO.has(number)?'visual':LITERAL_ECHO.has(number)?'dialogue':'theme';const method=kind==='visual'?'Visual rhyme':kind==='dialogue'?'Dialogue callback / recurring phrase':'Thematic parallel';
 for(const p of all)link(code,p,kind,method+': '+noteTitle,explanation,2,'editorial');
 // Direct project-to-project edges remain visible without opening the callback node.
 if(all.length>1)for(let j=1;j<all.length;j++)link(all[j-1],all[j],kind,method+' #'+number+': '+noteTitle,explanation,2,'editorial');
}
// ── High-information event nodes. Project endpoints always refer to EXISTING titles;
// each beat explains an on-screen event or a properly scoped editorial comparison.
const B=[
// Avengers / Infinity Saga
['new-york-invasion','The Battle of New York changes Earth','Loki’s invasion exposes Earth to alien threats and later influences Stark, SHIELD, and the cleanup of Chitauri technology.',['avengers','aou','homecoming','endgame'],['nyc','tony'],['tesseract']],
['loki-scepter','Loki’s scepter and the Mind Stone','The scepter survives the invasion, becomes a HYDRA asset, helps create Ultron and Vision, and contains a Stone sought by Thanos.',['avengers','tws','aou','infwar'],['lokic','vision'],['stones']],
['ultron-created','Tony and Bruce create Ultron','Research into the scepter results in an autonomous defense system whose actions trigger consequences for Sokovia and the Avengers.',['aou','captain-america-civil-war','wandav'],['tony','ultron','wanda']],
['sokovia-fall','The Battle of Sokovia and its consequences','The aerial catastrophe motivates political oversight in Civil War and shapes later recollections of Wanda’s trauma.',['aou','captain-america-civil-war','the-falcon-and-the-winter-soldier','wandav'],['wanda','vision']],
['sokovia-accords','The Sokovia Accords divide the team','Governments respond to civilian harm; Iron Man supports oversight while Captain America resists, leaving heroes divided before Thanos.',['aou','captain-america-civil-war','infwar','she-hulk-attorney-at-law'],['tony','steve']],
['vision-assembled','Vision emerges from the Cradle','Stark, Banner, Thor and the Mind Stone contribute to Vision’s origin; the Stone later makes Vision vulnerable to Thanos.',['aou','infwar','wandav','visionquest'],['vision','wanda'],['stones']],
['vision-and-wanda','Wanda and Vision’s relationship','Their relationship develops after Ultron, faces the accords, and becomes central to both Infinity War and WandaVision.',['aou','captain-america-civil-war','infwar','wandav'],['wanda','vision']],
['pietro-sacrifice','Pietro’s death shapes Wanda','Pietro’s loss in Sokovia haunts Wanda and resurfaces in Westview’s constructed family narrative.',['aou','wandav'],['wanda']],
['civil-war-split','Steve and Tony cease to act as one team','The conflict over Bucky and the accords damages their friendship, leaving major heroes separated at the start of Infinity War.',['captain-america-civil-war','infwar','endgame'],['tony','steve']],
['wakanda-shield','Wakanda gives Steve new shields','Wakanda shelters Bucky and outfits Steve for the fight against Thanos after the events of Civil War.',['captain-america-civil-war','black-panther','infwar'],['steve']],
['thanos-quest','Thanos collects the Stones','Several objects introduced over preceding films become one coordinated threat, ending in the Snap.',['ca1','avengers','thor-the-dark-world','guardians-of-the-galaxy','doctor-strange','infwar'],['thanos'],['stones','tesseract']],
['vibranium-head','Thanos extracts Vision’s Stone','The Mind Stone introduced through Loki’s scepter and embodied in Vision becomes pivotal to the attack on Wakanda.',['avengers','aou','infwar','wandav'],['vision','wanda','thanos'],['stones']],
['snap-effect','The Snap reshapes surviving heroes','Half of life disappears; the aftermath drives Endgame, Peter’s return, Wanda’s grief and the Hawkeye household story.',['infwar','endgame','spider-man-far-from-home','wandav','hawkeye','the-falcon-and-the-winter-soldier'],['thanos','wanda'],['stones']],
['antman-quantum','Scott’s quantum-realm knowledge enables a plan','Ant-Man’s previous experiments underpin the Time Heist concept in Endgame.',['ant-man','ant-man-and-the-wasp','endgame','ant-man-and-the-wasp-quantumania'],['role-scott-lang']],
['time-heist-ny','The Time Heist revisits New York 2012','Endgame returns to the Avengers invasion for the Tesseract, scepter, and Time Stone, creating an alternate Loki escape.',['avengers','doctor-strange','endgame','loki'],['lokic','tony','steve'],['tesseract']],
['time-heist-asgard','The Time Heist revisits Asgard 2013','Thor meets his mother again and retrieves an earlier Mjolnir while Rocket seeks the Reality Stone.',['thor-the-dark-world','endgame','thor-love-and-thunder'],['role-thor-odinson'],['mjolnir','stones']],
['time-heist-morag','The Time Heist revisits Morag 2014','The team returns to the Power Stone’s original setting, bringing 2014 Nebula and Thanos into the later conflict.',['guardians-of-the-galaxy','endgame'],['thanos'],['stones']],
['time-heist-vormir','The Soul Stone demands a sacrifice','The rule established by the Stone’s keeper in Infinity War becomes devastating for Natasha and Clint in Endgame.',['infwar','endgame','black-widow','hawkeye'],[],['stones']],
['time-heist-shield-base','Tony revisits the old SHIELD base','The New Jersey mission connects Howard Stark and Peggy Carter’s earlier world with Tony’s final choices.',['ca1','agentcarter','endgame'],['tony','steve']],
['loki-variant-born','Loki escapes with the Tesseract','During the New York revisit, a variant Loki escapes and enters the TVA storyline.',['avengers','endgame','loki'],['lokic'],['tesseract']],
['cap-lift-hammer','Steve lifts Mjolnir','A subtle movement of the hammer in Age of Ultron becomes a major payoff against Thanos in Endgame.',['thor','aou','endgame'],['steve'],['mjolnir']],
['avengers-assemble-payoff','The complete assemble call','A cut-off team rally in Ultron contrasts with the full call in Endgame’s climactic battle.',['aou','endgame'],['steve']],
['endgame-funeral','Tony’s death and the legacy he leaves','Tony’s sacrifice closes the Infinity Saga and casts a shadow over Spider-Man’s later choices.',['ironman','avengers','endgame','spider-man-far-from-home','homecoming'],['tony'],['arc']],
['sam-inherits-shield','Captain America’s shield changes hands','Steve passes the shield to Sam; the decision is challenged and explored in Falcon and the Winter Soldier and Brave New World.',['ca1','endgame','the-falcon-and-the-winter-soldier','captain-america-brave-new-world'],['steve','role-sam-wilson'],['captain-shield']],
['natasha-consequences','Natasha’s final choice reverberates','The Vormir mission affects Clint, Yelena and others, culminating in the Hawkeye confrontation.',['black-widow','endgame','hawkeye','thunderbolts'],['role-yelena-belova']],
['black-widow-post','Val targets Clint through Yelena','A Black Widow post-credit meeting sets up Yelena’s conflict and later reckoning in Hawkeye.',['black-widow','hawkeye','thunderbolts'],['role-yelena-belova']],
['thor-loki-loss','Thor repeatedly loses and regains family','The Dark World, Ragnarok, Infinity War and Endgame build one grief-and-family thread, but TVA Loki is a timeline variant.',['thor','thor-the-dark-world','thor-ragnarok','infwar','endgame','loki'],['lokic','role-thor-odinson']],
['banner-hulk','Banner and Hulk negotiate control','Banner struggles with transformation, resists fighting during Infinity War and later returns as an integrated form.',['the-incredible-hulk','avengers','thor-ragnarok','infwar','endgame','she-hulk-attorney-at-law'],[]],
['rhodey-war-machine','Rhodey inherits and changes Stark armor','Tony’s friend develops from military liaison into War Machine, fights in the major Avengers battles and survives the Snap.',['ironman','iron-man-2','iron-man-3','aou','captain-america-civil-war','infwar','endgame'],['tony'],['arc']],
// magic and Vision
['wanda-hex','Wanda creates the Hex','Westview is transformed into an enforced sitcom reality while Wanda grieves Vision’s death.',['infwar','endgame','wandav','agatha-all-along'],['wanda','vision','agatha-harkness']],
['white-vision','SWORD rebuilds Vision’s body','The reconstructed White Vision leaves Westview with recovered memories; the Vision-centered follow-up was announced by Marvel.',['aou','infwar','wandav','visionquest'],['vision'],['stones']],
['agatha-spell','Wanda leaves Agatha enchanted','Agatha’s Westview predicament at the end of WandaVision directly creates the opening situation in Agatha All Along.',['wandav','agatha-all-along'],['wanda','agatha-harkness']],
['billy-wiccan','Billy’s identity crosses the witchcraft shows','Wanda’s son is introduced in Westview and his history is revealed through the later coven story.',['wandav','agatha-all-along'],['wanda','billy-maximoff']],
['witches-road-ballad','The Ballad drives the witches’ journey','The recurring song functions as music, narrative device and clue within Agatha’s series.',['agatha-all-along'],['agatha-harkness'],['witches-ballad']],
['agatha-vision-trilogy','Marvel’s witchcraft / Vision television trilogy','Marvel identifies WandaVision, Agatha All Along and VisionQuest as a trilogy; shared branding does not establish an unreleased plot.',['wandav','agatha-all-along','visionquest'],['vision','ultron'],[], 'mcu'],
['darkhold-story','The Darkhold influences Wanda and Agatha','The magical book seen around Agatha is used by Wanda in the events leading to Multiverse of Madness.',['wandav','agatha-all-along','dsmom'],['wanda','agatha-harkness'],['darkhold']],
['strange-multiverse','Strange’s multiverse role expands','Strange uses the Time Stone, then helps Peter with a memory spell and meets America Chavez in alternate realities.',['doctor-strange','infwar','endgame','nwh','dsmom'],['strange']],
['dreamwalking','The Darkhold enables dreamwalking','The book’s influence culminates in Wanda possessing a variant of herself during her attempt to find her children.',['wandav','dsmom'],['wanda'],['darkhold']],
['wundagore','Wundagore and the Darkhold','The story of Wanda’s magical identity intersects with the Darkhold and the Wundagore temple.',['wandav','dsmom'],['wanda'],['darkhold']],
['vision-ultron-return','Ultron’s role in Vision’s origin','Marvel confirms James Spader’s return as Ultron for VisionQuest; the series outcome is not yet established.',['aou','wandav','visionquest'],['vision','ultron'],[], 'mcu'],
// Ten Rings / Stark
['afghanistan-ambush','Ten Rings attack Tony’s convoy','The organization’s attack sets the MCU in motion; it is distinct from the ring-shaped mystical artifacts.',['ironman','shang-chi-and-the-legend-of-the-ten-rings'],['tony','role-wenwu'],['ten-rings-organization']],
['killian-mandarin','A fake Mandarin masks an Extremis plan','Iron Man 3 presents Trevor as a manufactured persona, later revisited in All Hail the King and Shang-Chi.',['iron-man-3','project-marvel-one-shot-all-hail-the-king','shang-chi-and-the-legend-of-the-ten-rings'],[],['ten-rings-organization']],
['wenwu-history','Wenwu connects the criminal group to the weapons','Shang-Chi clarifies that the organization and the ancient Ten Rings artifacts are related but not the same entity.',['ironman','iron-man-3','project-marvel-one-shot-all-hail-the-king','shang-chi-and-the-legend-of-the-ten-rings'],['role-wenwu'],['ten-rings-organization','ten-rings-weapons']],
['shangchi-beacon','The ten artifacts send an unexplained signal','Shang-Chi’s post-credit discussion examines the rings and leaves their origin/signaling as an unresolved question.',['shang-chi-and-the-legend-of-the-ten-rings'],['role-shang-chi'],['ten-rings-weapons']],
['tony-peter-mentor','Tony mentors Peter and leaves a difficult legacy','Homecoming establishes Peter’s mentor; Infinity War and Endgame show their bond, while Far From Home explores the aftermath.',['captain-america-civil-war','homecoming','infwar','endgame','spider-man-far-from-home'],['tony','spidey']],
['edith','EDITH passes to Peter','Stark’s posthumous technology becomes the focus of Mysterio’s deception and Peter’s later reputation crisis.',['endgame','spider-man-far-from-home','nwh'],['tony','spidey']],
// Spider-Man / Sony / Fox
['nwh-past-peters','Three Peter Parkers work together','No Way Home brings actors from separate live-action continuities together but does not merge their original timelines.',['sm1','sm2','sm3','asm1','asm2','homecoming','nwh'],['spidey']],
['docock-redeemed','Otto Octavius crosses realities','Spider-Man 2 establishes Doctor Octopus, who later appears via the spell in No Way Home.',['sm2','nwh'],['docock']],
['osborn-green-goblin','Norman Osborn crosses realities','The original Raimi-era Green Goblin returns to confront the MCU’s Spider-Man.',['sm1','nwh'],['spidey']],
['garfield-gwen','Andrew Peter’s grief informs No Way Home','A loss in Amazing Spider-Man 2 shapes Andrew’s Peter when he helps his counterpart.',['asm2','nwh'],['spidey']],
['spider-symbiote','Venom’s fragment remains behind','The Venom films and No Way Home share a brief multiversal crossover without a permanent universe merger.',['venom','venom2','nwh','venom-the-last-dance'],['venomc']],
['spiderverse-2099','Miles and Spider-Man 2099 disagree','The animated Spider-Verse’s canon-event dispute is part of its own continuity, not a proven collision with the live-action MCU.',['itsv','atsv','btsv'],['miles']],
['fox-xmen-timeline','The Fox X-Men timeline is revised','Days of Future Past uses time travel to alter the outcome of earlier X-Men films; Logan’s exact placement is not reduced to a simple canon claim.',['xmen','x2','x-men-the-last-stand','xfc','dofp','x-men-apocalypse','dark-phoenix','logan'],['wolverine']],
['deadpool-tva','Deadpool encounters the TVA','The agency introduced in Loki connects Deadpool’s Fox-era character to the multiverse storyline without changing his prior screen history.',['dp','dp2','loki','dpw'],['deadpool','wolverine']],
['torch-fox-void','Fox Human Torch appears in the Void','Chris Evans reprises the 2005-continuity Johnny Storm in Deadpool & Wolverine, distinct from both Steve Rogers and the 2025 Fantastic Four Johnny.',['ff05','fantastic-four-rise-of-the-silver-surfer','dpw','ff'],['role-johnny-2005','role-johnny-2025']],
['elektra-void','Elektra returns in the Void','The earlier Daredevil and Elektra continuity receives a cameo in Deadpool & Wolverine.',['project-daredevil-2003','project-elektra','dpw'],[]],
['blade-void','The earlier Blade continuity resurfaces','Wesley Snipes reprises Blade in Deadpool & Wolverine as a cameo; this does not equate the old films with the main MCU timeline.',['project-blade-1998','project-blade-ii','project-blade-trinity','dpw'],[]],
['gambit-void','Gambit receives a live-action appearance','Channing Tatum plays Gambit in Deadpool & Wolverine; it is not an appearance in the original Fox X-Men ensemble films.',['xmen','dpw'],['role-gambit-dpw']],
['ff-doomsday','The new Fantastic Four meet wider franchises','Marvel’s Kevin Feige has described the team’s connection to Doomsday and interactions with Avengers and X-Men, without announcing a detailed full plot.',['ff','doomsday'],['role-reed-2025','role-johnny-2025'],[], 'mcu'],
['doom-rdj-not-tony','Same actor, different fictional identity','Robert Downey Jr. portrays both Tony Stark in released films and the officially announced Doctor Doom; actor identity alone is not an in-universe character link.',['ironman','endgame','doomsday'],['tony','role-doctor-doom']],
// Guardians cosmic
['orb-power-stone','The Orb holds the Power Stone','Peter Quill steals an Orb that becomes part of the wider Infinity Stones conflict.',['guardians-of-the-galaxy','infwar','endgame'],['thanos'],['stones']],
['collector-aether','The Reality Stone reaches the Collector','Asgardians place the Aether in the Collector’s custody, contributing to the eventual Stone hunt.',['thor-the-dark-world','guardians-of-the-galaxy','infwar'],[],['stones']],
['nebula-turn','Nebula’s loyalty shifts','Nebula’s rivalry with Gamora gives way to cooperation, and her earlier 2014 self complicates the Time Heist.',['guardians-of-the-galaxy','guardians-of-the-galaxy-vol-2','infwar','endgame','guardians-of-the-galaxy-vol-3'],[]],
['rocket-origin','Rocket’s origin is revealed','Guardians Vol. 3 recontextualizes Rocket’s fear, anger and relationships from earlier movies.',['guardians-of-the-galaxy','guardians-of-the-galaxy-vol-2','the-guardians-of-the-galaxy-holiday-special','guardians-of-the-galaxy-vol-3'],[]],
['mantis-peter','Mantis and Peter are family','The Holiday Special reveals an important connection relevant to the evolving Guardians family.',['guardians-of-the-galaxy-vol-2','the-guardians-of-the-galaxy-holiday-special','guardians-of-the-galaxy-vol-3'],[]],
['thanos-gamora','Thanos and Gamora at Vormir','A father–daughter relationship established across the Guardians films becomes central to the Soul Stone’s acquisition.',['guardians-of-the-galaxy','guardians-of-the-galaxy-vol-2','infwar','endgame'],['thanos'],['stones']],
['captainmarvel-pager','Fury’s pager introduces Carol to the Avengers','The Captain Marvel end-credit and Endgame story follow the pager signal after the Snap.',['captain-marvel','infwar','endgame'],[]],
['kamala-bangle','Kamala’s bangle and Carol’s powers','Ms. Marvel establishes an artifact and hero who subsequently crosses into The Marvels.',['ms-marvel','the-marvels'],[]],
['monica-wanda','Monica’s relationship to Wanda influences her own story','Monica experiences the Hex during WandaVision and returns with developing powers in The Marvels.',['captain-marvel','wandav','the-marvels'],['wanda']],
['beast-marvels','Beast appears in The Marvels','The Marvels mid-credit visit suggests a different reality and shows an X-Men-related character; it does not identify every continuity detail.',['xmen','dofp','the-marvels','doomsday'],['role-beast-fox']],
// Wakanda / streets
['wakanda-tchalla','The mantle of Black Panther passes','T’Challa’s death is addressed in Wakanda Forever and Shuri assumes a changed position of responsibility.',['black-panther','infwar','endgame','black-panther-wakanda-forever'],['role-shuri']],
['namor-wakanda','Wakanda’s conflict with Talokan','Wakanda Forever introduces Namor and Talokan; Doomsday has announced the return of the actor, not an entire confirmed plot.',['black-panther-wakanda-forever','doomsday'],['role-namor']],
['vibranium-global','Vibranium crosses several storylines','Wakanda’s metal links Cap’s shield, Vision’s body, Ultron’s plans and later Wakandan technological developments.',['ca1','aou','captain-america-civil-war','black-panther','infwar','black-panther-wakanda-forever'],['vision'],['captain-shield']],
['riri-intro','Riri Williams builds on powered-armor technology','Riri appears with her own armor in Wakanda Forever before her solo Ironheart story; this is not proof Tony personally mentored her.',['ironman','black-panther-wakanda-forever','ironheart'],['tony']],
['kingpin-crossovers','Wilson Fisk’s return connects crime stories','Fisk appears in Daredevil, Hawkeye, Echo and Born Again, tying parts of the New York crime story together.',['dd','defenders','hawkeye','echo','bornagain','bornagain-2'],['kingpin']],
['maya-echo','Maya Lopez’s role expands','Hawkeye introduces Maya and Echo explores her family, past and relationship with Fisk.',['hawkeye','echo','bornagain'],['kingpin']],
['matt-shehulk','Matt Murdock appears beyond Hell’s Kitchen','Daredevil’s later appearances connect his Netflix-era history with a legal episode in She-Hulk and with Born Again.',['dd','nwh','she-hulk-attorney-at-law','echo','bornagain'],['daredevil']],
['punisher-streets','Frank Castle re-enters Daredevil’s story','The Punisher is introduced via Daredevil and carries forward into later MCU-related street-level projects.',['dd','the-punisher','bornagain','the-punisher-one-last-kill'],[]],
['defenders-hand','The Hand brings the Defenders together','Events across the Netflix-era solo shows converge in The Defenders, with later consequences for Matt and Elektra.',['dd','jessica-jones','luke-cage','iron-fist','defenders','the-punisher'],[]],
['jessica-luke','Jessica and Luke cross paths','The Netflix-era street-level relationship is established in Jessica Jones before their Defenders team-up.',['jessica-jones','luke-cage','defenders'],[]],
['agent-carter-shield','Peggy’s intelligence work precedes SHIELD','Peggy Carter’s story follows the First Avenger and intersects with Howard Stark, the SSR and SHIELD lore.',['ca1','agentcarter','tws','endgame'],['steve']],
['hydra-inside-shield','HYDRA infiltrates SHIELD','The Winter Soldier reveal drives both the film and direct fallout in Agents of S.H.I.E.L.D.; some TV canon questions remain separate.',['ca1','avengers','tws','shield','aou'],[],[], 'tv'],
// Multiverse / variants
['america-chavez','America Chavez crosses realities','America’s uncontrolled travel and Strange’s actions involve the multiverse and an alternate Illuminati. The 2025 Fantastic Four and Doomsday are not established participants in those scenes.',['nwh','dsmom'],['strange']],
['captain-carter-variant','Different Captain Carter incarnations','What If...? and Multiverse of Madness feature Peggy Carter variations; matching names alone does not establish an identical variant.',['ca1','whatif','dsmom'],[]],
['professor-x-variant','Professor X is depicted across realities','Patrick Stewart’s Fox incarnation and an alternate-reality Xavier appear in different screen narratives; they should not be conflated.',['xmen','dofp','logan','dsmom','doomsday'],['role-xavier-fox']],
['spiderverse-realities','Spider-people belong to different screen continuities','Spider-Verse, Sony live action, Raimi, Amazing and MCU Spider-Man stories share a superhero concept without being one flat timeline.',['sm1','asm1','homecoming','itsv','atsv','nwh'],['spidey','miles']],
['sylvie-he-who-remains','Loki’s TVA decisions impact multiverse stories','Loki and Sylvie’s encounter with He Who Remains changes the TVA’s role; do not assume a specific unreleased crossover.',['endgame','loki','dpw','dsmom'],['lokic']],
['deadpool-logan-variant','The Deadpool & Wolverine Logan is a variant','The 2017 Logan ending is acknowledged, while the 2024 film follows another Wolverine version.',['logan','dpw'],['wolverine']],
// Recurring props, post-credit chains and visual references
['mjolnir-chain','Mjolnir travels across Thor’s films','The hammer is gained, stolen, shattered, revisited through time travel and reconstructed, reflecting different rules in each movie.',['thor','avengers','aou','thor-ragnarok','endgame','thor-love-and-thunder'],['role-thor-odinson','steve'],['mjolnir']],
['tesseract-chain','The Tesseract’s on-screen travel','The Space Stone container changes hands from HYDRA to SHIELD to Loki to Asgard and later drives time-travel and TVA consequences.',['ca1','avengers','thor-ragnarok','infwar','endgame','loki'],['lokic'],['tesseract','stones']],
['mindstone-chain','The Mind Stone changes function','From scepter to Vision’s forehead and the Infinity Gauntlet, the Stone shapes Ultron, Wanda’s powers and Vision’s fate.',['avengers','aou','infwar','endgame','wandav','dsmom'],['vision','wanda'],['stones']],
['orb-chain','Power Stone and the Orb','The Orb in Guardians becomes a major Infinity Stone, later revisited during Endgame’s 2014 mission.',['guardians-of-the-galaxy','infwar','endgame'],[],['stones']],
['eyestone-chain','The Eye of Agamotto as a Stone vessel','Strange employs the Time Stone inside the Eye until Thanos takes it, after which the story revisits earlier Stones.',['doctor-strange','infwar','endgame'],['strange'],['stones']],
['shield-chain','Captain America’s shield across generations','The shield is carried by Steve, damaged against Thanos and eventually becomes the burden Sam must choose to carry.',['ca1','tws','captain-america-civil-war','infwar','endgame','the-falcon-and-the-winter-soldier','captain-america-brave-new-world'],['steve','role-sam-wilson'],['captain-shield']],
['arc-reactor-chain','Tony’s arc reactor is transformed','An early life-support invention grows into armor, iconography and a visual symbol used throughout Tony’s saga.',['ironman','iron-man-2','iron-man-3','avengers','aou','infwar','endgame'],['tony'],['arc']],
['darkhold-chain','The Darkhold crosses magical stories','The book appears in different television and movie contexts; any connections to earlier ABC shows require a separate continuity disclaimer.',['shield','runaways','wandav','agatha-all-along','dsmom'],['wanda','agatha-harkness'],['darkhold']],
['postcredit-nick-fury','The Avengers Initiative grows from a post-credit visit','Nick Fury’s meeting at the end of Iron Man foreshadows the assembled team.',['ironman','iron-man-2','thor','ca1','avengers'],['tony','steve']],
['postcredit-thanos','A hidden antagonist becomes central','Thanos is glimpsed in earlier team-up and cosmic stories before Infinity War brings the conflict to Earth.',['avengers','aou','guardians-of-the-galaxy','infwar','endgame'],['thanos'],['stones']],
['postcredit-wakanda','Bucky finds refuge in Wakanda','Civil War’s closing sequence places Bucky in Wakanda and helps explain his later return.',['captain-america-civil-war','black-panther','infwar','the-falcon-and-the-winter-soldier'],['role-bucky-barnes']],
['postcredit-fury-page','Fury calls Captain Marvel','The pager and Carol’s subsequent arrival connect the Infinity War aftermath to Captain Marvel and Endgame.',['captain-marvel','infwar','endgame'],[],[]],
['postcredit-venom','Venom arrives briefly in the MCU','A symbiote fragment is left after a multiverse interlude, but no automatically assumed identity or later owner is attached.',['venom2','nwh','venom-the-last-dance'],['venomc']],
['postcredit-agatha','WandaVision introduces Agatha’s follow-up','Agatha remains bound by Wanda’s final enchantment, establishing the later series opening.',['wandav','agatha-all-along'],['agatha-harkness']],
['postcredit-eternals','Eternals introduces another cosmic future','The late-film appearances of Eros and other mysterious figures remain setup rather than verified links to an unreleased Avengers plot.',['eternals'],[]],
['postcredit-midnight','Moon Knight and the supernatural special','Moon Knight and Werewolf by Night each bring supernatural material to the screen, but a direct in-universe team-up has not been established.',['moon-knight','werewolf-by-night'],[],[]],
['postcredit-fantastic','Fantastic Four lead toward Doomsday','Marvel explicitly states First Steps leads into Doomsday; treat other rumored post-credit details with separate sourcing.',['ff','doomsday'],['role-reed-2025','role-johnny-2025']],
['postcredit-beast','The Marvels opens an X-Men multiverse door','Beast’s appearance creates a relationship with X-Men imagery without establishing that every Fox timeline is the same.',['the-marvels','xmen','doomsday'],['role-beast-fox']],
['wolverine-yellow-costume','The comics-style yellow Wolverine suit','Deadpool & Wolverine brings Wolverine’s recognizable yellow costume into live-action, a production and comic-visual reference rather than a new timeline.',['xmen','logan','dpw'],['wolverine']],
['stan-lee-cameos','Stan Lee’s recurring appearances','Lee appears in many Marvel adaptations; an appearance is a production Easter egg, not evidence that all characters live in one continuity.',['sm1','xmen','ironman','avengers','infwar','endgame'],[],[]],
];
// ── Less central screen adaptations receive accurate CONTEXT, not invented crossovers.
const SECONDARY=[
 ['abomination-returns','The Abomination reappears','The adversary first confronted by Bruce Banner is subsequently shown in an underground fighting scene and appears in Jennifer Walters’s legal story.',['the-incredible-hulk','shang-chi-and-the-legend-of-the-ten-rings','she-hulk-attorney-at-law']],
 ['ross-red-hulk','General Ross across the saga','Ross pursues Banner in The Incredible Hulk, represents government oversight in Civil War and is central to Brave New World.',['the-incredible-hulk','captain-america-civil-war','infwar','captain-america-brave-new-world']],
 ['leader-setup','Samuel Sterns and the Leader','Samuel Sterns is exposed to Banner’s blood in The Incredible Hulk and subsequently returns in Brave New World.',['the-incredible-hulk','captain-america-brave-new-world']],
 ['ironheart-magic','Riri Williams and new technology','Ironheart continues Riri’s story following her introduction in Wakanda Forever, but does not assert that Stark personally taught her.',['black-panther-wakanda-forever','ironheart']],
 ['captainmarvel-skrulls','The Skrulls and Nick Fury','Captain Marvel’s 1990s Skrull contact sets context for the Fury-centered Secret Invasion narrative and events involving Carol.',['captain-marvel','secret-invasion','the-marvels']],
 ['marvels-kamala','Kamala and Carol exchange places','The Ms. Marvel ending and The Marvels premise link Kamala to Carol and Monica.',['ms-marvel','wandav','captain-marvel','the-marvels']],
 ['wonderman-film-industry','Hollywood within superhero storytelling','Wonder Man follows Simon Williams in an acting-industry setting; its connection to earlier projects is entertainment/production context, not an assumed Avengers membership.',['wonder-man','iron-man-3'], 'production'],
 ['eternals-celestials','Celestials and ancient Earth','Eternals explores ancient cosmic influence and ends with unresolved consequences; it should not be linked to unreleased Doom plots as though confirmed.',['eternals','guardians-of-the-galaxy','thor-love-and-thunder'],'production'],
 ['moonknight-egypt','Moon Knight and supernatural Marvel','Moon Knight introduces Egyptian deities and an internally divided superhero; no shared on-screen team-up with Werewolf by Night is asserted.',['moon-knight','werewolf-by-night'],'production'],
 ['werewolf-bloodstone','The Bloodstone and monster hunters','Werewolf by Night introduces a hunter competition and the Bloodstone; do not invent an encounter with Marc Spector.',['werewolf-by-night','moon-knight'],'production'],
 ['wakanda-history','Wakandan vibranium retrieval across ages','Eyes of Wakanda follows earlier Wakandan missions to recover vibranium; it is related to Wakandan worldbuilding without claiming the same character cast as Black Panther.',['eyes-of-wakanda','black-panther','black-panther-wakanda-forever']],
 ['groot-childhood','Baby Groot in standalone shorts','I Am Groot depicts Baby Groot, a character appearing across Guardians films, in standalone animated adventures.',['i-am-groot','guardians-of-the-galaxy','guardians-of-the-galaxy-vol-2','guardians-of-the-galaxy-vol-3']],
 ['animated-zombies','Marvel Zombies develops an alternate scenario','What If...? depicts a zombie outbreak in an alternate reality; Marvel Zombies expands that premise. It is not the regular MCU main timeline.',['whatif','marvel-zombies']],
 ['friendly-spider-variant','An animated alternate Spider-Man origin','Your Friendly Neighborhood Spider-Man uses an animated alternate premise. Shared Peter Parker names do not establish that this is the Tom Holland character.',['your-friendly-neighborhood-spider-man','homecoming','whatif'],'production'],
 ['xmen-animation','X-Men 97 continues the nineties cartoon','Marvel presents X-Men 97 as a continuation of the earlier X-Men animated-series timeline; Fox live-action films are separate adaptations.',['x-men-97','xmen','atsv'],'production'],
 ['sony-hunter','Sony antagonist-character adaptations','Kraven the Hunter and Morbius are Sony screen adaptations. Studio relationship is not on-screen proof they personally meet.',['kraven','morbius','venom','madame-web'],'production'],
 ['madameweb-separate','Madame Web is a separate screen take','Madame Web uses Spider-Man-associated comics characters in a separate live-action adaptation; no automatic MCU or No Way Home continuity bridge is established.',['madame-web','venom','nwh'],'production'],
 ['morbius-vulture','Vulture crosses Sony continuities','Morbius has a mid-credit appearance of Vulture after multiverse disruption; the MCU connection should not be mistaken for a unified chronological canon.',['homecoming','nwh','morbius']],
 ['wolverine-origin-film','Wolverine’s origins and Weapon X','X-Men Origins: Wolverine, X-Men and Logan involve incarnations of Logan amid the Fox franchise’s revised timeline.',['x-men-origins-wolverine','xmen','x2','dofp','logan']],
 ['wolverine-japan','Wolverine’s Japan journey','The Wolverine follows Logan after events connected to The Last Stand; it is part of Fox’s original set of adaptations.',['x-men-the-last-stand','the-wolverine','dofp']],
 ['darkphoenix-redux','Dark Phoenix appears in two Fox eras','The Jean Grey / Phoenix storyline is explored in The Last Stand and again in the younger-cast Dark Phoenix; they are not successive episodes of one uninterrupted character timeline.',['x-men-the-last-stand','dofp','x-men-apocalypse','dark-phoenix']],
 ['new-mutants-standalone','The New Mutants in the Fox-era slate','The New Mutants is a separate mutant-focused Fox film; it is not an established direct sequel to Logan or the core Avengers films.',['the-new-mutants','xmen'],'production'],
 ['ff-2015-separate','The 2015 Fantastic Four reboot is distinct','The 2015 reboot, the 2005 films and the 2025 First Steps production are different screen continuities and performers.',['fantastic-four-2015','ff05','ff'],'production'],
 ['fox-ff-silver-surfer','Galactus and Silver Surfer enter Fox Fantastic Four','Rise of the Silver Surfer is the direct 2007 sequel to the 2005 team film and not a sequel to First Steps.',['ff05','fantastic-four-rise-of-the-silver-surfer','ff'],'production'],
 ['cloakdagger-runaways','The Freeform-Hulu young heroes crossover','Tandy and Tyrone from Cloak & Dagger appear in Runaways; this is an explicit television crossover, not just shared Marvel branding.',['cloak-dagger','runaways']],
 ['inhumans-other-tv','The Inhumans appear in distinct ABC-era shows','Inhuman story material appears in Agents of SHIELD and the Inhumans series; treating a comics species as identical on-screen storytelling requires care.',['shield','inhumans'],'production'],
 ['helstrom-horror','Helstrom occupies a separate Marvel Television category','Helstrom explores its own horror family and was developed under Marvel Television; no Avengers encounter is established.',['helstrom','werewolf-by-night','moon-knight'],'production'],
 ['hitmonkey-animation','Hit-Monkey is a distinct animated adaptation','Hit-Monkey and MODOK are adult animated Marvel adaptations, not parts of the MCU live-action timeline by default.',['hit-monkey','m-o-d-o-k','whatif'],'production'],
 ['legion-fox','Legion and Fox X-Men are related adaptations','Legion involves David Haller, a character connected to Charles Xavier in Marvel lore; the TV continuity is not identical by default to the Fox movies.',['legion','xmen','the-gifted'],'production'],
 ['gifted-mutants','The Gifted depicts mutant persecution','The Gifted follows a mutant society with X-Men references in a different TV narrative from the Fox cinema timeline.',['the-gifted','xmen','legion'],'production'],
 ['generationx-earlier','Generation X precedes cinematic X-Men','Generation X (1996) is an earlier live-action Marvel mutant adaptation, not a prequel to the later Fox X-Men movies.',['generation-x','xmen','x-men-97'],'production'],
 ['spiderham-prequel','Spider-Ham shorts and the Spider-Verse','The Spider-Ham short follows a comic character also seen in Into the Spider-Verse; keep the animation franchise separate from the MCU.',['spider-ham-caught-in-a-ham','itsv','atsv']],
 ['secretwars-upcoming','Secret Wars is a planned later installment','Avengers: Secret Wars follows Doomsday on Marvel’s announced slate; do not fabricate characters, kills or cameo scenes before release.',['doomsday','sw'],'production'],
 ['brandnewday-upcoming','Peter’s continuing standalone films','Brand New Day is part of Peter Parker’s MCU film series, but the dataset does not assert hidden plot details.',['homecoming','spider-man-far-from-home','nwh','spider-man-brand-new-day'],'production'],
 ['iron-fist-legacy','Danny Rand leads toward the Defenders','Iron Fist introduces Danny Rand; the crossover brings him together with Daredevil, Jessica Jones and Luke Cage.',['iron-fist','defenders','luke-cage','dd']],
 ['infinity-watch','The Watcher observes alternate outcomes','What If...? explores realities distinct from the mainline and includes animated variations on Avengers-era events.',['whatif','avengers','infwar','aou'],'production'],
 ['blade-fox-era','Blade’s original film continuity','The Blade trilogy tells a self-contained vampire-hunter story, and a version of the character appears in Deadpool & Wolverine via the Void.',['project-blade-1998','project-blade-ii','project-blade-trinity','dpw']],
 ];
for(const item of SECONDARY){const [code,title,desc,ps,kind='story']=item;story(code,title,desc,ps,{edgeType:kind,spoiler:kind==='production'?0:2,universe:kind==='production'?'x':'mcu'});}
// A source-backed distinction for the animated franchise, including separation from Fox cinema.
link('x-men-97','xmen','production','Animated revival is not Fox film continuity','Marvel describes X-Men 97 as new stories in the 1990s animated-series timeline; the 2000 Fox films are a different adaptation.',0,'official','https://www.marvel.com/articles/tv-shows/sdcc-2022-marvel-studios-animation-panel');
link('eyes-of-wakanda','black-panther','production','Wakandan vibranium history','Marvel states that Eyes of Wakanda follows warriors retrieving vibranium artifacts throughout Wakandan history.',0,'official','https://www.marvel.com/articles/tv-shows/marvel-studios-animation-what-if-season-2');

for(const entry of B){const [code,label,text,films,who=[],props=[],uni='mcu']=entry;story(code,label,text,films,{actors:who,props,universe:uni,spoiler:2});}
// A handful of fully source-backed distinctions: URLs support ONLY the specific claims.
link('ironman','ten-rings-organization','story','2008 Ten Rings antagonists','Marvel’s official MCU guidebook identifies the Ten Rings as one of Iron Man (2008)’s enemies; this is the criminal organization, not the ten magical bands.',0,'official',REF.iron);
link('endgame','loki','story','2012 escape creates TVA variant','Marvel’s Loki episode recap explicitly states that Loki escapes with the Tesseract during Endgame’s 2012 Time Heist.',2,'official',REF.end);
link('aou','visionquest','story','Ultron’s announced return','Marvel confirms that James Spader reprises Ultron in VisionQuest; this proves casting, not any detailed unreleased scenes.',0,'official',REF.vision);
link('wandav','visionquest','continuation','Confirmed TV trilogy','Marvel officially describes VisionQuest as the third series after WandaVision and Agatha All Along.',0,'official',REF.vision);
link('agatha-all-along','visionquest','continuation','Confirmed TV trilogy part 2 → 3','Marvel’s May 2026 announcement names these installments as parts of one TV trilogy.',0,'official',REF.vision);
link('ff','doomsday','continuation','Kevin Feige on the upcoming crossover','Marvel quotes Feige describing the Fantastic Four interacting with Avengers and X-Men in Doomsday; no unannounced plot detail is assumed.',0,'official',REF.ff);
link('black-widow','hawkeye','continuation','Yelena follows Natasha’s legacy','Marvel’s official Yelena profile lists Black Widow, Hawkeye and Thunderbolts* as her on-screen history.',2,'official',REF.yelena);
// Explicit one-screen connections that a text-first catalogue otherwise misses.
const directed=[
['ironman','ten-rings-organization','character','Kidnapping sparks Iron Man','Tony is taken captive by the Ten Rings organization, a first-film origin that gains meaning in Shang-Chi.'],
['role-wenwu','ironman','reference','Wenwu’s criminal empire predates the film','Shang-Chi later identifies Wenwu as the organization’s leader; do not place the mystical rings on-screen in the 2008 ambush.'],
['role-wenwu','iron-man-3','reference','The Mandarin identity is appropriated','Killian borrows a name associated with Wenwu’s legend; the staged terrorist does not portray Wenwu.'],
['role-johnny-2005','dpw','cameo','2005 Human Torch in the Void','Chris Evans reprises a Fox-era Johnny Storm, unrelated to his MCU Steve Rogers identity.'],
['role-johnny-2025','ff','appearance','The 2025 Johnny Storm','Joseph Quinn plays a distinct 2025-version Human Torch. He is NOT the character Chris Evans played in 2005 or in Deadpool & Wolverine.'],
['role-doctor-doom','doomsday','cast','Different actor identity from Tony','Robert Downey Jr. is announced as Victor von Doom: no source says this role is Tony Stark in disguise.'],
['endgame','loki','alternate','Branching 2012 Loki variant','The Loki series follows a Time Heist escapee rather than simply resurrecting the main-timeline 2018 Loki.'],
['infwar','wandav','continuation','Wanda’s loss drives Westview','Vision’s fate and the destroyed Mind Stone are essential context for Wanda’s grief and the Hex.'],
['aou','wandav','continuation','Creation of Vision precedes Westview','Vision’s origin, the loss of Wanda’s brother and the initial team relationship underpin WandaVision.'],
['aou','visionquest','continuation','AI history precedes VisionQuest','Ultron and Vision share an origin in Ultron; Marvel has announced both performers for the 2026 series.'],
['infwar','endgame','continuation','Direct story payoff to the Snap','Endgame confronts and reverses the disaster at the conclusion of Infinity War.'],
['endgame','hawkeye','continuation','Loss shapes Barton’s later life','Clint lives with Natasha’s loss, while Yelena’s separate grief drives a confrontation.'],
['endgame','the-falcon-and-the-winter-soldier','continuation','Steve’s shield decision drives the show','The mantle is passed in Endgame, then Sam considers the burden and meaning of carrying the shield.'],
['captain-america-civil-war','homecoming','continuation','Peter recruited into Avengers conflict','Tony meets Peter and recruits him, establishing mentorship before Homecoming.'],
['aou','captain-america-civil-war','continuation','Sokovia leads to the Accords','Civilian harm and Ultron’s destruction contribute to political demands for superhuman oversight.'],
['tws','shield','continuation','HYDRA betrayal reshapes SHIELD','The ABC series incorporates fallout from the HYDRA reveal without settling every later continuity question.'],
['ff05','dpw','crossover','Human Torch reprises Fox portrayal','A Chris Evans cameo creates a multiversal link via the Void, NOT a merger of all Fantastic Four incarnations.'],
['ff','doomsday','crossover','Announced First Family and Avengers meeting','Official remarks establish involvement; no individual surprise scenes are confirmed.'],
];for(const [a,b,type,t,d]of directed)link(a,b,type,t,d,type==='cameo'||type==='crossover'?3:2,'editorial');
D.v4={sourceAudit:'2026-10-02',callbackCount:CALLBACKS.length,beatCount:D.nodes.filter(n=>n.id.startsWith('thread-')).length,notes:'Interpretations and legacy CSV statements are not individually independently authenticated. See evidence labels on each edge.',officialSources:Object.values(REF)};
})();
