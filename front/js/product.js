// récupérer l'id du produit ayant été cliqué sur la page produit dans l'url

let searchParams = new URLSearchParams(window.location.search);
const kanapId = searchParams.get("_id");

// Déclaration des variables qui seront utilisées pour insérer les données dans la page HTML
// let itemsContainer = document.querySelector(".item"); à garder ?

const kanapImgDetails = document.querySelector('.item__img');
const kanapName = document.getElementById('title');
const kanapPrice = document.getElementById('price');
const kanapDescription = document.querySelector('#description');
const kanapColors = document.querySelector("#colors");

const kanapQuantity = document.getElementById('quantity');

const button = document.getElementById('addToCart');
let cart = [];

// créer un array contenant les 3 paramètres du produit

/*let Product = {
    kanapId,
    colorChosen: '',
    quantityChosen: '0',
};*/

class Product {
    constructor(kanapId, currentQuantity, currentColor) {
        this.kanapId = kanapId;
        this.currentQuantity = currentQuantity;
        this.currentColor = currentColor;
    }
}

// on utilise fetch pour récupérer les détails du produit en question

// on s'assure que l'id obtenu est bien le bon
console.log(kanapId);
if (kanapId !== null) {
    fetch(`http://localhost:3000/api/products/${kanapId}`)
        .then((result) => result.json())
        .then((result) => {
            console.log(result);
            kanapDetails(result);
        })
        .catch((error) => {
            alert("Le serveur met du temps à répondre...");
        });

    //on insère les données recueillies dans la page HTML et on ajoute chaque élément dans la page
    function kanapDetails(result) {
        kanapImgDetails.innerHTML = `<img src="${result.imageUrl}" alt="${result.altTxt}">`;
        kanapName.innerHTML = `<h1 id="title"> ${result.name} </h1>`;
        kanapPrice.innerHTML = `<span id="price"> ${result.price} </span>`;
        kanapDescription.innerHTML = `<p id="description"> ${result.description} </p>`;
        for (let i = 0; i < result.colors.length; i++) {
            kanapColors.innerHTML += `<option value="${result.colors[i]}">${result.colors[i]}</option>`
        }
    }

    // Ajouter des produits dans le panier (localStorage pour l'instant)

    // Récupérer la couleur et la quantité choisies quand elles changent : (faire en sorte qu'on ne prenne la quantité qu'au bout de qq seconde sinon on n'a pas le temps d'écrire une valeur que déjà l'alerte apparaît) ?

    kanapColors.addEventListener("change", function(e) {
        let colorChosen = e.target.value;
        currentColor = colorChosen;
    });

    kanapQuantity.addEventListener("input", function(e) {
        let quantityChosen = e.target.value;
        currentQuantity = quantityChosen;
    });

    /*function qty() {
        kanapQuantity.addEventListener("input", function(e) {
            let quantityChosen = e.target.value;
            if (quantityChosen !== '') {
                currentQuantity = quantityChosen;
            } else {
                currentQuantity = '';
            }
        })
    }*/

    /*function watchQuantity(currentQuantity) {
        if (currentQuantity > 100 || currentQuantity < 1) {
            alert('Veuillez choisir une quantité entre 1 et 100');
            return false;
        } else {
            alert(quantityChosen + ' Kanaps dans votre panier');
            return true;
        }
    }*/

    function watchColor(currentColor) {
        if (currentColor === '') {
            alert('Veuillez choisir une couleur');
            return false;
        } else {
            alert('Vous avez choisi ' + colorChosen);
            return true;
        }
    }



    // au clic sur le bouton, on met l'article correspondant (id/quantité/couleur du produit) dans un "tableau" dans le local storage"



    button.addEventListener('click', addToCart, false /* pour les tâches spécifiques on peut mettre à true qui nécessite d'annuler le premier clic */ );
    // vérifier auparavant si le local storage ne contiendrait pas déjà un panier)
    // écrire 2 fonctions JStoString et StringToJS ou manipuler directement json.parse et json.stringify
    // une fois qu'on a créé un objet JS il faudra faire une boucle pour parcourir le panier
    // il existe des boucles auto pour parcourir les objets (forEach)
    function addToCart() {
        // on met une condition pour que l'article soit ajouté au panier : il doit avoir une couleur et une quantité valable
        if (!watchColor) {
            window.confirm("Vous n'avez pas choisi de couleur")
            return;
        } else if (currentQuantity < 1 && currentQuantity > 100) {
            window.confirm('Veuillez choisir une quantité entre 1 et 100');
            return;
        } else {
            alert('ok');
            // 1. créer un nouveau produit (classe Product)
            let product = new Product(kanapId, currentQuantity, currentColor);
            window.confirm('le produit');
            // 2. ajouter ce produit au panier (qui est un tableau nommé "panier")
            cart.push(product);
            window.confirm(cart);
            // 3. stocker le panier dans le local storage
            let cartJson = JSON.stringify(cart);
            console.log(cartJson);
            let ls = localStorage.setItem("cart", cartJson);
            console.log(ls);
        }


        //localStorage.setItem(product, [])

        //on peut stocker le tableau en json(area to string) json.stringify
        //utiliser ces méthodes pour pouvoir le faire

        /*
        product.kanapId = kanapId;
        product.colorChosen = currentColor;
        product.quantityChosen = currentQuantity;
        */
    }
}