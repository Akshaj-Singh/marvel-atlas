/* MARVEL ATLAS V5 — conservative, explicitly sourced corrections.
 * This module runs AFTER the archived data modules, BEFORE the application.
 * It changes no original CSV observation. Editorial work is distinguishable from sources.
 */
(()=>{'use strict';
const D=window.MARVEL_DATA,by=new Map(D.nodes.map(n=>[n.id,n]));
const DESCRIPTIONS={
'ant-man':'A former burglar becomes Ant-Man, using a size-changing suit to help protect a powerful technology from misuse. Scott Lang joins the MCU through a smaller-scale heist story.',
'ant-man-and-the-wasp':'Scott Lang and Hope van Dyne undertake a rescue mission involving the Quantum Realm. The film develops the Pym family history and the technology later important to Avengers: Endgame.',
'ant-man-and-the-wasp-quantumania':'Scott Lang and his family are drawn into the Quantum Realm, where they encounter Kang. This installment explores the unusual microscopic world and its inhabitants.',
'black-panther':'T’Challa returns to Wakanda to take the throne, confronting a challenger whose arguments expose old divisions over Wakanda’s responsibility to the wider world.',
'black-panther-wakanda-forever':'Wakanda responds to the death of its king as Queen Ramonda and Shuri face an international crisis involving Talokan and its ruler Namor.',
'black-widow':'Natasha Romanoff revisits the Red Room program and reconnects with people who once posed as her family, revealing the costs of the life she left behind.',
'captain-america-brave-new-world':'Sam Wilson navigates international tensions as the new Captain America, pursuing a conspiracy involving the United States presidency and a new source of geopolitical conflict.',
'captain-america-civil-war':'Disagreement over oversight of the Avengers becomes personal when Steve Rogers defends Bucky Barnes and Tony Stark takes a different position. The team fractures.',
'captain-marvel':'Carol Danvers investigates her lost past during a conflict involving the Kree and Skrulls, uncovering her human identity and the origins of her remarkable powers.',
'cloak-dagger':'Two New Orleans teenagers discover paired powers and a mysterious bond, then investigate the injustices connected to the events that changed their lives.',
'dark-phoenix':'Jean Grey is transformed by a dangerous cosmic force while the X-Men struggle with loyalty, fear, and their attempts to protect both Jean and the world.',
'doctor-strange':'Injured surgeon Stephen Strange studies the mystic arts and learns to defend reality from supernatural threats, eventually confronting a force that cannot be defeated through conventional combat.',
'echo':'Maya Lopez returns to her Oklahoma hometown and confronts her past, her family’s heritage, and the criminal relationships that still shape her life.',
'eternals':'An immortal group living secretly among humans faces the return of the Deviants and a revelation about their mission, history, and relationship with Earth.',
'eyes-of-wakanda':'An animated anthology exploring the history of Wakandan warriors and the pursuit of stolen vibranium across different historical periods.',
'fantastic-four-2015':'A separate adaptation of Marvel’s First Family in which young researchers gain unusual abilities after an experiment with another dimension goes badly wrong.',
'fantastic-four-rise-of-the-silver-surfer':'The 2005 Fantastic Four team confronts a mysterious herald from space and a looming planetary threat. This sequel belongs to the earlier Fox continuity.',
'generation-x':'A television-film adaptation centered on young mutants learning to manage their abilities at a school overseen by experienced mentors; separate from later X-Men film continuity.',
'guardians-of-the-galaxy':'A band of unlikely cosmic outlaws, including Peter Quill, Gamora, Rocket, Groot, and Drax, joins forces around an Infinity Stone and becomes a found family.',
'guardians-of-the-galaxy-vol-2':'The Guardians encounter Peter Quill’s biological father while confronting secrets about his origins and reconsidering what family means to them.',
'guardians-of-the-galaxy-vol-3':'The team races to save Rocket, uncovering his painful history and facing the High Evolutionary. The story brings major changes to the Guardians’ lineup.',
'hawkeye':'Clint Barton is drawn into a New York criminal dispute after Kate Bishop encounters the consequences of his time as Ronin.',
'helstrom':'Two siblings from a dangerous supernatural family investigate occult threats and their own complicated parentage in this television adaptation.',
'hit-monkey':'An animated crime story about a Japanese macaque who becomes an assassin with the help of a deceased hitman’s ghost.',
'i-am-groot':'A collection of animated shorts following Baby Groot through small adventures and misadventures between larger Guardians of the Galaxy stories.',
'inhumans':'The royal family of Attilan is divided by a coup, forcing its members to confront questions about class, identity, and their place beyond their isolated society.',
'iron-fist':'Danny Rand returns to New York after years away, claiming a martial-arts legacy and facing the criminal forces influencing his family’s company.',
'iron-man-2':'Tony Stark grapples with the consequences of revealing his identity, pressure over his armor technology, and the arrival of an adversary tied to his father’s past.',
'iron-man-3':'After the Battle of New York, Tony Stark faces personal trauma and a campaign of attacks connected to the Mandarin name and advanced Extremis technology.',
'ironheart':'Riri Williams, a gifted inventor developing her own armor, becomes entangled with a criminal underworld and magic after returning to Chicago.',
'jessica-jones':'A private investigator with extraordinary strength confronts trauma, manipulation, and a dangerous figure from her past in Marvel’s street-level television stories.',
'legion':'David Haller struggles to understand his psychic abilities and unstable perception of reality in an experimental X-Men-related television continuity.',
'luke-cage':'A Harlem resident with extraordinary strength and resilient skin becomes a reluctant neighborhood protector while confronting organized crime and family history.',
'm-o-d-o-k':'An adult animated comedy portraying the villain M.O.D.O.K. as he tries to balance world domination, work pressures, and a troubled family.',
'madame-web':'A paramedic experiences visions of possible futures and becomes involved in protecting three young women from an approaching threat in Sony’s film continuity.',
'marvel-zombies':'An animated alternate-reality story derived from the zombie outbreak introduced in What If...?, following survivors in a world overrun by infected heroes.',
'moon-knight':'Steven Grant and Marc Spector become entangled with Egyptian deities, dissociative identities, and a conflict over ancient powers.',
'ms-marvel':'Kamala Khan discovers mysterious powers while navigating family expectations, teenage life, and her admiration for Captain Marvel.',
'runaways':'Teenagers uncover their parents’ alarming secret activities and band together to challenge the organization that connects their families.',
'secret-invasion':'Nick Fury returns to confront a covert Skrull infiltration, placing questions of trust and identity at the center of an espionage story.',
'shang-chi-and-the-legend-of-the-ten-rings':'Shang-Chi confronts his father Wenwu and the organization he once served, revealing the history of the Ten Rings and the mythical realm of Ta Lo.',
'she-hulk-attorney-at-law':'Jennifer Walters balances a legal career with her transformation into She-Hulk, encountering superpowered clients and established MCU characters.',
'spider-ham-caught-in-a-ham':'An animated Spider-Ham short connected to the playful visual world of Spider-Man: Into the Spider-Verse, featuring Peter Porker and cartoon-style comedy.',
'spider-man-brand-new-day':'An announced Spider-Man continuation featuring Tom Holland. Specific unreleased plot twists and rumored character appearances should not be treated as established facts.',
'spider-man-far-from-home':'Peter Parker travels to Europe after Endgame, encountering Mysterio while struggling with the responsibilities and expectations left by Tony Stark.',
'the-falcon-and-the-winter-soldier':'Sam Wilson and Bucky Barnes confront the legacy of Captain America, an international extremist movement, and the meaning of the shield after Steve Rogers.',
 'the-gifted':'Parents discover that their children have mutant abilities and enter a struggle involving underground mutant networks and government pursuit in a separate X-Men-related series.',
 'the-guardians-of-the-galaxy-holiday-special':'Mantis and Drax try to find a memorable Christmas present for Peter Quill, while the Guardians spend the holiday season on Knowhere.',
 'the-incredible-hulk':'Bruce Banner searches for a cure while hunted by the military, facing another gamma-powered adversary whose actions escalate the danger.',
 'the-marvels':'Carol Danvers, Monica Rambeau, and Kamala Khan discover their powers have become entangled, forcing them to work together during an interstellar crisis.',
 'the-new-mutants':'A group of young mutants confined to an isolated institution discovers dangerous secrets while confronting the fears embodied by their emerging powers.',
 'the-punisher':'Frank Castle pursues violent criminals while investigating conspiracies surrounding his military history and the murders that drove his vigilantism.',
 'the-punisher-one-last-kill':'A standalone Punisher special that extends Frank Castle’s on-screen story. Consult its official release materials for confirmed plot details.',
 'the-wolverine':'Logan travels to Japan, where a dying acquaintance offers a way to change his life and a conspiracy tests his healing powers.',
 'thor-love-and-thunder':'Thor seeks a new direction after years of conflict while confronting Gorr and reconnecting with Jane Foster, who has become the Mighty Thor.',
 'thor-ragnarok':'Thor confronts Hela and the fall of Asgard, meets familiar allies on Sakaar, and discovers that his powers exceed his hammer.',
 'thor-the-dark-world':'Thor faces a threat involving the Aether, an Infinity Stone, as the Dark Elves seek to use a cosmic alignment to reshape reality.',
 'thunderbolts':'A group of troubled operatives is forced into an uneasy alliance, bringing together familiar characters from earlier MCU films and television stories.',
 'venom-the-last-dance':'Eddie Brock and Venom flee danger while confronting threats connected to their symbiotic relationship, continuing the Sony Venom film series.',
 'werewolf-by-night':'A black-and-white horror special in which hunters assemble for a deadly contest and discover a secret about one of their own.',
 'wonder-man':'An MCU television story centered on actor Simon Williams and the entertainment industry. Separate announced roles from details established by released episodes.',
 'x-men-97':'An animated continuation of the 1990s X-Men cartoon, returning to the team’s struggle to protect mutants against a changing political and social world.',
 'x-men-origins-wolverine':'A story about Logan’s earlier years, his relationship with Victor Creed, and the experiments that permanently change his skeleton.',
 'x-men-apocalypse':'The younger X-Men confront an ancient mutant seeking to reshape the world as the First Class-era team continues to develop.',
 'x-men-the-last-stand':'An attempted mutant cure divides the X-Men and their opponents while Jean Grey’s dangerous Phoenix powers threaten those around her.',
 'your-friendly-neighborhood-spider-man':'An animated alternate-continuity story revisiting Peter Parker’s early years as Spider-Man with a different mentor and supporting cast.'
};
for(const n of D.nodes)if(n.type==='project'&&!n.description?.trim())n.description=DESCRIPTIONS[n.id]||'';
const SOURCES={
vision:{url:'https://www.marvel.com/articles/tv-shows/marvel-television-visionquest-release-date',label:'Marvel official',note:'Officially describes the WandaVision–Agatha–VisionQuest trilogy and confirmed Vision and Ultron cast.'},
fantastic:{url:'https://www.marvel.com/articles/movies/fantastic-four-first-steps-avengers-doomsday-kevin-feige',label:'Marvel official',note:'Confirms the 2025 Fantastic Four characters and their planned Doomsday appearances.'},
rings:{url:'https://marvelcinematicuniverse.fandom.com/wiki/Ten_Rings_(Organization)',label:'Community wiki',note:'Community-compiled organization history, including the Iron Man introduction; not a studio announcement.'},
ringsMovie:{url:'https://www.marvel.com/articles/culture-lifestyle/preview-marvel-studios-shang-chi-and-the-legend-of-the-ten-rings-the-art-of-the-movie-out-in-book-stores-now',label:'Marvel official',note:'Connects Shang-Chi with the Ten Rings organization, not proof of every alleged cameo.'},
cast:{url:'https://www.marvel.com/movies/avengers-doomsday',label:'Marvel official',note:'Announcement-level evidence only; does not establish unshown interactions.'},
spider:{url:'https://www.marvel.com/characters/spider-man-peter-parker',label:'Marvel official',note:'Spider-Man character overview, not evidence that alternate portrayals are identical individuals.'},
loki:{url:'https://www.marvel.com/articles/tv-shows/loki-episode-1-event-report-recap',label:'Marvel official',note:'Explains the alternate 2012 Loki and Tesseract escape.'},
tv:{url:'https://www.marvel.com/tv-shows/',label:'Marvel official index',note:'Confirms a title exists in the official TV catalog; does not validate fan theories.'}
};
function attach(e,k, note){const s=SOURCES[k];e.sourceUrl=s.url;e.sourceLabel=s.label;e.sourceNote=note||s.note; e.provenance=k==='rings'?'community':'confirmed';}
const special={
'nwh|dsmom':{title:'Shared multiverse theme; not a direct consequence',detail:'Both productions involve Stephen Strange and threats associated with alternate realities. However, Multiverse of Madness does not establish that its central conflict was caused by the No Way Home spell. Treat this as a thematic and character connection, not a demonstrated chain of cause and effect.',provenance:'editorial'},
'btsv|nwh':{title:'Multiverse comparison, not a confirmed crossover',detail:'Across the Spider-Verse and No Way Home both explore alternate Spider-people and different visual approaches to the multiverse. This comparison is editorial only; it does not establish a canonical crossover between their depicted stories or confirm participation in an unreleased Spider-Verse sequel.',provenance:'theory'},
'morbius|nwh':{title:'Vulture appears across Sony/MCU-associated worlds',detail:'The Morbius credits scene shows Adrian Toomes after a multiverse displacement. No Way Home provides a separate spell-related setting, but the scene does not settle every rule or chronology behind his arrival. A shared actor and character appearance should not be stretched into a complete theory of Sony continuity.',provenance:'editorial'},
'vault|stones':{title:'Odin’s vault prop, later clarified as a fake',detail:'A gauntlet-like prop appears in Odin’s vault in Thor. Ragnarok later has Hela dismiss that vault object as a fake. This is a production-and-lore connection to the real Infinity Gauntlet rather than proof that Odin possessed Thanos’s functional glove.',provenance:'editorial'},
'jackman|logan':{title:'2017 farewell, later return',detail:'Logan was widely presented as a farewell to Hugh Jackman’s long-running Wolverine role. Deadpool & Wolverine later brought Jackman back as a different Wolverine variant, so describing Logan as his permanently final screen appearance is no longer accurate.',provenance:'editorial'},
'dpw|loki':{title:'The TVA connects the stories; protagonists do not meet on screen',detail:'The Time Variance Authority introduced in Loki also appears in Deadpool & Wolverine, where its operations and personnel drive the premise. This link is institutional rather than evidence that Loki personally appears in the later film or meets Deadpool.',provenance:'editorial'},
'ff05|ff':{title:'Two different Fantastic Four screen continuities',detail:'Fantastic Four (2005) introduced a Fox film incarnation of Reed, Sue, Johnny and Ben, while The Fantastic Four: First Steps introduces a different version of the team. Their matching hero names describe adaptations of comic characters, not a shared film timeline.',provenance:'editorial'},
'dd|bornagain':{title:'Daredevil story and performer continuation',detail:'Charlie Cox and Vincent D’Onofrio reprise Matt Murdock and Wilson Fisk in Daredevil: Born Again after their earlier Netflix appearances. Individual character events and relationships connect the shows, but neither actor’s return alone should be used to settle every separate Marvel Television continuity debate.',provenance:'editorial'},
};
for(const e of D.edges){const spec=special[e.a+'|'+e.b];if(spec)Object.assign(e,spec);if((e.a==='wandav'&&e.b==='visionquest')||(e.a==='agatha-all-along'&&e.b==='visionquest'))attach(e,'vision');if(e.a==='visionquest'&&['vision','ultron','aou'].includes(e.b))attach(e,'vision');if(e.a==='ff'&&e.b==='doomsday')attach(e,'fantastic');if(['ten-rings-organization','ten-rings-weapons'].includes(e.a)&&['ironman','shang-chi-and-the-legend-of-the-ten-rings'].includes(e.b))attach(e,e.b==='ironman'?'rings':'ringsMovie');if(e.a==='endgame'&&e.b==='loki')attach(e,'loki');}
// Flag old mappings instead of laundering them into official credits.
for(const e of D.edges){if(e.source==='seed'&&/supplied project mapping/i.test(e.detail||'')){
 const a=by.get(e.a),b=by.get(e.b),p=a.type==='project'?a:b,c=a.type==='project'?b:a;
 if(p&&c&&e.type==='character'){
  e.title='On-screen role · '+c.label;
  e.detail=`${c.label} is associated with ${p.label} in the original project mapping. This is an appearance-index entry, not evidence that other versions sharing the same character name have an identical history. Open the character and project dossiers to distinguish this portrayal from alternate film and animated continuities. Where a scene-level source is missing, this mapping remains editorial.`;
 }else if(e.type==='actor'){
  e.title='Performer / portrayal mapping';
  e.detail=`${a.label} and ${b.label} are linked by the original actor-and-appearance index. This describes a real-world performer credit or a role association, not a meeting between fictional characters. The precise version of a hero depends on the production and continuity. Consult more specific portrayal records before treating this as a definitive role identification.`;
 }
 e.provenance='editorial';
}}
// V5 audit: repair seed mappings that mixed distinct entities or used vague prose.
for(const e of D.edges){
 if(e.a==='nyc'&&e.b==='captain-shield'&&e.source==='seed'){
  e.b='shield';e.title='The Battle of New York and the S.H.I.E.L.D. series';
  e.detail='The Battle of New York is the major confrontation shown in The Avengers. Agents of S.H.I.E.L.D. is set in the aftermath of the Avengers era, but a TV reference to the battle does not by itself settle the complete canon status of the ABC television series. This reference was incorrectly attached to Captain America’s shield in the original mapping.';
  e.provenance='editorial';
 }
 if(e.source==='seed'&&/supplied project mapping/i.test(e.detail||'')){
  const a=by.get(e.a),b=by.get(e.b),who=a.label,project=b.label;
  if(e.a==='stan'){e.title='Stan Lee cameo in '+project;
   e.detail=`Stan Lee, Marvel’s co-creator, is represented in ${project} through a brief on-screen appearance. This connects a real-world creator to a production, not a recurring fictional character with a single backstory. The original mapping identified a cameo but did not describe the shot or establish an in-universe identity for Lee.`;
  }else if(e.a==='nyc'){
   e.title='Battle of New York · historical reference';
   e.detail=`The Battle of New York originates as the alien invasion in The Avengers and is revisited or referenced by later MCU stories. The ${project} connection is about that established event, not a new battle with identical events. Where this link concerns a series, its chronology and canon questions remain distinct.`;
  }else if(e.a==='snap'){
   e.title='Consequences of Thanos’s Snap';
   e.detail=`Thanos’s Snap, followed by the later restoration of vanished people, establishes a major historical divide in MCU storytelling. ${project} either depicts that event or explores its consequences for surviving characters. This link is an event-level cross-reference, not evidence that every affected character appears in the same scene.`;
  }else if(e.a==='multiverse'){
   e.title='Alternate realities and continuity';
   e.detail=`${project} is indexed with Marvel’s multiverse concept, which allows multiple versions of places, characters and events. This connection identifies a topic or announced saga setting; it does not prove that any particular crossover, actor appearance or shared Earth designation occurs. Unreleased projects should be understood only at the level officially announced.`;
   if(b.status==='upcoming')e.provenance='editorial';
  }
 }
 if(e.sourceUrl){
  let host;try{host=new URL(e.sourceUrl).hostname.toLowerCase()}catch(_){host=''}
  if(host==='apnews.com'){
   e.source='Associated Press reporting';e.sourceLabel='Associated Press';
   e.sourceNote='Independent reporting on announced casting or production; not a Marvel Studios announcement or evidence for unreleased scenes.';
  }else if(host==='www.reuters.com'||host==='reuters.com'){
   e.source='Reuters reporting';e.sourceLabel='Reuters';
   e.sourceNote='Dated entertainment-industry report for the identified casting news; plot details not established by the report are excluded.';
  }else if(host.endsWith('fandom.com')){
   e.source='MCU Wiki · community compiled';e.sourceLabel='Fan-maintained MCU Wiki';
   if(e.provenance==='confirmed')e.provenance='community';
   e.sourceNote='Community-compiled reference, useful for research but not an official studio confirmation; check its citations for the precise scene.';
  }else if(host==='www.marvel.com'||host==='marvel.com'){
   e.sourceLabel='Marvel.com';
   if(!e.sourceNote)e.sourceNote='Marvel-owned page; may supply title, cast or synopsis context but should not be stretched into proof of intentional callbacks.';
  }
 }
}
// Do not disguise cataloguing links as plot: provide an honest 30+ word note for every relation.
const splitWords=s=>(String(s||'').trim().match(/\S+/g)||[]).length;
function qualifier(e,a,b){const s=`${a.label} ↔ ${b.label}. `, source=e.sourceUrl?`A linked ${e.sourceLabel||'reference'} is supplied for the stated part of this relationship; its scope does not automatically verify further interpretations.`:'This entry is an editorial index entry without a scene-level verification link; check the productions or cited research before treating extra interpretations as canon.';
 switch(e.type){
 case 'catalogue':return `${s}These entities are grouped in the same browsing collection to make the atlas navigable. Collection membership is not evidence of an on-screen meeting, a shared timeline, or the same individual across alternate realities. ${source}`;
 case 'actor':case 'portrayal':case 'cast':case 'production':case 'bts':return `${s}This is a real-world actor, casting, or production relationship. It helps follow performers across screen productions; it does not by itself establish that fictional characters meet, share an identity, or belong to one universe. ${source}`;
 case 'character':case 'appearance':case 'identity':case 'family':return `${s}This link concerns a character identity, appearance, or family relationship indexed for the two endpoints. The character name alone cannot prove that every version shown in different continuities is the same person. ${source}`;
 case 'dialogue':case 'theme':case 'visual':return `${s}Read this as a comparison of dialogue, visual framing, or recurring theme. A similarity can be meaningful to viewers without proof that writers intentionally repeated a particular line; the linked note identifies the interpretation. ${source}`;
 case 'crossover':case 'cameo':case 'alternate':case 'same-universe':case 'same':return `${s}The indexed crossover, cameo, or continuity relation must be read in the context specified above. Screen appearances, actor callbacks, multiverse variants, and shared continuity are separate claims, not interchangeable descriptions. ${source}`;
 case 'easter-egg':case 'egg':case 'reference':case 'postcredit':return `${s}This entry documents a reference, Easter egg, or credits connection. The earlier and later appearances should be examined independently: a hidden detail does not necessarily establish a future story payoff, intentional foreshadowing, or identical canon. ${source}`;
 case 'artifact':case 'object':case 'music':case 'place':return `${s}The object, musical cue, or location provides a way to follow recurring elements between screen stories. A reused name or design may refer to a different incarnation or to a production reference rather than one transported artifact. ${source}`;
 default:return `${s}This graph relationship points to a story beat or narrative consequence described above. It is navigable in both directions, but chronology alone does not establish causality; any interpretation beyond the documented scenes is editorial. ${source}`;
 }
}
let generated=0;for(const e of D.edges){const a=by.get(e.a),b=by.get(e.b);if(!a||!b)continue;if(!e.detail)e.detail=`${e.title||'Relationship'}: ${a.label} and ${b.label}.`;if(splitWords(e.detail)<30){e.detail+=' '+qualifier(e,a,b);generated++}if(splitWords(e.detail)<30)throw Error('V5 edge below 30 words '+e.a+' / '+e.b);if(e.sourceUrl&&!e.sourceNote)e.sourceNote='This link is recorded for the specific original claim; confirm that it supports the precise wording before extending the claim.';}
D.v5={descriptionsFilled:Object.keys(DESCRIPTIONS).length,augmentedExplanations:generated,release:'5.0',sourcePolicy:'Only claim-specific evidence counts; unsourced editorial entries remain labeled.'};
})();
