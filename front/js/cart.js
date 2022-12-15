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
let cartPrice = []

// Requête de l'API pour récupérer tous les articles
function productFetch () {
  fetch("http://localhost:3000/api/products/")
    .then((res) => res.json())

    .then((API) => {

      // Construction et insertion du HTML pour chaque produit du panier
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
            cartPrice.push(article.price)
          }
        }
      }

      // Insertion des quantités et du prix total
      document.querySelector('#totalQuantity').textContent = setTotalQuantity()
      document.querySelector('#totalPrice').textContent = setTotalPrice()

      // Ecoute des changements de quantités
      document.querySelectorAll('.itemQuantity')
      .forEach(function (inputQty) {
        inputQty.addEventListener('change', function (e) {
          updateCart(inputQty, e.target.value)})}
      )

      // Ecoute du bouton "supprimer"
      document.querySelectorAll('.deleteItem')
      .forEach(function (buttonSuppr) {
        buttonSuppr.addEventListener('click', function () {
          updateCart(buttonSuppr, 0)})}
      ) 
    })

    .catch((err) => console.log(err))
}
    
//Fonction de calcul du nombre total de produits
function setTotalQuantity () {
  let totalQuantity = 0
  for (let product of cart) {
    totalQuantity += product.quantity
  }
  return totalQuantity
}

//Fonction de calcul du prix total
function setTotalPrice () {
  let totalPrice = 0
    for (let i=0; i<cartPrice.length; i++) {
      totalPrice += cartPrice[i] * cart[i].quantity
  }
  return totalPrice
}

//Fonction de modification/Suppression d'un produit
function updateCart (domElement, quantityValue) {

  // Vérification que la quantityValue a été passée en type nombre
  if (typeof quantityValue !== "number") {
    quantityValue = parseInt(quantityValue)
  }

  // Target le produit correspondant aux boutons et retrieve l'id et la couleur de ses attributs
  let currentProduct = domElement.closest("article")
  let currentProductId = currentProduct.getAttribute('data-id')
  let currentproductColor = currentProduct.getAttribute('data-color')

  //Recherche du produit actuel dans le panier
  for (let product of cart) {
    if (product.id == currentProductId && product.color == currentproductColor) {
      // Si le produit est trouvé : modifier ses quantités 
      product.quantity = quantityValue
    }
    // Si les quantités sont à 0 : Supprimer le produit du panier et du DOM
    if (product.quantity <=0) {
      cart.splice(cart.indexOf(product), 1) // Indexof cherche l'Index d'un produit
      currentProduct.remove() // La méthode Element.remove() retire l'élément courant du DOM
    }

    if (product.quantity >100) {
      alert("Vous ne pouvez saisir une quantité supérieure à 100")
    }

  }    
  // Enregistrer dans le localStorage et recharger la page
  saveCart(cart)
  window.location.reload()
}

//Fonction de classement des produits par id
function getSortedProducts (cart) {
  return cart.sort(function (a, b) {
    if (a.id < b.id)
      return -1
    if (a.id > b.id)
      return 1
    if (a.id === b.id)
      return 0
  })
}

// Si le panier n'est pas vide, affichage du panier classé par modèle
if (cart.length == 0) {
  cartItem.insertAdjacentHTML ('beforeend', `Votre panier est vide`)
} else {
productFetch()
getSortedProducts (cart)
}

// Target des champs du formulaire
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

// Def des Regex :
// Regular expression :
// a-z lowercase, A-Z uppercase , all spécial language accent
// \s => allow space
// \,  \'  \- allow comma, simple quote and dash
// /^[...]*$/ match all between the brackets many times
// /i tets if don't match the regular expression
const regexName = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s\,\'\-]*$/i;
const regexAddress = /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s\,\'\-]*$/i;
const regexEmail = /^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,4}$/i;

//Construction de l'objet Contact et du tableau d'ID produits
function setContactAndProduct () {
  const arrayProduct = []
      for (let product of cart) {
        if (arrayProduct.find((id) => id == product.id)) {
        } else {
          arrayProduct.push(product.id)
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

//Création de la fonction de POST de ContactAndProduct dans l'API
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
      localStorage.clear()
    })
    .catch((err) => console.log('erreur:' + err))
  }

// Ecoute du bouton "Commander"
order.addEventListener('click', function (e) {
  e.preventDefault();
  // Soumission des différents champs du formulaire aux Regex
  const firstNameTest = regexName.test(firstName.value);
  const lastNameTest = regexName.test(lastName.value);
  const addressTest = regexAddress.test(address.value);
  const cityTest = regexAddress.test(city.value);
  const emailTest = regexEmail.test(email.value);
  // Si erreur : message d'erreur
  if (firstNameTest == false || lastNameTest == false || addressTest == false || cityTest == false || emailTest == false) {
    if (firstNameTest == false) {
      firstNameErrorMsg.textContent = ('Veuillez entrer un prénom sans chiffre ni caractères spéciaux')
    } else {firstNameErrorMsg.textContent = null}
    if (lastNameTest == false) {
      lastNameErrorMsg.textContent = ('Veuillez entrer un nom sans chiffre ni caractères spéciaux')
    } else {lastNameErrorMsg.innerHTML = null}
    if (addressTest == false) {
      addressErrorMsg.textContent = ('Veuillez entrer une adresse sans caractères spéciaux.')
    } else {addressErrorMsg.innerHTML = null}
    if (cityTest == false) {
      cityErrorMsg.textContent = ('Veuillez entrer une ville sans caractères spéciaux.')
    } else {cityErrorMsg.innerHTML = null}
    if (emailTest == false) {
      emailErrorMsg.textContent = ('Veuillez entrer une adress email valide.')
    } else {emailErrorMsg.innerHTML = null}
  // Si pas d'erreurs : appel de la fonction POST
  } else {postForm ()}
})









