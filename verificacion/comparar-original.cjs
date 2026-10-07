// Compara las dos webs servidas localmente. Las imágenes y fuentes se esperan antes de capturar.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const fs = require('node:fs');
const assert = require('node:assert/strict');

const reference = process.env.ORIGINAL_URL || 'http://127.0.0.1:4334';
const replica = process.env.PREVIEW_URL || 'http://127.0.0.1:4327';

async function capture(page, url, file) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    await Promise.all([...document.images].map(img => img.decode()));
    await document.fonts.ready;
  });
  await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; }' });
  await page.screenshot({ path: file, fullPage: true });
  return page.evaluate(() => ({
    title: document.title,
    text: document.body.innerText.replace(/\s+/g, ''),
    images: [...document.images].map(img => ({
      file: new URL(img.src).pathname,
      alt: img.alt,
      width: img.naturalWidth,
      height: img.naturalHeight,
    })),
    sections: [...document.querySelectorAll('main > section')].map(section => section.getAttribute('aria-labelledby')),
    pageHeight: document.documentElement.scrollHeight,
  }));
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = { comparisons: [] };
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    await page.context().route('https://wa.me/**', route => route.abort());
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      const originalFile = `verificacion/original-${width}.png`;
      const replicaFile = `verificacion/replica-${width}.png`;
      const original = await capture(page, reference, originalFile);
      const migrated = await capture(page, replica, replicaFile);
      assert.equal(migrated.title, original.title, 'Cambió el título de la página');
      assert.equal(migrated.text, original.text, 'Cambió el contenido de la página');
      assert.deepEqual(migrated.images, original.images, 'Cambió una imagen o su texto alternativo');
      assert.deepEqual(migrated.sections, original.sections, 'Cambió el orden de las secciones');
      const a = await sharp(originalFile).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const b = await sharp(replicaFile).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const matchingDimensions = a.info.width === b.info.width && a.info.height === b.info.height;
      let changedPixels = 0;
      let channelDifference = 0;
      if (matchingDimensions) {
        for (let offset = 0; offset < a.data.length; offset += 4) {
          let maxDifference = 0;
          for (let channel = 0; channel < 3; channel++) {
            const difference = Math.abs(a.data[offset + channel] - b.data[offset + channel]);
            channelDifference += difference;
            maxDifference = Math.max(maxDifference, difference);
          }
          if (maxDifference > 16) changedPixels++;
        }
      }
      report.comparisons.push({
        viewport: width,
        contentMatches: true,
        imagesMatch: true,
        sectionOrderMatches: true,
        matchingDimensions,
        originalHeight: original.pageHeight,
        replicaHeight: migrated.pageHeight,
        changedPixelsPercent: matchingDimensions ? +(100 * changedPixels / (a.info.width * a.info.height)).toFixed(4) : null,
        meanChannelDifference: matchingDimensions ? +(channelDifference / (a.info.width * a.info.height * 3)).toFixed(4) : null,
      });
    }
    fs.writeFileSync('verificacion/comparacion-original.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
