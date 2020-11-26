const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs');

const MAX_SIZE = 1200;
const DRY_RUN = true;

glob('images/**/*.jpg', async (err, files) => {
  for (const file of files) {
    if (file.includes('.tmp')) {
      continue;
    }
    const img = sharp(file);
    const metadata = await img.metadata();
    const { width, height } = metadata;
    if (width > MAX_SIZE || height > MAX_SIZE) {
      console.log(file, width, height);
      if (!DRY_RUN) {
        const tmp = file.replace('.jpg', '.tmp.jpg');
        await sharp(file).resize(MAX_SIZE, MAX_SIZE, { fit: 'inside', withoutEnlargement: true }).rotate().toFile(tmp);
        await fs.promises.rename(tmp, file);
      }
    }
  }
});
