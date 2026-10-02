import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Build Pipeline & Project Health', () => {
  it('should have valid package.json with necessary scripts and dependencies', () => {
    const pkgPath = path.join(process.cwd(), 'package.json');
    assert.ok(fs.existsSync(pkgPath), 'package.json must exist');

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    assert.equal(pkg.name, 'adhigam-ias');
    assert.ok(pkg.scripts.build, 'build script must be present');
    assert.ok(pkg.scripts.lint, 'lint script must be present');
    assert.ok(pkg.scripts.start, 'start script must be present');

    assert.ok(pkg.dependencies['react'], 'react must be in dependencies');
    assert.ok(pkg.dependencies['react-dom'], 'react-dom must be in dependencies');
    assert.ok(pkg.dependencies['lucide-react'], 'lucide-react must be in dependencies');
    assert.ok(pkg.dependencies['express'], 'express must be in dependencies');
    assert.ok(pkg.dependencies['@tailwindcss/vite'], '@tailwindcss/vite must be in dependencies');
    assert.ok(pkg.dependencies['@vitejs/plugin-react'], '@vitejs/plugin-react must be in dependencies');
  });

  it('should have clean entry points and vite config', () => {
    const indexHtml = path.join(process.cwd(), 'index.html');
    const serverTs = path.join(process.cwd(), 'server.ts');
    const viteConfig = path.join(process.cwd(), 'vite.config.ts');

    assert.ok(fs.existsSync(indexHtml), 'index.html entry must exist');
    assert.ok(fs.existsSync(serverTs), 'server.ts entry must exist');
    assert.ok(fs.existsSync(viteConfig), 'vite.config.ts must exist');

    const htmlContent = fs.readFileSync(indexHtml, 'utf-8');
    assert.ok(htmlContent.includes('ADHIGAM IAS'), 'index.html title must reflect academy branding');
  });

  it('should have packaging scripts present for distribution', () => {
    const packager = path.join(process.cwd(), 'scripts', 'package-versioned.mjs');
    assert.ok(fs.existsSync(packager), 'scripts/package-versioned.mjs must exist');
  });
});
