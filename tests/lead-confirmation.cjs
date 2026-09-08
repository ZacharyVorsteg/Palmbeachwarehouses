'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

// Serve checked-out files by interception, never by the live domain. PBW_TEST_ROOT
// may point to the staged public artifact after a build. Every request is fulfilled
// locally or aborted, including mocked CRM and conversion API requests.
const root = path.resolve(process.env.PBW_TEST_ROOT || path.join(__dirname, '..'));
const origin = 'https://palmbeachwarehouses.com';
const crm = 'https://trusenda.com/.netlify/functions/';
const accepted = { status: 201, json: { success: true, leadId: 101 } };
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.vcf': 'text/vcard' };
let browser;
before(async () => { browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); });
after(async () => { await browser?.close(); });

async function open(t, { width = 1440, route = '/', reducedMotion = 'reduce', clock = false, init } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion, serviceWorkers: 'block' });
  const state = { posts: [], capi: [], unexpectedWrites: [], errors: [], response: accepted, release: null };
  t.after(async () => { state.release?.(); await context.close(); assert.deepEqual(state.errors, [], 'No uncaught page errors'); assert.deepEqual(state.unexpectedWrites, [], 'No unexpected write attempted'); });
  await context.route('**/*', async intercepted => {
    const request = intercepted.request(), url = new URL(request.url());
    if (request.url().startsWith(crm + 'get-public-form') && request.method() === 'GET') return intercepted.fulfill({ json: { tenantId: 'synthetic-fixture-owner' } });
    if (url.href === crm + 'ingest-lead' && request.method() === 'POST') {
      state.posts.push(request.postDataJSON());
      const result = typeof state.response === 'function' ? await state.response() : state.response;
      if (result.abort) return intercepted.abort('failed');
      return intercepted.fulfill(result);
    }
    if (url.origin === origin && url.pathname === '/.netlify/functions/fb-capi' && request.method() === 'POST') {
      state.capi.push(request.postDataJSON());
      return intercepted.fulfill({ json: { fixture: true } });
    }
    if (!['GET', 'HEAD'].includes(request.method())) { state.unexpectedWrites.push({ method: request.method(), path: url.pathname }); return intercepted.abort(); }
    if (url.origin !== origin || url.pathname.startsWith('/.netlify/functions/')) return intercepted.abort();
    let filename;
    try {
      filename = path.resolve(root, '.' + decodeURIComponent(url.pathname));
      if (filename !== root && !filename.startsWith(root + path.sep)) return intercepted.abort();
      if (fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html');
      return intercepted.fulfill({ status: 200, contentType: mime[path.extname(filename)] || 'application/octet-stream', body: fs.readFileSync(filename) });
    } catch { return intercepted.fulfill({ status: 404, body: '' }); }
  });
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  if (clock) await page.clock.install();
  page.setDefaultTimeout(8000);
  page.on('pageerror', error => state.errors.push(error.message));
  const response = await page.goto(origin + route, { waitUntil: 'load' });
  assert.equal(response.status(), 200);
  await page.waitForFunction(() => [...document.querySelectorAll('form')].some(form => form.dataset.leadFormType));
  await page.evaluate(() => {
    window.__fixturePixels = [];
    window.gtag = (...args) => window.__fixturePixels.push({ provider: 'google', args });
    window.fbq = (...args) => window.__fixturePixels.push({ provider: 'meta', args });
    window.__fixtureScrolls = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (options) { window.__fixtureScrolls.push({ id: this.id, options }); return original.call(this, options); };
  });
  if (clock) await page.clock.resume();
  await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
  return { page, state };
}
async function fillTenant(page, form = page.locator('#lead-form')) {
  for (const [name, value] of Object.entries({ name: 'Synthetic Receipt Fixture', email: 'receipt@example.invalid', phone: '2025550148', company: 'Synthetic company' })) {
    const field = form.locator(`[name="${name}"]`);
    if (await field.count()) await field.fill(value);
  }
  for (const field of await form.locator('select[required]').all()) await field.selectOption({ index: 1 });
  return form;
}
async function submit(form) { await form.locator('button[type="submit"]').click(); }
async function receipt(page) { await page.locator('#success-message').waitFor({ state: 'visible' }); await page.waitForFunction(() => document.activeElement.id === 'success-message'); }
async function pixels(page) { return page.evaluate(() => window.__fixturePixels.filter(event => event.args[1] === 'conversion' || event.args[1] === 'Lead')); }
async function noReceipt(page, state) {
  assert.equal(await page.locator('#success-message').isVisible(), false);
  assert.equal(await page.locator('body').evaluate(node => node.classList.contains('tenant-request-received')), false);
  assert.equal(state.capi.length, 0);
  assert.deepEqual(await pixels(page), []);
}
async function noOverflow(page, label) {
  const box = await page.evaluate(() => ({ actual: document.documentElement.scrollWidth, available: innerWidth }));
  assert.ok(box.actual <= box.available + 1, `${label}: ${box.actual}px exceeds ${box.available}px`);
}
async function successfulPixels(page, state) {
  await page.waitForFunction(() => window.__fixturePixels.some(event => event.args[1] === 'Lead'));
  const events = await pixels(page);
  assert.equal(events.filter(event => event.provider === 'google').length, 1);
  assert.equal(events.filter(event => event.provider === 'meta').length, 1);
  // CAPI hashes are async. Poll only the local fixture state; no outbound request occurs.
  for (let attempt = 0; attempt < 50 && state.capi.length === 0; attempt++) await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(state.capi.length, 1);
  const google = events.find(event => event.provider === 'google').args[2].transaction_id;
  const meta = events.find(event => event.provider === 'meta').args[3].eventID;
  assert.equal(google, meta);
  assert.equal(state.capi[0].event_id, meta, 'Browser and mocked server conversion share the existing deduplication ID');
}

