
//Requête de l'API pour récupérer tous les articles
function startAllProduct () {
    fetch("http://localhost:3000/api/products")
        .then((res) => res.json())

// Construction du HTML
        .then((data) => {
            
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
// Injection du HTML dans le DOM : Pointer puis injecter
        document.querySelector('#items').insertAdjacentHTML ('beforeend', display)
    })

    .catch((err) => console.log('Impossible de contacter le serveur'))
}

// Lancement de la fonction au chargement de la page
window.addEventListener('load', startAllProduct)
