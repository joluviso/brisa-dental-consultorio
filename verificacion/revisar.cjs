// Local integration review. Requires Playwright and an installed Chrome browser.
// Run from the project root with npm run preview listening on http://127.0.0.1:4327.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4327';
const report = { viewports: [], checks: [], errors: [], externalRequests: [] };

async function loadImages(page) {
  await page.evaluate(async () => {
    // Force only the local lazy images to load before taking a full-page capture.
    document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
    await document.fonts.ready;
  });
}
async function measure(page) {
  return page.evaluate(() => ({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    brokenImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
    h1Count: document.querySelectorAll('h1').length,
    fontsReady: document.fonts.check('600 24px Manrope') && document.fonts.check('400 18px "Source Sans 3"'),
    heroFont: getComputedStyle(document.querySelector('h1')).fontSize,
    bodyFont: getComputedStyle(document.body).fontSize
  }));
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    // Prevent WhatsApp tests from reaching an external service or sending messages.
    await page.context().route('https://wa.me/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<title>WhatsApp — prueba local</title>Enlace interceptado para verificación local.' }));
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('request', request => {
      if (!request.url().startsWith(base) && !request.url().startsWith('file:')) report.externalRequests.push(request.url());
    });

    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      await page.goto(base, { waitUntil: 'networkidle' });
      await loadImages(page);
      const metrics = await measure(page);
      report.viewports.push(metrics);
      await page.screenshot({ path: `verificacion/${width < 768 ? 'movil' : 'escritorio'}-${width}.png`, fullPage: true });
      if ([390, 1440].includes(width)) await page.screenshot({ path: `verificacion/portada-${width}.png` });
    }

    // Conversion links open WhatsApp with the configured recipient and treatment.
    const configuredNumber = await page.locator('meta[name="whatsapp-number"]').getAttribute('content');
    const invalidLinks = await page.locator('[data-whatsapp]').evaluateAll((links, number) => links.filter(link => {
      const url = new URL(link.href);
      return url.hostname !== 'wa.me' || url.pathname !== `/${number}` || !url.searchParams.get('text') || link.target !== '_blank' || !link.rel.includes('noopener');
    }).map(link => link.outerHTML), configuredNumber);
    assert.deepEqual(invalidLinks, []);
    const treatmentPopupPromise = page.waitForEvent('popup');
    await page.locator('[data-treatment="Brackets y alineadores"]').first().click();
    const treatmentPopup = await treatmentPopupPromise;
    await treatmentPopup.waitForLoadState();
    const treatmentURL = new URL(treatmentPopup.url());
    assert.equal(treatmentURL.pathname, `/${configuredNumber}`);
    assert.match(treatmentURL.searchParams.get('text'), /brackets y alineadores/);
    await treatmentPopup.close();
    report.checks.push('Todos los CTAs de contacto abren WhatsApp con el número configurado; las tarjetas incluyen el tratamiento. Enlaces interceptados localmente.');

    await page.evaluate(() => window.scrollTo({ top: 1800, behavior: 'instant' }));
    const stickyHeader = await page.locator('.site-header').boundingBox();
    assert.equal(await page.locator('.site-header').evaluate(el => getComputedStyle(el).position), 'fixed');
    assert(stickyHeader.y >= 0 && stickyHeader.y < 50);
    await page.screenshot({ path: 'verificacion/menu-flotante-escritorio.png' });
    report.checks.push('El encabezado permanece visible al desplazarse en escritorio.');

    // Keyboard input drives both the comparison image and its accessible value.
    const slider = page.locator('.comparison-slider').first();
    await slider.focus();
    await slider.press('ArrowRight');
    assert.equal(await slider.inputValue(), '51');
    assert.equal(await slider.getAttribute('aria-valuetext'), '51% de la imagen antes visible');
    assert.equal(await slider.evaluate(el => el.parentElement.style.getPropertyValue('--position')), '51%');
    report.checks.push('Comparadores: imagen y descripción accesible responden al teclado.');

    await page.locator('[data-testimonial="next"]').click();
    assert.equal(await page.locator('#testimonial-position').textContent(), '02 / 03');
    assert.equal(await page.locator('[data-slide="1"]').isVisible(), true);
    await page.locator('[data-testimonial="previous"]').click();
    assert.equal(await page.locator('[data-slide="0"]').isVisible(), true);
    report.checks.push('Testimonios: controles anterior y siguiente funcionan.');

    await page.locator('.accordion details').nth(1).locator('summary').click();
    await page.waitForFunction(() => document.querySelectorAll('.accordion details[open]').length === 1);
    assert.equal(await page.locator('.accordion details').nth(1).getAttribute('open'), '');
    report.checks.push('Preguntas frecuentes: apertura y cierre coherentes.');

    const submit = page.locator('.form-submit');
    await submit.click();
    assert.equal(await page.locator('#name').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator('#phone').getAttribute('aria-invalid'), 'true');
    await page.locator('#name').fill('Persona de prueba');
    await page.locator('#phone').fill('abc');
    await page.locator('#email').fill('incorrecto');
    await submit.click();
    assert.equal(await page.locator('#phone').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator('#email').getAttribute('aria-invalid'), 'true');
    await page.locator('#phone').fill('+52 55 1234 5678');
    await page.locator('#email').fill('');
    await page.locator('#treatment').selectOption('Brackets y alineadores');
    await page.locator('#date').fill(await page.locator('#date').getAttribute('min'));
    let submittedRequests = 0;
    page.on('request', request => { if (request.method() !== 'GET') submittedRequests++; });
    const formPopupPromise = page.waitForEvent('popup');
    await submit.click();
    const formPopup = await formPopupPromise;
    await formPopup.waitForLoadState();
    const formURL = new URL(formPopup.url());
    const message = formURL.searchParams.get('text');
    assert.equal(formURL.pathname, `/${configuredNumber}`);
    assert.match(message, /Nombre: Persona de prueba/);
    assert.match(message, /Teléfono: \+52 55 1234 5678/);
    assert.match(message, /Tratamiento: Brackets y alineadores/);
    assert.match(message, /Día de preferencia:/);
    assert(!message.includes('Correo:'));
    await formPopup.close();
    assert.match(await page.locator('#form-result').textContent(), /mensaje está preparado/);
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 0);
    assert.equal(submittedRequests, 0);
    report.checks.push('Formulario: validación y apertura de WhatsApp con un borrador que contiene los datos. No envía mensajes automáticamente.');
    await page.locator('#contacto').screenshot({ path: 'verificacion/formulario-validado.png' });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'networkidle' });
    const mobileBar = page.locator('.mobile-contact-bar');
    assert.equal(await mobileBar.isVisible(), true);
    const barRect = await mobileBar.boundingBox();
    assert(barRect.y + barRect.height <= 844 && barRect.y + barRect.height >= 810);
    assert.equal(await mobileBar.evaluate(el => getComputedStyle(el).position), 'fixed');
    const menu = page.locator('.menu-toggle');
    await menu.click();
    assert.equal(await menu.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('#main-nav').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    await menu.click();
    await page.locator('#main-nav a[href="#tratamientos"]').click();
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    await page.waitForFunction(() => {
      const target = document.querySelector('#tratamientos').getBoundingClientRect();
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-offset'));
      return Math.abs(target.top - offset) < 3;
    });
    const headerRect = await page.locator('.site-header').boundingBox();
    const serviceRect = await page.locator('#tratamientos').boundingBox();
    assert(serviceRect.y > headerRect.y + headerRect.height);
    await loadImages(page);
    await page.screenshot({ path: 'verificacion/menu-y-whatsapp-movil.png' });
    await page.locator('#name').focus();
    await mobileBar.waitFor({ state: 'hidden' });
    assert.equal(await mobileBar.isVisible(), false);
    await page.locator('#appointment-title').click();
    await mobileBar.waitFor({ state: 'visible' });
    assert.equal(await mobileBar.isVisible(), true);
    report.checks.push('Menú móvil: anclas sin quedar ocultas; CTA inferior fijo y oculto mientras se editan campos.');

    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base, { waitUntil: 'networkidle' });
      await loadImages(page);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      report.viewports.push({ ...await measure(page), textScale: '200%' });
      await page.screenshot({ path: `verificacion/texto-200-${width}.png`, fullPage: true });
    }

    // No-JavaScript fallback never permits a form submission.
    const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await noJs.goto(base);
    assert.equal(await noJs.locator('.form-submit').isDisabled(), true);
    assert.equal(await noJs.locator('#main-nav').isVisible(), true);
    report.checks.push('Sin JavaScript: navegación visible y formulario desactivado de forma segura.');
    await noJs.close();
    fs.writeFileSync('verificacion/resultados.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    assert.equal(report.errors.length, 0, 'Hay errores JavaScript.');
    assert.equal(report.externalRequests.length, 0, 'Hay solicitudes a servicios externos.');
    assert.equal(report.viewports.some(v => v.overflow || v.brokenImages.length || !v.fontsReady), false, 'Revisar desbordamiento, imágenes o fuentes.');
  } finally { await browser.close(); }
})().catch(error => {
  report.failure = error.message;
  fs.writeFileSync('verificacion/resultados.json', JSON.stringify(report, null, 2));
  console.error(error);
  process.exitCode = 1;
});
