"""Rebuild self-contained graph data from the supplied prototype + CSV + callback notes."""
import re,json,csv,unicodedata,pathlib,collections
root=pathlib.Path(__file__).resolve().parent
old=(root/'sources'/'Original_Prototype.html').read_text(encoding='utf-8')
csv_rows=list(csv.DictReader(open(root/'sources'/'Marvel_Combined_Facts.csv',encoding='utf-8-sig',newline='')))
notes=(root/'sources'/'Callback_Notes.txt').read_text(encoding='utf-8')

def extract(name):
    m=re.search(r'\b(?:const|let)\s+'+name+r'\s*=\s*`([\s\S]*?)`\s*;',old)
    if not m: raise Exception(name+' not found')
    return m.group(1)
N=extract('N');X=extract('X');
# project IDs from prototype retained for backwards logic; reserve distinct shield identifiers
nodes=[]; by_id={}; edges=[]
for line in N.splitlines():
    p=line.split('|');
    if len(p)<7:continue
    id,typ,name,u,year,status,desc=p[:7]
    if id=='shield' and typ=='o': id='captain-shield'
    typ={'p':'project','c':'character','a':'actor','o':'artifact','e':'discovery','d':'dialogue','v':'event'}.get(typ,typ)
    if id in by_id: raise ValueError('duplicate '+id)
    n=dict(id=id,type=typ,label=name,universe=u,year=int(year) if year.isdigit() else None,status='upcoming' if status=='u' else 'released' if status=='r' else None,description=desc,source='seed')
    nodes.append(n);by_id[id]=n
valid_e={'char':'character','actor':'actor','cameo':'cameo','crossover':'crossover','cont':'continuation','dialogue':'dialogue','egg':'easter-egg','object':'artifact','alt':'alternate','same':'same-universe','ref':'reference','bts':'production'}
for line in X.splitlines():
    p=line.split('|');
    if len(p)<7: continue
    a,b,t,title,explain,prov,sp=p[:7]
    if (a,b,t)==('shield','ca1','object') or (a=='shield' and t=='object'):a='captain-shield'
    if b=='shield' and t=='object':b='captain-shield'
    edges.append(dict(a=a,b=b,type=valid_e.get(t,t),title=title,detail=explain,provenance={'c':'editorial','t':'production','m':'community','f':'theory','r':'reported','d':'disputed'}.get(prov,'editorial'),spoiler=int(sp),source='seed'))
# parsed legacy fanout; connect actor to project but NEVER actor->character without explicit role description in dossier
Graw=old.split('const G=',1)[1].split('];',1)[0]+']'
for kind,spo,prov,s in re.findall(r"\['(char|actor|egg|ref)',(\d+),'([a-z])','([^']+)'\]",Graw):
    for group in s.split(';'):
        a,b=group.split(':');
        for target in b.split(','):
            if a=='shield':a='captain-shield'
            if target=='shield': target='captain-shield'
            if a in by_id and target in by_id:
                edges.append(dict(a=a,b=target,type=valid_e.get(kind,'reference'),title={'char':'Appears in','actor':'Portrays / appears in','egg':'Appearance / reference','ref':'Related event'}[kind],detail=by_id[a]['label']+' connects to '+by_id[target]['label']+' in the supplied project mapping. Individual role and continuity details may differ.',provenance='editorial',spoiler=int(spo),source='seed'))

aliases={'Spider-Man 2 (2004)':'sm2','Spider-Man 3 (2007)':'sm3','The Fantastic Four: First Steps':'ff', 'Daredevil':'dd','Fantastic Four (2005)':'ff05','The Defenders':'defenders','Agents of S.H.I.E.L.D.':'shield','Agent Carter':'agentcarter','Spider-Man: Beyond the Spider-Verse':'btsv'}
# pre-existing nodes often same label except Spider-Man (2002), X2 etc
for n in nodes:
    if n['type']=='project':aliases.setdefault(n['label'],n['id'])

