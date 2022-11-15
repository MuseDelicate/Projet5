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
                console.log(details);
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

    // fonction pour supprimer un élément
    let supprimer = document.querySelectorAll('.deleteItem');
    supprimer.forEach(element => {
        element.addEventListener('click', (e) => {
            alert('Etes vous sûr de vouloir supprimer cet article ? Vous pouvez revenir en arrière');
            let parentArticle = element.closest('article');
            let articleId = parentArticle.dataset.id;
            console.log(articleId);
            // pour commencer on compare les id
            /** dans un tableau de kanap, si le kanapId est égal au 
             * articleId alors on récupère son index dans le 
             * tableau avec findIndex. sinon rien */
            cart.forEach(element => {
                if (articleId === produit.kanapId) {
                    let indexKanapToRemove = cart.findIndex(articleId);
                    cart.splice(indexKanapToRemove, 1);
                }
            })

        })
    })

    /** 
         // on récupère l'ID du produit en question avec dataset et element.closest
         console.log(articleId);
         // puis on modifie la ligne avec splice
     })
     */
}

/** Fonctionnement de l'algorithme :
 * cette fonction a besoin de getDetails
 * getDetails prend l'id d'un canapé et va récupérer les détails de chaque élt pour lequel on lui donne un id
 * la fonction parcourirPanierKanaps va regarder tous les éléments contenus dans le panier et leur appliquer la fonction showCartKanap
 * showCartKanap insère chaque produit dans la page
 */

parcourirPanierKanaps(cart);



// faire en sorte que l'élt disparaisse lorsqu'on clique de la page html et du local storage
// element.closest à étudier ainsi que dataSet (fonctionnalités JS incontournables)
//chercher array.splice (permet de modifier une ligne du tableau)

/** valider données saisies formulaires avec Regex.com */