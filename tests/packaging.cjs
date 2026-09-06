const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public');
test('safe staging preserves platform routes, headers, current media and vCard assets', () => {
 for (const name of ['_headers', '_redirects', 'media/hero-loop.mp4', 'media/hero-poster.jpg', 'assets/Zach_Vorsteg_Contact.vcf']) {
  assert.deepEqual(fs.readFileSync(path.join(output,name)),fs.readFileSync(path.join(root,name)),name);
 }
 for (const name of ['netlify','pipeline','blog-content','tests','package.json','netlify.toml','build-blog.js']) assert.equal(fs.existsSync(path.join(output,name)),false,name);
 assert.match(fs.readFileSync(path.join(output,'index.html'),'utf8'),/class="hero-ambient"/);
 assert.match(fs.readFileSync(path.join(output,'index.html'),'utf8'),/appointment/);
});
