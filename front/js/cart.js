//on initialise la variable cart
let cart = (localStorage.getItem('panier') !== null) ? JSON.parse(localStorage.getItem('panier')) : [];
console.log(cart);

// Tri des objets dans le panier avant de les afficher

let organizedCart = [];

function organizeKanap(cart) {
    for (let i = 0; i < cart.length; i++) {
        organizedCart.push(cart[i]);
        for (let j = i + 1; j < cart.length; j++) {
            if (cart[i].kanapId === cart[j].kanapId) {
                organizedCart.push(cart[j]);
                cart.splice(j, 1);
            }
        }
    }
    console.log(organizedCart);
    return organizedCart;
}
organizeKanap(cart);


// on déclare l'élément HTML de la page panier dans lequel insérer les données recueillies

const kanapHtmlContainer = document.querySelector('#cart__items');

// Initialisation des variables utilisées

let totalQuantity = 0;
let totalPrice = 0;
let htmlTotalQuantity = document.querySelector('#totalQuantity');
let htmlTotalPrice = document.querySelector('#totalPrice');


// Récupération depuis le serveur des détails de chaque produit (de manière asynchrone car fetch peut prendre du temps)

async function getDetails(kanapId) {
    result = await fetch(`http://localhost:3000/api/products/${kanapId}`);
    return result;
}

// On récupère les détails de chaque élément du panier et on les insère dans la page
// pour que les produits s'affichent dans le bon ordre, on attend que tous les 
// détails des produits soient récupérés et on les insère dans un tableau. 
let listDetails = [];

function parcourirPanierKanaps(organizedCart) {
    for (let item of organizedCart) {
        console.log(item);
        getDetails(item.kanapId)
            .then((response) => response.json())
            .then((details) => {
                listDetails.push(details);
                // Quand on a tout récupéré on affiche les produits dans la page
                if (listDetails.length === organizedCart.length) {
                    showCartKanap(organizedCart, listDetails);
                }
            })
            .catch((error) => alert("erreur"));
    }
}


// Fonction qui va afficher dans la page chaque produit du panier (récupéré du local storage)

