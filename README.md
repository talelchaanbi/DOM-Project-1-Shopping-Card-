# Éclat Mode — DOM Shopping Cart (Vanilla JS)

Fashion storefront demo with a persistent shopping cart, a product landing page, a dedicated cart page, and a polished, responsive UI.

## Highlights
- Products landing with a hero background carousel (assets: x.jpg, x1.jpg, x2.jpg, x3.jpg).
- Fixed, translucent navbar with synchronized cart badges across pages.
- Search: filter products on the landing; works via URL `?q=` and redirects from other pages.
- Cart page: increment/decrement, delete, like, and dynamic total; empty-cart UX with CTA.
- Persistent cart state via `localStorage`.
- About page with a themed hero.
- Professional footer: multi-column links, newsletter (Subscribe button in red), payment icons, and social links (Facebook, Instagram, X/Twitter, YouTube).
- Accessible and responsive layout with centered cards and sticky footer behavior.

## Tech Stack
- HTML5, CSS3 (Bootstrap 5.1.3), Font Awesome 6.0.0-beta2
- Vanilla JavaScript (no frameworks)
- LocalStorage for persistence

## Project Structure
- index.html — Products + hero carousel + search.
- cart.html — Cart management (quantities, like, remove, total).
- about.html — Brand/mission page with hero.
- style/style.css — Theme, layout, hero carousel layering, navbar, footer.
- js/script.js — Cart logic, search, navbar badge sync, layout helpers.
- assets/ — Images (products and hero backgrounds: x.jpg, x1.jpg, x2.jpg, x3.jpg, y.jpg).

## Run Locally
Option 1: open `index.html` directly in your browser.
- Linux CLI (optional): `xdg-open index.html`

Option 2: serve locally
- Python: `python3 -m http.server 5500` then open http://localhost:5500
- VS Code: use “Open with Live Server” on `index.html`.

## Using the App
- Add to cart on index: click “Add to cart” on a product card.
- Search: use the navbar search on index, or from other pages (they redirect to index?q=...).
- Cart page: use “+ / −” to adjust quantities, trash to remove, heart to like. Total updates live.
- Empty cart: shows a message and a button back to products.

## Configuration & Customization
- Brand color: edit CSS variable `--brand` in `style/style.css`.
- Hero images: update the carousel in `index.html` (`.hero .hero-bg`) with your images under `assets/`.
- Subscribe button color (footer): styled red via a scoped rule in `style/style.css`.
- Social links: update footer anchors in each HTML file as needed.

## Accessibility
- Semantic HTML, alt text for images.
- ARIA labels on interactive icons (cart qty controls, delete, like).
- Keyboard focus styles and readable hero overlay.

## Troubleshooting
- Image not visible: check filename and path under `assets/`.
- Cart badge not updating: ensure `data-product-id` and `data-price` are set on product buttons.
- Total not changing: ensure cart page elements include `.quantity` and `.unit-price` selectors.
- X/Twitter icon: using `fab fa-twitter` for compatibility with FA 6.0.0-beta2.

## License
Educational project. Free to use for learning purposes.