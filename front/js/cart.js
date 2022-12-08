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

let cart = getCart()
const cartItem = document.querySelector('#cart__items')

if (cart.length == 0) {
  cartItem.insertAdjacentHTML ('beforeend', `Votre panier est vide`)
}

fetch("http://localhost:3000/api/products/")
  .then((res) => res.json())

  .then((API) => {
    
    let totalQuantity = 0
    let totalPrice = 0

    for (let product of cart) {

      for (let article of API) {
        
        if (product.id === article._id) {
          cartItem.insertAdjacentHTML ('beforeend',
              `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
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
          </article>`)

          totalQuantity +=product.quantity
          document.querySelector('#totalQuantity').textContent = totalQuantity

          totalPrice +=article.price * product.quantity
          document.querySelector('#totalPrice').textContent = totalPrice
        } 
      }

    }
    // Ecoute des changements de quantités
    document.querySelectorAll('.itemQuantity')
    .forEach(function (inputQty) {
      inputQty.addEventListener('change', function (e) {
        updateCart(inputQty, e.target.value)})}
    )
    // Ecoute du bouton "supprimer" (passe une quantité à 0 sur la fonction updateCart pour faire jouer la fonction de suppression)
    document.querySelectorAll('.deleteItem')
    .forEach(function (buttonSuppr) {
      buttonSuppr.addEventListener('click', function () {
        updateCart(buttonSuppr, 0)})}
    ) 
  })
  
  .catch((err) => console.log('Impossible de contacter le serveur'))


//Fonction de modification/Suppression d'un produit(quantityValue est l'input quantité)
function updateCart (domElt, quantityValue) {
  // vérifier que la quantityValue a été passée en type nombre
  if (typeof quantityValue !== "number") {
    quantityValue = parseInt(quantityValue)
  }

  // Target l'élément parent et retrieve l'id et la couleur de ses attributs
  let currentElt = domElt.closest("article")
  let currentEltId = currentElt.getAttribute('data-id')
  let currentEltColor = currentElt.getAttribute('data-color')

  //Recherche du produit actuel dans le panier
  for (let product of cart) {
    if (product.id == currentEltId && product.color == currentEltColor) {
      // Si le produit est trouvé : modifier ses quantités 
      product.quantity = quantityValue
    }
    // Si les quantités sont à 0 : Supprimer le produit du panier et du DOM
    if (product.quantity <=0) {
      // Indexof cherche l'Index d'un produit
      cart.splice(cart.indexOf(product), 1)
      //La méthode Element.remove() retire l'élément courant du DOM
      currentElt.remove()
    }
  }    
  // Enregistrer dans le localStorage
  saveCart(cart)
  window.location.reload()
}

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
    firstNameErrorMsg.insertAdjacentHTML ('beforeend', '')
  } 
})

lastName.addEventListener('change', function () {
  if (regexName.test(lastName.value) == false) {
    lastNameErrorMsg.textContent = ('Veuillez entrer un nom sans chiffre ni caractères spéciaux')
  } else {
    lastNameErrorMsg.insertAdjacentHTML ('beforeend', '')
  }
})

address.addEventListener('change', function () {
  if (regexAddress.test(address.value) == false) {
    addressErrorMsg.textContent = ('Veuillez entrer une adresse sans caractères spéciaux.')
  } else {
    addressErrorMsg.insertAdjacentHTML ('beforeend', '')
  }
})

city.addEventListener('change', function () {
  if (regexAddress.test(city.value) == false) {
    cityErrorMsg.textContent = ('Veuillez entrer une ville sans caractères spéciaux.')
  } else {
    cityErrorMsg.insertAdjacentHTML ('beforeend', '')
  }
})

email.addEventListener('change', function () {
  if (regexEmail.test(email.value) == false) {
    emailErrorMsg.textContent = ('Veuillez entrer une adress email valide.')
  } else {
    emailErrorMsg.insertAdjacentHTML ('beforeend', '')
  }
})

//Construction de l'objet Contact et du tableau d'ID produits
function setContactAndProduct () {
  const arrayProduct = []
      for (let cartProduct of cart) {
        if (arrayProduct.find((id) => id == cartProduct.id)) {
        } else {
          arrayProduct.push(cartProduct.id)
        }
      }
  const ContactAndProduct = {
    contact : {
        firstName : firstName.value,
        lastName : lastName.value,
        address : address.value,
        city : city.value,
        email : email.value,
      },
    products : arrayProduct
  }
  return ContactAndProduct
}

//Création de la fonction de POST des data Contacts et produits dans l'API
function postForm () {
  fetch ("http://localhost:3000/api/products/order", {
      method : 'POST',
      body : JSON.stringify(setContactAndProduct ()),
      headers : {
          'accept' : 'application/json',
          'content-type' : 'application/json',
      }
  })
  .then((res) => res.json())
  .then((body) => {
    window.location.href = "./confirmation.html?id=" + body.orderId
    console.log(body)
    localStorage.clear()
  })
  .catch((err) => console.log('erreur:' + err))
}

//Ecoute du bouton order et appel de la fonction POST
order.addEventListener('click', function (e) {
  e.preventDefault();
  postForm ()
})









