/** Généré par tools/import-levels.cjs depuis les 12 pièces jointes. Ne pas éditer à la main. */
GP.GZONES = [
  {
    "format": "niveau/2",
    "id": "niveau_01_jardin",
    "num": 1,
    "nom": "Jardin des Plantes",
    "difficulte": "1/12",
    "tile": 16,
    "largeur": 140,
    "hauteur": 17,
    "sol_y": 15,
    "temps_ref_s": 60,
    "spawn": {
      "x": 11,
      "y": 14
    },
    "spec": {
      "pixels": 15,
      "checkpoints": 2,
      "obstacles_mortels": 6,
      "boss": null
    },
    "mecaniques": [
      "marche",
      "saut court/long",
      "accroupi ↓"
    ],
    "joueur": {
      "hauteur_tuiles": 2,
      "hauteur_accroupi_tuiles": 1,
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche (y fractionnaire possible). Plateformes (type) : masse = bloc plein enraciné jusqu'au bas du niveau (sprite de dessus + remplissage) ; pont = planches traversables par le bas, bord à bord avec le sol ; colonne = chapiteau posé sur un fût jusqu'au sol ; galerie = balustrade portée par des piliers jusqu'au sol ; pad = surface de collision posée sur le sommet d'un décor (dôme, topiaire…), l'objet visuel est dans decor. Tous les autres objets (decor, dangers, signes, checkpoints, arrivee) sont ancrés bas-gauche de la cellule (x,y) et reposent sur une surface. layer 'inlay' = vitrail/rosace incrusté dans une masse. Aucune zone de sprite ne se recouvre (vérifié).",
    "fond": {
      "ciel": {
        "defaut": "ciel_jour",
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ],
        "bas_y": 15
      },
      "couches": [
        {
          "sprite": "carte_batiments_lointains",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        },
        {
          "sprite": "carte_collines_proches",
          "y_bas": "sol",
          "parallax": 0.5,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "id": "p1",
        "type": "masse",
        "x": 0,
        "y": 15,
        "w": 14,
        "top_sprite": "jardin_pave_haut_1",
        "fill_sprite": "jardin_pave_plein"
      },
      {
        "id": "p2",
        "type": "masse",
        "x": 14,
        "y": 15,
        "w": 24,
        "style": "herbe"
      },
      {
        "id": "p3",
        "type": "masse",
        "x": 40,
        "y": 15,
        "w": 22,
        "style": "herbe"
      },
      {
        "id": "p4",
        "type": "masse",
        "x": 80,
        "y": 15,
        "w": 60,
        "style": "herbe"
      },
      {
        "id": "p5",
        "type": "pont",
        "x": 62,
        "y": 15,
        "w": 5,
        "sprite_set": [
          "commun_pont_planches_g",
          "commun_pont_planches_m",
          "commun_pont_planches_d"
        ]
      },
      {
        "id": "p6",
        "type": "pont",
        "x": 70,
        "y": 15,
        "w": 4,
        "sprite_set": [
          "commun_pont_planches_g",
          "commun_pont_planches_m",
          "commun_pont_planches_d"
        ]
      },
      {
        "id": "p7",
        "type": "pont",
        "x": 77,
        "y": 15,
        "w": 3,
        "sprite_set": [
          "commun_pont_planches_g",
          "commun_pont_planches_m",
          "commun_pont_planches_d"
        ]
      },
      {
        "id": "p8",
        "type": "masse",
        "x": 67,
        "y": 16,
        "w": 2,
        "top_sprite": "jardin_pave_haut_1",
        "fill_sprite": "jardin_pave_plein",
        "note": "pilier du jet d'eau"
      },
      {
        "id": "p9",
        "type": "masse",
        "x": 74,
        "y": 16,
        "w": 2,
        "top_sprite": "jardin_pave_haut_1",
        "fill_sprite": "jardin_pave_plein",
        "note": "pilier du jet d'eau"
      },
      {
        "id": "serre1_g",
        "type": "pad",
        "x": 94.75,
        "y": 10.625,
        "w": 0.75,
        "solid": "top",
        "sur": "serre1"
      },
      {
        "id": "serre1_c",
        "type": "pad",
        "x": 96.75,
        "y": 9,
        "w": 1.5,
        "solid": "top",
        "sur": "serre1"
      },
      {
        "id": "serre1_d",
        "type": "pad",
        "x": 99.5,
        "y": 10.625,
        "w": 1,
        "solid": "top",
        "sur": "serre1"
      },
      {
        "id": "topiaire_tete",
        "type": "pad",
        "x": 90.5,
        "y": 12.3125,
        "w": 1.25,
        "solid": "top",
        "sur": "topiaire_tete"
      },
      {
        "id": "banc",
        "type": "pad",
        "x": 19,
        "y": 14.125,
        "w": 1.4,
        "solid": "top",
        "sur": "banc"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 32,
        "y": 14,
        "w": 2,
        "grab": false,
        "id": "p15"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 34,
        "y": 13,
        "w": 3,
        "grab": false,
        "id": "p16"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 37,
        "y": 14,
        "w": 1,
        "grab": false,
        "id": "p17"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 45,
        "y": 14,
        "w": 2,
        "grab": false,
        "id": "p18"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 47,
        "y": 12,
        "w": 3,
        "grab": false,
        "id": "p19"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 50,
        "y": 14,
        "w": 1,
        "grab": false,
        "id": "p20"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 118,
        "y": 14,
        "w": 2,
        "grab": false,
        "id": "p21"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 120,
        "y": 12,
        "w": 3,
        "grab": false,
        "id": "p22"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 123,
        "y": 14,
        "w": 2,
        "grab": false,
        "id": "p23"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 125,
        "y": 13,
        "w": 2,
        "grab": false,
        "id": "p24"
      },
      {
        "type": "masse",
        "style": "herbe",
        "x": 127,
        "y": 11,
        "w": 2,
        "grab": false,
        "id": "p25"
      },
      {
        "type": "pad",
        "id": "topiaire_oiseau",
        "x": 107.75,
        "y": 12.5625,
        "w": 1.25,
        "solid": "top",
        "sur": "topiaire_oiseau"
      }
    ],
    "dangers": [
      {
        "sprite": "commun_ronces_1",
        "x": 31,
        "y": 14,
        "kind": "mortel"
      },
      {
        "sprite": "commun_ronces_2",
        "x": 44,
        "y": 14,
        "kind": "mortel"
      },
      {
        "sprite": "commun_ronces_1",
        "x": 93,
        "y": 14,
        "kind": "mortel"
      },
      {
        "sprite": "commun_ronces_1",
        "x": 101,
        "y": 14,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_1",
        "x": 102,
        "y": 14,
        "kind": "mortel"
      },
      {
        "sprite": "commun_ronces_2",
        "x": 111,
        "y": 14,
        "kind": "mortel"
      },
      {
        "sprite": "jardin_bassin_surface",
        "x": 38,
        "y": 16,
        "w": 2,
        "kind": "eau_mortelle",
        "note": "chute = retour checkpoint"
      },
      {
        "sprite": "jardin_bassin_surface",
        "x": 62,
        "y": 16,
        "w": 5,
        "kind": "eau_mortelle",
        "note": "chute = retour checkpoint"
      },
      {
        "sprite": "jardin_bassin_surface",
        "x": 69,
        "y": 16,
        "w": 1,
        "kind": "eau_mortelle",
        "note": "chute = retour checkpoint"
      },
      {
        "sprite": "jardin_bassin_surface",
        "x": 70,
        "y": 16,
        "w": 4,
        "kind": "eau_mortelle",
        "note": "chute = retour checkpoint"
      },
      {
        "sprite": "jardin_bassin_surface",
        "x": 76,
        "y": 16,
        "w": 1,
        "kind": "eau_mortelle",
        "note": "chute = retour checkpoint"
      },
      {
        "sprite": "jardin_bassin_surface",
        "x": 77,
        "y": 16,
        "w": 3,
        "kind": "eau_mortelle",
        "note": "chute = retour checkpoint"
      },
      {
        "sprite": "jardin_jet_eau",
        "x": 67.25,
        "y": 15,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "actif_s": 1,
          "decalage_s": 0,
          "hauteur_tuiles": 4,
          "top_y": 12,
          "frame_actif": 1
        }
      },
      {
        "sprite": "jardin_jet_eau",
        "x": 74.25,
        "y": 15,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "actif_s": 1,
          "decalage_s": 1.5,
          "hauteur_tuiles": 4,
          "top_y": 12,
          "frame_actif": 1
        }
      }
    ],
    "ennemis": [
      {
        "id": "oiseau_z3",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 82,
        "x2": 86,
        "y": 13,
        "vitesse": 3,
        "touche": "debout",
        "esquive": "accroupi"
      },
      {
        "id": "oiseau_z4",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 95,
        "x2": 100,
        "y": 7.5,
        "vitesse": 3.5,
        "touche": "debout",
        "esquive": "accroupi"
      },
      {
        "id": "papillon_z5",
        "sprite": "ciel_papillon",
        "type": "ambiance",
        "x": 123.5,
        "y": 9,
        "inoffensif": true
      }
    ],
    "pixels": [
      {
        "id": 1,
        "sprite": "commun_pixel",
        "x": 11,
        "y": 14,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 2,
        "sprite": "commun_pixel",
        "x": 19,
        "y": 12,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 3,
        "sprite": "commun_pixel",
        "x": 24,
        "y": 12,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 4,
        "sprite": "commun_pixel",
        "x": 35,
        "y": 11,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 5,
        "sprite": "commun_pixel",
        "x": 39,
        "y": 13,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 6,
        "sprite": "commun_pixel",
        "x": 48,
        "y": 10,
        "difficulte": "risque",
        "detail_image": 2
      },
      {
        "id": 7,
        "sprite": "commun_pixel",
        "x": 64,
        "y": 13,
        "difficulte": "facile",
        "detail_image": 2
      },
      {
        "id": 8,
        "sprite": "commun_pixel",
        "x": 67,
        "y": 10,
        "difficulte": "risque",
        "detail_image": 2
      },
      {
        "id": 9,
        "sprite": "commun_pixel",
        "x": 84,
        "y": 14,
        "difficulte": "cache",
        "detail_image": 2
      },
      {
        "id": 10,
        "sprite": "commun_pixel",
        "x": 90,
        "y": 10,
        "difficulte": "facile",
        "detail_image": 2
      },
      {
        "id": 11,
        "sprite": "commun_pixel",
        "x": 98,
        "y": 7,
        "difficulte": "risque",
        "detail_image": 3
      },
      {
        "id": 12,
        "sprite": "commun_pixel",
        "x": 98,
        "y": 14,
        "difficulte": "cache",
        "detail_image": 3
      },
      {
        "id": 13,
        "sprite": "commun_pixel",
        "x": 108,
        "y": 8,
        "difficulte": "facile",
        "detail_image": 3
      },
      {
        "id": 14,
        "sprite": "commun_pixel",
        "x": 121,
        "y": 10,
        "difficulte": "facile",
        "detail_image": 3
      },
      {
        "id": 15,
        "sprite": "commun_pixel",
        "x": 127,
        "y": 9,
        "difficulte": "facile",
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "id": 1,
        "x": 54,
        "y": 14,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "id": 2,
        "x": 114,
        "y": 14,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_saut",
        "x": 12,
        "y": 14,
        "texte": "Saute par-dessus les buissons et ramasse les pixels envolés !"
      },
      {
        "sprite": "signes_panneau_fleches",
        "x": 80,
        "y": 14,
        "texte": "Maintiens ↓ pour t'accroupir."
      }
    ],
    "decor": [
      {
        "sprite": "jardin_gare_batiment",
        "x": 0,
        "y": 14,
        "layer": "sol"
      },
      {
        "sprite": "jardin_arbre_feuillu_clair",
        "x": 51,
        "y": 14
      },
      {
        "sprite": "jardin_pin_parasol",
        "x": 26,
        "y": 14
      },
      {
        "sprite": "jardin_lampadaire_parc",
        "x": 22,
        "y": 14
      },
      {
        "sprite": "jardin_massif_fleurs_a",
        "x": 24,
        "y": 14
      },
      {
        "sprite": "jardin_massif_fleurs_b",
        "x": 41,
        "y": 14
      },
      {
        "sprite": "jardin_massif_fleurs_c",
        "x": 59,
        "y": 14
      },
      {
        "sprite": "jardin_lampadaire_parc",
        "x": 58,
        "y": 14
      },
      {
        "sprite": "jardin_lampadaire_parc",
        "x": 87,
        "y": 14
      },
      {
        "sprite": "jardin_topiaire_tete_endormie",
        "x": 89,
        "y": 14,
        "id": "topiaire_tete"
      },
      {
        "sprite": "jardin_palmarium_serre",
        "x": 94,
        "y": 14,
        "id": "serre1"
      },
      {
        "sprite": "jardin_banc_parc",
        "x": 19,
        "y": 14,
        "id": "banc"
      },
      {
        "sprite": "commun_buisson_a",
        "x": 15,
        "y": 14,
        "solide": true,
        "note": "bloquant non mortel, saut de 1 tuile"
      },
      {
        "sprite": "jardin_arbre_marronnier",
        "x": 129,
        "y": 14
      },
      {
        "sprite": "commun_fleur_rouge",
        "x": 17,
        "y": 14
      },
      {
        "sprite": "commun_fleur_jaune",
        "x": 21,
        "y": 14
      },
      {
        "sprite": "commun_fleur_rouge",
        "x": 55,
        "y": 14
      },
      {
        "sprite": "commun_touffe_herbe",
        "x": 30,
        "y": 14
      },
      {
        "sprite": "commun_touffe_herbe",
        "x": 84,
        "y": 14
      },
      {
        "sprite": "jardin_topiaire_oiseau",
        "x": 107,
        "y": 14,
        "id": "topiaire_oiseau"
      },
      {
        "sprite": "commun_fleur_jaune",
        "x": 104,
        "y": 14
      },
      {
        "sprite": "commun_touffe_herbe",
        "x": 105,
        "y": 14
      },
      {
        "sprite": "commun_fleur_rouge",
        "x": 112,
        "y": 14
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "jardin_monument_jardin",
        "x": 133,
        "y": 14
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 136,
        "y": 14
      },
      "declencheur": {
        "x": 137,
        "y": 14
      }
    },
    "zones": [
      {
        "n": 1,
        "nom": "Sortie de Gare & Entrée du Parc",
        "x": [
          0,
          28
        ]
      },
      {
        "n": 2,
        "nom": "Les Allées Fleuries",
        "x": [
          28,
          56
        ]
      },
      {
        "n": 3,
        "nom": "Les Bassins à Jets d'Eau",
        "x": [
          56,
          86
        ]
      },
      {
        "n": 4,
        "nom": "Le Palmarium et les Topiaires",
        "x": [
          86,
          116
        ]
      },
      {
        "n": 5,
        "nom": "Le Grand Marronnier & Arche Finale",
        "x": [
          116,
          140
        ]
      }
    ],
    "pedagogie": [
      {
        "x": [
          80,
          87
        ],
        "texte": "Oiseau à hauteur de tête sur sol plat : apprendre ↓ (panneau x=80)."
      },
      {
        "x": [
          95,
          100
        ],
        "texte": "Test : oiseau au-dessus du dôme central du Palmarium."
      }
    ],
    "meteo": {
      "pluie": {
        "friction_sol": 0.85,
        "jet_eau_hauteur_bonus": 0.5,
        "visuel": "ciel_goutte_pluie",
        "ciel": "ciel_gris"
      },
      "soleil": {
        "vitesse_marche": 1.05,
        "oiseaux_vitesse": 1.1,
        "papillons_dores_pixels_caches": true,
        "visuel": "ciel_soleil"
      },
      "neige": {
        "friction": {
          "pont": 0.75,
          "dome": 0.75
        },
        "jets_eau": "gelés (plateformes solides 2 tuiles)",
        "visuel": "ciel_flocon",
        "ciel": "ciel_nuageux"
      },
      "brume": {
        "visibilite_tuiles": 10,
        "opacite_hors_zone": 0.5,
        "oiseaux_vitesse": 0.8,
        "visuel": "ciel_brume_bande_tile_x"
      },
      "vent": {
        "poussee_tuiles_s": 0.4,
        "direction": "droite",
        "rafale_s": 3,
        "periode_s": 6
      },
      "orage": {
        "eclair_periode_s": 8,
        "flash_s": 0.5,
        "oiseaux_envol_tuiles": 1,
        "oiseaux_envol_s": 2,
        "jets_actif_s": 1.2,
        "ciel": "ciel_orage"
      }
    },
    "image_a_reconstituer": [
      {
        "pixels": [
          1,
          5
        ],
        "detail": "Topiaire Oiseau (Dodo) vert géant"
      },
      {
        "pixels": [
          6,
          10
        ],
        "detail": "Coupole vitrée blanche du Palmarium"
      },
      {
        "pixels": [
          11,
          15
        ],
        "detail": "Allées fleuries, bassins, magnolias et marronniers"
      }
    ],
    "notes": [
      "Fond : immeubles lointains + collines (comme le sélecteur de niveau).",
      "Jets d'eau posés sur des piliers de pierre dans le bassin ; mortels quand actifs, praticables quand éteints.",
      "Un seul Palmarium (zone 4), flanqué de deux topiaires ; le monument final est une maquette du Palmarium.",
      "Collines en escalier avec contours (bords gauche/droit, coins herbés) en zones 2 et 5.",
      "Chaque pixel est atteignable : saut vertical 3 tuiles + corps 2 tuiles (vérifié par script)."
    ],
    "sourceFile": "niveau_01_jardin.json",
    "sourceHash": "41314febd46480b8a40d3fe2ae2634b1178159315af73f7a7989d748ad5b5e32"
  },
  {
    "format": "niveau/2",
    "id": "niveau_02_cathedrale",
    "num": 2,
    "nom": "Cathédrale Saint-Pierre-et-Saint-Paul",
    "difficulte": "2/12",
    "tile": 16,
    "largeur": 158,
    "hauteur": 24,
    "sol_y": 22,
    "temps_ref_s": 75,
    "spawn": {
      "x": 7,
      "y": 21
    },
    "spec": {
      "pixels": 18,
      "checkpoints": 2,
      "obstacles_mortels": 13,
      "boss": null
    },
    "mecaniques": [
      "accroche aux rebords ↑",
      "verticalité"
    ],
    "joueur": {
      "hauteur_tuiles": 2,
      "hauteur_accroupi_tuiles": 1,
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche (y fractionnaire possible). Plateformes (type) : masse = bloc plein enraciné jusqu'au bas du niveau (sprite de dessus + remplissage) ; pont = planches traversables par le bas, bord à bord avec le sol ; colonne = chapiteau posé sur un fût jusqu'au sol ; galerie = balustrade portée par des piliers jusqu'au sol ; pad = surface de collision posée sur le sommet d'un décor (dôme, topiaire…), l'objet visuel est dans decor. Tous les autres objets (decor, dangers, signes, checkpoints, arrivee) sont ancrés bas-gauche de la cellule (x,y) et reposent sur une surface. layer 'inlay' = vitrail/rosace incrusté dans une masse. Aucune zone de sprite ne se recouvre (vérifié).",
    "fond": {
      "ciel": {
        "defaut": "ciel_jour",
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ],
        "bas_y": 22
      },
      "couches": [
        {
          "sprite": "carte_batiments_lointains",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        },
        {
          "sprite": "carte_collines_proches",
          "y_bas": "sol",
          "parallax": 0.5,
          "tile_x": true
        },
        {
          "sprite": "cathedrale_nef_fond_tile_x",
          "y_bas": "sol",
          "x_range": [
            17,
            95
          ],
          "tile_x": true,
          "empile": true,
          "parallax": 1
        }
      ]
    },
    "plateformes": [
      {
        "id": "p1",
        "type": "masse",
        "x": 0,
        "y": 22,
        "w": 158,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true,
        "note": "sol"
      },
      {
        "id": "p2",
        "type": "masse",
        "x": 10,
        "y": 0,
        "w": 2,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true,
        "note": "façade : pilier gauche"
      },
      {
        "id": "p3",
        "type": "masse",
        "x": 12,
        "y": 0,
        "w": 3,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true,
        "fill_to": 18,
        "note": "linteau du portail"
      },
      {
        "id": "p4",
        "type": "masse",
        "x": 15,
        "y": 0,
        "w": 2,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true,
        "note": "façade : pilier droit"
      },
      {
        "id": "p5",
        "type": "masse",
        "x": 17,
        "y": 0,
        "w": 78,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": false,
        "fill_to": 3,
        "bas_sprite": "cathedrale_pierre_bas",
        "note": "voûte de la nef"
      },
      {
        "id": "p6",
        "type": "masse",
        "x": 20,
        "y": 18.5,
        "w": 3,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true,
        "note": "marche de 3,5 tuiles : accroche ↑"
      },
      {
        "id": "p7",
        "type": "colonne",
        "x": 30,
        "y_top": 17,
        "sol_y": 22,
        "sprite_chapiteau": "cathedrale_colonne_chapiteau",
        "sprite_fut": "cathedrale_colonne_fut",
        "sprite_base": "cathedrale_colonne_base",
        "grab": true
      },
      {
        "id": "p8",
        "type": "colonne",
        "x": 42,
        "y_top": 14,
        "sol_y": 22,
        "sprite_chapiteau": "cathedrale_colonne_chapiteau",
        "sprite_fut": "cathedrale_colonne_fut",
        "sprite_base": "cathedrale_colonne_base",
        "grab": true
      },
      {
        "id": "p9",
        "type": "masse",
        "x": 50,
        "y": 21,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true,
        "note": "escalier vers la galerie"
      },
      {
        "id": "p10",
        "type": "masse",
        "x": 51,
        "y": 20,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p11",
        "type": "masse",
        "x": 52,
        "y": 19,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p12",
        "type": "masse",
        "x": 53,
        "y": 18,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p13",
        "type": "masse",
        "x": 54,
        "y": 17,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p14",
        "type": "masse",
        "x": 55,
        "y": 16,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p15",
        "type": "masse",
        "x": 56,
        "y": 15,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p16",
        "type": "masse",
        "x": 57,
        "y": 14,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p17",
        "type": "galerie",
        "x": 58,
        "y": 14,
        "w": 9,
        "sprite": "cathedrale_galerie_balustrade",
        "piliers": [
          58,
          62,
          66
        ],
        "sprite_fut": "cathedrale_colonne_fut",
        "sol_y": 22,
        "grab": true
      },
      {
        "id": "p18",
        "type": "galerie",
        "x": 70,
        "y": 12,
        "w": 8,
        "sprite": "cathedrale_galerie_balustrade",
        "piliers": [
          70,
          74,
          77
        ],
        "sprite_fut": "cathedrale_colonne_fut",
        "sol_y": 22,
        "grab": true
      },
      {
        "id": "p19",
        "type": "galerie",
        "x": 81,
        "y": 10,
        "w": 6,
        "sprite": "cathedrale_galerie_balustrade",
        "piliers": [
          81,
          86
        ],
        "sprite_fut": "cathedrale_colonne_fut",
        "sol_y": 22,
        "grab": true
      },
      {
        "id": "p20",
        "type": "masse",
        "x": 87,
        "y": 9,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p21",
        "type": "masse",
        "x": 88,
        "y": 8,
        "w": 12,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true,
        "note": "palier devant la porte des toits"
      },
      {
        "id": "p22",
        "type": "masse",
        "x": 95,
        "y": 0,
        "w": 5,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": false,
        "fill_to": 4,
        "note": "linteau de la porte"
      },
      {
        "id": "p23",
        "type": "masse",
        "x": 95,
        "y": 4,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": false,
        "fill_to": 8
      },
      {
        "id": "p24",
        "type": "masse",
        "x": 99,
        "y": 4,
        "w": 1,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": false,
        "fill_to": 8
      },
      {
        "id": "p25",
        "type": "masse",
        "x": 103,
        "y": 6,
        "w": 3,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p26",
        "type": "masse",
        "x": 109,
        "y": 7,
        "w": 5,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p27",
        "type": "masse",
        "x": 117,
        "y": 5,
        "w": 3,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p28",
        "type": "masse",
        "x": 123,
        "y": 4,
        "w": 6,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true
      },
      {
        "id": "p29",
        "type": "masse",
        "x": 129,
        "y": 6,
        "w": 29,
        "top_sprite": "cathedrale_pierre_haut",
        "fill_sprite": "cathedrale_pierre_blanche_pleine_2",
        "grab": true,
        "note": "terrasse de la tour"
      }
    ],
    "dangers": [
      {
        "sprite": "cathedrale_cierge_flamme",
        "x": 28,
        "y": 21,
        "kind": "mortel"
      },
      {
        "sprite": "cathedrale_pointes_pierre_1",
        "x": 34,
        "y": 21,
        "kind": "mortel",
        "w": 3
      },
      {
        "sprite": "cathedrale_cierge_flamme",
        "x": 40,
        "y": 21,
        "kind": "mortel"
      },
      {
        "sprite": "cathedrale_pointes_pierre_2",
        "x": 46,
        "y": 21,
        "kind": "mortel",
        "w": 2
      },
      {
        "sprite": "cathedrale_pointes_pierre_1",
        "x": 67,
        "y": 21,
        "kind": "mortel",
        "w": 3
      },
      {
        "sprite": "cathedrale_pointes_pierre_2",
        "x": 78,
        "y": 21,
        "kind": "mortel",
        "w": 3
      },
      {
        "sprite": "cathedrale_cierge_flamme",
        "x": 84,
        "y": 9,
        "kind": "mortel"
      },
      {
        "sprite": "cathedrale_pointes_pierre_1",
        "x": 100,
        "y": 21,
        "kind": "mortel",
        "w": 3
      },
      {
        "sprite": "cathedrale_gargouille",
        "x": 105,
        "y": 5,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 2.5,
          "projectile": "ciel_goutte_pluie",
          "portee_tuiles": 3,
          "direction": "gauche"
        }
      },
      {
        "sprite": "cathedrale_pointes_pierre_2",
        "x": 106,
        "y": 21,
        "kind": "mortel",
        "w": 3
      },
      {
        "sprite": "cathedrale_pointes_pierre_1",
        "x": 114,
        "y": 21,
        "kind": "mortel",
        "w": 3
      },
      {
        "sprite": "cathedrale_gargouille",
        "x": 119,
        "y": 4,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 2.5,
          "projectile": "ciel_goutte_pluie",
          "portee_tuiles": 3,
          "direction": "gauche"
        }
      },
      {
        "sprite": "cathedrale_pointes_pierre_2",
        "x": 120,
        "y": 21,
        "kind": "mortel",
        "w": 3
      }
    ],
    "ennemis": [
      {
        "id": "pigeon_z3",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 68,
        "x2": 78,
        "y": 10,
        "vitesse": 3,
        "touche": "debout"
      },
      {
        "id": "pigeon_z4",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 108,
        "x2": 114,
        "y": 5,
        "vitesse": 3.5,
        "touche": "debout"
      }
    ],
    "pixels": [
      {
        "id": 1,
        "sprite": "commun_pixel",
        "x": 7,
        "y": 20,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 2,
        "sprite": "commun_pixel",
        "x": 9,
        "y": 19,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 3,
        "sprite": "commun_pixel",
        "x": 21,
        "y": 17,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 4,
        "sprite": "commun_pixel",
        "x": 30,
        "y": 15,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 5,
        "sprite": "commun_pixel",
        "x": 42,
        "y": 12,
        "difficulte": "facile",
        "detail_image": 1
      },
      {
        "id": 6,
        "sprite": "commun_pixel",
        "x": 46,
        "y": 19,
        "difficulte": "risque",
        "detail_image": 1
      },
      {
        "id": 7,
        "sprite": "commun_pixel",
        "x": 52,
        "y": 17,
        "difficulte": "facile",
        "detail_image": 2
      },
      {
        "id": 8,
        "sprite": "commun_pixel",
        "x": 60,
        "y": 12,
        "difficulte": "facile",
        "detail_image": 2
      },
      {
        "id": 9,
        "sprite": "commun_pixel",
        "x": 64,
        "y": 20,
        "difficulte": "cache",
        "detail_image": 2
      },
      {
        "id": 10,
        "sprite": "commun_pixel",
        "x": 73,
        "y": 10,
        "difficulte": "risque",
        "detail_image": 2
      },
      {
        "id": 11,
        "sprite": "commun_pixel",
        "x": 82,
        "y": 8,
        "difficulte": "facile",
        "detail_image": 2
      },
      {
        "id": 12,
        "sprite": "commun_pixel",
        "x": 104,
        "y": 4,
        "difficulte": "facile",
        "detail_image": 2
      },
      {
        "id": 13,
        "sprite": "commun_pixel",
        "x": 111,
        "y": 5,
        "difficulte": "risque",
        "detail_image": 3
      },
      {
        "id": 14,
        "sprite": "commun_pixel",
        "x": 118,
        "y": 3,
        "difficulte": "facile",
        "detail_image": 3
      },
      {
        "id": 15,
        "sprite": "commun_pixel",
        "x": 125,
        "y": 2,
        "difficulte": "risque",
        "detail_image": 3
      },
      {
        "id": 16,
        "sprite": "commun_pixel",
        "x": 136,
        "y": 4,
        "difficulte": "facile",
        "detail_image": 3
      },
      {
        "id": 17,
        "sprite": "commun_pixel",
        "x": 138,
        "y": 3,
        "difficulte": "facile",
        "detail_image": 3
      },
      {
        "id": 18,
        "sprite": "commun_pixel",
        "x": 140,
        "y": 4,
        "difficulte": "facile",
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "id": 1,
        "x": 59,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "id": 2,
        "x": 127,
        "y": 3,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_fleches",
        "x": 8,
        "y": 21,
        "texte": "Entre dans la cathédrale par le portail."
      },
      {
        "sprite": "signes_panneau_fleches",
        "x": 18,
        "y": 21,
        "texte": "Maintiens ↑ près d'un rebord en l'air pour t'y accrocher et grimper !"
      }
    ],
    "decor": [
      {
        "sprite": "cathedrale_tour_facade",
        "x": 0,
        "y": 21,
        "layer": "sol"
      },
      {
        "sprite": "cathedrale_arc_brise_porte",
        "x": 12,
        "y": 21,
        "id": "portail"
      },
      {
        "sprite": "cathedrale_arc_brise_porte",
        "x": 96,
        "y": 7,
        "id": "porte_toits"
      },
      {
        "sprite": "cathedrale_vitrail_haut_1",
        "x": 19,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_2",
        "x": 26,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_1",
        "x": 33,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_2",
        "x": 40,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_1",
        "x": 47,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_2",
        "x": 54,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_1",
        "x": 61,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_2",
        "x": 68,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_1",
        "x": 75,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_2",
        "x": 82,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_vitrail_haut_1",
        "x": 89,
        "y": 2,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_rosace",
        "x": 137,
        "y": 12,
        "layer": "inlay"
      },
      {
        "sprite": "cathedrale_clocheton",
        "x": 131,
        "y": 5
      },
      {
        "sprite": "cathedrale_clocheton",
        "x": 143,
        "y": 5
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "cathedrale_monument_cathedrale",
        "x": 147,
        "y": 5
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 151,
        "y": 5
      },
      "declencheur": {
        "x": 152,
        "y": 5
      }
    },
    "zones": [
      {
        "n": 1,
        "nom": "Le Parvis",
        "x": [
          0,
          17
        ]
      },
      {
        "n": 2,
        "nom": "La Nef : colonnes et cierges",
        "x": [
          17,
          58
        ]
      },
      {
        "n": 3,
        "nom": "La Galerie des Vitraux",
        "x": [
          58,
          100
        ]
      },
      {
        "n": 4,
        "nom": "Les Toits et Gargouilles",
        "x": [
          100,
          129
        ]
      },
      {
        "n": 5,
        "nom": "La Terrasse de la Rosace",
        "x": [
          129,
          158
        ]
      }
    ],
    "pedagogie": [
      {
        "x": [
          17,
          24
        ],
        "texte": "Portail puis marche de 3,5 tuiles sans danger : apprendre l'accroche ↑."
      },
      {
        "x": [
          28,
          50
        ],
        "texte": "Nef au sol : cierges et pointes à sauter, escalier visible au fond."
      },
      {
        "x": [
          58,
          88
        ],
        "texte": "Galerie en hauteur : trois paliers de plus en plus hauts, porte des toits au bout."
      }
    ],
    "meteo": {
      "pluie": {
        "gargouille_periode_s": 2,
        "cierge_x88": "éteint",
        "fenetre_accroche_s": 2,
        "visuel": "ciel_goutte_pluie",
        "ciel": "ciel_gris"
      },
      "soleil": {
        "rayons_vitrail_porteurs": {
          "zones": [
            2,
            3
          ],
          "rebond_tuiles": 0.5
        },
        "cierge_flamme_hauteur": 1.2,
        "ciel": "ciel_jour"
      },
      "neige": {
        "friction_zone4": 0.8,
        "accroche_duree_s": 0.5,
        "gargouille_portee_tuiles": 1.5,
        "visuel": "signes_etoile_poussiere",
        "ciel": "ciel_nuageux"
      },
      "brume": {
        "brume_nef": {
          "y": [
            20,
            22
          ]
        },
        "visibilite_zone4_tuiles": 9,
        "oiseaux_pause_bout_s": 2,
        "visuel": "ciel_brume_bande_tile_x"
      },
      "vent": {
        "zone4": {
          "poussee_tuiles_s": -0.3,
          "accalmie_s": 3,
          "periode_s": 5
        },
        "interieur": 0,
        "accroche_annule_vent": true
      },
      "orage": {
        "eclair_periode_s": 7,
        "pixels_visibles_a_travers_murs_s": 1.5,
        "cierges_oscillation_tuiles": 0.5,
        "ciel": "ciel_orage"
      }
    },
    "image_a_reconstituer": [
      {
        "pixels": [
          1,
          6
        ],
        "detail": "Rosace centrale et portail gothique à triple arc brisé"
      },
      {
        "pixels": [
          7,
          12
        ],
        "detail": "Deux tours carrées symétriques de la façade"
      },
      {
        "pixels": [
          13,
          18
        ],
        "detail": "Arcs-boutants, pinacles et haute voûte de la nef"
      }
    ],
    "notes": [
      "Intérieur fermé de x=17 à x=95 : façade (portail), voûte de pierre avec vitraux, fond de nef, sol de pierre.",
      "Progression : parvis → nef au sol → escalier → galerie en hauteur → porte → toits → terrasse.",
      "Chaque fosse contient des pointes ; sous les galeries le sol est praticable et ramène à l'escalier."
    ],
    "sourceFile": "niveau_02_cathedrale.json",
    "sourceHash": "be38d5da8152ec5e083b4dc0e072fb213a2d4dc50b94e5f7db5131ba125b1695"
  },
  {
    "format": "niveau/3",
    "id": "niveau_03_chateau",
    "num": 3,
    "nom": "Château des Ducs de Bretagne",
    "difficulte": "3/12",
    "tile": 16,
    "largeur": 170,
    "hauteur": 20,
    "sol_y": 15,
    "temps_ref_s": 80,
    "tuiles": {
      "sol": {
        "haut": [
          "chateau_sol_pave_chateau"
        ],
        "gauche": "chateau_mur_gauche",
        "droite": "chateau_mur_droite",
        "plein": [
          "chateau_mur_tuffeau_plein_1",
          "chateau_mur_tuffeau_plein_2",
          "chateau_mur_tuffeau_plein_3"
        ]
      },
      "rempart": {
        "haut": [
          "chateau_mur_tuffeau_haut_creneaux_a"
        ],
        "gauche": "chateau_mur_gauche",
        "droite": "chateau_mur_droite",
        "plein": [
          "chateau_mur_tuffeau_plein_1",
          "chateau_mur_tuffeau_plein_2",
          "chateau_mur_tuffeau_plein_3"
        ]
      },
      "caisse": {
        "haut": [
          "chateau_caisse"
        ],
        "gauche": "chateau_caisse",
        "droite": "chateau_caisse",
        "plein": [
          "chateau_caisse"
        ]
      },
      "pilier": {
        "haut": [
          "chateau_mur_tuffeau_plein_1"
        ],
        "gauche": "chateau_mur_tuffeau_plein_2",
        "droite": "chateau_mur_tuffeau_plein_2",
        "plein": [
          "chateau_mur_tuffeau_plein_3"
        ]
      }
    },
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche. masse = bloc plein enraciné jusqu'en bas (ou jusqu'à 'to'), tuiles = jeu de tuiles défini dans 'tuiles' (haut/gauche/droite/plein). pont = plateforme fine traversable par le bas (sprite_set = gauche, milieu, droite), toujours portée par des piliers. mobile = plateforme animée (x1,y1 → x2,y2) ; si 'rail', elle pend à un rail porté par deux pylônes. eau = bassin mortel enraciné jusqu'en bas. Objets ancrés bas-gauche de la cellule (x,y) et posés sur une surface : le script de validation vérifie qu'aucun sprite ne se superpose, que chaque décor repose sur un support continu et que le parcours est franchissable (saut vertical 3, horizontal 4, accroche 3,5).",
    "fond": {
      "ciel": {
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "chateau_chateau_silhouette_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "id": "m1",
        "type": "masse",
        "tuiles": "sol",
        "x": 0,
        "y": 15,
        "w": 12
      },
      {
        "id": "m2",
        "type": "masse",
        "tuiles": "sol",
        "x": 12,
        "y": 17,
        "w": 4,
        "note": "fosse sèche, non mortelle"
      },
      {
        "id": "m4",
        "type": "masse",
        "tuiles": "sol",
        "x": 16,
        "y": 15,
        "w": 6
      },
      {
        "id": "m6",
        "type": "masse",
        "tuiles": "sol",
        "x": 26,
        "y": 15,
        "w": 8
      },
      {
        "id": "m7",
        "type": "masse",
        "tuiles": "sol",
        "x": 34,
        "y": 15,
        "w": 36
      },
      {
        "id": "m10",
        "type": "masse",
        "tuiles": "rempart",
        "x": 40,
        "y": 9,
        "w": 2,
        "to": 11,
        "pilier": true
      },
      {
        "id": "m11",
        "type": "masse",
        "tuiles": "caisse",
        "x": 44,
        "y": 14,
        "w": 2
      },
      {
        "id": "m14",
        "type": "masse",
        "tuiles": "rempart",
        "x": 50,
        "y": 9,
        "w": 2,
        "to": 11,
        "pilier": true
      },
      {
        "id": "m15",
        "type": "masse",
        "tuiles": "sol",
        "x": 54,
        "y": 13,
        "w": 3
      },
      {
        "id": "m16",
        "type": "masse",
        "tuiles": "rempart",
        "x": 58,
        "y": 11,
        "w": 3
      },
      {
        "id": "m19",
        "type": "masse",
        "tuiles": "rempart",
        "x": 66,
        "y": 9,
        "w": 2,
        "to": 11,
        "pilier": true
      },
      {
        "id": "m20",
        "type": "masse",
        "tuiles": "sol",
        "x": 70,
        "y": 15,
        "w": 12
      },
      {
        "id": "m21",
        "type": "masse",
        "tuiles": "sol",
        "x": 75,
        "y": 14,
        "w": 2
      },
      {
        "id": "m22",
        "type": "masse",
        "tuiles": "sol",
        "x": 77,
        "y": 13,
        "w": 2
      },
      {
        "id": "p23",
        "type": "pont",
        "x": 82,
        "y": 12,
        "w": 4,
        "sprite_set": [
          "chateau_planche_echafaudage_g",
          "chateau_planche_echafaudage_m",
          "chateau_planche_echafaudage_d"
        ]
      },
      {
        "id": "p24",
        "type": "pont",
        "x": 88,
        "y": 10,
        "w": 4,
        "sprite_set": [
          "chateau_corniche_pierre_g",
          "chateau_corniche_pierre_m",
          "chateau_corniche_pierre_d"
        ]
      },
      {
        "id": "p25",
        "type": "pont",
        "x": 95,
        "y": 11,
        "w": 4,
        "sprite_set": [
          "chateau_planche_echafaudage_g",
          "chateau_planche_echafaudage_m",
          "chateau_planche_echafaudage_d"
        ]
      },
      {
        "id": "m26",
        "type": "masse",
        "tuiles": "rempart",
        "x": 101,
        "y": 9,
        "w": 5
      },
      {
        "id": "m27",
        "type": "masse",
        "tuiles": "rempart",
        "x": 106,
        "y": 9,
        "w": 8
      },
      {
        "id": "m29",
        "type": "masse",
        "tuiles": "rempart",
        "x": 117,
        "y": 9,
        "w": 9
      },
      {
        "id": "m31",
        "type": "masse",
        "tuiles": "rempart",
        "x": 129,
        "y": 9,
        "w": 13
      },
      {
        "id": "m34",
        "type": "masse",
        "tuiles": "rempart",
        "x": 121,
        "y": 3,
        "w": 2,
        "to": 5,
        "pilier": true
      },
      {
        "id": "m35",
        "type": "masse",
        "tuiles": "sol",
        "x": 142,
        "y": 10,
        "w": 2
      },
      {
        "id": "m36",
        "type": "masse",
        "tuiles": "sol",
        "x": 144,
        "y": 11,
        "w": 2
      },
      {
        "id": "m37",
        "type": "masse",
        "tuiles": "sol",
        "x": 146,
        "y": 12,
        "w": 2
      },
      {
        "id": "m38",
        "type": "masse",
        "tuiles": "sol",
        "x": 148,
        "y": 13,
        "w": 22
      },
      {
        "id": "m39",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 82,
        "y": 12.5,
        "w": 1,
        "to": 20
      },
      {
        "id": "m40",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 85,
        "y": 12.5,
        "w": 1,
        "to": 20
      },
      {
        "id": "m41",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 88,
        "y": 10.5,
        "w": 1,
        "to": 20
      },
      {
        "id": "m42",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 91,
        "y": 10.5,
        "w": 1,
        "to": 20
      },
      {
        "id": "m43",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 95,
        "y": 11.5,
        "w": 1,
        "to": 20
      },
      {
        "id": "m44",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 98,
        "y": 11.5,
        "w": 1,
        "to": 20
      }
    ],
    "eau": [
      {
        "x": 22,
        "w": 4,
        "y": 18,
        "surf": "chateau_douve_surface",
        "deep": "chateau_douve_profonde"
      },
      {
        "x": 82,
        "w": 19,
        "y": 18,
        "surf": "chateau_douve_surface",
        "deep": "chateau_douve_profonde"
      },
      {
        "x": 114,
        "w": 3,
        "y": 18,
        "surf": "chateau_douve_surface",
        "deep": "chateau_douve_profonde"
      },
      {
        "x": 126,
        "w": 3,
        "y": 18,
        "surf": "chateau_douve_surface",
        "deep": "chateau_douve_profonde"
      }
    ],
    "mobiles": [
      {
        "id": "v3",
        "sprite": "chateau_pont_levis",
        "kind": "pont_levis",
        "x1": 12,
        "y1": 15,
        "x2": 12,
        "y2": 15,
        "w": 4,
        "cycle": {
          "ouvert_s": 3,
          "ferme_s": 2,
          "preavis_s": 0.5
        }
      },
      {
        "id": "v5",
        "sprite": "chateau_pont_levis",
        "kind": "pont_levis",
        "x1": 22,
        "y1": 15,
        "x2": 22,
        "y2": 15,
        "w": 4,
        "cycle": {
          "ouvert_s": 3,
          "ferme_s": 2,
          "preavis_s": 0.5
        }
      },
      {
        "id": "v28",
        "sprite": "chateau_pont_levis",
        "kind": "pont_levis",
        "x1": 114,
        "y1": 9,
        "x2": 114,
        "y2": 9,
        "w": 4,
        "cycle": {
          "ouvert_s": 3,
          "ferme_s": 2,
          "preavis_s": 0.5
        }
      },
      {
        "id": "v30",
        "sprite": "chateau_pont_levis",
        "kind": "pont_levis",
        "x1": 126,
        "y1": 9,
        "x2": 126,
        "y2": 9,
        "w": 4,
        "cycle": {
          "ouvert_s": 3,
          "ferme_s": 2,
          "preavis_s": 0.5
        }
      }
    ],
    "rails": [],
    "dangers": [
      {
        "sprite": "chateau_herse",
        "x": 40,
        "y": 13,
        "w": 1,
        "kind": "cyclique",
        "cycle": {
          "descente_s": 3,
          "bas_s": 1,
          "montee_s": 2,
          "passage_libre_px": 12
        },
        "decalage_y_px": 4
      },
      {
        "sprite": "chateau_herse",
        "x": 50,
        "y": 13,
        "w": 1,
        "kind": "cyclique",
        "cycle": {
          "descente_s": 3,
          "bas_s": 1,
          "montee_s": 2,
          "passage_libre_px": 12
        },
        "decalage_y_px": 4
      },
      {
        "sprite": "commun_pointes_fer_1",
        "x": 57,
        "y": 14,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "chateau_herse",
        "x": 66,
        "y": 13,
        "w": 1,
        "kind": "cyclique",
        "cycle": {
          "descente_s": 3,
          "bas_s": 1,
          "montee_s": 2,
          "passage_libre_px": 12
        },
        "decalage_y_px": 4
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 96,
        "y": 10,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "chateau_herse",
        "x": 121,
        "y": 7,
        "w": 1,
        "kind": "cyclique",
        "cycle": {
          "descente_s": 3,
          "bas_s": 1,
          "montee_s": 2,
          "passage_libre_px": 12
        },
        "decalage_y_px": 4
      },
      {
        "sprite": "commun_pointes_fer_1",
        "x": 134,
        "y": 8,
        "w": 1,
        "kind": "mortel"
      }
    ],
    "ennemis": [
      {
        "id": "e1",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 84,
        "x2": 94,
        "y": 7,
        "vitesse": 3.5
      },
      {
        "id": "e2",
        "sprite": "chateau_tonneau",
        "type": "roulant",
        "x1": 130,
        "x2": 140,
        "y": 7,
        "vitesse": 4,
        "direction": "gauche"
      }
    ],
    "pixels": [
      {
        "x": 10,
        "difficulte": "facile",
        "y": 13.25,
        "id": 1,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 14,
        "difficulte": "facile",
        "y": 12.25,
        "id": 2,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 24,
        "difficulte": "risque",
        "y": 11.5,
        "id": 3,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 30,
        "difficulte": "facile",
        "y": 13.25,
        "id": 4,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 40,
        "difficulte": "facile",
        "y": 14,
        "id": 5,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 45,
        "difficulte": "facile",
        "y": 11.25,
        "id": 6,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 59,
        "difficulte": "cache",
        "y": 9.25,
        "id": 7,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 67,
        "difficulte": "risque",
        "y": 14,
        "id": 8,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 72,
        "difficulte": "facile",
        "y": 13.25,
        "id": 9,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 83,
        "difficulte": "facile",
        "y": 10.25,
        "id": 10,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 90,
        "difficulte": "facile",
        "y": 8.25,
        "id": 11,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 98,
        "difficulte": "risque",
        "y": 8.25,
        "id": 12,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 110,
        "difficulte": "facile",
        "y": 7.25,
        "id": 13,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 115,
        "difficulte": "risque",
        "y": 6.25,
        "id": 14,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 121,
        "difficulte": "cache",
        "y": 8,
        "id": 15,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 127,
        "difficulte": "risque",
        "y": 6.25,
        "id": 16,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 139,
        "difficulte": "facile",
        "y": 7.25,
        "id": 17,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 145,
        "difficulte": "facile",
        "y": 9.25,
        "id": 18,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 152,
        "difficulte": "facile",
        "y": 11.25,
        "id": 19,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 162,
        "difficulte": "facile",
        "y": 11.25,
        "id": 20,
        "sprite": "commun_pixel",
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 32,
        "y": 14,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 69,
        "y": 14,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 104,
        "y": 8,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_saut",
        "x": 8,
        "y": 14,
        "texte": "Le pont-levis s'abaisse 3 s puis se relève 2 s. Attends qu'il soit baissé."
      }
    ],
    "decor": [
      {
        "sprite": "chateau_tour_ronde_pied",
        "x": 4,
        "y": 14,
        "layer": "back"
      },
      {
        "sprite": "chateau_tour_ronde_milieu",
        "x": 4,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "chateau_tour_ronde_haut",
        "x": 4,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "chateau_barriere_chantier",
        "x": 36,
        "y": 14,
        "layer": "back"
      },
      {
        "sprite": "chateau_barriere_chantier",
        "x": 72,
        "y": 14,
        "layer": "back"
      },
      {
        "sprite": "chateau_grand_logis",
        "x": 154,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_haut_creneaux_a",
        "x": 39,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 39,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 39,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 39,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 39,
        "y": 13,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 39,
        "y": 14,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_haut_creneaux_a",
        "x": 42,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 42,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 42,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 42,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 42,
        "y": 13,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 42,
        "y": 14,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_haut_creneaux_a",
        "x": 49,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 49,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 49,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 49,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 49,
        "y": 13,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 49,
        "y": 14,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_haut_creneaux_a",
        "x": 52,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 52,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 52,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 52,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 52,
        "y": 13,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 52,
        "y": 14,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_haut_creneaux_a",
        "x": 65,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 65,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 65,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 65,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 65,
        "y": 13,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 65,
        "y": 14,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_haut_creneaux_a",
        "x": 68,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 68,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 68,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 68,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 68,
        "y": 13,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 68,
        "y": 14,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_haut_creneaux_a",
        "x": 120,
        "y": 3,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 120,
        "y": 4,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 120,
        "y": 5,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 120,
        "y": 6,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 120,
        "y": 7,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 120,
        "y": 8,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_haut_creneaux_a",
        "x": 123,
        "y": 3,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 123,
        "y": 4,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 123,
        "y": 5,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_1",
        "x": 123,
        "y": 6,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_2",
        "x": 123,
        "y": 7,
        "layer": "back"
      },
      {
        "sprite": "chateau_mur_tuffeau_plein_3",
        "x": 123,
        "y": 8,
        "layer": "back"
      }
    ],
    "anneaux": [],
    "boosts": [],
    "spawn": {
      "x": 1,
      "y": 14
    },
    "arrivee": {
      "monument": {
        "sprite": "chateau_monument_chateau",
        "x": 163,
        "y": 12
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 167,
        "y": 12
      },
      "declencheur": {
        "x": 168,
        "y": 12
      }
    },
    "spec": {
      "pixels": 20,
      "checkpoints": 3,
      "obstacles_mortels": 11,
      "boss": null
    },
    "zones": [
      {
        "n": 1,
        "nom": "Les Douves et le Premier Pont-Levis",
        "x": [
          0,
          34
        ]
      },
      {
        "n": 2,
        "nom": "Le Châtelet d'Entrée et les Herses",
        "x": [
          34,
          70
        ]
      },
      {
        "n": 3,
        "nom": "L'Ascension des Échafaudages de Tuffeau",
        "x": [
          70,
          106
        ]
      },
      {
        "n": 4,
        "nom": "Le Chemin de Ronde Crénelé",
        "x": [
          106,
          142
        ]
      },
      {
        "n": 5,
        "nom": "La Cour du Grand Logis",
        "x": [
          142,
          170
        ]
      }
    ],
    "pedagogie": [
      "Introduction sans risque (`x=12 à 16`) : Le `pont_levis` #1 enjambe une fosse sèche de 2 tuiles de profondeur avec un escalier pour remonter. Si le joueur avance quand le pont se relève, il tombe simplement dans la fosse sans mourir et comprend le rythme (3 s ouvert / 2 s fermé + cliquetis de chaînes 0,5 s avant de bouger).",
      "Test (`x=22 à 26` puis `Zone 4`) : Le `pont_levis` #2 surplombe les vraies douves mortelles, puis la Zone 4 combine le timing du pont-levis avec celui d'une herse."
    ],
    "courbe_difficulte": [
      "Zones de respiration : Début de Zone 1 (`x=0..16`, fosse sèche sans danger), paliers des checkpoints 2 (`x=69`) et 3 (`x=104`), et toute la Zone 5 devant le Grand Logis.",
      "Pic de difficulté : Zone 4 (`x=114 à 138`), où le joueur doit enchaîner deux ponts-levis suspendus, passer une herse, puis sauter par-dessus une torche et un tonneau roulant sur le chemin de ronde."
    ],
    "meteo": {
      "pluie": {
        "regle": "Les `planche_echafaudage` glissent légèrement (friction `×0,8`) ; les `torche_murale` sont éteintes par la pluie !",
        "avantage": "2 obstacles mortels supprimés (`torche_murale` en Zones 3 et 4 deviennent inoffensives).",
        "inconvenient": "Réception un peu glissante sur les échafaudages de la Zone 3.",
        "annonce": "`goutte_pluie`, `ciel_gris`, clapotis dans la `douve_surface` et fumée sur les torches éteintes."
      },
      "soleil": {
        "regle": "Les chaînes des `pont_levis` sont sèches : ils restent abaissés 3,5 s au lieu de 3 s.",
        "avantage": "Fenêtre de passage plus généreuse sur les 4 ponts-levis du niveau.",
        "inconvenient": "Les `tonneau` roulent sur pavé sec un peu plus vite (`×1,1`, soit 3,8 et 4,4 tuiles/s).",
        "annonce": "`ciel_chateau_1` lumineux, reflets sur le tuffeau blanc, trompettes lointaines."
      },
      "neige": {
        "regle": "La `douve_surface` en Zone 1 (`x=22..25`) est partiellement gelée (1 bloc de glace flottant au milieu à `x=23, y=18`).",
        "avantage": "Si le joueur rate le pont-levis #2 en Zone 1, il peut rebondir sur le bloc de glace au lieu de mourir.",
        "inconvenient": "Le `mur_tuffeau_haut_creneaux` en Zone 4 a une friction `×0,75`.",
        "annonce": "`flocon`, neige sur les créneaux et les bannières, son étouffé des chaînes."
      },
      "brume": {
        "regle": "Nappe de `brume_bande_tile_x` au-dessus des douves et visibilité à 10 tuiles autour du joueur.",
        "avantage": "Les `herse` rouillées par l'humidité descendent 20 % moins vite (plus facile de glisser dessous avec `↓`).",
        "inconvenient": "On voit les `tonneau` de la Zone 4 à 10 tuiles (soit 2,5 s avant impact au lieu de 3,5 s).",
        "annonce": "Brume sortant des douves, lueur orange des `torche_murale` dans le brouillard."
      },
      "vent": {
        "regle": "Vent d'ouest poussant vers la droite (`+0,5 tuile/s` en l'air) ; fait claquer les `banniere_hermine`.",
        "avantage": "Ralentit les `tonneau` qui roulent vers la gauche (`×0,8`, soit 2,8 et 3,2 tuiles/s) !",
        "inconvenient": "Pousse légèrement le joueur vers les herses s'il saute trop près d'elles.",
        "annonce": "`banniere_hermine` horizontales, souffle dans les meurtrières."
      },
      "orage": {
        "regle": "Éclair toutes les 8 s : l'électricité bloque magnétiquement les `herse` en position haute pendant 2 s après chaque éclair.",
        "avantage": "Permet de franchir n'importe quelle herse sans risque juste après un coup de tonnerre.",
        "inconvenient": "L'onde de choc du tonnerre fait trembler les `pont_levis` 0,3 s avant qu'ils ne se relèvent.",
        "annonce": "`ciel_orage`, éclairs derrière les `tour_ronde_haut`, tonnerre + cliquetis métallique."
      }
    },
    "image_a_reconstituer": [
      "1er détail révélé (pixels 1 à 7) : Les deux grosses *Tours rondes du Châtelet d'entrée* et le *Pont-levis* au-dessus des douves.",
      "2e détail (pixels 8 à 14) : La façade blanche immaculée de style Renaissance du *Grand Logis* avec ses lucarnes sculptées.",
      "3e détail (pixels 15 à 20) : Les courtines à mâchicoulis, le reflet dans l'eau des douves et les bannières à hermines."
    ],
    "boss": null,
    "notes_conception": [
      "Passes: piliers de herse convertis en décor (non solide) pour ne pas bloquer le couloir ; linteau conservé solide."
    ],
    "sourceFile": "niveau_03_chateau.json",
    "sourceHash": "b60ff9b85e52ec0b18e0a55965abfbe5dcffa879a024175036fea4c8042a1add"
  },
  {
    "format": "niveau/2",
    "tile": 16,
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche (y fractionnaire possible). Plateformes (type) : masse = bloc plein enraciné jusqu'au bas du niveau (sprite de dessus + remplissage, fill_to = arrêt du remplissage) ; pont = planches/tablier traversable par le bas ; colonne / galerie = éléments portés jusqu'au sol ; pad = surface de collision posée sur le sommet d'un décor (l'objet visuel est dans decor, lié par sur=id). Les autres objets (decor, dangers, signes, checkpoints, arrivee) sont ancrés bas-gauche de la cellule (x,y) et reposent sur une surface. layer 'inlay' = élément incrusté dans la maçonnerie. mecanique = comportement dynamique de la plateforme (cycle, bascule, rebond, etc.). Aucune zone de sprite ne se recouvre (vérifié) et chaque pixel est atteignable (vérifié).",
    "id": "niveau_04_ile_feydeau",
    "num": 4,
    "nom": "Île Feydeau",
    "difficulte": "4/12",
    "largeur": 180,
    "hauteur": 18,
    "sol_y": 14,
    "temps_ref_s": 85,
    "spawn": {
      "x": 3,
      "y": 13
    },
    "spec": {
      "boss": null,
      "pixels": 20,
      "checkpoints": 3,
      "obstacles_mortels": 8
    },
    "mecaniques": [
      "balcons inclinés (glisse)",
      "bateaux flotteurs"
    ],
    "fond": {
      "ciel": {
        "defaut": "ciel_jour",
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "feydeau_fond_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "type": "masse",
        "x": 0,
        "y": 14,
        "w": 36,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p1"
      },
      {
        "type": "masse",
        "x": 13,
        "y": 11,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p2"
      },
      {
        "type": "pont",
        "x": 14,
        "y": 11,
        "w": 5,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "glisse_tuiles_s": 1.2,
        "id": "p3"
      },
      {
        "type": "masse",
        "x": 21,
        "y": 10,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p4"
      },
      {
        "type": "pont",
        "x": 22,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "glisse_tuiles_s": 1.2,
        "id": "p5"
      },
      {
        "type": "masse",
        "x": 38,
        "y": 11,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p6"
      },
      {
        "type": "pont",
        "x": 39,
        "y": 11,
        "w": 4,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "glisse_tuiles_s": 1.2,
        "id": "p7"
      },
      {
        "type": "masse",
        "x": 46,
        "y": 10,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p8"
      },
      {
        "type": "pont",
        "x": 47,
        "y": 10,
        "w": 4,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "glisse_tuiles_s": -1.2,
        "id": "p9"
      },
      {
        "type": "masse",
        "x": 54,
        "y": 8,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p10"
      },
      {
        "type": "pont",
        "x": 55,
        "y": 8,
        "w": 5,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "glisse_tuiles_s": 1.2,
        "id": "p11"
      },
      {
        "type": "masse",
        "x": 63,
        "y": 14,
        "w": 11,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p12"
      },
      {
        "type": "masse",
        "x": 64,
        "y": 11,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p13"
      },
      {
        "type": "pont",
        "x": 65,
        "y": 11,
        "w": 4,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "glisse_tuiles_s": 1.2,
        "id": "p14"
      },
      {
        "type": "masse",
        "x": 74,
        "y": 14,
        "w": 5,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p15"
      },
      {
        "type": "pad",
        "id": "gabare1",
        "x": 80,
        "y": 14,
        "w": 4,
        "solid": "top",
        "sur": "gabare1",
        "mecanique": {
          "type": "flotteur",
          "enfonce_tuiles": 1.5,
          "duree_s": 1.5,
          "remonte_s": 2
        }
      },
      {
        "sprite": "petit_bateau",
        "x": 80,
        "y": 14.25,
        "id": "gabare1a"
      },
      {
        "sprite": "petit_bateau",
        "x": 82,
        "y": 14.25,
        "id": "gabare1b"
      },
      {
        "type": "pad",
        "id": "gabare2",
        "x": 87,
        "y": 14,
        "w": 4,
        "solid": "top",
        "sur": "gabare2",
        "mecanique": {
          "type": "flotteur",
          "enfonce_tuiles": 1.5,
          "duree_s": 1.5,
          "remonte_s": 2
        }
      },
      {
        "sprite": "petit_bateau",
        "x": 87,
        "y": 14.25,
        "id": "gabare2a"
      },
      {
        "sprite": "petit_bateau",
        "x": 89,
        "y": 14.25,
        "id": "gabare2b"
      },
      {
        "type": "masse",
        "x": 94,
        "y": 14,
        "w": 5,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p22"
      },
      {
        "type": "pad",
        "id": "gabare3",
        "x": 101,
        "y": 14,
        "w": 4,
        "solid": "top",
        "sur": "gabare3",
        "mecanique": {
          "type": "flotteur",
          "enfonce_tuiles": 1.5,
          "duree_s": 1.5,
          "remonte_s": 2
        }
      },
      {
        "sprite": "petit_bateau",
        "x": 101,
        "y": 14.25,
        "id": "gabare3a"
      },
      {
        "sprite": "petit_bateau",
        "x": 103,
        "y": 14.25,
        "id": "gabare3b"
      },
      {
        "type": "pad",
        "id": "gabare4",
        "x": 107,
        "y": 14,
        "w": 4,
        "solid": "top",
        "sur": "gabare4",
        "mecanique": {
          "type": "flotteur",
          "enfonce_tuiles": 1.5,
          "duree_s": 1.5,
          "remonte_s": 2
        }
      },
      {
        "sprite": "petit_bateau",
        "x": 107,
        "y": 14.25,
        "id": "gabare4a"
      },
      {
        "sprite": "petit_bateau",
        "x": 109,
        "y": 14.25,
        "id": "gabare4b"
      },
      {
        "type": "masse",
        "x": 112,
        "y": 14,
        "w": 6,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p29"
      },
      {
        "type": "masse",
        "x": 120,
        "y": 11,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p30"
      },
      {
        "type": "pont",
        "x": 121,
        "y": 11,
        "w": 4,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "glisse_tuiles_s": 1.2,
        "id": "p31"
      },
      {
        "type": "pad",
        "id": "gabare5",
        "x": 128,
        "y": 14,
        "w": 4,
        "solid": "top",
        "sur": "gabare5",
        "mecanique": {
          "type": "flotteur",
          "enfonce_tuiles": 1.5,
          "duree_s": 1.5,
          "remonte_s": 2
        }
      },
      {
        "sprite": "petit_bateau",
        "x": 128,
        "y": 14.25,
        "id": "gabare5a"
      },
      {
        "sprite": "petit_bateau",
        "x": 130,
        "y": 14.25,
        "id": "gabare5b"
      },
      {
        "type": "masse",
        "x": 134,
        "y": 11,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p35"
      },
      {
        "type": "pont",
        "x": 135,
        "y": 11,
        "w": 4,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "note": "accroche ↑ depuis le bateau",
        "id": "p36"
      },
      {
        "type": "masse",
        "x": 134,
        "y": 8,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "fill_to": 11,
        "note": "pilier du balcon secret",
        "id": "p37"
      },
      {
        "type": "pont",
        "x": 135,
        "y": 8,
        "w": 3,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "id": "p38"
      },
      {
        "type": "masse",
        "x": 142,
        "y": 9,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p39"
      },
      {
        "type": "pont",
        "x": 143,
        "y": 9,
        "w": 4,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "glisse_tuiles_s": 1.2,
        "id": "p40"
      },
      {
        "type": "masse",
        "x": 152,
        "y": 14,
        "w": 28,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p41"
      },
      {
        "type": "masse",
        "x": 158,
        "y": 11,
        "w": 1,
        "top_sprite": "feydeau_sol_haut_1",
        "fill_sprite": "feydeau_sol_plein",
        "grab": true,
        "id": "p42"
      },
      {
        "type": "pont",
        "x": 159,
        "y": 11,
        "w": 5,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ],
        "glisse_tuiles_s": -1.2,
        "id": "p43"
      }
    ],
    "dangers": [
      {
        "sprite": "feydeau_obstacle_ancre_pointes",
        "x": 29,
        "y": 13,
        "kind": "mortel"
      },
      {
        "sprite": "feydeau_obstacle_ancre_pointes",
        "x": 56,
        "y": 7,
        "kind": "mortel"
      },
      {
        "sprite": "feydeau_obstacle_ancre_pointes",
        "x": 68,
        "y": 13,
        "kind": "mortel"
      },
      {
        "sprite": "feydeau_obstacle_ancre_pointes",
        "x": 88,
        "y": 13,
        "kind": "mortel"
      },
      {
        "sprite": "feydeau_obstacle_ancre_pointes",
        "x": 103,
        "y": 13,
        "kind": "mortel"
      },
      {
        "sprite": "feydeau_obstacle_ancre_pointes",
        "x": 122,
        "y": 10,
        "kind": "mortel"
      },
      {
        "sprite": "feydeau_obstacle_ancre_pointes",
        "x": 137,
        "y": 10,
        "kind": "mortel"
      },
      {
        "sprite": "feydeau_obstacle_ancre_pointes",
        "x": 145,
        "y": 8,
        "kind": "mortel"
      },
      {
        "sprite": "bassin_eau",
        "x": 36,
        "y": 15,
        "kind": "eau_mortelle",
        "w": 27
      },
      {
        "sprite": "bassin_eau",
        "x": 36,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 27
      },
      {
        "sprite": "bassin_eau",
        "x": 36,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 27
      },
      {
        "sprite": "bassin_eau",
        "x": 79,
        "y": 15,
        "kind": "eau_mortelle",
        "w": 2
      },
      {
        "sprite": "bassin_eau",
        "x": 79,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 2
      },
      {
        "sprite": "bassin_eau",
        "x": 79,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 2
      },
      {
        "sprite": "bassin_eau",
        "x": 84,
        "y": 15,
        "kind": "eau_mortelle",
        "w": 3
      },
      {
        "sprite": "bassin_eau",
        "x": 84,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 3
      },
      {
        "sprite": "bassin_eau",
        "x": 84,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 3
      },
      {
        "sprite": "bassin_eau",
        "x": 91,
        "y": 15,
        "kind": "eau_mortelle",
        "w": 3
      },
      {
        "sprite": "bassin_eau",
        "x": 91,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 3
      },
      {
        "sprite": "bassin_eau",
        "x": 91,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 3
      },
      {
        "sprite": "bassin_eau",
        "x": 99,
        "y": 15,
        "kind": "eau_mortelle",
        "w": 2
      },
      {
        "sprite": "bassin_eau",
        "x": 99,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 2
      },
      {
        "sprite": "bassin_eau",
        "x": 99,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 2
      },
      {
        "sprite": "bassin_eau",
        "x": 105,
        "y": 15,
        "kind": "eau_mortelle",
        "w": 2
      },
      {
        "sprite": "bassin_eau",
        "x": 105,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 2
      },
      {
        "sprite": "bassin_eau",
        "x": 105,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 2
      },
      {
        "sprite": "bassin_eau",
        "x": 111,
        "y": 15,
        "kind": "eau_mortelle",
        "w": 1
      },
      {
        "sprite": "bassin_eau",
        "x": 111,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 1
      },
      {
        "sprite": "bassin_eau",
        "x": 111,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 1
      },
      {
        "sprite": "bassin_eau",
        "x": 118,
        "y": 15,
        "kind": "eau_mortelle",
        "w": 34
      },
      {
        "sprite": "bassin_eau",
        "x": 118,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 34
      },
      {
        "sprite": "bassin_eau",
        "x": 118,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 34
      }
    ],
    "ennemis": [
      {
        "id": "mouette_z2",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 44,
        "x2": 53,
        "y": 8.875,
        "vitesse": 3.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "mouette_z4a",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 126,
        "x2": 133,
        "y": 12.875,
        "vitesse": 3.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "mouette_z4b",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 140,
        "x2": 148,
        "y": 7.875,
        "vitesse": 3.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      }
    ],
    "pixels": [
      {
        "sprite": "commun_pixel",
        "x": 10,
        "y": 13,
        "difficulte": "facile",
        "id": 1,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 17,
        "y": 9,
        "difficulte": "facile",
        "id": 2,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 21,
        "y": 8,
        "difficulte": "facile",
        "id": 3,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 29,
        "y": 11,
        "difficulte": "facile",
        "id": 4,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 41,
        "y": 9,
        "difficulte": "facile",
        "id": 5,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 48,
        "y": 8,
        "difficulte": "facile",
        "id": 6,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 58,
        "y": 6,
        "difficulte": "facile",
        "id": 7,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 67,
        "y": 9,
        "difficulte": "facile",
        "id": 8,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 82,
        "y": 12,
        "difficulte": "facile",
        "id": 9,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 91,
        "y": 13,
        "difficulte": "facile",
        "id": 10,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 96,
        "y": 12,
        "difficulte": "facile",
        "id": 11,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 109,
        "y": 11,
        "difficulte": "facile",
        "id": 12,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 124,
        "y": 9,
        "difficulte": "facile",
        "id": 13,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 130,
        "y": 11,
        "difficulte": "facile",
        "id": 14,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 136,
        "y": 6,
        "difficulte": "facile",
        "id": 15,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 144,
        "y": 7,
        "difficulte": "facile",
        "id": 16,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 147,
        "y": 7,
        "difficulte": "facile",
        "id": 17,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 160,
        "y": 9,
        "difficulte": "facile",
        "id": 18,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 163,
        "y": 9,
        "difficulte": "facile",
        "id": 19,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 168,
        "y": 13,
        "difficulte": "facile",
        "id": 20,
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 34,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 72,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 114,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_fleches",
        "x": 5,
        "y": 13,
        "texte": "Les balcons penchés te font glisser : saute dans le sens de la pente pour aller plus loin."
      },
      {
        "sprite": "signes_panneau_saut",
        "x": 76,
        "y": 13,
        "texte": "Les bateaux s'enfoncent : ne reste pas immobile."
      }
    ],
    "decor": [
      {
        "sprite": "feydeau_bollard",
        "x": 6,
        "y": 13
      },
      {
        "sprite": "feydeau_ancre",
        "x": 8,
        "y": 13
      },
      {
        "sprite": "feydeau_bollard",
        "x": 31,
        "y": 13
      },
      {
        "sprite": "feydeau_hotel_armateur_a",
        "x": 13,
        "y": 13,
        "layer": "fond"
      },
      {
        "sprite": "feydeau_hotel_armateur_b_penchee",
        "x": 16,
        "y": 13,
        "layer": "fond"
      },
      {
        "sprite": "feydeau_hotel_armateur_a",
        "x": 21,
        "y": 13,
        "layer": "fond"
      },
      {
        "sprite": "feydeau_hotel_armateur_a",
        "x": 157,
        "y": 13,
        "layer": "fond"
      },
      {
        "sprite": "feydeau_hotel_armateur_b_penchee",
        "x": 161,
        "y": 13,
        "layer": "fond"
      },
      {
        "sprite": "feydeau_mascaron",
        "x": 14,
        "y": 10,
        "layer": "inlay"
      },
      {
        "sprite": "feydeau_mascaron",
        "x": 18,
        "y": 10,
        "layer": "inlay"
      },
      {
        "sprite": "feydeau_mascaron",
        "x": 159,
        "y": 10,
        "layer": "inlay"
      },
      {
        "sprite": "feydeau_mascaron",
        "x": 163,
        "y": 10,
        "layer": "inlay"
      },
      {
        "sprite": "feydeau_bollard",
        "x": 66,
        "y": 13
      },
      {
        "sprite": "feydeau_bollard",
        "x": 113,
        "y": 13
      },
      {
        "sprite": "feydeau_ancre",
        "x": 75,
        "y": 13
      },
      {
        "sprite": "feydeau_bollard",
        "x": 154,
        "y": 13
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "feydeau_monument_feydeau",
        "x": 172,
        "y": 13
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 176,
        "y": 13
      },
      "declencheur": {
        "x": 177,
        "y": 13
      }
    },
    "zones": [
      {
        "n": 1,
        "nom": "Le Quai Turenne",
        "x": [
          0,
          36
        ]
      },
      {
        "n": 2,
        "nom": "Les Hôtels d'Armateurs",
        "x": [
          36,
          74
        ]
      },
      {
        "n": 3,
        "nom": "La Traversée des Gabares",
        "x": [
          74,
          112
        ]
      },
      {
        "n": 4,
        "nom": "La Cour du Temple du Goût",
        "x": [
          112,
          152
        ]
      },
      {
        "n": 5,
        "nom": "La Proue de Pierre",
        "x": [
          152,
          180
        ]
      }
    ],
    "pedagogie": [
      {
        "x": [
          13,
          20
        ],
        "texte": "Balcon penché au-dessus d'un quai large : glisser n'est pas dangereux."
      },
      {
        "x": [
          76,
          84
        ],
        "texte": "Premier bateau à 2 tuiles du quai : on peut revenir."
      },
      {
        "x": [
          128,
          136
        ],
        "texte": "Test : sauter du bateau avant qu'il s'enfonce pour accrocher le balcon (↑)."
      }
    ],
    "meteo": {
      "pluie": {
        "glisse_tuiles_s": 1.5,
        "loire_monte": 0.5,
        "bateaux_montent": 0.5,
        "ciel": "ciel_gris"
      },
      "soleil": {
        "glisse_tuiles_s": 0.9,
        "bateau_enfonce_s": 2,
        "mouettes_vitesse": 3.8
      },
      "neige": {
        "bateau_enfonce_max_tuiles": 0.5,
        "friction_quais": 0.8
      },
      "brume": {
        "visibilite_tuiles": 10
      },
      "vent": {
        "poussee_tuiles_s": 0.4
      },
      "orage": {
        "eclair_periode_s": 8
      }
    },
    "image_a_reconstituer": [
      {
        "pixels": [
          1,
          7
        ],
        "detail": "Hôtels d'armateurs penchés de l'île Feydeau"
      },
      {
        "pixels": [
          8,
          14
        ],
        "detail": "Balcons en fer forgé et mascarons"
      },
      {
        "pixels": [
          15,
          20
        ],
        "detail": "Quai de Loire, bateaux et pointe de l'île"
      }
    ],
    "notes": [
      "Balcons posés sur pilotis de pierre (jamais en l'air) ; hôtels en fond de scène sur le quai.",
      "Pente simulée par glisse_tuiles_s (sprites plats).",
      "Eau à y=15 ; ancres suspendues du GDD posées sur les balcons/bateaux."
    ],
    "sourceFile": "niveau_04_ile_feydeau.json",
    "sourceHash": "10004b7db2ebf78a7e8d1bbc0995a9d6151af0d8bba14b2b2ae7357c130cc488"
  },
  {
    "format": "niveau/3",
    "id": "niveau_05_graslin",
    "num": 5,
    "nom": "Théâtre Graslin & Place Graslin",
    "difficulte": "5/12",
    "tile": 16,
    "largeur": 190,
    "hauteur": 22,
    "sol_y": 20,
    "temps_ref_s": 90,
    "tuiles": {
      "sol": {
        "haut": [
          "graslin_sol_haut_1",
          "graslin_sol_haut_2"
        ],
        "gauche": "graslin_sol_gauche",
        "droite": "graslin_sol_droite",
        "plein": [
          "graslin_sol_plein"
        ]
      },
      "pilier": {
        "haut": [
          "graslin_sol_plein"
        ],
        "gauche": "graslin_sol_plein",
        "droite": "graslin_sol_plein",
        "plein": [
          "graslin_sol_plein"
        ]
      }
    },
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche. masse = bloc plein enraciné jusqu'en bas (ou jusqu'à 'to'), tuiles = jeu de tuiles défini dans 'tuiles' (haut/gauche/droite/plein). pont = plateforme fine traversable par le bas (sprite_set = gauche, milieu, droite), toujours portée par des piliers. mobile = plateforme animée (x1,y1 → x2,y2) ; si 'rail', elle pend à un rail porté par deux pylônes. eau = bassin mortel enraciné jusqu'en bas. Objets ancrés bas-gauche de la cellule (x,y) et posés sur une surface : le script de validation vérifie qu'aucun sprite ne se superpose, que chaque décor repose sur un support continu et que le parcours est franchissable (saut vertical 3, horizontal 4, accroche 3,5).",
    "fond": {
      "ciel": {
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "graslin_fond_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "id": "m1",
        "type": "masse",
        "tuiles": "sol",
        "x": 0,
        "y": 20,
        "w": 38
      },
      {
        "id": "p2",
        "type": "pont",
        "x": 20,
        "y": 14,
        "w": 7,
        "sprite_set": [
          "graslin_terrasse_cafe_g",
          "graslin_terrasse_cafe_m",
          "graslin_terrasse_cafe_d"
        ]
      },
      {
        "id": "p3",
        "type": "pont",
        "x": 33,
        "y": 14,
        "w": 5,
        "sprite_set": [
          "graslin_terrasse_cafe_g",
          "graslin_terrasse_cafe_m",
          "graslin_terrasse_cafe_d"
        ]
      },
      {
        "id": "m4",
        "type": "masse",
        "tuiles": "sol",
        "x": 38,
        "y": 19,
        "w": 12
      },
      {
        "id": "m5",
        "type": "masse",
        "tuiles": "sol",
        "x": 50,
        "y": 17,
        "w": 12
      },
      {
        "id": "m6",
        "type": "masse",
        "tuiles": "sol",
        "x": 62,
        "y": 15,
        "w": 16
      },
      {
        "id": "m7",
        "type": "masse",
        "tuiles": "sol",
        "x": 49,
        "y": 13,
        "w": 1
      },
      {
        "id": "p8",
        "type": "pont",
        "x": 53,
        "y": 12,
        "w": 5,
        "sprite_set": [
          "graslin_terrasse_cafe_g",
          "graslin_terrasse_cafe_m",
          "graslin_terrasse_cafe_d"
        ]
      },
      {
        "id": "m9",
        "type": "masse",
        "tuiles": "sol",
        "x": 64,
        "y": 11,
        "w": 1
      },
      {
        "id": "m10",
        "type": "masse",
        "tuiles": "sol",
        "x": 78,
        "y": 18,
        "w": 33,
        "mortel": true
      },
      {
        "id": "m47",
        "type": "masse",
        "tuiles": "sol",
        "x": 111,
        "y": 8,
        "w": 10
      },
      {
        "id": "m48",
        "type": "masse",
        "tuiles": "sol",
        "x": 121,
        "y": 21,
        "w": 36,
        "mortel": true
      },
      {
        "id": "m50",
        "type": "masse",
        "tuiles": "sol",
        "x": 128,
        "y": 8,
        "w": 3
      },
      {
        "id": "m51",
        "type": "masse",
        "tuiles": "sol",
        "x": 132,
        "y": 10,
        "w": 4
      },
      {
        "id": "m52",
        "type": "masse",
        "tuiles": "sol",
        "x": 138,
        "y": 6,
        "w": 3
      },
      {
        "id": "m54",
        "type": "masse",
        "tuiles": "sol",
        "x": 149,
        "y": 6,
        "w": 9
      },
      {
        "id": "m55",
        "type": "masse",
        "tuiles": "sol",
        "x": 158,
        "y": 9,
        "w": 8
      },
      {
        "id": "m56",
        "type": "masse",
        "tuiles": "sol",
        "x": 166,
        "y": 12,
        "w": 24
      },
      {
        "id": "m57",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 20,
        "y": 14.5,
        "w": 1,
        "to": 20
      },
      {
        "id": "m58",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 26,
        "y": 14.5,
        "w": 1,
        "to": 20
      },
      {
        "id": "m59",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 33,
        "y": 14.5,
        "w": 1,
        "to": 20
      },
      {
        "id": "m60",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 37,
        "y": 14.5,
        "w": 1,
        "to": 20
      },
      {
        "id": "m61",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 53,
        "y": 12.5,
        "w": 1,
        "to": 17
      },
      {
        "id": "m62",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 57,
        "y": 12.5,
        "w": 1,
        "to": 17
      },
      {
        "id": "m63",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 121,
        "y": 6,
        "w": 1,
        "to": 21
      },
      {
        "id": "m64",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 127,
        "y": 6,
        "w": 1,
        "to": 21
      },
      {
        "id": "m65",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 142,
        "y": 4,
        "w": 1,
        "to": 21
      },
      {
        "id": "m66",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 148,
        "y": 4,
        "w": 1,
        "to": 21
      }
    ],
    "eau": [],
    "mobiles": [
      {
        "id": "c100",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 80,
        "y1": 17,
        "x2": 80,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c101",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 80,
        "y1": 13,
        "x2": 80,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c102",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 81,
        "y1": 17,
        "x2": 81,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c103",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 81,
        "y1": 13,
        "x2": 81,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c104",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 86,
        "y1": 17,
        "x2": 86,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c105",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 86,
        "y1": 13,
        "x2": 86,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c106",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 86,
        "y1": 9,
        "x2": 86,
        "y2": 9,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c107",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 87,
        "y1": 17,
        "x2": 87,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c108",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 87,
        "y1": 13,
        "x2": 87,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c109",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 87,
        "y1": 9,
        "x2": 87,
        "y2": 9,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c110",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 91,
        "y1": 17,
        "x2": 91,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c111",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 91,
        "y1": 13,
        "x2": 91,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c112",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 92,
        "y1": 17,
        "x2": 92,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c113",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 92,
        "y1": 13,
        "x2": 92,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c114",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 97,
        "y1": 17,
        "x2": 97,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c115",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 97,
        "y1": 13,
        "x2": 97,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c116",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 97,
        "y1": 9,
        "x2": 97,
        "y2": 9,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c117",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 98,
        "y1": 17,
        "x2": 98,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c118",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 98,
        "y1": 13,
        "x2": 98,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c119",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 98,
        "y1": 9,
        "x2": 98,
        "y2": 9,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c120",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 102,
        "y1": 17,
        "x2": 102,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c121",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 102,
        "y1": 13,
        "x2": 102,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c122",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 102,
        "y1": 9,
        "x2": 102,
        "y2": 9,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c123",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 103,
        "y1": 17,
        "x2": 103,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c124",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 103,
        "y1": 13,
        "x2": 103,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c125",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 103,
        "y1": 9,
        "x2": 103,
        "y2": 9,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c126",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 107,
        "y1": 17,
        "x2": 107,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c127",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 107,
        "y1": 13,
        "x2": 107,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "c128",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 108,
        "y1": 17,
        "x2": 108,
        "y2": 17,
        "w": 1,
        "empile": true,
        "inner": true
      },
      {
        "id": "c129",
        "sprite": "graslin_colonne_corinthienne",
        "kind": "colonne",
        "x1": 108,
        "y1": 13,
        "x2": 108,
        "y2": 13,
        "w": 1,
        "empile": true,
        "inner": false
      },
      {
        "id": "v49",
        "sprite": "pommeraye_lustre",
        "kind": "lustre",
        "x1": 122,
        "x2": 125,
        "y1": 8,
        "y2": 8,
        "w": 1.25,
        "rail": true,
        "periode_s": 3,
        "rail_y": 6
      },
      {
        "id": "v53",
        "sprite": "pommeraye_lustre",
        "kind": "lustre",
        "x1": 143,
        "x2": 146,
        "y1": 6,
        "y2": 6,
        "w": 1.25,
        "rail": true,
        "periode_s": 3,
        "rail_y": 4
      }
    ],
    "rails": [
      {
        "sprite": "chantiers_rails_tile_x",
        "x1": 122,
        "x2": 126.25,
        "y": 6
      },
      {
        "sprite": "chantiers_rails_tile_x",
        "x1": 143,
        "x2": 147.25,
        "y": 4
      }
    ],
    "dangers": [
      {
        "sprite": "graslin_obstacle_chaises",
        "x": 27,
        "y": 19,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "graslin_obstacle_chaises",
        "x": 32,
        "y": 19,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "graslin_obstacle_chaises",
        "x": 47,
        "y": 18,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "graslin_obstacle_chaises",
        "x": 58,
        "y": 16,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_1",
        "x": 76,
        "y": 14,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_1",
        "x": 152,
        "y": 5,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_1",
        "x": 155,
        "y": 5,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 78,
        "y": 17,
        "w": 2,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 82,
        "y": 17,
        "w": 4,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 88,
        "y": 17,
        "w": 4,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 94,
        "y": 17,
        "w": 4,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 100,
        "y": 17,
        "w": 3,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 105,
        "y": 17,
        "w": 2,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 109,
        "y": 17,
        "w": 2,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 122,
        "y": 20,
        "w": 5,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 131,
        "y": 20,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 136,
        "y": 20,
        "w": 2,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 141,
        "y": 20,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 143,
        "y": 20,
        "w": 5,
        "kind": "mortel"
      }
    ],
    "ennemis": [
      {
        "id": "e1",
        "sprite": "chateau_tonneau",
        "type": "roulant",
        "x1": 65,
        "x2": 72,
        "y": 14,
        "vitesse": 4,
        "direction": "gauche"
      },
      {
        "id": "e2",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 92,
        "x2": 101,
        "y": 4,
        "vitesse": 4
      },
      {
        "id": "e3",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 136,
        "x2": 141,
        "y": 4,
        "vitesse": 4
      }
    ],
    "pixels": [
      {
        "x": 16,
        "difficulte": "facile",
        "y": 16.25,
        "id": 1,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 23,
        "difficulte": "facile",
        "y": 12.25,
        "id": 2,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 30,
        "difficulte": "facile",
        "y": 16.25,
        "id": 3,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 35,
        "difficulte": "facile",
        "y": 12.25,
        "id": 4,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 49,
        "difficulte": "facile",
        "y": 11.25,
        "id": 5,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 55,
        "difficulte": "facile",
        "y": 10.25,
        "id": 6,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 64,
        "difficulte": "facile",
        "y": 9.25,
        "id": 7,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 71,
        "difficulte": "risque",
        "y": 13.25,
        "id": 8,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 81,
        "difficulte": "facile",
        "y": 5.5,
        "id": 9,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 86,
        "difficulte": "facile",
        "y": 3.25,
        "id": 10,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 91,
        "difficulte": "risque",
        "y": 2.75,
        "id": 11,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 97,
        "difficulte": "facile",
        "y": 4.5,
        "id": 12,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 107,
        "difficulte": "facile",
        "y": 8.25,
        "id": 13,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 123,
        "difficulte": "risque",
        "y": 19.25,
        "id": 14,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 129,
        "difficulte": "facile",
        "y": 6.25,
        "id": 15,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 133,
        "difficulte": "facile",
        "y": 6.25,
        "id": 16,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 139,
        "difficulte": "risque",
        "y": 4.25,
        "id": 17,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 144,
        "difficulte": "risque",
        "y": 19.25,
        "id": 18,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 153,
        "difficulte": "risque",
        "y": 4.25,
        "id": 19,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 172,
        "y": 7,
        "difficulte": "facile",
        "id": 20,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 173,
        "y": 6,
        "difficulte": "facile",
        "id": 21,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 174,
        "y": 7,
        "difficulte": "facile",
        "id": 22,
        "sprite": "commun_pixel",
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 36,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 77,
        "y": 14,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 114,
        "y": 7,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [],
    "decor": [
      {
        "sprite": "graslin_table_cafe",
        "x": 12,
        "y": 19,
        "layer": "back"
      },
      {
        "sprite": "graslin_lampadaire_ornemente",
        "x": 6,
        "y": 19,
        "layer": "back"
      },
      {
        "sprite": "graslin_muse_statue",
        "x": 113,
        "y": 7,
        "layer": "back"
      },
      {
        "sprite": "graslin_muse_statue",
        "x": 130,
        "y": 7,
        "layer": "back"
      },
      {
        "sprite": "graslin_muse_statue",
        "x": 140,
        "y": 5,
        "layer": "back"
      }
    ],
    "anneaux": [],
    "boosts": [
      {
        "sprite": "graslin_parasol_cafe",
        "x": 16,
        "y": 19,
        "w": 2,
        "hauteur": 4.5,
        "top": 18
      },
      {
        "sprite": "graslin_parasol_cafe",
        "x": 30,
        "y": 19,
        "w": 2,
        "hauteur": 4.5,
        "top": 18
      },
      {
        "sprite": "graslin_parasol_cafe",
        "x": 44,
        "y": 18,
        "w": 2,
        "hauteur": 4.5,
        "top": 17
      },
      {
        "sprite": "graslin_parasol_cafe",
        "x": 60,
        "y": 16,
        "w": 2,
        "hauteur": 4.5,
        "top": 15
      },
      {
        "sprite": "graslin_parasol_cafe",
        "x": 74,
        "y": 14,
        "w": 2,
        "hauteur": 4.5,
        "top": 13
      },
      {
        "sprite": "graslin_parasol_cafe",
        "x": 80,
        "y": 9,
        "w": 2,
        "hauteur": 4.5,
        "top": 8
      },
      {
        "sprite": "graslin_parasol_cafe",
        "x": 91,
        "y": 9,
        "w": 2,
        "hauteur": 4.5,
        "top": 8
      },
      {
        "sprite": "graslin_parasol_cafe",
        "x": 133,
        "y": 9,
        "w": 2,
        "hauteur": 4.5,
        "top": 8
      },
      {
        "sprite": "graslin_parasol_cafe",
        "x": 172,
        "y": 11,
        "w": 2,
        "hauteur": 4.5,
        "top": 10
      }
    ],
    "spawn": {
      "x": 1,
      "y": 19
    },
    "arrivee": {
      "monument": {
        "sprite": "graslin_monument_graslin",
        "x": 181,
        "y": 11
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 185,
        "y": 11
      },
      "declencheur": {
        "x": 186,
        "y": 11
      }
    },
    "spec": {
      "pixels": 22,
      "checkpoints": 3,
      "obstacles_mortels": 19,
      "boss": null
    },
    "zones": [
      {
        "n": 1,
        "nom": "Les Terrasses de Café de la Place Graslin",
        "x": [
          0,
          38
        ]
      },
      {
        "n": 2,
        "nom": "Le Grand Perron de 20 Marches",
        "x": [
          38,
          78
        ]
      },
      {
        "n": 3,
        "nom": "Les Huit Colonnes Corinthiennes",
        "x": [
          78,
          116
        ]
      },
      {
        "n": 4,
        "nom": "La Frise des Huit Muses & Les Lustres de Foyer",
        "x": [
          116,
          158
        ]
      },
      {
        "n": 5,
        "nom": "Le Fronton Néoclassique & Rideau Final",
        "x": [
          158,
          190
        ]
      }
    ],
    "pedagogie": [
      "Introduction sans risque (`x=15 à 22`) : Le `graslin_parasol_cafe` #1 est posé sur le pavé plat de la place devant un balcon de 6 tuiles de haut (inatteignable par un saut de 3 tuiles + accroche). Sauter dessus fait rebondir le joueur automatiquement à 4,5 tuiles de haut avec un bruit de toile tendue (« *boing* ») et une animation de pliage de la toile. Aucun trou ni ennemi autour.",
      "Test (`x=85 à 108` en Zone 3) : Les parasols #4 et #5 sont placés au-dessus du vide entre les colonnes corinthiennes : le joueur doit orienter sa trajectoire aérienne pendant le rebond de 4,5 tuiles pour atterrir sur le chapiteau suivant."
    ],
    "courbe_difficulte": [
      "Zones de respiration : Zone 1 (`x=0..25`, sol continu sous le premier parasol), paliers des checkpoints 2 (`x=76`) et 3 (`x=114`), et Zone 5 (bouquet final sur parasol sans danger).",
      "Pic de difficulté : Zone 4 (`x=122 à 148`), où il faut combiner le rebond de 4,5 tuiles d'un parasol, l'atterrissage au centre d'un lustre oscillant et l'esquive d'un oiseau au niveau des statues des Muses."
    ],
    "meteo": {
      "pluie": {
        "regle": "Toile des `graslin_parasol_cafe` alourdie par l'eau : rebond réduit de `4,5` à `3,8 tuiles` (mais permet d'utiliser l'accroche `↑` au sommet) ; pavés et marbre ont une friction `×0,75`.",
        "avantage": "Les `cierge_flamme` des lustres en Zone 4 sont éteints par l'humidité (atterrissage libre sur toute la largeur du lustre).",
        "inconvenient": "Pour monter de `y=14` à `y=8` en Zone 4 (`x=133`), il faut rebondir (`3,8 tuiles`) PUIS maintenir `↑` pour s'accrocher au socle de la Muse #3.",
        "annonce": "`goutte_pluie` rebondissant sur les parasols, reflets brillants sur le perron de Graslin."
      },
      "soleil": {
        "regle": "Toile sèche et tendue : rebond des parasols poussé à `5 tuiles` ; terrasses animées.",
        "avantage": "Tous les chapiteaux et socles de Muses sont atteints avec 1 tuile de marge au-dessus des rebords.",
        "inconvenient": "En Zone 3 (`x=85`), rebondir à 5 tuiles monte à hauteur du vol de l'`oiseau` (`y=8`) : il faut décaler son saut de 0,5 s.",
        "annonce": "`ciel_jour`, terrasses dorées, musique de violons et brouhaha joyeux de café."
      },
      "neige": {
        "regle": "Couche de neige sur les parasols : le 1er rebond sur chaque parasol secoue la neige et ne monte qu'à `2,5 tuiles`, le 2e rebond (toile dégagée) monte normalement à `4,5 tuiles`.",
        "avantage": "Les `tonneau` de la Zone 2 sont freinés par la neige sur les marches (`vitesse ×0,7`, soit 2,8 tuiles/s).",
        "inconvenient": "Oblige à faire un « double rebond » sur place sur chaque parasol avant de s'élancer vers la plateforme haute.",
        "annonce": "`flocon`, petits tas de neige qui volent quand on saute sur un parasol, valse d'hiver feutrée."
      },
      "brume": {
        "regle": "Visibilité réduite à 8 tuiles ; les `graslin_lampadaire_ornemente` et les `pommeraye_lustre` créent un halo de visibilité de 5 tuiles autour d'eux.",
        "avantage": "Les `oiseau` volent plus lentement (`×0,75`, soit 3 tuiles/s).",
        "inconvenient": "Le chapiteau cible en haut d'un rebond de parasol n'apparaît clairement qu'à mi-ascension (à moins d'être près d'un lampadaire).",
        "annonce": "Brouillard nocturne théâtral, halos jaunes chauds autour des lampadaires de la place."
      },
      "vent": {
        "regle": "Rafales latérales vers la gauche (`-0,8 tuile/s` en l'air pendant 2,5 s toutes les 5 s) ; les `pommeraye_lustre` de la Zone 4 oscillent sur `4 tuiles` au lieu de `3`.",
        "avantage": "Quand le lustre oscille à `4 tuiles`, il vient toucher quasiment le socle des Muses (écart réduit à `1 tuile` !).",
        "inconvenient": "Pendant un grand rebond de parasol (qui dure 1,1 s en l'air), sauter face à la rafale fait perdre ~0,9 tuile de portée horizontale.",
        "annonce": "Parasols qui vibrent, fanions du théâtre qui claquent, sifflement dans les colonnades."
      },
      "orage": {
        "regle": "Éclair toutes les 6 s : un projecteur / arc électrique parcourt les `graslin_lampadaire_ornemente` métalliques pendant 1 s après le tonnerre (les rendant électrifiés pendant 1 s).",
        "avantage": "Le souffle du tonnerre détruit les `tonneau` roulants actifs en Zone 2 !",
        "inconvenient": "En Zone 2, il ne faut pas rester immobile sur les 2 lampadaires (`x=49` et `x=64`) pendant la seconde qui suit un éclair.",
        "annonce": "`ciel_orage`, arcs bleutés sur les lampadaires après le flash, roulement de timbales + tonnerre."
      }
    },
    "image_a_reconstituer": [
      "1er détail révélé (pixels 1 à 8) : Les *Huit colonnes corinthiennes* monumentales et le grand perron de pierre.",
      "2e détail (pixels 9 à 15) : Les *Huit statues des Muses* alignées tout en haut de la façade au-dessus de l'entablement.",
      "3e détail (pixels 16 à 22) : L'hémicycle de la *Place Graslin*, ses lampadaires ouvragés et les terrasses Art nouveau de *La Cigale* en bordure."
    ],
    "boss": null,
    "sourceFile": "niveau_05_graslin.json",
    "sourceHash": "bbfc2cd81b2cf5c6658641fe2a752b504faf5ec77496eec58c0199214a5119b4"
  },
  {
    "format": "niveau/2",
    "tile": 16,
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche (y fractionnaire possible). Plateformes (type) : masse = bloc plein enraciné jusqu'au bas du niveau (sprite de dessus + remplissage, fill_to = arrêt du remplissage) ; pont = planches/tablier traversable par le bas ; colonne / galerie = éléments portés jusqu'au sol ; pad = surface de collision posée sur le sommet d'un décor (l'objet visuel est dans decor, lié par sur=id). Les autres objets (decor, dangers, signes, checkpoints, arrivee) sont ancrés bas-gauche de la cellule (x,y) et reposent sur une surface. layer 'inlay' = élément incrusté dans la maçonnerie. mecanique = comportement dynamique de la plateforme (cycle, bascule, rebond, etc.). Aucune zone de sprite ne se recouvre (vérifié) et chaque pixel est atteignable (vérifié).",
    "id": "niveau_06_machines_ile",
    "num": 6,
    "nom": "Les Machines de l'Île — Le Grand Éléphant",
    "difficulte": "6/12",
    "largeur": 210,
    "hauteur": 20,
    "sol_y": 18,
    "temps_ref_s": 110,
    "spawn": {
      "x": 3,
      "y": 17
    },
    "spec": {
      "boss": "Le Grand Éléphant mécanique",
      "pixels": 24,
      "checkpoints": 3,
      "obstacles_mortels": 30
    },
    "mecaniques": [
      "engrenages rotatifs",
      "bielles",
      "jets de vapeur",
      "boss à 3 phases"
    ],
    "fond": {
      "ciel": {
        "defaut": "ciel_jour",
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "machines_fond_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "type": "masse",
        "x": 0,
        "y": 18,
        "w": 38,
        "top_sprite": "machines_rail",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "top": "rail",
        "id": "p1"
      },
      {
        "type": "masse",
        "x": 14,
        "y": 17,
        "w": 4,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p2"
      },
      {
        "type": "pad",
        "id": "gear1",
        "x": 14,
        "y": 15,
        "w": 4,
        "solid": "top",
        "sur": "gear1",
        "mecanique": {
          "type": "rotation",
          "sens": "horaire",
          "vitesse_tuiles_s": 1.5
        }
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 14,
        "y": 16,
        "id": "gear1a"
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 16,
        "y": 16,
        "id": "gear1b"
      },
      {
        "type": "masse",
        "x": 20,
        "y": 14,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p6"
      },
      {
        "type": "masse",
        "x": 25,
        "y": 14,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p7"
      },
      {
        "type": "pont",
        "x": 21,
        "y": 14,
        "w": 4,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p8"
      },
      {
        "type": "masse",
        "x": 29,
        "y": 14,
        "w": 2,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p9"
      },
      {
        "type": "pad",
        "id": "gearp",
        "x": 29,
        "y": 13,
        "w": 2,
        "solid": "top",
        "sur": "gearp",
        "mecanique": {
          "type": "rotation",
          "sens": "anti-horaire",
          "vitesse_tuiles_s": 1.5
        }
      },
      {
        "type": "masse",
        "x": 33,
        "y": 12,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p11"
      },
      {
        "type": "masse",
        "x": 37,
        "y": 12,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p12"
      },
      {
        "type": "pont",
        "x": 34,
        "y": 12,
        "w": 3,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p13"
      },
      {
        "type": "masse",
        "x": 38,
        "y": 19,
        "w": 108,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p14"
      },
      {
        "type": "masse",
        "x": 40,
        "y": 14,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p15"
      },
      {
        "type": "masse",
        "x": 46,
        "y": 14,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p16"
      },
      {
        "type": "pad",
        "id": "tuyau1",
        "x": 40,
        "y": 13,
        "w": 8,
        "solid": "top",
        "sur": "tuyau1"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 40,
        "y": 13,
        "id": "p18"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 42,
        "y": 13,
        "id": "p19"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 44,
        "y": 13,
        "id": "p20"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 46,
        "y": 13,
        "id": "p21"
      },
      {
        "type": "masse",
        "x": 50,
        "y": 14,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p22"
      },
      {
        "type": "masse",
        "x": 57,
        "y": 14,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p23"
      },
      {
        "type": "pad",
        "id": "bielle1",
        "x": 50,
        "y": 13.25,
        "w": 2,
        "solid": "top",
        "sur": "bielle1",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "x",
          "course_tuiles": 3,
          "vitesse_tuiles_s": 2,
          "guide": "rail entre deux pylônes"
        }
      },
      {
        "type": "masse",
        "x": 58,
        "y": 12,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p25"
      },
      {
        "type": "masse",
        "x": 66,
        "y": 12,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p26"
      },
      {
        "type": "pad",
        "id": "tuyau2",
        "x": 58,
        "y": 11,
        "w": 10,
        "solid": "top",
        "sur": "tuyau2"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 58,
        "y": 11,
        "id": "p28"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 60,
        "y": 11,
        "id": "p29"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 62,
        "y": 11,
        "id": "p30"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 64,
        "y": 11,
        "id": "p31"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 66,
        "y": 11,
        "id": "p32"
      },
      {
        "type": "masse",
        "x": 70,
        "y": 12,
        "w": 4,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p33"
      },
      {
        "type": "pad",
        "id": "gear2",
        "x": 70,
        "y": 10,
        "w": 4,
        "solid": "top",
        "sur": "gear2",
        "mecanique": {
          "type": "rotation",
          "sens": "horaire",
          "vitesse_tuiles_s": 1.5
        }
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 70,
        "y": 11,
        "id": "gear2a"
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 72,
        "y": 11,
        "id": "gear2b"
      },
      {
        "type": "masse",
        "x": 76,
        "y": 9,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p37"
      },
      {
        "type": "masse",
        "x": 79,
        "y": 9,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p38"
      },
      {
        "type": "pont",
        "x": 77,
        "y": 9,
        "w": 2,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p39"
      },
      {
        "type": "masse",
        "x": 82,
        "y": 12,
        "w": 4,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p40"
      },
      {
        "type": "pad",
        "id": "gear3",
        "x": 82,
        "y": 10,
        "w": 4,
        "solid": "top",
        "sur": "gear3",
        "mecanique": {
          "type": "rotation",
          "sens": "horaire",
          "vitesse_tuiles_s": 1.5
        }
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 82,
        "y": 11,
        "id": "gear3a"
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 84,
        "y": 11,
        "id": "gear3b"
      },
      {
        "type": "masse",
        "x": 88,
        "y": 7,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p44"
      },
      {
        "type": "masse",
        "x": 91,
        "y": 7,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p45"
      },
      {
        "type": "pad",
        "id": "piston",
        "x": 89,
        "y": 8,
        "w": 2,
        "solid": "top",
        "sur": "piston",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "y",
          "y_bas": 12,
          "y_haut": 8,
          "periode_s": 3
        }
      },
      {
        "type": "masse",
        "x": 95,
        "y": 10,
        "w": 4,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p47"
      },
      {
        "type": "pad",
        "id": "gear4",
        "x": 95,
        "y": 8,
        "w": 4,
        "solid": "top",
        "sur": "gear4",
        "mecanique": {
          "type": "rotation",
          "sens": "anti-horaire",
          "vitesse_tuiles_s": 1.5
        }
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 95,
        "y": 9,
        "id": "gear4a"
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 97,
        "y": 9,
        "id": "gear4b"
      },
      {
        "type": "masse",
        "x": 102,
        "y": 8,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p51"
      },
      {
        "type": "masse",
        "x": 106,
        "y": 8,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p52"
      },
      {
        "type": "pont",
        "x": 103,
        "y": 8,
        "w": 3,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p53"
      },
      {
        "type": "pad",
        "id": "diag",
        "x": 112,
        "y": 8,
        "w": 2,
        "solid": "top",
        "sur": "diag",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "diagonale",
          "de": [
            108,
            11
          ],
          "vers": [
            113,
            8
          ],
          "periode_s": 3
        }
      },
      {
        "type": "masse",
        "x": 116,
        "y": 8,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p55"
      },
      {
        "type": "masse",
        "x": 119,
        "y": 8,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p56"
      },
      {
        "type": "pont",
        "x": 117,
        "y": 8,
        "w": 2,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p57"
      },
      {
        "type": "masse",
        "x": 120,
        "y": 10,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p58"
      },
      {
        "type": "masse",
        "x": 127,
        "y": 10,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p59"
      },
      {
        "type": "pont",
        "x": 121,
        "y": 10,
        "w": 6,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p60"
      },
      {
        "type": "masse",
        "x": 131,
        "y": 13,
        "w": 2,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p61"
      },
      {
        "type": "pad",
        "id": "gearp2",
        "x": 131,
        "y": 12,
        "w": 2,
        "solid": "top",
        "sur": "gearp2",
        "mecanique": {
          "type": "rotation",
          "sens": "horaire",
          "vitesse_tuiles_s": 1.5
        }
      },
      {
        "type": "masse",
        "x": 136,
        "y": 15,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p63"
      },
      {
        "type": "masse",
        "x": 142,
        "y": 15,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p64"
      },
      {
        "type": "pad",
        "id": "tuyau3",
        "x": 136,
        "y": 14,
        "w": 8,
        "solid": "top",
        "sur": "tuyau3"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 136,
        "y": 14,
        "id": "p66"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 138,
        "y": 14,
        "id": "p67"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 140,
        "y": 14,
        "id": "p68"
      },
      {
        "sprite": "machines_tuyau_cuivre",
        "x": 142,
        "y": 14,
        "id": "p69"
      },
      {
        "type": "masse",
        "x": 146,
        "y": 16,
        "w": 14,
        "top_sprite": "machines_rail",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "top": "rail",
        "id": "p70"
      },
      {
        "type": "masse",
        "x": 160,
        "y": 16,
        "w": 50,
        "top_sprite": "machines_rail",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "top": "rail",
        "id": "p71"
      },
      {
        "type": "masse",
        "x": 164,
        "y": 13,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p72"
      },
      {
        "type": "masse",
        "x": 169,
        "y": 13,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p73"
      },
      {
        "type": "pont",
        "x": 165,
        "y": 13,
        "w": 4,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p74"
      },
      {
        "type": "masse",
        "x": 170,
        "y": 10,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p75"
      },
      {
        "type": "masse",
        "x": 166,
        "y": 10,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "fill_to": 13,
        "id": "p76"
      },
      {
        "type": "pont",
        "x": 167,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p77"
      },
      {
        "type": "masse",
        "x": 178,
        "y": 14,
        "w": 4,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p78"
      },
      {
        "type": "pad",
        "id": "gear5",
        "x": 178,
        "y": 12,
        "w": 4,
        "solid": "top",
        "sur": "gear5",
        "mecanique": {
          "type": "rotation",
          "sens": "horaire",
          "vitesse_tuiles_s": 2.5
        }
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 178,
        "y": 13,
        "id": "gear5a"
      },
      {
        "sprite": "machines_engrenage_grand",
        "x": 180,
        "y": 13,
        "id": "gear5b"
      },
      {
        "type": "masse",
        "x": 188,
        "y": 13,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p82"
      },
      {
        "type": "masse",
        "x": 193,
        "y": 13,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p83"
      },
      {
        "type": "pont",
        "x": 189,
        "y": 13,
        "w": 4,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p84"
      },
      {
        "type": "masse",
        "x": 194,
        "y": 10,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p85"
      },
      {
        "type": "masse",
        "x": 199,
        "y": 10,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p86"
      },
      {
        "type": "pont",
        "x": 195,
        "y": 10,
        "w": 4,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p87"
      },
      {
        "type": "masse",
        "x": 202,
        "y": 8,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p88"
      },
      {
        "type": "masse",
        "x": 206,
        "y": 8,
        "w": 1,
        "top_sprite": "machines_sol_haut_1",
        "fill_sprite": "machines_sol_plein",
        "grab": true,
        "id": "p89"
      },
      {
        "type": "pont",
        "x": 203,
        "y": 8,
        "w": 3,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ],
        "id": "p90"
      }
    ],
    "dangers": [
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 28,
        "y": 17,
        "kind": "mortel"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 38,
        "y": 18,
        "kind": "mortel",
        "w": 2,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 41,
        "y": 18,
        "kind": "mortel",
        "w": 5,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 47,
        "y": 18,
        "kind": "mortel",
        "w": 3,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 51,
        "y": 18,
        "kind": "mortel",
        "w": 6,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 59,
        "y": 18,
        "kind": "mortel",
        "w": 7,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 67,
        "y": 18,
        "kind": "mortel",
        "w": 3,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 74,
        "y": 18,
        "kind": "mortel",
        "w": 2,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 77,
        "y": 18,
        "kind": "mortel",
        "w": 2,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 80,
        "y": 18,
        "kind": "mortel",
        "w": 2,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 86,
        "y": 18,
        "kind": "mortel",
        "w": 2,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 89,
        "y": 18,
        "kind": "mortel",
        "w": 2,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 92,
        "y": 18,
        "kind": "mortel",
        "w": 3,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 99,
        "y": 18,
        "kind": "mortel",
        "w": 3,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 103,
        "y": 18,
        "kind": "mortel",
        "w": 3,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 107,
        "y": 18,
        "kind": "mortel",
        "w": 9,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 117,
        "y": 18,
        "kind": "mortel",
        "w": 2,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 121,
        "y": 18,
        "kind": "mortel",
        "w": 6,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 128,
        "y": 18,
        "kind": "mortel",
        "w": 3,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 133,
        "y": 18,
        "kind": "mortel",
        "w": 3,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 137,
        "y": 18,
        "kind": "mortel",
        "w": 5,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 143,
        "y": 18,
        "kind": "mortel",
        "w": 3,
        "note": "fosse aux mécanismes"
      },
      {
        "sprite": "vapeur",
        "x": 44,
        "y": 12,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "actif_s": 1.2,
          "preavis_s": 0.6,
          "hauteur_tuiles": 3
        }
      },
      {
        "sprite": "vapeur",
        "x": 61,
        "y": 10,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "actif_s": 1.2,
          "preavis_s": 0.6,
          "hauteur_tuiles": 3
        }
      },
      {
        "sprite": "vapeur",
        "x": 66,
        "y": 10,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "actif_s": 1.2,
          "preavis_s": 0.6,
          "portee_tuiles": 2,
          "direction": "gauche",
          "note": "accroupi pour passer"
        }
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 104,
        "y": 7,
        "kind": "mortel"
      },
      {
        "sprite": "vapeur",
        "x": 118,
        "y": 7,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "actif_s": 1.2,
          "preavis_s": 0.6,
          "hauteur_tuiles": 3
        }
      },
      {
        "sprite": "vapeur",
        "x": 124,
        "y": 9,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "actif_s": 1.2,
          "preavis_s": 0.6,
          "hauteur_tuiles": 3
        }
      },
      {
        "sprite": "vapeur",
        "x": 139,
        "y": 13,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "actif_s": 1.2,
          "preavis_s": 0.6,
          "hauteur_tuiles": 3
        }
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 142,
        "y": 13,
        "kind": "mortel"
      }
    ],
    "ennemis": [
      {
        "id": "fourmi_z2",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 58,
        "x2": 66,
        "y": 10,
        "vitesse": 2.5,
        "note": "mini animal mécanique : sprite provisoire (oiseau)"
      },
      {
        "id": "heron_z3",
        "sprite": "ciel_oiseau",
        "type": "patrouille_verticale",
        "x": 100,
        "y1": 6,
        "y2": 10,
        "y": 6,
        "vitesse": 2
      },
      {
        "id": "fourmi_z4",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 120,
        "x2": 127,
        "y": 9,
        "vitesse": 3,
        "note": "sprite provisoire"
      }
    ],
    "pixels": [
      {
        "sprite": "commun_pixel",
        "x": 16,
        "y": 13,
        "difficulte": "facile",
        "id": 1,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 23,
        "y": 12,
        "difficulte": "facile",
        "id": 2,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 28,
        "y": 15,
        "difficulte": "facile",
        "id": 3,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 29,
        "y": 11,
        "difficulte": "facile",
        "id": 4,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 44,
        "y": 10,
        "difficulte": "facile",
        "id": 5,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 52,
        "y": 11,
        "difficulte": "facile",
        "id": 6,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 63,
        "y": 9,
        "difficulte": "facile",
        "id": 7,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 72,
        "y": 8,
        "difficulte": "facile",
        "id": 8,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 76,
        "y": 7,
        "difficulte": "facile",
        "id": 9,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 84,
        "y": 8,
        "difficulte": "facile",
        "id": 10,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 89,
        "y": 6,
        "difficulte": "facile",
        "id": 11,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 97,
        "y": 6,
        "difficulte": "facile",
        "id": 12,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 104,
        "y": 5,
        "difficulte": "facile",
        "id": 13,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 112,
        "y": 6,
        "difficulte": "facile",
        "id": 14,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 124,
        "y": 7,
        "difficulte": "facile",
        "id": 15,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 131,
        "y": 10,
        "difficulte": "facile",
        "id": 16,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 139,
        "y": 11,
        "difficulte": "facile",
        "id": 17,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 143,
        "y": 11,
        "difficulte": "facile",
        "id": 18,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 152,
        "y": 15,
        "difficulte": "facile",
        "id": 19,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 168,
        "y": 8,
        "difficulte": "facile",
        "id": 20,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 180,
        "y": 10,
        "difficulte": "facile",
        "id": 21,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 191,
        "y": 11,
        "difficulte": "facile",
        "id": 22,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 197,
        "y": 8,
        "difficulte": "facile",
        "id": 23,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 205,
        "y": 6,
        "difficulte": "facile",
        "id": 24,
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 36,
        "y": 11,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 78,
        "y": 8,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 158,
        "y": 15,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_fleches",
        "x": 10,
        "y": 17,
        "texte": "Les engrenages te font avancer : monte dessus."
      },
      {
        "sprite": "signes_panneau_saut",
        "x": 155,
        "y": 15,
        "texte": "Arène du Grand Éléphant : touche les trois valves."
      }
    ],
    "valves": [
      {
        "id": "valve1",
        "sprite": "commun_lanterne_eteinte",
        "x": 168,
        "y": 9,
        "sprite_on": "commun_lanterne_allumee",
        "note": "valve (sprite provisoire : lanterne)"
      },
      {
        "id": "valve2",
        "sprite": "commun_lanterne_eteinte",
        "x": 191,
        "y": 12,
        "sprite_on": "commun_lanterne_allumee",
        "note": "valve (sprite provisoire : lanterne)"
      },
      {
        "id": "valve3",
        "sprite": "commun_lanterne_eteinte",
        "x": 203,
        "y": 7,
        "sprite_on": "commun_lanterne_allumee",
        "note": "valve (sprite provisoire : lanterne)"
      }
    ],
    "decor": [
      {
        "sprite": "machines_charpente_module",
        "x": 2,
        "y": 17
      },
      {
        "sprite": "machines_charpente_module",
        "x": 5,
        "y": 17
      },
      {
        "sprite": "machines_charpente_module",
        "x": 8,
        "y": 17
      },
      {
        "sprite": "machines_animal_mecanique",
        "x": 172,
        "y": 15,
        "id": "boss_elephant",
        "note": "BOSS : Le Grand Éléphant"
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "machines_monument_machines",
        "x": 203,
        "y": 15
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 207,
        "y": 15
      },
      "declencheur": {
        "x": 208,
        "y": 15
      },
      "note": "arche déverrouillée quand la valve 3 est touchée"
    },
    "boss": {
      "id": "boss_elephant",
      "nom": "Le Grand Éléphant mécanique",
      "niveau": 6,
      "statut": "SPÉCIFICATION — non implémenté dans le moteur (aucun système de boss) ; à confirmer côté moteur",
      "principe": "Le boss ne se frappe pas. Il enchaîne 3 phases d'attaques à motifs lisibles ; à la fin de chaque phase, une valve (lanterne provisoire) s'active. La toucher calme l'Éléphant et déclenche la phase suivante 2 s plus tard. La 3e valve déverrouille l'arche.",
      "rendu": {
        "sprite": "machines_animal_mecanique",
        "taille_px": [
          80,
          64
        ],
        "position": {
          "x": 172,
          "y": 15,
          "ancrage": "bas-gauche",
          "couche": "back2"
        },
        "collision": "aucune : décor d'arrière-plan, jamais mortel au contact ; seuls ses effets (zones ci-dessous) blessent",
        "animations_provisoires": "pas avant/arrière = décalage de ±2 tuiles du sprite (x 170 à 172) ; sprites manquants à fournir : trompe levée, pied levé, jet de vapeur 2 tuiles, valve"
      },
      "arene": {
        "x": [
          160,
          210
        ],
        "sol_y": 16,
        "plateformes": {
          "sol": "p71 (160 à 210, y=16)",
          "bloc_engrenage": "p78 (178 à 182, y=14) + engrenage central gear5 (surface y=12)",
          "gauche": [
            "pont 165 à 169 y=13",
            "pont 167 à 170 y=10"
          ],
          "droite": [
            "pont 189 à 193 y=13",
            "pont 195 à 199 y=10",
            "pont 203 à 206 y=8"
          ]
        },
        "refuges": {
          "au_dessus_du_sol": "engrenage central (y=12) : hors de portée des ondes et balayages au sol",
          "en_hauteur": "ponts y=13 / y=10 : hors de portée des jets et ondes du sol"
        }
      },
      "regles": {
        "checkpoint_entree": "x=158 (lanterne existante)",
        "reprise": "mort = retour à la dernière valve allumée (valve 1 pour la phase 2, etc.), à x=158 pour la phase 1 ; la phase recommence au début",
        "telegraphe_min_s": 0.6,
        "pas_de_chrono": "la valve reste active sans limite de temps : le joueur choisit quand traverser l'arène",
        "ennemi_au_contact": "aucun",
        "pixels_arene": [
          [
            180,
            10
          ],
          [
            191,
            11
          ],
          [
            197,
            8
          ],
          [
            205,
            6
          ]
        ]
      },
      "phases": [
        {
          "n": 1,
          "nom": "Le Balayage de Vapeur",
          "duree_attaques_s": 13,
          "valve": {
            "id": "valve1",
            "x": 168,
            "y": 9,
            "acces": "sol → pont y=13 (3 tuiles) → pont y=10 (3 tuiles)"
          },
          "attaques": [
            {
              "t": [
                0,
                2
              ],
              "type": "pas_avant",
              "degats": false
            },
            {
              "t": [
                2,
                3
              ],
              "type": "telegraphe",
              "note": "trompe levée, sifflement 1 s, lueur orange aux 3 points d'éruption",
              "degats": false
            },
            {
              "id": "jet1",
              "t_alerte": [
                2.4,
                3
              ],
              "t": [
                3,
                4
              ],
              "type": "jet_vertical",
              "zone": {
                "x": 162,
                "y": 13,
                "w": 2,
                "h": 3
              },
              "esquive": "se placer entre jets (x 164 à 166, 3 tuiles libres) ou sur le pont y=13 (sommet du jet = surface du pont)"
            },
            {
              "id": "jet2",
              "t_alerte": [
                3.9,
                4.5
              ],
              "t": [
                4.5,
                5.5
              ],
              "type": "jet_vertical",
              "zone": {
                "x": 167,
                "y": 13,
                "w": 2,
                "h": 3
              },
              "esquive": "pont y=13 : le jet s'arrête à sa surface ; ou sol x 170 à 171"
            },
            {
              "id": "jet3",
              "t_alerte": [
                5.4,
                6
              ],
              "t": [
                6,
                7
              ],
              "type": "jet_vertical",
              "zone": {
                "x": 185,
                "y": 13,
                "w": 2,
                "h": 3
              },
              "esquive": "sol à x 183 ou 188, ou pont y=13 x 189 à 193"
            },
            {
              "t": [
                7,
                9
              ],
              "type": "recule",
              "degats": false
            },
            {
              "id": "onde1",
              "t_alerte": [
                9,
                9.6
              ],
              "t": [
                9.6,
                11.4
              ],
              "type": "onde_de_choc_sol",
              "depart_x": 171,
              "fin_x": 160,
              "sens": "gauche",
              "vitesse_tuiles_s": 6,
              "zone": {
                "y": 15.25,
                "h": 0.75,
                "largeur_tuiles": 1
              },
              "esquive": "sauter ; engrenage central ; ponts"
            },
            {
              "t": [
                11.4,
                13
              ],
              "type": "fin_de_cycle",
              "degats": false
            }
          ],
          "repit_s": 4,
          "repit": "l'Éléphant souffle : aucune zone dangereuse ; la valve 1 clignote"
        },
        {
          "n": 2,
          "nom": "La Purge de Vapeur Brûlante",
          "duree_attaques_s": 13,
          "valve": {
            "id": "valve2",
            "x": 191,
            "y": 12,
            "acces": "sol → pont y=13 x 189 à 193 (3 tuiles)"
          },
          "attaques": [
            {
              "id": "salve_sol",
              "t_alerte": [
                1,
                1.8
              ],
              "t": [
                1.8,
                3
              ],
              "type": "salve_horizontale",
              "zone": {
                "x": 172,
                "y": 14,
                "w": 38,
                "h": 1.3125
              },
              "passage_libre_px": 11,
              "esquive": "s'accroupir (boîte 8×10 sous une bande qui s'arrête à 11 px du sol) ; ou monter sur l'engrenage central (y=12) ou sur un pont"
            },
            {
              "id": "salve_pont13",
              "t_alerte": [
                2.5,
                3.3
              ],
              "t": [
                3.3,
                4.5
              ],
              "type": "salve_horizontale",
              "zone": {
                "x": 160,
                "y": 11,
                "w": 50,
                "h": 1.3125
              },
              "passage_libre_px": 11,
              "esquive": "s'accroupir sur le pont y=13 ; ou rester au sol"
            },
            {
              "id": "salve_pont10",
              "t_alerte": [
                4,
                4.8
              ],
              "t": [
                4.8,
                6
              ],
              "type": "salve_horizontale",
              "zone": {
                "x": 160,
                "y": 8,
                "w": 50,
                "h": 1.3125
              },
              "passage_libre_px": 11,
              "esquive": "s'accroupir sur le pont y=10 ; ou rester plus bas"
            },
            {
              "t": [
                6,
                9
              ],
              "type": "pause",
              "degats": false
            },
            {
              "id": "pas1",
              "t_alerte": [
                9,
                9.5
              ],
              "t": [
                9.5,
                11.3
              ],
              "type": "onde_de_choc_sol",
              "depart_x": 171,
              "fin_x": 160,
              "sens": "gauche",
              "vitesse_tuiles_s": 6,
              "zone": {
                "y": 15.25,
                "h": 0.75,
                "largeur_tuiles": 1
              }
            },
            {
              "id": "pas2",
              "t_alerte": [
                11,
                11.5
              ],
              "t": [
                11.5,
                13.3
              ],
              "type": "onde_de_choc_sol",
              "depart_x": 171,
              "fin_x": 160,
              "sens": "gauche",
              "vitesse_tuiles_s": 6,
              "zone": {
                "y": 15.25,
                "h": 0.75,
                "largeur_tuiles": 1
              }
            }
          ],
          "repit_s": 4,
          "repit": "la valve 2 clignote ; pas d'attaque"
        },
        {
          "n": 3,
          "nom": "L'Emballement Final",
          "duree_attaques_s": 12,
          "valve": {
            "id": "valve3",
            "x": 203,
            "y": 7,
            "acces": "sol → pont 189 y=13 → pont 195 y=10 (écart 1 tuile) → pont 203 y=8 (écart 3 tuiles, hauteur +2) ; accroche ↑ sur le bloc x=202"
          },
          "attaques": [
            {
              "id": "balai1",
              "t_alerte": [
                0,
                0.6
              ],
              "t": [
                0.6,
                2
              ],
              "type": "balayage_trompe",
              "depart_x": 171,
              "fin_x": 161,
              "sens": "gauche",
              "vitesse_tuiles_s": 7,
              "zone": {
                "y": 15,
                "h": 1,
                "largeur_tuiles": 2
              },
              "esquive": "sauter ; engrenage central ; ponts"
            },
            {
              "id": "balai2",
              "t_alerte": [
                1.5,
                2.1
              ],
              "t": [
                2.1,
                3.5
              ],
              "type": "balayage_trompe",
              "depart_x": 171,
              "fin_x": 161,
              "sens": "gauche",
              "vitesse_tuiles_s": 7,
              "zone": {
                "y": 15,
                "h": 1,
                "largeur_tuiles": 2
              }
            },
            {
              "id": "balai3",
              "t_alerte": [
                3,
                3.6
              ],
              "t": [
                3.6,
                5
              ],
              "type": "balayage_trompe",
              "depart_x": 171,
              "fin_x": 161,
              "sens": "gauche",
              "vitesse_tuiles_s": 7,
              "zone": {
                "y": 15,
                "h": 1,
                "largeur_tuiles": 2
              }
            },
            {
              "id": "animal1",
              "t": [
                5,
                12
              ],
              "type": "ennemi_sol",
              "sprite": "machines_animal_mecanique (provisoire : ciel_oiseau)",
              "x1": 160,
              "x2": 170,
              "y": 15,
              "vitesse_tuiles_s": 3,
              "note": "saut simple"
            },
            {
              "id": "animal2",
              "t": [
                5,
                12
              ],
              "type": "ennemi_sol",
              "x1": 184,
              "x2": 200,
              "y": 15,
              "vitesse_tuiles_s": 3,
              "note": "saut simple ; ou passer par les ponts"
            }
          ],
          "engrenage_central": {
            "vitesse_tuiles_s": 2.5,
            "role": "refuge au-dessus du sol (y=12) et voie rapide vers la droite ; sa sortie vers le pont x=189 n'est PAS obligatoire (écart 7 tuiles, hors saut avec entraînement)"
          },
          "objectif": "toucher la valve 3 : fin du boss, arche déverrouillée"
        }
      ],
      "verification_physique": {
        "saut_apex_px": 53.9,
        "saut_apex_tuiles": 3.37,
        "temps_air_s": 0.674,
        "portee_plat_tuiles": 4.63,
        "temps_au_dessus_12px_s": 0.594,
        "temps_au_dessus_16px_s": 0.564,
        "temps_au_dessus_32px_s": 0.43,
        "onde_de_choc": {
          "haut_px": 12,
          "largeur_tuiles": 1,
          "vitesse_tuiles_s": 6,
          "temps_de_passage_s": 0.25,
          "marge_s": 0.344,
          "ok": true
        },
        "balayage_trompe": {
          "haut_px": 16,
          "largeur_tuiles": 2,
          "vitesse_tuiles_s": 7,
          "temps_de_passage_s": 0.357,
          "marge_s": 0.207,
          "ok": true
        },
        "salve_horizontale": {
          "passage_libre_px": 11,
          "boite_accroupie_px": 10,
          "boite_debout_px": 16,
          "ok_accroupi": true,
          "bloque_debout": true
        },
        "jets": {
          "note": "2 tuiles de large, 3 de haut ; espace libre entre jets ≥ 3 tuiles ; surface des ponts = sommet des jets"
        },
        "accroche": "valve 1 : écart pont→pont 3 tuiles (3,37 possibles) : OK avec l'accroche ↑ si besoin",
        "a_valider_en_jeu": [
          "marge du balayage (0,21 s) et de l'onde (0,34 s) : à confirmer avec la physique réelle",
          "lisibilité des télégraphes (0,6 s)"
        ]
      },
      "meteo": {
        "pluie": "engrenage central -> friction sol 0,75 (moteur : accélération au sol 650) ; salves de vapeur 1,2 s -> 0,8 s (md N6 : jets 0,8 s)",
        "soleil": "engrenage central 2,5 -> 3,1 tuiles/s",
        "neige": "plaque glissante 3 s après chaque onde de choc (sol), engrenages et bielles -25 % ; refuge : ponts secs",
        "brume": "télégraphes passent de 0,6 s à 1,0 s ; visibilité 8 tuiles",
        "vent": "+0,7 tuile/s vers la droite en l'air (moteur : airPush max 110 px/s ≈ 6,9 tuiles/s plafonné) : sauts vers la droite plus longs, vers la gauche plus courts ; ondes à sauter toujours à gauche",
        "orage": "éclair toutes les 6 s : engrenage central inversé 2 s (-2,5 tuiles/s), flash jaune 0,5 s avant ; aucun flash blanc plein écran (accessibilité)"
      },
      "sprites_manquants": [
        "machines_animal_mecanique : frames pas avant, trompe levée, pied levé",
        "machines_vapeur_jet 32×48",
        "machines_valve 16×24 (provisoire : lanterne)",
        "machines_onde_choc 16×12"
      ]
    },
    "zones": [
      {
        "n": 1,
        "nom": "Le Parvis des Nefs",
        "x": [
          0,
          38
        ]
      },
      {
        "n": 2,
        "nom": "La Galerie des Tuyaux",
        "x": [
          38,
          80
        ]
      },
      {
        "n": 3,
        "nom": "L'Horlogerie Géante",
        "x": [
          80,
          120
        ]
      },
      {
        "n": 4,
        "nom": "La Passerelle d'Embarquement",
        "x": [
          120,
          160
        ]
      },
      {
        "n": 5,
        "nom": "Arène du Grand Éléphant",
        "x": [
          160,
          210
        ]
      }
    ],
    "pedagogie": [
      {
        "x": [
          14,
          18
        ],
        "texte": "Premier engrenage sur sol continu : sentir la vitesse modifiée."
      },
      {
        "x": [
          82,
          115
        ],
        "texte": "Engrenage → bielle verticale → engrenage anti-horaire au-dessus du vide."
      }
    ],
    "meteo": {
      "pluie": {
        "friction": 0.75,
        "vapeur_actif_s": 0.8,
        "note": "friction passerelles/tuyaux ×0,75 ; jets de vapeur raccourcis (1,2→0,8 s)"
      },
      "soleil": {
        "engrenage_vitesse_mult": 1.25,
        "note": "engrenages +25 % (1,5→1,9 tuile/s) ; engrenage anti-horaire x=95 : courir sans s'arrêter"
      },
      "neige": {
        "bielles_et_automates_vitesse_mult": 0.75,
        "plaque_glissante_s": 3,
        "plaque_friction": 0.7,
        "note": "bielles −25 % ; sol glissant 3 s après le jet de trompe du boss"
      },
      "brume": {
        "visibilite_tuiles": 8,
        "preavis_vapeur_s": 1,
        "note": "préavis sonore des jets 0,6→1,0 s ; visibilité 8 tuiles"
      },
      "vent": {
        "poussee_tuiles_s": 0.7,
        "panache_devie_tuiles": 1,
        "note": "+0,7 tuile/s vers la droite en l'air ; panache vertical incliné vers la droite"
      },
      "orage": {
        "eclair_periode_s": 6,
        "inversion_engrenages_s": 2,
        "flash_jaune_s": 0.5,
        "note": "éclair toutes les 6 s ; engrenages inversés 2 s"
      },
      "a_confirmer_moteur": "Clés météo non vérifiées côté moteur (moteur absent du projet)."
    },
    "image_a_reconstituer": [
      {
        "pixels": [
          1,
          8
        ],
        "detail": "Tête, défenses blanches et trompe articulée du Grand Éléphant"
      },
      {
        "pixels": [
          9,
          16
        ],
        "detail": "Corps massif, vérins hydrauliques et kiosque à passagers"
      },
      {
        "pixels": [
          17,
          24
        ],
        "detail": "Voûtes métalliques des Nefs des Chantiers"
      }
    ],
    "notes": [
      "Engrenages posés sur des pylônes d'acier ; passerelles portées par deux pylônes ; tuyaux sur pylônes ; fosse piégée par des dents d'engrenage.",
      "Sprites manquants : valves (lanterne provisoire) et mini animaux mécaniques (oiseau provisoire)."
    ],
    "sourceFile": "niveau_06_machines_ile.json",
    "sourceHash": "8d30e47152e59752243bc0fbfb6b3c793591cd26d8a7e0d55a7db2a886f92f35"
  },
  {
    "format": "niveau/2",
    "tile": 16,
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche (y fractionnaire possible). Plateformes (type) : masse = bloc plein enraciné jusqu'au bas du niveau (sprite de dessus + remplissage, fill_to = arrêt du remplissage) ; pont = planches/tablier traversable par le bas ; colonne / galerie = éléments portés jusqu'au sol ; pad = surface de collision posée sur le sommet d'un décor (l'objet visuel est dans decor, lié par sur=id). Les autres objets (decor, dangers, signes, checkpoints, arrivee) sont ancrés bas-gauche de la cellule (x,y) et reposent sur une surface. layer 'inlay' = élément incrusté dans la maçonnerie. mecanique = comportement dynamique de la plateforme (cycle, bascule, rebond, etc.). Aucune zone de sprite ne se recouvre (vérifié) et chaque pixel est atteignable (vérifié).",
    "id": "niveau_07_chantiers_navals",
    "num": 7,
    "nom": "Les Chantiers Navals — Grue Titan & Cales de Lancement",
    "difficulte": "7/12",
    "largeur": 220,
    "hauteur": 22,
    "sol_y": 17,
    "temps_ref_s": 105,
    "spawn": {
      "x": 3,
      "y": 16
    },
    "spec": {
      "boss": null,
      "pixels": 24,
      "checkpoints": 3,
      "obstacles_mortels": 12
    },
    "mecaniques": [
      "chariots de grue déclenchés au poids",
      "cales inclinées",
      "ascenseur de grue"
    ],
    "fond": {
      "ciel": {
        "defaut": "ciel_jour",
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "chantiers_fond_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "type": "masse",
        "x": 0,
        "y": 17,
        "w": 16,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p1"
      },
      {
        "type": "masse",
        "x": 16,
        "y": 19,
        "w": 10,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "note": "fosse sèche non mortelle",
        "id": "p2"
      },
      {
        "type": "masse",
        "x": 26,
        "y": 17,
        "w": 16,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p3"
      },
      {
        "type": "pont",
        "x": 17,
        "y": 16,
        "w": 3,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "tole1",
        "mecanique": {
          "type": "chariot",
          "de": [
            17,
            16
          ],
          "vers": [
            25,
            16
          ],
          "vitesse_tuiles_s": 3,
          "declenche": "quand le joueur monte dessus",
          "retour": "lent quand il descend"
        }
      },
      {
        "type": "pad",
        "id": "tole1_fin",
        "x": 25,
        "y": 16,
        "w": 3,
        "solid": "top",
        "sur": "tole1"
      },
      {
        "type": "pad",
        "id": "empile1",
        "x": 32,
        "y": 15,
        "w": 3,
        "solid": "top",
        "sur": "empile1"
      },
      {
        "type": "masse",
        "x": 42,
        "y": 16,
        "w": 6,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "glisse_tuiles_s": 1.5,
        "note": "cale inclinée (marches de 1 tuile)",
        "id": "p7"
      },
      {
        "type": "masse",
        "x": 48,
        "y": 17,
        "w": 4,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "glisse_tuiles_s": 1.5,
        "id": "p8"
      },
      {
        "type": "masse",
        "x": 52,
        "y": 18,
        "w": 2,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "glisse_tuiles_s": 1.5,
        "id": "p9"
      },
      {
        "type": "masse",
        "x": 55,
        "y": 17,
        "w": 4,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p10"
      },
      {
        "type": "pad",
        "id": "coque1",
        "x": 55,
        "y": 15,
        "w": 4,
        "solid": "top",
        "sur": "coque1"
      },
      {
        "type": "masse",
        "x": 61,
        "y": 12,
        "w": 1,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p12"
      },
      {
        "type": "pont",
        "x": 62,
        "y": 14,
        "w": 3,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "tole2",
        "mecanique": {
          "type": "chariot",
          "de": [
            62,
            14
          ],
          "vers": [
            72,
            14
          ],
          "vitesse_tuiles_s": 2.5,
          "declenche": "quand le joueur monte dessus",
          "retour": "lent quand il descend"
        }
      },
      {
        "type": "pad",
        "id": "tole2_fin",
        "x": 72,
        "y": 14,
        "w": 3,
        "solid": "top",
        "sur": "tole2"
      },
      {
        "type": "masse",
        "x": 76,
        "y": 12,
        "w": 1,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p15"
      },
      {
        "type": "masse",
        "x": 77,
        "y": 14,
        "w": 4,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p16"
      },
      {
        "type": "pad",
        "id": "coque2",
        "x": 77,
        "y": 12,
        "w": 4,
        "solid": "top",
        "sur": "coque2"
      },
      {
        "type": "masse",
        "x": 83,
        "y": 12,
        "w": 4,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p18"
      },
      {
        "type": "masse",
        "x": 87,
        "y": 10,
        "w": 2,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p19"
      },
      {
        "type": "pont",
        "x": 89,
        "y": 10,
        "w": 4,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "p20"
      },
      {
        "type": "masse",
        "x": 94,
        "y": 6,
        "w": 1,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p21"
      },
      {
        "type": "masse",
        "x": 98,
        "y": 6,
        "w": 1,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p22"
      },
      {
        "type": "pad",
        "id": "ascenseur",
        "x": 95,
        "y": 10,
        "w": 3,
        "solid": "top",
        "sur": "ascenseur",
        "mecanique": {
          "type": "ascenseur",
          "y_bas": 10,
          "y_haut": 6,
          "declenche": "poids du joueur"
        }
      },
      {
        "type": "pad",
        "id": "ascenseur_haut",
        "x": 95,
        "y": 6,
        "w": 3,
        "solid": "top",
        "sur": "ascenseur"
      },
      {
        "type": "masse",
        "x": 100,
        "y": 6,
        "w": 2,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p25"
      },
      {
        "type": "pont",
        "x": 102,
        "y": 6,
        "w": 4,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "p26"
      },
      {
        "type": "masse",
        "x": 107,
        "y": 6,
        "w": 1,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p27"
      },
      {
        "type": "pont",
        "x": 108,
        "y": 6,
        "w": 3,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "tole4",
        "mecanique": {
          "type": "chariot",
          "de": [
            108,
            6
          ],
          "vers": [
            116,
            6
          ],
          "vitesse_tuiles_s": 3,
          "declenche": "quand le joueur monte dessus",
          "retour": "lent quand il descend"
        }
      },
      {
        "type": "pad",
        "id": "tole4_fin",
        "x": 116,
        "y": 6,
        "w": 3,
        "solid": "top",
        "sur": "tole4"
      },
      {
        "type": "masse",
        "x": 120,
        "y": 5,
        "w": 2,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p30"
      },
      {
        "type": "pont",
        "x": 122,
        "y": 5,
        "w": 5,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "p31"
      },
      {
        "type": "masse",
        "x": 129,
        "y": 5,
        "w": 1,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p32"
      },
      {
        "type": "pont",
        "x": 130,
        "y": 5,
        "w": 5,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "p33"
      },
      {
        "type": "pont",
        "x": 137,
        "y": 5,
        "w": 3,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "tole5",
        "mecanique": {
          "type": "chariot",
          "de": [
            137,
            5
          ],
          "vers": [
            147,
            5
          ],
          "vitesse_tuiles_s": 3.5,
          "declenche": "quand le joueur monte dessus",
          "retour": "lent quand il descend"
        }
      },
      {
        "type": "pad",
        "id": "tole5_fin",
        "x": 147,
        "y": 5,
        "w": 3,
        "solid": "top",
        "sur": "tole5"
      },
      {
        "type": "masse",
        "x": 152,
        "y": 5,
        "w": 3,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p36"
      },
      {
        "type": "pont",
        "x": 157,
        "y": 5,
        "w": 3,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "tole6",
        "mecanique": {
          "type": "chariot",
          "de": [
            157,
            5
          ],
          "vers": [
            167,
            5
          ],
          "vitesse_tuiles_s": 3.5,
          "declenche": "quand le joueur monte dessus",
          "retour": "lent quand il descend"
        }
      },
      {
        "type": "pad",
        "id": "tole6_fin",
        "x": 167,
        "y": 5,
        "w": 3,
        "solid": "top",
        "sur": "tole6"
      },
      {
        "type": "masse",
        "x": 174,
        "y": 6,
        "w": 1,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p39"
      },
      {
        "type": "pont",
        "x": 175,
        "y": 6,
        "w": 4,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "id": "p40"
      },
      {
        "type": "masse",
        "x": 181,
        "y": 9,
        "w": 4,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p41"
      },
      {
        "type": "masse",
        "x": 185,
        "y": 12,
        "w": 6,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p42"
      },
      {
        "type": "masse",
        "x": 191,
        "y": 15,
        "w": 29,
        "top_sprite": "chantiers_sol_pelouse_haut_1",
        "fill_sprite": "chantiers_sol_plein",
        "grab": true,
        "id": "p43"
      },
      {
        "type": "pad",
        "id": "empile2",
        "x": 197,
        "y": 13,
        "w": 5,
        "solid": "top",
        "sur": "empile2"
      }
    ],
    "dangers": [
      {
        "sprite": "bassin_eau",
        "x": 54,
        "y": 20,
        "kind": "eau_mortelle",
        "w": 131
      },
      {
        "sprite": "bassin_eau",
        "x": 54,
        "y": 21,
        "kind": "eau_mortelle",
        "w": 131
      },
      {
        "sprite": "chantiers_obstacle_ferraille",
        "x": 37,
        "y": 16,
        "kind": "mortel"
      },
      {
        "sprite": "chantiers_obstacle_ferraille",
        "x": 48,
        "y": 16,
        "kind": "mortel"
      },
      {
        "sprite": "chantiers_obstacle_ferraille",
        "x": 58,
        "y": 14,
        "kind": "mortel"
      },
      {
        "sprite": "chantiers_obstacle_ferraille",
        "x": 78,
        "y": 11,
        "kind": "mortel"
      },
      {
        "sprite": "chantiers_obstacle_ferraille",
        "x": 104,
        "y": 5,
        "kind": "mortel"
      },
      {
        "sprite": "chantiers_obstacle_ferraille",
        "x": 124,
        "y": 4,
        "kind": "mortel"
      },
      {
        "sprite": "chantiers_obstacle_ferraille",
        "x": 146,
        "y": 4,
        "kind": "mortel"
      },
      {
        "sprite": "chantiers_obstacle_ferraille",
        "x": 166,
        "y": 4,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_1",
        "x": 66,
        "y": 12,
        "kind": "mortel",
        "note": "suspendues à la flèche : s'accroupir sur la tôle"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 142,
        "y": 3,
        "kind": "mortel",
        "note": "barre suspendue : s'accroupir"
      },
      {
        "sprite": "commun_pointes_fer_2",
        "x": 162,
        "y": 3,
        "kind": "mortel",
        "note": "barre suspendue : s'accroupir"
      },
      {
        "sprite": "vapeur",
        "x": 107,
        "y": 5,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "actif_s": 1.2,
          "preavis_s": 0.6,
          "hauteur_tuiles": 3
        }
      }
    ],
    "ennemis": [
      {
        "id": "goeland_z2",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 54,
        "x2": 62,
        "y": 13.875,
        "vitesse": 4,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "goeland_z3",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 120,
        "x2": 129,
        "y": 3.875,
        "vitesse": 4,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "goeland_z4a",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 152,
        "x2": 159,
        "y": 3.875,
        "vitesse": 4,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "goeland_z4b",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 174,
        "x2": 182,
        "y": 4.875,
        "vitesse": 4,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      }
    ],
    "pixels": [
      {
        "sprite": "commun_pixel",
        "x": 12,
        "y": 16,
        "difficulte": "facile",
        "id": 1,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 19,
        "y": 14,
        "difficulte": "facile",
        "id": 2,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 34,
        "y": 13,
        "difficulte": "facile",
        "id": 3,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 37,
        "y": 14,
        "difficulte": "facile",
        "id": 4,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 48,
        "y": 14,
        "difficulte": "facile",
        "id": 5,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 54,
        "y": 16,
        "difficulte": "facile",
        "id": 6,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 58,
        "y": 12,
        "difficulte": "facile",
        "id": 7,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 64,
        "y": 13,
        "difficulte": "facile",
        "id": 8,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 78,
        "y": 9,
        "difficulte": "facile",
        "id": 9,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 91,
        "y": 8,
        "difficulte": "facile",
        "id": 10,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 96,
        "y": 5,
        "difficulte": "facile",
        "id": 11,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 111,
        "y": 3,
        "difficulte": "facile",
        "id": 12,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 124,
        "y": 2,
        "difficulte": "facile",
        "id": 13,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 132,
        "y": 3,
        "difficulte": "facile",
        "id": 14,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 139,
        "y": 4,
        "difficulte": "facile",
        "id": 15,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 148,
        "y": 2,
        "difficulte": "facile",
        "id": 16,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 153,
        "y": 3,
        "difficulte": "facile",
        "id": 17,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 158,
        "y": 4,
        "difficulte": "facile",
        "id": 18,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 168,
        "y": 2,
        "difficulte": "facile",
        "id": 19,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 176,
        "y": 4,
        "difficulte": "facile",
        "id": 20,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 188,
        "y": 10,
        "difficulte": "facile",
        "id": 21,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 199,
        "y": 11,
        "difficulte": "facile",
        "id": 22,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 201,
        "y": 11,
        "difficulte": "facile",
        "id": 23,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 207,
        "y": 14,
        "difficulte": "facile",
        "id": 24,
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 40,
        "y": 16,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 85,
        "y": 11,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 133,
        "y": 4,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_fleches",
        "x": 7,
        "y": 16,
        "texte": "Monte sur la tôle : elle avance toute seule."
      },
      {
        "sprite": "signes_panneau_saut",
        "x": 60,
        "y": 14,
        "texte": "La cale glisse vers l'eau : garde ton élan."
      }
    ],
    "decor": [
      {
        "sprite": "chantiers_grue_portique",
        "x": 16,
        "y": 18,
        "layer": "fond",
        "note": "portique du palan"
      },
      {
        "sprite": "chantiers_grue_portique",
        "x": 22,
        "y": 18,
        "layer": "fond"
      },
      {
        "sprite": "chantiers_buisson_friche",
        "x": 4,
        "y": 16
      },
      {
        "sprite": "chantiers_buisson_friche",
        "x": 30,
        "y": 16
      },
      {
        "sprite": "chantiers_buisson_friche",
        "x": 9,
        "y": 16
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 32,
        "y": 16
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 32,
        "y": 15
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 33.5,
        "y": 16
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 33.5,
        "y": 15
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 197,
        "y": 14
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 197,
        "y": 13
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 198.5,
        "y": 14
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 198.5,
        "y": 13
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 200,
        "y": 14
      },
      {
        "sprite": "chantiers_toles_empilees",
        "x": 200,
        "y": 13
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "chantiers_monument_chantiers",
        "x": 210,
        "y": 14
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 215,
        "y": 14
      },
      "declencheur": {
        "x": 216,
        "y": 14
      }
    },
    "zones": [
      {
        "n": 1,
        "nom": "La Friche et les Rails de Quai",
        "x": [
          0,
          42
        ]
      },
      {
        "n": 2,
        "nom": "Les Cales de Lancement",
        "x": [
          42,
          87
        ]
      },
      {
        "n": 3,
        "nom": "Les Pylônes de la Grue Titan",
        "x": [
          87,
          136
        ]
      },
      {
        "n": 4,
        "nom": "La Flèche de la Grue",
        "x": [
          136,
          185
        ]
      },
      {
        "n": 5,
        "nom": "Le Belvédère de la Proue",
        "x": [
          185,
          220
        ]
      }
    ],
    "pedagogie": [
      {
        "x": [
          16,
          26
        ],
        "texte": "Tôle mobile au-dessus d'une fosse sèche non mortelle."
      },
      {
        "x": [
          62,
          75
        ],
        "texte": "Rester sur la tôle en mouvement en esquivant les pointes suspendues (↓)."
      }
    ],
    "meteo": {
      "pluie": {
        "friction_tole": 0.7,
        "cale_glisse_tuiles_s": 2
      },
      "soleil": {
        "chariots_vitesse": 1.15
      },
      "neige": {
        "chariots_demarrage_s": 0.4,
        "chariots_vitesse": 0.85,
        "friction_empile": 0.75
      },
      "brume": {
        "visibilite_tuiles": 10
      },
      "vent": {
        "poussee_tuiles_s": 0.4
      },
      "orage": {
        "eclair_periode_s": 8
      }
    },
    "image_a_reconstituer": [
      {
        "pixels": [
          1,
          8
        ],
        "detail": "Coque de navire en construction sur la cale"
      },
      {
        "pixels": [
          9,
          16
        ],
        "detail": "Treillis de la Grue Titan"
      },
      {
        "pixels": [
          17,
          24
        ],
        "detail": "Flèche jaune et grise, quai et Loire"
      }
    ],
    "notes": [
      "Chariots déclenchés par le poids : positions de départ et d'arrivée enregistrées (pont + pad _fin).",
      "Poutrelles = consoles d'une tour enracinée ; coques posées sur des piles ; barres et pointes suspendues à la flèche (hors cadre).",
      "Cale inclinée = escalier de blocs avec glisse_tuiles_s."
    ],
    "sourceFile": "niveau_07_chantiers_navals.json",
    "sourceHash": "9348f19ca891d19d1e061fb95a7f30dc263d44114ba542a9e3bc32a92d14eef9"
  },
  {
    "format": "niveau/2",
    "tile": 16,
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche (y fractionnaire possible). Plateformes (type) : masse = bloc plein enraciné jusqu'au bas du niveau (sprite de dessus + remplissage, fill_to = arrêt du remplissage) ; pont = planches/tablier traversable par le bas ; colonne / galerie = éléments portés jusqu'au sol ; pad = surface de collision posée sur le sommet d'un décor (l'objet visuel est dans decor, lié par sur=id). Les autres objets (decor, dangers, signes, checkpoints, arrivee) sont ancrés bas-gauche de la cellule (x,y) et reposent sur une surface. layer 'inlay' = élément incrusté dans la maçonnerie. mecanique = comportement dynamique de la plateforme (cycle, bascule, rebond, etc.). Aucune zone de sprite ne se recouvre (vérifié) et chaque pixel est atteignable (vérifié).",
    "id": "niveau_08_anneaux_buren",
    "num": 8,
    "nom": "Les Anneaux de Buren — Quai des Antilles",
    "difficulte": "8/12",
    "largeur": 240,
    "hauteur": 18,
    "sol_y": 14,
    "temps_ref_s": 95,
    "spawn": {
      "x": 3,
      "y": 13
    },
    "spec": {
      "boss": null,
      "pixels": 25,
      "checkpoints": 3,
      "obstacles_mortels": 11
    },
    "mecaniques": [
      "anneaux d'élan (rouge/bleu/vert)",
      "anneaux alternants"
    ],
    "fond": {
      "ciel": {
        "defaut": "ciel_jour",
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "buren_fond_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "type": "masse",
        "x": 0,
        "y": 14,
        "w": 45,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p1"
      },
      {
        "type": "masse",
        "x": 25,
        "y": 11,
        "w": 6,
        "top_sprite": "buren_sol_haut_2",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "top": "sol_haut_2",
        "id": "p2"
      },
      {
        "type": "masse",
        "x": 37,
        "y": 7,
        "w": 6,
        "top_sprite": "buren_sol_haut_2",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "top": "sol_haut_2",
        "id": "p3"
      },
      {
        "type": "pad",
        "id": "banc",
        "x": 12,
        "y": 13.25,
        "w": 1.5,
        "solid": "top",
        "sur": "banc"
      },
      {
        "type": "masse",
        "x": 45,
        "y": 14,
        "w": 5,
        "top_sprite": "buren_bord_eau",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "top": "bord_eau",
        "id": "p5"
      },
      {
        "type": "masse",
        "x": 56,
        "y": 12,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p6"
      },
      {
        "type": "masse",
        "x": 60,
        "y": 12,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p7"
      },
      {
        "type": "pont",
        "x": 57,
        "y": 12,
        "w": 3,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p8"
      },
      {
        "type": "masse",
        "x": 66,
        "y": 10,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p9"
      },
      {
        "type": "masse",
        "x": 70,
        "y": 10,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p10"
      },
      {
        "type": "pont",
        "x": 67,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p11"
      },
      {
        "type": "masse",
        "x": 74,
        "y": 6,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p12"
      },
      {
        "type": "masse",
        "x": 79,
        "y": 6,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p13"
      },
      {
        "type": "pont",
        "x": 75,
        "y": 6,
        "w": 4,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p14"
      },
      {
        "type": "masse",
        "x": 82,
        "y": 10,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p15"
      },
      {
        "type": "masse",
        "x": 86,
        "y": 10,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p16"
      },
      {
        "type": "pont",
        "x": 83,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p17"
      },
      {
        "type": "masse",
        "x": 89,
        "y": 14,
        "w": 6,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p18"
      },
      {
        "type": "masse",
        "x": 95,
        "y": 14,
        "w": 6,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p19"
      },
      {
        "type": "masse",
        "x": 118,
        "y": 8,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p20"
      },
      {
        "type": "masse",
        "x": 123,
        "y": 8,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p21"
      },
      {
        "type": "pont",
        "x": 119,
        "y": 8,
        "w": 4,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p22"
      },
      {
        "type": "masse",
        "x": 127,
        "y": 10,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p23"
      },
      {
        "type": "masse",
        "x": 131,
        "y": 10,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p24"
      },
      {
        "type": "pont",
        "x": 128,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p25"
      },
      {
        "type": "masse",
        "x": 138,
        "y": 10,
        "w": 8,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p26"
      },
      {
        "type": "masse",
        "x": 148,
        "y": 10,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p27"
      },
      {
        "type": "masse",
        "x": 152,
        "y": 10,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p28"
      },
      {
        "type": "pont",
        "x": 149,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p29"
      },
      {
        "type": "masse",
        "x": 159,
        "y": 9,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p30"
      },
      {
        "type": "masse",
        "x": 163,
        "y": 9,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p31"
      },
      {
        "type": "pont",
        "x": 160,
        "y": 9,
        "w": 3,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p32"
      },
      {
        "type": "masse",
        "x": 167,
        "y": 5,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p33"
      },
      {
        "type": "masse",
        "x": 172,
        "y": 5,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p34"
      },
      {
        "type": "pont",
        "x": 168,
        "y": 5,
        "w": 4,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p35"
      },
      {
        "type": "masse",
        "x": 179,
        "y": 6,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p36"
      },
      {
        "type": "masse",
        "x": 184,
        "y": 6,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p37"
      },
      {
        "type": "pont",
        "x": 180,
        "y": 6,
        "w": 4,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p38"
      },
      {
        "type": "masse",
        "x": 189,
        "y": 6,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p39"
      },
      {
        "type": "masse",
        "x": 194,
        "y": 6,
        "w": 1,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p40"
      },
      {
        "type": "pont",
        "x": 190,
        "y": 6,
        "w": 4,
        "sprite_set": [
          "buren_passerelle_inox_g",
          "buren_passerelle_inox_m",
          "buren_passerelle_inox_d"
        ],
        "id": "p41"
      },
      {
        "type": "masse",
        "x": 199,
        "y": 8,
        "w": 5,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p42"
      },
      {
        "type": "masse",
        "x": 204,
        "y": 12,
        "w": 36,
        "top_sprite": "buren_sol_haut_1",
        "fill_sprite": "buren_sol_plein",
        "grab": true,
        "id": "p43"
      }
    ],
    "dangers": [
      {
        "sprite": "bassin_eau",
        "x": 50,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 39
      },
      {
        "sprite": "bassin_eau",
        "x": 50,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 39
      },
      {
        "sprite": "bassin_eau",
        "x": 101,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 37
      },
      {
        "sprite": "bassin_eau",
        "x": 101,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 37
      },
      {
        "sprite": "bassin_eau",
        "x": 146,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 53
      },
      {
        "sprite": "bassin_eau",
        "x": 146,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 53
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 22,
        "y": 13,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 58,
        "y": 11,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 68,
        "y": 9,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 77,
        "y": 5,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 120,
        "y": 7,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 129,
        "y": 9,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 143,
        "y": 9,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 161,
        "y": 8,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 170,
        "y": 4,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 190,
        "y": 5,
        "kind": "mortel"
      },
      {
        "sprite": "buren_obstacle_bornes_pointes",
        "x": 192,
        "y": 5,
        "kind": "mortel"
      }
    ],
    "anneaux": [
      {
        "id": "r1",
        "taille": "grand",
        "couleur": "rouge",
        "cx": 18,
        "cy": 11,
        "de": [
          16,
          14
        ],
        "vers": [
          26,
          11
        ],
        "effet": "impulsion horizontale +3 tuiles"
      },
      {
        "id": "r2",
        "taille": "moyen",
        "couleur": "bleu",
        "cx": 34,
        "cy": 10,
        "de": [
          33,
          14
        ],
        "vers": [
          38,
          7
        ],
        "effet": "impulsion verticale +2,5 tuiles"
      },
      {
        "id": "r3",
        "taille": "grand",
        "couleur": "rouge",
        "cx": 52,
        "cy": 12,
        "de": [
          48,
          14
        ],
        "vers": [
          57,
          12
        ],
        "effet": "impulsion horizontale +3 tuiles"
      },
      {
        "id": "r4",
        "taille": "moyen",
        "couleur": "rouge",
        "cx": 63,
        "cy": 10,
        "de": [
          58,
          12
        ],
        "vers": [
          67,
          10
        ],
        "effet": "impulsion horizontale +3 tuiles"
      },
      {
        "id": "r5",
        "taille": "petit",
        "couleur": "bleu",
        "cx": 72,
        "cy": 8,
        "de": [
          68,
          10
        ],
        "vers": [
          76,
          6
        ],
        "effet": "impulsion verticale +2,5 tuiles"
      },
      {
        "id": "r6",
        "taille": "grand",
        "couleur": "rouge",
        "cx": 103,
        "cy": 11,
        "de": [
          99,
          14
        ],
        "vers": [
          119,
          8
        ],
        "effet": "impulsion horizontale +3 tuiles"
      },
      {
        "id": "r7",
        "taille": "moyen",
        "couleur": "bleu",
        "cx": 109,
        "cy": 11,
        "de": [
          99,
          14
        ],
        "vers": [
          119,
          8
        ],
        "effet": "impulsion verticale +2,5 tuiles"
      },
      {
        "id": "r8",
        "taille": "moyen",
        "couleur": "rouge",
        "cx": 112,
        "cy": 8,
        "de": [
          99,
          14
        ],
        "vers": [
          119,
          8
        ],
        "effet": "impulsion horizontale +3 tuiles"
      },
      {
        "id": "r9",
        "taille": "petit",
        "couleur": "rouge",
        "cx": 134,
        "cy": 8,
        "de": [
          129,
          10
        ],
        "vers": [
          139,
          10
        ],
        "effet": "impulsion horizontale +3 tuiles"
      },
      {
        "id": "r10",
        "taille": "petit",
        "couleur": "alternant",
        "cx": 155,
        "cy": 9,
        "de": [
          150,
          10
        ],
        "vers": [
          160,
          9
        ],
        "effet": "alternant",
        "cycle": {
          "couleurs": [
            "rouge",
            "bleu"
          ],
          "periode_s": 2.5,
          "preavis_clignotement_s": 0.4
        }
      },
      {
        "id": "r11",
        "taille": "petit",
        "couleur": "alternant",
        "cx": 165,
        "cy": 8,
        "de": [
          161,
          9
        ],
        "vers": [
          169,
          5
        ],
        "effet": "alternant",
        "cycle": {
          "couleurs": [
            "rouge",
            "bleu"
          ],
          "periode_s": 2.5,
          "preavis_clignotement_s": 0.4
        }
      },
      {
        "id": "r12",
        "taille": "petit",
        "couleur": "rouge",
        "cx": 176,
        "cy": 5,
        "de": [
          170,
          5
        ],
        "vers": [
          180,
          6
        ],
        "effet": "impulsion horizontale +3 tuiles"
      },
      {
        "id": "r13",
        "taille": "petit",
        "couleur": "alternant",
        "cx": 196,
        "cy": 6,
        "de": [
          191,
          6
        ],
        "vers": [
          200,
          8
        ],
        "effet": "alternant",
        "cycle": {
          "couleurs": [
            "rouge",
            "bleu"
          ],
          "periode_s": 2.5,
          "preavis_clignotement_s": 0.4
        }
      },
      {
        "id": "r14",
        "taille": "grand",
        "couleur": "rouge",
        "cx": 210,
        "cy": 10,
        "de": [
          206,
          12
        ],
        "vers": [
          230,
          12
        ],
        "effet": "impulsion horizontale +3 tuiles"
      },
      {
        "id": "r15",
        "taille": "grand",
        "couleur": "bleu",
        "cx": 216,
        "cy": 10,
        "de": [
          206,
          12
        ],
        "vers": [
          230,
          12
        ],
        "effet": "impulsion verticale +2,5 tuiles"
      },
      {
        "id": "r16",
        "taille": "grand",
        "couleur": "rouge",
        "cx": 219,
        "cy": 7,
        "de": [
          206,
          12
        ],
        "vers": [
          230,
          12
        ],
        "effet": "impulsion horizontale +3 tuiles"
      },
      {
        "id": "r17",
        "taille": "grand",
        "couleur": "vert",
        "cx": 225,
        "cy": 7,
        "de": [
          206,
          12
        ],
        "vers": [
          230,
          12
        ],
        "effet": "inversion temporaire du courant d'air"
      }
    ],
    "ennemis": [
      {
        "id": "mouette_z2",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 66,
        "x2": 74,
        "y": 8.875,
        "vitesse": 4,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "mouette_z3",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 117,
        "x2": 125,
        "y": 6.875,
        "vitesse": 4.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "mouette_z4a",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 160,
        "x2": 167,
        "y": 7.875,
        "vitesse": 4.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "mouette_z4b",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 184,
        "x2": 191,
        "y": 4.875,
        "vitesse": 4.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      }
    ],
    "pixels": [
      {
        "sprite": "commun_pixel",
        "x": 18,
        "y": 11,
        "difficulte": "facile",
        "id": 1,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 22,
        "y": 10,
        "difficulte": "facile",
        "id": 2,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 34,
        "y": 10,
        "difficulte": "facile",
        "id": 3,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 39,
        "y": 5,
        "difficulte": "facile",
        "id": 4,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 53,
        "y": 12,
        "difficulte": "facile",
        "id": 5,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 63,
        "y": 10,
        "difficulte": "facile",
        "id": 6,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 72,
        "y": 8,
        "difficulte": "facile",
        "id": 7,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 77,
        "y": 4,
        "difficulte": "facile",
        "id": 8,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 84,
        "y": 8,
        "difficulte": "facile",
        "id": 9,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 103,
        "y": 11,
        "difficulte": "facile",
        "id": 10,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 109,
        "y": 11,
        "difficulte": "facile",
        "id": 11,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 112,
        "y": 8,
        "difficulte": "facile",
        "id": 12,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 120,
        "y": 5,
        "difficulte": "facile",
        "id": 13,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 135,
        "y": 7,
        "difficulte": "facile",
        "id": 14,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 143,
        "y": 7,
        "difficulte": "facile",
        "id": 15,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 156,
        "y": 8,
        "difficulte": "facile",
        "id": 16,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 161,
        "y": 6,
        "difficulte": "facile",
        "id": 17,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 170,
        "y": 2,
        "difficulte": "facile",
        "id": 18,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 176,
        "y": 5,
        "difficulte": "facile",
        "id": 19,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 191,
        "y": 3,
        "difficulte": "facile",
        "id": 20,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 196,
        "y": 5,
        "difficulte": "facile",
        "id": 21,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 210,
        "y": 10,
        "difficulte": "facile",
        "id": 22,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 216,
        "y": 10,
        "difficulte": "facile",
        "id": 23,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 219,
        "y": 7,
        "difficulte": "facile",
        "id": 24,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 225,
        "y": 7,
        "difficulte": "facile",
        "id": 25,
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 43,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 93,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 144,
        "y": 9,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_fleches",
        "x": 14,
        "y": 13,
        "texte": "Traverse l'anneau en plein saut : il te propulse."
      }
    ],
    "decor": [
      {
        "sprite": "buren_mat_anneau_grand",
        "x": 17.25,
        "y": 15.25,
        "layer": "fond",
        "id": "r1"
      },
      {
        "sprite": "buren_mat_anneau_moyen",
        "x": 33.5,
        "y": 13.5,
        "layer": "fond",
        "id": "r2"
      },
      {
        "sprite": "buren_mat_anneau_grand",
        "x": 51.25,
        "y": 16.25,
        "layer": "fond",
        "id": "r3"
      },
      {
        "sprite": "buren_mat_anneau_moyen",
        "x": 62.5,
        "y": 13.5,
        "layer": "fond",
        "id": "r4"
      },
      {
        "sprite": "buren_mat_anneau_petit",
        "x": 71.75,
        "y": 10.75,
        "layer": "fond",
        "id": "r5"
      },
      {
        "sprite": "buren_mat_anneau_grand",
        "x": 102.25,
        "y": 15.25,
        "layer": "fond",
        "id": "r6"
      },
      {
        "sprite": "buren_mat_anneau_moyen",
        "x": 108.5,
        "y": 14.5,
        "layer": "fond",
        "id": "r7"
      },
      {
        "sprite": "buren_mat_anneau_moyen",
        "x": 111.5,
        "y": 11.5,
        "layer": "fond",
        "id": "r8"
      },
      {
        "sprite": "buren_mat_anneau_petit",
        "x": 133.75,
        "y": 10.75,
        "layer": "fond",
        "id": "r9"
      },
      {
        "sprite": "buren_mat_anneau_petit",
        "x": 154.75,
        "y": 11.75,
        "layer": "fond",
        "id": "r10"
      },
      {
        "sprite": "buren_mat_anneau_petit",
        "x": 164.75,
        "y": 10.75,
        "layer": "fond",
        "id": "r11"
      },
      {
        "sprite": "buren_mat_anneau_petit",
        "x": 175.75,
        "y": 7.75,
        "layer": "fond",
        "id": "r12"
      },
      {
        "sprite": "buren_mat_anneau_petit",
        "x": 195.75,
        "y": 8.75,
        "layer": "fond",
        "id": "r13"
      },
      {
        "sprite": "buren_mat_anneau_grand",
        "x": 209.25,
        "y": 14.25,
        "layer": "fond",
        "id": "r14"
      },
      {
        "sprite": "buren_mat_anneau_grand",
        "x": 215.25,
        "y": 14.25,
        "layer": "fond",
        "id": "r15"
      },
      {
        "sprite": "buren_mat_anneau_grand",
        "x": 218.25,
        "y": 11.25,
        "layer": "fond",
        "id": "r16"
      },
      {
        "sprite": "buren_mat_anneau_grand",
        "x": 224.25,
        "y": 11.25,
        "layer": "fond",
        "id": "r17"
      },
      {
        "sprite": "buren_banc_quai",
        "x": 12,
        "y": 13
      },
      {
        "sprite": "buren_garde_corps_quai",
        "x": 2,
        "y": 13
      },
      {
        "sprite": "buren_garde_corps_quai",
        "x": 4,
        "y": 13
      },
      {
        "sprite": "buren_borne",
        "x": 8,
        "y": 13
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "buren_monument_buren",
        "x": 231,
        "y": 11
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 236,
        "y": 11
      },
      "declencheur": {
        "x": 237,
        "y": 11
      }
    },
    "zones": [
      {
        "n": 1,
        "nom": "L'Alignement du Quai",
        "x": [
          0,
          45
        ]
      },
      {
        "n": 2,
        "nom": "Les Passerelles d'Inox",
        "x": [
          45,
          95
        ]
      },
      {
        "n": 3,
        "nom": "La Chaîne d'Anneaux",
        "x": [
          95,
          148
        ]
      },
      {
        "n": 4,
        "nom": "La Perspective Nocturne",
        "x": [
          148,
          204
        ]
      },
      {
        "n": 5,
        "nom": "Le Grand Envol",
        "x": [
          204,
          240
        ]
      }
    ],
    "pedagogie": [
      {
        "x": [
          16,
          40
        ],
        "texte": "Anneaux rouge et bleu au-dessus du quai continu : rater le centre ne coûte rien."
      },
      {
        "x": [
          103,
          118
        ],
        "texte": "Triple chaîne d'anneaux au-dessus de la Loire."
      }
    ],
    "meteo": {
      "pluie": {
        "boost_horizontal_tuiles": 2.5,
        "passerelle_friction": 0.65,
        "anneau_remet_vitesse": true,
        "note": "inox glissant ; impulsion horizontale 3→2,5 tuiles ; l'anneau annule la glisse"
      },
      "soleil": {
        "boost_horizontal_tuiles": 3.5,
        "anneau_rayon_tuiles": 1.5,
        "note": "rayon d'activation 1,2→1,5 ; impulsion 3→3,5 tuiles"
      },
      "neige": {
        "anneaux_alternants_cycle_s": 3.5,
        "quai_friction": 0.7,
        "note": "cycle de couleur 2,5→3,5 s en zone 4 ; quai et inox ×0,7"
      },
      "brume": {
        "visibilite_tuiles": 6,
        "visibilite_anneaux_tuiles": 14,
        "note": "décor 6 tuiles ; anneaux visibles à 14"
      },
      "vent": {
        "poussee_tuiles_s": -1,
        "vent_en_l_air_tuiles_s": -1,
        "anneau_ignore_vent_s": 0.6,
        "note": "vent de face −1,0 tuile/s hors anneau ; anneau insensible 0,6 s"
      },
      "orage": {
        "eclair_periode_s": 5,
        "hyper_arc_s": 1.5,
        "anneau_portee_bonus_tuiles": 4,
        "note": "éclair toutes les 5 s ; anneaux hyper-arc-en-ciel 1,5 s"
      },
      "a_confirmer_moteur": "Clés météo non vérifiées côté moteur (moteur absent du projet)."
    },
    "image_a_reconstituer": [
      {
        "pixels": [
          1,
          8
        ],
        "detail": "Anneaux colorés de Buren alignés en perspective"
      },
      {
        "pixels": [
          9,
          16
        ],
        "detail": "Passerelles d'inox au-dessus de l'estuaire"
      },
      {
        "pixels": [
          17,
          25
        ],
        "detail": "Quai des Antilles et Loire"
      }
    ],
    "notes": [
      "Mâts d'anneaux plantés dans le sol ou dans le fond du fleuve (dessinés derrière le sol et l'eau), pixels placés au centre des anneaux.",
      "Passerelles portées par deux pieux enracinés ; brèches de 5-6 tuiles franchies avec l'anneau.",
      "Zone 1 : estrades de pierre à la place des passerelles (le sol reste continu)."
    ],
    "sourceFile": "niveau_08_anneaux_buren.json",
    "sourceHash": "cdfa626f79a6e95a47f8b257f33b90c415c108e6e5c9669979c01ef53cea232e"
  },
  {
    "format": "niveau/2",
    "tile": 16,
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche (y fractionnaire possible). Plateformes (type) : masse = bloc plein enraciné jusqu'au bas du niveau (sprite de dessus + remplissage, fill_to = arrêt du remplissage) ; pont = planches/tablier traversable par le bas ; colonne / galerie = éléments portés jusqu'au sol ; pad = surface de collision posée sur le sommet d'un décor (l'objet visuel est dans decor, lié par sur=id). Les autres objets (decor, dangers, signes, checkpoints, arrivee) sont ancrés bas-gauche de la cellule (x,y) et reposent sur une surface. layer 'inlay' = élément incrusté dans la maçonnerie. mecanique = comportement dynamique de la plateforme (cycle, bascule, rebond, etc.). Aucune zone de sprite ne se recouvre (vérifié) et chaque pixel est atteignable (vérifié).",
    "id": "niveau_09_hangar_a_bananes",
    "num": 9,
    "nom": "Le Hangar à Bananes — La Mûrisserie Infectée",
    "difficulte": "9/12",
    "largeur": 230,
    "hauteur": 22,
    "sol_y": 19,
    "temps_ref_s": 120,
    "spawn": {
      "x": 3,
      "y": 18
    },
    "spec": {
      "boss": "La Moisissure Géante",
      "pixels": 26,
      "checkpoints": 3,
      "obstacles_mortels": 79
    },
    "mecaniques": [
      "conteneurs bleus horizontaux",
      "conteneurs rouges verticaux",
      "portes coulissantes",
      "boss à 3 phases"
    ],
    "fond": {
      "ciel": {
        "defaut": "ciel_jour",
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "hangar_fond_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "type": "masse",
        "x": 0,
        "y": 19,
        "w": 44,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p1"
      },
      {
        "type": "pad",
        "id": "pal1",
        "x": 14,
        "y": 16.5,
        "w": 3,
        "solid": "top",
        "sur": "pal1"
      },
      {
        "type": "pad",
        "id": "c1",
        "x": 19,
        "y": 14.5,
        "w": 5,
        "solid": "top",
        "sur": "c1"
      },
      {
        "type": "pad",
        "id": "c2",
        "x": 27,
        "y": 14.5,
        "w": 5,
        "solid": "top",
        "sur": "c2",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "x",
          "course_tuiles": 6,
          "vitesse_tuiles_s": 2.5
        }
      },
      {
        "type": "pad",
        "id": "c2_fin",
        "x": 33,
        "y": 14.5,
        "w": 5,
        "solid": "top",
        "sur": "c2"
      },
      {
        "type": "masse",
        "x": 44,
        "y": 19,
        "w": 46,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p6"
      },
      {
        "type": "pad",
        "id": "pal2",
        "x": 45,
        "y": 16.5,
        "w": 3,
        "solid": "top",
        "sur": "pal2"
      },
      {
        "type": "pad",
        "id": "c3",
        "x": 50,
        "y": 16,
        "w": 5,
        "solid": "top",
        "sur": "c3",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "y",
          "y_bas": 16,
          "y_haut": 12,
          "periode_s": 4
        }
      },
      {
        "type": "pad",
        "id": "c3_haut",
        "x": 50,
        "y": 12,
        "w": 5,
        "solid": "top",
        "sur": "c3"
      },
      {
        "type": "pad",
        "id": "c4",
        "x": 56,
        "y": 12,
        "w": 5,
        "solid": "top",
        "sur": "c4",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "x",
          "course_tuiles": 7,
          "vitesse_tuiles_s": 2.5
        }
      },
      {
        "type": "pad",
        "id": "c4_fin",
        "x": 63,
        "y": 12,
        "w": 5,
        "solid": "top",
        "sur": "c4"
      },
      {
        "type": "pad",
        "id": "c5",
        "x": 70,
        "y": 14,
        "w": 5,
        "solid": "top",
        "sur": "c5",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "y",
          "y_bas": 14,
          "y_haut": 9,
          "periode_s": 4
        }
      },
      {
        "type": "pad",
        "id": "c5_haut",
        "x": 70,
        "y": 9,
        "w": 5,
        "solid": "top",
        "sur": "c5"
      },
      {
        "type": "pad",
        "id": "c6",
        "x": 77,
        "y": 8.5,
        "w": 5,
        "solid": "top",
        "sur": "c6"
      },
      {
        "type": "masse",
        "x": 85,
        "y": 13,
        "w": 5,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p15"
      },
      {
        "type": "masse",
        "x": 90,
        "y": 13,
        "w": 14,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p16"
      },
      {
        "type": "masse",
        "x": 98,
        "y": 8,
        "w": 2,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 10.5,
        "id": "p19"
      },
      {
        "type": "masse",
        "x": 104,
        "y": 19,
        "w": 28,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p20"
      },
      {
        "type": "masse",
        "x": 106,
        "y": 12,
        "w": 3,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p21"
      },
      {
        "type": "pad",
        "id": "pal3",
        "x": 106,
        "y": 10.75,
        "w": 3,
        "solid": "top",
        "sur": "pal3"
      },
      {
        "type": "masse",
        "x": 113,
        "y": 11,
        "w": 5,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p23"
      },
      {
        "type": "pad",
        "id": "c7",
        "x": 113,
        "y": 9.5,
        "w": 5,
        "solid": "top",
        "sur": "c7"
      },
      {
        "type": "masse",
        "x": 120,
        "y": 9,
        "w": 12,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p25"
      },
      {
        "type": "masse",
        "x": 122,
        "y": 4,
        "w": 2,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 6.5,
        "id": "p28"
      },
      {
        "type": "masse",
        "x": 132,
        "y": 19,
        "w": 43,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p29"
      },
      {
        "type": "pad",
        "id": "c8",
        "x": 134,
        "y": 12,
        "w": 5,
        "solid": "top",
        "sur": "c8",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "y",
          "y_bas": 12,
          "y_haut": 8,
          "periode_s": 4
        }
      },
      {
        "type": "pad",
        "id": "c8_haut",
        "x": 134,
        "y": 8,
        "w": 5,
        "solid": "top",
        "sur": "c8"
      },
      {
        "type": "pad",
        "id": "c9",
        "x": 142,
        "y": 8,
        "w": 5,
        "solid": "top",
        "sur": "c9",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "x",
          "course_tuiles": 5,
          "vitesse_tuiles_s": 3
        }
      },
      {
        "type": "pad",
        "id": "c9_fin",
        "x": 147,
        "y": 8,
        "w": 5,
        "solid": "top",
        "sur": "c9"
      },
      {
        "type": "masse",
        "x": 154,
        "y": 12,
        "w": 3,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p34"
      },
      {
        "type": "pad",
        "id": "pal4",
        "x": 154,
        "y": 10.75,
        "w": 3,
        "solid": "top",
        "sur": "pal4"
      },
      {
        "type": "pad",
        "id": "c10",
        "x": 159,
        "y": 14,
        "w": 5,
        "solid": "top",
        "sur": "c10",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "y",
          "y_bas": 14,
          "y_haut": 9,
          "periode_s": 4
        }
      },
      {
        "type": "pad",
        "id": "c10_haut",
        "x": 159,
        "y": 9,
        "w": 5,
        "solid": "top",
        "sur": "c10"
      },
      {
        "type": "masse",
        "x": 167,
        "y": 14,
        "w": 8,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p38"
      },
      {
        "type": "masse",
        "x": 169,
        "y": 8,
        "w": 2,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 11.5,
        "id": "p41"
      },
      {
        "type": "masse",
        "x": 175,
        "y": 19,
        "w": 55,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": true,
        "id": "p42"
      },
      {
        "type": "masse",
        "x": 175,
        "y": 3,
        "w": 1,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 19,
        "id": "p43"
      },
      {
        "type": "masse",
        "x": 229,
        "y": 3,
        "w": 1,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 19,
        "id": "p44"
      },
      {
        "type": "masse",
        "x": 176,
        "y": 3,
        "w": 53,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 5,
        "note": "plafond de la mûrisserie",
        "id": "p45"
      },
      {
        "type": "pad",
        "id": "pal5",
        "x": 180,
        "y": 15.25,
        "w": 3,
        "solid": "top",
        "sur": "pal5"
      },
      {
        "type": "pad",
        "id": "cg",
        "x": 186,
        "y": 15,
        "w": 5,
        "solid": "top",
        "sur": "cg",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "y",
          "y_bas": 15,
          "y_haut": 9,
          "periode_s": 4
        }
      },
      {
        "type": "pad",
        "id": "cg_haut",
        "x": 186,
        "y": 9,
        "w": 5,
        "solid": "top",
        "sur": "cg"
      },
      {
        "type": "pad",
        "id": "cc",
        "x": 196,
        "y": 11,
        "w": 5,
        "solid": "top",
        "sur": "cc",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "x",
          "course_tuiles": 10,
          "vitesse_tuiles_s": 3
        }
      },
      {
        "type": "pad",
        "id": "cc_fin",
        "x": 206,
        "y": 11,
        "w": 5,
        "solid": "top",
        "sur": "cc"
      },
      {
        "type": "pad",
        "id": "cd",
        "x": 214,
        "y": 15,
        "w": 5,
        "solid": "top",
        "sur": "cd",
        "mecanique": {
          "type": "va-et-vient",
          "axe": "y",
          "y_bas": 15,
          "y_haut": 9,
          "periode_s": 4
        }
      },
      {
        "type": "pad",
        "id": "cd_haut",
        "x": 214,
        "y": 9,
        "w": 5,
        "solid": "top",
        "sur": "cd"
      },
      {
        "type": "masse",
        "x": 182,
        "y": 5,
        "w": 1,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 7,
        "id": "p53"
      },
      {
        "type": "masse",
        "x": 185,
        "y": 5,
        "w": 1,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 7,
        "id": "p54"
      },
      {
        "type": "pont",
        "x": 183,
        "y": 7,
        "w": 2,
        "sprite_set": [
          "hangar_terrasse_bois_g",
          "hangar_terrasse_bois_m",
          "hangar_terrasse_bois_d"
        ],
        "id": "p55"
      },
      {
        "type": "masse",
        "x": 200,
        "y": 5,
        "w": 1,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 6,
        "id": "p56"
      },
      {
        "type": "masse",
        "x": 204,
        "y": 5,
        "w": 1,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 6,
        "id": "p57"
      },
      {
        "type": "pont",
        "x": 201,
        "y": 6,
        "w": 3,
        "sprite_set": [
          "hangar_terrasse_bois_g",
          "hangar_terrasse_bois_m",
          "hangar_terrasse_bois_d"
        ],
        "id": "p58"
      },
      {
        "type": "masse",
        "x": 218,
        "y": 5,
        "w": 1,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 7,
        "id": "p59"
      },
      {
        "type": "masse",
        "x": 221,
        "y": 5,
        "w": 1,
        "top_sprite": "hangar_sol_haut_1",
        "fill_sprite": "hangar_sol_plein",
        "grab": false,
        "fill_to": 7,
        "id": "p60"
      },
      {
        "type": "pont",
        "x": 219,
        "y": 7,
        "w": 2,
        "sprite_set": [
          "hangar_terrasse_bois_g",
          "hangar_terrasse_bois_m",
          "hangar_terrasse_bois_d"
        ],
        "id": "p61"
      }
    ],
    "dangers": [
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 25,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 48,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 49,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 50,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 51,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 52,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 53,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 54,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 55,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 56,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 57,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 58,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 59,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 60,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 61,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 62,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 63,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 64,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 65,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 66,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 67,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 68,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 69,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 70,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 71,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 72,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 73,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 74,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 75,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 76,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 82,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 83,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 84,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 80,
        "y": 7.5,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 104,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 105,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 109,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 110,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 111,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 112,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 118,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 119,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 132,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 133,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 134,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 135,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 136,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 137,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 138,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 139,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 140,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 141,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 142,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 143,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 144,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 145,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 146,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 147,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 148,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 149,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 150,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 151,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 152,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 153,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 157,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 158,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 159,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 160,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 161,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 162,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 163,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 164,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 165,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 166,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 102,
        "y": 12,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_obstacle_tole_coupante",
        "x": 125,
        "y": 8,
        "kind": "mortel"
      },
      {
        "sprite": "hangar_porte_coulissante",
        "x": 98,
        "y": 12,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "libre_bas_s": 1.5,
          "ouverte_s": 1.5,
          "note": "12 px libres en bas : passer accroupi (boîte 8×10) ; debout (8×16) bloqué",
          "libre_bas_px": 12
        },
        "decalage_y_px": -12
      },
      {
        "sprite": "hangar_porte_coulissante",
        "x": 122,
        "y": 8,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "libre_bas_s": 1.5,
          "ouverte_s": 1.5,
          "libre_bas_px": 12,
          "note": "12 px libres en bas : passer accroupi (boîte 8×10) ; debout (8×16) bloqué"
        },
        "decalage_y_px": -12
      },
      {
        "sprite": "hangar_porte_coulissante",
        "x": 169,
        "y": 13,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "libre_bas_s": 1.5,
          "ouverte_s": 1.5,
          "libre_bas_px": 12,
          "note": "12 px libres en bas : passer accroupi (boîte 8×10) ; debout (8×16) bloqué"
        },
        "decalage_y_px": -12
      }
    ],
    "ennemis": [
      {
        "id": "oiseau_z2",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 65,
        "x2": 75,
        "y": 7.875,
        "vitesse": 4,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "tonneau_z3",
        "sprite": "chateau_tonneau",
        "type": "roulant",
        "x1": 127,
        "x2": 130,
        "y": 8,
        "vitesse": 4,
        "sens": "gauche",
        "fin": "se brise contre la porte #2",
        "esquive": "saut"
      },
      {
        "id": "oiseau_z4",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 150,
        "x2": 158,
        "y": 9.625,
        "vitesse": 4.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      }
    ],
    "pixels": [
      {
        "sprite": "commun_pixel",
        "x": 15,
        "y": 15,
        "difficulte": "facile",
        "id": 1,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 22,
        "y": 13,
        "difficulte": "facile",
        "id": 2,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 25,
        "y": 16,
        "difficulte": "facile",
        "id": 3,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 29,
        "y": 13,
        "difficulte": "facile",
        "id": 4,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 52,
        "y": 10,
        "difficulte": "facile",
        "id": 5,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 61,
        "y": 10,
        "difficulte": "facile",
        "id": 6,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 71,
        "y": 7,
        "difficulte": "facile",
        "id": 7,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 80,
        "y": 6,
        "difficulte": "facile",
        "id": 8,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 86,
        "y": 11,
        "difficulte": "facile",
        "id": 9,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 96,
        "y": 12,
        "difficulte": "facile",
        "id": 10,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 108,
        "y": 9,
        "difficulte": "facile",
        "id": 11,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 115,
        "y": 7,
        "difficulte": "facile",
        "id": 12,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 120,
        "y": 8,
        "difficulte": "facile",
        "id": 13,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 127,
        "y": 6,
        "difficulte": "facile",
        "id": 14,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 136,
        "y": 6,
        "difficulte": "facile",
        "id": 15,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 144,
        "y": 5,
        "difficulte": "facile",
        "id": 16,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 154,
        "y": 8,
        "difficulte": "facile",
        "id": 17,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 161,
        "y": 7,
        "difficulte": "facile",
        "id": 18,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 161,
        "y": 12,
        "difficulte": "facile",
        "id": 19,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 172,
        "y": 13,
        "difficulte": "facile",
        "id": 20,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 181,
        "y": 14,
        "difficulte": "facile",
        "id": 21,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 188,
        "y": 8,
        "difficulte": "facile",
        "id": 22,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 200,
        "y": 9,
        "difficulte": "facile",
        "id": 23,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 202,
        "y": 5,
        "difficulte": "facile",
        "id": 24,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 216,
        "y": 8,
        "difficulte": "facile",
        "id": 25,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 224,
        "y": 17,
        "difficulte": "facile",
        "id": 26,
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 42,
        "y": 18,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 88,
        "y": 12,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 173,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_fleches",
        "x": 8,
        "y": 18,
        "texte": "Monte sur les palettes, puis sur le conteneur."
      },
      {
        "sprite": "signes_panneau_saut",
        "x": 39,
        "y": 18,
        "texte": "Bleu : horizontal. Rouge : vertical."
      }
    ],
    "lampes_uv": [
      {
        "id": "uv1",
        "x": 183,
        "y": 6,
        "note": "projecteur UV, sprite provisoire"
      },
      {
        "id": "uv2",
        "x": 201,
        "y": 5
      },
      {
        "id": "uv3",
        "x": 219,
        "y": 6
      }
    ],
    "decor": [
      {
        "sprite": "hangar_palettes_caisses",
        "x": 14,
        "y": 18
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 15.5,
        "y": 18
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 14,
        "y": 16.75
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 15.5,
        "y": 16.75
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 19,
        "y": 18
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 21.5,
        "y": 18
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 19,
        "y": 16.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 21.5,
        "y": 16.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 19,
        "y": 15
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 21.5,
        "y": 15
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 27,
        "y": 15
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 29.5,
        "y": 15
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 45,
        "y": 18
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 46.5,
        "y": 18
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 45,
        "y": 16.75
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 46.5,
        "y": 16.75
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 50,
        "y": 16.5
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 52.5,
        "y": 16.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 56,
        "y": 12.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 58.5,
        "y": 12.5
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 70,
        "y": 14.5
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 72.5,
        "y": 14.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 77,
        "y": 18
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 79.5,
        "y": 18
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 77,
        "y": 16.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 79.5,
        "y": 16.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 77,
        "y": 15
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 79.5,
        "y": 15
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 77,
        "y": 13.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 79.5,
        "y": 13.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 77,
        "y": 12
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 79.5,
        "y": 12
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 77,
        "y": 10.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 79.5,
        "y": 10.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 77,
        "y": 9
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 79.5,
        "y": 9
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 106,
        "y": 11
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 107.5,
        "y": 11
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 113,
        "y": 10
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 115.5,
        "y": 10
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 134,
        "y": 12.5
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 136.5,
        "y": 12.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 142,
        "y": 8.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 144.5,
        "y": 8.5
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 154,
        "y": 11
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 155.5,
        "y": 11
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 159,
        "y": 14.5
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 161.5,
        "y": 14.5
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 180,
        "y": 18
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 181.5,
        "y": 18
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 180,
        "y": 16.75
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 181.5,
        "y": 16.75
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 180,
        "y": 15.5
      },
      {
        "sprite": "hangar_palettes_caisses",
        "x": 181.5,
        "y": 15.5
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 186,
        "y": 15.5
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 188.5,
        "y": 15.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 196,
        "y": 11.5
      },
      {
        "sprite": "hangar_conteneur_bleu",
        "x": 198.5,
        "y": 11.5
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 214,
        "y": 15.5
      },
      {
        "sprite": "hangar_conteneur_rouge",
        "x": 216.5,
        "y": 15.5
      },
      {
        "sprite": "hangar_grue_quai",
        "x": 24,
        "y": 18,
        "layer": "fond"
      },
      {
        "sprite": "hangar_grue_quai",
        "x": 37,
        "y": 18,
        "layer": "fond"
      },
      {
        "sprite": "hangar_guirlande_lumineuse",
        "x": 6,
        "y": 10,
        "layer": "fond"
      },
      {
        "sprite": "hangar_guirlande_lumineuse",
        "x": 12,
        "y": 10,
        "layer": "fond"
      },
      {
        "sprite": "hangar_hangar_facade",
        "x": 90,
        "y": 12,
        "layer": "fond"
      },
      {
        "sprite": "hangar_guirlande_lumineuse",
        "x": 140,
        "y": 3,
        "layer": "fond"
      },
      {
        "sprite": "hangar_guirlande_lumineuse",
        "x": 150,
        "y": 3,
        "layer": "fond"
      },
      {
        "sprite": "hangar_sol_haut_1",
        "x": 97,
        "y": 8,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 97,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 97,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 97,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 97,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_haut_1",
        "x": 100,
        "y": 8,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 100,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 100,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 100,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 100,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_haut_1",
        "x": 121,
        "y": 4,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 121,
        "y": 5,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 121,
        "y": 6,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 121,
        "y": 7,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 121,
        "y": 8,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_haut_1",
        "x": 124,
        "y": 4,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 124,
        "y": 5,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 124,
        "y": 6,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 124,
        "y": 7,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 124,
        "y": 8,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_haut_1",
        "x": 168,
        "y": 8,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 168,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 168,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 168,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 168,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 168,
        "y": 13,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_haut_1",
        "x": 171,
        "y": 8,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 171,
        "y": 9,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 171,
        "y": 10,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 171,
        "y": 11,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 171,
        "y": 12,
        "layer": "back"
      },
      {
        "sprite": "hangar_sol_plein",
        "x": 171,
        "y": 13,
        "layer": "back"
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "hangar_monument_hangar",
        "x": 221,
        "y": 18
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 226,
        "y": 18
      },
      "declencheur": {
        "x": 227,
        "y": 18
      },
      "note": "arche déverrouillée quand la moisissure est purifiée"
    },
    "boss": {
      "id": "boss_moisissure",
      "nom": "La Moisissure Géante",
      "arene": {
        "x": [
          175,
          230
        ]
      },
      "sprite_manquant": [
        "hangar_boss_moisissure (80×64)",
        "hangar_spore_toxique (16×16)",
        "hangar_lampe_uv (32×16)"
      ],
      "lampes": [
        "uv1",
        "uv2",
        "uv3"
      ],
      "phases": [
        {
          "n": 1,
          "nom": "Le Tapis Fongique & Pluie de Spores",
          "duree_s": 12,
          "repit_s": 4,
          "motif": "le sol devient mortel (y=19 puis y=18) en 2 s : monter sur les palettes puis les conteneurs ; pluie de spores",
          "repit": "lampe UV 1 clignote : conteneur rouge gauche jusqu'à y=9 puis toucher la lampe"
        },
        {
          "n": 2,
          "nom": "Les Racines Rampantes sur Conteneurs",
          "duree_s": 14,
          "repit_s": 4,
          "motif": "un conteneur sur deux : contour violet 1,5 s puis filaments mortels",
          "repit": "lampe UV 2 (centre)"
        },
        {
          "n": 3,
          "nom": "Dernière purification",
          "duree_s": 12,
          "motif": "combinaison des deux motifs, rythme accéléré",
          "objectif": "lampe UV 3 à droite : conteneur rouge droit puis passerelle"
        }
      ]
    },
    "zones": [
      {
        "n": 1,
        "nom": "La Terrasse et les Guirlandes",
        "x": [
          0,
          44
        ]
      },
      {
        "n": 2,
        "nom": "Le Dock aux Conteneurs",
        "x": [
          44,
          90
        ]
      },
      {
        "n": 3,
        "nom": "Les Portes Coulissantes",
        "x": [
          90,
          132
        ]
      },
      {
        "n": 4,
        "nom": "La Chaîne de Levage",
        "x": [
          132,
          175
        ]
      },
      {
        "n": 5,
        "nom": "Arène de la Mûrisserie",
        "x": [
          175,
          230
        ]
      }
    ],
    "pedagogie": [
      {
        "x": [
          14,
          35
        ],
        "texte": "Palettes puis conteneur fixe puis conteneur horizontal, sol sûr : bleu = horizontal, rouge = vertical."
      },
      {
        "x": [
          98,
          100
        ],
        "texte": "Porte coulissante : sprinter ou glisser accroupi."
      }
    ],
    "meteo": {
      "pluie": {
        "moisissure_monte_tuiles": 0.5
      },
      "soleil": {
        "phases_boss_duree_s": 10
      },
      "neige": {
        "spores_delai_s": 1.2
      },
      "brume": {
        "visibilite_tuiles": 7
      },
      "vent": {
        "poussee_tuiles_s": 0.8
      },
      "orage": {
        "eclair_periode_s": 5,
        "flash_uv_etourdit_s": 1.5
      }
    },
    "image_a_reconstituer": [
      {
        "pixels": [
          1,
          8
        ],
        "detail": "Terrasse de bois et guirlandes du quai"
      },
      {
        "pixels": [
          9,
          18
        ],
        "detail": "Conteneurs bleus et rouges du dock"
      },
      {
        "pixels": [
          19,
          26
        ],
        "detail": "Façade du hangar à bananes et mûrisserie"
      }
    ],
    "notes": [
      "Conteneurs fixes = piles rooted depuis le sol ; conteneurs mobiles = deux positions (pad + pad _fin / _haut) sous un portique en fond.",
      "Passerelles de l'arène suspendues au plafond par des tiges.",
      "Sprites manquants : boss moisissure, spore, lampe UV (guirlande provisoire)."
    ],
    "sourceFile": "niveau_09_hangar_a_bananes.json",
    "sourceHash": "e8215eae2aec3b42a9ee404e77ec559a1521402094181e48329518712af64c07"
  },
  {
    "format": "niveau/2",
    "tile": 16,
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche (y fractionnaire possible). Plateformes (type) : masse = bloc plein enraciné jusqu'au bas du niveau (sprite de dessus + remplissage, fill_to = arrêt du remplissage) ; pont = planches/tablier traversable par le bas ; colonne / galerie = éléments portés jusqu'au sol ; pad = surface de collision posée sur le sommet d'un décor (l'objet visuel est dans decor, lié par sur=id). Les autres objets (decor, dangers, signes, checkpoints, arrivee) sont ancrés bas-gauche de la cellule (x,y) et reposent sur une surface. layer 'inlay' = élément incrusté dans la maçonnerie. mecanique = comportement dynamique de la plateforme (cycle, bascule, rebond, etc.). Aucune zone de sprite ne se recouvre (vérifié) et chaque pixel est atteignable (vérifié).",
    "id": "niveau_10_passage_pommeraye",
    "num": 10,
    "nom": "Passage Pommeraye",
    "difficulte": "10/12",
    "largeur": 210,
    "hauteur": 26,
    "sol_y": 23,
    "temps_ref_s": 105,
    "spawn": {
      "x": 3,
      "y": 22
    },
    "spec": {
      "boss": null,
      "pixels": 26,
      "checkpoints": 3,
      "obstacles_mortels": 102
    },
    "mecaniques": [
      "dalles de verre fragiles",
      "lustres oscillants",
      "verticalité sur 3 étages"
    ],
    "fond": {
      "ciel": {
        "defaut": "ciel_jour",
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "pommeraye_fond_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "type": "masse",
        "x": 0,
        "y": 23,
        "w": 42,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p1"
      },
      {
        "type": "pont",
        "x": 12,
        "y": 20,
        "w": 5,
        "sprite_set": [
          "pommeraye_balcon_galerie_g",
          "pommeraye_balcon_galerie_m",
          "pommeraye_balcon_galerie_d"
        ],
        "id": "bal1"
      },
      {
        "type": "pont",
        "x": 20,
        "y": 19,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "dalle1",
        "mecanique": {
          "fragile": {
            "cede_apres_s": 0.8,
            "regenere_apres_s": 3,
            "son": "fissure cristalline"
          }
        }
      },
      {
        "type": "pont",
        "x": 26,
        "y": 20,
        "w": 5,
        "sprite_set": [
          "pommeraye_balcon_galerie_g",
          "pommeraye_balcon_galerie_m",
          "pommeraye_balcon_galerie_d"
        ],
        "id": "bal2"
      },
      {
        "type": "masse",
        "x": 35,
        "y": 21,
        "w": 5,
        "top_sprite": "pommeraye_marche",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "top": "marche",
        "id": "p5"
      },
      {
        "type": "masse",
        "x": 42,
        "y": 22,
        "w": 2,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p6"
      },
      {
        "type": "masse",
        "x": 44,
        "y": 21,
        "w": 2,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p7"
      },
      {
        "type": "masse",
        "x": 46,
        "y": 20,
        "w": 2,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p8"
      },
      {
        "type": "masse",
        "x": 48,
        "y": 19,
        "w": 2,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p9"
      },
      {
        "type": "masse",
        "x": 50,
        "y": 18,
        "w": 2,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p10"
      },
      {
        "type": "masse",
        "x": 52,
        "y": 17,
        "w": 4,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p11"
      },
      {
        "type": "masse",
        "x": 56,
        "y": 16,
        "w": 2,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p12"
      },
      {
        "type": "masse",
        "x": 58,
        "y": 15,
        "w": 3,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p13"
      },
      {
        "type": "masse",
        "x": 61,
        "y": 14,
        "w": 4,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p14"
      },
      {
        "type": "masse",
        "x": 66,
        "y": 24,
        "w": 112,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p15"
      },
      {
        "type": "pad",
        "id": "lustre1",
        "x": 68,
        "y": 13,
        "w": 3,
        "solid": "top",
        "sur": "lustre1",
        "mecanique": {
          "type": "oscillation",
          "axe": "x",
          "amplitude_tuiles": 3,
          "periode_s": 3,
          "cierges_bords": "mortels aux extrémités"
        }
      },
      {
        "type": "pad",
        "id": "lustre1_fin",
        "x": 71,
        "y": 13,
        "w": 3,
        "solid": "top",
        "sur": "lustre1"
      },
      {
        "sprite": "pommeraye_lustre",
        "x": 69,
        "y": 14.75,
        "id": "lustre1",
        "layer": "sol"
      },
      {
        "type": "pont",
        "x": 74,
        "y": 14,
        "w": 12,
        "sprite_set": [
          "pommeraye_balcon_galerie_g",
          "pommeraye_balcon_galerie_m",
          "pommeraye_balcon_galerie_d"
        ],
        "id": "mezz"
      },
      {
        "type": "masse",
        "x": 75,
        "y": 15,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p20"
      },
      {
        "type": "masse",
        "x": 80,
        "y": 15,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p21"
      },
      {
        "type": "masse",
        "x": 85,
        "y": 15,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p22"
      },
      {
        "type": "pont",
        "x": 88,
        "y": 13,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "dalle2",
        "mecanique": {
          "fragile": {
            "cede_apres_s": 0.8,
            "regenere_apres_s": 3,
            "son": "fissure cristalline"
          }
        }
      },
      {
        "type": "masse",
        "x": 89,
        "y": 14,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p24"
      },
      {
        "type": "pont",
        "x": 94,
        "y": 12,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "dalle3",
        "mecanique": {
          "fragile": {
            "cede_apres_s": 0.8,
            "regenere_apres_s": 3,
            "son": "fissure cristalline"
          }
        }
      },
      {
        "type": "masse",
        "x": 95,
        "y": 13,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p26"
      },
      {
        "type": "pont",
        "x": 100,
        "y": 12,
        "w": 6,
        "sprite_set": [
          "pommeraye_balcon_galerie_g",
          "pommeraye_balcon_galerie_m",
          "pommeraye_balcon_galerie_d"
        ],
        "id": "bal3"
      },
      {
        "type": "masse",
        "x": 101,
        "y": 13,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p28"
      },
      {
        "type": "masse",
        "x": 104,
        "y": 13,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p29"
      },
      {
        "type": "pad",
        "id": "lustre2",
        "x": 109,
        "y": 11,
        "w": 3,
        "solid": "top",
        "sur": "lustre2",
        "mecanique": {
          "type": "oscillation",
          "axe": "x",
          "amplitude_tuiles": 3,
          "periode_s": 3,
          "cierges_bords": "mortels aux extrémités"
        }
      },
      {
        "type": "pad",
        "id": "lustre2_fin",
        "x": 112,
        "y": 11,
        "w": 3,
        "solid": "top",
        "sur": "lustre2"
      },
      {
        "sprite": "pommeraye_lustre",
        "x": 110,
        "y": 12.75,
        "id": "lustre2",
        "layer": "sol"
      },
      {
        "type": "pont",
        "x": 115,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "dalle4",
        "mecanique": {
          "fragile": {
            "cede_apres_s": 0.8,
            "regenere_apres_s": 3,
            "son": "fissure cristalline"
          }
        }
      },
      {
        "type": "masse",
        "x": 116,
        "y": 11,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p34"
      },
      {
        "type": "pont",
        "x": 121,
        "y": 9,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "dalle5",
        "mecanique": {
          "fragile": {
            "cede_apres_s": 0.8,
            "regenere_apres_s": 3,
            "son": "fissure cristalline"
          }
        }
      },
      {
        "type": "masse",
        "x": 122,
        "y": 10,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p36"
      },
      {
        "type": "pont",
        "x": 126,
        "y": 9,
        "w": 6,
        "sprite_set": [
          "pommeraye_balcon_galerie_g",
          "pommeraye_balcon_galerie_m",
          "pommeraye_balcon_galerie_d"
        ],
        "id": "bal4"
      },
      {
        "type": "masse",
        "x": 127,
        "y": 10,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p38"
      },
      {
        "type": "masse",
        "x": 130,
        "y": 10,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p39"
      },
      {
        "type": "pont",
        "x": 134,
        "y": 8,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "dalle6",
        "mecanique": {
          "fragile": {
            "cede_apres_s": 0.8,
            "regenere_apres_s": 3,
            "son": "fissure cristalline"
          }
        }
      },
      {
        "type": "masse",
        "x": 135,
        "y": 9,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p41"
      },
      {
        "type": "masse",
        "x": 140,
        "y": 8,
        "w": 2,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p42"
      },
      {
        "type": "pont",
        "x": 145,
        "y": 7,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "dalle7",
        "mecanique": {
          "fragile": {
            "cede_apres_s": 0.8,
            "regenere_apres_s": 3,
            "son": "fissure cristalline"
          }
        }
      },
      {
        "type": "masse",
        "x": 146,
        "y": 8,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p44"
      },
      {
        "type": "pad",
        "id": "lustre3",
        "x": 151,
        "y": 7,
        "w": 3,
        "solid": "top",
        "sur": "lustre3",
        "mecanique": {
          "type": "oscillation",
          "axe": "x",
          "amplitude_tuiles": 3,
          "periode_s": 3,
          "cierges_bords": "mortels aux extrémités"
        }
      },
      {
        "type": "pad",
        "id": "lustre3_fin",
        "x": 154,
        "y": 7,
        "w": 3,
        "solid": "top",
        "sur": "lustre3"
      },
      {
        "sprite": "pommeraye_lustre",
        "x": 152,
        "y": 8.75,
        "id": "lustre3",
        "layer": "sol"
      },
      {
        "type": "pont",
        "x": 157,
        "y": 6,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "dalle8",
        "mecanique": {
          "fragile": {
            "cede_apres_s": 0.8,
            "regenere_apres_s": 3,
            "son": "fissure cristalline"
          }
        }
      },
      {
        "type": "masse",
        "x": 158,
        "y": 7,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p49"
      },
      {
        "type": "masse",
        "x": 163,
        "y": 6,
        "w": 2,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p50"
      },
      {
        "type": "pont",
        "x": 168,
        "y": 7,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "dalle9",
        "mecanique": {
          "fragile": {
            "cede_apres_s": 0.8,
            "regenere_apres_s": 3,
            "son": "fissure cristalline"
          }
        }
      },
      {
        "type": "masse",
        "x": 169,
        "y": 8,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p52"
      },
      {
        "type": "pont",
        "x": 173,
        "y": 8,
        "w": 5,
        "sprite_set": [
          "pommeraye_balcon_galerie_g",
          "pommeraye_balcon_galerie_m",
          "pommeraye_balcon_galerie_d"
        ],
        "id": "bal5"
      },
      {
        "type": "masse",
        "x": 174,
        "y": 9,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p54"
      },
      {
        "type": "masse",
        "x": 178,
        "y": 8,
        "w": 32,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "id": "p55"
      },
      {
        "type": "masse",
        "x": 184,
        "y": 7,
        "w": 10,
        "top_sprite": "pommeraye_marche",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": true,
        "top": "marche",
        "id": "p56"
      },
      {
        "type": "masse",
        "x": 91,
        "y": 0,
        "w": 1,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "fill_to": 10,
        "id": "p57"
      },
      {
        "type": "masse",
        "x": 138,
        "y": 0,
        "w": 1,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "fill_to": 8,
        "id": "p58"
      },
      {
        "type": "masse",
        "x": 160,
        "y": 10,
        "w": 1,
        "top_sprite": "pommeraye_sol_plein",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "id": "p59"
      },
      {
        "type": "pont",
        "x": 75,
        "y": 10,
        "w": 4,
        "sprite_set": [
          "pommeraye_balcon_galerie_g",
          "pommeraye_balcon_galerie_m",
          "pommeraye_balcon_galerie_d"
        ],
        "id": "balc_haut"
      },
      {
        "type": "masse",
        "x": 74,
        "y": 0,
        "w": 1,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "fill_to": 10,
        "id": "p61"
      },
      {
        "type": "masse",
        "x": 79,
        "y": 0,
        "w": 1,
        "top_sprite": "pommeraye_sol_haut_1",
        "fill_sprite": "pommeraye_sol_plein",
        "grab": false,
        "fill_to": 10,
        "id": "p62"
      }
    ],
    "dangers": [
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 66,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 67,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 68,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 69,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 70,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 71,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 72,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 73,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 74,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 76,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 77,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 78,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 79,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 81,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 82,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 83,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 84,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 86,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 87,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 88,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 90,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 91,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 92,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 93,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 94,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 96,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 97,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 98,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 99,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 100,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 102,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 103,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 105,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 106,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 107,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 108,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 109,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 110,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 111,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 112,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 113,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 114,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 115,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 117,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 118,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 119,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 120,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 121,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 123,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 124,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 125,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 126,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 128,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 129,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 131,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 132,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 133,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 134,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 136,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 137,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 138,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 139,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 142,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 143,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 144,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 145,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 147,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 148,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 149,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 150,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 151,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 152,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 153,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 154,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 155,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 156,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 157,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 159,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 161,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 162,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 165,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 166,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 167,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 168,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 170,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 171,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 172,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 173,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 175,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 176,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 177,
        "y": 23,
        "kind": "mortel",
        "note": "fond de la cage/vide"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 29,
        "y": 19,
        "kind": "mortel"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 33,
        "y": 22,
        "kind": "mortel"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 48,
        "y": 18,
        "kind": "mortel"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 59,
        "y": 14,
        "kind": "mortel"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 80,
        "y": 13,
        "kind": "mortel"
      },
      {
        "sprite": "commun_pointes_fer_1",
        "x": 91,
        "y": 10,
        "kind": "mortel",
        "note": "suspendues à un arceau"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 103,
        "y": 11,
        "kind": "mortel"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 128,
        "y": 8,
        "kind": "mortel"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 138,
        "y": 8,
        "kind": "mortel"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 160,
        "y": 9,
        "kind": "mortel"
      },
      {
        "sprite": "pommeraye_obstacle_grille_pointes",
        "x": 175,
        "y": 7,
        "kind": "mortel"
      }
    ],
    "ennemis": [
      {
        "id": "moineau_z2",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 64,
        "x2": 73,
        "y": 11.875,
        "vitesse": 4,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "moineau_z3",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 114,
        "x2": 123,
        "y": 7.875,
        "vitesse": 4.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "moineau_z4a",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 144,
        "x2": 152,
        "y": 5.875,
        "vitesse": 4.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      },
      {
        "id": "moineau_z4b",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 162,
        "x2": 170,
        "y": 4.875,
        "vitesse": 4.5,
        "touche": "debout",
        "esquive": "accroupi",
        "hitbox_px_au_dessus_sol": 12
      }
    ],
    "pixels": [
      {
        "sprite": "commun_pixel",
        "x": 14,
        "y": 18,
        "difficulte": "facile",
        "id": 1,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 21,
        "y": 17,
        "difficulte": "facile",
        "id": 2,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 29,
        "y": 16,
        "difficulte": "facile",
        "id": 3,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 37,
        "y": 19,
        "difficulte": "facile",
        "id": 4,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 48,
        "y": 16,
        "difficulte": "facile",
        "id": 5,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 53,
        "y": 13,
        "difficulte": "facile",
        "id": 6,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 69,
        "y": 11,
        "difficulte": "facile",
        "id": 7,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 78,
        "y": 8,
        "difficulte": "facile",
        "id": 8,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 82,
        "y": 12,
        "difficulte": "facile",
        "id": 9,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 89,
        "y": 11,
        "difficulte": "facile",
        "id": 10,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 95,
        "y": 10,
        "difficulte": "facile",
        "id": 11,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 103,
        "y": 9,
        "difficulte": "facile",
        "id": 12,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 110,
        "y": 9,
        "difficulte": "facile",
        "id": 13,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 116,
        "y": 8,
        "difficulte": "facile",
        "id": 14,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 122,
        "y": 7,
        "difficulte": "facile",
        "id": 15,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 135,
        "y": 6,
        "difficulte": "facile",
        "id": 16,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 140,
        "y": 6,
        "difficulte": "facile",
        "id": 17,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 146,
        "y": 5,
        "difficulte": "facile",
        "id": 18,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 152,
        "y": 5,
        "difficulte": "facile",
        "id": 19,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 158,
        "y": 4,
        "difficulte": "facile",
        "id": 20,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 169,
        "y": 5,
        "difficulte": "facile",
        "id": 21,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 175,
        "y": 5,
        "difficulte": "facile",
        "id": 22,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 186,
        "y": 5,
        "difficulte": "facile",
        "id": 23,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 188,
        "y": 5,
        "difficulte": "facile",
        "id": 24,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 190,
        "y": 5,
        "difficulte": "facile",
        "id": 25,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 192,
        "y": 5,
        "difficulte": "facile",
        "id": 26,
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 41,
        "y": 22,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 84,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 130,
        "y": 8,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_fleches",
        "x": 8,
        "y": 22,
        "texte": "Ne reste jamais sur le verre : il cède après 0,8 s."
      }
    ],
    "decor": [
      {
        "sprite": "pommeraye_devanture_a",
        "x": 12,
        "y": 22,
        "layer": "fond"
      },
      {
        "sprite": "pommeraye_devanture_b",
        "x": 14.5,
        "y": 22,
        "layer": "fond"
      },
      {
        "sprite": "pommeraye_devanture_b",
        "x": 20,
        "y": 22,
        "layer": "fond"
      },
      {
        "sprite": "pommeraye_devanture_a",
        "x": 26,
        "y": 22,
        "layer": "fond"
      },
      {
        "sprite": "pommeraye_devanture_b",
        "x": 28.5,
        "y": 22,
        "layer": "fond"
      },
      {
        "sprite": "pommeraye_devanture_a",
        "x": 3,
        "y": 22,
        "layer": "fond"
      },
      {
        "sprite": "pommeraye_devanture_b",
        "x": 6,
        "y": 22,
        "layer": "fond"
      },
      {
        "sprite": "pommeraye_statue",
        "x": 53,
        "y": 16
      },
      {
        "sprite": "pommeraye_statue",
        "x": 187,
        "y": 6
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "pommeraye_monument_pommeraye",
        "x": 200,
        "y": 7
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 205,
        "y": 7
      },
      "declencheur": {
        "x": 206,
        "y": 7
      }
    },
    "zones": [
      {
        "n": 1,
        "nom": "La Galerie Inférieure",
        "x": [
          0,
          42
        ]
      },
      {
        "n": 2,
        "nom": "Le Grand Escalier",
        "x": [
          42,
          86
        ]
      },
      {
        "n": 3,
        "nom": "La Mezzanine et les Coursives",
        "x": [
          86,
          132
        ]
      },
      {
        "n": 4,
        "nom": "Sous la Grande Verrière",
        "x": [
          132,
          178
        ]
      },
      {
        "n": 5,
        "nom": "La Galerie Supérieure",
        "x": [
          178,
          210
        ]
      }
    ],
    "pedagogie": [
      {
        "x": [
          20,
          23
        ],
        "texte": "Première dalle de verre au-dessus d'un sol continu : elle cède après 0,8 s sans danger."
      },
      {
        "x": [
          88,
          172
        ],
        "texte": "Ponts de dalles successives au-dessus du vide."
      }
    ],
    "meteo": {
      "pluie": {
        "verriere_bruit": true,
        "friction": 1,
        "dalle_verre_cede_apres_s": 0.65,
        "note": "passage couvert : aucune glisse ; dalles 0,8→0,65 s en zone 4"
      },
      "soleil": {
        "dalle_verre_cede_apres_s": 1,
        "oiseau_vitesse_mult": 1.1,
        "note": "dalles 0,8→1,0 s ; moineaux +10 % (5 tuiles/s)"
      },
      "neige": {
        "lustre_periode_s": 4,
        "dalle_verre_friction": 0.8,
        "note": "lustres plus lents (3→4 s) ; dalles zone 4 ×0,8"
      },
      "brume": {
        "visibilite_tuiles": 10
      },
      "vent": {
        "vent_joueur": 0,
        "lustre_amplitude_bonus_tuiles": 1,
        "note": "aucune poussée ; lustres zone 4 : amplitude 3→4 tuiles"
      },
      "orage": {
        "eclair_periode_s": 5,
        "oiseaux_figes_s": 1.5,
        "dalle_verre_clignote": true,
        "note": "éclair toutes les 5 s ; oiseaux figés 1,5 s"
      },
      "a_confirmer_moteur": "Clés météo non vérifiées côté moteur (moteur absent du projet)."
    },
    "image_a_reconstituer": [
      {
        "pixels": [
          1,
          9
        ],
        "detail": "Devantures et galerie inférieure"
      },
      {
        "pixels": [
          10,
          18
        ],
        "detail": "Escalier monumental et statues"
      },
      {
        "pixels": [
          19,
          26
        ],
        "detail": "Verrière métallique et galerie supérieure"
      }
    ],
    "notes": [
      "Balcons du rez-de-chaussée posés sur les devantures de boutiques ; plateformes de la cage portées par des piliers enracinés dans le fond de la cage ; coursive haute suspendue à la verrière par deux tiges.",
      "Lustres suspendus (chaînes hors cadre)."
    ],
    "sourceFile": "niveau_10_passage_pommeraye.json",
    "sourceHash": "e8e4d62cf8081f51d7cc8e1d2929647aa0717f4bd22f320dad1ed2d939d2527a"
  },
  {
    "format": "niveau/2",
    "tile": 16,
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche (y fractionnaire possible). Plateformes (type) : masse = bloc plein enraciné jusqu'au bas du niveau (sprite de dessus + remplissage, fill_to = arrêt du remplissage) ; pont = planches/tablier traversable par le bas ; colonne / galerie = éléments portés jusqu'au sol ; pad = surface de collision posée sur le sommet d'un décor (l'objet visuel est dans decor, lié par sur=id). Les autres objets (decor, dangers, signes, checkpoints, arrivee) sont ancrés bas-gauche de la cellule (x,y) et reposent sur une surface. layer 'inlay' = élément incrusté dans la maçonnerie. mecanique = comportement dynamique de la plateforme (cycle, bascule, rebond, etc.). Aucune zone de sprite ne se recouvre (vérifié) et chaque pixel est atteignable (vérifié).",
    "id": "niveau_11_memorial_abolition",
    "num": 11,
    "nom": "Mémorial de l'abolition de l'esclavage",
    "difficulte": "11/12",
    "largeur": 220,
    "hauteur": 18,
    "sol_y": 14,
    "temps_ref_s": 110,
    "spawn": {
      "x": 3,
      "y": 13
    },
    "spec": {
      "boss": null,
      "pixels": 25,
      "checkpoints": 3,
      "obstacles_mortels": 3
    },
    "mecaniques": [
      "dalles de mémoire (séquence)",
      "marée lente"
    ],
    "fond": {
      "ciel": {
        "defaut": "ciel_jour",
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "memorial_fond_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "type": "masse",
        "x": 0,
        "y": 14,
        "w": 44,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": true,
        "id": "p1"
      },
      {
        "type": "pont",
        "x": 22,
        "y": 9,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "t1_y9",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "pont",
        "x": 22,
        "y": 12,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "t1_y12",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Bas"
        }
      },
      {
        "type": "masse",
        "x": 23,
        "y": 10,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p4"
      },
      {
        "type": "pont",
        "x": 27,
        "y": 9,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "t2_y9",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Haut"
        }
      },
      {
        "type": "pont",
        "x": 27,
        "y": 12,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "t2_y12",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "masse",
        "x": 28,
        "y": 10,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p7"
      },
      {
        "type": "pont",
        "x": 32,
        "y": 9,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "t3_y9",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "pont",
        "x": 32,
        "y": 12,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "t3_y12",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Bas"
        }
      },
      {
        "type": "masse",
        "x": 33,
        "y": 10,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p10"
      },
      {
        "type": "masse",
        "x": 44,
        "y": 14,
        "w": 6,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": true,
        "id": "p11"
      },
      {
        "type": "pont",
        "x": 52,
        "y": 11,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "p1_y11",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Haut"
        }
      },
      {
        "type": "pont",
        "x": 52,
        "y": 14,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "p1_y14",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "masse",
        "x": 53,
        "y": 12,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p14"
      },
      {
        "type": "pont",
        "x": 57,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "p2_y10",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Haut"
        }
      },
      {
        "type": "pont",
        "x": 57,
        "y": 13,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "p2_y13",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "masse",
        "x": 58,
        "y": 11,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p17"
      },
      {
        "type": "pont",
        "x": 62,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "p3_y10",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "pont",
        "x": 62,
        "y": 13,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "p3_y13",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Bas"
        }
      },
      {
        "type": "masse",
        "x": 63,
        "y": 11,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p20"
      },
      {
        "type": "pont",
        "x": 67,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "p4_y10",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Haut"
        }
      },
      {
        "type": "pont",
        "x": 67,
        "y": 13,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "p4_y13",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "masse",
        "x": 68,
        "y": 11,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p23"
      },
      {
        "type": "pont",
        "x": 62,
        "y": 15,
        "w": 4,
        "sprite_set": [
          "memorial_passerelle_metal_g",
          "memorial_passerelle_metal_m",
          "memorial_passerelle_metal_d"
        ],
        "id": "estacade"
      },
      {
        "type": "masse",
        "x": 62,
        "y": 16,
        "w": 1,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "fill_to": 18,
        "fond": true,
        "id": "p25"
      },
      {
        "type": "masse",
        "x": 65,
        "y": 16,
        "w": 1,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "fill_to": 18,
        "fond": true,
        "id": "p26"
      },
      {
        "type": "masse",
        "x": 72,
        "y": 13,
        "w": 16,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": true,
        "id": "p27"
      },
      {
        "type": "masse",
        "x": 88,
        "y": 14,
        "w": 46,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": true,
        "id": "p28"
      },
      {
        "type": "pont",
        "x": 94,
        "y": 12,
        "w": 3,
        "sprite_set": [
          "memorial_passerelle_metal_g",
          "memorial_passerelle_metal_m",
          "memorial_passerelle_metal_d"
        ],
        "id": "banc1"
      },
      {
        "type": "pont",
        "x": 101,
        "y": 11,
        "w": 5,
        "sprite_set": [
          "memorial_passerelle_metal_g",
          "memorial_passerelle_metal_m",
          "memorial_passerelle_metal_d"
        ],
        "id": "pass1"
      },
      {
        "type": "pont",
        "x": 110,
        "y": 11,
        "w": 4,
        "sprite_set": [
          "memorial_passerelle_metal_g",
          "memorial_passerelle_metal_m",
          "memorial_passerelle_metal_d"
        ],
        "id": "ilot"
      },
      {
        "type": "pont",
        "x": 111,
        "y": 8,
        "w": 4,
        "sprite_set": [
          "memorial_passerelle_metal_g",
          "memorial_passerelle_metal_m",
          "memorial_passerelle_metal_d"
        ],
        "id": "alcove"
      },
      {
        "type": "pont",
        "x": 118,
        "y": 11,
        "w": 5,
        "sprite_set": [
          "memorial_passerelle_metal_g",
          "memorial_passerelle_metal_m",
          "memorial_passerelle_metal_d"
        ],
        "id": "pass2"
      },
      {
        "type": "pont",
        "x": 126,
        "y": 12,
        "w": 3,
        "sprite_set": [
          "memorial_passerelle_metal_g",
          "memorial_passerelle_metal_m",
          "memorial_passerelle_metal_d"
        ],
        "id": "banc2"
      },
      {
        "type": "masse",
        "x": 134,
        "y": 14,
        "w": 10,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": true,
        "id": "p35"
      },
      {
        "type": "pont",
        "x": 146,
        "y": 7,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c1_y7",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "pont",
        "x": 146,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c1_y10",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "pont",
        "x": 146,
        "y": 13,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c1_y13",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Bas"
        }
      },
      {
        "type": "masse",
        "x": 147,
        "y": 8,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p39"
      },
      {
        "type": "pont",
        "x": 151,
        "y": 7,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c2_y7",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "pont",
        "x": 151,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c2_y10",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Milieu"
        }
      },
      {
        "type": "pont",
        "x": 151,
        "y": 13,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c2_y13",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "masse",
        "x": 152,
        "y": 8,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p43"
      },
      {
        "type": "pont",
        "x": 156,
        "y": 7,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c3_y7",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Haut"
        }
      },
      {
        "type": "pont",
        "x": 156,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c3_y10",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "pont",
        "x": 156,
        "y": 13,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c3_y13",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "masse",
        "x": 157,
        "y": 8,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p47"
      },
      {
        "type": "pont",
        "x": 161,
        "y": 7,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c4_y7",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "pont",
        "x": 161,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c4_y10",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Milieu"
        }
      },
      {
        "type": "pont",
        "x": 161,
        "y": 13,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c4_y13",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "masse",
        "x": 162,
        "y": 8,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p51"
      },
      {
        "type": "pont",
        "x": 166,
        "y": 7,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c5_y7",
        "mecanique": {
          "type": "dalle_memoire",
          "solide": true,
          "sequence": "Haut"
        }
      },
      {
        "type": "pont",
        "x": 166,
        "y": 10,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c5_y10",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "pont",
        "x": 166,
        "y": 13,
        "w": 3,
        "sprite_set": [
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre",
          "memorial_sol_dalle_verre"
        ],
        "id": "c5_y13",
        "mecanique": {
          "leurre": true,
          "type": "dalle_memoire",
          "solide": false,
          "note": "s'efface doucement au contact"
        }
      },
      {
        "type": "masse",
        "x": 167,
        "y": 8,
        "w": 1,
        "top_sprite": "memorial_sol_plein",
        "fill_sprite": "memorial_sol_plein",
        "grab": false,
        "top": "sol_plein",
        "fill": "sol_plein",
        "fond": true,
        "note": "montant de la colonne (arrière-plan)",
        "id": "p55"
      },
      {
        "type": "pont",
        "x": 172,
        "y": 7,
        "w": 7,
        "sprite_set": [
          "memorial_passerelle_metal_g",
          "memorial_passerelle_metal_m",
          "memorial_passerelle_metal_d"
        ],
        "id": "arrivee_pass"
      },
      {
        "type": "masse",
        "x": 180,
        "y": 10,
        "w": 4,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": true,
        "id": "p57"
      },
      {
        "type": "masse",
        "x": 184,
        "y": 9,
        "w": 4,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": true,
        "id": "p58"
      },
      {
        "type": "masse",
        "x": 188,
        "y": 8,
        "w": 32,
        "top_sprite": "memorial_sol_haut_1",
        "fill_sprite": "memorial_sol_plein",
        "grab": true,
        "id": "p59"
      },
      {
        "type": "pad",
        "id": "banc3",
        "x": 202,
        "y": 7.375,
        "w": 1.5,
        "solid": "top",
        "sur": "banc3"
      }
    ],
    "dangers": [
      {
        "sprite": "bassin_eau",
        "x": 50,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 22
      },
      {
        "sprite": "bassin_eau",
        "x": 50,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 22
      },
      {
        "sprite": "bassin_eau",
        "x": 144,
        "y": 16,
        "kind": "eau_mortelle",
        "w": 28
      },
      {
        "sprite": "bassin_eau",
        "x": 144,
        "y": 17,
        "kind": "eau_mortelle",
        "w": 28
      },
      {
        "sprite": "memorial_obstacle_flaque_profonde",
        "x": 91,
        "y": 13,
        "kind": "cyclique",
        "w": 9,
        "cycle": {
          "type": "maree",
          "periode_s": 6,
          "haute_s": 3,
          "basse_s": 3,
          "note": "recouvre le sol quand elle est haute"
        }
      },
      {
        "sprite": "memorial_obstacle_flaque_profonde",
        "x": 103,
        "y": 13,
        "kind": "cyclique",
        "w": 15,
        "cycle": {
          "type": "maree",
          "periode_s": 6,
          "haute_s": 3,
          "basse_s": 3,
          "note": "recouvre le sol quand elle est haute"
        }
      },
      {
        "sprite": "memorial_obstacle_flaque_profonde",
        "x": 119,
        "y": 13,
        "kind": "cyclique",
        "w": 11,
        "cycle": {
          "type": "maree",
          "periode_s": 6,
          "haute_s": 3,
          "basse_s": 3,
          "note": "recouvre le sol quand elle est haute"
        }
      }
    ],
    "ennemis": [
      {
        "id": "papillon",
        "sprite": "ciel_papillon",
        "type": "ambiance",
        "x": 205,
        "y": 5,
        "inoffensif": true
      }
    ],
    "sequences": [
      {
        "id": "seq1",
        "stele": "x=14",
        "valeurs": [
          "Bas",
          "Haut",
          "Bas"
        ],
        "colonnes": [
          "t1",
          "t2",
          "t3"
        ]
      },
      {
        "id": "seq2",
        "stele": "x=48",
        "valeurs": [
          "Haut",
          "Haut",
          "Bas",
          "Haut"
        ],
        "colonnes": [
          "p1",
          "p2",
          "p3",
          "p4"
        ],
        "note": "1794 — 1848 — 1948"
      },
      {
        "id": "seq3",
        "stele": "x=135..143",
        "valeurs": [
          "Bas",
          "Milieu",
          "Haut",
          "Milieu",
          "Haut"
        ],
        "colonnes": [
          "c1",
          "c2",
          "c3",
          "c4",
          "c5"
        ]
      }
    ],
    "pixels": [
      {
        "sprite": "commun_pixel",
        "x": 14,
        "y": 10,
        "difficulte": "facile",
        "id": 1,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 23,
        "y": 10,
        "difficulte": "facile",
        "id": 2,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 28,
        "y": 7,
        "difficulte": "facile",
        "id": 3,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 33,
        "y": 10,
        "difficulte": "facile",
        "id": 4,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 53,
        "y": 9,
        "difficulte": "facile",
        "id": 5,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 58,
        "y": 8,
        "difficulte": "facile",
        "id": 6,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 63,
        "y": 11,
        "difficulte": "facile",
        "id": 7,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 63,
        "y": 14,
        "difficulte": "facile",
        "id": 8,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 68,
        "y": 8,
        "difficulte": "facile",
        "id": 9,
        "detail_image": 1
      },
      {
        "sprite": "commun_pixel",
        "x": 95,
        "y": 10,
        "difficulte": "facile",
        "id": 10,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 103,
        "y": 9,
        "difficulte": "facile",
        "id": 11,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 112,
        "y": 9,
        "difficulte": "facile",
        "id": 12,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 112,
        "y": 6,
        "difficulte": "facile",
        "id": 13,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 120,
        "y": 9,
        "difficulte": "facile",
        "id": 14,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 147,
        "y": 11,
        "difficulte": "facile",
        "id": 15,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 152,
        "y": 8,
        "difficulte": "facile",
        "id": 16,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 157,
        "y": 5,
        "difficulte": "facile",
        "id": 17,
        "detail_image": 2
      },
      {
        "sprite": "commun_pixel",
        "x": 162,
        "y": 8,
        "difficulte": "facile",
        "id": 18,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 167,
        "y": 5,
        "difficulte": "facile",
        "id": 19,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 175,
        "y": 5,
        "difficulte": "facile",
        "id": 20,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 190,
        "y": 6,
        "difficulte": "facile",
        "id": 21,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 196,
        "y": 5,
        "difficulte": "facile",
        "id": 22,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 200,
        "y": 4,
        "difficulte": "facile",
        "id": 23,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 203,
        "y": 4,
        "difficulte": "facile",
        "id": 24,
        "detail_image": 3
      },
      {
        "sprite": "commun_pixel",
        "x": 206,
        "y": 5,
        "difficulte": "facile",
        "id": 25,
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 42,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 86,
        "y": 12,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 132,
        "y": 13,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [
      {
        "sprite": "signes_panneau_fleches",
        "x": 16,
        "y": 13,
        "texte": "Retiens les hauteurs illuminées sur la stèle : Bas — Haut — Bas"
      },
      {
        "sprite": "signes_panneau_fleches",
        "x": 46,
        "y": 13,
        "texte": "Haut — Haut — Bas — Haut"
      }
    ],
    "decor": [
      {
        "sprite": "memorial_stele_gravee",
        "x": 14,
        "y": 13
      },
      {
        "sprite": "memorial_stele_gravee",
        "x": 48,
        "y": 13
      },
      {
        "sprite": "memorial_stele_gravee",
        "x": 110,
        "y": 10
      },
      {
        "sprite": "memorial_stele_gravee",
        "x": 135,
        "y": 13,
        "note": "stèle lumineuse 1"
      },
      {
        "sprite": "memorial_stele_gravee",
        "x": 136.9,
        "y": 13,
        "note": "stèle lumineuse 2"
      },
      {
        "sprite": "memorial_stele_gravee",
        "x": 138.8,
        "y": 13,
        "note": "stèle lumineuse 3"
      },
      {
        "sprite": "memorial_stele_gravee",
        "x": 140.7,
        "y": 13,
        "note": "stèle lumineuse 4"
      },
      {
        "sprite": "memorial_stele_gravee",
        "x": 142.6,
        "y": 13,
        "note": "stèle lumineuse 5"
      },
      {
        "sprite": "memorial_banc_beton",
        "x": 10,
        "y": 13
      },
      {
        "sprite": "memorial_lampadaire_sobre",
        "x": 5,
        "y": 13
      },
      {
        "sprite": "memorial_lampadaire_sobre",
        "x": 38,
        "y": 13
      },
      {
        "sprite": "memorial_rambarde_metal",
        "x": 1,
        "y": 13
      },
      {
        "sprite": "memorial_banc_beton",
        "x": 202,
        "y": 7
      },
      {
        "sprite": "memorial_lampadaire_sobre",
        "x": 196,
        "y": 7
      },
      {
        "sprite": "memorial_lampadaire_sobre",
        "x": 210,
        "y": 7
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "memorial_monument_memorial",
        "x": 212,
        "y": 7
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 216,
        "y": 7
      },
      "declencheur": {
        "x": 217,
        "y": 7
      }
    },
    "zones": [
      {
        "n": 1,
        "nom": "L'Esplanade du Quai de la Fosse",
        "x": [
          0,
          44
        ]
      },
      {
        "n": 2,
        "nom": "La Descente vers le Passage",
        "x": [
          44,
          88
        ]
      },
      {
        "n": 3,
        "nom": "Le Couloir des Plaques Commémoratives",
        "x": [
          88,
          134
        ]
      },
      {
        "n": 4,
        "nom": "La Traversée des Cinq Stèles",
        "x": [
          134,
          184
        ]
      },
      {
        "n": 5,
        "nom": "La Remontée vers la Lumière",
        "x": [
          184,
          220
        ]
      }
    ],
    "pedagogie": [
      {
        "x": [
          14,
          34
        ],
        "texte": "Séquence Bas — Haut — Bas au-dessus d'un sol sûr : les dalles leurres s'effacent sans danger."
      }
    ],
    "meteo": {
      "pluie": {},
      "soleil": {},
      "neige": {},
      "brume": {
        "visibilite_tuiles": 10
      },
      "vent": {},
      "orage": {}
    },
    "image_a_reconstituer": [
      {
        "pixels": [
          1,
          9
        ],
        "detail": "Quai de la Fosse et stèle gravée"
      },
      {
        "pixels": [
          10,
          19
        ],
        "detail": "Passage souterrain et plaques en verre"
      },
      {
        "pixels": [
          20,
          25
        ],
        "detail": "Remontée vers la lumière : le mot LIBERTÉ"
      }
    ],
    "notes": [
      "Niveau contemplatif : aucun ennemi, aucune pointe.",
      "Colonnes de dalles : seules les dalles de la séquence sont solides (les autres sont des leurres marqués mecanique.leurre) ; montants des colonnes en arrière-plan.",
      "Plateformes du couloir fixées à la paroi de la galerie (fond de nef)."
    ],
    "sourceFile": "niveau_11_memorial_abolition.json",
    "sourceHash": "c06e83bb4cd31000ba21680a432d74cf561d4b0620da809d3f9283f4ae3227ea"
  },
  {
    "format": "niveau/3",
    "id": "niveau_12_tour_lu",
    "num": 12,
    "nom": "La Tour LU / Le Lieu Unique",
    "difficulte": "12/12",
    "tile": 16,
    "largeur": 260,
    "hauteur": 28,
    "sol_y": 25,
    "temps_ref_s": 150,
    "tuiles": {
      "pierre": {
        "haut": [
          "commun_pierre_haut"
        ],
        "gauche": "commun_pierre_gauche",
        "droite": "commun_pierre_droite",
        "plein": [
          "commun_pierre_pleine"
        ]
      },
      "pilier": {
        "haut": [
          "commun_pierre_pleine"
        ],
        "gauche": "commun_pierre_pleine",
        "droite": "commun_pierre_pleine",
        "plein": [
          "commun_pierre_pleine"
        ]
      }
    },
    "joueur": {
      "hauteur_tuiles": 1,
      "hauteur_accroupi_tuiles": 0.625,
      "boite_px": [
        8,
        16
      ],
      "boite_accroupi_px": [
        8,
        10
      ],
      "sprite_px": [
        15,
        19
      ],
      "saut_vertical_tuiles": 3,
      "saut_horizontal_tuiles": 4,
      "saut_mesure_tuiles": {
        "vertical": 3.37,
        "horizontal": 4.6
      },
      "accroche": "rebord de masse à +0,5 tuile au-dessus du saut",
      "source": "GameScene.js du dépôt : setSize(8,16) debout, setSize(8,10) accroupi ; saut -320, gravité 950, vitesse 110 px/s"
    },
    "coords": "Unités = tuiles de 16 px, origine en haut à gauche. masse = bloc plein enraciné jusqu'en bas (ou jusqu'à 'to'), tuiles = jeu de tuiles défini dans 'tuiles' (haut/gauche/droite/plein). pont = plateforme fine traversable par le bas (sprite_set = gauche, milieu, droite), toujours portée par des piliers. mobile = plateforme animée (x1,y1 → x2,y2) ; si 'rail', elle pend à un rail porté par deux pylônes. eau = bassin mortel enraciné jusqu'en bas. Objets ancrés bas-gauche de la cellule (x,y) et posés sur une surface : le script de validation vérifie qu'aucun sprite ne se superpose, que chaque décor repose sur un support continu et que le parcours est franchissable (saut vertical 3, horizontal 4, accroche 3,5).",
    "fond": {
      "ciel": {
        "bandes": [
          "carte_ciel_degrade_jour_1",
          "carte_ciel_degrade_jour_2",
          "carte_ciel_degrade_jour_3",
          "carte_ciel_degrade_jour_4",
          "carte_ciel_degrade_jour_5"
        ]
      },
      "couches": [
        {
          "sprite": "graslin_fond_tile_x",
          "y_bas": "sol",
          "parallax": 0.3,
          "tile_x": true
        }
      ]
    },
    "plateformes": [
      {
        "id": "m1",
        "type": "masse",
        "tuiles": "pierre",
        "x": 0,
        "y": 25,
        "w": 20
      },
      {
        "id": "m3",
        "type": "masse",
        "tuiles": "pierre",
        "x": 33,
        "y": 24,
        "w": 3
      },
      {
        "id": "m4",
        "type": "masse",
        "tuiles": "pierre",
        "x": 38,
        "y": 19,
        "w": 4
      },
      {
        "id": "m5",
        "type": "masse",
        "tuiles": "pierre",
        "x": 43,
        "y": 22,
        "w": 3
      },
      {
        "id": "m6",
        "type": "masse",
        "tuiles": "pierre",
        "x": 46,
        "y": 17,
        "w": 4
      },
      {
        "id": "p7",
        "type": "pont",
        "x": 50,
        "y": 17,
        "w": 6,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ]
      },
      {
        "id": "p10",
        "type": "pont",
        "x": 69,
        "y": 11,
        "w": 7,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ]
      },
      {
        "id": "p13",
        "type": "pont",
        "x": 98,
        "y": 9,
        "w": 5,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ]
      },
      {
        "id": "p14",
        "type": "pont",
        "x": 105,
        "y": 9,
        "w": 5,
        "sprite_set": [
          "feydeau_balcon_fer_g",
          "feydeau_balcon_fer_m",
          "feydeau_balcon_fer_d"
        ]
      },
      {
        "id": "p17",
        "type": "pont",
        "x": 126,
        "y": 7,
        "w": 5,
        "sprite_set": [
          "cathedrale_corniche_g",
          "cathedrale_corniche_m",
          "cathedrale_corniche_d"
        ]
      },
      {
        "id": "m18",
        "type": "masse",
        "tuiles": "pierre",
        "x": 133,
        "y": 10,
        "w": 3
      },
      {
        "id": "p20",
        "type": "pont",
        "x": 141,
        "y": 5,
        "w": 5,
        "sprite_set": [
          "cathedrale_corniche_g",
          "cathedrale_corniche_m",
          "cathedrale_corniche_d"
        ]
      },
      {
        "id": "m21",
        "type": "masse",
        "tuiles": "pierre",
        "x": 146,
        "y": 12,
        "w": 10
      },
      {
        "id": "p22",
        "type": "pont",
        "x": 157,
        "y": 6,
        "w": 4,
        "sprite_set": [
          "cathedrale_corniche_g",
          "cathedrale_corniche_m",
          "cathedrale_corniche_d"
        ]
      },
      {
        "id": "p23",
        "type": "pont",
        "x": 162,
        "y": 11,
        "w": 4,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ]
      },
      {
        "id": "p25",
        "type": "pont",
        "x": 173,
        "y": 12,
        "w": 4,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ]
      },
      {
        "id": "p26",
        "type": "pont",
        "x": 180,
        "y": 6,
        "w": 6,
        "sprite_set": [
          "cathedrale_corniche_g",
          "cathedrale_corniche_m",
          "cathedrale_corniche_d"
        ]
      },
      {
        "id": "p27",
        "type": "pont",
        "x": 189,
        "y": 6,
        "w": 5,
        "sprite_set": [
          "cathedrale_corniche_g",
          "cathedrale_corniche_m",
          "cathedrale_corniche_d"
        ]
      },
      {
        "id": "m28",
        "type": "masse",
        "tuiles": "pierre",
        "x": 195,
        "y": 16,
        "w": 65
      },
      {
        "id": "p29",
        "type": "pont",
        "x": 205,
        "y": 10,
        "w": 4,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ]
      },
      {
        "id": "p30",
        "type": "pont",
        "x": 241,
        "y": 10,
        "w": 4,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ]
      },
      {
        "id": "m33",
        "type": "masse",
        "tuiles": "pierre",
        "x": 220,
        "y": 13,
        "w": 3
      },
      {
        "id": "p34",
        "type": "pont",
        "x": 225,
        "y": 10,
        "w": 5,
        "sprite_set": [
          "machines_passerelle_acier_g",
          "machines_passerelle_acier_m",
          "machines_passerelle_acier_d"
        ]
      },
      {
        "id": "m35",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 21,
        "y": 20.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m36",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 31,
        "y": 20.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m37",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 50,
        "y": 17.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m38",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 55,
        "y": 17.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m39",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 58,
        "y": 17,
        "w": 1,
        "to": 28
      },
      {
        "id": "m40",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 62,
        "y": 9,
        "w": 1,
        "to": 28
      },
      {
        "id": "m41",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 65,
        "y": 9,
        "w": 1,
        "to": 28
      },
      {
        "id": "m42",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 69,
        "y": 11.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m43",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 75,
        "y": 11.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m44",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 80,
        "y": 12,
        "w": 1,
        "to": 28
      },
      {
        "id": "m45",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 84,
        "y": 7,
        "w": 1,
        "to": 28
      },
      {
        "id": "m46",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 96,
        "y": 7,
        "w": 1,
        "to": 28
      },
      {
        "id": "m47",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 98,
        "y": 9.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m48",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 102,
        "y": 9.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m49",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 105,
        "y": 9.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m50",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 109,
        "y": 9.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m51",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 112,
        "y": 9,
        "w": 1,
        "to": 28
      },
      {
        "id": "m52",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 114,
        "y": 9,
        "w": 1,
        "to": 28
      },
      {
        "id": "m53",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 117,
        "y": 5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m54",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 123,
        "y": 5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m55",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 126,
        "y": 7.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m56",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 130,
        "y": 7.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m57",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 136,
        "y": 6,
        "w": 1,
        "to": 28
      },
      {
        "id": "m58",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 138,
        "y": 6,
        "w": 1,
        "to": 28
      },
      {
        "id": "m59",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 141,
        "y": 5.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m60",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 145,
        "y": 5.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m61",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 157,
        "y": 6.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m62",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 160,
        "y": 6.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m63",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 162,
        "y": 11.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m64",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 165,
        "y": 11.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m65",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 168,
        "y": 7,
        "w": 1,
        "to": 28
      },
      {
        "id": "m66",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 170,
        "y": 7,
        "w": 1,
        "to": 28
      },
      {
        "id": "m67",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 173,
        "y": 12.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m68",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 176,
        "y": 12.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m69",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 180,
        "y": 6.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m70",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 185,
        "y": 6.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m71",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 189,
        "y": 6.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m72",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 193,
        "y": 6.5,
        "w": 1,
        "to": 28
      },
      {
        "id": "m73",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 205,
        "y": 10.5,
        "w": 1,
        "to": 16
      },
      {
        "id": "m74",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 208,
        "y": 10.5,
        "w": 1,
        "to": 16
      },
      {
        "id": "m75",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 241,
        "y": 10.5,
        "w": 1,
        "to": 16
      },
      {
        "id": "m76",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 244,
        "y": 10.5,
        "w": 1,
        "to": 16
      },
      {
        "id": "m77",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 214,
        "y": 14,
        "w": 1,
        "to": 16
      },
      {
        "id": "m78",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 236,
        "y": 14,
        "w": 1,
        "to": 16
      },
      {
        "id": "m79",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 225,
        "y": 10.5,
        "w": 1,
        "to": 16
      },
      {
        "id": "m80",
        "type": "masse",
        "tuiles": "pilier",
        "pilier": true,
        "x": 229,
        "y": 10.5,
        "w": 1,
        "to": 16
      }
    ],
    "eau": [
      {
        "x": 20,
        "w": 28,
        "y": 26,
        "surf": "bassin_eau",
        "deep": "carte_eau_profonde"
      },
      {
        "x": 50,
        "w": 48,
        "y": 26,
        "surf": "bassin_eau",
        "deep": "carte_eau_profonde"
      },
      {
        "x": 98,
        "w": 48,
        "y": 26,
        "surf": "bassin_eau",
        "deep": "carte_eau_profonde"
      },
      {
        "x": 146,
        "w": 42,
        "y": 26,
        "surf": "bassin_eau",
        "deep": "carte_eau_profonde"
      }
    ],
    "mobiles": [
      {
        "id": "v2",
        "sprite": "hangar_conteneur_bleu",
        "kind": "conteneur_horizontal",
        "x1": 22,
        "x2": 28,
        "y1": 22.5,
        "y2": 22.5,
        "w": 2.5,
        "v": 2.5,
        "rail": true,
        "rail_y": 20.5
      },
      {
        "id": "v8",
        "sprite": "machines_engrenage_grand",
        "kind": "engrenage",
        "x1": 57.5,
        "y1": 15,
        "x2": 57.5,
        "y2": 15,
        "w": 2,
        "rotation": "horaire"
      },
      {
        "id": "v9",
        "sprite": "machines_bielle",
        "kind": "bielle",
        "x1": 63,
        "y1": 15,
        "x2": 63,
        "y2": 11,
        "w": 2,
        "v": 1.3,
        "rail": true,
        "rail_y": 9
      },
      {
        "id": "v11",
        "sprite": "machines_engrenage_grand",
        "kind": "engrenage",
        "x1": 79.5,
        "y1": 10,
        "x2": 79.5,
        "y2": 10,
        "w": 2,
        "rotation": "anti-horaire"
      },
      {
        "id": "v12",
        "kind": "chariot_grue",
        "x1": 85,
        "x2": 93,
        "y1": 9,
        "y2": 9,
        "w": 3,
        "v": 3,
        "rail": true,
        "declenche_par_joueur": true,
        "sprite_set": [
          "chantiers_tole_g",
          "chantiers_tole_m",
          "chantiers_tole_d"
        ],
        "rail_y": 7
      },
      {
        "id": "v15",
        "sprite": "memorial_sol_dalle_verre",
        "kind": "dalle_verre",
        "x1": 112,
        "y1": 8,
        "x2": 112,
        "y2": 8,
        "w": 3,
        "fragile_s": 0.8
      },
      {
        "id": "v16",
        "sprite": "pommeraye_lustre",
        "kind": "lustre",
        "x1": 118,
        "x2": 121,
        "y1": 7,
        "y2": 7,
        "w": 1.25,
        "v": 1.3,
        "rail": true,
        "rail_y": 5
      },
      {
        "id": "v19",
        "sprite": "memorial_sol_dalle_verre",
        "kind": "dalle_verre",
        "x1": 136,
        "y1": 5,
        "x2": 136,
        "y2": 5,
        "w": 3,
        "fragile_s": 0.8
      },
      {
        "id": "v24",
        "sprite": "memorial_sol_dalle_verre",
        "kind": "dalle_verre",
        "x1": 168,
        "y1": 6,
        "x2": 168,
        "y2": 6,
        "w": 3,
        "fragile_s": 0.8
      },
      {
        "id": "v31",
        "sprite": "machines_engrenage_grand",
        "kind": "engrenage",
        "x1": 213.5,
        "y1": 12,
        "x2": 213.5,
        "y2": 12,
        "w": 2,
        "rotation": "horaire"
      },
      {
        "id": "v32",
        "sprite": "machines_engrenage_grand",
        "kind": "engrenage",
        "x1": 235.5,
        "y1": 12,
        "x2": 235.5,
        "y2": 12,
        "w": 2,
        "rotation": "anti-horaire"
      }
    ],
    "rails": [
      {
        "sprite": "chantiers_rails_tile_x",
        "x1": 22,
        "x2": 30.5,
        "y": 20.5
      },
      {
        "sprite": "chantiers_rails_tile_x",
        "x1": 63,
        "x2": 65,
        "y": 9
      },
      {
        "sprite": "chantiers_rails_tile_x",
        "x1": 85,
        "x2": 96,
        "y": 7
      },
      {
        "sprite": "chantiers_rails_tile_x",
        "x1": 118,
        "x2": 122.25,
        "y": 5
      }
    ],
    "dangers": [
      {
        "sprite": "commun_pointes_fer_1",
        "x": 15,
        "y": 24,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "machines_obstacle_engrenage_dents",
        "x": 53,
        "y": 16,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "vapeur",
        "x": 72,
        "y": 10,
        "w": 1,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 3,
          "alerte_s": 0.6,
          "actif_s": 1.2
        }
      },
      {
        "sprite": "commun_pointes_fer_1",
        "x": 128,
        "y": 6,
        "w": 1,
        "kind": "mortel"
      },
      {
        "sprite": "cathedrale_gargouille",
        "x": 143,
        "y": 4,
        "w": 1,
        "kind": "cyclique",
        "cycle": {
          "periode_s": 2.5,
          "portee_tuiles": 3,
          "direction": "gauche"
        }
      }
    ],
    "ennemis": [
      {
        "id": "e1",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 36,
        "x2": 44,
        "y": 15,
        "vitesse": 4.5
      },
      {
        "id": "e2",
        "sprite": "machines_animal_mecanique",
        "type": "patrouille_horizontale",
        "x1": 69,
        "x2": 75,
        "y": 5,
        "vitesse": 3.5
      },
      {
        "id": "e3",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 112,
        "x2": 119,
        "y": 3,
        "vitesse": 4.5
      },
      {
        "id": "e4",
        "sprite": "ciel_oiseau",
        "type": "patrouille_horizontale",
        "x1": 165,
        "x2": 175,
        "y": 4,
        "vitesse": 4.5
      }
    ],
    "pixels": [
      {
        "x": 12,
        "difficulte": "facile",
        "y": 23.25,
        "id": 1,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 23,
        "difficulte": "facile",
        "y": 20.75,
        "id": 2,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 34,
        "difficulte": "facile",
        "y": 20.25,
        "id": 3,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 40,
        "difficulte": "risque",
        "y": 17.25,
        "id": 4,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 43,
        "y": 16.5,
        "difficulte": "facile",
        "id": 5,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 54,
        "difficulte": "facile",
        "y": 15.25,
        "id": 6,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 58,
        "difficulte": "facile",
        "y": 13.25,
        "id": 7,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 64,
        "difficulte": "facile",
        "y": 9.25,
        "id": 8,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 74,
        "difficulte": "risque",
        "y": 9.25,
        "id": 9,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 80,
        "difficulte": "risque",
        "y": 8.25,
        "id": 10,
        "sprite": "commun_pixel",
        "detail_image": 1
      },
      {
        "x": 87,
        "difficulte": "risque",
        "y": 7.25,
        "id": 11,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 107,
        "difficulte": "facile",
        "y": 7.25,
        "id": 12,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 113,
        "difficulte": "facile",
        "y": 6.25,
        "id": 13,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 118,
        "difficulte": "risque",
        "y": 5.25,
        "id": 14,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 129,
        "difficulte": "facile",
        "y": 5.25,
        "id": 15,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 133,
        "y": 5.4,
        "difficulte": "facile",
        "id": 16,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 137,
        "difficulte": "risque",
        "y": 3.25,
        "id": 17,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 148,
        "difficulte": "facile",
        "y": 10.25,
        "id": 18,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 151,
        "y": 8.5,
        "difficulte": "facile",
        "id": 19,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 158,
        "difficulte": "risque",
        "y": 4.25,
        "id": 20,
        "sprite": "commun_pixel",
        "detail_image": 2
      },
      {
        "x": 164,
        "y": 7.5,
        "difficulte": "facile",
        "id": 21,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 169,
        "difficulte": "risque",
        "y": 4.25,
        "id": 22,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 183,
        "difficulte": "facile",
        "y": 4.25,
        "id": 23,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 201,
        "y": 9.5,
        "difficulte": "facile",
        "id": 24,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 214,
        "difficulte": "facile",
        "y": 10.25,
        "id": 25,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 225,
        "difficulte": "risque",
        "y": 8.25,
        "id": 26,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 225,
        "y": 5.5,
        "difficulte": "risque",
        "id": 27,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 236,
        "difficulte": "facile",
        "y": 10.25,
        "id": 28,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 247,
        "y": 9.5,
        "difficulte": "facile",
        "id": 29,
        "sprite": "commun_pixel",
        "detail_image": 3
      },
      {
        "x": 251,
        "difficulte": "facile",
        "y": 14.25,
        "id": 30,
        "sprite": "commun_pixel",
        "detail_image": 3
      }
    ],
    "checkpoints": [
      {
        "x": 48,
        "y": 16,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 100,
        "y": 8,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      },
      {
        "x": 192,
        "y": 5,
        "sprite_off": "commun_lanterne_eteinte",
        "sprite_on": "commun_lanterne_allumee"
      }
    ],
    "signes": [],
    "decor": [
      {
        "sprite": "signes_drapeau_final",
        "x": 259,
        "y": 15,
        "layer": "back"
      }
    ],
    "anneaux": [
      {
        "sprite": "buren_mat_anneau_grand",
        "x": 43,
        "y": 21,
        "couleur": "rouge",
        "haut": 3.75
      },
      {
        "sprite": "buren_mat_anneau_moyen",
        "x": 133,
        "y": 9,
        "couleur": "bleu",
        "haut": 3
      }
    ],
    "boosts": [
      {
        "sprite": "graslin_parasol_cafe",
        "x": 33,
        "y": 23,
        "w": 2,
        "hauteur": 4.5,
        "top": 22
      },
      {
        "x": 150,
        "y": 12,
        "top": 12,
        "w": 3,
        "hauteur": 6,
        "nosprite": true
      },
      {
        "x": 163,
        "y": 11,
        "top": 11,
        "w": 3,
        "hauteur": 6,
        "nosprite": true
      },
      {
        "x": 174,
        "y": 12,
        "top": 12,
        "w": 3,
        "hauteur": 6,
        "nosprite": true
      },
      {
        "x": 200,
        "y": 16,
        "top": 16,
        "w": 4,
        "hauteur": 6,
        "nosprite": true
      },
      {
        "x": 246,
        "y": 16,
        "top": 16,
        "w": 4,
        "hauteur": 6,
        "nosprite": true
      }
    ],
    "spawn": {
      "x": 1,
      "y": 24
    },
    "courants": [
      {
        "x": 150,
        "w": 3,
        "y1": 12,
        "y2": 5
      },
      {
        "x": 163,
        "w": 3,
        "y1": 11,
        "y2": 5
      },
      {
        "x": 174,
        "w": 3,
        "y1": 12,
        "y2": 4
      },
      {
        "x": 200,
        "w": 4,
        "y1": 16,
        "y2": 9
      },
      {
        "x": 246,
        "w": 4,
        "y1": 16,
        "y2": 9
      }
    ],
    "arrivee": {
      "monument": {
        "sprite": "!lu_monument_tour_lu",
        "x": 253,
        "y": 15
      },
      "arche": {
        "sprite": "signes_arche_arrivee",
        "x": 256,
        "y": 15
      },
      "declencheur": {
        "x": 257,
        "y": 15
      }
    },
    "boss": {
      "nom": "Le Cœur de la Tempête de Pixels (Boss final, 4 phases)",
      "zone": [
        195,
        260
      ],
      "duree_s": 65,
      "sprites_manquants": [
        "boss_vortex_tempete (64×64)",
        "lu_dome_coupole (96×96)",
        "lu_monument_tour_lu (48×64)"
      ],
      "description": [
        "8. Boss Final — Le Cœur de la Tempête de Pixels (Zone 5, 4 Phases, durée totale ~65 s) :",
        "* *Principe* : Le grand coup de vent qui a éparpillé les 12 monuments de Nantes tourne au centre du dôme (boss_vortex_tempete à x=225, y=9). Le joueur ne frappe pas le Vortex : à la fin de chacune des 4 phases, l'une des 4 grandes Lanternes-Phares du Dôme (lanterne_eteinte → lanterne_allumee) devient accessible ; allumer les 4 lanternes stabilise définitivement les pixels de la ville et dissipe la tempête.",
        "* Phase 1 — Les Bourrasques Horizontales (12 s + 4 s de répit) :",
        "* *Pattern* : Le Vortex souffle vers la gauche (0 à 5 s, poussée de -2,0 tuiles/s au sol) tout en envoyant 3 ondes basses à sauter (y=15), puis souffle vers la droite (6 à 12 s, +2,0 tuiles/s) avec une barre de débris à mi-hauteur (y=14, à esquiver accroupi ↓).",
        "* *Fenêtre de répit (4 s)* : Le vent tombe ; la Lanterne-Phare #1 (x=202, y=6, haut gauche) s'ouvre. Le joueur emprunte la Colonne d'Air gauche (x=200..203) en gravité allégée pour monter d'un bond l'allumer (1/4).",
        "* Phase 2 — L'Engrenage du Temps Détraqué (14 s + 4 s de répit) :",
        "* *Pattern* : Le Vortex active les deux machines_engrenage_grand (x=210 et x=238) et fait jaillir des colonnes de vapeur rythmiques au sol (y=16) toutes les 3 s, obligeant le joueur à rester en mouvement sur les engrenages et le pont central tout en sautant par-dessus 2 ondes circulaires issues du centre (0 à 14 s).",
        "* *Fenêtre de répit (4 s)* : La Lanterne-Phare #2 (x=248, y=6, haut droite) se déverrouille. Le joueur saute de l'engrenage droit (x=238) vers la Colonne d'Air droite (x=246..249) et allume la 2e lanterne (2/4).",
        "* Phase 3 — Pluie d'Éclats & Pont de Verre (15 s + 4 s de répit) :",
        "* *Pattern* : Le sol bas (y=16) est balayé par un tourbillon continu : le joueur doit survivre en hauteur (y=12 à y=8) en bondissant entre les deux engrenages, le pont central de memorial_sol_dalle_verre (x=222, y=10, qui cède après 0,8 s et se régénère après 2,5 s) et les colonnes d'air latérales, tandis que le Vortex lâche des salves verticales d'éclats annoncées 1 s à l'avance par des ombres verticales (0 à 15 s).",
        "* *Fenêtre de répit (4 s)* : La Lanterne-Phare #3 (x=216, y=5, centre-gauche haut) brille. Depuis la colonne d'air gauche ou le pont de verre, le joueur traverse le buren_mat_anneau_moyen Bleu (x=216, y=8) qui le propulse directement sur la 3e lanterne (3/4).",
        "* Phase 4 — Le Cyclone Chromatique Final (16 s + Victoire) :",
        "* *Pattern* : Synthèse finale : le Vortex alterne une aspiration douce vers le centre (0 à 6 s) et une répulsion vers les bords (6 à 12 s), puis lance une ultime double vague d'anneaux expansifs (12 à 16 s) que l'on franchit en utilisant les colonnes d'air latérales.",
        "* *Objectif final* : À 16 s, le Vortex s'essouffle et la Lanterne-Phare #4 (x=232, y=5, centre-droit haut) s'active. Le joueur monte par la Colonne d'Air gauche (x=201), traverse l'Anneau #1 (x=216, y=8), rebondit sur le pont de verre central (x=225, y=10) et traverse l'Anneau #2 (x=232, y=8) pour allumer la 4e lanterne (4/4). Les 4 phares convergent vers le Vortex, qui éclate en une pluie d'etoile_poussiere et un grand arc_en_ciel, ouvrant l'arche_arrivee et hissant le drapeau_final."
      ]
    },
    "spec": {
      "pixels": 30,
      "checkpoints": 3,
      "obstacles_mortels": 9,
      "boss": "Le Cœur de la Tempête de Pixels (Boss final, 4 phases)"
    },
    "zones": [
      {
        "n": 1,
        "nom": "Le Quai Ferdinand-Favre & L'Entrée du Lieu Unique (Rappel Accroupi, Rebond & Conteneurs)",
        "x": [
          0,
          48
        ]
      },
      {
        "n": 2,
        "nom": "Les Fours et l'Horlogerie de la Biscuiterie (Rappel Engrenages, Vapeur & Herses)",
        "x": [
          48,
          98
        ]
      },
      {
        "n": 3,
        "nom": "La Galerie des Renommées et ses Vitraux Art Nouveau (Rappel Dalles de Verre, Pentes & Lustres)",
        "x": [
          98,
          146
        ]
      },
      {
        "n": 4,
        "nom": "La Soufflerie du Dôme Turquoise et Or (Nouvelle mécanique : Courant Ascendant / Gravité Allégée)",
        "x": [
          146,
          195
        ]
      },
      {
        "n": 5,
        "nom": "Arène du Boss Final : Le Vortex de la Tempête de Pixels (4 Phases)",
        "x": [
          195,
          260
        ]
      }
    ],
    "pedagogie": [
      "Introduction sans risque (`x=146 à 156`) : Le joueur arrive dans un puits fermé en bas (`y=12`) traversé par la Colonne d'Air #1 (`etoile_poussiere` qui montent). Un simple saut à l'intérieur le fait décoller de `6 tuiles` de haut avec une descente plume très douce, lui permettant de tester le contrôle aérien en gravité allégée sans aucun gouffre.",
      "Test (`x=161 à 176` et `Boss Final`) : Utiliser les colonnes d'air au-dessus du vide et sur les côtés de l'arène du Boss pour atteindre les lanternes hautes."
    ],
    "courbe_difficulte": [
      "Zones de respiration : Début de Zone 1 (`x=0..18`), chaque checkpoint (`x=48`, `x=98`, `x=144`, `x=193`), le palier d'essai de gravité allégée (`x=146..155`), et les `4 s` d'accalmie entre chacune des 4 phases du Boss Final.",
      "Pic de difficulté : Zone 4 (`x=160..185`) et Phase 4 du Boss Final en Zone 5."
    ],
    "meteo": {
      "pluie": {
        "regle": "Courants d'air alourdis par l'averse : en Zone 4 et 5, la hauteur de saut en colonne d'air passe de `6,0` à `5,2 tuiles` ; corniches extérieures avec friction `×0,75`.",
        "avantage": "La pluie éteint les `cierge_flamme` du lustre en Zone 3 et refroidit les jets de `vapeur` en Zone 2 (`0,8 s` au lieu de `1,2 s`).",
        "inconvenient": "En Zone 4 (`x=171`), il faut utiliser l'accroche (`↑`) au sommet du saut de `5,2 tuiles` pour hisser le joueur sur la corniche `y=5`.",
        "annonce": "Pluie oblique au sommet de la tour, reflets dorés sur le dôme mouillé."
      },
      "soleil": {
        "regle": "Courants thermiques ascendants puissants : les colonnes d'air montent à `6,5 tuiles` et les `buren_mat_anneau` donnent `+0,5 tuile` de portée.",
        "avantage": "Ascension de la Zone 4 et accès aux 4 Lanternes-Phares du Boss Final extrêmement fluides !",
        "inconvenient": "Le Boss Final (Phase 2) fait tourner ses engrenages `15 %` plus vite.",
        "annonce": "Dôme turquoise et or étincelant dans `ciel_jour`, `arc_en_ciel` en fin de combat."
      },
      "neige": {
        "regle": "Les `memorial_sol_dalle_verre` gelées en Zones 3, 4 et 5 mettent `1,1 s` (au lieu de `0,8 s`) à céder sous le poids du joueur !",
        "avantage": "Le pont de verre central de l'arène du Boss (`x=222, y=10`) devient un refuge beaucoup plus stable.",
        "inconvenient": "Les corniches de pierre ont une friction `×0,7`.",
        "annonce": "Flocons tourbillonnant dans les colonnes d'air avec les `etoile_poussiere`."
      },
      "brume": {
        "regle": "Mer de nuages au pied de la Tour LU (`visibilité 7 tuiles`), mais les 4 Lanternes-Phares du Boss, les anneaux et les colonnes d'`etoile_poussiere` brillent à `12 tuiles`.",
        "avantage": "Le Vortex du Boss Final télégraphie ses attaques avec un halo lumineux `0,4 s` plus tôt pour percer la brume !",
        "inconvenient": "En Zones 2 et 3, il faut rester attentif aux obstacles sombres à 7 tuiles.",
        "annonce": "Sommet de la Tour LU émergeant au-dessus d'une mer de `brume_bande_tile_x` épique."
      },
      "vent": {
        "regle": "Vent de haute altitude (`±0,9 tuile/s` qui change de sens toutes les `6 s`), **MAIS** les colonnes d'air verticales et les anneaux de Buren stabilisent la trajectoire.",
        "avantage": "Lorsque le vent souffle dans le sens de marche du joueur, les sauts entre corniches atteignent `4,5 tuiles`.",
        "inconvenient": "Pendant la descente en gravité allégée (flottement), il faut maintenir la direction opposée au vent pour rester dans l'axe.",
        "annonce": "Bannières et nuages défilant vite derrière le dôme, souffle symphonique."
      },
      "orage": {
        "regle": "Météo signature du Boss Final ! Éclair toutes les `5 s` : chaque éclair charge la prochaine `lanterne_eteinte` du Boss d'un halo magnétique (le joueur l'allume à `1,5 tuile` de distance sans avoir besoin de la toucher au pixel près).",
        "avantage": "Facilite l'activation des 4 Lanternes-Phares en fin de chaque phase du Boss Final !",
        "inconvenient": "Le tonnerre crée une petite onde au sol (`y=16`) en Phase 4 qu'il suffit de sauter.",
        "annonce": "`ciel_orage` grandiose autour de la Tour LU, éclairs illuminant les Renommées dorées."
      }
    },
    "image_a_reconstituer": [
      "1er détail révélé (pixels 1 à 10) : Le *Dôme ajouré bleu turquoise et or* surmonté de son lanternon.",
      "2e détail (pixels 11 à 20) : Les *Renommées dorées soufflant dans leurs trompettes*, la grande horloge et les initiales LU entrelacées.",
      "3e détail (pixels 21 à 30) : Le fût coloré de la tour Art nouveau, les briques du *Lieu Unique* au bord du canal Saint-Félix et la ligne verte complète reliant les 12 monuments de Nantes.",
      "Niveau 1 (Jardin des Plantes) :",
      "Accroupissement (`↓`) : Réduit la boîte de collision (hitbox) verticale du joueur de moitié, permettant de passer dans des passages d'1 tuile de haut ou d'esquiver un oiseau volant à hauteur de tête.",
      "Jet d'eau cyclique (`jet_eau`) : Colonne verticale active pendant `1 s` toutes les `3 s` (précédée de `0,5 s` de bouillonnement à la surface) qui blesse ou repousse au contact.",
      "Niveau 2 (Cathédrale) :",
      "Accroche aux rebords (`↑`) : Maintenir `↑` lorsque le haut du joueur frôle le coin supérieur d'une plateforme solide permet de s'y suspendre puis de se hisser dessus en `0,4 s` (augmente la portée verticale utile de `3` à `3,5 tuiles`).",
      "Crachat de gargouille (`gargouille`) : Projectile ou jet horizontal de `3 tuiles` de long émis toutes les `2,5 s` après un clignotement d'alerte de `0,5 s`.",
      "Niveau 3 (Château des Ducs) :",
      "Pont-levis cyclique (`pont_levis`) : Plateforme de 3 à 4 tuiles qui alterne entre état horizontal solide (`3 s`) et état relevé non praticable (`2 s`), annoncé `0,5 s` avant par un son de chaîne.",
      "Herse verticale (`herse`) : Grille mortelle par sa pointe basse qui descend jusqu'au sol pendant `1 s` toutes les `3 s`, laissant d'abord 1 tuile libre en bas (franchissable accroupi `↓`) avant de remonter.",
      "Niveau 4 (Île Feydeau) :",
      "Surface inclinée / Balcon penché : Applique une vitesse tangentielle constante (`±1,2 tuile/s`) au joueur lorsqu'il est posé dessus et conserve cet élan s'il saute dans le sens de la pente.",
      "Bateau à flottabilité limitée (`petit_bateau`) : Plateforme flottante qui s'enfonce de `1,5 tuile` en `1,5 s` sous le poids du joueur avant de toucher l'eau mortelle, puis remonte quand il la quitte.",
      "Niveau 5 (Théâtre Graslin) :",
      "Parasol-tremplin (`graslin_parasol_cafe`) : Plateforme élastique qui propulse automatiquement le joueur à `4,5 tuiles` de haut dès l'atterrissage.",
      "Lustre pendulaire (`pommeraye_lustre`) : Plateforme mobile décrivant un mouvement sinusoïdal horizontal de `3 tuiles` d'amplitude sur une période de `3 s`, avec bords latéraux dangereux (`cierge_flamme`).",
      "Niveau 6 (Machines de l'Île) :",
      "Engrenage rotatif (`machines_engrenage_grand/petit`) : Plateforme circulaire qui ajoute `+1,5 tuile/s` (sens horaire) ou `-1,5 tuile/s` (sens anti-horaire) à la vitesse horizontale du joueur.",
      "Bielle mobile (`machines_bielle`) & Jet de vapeur (`vapeur`) : Plateforme à translation linéaire (horizontale, verticale ou diagonale) et jet gazeux temporisé annoncé par un sifflement de `0,6 s`.",
      "Valve d'objectif de Boss (`machines_valve_arret`) : Interrupteur déclenché par simple contact physique du joueur pendant la fenêtre de répit d'un Boss pour valider une phase sans combat.",
      "Niveau 7 (Chantiers Navals) :",
      "Chariot de grue déclenché au contact (`chantiers_tole`) : Plateforme suspendue immobile qui démarre à `3` ou `3,5 tuiles/s` le long de son rail dès que le joueur atterrit dessus (et revient lentement à son origine s'il la quitte).",
      "Niveau 8 (Anneaux de Buren) :",
      "Anneau de propulsion chromatique (`buren_mat_anneau_*`) : Déclencheur aérien qui, lorsqu'on le traverse en sautant, réinitialise le saut et applique un vecteur de vitesse fixe (Rouge = `+3 tuiles` horizontal, Bleu = `+2,5 tuiles` vertical ; version alternante qui permute toutes les `2,5 s`).",
      "Niveau 9 (Hangar à Bananes) :",
      "Conteneurs codés par couleur (`hangar_conteneur_bleu/rouge`) : Grandes plateformes solides en mouvement continu suivant un code visuel strict (Bleu = va-et-vient horizontal, Rouge = ascenseur vertical).",
      "Porte coulissante (`hangar_porte_coulissante`) : Cloison mobile ouvrant et fermant un passage de 1 à 3 tuiles selon un cycle régulier.",
      "Niveau 10 (Passage Pommeraye) :",
      "Dalle de verre fragile (`memorial_sol_dalle_verre` sous verrière) : Plateforme qui se fissure dès que le joueur la touche, disparaît au bout de `0,8 s` et réapparaît `3 s` plus tard.",
      "Niveau 11 (Mémorial de l'abolition de l'esclavage) :",
      "Stèle de mémoire & Dalles vraies/leurres (`memorial_stele_gravee`) : La stèle affiche et joue une courte séquence de hauteurs (Bas / Milieu / Haut) ; dans la traversée qui suit, seules les dalles correspondant à la séquence sont solides, tandis que les leurres deviennent immatériels au contact.",
      "Marée calme (`memorial_obstacle_flaque_profonde`) : Niveau d'eau qui monte et descend doucement d'1 tuile sur un cycle lent de `6 s`.",
      "Niveau 12 (Tour LU) :",
      "Colonne d'air à gravité allégée (`etoile_poussiere` ascendante) : Zone verticale où la gravité du joueur est divisée par 2, portant la hauteur d'un saut à `6 tuiles` et ralentissant la vitesse de chute."
    ],
    "sourceFile": "niveau_12_tour_lu.json",
    "sourceHash": "92c0e9d6dffa9ec125c9f91ef263235b8f413d3c979006ae64d110cf45e8fba5"
  }
];
