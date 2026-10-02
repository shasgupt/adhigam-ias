import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative } from 'node:path';
import { execSync } from 'node:child_process';
import { deflateRawSync } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// CRC-32 Lookup Table for standard ZIP files (zero external dependencies)
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function calculateCRC32(buffer) {
  let crc = -1;
  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buffer[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

// Convert Date to MS-DOS date & time format for ZIP headers
function toDosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = Math.floor(date.getSeconds() / 2);

  const dosTime = (hours << 11) | (minutes << 5) | seconds;
  const dosDate = ((year - 1980) << 9) | (month << 5) | day;

  return { dosTime, dosDate };
}

// Zero-dependency in-memory ZIP builder using standard Deflate
class ZeroDepZip {
  constructor() {
    this.files = [];
  }

  addFile(name, contentBuffer) {
    const filenameUtf8 = Buffer.from(name.replace(/\\/g, '/'), 'utf8');
    const uncompressedSize = contentBuffer.length;
    const crc32 = calculateCRC32(contentBuffer);

    // Deflate compression
    let compressedData;
    let compressionMethod = 8; // DEFLATE
    try {
      compressedData = deflateRawSync(contentBuffer, { level: 9 });
      if (compressedData.length >= uncompressedSize) {
        // If compressed size is larger, store uncompressed
        compressedData = contentBuffer;
        compressionMethod = 0;
      }
    } catch {
      compressedData = contentBuffer;
      compressionMethod = 0;
    }

    this.files.push({
      filenameUtf8,
      crc32,
      compressionMethod,
      compressedSize: compressedData.length,
      uncompressedSize,
      compressedData,
    });
  }

  generateBuffer() {
    const { dosTime, dosDate } = toDosDateTime();
    const localHeaders = [];
    const centralEntries = [];
    let offset = 0;

    for (const file of this.files) {
      const localHeader = Buffer.alloc(30);
      localHeader.writeUInt32LE(0x04034b50, 0); // Local header signature
      localHeader.writeUInt16LE(20, 4);          // Min version needed (2.0)
      localHeader.writeUInt16LE(0x0800, 6);      // General purpose flags (UTF-8)
      localHeader.writeUInt16LE(file.compressionMethod, 8);
      localHeader.writeUInt16LE(dosTime, 10);
      localHeader.writeUInt16LE(dosDate, 12);
      localHeader.writeUInt32LE(file.crc32, 14);
      localHeader.writeUInt32LE(file.compressedSize, 18);
      localHeader.writeUInt32LE(file.uncompressedSize, 22);
      localHeader.writeUInt16LE(file.filenameUtf8.length, 26);
      localHeader.writeUInt16LE(0, 28);          // Extra field length

      const fileDataBlock = Buffer.concat([localHeader, file.filenameUtf8, file.compressedData]);
      localHeaders.push(fileDataBlock);

      // Central Directory Entry
      const centralHeader = Buffer.alloc(46);
      centralHeader.writeUInt32LE(0x02014b50, 0); // Central directory signature
      centralHeader.writeUInt16LE(20, 4);          // Version made by (2.0)
      centralHeader.writeUInt16LE(20, 6);          // Min version (2.0)
      centralHeader.writeUInt16LE(0x0800, 8);      // UTF-8 flag
      centralHeader.writeUInt16LE(file.compressionMethod, 10);
      centralHeader.writeUInt16LE(dosTime, 12);
      centralHeader.writeUInt16LE(dosDate, 14);
      centralHeader.writeUInt32LE(file.crc32, 16);
      centralHeader.writeUInt32LE(file.compressedSize, 20);
      centralHeader.writeUInt32LE(file.uncompressedSize, 24);
      centralHeader.writeUInt16LE(file.filenameUtf8.length, 28);
      centralHeader.writeUInt16LE(0, 30);          // Extra field length
      centralHeader.writeUInt16LE(0, 32);          // File comment length
      centralHeader.writeUInt16LE(0, 34);          // Disk number start
      centralHeader.writeUInt16LE(0, 36);          // Internal file attrs
      centralHeader.writeUInt32LE(0, 38);          // External file attrs
      centralHeader.writeUInt32LE(offset, 42);     // Relative offset of local header

      centralEntries.push(Buffer.concat([centralHeader, file.filenameUtf8]));
      offset += fileDataBlock.length;
    }

    const centralDirectoryBuffer = Buffer.concat(centralEntries);
    const centralDirectorySize = centralDirectoryBuffer.length;
    const centralDirectoryOffset = offset;

    // End of Central Directory Record (EOCD)
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
    eocd.writeUInt16LE(0, 4);          // Disk number
    eocd.writeUInt16LE(0, 6);          // Disk with central dir
    eocd.writeUInt16LE(this.files.length, 8);  // Entries on this disk
    eocd.writeUInt16LE(this.files.length, 10); // Total entries
    eocd.writeUInt32LE(centralDirectorySize, 12);
    eocd.writeUInt32LE(centralDirectoryOffset, 16);
    eocd.writeUInt16LE(0, 20);         // Comment length

    return Buffer.concat([...localHeaders, centralDirectoryBuffer, eocd]);
  }
}

// Parse Command Line Arguments
const rawArgs = process.argv.slice(2);
const args = rawArgs.map((a) => a.toLowerCase().trim());

// Check for version bump keywords: 'patch', 'minor', 'major'
const bumpType = args.find((a) => ['patch', 'minor', 'major'].includes(a));
const isDebug = args.includes('--debug') || args.includes('debug') || args.some((a) => a.startsWith('--mode=debug'));
const skipBuild = args.includes('--skip-build') || args.includes('--no-build');
const includeSource = args.includes('--source') || args.includes('--all');
const buildTag = isDebug ? 'debug' : 'release';

// Read and optionally bump package.json version
const packageJsonPath = join(projectRoot, 'package.json');
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
let version = pkg.version || '0.1.0';

if (bumpType) {
  const parts = version.split('.').map((p) => parseInt(p, 10) || 0);
  while (parts.length < 3) parts.push(0);

  if (bumpType === 'major') {
    parts[0] += 1;
    parts[1] = 0;
    parts[2] = 0;
  } else if (bumpType === 'minor') {
    parts[1] += 1;
    parts[2] = 0;
  } else if (bumpType === 'patch') {
    parts[2] += 1;
  }

  const newVersion = parts.join('.');
  pkg.version = newVersion;
  writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  console.log(`📌 Version bumped [${bumpType}]: v${version} ➔ v${newVersion}`);
  version = newVersion;
}

const packageName = pkg.name || 'adhigam-ias';

console.log(`\n📦 Adhigam IAS Standalone Packaging Pipeline`);
console.log(`-----------------------------------------------`);
console.log(`• Project:     ${packageName}`);
console.log(`• Version:     v${version}`);
console.log(`• Build Tag:   ${buildTag.toUpperCase()}`);
console.log(`• Engine:      Node.js Built-in Zero-Dependency Archiver`);
console.log(`-----------------------------------------------\n`);

// Ensure dependencies are installed before building
const nodeModulesDir = join(projectRoot, 'node_modules');
const viteBinExists = existsSync(join(nodeModulesDir, 'vite')) || existsSync(join(nodeModulesDir, '.bin', 'vite')) || existsSync(join(nodeModulesDir, '.bin', 'vite.cmd'));

if (!existsSync(nodeModulesDir) || !viteBinExists) {
  console.log(`⚠️  Local 'node_modules' or 'vite' binary was not found.`);
  console.log(`📥 Automatically running "npm install" to populate project dependencies...\n`);
  try {
    execSync('npm install', { cwd: projectRoot, stdio: 'inherit' });
    console.log(`\n✅ Dependencies installed successfully.\n`);
  } catch (installErr) {
    console.error(`\n❌ Failed to run 'npm install':`, installErr.message);
    console.error(`👉 Please run 'npm install' manually in your project directory first.\n`);
    process.exit(1);
  }
}

// Run build if not skipped
if (!skipBuild) {
  console.log(`⚙️  Executing Vite build (${buildTag.toUpperCase()})...`);
  try {
    // 1. Clear build marker
    const markerScript = join(projectRoot, 'scripts', 'set-build-type.mjs');
    execSync(`"${process.execPath}" "${markerScript}" clear`, { cwd: projectRoot, stdio: 'inherit' });

    // 2. Run Vite build directly with Node.js to bypass Windows shell/PATH issues
    const viteJsPath = join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
    if (existsSync(viteJsPath)) {
      const modeFlag = isDebug ? '--mode debug' : '';
      execSync(`"${process.execPath}" "${viteJsPath}" build ${modeFlag}`.trim(), { cwd: projectRoot, stdio: 'inherit' });
    } else {
      const fallbackCmd = isDebug ? 'npx vite build --mode debug' : 'npx vite build';
      execSync(fallbackCmd, { cwd: projectRoot, stdio: 'inherit' });
    }

    // 3. Set build marker
    execSync(`"${process.execPath}" "${markerScript}" ${buildTag}`, { cwd: projectRoot, stdio: 'inherit' });
    console.log(`\n✅ Build completed successfully.\n`);
  } catch (error) {
    console.error(`\n❌ Build failed with error:`, error.message);
    console.error(`💡 Tip: Ensure you ran 'npm install' in your project folder.`);
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

// Collect files into zip archive
const zip = new ZeroDepZip();

function addDirectory(currentDir, baseDir) {
  let count = 0;
  let rawBytes = 0;
  const entries = readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(currentDir, entry.name);
    const relPath = relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      const sub = addDirectory(fullPath, baseDir);
      count += sub.count;
      rawBytes += sub.rawBytes;
    } else if (entry.isFile()) {
      const fileBuffer = readFileSync(fullPath);
      zip.addFile(relPath, fileBuffer);
      count += 1;
      rawBytes += fileBuffer.length;
    }
  }

  return { count, rawBytes };
}

console.log(`📂 Packaging 'dist' assets into ZIP archive...`);
const { count: fileCount, rawBytes: totalBytes } = addDirectory(distDir, distDir);

// Add source files if --source was requested
if (includeSource) {
  console.log(`📂 Including source code files...`);
  const srcDirs = ['src', 'public', 'data', 'scripts', 'doc'];
  const rootFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'server.ts', 'index.html', 'README.md', 'BLUEHOST_DEPLOYMENT_STEPS.md'];

  for (const dir of srcDirs) {
    const dirPath = join(projectRoot, dir);
    if (existsSync(dirPath)) {
      addDirectory(dirPath, projectRoot);
    }
  }

  for (const file of rootFiles) {
    const filePath = join(projectRoot, file);
    if (existsSync(filePath)) {
      zip.addFile(file, readFileSync(filePath));
    }
  }
}