function showCartKanap(panier, listDetails) {
    for (produit of panier) {
        for (details of listDetails) {
            if (produit.kanapId === details._id) {

                //création article
                let kanapHtmlData = document.createElement('article');
                kanapHtmlData.classList.add('cart__item');
                kanapHtmlData.setAttribute('data-ID', produit.kanapId)
                kanapHtmlData.setAttribute('data-color', produit.kanapColor);

                //création conteneur image
                let kanapCartImg = document.createElement('div');
                kanapCartImg.classList.add('cart__item__img');

                //insertion image dans son conteneur
                let kanapImg = document.createElement('img');
                kanapImg.setAttribute('src', `${details.imageUrl}`);
                kanapImg.setAttribute('alt', `${details.altTxt}`);

                let kanapCartContent = document.createElement('div');
                kanapCartContent.classList.add('cart__item__content');

                // creation et initialisation des éléments pour la partie description
                let kanapCartContentDescription = document.createElement('div');
                kanapCartContentDescription.classList.add('cart__item__content__description');

                let kanapTitle = document.createElement('h2');
                kanapTitle.textContent = details.name;

                let kanapColor = document.createElement('p');
                kanapColor.innerHTML = produit.kanapColor;

                let kanapPrice = document.createElement('p');
                kanapPrice.innerHTML = details.price + '€';

                // creation et initialisation des éléments pour la partie description
                let kanapCartContentSettings = document.createElement('div');
                kanapCartContentSettings.classList.add('cart__item__content__settings');

                // div quantité
                let kanapCartContentSettingsQuantity = document.createElement('div');
                kanapCartContentSettingsQuantity.classList.add('cart__item__content__settings__quantity');

                let kanapCartContentSettingsDelete = document.createElement('div');
                kanapCartContentSettingsDelete.classList.add('cart__item__content__settings__delete');

                // delete
                let kanapCartContentSettingsDeleteItem = document.createElement('p');
                kanapCartContentSettingsDeleteItem.classList.add('deleteItem');
                kanapCartContentSettingsDeleteItem.textContent = 'Supprimer';

                let titleQuantity = document.createElement("p");
                titleQuantity.innerText = `Qté : `;

                let kanapInputQuantity = document.createElement('input');
                kanapInputQuantity.setAttribute('type', 'number');
                kanapInputQuantity.setAttribute('class', 'itemQuantity');
                kanapInputQuantity.setAttribute('name', 'itemQuantity');
                kanapInputQuantity.setAttribute('min', '1');
                kanapInputQuantity.setAttribute('max', '100');
                kanapInputQuantity.setAttribute('value', produit.kanapQuantity);

                // appendChild pour ajouter les éléments dans le HTML
                kanapCartContentSettingsDelete.appendChild(kanapCartContentSettingsDeleteItem);
                kanapCartContentSettingsQuantity.append(titleQuantity, kanapInputQuantity);
                kanapCartContentSettings.append(kanapCartContentSettingsQuantity, kanapCartContentSettingsDelete);
                kanapCartImg.appendChild(kanapImg);
                kanapCartContentDescription.append(kanapTitle, kanapColor, kanapPrice);
                kanapCartContent.append(kanapCartContentDescription, kanapCartContentSettings);
                kanapHtmlData.append(kanapCartImg, kanapCartContent);
                kanapHtmlContainer.appendChild(kanapHtmlData);

                // Valcul du nombre total des produits

                totalQuantity += produit.kanapQuantity;
                htmlTotalQuantity.innerText = totalQuantity;


                // Calcul du prix total 
                totalPrice += details.price * produit.kanapQuantity;
                htmlTotalPrice.innerText = totalPrice;

                // on écoute s'il y a un chgmt de quantité et on modifie la quantité totale et le prix total
                kanapInputQuantity.addEventListener('input', (e) => {
                    let currentQuantity = e.target.value - produit.kanapQuantity;
                    htmlTotalQuantity.innerText = totalQuantity + currentQuantity;

                    let currentPrice = e.target.value * details.price;

                    htmlTotalPrice.innerText = totalPrice -
                        (details.price * produit.kanapQuantity) +
                        currentPrice;

                }, true)

                // supprimer un élément

                let supprimer = document.querySelectorAll('.deleteItem');
                let tempCart = JSON.parse(localStorage.getItem('panier'));

                supprimer.forEach(element => {
                    element.addEventListener('click', () => {
                        let parentArticle = element.closest('article');

                        let articleId = parentArticle.dataset.id;
                        let articleColor = parentArticle.dataset.color;
                        console.log(articleId);
                        console.log(articleColor);

                        if (articleId === produit.kanapId &&
                            articleColor === produit.kanapColor
                        ) {
                            newCart = tempCart.filter(
                                (kanap) =>
                                kanap.kanapId !== articleId ||
                                kanap.kanapColor !== articleColor
                            );
                            console.log(newCart);
                            localStorage.setItem("panier", JSON.stringify(newCart));
                        }

                        kanapHtmlContainer.removeChild(parentArticle);
                        window.confirm("Ce produit a bien été supprimé de votre panier");
                        location.reload();

                    })

                })
                break;
            }
        }
    }
}

parcourirPanierKanaps(organizedCart);



/** ------------------ Récupérer et analyser les données saisies par l'utilisateur dans le formulaire----------------- */


// on récupère les éléments html dans lesquels seront entrées les données + déclarations variables utiles
let formFirstName = document.getElementById('firstName');
let formName = document.getElementById('lastName');
let formAddress = document.getElementById('address');
let formCity = document.getElementById('city');
let formEmail = document.getElementById('email');

let orderButton = document.querySelector('#order');


// Déclaration d'une classe Contact qui sera remplie par les données valides du formulaire

class Contact {
    constructor() {}
    firstName = '';
    lastName = '';
    adress = '';
    city = '';
    email = '';
}

let contact = new Contact();
console.log(contact);


// crétion des RegExp pour tester les valeurs 

