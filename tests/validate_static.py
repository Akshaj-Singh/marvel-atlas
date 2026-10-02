"""Validate the relative assets necessary for file and GitHub Pages deployment."""
from pathlib import Path
import re
p=Path(__file__).resolve().parents[1]
s=(p/'index.html').read_text()
files=re.findall(r'<script\s+src="([^"]+)"\s*>',s)
expected=['data.js','curated.js','lore.js','narrative.js','fact_bridges.js','bridge_runtime.js','extras.js','app.js']
assert files==expected,(files,expected)
for f in files+['style.css']:
 assert not f.startswith('/') and not f.startswith('http'),f
 assert (p/f).is_file() and (p/f).stat().st_size>500,f
assert '<meta name="viewport"' in s
print('STATIC ASSET PASS:',len(files),'JavaScript files in dependency order, all relative paths exist, CSS and viewport are present.')