universe_lists={
 'tv':"Daredevil Jessica Jones Luke Cage Iron Fist The Defenders The Punisher Agents of S.H.I.E.L.D. Agent Carter Runaways Cloak & Dagger Inhumans Helstrom", # explicit membership below
 'fox':"X-Men X2 X-Men: The Last Stand X-Men: First Class X-Men: Days of Future Past X-Men: Apocalypse Dark Phoenix The Wolverine X-Men Origins: Wolverine Logan Deadpool Deadpool 2 Fantastic Four (2005) Fantastic Four: Rise of the Silver Surfer Fantastic Four (2015) The New Mutants Legion The Gifted Generation X",
 'ssu':"Venom Venom: Let There Be Carnage Venom: The Last Dance Morbius Madame Web Kraven the Hunter",
 'sv':"Spider-Man: Into the Spider-Verse Spider-Man: Across the Spider-Verse Spider-Man: Beyond the Spider-Verse Spider-Ham: Caught in a Ham",
 'raimi':"Spider-Man (2002) Spider-Man 2 (2004) Spider-Man 3 (2007)",
 'asm':"The Amazing Spider-Man The Amazing Spider-Man 2",
}
fox={'X-Men','X2','X-Men: The Last Stand','X-Men: First Class','X-Men: Days of Future Past','X-Men: Apocalypse','Dark Phoenix','The Wolverine','X-Men Origins: Wolverine','Logan','Deadpool','Deadpool 2','Fantastic Four (2005)','Fantastic Four: Rise of the Silver Surfer','Fantastic Four (2015)','The New Mutants','Legion','The Gifted','Generation X'}
tv={'Daredevil','Jessica Jones','Luke Cage','Iron Fist','The Defenders','The Punisher','Agents of S.H.I.E.L.D.','Agent Carter','Runaways','Cloak & Dagger','Inhumans','Helstrom','Hit-Monkey','M.O.D.O.K.'}
ssu={'Venom','Venom: Let There Be Carnage','Venom: The Last Dance','Morbius','Madame Web','Kraven the Hunter'}
sv={'Spider-Man: Into the Spider-Verse','Spider-Man: Across the Spider-Verse','Spider-Man: Beyond the Spider-Verse','Spider-Ham: Caught in a Ham'}
raimi={'Spider-Man (2002)','Spider-Man 2 (2004)','Spider-Man 3 (2007)'}
asm={'The Amazing Spider-Man','The Amazing Spider-Man 2'}
cartoons={'What If...?','X-Men \'97','Your Friendly Neighborhood Spider-Man','Marvel Zombies','Eyes of Wakanda','I Am Groot'}
shows={'WandaVision','Agatha All Along','VisionQuest','Loki','Hawkeye','Moon Knight','Ms. Marvel','She-Hulk: Attorney at Law','Secret Invasion','Ironheart','Echo','The Falcon and the Winter Soldier','Wonder Man','Werewolf by Night','The Guardians of the Galaxy Holiday Special','Daredevil: Born Again','The Punisher: One Last Kill','Cloak & Dagger','Runaways','Agent Carter','Agents of S.H.I.E.L.D.','Jessica Jones','Luke Cage','Iron Fist','Daredevil','The Defenders','The Punisher','Inhumans','Helstrom','Hit-Monkey','M.O.D.O.K.','Legion','The Gifted','Generation X','What If...?','X-Men \'97','Your Friendly Neighborhood Spider-Man','Marvel Zombies','Eyes of Wakanda','I Am Groot'}
years={
'Agatha All Along':2024,'VisionQuest':2026,'Spider-Man: Brand New Day':2026,'Daredevil: Born Again Season 2':2026,'Wonder Man':2026,'Iron Man 2':2010,'Iron Man 3':2013,'The Incredible Hulk':2008,'Ant-Man':2015,'Ant-Man and the Wasp':2018,'Ant-Man and the Wasp: Quantumania':2023,'Captain America: Civil War':2016,'Captain America: Brave New World':2025,'The Falcon and the Winter Soldier':2021,'Black Panther':2018,'Black Panther: Wakanda Forever':2022,'Black Widow':2021,'Captain Marvel':2019,'The Marvels':2023,'Guardians of the Galaxy':2014,'Guardians of the Galaxy Vol. 2':2017,'Guardians of the Galaxy Vol. 3':2023,'Thor: The Dark World':2013,'Thor: Ragnarok':2017,'Thor: Love and Thunder':2022,'Doctor Strange':2016,'Eternals':2021,'Shang-Chi and the Legend of the Ten Rings':2021,'Ms. Marvel':2022,'Hawkeye':2021,'Echo':2024,'Ironheart':2025,'She-Hulk: Attorney at Law':2022,'Moon Knight':2022,'Werewolf by Night':2022,'The Guardians of the Galaxy Holiday Special':2022,'Secret Invasion':2023,'Thunderbolts*':2025,'Eyes of Wakanda':2025,'Marvel Zombies':2025,'Your Friendly Neighborhood Spider-Man':2025,"X-Men '97":2024,'The Punisher: One Last Kill':2026,'The Punisher':2017,'Jessica Jones':2015,'Luke Cage':2016,'Iron Fist':2017,'Runaways':2017,'Cloak & Dagger':2018,'Inhumans':2017,'Legion':2017,'The Gifted':2017,'Helstrom':2020,'Hit-Monkey':2021,'M.O.D.O.K.':2021,'I Am Groot':2022,'Spider-Man: Far From Home':2019,'Venom: The Last Dance':2024,'Madame Web':2024,'X-Men: The Last Stand':2006,'X-Men: Apocalypse':2016,'Dark Phoenix':2019,'The Wolverine':2013,'X-Men Origins: Wolverine':2009,'Fantastic Four: Rise of the Silver Surfer':2007,'Fantastic Four (2015)':2015,'The New Mutants':2020,'Generation X':1996,'Spider-Ham: Caught in a Ham':2019,'The Punisher: One Last Kill':2026}
statuses={'VisionQuest':'upcoming','Avengers: Doomsday':'upcoming','Avengers: Secret Wars':'upcoming','Spider-Man: Beyond the Spider-Verse':'upcoming'}
for title in sorted({r['production'] for r in csv_rows}):
    if title in aliases: continue
    id=re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',title).lower()).strip('-')
    if id in by_id:id='project-'+id
    universe=('fox' if title in fox else 'tv' if title in tv else 'ssu' if title in ssu else 'sv' if title in sv else 'raimi' if title in raimi else 'asm' if title in asm else 'mcu')
    n=dict(id=id,type='project',label=title,universe=universe,year=years.get(title),status=statuses.get(title,'released'),description='',media='series' if title in shows else 'film',source='csv')
    nodes.append(n);by_id[id]=n;aliases[title]=id
