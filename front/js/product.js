/** Récupération de l'URL inc. l'id */
const url_id = window.location.search;

/** Extraction de l'id */
const url = new URLSearchParams(url_id);
const currentProductid = url.get("id")

/** Requête de l'API et zoom sur l'id*/
fetch("http://localhost:3000/api/products/" + currentProductid)
    .then(function (res) {
        if (res.ok) {
            return res.json()
        }
    })

/** Injection du produit dans le DOM */
    .then(function(article) {
        const displayImg = `<img src="${article.imageUrl}" alt="${article.altTxt}">`
        const productImg = document.querySelector('.item__img');
        productImg.innerHTML = displayImg

        const productName = document.querySelector('#title');
        productName.textContent = article.name;

        const productPrice = document.querySelector('#price');
        productPrice.textContent = article.price;

        const productDescription = document.querySelector('#description');
        productDescription.textContent = article.description;

        const productColor = document.querySelector('#colors');
        for (let i=0; i < article.colors.length; i++) {
            const optionsColor = `<option value=${article.colors[i]}>${article.colors[i]}</option>`
            productColor.insertAdjacentHTML('beforeend', optionsColor)
        }
    })

    .catch(function(err) {
        console.log(err)
        })

/** Stock le panier dans le LocalStorage et le transforme en string (JSON.stringify) */
function saveCart (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/** Récupère le panier sauvegardé dans le localStorage et le transforme en objet (JSON.Parse) */
function getCart () {
    let cart = localStorage.getItem("cart")
    if (cart === null) {
        return []
    } else {
        return JSON.parse(cart);
    }
}
       
function addToCart () {
/** Récupère le panier sauvegardé dans le localStorage */
    let localCart = getCart ();
    const currentProductName = document.getElementById('title').textContent
    const currentProductQty = parseInt(document.getElementById('quantity').value) /** parseInt converti une chaîne en nombre */
    const currentProductColor = document.getElementById('colors').value

/** Vérification que les champs quantités et couleurs sont bien remplis */
    if (currentProductQty <= 0 || currentProductColor === "") {
        alert("Veuillez saisir un nombre d'article et sélectionner une couleur")
    }
    else {
        let foundProductIndex = localCart.findIndex(element => element.id == currentProductid && element.color == currentProductColor);
/** Si le produit existe déjà, augmenter ses quantités */
        if (foundProductIndex >=0) {
                localCart[foundProductIndex].quantity += currentProductQty;
/** sinon créer l'objet et l'envoyer dans le localStorage */
            } else {
                let newArticle ={
                    id: currentProductid,
                    color: currentProductColor,
                    quantity: currentProductQty
                }
                localCart.push(newArticle);
            }
        saveCart(localCart)
        alert(`${currentProductQty} ${currentProductName} de couleur ${currentProductColor} a bien été ajouté au panier !`)
    }
}

/** Mise à l'écoute du click sur le bouton "ajouter au panier" */
document.querySelector('#addToCart')
        .addEventListener('click', addToCart)
        