// Determine target filename
const zipFileName = includeSource
  ? `adhigam-ias-source-v${version}-${buildTag}.zip`
  : `adhigam-ias-v${version}-${buildTag}.zip`;
const zipOutputPath = join(projectRoot, zipFileName);

// Generate ZIP Buffer and write to file
console.log(`🗜️  Writing archive to "${zipFileName}"...`);
try {
  const zipBuffer = zip.generateBuffer();
  writeFileSync(zipOutputPath, zipBuffer);

  const zipSizeKb = (zipBuffer.length / 1024).toFixed(2);
  const rawMb = (totalBytes / (1024 * 1024)).toFixed(2);

  console.log(`\n🎉 Package Created Successfully!`);
  console.log(`-----------------------------------------------`);
  console.log(`📁 File Name:     ${zipFileName}`);
  console.log(`📍 Absolute Path: ${zipOutputPath}`);
  console.log(`📄 Total Files:   ${fileCount} files`);
  console.log(`📊 Uncompressed:  ${rawMb} MB`);
  console.log(`🗜️  ZIP Size:      ${zipSizeKb} KB`);
  console.log(`🔖 Version:       v${version} [${buildTag.toUpperCase()}]`);
  console.log(`-----------------------------------------------\n`);
} catch (err) {
  console.error(`❌ Packaging error:`, err);
  process.exit(1);
}