if 'Daredevil: Born Again Season 2' not in aliases:
    id='bornagain-2'; n=dict(id=id,type='project',label='Daredevil: Born Again Season 2',universe='mcu',year=2026,status='released',description='Matt Murdock and Wilson Fisk continue their conflict in New York.',media='series',source='Marvel official');nodes.append(n);by_id[id]=n;aliases[n['label']]=id
# fix source statuses and media
for n in nodes:
    if n['type']!='project':continue
    if n['label'] in shows:n['media']='series'
    if n['label'] in cartoons:n['media']='animation'
    if n['label'] in years:n['year']=years[n['label']]
    if n['label'] in statuses:n['status']=statuses[n['label']]
    if n['label']=='Spider-Man: Brand New Day':n['status']='released'
    if n['label']=='The Fantastic Four: First Steps':n['label']='The Fantastic Four: First Steps'
# remap the accidental 'shield' original ambiguity: SHIELD series is shield, artifact is captain-shield
# source annotations for original seed should not be represented as independently verified.
for e in edges:
    if e['a'] not in by_id or e['b'] not in by_id:
        raise ValueError(('dangling',e))

# CSV imported facts normalized to project IDs; no pseudo-edges inferred just from text
facts=[]
for i,row in enumerate(csv_rows):
    if row['production'] not in aliases:raise ValueError(('unknown csv production',row['production']))
    facts.append(dict(id='f'+str(i+1),project=aliases[row['production']],kind=row['type'],text=row['fact'],evidence=row['evidence_note'],sourceUrl=row['source_directory'],spoiler=2 if 'spoiler' in row['spoiler_level'].lower() else 0,origin='User-provided CSV'))

# parse second pasted callback guide; don't infer unsupported cross-project links; store as editorial cards
blocks=re.split(r'(?m)^\s*(\d{1,2})\.\s+',notes)[1:]
callbacks=[]
for i in range(0,len(blocks)-1,2):
    num=int(blocks[i]);raw=blocks[i+1].strip();lines=raw.splitlines();title=lines[0].strip();body='\n'.join(lines[1:]).strip()
    projects=[]
    for line in lines[1:]:
        m=re.match(r'^\s*[•*-]\s*([^:]+):\s*',line)
        if m:
            p=m.group(1).strip()
            if p in aliases and aliases[p] not in projects:projects.append(aliases[p])
    callbacks.append(dict(id='cb'+str(num),title=title,description=body,projects=projects,origin='User-supplied callback notes',spoiler=2))

# Manual project-ID mapping for callback headings whose prose does not use exact database display titles.
callback_map={
 6:['ca1','avengers','endgame'], 9:['endgame'],11:['ca1','endgame'],12:['ca1','endgame'],13:['tws','endgame'],
 14:['tws','endgame'],16:['ca1','tws'],17:['endgame'],19:['aou','endgame'],21:['infwar','endgame'],
 28:['aou','endgame'],29:['endgame','hawkeye'],30:['homecoming','nwh'],31:['homecoming','nwh'],
 32:['homecoming','spider-man-far-from-home'],34:['wandav'],40:['aou','endgame'],42:['aou','wandav','dsmom'],
 44:['aou'],48:['ca1','endgame'],50:['endgame']}
for cb in callbacks:
    number=int(cb['id'][2:]);extra=callback_map.get(number,[])
    for ident in extra:
        if ident in by_id and ident not in cb['projects']:cb['projects'].append(ident)

# alphabetical meta and first version data
payload={'nodes':nodes,'edges':edges,'facts':facts,'callbacks':callbacks,'aliases':aliases,'generated':'2026-10-02'}
(root/'data.js').write_text('window.MARVEL_DATA='+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('nodes',len(nodes),'seed edges',len(edges),'csv facts',len(facts),'callbacks',len(callbacks),'unique CSV projects',len({f['project'] for f in facts}))
print('agatha id',aliases.get('Agatha All Along'),'vision id',aliases.get('VisionQuest'))
