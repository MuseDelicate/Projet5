//on initialise la variable cart
let cart = (localStorage.getItem('panier') !== null) ? JSON.parse(localStorage.getItem('panier')) : [];
console.log(cart);


// on déclare l'élément HTML de la page panier dans lequel insérer les données recueillies
const kanapHtmlContainer = document.querySelector('#cart__items');

// pas de boucle for dans fetch
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
    for (let item of cart) {
        getDetails(item.kanapId)
            .then((response) => response.json())
            .then((details) => {
                showCartKanap(item, details);
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
    totalQuantity += produit.kanapQuantity;
    htmlTotalQuantity.innerText = totalQuantity;


    // prix total 
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
        element.addEventListener('click', (e) => {
            e.preventDefault();
            let parentArticle = element.closest('article');

            let articleId = parentArticle.dataset.id;
            let articleColor = parentArticle.dataset.color;

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

            // on supprime l'élt du DOM et on recharge la page (peu professionnel)
            // parentArticle.remove();
            kanapHtmlContainer.removeChild(parentArticle);
            // location.reload();

            htmlTotalQuantity.innerText = totalQuantity - produit.kanapQuantity;
            htmlTotalPrice.innerText = totalPrice - (produit.kanapQuantity * details.price);
        })
    })

}


/** Fonctionnement de l'algorithme :
 * cette fonction a besoin de getDetails
 * getDetails prend l'id d'un canapé et va récupérer les détails de chaque élt pour lequel on lui donne un id
 * la fonction parcourirPanierKanaps va regarder tous les éléments contenus dans le panier et leur appliquer la fonction showCartKanap
 * showCartKanap insère chaque produit dans la page
 */

parcourirPanierKanaps(cart);

/** valider données saisies formulaires avec Regex.com */


/** ------------------ Récupérer et analyser les données saisies par l'utilisateur dans le formulaire----------------- */


// on récupère les éléments html dans lesquels seront entrées les données
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email');

// crétion des RegExp pour tester les valeurs (avec des const car leurs valeurs ne changeront pas dans le temps)
const regExpFirstLastName = /^[a-zéèëçà-\s]{2,38}$/i;
const regExpAddress = /^[0-9]{0,3}\s+[a-zéèàïêëç\-\s]{2,50}$/;
const regExpCity = /^[0-9]{1,5}\s+[a-zéèàïêëç\-\s]{2,50}$/i;
const regExpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;

// on créé une classe client (qui recevra les données déjà valides)
class Client {
    constructor(clientFirstName, clientLastName, clientAddress, clientCity, clientEmail) {
        this.clientFirstName = clientFirstName;
        this.clientLastName = clientLastName;
        this.clientAddress = clientAddress;
        this.clientCity = clientCity;
        this.clientEmail = clientEmail;
    }
}
// on déclare les variables associées
let clientFirstName = '';
let clientLastName = '';
let clientCity = '';
let clientAddress = '';
let clientEmail = '';

// créer une variable 'drapeau' qui passe à true quand le champ est correct sinon incorrect
let isFormCorrect = false;

// écouter les données entrées dans le formulaire
firstName.addEventListener('input', (e) => {
    clientFirstName = e.target.value;
    let firstNameErrorTxt = document.querySelector('#firstNameErrorMsg')
    if (!regExpFirstLastName.test(clientFirstName)) {
        firstNameErrorTxt.innerText = 'Le prénom doit contenir entre 2 et 38 caractères et pas de chiffres';
        isFormCorrect = false;
    } else {
        firstNameErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

lastName.addEventListener('input', (e) => {
    clientLastName = e.target.value;
    let lastNameErrorTxt = document.querySelector('#lastNameErrorMsg')
    if (!regExpFirstLastName.test(clientLastName)) {
        lastNameErrorTxt.innerText = 'Le nom doit contenir entre 2 et 38 caractères et pas de chiffres';
        isFormCorrect = false;
    } else {
        lastNameErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

address.addEventListener('input', (e) => {
    clientAddress = e.target.value;
    let addressErrorTxt = document.querySelector('#addressErrorMsg')
    if (!regExpCity.test(clientAddress)) {
        addressErrorTxt.innerText = 'Ecrivez une adresse au format suivant : 35 rue du Printemps';
        isFormCorrect = false;
    } else {
        addressErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

city.addEventListener('input', (e) => {
    clientCity = e.target.value;
    let cityErrorTxt = document.querySelector('#cityErrorMsg')
    if (!regExpCity.test(clientCity)) {
        cityErrorTxt.innerText = 'Ecrivez votre ville au format suivant : 45000 Orléans';
        isFormCorrect = false;
    } else {
        cityErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

email.addEventListener('input', (e) => {
    clientEmail = e.target.value;
    let emailErrorTxt = document.querySelector('#emailErrorMsg')
    if (!regExpEmail.test(clientEmail)) {
        emailErrorTxt.innerText = 'Ecrivez votre email au format suivant : test-mail@kanap.com';
        isFormCorrect = false;
    } else {
        emailErrorTxt.innerText = 'valide';
        isFormCorrect = true;
    }
})

// on instancie la classe
/*let clientData = new Client(clientFirstName, clientLastName, clientAddress, clientCity, clientEmail);
isFormCorrect ? console.log(clientData) : '';
*/
// quand le formulaire est ok on appelle fetch pour l'envoyer au serveur au format json
// on convertit l'objet client en json et le tableau produit
// le numéro de commande sera la réponse du fetch
// au clic sur "commander" on est renvoyé vers la page confimration