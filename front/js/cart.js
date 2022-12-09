//on initialise la variable cart
let cart = (localStorage.getItem('panier') !== null) ? JSON.parse(localStorage.getItem('panier')) : [];
console.log(cart);
/*
let cartString = (localStorage.getItem('panier') !== null) ? localStorage.getItem('panier') : [];
console.log(cartString);
cartString.sort();
console.log(cartString);
*/

// Tri des objets dans le panier avant de les afficher


// ATTENTION à retester
let organizedCart = [];

function organizeKanap(cart) {
    for (let i = 0; i < cart.length; i++) {
        organizedCart.push(cart[i].kanapId);
        for (let j = i + 1; j < cart.length; j++) {
            if (cart[i].kanapId === cart[j].kanapId) {
                organizedCart.push(cart[j].kanapId);
                cart.splice(j, 1);
                console.log(cart);
            }
        }
    }
    console.log(organizedCart);
}
organizeKanap(cart);
// ce n'est plus cart mais le panier déjà rangé



// on déclare l'élément HTML de la page panier dans lequel insérer les données recueillies
const kanapHtmlContainer = document.querySelector('#cart__items');


// on utilise async et await car fetch peut prendre du temps
async function getDetails(kanapId) {
    result = await fetch(`http://localhost:3000/api/products/${kanapId}`);
    return result;
}

let totalQuantity = 0;
let totalPrice = 0;
let htmlTotalQuantity = document.querySelector('#totalQuantity');
let htmlTotalPrice = document.querySelector('#totalPrice');


function parcourirPanierKanaps(cart) {
    // let compteur = 0;
    for (let item of cart) {
        getDetails(item.kanapId)
            .then((response) => response.json())
            .then((details) => {
                showCartKanap(item, details);
                // compteur++;
                // if (compteur === cart.length) {
                //initDeleteEvent();
                // }
            })
            .catch((error) => alert("erreur"));
    }
}


function showCartKanap(produit, details) {

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

    // creation +initialisation des éléments pour la partie description

    let kanapCartContentDescription = document.createElement('div');
    kanapCartContentDescription.classList.add('cart__item__content__description');

    let kanapTitle = document.createElement('h2');
    kanapTitle.textContent = details.name;

    let kanapColor = document.createElement('p');
    kanapColor.innerHTML = produit.kanapColor;

    let kanapPrice = document.createElement('p');
    kanapPrice.innerHTML = details.price + '€';

    // creation +initialisation des éléments pour la partie description
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

    // nb total des produits
    // mettre en dernier après les fonctions supprimer et modifier ? non mais à recalculer
    totalQuantity += produit.kanapQuantity;
    htmlTotalQuantity.innerText = totalQuantity;


    // prix total 
    totalPrice += details.price * produit.kanapQuantity;
    htmlTotalPrice.innerText = totalPrice;

    // on écoute s'il y a un chgmt de quantité et on modifie la quantité totale et le prix total
    // vérifier devdocs le addeventListener avec true (false par défaut)
    // attention le changement de quantité n'est pas stocké dans le local storage
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
                console.log(localStorage.setItem("panier", JSON.stringify(newCart)));
            }

            //console.log(localStorage.getItem("panier", JSON.stringify(cart)));

            // on supprime l'élt du DOM et on recharge la page (peu professionnel, plutôt removeChild)
            // parentArticle.style.display = 'none';
            // parentArticle.remove();
            kanapHtmlContainer.removeChild(parentArticle);
            alert("Ce produit a bien été supprimé de votre panier");
            location.reload();

            // htmlTotalQuantity.innerText = totalQuantity - produit.kanapQuantity;
            // htmlTotalPrice.innerText = totalPrice - (produit.kanapQuantity * details.price);

        })

    })
}
// pour regrouper par couleur on créé un nv panier dynamique puis on parcourt l'ancien pour chercher chaque produit et regrouper chaque article avec sort (méthode sort)
// méthode shift pour récupérer un élément du tableau (shift sort un élément du tableau et on peut encore l'utiliser ensuite pour le comparer aux autres)


parcourirPanierKanaps(organizedCart);




/** Fonctionnement de l'algorithme :
 * cette fonction a besoin de getDetails
 * getDetails prend l'id d'un canapé et va récupérer les détails de chaque élt pour lequel on lui donne un id
 * la fonction parcourirPanierKanaps va regarder tous les éléments contenus dans le panier et leur appliquer la fonction showCartKanap
 * showCartKanap insère chaque produit dans la page
 */


