import {readFileSync} from 'node:fs';
// Production HTML/CSS captured read-only from https://akofink.com on 2026-11-08 UTC.
// Remove all scripts, restore plain email, localize assets and baseline home link.
const source = readFileSync(new URL('./baseline-assets/original.html',import.meta.url),'utf8');
export const baseline = `<link rel="stylesheet" href="/baseline-assets/main.css"><aside class="baseline-notice">Production reference captured November 7, 2026 (Eastern). Original copy retained, including potentially dated employer information. Analytics removed; assets served locally.</aside>` + source.match(/<body>([\s\S]*?)<\/body>/)[1]
 .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'')
 .replace('src="assets/i_voted.jpg"','src="/portrait.jpg" alt="Andrew Kofink"')
 .replaceAll('/assets/minima-social-icons.svg','/baseline-assets/icons.svg')
 .replace(/href="\/cdn-cgi[^\"]*">[\s\S]*?<\/a>/,'href="mailto:ajkofink@gmail.com">ajkofink@gmail.com</a>')
 .replaceAll('href="/"','href="/baseline/"')
 .replaceAll('target="_blank"','target="_blank" rel="noopener noreferrer"');
