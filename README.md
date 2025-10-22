# DOM Project 1 — Shopping Cart

Petit projet DOM pour gérer un panier: augmenter/diminuer les quantités, supprimer un produit, “liker” un produit, et recalculer le total.

## Aperçu des fonctionnalités
- Boutons “+” et “-” pour modifier la quantité.
- Bouton poubelle pour supprimer un produit de la liste.
- Bouton cœur pour “liker” (change de couleur).
- Total mis à jour automatiquement selon quantités et suppressions.
- Icônes accessibles au clavier (tabindex, aria-label).

## Structure du projet
- index.html — markup de la page.
- style/style.css — styles (mise en page, grille responsive, navbar).
- js/script.js — logique DOM (événements et calcul du total).
- assets/ — images produits (baskets.png, socks.png, bag.png).

## Démarrage rapide
- Ouvrir index.html dans le navigateur
  - Linux: depuis le dossier du projet
    - xdg-open index.html
- Ou lancer un petit serveur local:
  - Python: `python3 -m http.server 5500` puis ouvrir http://localhost:5500
- Avec VS Code, “Open with Live Server” sur index.html.

## Comment ça marche (js/script.js)
- Au chargement (DOMContentLoaded), on sélectionne:
  - `.total-price .total` pour afficher le total.
  - Chaque produit via `.list-products .card .card-body`.
- parsePrice(text): extrait un nombre à partir d’un texte du type “100 $”.
- updateTotal():
  - Pour chaque produit restant, lit le prix unitaire (`.unit-price`) et la quantité (`.quantity`),
  - somme `prix * quantité`, et met à jour le total.
- Événements par produit:
  - “+” (.fa-plus-circle): incrémente `.quantity`, appelle updateTotal().
  - “-” (.fa-minus-circle): décrémente si > 0, appelle updateTotal().
  - “poubelle” (.fa-trash-alt): supprime le conteneur du produit, appelle updateTotal().
  - “cœur” (.fa-heart): toggle de la classe `.liked` (couleur via CSS).

Extrait (simplifié):
```js
plusBtn.addEventListener('click', () => {
  qtyEl.textContent = Number(qtyEl.textContent) + 1;
  updateTotal();
});

trashBtn.addEventListener('click', () => {
  productEl.closest('.card')?.parentElement?.remove();
  updateTotal();
});
```

## Styles principaux (style/style.css)
- Grille responsive pour les produits:
  - `.list-products` en `grid` avec `auto-fit` pour s’adapter à la largeur.
- Cœur “liké”:
  - `.fa-heart.liked { color: #e63946; }`
- Navbar améliorée (couleurs hover, sticky, ombre).
- Focus visible sur les icônes pour l’accessibilité.

## Ajouter un nouveau produit
Copier une carte existante dans `.list-products` puis modifier:
- Image (`src="assets/..."` + `alt`).
- Nom (`.card-title`), description (`.card-text`), prix (`.unit-price`).
Les événements JS se lient automatiquement si la structure est la même.

## Dépannage
- Les images ne s’affichent pas: vérifier `assets/` et les chemins relatifs.
- Le burger de la navbar: garder Bootstrap bundle (déjà inclus).
- Le total ne change pas: vérifier que `.unit-price` contient un nombre et que `.quantity` est un nombre.

## Licence
Projet pédagogique. Libre d’utilisation pour l’apprentissage.