/** valider données saisies formulaires avec Regex.com */


/** ------------------ Récupérer et analyser les données saisies par l'utilisateur dans le formulaire----------------- */


// on récupère les éléments html dans lesquels seront entrées les données + déclarations variables utiles
let formFirstName = document.getElementById('firstName');
let formName = document.getElementById('lastName');
let formAddress = document.getElementById('address');
let formCity = document.getElementById('city');
let formEmail = document.getElementById('email');

let orderButton = document.querySelector('#order');


// on une classe Contact (avec une classe il y a "l'héritage") qui sera remplie par les données valides du formulaire

class Contact {
    constructor() {}
    firstName = '';
    lastName = '';
    adress = '';
    city = '';
    email = '';
}

let contact = new Contact();

// crétion des RegExp pour tester les valeurs (avec des const car leurs valeurs ne changeront pas dans le temps)
const regExpFirstLastName = /^[a-zéèëçà-\s]{2,38}$/i;
const regExpAddress = /^[0-9]{0,3}\s+[a-zéèàïêëç\-\s]{2,50}$/;
const regExpCity = /^[0-9]{1,5}\s+[a-zéèàïêëç\-\s]{2,50}$/i;
const regExpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;


// créer une variable 'drapeau' qui passe à true quand le champ est correct sinon incorrect
let isFormCorrect = false;

// écouter les données entrées dans le formulaire
formFirstName.addEventListener('input', (e) => {
    contact.firstName = e.target.value;
    let firstNameErrorTxt = document.querySelector('#firstNameErrorMsg')
    if (!regExpFirstLastName.test(contact.firstName)) {
        firstNameErrorTxt.innerText = 'Le prénom doit contenir entre 2 et 38 caractères et pas de chiffres';
        isFormCorrect = false;
    } else {
        firstNameErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

formName.addEventListener('input', (e) => {
    contact.lastName = e.target.value;
    let lastNameErrorTxt = document.querySelector('#lastNameErrorMsg')
    if (!regExpFirstLastName.test(contact.lastName)) {
        lastNameErrorTxt.innerText = 'Le nom doit contenir entre 2 et 38 caractères et pas de chiffres';
        isFormCorrect = false;
    } else {
        lastNameErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

formAddress.addEventListener('input', (e) => {
    contact.address = e.target.value;
    let addressErrorTxt = document.querySelector('#addressErrorMsg')
    if (!regExpCity.test(contact.address)) {
        addressErrorTxt.innerText = 'Ecrivez une adresse au format suivant : 35 rue du Printemps';
        isFormCorrect = false;
    } else {
        addressErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

formCity.addEventListener('input', (e) => {
    contact.city = e.target.value;
    let cityErrorTxt = document.querySelector('#cityErrorMsg')
    if (!regExpCity.test(contact.city)) {
        cityErrorTxt.innerText = 'Ecrivez votre ville au format suivant : 45000 Orléans';
        isFormCorrect = false;
    } else {
        cityErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

formEmail.addEventListener('input', (e) => {
    contact.email = e.target.value;
    let emailErrorTxt = document.querySelector('#emailErrorMsg')
    if (!regExpEmail.test(contact.email)) {
        emailErrorTxt.innerText = 'Ecrivez votre email au format suivant : test.mail@kanap.com';
        isFormCorrect = false;
    } else {
        emailErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

// On récupère tous les produits à nouveau pour s'assurer de tenir compte des modifications du panier :
let products = [];
for (let article of cart) {
    products.push(article.kanapId);
}

// quand on clique sur le bouton, le contact est généré
orderButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isFormCorrect) {
        alert('Veuillez vérifier votre saisie');
        return;
    } else {
        console.log(contact);
        // je créé un contact sur le local storage qui prend les infos d'un client
        localStorage.setItem('contact', JSON.stringify(contact));

        // on créé le "bon de commande"
        let kanapOrder = {
            contact: contact,
            products: products,
        }
        console.log(kanapOrder);
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
                console.log(orderId);
                //window.location.assign("confirmation.html?id=" + orderId);
                //localStorage.clear();
            });
    }
});



// test d'acceptation : reprendre les spec fonctionnelles