//retenir également que sur la page panier on récupère directement une chaîne de caractère qu on reconvertit en objet JS() avec la méthode json.parse

let cart = JSON.parse(localStorage.getItem('panier'));
console.log(cart);

// on choisit l'élément HTML de la page panier dans lequel insérer les données recueillies
const kanapHtmlDatas = document.querySelector('#cart__items');
// éléments à récupérer et à insérer :
const kanapCartImg = document.querySelector('.cart__item__img');
//const kanapCartContent = document.querySelector('.cart__item__content');


// utiliser une boucle
//for (let item in cart) {

fetch('http://localhost:3000/api/products/' + cart[0].kanapId)
    .then((result) => result.json())
    .then((result) => {
        console.log(result);
        result = cartData
        console.log(cartData);
    })
    .catch((error) => {
        console.log('Le serveur met du temps à répondre');
    });



//création article
let kanapHtmlData = document.createElement('article');
kanapHtmlData.className = "cart__item";
kanapHtmlData.setAttribute('data-color', cartData.color);

//création conteneur image
kanapCartImg = document.createElement('div');
kanapCartImg.className = 'cart__item__img';
kanapHtmlData.appendChild(kanapCartImg);

//insertion image dans son conteneur
let kanapImg = document.createElement('img');
containDivImg.appendChild(kanapImg);
kanapImg.src = cartData.imageUrl;
kanapImg.alt = cartData.altTxt;

let kanapCartContent = document.createElement('div');
kanapCartContent.className = 'cart__item__content';
kanapHtmlData.appendChild(kanapCartContent);

let kanapCartContentDescription = document.createElement('div');
kanapCartContentDescription.className = 'cart__item__content__description';
kanapCartContent.appendChild(kanapCartContentDescription);

let kanapTitle = document.createElement('h2');
kanapCartContentDescription.appendChild(kanapTitle);
kanapTitle.textContent = cartData.name;

let kanapColor = document.createElement('p');
kanapCartContentDescription.appendChild(kanapColor);
kanapColor.textContent = cartData.color;

let kanapPrice = document.createElement('p');
kanapCartContentDescription.appendChild(kanapPrice);
kanapPrice.textContent = cartData.price;

let kanapCartSettings = document.createElement('div');
kanapCartSettings.className = 'cart__item__content__settings';
kanapCartContent.appendChild(kanapCartSettings);

let kanapCartSettingsQuantity = document.createElement('div');
kanapCartSettingsQuantity.className = 'cart__item__content__settings__quantity';
kanapCartSettings.appendChild(kanapCartSettingsQuantity);

let kanapQuantity = document.createElement("p");
kanapCartSettingsQuantity.appendChild(kanapQuantity);
kanapQuantity.textContent = `Qté : `;

let kanapInputQuantity = document.createElement('input');
kanapInputQuantity.setAttribute('type', 'number');
kanapInputQuantity.setAttribute('class', 'itemQuantity');
kanapInputQuantity.setAttribute('name', 'itemQuantity');
kanapInputQuantity.setAttribute('min', '1');
kanapInputQuantity.setAttribute('max', '100');
kanapInputQuantity.setAttribute('value', `${cart[panier].quantity}`);