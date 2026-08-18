# GLADIATROOL — Référence complète

## Sommaire

1. [Les 12 classes](#1-les-12-classes)
2. [Sorts Gladiatrool par classe](#2-sorts-gladiatrool-par-classe)
3. [Dictionnaire des effets](#3-dictionnaire-des-effets)
4. [Zones d'effet et cibles](#4-zones-deffet-et-cibles)
5. [Toniques — liste exhaustive](#5-toniques--liste-exhaustive)
6. [Système de récompense des toniques](#6-système-de-récompense-des-toniques)

---

## 1. Les 12 classes

| ID | Classe | PDV base | Caractéristiques initiales |
|---|---|---|---|
| 1 | Feca | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 2 | Osamodas | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 3 | Enutrof | 50 | `111,6, 128,3, 182,1, 176,120, 158,1000` |
| 4 | Sram | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 5 | Xelor | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 6 | Ecaflip | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 7 | Eniripsa | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 8 | Iop | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 9 | Cra | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 10 | Sadida | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 11 | Sacrieur | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |
| 12 | Pandawa | 50 | `111,6, 128,3, 182,1, 176,100, 158,1000` |

> `statsInit` = `statID,valeur|...` : 111=PA, 128=PM, 182=Créa invocations, 176=Prospection, 158=Pods.

### Capacités d'évolution des caractéristiques (coût en points)

| ID | Classe | Force | Intelligence | Agilité | Chance | Vitalité | Sagesse |
|---|---|---|---|---|---|---|---|
| 1 | Feca | 0:2 / 50:3 / 150:4 / 250:5 | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 | 0:3 |
| 2 | Osamodas | 0:2 / 50:3 / 150:4 / 250:5 | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 | 0:3 |
| 3 | Enutrof | 0:1 / 50:2 / 150:3 / 250:4 / 350:5 | 0:1 / 20:2 / 60:3 / 100:4 / 140:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 / 100:2 / 150:3 / 230:4 / 330:5 | 0:1 | 0:3 |
| 4 | Sram | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:2 / 50:3 / 150:4 / 250:5 | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 | 0:3 |
| 5 | Xelor | 0:2 / 50:3 / 150:4 / 250:5 | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 | 0:3 |
| 6 | Ecaflip | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 / 50:2 / 100:3 / 150:4 / 200:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 | 0:3 |
| 7 | Eniripsa | 0:2 / 50:3 / 150:4 / 250:5 | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 | 0:3 |
| 8 | Iop | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 | 0:3 |
| 9 | Cra | 0:1 / 50:2 / 150:3 / 250:4 / 350:5 | 0:1 / 50:2 / 150:3 / 250:4 / 350:5 | 0:1 / 50:2 / 100:3 / 150:4 / 200:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 | 0:3 |
| 10 | Sadida | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 / 20:2 / 40:3 / 60:4 / 80:5 | 0:1 / 100:2 / 200:3 / 300:4 / 400:5 | 0:1 | 0:3 |
| 11 | Sacrieur | 0:3 | 0:3 | 0:3 | 0:3 | 0:1:2 | 0:3 |
| 12 | Pandawa | 0:1 / 50:2 / 200:3 | 0:1 / 50:2 / 200:3 | 0:1 / 50:2 / 200:3 | 0:1 / 50:2 / 200:3 | 0:1 | 0:3 |

> Lecture : `valeur,coût|...` — ex. `0,1|50,3` = 1 pt jusqu'à 50 puis 3 pts.

---

## 2. Sorts Gladiatrool par classe

Chaque morph (id 101-112) donne **30 sorts au grade 6** :
- 20 sorts propres à la classe (positions 1 à 20 du livre) ;
- 8 sorts communs à tous : Flamiche, Boomerang perfide, Marteau de Moon, Cawotte, Libération, Foudroiement, Invocation d'Arakne, Invocation de Chaferfu ;
- 1 maîtrise d'arme de classe ;
- 1 sort « ultime » de classe.

### Statistiques de base des morphs

| ID | Classe | Vie | PA | PM | Vitalité | Sagesse | Terre | Feu | Eau | Air | Initiative |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 101 | Feca | 850 | 8 | 4 | 850 | 150 | 200 | 300 | 60 | 60 | 497 |
| 102 | Osamodas | 850 | 8 | 4 | 850 | 150 | 150 | 300 | 300 | 60 | 500 |
| 103 | Enutrof | 850 | 8 | 4 | 850 | 150 | 250 | 100 | 200 | 60 | 500 |
| 104 | Sram | 850 | 8 | 4 | 850 | 150 | 300 | 150 | 60 | 300 | 500 |
| 105 | Xel | 850 | 8 | 4 | 850 | 150 | 150 | 300 | 60 | 60 | 500 |
| 106 | Eca | 850 | 8 | 4 | 850 | 150 | 300 | 60 | 60 | 200 | 500 |
| 107 | Eni | 850 | 8 | 4 | 850 | 150 | 200 | 300 | 60 | 60 | 500 |
| 108 | Iop | 850 | 8 | 4 | 850 | 150 | 300 | 60 | 60 | 60 | 500 |
| 109 | Cra | 850 | 8 | 4 | 850 | 150 | 250 | 250 | 60 | 150 | 500 |
| 110 | Sadi | 850 | 8 | 4 | 850 | 150 | 300 | 300 | 300 | 75 | 500 |
| 111 | Sacri | 1250 | 8 | 4 | 1250 | 150 | 150 | 150 | 150 | 150 | 500 |
| 112 | Panda | 850 | 8 | 4 | 850 | 150 | 250 | 250 | 250 | 250 | 500 |

### Détail des sorts par classe

#### 1. Feca (morph #101)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | Armure Incandescente | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 5 | 0 | 0 | Norm: Réduit les dommages élémentaires [14, 4 tours, Cercle (taille 2), pas les ennemis]<br>CC: Réduit les dommages élémentaires [15, 4 tours, Cercle (taille 2), pas les ennemis] |
| 2 | 2 | Aveuglement | 3 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 1 | Norm: Dommage Neutre [6 à 15, Point (taille 0)] ; Retrait PA [2 à 3, 1 tours, Point (taille 0)]<br>CC: Dommage Neutre [16, Point (taille 0)] ; Retrait PA [3, 1 tours, Point (taille 0)] |
| 3 | 3 | Attaque Naturelle | 3 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [9 à 13, Point (taille 0)]<br>CC: Dommage Feu [15, Point (taille 0)] |
| 4 | 4 | Renvoi de Sort | 3 | 0–6 | oui | non | non | — | 1/100 | 6 | 0 | 0 | Norm: Renvoie de sort [1 tours, Point (taille 0)] |
| 5 | 5 | Trêve | 4 | 0–0 | non | non | non | 1/40 | 1/100 | 8 | 0 | 0 | Norm: Dommages réduits [900, 2 tours, Cercle (taille 63)]<br>CC: Dommages réduits [1000, 2 tours, Cercle (taille 63)] |
| 6 | 6 | Armure Terrestre | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 5 | 0 | 0 | Norm: Réduit les dommages élémentaires [16, 4 tours, Cercle (taille 2), pas les ennemis]<br>CC: Réduit les dommages élémentaires [17, 4 tours, Cercle (taille 2), pas les ennemis] |
| 7 | 7 | Bouclier Féca | 3 | 0–1 | non | oui | oui | 1/40 | 1/100 | 6 | 0 | 0 | Norm: Résist. % terre [45, 4 tours, Point (taille 0)] ; Résist. % eau [45, 4 tours, Point (taille 0)] ; Résist. % air [45, 4 tours, Point (taille 0)] ; Résist. % feu [45, 4 tours, Point (taille 0)] ; Résist. % neutre [45, 4 tours, Point (taille 0)]<br>CC: Résist. % terre [55, 4 tours, Point (taille 0)] ; Résist. % eau [55, 4 tours, Point (taille 0)] ; Résist. % air [55, 4 tours, Point (taille 0)] ; Résist. % feu [55, 4 tours, Point (taille 0)] ; Résist. % neutre [55, 4 tours, Point (taille 0)] |
| 8 | 8 | Retour du bâton | 3 | 1–3 | non | oui | oui | 1/35 | 1/100 | — | 0 | 2 | Norm: Dommage Neutre [21 à 35, Point (taille 0)] ; Vol Force [20, 3 tours, Point (taille 0)]<br>CC: Dommage Neutre [31 à 37, Point (taille 0)] ; Vol Force [20, 4 tours, Point (taille 0)] |
| 9 | 9 | Attaque Nuageuse | 4 | 1–6 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [11 à 22, Point (taille 0)]<br>CC: Dommage Feu [25, Point (taille 0)] |
| 10 | 10 | Glyphe Enflammé | 3 | 1–5 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Crée une glyphe [2 tours, Cercle (taille 3)] |
| 11 | 11 | Téléportation | 4 | 1–9 | non | non | non | — | 1/100 | 6 | 0 | 0 | Norm: Téléportation [1 tours, Point (taille 0)] |
| 12 | 12 | Glyphe d'Aveuglement | 3 | 0–5 | non | oui | non | — | 1/100 | — | 1 | 0 | Norm: Crée une glyphe [3 tours, Cercle (taille 3)] |
| 13 | 13 | Glyphe de Silence | 4 | 0–3 | non | oui | non | — | 1/100 | 6 | 0 | 0 | Norm: Crée une glyphe [3 tours, Cercle (taille 3)] |
| 14 | 14 | Armure Venteuse | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 5 | 0 | 0 | Norm: +Esquive PM [50, 4 tours, Cercle (taille 2), pas les ennemis] ; Réduit les dommages élémentaires [16, 4 tours, Cercle (taille 2), pas les ennemis]<br>CC: +Esquive PM [55, 4 tours, Cercle (taille 2), pas les ennemis] ; Réduit les dommages élémentaires [17, 4 tours, Cercle (taille 2), pas les ennemis] |
| 15 | 15 | Glyphe d'immobilisation | 3 | 0–6 | non | non | oui | — | — | 5 | 0 | 0 | Norm: Crée une glyphe [3 tours, Cercle (taille 4)] |
| 16 | 16 | Science du bâton | 2 | 0–6 | oui | non | non | 1/40 | 1/100 | 6 | 0 | 0 | Norm: Dommages physiques [25, 5 tours, Point (taille 0)]<br>CC: Dommages physiques [30, 5 tours, Point (taille 0)] |
| 17 | 17 | Glyphe Agressif | 3 | 1–8 | oui | non | non | — | 1/100 | 2 | 0 | 0 | Norm: Crée une glyphe [4 tours, Cercle (taille 2)] |
| 18 | 18 | Armure Aqueuse | 2 | 0–0 | non | oui | non | 1/50 | 1/100 | 5 | 0 | 0 | Norm: +Esquive PA [50, 4 tours, Cercle (taille 2), pas les ennemis] ; Réduit les dommages élémentaires [16, 4 tours, Cercle (taille 2), pas les ennemis]<br>CC: +Esquive PA [55, 4 tours, Cercle (taille 2), pas les ennemis] ; Réduit les dommages élémentaires [17, 4 tours, Cercle (taille 2), pas les ennemis] |
| 19 | 19 | Bulle | 3 | 4–8 | oui | non | oui | 1/45 | 1/100 | — | 0 | 2 | Norm: Dommage Eau [16 à 24, Point (taille 0)]<br>CC: Dommage Eau [18 à 26, Point (taille 0)] |
| 20 | 20 | Immunité | 3 | 0–6 | oui | non | non | — | 1/100 | 6 | 0 | 0 | Norm: Dommages réduits [1500, 1 tours, Point (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 390 | Maîtrise des Bâtons | 2 | 0–0 | non | non | oui | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 422 | Mise en garde | 1 | 0–7 | oui | non | non | 1/40 | 1/100 | — | 6 | 1 | Norm: Résist. % terre [25, 1 tours, Point (taille 0)] ; Résist. % eau [25, 1 tours, Point (taille 0)] ; Résist. % air [25, 1 tours, Point (taille 0)] ; Résist. % feu [25, 1 tours, Point (taille 0)] ; Résist. % neutre [25, 1 tours, Point (taille 0)] ; Applique l'État X [1 tours, Point (taille 0)]<br>CC: Résist. % terre [30, 1 tours, Point (taille 0)] ; Résist. % eau [30, 1 tours, Point (taille 0)] ; Résist. % air [30, 1 tours, Point (taille 0)] ; Résist. % feu [30, 1 tours, Point (taille 0)] ; Résist. % neutre [30, 1 tours, Point (taille 0)] ; Applique l'État X [1 tours, Point (taille 0)] |

#### 2. Osamodas (morph #102)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 21 | Griffe Spectrale | 4 | 1–7 | oui | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [13 à 22, Point (taille 0)]<br>CC: Dommage Feu [24, Point (taille 0)] |
| 2 | 22 | Déplacement Félin | 1 | 1–9 | oui | non | oui | 1/40 | 1/100 | 5 | 0 | 0 | Norm: +PM [4, 10 tours, Croix (taille 1), seulement invocations] ; +PM [2, 2 tours, Croix (taille 1), pas le lanceur, pas les invocations]<br>CC: +PM [5, 10 tours, Croix (taille 1), seulement invocations] ; +PM [3, 2 tours, Croix (taille 1), pas le lanceur, pas les invocations] |
| 3 | 23 | Cri de l'Ours | 1 | 1–9 | oui | non | oui | 1/40 | 1/100 | 2 | 0 | 0 | Norm: +Dommages [9 à 16, 11 tours, Croix (taille 1), seulement invocations] ; +Dommages [8, 2 tours, Croix (taille 1), pas le lanceur, pas les invocations]<br>CC: +Dommages [24, 11 tours, Croix (taille 1), seulement invocations] ; +Dommages [12, 2 tours, Croix (taille 1), pas le lanceur, pas les invocations] |
| 4 | 24 | Corbeau | 3 | 1–9 | oui | non | non | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 10, Point (taille 0)]<br>CC: Dommage Feu [12, Point (taille 0)] |
| 5 | 25 | Soin Animal | 4 | 1–9 | oui | non | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Soin [35 à 40, Point (taille 0), seulement invocations] ; Soin [29 à 35, Point (taille 0), pas le lanceur, pas les invocations]<br>CC: Soin [69 à 80, Point (taille 0), seulement invocations] ; Soin [35 à 36, Point (taille 0), pas le lanceur, pas les invocations] |
| 6 | 26 | Bénédiction Animale | 2 | 0–1 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: +Créa invocation [5, 5 tours, Point (taille 0)]<br>CC: +Créa invocation [6, 5 tours, Point (taille 0)] |
| 7 | 27 | Piqûre Motivante | 3 | 1–9 | oui | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: +PA [4, 5 tours, Croix (taille 1), seulement invocations] ; +PA [2, 2 tours, Croix (taille 1), pas le lanceur, pas les invocations]<br>CC: +PA [5, 5 tours, Croix (taille 1), seulement invocations] ; +PA [2, 3 tours, Croix (taille 1), pas le lanceur, pas les invocations] |
| 8 | 28 | Crapaud | 1 | 1–9 | oui | non | oui | 1/50 | 1/100 | 3 | 0 | 1 | Norm: Dommages réduits [21, 8 tours, Point (taille 0), seulement invocations] ; Dommages réduits [14, 2 tours, Point (taille 0), pas le lanceur, pas les invocations]<br>CC: Dommages réduits [28, 8 tours, Point (taille 0), seulement invocations] ; Dommages réduits [19, 2 tours, Point (taille 0), pas le lanceur, pas les invocations] |
| 9 | 29 | Crocs du Mulou | 2 | 1–9 | oui | non | oui | 1/40 | 1/100 | 4 | 0 | 0 | Norm: %dommages [100, 7 tours, Croix (taille 1), seulement invocations] ; %dommages [55, 2 tours, Croix (taille 1), pas le lanceur, pas les invocations]<br>CC: %dommages [120, 7 tours, Croix (taille 1), seulement invocations] ; %dommages [60, 3 tours, Croix (taille 1), pas le lanceur, pas les invocations] |
| 10 | 30 | Fouet | 1 | 1–10 | oui | non | non | 1/50 | 1/100 | — | 1 | 1 | Norm: Dommage Neutre [301 à 305, Point (taille 0), seulement invocations]<br>CC: Dommage Neutre [601 à 610, Point (taille 0), seulement invocations] |
| 11 | 31 | Invocation de Dragonnet Rouge | 5 | 1–1 | non | non | oui | — | — | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 12 | 32 | Résistance Naturelle | 1 | 1–9 | oui | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: +Vitalité [201 à 250, 7 tours, Point (taille 0), seulement invocations] ; +Vitalité [201 à 250, 5 tours, Point (taille 0), pas le lanceur, pas les invocations]<br>CC: +Vitalité [275, 7 tours, Point (taille 0), seulement invocations] ; +Vitalité [275, 5 tours, Point (taille 0), pas le lanceur, pas les invocations] |
| 13 | 33 | Griffe Cinglante | 3 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Eau [11 à 14, Point (taille 0)]<br>CC: Dommage Eau [14 à 17, Point (taille 0)] |
| 14 | 34 | Invocation de Tofu | 4 | 1–1 | non | non | oui | — | — | — | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 15 | 35 | Invocation de Bouftou | 4 | 1–1 | non | oui | oui | — | — | 2 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 16 | 36 | Frappe du Craqueleur | 4 | 1–1 | non | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [18 à 37, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [39, Cercle (taille 2), pas le lanceur] |
| 17 | 37 | Invocation de Prespic | 4 | 1–3 | non | oui | oui | — | — | 4 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 18 | 38 | Invocation de Sanglier | 5 | 1–1 | non | oui | oui | — | — | 3 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 19 | 39 | Invocation de Bwork Mage | 4 | 1–1 | non | non | oui | — | — | 4 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 20 | 40 | Invocation de Craqueleur | 5 | 1–2 | non | non | oui | — | — | 4 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 393 | Maîtrise des Marteaux | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 420 | Laisse Spirituelle | 6 | 1–6 | oui | non | oui | — | — | 7 | 0 | 0 | Norm: Laisse spirituelle [60, Point (taille 0)] |

#### 3. Enutrof (morph #103)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 41 | Sac Animé | 1 | 1–1 | non | non | non | — | 1/100 | 7 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 2 | 42 | Chance | 2 | 0–1 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: +Chance [61 à 70, 5 tours, Point (taille 0)]<br>CC: +Chance [120, 5 tours, Point (taille 0)] |
| 3 | 43 | Lancer de Pelle | 4 | 1–8 | oui | non | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [11 à 16, Point (taille 0)]<br>CC: Dommage Terre [25, Point (taille 0)] |
| 4 | 44 | Roulage de Pelle | 3 | 1–8 | oui | non | non | 1/40 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [9 à 15, Point (taille 0)]<br>CC: Dommage Feu [15, Point (taille 0)] |
| 5 | 45 | Clé Réductrice | 1 | 1–10 | oui | non | oui | 1/50 | 1/100 | 5 | 0 | 1 | Norm: Malus PO [5, 5 tours, Point (taille 0)]<br>CC: Malus PO [5, 6 tours, Point (taille 0)] |
| 6 | 46 | Désinvocation | 3 | 1–6 | oui | non | oui | 1/50 | 1/100 | — | 0 | 1 | Norm: Dommage Air [71 à 130, Point (taille 0), seulement invocations]<br>CC: Dommage Air [130, Point (taille 0), seulement invocations] |
| 7 | 47 | Boîte de Pandore | 2 | 0–8 | oui | non | non | 1/50 | 1/100 | 3 | 0 | 0 | Norm: Soin [30, 50%, Point (taille 0)] ; +CC [10, 3 tours, 50%, Point (taille 0)]<br>CC: Soin [40, 50%, Point (taille 0)] ; +CC [11, 3 tours, 50%, Point (taille 0)] |
| 8 | 48 | Remblai | 4 | 2–8 | oui | non | oui | 1/30 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [7 à 12, Croix (taille 3)]<br>CC: Dommage Terre [15, Croix (taille 3)] |
| 9 | 49 | Pelle Fantomatique | 4 | 0–9 | oui | non | oui | 1/10 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [16 à 20, Point (taille 0)]<br>CC: Dommage Feu [20, Point (taille 0)] ; Enlève les envoûtements [Point (taille 0)] |
| 10 | 50 | Maladresse | 1 | 1–13 | oui | non | oui | 1/50 | 1/100 | — | 0 | 1 | Norm: Retrait PM [3, 1 tours, Point (taille 0)]<br>CC: Retrait PM [4, 1 tours, Point (taille 0)] |
| 11 | 51 | Lancer de Pièces | 2 | 0–12 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Eau [1 à 8, Point (taille 0)]<br>CC: Dommage Eau [16, Point (taille 0)] |
| 12 | 52 | Cupidité | 3 | 0–0 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: +Force [150, 5 tours, Cercle (taille 63)] ; +Intelligence [150, 5 tours, Cercle (taille 63)]<br>CC: +Force [200, 5 tours, Cercle (taille 63)] ; +Intelligence [200, 5 tours, Cercle (taille 63)] |
| 13 | 53 | Force de l'Age | 4 | 1–4 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 1 | Norm: Vol PM [1, Point (taille 0)] ; Dommage Air [21 à 25, Point (taille 0)]<br>CC: Vol PM [2, Point (taille 0)] ; Dommage Air [25, Point (taille 0)] |
| 14 | 54 | Maladresse de Masse | 5 | 0–0 | non | non | oui | 1/50 | 1/100 | 10 | 0 | 0 | Norm: Retrait PA [1 à 3, 3 tours, Cercle (taille 8)]<br>CC: Retrait PA [2 à 4, 3 tours, Cercle (taille 8)] |
| 15 | 55 | Accélération | 3 | 0–63 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: +PM [3, 3 tours, Point (taille 0)]<br>CC: +PM [4, 3 tours, Point (taille 0)] |
| 16 | 56 | Pelle du Jugement | 4 | 1–7 | oui | non | oui | 1/5 | 1/100 | — | 0 | 0 | Norm: Dommage Eau [12 à 20, Point (taille 0)]<br>CC: Dommage Eau [15 à 23, Point (taille 0)] ; Retrait PM [3, 1 tours, Point (taille 0)] |
| 17 | 57 | Pelle Animée | 2 | 1–1 | oui | non | non | — | 1/100 | 5 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 18 | 58 | Pelle Massacrante | 5 | 1–7 | oui | non | oui | 1/50 | 1/100 | — | 0 | 1 | Norm: Dommage Eau [45 à 50, Point (taille 0)]<br>CC: Dommage Eau [53 à 58, Point (taille 0)] |
| 19 | 59 | Corruption | 7 | 1–5 | non | non | oui | 1/50 | 1/100 | 5 | 1 | 0 | Norm: Soin [100, Point (taille 0), pas les alliés] ; Soin [260, Point (taille 0), pas les ennemis] ; Passe le tour [Point (taille 0)] ; Applique l'État X [4 tours, Cercle (taille 63), pas les ennemis]<br>CC: Soin [80, Point (taille 0), pas les alliés] ; Soin [280, Point (taille 0), pas les ennemis] ; Passe le tour [Point (taille 0)] ; Applique l'État X [4 tours, Cercle (taille 63), pas les ennemis] |
| 20 | 60 | Coffre Animé | 4 | 1–8 | non | non | oui | — | 1/100 | 63 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 396 | Maîtrise des Pelles | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 425 | Retraite anticipée | 4 | 0–0 | non | oui | oui | — | 1/100 | 7 | 0 | 0 | Norm: Perte PM non esquivable [100, 1 tours, Cercle (taille 63)] ; Applique l'État X [1 tours, Cercle (taille 63)] ; Applique l'État X [5 tours, Cercle (taille 63)] |

#### 4. Sram (morph #104)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 61 | Sournoiserie | 3 | 1–5 | oui | non | oui | 1/30 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [11 à 13, Point (taille 0)]<br>CC: Dommage Terre [20, Point (taille 0)] |
| 2 | 62 | Concentration de Chakra | 3 | 0–1 | non | non | oui | 1/50 | 1/100 | 6 | 0 | 0 | Norm: +Force [80, 5 tours, Point (taille 0)]<br>CC: +Force [110, 5 tours, Point (taille 0)] |
| 3 | 63 | Coup Sournois | 3 | 1–1 | non | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Repousse TODO cases [Point (taille 0)] ; Dommage Terre [12 à 16, Point (taille 0)]<br>CC: Repousse TODO cases [Point (taille 0)] ; Dommage Terre [17 à 21, Point (taille 0)] |
| 4 | 64 | Repérage | 2 | 0–6 | oui | non | oui | 1/30 | 1/100 | 2 | 0 | 0 | Norm: Bonus PO [1, 2 tours, Point (taille 0)] ; Perception [Cercle (taille 8)]<br>CC: Bonus PO [2, 2 tours, Point (taille 0)] ; Perception [Cercle (taille 8)] |
| 5 | 65 | Piège Sournois | 2 | 1–8 | oui | non | non | — | 1/100 | — | 6 | 0 | Norm: Crée un piège [Cercle (taille 0)] |
| 6 | 66 | Poison insidieux | 3 | 1–4 | oui | oui | non | 1/40 | 1/100 | — | 0 | 1 | Norm: Dommage Air [8 à 9, 2 tours, Point (taille 0)]<br>CC: Dommage Air [10 à 11, 2 tours, Point (taille 0)] |
| 7 | 67 | Peur | 2 | 2–7 | non | oui | non | — | 1/100 | — | 0 | 0 | Norm: Pousse jusqu'à la case [Point (taille 0)] |
| 8 | 68 | Fourvoiement | 4 | 0–0 | non | non | oui | 1/30 | 1/100 | — | 0 | 0 | Norm: Dommage Air [11 à 25, Croix (taille 1), pas le lanceur] ; Vol Agilité [25, 3 tours, Croix (taille 1), pas le lanceur] ; Vol Force [25, 3 tours, Croix (taille 1), pas le lanceur]<br>CC: Dommage Air [16 à 30, Croix (taille 1), pas le lanceur] ; Vol Agilité [30, 3 tours, Croix (taille 1), pas le lanceur] ; Vol Force [30, 3 tours, Croix (taille 1), pas le lanceur] |
| 9 | 69 | Piège d'Immobilisation | 4 | 1–5 | oui | oui | non | — | 1/100 | 5 | 0 | 0 | Norm: Crée un piège [Cercle (taille 3)] |
| 10 | 70 | Arnaque | 3 | 1–3 | oui | oui | oui | 1/30 | 1/100 | — | 0 | 2 | Norm: Dommage Air [18 à 32, Point (taille 0)] ; Vol de kamas [1 à 250, Point (taille 0)]<br>CC: Dommage Air [35, Point (taille 0)] ; Vol de kamas [1 à 500, Point (taille 0)] |
| 11 | 71 | Piège Empoisonné | 3 | 1–4 | oui | non | non | — | 1/100 | 2 | 0 | 0 | Norm: Crée un piège [Cercle (taille 1)] |
| 12 | 72 | Invisibilité | 2 | 0–0 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: +PM [2, 3 tours, Point (taille 0)] ; Invisibilité [3 tours, Point (taille 0)] |
| 13 | 73 | Piège répulsif | 3 | 1–7 | oui | non | non | — | 1/100 | 1 | 0 | 0 | Norm: Crée un piège [Cercle (taille 1)] |
| 14 | 74 | Double | 2 | 1–1 | non | oui | oui | — | 1/100 | 6 | 0 | 0 | Norm: Double du Sram [Point (taille 0)] |
| 15 | 75 | Pulsion de Chakra | 3 | 0–1 | non | non | non | 1/30 | 1/100 | 6 | 0 | 0 | Norm: +CC [10, 4 tours, Point (taille 0)]<br>CC: +CC [10, 5 tours, Point (taille 0)] |
| 16 | 76 | Attaque Mortelle | 4 | 1–2 | non | non | oui | 1/90 | 1/100 | — | 0 | 2 | Norm: Dommage Terre [41 à 60, Point (taille 0)]<br>CC: Dommage Terre [131 à 150, Point (taille 0)] |
| 17 | 77 | Piège de Silence | 3 | 1–4 | oui | oui | non | — | 1/100 | 4 | 0 | 0 | Norm: Crée un piège [Cercle (taille 2)] |
| 18 | 78 | Invisibilité d'Autrui | 2 | 1–6 | oui | non | oui | — | 1/100 | 5 | 0 | 0 | Norm: Invisibilité [3 tours, Point (taille 0), pas les ennemis] |
| 19 | 79 | Piège de Masse | 4 | 1–5 | oui | oui | non | — | 1/100 | — | 1 | 0 | Norm: Crée un piège [Cercle (taille 2)] |
| 20 | 80 | Piège Mortel | 3 | 1–4 | oui | oui | non | — | 1/100 | — | 2 | 0 | Norm: Crée un piège [Cercle (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 395 | Maîtrise des Dagues | 2 | 0–0 | non | non | oui | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 416 | Poisse | 3 | 1–1 | non | non | oui | — | 1/100 | 5 | 0 | 0 | Norm: Minimise les effets aléatoires [2 tours, Point (taille 0)] |

#### 5. Xel (morph #105)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 81 | Ralentissement | 1 | 3–9 | oui | non | oui | — | 1/100 | — | 4 | 1 | Norm: Retrait PA [3, 1 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 2 | 82 | Contre | 2 | 0–1 | non | non | oui | 1/50 | 1/100 | 6 | 1 | 0 | Norm: Renvoie de dommages [8, 3 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)]<br>CC: Renvoie de dommages [9, 3 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 3 | 83 | Aiguille | 4 | 1–8 | oui | non | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [12 à 22, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)]<br>CC: Dommage Feu [25, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 4 | 84 | Gelure | 3 | 3–6 | oui | non | oui | 1/40 | 1/100 | — | 0 | 1 | Norm: Dommage Air [10 à 15, Point (taille 0)] ; Retrait PA [2, 1 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)]<br>CC: Dommage Air [16, Point (taille 0)] ; Retrait PA [2, 1 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 5 | 85 | Flou | 3 | 4–4 | non | non | oui | — | 1/100 | 5 | 0 | 0 | Norm: Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Perte PA non esquivable [2, 2 tours, Cercle (taille 4)] ; Pas d'effet [90%, Point (taille 0)] ; Applique l'État X [5 tours, Cercle (taille 63)] |
| 6 | 86 | Aiguille Chercheuse | 3 | 1–1 | non | non | non | — | 1/100 | — | 0 | 0 | Norm: Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Invoque une créature [Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 7 | 87 | Démotivation | 1 | 1–14 | non | non | non | — | 1/100 | — | 0 | 1 | Norm: Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; -Esquive PA [8, 8 tours, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 8 | 88 | Téléportation | 4 | 1–63 | non | non | non | — | 1/100 | 15 | 0 | 0 | Norm: Téléportation [1 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 9 | 89 | Dévouement | 2 | 0–0 | non | non | oui | — | 1/100 | 3 | 0 | 0 | Norm: Retrait PA [2, 1 tours, Point (taille 0), seulement le lanceur] ; +PA [2, 2 tours, Croix (taille 3), pas les ennemis] ; Bonus PA (lanceur) [1, 10%, Point (taille 0), seulement le lanceur] ; Pas d'effet [90%, Point (taille 0), seulement le lanceur] |
| 10 | 90 | Fuite | 1 | 1–1 | non | non | non | — | 1/100 | — | 3 | 0 | Norm: Téléportation [Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 11 | 91 | Frappe de Xélor | 4 | 1–5 | non | oui | oui | 1/40 | 1/100 | — | 0 | 2 | Norm: Dommage Terre [41 à 45, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)]<br>CC: Dommage Terre [46 à 50, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 12 | 92 | Rayon Obscur | 4 | 1–9 | oui | oui | oui | 1/35 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [13 à 29, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Vol PO [1, 1 tours, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)]<br>CC: Dommage Feu [18 à 34, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Vol PO [1, 2 tours, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 13 | 93 | Flétrissement | 3 | 1–8 | non | oui | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Dommage Air [15 à 24, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)]<br>CC: Dommage Air [17 à 26, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 14 | 94 | Protection Aveuglante | 2 | 0–1 | non | non | non | — | 1/100 | 6 | 0 | 0 | Norm: Renvoie de dommages [8, 3 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; +Esquive PA [80, 3 tours, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 15 | 95 | Horloge | 4 | 1–4 | non | oui | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Vol PA [1, Point (taille 0)] ; Dommage Eau [31 à 35, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)]<br>CC: Vol PA [1 à 2, Point (taille 0)] ; Dommage Eau [36 à 40, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 16 | 96 | Poussière Temporelle | 5 | 0–7 | oui | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [9 à 20, Cercle (taille 2)] ; Retrait PA [1, 1 tours, Cercle (taille 2)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)]<br>CC: Dommage Feu [16 à 27, Cercle (taille 2)] ; Retrait PA [2, 1 tours, Cercle (taille 2)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 17 | 97 | Cadran de Xélor | 1 | 1–6 | oui | non | oui | — | 1/100 | 5 | 0 | 0 | Norm: Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Invoque une créature [Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 18 | 98 | Vol du Temps | 4 | 3–6 | non | non | oui | — | 1/100 | — | 0 | 2 | Norm: Vol PA [2, 1 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 19 | 99 | Momification | 5 | 0–0 | non | non | non | — | 1/100 | 15 | 0 | 0 | Norm: Dommages réduits [28, 5 tours, Point (taille 0)] ; Dommages réduits [28, 5 tours, Point (taille 0)] ; +Dommages [10, 5 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Change l'apparence [5 tours, Point (taille 0)] ; +Esquive PA [100, 5 tours, Point (taille 0)] ; Perte PM non esquivable [1, 5 tours, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 20 | 100 | Sablier de Xélor | 2 | 3–7 | oui | oui | non | 1/45 | 1/100 | — | 0 | 1 | Norm: Dommage Feu [6 à 13, Point (taille 0)] ; Retrait PA [2, 1 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)]<br>CC: Dommage Feu [11 à 18, Point (taille 0)] ; Retrait PA [2, 1 tours, Point (taille 0)] ; Bonus PA (lanceur) [1, 10%, Point (taille 0)] ; Pas d'effet [90%, Point (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 393 | Maîtrise des Marteaux | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 424 | Raulebaque | 6 | 0–0 | non | oui | oui | — | 1/100 | 7 | 0 | 0 | Norm: Raulebaque [Cercle (taille 63)] |

#### 6. Eca (morph #106)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 101 | Roulette | 1 | 0–0 | non | non | non | 1/50 | 1/100 | 1 | 2 | 0 | Norm: Soin [5000, 3%, Point (taille 0), seulement le lanceur] ; +PA [2 à 3, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +PA [2 à 3, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +PA [2 à 3, 1 tours, 3%, Cercle (taille 63)] ; +PA [1, Point (taille 0), seulement le lanceur] ; +Dommages [50, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Dommages [50, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Dommages [50, 1 tours, 3%, Cercle (taille 63)] ; +CC [50, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +CC [50, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +CC [50, 1 tours, 3%, Cercle (taille 63)] ; Bonus PO [5, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; Bonus PO [5, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; Bonus PO [5, 1 tours, 3%, Cercle (taille 63)] ; +Force [400, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Force [400, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Force [400, 1 tours, 3%, Cercle (taille 63)] ; +Agilité [400, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Agilité [400, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Agilité [400, 1 tours, 3%, Cercle (taille 63)] ; +Chance [400, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Chance [400, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Chance [400, 1 tours, 3%, Cercle (taille 63)] ; +Intelligence [400, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Intelligence [400, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Intelligence [400, 1 tours, 3%, Cercle (taille 63)] ; +PM [2 à 3, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +PM [2 à 3, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +PM [2 à 3, 1 tours, 3%, Cercle (taille 63)] ; Enlève les envoûtements [2%, Cercle (taille 63), pas les ennemis] ; Enlève les envoûtements [2%, Cercle (taille 63), seulement le lanceur] ; Enlève les envoûtements [2%, Cercle (taille 63)] ; Passe le tour [3%, Cercle (taille 63), pas les ennemis] ; Passe le tour [3%, Cercle (taille 63), seulement le lanceur] ; Passe le tour [3%, Cercle (taille 63)] ; +Soins [50, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Soins [50, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Soins [50, 1 tours, 3%, Cercle (taille 63)]<br>CC: Soin [5000, 3%, Cercle (taille 63), pas les ennemis] ; +PA [3, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +PA [3, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +PA [3, 1 tours, 3%, Cercle (taille 63)] ; +PA [1, Point (taille 0), seulement le lanceur] ; +Dommages [60, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Dommages [60, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Dommages [60, 1 tours, 3%, Cercle (taille 63)] ; +CC [60, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +CC [60, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +CC [60, 1 tours, 3%, Cercle (taille 63)] ; Bonus PO [6, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; Bonus PO [6, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; Bonus PO [6, 1 tours, 3%, Cercle (taille 63)] ; +Force [500, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Force [500, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Force [500, 1 tours, 3%, Cercle (taille 63)] ; +Agilité [500, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Agilité [500, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Agilité [500, 1 tours, 3%, Cercle (taille 63)] ; +Chance [500, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Chance [500, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Chance [500, 1 tours, 3%, Cercle (taille 63)] ; +Intelligence [500, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Intelligence [500, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Intelligence [500, 1 tours, 3%, Cercle (taille 63)] ; +PM [3, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +PM [3, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +PM [3, 1 tours, 3%, Cercle (taille 63)] ; Enlève les envoûtements [2%, Cercle (taille 63), pas les ennemis] ; Enlève les envoûtements [2%, Cercle (taille 63), seulement le lanceur] ; Enlève les envoûtements [2%, Cercle (taille 63)] ; Passe le tour [3%, Cercle (taille 63), pas les ennemis] ; Passe le tour [3%, Cercle (taille 63), seulement le lanceur] ; Passe le tour [3%, Cercle (taille 63)] ; +Soins [60, 1 tours, 3%, Cercle (taille 63), pas les ennemis] ; +Soins [60, 1 tours, 3%, Cercle (taille 63), seulement le lanceur] ; +Soins [60, 1 tours, 3%, Cercle (taille 63)] |
| 2 | 102 | Pile ou Face | 3 | 0–7 | oui | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [6 à 19, Point (taille 0)] ; Soin [5 à 12, Point (taille 0), pas les alliés] ; Soin [8 à 22, Point (taille 0), pas les ennemis]<br>CC: Dommage Terre [9 à 24, Point (taille 0)] ; Soin [1 à 5, Point (taille 0), pas les alliés] ; Soin [23 à 27, Point (taille 0), pas les ennemis] |
| 3 | 103 | Chance d'Ecaflip | 2 | 0–6 | oui | non | oui | 1/50 | 1/100 | 5 | 0 | 0 | Norm: Chance dommages subis/soins [3 tours, Point (taille 0), pas les ennemis]<br>CC: Chance dommages subis/soins [3 tours, Point (taille 0), pas les ennemis] |
| 4 | 104 | Trèfle | 2 | 0–1 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: +CC [10, 5 tours, Point (taille 0)]<br>CC: +CC [11, 5 tours, Point (taille 0)] |
| 5 | 105 | Bond du Félin | 1 | 1–1 | non | non | oui | — | 1/100 | — | 5 | 0 | Norm: Téléportation [Point (taille 0)] |
| 6 | 106 | Roue de la Fortune | 2 | 0–1 | non | non | non | 1/50 | 1/100 | 4 | 0 | 0 | Norm: Dommage Neutre %vie [1 à 5, Point (taille 0), seulement le lanceur] ; %dommages [100, 2 tours, Point (taille 0)]<br>CC: %dommages [200, 2 tours, Point (taille 0)] |
| 7 | 107 | Topkaj | 3 | 1–5 | oui | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [19 à 31, Point (taille 0)]<br>CC: Dommage Feu [22 à 34, Point (taille 0)] |
| 8 | 108 | Esprit Félin | 3 | 1–1 | non | non | non | 1/50 | 1/100 | — | 0 | 2 | Norm: Dommage Terre [36 à 50, Point (taille 0), pas le lanceur] ; Dommage Terre [36 à 50, 50%, Point (taille 0), seulement le lanceur] ; Pas d'effet [50%, Point (taille 0), seulement le lanceur]<br>CC: Dommage Terre [50, Point (taille 0), pas le lanceur] ; Dommage Terre [50, 50%, Point (taille 0), seulement le lanceur] ; Pas d'effet [50%, Point (taille 0), seulement le lanceur] |
| 9 | 109 | Bluff | 3 | 1–4 | non | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Eau [1 à 50, 50%, Point (taille 0)] ; Dommage Air [1 à 50, 50%, Point (taille 0)]<br>CC: Dommage Eau [55, 50%, Point (taille 0)] ; Dommage Air [55, 50%, Point (taille 0)] |
| 10 | 110 | Griffe Joueuse | 4 | 1–4 | oui | oui | non | 1/50 | 1/100 | — | 2 | 0 | Norm: Dommage Terre [24 à 29, Ligne (taille 3)]<br>CC: Dommage Terre [35, Ligne (taille 3)] |
| 11 | 111 | Contrecoup | 2 | 0–1 | non | oui | oui | — | 1/100 | 3 | 0 | 0 | Norm: Dommage Neutre %vie [1, 1 tours, Point (taille 0), seulement le lanceur] ; +Vitalité [140 à 250, 5 tours, Point (taille 0)] |
| 12 | 112 | Griffe de Ceangal | 4 | 1–1 | non | oui | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [21 à 45, Point (taille 0)]<br>CC: Dommage Terre [21 à 45, Point (taille 0)] ; Perte PA non esquivable [1, 8 tours, Point (taille 0)] |
| 13 | 113 | Perception | 2 | 0–0 | non | oui | oui | 1/40 | 1/100 | 1 | 0 | 0 | Norm: +Dommages [6 à 11, 2 tours, Point (taille 0)] ; Perception [Cercle (taille 9)]<br>CC: +Dommages [12, 2 tours, Point (taille 0)] ; Perception [Cercle (taille 9)] |
| 14 | 114 | Rekop | 4 | 1–4 | oui | non | oui | 1/2 | 1/100 | — | 0 | 0 | Norm: Retrait PA [1, 1 tours, Point (taille 0)]<br>CC: Dommage Eau [12 à 41, Point (taille 0)] ; Dommage Terre [12 à 41, Point (taille 0)] ; Dommage Air [12 à 41, Point (taille 0)] ; Dommage Feu [12 à 41, Point (taille 0)] |
| 15 | 115 | Odorat | 5 | 0–0 | non | non | non | 1/50 | 1/100 | 7 | 0 | 0 | Norm: +PA [2 à 5, 4 tours, Cercle (taille 6)] ; +PM [2 à 5, 4 tours, Cercle (taille 6)] ; Perte PA non esquivable [1 à 4, 4 tours, Cercle (taille 6)] ; Perte PM non esquivable [1 à 4, 4 tours, Cercle (taille 6)]<br>CC: +PA [2 à 5, 8 tours, Cercle (taille 6)] ; +PM [2 à 5, 8 tours, Cercle (taille 6)] ; Perte PA non esquivable [1 à 4, 8 tours, Cercle (taille 6)] ; Perte PM non esquivable [1 à 4, 8 tours, Cercle (taille 6)] |
| 16 | 116 | Langue Râpeuse | 4 | 1–4 | oui | non | oui | 1/30 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [16 à 25, Croix (taille 1)]<br>CC: Dommage Feu [18 à 27, Croix (taille 1)] ; Malus PO [2, 12 tours, Croix (taille 1)] |
| 17 | 117 | Griffe Invocatrice | 3 | 1–4 | non | oui | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 18 | 118 | Réflexes | 2 | 0–1 | non | oui | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: +Agilité [65 à 135, 5 tours, Point (taille 0)]<br>CC: +Agilité [70 à 210, 5 tours, Point (taille 0)] |
| 19 | 119 | Tout ou rien | 3 | 0–0 | non | non | non | 1/50 | 1/100 | 4 | 0 | 0 | Norm: Dommage Neutre [4 à 38, 2 tours, Cercle (taille 8)] ; Soin [4 à 38, 2 tours, Cercle (taille 8), pas les alliés] ; Soin [11 à 50, 2 tours, Cercle (taille 8), pas les ennemis]<br>CC: Dommage Neutre [7 à 76, 2 tours, Cercle (taille 8)] ; Soin [7 à 76, 2 tours, Cercle (taille 8), pas les alliés] ; Soin [21 à 100, 2 tours, Cercle (taille 8), pas les ennemis] |
| 20 | 120 | Destin d'Ecaflip | 4 | 1–1 | non | oui | oui | 1/20 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [13 à 37, Point (taille 0)]<br>CC: Repousse TODO cases [Point (taille 0)] ; Dommage Terre [13 à 75, Point (taille 0)] ; Perte PM non esquivable [1, 8 tours, Point (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 391 | Maîtrise des Epées | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 412 | Félintion | 4 | 4–4 | non | oui | oui | 1/50 | 1/100 | — | 0 | 1 | Norm: Repousse TODO cases [Point (taille 0), pas les alliés] ; Vol de vie Terre [19 à 28, Point (taille 0), pas les alliés] ; Soin [36 à 75, Point (taille 0), pas les ennemis]<br>CC: Repousse TODO cases [Point (taille 0), pas les alliés] ; Vol de vie Terre [29 à 33, Point (taille 0), pas les alliés] ; Soin [76 à 80, Point (taille 0), pas les ennemis] |

#### 7. Eni (morph #107)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 121 | Mot Curatif | 3 | 0–0 | non | non | non | 1/40 | 1/100 | — | 1 | 0 | Norm: Soin [17 à 25, Point (taille 0)]<br>CC: Soin [40, Point (taille 0)] |
| 2 | 122 | Mot Blessant | 3 | 1–8 | oui | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Air [16 à 18, Point (taille 0)]<br>CC: Dommage Air [19, Point (taille 0)] |
| 3 | 123 | Mot Drainant | 2 | 1–12 | oui | non | oui | 1/50 | 1/100 | — | 0 | 1 | Norm: Dommage Neutre %vie [2, Point (taille 0), seulement le lanceur] ; Retrait PA [2 à 3, 1 tours, Point (taille 0), pas le lanceur]<br>CC: Retrait PA [2 à 3, 1 tours, Point (taille 0), pas le lanceur] |
| 4 | 124 | Mot Soignant | 2 | 1–8 | oui | non | oui | 1/35 | 1/100 | — | 0 | 3 | Norm: Soin [11 à 14, Point (taille 0)]<br>CC: Soin [20, Point (taille 0)] |
| 5 | 125 | Mot Interdit | 3 | 1–4 | oui | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [11 à 16, Point (taille 0)]<br>CC: Dommage Feu [25, Point (taille 0)] |
| 6 | 126 | Mot Stimulant | 2 | 0–0 | non | non | oui | 1/50 | 1/100 | 5 | 0 | 0 | Norm: Dommage Neutre %vie [10, Point (taille 0), seulement le lanceur] ; +PA [2, 5 tours, Croix (taille 5), pas les ennemis]<br>CC: +PA [2 à 3, 5 tours, Croix (taille 5), pas les ennemis] |
| 7 | 127 | Mot de Prévention | 3 | 0–7 | oui | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Dommages réduits [30, 2 tours, Point (taille 0)]<br>CC: Dommages réduits [38, 2 tours, Point (taille 0)] |
| 8 | 128 | Mot de Frayeur | 1 | 1–5 | non | oui | oui | — | 1/100 | — | 0 | 3 | Norm: Repousse TODO cases [Point (taille 0)] |
| 9 | 129 | Mot d'Amitié | 3 | 1–3 | non | non | oui | — | — | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 10 | 130 | Mot Revitalisant | 2 | 0–4 | oui | non | oui | 1/50 | 1/100 | — | 3 | 0 | Norm: Soin [7 à 11, Cercle (taille 3)]<br>CC: Soin [12, Cercle (taille 3)] |
| 11 | 131 | Mot de Régénération | 3 | 0–3 | non | oui | oui | 1/50 | 1/100 | — | 0 | 1 | Norm: Soin [3 à 6, 5 tours, Point (taille 0)]<br>CC: Soin [6, 5 tours, Point (taille 0)] |
| 12 | 132 | Mot d'Epine | 2 | 0–1 | non | oui | non | 1/50 | 1/100 | 3 | 1 | 0 | Norm: Renvoie de dommages [1 à 9, 3 tours, Point (taille 0)]<br>CC: Renvoie de dommages [1 à 9, 6 tours, Point (taille 0)] |
| 13 | 133 | Mot de Jouvence | 3 | 0–11 | oui | non | oui | — | 1/100 | — | 0 | 0 | Norm: Enlève les envoûtements [Point (taille 0), pas les ennemis] |
| 14 | 134 | Mot Vampirique | 4 | 0–4 | oui | oui | oui | 1/45 | 1/100 | — | 0 | 2 | Norm: Vol de vie Eau [31 à 40, Point (taille 0)]<br>CC: Vol de vie Eau [41, Point (taille 0)] |
| 15 | 135 | Mot de Sacrifice | 4 | 1–6 | non | non | oui | 1/50 | 1/100 | — | 0 | 2 | Norm: Soin [36 à 45, Point (taille 0)] ; Dommage au lanceur [36 à 45, Point (taille 0)]<br>CC: Soin [36 à 45, Point (taille 0)] |
| 16 | 136 | Mot d'Immobilisation | 3 | 1–8 | oui | non | oui | 1/50 | 1/100 | 7 | 1 | 0 | Norm: Retrait PM [4, 3 tours, Point (taille 0)]<br>CC: Retrait PM [4, 4 tours, Point (taille 0)] |
| 17 | 137 | Mot d'Envol | 1 | 0–1 | non | oui | oui | 1/50 | 1/100 | — | 1 | 0 | Norm: Bonus PO [3, 1 tours, Point (taille 0)]<br>CC: Bonus PO [3, 2 tours, Point (taille 0)] |
| 18 | 138 | Mot de Silence | 3 | 0–1 | non | non | oui | 1/45 | 1/100 | 3 | 0 | 0 | Norm: Retrait PA [5, 1 tours, Cercle (taille 4)]<br>CC: Retrait PA [6, 1 tours, Cercle (taille 4)] |
| 19 | 139 | Mot d'Altruisme | 6 | 0–0 | non | non | oui | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Soin [80 à 125, Cercle (taille 63), pas les ennemis] ; Applique l'État X [5 tours, Cercle (taille 63), pas les ennemis]<br>CC: Soin [126, Cercle (taille 63), pas les ennemis] ; Applique l'État X [5 tours, Cercle (taille 63), pas les ennemis] |
| 20 | 140 | Mot de Reconstitution | 4 | 0–7 | oui | oui | oui | 1/45 | 1/100 | 7 | 0 | 0 | Norm: Soin [401 à 500, Point (taille 0)]<br>CC: Soin [851, Point (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 394 | Maîtrise des Baguettes | 2 | 0–0 | non | non | oui | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 427 | Mot Lotof | 6 | 0–7 | oui | non | non | — | 1/100 | 5 | 1 | 1 | Norm: Change l'apparence [1 tours, Point (taille 0), seulement le lanceur] ; Applique un sort [Point (taille 0), pas le lanceur] |

#### 8. Iop (morph #108)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 141 | Pression | 2 | 1–2 | non | non | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [9 à 13, Point (taille 0)]<br>CC: Dommage Terre [11 à 15, Point (taille 0)] |
| 2 | 142 | Bond | 5 | 1–6 | non | non | non | — | 1/100 | — | 0 | 0 | Norm: Téléportation [Point (taille 0)] |
| 3 | 143 | Intimidation | 2 | 1–1 | non | oui | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Repousse TODO cases [Point (taille 0)] ; Dommage Neutre [5 à 9, Point (taille 0)]<br>CC: Repousse TODO cases [Point (taille 0)] ; Dommage Neutre [6 à 10, Point (taille 0)] |
| 4 | 144 | Compulsion | 2 | 0–1 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: +Dommages [9 à 16, 5 tours, Point (taille 0)]<br>CC: +Dommages [11 à 18, 5 tours, Point (taille 0)] |
| 5 | 145 | Epée Divine | 3 | 0–0 | non | non | non | 1/40 | 1/100 | — | 0 | 0 | Norm: Dommage Air [11 à 20, Croix (taille 1), pas les alliés] ; +Dommages [3, 3 tours, Croix (taille 1), pas les ennemis]<br>CC: Dommage Air [21, Croix (taille 1), pas les alliés] |
| 6 | 146 | Epée du destin | 4 | 1–1 | non | oui | oui | 1/40 | 1/100 | — | 2 | 0 | Norm: Dommage Feu [10 à 17, Ligne (taille 63)]<br>CC: Dommage Feu [18, Ligne (taille 63)] |
| 7 | 147 | Guide de Bravoure | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 3 | 1 | 1 | Norm: +Dommages [5 à 10, 2 tours, Cercle (taille 63), pas les ennemis]<br>CC: +Dommages [20, 2 tours, Cercle (taille 63), pas les ennemis] |
| 8 | 148 | Amplification | 1 | 0–1 | non | non | non | 1/45 | 1/100 | — | 0 | 1 | Norm: +Dommages [11 à 12, 1 tours, Point (taille 0)]<br>CC: +Dommages [11 à 12, 2 tours, Point (taille 0)] |
| 9 | 149 | Mutilation | 2 | 0–0 | non | non | non | 1/45 | 1/100 | — | 5 | 0 | Norm: Dommage Neutre %vie [1, Point (taille 0), seulement le lanceur] ; %dommages [50, Point (taille 0)] ; Dommages physiques [50, Point (taille 0)]<br>CC: %dommages [60, Point (taille 0)] ; Dommages physiques [60, Point (taille 0)] |
| 10 | 150 | Couper | 3 | 1–3 | oui | oui | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [11 à 16, Ligne (taille 2)] ; Retrait PM [2, 1 tours, Ligne (taille 2)]<br>CC: Dommage Feu [20, Ligne (taille 2)] ; Retrait PM [2, 1 tours, Ligne (taille 2)] |
| 11 | 151 | Souffle | 2 | 2–8 | non | non | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1)] |
| 12 | 152 | Epée du Jugement | 4 | 1–3 | non | non | non | 1/40 | 1/100 | — | 0 | 0 | Norm: Vol de vie Eau [1 à 3, Point (taille 0)] ; Vol de vie Feu [1 à 3, Point (taille 0)] ; Dommage Air [1 à 40, Point (taille 0)]<br>CC: Vol de vie Eau [4, Point (taille 0)] ; Vol de vie Feu [4, Point (taille 0)] ; Dommage Air [1 à 45, Point (taille 0)] |
| 13 | 153 | Puissance | 4 | 0–2 | non | oui | oui | 1/50 | 1/100 | 5 | 0 | 0 | Norm: %dommages [100, 5 tours, Point (taille 0)]<br>CC: %dommages [100, 7 tours, Point (taille 0)] |
| 14 | 154 | Epée Destructrice | 4 | 1–2 | non | oui | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [11 à 40, Point (taille 0)] ; Malus CC [2 à 3, 2 tours, Point (taille 0)]<br>CC: Dommage Feu [41 à 42, Point (taille 0)] ; Malus CC [2 à 3, 3 tours, Point (taille 0)] |
| 15 | 155 | Vitalité | 3 | 0–1 | non | oui | non | 1/45 | 1/100 | 5 | 0 | 0 | Norm: +Vitalité [251 à 300, 20 tours, Point (taille 0)]<br>CC: +Vitalité [350, 20 tours, Point (taille 0)] |
| 16 | 156 | Tempête de Puissance | 3 | 3–5 | non | non | oui | 1/45 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [36 à 40, Point (taille 0)]<br>CC: Dommage Feu [41 à 45, Point (taille 0)] |
| 17 | 157 | Epée Céleste | 4 | 0–4 | non | oui | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Air [26 à 40, Cercle (taille 2)]<br>CC: Dommage Air [41 à 55, Cercle (taille 2)] |
| 18 | 158 | Concentration | 2 | 1–1 | non | oui | oui | 1/45 | 1/100 | — | 0 | 3 | Norm: Dommage Terre [13 à 21, Point (taille 0)]<br>CC: Dommage Terre [18 à 26, Point (taille 0)] |
| 19 | 159 | Colère de Iop | 7 | 1–1 | non | non | oui | 1/50 | 1/100 | 4 | 0 | 0 | Norm: Dommage Terre [51 à 70, Point (taille 0)] ; Boost dégâts après lancement [4 tours, Point (taille 0), seulement le lanceur]<br>CC: Dommage Terre [61 à 80, Point (taille 0)] ; Boost dégâts après lancement [4 tours, Point (taille 0), seulement le lanceur] |
| 20 | 160 | Epée de Iop | 4 | 1–4 | oui | oui | oui | 1/45 | 1/100 | — | 2 | 0 | Norm: Dommage Terre [13 à 39, Croix (taille 3), pas le lanceur]<br>CC: Dommage Terre [18 à 44, Croix (taille 3), pas le lanceur] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 391 | Maîtrise des Epées | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 410 | Brokle | 3 | 0–1 | non | non | non | 1/40 | 1/100 | 5 | 0 | 0 | Norm: Maximise les effets aléatoires [2 tours, Point (taille 0), pas le lanceur]<br>CC: Maximise les effets aléatoires [3 tours, Point (taille 0), pas le lanceur] |

#### 9. Cra (morph #109)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 161 | Flèche Magique | 4 | 1–12 | oui | non | oui | 1/30 | 1/100 | — | 0 | 2 | Norm: Dommage Feu [20 à 22, Point (taille 0)] ; Vol PO [2, 1 tours, Point (taille 0)]<br>CC: Dommage Feu [24 à 26, Point (taille 0)] ; Vol PO [2, 1 tours, Point (taille 0)] |
| 2 | 162 | Tir Critique | 2 | 0–6 | oui | non | oui | 1/40 | 1/100 | 5 | 0 | 0 | Norm: +CC [14, 3 tours, Point (taille 0)]<br>CC: +CC [14, 3 tours, Point (taille 0)] ; %dommages [50, 3 tours, Point (taille 0)] |
| 3 | 163 | Flèche Glacée | 3 | 1–10 | oui | non | oui | 1/40 | 1/100 | — | 0 | 2 | Norm: Dommage Feu [9 à 10, Point (taille 0)] ; Retrait PA [2, 1 tours, Point (taille 0)]<br>CC: Dommage Feu [12 à 13, Point (taille 0)] ; Retrait PA [2, 1 tours, Point (taille 0)] |
| 4 | 164 | Flèche Empoisonnée | 4 | 2–10 | oui | non | oui | 1/30 | 1/100 | — | 0 | 1 | Norm: Dommage Neutre [9 à 10, 2 tours, Point (taille 0)]<br>CC: Dommage Neutre [12, 2 tours, Point (taille 0)] |
| 5 | 165 | Flèche Enflammée | 4 | 1–8 | oui | oui | oui | 1/40 | 1/100 | — | 2 | 0 | Norm: Repousse TODO cases [Ligne (taille 4)] ; Dommage Feu [21 à 23, Ligne (taille 4)]<br>CC: Repousse TODO cases [Ligne (taille 4)] ; Dommage Feu [27 à 29, Ligne (taille 4)] |
| 6 | 166 | Tir Puissant | 3 | 0–6 | oui | non | oui | 1/40 | 1/100 | 6 | 0 | 0 | Norm: %dommages [250, 2 tours, Point (taille 0), pas les ennemis]<br>CC: %dommages [290, 2 tours, Point (taille 0), pas les ennemis] |
| 7 | 167 | Flèche d'Expiation | 4 | 8–10 | oui | non | oui | 1/30 | 1/100 | 3 | 0 | 0 | Norm: Dommage Eau [37 à 39, Point (taille 0)] ; Boost dégâts après lancement [3 tours, Point (taille 0), seulement le lanceur] ; Applique l'État X [1 tours, Point (taille 0)]<br>CC: Dommage Eau [43 à 45, Point (taille 0)] ; Boost dégâts après lancement [3 tours, Point (taille 0), seulement le lanceur] ; Applique l'État X [1 tours, Point (taille 0)] |
| 8 | 168 | Oeil de Taupe | 3 | 1–10 | oui | non | oui | 1/40 | 1/100 | 4 | 0 | 0 | Norm: Vol de vie Eau [15 à 17, Cercle (taille 3)] ; Malus PO [6, 3 tours, Cercle (taille 3)]<br>CC: Vol de vie Eau [19 à 21, Cercle (taille 3)] ; Malus PO [6, 3 tours, Cercle (taille 3)] |
| 9 | 169 | Flèche de Recul | 4 | 1–8 | non | oui | oui | 1/30 | 1/100 | — | 0 | 1 | Norm: Repousse TODO cases [Point (taille 0)] ; Dommage Air [18 à 21, Point (taille 0)]<br>CC: Repousse TODO cases [Point (taille 0)] ; Dommage Air [21 à 24, Point (taille 0)] |
| 10 | 170 | Flèche d'Immobilisation | 2 | 1–10 | oui | non | oui | 1/40 | 1/100 | — | 0 | 2 | Norm: Vol PM [1, Point (taille 0)] ; Dommage Eau [9 à 10, Point (taille 0)]<br>CC: Vol PM [1, Point (taille 0)] ; Dommage Eau [12 à 13, Point (taille 0)] |
| 11 | 171 | Flèche Punitive | 4 | 6–8 | oui | non | oui | 1/30 | 1/100 | 2 | 0 | 0 | Norm: Dommage Terre [31 à 33, Point (taille 0)] ; Boost dégâts après lancement [2 tours, Point (taille 0), seulement le lanceur]<br>CC: Dommage Terre [37 à 39, Point (taille 0)] ; Boost dégâts après lancement [2 tours, Point (taille 0), seulement le lanceur] |
| 12 | 172 | Tir Eloigné | 2 | 0–0 | non | oui | oui | 1/30 | 1/100 | 5 | 0 | 0 | Norm: Bonus PO [6, 3 tours, Cercle (taille 3)]<br>CC: Bonus PO [7, 3 tours, Cercle (taille 3)] |
| 13 | 173 | Flèche Harcelante | 3 | 1–12 | oui | non | non | 1/40 | 1/100 | — | 0 | 2 | Norm: Dommage Air [13 à 15, Point (taille 0)]<br>CC: Dommage Air [17 à 19, Point (taille 0)] |
| 14 | 174 | Flèche Cinglante | 3 | 1–10 | oui | non | oui | 1/40 | 1/100 | — | 0 | 1 | Norm: Dommage Terre [13 à 14, Point (taille 0)] ; Perte PM non esquivable [3, 1 tours, Point (taille 0)]<br>CC: Dommage Terre [17 à 18, Point (taille 0)] ; Perte PM non esquivable [3, 1 tours, Point (taille 0)] |
| 15 | 175 | Flèche Destructrice | 4 | 5–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 2 | Norm: Dommage Terre [26 à 28, Point (taille 0)] ; Malus Dommages [20, 1 tours, Point (taille 0)]<br>CC: Dommage Terre [36 à 38, Point (taille 0)] ; Malus Dommages [20, 1 tours, Point (taille 0)] |
| 16 | 176 | Flèche Persécutrice | 3 | 5–8 | oui | oui | oui | 1/40 | 1/100 | — | 0 | 2 | Norm: Dommage Air [11 à 13, Point (taille 0)] ; Dommage Feu [11 à 13, Point (taille 0)]<br>CC: Dommage Air [14 à 16, Point (taille 0)] ; Dommage Feu [14 à 16, Point (taille 0)] |
| 17 | 177 | Flèche Ralentissante | 4 | 1–8 | oui | oui | oui | 1/50 | 1/100 | — | 2 | 0 | Norm: Dommage Eau [21 à 23, Cercle (taille 2)] ; Retrait PA [2, Cercle (taille 2)]<br>CC: Dommage Eau [29 à 31, Cercle (taille 2)] ; Retrait PA [2, Cercle (taille 2)] |
| 18 | 178 | Flèche Absorbante | 4 | 5–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 2 | Norm: Vol de vie Air [26 à 28, Point (taille 0)]<br>CC: Vol de vie Air [36 à 38, Point (taille 0)] |
| 19 | 179 | Flèche Explosive | 4 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 2 | 0 | Norm: Dommage Feu [20 à 24, Cercle (taille 3)]<br>CC: Dommage Feu [28 à 32, Cercle (taille 3)] |
| 20 | 180 | Maîtrise de l'Arc | 2 | 0–6 | oui | non | non | 1/30 | 1/100 | 5 | 0 | 0 | Norm: +Dommages [60, 2 tours, Point (taille 0)]<br>CC: +Dommages [70, 2 tours, Point (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 392 | Maîtrise des Arcs | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 418 | Flèche de dispersion | 3 | 1–12 | oui | non | oui | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 2)] |

#### 10. Sadi (morph #110)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 181 | Tremblement | 2 | 0–0 | non | non | non | 1/50 | 1/100 | 5 | 1 | 0 | Norm: Dommage Feu [7, 4 tours, Cercle (taille 10)]<br>CC: Dommage Feu [12, 4 tours, Cercle (taille 10)] |
| 2 | 182 | La Folle | 3 | 1–1 | non | non | non | — | 1/100 | 1 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 3 | 183 | Ronce | 3 | 1–8 | oui | non | oui | 1/45 | 1/100 | — | 0 | 2 | Norm: Dommage Terre [11 à 18, Point (taille 0)]<br>CC: Dommage Terre [22, Point (taille 0)] |
| 4 | 184 | Feu de Brousse | 3 | 1–7 | oui | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Eau [6 à 10, Point (taille 0)] ; Dommage Feu [6 à 10, Point (taille 0)]<br>CC: Dommage Eau [11, Point (taille 0)] ; Dommage Feu [11, Point (taille 0)] |
| 5 | 185 | Herbe Folle | 3 | 0–8 | oui | oui | oui | 1/50 | 1/100 | — | 1 | 0 | Norm: Dommage Feu [11 à 20, Cercle (taille 2)] ; Retrait PM [2 à 4, 1 tours, Cercle (taille 2)]<br>CC: Dommage Feu [25, Cercle (taille 2)] ; Retrait PM [3 à 5, 1 tours, Cercle (taille 2)] |
| 6 | 186 | Arbre | 3 | 1–6 | oui | non | oui | — | 1/100 | 3 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] |
| 7 | 187 | La Surpuissante | 3 | 1–1 | non | oui | oui | — | 1/100 | 5 | 1 | 0 | Norm: Invoque une créature [1 tours, Point (taille 0)] |
| 8 | 188 | Ronce Insolente | 3 | 0–12 | oui | oui | oui | — | 1/100 | 3 | 0 | 0 | Norm: Enlève les envoûtements [1 tours, Point (taille 0)] |
| 9 | 189 | La Sacrifiée | 2 | 1–2 | non | non | oui | — | 1/100 | 2 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 10 | 190 | La Gonflable | 4 | 1–1 | non | non | non | — | 1/100 | 2 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 11 | 191 | Ronces Multiples | 3 | 0–7 | non | oui | oui | 1/45 | 1/100 | — | 1 | 0 | Norm: Dommage Terre [16 à 18, Cercle (taille 4)]<br>CC: Dommage Terre [19, Cercle (taille 4)] |
| 12 | 192 | Ronce Apaisante | 2 | 1–8 | oui | oui | oui | 1/50 | 1/100 | 4 | 1 | 0 | Norm: Soin [63 à 67, Point (taille 0)] ; Perte PM non esquivable [4, 2 tours, Point (taille 0)]<br>CC: Soin [68, Point (taille 0)] ; Perte PM non esquivable [5, 2 tours, Point (taille 0)] |
| 13 | 193 | La Bloqueuse | 3 | 1–1 | non | non | non | — | 1/100 | 1 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 14 | 194 | Ronces Agressives | 4 | 1–7 | oui | oui | oui | 1/45 | 1/100 | — | 0 | 1 | Norm: Dommage Terre [6 à 65, Point (taille 0)]<br>CC: Dommage Terre [65, Point (taille 0)] |
| 15 | 195 | Larme | 4 | 1–8 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Eau [17 à 27, Point (taille 0)]<br>CC: Dommage Eau [26 à 27, Point (taille 0)] |
| 16 | 196 | Vent Empoisonné | 3 | 0–0 | non | oui | non | 1/50 | 1/100 | 7 | 1 | 0 | Norm: Dommage Neutre [8, 6 tours, Cercle (taille 10)] ; -Intelligence [200, 6 tours, Cercle (taille 10)]<br>CC: Dommage Neutre [10, 6 tours, Cercle (taille 10)] ; -Intelligence [400, 6 tours, Cercle (taille 10)] |
| 17 | 197 | Puissance Sylvestre | 2 | 0–6 | oui | oui | non | — | 1/100 | 10 | 0 | 0 | Norm: Soin [16, 4 tours, Point (taille 0), pas les ennemis] ; Change l'apparence [4 tours, Point (taille 0), pas les ennemis] ; Perte PA non esquivable [100, 4 tours, Point (taille 0), pas les ennemis] ; Perte PM non esquivable [100, 4 tours, Point (taille 0), pas les ennemis] ; Résistance magique [1000, 4 tours, Point (taille 0), pas les ennemis] ; Résistance physique [1000, 4 tours, Point (taille 0), pas les ennemis] |
| 18 | 198 | Sacrifice Poupesque | 2 | 1–3 | non | non | oui | 1/50 | 1/100 | — | 1 | 0 | Norm: Vol de vie Air [41 à 45, Point (taille 0), seulement invocations]<br>CC: Vol de vie Air [51 à 55, Point (taille 0), seulement invocations] |
| 19 | 199 | Connaissance des Poupées | 2 | 0–1 | non | non | non | 1/50 | 1/100 | 6 | 1 | 0 | Norm: +Créa invocation [4, 5 tours, Point (taille 0)]<br>CC: +Créa invocation [5, 5 tours, Point (taille 0)] |
| 20 | 200 | Poison Paralysant | 3 | 1–8 | oui | non | oui | 1/50 | 1/100 | 2 | 1 | 1 | Norm: Poison X pdv/PA [3 tours, Point (taille 0)]<br>CC: Poison X pdv/PA [4 tours, Point (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 390 | Maîtrise des Bâtons | 2 | 0–0 | non | non | oui | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 426 | Arbre de vie | 5 | 6–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |

#### 11. Sacri (morph #111)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 431 | Châtiment Forcé | 3 | 0–0 | non | non | non | 1/45 | 1/100 | 5 | 0 | 0 | Norm: %érosion [5, 5 tours, Point (taille 0)] ; Châtiment X sur Y tours [5 tours, Point (taille 0)]<br>CC: %érosion [5, 5 tours, Point (taille 0)] ; Châtiment X sur Y tours [5 tours, Point (taille 0)] |
| 2 | 432 | Pied du Sacrieur | 3 | 1–1 | non | non | oui | 1/35 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [13 à 22, Point (taille 0)] ; Vol Agilité [20, 3 tours, Point (taille 0)]<br>CC: Dommage Terre [25, Point (taille 0)] ; Vol Agilité [20, 4 tours, Point (taille 0)] |
| 3 | 433 | Châtiment Osé | 3 | 0–0 | non | oui | non | 1/45 | 1/100 | 5 | 0 | 0 | Norm: %érosion [5, 5 tours, Point (taille 0)] ; Châtiment X sur Y tours [5 tours, Point (taille 0)]<br>CC: %érosion [5, 5 tours, Point (taille 0)] ; Châtiment X sur Y tours [5 tours, Point (taille 0)] |
| 4 | 434 | Attirance | 3 | 2–14 | oui | oui | oui | — | 1/100 | — | 0 | 1 | Norm: Attire TODO cases [Point (taille 0)] |
| 5 | 435 | Transfert de Vie | 2 | 0–0 | non | non | non | 1/50 | 1/100 | — | 6 | 0 | Norm: Transfert de vie [10, Cercle (taille 4), pas le lanceur, pas les ennemis]<br>CC: Transfert de vie [10, Cercle (taille 4), pas le lanceur, pas les ennemis] ; Soin [10, Point (taille 0), pas les ennemis] |
| 6 | 436 | Assaut | 3 | 1–3 | non | oui | oui | 1/35 | 1/100 | — | 0 | 0 | Norm: Dommage Air [13 à 19, Point (taille 0)]<br>CC: Dommage Air [19 à 25, Point (taille 0)] |
| 7 | 437 | Châtiment Agile | 3 | 0–0 | non | non | non | 1/45 | 1/100 | 5 | 0 | 0 | Norm: %érosion [5, 5 tours, Point (taille 0)] ; Châtiment X sur Y tours [5 tours, Point (taille 0)]<br>CC: %érosion [5, 5 tours, Point (taille 0)] ; Châtiment X sur Y tours [5 tours, Point (taille 0)] |
| 8 | 438 | Transposition | 4 | 1–10 | oui | non | non | — | — | 3 | 0 | 0 | Norm: Échange de place [Point (taille 0), pas les ennemis] |
| 9 | 439 | Dissolution | 4 | 0–0 | non | non | oui | 1/40 | 1/100 | — | 2 | 0 | Norm: Vol de vie Eau [22 à 26, Croix (taille 1), pas le lanceur]<br>CC: Vol de vie Eau [27 à 31, Croix (taille 1), pas le lanceur] |
| 10 | 440 | Sacrifice | 3 | 1–5 | oui | non | non | — | 1/100 | 6 | 0 | 0 | Norm: Sacrifice [5 tours, Cercle (taille 2), pas les ennemis] |
| 11 | 441 | Châtiment Vitalesque | 3 | 0–0 | non | non | non | 1/45 | 1/100 | 4 | 0 | 0 | Norm: Châtiment X sur Y tours [2 tours, Point (taille 0)] ; Applique l'État X [2 tours, Point (taille 0)]<br>CC: Châtiment X sur Y tours [2 tours, Point (taille 0)] ; Applique l'État X [2 tours, Point (taille 0)] |
| 12 | 442 | Absorption | 4 | 1–3 | non | non | oui | 1/40 | 1/100 | — | 0 | 2 | Norm: Vol de vie Feu [23 à 27, Point (taille 0)]<br>CC: Vol de vie Feu [28 à 32, Point (taille 0)] |
| 13 | 443 | Châtiment Spirituel | 3 | 0–0 | non | non | non | 1/45 | 1/100 | 5 | 0 | 0 | Norm: %érosion [5, 5 tours, Point (taille 0)] ; Châtiment X sur Y tours [5 tours, Point (taille 0)]<br>CC: %érosion [5, 5 tours, Point (taille 0)] ; Châtiment X sur Y tours [5 tours, Point (taille 0)] |
| 14 | 444 | Dérobade | 3 | 0–6 | oui | non | non | 1/50 | 1/100 | 5 | 0 | 0 | Norm: Esquive en reculant de 1 case [1 tours, Point (taille 0)]<br>CC: Esquive en reculant de 1 case [2 tours, Point (taille 0)] |
| 15 | 445 | Coopération | 4 | 1–10 | oui | non | non | — | 1/100 | 3 | 0 | 0 | Norm: Échange de place [Point (taille 0), pas les alliés] |
| 16 | 446 | Punition | 4 | 1–1 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Dommage %vie attaquant (cellule) [30, Point (taille 0)]<br>CC: Dommage %vie attaquant (cellule) [35, Point (taille 0)] |
| 17 | 447 | Furie | 3 | 1–3 | non | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Neutre %vie [1, 1 tours, Point (taille 0), seulement le lanceur] ; Dommage Eau [9 à 13, Croix (taille 1)] ; +Dommages [8, 4 tours, Point (taille 0), seulement le lanceur]<br>CC: Dommage Neutre %vie [1, 1 tours, Point (taille 0), seulement le lanceur] ; Dommage Eau [11 à 15, Croix (taille 1)] ; +Dommages [8, 4 tours, Point (taille 0), seulement le lanceur] |
| 18 | 448 | Epée volante | 4 | 1–3 | non | oui | oui | — | 1/100 | 4 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 19 | 449 | Détour | 1 | 1–1 | non | non | oui | — | 1/100 | — | 6 | 0 | Norm: Échange de place [Point (taille 0)] |
| 20 | 450 | Folie sanguinaire | 1 | 1–7 | oui | non | non | 1/50 | 1/100 | — | 6 | 6 | Norm: Vol de vie fixe [200, Point (taille 0), pas les ennemis]<br>CC: Vol de vie fixe [200, Point (taille 0), pas les ennemis] ; PDV rendus [100, Point (taille 0), pas les ennemis] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 395 | Maîtrise des Dagues | 2 | 0–0 | non | non | oui | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 421 | Douleur partagée | 2 | 0–0 | non | oui | oui | 1/50 | 1/100 | 5 | 0 | 0 | Norm: %érosion [10, 5 tours, Croix (taille 1), seulement alliés (pas lanceur)] ; Châtiment X sur Y tours [5 tours, Croix (taille 1), seulement alliés (pas lanceur)]<br>CC: %érosion [10, 5 tours, Croix (taille 1), seulement alliés (pas lanceur)] ; Châtiment X sur Y tours [5 tours, Croix (taille 1), seulement alliés (pas lanceur)] |

#### 12. Panda (morph #112)

| Pos. | ID | Nom | PA | PO | Portée modifiable | Lancer en ligne | Ligne de vue nécessaire | CC | EC | Relance | Par tour | Par cible | Effets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 686 | Picole | 1 | 0–0 | non | non | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Change l'apparence [10 tours, Point (taille 0)] ; Perte PM non esquivable [1, 10 tours, Point (taille 0)] ; Résist. % terre [25, 10 tours, Point (taille 0)] ; Résist. % eau [25, 10 tours, Point (taille 0)] ; Résist. % air [25, 10 tours, Point (taille 0)] ; Résist. % feu [25, 10 tours, Point (taille 0)] ; Résist. % neutre [25, 10 tours, Point (taille 0)] ; Applique l'État X [10 tours, Point (taille 0)]<br>CC: Change l'apparence [10 tours, Point (taille 0)] ; Résist. % terre [30, 10 tours, Point (taille 0)] ; Résist. % eau [30, 10 tours, Point (taille 0)] ; Résist. % air [30, 10 tours, Point (taille 0)] ; Résist. % feu [30, 10 tours, Point (taille 0)] ; Résist. % neutre [30, 10 tours, Point (taille 0)] ; Applique l'État X [10 tours, Point (taille 0)] |
| 2 | 687 | Poing Enflammé | 3 | 1–1 | oui | non | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [16 à 21, Point (taille 0)]<br>CC: Dommage Feu [19 à 24, Point (taille 0)] |
| 3 | 688 | Vulnérabilité Incandescente | 2 | 1–7 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Faiblesse % feu [10, 2 tours, Point (taille 0)]<br>CC: Faiblesse % feu [12, 2 tours, Point (taille 0)] |
| 4 | 689 | Epouvante | 2 | 1–7 | oui | oui | oui | — | 1/100 | — | 0 | 1 | Norm: Repousse TODO cases [Point (taille 0)] ; Malus CC [6, 3 tours, Point (taille 0)] |
| 5 | 690 | Souffle Alcoolisé | 3 | 1–6 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Repousse TODO cases [Point (taille 0)] ; Dommage Air [13 à 22, Point (taille 0)]<br>CC: Repousse TODO cases [Point (taille 0)] ; Dommage Air [15 à 24, Point (taille 0)] |
| 6 | 691 | Vulnérabilité Aqueuse | 2 | 1–7 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Faiblesse % eau [10, 2 tours, Point (taille 0)]<br>CC: Faiblesse % eau [12, 2 tours, Point (taille 0)] |
| 7 | 692 | Gueule de Bois | 3 | 1–1 | oui | non | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [14 à 22, Point (taille 0)]<br>CC: Dommage Terre [16 à 24, Point (taille 0)] |
| 8 | 693 | Karcham | 1 | 1–1 | non | oui | non | — | 1/100 | — | 0 | 0 | Norm: Porter [Point (taille 0)] |
| 9 | 694 | Vulnérabilité Venteuse | 2 | 1–7 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Faiblesse % air [10, 2 tours, Point (taille 0)]<br>CC: Faiblesse % air [12, 2 tours, Point (taille 0)] |
| 10 | 695 | Stabilisation | 2 | 0–6 | oui | oui | non | 1/40 | 1/100 | 6 | 0 | 0 | Norm: +Esquive PM [50, 4 tours, Point (taille 0)] ; Applique l'État X [4 tours, Point (taille 0)]<br>CC: +Esquive PM [100, 4 tours, Point (taille 0)] ; Applique l'État X [4 tours, Point (taille 0)] |
| 11 | 696 | Chamrak | 1 | 1–6 | non | oui | non | — | 1/100 | — | 0 | 0 | Norm: Jeter [Point (taille 0)] |
| 12 | 697 | Vulnérabilité Terrestre | 2 | 1–7 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Faiblesse % terre [10, 2 tours, Point (taille 0)]<br>CC: Faiblesse % terre [12, 2 tours, Point (taille 0)] |
| 13 | 698 | Souillure | 2 | 1–1 | non | oui | oui | 1/40 | 1/100 | — | 0 | 0 | Norm: Retrait PA [4, 1 tours, 25%, Point (taille 0)] ; +EC [15, 1 tours, 25%, Point (taille 0)] ; Enlève les envoûtements [25%, Point (taille 0)] ; Diminue les dommages % [150, 1 tours, 25%, Point (taille 0)]<br>CC: Retrait PA [4, 1 tours, Point (taille 0)] ; +EC [15, 1 tours, Point (taille 0)] ; Enlève les envoûtements [Point (taille 0)] ; Diminue les dommages % [150, 1 tours, Point (taille 0)] |
| 14 | 699 | Lait de Bambou | 1 | 0–0 | non | oui | oui | — | 1/100 | — | 0 | 0 | Norm: Enlève les envoûtements [Point (taille 0)] ; Change l'apparence [Point (taille 0)] ; Enlève l'État X [Point (taille 0)] |
| 15 | 700 | Vague à Lame | 4 | 1–5 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Eau [22 à 36, Point (taille 0)]<br>CC: Dommage Eau [36 à 45, Point (taille 0)] |
| 16 | 701 | Colère de Zatoïshwan | 6 | 0–0 | non | oui | non | 1/45 | 1/100 | 6 | 0 | 0 | Norm: +Dommages [11, 3 tours, Point (taille 0)] ; +CC [11, 3 tours, Point (taille 0)] ; %dommages [200, 3 tours, Point (taille 0)] ; Change l'apparence [3 tours, Point (taille 0)] ; Applique l'État X [3 tours, Point (taille 0)]<br>CC: +Dommages [11, 4 tours, Point (taille 0)] ; +CC [11, 4 tours, Point (taille 0)] ; %dommages [200, 4 tours, Point (taille 0)] ; Change l'apparence [4 tours, Point (taille 0)] ; Applique l'État X [4 tours, Point (taille 0)] |
| 17 | 702 | Flasque Explosive | 2 | 2–5 | oui | oui | oui | 1/50 | 1/100 | — | 1 | 0 | Norm: Dommage Feu [16 à 30, Cercle (taille 2)]<br>CC: Dommage Feu [26 à 40, Cercle (taille 2)] |
| 18 | 703 | Pandatak | 4 | 1–6 | oui | oui | oui | 1/50 | 1/100 | — | 0 | 0 | Norm: Dommage Terre [26 à 35, Ligne (taille 2)]<br>CC: Dommage Terre [36 à 40, Ligne (taille 2)] |
| 19 | 704 | Pandanlku | 2 | 0–6 | oui | non | oui | 1/50 | 1/100 | 6 | 0 | 0 | Norm: +PM [3, 4 tours, Point (taille 0)]<br>CC: +PM [4, 4 tours, Point (taille 0)] |
| 20 | 705 | Lien Spiritueux | 2 | 1–6 | oui | oui | non | — | 1/100 | 8 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |
| 21 | 350 | Flamiche | 2 | 1–8 | oui | non | oui | 1/50 | 1/100 | — | 0 | 3 | Norm: Dommage Feu [1 à 7, Point (taille 0)]<br>CC: Dommage Feu [8, Point (taille 0)] |
| 22 | 364 | Boomerang perfide | 7 | 5–8 | non | non | oui | 1/50 | 1/100 | 2 | 0 | 0 | Norm: Vol de vie Eau [31 à 40, 25%, Point (taille 0)] ; Vol de vie Terre [31 à 40, 25%, Point (taille 0)] ; Vol de vie Air [31 à 40, 25%, Point (taille 0)] ; Vol de vie Feu [31 à 40, 25%, Point (taille 0)]<br>CC: Vol de vie Eau [41 à 50, 25%, Point (taille 0)] ; Vol de vie Terre [41 à 50, 25%, Point (taille 0)] ; Vol de vie Air [41 à 50, 25%, Point (taille 0)] ; Vol de vie Feu [41 à 50, 25%, Point (taille 0)] |
| 23 | 366 | Marteau de Moon | 8 | 4–7 | non | non | oui | 1/40 | 1/100 | 3 | 0 | 0 | Norm: Dommage Air [38 à 47, Point (taille 0)] ; Malus PO [1, 5 tours, Point (taille 0)]<br>CC: Dommage Air [49, Point (taille 0)] ; Malus PO [1, 6 tours, Point (taille 0)] |
| 24 | 367 | Cawotte | 4 | 1–6 | non | non | oui | — | 1/100 | 6 | 0 | 0 | Norm: Invoque créature statique [Point (taille 0)] ; Crée une glyphe [8 tours, Cercle (taille 1)] |
| 25 | 368 | Libération | 3 | 0–0 | non | oui | non | — | 1/100 | 2 | 0 | 0 | Norm: Repousse TODO cases [Croix (taille 1), pas le lanceur] |
| 26 | 369 | Foudroiement | 5 | 0–0 | non | non | oui | 1/45 | 1/100 | — | 0 | 0 | Norm: Dommage Feu [3 à 30, Cercle (taille 2), pas le lanceur]<br>CC: Dommage Feu [31, Cercle (taille 2), pas le lanceur] |
| 27 | 370 | Invocation d'Arakne | 5 | 1–1 | non | non | oui | 1/60 | 1/100 | 6 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 28 | 373 | Invocation de Chaferfu | 4 | 2–2 | non | non | non | 1/60 | 1/100 | 6 | 1 | 0 | Norm: Invoque une créature [Point (taille 0)]<br>CC: Invoque une créature [Point (taille 0)] |
| 29 | 397 | Maîtrise des Haches | 2 | 0–0 | non | non | oui | 1/50 | 1/100 | 6 | 0 | 0 | Norm: Maîtrises [4 tours, Point (taille 0)]<br>CC: Maîtrises [4 tours, Point (taille 0)] |
| 30 | 423 | Ivresse | 4 | 1–1 | non | oui | oui | — | 1/100 | 5 | 0 | 0 | Norm: Invoque une créature [Point (taille 0)] |

---

## 3. Dictionnaire des effets

| effectID | Libellé |
|---|---|
| 4 | Téléportation |
| 5 | Repousse TODO cases |
| 6 | Attire TODO cases |
| 8 | Échange de place |
| 9 | Esquive en reculant de 1 case |
| 50 | Porter |
| 51 | Jeter |
| 77 | Vol PM |
| 78 | Bonus PM |
| 79 | Chance dommages subis/soins |
| 81 | Cura (soin) |
| 82 | Vol de vie fixe |
| 84 | Vol PA |
| 85 | Dommage Eau %vie |
| 86 | Dommage Terre %vie |
| 87 | Dommage Air %vie |
| 88 | Dommage Feu %vie |
| 89 | Dommage Neutre %vie |
| 90 | Transfert de vie |
| 91 | Vol de vie Eau |
| 92 | Vol de vie Terre |
| 93 | Vol de vie Air |
| 94 | Vol de vie Feu |
| 95 | Vol de vie Neutre |
| 96 | Dommage Eau |
| 97 | Dommage Terre |
| 98 | Dommage Air |
| 99 | Dommage Feu |
| 100 | Dommage Neutre |
| 101 | Retrait PA |
| 105 | Dommages réduits |
| 106 | Renvoie de sort |
| 107 | Renvoie de dommages |
| 108 | Soin |
| 109 | Dommage au lanceur |
| 110 | +Vie |
| 111 | +PA |
| 112 | +Dommages |
| 114 | Multiplie les dommages |
| 115 | +CC |
| 116 | Malus PO |
| 117 | Bonus PO |
| 118 | +Force |
| 119 | +Agilité |
| 120 | Bonus PA (lanceur) |
| 121 | +Dommages |
| 122 | +EC |
| 123 | +Chance |
| 124 | +Sagesse |
| 125 | +Vitalité |
| 126 | +Intelligence |
| 127 | Retrait PM |
| 128 | +PM |
| 130 | Vol de kamas |
| 131 | Poison X pdv/PA |
| 132 | Enlève les envoûtements |
| 138 | %dommages |
| 140 | Passe le tour |
| 141 | Tue la cible |
| 142 | Dommages physiques |
| 143 | PDV rendus |
| 144 | -Dommages |
| 145 | Malus Dommages |
| 149 | Change l'apparence |
| 150 | Invisibilité |
| 152 | -Chance |
| 153 | -Vitalité |
| 154 | -Agilité |
| 155 | -Intelligence |
| 156 | -Sagesse |
| 157 | -Force |
| 160 | +Esquive PA |
| 161 | +Esquive PM |
| 162 | -Esquive PA |
| 163 | -Esquive PM |
| 164 | Dommages réduits % |
| 165 | Maîtrises |
| 168 | Perte PA non esquivable |
| 169 | Perte PM non esquivable |
| 171 | Malus CC |
| 176 | +Prospection |
| 177 | -Prospection |
| 178 | +Soins |
| 179 | -Soins |
| 180 | Double du Sram |
| 181 | Invoque une créature |
| 182 | +Créa invocation |
| 183 | Résistance magique |
| 184 | Résistance physique |
| 185 | Invoque créature statique |
| 186 | Diminue les dommages % |
| 200 | Contrôle Invocation |
| 202 | Perception |
| 210 | Résist. % terre |
| 211 | Résist. % eau |
| 212 | Résist. % air |
| 213 | Résist. % feu |
| 214 | Résist. % neutre |
| 215 | Faiblesse % terre |
| 216 | Faiblesse % eau |
| 217 | Faiblesse % air |
| 218 | Faiblesse % feu |
| 219 | Faiblesse % neutre |
| 220 | Renvoie dommages |
| 240 | Résist. fixe terre |
| 241 | Résist. fixe eau |
| 242 | Résist. fixe air |
| 243 | Résist. fixe feu |
| 244 | Résist. fixe neutre |
| 245 | Faiblesse fixe terre |
| 246 | Faiblesse fixe eau |
| 247 | Faiblesse fixe air |
| 248 | Faiblesse fixe feu |
| 249 | Faiblesse fixe neutre |
| 265 | Réduit les dommages élémentaires |
| 266 | Vol Chance |
| 267 | Vol Vitalité |
| 268 | Vol Agilité |
| 269 | Vol Intelligence |
| 270 | Vol Sagesse |
| 271 | Vol Force |
| 275 | Dommage Eau %vie manquante |
| 276 | Dommage Terre %vie manquante |
| 277 | Dommage Air %vie manquante |
| 278 | Dommage Feu %vie manquante |
| 279 | Dommage Neutre %vie manquante |
| 281 | +Portée du sort |
| 282 | Portée du sort modifiable |
| 283 | +Dommages du sort |
| 284 | +Soins du sort |
| 285 | -Coût PA du sort |
| 286 | -Délai de relance du sort |
| 287 | +CC du sort |
| 288 | Désactive lancer en ligne |
| 289 | Désactive ligne de vue |
| 290 | +Lancers max/tour du sort |
| 291 | +Lancers max/cible du sort |
| 292 | Fixe le délai de relance |
| 293 | Boost dégâts après lancement |
| 294 | -Portée du sort |
| 320 | Vol PO |
| 400 | Crée un piège |
| 401 | Crée une glyphe |
| 402 | Glyphe des Blop |
| 405 | Tue une invocation |
| 666 | Pas d'effet |
| 671 | Dommage %vie attaquant (lanceur) |
| 672 | Dommage %vie attaquant (cellule) |
| 750 | Capture d'âme |
| 765 | Sacrifice |
| 776 | %érosion |
| 780 | Laisse spirituelle |
| 781 | Minimise les effets aléatoires |
| 782 | Maximise les effets aléatoires |
| 783 | Pousse jusqu'à la case |
| 784 | Raulebaque |
| 786 | Soigne le caster après l'attaque |
| 787 | Applique un sort |
| 788 | Châtiment X sur Y tours |
| 950 | Applique l'État X |
| 951 | Enlève l'État X |
| 2127 | s'Attire TODO cases |

---

## 4. Zones d'effet et cibles

### Formes de zone (1er caractère de `area`)

| Code | Forme |
|---|---|
| `C` | Cercle |
| `X` | Croix |
| `R` | Rectangle (cassé) |
| `D` | Damier |
| `O` | Autour de la cible |
| `A` | Croix relative (lanceur) |
| `T` | Ligne en T |
| `L` | Ligne |
| `P` | Point |

### Taille de zone (2e caractère, base64 via CryptManager.HASH)

| Code | Taille | Code | Taille | Code | Taille | Code | Taille |
|---|---|---|---|---|---|---|---|
| `a` | 0 | `b` | 1 | `c` | 2 | `d` | 3 |
| `e` | 4 | `f` | 5 | `g` | 6 | `h` | 7 |
| `i` | 8 | `j` | 9 | `k` | 10 | `l` | 11 |
| `m` | 12 | `n` | 13 | `o` | 14 | `p` | 15 |
| `q` | 16 | `r` | 17 | `s` | 18 | `t` | 19 |
| `u` | 20 | `v` | 21 | `w` | 22 | `x` | 23 |
| `y` | 24 | `z` | 25 | `A` | 26 | `B` | 27 |
| `C` | 28 | `D` | 29 | `E` | 30 | `F` | 31 |
| `G` | 32 | `H` | 33 | `I` | 34 | `J` | 35 |
| `K` | 36 | `L` | 37 | `M` | 38 | `N` | 39 |
| `O` | 40 | `P` | 41 | `Q` | 42 | `R` | 43 |
| `S` | 44 | `T` | 45 | `U` | 46 | `V` | 47 |
| `W` | 48 | `X` | 49 | `Y` | 50 | `Z` | 51 |
| `0` | 52 | `1` | 53 | `2` | 54 | `3` | 55 |
| `4` | 56 | `5` | 57 | `6` | 58 | `7` | 59 |
| `8` | 60 | `9` | 61 | `-` | 62 | `_` | 63 |

### Masque de cible (`effectTarget`)

| Bit | Valeur | Signification |
|---|---|---|
| 0 | 1 | ne touche pas les alliés |
| 1 | 2 | ne touche pas le lanceur |
| 2 | 4 | ne touche pas les ennemis |
| 3 | 8 | seulement les invocations |
| 4 | 16 | pas les invocations |
| 5 | 32 | seulement le lanceur |
| 6 | 64 | seulement les alliés (pas le lanceur) |
| 10 | 1024 | personne |

---

## 5. Toniques — liste exhaustive

`item_template` type 126. Format `statsTemplate` = `hexEffectID#valeur#arg#arg2#jet`, séparés par `,`.

### 5.1 Toniques de caractéristiques — Palier 1 (TONIQUE1)

| ID | Nom | Effet décodé |
|---|---|---|
| 16002 | Tonique Actio | +PA : 1 (+1 fixe) |
| 16003 | Tonique Motio | +PM : 1 (+1 fixe) |
| 16004 | Tonique Vitale | +Vitalité : 1f4 (+500 fixe) |
| 16005 | Tonique Terra | +Force : 96 (+150 fixe) |
| 16006 | Tonique Ignis | +Intelligence : 96 (+150 fixe) |
| 16007 | Tonique Aqua | +Chance : 96 (+150 fixe) |
| 16008 | Tonique Aer | +Agilité : 96 (+150 fixe) |
| 16009 | Tonique Criticus | +CC : f (+15 fixe) |
| 16010 | Tonique Fortis | +Dommages : f (+15 fixe) |
| 16011 | Tonique Potentia | %dommages : 64 (+100 fixe) |
| 16012 | Tonique Tenacitas | Résist. % terre : a (+10 fixe); Résist. % neutre : a (+10 fixe); Résist. % eau : a (+10 fixe); Résist. % air : a (+10 fixe); Résist. % feu : a (+10 fixe) |

### 5.2 Toniques « Magnus » — Palier 2 (TONIQUE2)

| ID | Nom | Effet décodé |
|---|---|---|
| 16013 | Tonique Actio Magnus | +PA : 2 (+2 fixe); Retrait PM : 1 (+1 fixe) |
| 16014 | Tonique Motio Magnus | +PM : 2 (+2 fixe); Retrait PA (esquivable) : 1 (+1 fixe) |
| 16015 | Tonique Vitale Magnus | +Vitalité : 3e8 (+1000 fixe); Faiblesse % terre : a (+10 fixe); Faiblesse % neutre : a (+10 fixe); Faiblesse % eau : a (+10 fixe); Faiblesse % air : a (+10 fixe); Faiblesse % feu : a (+10 fixe) |
| 16016 | Tonique Terra Magnus | +Force : 12c (+300 fixe); -Agilité : 96 (+150 fixe) |
| 16017 | Tonique Ignis Magnus | -Chance : 96 (+150 fixe); +Intelligence : 12c (+300 fixe) |
| 16018 | Tonique Aqua Magnus | -Intelligence : 96 (+150 fixe); +Chance : 12c (+300 fixe) |
| 16019 | Tonique Aer Magnus | -Force : 96 (+150 fixe); +Agilité : 12c (+300 fixe) |
| 16020 | Tonique Criticus Magnus | +CC : 1e (+30 fixe); Diminue dommages % : 64 (+100 fixe) |
| 16021 | Tonique Fortis Magnus | Diminue dommages % : 64 (+100 fixe); +Dommages : 1e (+30 fixe) |
| 16022 | Tonique Potentia Magnus | Malus dommages : f (+15 fixe); %dommages : c8 (+200 fixe) |
| 16023 | Tonique Tenacitas Magnus | Résist. % terre : f (+15 fixe); Résist. % neutre : f (+15 fixe); Résist. % eau : f (+15 fixe); Résist. % air : f (+15 fixe); Résist. % feu : f (+15 fixe); -Vitalité : 1f4 (+500 fixe) |

### 5.3 Toniques « Rarus » (récompenses tier 3, communes)

| ID | Nom | Effet décodé |
|---|---|---|
| 16024 | Tonique Actio Rarus | +PM : 1 (+1 fixe); +PA : 1 (+1 fixe) |
| 16025 | Tonique Potentia Rarus | %dommages : 64 (+100 fixe); +Dommages : f (+15 fixe) |
| 16026 | Tonique Vitale Rarus | +Vitalité : 3e8 (+1000 fixe) |

### 5.4 Toniques « Mutatio » — mutations de sort par classe (TONIQUE3)

Chaque classe dispose de 20 mutations, chacune ciblant l'un de ses 20 sorts.
L'effet est un **boost de sort** : le 3e champ `#sortID` indique le sort ciblé, la valeur le bonus.

#### Classe Feca — toniques 16047 à 16066

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16047 | Ton. Mutatio 'Griffe Spectrale' |  | +CC : 15; -Coût PA : 15 |
| 16048 | Ton. Mutatio 'Déplacement Félin' |  | -Délai relance : 16; +CC : 16 |
| 16049 | Ton. Mutatio 'Cri de l'Ours' |  | +CC : 17; -Délai relance : 17 |
| 16050 | Ton. Mutatio 'Corbeau' |  | +Dommages : 18; +CC : 18 |
| 16051 | Ton. Mutatio 'Soin Animal' |  | +Soins : 19; Désactive ligne de vue : 19 |
| 16052 | Ton. Mutatio 'Bénédiction Animale' |  | -Délai relance : 1a; +Portée : 1a |
| 16053 | Ton. Mutatio 'Piqûre Motivante' |  | +CC : 1b; -Délai relance : 1b |
| 16054 | Ton. Mutatio 'Crapaud' |  | +CC : 1c; -Délai relance : 1c |
| 16055 | Ton. Mutatio 'Crocs du Mulou' |  | +CC : 1d; -Délai relance : 1d |
| 16056 | Ton. Mutatio 'Fouet' |  | +Lancers/tour : 1e; +Lancers/cible : 1e |
| 16057 | Ton. Mutatio 'Invocation de Dragonnet Rouge' |  | -Coût PA : 1f; +Portée : 1f |
| 16058 | Ton. Mutatio 'Résistance Naturelle' |  | +CC : 20; -Délai relance : 20 |
| 16059 | Ton. Mutatio 'Griffe Cinglante' |  | +Dommages : 21; Désactive ligne de vue : 21 |
| 16060 | Ton. Mutatio 'Invocation de Tofu' |  | -Coût PA : 22; +Portée : 22 |
| 16061 | Ton. Mutatio 'Invocation de Bouftou' |  | +Portée : 23; -Délai relance : 23 |
| 16062 | Ton. Mutatio 'Frappe du Craqueleur' |  | +Portée : 24; +CC : 24 |
| 16063 | Ton. Mutatio 'Invocation de Prespic' |  | Désactive ligne de vue : 25; Désactive lancer en ligne : 25 |
| 16064 | Ton. Mutatio 'Invocation de Sanglier' |  | -Coût PA : 26; +Portée : 26 |
| 16065 | Ton. Mutatio 'Invocation de Bwork Mage' |  | -Délai relance : 27; +Portée : 27 |
| 16066 | Ton. Mutatio 'Invocation de Craqueleur' |  | +Portée : 28; -Délai relance : 28 |

#### Classe Osamodas — toniques 16067 à 16086

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16067 | Ton. Mutatio 'Sac Animé' |  | +Portée : 29; -Délai relance : 29 |
| 16068 | Ton. Mutatio 'Chance' |  | -Délai relance : 2a; +CC : 2a; +Portée : 2a |
| 16069 | Ton. Mutatio 'Lancer de Pelle' |  | +CC : 2b; -Coût PA : 2b |
| 16070 | Ton. Mutatio 'Roulage de Pelle' |  | +CC : 2c; -Coût PA : 2c |
| 16071 | Ton. Mutatio 'Clé Réductrice' |  | -Délai relance : 2d; +CC : 2d |
| 16072 | Ton. Mutatio 'Désinvocation' |  | +CC : 2e; +Lancers/cible : 2e |
| 16073 | Ton. Mutatio 'Boîte de Pandore' |  | +Soins : 2f; -Délai relance : 2f |
| 16074 | Ton. Mutatio 'Remblai' |  | +Dommages : 30; Désactive ligne de vue : 30 |
| 16075 | Ton. Mutatio 'Pelle Fantomatique' |  | +Dommages : 31; -Coût PA : 31 |
| 16076 | Ton. Mutatio 'Maladresse' |  | +Portée : 32; +Lancers/cible : 32 |
| 16077 | Ton. Mutatio 'Lancer de Pièces' |  | +Dommages : 33; +Lancers/cible : 33 |
| 16078 | Ton. Mutatio 'Cupidité' |  | -Coût PA : 34; -Délai relance : 34 |
| 16079 | Ton. Mutatio 'Force de l'Age' |  | +Portée : 35; +Lancers/cible : 35 |
| 16080 | Ton. Mutatio 'Maladresse de Masse' |  | -Coût PA : 36; -Délai relance : 36 |
| 16081 | Ton. Mutatio 'Accélération' |  | +CC : 37; -Délai relance : 37 |
| 16082 | Ton. Mutatio 'Pelle du Jugement' |  | +Dommages : 38; -Coût PA : 38 |
| 16083 | Ton. Mutatio 'Pelle Animée' |  | +Portée : 39; -Délai relance : 39 |
| 16084 | Ton. Mutatio 'Pelle Massacrante' |  | +CC : 3a; +Lancers/cible : 3a |
| 16085 | Ton. Mutatio 'Corruption' |  | -Coût PA : 3b; +Portée : 3b |
| 16086 | Ton. Mutatio 'Coffre Animé' |  | -Coût PA : 3c; +Portée : 3c; Désactive ligne de vue : 3c |

#### Classe Enutrof — toniques 16087 à 16106

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16087 | Ton. Mutatio 'Sournoiserie' |  | +Dommages : 3d; Désactive ligne de vue : 3d |
| 16088 | Ton. Mutatio 'Concentration de Chakra' |  | -Délai relance : 3e; +Portée : 3e |
| 16089 | Ton. Mutatio 'Coup Sournois' |  | +Dommages : 3f; +Portée : 3f |
| 16090 | Ton. Mutatio 'Repérage' |  | -Coût PA : 40; -Délai relance : 40 |
| 16091 | Ton. Mutatio 'Piège Sournois' |  | +Portée : 41; -Coût PA : 41 |
| 16092 | Ton. Mutatio 'Poison insidieux' |  | +CC : 42; +Lancers/cible : 42 |
| 16093 | Ton. Mutatio 'Peur' |  | +Portée : 43; -Coût PA : 43 |
| 16094 | Ton. Mutatio 'Fourvoiement' |  | +CC : 44; +Portée : 44 |
| 16095 | Ton. Mutatio 'Piège d'Immobilisation' |  | -Coût PA : 45; Désactive lancer en ligne : 45 |
| 16096 | Ton. Mutatio 'Arnaque' |  | +Portée : 46; +Lancers/cible : 46 |
| 16097 | Ton. Mutatio 'Piège Empoisonné' |  | -Coût PA : 47; +Portée : 47 |
| 16098 | Ton. Mutatio 'Invisibilité' |  | -Délai relance : 48; -Coût PA : 48 |
| 16099 | Ton. Mutatio 'Piège répulsif' |  | -Coût PA : 49; +Lancers/tour : 49; -Délai relance : 49 |
| 16100 | Ton. Mutatio 'Double' |  | +Portée : 4a; Désactive lancer en ligne : 4a |
| 16101 | Ton. Mutatio 'Pulsion de Chakra' |  | -Délai relance : 4b; +Portée : 4b |
| 16102 | Ton. Mutatio 'Attaque Mortelle' |  | +Portée : 4c; +CC : 4c |
| 16103 | Ton. Mutatio 'Piège de Silence' |  | Désactive lancer en ligne : 4d; +Lancers/tour : 4d |
| 16104 | Ton. Mutatio 'Invisibilité d'Autrui' |  | -Coût PA : 4e; -Délai relance : 4e |
| 16105 | Ton. Mutatio 'Piège de Masse' |  | +Portée : 4f; +Lancers/tour : 4f |
| 16106 | Ton. Mutatio 'Piège Mortel' |  | Désactive lancer en ligne : 50; +Lancers/tour : 50 |

#### Classe Sram — toniques 16107 à 16126

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16107 | Ton. Mutatio 'Ralentissement' |  | +Lancers/cible : 51; +Portée : 51 |
| 16108 | Ton. Mutatio 'Contre' |  | -Délai relance : 52; +Portée : 52 |
| 16109 | Ton. Mutatio 'Aiguille' |  | +Dommages : 53; Désactive ligne de vue : 53 |
| 16110 | Ton. Mutatio 'Gelure' |  | +Lancers/cible : 54; +Dommages : 54 |
| 16111 | Ton. Mutatio 'Flou' |  | -Coût PA : 55; Désactive ligne de vue : 55 |
| 16112 | Ton. Mutatio 'Aiguille Chercheuse' |  | Portée modifiable : 56; +Portée : 56 |
| 16113 | Ton. Mutatio 'Démotivation' |  | +Lancers/cible : 57; +Portée : 57 |
| 16114 | Ton. Mutatio 'Téléportation' |  | -Délai relance : 58; -Coût PA : 58 |
| 16115 | Ton. Mutatio 'Dévouement' |  | -Délai relance : 59; +Portée : 59 |
| 16116 | Ton. Mutatio 'Fuite' |  | +Lancers/tour : 5a; +Portée : 5a |
| 16117 | Ton. Mutatio 'Frappe de Xélor' |  | +Portée : 5b; +Lancers/cible : 5b |
| 16118 | Ton. Mutatio 'Rayon Obscur' |  | +CC : 5c; Désactive lancer en ligne : 5c |
| 16119 | Ton. Mutatio 'Flétrissement' |  | Désactive lancer en ligne : 5d; +Dommages : 5d |
| 16120 | Ton. Mutatio 'Protection Aveuglante' |  | +Portée : 5e; -Délai relance : 5e |
| 16121 | Ton. Mutatio 'Horloge' |  | +CC : 5f; +Portée : 5f |
| 16122 | Ton. Mutatio 'Poussière Temporelle ' |  | +CC : 60; -Coût PA : 60 |
| 16123 | Ton. Mutatio 'Cadran de Xélor' |  | +Portée : 61; -Délai relance : 61 |
| 16124 | Ton. Mutatio 'Vol du Temps' |  | +Portée : 62; +Lancers/cible : 62 |
| 16125 | Ton. Mutatio 'Momification' |  | -Coût PA : 63; -Délai relance : 63 |
| 16126 | Ton. Mutatio 'Sablier de Xélor' |  | +CC : 64; +Dommages : 64 |

#### Classe Xel — toniques 16127 à 16146

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16127 | Ton. Mutatio 'Roulette' |  | -Délai relance : 65; +Lancers/tour : 65 |
| 16128 | Ton. Mutatio 'Pile ou Face' |  | +CC : 66; +Portée : 66; +Dommages : 66 |
| 16129 | Ton. Mutatio 'Chance d'Ecaflip' |  | -Coût PA : 67; -Délai relance : 67 |
| 16130 | Ton. Mutatio 'Trèfle' |  | +Portée : 68; -Délai relance : 68 |
| 16131 | Ton. Mutatio 'Bond du Félin' |  | +Lancers/tour : 69; +Portée : 69 |
| 16132 | Ton. Mutatio 'Roue de la Fortune' |  | +Portée : 6a; -Délai relance : 6a |
| 16133 | Ton. Mutatio 'Topkaj' |  | +Dommages : 6b; +CC : 6b; +Portée : 6b |
| 16134 | Ton. Mutatio 'Esprit Félin' |  | +Portée : 6c; +Lancers/cible : 6c |
| 16135 | Ton. Mutatio 'Bluff' |  | +CC : 6d; +Portée : 6d |
| 16136 | Ton. Mutatio 'Griffe Joueuse' |  | +CC : 6e; +Lancers/tour : 6e |
| 16137 | Ton. Mutatio 'Contrecoup' |  | -Délai relance : 6f; +Portée : 6f |
| 16138 | Ton. Mutatio 'Griffe de Ceangal' |  | +CC : 70; +Portée : 70 |
| 16139 | Ton. Mutatio 'Perception' |  | -Coût PA : 71; -Délai relance : 71 |
| 16140 | Ton. Mutatio 'Rekop' |  | +Dommages : 72; +Portée : 72 |
| 16141 | Ton. Mutatio 'Odorat' |  | -Coût PA : 73; +Portée : 73 |
| 16142 | Ton. Mutatio 'Langue Râpeuse ' |  | Désactive ligne de vue : 74; +CC : 74 |
| 16143 | Ton. Mutatio 'Griffe Invocatrice' |  | -Coût PA : 75; -Délai relance : 75 |
| 16144 | Ton. Mutatio 'Réflexes' |  | +Portée : 76; -Délai relance : 76 |
| 16145 | Ton. Mutatio 'Tout ou rien' |  | -Coût PA : 77; +Portée : 77 |
| 16146 | Ton. Mutatio 'Destin d'Ecaflip' |  | +Dommages : 78; +Portée : 78 |

#### Classe Eca — toniques 16147 à 16166

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16147 | Ton. Mutatio 'Mot Curatif' |  | +CC : 79; -Coût PA : 79 |
| 16148 | Ton. Mutatio 'Mot Blessant' |  | +Dommages : 7a; +CC : 7a |
| 16149 | Ton. Mutatio 'Mot Drainant' |  | +CC : 7b; +Lancers/cible : 7b |
| 16150 | Ton. Mutatio 'Mot Soignant' |  | +Soins : 7c; +Lancers/cible : 7c |
| 16151 | Ton. Mutatio 'Mot Interdit' |  | +Portée : 7d; Désactive ligne de vue : 7d |
| 16152 | Ton. Mutatio 'Mot Stimulant' |  | +CC : 7e; +Portée : 7e |
| 16153 | Ton. Mutatio 'Mot de Prévention' |  | +Portée : 7f; -Délai relance : 7f |
| 16154 | Ton. Mutatio 'Mot de Frayeur' |  | +Portée : 80; Désactive ligne de vue : 80 |
| 16155 | Ton. Mutatio 'Mot d'Amitié' |  | +Portée : 81; -Délai relance : 81 |
| 16156 | Ton. Mutatio 'Mot Revitalisant' |  | Désactive ligne de vue : 82; +Lancers/tour : 82 |
| 16157 | Ton. Mutatio 'Mot de Régénération' |  | +Portée : 83; +Lancers/cible : 83 |
| 16158 | Ton. Mutatio 'Mot d'Epine' |  | +Portée : 84; Désactive lancer en ligne : 84 |
| 16159 | Ton. Mutatio 'Mot de Jouvence' |  | -Coût PA : 85; Désactive ligne de vue : 85 |
| 16160 | Ton. Mutatio 'Mot Vampirique' |  | +CC : 86; +Lancers/cible : 86 |
| 16161 | Ton. Mutatio 'Mot de Sacrifice' |  | +Soins : 87; +Lancers/cible : 87 |
| 16162 | Ton. Mutatio 'Mot d'Immobilisation' |  | Désactive ligne de vue : 88; -Délai relance : 88 |
| 16163 | Ton. Mutatio 'Mot d'Envol' |  | +Portée : 89; +Lancers/tour : 89; +Lancers/cible : 89 |
| 16164 | Ton. Mutatio 'Mot de Silence' |  | +Portée : 8a; -Coût PA : 8a |
| 16165 | Ton. Mutatio 'Mot d'Altruisme' |  | -Coût PA : 8b; +CC : 8b |
| 16166 | Ton. Mutatio 'Mot de Reconstitution' |  | Désactive lancer en ligne : 8c; -Délai relance : 8c |

#### Classe Eni — toniques 16167 à 16186

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16167 | Ton. Mutatio 'Pression' |  | +Portée : 8d; +Dommages : 8d |
| 16168 | Ton. Mutatio 'Bond' |  | +Portée : 8e; -Coût PA : 8e |
| 16169 | Ton. Mutatio 'Intimidation' |  | +Portée : 8f; Désactive ligne de vue : 8f; +Dommages : 8f |
| 16170 | Ton. Mutatio 'Compulsion' |  | -Coût PA : 90; +Portée : 90 |
| 16171 | Ton. Mutatio 'Epée Divine' |  | +CC : 91; +Portée : 91 |
| 16172 | Ton. Mutatio 'Epée du destin' |  | +CC : 92; +Dommages : 92 |
| 16173 | Ton. Mutatio 'Guide de Bravoure ' |  | -Délai relance : 93; +CC : 93 |
| 16174 | Ton. Mutatio 'Amplification' |  | +Portée : 94; +Lancers/cible : 94 |
| 16175 | Ton. Mutatio 'Mutilation' |  | +CC : 95; -Coût PA : 95; +Lancers/tour : 95 |
| 16176 | Ton. Mutatio 'Couper' |  | +Portée : 96; Désactive ligne de vue : 96 |
| 16177 | Ton. Mutatio 'Souffle' |  | +Portée : 97; -Délai relance : 97 |
| 16178 | Ton. Mutatio 'Epée du Jugement' |  | Portée modifiable : 98; +Dommages : 98 |
| 16179 | Ton. Mutatio 'Puissance' |  | -Coût PA : 99; -Délai relance : 99; +Portée : 99 |
| 16180 | Ton. Mutatio 'Epée Destructrice' |  | -Coût PA : 9a; +Portée : 9a |
| 16181 | Ton. Mutatio 'Vitalité' |  | -Délai relance : 9b; +Portée : 9b |
| 16182 | Ton. Mutatio 'Tempête de Puissance' |  | Désactive ligne de vue : 9c; +Lancers/cible : 9c |
| 16183 | Ton. Mutatio 'Epée Céleste' |  | Désactive ligne de vue : 9d; +Dommages : 9d |
| 16184 | Ton. Mutatio 'Concentration' |  | +Dommages : 9e; +Lancers/cible : 9e |
| 16185 | Ton. Mutatio 'Colère de Iop' |  | -Coût PA : 9f; +Dommages : 9f |
| 16186 | Ton. Mutatio 'Epée de Iop' |  | +Dommages : a0; Désactive lancer en ligne : a0 |

#### Classe Iop — toniques 16187 à 16206

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16187 | Ton. Mutatio 'Flèche Magique' |  | -Coût PA : a1; +Lancers/cible : a1 |
| 16188 | Ton. Mutatio 'Tir Critique' |  | -Délai relance : a2; +CC : a2 |
| 16189 | Ton. Mutatio 'Flèche Glacée' |  | +Lancers/cible : a3; +Dommages : a3 |
| 16190 | Ton. Mutatio 'Flèche Empoisonnée' |  | Désactive ligne de vue : a4; +Lancers/cible : a4 |
| 16191 | Ton. Mutatio 'Flèche Enflammée' |  | -Coût PA : a5; +Lancers/tour : a5 |
| 16192 | Ton. Mutatio 'Tir Puissant' |  | -Délai relance : a6; -Coût PA : a6 |
| 16193 | Ton. Mutatio 'Flèche d'Expiation' |  | -Coût PA : a7; +Dommages : a7 |
| 16194 | Ton. Mutatio 'Oeil de Taupe' |  | -Coût PA : a8; -Délai relance : a8 |
| 16195 | Ton. Mutatio 'Flèche de Recul' |  | -Coût PA : a9; +Lancers/cible : a9 |
| 16196 | Ton. Mutatio 'Flèche d'Immobilisation' |  | +Lancers/cible : aa; +Dommages : aa |
| 16197 | Ton. Mutatio 'Flèche Punitive' |  | -Coût PA : ab; +Dommages : ab |
| 16198 | Ton. Mutatio 'Tir Eloigné' |  | -Coût PA : ac; +Portée : ac; -Délai relance : ac |
| 16199 | Ton. Mutatio 'Flèche Harcelante' |  | -Coût PA : ad; +Lancers/cible : ad |
| 16200 | Ton. Mutatio 'Flèche Cinglante' |  | -Coût PA : ae; +Dommages : ae |
| 16201 | Ton. Mutatio 'Flèche Destructrice' |  | +CC : af; +Lancers/cible : af |
| 16202 | Ton. Mutatio 'Flèche Persécutrice' |  | +CC : b0; +Dommages : b0 |
| 16203 | Ton. Mutatio 'Flèche Ralentissante' |  | Désactive lancer en ligne : b1; +CC : b1 |
| 16204 | Ton. Mutatio 'Flèche Absorbante' |  | +CC : b2; +Dommages : b2 |
| 16205 | Ton. Mutatio 'Flèche Explosive' |  | +CC : b3; +Lancers/tour : b3 |
| 16206 | Ton. Mutatio 'Maîtrise de l'Arc' |  | -Délai relance : b4; -Coût PA : b4 |

#### Classe Cra — toniques 16207 à 16226

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16207 | Ton. Mutatio 'Tremblement' |  | +Portée : b5; +CC : b5 |
| 16208 | Ton. Mutatio 'La Folle' |  | +Portée : b6; -Délai relance : b6; +Lancers/tour : b6 |
| 16209 | Ton. Mutatio 'Ronce' |  | +Dommages : b7; +Lancers/cible : b7 |
| 16210 | Ton. Mutatio 'Feu de Brousse' |  | +Dommages : b8; Désactive ligne de vue : b8 |
| 16211 | Ton. Mutatio 'Herbe Folle' |  | Désactive lancer en ligne : b9; +Lancers/tour : b9 |
| 16212 | Ton. Mutatio 'Arbre' |  | -Coût PA : ba; +Portée : ba |
| 16213 | Ton. Mutatio 'La Surpuissante' |  | -Délai relance : bb; +Portée : bb |
| 16214 | Ton. Mutatio 'Ronce Insolente' |  | -Délai relance : bc; -Coût PA : bc |
| 16215 | Ton. Mutatio 'La Sacrifiée' |  | Portée modifiable : bd; +Portée : bd |
| 16216 | Ton. Mutatio 'La Gonflable' |  | +Portée : be; -Coût PA : be |
| 16217 | Ton. Mutatio 'Ronces Multiples' |  | +Lancers/tour : bf; +Dommages : bf |
| 16218 | Ton. Mutatio 'Ronce Apaisante' |  | +Soins : c0; Désactive ligne de vue : c0 |
| 16219 | Ton. Mutatio 'La Bloqueuse' |  | +Portée : c1; -Délai relance : c1; +Lancers/tour : c1 |
| 16220 | Ton. Mutatio 'Ronces Agressives ' |  | +CC : c2; +Lancers/cible : c2 |
| 16221 | Ton. Mutatio 'Larme' |  | +CC : c3; Désactive ligne de vue : c3 |
| 16222 | Ton. Mutatio 'Vent Empoisonné' |  | +Portée : c4; +CC : c4 |
| 16223 | Ton. Mutatio 'Puissance Sylvestre' |  | +Portée : c5; -Délai relance : c5 |
| 16224 | Ton. Mutatio 'Sacrifice Poupesque' |  | +Portée : c6; +Lancers/tour : c6 |
| 16225 | Ton. Mutatio 'Connaissance des Poupées' |  | -Délai relance : c7; +Portée : c7 |
| 16226 | Ton. Mutatio 'Poison Paralysant' |  | Désactive ligne de vue : c8; +CC : c8 |

#### Classe Sadi — toniques 16227 à 16246

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16227 | Ton. Mutatio 'Châtiment Forcé' |  | -Coût PA : 1af; +CC : 1af; -Délai relance : 1af |
| 16228 | Ton. Mutatio 'Pied du Sacrieur' |  | +Portée : 1b0; +Dommages : 1b0 |
| 16229 | Ton. Mutatio 'Châtiment Osé' |  | -Coût PA : 1b1; +CC : 1b1; -Délai relance : 1b1 |
| 16230 | Ton. Mutatio 'Attirance' |  | +Lancers/cible : 1b2; Désactive ligne de vue : 1b2 |
| 16231 | Ton. Mutatio 'Transfert de Vie' |  | +Portée : 1b3; -Coût PA : 1b3 |
| 16232 | Ton. Mutatio 'Assaut' |  | Désactive ligne de vue : 1b4; +Portée : 1b4 |
| 16233 | Ton. Mutatio 'Châtiment Agile' |  | -Coût PA : 1b5; +CC : 1b5; -Délai relance : 1b5 |
| 16234 | Ton. Mutatio 'Transposition' |  | +Portée : 1b6; -Délai relance : 1b6 |
| 16235 | Ton. Mutatio 'Dissolution' |  | +Lancers/tour : 1b7; +Dommages : 1b7 |
| 16236 | Ton. Mutatio 'Sacrifice' |  | -Délai relance : 1b8; +Portée : 1b8 |
| 16237 | Ton. Mutatio 'Châtiment Vitalesque' |  | -Coût PA : 1b9; +CC : 1b9; -Délai relance : 1b9 |
| 16238 | Ton. Mutatio 'Absorption' |  | +Portée : 1ba; +Lancers/cible : 1ba |
| 16239 | Ton. Mutatio 'Châtiment Spirituel' |  | -Coût PA : 1bb; +CC : 1bb; -Délai relance : 1bb |
| 16240 | Ton. Mutatio 'Dérobade' |  | +Portée : 1bc; -Délai relance : 1bc |
| 16241 | Ton. Mutatio 'Coopération' |  | -Délai relance : 1bd; +Portée : 1bd |
| 16242 | Ton. Mutatio 'Punition' |  | +CC : 1be; -Délai relance : 1be |
| 16243 | Ton. Mutatio 'Furie' |  | +Portée : 1bf; +Dommages : 1bf |
| 16244 | Ton. Mutatio 'Epée volante' |  | -Délai relance : 1c0; Désactive lancer en ligne : 1c0 |
| 16245 | Ton. Mutatio 'Détour' |  | +Portée : 1c1; +Lancers/tour : 1c1 |
| 16246 | Ton. Mutatio 'Folie sanguinaire' |  | +CC : 1c2; +Lancers/tour : 1c2; +Lancers/cible : 1c2 |

#### Classe Sacri — toniques 16247 à 16266

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16247 | Ton. Mutatio 'Picole' |  | +CC : 2ae |
| 16248 | Ton. Mutatio 'Poing Enflammé' |  | +Dommages : 2af; +Portée : 2af |
| 16249 | Ton. Mutatio 'Vulnérabilité Incandescente' |  | Désactive ligne de vue : 2b0; +Portée : 2b0 |
| 16250 | Ton. Mutatio 'Epouvante' |  | +Lancers/cible : 2b1; +Portée : 2b1 |
| 16251 | Ton. Mutatio 'Souffle Alcoolisé' |  | +Dommages : 2b2; +Portée : 2b2 |
| 16252 | Ton. Mutatio 'Vulnérabilité Aqueuse' |  | Désactive ligne de vue : 2b3; +Portée : 2b3 |
| 16253 | Ton. Mutatio 'Gueule de Bois' |  | +CC : 2b4; +Portée : 2b4 |
| 16254 | Ton. Mutatio 'Karcham' |  | +Portée : 2b5 |
| 16255 | Ton. Mutatio 'Vulnérabilité Venteuse' |  | Désactive ligne de vue : 2b6; +Portée : 2b6 |
| 16256 | Ton. Mutatio 'Stabilisation' |  | Désactive ligne de vue : 2b7; -Délai relance : 2b7 |
| 16257 | Ton. Mutatio 'Chamrak' |  | +Portée : 2b8; Désactive lancer en ligne : 2b8 |
| 16258 | Ton. Mutatio 'Vulnérabilité Terrestre' |  | Désactive ligne de vue : 2b9; +Portée : 2b9 |
| 16259 | Ton. Mutatio 'Souillure' |  | +Portée : 2ba; +CC : 2ba |
| 16260 | Ton. Mutatio 'Lait de Bambou' |  | — |
| 16261 | Ton. Mutatio 'Vague à Lame' |  | +CC : 2bc; +Dommages : 2bc |
| 16262 | Ton. Mutatio 'Colère de Zatoïshwan' |  | -Coût PA : 2bd; -Délai relance : 2bd |
| 16263 | Ton. Mutatio 'Flasque Explosive' |  | +CC : 2be; +Dommages : 2be |
| 16264 | Ton. Mutatio 'Pandatak' |  | +CC : 2bf; Désactive ligne de vue : 2bf |
| 16265 | Ton. Mutatio 'Pandanlku' |  | Désactive ligne de vue : 2c0; +CC : 2c0 |
| 16266 | Ton. Mutatio 'Lien Spiritueux' |  | -Délai relance : 2c1; Désactive lancer en ligne : 2c1 |

#### Classe Panda — toniques 16267 à 16286

| ID | Nom | Sort ciblé | Effet décodé |
|---|---|---|---|
| 16268 | Gladiatrool Caractéristiques |  | — |

### 5.5 Tonique « Gladiatrool Caractéristiques »

| ID | Nom | Effet décodé |
|---|---|---|
| 16268 | Gladiatrool Caractéristiques | — |

---

## 6. Système de récompense des toniques

Source : [`Player.getWrPacket(int palier)`](../serveur/game/src/client/Player.java:7606) et [`Constant.java`](../serveur/game/src/kernel/Constant.java:4588).

À chaque palier, le serveur propose **3 catégories de 7 toniques** (packet `wr`) :

| Catégorie | Contenu |
|---|---|
| `toniques0` | 7 toniques tirées de `TONIQUE1` (16002-16012) |
| `toniques1` | 7 toniques tirées de `TONIQUE2` (16013-16023) |
| `toniques2` | 7 toniques tirées de `getToniques3byclasse(classe)` + Rarus (16024-16026) |

`getToniques3byclasse(classeid)` retourne les 20 IDs `16007 + classeid*20` à `+19`, soit :

| Classe | IDs des Mutatio |
|---|---|
| Feca | 16047 – 16066 |
| Osamodas | 16067 – 16086 |
| Enutrof | 16087 – 16106 |
| Sram | 16107 – 16126 |
| Xel | 16127 – 16146 |
| Eca | 16147 – 16166 |
| Eni | 16167 – 16186 |
| Iop | 16187 – 16206 |
| Cra | 16207 – 16226 |
| Sadi | 16227 – 16246 |
| Sacri | 16247 – 16266 |
| Panda | 16267 – 16286 |

Le packet contient aussi la chaîne de stats du palier (`getStatStringbyPalier`) et la progression `10;20;40;60;90;120;160;200;250;300`.