test('native invalid form cannot start a request or show a receipt', async t => {
  const { page, state } = await open(t);
  const form = page.locator('#lead-form');
  await submit(form);
  assert.equal(state.posts.length, 0);
  await noReceipt(page, state);
  assert.equal(await form.locator('button[type="submit"]').isEnabled(), true);
});

test('pending response keeps acquisition form visible and blocks duplicate requests; accepted response completes once', async t => {
  const { page, state } = await open(t, { width: 390 });
  const form = await fillTenant(page);
  const gate = new Promise(resolve => { state.release = resolve; });
  state.response = async () => { await gate; return accepted; };
  await submit(form);
  await page.waitForFunction(() => document.getElementById('lead-form').getAttribute('aria-busy') === 'true');
  assert.equal(await form.isVisible(), true);
  assert.equal(await form.locator('button[type="submit"]').isDisabled(), true);
  assert.equal(await form.getAttribute('data-submitted'), null);
  await noReceipt(page, state);
  await page.evaluate(() => { const form = document.getElementById('lead-form'); form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
  assert.equal(state.posts.length, 1);
  state.release();
  await receipt(page);
  assert.equal(await form.getAttribute('data-submitted'), 'true');
  await successfulPixels(page, state);
  await page.evaluate(() => { const form = document.getElementById('lead-form'); form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
  assert.equal(state.posts.length, 1);
  await successfulPixels(page, state);
});

test('unaccepted responses preserve inputs, show persistent errors, and permit one retry', async t => {
  const cases = [
    ['HTTP failure', { status: 500, json: { success: true, leadId: 101 } }],
    ['capacity response', { status: 402, json: { error: 'Synthetic capacity failure' } }],
    ['rejected receipt', { status: 200, json: { success: false, leadId: 101 } }],
    ['nonboolean success', { status: 200, json: { success: 'true', leadId: 101 } }],
    ['missing ID', { status: 200, json: { success: true } }],
    ['object ID', { status: 200, json: { success: true, leadId: {} } }],
    ['array ID', { status: 200, json: { success: true, leadId: [101] } }],
    ['negative ID', { status: 200, json: { success: true, leadId: -1 } }],
    ['fractional ID', { status: 200, json: { success: true, leadId: 1.5 } }],
    ['nonnumeric ID', { status: 200, json: { success: true, leadId: 'unknown' } }],
    ['null body', { status: 200, json: null }],
    ['malformed JSON', { status: 200, contentType: 'application/json', body: '{' }],
    ['network failure', { abort: true }],
  ];
  for (const [label, response] of cases) await t.test(label, async sub => {
    const { page, state } = await open(sub);
    const form = await fillTenant(page);
    state.response = response;
    await submit(form);
    await form.locator('#form-message, [data-form-message]').waitFor({ state: 'visible' });
    await noReceipt(page, state);
    assert.equal(state.posts.length, 1);
    assert.equal(await form.isVisible(), true);
    assert.equal(await form.locator('[name="email"]').inputValue(), 'receipt@example.invalid');
    assert.equal(await form.locator('[name="company"]').inputValue(), 'Synthetic company');
    assert.equal(await form.locator('button[type="submit"]').isEnabled(), true);
    assert.equal(await form.getAttribute('data-submitted'), null);
    assert.equal(await form.getAttribute('aria-busy'), null);
    // A delayed reader still has the error and original input; it is not a temporary button label.
    await page.waitForTimeout(100);
    assert.equal(await form.locator('#form-message, [data-form-message]').isVisible(), true);
    state.response = accepted;
    await submit(form);
    await receipt(page);
    assert.equal(state.posts.length, 2);
    await successfulPixels(page, state);
  });
});

test('valid numeric-string receipt preserves the intended payload fields and qualification path', async t => {
  const { page, state } = await open(t, { route: '/?utm_source=fixture&utm_campaign=receipt-test' });
  state.response = { status: 201, json: { success: true, leadId: '9007199254740993' } };
  const form = await fillTenant(page);
  await form.locator('[name="property_use"]').selectOption('Flex Space');
  await form.locator('[name="space_size"]').selectOption({ index: 2 });
  await page.locator('.advanced-toggle').click();
  await form.locator('[name="preferred_location"]').fill('Jupiter');
  await form.locator('[name="notes"]').fill('Synthetic requirement: room for equipment.');
  await form.locator('[name="req_yard"]').check();
  await submit(form); await receipt(page);
  const payload = state.posts[0];
  assert.equal(payload.tenant_id, 'synthetic-fixture-owner');
  assert.equal(payload.name, 'Synthetic Receipt Fixture');
  assert.equal(payload.email, 'receipt@example.invalid');
  assert.equal(payload.phone, '2025550148');
  assert.equal(payload.company, 'Synthetic company');
  assert.equal(payload.propertyType, 'Flex Space');
  assert.equal(payload.preferredArea, 'Jupiter');
  assert.ok(payload.sizeMin > 0 && payload.sizeMax >= payload.sizeMin);
  assert.match(payload.notes, /Synthetic requirement: room for equipment/);
  assert.match(payload.notes, /Yard \/ outside storage/);
  assert.match(payload.notes, /utm_source: fixture/);
  assert.match(payload.notes, /utm_campaign: receipt-test/);
  await successfulPixels(page, state);
});

test('main receipt has one confirmation and agent card, no duplicated intake chrome, and useful next actions', async t => {
  const { page } = await open(t);
  await submit(await fillTenant(page)); await receipt(page);
  const panel = page.locator('#success-message');
  assert.equal(await panel.getAttribute('role'), 'region');
  assert.equal(await panel.getAttribute('aria-labelledby'), 'success-headline');
  assert.equal(await panel.getAttribute('aria-describedby'), 'success-subtitle');
  assert.equal((await page.locator('#success-headline').innerText()).trim(), 'Request received');
  assert.equal(await panel.locator('h1,h2,h3').count(), 1);
  assert.equal(await panel.locator('.success-agent').count(), 1);
  assert.equal(await page.locator('#success-callout').count(), 0);
  assert.equal((await panel.innerText()).match(/request received/gi)?.length, 1);
  assert.match(await page.locator('#success-subtitle').innerText(), /review your requirements and contact you about suitable spaces/);
  assert.equal((await panel.locator('.success-appointment').innerText()).trim(), 'Tours are arranged by appointment.');
  for (const selector of ['#form > .form-head', '#form > .agent-strip', '#form > .trusenda-credit']) assert.equal(await page.locator(selector).isVisible(), false, selector);
  const actions = await panel.locator('a[href],button').evaluateAll(nodes => nodes.map(node => ({ name: node.textContent.trim(), href: node.getAttribute('href'), disabled: node.disabled })));
  assert.ok(actions.some(action => action.href?.startsWith('tel:')));
  assert.ok(actions.some(action => action.href?.endsWith('.vcf')));
  assert.ok(actions.some(action => /Browse Listings/i.test(action.name)));
});

test('receipt focus respects reduced motion and leaves keyboard access to contact actions', async t => {
  const { page } = await open(t, { width: 390, reducedMotion: 'reduce' });
  await submit(await fillTenant(page)); await receipt(page);
  const scroll = await page.evaluate(() => window.__fixtureScrolls.filter(call => call.id === 'success-message').at(-1));
  assert.ok(scroll);
  assert.notEqual(scroll.options.behavior, 'smooth');
  assert.equal(await page.locator('#success-message').getAttribute('tabindex'), '-1');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.getElementById('success-message').contains(document.activeElement)), true);
  const visible = await page.evaluate(() => { const box = document.activeElement.getBoundingClientRect(); return box.width > 0 && box.height > 0 && box.top >= 0 && box.bottom <= innerHeight; });
  assert.equal(visible, true);
});

test('accepted main request suppresses sticky acquisition and exit-intent after scrolling', async t => {
  const { page } = await open(t, { width: 390 });
  await submit(await fillTenant(page)); await receipt(page);
  await page.locator('#listings').scrollIntoViewIfNeeded();
  await page.evaluate(() => { document.activeElement.blur(); dispatchEvent(new Event('scroll')); });
  await page.waitForTimeout(100);
  assert.equal(await page.locator('#sticky-mobile').isVisible(), false);
  assert.equal(await page.locator('#sticky-mobile').getAttribute('aria-hidden'), 'true');
  assert.equal(await page.locator('body').evaluate(node => node.classList.contains('tenant-request-received')), true);
});

test('desktop exit-intent cannot replace the accepted receipt', async t => {
  const { page } = await open(t, { width: 1440, clock: true });
  await submit(await fillTenant(page)); await receipt(page);
  await page.clock.fastForward(9000);
  await page.evaluate(() => document.dispatchEvent(new MouseEvent('mouseleave', { clientY: 0 })));
  assert.equal(await page.locator('#exit-overlay').isVisible(), false);
  assert.equal(await page.locator('#success-message').isVisible(), true);
});

test('report form has its own receipt and never completes or hides the main tenant form', async t => {
  const { page, state } = await open(t, { width: 1440, clock: true });
  const main = await fillTenant(page);
  const originalHeadline = await page.locator('#success-headline').textContent();
  await page.clock.fastForward(9000);
  await page.evaluate(() => document.dispatchEvent(new MouseEvent('mouseleave', { clientY: 0 })));
  await page.locator('#exit-overlay').waitFor({ state: 'visible' });
  const report = page.locator('#report-lead-form');
  await report.locator('[name="email"]').fill('report@example.invalid');
  await submit(report);
  await page.locator('#exit-overlay [role="status"]').filter({ hasText: /report request has been received/ }).waitFor();
  assert.equal(await main.isVisible(), true);
  assert.equal(await main.getAttribute('data-submitted'), null);
  assert.equal(await main.locator('[name="name"]').inputValue(), 'Synthetic Receipt Fixture');
  assert.equal(await page.locator('#success-headline').textContent(), originalHeadline);
  await noReceipt(page, state);
  assert.equal(state.posts.length, 1);
  assert.match(state.posts[0].notes, /MARKET REPORT DOWNLOAD/);
});

test('location form retains its authored receipt instead of receiving the homepage receipt copy', async t => {
  const { page, state } = await open(t, { route: '/locations/jupiter/', width: 390 });
  const before = await page.locator('#success-message').innerHTML();
  await submit(await fillTenant(page)); await receipt(page);
  assert.equal(await page.locator('#success-message').innerHTML(), before);
  assert.equal(await page.locator('#success-message #success-callout').count(), 0);
  assert.equal(state.posts.length, 1);
  assert.equal(state.posts[0].preferredArea, 'Jupiter, FL');
});

test('explicit restart restores intake state and allows a deliberately new request', async t => {
  const { page, state } = await open(t, { width: 390 });
  await submit(await fillTenant(page)); await receipt(page);
  // Existing listing/city actions use this public reset hook to start another inquiry.
  await page.evaluate(() => window.resetForm());
  assert.equal(await page.locator('#lead-form').isVisible(), true);
  assert.equal(await page.locator('#lead-form').getAttribute('data-submitted'), null);
  assert.equal(await page.locator('#form').evaluate(node => node.classList.contains('is-complete')), false);
  assert.equal(await page.locator('body').evaluate(node => node.classList.contains('tenant-request-received')), false);
  assert.equal(await page.locator('#form > .form-head').isVisible(), true);
  assert.equal(await page.locator('#success-message').isVisible(), false);
  await submit(await fillTenant(page)); await receipt(page);
  assert.equal(state.posts.length, 2);
  assert.equal((await pixels(page)).filter(event => event.provider === 'google').length, 2);
});

test('receipt stays contained at 320/390/768/1440px and does not overlap fixed acquisition UI', async t => {
  for (const width of [320, 390, 768, 1440]) await t.test(`${width}px`, async sub => {
    const { page } = await open(sub, { width });
    await submit(await fillTenant(page)); await receipt(page);
    await noOverflow(page, 'receipt');
    const metrics = await page.locator('#success-message').evaluate(node => {
      const box = node.getBoundingClientRect();
      const actions = [...node.querySelectorAll('a[href],button')].map(action => { const rect = action.getBoundingClientRect(); return { left: rect.left, right: rect.right, width: rect.width, height: rect.height }; });
      return { left: box.left, right: box.right, width: box.width, actions };
    });
    assert.ok(metrics.left >= -1 && metrics.right <= width + 1);
    assert.ok(metrics.actions.every(action => action.left >= metrics.left - 1 && action.right <= metrics.right + 1 && action.width > 0 && action.height >= 24));
    assert.equal(await page.locator('#form > .agent-strip').isVisible(), false);
    assert.equal(await page.locator('#sticky-mobile').isVisible(), false);
    if (process.env.PBW_RECEIPT_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.PBW_RECEIPT_SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({path: path.join(process.env.PBW_RECEIPT_SCREENSHOT_DIR, `receipt-${width}.png`)});
    }
  });
});
