import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
let html=await readFile(new URL('dist/index.html',root),'utf8');
const css=await readFile(new URL('dist/style.css',root),'utf8');
const parts=[];
for(const file of ['core.js','auth.js','progress.js','render.js','app.js']) {
  parts.push((await readFile(new URL('dist/'+file,root),'utf8'))
    .replace(/^import .*?;\r?\n/gm,'').replace(/^export /gm,''));
}
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+css+'</style>');
html=html.replace('<script type="module" src="app.js"></script>',()=>'<script>\n(()=>{\n"use strict";\n'+parts.join('\n')+'\n})();\n</script>');
if(html.includes('src="app.js"')||html.includes('href="style.css"')) throw Error('Unbundled assets');
await writeFile(new URL('index.html',root),html);
console.log('Built index.html — self-contained web and offline game.');
