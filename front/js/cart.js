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

// Récupérer un article dans l'API en fonction de l'id du produit sélectionné
async function getArticle (productId) {
    const res = await fetch("http://localhost:3000/api/products/" + productId)
    if (res.ok) {
    return await res.json()
    }
    throw new Error ('Impossible de contacter le serveur')
}

/** Récupérer chaque produit du tableau, requêter l'API correspondant aux produits du tableau
  * Si l'id est le même, ne pas requêter de nouveau l'API et rajouter les qtés au produit deja existant*/
 async function displayCart (productsInCart) {
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
// Injection du produit dans le DOM
    document.querySelector('#cart__items').insertAdjacentHTML ('beforeend', displayAllProduct)
  
    getTotalQuantity()
    getTotalPrice()
}

/**Telecharger le panier actuel, modifier les qtés ou supprimer un produit
 * (quantityValue est l'input quantité)- A REVOIR */

 function updateCart (domElt, quantityValue) {
// vérifier que la quantityValue a été passée en type nombre
  if (typeof quantityValue !== "number") {
    quantityValue = parseInt(quantityValue)
  }

// Target l'élément parent et retrieve l'id et la couleur de ses attributs
  let currentElt = domElt.closest("article")
  let currentEltId = currentElt.getAttribute('data-id')
  let currentEltColor = currentElt.getAttribute('data-color')

 /**Recherche du produit actuel dans le panier
 * find permet de chercher un élément dans un tableau par rapport à une condition*/
  let foundProduct = cart.find((product) => product.id == currentEltId && product.color == currentEltColor)

  // Si le est trouvé : modifier ses quantités 
  foundProduct.quantity = quantityValue

  // Supprimer le produit du panier et du DOM
  if (foundProduct.quantity <= 0) {
    cart.splice(cart.indexOf(foundProduct), 1) // Indexof cherche l'Index d'un produit
    currentElt.remove()
  }
  getTotalQuantity()
  getTotalPrice()

  // Enregistrer dans le localStorage
  saveCart(cart)
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

/** Calcul du nombre d'article dans le panier*/
function getTotalQuantity () {
  let number = 0;
  for (let product of cart) {
      number += product.quantity
  }
  document.querySelector('#totalQuantity').textContent = number
}

/** Calcul du prix total du panier*/
async function getTotalPrice () {
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
document.querySelector('#totalPrice').textContent = productPrice
}

/** Mise en place des Listeners pour les quantity input et le boutton supprimer - A REVOIR*/
function setListeners () {
  // Eventlistener sur les quantity input
  document.querySelectorAll('.itemQuantity')
          .forEach(function (inputQty) {
            inputQty.addEventListener('change', function (e) {
                updateCart(inputQty, e.target.value)})}
  )
  // Eventlistener sur le bouton "supprimer"
  document.querySelectorAll('.deleteItem')
          .forEach(function (buttonSuppr) {
            buttonSuppr.addEventListener('click', function () {
              updateCart(buttonSuppr, 0)})}
  )
}

/** Application*/
let cart = getCart()
async function application() {
await displayCart(cart)
await setListeners()
}

application()

