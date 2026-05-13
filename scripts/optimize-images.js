const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const ASSET_DIRS = ['src/assets/hero', 'src/assets/images'];
const MIN_SIZE_BYTES = 100 * 1024;

const SETTINGS = {
  webp: { quality: 72, effort: 6 },
  png: { quality: 78, compressionLevel: 9, adaptiveFiltering: true },
};

async function optimizeImage(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  const ext = path.extname(filePath).toLowerCase();
  const original = await fs.readFile(filePath);
  const before = original.byteLength;
  const image = sharp(original, { animated: true }).rotate();
  const metadata = await image.metadata();

  let pipeline = image.resize({
    width: Math.min(metadata.width || 1600, 1600),
    height: Math.min(metadata.height || 1200, 1200),
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (ext === '.webp') {
    pipeline = pipeline.webp(SETTINGS.webp);
  } else if (ext === '.png') {
    pipeline = pipeline.png(SETTINGS.png);
  } else {
    return null;
  }

  const optimized = await pipeline.toBuffer();

  if (optimized.byteLength >= before) {
    return { relativePath, before, after: before, skipped: true };
  }

  await fs.writeFile(filePath, optimized);
  return { relativePath, before, after: optimized.byteLength, skipped: false };
}

async function collectTargets(directory) {
  const dirPath = path.join(ROOT, directory);
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const targets = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      targets.push(...await collectTargets(entryPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!['.png', '.webp'].includes(ext)) {
      continue;
    }

    const stats = await fs.stat(path.join(ROOT, entryPath));
    if (stats.size >= MIN_SIZE_BYTES) {
      targets.push(entryPath);
    }
  }

  return targets;
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  const targets = (await Promise.all(ASSET_DIRS.map(collectTargets))).flat();
  const results = [];

  for (const target of targets) {
    results.push(await optimizeImage(target));
  }

  const completed = results.filter(Boolean);
  const before = completed.reduce((sum, item) => sum + item.before, 0);
  const after = completed.reduce((sum, item) => sum + item.after, 0);

  for (const item of completed) {
    const status = item.skipped ? 'skipped' : 'optimized';
    console.log(`${status}: ${item.relativePath} ${formatBytes(item.before)} -> ${formatBytes(item.after)}`);
  }

  console.log(`total: ${formatBytes(before)} -> ${formatBytes(after)}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
