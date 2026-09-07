const fs = require('node:fs'), path = require('node:path');
const root = __dirname, output = path.join(root, 'public');
const excluded = new Set(['public', 'node_modules', 'netlify', 'pipeline', 'blog-content', 'tests', '.git']);
const omitted = new Set(['package.json','package-lock.json','netlify.toml','build-blog.js','prepare-public.js','new-post.js']);
const draftHtml = new Set(['ad-creatives/ad-mockup-feed.html', 'assets/share-kit/og-bold.html', 'assets/share-kit/og-editorial.html', 'assets/share-kit/og-square.html']);
const web = /\.(html|css|js|json|png|jpg|jpeg|webp|svg|ico|xml|txt|pdf|vcf|woff|woff2|mp4|webm)$/i;
function visit(source,destination){
 if(draftHtml.has(path.relative(root,source).split(path.sep).join('/')))return;
 if(fs.statSync(source).isDirectory()){
  fs.mkdirSync(destination,{recursive:true});
  for(const name of fs.readdirSync(source))if(!excluded.has(name)&&!name.startsWith('.')&&!name.startsWith('_')&&!omitted.has(name))visit(path.join(source,name),path.join(destination,name));
 } else if(web.test(source))fs.copyFileSync(source,destination);
}
fs.rmSync(output,{recursive:true,force:true});
visit(root,output);
for(const name of ['_headers','_redirects'])fs.copyFileSync(path.join(root,name),path.join(output,name));
console.log('Prepared public PBW assets without build/function/pipeline source.');
