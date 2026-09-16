#!/usr/bin/env python3
"""Convert the current HTML speech pages into Astro collection entries.

This intentionally preserves the existing bilingual/vocabulary HTML inside the
Markdown body. It is a migration aid; source and rights fields are reviewed by
the generated validation report before the legacy pages are removed.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src' / 'content' / 'speeches'
OUT.mkdir(parents=True, exist_ok=True)


def clean(value: str) -> str:
    value = re.sub(r'<[^>]+>', ' ', value)
    return re.sub(r'\s+', ' ', html.unescape(value)).strip()


def attr(tag: str, name: str) -> str:
    match = re.search(rf'\b{name}="([^"]*)"', tag)
    return html.unescape(match.group(1)) if match else ''


def first_href(text: str) -> str:
    for href in re.findall(r'href="([^"]+)"', text):
        if href.startswith('http') and 'youtube.com' not in href:
            return href
    return ''


def media(page: str, kind: str) -> dict | None:
    section = re.search(rf'<div class="mrow" data-media="{kind}">(.*?)</div>', page, re.S)
    if not section:
        return None
    row = section.group(1)
    if '{{' in row:
        return None
    if kind == 'audio':
        src = attr(row, 'src')
        if not src or not src.startswith('http'):
            return None
        return {
            'url': src,
            'sourceName': clean(row),
            'sourceUrl': src,
            'rightsNote': '外链音频；请以来源页面所示授权为准。',
        }
    youtube = re.search(r'youtube\.com/watch\?v=([A-Za-z0-9_-]+)', row)
    if not youtube:
        return None
    video_id = youtube.group(1)
    source_url = f'https://www.youtube.com/watch?v={video_id}'
    return {
        'url': f'https://www.youtube-nocookie.com/embed/{video_id}?rel=0',
        'sourceName': clean(row),
        'sourceUrl': source_url,
        'rightsNote': '外链视频；版权归上传者及相关权利人所有。',
    }


def cards(index: str) -> dict[str, dict]:
    result = {}
    for block in re.findall(r'<li class="tl-item">(.*?)</li>', index, re.S):
        href = re.search(r'href="([^"]+\.html)"', block)
        if not href:
            continue
        year = re.search(r'<span class="yr">(\d+)</span>', block)
        title = re.search(r'<h2>(.*?)</h2>', block, re.S)
        orig = re.search(r'<p class="orig">(.*?)</p>', block, re.S)
        meta = re.search(r'<p class="meta">(.*?)</p>', block, re.S)
        intro = re.search(r'<p class="intro">(.*?)</p>', block, re.S)
        tags = re.search(r'<p class="tags">(.*?)</p>', block, re.S)
        kind = re.search(r'<span class="kind">(.*?)</span>', block, re.S)
        result[href.group(1)] = {
            'year': int(year.group(1)) if year else 0,
            'titleZh': clean(title.group(1)) if title else href.group(1),
            'titleEn': clean(orig.group(1)) if orig else '',
            'meta': clean(meta.group(1)) if meta else '',
            'description': clean(intro.group(1)) if intro else '',
            'topics': [clean(x) for x in re.findall(r'<span>(.*?)</span>', tags.group(1), re.S)] if tags else [],
            'kind': clean(kind.group(1)) if kind else '公开演说',
        }
    return result


def era_for(year: int) -> str:
    if year <= 1830:
        return '建国与早期共和国'
    if year <= 1865:
        return '奴隶制、分裂与内战'
    if year <= 1918:
        return '镀金时代与进步时代'
    if year <= 1945:
        return '大萧条与第二次世界大战'
    if year <= 1962:
        return '冷战初期'
    return '民权与当代'


def main() -> None:
    index = (ROOT / 'index.html').read_text()
    card_map = cards(index)
    for page_path in sorted(ROOT.glob('*.html')):
        if page_path.name == 'index.html':
            continue
        page = page_path.read_text()
        card = card_map.get(page_path.name, {})
        body = re.search(r'<main id="body">(.*?)</main>', page, re.S)
        if not body:
            raise SystemExit(f'No body found: {page_path.name}')
        canonical = re.search(r'<link rel="canonical" href="([^"]+)"', page)
        source_match = re.search(r'<footer class="ft">(.*?)</footer>', page, re.S)
        source_html = source_match.group(1) if source_match else ''
        source_url = first_href(source_html) or (canonical.group(1) if canonical else 'https://www.booknim.com/')
        source_name_match = re.search(r'<a[^>]+href="' + re.escape(source_url) + r'"[^>]*>(.*?)</a>', source_html, re.S)
        source_name = clean(source_name_match.group(1)) if source_name_match else '原文来源待复核'
        kicker = re.search(r'<p class="kicker">(.*?)</p>', page, re.S)
        kicker_text = clean(kicker.group(1)) if kicker else ''
        small = re.search(r'<h1>.*?<small>(.*?)</small>', page, re.S)
        title_en = clean(small.group(1)) if small else card.get('titleEn', '')
        text_length = len(clean(body.group(1)))
        voc_count = page.count('class="voc"')
        status = 'excerpt' if card.get('kind') == '节选' or '节选' in page[:1200] else 'full'
        copyright_status = 'copyrighted-excerpt' if any(marker in source_html for marker in ('受版权保护', '版权归相关权利人', '非联邦职务演说')) else ('us-government-work' if '联邦职务作品' in source_html or '联邦职务演说' in source_html else 'historical-public-domain')
        metadata = {
            'titleZh': card.get('titleZh', page_path.stem),
            'titleEn': title_en,
            'speaker': title_en.split('—')[-1].strip() if '—' in title_en else '待复核',
            'year': card.get('year', 0),
            'date': kicker_text,
            'location': kicker_text,
            'era': era_for(card.get('year', 0)),
            'kind': card.get('kind', '公开演说'),
            'status': status,
            'description': card.get('description', ''),
            'topics': card.get('topics', []),
            'difficulty': 'advanced' if voc_count > 100 or text_length > 12000 else 'intermediate',
            'readingTime': max(1, round(text_length / 900)),
            'sourceName': source_name,
            'sourceUrl': source_url,
            'copyrightStatus': copyright_status,
            'copyrightNote': clean(source_html) or '版权与授权状态待复核。',
            'audio': media(page, 'audio'),
            'video': media(page, 'video'),
            'related': [],
        }
        lines = ['---']
        for key, value in metadata.items():
            lines.append(f'{key}: {json.dumps(value, ensure_ascii=False)}')
        lines += ['---', '', body.group(1).strip(), '']
        (OUT / f'{page_path.stem}.md').write_text('\n'.join(lines))
    print(f'Generated {len(list(OUT.glob("*.md")))} Markdown entries in {OUT}')


if __name__ == '__main__':
    main()
