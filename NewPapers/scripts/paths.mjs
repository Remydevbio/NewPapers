// Browser locations for the E2E tests and icon rendering.
// CHROME_PATH / FIREFOX_PATH override them. Otherwise Chrome for Testing is
// looked up in a shared "Tools/chrome-for-testing/current" folder next to any
// parent directory of this project (branded Chrome 137+ ignores --load-extension).
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function findSharedChrome() {
  const rel = path.join('Tools', 'chrome-for-testing', 'current', 'chrome-linux64', 'chrome');
  for (let dir = path.dirname(fileURLToPath(import.meta.url)); ; dir = path.dirname(dir)) {
    if (existsSync(path.join(dir, rel))) return path.join(dir, rel);
    if (path.dirname(dir) === dir) return 'chrome';
  }
}

export const CHROME_PATH = process.env.CHROME_PATH || findSharedChrome();
export const FIREFOX_PATH = process.env.FIREFOX_PATH || '/usr/bin/firefox';
