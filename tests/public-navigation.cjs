const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const publicRoot = path.resolve(__dirname, '../public');
const origin = 'https://palmbeachwarehouses.com';
const mobileRoutes = ['/blog/', '/locations/', '/market-report/', '/guides/landlord-resources/'];

async function localContext(browser, width) {
    const context = await browser.newContext({
        viewport: { width, height: 844 }, reducedMotion: 'reduce', serviceWorkers: 'block'
    });
    await context.route('**/*', route => {
        const request = route.request();
        const url = new URL(request.url());
        // All responses come from the built repository. Never contact a live API.
        if (request.method() !== 'GET' || url.origin !== origin ||
            /\/(?:api|\.netlify\/functions)\//.test(url.pathname) ||
            ['xhr', 'fetch', 'eventsource'].includes(request.resourceType())) return route.abort();
        let relative = decodeURIComponent(url.pathname).replace(/^\//, '');
        if (!relative || relative.endsWith('/')) relative += 'index.html';
        const file = path.resolve(publicRoot, relative);
        if (!file.startsWith(publicRoot + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
            return route.fulfill({ status: 404, body: '' });
        }
        return route.fulfill({ path: file });
    });
    context.setDefaultTimeout(7000);
    return context;
}

async function settle(page) {
    await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
}

async function assertInViewport(locator) {
    await locator.scrollIntoViewIfNeeded();
    assert.ok(await locator.isVisible(), 'navigation link must actually be visible');
    assert.ok(await locator.evaluate(element => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && box.left >= -1 && box.right <= innerWidth + 1 &&
            box.top >= -1 && box.bottom <= innerHeight + 1;
    }), 'navigation link must fit within the viewport after scrolling its menu');
}

async function mobileCase(browser, engineName, route, width) {
    const context = await localContext(browser, width);
    try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
        await settle(page);
        const button = page.locator('.mobile-menu-btn');
        const nav = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
        assert.equal(await button.getAttribute('aria-controls'), 'mobileNav');
        const previousOverflow = await page.evaluate(() => document.body.style.overflow);
        await button.click();
        assert.equal(await button.getAttribute('aria-expanded'), 'true');
        assert.ok(await nav.isVisible());
        assert.ok(await nav.locator('a[href]').first().evaluate(element => element === document.activeElement));
        assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        // A defined handler and expanded icon do not prove usable navigation.
        for (const link of await nav.locator('a[href]').all()) await assertInViewport(link);
        await page.keyboard.press('Escape');
        assert.equal(await button.getAttribute('aria-expanded'), 'false');
        assert.equal(await nav.isVisible(), false);
        assert.ok(await button.evaluate(element => element === document.activeElement));
        assert.equal(await page.evaluate(() => document.body.style.overflow), previousOverflow);

        await page.keyboard.press('Enter');
        assert.ok(await nav.isVisible());
        await page.setViewportSize({ width: 1440, height: 900 });
        // matchMedia change delivery is asynchronous in both browser engines.
        await page.waitForFunction(() => document.querySelector('.mobile-menu-btn').getAttribute('aria-expanded') === 'false');
        assert.equal(await nav.isVisible(), false);
        assert.equal(await page.evaluate(() => document.body.style.overflow), previousOverflow);
        assert.ok(await page.locator('.nav-desktop a[href]').first().evaluate(element => element === document.activeElement));
        const desktopToggle = page.locator('.nav-desktop .nav-dropdown-toggle').first();
        await desktopToggle.click();
        assert.ok(await desktopToggle.locator('..').locator('.nav-dropdown-menu').isVisible());
        await page.locator('h1').first().click();

        await page.setViewportSize({ width, height: 844 });
        await settle(page);
        assert.ok(await button.isVisible());
        assert.equal(await nav.isVisible(), false);
        await button.click();
        await nav.getByRole('link', { name: 'Blog', exact: true }).click();
        await page.waitForURL(origin + '/blog/');
        assert.equal(await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).isVisible(), false);
        assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
        await page.locator('.mobile-menu-btn').click();
        await page.getByRole('navigation', { name: 'Mobile navigation', exact: true })
            .getByRole('link', { name: 'Home', exact: true }).click();
        await page.waitForURL(origin + '/');
        assert.deepEqual(errors, [], 'navigation must not throw browser errors');
        console.log(`PASS ${engineName} ${width}px ${route}`);
    } finally {
        await context.close();
    }
}

