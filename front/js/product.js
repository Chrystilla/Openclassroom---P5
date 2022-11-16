/**
 * 1. Se mettre à l'écoute du click utilisateur
 * 2. Ouvrir la page produit et afficher le bon produit => URLSearchParams
 * 3. Récupérer l'id du produit ayant été cliqué
 * 4. Récupérer l'article dans l'API en fonction de son id
 * 5. Construire l'HTML
 * 6. Injecter l'HTML dans le DOM
 *      6.1 Pointer sur l'élément items
 *      6.2 Injecter dans le DOM
 */
let url = "http://localhost:3000/api/products"
let params = new url (document.location).searchParams;
