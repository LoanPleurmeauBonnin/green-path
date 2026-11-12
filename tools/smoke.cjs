#!/usr/bin/env node
/**
 * Contrôle rapide du dépôt, sans dépendance (Node 18+) : scripts de index.html et editor.html présents et syntaxiquement valides,
 * éditeur chargeant les mêmes scripts que le jeu jusqu'à BootScene.js, JSON valides, liens relatifs des documents, manifest complet,
 * LICENSE présente, aucun secret courant. Usage : node tools/smoke.cjs
 */
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
let bad = 0, ok = 0;
function check(label, good, detail) { if (good) ok++; else { bad++; console.log('✖ ' + label + (detail ? ' — ' + detail : '')); } }
const scripts = html => [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]);

// 1. scripts des deux pages
const idx = scripts(read('index.html')), ed = scripts(read('editor.html'));
[['index.html', idx], ['editor.html', ed]].forEach(([page, list]) => list.forEach(s => {
  if (/^https?:/.test(s)) return check(page + ' : script distant interdit (' + s + ')', false);
  const f = path.join(root, s);
  if (!fs.existsSync(f)) return check(page + ' : ' + s + ' existe', false);
  if (s.indexOf('vendor/') >= 0) return check(page + ' : ' + s, true);
  try { new vm.Script(fs.readFileSync(f, 'utf8'), { filename: s }); check(s, true); } catch (e) { check(s + ' : syntaxe', false, e.message); }
}));
// la musique d'ambiance n'est volontairement pas chargée par l'éditeur
const upTo = list => list.slice(0, list.indexOf('js/scenes/BootScene.js') + 1).filter(s => s !== 'js/systems/Music.js');
check("editor.html charge les mêmes scripts que index.html jusqu'à BootScene.js", JSON.stringify(upTo(idx)) === JSON.stringify(upTo(ed)));

// 1 bis. parité éditeur / jeu : l'éditeur montre exactement les niveaux que le jeu joue (ordre des lieux + bonus)
try {
  const sb = { window: { location: { search: '', hostname: 'localhost' }, localStorage: null }, document: {}, navigator: {}, console };
  sb.window.window = sb.window; sb.self = sb.window;
  vm.createContext(sb);
  const ctxRun = f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sb, { filename: f });
  ['js/config.js', 'js/data/tuning.js'].forEach(f => { try { ctxRun(f); } catch (e) { /* le contexte minimal suffit au contrôle des ids */ } });
  const levelsVille = read('js/data/levels-ville.js'), locs = read('js/data/locations.js');
  const gameIds = [...locs.matchAll(/^\s+id: '([a-z-]+)', name:/gm)].map(m => m[1]);
  const defined = new Set([...levelsVille.matchAll(/GP\.LEVELS\['([a-z-]+)'\]\s*=/g)].map(m => m[1]).concat([...read('js/data/levels.js').matchAll(/GP\.LEVELS\['([a-z-]+)'\]\s*=/g)].map(m => m[1])));
  check('12 lieux jouables dans locations.js', gameIds.length === 12, gameIds.length + ' trouvés');
  gameIds.forEach(id => { const g = read('js/data/GZoneLevels.js'); check('niveau « ' + id + ' » défini pour le jeu (levels-ville.js ou GZoneLevels)', defined.has(id) || g.indexOf("'" + id + "'") >= 0); });
  check("l'éditeur montre « ligne-verte »", defined.has('ligne-verte') && read('js/editor/EditorHub.js').indexOf("'ligne-verte'") >= 0);
  check("l'éditeur lit GP.LOCATIONS et GP.LEVELS (niveaux joués), pas seulement GP.GZONES", /playedIds[\s\S]*GP\.LOCATIONS/.test(read('js/editor/EditorHub.js')) && /drawLevel/.test(read('js/editor/EditorHub.js')));
} catch (e) { check('parité éditeur / jeu', false, e.message); }

// 2. JSON
['manifest.json', 'manifest.webmanifest', 'data/fallback.json', 'docs/credits.json'].forEach(f => { try { JSON.parse(read(f)); check(f + ' : JSON valide', true); } catch (e) { check(f + ' : JSON valide', false, e.message); } });
const man = JSON.parse(read('manifest.json'));
['framework', 'edition', 'city', 'host', 'dates', 'project_title', 'authors', 'heritage_source', 'mode', 'stack', 'data_sources', 'ai_usage', 'version'].forEach(k => check('manifest.json : champ ' + k, man[k] !== undefined));

// 3. documents : liens relatifs
const docs = ['README.md', 'CREDITS.md', 'CARTEL.md', 'HERITAGE_GRAMMAR.md', 'CONTRIBUTING.md'].filter(f => fs.existsSync(path.join(root, f))).concat(fs.readdirSync(path.join(root, 'docs')).filter(f => f.endsWith('.md')).map(f => 'docs/' + f));
docs.forEach(f => {
  for (const m of read(f).matchAll(/\]\(([^)#\s]+)\)/g)) {
    const t = m[1]; if (/^(https?:|mailto:)/.test(t)) continue;
    check(f + ' : lien ' + t, fs.existsSync(path.resolve(root, path.dirname(f), t)));
  }
});
check('LICENSE présente', fs.existsSync(path.join(root, 'LICENSE')));

// 4. secrets dans les fichiers suivis par git
let files = [];
try { files = cp.execSync('git ls-files', { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean); } catch (e) { /* hors dépôt git : contrôle ignoré */ }
const SECRET = /(service_role|sb_secret_|-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16})/;
files.filter(f => /\.(js|cjs|json|html|md|sql|css|txt|webmanifest)$/.test(f) && f.indexOf('js/vendor/') < 0 && f !== 'tools/smoke.cjs').forEach(f => {
  const t = fs.readFileSync(path.join(root, f), 'utf8'), m = t.match(SECRET);
  // les documents et le schéma SQL peuvent nommer le rôle service_role pour dire qu'il est interdit dans le dépôt
  if (m) check(f + ' : pas de secret apparent', /^(CLAUDE\.md|CONTRIBUTING\.md|supabase\/|docs\/)/.test(f), 'motif « ' + m[1] + ' » trouvé');
});
check('aucun fichier .env suivi', !files.some(f => /(^|\/)\.env/.test(f)));

console.log(bad ? bad + ' échec(s), ' + ok + ' contrôle(s) réussi(s)' : 'Smoke : ' + ok + ' contrôle(s) réussi(s)');
process.exit(bad ? 1 : 0);
