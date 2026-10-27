// Builds dist/chrome, dist/edge and dist/firefox from src/ and, with --zip,
// the distributable packages in dist/packages/.
//   node scripts/build.mjs [--zip] [--watch]
import { build, context } from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const args = new Set(process.argv.slice(2));
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

export const TARGETS = {
  chrome: {
    background: { service_worker: 'background.js' },
    minimum_chrome_version: '116',
  },
  edge: {
    background: { service_worker: 'background.js' },
    minimum_chrome_version: '116',
  },
  firefox: {
    // Firefox MV3 runs the background as an event page.
    background: { scripts: ['background.js'] },
    browser_specific_settings: {
      gecko: {
        id: 'new-papers@remydevbio',
        strict_min_version: '140.0',
        data_collection_permissions: { required: ['none'] },
      },
      gecko_android: { strict_min_version: '142.0' },
    },
  },
};

export async function makeManifest(target) {
  const base = JSON.parse(await readFile(path.join(src, 'manifest.base.json'), 'utf8'));
  return { ...base, version: pkg.version, ...TARGETS[target] };
}

const STATIC = ['ui/popup.html', 'ui/options.html', 'ui/themes.css', 'ui/base.css', 'ui/popup.css', 'ui/options.css'];
const ICONS = [16, 32, 48, 96, 128].map((s) => `icons/icon-${s}.png`);

async function buildTarget(target) {
  const out = path.join(dist, target);
  await rm(out, { recursive: true, force: true });
  await mkdir(path.join(out, 'icons'), { recursive: true });
  const opts = {
    entryPoints: {
      background: path.join(src, 'background/background.js'),
      popup: path.join(src, 'ui/popup.js'),
      options: path.join(src, 'ui/options.js'),
    },
    outdir: out,
    bundle: true,
    format: 'iife',
    target: target === 'firefox' ? ['firefox128'] : ['chrome116'],
    minify: false, // readable output for store review; no remote code
    legalComments: 'inline',
    logLevel: 'warning',
    define: { 'process.env.NODE_ENV': '"production"' },
  };
  if (args.has('--watch')) {
    const ctx = await context(opts);
    await ctx.watch();
  } else {
    await build(opts);
  }
  for (const f of STATIC) await cp(path.join(src, f), path.join(out, path.basename(f)));
  for (const f of ICONS) await cp(path.join(src, f), path.join(out, f));
  await writeFile(path.join(out, 'manifest.json'), `${JSON.stringify(await makeManifest(target), null, 2)}\n`);
  return out;
}

function zipDir(dir, file) {
  execFileSync('zip', ['-q', '-r', '-X', file, '.'], { cwd: dir });
}

const targets = Object.keys(TARGETS);
for (const t of targets) {
  const out = await buildTarget(t);
  console.log(`built ${path.relative(root, out)}`);
}

if (args.has('--zip')) {
  const pdir = path.join(dist, 'packages');
  await rm(pdir, { recursive: true, force: true });
  await mkdir(pdir, { recursive: true });
  for (const t of targets) {
    const ext = t === 'firefox' ? 'xpi' : 'zip';
    const file = path.join(pdir, `new-papers-${t}-${pkg.version}.${ext}`);
    zipDir(path.join(dist, t), file);
    if (t === 'firefox') zipDir(path.join(dist, t), file.replace(/\.xpi$/, '.zip'));
    console.log(`packaged ${path.relative(root, file)}`);
  }
  // Source archive (AMO asks for sources when the uploaded code is bundled).
  const srcZip = path.join(pdir, `new-papers-source-${pkg.version}.zip`);
  execFileSync('zip', ['-q', '-r', '-X', srcZip, 'src', 'scripts', 'test', 'package.json', 'package-lock.json', 'README.md', '-x', '*/node_modules/*'], { cwd: root });
  console.log(`packaged ${path.relative(root, srcZip)}`);
}
