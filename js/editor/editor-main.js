/**
 * Point d'entrée de l'éditeur (editor.html) : vérifie le compte (admin seulement), puis lance Phaser avec la scène « Editor ».
 * Le contrôle ici est un confort d'interface : le serveur revérifie le rôle admin à chaque publication (supabase/migrations).
 */
(function () {
  var gate = document.getElementById('ed-gate'), text = document.getElementById('ed-gate-text');
  function deny(html) { text.textContent = ''; html.forEach(function (n) { text.appendChild(typeof n === 'string' ? document.createTextNode(n) : n); }); }
  function link(href, label) { var a = document.createElement('a'); a.href = href; a.textContent = label; return a; }

  GP.Settings.load();
  GP.Content.init();   // niveaux et textures publiés : l'éditeur part de la version publiée
  GP.Cloud.init();

  if (!GP.Cloud.isAccount) {
    deny(['ÉDITEUR RÉSERVÉ À L’ADMIN', document.createElement('br'), document.createElement('br'), 'Connecte-toi dans le jeu (bouton compte en haut à gauche) avec ton compte admin, puis reviens ici. ', link('index.html', '← Retour au jeu')]);
    return;
  }
  GP.Cloud.checkAdmin().then(function (r) {
    if (r.ok && r.admin) start(true);
    else if (!r.ok && GP.Cloud.isAdmin) start(false);   // hors ligne : on garde le rôle annoncé à la dernière connexion (brouillons seulement)
    else deny(['Ce compte (' + GP.Cloud.pseudo + ') n’est pas admin.', document.createElement('br'), document.createElement('br'), link('index.html', '← Retour au jeu')]);
  });

  function start(online) {
    gate.hidden = true; document.getElementById('ed').hidden = false;
    GP.Ed.init(online);
    GP.BOOT_NEXT = 'Editor';
    var go = function () {
      GP.game = new Phaser.Game({
        type: Phaser.AUTO, parent: 'game', pixelArt: true, roundPixels: true, antialias: false, backgroundColor: '#8fc4ec',
        scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
        input: { mouse: { preventDefaultWheel: true } },
        scene: [GP.Scenes.Boot, GP.Scenes.Editor]
      });
    };
    go();
  }
})();
