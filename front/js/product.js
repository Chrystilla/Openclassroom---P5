/**
 * 1. Récupérer l'id de l'URL pour afficher le bon produit => URLSearchParams
 * 2. Extraire l'id
 * 4. Récupérer l'article dans l'API en fonction de son id
 * 5. Construire l'HTML
 * 6. Injecter l'HTML dans le DOM
 *      6.1 Pointer sur l'élément items
 *      6.2 Injecter dans le DOM
 */

/** Récupération de l'URL inc. l'id */
const url_id = window.location.search;

/** Pour extraire l'id */
const url = new URLSearchParams(url_id);
const id = url.get("id")
console.log(id)

/** Requête de l'API */
fetch("http://localhost:3000/api/products/" + id)
    .then(function (res) {
        if (res.ok) {
            return res.json()
        }
    })
    .then(function(data) {
        const productImg = document.querySelector('#item__img');

        const productName = document.querySelector('#title');
        productName.textContent = data.name;
        const productPrice = document.querySelector('#price');
        productPrice.textContent = data.price;
        const productDescription = document.querySelector('#description');
        productDescription.textContent = data.description;
        const productColor = document.querySelector('#colors');
        for (let colors in data) {
            const optionsColor = `<option value=${data.colors}>${data.colors}</option>`
            productColor.insertAdjacentHTML('beforeend', optionsColor)
        }
    })

    .catch(function(err) {
        console.log(err)
        })