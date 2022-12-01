// Extraction de l'id de l'URL au format "?id=..."
const url_id = window.location.search;

// Extraction de l'id
const url = new URLSearchParams(url_id);
const currentProductid = url.get("id")

// Requête de l'API pour récupérer le produit de l'id sur lequel l'utilisateur a cliqué
fetch("http://localhost:3000/api/products/" + currentProductid)
    .then((res) => res.json())
    

// Injection du produit dans le DOM
    .then((article) => {
        const productImg = document.querySelector('.item__img');
        productImg.innerHTML = `<img src="${article.imageUrl}" alt="${article.altTxt}">`

        const productName = document.querySelector('#title');
        productName.textContent = article.name;

        const productPrice = document.querySelector('#price');
        productPrice.textContent = article.price;

        const productDescription = document.querySelector('#description');
        productDescription.textContent = article.description;

        const productColor = document.querySelector('#colors');
        for (let color of article.colors) {
            const optionsColor = `<option value=${color}>${color}</option>`
            productColor.insertAdjacentHTML('beforeend', optionsColor)
        }
    })

    .catch((err) => console.log('Impossible de contacter le serveur'))


// Stock le panier dans le LocalStorage et le transforme en string (JSON.stringify) car le localstorage ne gère que des string
function saveCart (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Récupère le panier sauvegardé dans le localStorage et le transforme en objet (JSON.Parse)
function getCart () {
    let cart = localStorage.getItem("cart")
    if (cart === null) {
        return []
    } else {
        return JSON.parse(cart);
    }
}
       
function addToCart () {
// Récupère le panier sauvegardé dans le localStorage
    let cart = getCart ();
    const currentProductName = document.querySelector('#title').textContent
// parseInt converti une chaîne en nombre
    const currentProductQty = parseInt(document.querySelector('#quantity').value) 
    const currentProductColor = document.querySelector('#colors').value

// Vérification que les champs quantités et couleurs sont bien remplis
    if (currentProductQty <= 0 || currentProductColor === "") {
        alert("Veuillez saisir un nombre d'article et sélectionner une couleur")
    }
    else {
/**Recherche du produit sélectionné dans le cart
 * find permet de chercher un élément dans un tableau par rapport à une condition*/ 
        let foundProduct = cart.find((element) => element.id == currentProductid && element.color == currentProductColor);
// Si le produit existe déjà, augmenter ses quantités
        if (foundProduct != undefined) {
            foundProduct.quantity += currentProductQty;

// sinon crée l'objet et l'envoie dans le localStorage
            } else {
                let newArticle ={
                    id: currentProductid,
                    color: currentProductColor,
                    quantity: currentProductQty
                }
                cart.push(newArticle);
            }
        saveCart(cart)
        alert(`${currentProductQty} ${currentProductName} de couleur ${currentProductColor} a bien été ajouté au panier !`)
    }
}

// Mise à l'écoute du bouton "ajouter au panier"
document.querySelector('#addToCart')
        .addEventListener('click', addToCart)
        




