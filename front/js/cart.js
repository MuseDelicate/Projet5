//on initialise la variable cart
let cart = (localStorage.getItem('panier') !== null) ? JSON.parse(localStorage.getItem('panier')) : [];
console.log(cart);

// on déclare l'élément HTML de la page panier dans lequel insérer les données recueillies
const kanapHtmlContainer = document.querySelector('#cart__items');

// pas de boucle for dans fetch
async function getDetails(kanapId) {
    return result = await fetch(`http://localhost:3000/api/products/${kanapId}`);
}

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
    kanapHtmlData.setAttribute('data-color', produit.kanapColors);

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
    kanapColor.innerHTML = produit.kanapColors;

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


    let kanapQuantity = document.createElement("p");
    kanapQuantity.innerHTML = `<p>Qté : </p>`;

    let kanapInputQuantity = document.createElement('input');
    kanapInputQuantity.setAttribute('type', 'number');
    kanapInputQuantity.setAttribute('class', 'itemQuantity');
    kanapInputQuantity.setAttribute('name', 'itemQuantity');
    kanapInputQuantity.setAttribute('min', '1');
    kanapInputQuantity.setAttribute('max', '100');
    kanapInputQuantity.setAttribute('value', produit.kanapQuantity);

    // appendChild pour ajouter les éléments dans le HTML

    kanapCartContentSettingsDelete.appendChild(kanapCartContentSettingsDeleteItem);
    kanapCartContentSettingsQuantity.append(kanapQuantity, kanapInputQuantity);
    kanapCartContentSettings.append(kanapCartContentSettingsQuantity, kanapCartContentSettingsDelete);
    kanapCartImg.appendChild(kanapImg);
    kanapCartContentDescription.append(kanapTitle, kanapColor, kanapPrice);
    kanapCartContent.append(kanapCartContentDescription, kanapCartContentSettings);
    kanapHtmlData.append(kanapCartImg, kanapCartContent);
    kanapHtmlContainer.appendChild(kanapHtmlData);
}


/** Fonctionnement de l'algorithme :
 * cette fonction a besoin de getDetails
 * getDetails prend l'id d'un canapé et va récupérer les détails de chaque élt pour lequel on lui donne un id
 * la fonction parcourirPanierKanaps va regarder tous les éléments contenus dans le panier et leur appliquer la fonction showCartKanap
 * showCartKanap insère chaque produit dans la page
 */

parcourirPanierKanaps(cart);



//même fonction que sur la page produit pour modifier la quantité et supprimer un élt
// faire en sorte que l'élt disparaisse lorsqu'on clique de la page html et du local storage
// element.closest à étudier ainsi que dataSet (fonctionnalités JS incontournables)
//chercher array.splice (permet de modifier une ligne du tableau)