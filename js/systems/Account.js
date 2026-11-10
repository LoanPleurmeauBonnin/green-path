/**
 * Account (GP.Account) — fenêtre HTML par-dessus le jeu pour le pseudo et le code de sauvegarde.
 * Elle est en HTML (et pas dans le canevas) parce qu'il faut un vrai champ de saisie (clavier du téléphone) et
 * pouvoir COLLER et COPIER le code. Pas de mot de passe, pas d'e-mail.
 *
 *   GP.Account.open({ mode: 'choose' | 'create' | 'restore' | 'manage', onDone: function (res) {} })
 *   res.action : 'created' | 'restored' | 'guest' | 'closed' | 'deleted' | 'loggedout'
 * Échap ferme ; le jeu ne reçoit aucune touche tant que la fenêtre est ouverte (manette incluse).
 */
GP.Account = (function () {
  var root = null, opts = null, busy = false;

  function T(s) { return GP.t(s); }
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k]; else if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function btn(label, cb, primary) {
    var b = el('button', { type: 'button', class: 'acct-btn' + (primary ? ' primary' : ''), text: T(label) });
    b.addEventListener('click', function () { if (!busy) cb(); });
    return b;
  }

  function open(o) {
    opts = o || {};
    root = document.getElementById('acct');
    if (!root) return;
    root.hidden = false;
    GP.Pad.capture = true;
    root.onkeydown = root.onkeyup = root.onkeypress = function (ev) {
      ev.stopPropagation();   // le jeu ne doit pas voir les touches tapées dans les champs
      if (ev.type === 'keydown' && ev.key === 'Escape') { ev.preventDefault(); close('closed'); }
    };
    show(opts.mode || (GP.Cloud.isAccount ? 'manage' : 'choose'));
  }

  function close(action, extra) {
    if (!root) return;
    root.hidden = true; root.textContent = ''; root.onkeydown = root.onkeyup = root.onkeypress = null;
    GP.Pad.capture = false;
    var cb = opts && opts.onDone; opts = null;
    var canvas = document.querySelector('#game canvas'); if (canvas && canvas.focus) { try { canvas.focus(); } catch (e) { /* ignoré */ } }
    if (cb) cb(Object.assign({ action: action }, extra || {}));
  }

  /** Une ligne de message (erreur en orange, succès en vert). */
  function status() { return el('p', { class: 'acct-status', role: 'status' }); }
  function say(node, msg, good) { node.textContent = T(msg); node.className = 'acct-status ' + (good ? 'good' : 'bad'); }

  function show(mode) {
    root.textContent = '';
    var box = el('div', { class: 'acct-box' });
    root.appendChild(box);
    ({ choose: choose, create: create, restore: restore, manage: manage }[mode] || choose)(box);
    var first = box.querySelector('input, button'); if (first) first.focus();
  }

  function choose(box) {
    box.appendChild(el('h2', { text: T('SAUVEGARDE ET CLASSEMENT') }));
    box.appendChild(el('p', { text: T("Crée un pseudo (sans e-mail) pour sauvegarder ta progression et apparaître au classement. Ou joue en invité : tout reste sur cet appareil.") }));
    box.appendChild(btn('CRÉER MON PSEUDO', function () { show('create'); }, true));
    box.appendChild(btn("J'AI DÉJÀ UN CODE", function () { show('restore'); }));
    box.appendChild(btn('JOUER EN INVITÉ', function () { GP.Cloud.chooseGuest(); close('guest'); }));
  }

  function create(box) {
    var input = el('input', { type: 'text', maxlength: '16', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': T('PSEUDO') });
    input.addEventListener('input', function () { input.value = input.value.replace(/[^A-Za-z0-9_-]/g, ''); });
    var consent = el('input', { type: 'checkbox', id: 'acct-consent' }), st = status();
    box.appendChild(el('h2', { text: T('CRÉER MON PSEUDO') }));
    box.appendChild(el('label', { for: 'acct-pseudo', text: T('PSEUDO (3 À 16 : LETTRES, CHIFFRES, - _)') }));
    input.id = 'acct-pseudo'; box.appendChild(input);
    box.appendChild(el('p', { class: 'note', text: T('LE PSEUDO EST PUBLIC : PAS DE VRAI NOM.') }));
    box.appendChild(el('label', { class: 'check', for: 'acct-consent' }, [consent, el('span', { text: T("J'ACCEPTE QUE MON PSEUDO, MON AVATAR ET MA PROGRESSION SOIENT ENREGISTRÉS (SUPABASE, UNION EUROPÉENNE). DÉTAIL : CRÉDITS, CONFIDENTIALITÉ.") })]));
    box.appendChild(st);
    box.appendChild(btn('CRÉER', function () {
      var p = input.value.trim();
      if (!/^[A-Za-z0-9_-]{3,16}$/.test(p)) { say(st, 'PSEUDO INVALIDE : 3 À 16 CARACTÈRES'); return; }
      if (!consent.checked) { say(st, 'ACCEPTE LA CONFIDENTIALITÉ POUR CONTINUER'); return; }
      busy = true; say(st, '…', true);
      GP.Cloud.register(p).then(function (r) {
        busy = false;
        if (r.ok) { showCode(box, r.pseudo, r.code, 'created'); return; }
        say(st, { pseudo_taken: 'PSEUDO DÉJÀ PRIS', pseudo_invalid: 'PSEUDO INVALIDE', offline: 'PAS DE CONNEXION : RÉESSAIE PLUS TARD', no_crypto: 'NAVIGATEUR TROP ANCIEN POUR CRÉER UN CODE' }[r.error] || 'ERREUR : RÉESSAIE PLUS TARD');
      });
    }, true));
    box.appendChild(btn('RETOUR', function () { show('choose'); }));
  }

  /** Le code est montré une fois ; on le copie ou on le note. */
  function showCode(box, pseudo, code, action) {
    box.textContent = '';
    var st = status();
    box.appendChild(el('h2', { text: T('TON CODE DE SAUVEGARDE') }));
    box.appendChild(el('p', { class: 'acct-pseudo', text: pseudo }));
    box.appendChild(el('p', { class: 'acct-code', text: GP.Cloud.groupCode(code) }));
    box.appendChild(el('p', { class: 'note', text: T("NOTE-LE : C'EST LE SEUL MOYEN DE RETROUVER TA SAUVEGARDE SUR UN AUTRE APPAREIL. IL NE PEUT PAS ÊTRE RÉCUPÉRÉ.") }));
    box.appendChild(st);
    box.appendChild(btn('COPIER', function () {
      var t = GP.Cloud.groupCode(code), done = function (ok) { say(st, ok ? 'COPIÉ !' : 'COPIE IMPOSSIBLE : RECOPIE-LE À LA MAIN', ok); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, function () { done(false); });
      else done(false);
    }));
    box.appendChild(btn("J'AI NOTÉ MON CODE", function () { close(action || 'created', { pseudo: pseudo }); }, true));
  }

  function restore(box) {
    var pi = el('input', { type: 'text', maxlength: '16', id: 'acct-p', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
    var ci = el('input', { type: 'text', maxlength: '30', id: 'acct-c', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: 'XXXXX-XXXXX-XXXXX-XXXXX' }), st = status();
    pi.addEventListener('input', function () { pi.value = pi.value.replace(/[^A-Za-z0-9_-]/g, ''); });
    box.appendChild(el('h2', { text: T('RETROUVER MA SAUVEGARDE') }));
    box.appendChild(el('label', { for: 'acct-p', text: T('PSEUDO') })); box.appendChild(pi);
    box.appendChild(el('label', { for: 'acct-c', text: T('CODE DE SAUVEGARDE') })); box.appendChild(ci);
    box.appendChild(st);
    box.appendChild(btn('RETROUVER', function () {
      if (!pi.value || GP.Cloud.normCode(ci.value).length < 20) { say(st, 'PSEUDO OU CODE INCORRECT'); return; }
      busy = true; say(st, '…', true);
      GP.Cloud.restore(pi.value, ci.value).then(function (r) {
        busy = false;
        if (r.ok) { say(st, 'SAUVEGARDE RETROUVÉE !', true); setTimeout(function () { close('restored', { pseudo: r.pseudo }); }, 700); return; }
        say(st, r.error === 'not_found' ? 'PSEUDO OU CODE INCORRECT' : (r.error === 'offline' ? 'PAS DE CONNEXION : RÉESSAIE PLUS TARD' : 'ERREUR : RÉESSAIE PLUS TARD'));
      });
    }, true));
    box.appendChild(btn('RETOUR', function () { show(GP.Cloud.isAccount ? 'manage' : 'choose'); }));
  }

  function manage(box) {
    var st = status();
    box.appendChild(el('h2', { text: T('MON COMPTE') }));
    box.appendChild(el('p', { class: 'acct-pseudo', text: GP.Cloud.pseudo }));
    box.appendChild(btn('AFFICHER MON CODE', function () { showCode(box, GP.Cloud.pseudo, GP.Cloud.code, 'closed'); }));
    box.appendChild(btn('SYNCHRONISER', function () {
      busy = true; say(st, '…', true);
      GP.Cloud.push().then(function (r) { busy = false; say(st, r.ok ? 'SYNCHRONISÉ' : (r.error === 'not_found' ? 'COMPTE INTROUVABLE EN LIGNE' : 'PAS DE CONNEXION : RÉESSAIE PLUS TARD'), r.ok); });
    }));
    box.appendChild(btn("SE DÉCONNECTER D'ICI", function () { GP.Cloud.forget(); close('loggedout'); }));
    box.appendChild(btn('SUPPRIMER MON COMPTE', function () {
      box.textContent = '';
      var s2 = status();
      box.appendChild(el('h2', { text: T('SUPPRIMER MON COMPTE ?') }));
      box.appendChild(el('p', { text: T("CELA EFFACE EN LIGNE TON PSEUDO, TON AVATAR ET TA PROGRESSION. LA SAUVEGARDE DE CET APPAREIL RESTE.") }));
      box.appendChild(s2);
      box.appendChild(btn('OUI, SUPPRIMER', function () {
        busy = true; say(s2, '…', true);
        GP.Cloud.deleteAccount().then(function (r) { busy = false; if (r.ok) close('deleted'); else say(s2, 'PAS DE CONNEXION : RÉESSAIE PLUS TARD'); });
      }, true));
      box.appendChild(btn('ANNULER', function () { show('manage'); }));
    }));
    box.appendChild(st);
    box.appendChild(btn('FERMER', function () { close('closed'); }, true));
  }

  return { open: open, close: close };
})();
