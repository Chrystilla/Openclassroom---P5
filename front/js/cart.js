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
 * (quantityValue est l'input quantité)*/
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

// Supprimer le produit du panier et du DOM si les quantités sont <=0
  if (foundProduct.quantity <= 0) {
// Indexof cherche l'Index d'un produit
    cart.splice(cart.indexOf(foundProduct), 1) 
//La méthode Element.remove() retire l'élément courant du DOM
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

// Mise en place des Listeners pour les quantity input et le boutton supprimer
function setListeners () {
  // Eventlistener sur les quantity input
  document.querySelectorAll('.itemQuantity')
          .forEach(function (inputQty) {
            inputQty.addEventListener('change', function (e) {
                updateCart(inputQty, e.target.value)})}
  )
  // Eventlistener sur le bouton "supprimer" (passe une quantité à 0 sur la fonction updateCart pour faire jouer la fonction de suppression)
  document.querySelectorAll('.deleteItem')
          .forEach(function (buttonSuppr) {
            buttonSuppr.addEventListener('click', function () {
              updateCart(buttonSuppr, 0)})}
  )
}

/** Application*/
let cart = getCart()
console.log(cart)
async function application() {
await displayCart(cart)
await setListeners()
}

application()

// Formulaire

const firstName = document.querySelector('#firstName')
const lastName = document.querySelector('#lastName')
const address = document.querySelector('#address')
const city = document.querySelector('#city')
const email = document.querySelector('#email')
const order = document.querySelector('#order')

const firstNameErrorMsg = document.querySelector('#firstNameErrorMsg')
const lastNameErrorMsg = document.querySelector('#lastNameErrorMsg')
const addressErrorMsg = document.querySelector('#addressErrorMsg')
const cityErrorMsg = document.querySelector('#cityErrorMsg')
const emailErrorMsg = document.querySelector('#emailErrorMsg')

//Def des Regex :
// Regular expression :
// a-z lowercase, A-Z uppercase , all spécial language accent
// \s => allow space
//\,  \'  \- allow comma, simple quote and dash
// /^[...]*$/ match all between the brackets many times
// /i tets if don't match the regular expression
const regexName = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s\,\'\-]*$/i;
const regexAddress = /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s\,\'\-]*$/i;
const regexEmail = /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,4}$/i;

//Mise à l'écoute des différents champs du formulaire et soumission au regex

firstName.addEventListener('change', function () {
  if (regexName.test(firstName.value) == false) {
    firstNameErrorMsg.textContent = ('Veuillez entrer un prénom sans chiffre ni caractères spéciaux')
  } else {
    firstNameErrorMsg.innerHTML = null;
  } 
})

lastName.addEventListener('change', function () {
  if (regexName.test(lastName.value) == false) {
    lastNameErrorMsg.textContent = ('Veuillez entrer un nom sans chiffre ni caractères spéciaux')
  } else {
    lastNameErrorMsg.innerHTML = null;
  }
})

address.addEventListener('change', function () {
  if (regexAddress.test(address.value) == false) {
    addressErrorMsg.textContent = ('Veuillez entrer une adresse sans caractères spéciaux.')
  } else {
    addressErrorMsg.innerHTML = null;
  }
})

city.addEventListener('change', function () {
  if (regexAddress.test(city.value) == false) {
    cityErrorMsg.textContent = ('Veuillez entrer une ville sans caractères spéciaux.')
  } else {
    cityErrorMsg.innerHTML = null;
  }
})

email.addEventListener('change', function () {
  if (regexEmail.test(email.value) == false) {
    emailErrorMsg.textContent = ('Veuillez entrer une adress email valide.')
  } else {
    emailErrorMsg.innerHTML = null;
  }
})

//Construction de l'objet de contact et du tableau de produit
function setDataJson () {
  const contact = {
      firstName : firstName.value,
      lastName : lastName.value,
      address : address.value,
      city : city.value,
      email : email.value,
    }
  let products = []
    for (let cartProduct of cart) {
      if (products.find((product) => product.id == cartProduct.id)) {
        console.log("Id already exist");
      } else {
        products.push(cartProduct.id)
      }
    }
  let dataJSON = JSON.stringify({contact, products})
  console.log(dataJSON)
  return dataJSON
  }

//Envoi des data du formulaire dans l'API par la method POST
function postForm () {
  fetch ("http://localhost:3000/api/products/order", {
      method : 'POST',
      body : setDataJson(),
      headers : {
          'accept' : 'application/json',
          'content-type' : 'application/json',
      }
  })
  .then((res) => res.json())
  .then((body) => console.log(body))
}
// à remplacer par windows.location...
//Ecoute du bouton order et objet contact et tableau produit généré
order.addEventListener('click', function (e) {
  e.preventDefault();
  postForm ()
})









