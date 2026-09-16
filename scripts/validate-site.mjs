import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const speechDir = join(root, 'src/content/speeches');
const files = readdirSync(speechDir).filter((file) => file.endsWith('.md')).sort();
const required = ['titleZh', 'titleEn', 'speaker', 'year', 'date', 'location', 'era', 'kind', 'status', 'description', 'topics', 'difficulty', 'readingTime', 'sourceName', 'sourceUrl', 'copyrightStatus', 'copyrightNote'];
const statuses = new Set(['us-government-work', 'historical-public-domain', 'copyrighted-excerpt', 'rights-review']);
const ids = new Set();
const errors = [];
const expectedExcerpts = new Set([
  'churchill-iron-curtain-1946', 'lincoln-first-inaugural-1861',
  'lincoln-lyceum-1838', 'lincoln-second-inaugural-1865',
  'washington-farewell-1796', 'webster-liberty-and-union-1830',
  'mlk-i-have-a-dream-1963', 'johnson-we-shall-overcome-1965',
  'rfk-indianapolis-1968', 'reagan-first-inaugural-1981',
  'reagan-berlin-wall-1987', 'obama-keynote-2004',
]);

function parseFrontmatter(text, file) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) { errors.push(`${file}: missing frontmatter`); return {}; }
  const data = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator < 1) { errors.push(`${file}: malformed frontmatter line`); continue; }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    try { data[key] = JSON.parse(value); } catch { errors.push(`${file}: ${key} is not valid JSON/YAML scalar data`); }
  }
  return data;
}

for (const file of files) {
  const id = basename(file, '.md');
  if (ids.has(id)) errors.push(`duplicate speech id: ${id}`);
  ids.add(id);
  const text = readFileSync(join(speechDir, file), 'utf8');
  const data = parseFrontmatter(text, file);
  for (const key of required) if (!(key in data)) errors.push(`${file}: missing ${key}`);
  if (typeof data.year !== 'number' || !Number.isInteger(data.year)) errors.push(`${file}: year must be an integer`);
  if (!['full', 'excerpt'].includes(data.status)) errors.push(`${file}: invalid status`);
  if (!statuses.has(data.copyrightStatus)) errors.push(`${file}: invalid copyrightStatus`);
  if (!Array.isArray(data.topics)) errors.push(`${file}: topics must be an array`);
  if (!/^https?:\/\//.test(data.sourceUrl ?? '')) errors.push(`${file}: sourceUrl must be an HTTP URL`);
  for (const kind of ['audio', 'video']) {
    const media = data[kind];
    if (media == null) continue;
    if (!media.url || !/^https?:\/\//.test(media.url)) errors.push(`${file}: ${kind}.url must be an HTTP URL`);
    if (!media.sourceName || !media.sourceUrl || !media.rightsNote) errors.push(`${file}: ${kind} needs sourceName, sourceUrl, and rightsNote`);
    if (/加载视频|在新窗口打开/.test(media.sourceName ?? '')) errors.push(`${file}: ${kind}.sourceName contains UI text`);
    if (kind === 'video' && !media.url.includes('youtube-nocookie.com/embed/')) errors.push(`${file}: video must use youtube-nocookie embed`);
  }
  if (expectedExcerpts.has(id) && data.status !== 'excerpt') errors.push(`${file}: expected excerpt status`);
  if (text.includes('{{')) errors.push(`${file}: unresolved placeholder`);
  if (!text.includes('<section class="para">')) errors.push(`${file}: speech body has no paragraphs`);
}

if (files.length !== 28) errors.push(`expected 28 Markdown entries, found ${files.length}`);
for (const file of ['src/pages/index.astro', 'src/pages/[slug].astro', 'src/pages/sitemap.xml.ts', 'src/pages/robots.txt.ts']) {
  if (!existsSync(join(root, file))) errors.push(`missing ${file}`);
}
const expectedRoutes = [...ids].map((id) => `/${id}.html`);
if (existsSync(join(root, 'dist'))) {
  for (const route of expectedRoutes) if (!existsSync(join(root, `dist${route}`))) errors.push(`missing built route: ${route}`);
  if (!existsSync(join(root, 'dist/index.html'))) errors.push('missing built homepage');
  if (!existsSync(join(root, 'dist/sitemap.xml'))) errors.push('missing built sitemap');
  const sitemap = readFileSync(join(root, 'dist/sitemap.xml'), 'utf8');
  const sitemapRoutes = [...sitemap.matchAll(/<loc>https?:\/\/[^<]+(\/[^<]*)<\/loc>/g)].map((match) => match[1]);
  const expectedSitemap = ['/'].concat(expectedRoutes).sort();
  if (sitemapRoutes.length !== expectedSitemap.length || sitemapRoutes.sort().join('|') !== expectedSitemap.join('|')) errors.push('sitemap routes do not exactly match collection routes');
  for (const route of expectedRoutes) {
    const html = readFileSync(join(root, `dist${route}`), 'utf8');
    if (!html.includes('<link rel="canonical"') || !html.includes('property="og:title"') || !html.includes('property="og:description"')) errors.push(`missing required metadata: ${route}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}
console.log(`OK: ${files.length} speech entries, metadata, source/copyright fields, media, and generated route checks passed`);
