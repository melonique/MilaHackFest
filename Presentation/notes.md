# Critères
Technical aspects :
-  How **accurate** is the model? // On va avoir un chiffre
-  How **complex** is the quantum algorithm? //
-  Can the architecture serve users at a **reasonable scale**? //
-  Etc.



Originality and uniqueness :
-  How **unique** is this project compared to others?
    - en suivant nos facon VS leur exemples
    - changer la forme du dataset
-  Did the team attempt **something new or difficult**?
    -
    -

Usefulness and complexity :
-  How **useful** is the project and how **well-designed** is it?
  - changmeents selon le besoin d'Affaire
    - prix = taux fix - taux variable + marge
  - appliqué sur les taux de changes
    -> plus ton tenor est loin: plus tu as de l'incertitude
    -> plus la maturité est longue, moins ton risque est grand

    ON POURAIT DIRE quel serait le meilleur Tenure et Maturity a choisir lors d'une opportunité de swap


> USE CASE ACTEUR:
  - Input le montant du pret -> Sortie: Combinaison(s) de Tenor et Maturité qui est le plus petit

> USE CASE VENDEUR:
  - Input le montant du pret -> Sortie: Combinaison(s) de Tenor et Maturité qui est le plus grand


> USE CASE: Rendement sans faire de risque
  -> Suposons qu'on a les prix dans l'Autre snes.
    - trouver une combinaison de (Tenure MAturité) qui

> USE CASE: Opportunité d'Arbritrage
  La théorie de l’arbitrage dit que deux portefeuilles qui génèrent exactement les mêmes flux de trésorerie futurs doivent avoir le même prix aujourd’hui.
  - Selon Black chose, Tenor 2 == Tenor 1 mainteant + Tenor 1 dans 1 ans. ()
  -> Script qui roule dans les odnnées. Valide les équivalents.

Sortir les combinaisons qui devraient etre pariel qui ne le sont pas.
  > CA CEST UNE POSSIBILITÉ DARBRITRAGE

MAX: Tenor 30 ans, Maturity 30 ans
MIN: Tenor 1an a 30 ans, Maturity 0.8 (1 mois) a 30 ans


TENOR: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30
MATURITY: 0.08, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, (6), 7, 10, 15, 20, 25, 30



// liste les combinaisons possible de base (M0, T0)

-----

// liste toutes les intervales qdoubles
M1 = M0
M2 = M1 + T1
M1 + T1 + T2 = M0 + T0


// Trouver les compositions de
M1 + SUM(Tx) = M0 + T0







combinaison équivalente :

Départ = Maturité
Fin = Tenor + maturité

VS

(opportunité de demi)
2 sénarios
  TENOR



M0, T0

Si en 2 occasions = Faut que l'autre fasse

M1 = M0
M2 = M1 + T1
M1 + T1 + T2 = M0 + T0

--------

-------





Condition =
  PAs de GAP / PAs de overlap sur
  Mn = Tn-1






1. Trouver les équivalents selon la formule plus haut
2. comaprer leur prix.





>

  -
  -
-  How **functional** is it at the time of judging?

Presentation :
-  How well did the team **present their project**?
-  Were they able to **explain their decision**?
