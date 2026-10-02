import { rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const markerPath = resolve(projectRoot, '.last-build-type');
const buildType = process.argv[2];

if (buildType === 'clear') {
  rmSync(markerPath, { force: true });
} else if (buildType === 'debug' || buildType === 'release') {
  writeFileSync(markerPath, `${buildType}\n`);
} else {
  throw new Error('Build type must be "clear", "debug", or "release".');
}