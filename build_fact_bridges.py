"""Conservatively elevate user CSV entries that literally name a second production.
This is a text-linking index, not independent confirmation of a claimed Easter egg.
"""
import csv,json,re,pathlib,collections
r=pathlib.Path(__file__).resolve().parent
rows=list(csv.DictReader((r/'sources'/'Marvel_Combined_Facts.csv').open(encoding='utf-8-sig')))
registry=json.loads((r/'data.js').read_text().removeprefix('window.MARVEL_DATA=').rstrip().removesuffix(';'))['aliases']
project_alias={
 'Shang-Chi':'shang-chi-and-the-legend-of-the-ten-rings', 'Age of Ultron':'aou',
 'Endgame':'endgame','Infinity War':'infwar','Civil War':'captain-america-civil-war',
 'WandaVision':'wandav','Agatha All Along':'agatha-all-along','VisionQuest':'visionquest',
 'The Dark World':'thor-the-dark-world','Ragnarok':'thor-ragnarok',
 'No Way Home':'nwh','Far From Home':'spider-man-far-from-home',
 'Homecoming':'homecoming','The Winter Soldier':'tws','The First Avenger':'ca1',
 'Ant-Man and the Wasp':'ant-man-and-the-wasp',
 'She-Hulk':'she-hulk-attorney-at-law','Thunderbolts':'thunderbolts',
 'Brave New World':'captain-america-brave-new-world',
 'Doctor Strange 2':'dsmom','Multiverse of Madness':'dsmom',
 'The Marvels':'the-marvels','Guardians Vol. 3':'guardians-of-the-galaxy-vol-3',
 'Secret Wars':'sw','Doomsday':'doomsday',
 'Iron Man 2':'iron-man-2','Iron Man 3':'iron-man-3',
 'The Incredible Hulk':'the-incredible-hulk',
 'Black Panther: Wakanda Forever':'black-panther-wakanda-forever',
 'Deadpool & Wolverine':'dpw',
 'All Hail the King':'project-marvel-one-shot-all-hail-the-king',
 'Fantastic Four: First Steps':'ff',
 'The Fantastic Four: First Steps':'ff',
 'The Falcon and the Winter Soldier':'the-falcon-and-the-winter-soldier',
 'Into the Spider-Verse':'itsv','Across the Spider-Verse':'atsv',
 'Guardians of the Galaxy Vol. 2':'guardians-of-the-galaxy-vol-2',
 'Guardians of the Galaxy Vol. 3':'guardians-of-the-galaxy-vol-3',
 'Captain America: Civil War':'captain-america-civil-war'
}
# Whole-title match, boundary aware; prioritize longest phrase and avoid duplicate overlaps.
ordered=sorted(project_alias,key=len,reverse=True)
rows_out=[];counts=collections.Counter()
for i,row in enumerate(rows,1):
 kind=row['type'];text=row['fact'];source=row['production'];found=[];spans=[]
 for title in ordered:
  for m in re.finditer(r'(?<![A-Za-z0-9])'+re.escape(title)+r'(?![A-Za-z0-9])',text,flags=re.I):
   if any(max(m.start(),a)<min(m.end(),b) for a,b in spans):continue
   spans.append((m.start(),m.end()))
   if title not in found:found.append(title)
 # exclude original project itself based on known names (source may not exist in alias)
 original=registry.get(source,project_alias.get(source,source))
 targets=[]
 for k in found:
  target=project_alias[k]
  if target!=original and target not in targets:targets.append(target)
 # skip loose implication if the text says title but not actual relationship: match still literal, label inference only
 if targets:
  rows_out.append(dict(id='csv-bridge-'+str(i),number=i,source_title=source,targets=targets[:3],kind=kind,title=text[:95]+('…' if len(text)>95 else ''),detail=text,spoiler=2,evidence_note=row['evidence_note']))
  counts[kind]+=1
print('Matched independent title cross-references:',len(rows_out),'by kind',counts)
print('examples:')
for x in rows_out[:30]:print(x['number'],x['source_title'],'->',','.join(x['targets']),':',x['title'][:90])
(r/'sources'/'FACT_BRIDGES.json').write_text(json.dumps(rows_out,indent=2,ensure_ascii=False),encoding='utf8')
# data embedded as static JS with no runtime fetch; verification status deliberately unconfirmed.
(r/'fact_bridges.js').write_text('window.MARVEL_FACT_BRIDGES='+json.dumps(rows_out,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
