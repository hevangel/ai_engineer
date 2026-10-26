import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {formatText} from '../assets/ui-content.js';
import {renderSite} from './render-site.mjs';
const [ui,catalog,template]=await Promise.all([
 fs.readFile(new URL('../data/ui.json',import.meta.url),'utf8').then(JSON.parse),
 fs.readFile(new URL('../data/catalog.json',import.meta.url),'utf8').then(JSON.parse),
 fs.readFile(new URL('../templates/index.html',import.meta.url),'utf8')
]);
test('changing representative-photo JSON changes the runtime warning',()=>{
 const changed=structuredClone(ui);changed.info.representative='An explicitly qualified family photo';
 assert.equal(formatText(changed,'info.representative'),'An explicitly qualified family photo');
 assert.equal(formatText(ui,'trace.button',{count:12}),'Trace 12 components');
});
test('missing wording or interpolation values fail instead of silently omitting content',()=>{
 assert.throws(()=>formatText(ui,'info.absent'),/Missing interface text/);
 assert.throws(()=>formatText(ui,'trace.button'),/Missing text variable/);
 assert.throws(()=>formatText(ui,'__proto__.toString'),/Missing interface text/);
});
test('page wording and links are generated from JSON and escaped in text and attributes',()=>{
 const changed=structuredClone(ui);changed.page.title='Test <site> & "title"';changed.page.searchPlaceholder='" onfocus="test';
 const html=renderSite(template,changed,catalog);
 assert(html.includes('<title>Test &lt;site&gt; &amp; &quot;title&quot;</title>'));
 assert(html.includes('placeholder="&quot; onfocus=&quot;test"'));
 assert(!html.includes('<site>'));
 assert(html.includes('href="'+ui.links.source+'"'));
});
test('the historical rail and archive eyebrow follow catalog dates instead of fixed years',()=>{
 const changed=structuredClone(catalog);changed.entries=[{year:1962},{year:1989},{year:null}];
 const html=renderSite(template,ui,changed);
 assert(html.includes('min="1962" max="1989" value="1962"'));
 assert(html.includes('A LIVING ARCHIVE · 1962 ONWARD'));
 assert.throws(()=>renderSite(template,ui,{entries:[]}),/dated entry/);
});
test('unknown shell keys fail and the generated HTML includes no-JavaScript and load-error content',()=>{
 assert.throws(()=>renderSite(template+'{{page.missing}}',ui,catalog),/Missing shell value/);
 const html=renderSite(template,ui,catalog);
 assert(html.includes('<noscript>'));assert(html.includes(ui.page.noScript));
 assert(html.includes('data-load-error-prefix="'+ui.load.error+'"'));
 assert(html.includes('data-unavailable="'+ui.load.unavailable+'"'));
});

test('editorial copy changes cannot rename DOM controls, and line endings are portable',()=>{
 const changed=structuredClone(ui);changed.page.makersLabel='creators';
 const html=renderSite(template,changed,catalog);
 assert(html.includes('id="show-makers"'));assert(!html.includes('id="show-creators"'));
 assert.equal(renderSite(template.replaceAll('\r\n','\n').replaceAll('\n','\r\n'),ui,catalog),renderSite(template,ui,catalog));
});

test('photo queries and exclusions are data-driven and preserve exact model filters',async()=>{
 const config=JSON.parse(await fs.readFile(new URL('../data/image-import.json',import.meta.url),'utf8'));
 const adlib=config.selections.card_adlib.titlePattern,exclude=config.excludeTitles.card_adlib;
 assert(new RegExp(adlib.source,adlib.flags).test('File:AdLib Music Synthesizer.jpg'));
 assert(new RegExp(exclude.source,exclude.flags).test('AdLib Gold.jpg'));
 const apple=config.excludeTitles.system_apple_ii;assert(new RegExp(apple.source,apple.flags).test('Apple II+.jpg'));
 assert(config.representativeIds.includes('mac_floppy'));
 assert.equal(new URL(config.service.apiUrl).hostname,'commons.wikimedia.org');
});