const regExpFirstLastName = /^[a-zéèëçà-\s]{2,38}$/i;
const regExpAddress = /^[0-9]{0,3}\s+[a-zéèàïêëç\-\s]{2,50}$/;
const regExpCity = /^[0-9]{1,5}\s+[a-zéèàïêëç\-\s]{2,50}$/i;
const regExpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;

let isFormCorrectFirstName = false;
let isFormCorrectLastName = false;
let isFormCorrectAddress = false;
let isFormCorrectCity = false;
let isFormCorrectEmail = false;



// écouter les données entrées dans le formulaire

formFirstName.addEventListener('input', (e) => {
    contact.firstName = e.target.value;
    let firstNameErrorTxt = document.querySelector('#firstNameErrorMsg')
    if (!regExpFirstLastName.test(contact.firstName)) {
        firstNameErrorTxt.innerText = 'Le prénom doit contenir entre 2 et 38 caractères et pas de chiffres';
        isFormCorrectFirstName = false;
    } else {
        firstNameErrorTxt.innerText = 'valide';
        isFormCorrectFirstName = true;
    }
})

formName.addEventListener('input', (e) => {
    contact.lastName = e.target.value;
    let lastNameErrorTxt = document.querySelector('#lastNameErrorMsg')
    if (!regExpFirstLastName.test(contact.lastName)) {
        lastNameErrorTxt.innerText = 'Le nom doit contenir entre 2 et 38 caractères et pas de chiffres';
        isFormCorrectLastName = false;
    } else {
        lastNameErrorTxt.innerText = 'valide';
        isFormCorrectLastName = true;
    }
})

formAddress.addEventListener('input', (e) => {
    contact.address = e.target.value;
    let addressErrorTxt = document.querySelector('#addressErrorMsg')
    if (!regExpCity.test(contact.address)) {
        addressErrorTxt.innerText = 'Ecrivez une adresse au format suivant : 35 rue du Printemps';
        isFormCorrectAddress = false;
    } else {
        addressErrorTxt.innerText = 'valide';
        isFormCorrectAddress = true;
    }
})

formCity.addEventListener('input', (e) => {
    contact.city = e.target.value;
    let cityErrorTxt = document.querySelector('#cityErrorMsg')
    if (!regExpCity.test(contact.city)) {
        cityErrorTxt.innerText = 'Ecrivez votre ville au format suivant : 45000 Orléans';
        isFormCorrectCity = false;
    } else {
        cityErrorTxt.innerText = 'valide';
        isFormCorrectCity = true;
    }
})

formEmail.addEventListener('input', (e) => {
    contact.email = e.target.value;
    let emailErrorTxt = document.querySelector('#emailErrorMsg')
    if (!regExpEmail.test(contact.email)) {
        emailErrorTxt.innerText = 'Ecrivez votre email au format suivant : test.mail@kanap.com';
        isFormCorrectEmail === false;
    } else {
        emailErrorTxt.innerText = 'valide';
        isFormCorrectEmail = true;
    }
})

// On récupère tous les produits à nouveau pour s'assurer de tenir compte des modifications du panier :

let products = [];
for (let article of organizedCart) {
    products.push(article.kanapId);
}
// au clic du bouton, le contact est généré

orderButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (products.length === 0) {
        alert('Votre panier est vide');
        return;
    } else if (!isFormCorrectFirstName || !isFormCorrectLastName || !isFormCorrectAddress || !isFormCorrectCity || !isFormCorrectEmail) {
        alert('Veuillez vérifier votre saisie');
        return;
    } else {
        // Création d'un contact sur le local storage qui prend les infos d'un client
        localStorage.setItem('contact', JSON.stringify(contact));

        // Création du "bon de commande"
        let kanapOrder = {
            contact: contact,
            products: products,
        }

        // envoie du kanapOrder au serveur

        fetch('http://localhost:3000/api/products/order', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(kanapOrder),
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
            })
            // puis récupération de l'identifiant de la commande
            .then((data) => {
                let orderId = data.orderId;
                window.location.assign("confirmation.html?id=" + orderId);
            });
    }
});