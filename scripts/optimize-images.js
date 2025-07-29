const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../src/assets/images');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/images-optimized');

const SIZES = {
  small: { width: 400, height: 300 },
  medium: { width: 800, height: 600 },
  large: { width: 1200, height: 900 }
};

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const { quality = 80, maxWidth = 1200, maxHeight = 900 } = options;
    const metadata = await sharp(inputPath).metadata();

    if (metadata.format === 'svg') {
      return;
    }

    for (const [sizeName, { width, height }] of Object.entries(SIZES)) {
      const sizedOutputPath = outputPath.replace(/\.[^.]+$/, `-${sizeName}`);
      await sharp(inputPath).resize(width, height, { fit: 'inside', withoutEnlargement: true }).webp({ quality }).toFile(`${sizedOutputPath}.webp`);
      await sharp(inputPath).resize(width, height, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality, progressive: true }).toFile(`${sizedOutputPath}.jpg`);
    }

    await sharp(inputPath).resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true }).webp({ quality }).toFile(outputPath.replace(/\.[^.]+$/, '.webp'));
    await sharp(inputPath).resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality, progressive: true }).toFile(outputPath.replace(/\.[^.]+$/, '.jpg'));

  } catch (error) {
    console.error(`❌ Error optimizando ${inputPath}:`, error);
  }
}

async function processDirectory(dirPath, outputDir) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      const relativePath = path.relative(IMAGES_DIR, fullPath);
      const outputPath = path.join(outputDir, relativePath);
      if (item.isDirectory()) {
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await processDirectory(fullPath, outputDir);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          await fs.mkdir(path.dirname(outputPath), { recursive: true });
          await optimizeImage(fullPath, outputPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error procesando directorio ${dirPath}:`, error);
  }
}

async function main() {
  try {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await processDirectory(IMAGES_DIR, OUTPUT_DIR);
  } catch (error) {
    console.error('❌ Error durante la optimización:', error);
    process.exit(1);
  }
}

if (require.main === module) { main(); }
module.exports = { optimizeImage, processDirectory };
