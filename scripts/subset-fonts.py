"""Create self-hosted Noto Sans TC WOFF2 from the characters in src/.
Usage: python scripts/subset-fonts.py /path/to/NotoSansTC-variable.ttf [output-name.woff2]
Requires fonttools[woff]. Source: google/fonts/ofl/notosanstc, SIL OFL.
Run after adding copy; characters outside the subset use the system fallback.
"""
from pathlib import Path
import sys
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
text = ''.join(p.read_text() for p in (root / 'src').rglob('*') if p.suffix in ('.astro', '.ts', '.tsx', '.css'))
options = subset.Options()
options.flavor = 'woff2'
options.hinting = False
options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
font = TTFont(sys.argv[1])
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
font.flavor = 'woff2'
output = root / 'public/fonts' / (sys.argv[2] if len(sys.argv) > 2 else 'sunny-noto-tc-v2.woff2')
font.save(output)
print(f'{len(set(text))} characters, {output.stat().st_size:,} bytes: {output}')
