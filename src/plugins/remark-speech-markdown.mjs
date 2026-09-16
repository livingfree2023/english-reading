const vocabularyPattern = /\[\[/;

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function readToken(value, start) {
  let escaped = false;
  for (let index = start; index < value.length - 1; index += 1) {
    const character = value[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === '\\') {
      escaped = true;
      continue;
    }
    if (character === ']' && value[index + 1] === ']') return index;
  }
  return -1;
}

function splitVocabulary(value) {
  const fields = [''];
  let escaped = false;
  for (const character of value) {
    if (escaped) {
      fields[fields.length - 1] += character;
      escaped = false;
    } else if (character === '\\') {
      escaped = true;
    } else if (character === '|') {
      fields.push('');
    } else {
      fields[fields.length - 1] += character;
    }
  }
  if (escaped) fields[fields.length - 1] += '\\';
  return fields.map((field) => field.trim());
}

function vocabularyHtml(fields) {
  const [word, partOfSpeech, ipa, definition] = fields.map(escapeHtml);
  return `<span class="voc"><span class="w">${word}</span><span class="g"><i>${partOfSpeech}</i> ${ipa} ${definition}</span></span>`;
}

function transformVocabulary(node, file) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node.children)) {
    const transformed = [];
    for (const child of node.children) {
      if (child.type !== 'text' || !vocabularyPattern.test(child.value)) {
        transformVocabulary(child, file);
        transformed.push(child);
        continue;
      }

      let cursor = 0;
      while (cursor < child.value.length) {
        const start = child.value.indexOf('[[', cursor);
        if (start === -1) {
          if (cursor < child.value.length) transformed.push({ type: 'text', value: child.value.slice(cursor) });
          break;
        }
        if (start > cursor) transformed.push({ type: 'text', value: child.value.slice(cursor, start) });
        const end = readToken(child.value, start + 2);
        if (end === -1) file.fail('Unclosed vocabulary token; use [[word|part of speech|IPA|definition]].', child);
        const fields = splitVocabulary(child.value.slice(start + 2, end));
        if (fields.length !== 4 || fields.some((field) => !field)) {
          file.fail('Vocabulary tokens need exactly four non-empty fields: [[word|part of speech|IPA|definition]].', child);
        }
        transformed.push({ type: 'html', value: vocabularyHtml(fields) });
        cursor = end + 2;
      }
    }
    node.children = transformed;
  }
}

function paragraphAs(className, source) {
  if (!source || source.type !== 'paragraph') return null;
  return {
    ...source,
    data: { ...(source.data ?? {}), hName: 'div', hProperties: { className: [className] } },
  };
}

function translationAsParagraph(node) {
  if (!node || node.type !== 'blockquote' || node.children.length !== 1) return null;
  return paragraphAs('zh', node.children[0]);
}

function speechSection(number, english, translation) {
  const en = paragraphAs('en', english);
  const zh = translationAsParagraph(translation);
  if (!en || !zh) return null;
  return [
    { type: 'html', value: `<section class="para"><span class="no">${number}</span>` },
    en,
    zh,
    { type: 'html', value: '</section>' },
  ];
}

function quoteSection(number, directive) {
  if (directive.name !== 'quote' || directive.attributes && Object.keys(directive.attributes).length > 0) return null;
  const [english, translation] = directive.children;
  return speechSection(number, english, translation);
}

function headingNumber(node) {
  if (node.type !== 'heading' || node.depth !== 3 || node.children.length !== 1 || node.children[0].type !== 'text') return null;
  const value = node.children[0].value.trim();
  return /^\d{2}$/.test(value) ? value : null;
}

export default function remarkSpeechMarkdown() {
  return (tree, file) => {
    const transformed = [];
    let expectedNumber = 1;

    for (let index = 0; index < tree.children.length;) {
      const heading = tree.children[index];
      const number = headingNumber(heading);
      if (!number) file.fail('Each speech body must start every entry with a `### NN` paragraph number.', heading);
      if (Number(number) !== expectedNumber) file.fail(`Expected paragraph ${String(expectedNumber).padStart(2, '0')}, found ${number}.`, heading);

      const following = tree.children[index + 1];
      const translation = tree.children[index + 2];
      const ordinary = speechSection(number, following, translation);
      const quote = following?.type === 'containerDirective' ? quoteSection(number, following) : null;
      const section = quote ?? ordinary;
      const consumed = quote ? 2 : 3;
      if (!section) {
        file.fail('A numbered entry must contain an English paragraph and one quoted Chinese translation, or a `::: quote` block with the same pair.', heading);
      }
      section.forEach((node) => transformVocabulary(node, file));
      transformed.push(...section);
      expectedNumber += 1;
      index += consumed;
    }
    tree.children = transformed;
  };
}