async function desktopPointerEscape(browser) {
    const context = await localContext(browser, 1440);
    try {
        const page = await context.newPage();
        for (const route of ['/blog/', '/locations/', '/list-your-space/', '/sell-your-property/']) {
            await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
            await settle(page);
            const toggles = page.locator('.nav-managed > [aria-expanded]');
            assert.ok(await toggles.count() >= 2);
            await toggles.first().click();
            await toggles.nth(1).click();
            assert.equal(await toggles.first().getAttribute('aria-expanded'), 'false');
            assert.equal(await toggles.nth(1).getAttribute('aria-expanded'), 'true');
            // Safari pointer clicks need not focus the toggle: do not focus it here.
            await page.keyboard.press('Escape');
            assert.equal(await toggles.nth(1).getAttribute('aria-expanded'), 'false');
            assert.ok(await toggles.nth(1).evaluate(element => element === document.activeElement));
            console.log(`PASS webkit desktop pointer/Escape ${route}`);
        }
    } finally {
        await context.close();
    }
}

async function locationsInquiryLinks(browser, engineName) {
    const context = await localContext(browser, 1440);
    try {
        const page = await context.newPage();
        await page.goto(origin + '/locations/', { waitUntil: 'domcontentloaded' });
        const links = page.getByRole('link', { name: /Get Matched Now/ });
        assert.equal(await links.count(), 2, 'both former dead buttons must be native links');
        for (let index = 0; index < 2; index++) {
            if (index) await page.goto(origin + '/locations/', { waitUntil: 'domcontentloaded' });
            const link = page.getByRole('link', { name: /Get Matched Now/ }).nth(index);
            assert.equal(await link.getAttribute('href'), '/#form');
            await link.click();
            await page.waitForURL(origin + '/#form');
            await settle(page);
            const target = page.locator('#form');
            assert.ok(await target.isVisible(), 'inquiry anchor target must exist and be visible');
            assert.ok(await target.evaluate(element => {
                const box = element.getBoundingClientRect();
                return box.bottom > 0 && box.top < innerHeight;
            }), 'Get Matched must expose the actual inquiry section');
        }
        console.log(`PASS ${engineName} both locations inquiry links reach /#form`);
    } finally {
        await context.close();
    }
}

function checkBuiltScripts() {
    for (const route of mobileRoutes) {
        const file = path.join(publicRoot, route.slice(1), 'index.html');
        const html = fs.readFileSync(file, 'utf8');
        for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
            if (/application\/ld\+json/i.test(attributes)) JSON.parse(body);
            else if (!/\bsrc\s*=/.test(attributes) && body.trim()) new vm.Script(body, { filename: file });
        }
    }
    new vm.Script(fs.readFileSync(path.join(publicRoot, 'mobile-navigation.js'), 'utf8'));
}

(async () => {
    checkBuiltScripts();
    for (const engine of [chromium, webkit]) {
        const browser = await engine.launch(engine === chromium ? { channel: 'chrome' } : {});
        try {
            for (const route of mobileRoutes) {
                for (const width of [320, 390]) await mobileCase(browser, engine.name(), route, width);
            }
            await locationsInquiryLinks(browser, engine.name());
            if (engine === webkit) await desktopPointerEscape(browser);
        } finally {
            await browser.close();
        }
    }
    console.log('PASS public navigation: 16 mobile cases, 4 Safari desktop cases, 4 inquiry-link destinations; all traffic served locally and all writes/external requests blocked.');
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
