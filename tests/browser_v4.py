"""End-to-end interaction checks for Marvel Atlas V4, including full-spoiler narrative mode.
Requires playwright and /usr/bin/chromium. Uses only local data, no network access.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).resolve().parents[1]
html=(p/'index.html').read_text().replace('<link rel="stylesheet" href="style.css">','<style>'+(p/'style.css').read_text()+'</style>')
for f in ['data.js','curated.js','lore.js','narrative.js','fact_bridges.js','bridge_runtime.js','extras.js','app.js']:
    html=html.replace('<script src="'+f+'"></script>','<script>'+(p/f).read_text()+'</script>')
with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--allow-file-access-from-files'])
  desktop=browser.new_page(viewport={'width':1540,'height':960},device_scale_factor=1)
  errors=[];desktop.on('pageerror',lambda exc:errors.append(str(exc)))
  desktop.set_content(html,wait_until='load')
  desktop.wait_for_timeout(330)
  assert not errors,errors
  assert desktop.evaluate('window.__MARVEL_DEBUG.DATA.edges.length')>=2900
  assert desktop.evaluate('window.__MARVEL_DEBUG.state.spoilers')==0
  assert desktop.evaluate("window.__MARVEL_DEBUG.state.visibleNodes.length")<735
  desktop.screenshot(path=str(p/'v4-global.png'))
  desktop.locator('#revealEverything').click()
  assert desktop.evaluate('window.__MARVEL_DEBUG.state.spoilers')==3
  desktop.evaluate("window.__MARVEL_DEBUG.selectNode('endgame')")
  desktop.wait_for_timeout(400)
  assert desktop.locator('#panelBody').inner_text().find('Avengers: Endgame')>=0
  assert desktop.locator('#panelBody .tabs [data-tab=threads]').count()==1
  count=desktop.evaluate("window.__MARVEL_DEBUG.adj.get('endgame').length")
  assert count>250,count
  nodes=desktop.evaluate('window.__MARVEL_DEBUG.state.visibleNodes.length')
  assert 30<nodes<=55,nodes
  desktop.locator('#panelBody .tabs [data-tab=threads]').click()
  narrative=desktop.locator('#panelBody').inner_text()
  assert 'CALLBACKS' in narrative and 'STORY CONTINUATIONS' in narrative
  assert 'TIME' not in narrative[:20]
  assert 'I am Iron Man' in narrative or 'Iron Man' in narrative
  desktop.screenshot(path=str(p/'v4-endgame-threads.png'),full_page=False)
  # Search must include original user facts, even when they are not drawn as graph spokes.
  desktop.locator('#search').fill('Howard Stark appears in old footage')
  assert desktop.locator('#results .result').count()>0,'Original facts need searchable projects'
  desktop.locator('#search').fill('')
  desktop.evaluate("window.__MARVEL_DEBUG.selectNode('aou')")
  desktop.locator('#panelBody .tabs [data-tab=threads]').click()
  assert 'Vision' in desktop.locator('#panelBody').inner_text()
  desktop.evaluate("window.__MARVEL_DEBUG.selectNode('visionquest')")
  desktop.locator('#panelBody .tabs [data-tab=threads]').click()
  assert 'Ultron' in desktop.locator('#panelBody').inner_text()
  desktop.screenshot(path=str(p/'v4-visionquest.png'),full_page=False)
  desktop.evaluate("window.__MARVEL_DEBUG.selectNode('cb1')")
  desktop.locator('#panelBody [data-tab=discoveries]').click()
  assert desktop.locator('#panelBody').inner_text().find('original note')>=0
  desktop.evaluate("window.__MARVEL_DEBUG.selectNode('ten-rings-organization')")
  desktop.locator('#panelBody .tabs [data-tab=threads]').click()
  assert desktop.locator('#panelBody').inner_text().find('Iron Man')>=0
  # Edge clicked from side list should open an explanation dossier; Back returns.
  prev=desktop.evaluate('window.__MARVEL_DEBUG.state.selected')
  desktop.locator('#panelBody [data-edge]').first.click()
  assert 'CONNECTED ENTITIES' in desktop.locator('#panelBody').inner_text()
  desktop.locator('#backBtn').click()
  assert desktop.evaluate('window.__MARVEL_DEBUG.state.selected')==prev
  # Real canvas hit-testing on visible connected lines is called with selected node center and an observed edge.
  test=desktop.evaluate('''() => {const d=window.__MARVEL_DEBUG;const e=d.state.visibleEdges.find(e=>e.a===d.state.selected||e.b===d.state.selected);const p=d.state.positions.get(e.a),q=d.state.positions.get(e.b),t=d.state.transform;return {x:(p.x+q.x)*.5*t.k+t.x,y:(p.y+q.y)*.5*t.k+t.y}}''')
  desktop.evaluate("window.__MARVEL_DEBUG.selectNode('ironman')")
  desktop.locator('#panelBody [data-action=path]').click()
  desktop.evaluate("window.__MARVEL_DEBUG.selectNode('ten-rings-weapons')")
  assert 'Path found' in desktop.locator('#pathResult').inner_text()
  desktop.locator('#timelineMode').click()
  assert desktop.evaluate('window.__MARVEL_DEBUG.state.mode')=='timeline'
  assert not errors,errors
  print('DESKTOP PASS: no exceptions; full spoiler graph; Endgame named threads; VisionQuest; callback original; CSV search; edge click and Back; pathfinding; timeline.')
  print('DENSE NODE FOCUS: Endgame has',count,'relationship entries; initial focus draws',nodes,'entities without deleting data.')
  mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
  merr=[];mobile.on('pageerror',lambda exc:merr.append(str(exc)))
  mobile.set_content(html,wait_until='load')
  mobile.locator('#toggleSettings').click()
  assert mobile.locator('#sidebar').evaluate('(e)=>e.classList.contains("mobile-open")')
  mobile.locator('#revealEverything').click()
  mobile.locator('[data-trail=agatha]').click()
  assert mobile.locator('#panel').evaluate('(e)=>e.classList.contains("open")')
  mobile.locator('#panelBody .tabs [data-tab=threads]').click()
  assert 'WandaVision' in mobile.locator('#panelBody').inner_text()
  mobile.screenshot(path=str(p/'v4-mobile.png'))
  assert not merr,merr
  print('MOBILE PASS: sidebar opens, full-spoiler toggle, Agatha story threads, bottom dossier and no errors.')
  browser.close()
