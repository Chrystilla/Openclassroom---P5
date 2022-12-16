// Extraction de l'id de l'URL au format "?id=..."
const url_id = window.location.search;

// Extraction de l'id
const url = new URLSearchParams(url_id);
const currentProductId = url.get("id")

// Requête de l'API pour récupérer la fiche produit sur laquel l'utilisateur a cliqué
fetch("http://localhost:3000/api/products/" + currentProductId)
    .then((res) => res.json())

// Injection du produit dans le DOM
    .then((article) => {
        const productImg = document.querySelector('.item__img');
        productImg.insertAdjacentHTML ('beforeend', `<img src="${article.imageUrl}" alt="${article.altTxt}">`) 

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
    const currentProductQty = parseInt(document.querySelector('#quantity').value) // parseInt converti une string en nombre
    const currentProductColor = document.querySelector('#colors').value

// Vérification que les champs quantités et couleurs sont bien remplis
    if (currentProductQty <= 0 || currentProductQty > 100 || currentProductColor === "") {
        alert("Veuillez saisir une quantité entre 1 et 100 et sélectionner une couleur")
    }
    else {
//Recherche dans le panier du produit que je souhaite ajouter
        let foundProduct = cart.find((element) => element.id == currentProductId && element.color == currentProductColor);
// Si le produit existe déjà, augmenter ses quantités
        if (foundProduct != undefined) {
            foundProduct.quantity += currentProductQty;
// sinon crée l'objet et l'envoie dans le localStorage
        } else {
             let newArticle ={
                id: currentProductId,
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
        




