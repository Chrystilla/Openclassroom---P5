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
                <p>${article.price} €</p>
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

/** Application*/
let cart = getCart()
displayCart((cart))


/**Telecharger le panier actuel, modifier les qtés ou supprimer un produit  - A REVOIR
 * quantityValue est l'input quantité*/

 function updateCart (DOMElt, quantityValue) {
    // vérifier que la quantityValue a été passée dans le bon type
    if (typeof quantityValue !== "number") {
      quantityValue = parseInt(quantityValue)
    }

    // Target l'élément parent et retrieve l'id et la couleur dans ses attributs
    let currentProduct = DOMElt.closest("article")
    let currentProductId = currentProduct.getAttribute('data-id')
    let currentProductColor = currentProduct.getAttribute('data-color')

    // Trouver le produit actuel dans le panier, et s'il est trouvé, modifier ses quantités
    let foundProductIndex = cart.findIndex(element => element.id == currentProductId && element.color == currentProductColor);
    foundProductIndex.quantity = quantityValue
  
    // Supprimer le produit du panier et du DOM
    if (foundProductIndex.quantity <= 0) {
        cart.splice(cart.indexOf(foundProductIndex), 1)
        currentProduct.remove()
      }

    getTotalQuantity()
    getTotalPrice()
  
    // Enregistrer dans le localStorage
    saveCart(cart)
  }

/** Calcul du nombre d'article dans le panier*/
function getNumberProduct () {
    let number = 0;
    for (let product of cart) {
        number += product.quantity
    }
    return number
}
document.querySelector('#totalQuantity').insertAdjacentHTML ('beforeend', getNumberProduct())

/** Calcul du prix total du panier - A REVOIR*/
const getTotalPrice = async () => {
    let lastProductId
    let article
    let productPrice = 0
  for (let product of cart) {

    if (product.id !== lastProductId) {

      lastProductId = product.id
      article = await getArticle(product.id)
    }
    productPrice += product.quantity * article.price
  }
  return productPrice
}
document.querySelector('#totalPrice').insertAdjacentHTML ('beforeend', getTotalPrice())

/** Mise en place des Listeners - A REVOIR*/
const setListeners = async () => {
    // Eventlistener on the quantity input
    document.querySelectorAll('.itemQuantity').forEach(inputQty =>
      inputQty.addEventListener('change', (e) => updateCart(inputQty, e.target.value))
    )
    // Eventlistener on the button "supprimer"
    document.querySelectorAll('.deleteItem').forEach(buttonSuppr =>
      buttonSuppr.addEventListener('click', () => (updateCart(buttonSuppr, 0)))
    )
  }