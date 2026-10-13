import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';

// Keep legacy public URLs working, while the site itself uses immutable,
// content-versioned logos. The client build and prerender share this map so
// hydration requests exactly the same image URL as the initial HTML.
const directory = new URL('../public/', import.meta.url);
export const logoAssets = readdirSync(directory)
  .filter(name => /^rush-logo.*\.(png|webp)$/.test(name))
  .map(name => {
    const source = readFileSync(new URL(name, directory));
    const hash = createHash('sha256').update(source).digest('hex').slice(0, 12);
    return { name, source, fileName: `assets/${name.replace(/\.(png|webp)$/, `-${hash}.$1`)}` };
  });

export function versionLogoUrls(text) {
  for (const { name, fileName } of logoAssets) text = text.replaceAll(`./${name}`, `./${fileName}`);
  return text;
}

export function versionedLogos() {
  return {
    name: 'rush-versioned-logos',
    apply: 'build',
    transform(code, id) {
      if (!/[/\\]src[/\\].*\.[jt]sx?(?:\?|$)/.test(id)) return;
      const updated = versionLogoUrls(code);
      if (updated !== code) return { code: updated, map: null };
    },
    generateBundle() {
      for (const { source, fileName } of logoAssets) this.emitFile({ type: 'asset', fileName, source });
    },
  };
}
