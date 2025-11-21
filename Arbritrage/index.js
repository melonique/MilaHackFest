const fs = require('fs');



/**
 * Fonction pour transformer le string CSV en Array d'Objets
 */
const parseCSV = (csvString) => {
    // Séparer les lignes et enlever les espaces vides au début/fin
    const lines = csvString.trim().split(/\r?\n/);

    // Extraire les headers (la première ligne)
    // On enlève les headers du tableau 'lines' avec shift()
    const headers = lines.shift().split(';');

    return lines.map(line => {
        const columns = line.split(';');

        // Création de l'objet
        return {
            date: columns[0], // On garde la date en string, ou on peut faire new Date(...)
            tenor: parseInt(columns[1], 10),
            maturity: parseFloat(columns[2]),
            // ATTENTION: Remplacement de la virgule par un point pour le format JS
            value: parseFloat(columns[3].replace(',', '.'))
        };
    });
}



const makeFirstCombinaisons = (TENOR, MATURITY) => {

  const combinations = [];

    // liste les combinaisons possible de base (M0, T0)
    for (var i = 0; i < MATURITY.length; i++) {
      var m = MATURITY[i];
      for (var j = 0; j < TENOR.length; j++) {
        var t = TENOR[j];
        combinations.push({ maturity: m, tenor: t });
      }
    }
    return combinations;
}



const findMultiSplitOpportunities = (allCombinaisons, nbSplits = 1) => {
  const PRECISION = 0.0001;
  const isSame = (a, b) => Math.abs(a - b) < PRECISION;

  // Fonction récursive interne pour trouver les chaînes
  // target: la combinaison (théorique ou réelle) qu'on doit combler
  // currentSplits: combien de coupures il nous reste à faire
  const findChain = (target, currentSplits) => {

    // CAS DE BASE : Plus de split à faire.
    // On doit vérifier si le "reste" (target) existe tel quel dans la liste.
    if (currentSplits === 0) {
      const match = allCombinaisons.find(c =>
        isSame(c.maturity, target.maturity) &&
        isSame(c.tenor, target.tenor)
      );
      // Si on trouve le morceau final, on le retourne dans un tableau (fin de chaîne)
      // Sinon, on retourne un tableau vide (échec de la branche)
      return match ? [[match]] : [];
    }

    // CAS RÉCURSIF : Il reste des splits à faire.
    // 1. Trouver tous les candidats valides qui commencent au même moment
    //    mais qui sont strictement plus courts que la cible.
    const candidates = allCombinaisons.filter(c =>
      isSame(c.maturity, target.maturity) &&
      c.tenor < target.tenor - PRECISION // -PRECISION pour éviter les égalités strictes flottantes
    );

    // 2. Pour chaque candidat, calculer le reste et relancer la recherche
    return candidates.flatMap(part => {
      const remainderMaturity = target.maturity + part.tenor;
      const remainderTenor = target.tenor - part.tenor;

      const remainderTarget = { maturity: remainderMaturity, tenor: remainderTenor };

      // Appel récursif : on cherche la suite pour combler le reste
      const nextParts = findChain(remainderTarget, currentSplits - 1);

      // Si nextParts contient des solutions, on préfixe avec notre 'part' actuelle
      return nextParts.map(chain => [part, ...chain]);
    });
  };

  // --- Exécution principale ---
  // On teste chaque combinaison comme étant la "Combinaison 0" (la racine)
  return allCombinaisons.flatMap(c0 => {
    const validChains = findChain(c0, nbSplits);

    // On formate le résultat pour que ce soit lisible
    return validChains.map(chain => ({
      initial: c0,
      equivalent: chain // Contiendra [c1, c2] ou [c1, c2, c3] etc.
    }));
  });
};

function findPrice(data, date, tenor, maturity) {
  const found = data.find(item =>
    item.date === date &&
    item.tenor === tenor &&
    item.maturity === maturity
  );
  // Retourne la valeur si trouvée, sinon null (ou 0, selon ton besoin)
  return found ? found.value : null;
}

function addPrices(data) {
  let total = 0
  data.forEach((opt) => {
    total = total + opt.price
  })
  return total
}

// 1. Lire le fichier (assurez-vous que le fichier 'data.csv' existe)
try {
    const rawData = fs.readFileSync('data.csv', 'utf-8');

    // 2. Convertir le texte en tableau d'objets
    const PriceData = parseCSV(rawData);

    /* PriceData = [
        {
          date: '22/05/2050',
          tenor: 1,
          maturity: 0.0833333333333333,
          value: 0.041111859
        },
    ] */

    const TENOR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30]
    const MATURITY = [0.0833333333333333, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 7, 10, 15, 20, 25, 30]

    // combinaisons de base a comparer
    const Combinaisons0 = makeFirstCombinaisons(TENOR, MATURITY)

    // console.log(JSON.stringify(Combinaisons0));

    // Exemple pour 1 split (C0 = C1 + C2)
    const Equivalents = findMultiSplitOpportunities(Combinaisons0, 1);
    /* Equivalents = [
        {"initial":{"maturity":0.5,"tenor":2},
          "equivalent":[
            {"maturity":0.5,"tenor":1},
            {"maturity":1.5,"tenor":1}]}
      ] */

console.log(JSON.stringify(Equivalents, null, 0))

    // dans les result, va cehrcher les prix de
  const startDate = '01/01/2050'
  const EquivalentsWithPrices = Equivalents.map(opportunity => {

    // 1. Chercher le prix pour l'objet 'initial'
    const initialPrice = findPrice(
      PriceData,
      startDate,
      opportunity.initial.tenor,
      opportunity.initial.maturity
    );

    // 2. Chercher les prix pour chaque objet dans le tableau 'equivalent'
    const equivalentsEnriched = opportunity.equivalent.map(eq => {
      const eqPrice = findPrice(
        PriceData,
        startDate,
        eq.tenor,
        eq.maturity
      );

      // Retourne l'objet équivalent avec son nouveau champ price
      return {
        ...eq,
        price: eqPrice
      };
    });

    // 3. Retourner la structure complète mise à jour
    return {
      initial: {
        ...opportunity.initial,
        price: initialPrice
      },
      equivalent: equivalentsEnriched,
     // priceDiff: initialPrice - addPrices(equivalentsEnriched)
    };
  });

  // --- Résultat ---
  console.log("Résultat enrichi :", JSON.stringify(EquivalentsWithPrices, null, 2));

  // Manquer la volatilité



} catch (err) {
    console.error("Erreur lors de la lecture du fichier :", err);
}



/*
console.log("Nombre de trios trouvés:", opportunities.length);
if (opportunities.length > 0) {
  console.log("Exemple:", opportunities[0]);
}
*/


