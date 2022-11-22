/** Stock le panier dans le LocalStorage*/
function saveCart (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/** Récupère le panier sauvegardé dans le localStorage*/
function getCart () {
    let cart = localStorage.getItem("cart")
    if (cart === null) {
        return []
    } else {
        return JSON.parse(cart);
    }
}
console.log(getCart())

/** Récupérer un article dans l'API en fonction de l'id du produit sélectionné */
const getArticle = async (productId) => {
    const r = await fetch("http://localhost:3000/api/products/" + productId)
    return await r.json()
}

/** Récupérer chaque produit du tableau, requêter l'API correspondant aux produits du tableau
  * Si l'id est le même, ne pas requêter de nouveau l'API
  * Ajouter la "string" html avec ces données */
const displayCart = async (productsInCart) => {
    let displayAllProduct =''
    let lastProductId
    let article
    for (let product of productsInCart) {
        if (product.id !== lastProductId) {
            lastProductId = product.id
            article = await getArticle(product.id) 
        }
    displayAllProduct += displayProduct(product, article)
    }
    /** ajout du code HTML dans le DOM */
    document.querySelector('#cart__items').insertAdjacentHTML ('beforeend', displayAllProduct)
}
/** Construction du html avec les infos de l'API correspondant à un produit*/
function displayProduct (product, article) {
    let html = `
        <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
            <div class="cart__item__img">
            <img src="${article.imageUrl}" alt="${article.altTxt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${article.name}</h2>
                <p>${product.color}</p>
                <p>${article.price}</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>
        </article>`
    return html
}

let cart = getCart()

displayCart((cart))

