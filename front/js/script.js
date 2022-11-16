/**
 * 1. Récupérer les articles
 * 2. Construire l'HTML
 * 3. Injecter l'HTML dans le DOM
 *      3.1 Pointer sur l'élément items
 *      3.2 Injecter dans le DOM
 */

const start = function() {
fetch("http://localhost:3000/api/products")
    .then(function (res) {
        if (res.ok) {
            return res.json()
        }
    })

    .then(function(data) {
        
        let display = ''
        for(let article of data){

            display += `
                <a href="./product.html?id=${article._id}">
                    <article>
                    <img src="${article.imageUrl}" alt="${article.altTxt}">
                    <h3 class="productName">${article.name}</h3>
                    <p class="productDescription">${article.description}</p>
                    </article>
            </a>
        `    
        }
        console.log(display)
        document.querySelector('#items').insertAdjacentHTML ('beforeend', display)
    })

    .catch(function(err) {
    console.log(err)
    })
}

window.addEventListener('load', start)