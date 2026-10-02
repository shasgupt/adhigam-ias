import { existsSync, readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative } from 'node:path';
import { execSync } from 'node:child_process';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Parse CLI arguments
const args = process.argv.slice(2);
const isDebug = args.includes('--debug') || args.includes('debug') || args.some((a) => a.startsWith('--mode=debug'));
const skipBuild = args.includes('--skip-build') || args.includes('--no-build');
const includeSource = args.includes('--source') || args.includes('--all');
const buildTag = isDebug ? 'debug' : 'release';

// Read package.json for version
const packageJsonPath = join(projectRoot, 'package.json');
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const version = pkg.version || '0.1.0';
const packageName = pkg.name || 'adhigam-ias';

console.log(`\n📦 Adhigam IAS Packaging Pipeline`);
console.log(`-----------------------------------------------`);
console.log(`• Project:     ${packageName}`);
console.log(`• Version:     v${version}`);
console.log(`• Build Tag:   ${buildTag.toUpperCase()}`);
console.log(`• Include Src: ${includeSource ? 'Yes' : 'No (Dist Only)'}`);
console.log(`-----------------------------------------------\n`);

// Step 1: Run build if not skipped
if (!skipBuild) {
  const buildScript = isDebug ? 'npm run build:debug' : 'npm run build';
  console.log(`⚙️  Running build command: "${buildScript}"...`);
  try {
    execSync(buildScript, { cwd: projectRoot, stdio: 'inherit' });
    console.log(`✅ Build completed successfully.\n`);
  } catch (error) {
    console.error(`❌ Build failed:`, error.message);
    process.exit(1);
  }
} else {
  console.log(`⏭️  Skipping build step (--skip-build requested).\n`);
}

// Check dist folder
const distDir = join(projectRoot, 'dist');
if (!existsSync(distDir)) {
  console.error(`❌ Error: 'dist' directory not found at ${distDir}. Run 'npm run build' first.`);
  process.exit(1);
}

// Step 2: Initialize JSZip
const zip = new JSZip();

// Recursive helper to collect files
function addDirectoryToZip(zipFolder, currentDir, baseDir) {
  let fileCount = 0;
  let totalBytes = 0;
  const entries = readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(currentDir, entry.name);
    const relPath = relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      const nestedFolder = zipFolder.folder(entry.name);
      const subResult = addDirectoryToZip(nestedFolder, fullPath, baseDir);
      fileCount += subResult.fileCount;
      totalBytes += subResult.totalBytes;
    } else if (entry.isFile()) {
      const content = readFileSync(fullPath);
      zipFolder.file(entry.name, content);
      fileCount += 1;
      totalBytes += content.length;
    }
  }

  return { fileCount, totalBytes };
}

console.log(`📂 Packaging 'dist' assets into ZIP archive...`);
const { fileCount, totalBytes } = addDirectoryToZip(zip, distDir, distDir);

// If source code inclusion is requested, also add source directories
if (includeSource) {
  console.log(`📂 Adding source code and project configuration files...`);
  const srcDirs = ['src', 'public', 'data', 'scripts'];
  const rootFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'server.ts', 'index.html', 'README.md'];

  for (const dir of srcDirs) {
    const dirPath = join(projectRoot, dir);
    if (existsSync(dirPath)) {
      const folder = zip.folder(dir);
      addDirectoryToZip(folder, dirPath, dirPath);
    }
  }

  for (const file of rootFiles) {
    const filePath = join(projectRoot, file);
    if (existsSync(filePath)) {
      zip.file(file, readFileSync(filePath));
    }
  }
}

// Determine target zip file name
const zipFileName = includeSource
  ? `adhigam-ias-source-v${version}-${buildTag}.zip`
  : `adhigam-ias-v${version}-${buildTag}.zip`;
const zipOutputPath = join(projectRoot, zipFileName);

// Generate and write the zip file
console.log(`🗜️  Compressing package to "${zipFileName}"...`);

zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: {
    level: 9,
  },
})
  .then((buffer) => {
    writeFileSync(zipOutputPath, buffer);
    const zipSizeKb = (buffer.length / 1024).toFixed(2);
    const uncompressedMb = (totalBytes / (1024 * 1024)).toFixed(2);

    console.log(`\n🎉 Package Created Successfully!`);
    console.log(`-----------------------------------------------`);
    console.log(`📁 File Name:     ${zipFileName}`);
    console.log(`📍 Absolute Path: ${zipOutputPath}`);
    console.log(`📄 Total Files:   ${fileCount} files`);
    console.log(`📊 Raw Size:      ${uncompressedMb} MB`);
    console.log(`🗜️  ZIP Size:      ${zipSizeKb} KB`);
    console.log(`🔖 Version:       v${version} [${buildTag.toUpperCase()}]`);
    console.log(`-----------------------------------------------\n`);
  })
  .catch((err) => {
    console.error(`❌ Compression failed:`, err);
    process.exit(1);
  });
