let itemsContainer = document.querySelector(".item");

// récupérer l'id du produit ayant été cliqué sur la page produit dans l'url

let searchParams = new URLSearchParams(window.location.search);
const kanapId = searchParams.get("_id");

// on s'assure que l'id obtenu est bien le bon
console.log(kanapId);

// Déclaration des variables qui seront utilisées pour insérer les données dans la page HTML
const kanapImgDetails = document.querySelector('.item__img');
const kanapName = document.getElementById('title');
const kanapPrice = document.getElementById('price');
const kanapDescription = document.querySelector('#description');
const kanapColors = document.querySelector("#colors");
const kanapQuantity = document.getElementById('quantity');
const button = document.getElementById('addToCart');
let cart = [];


// on essaie de transformer ça en classe :
/*let Product = {
    kanapId,
    colorChosen: '',
    quantityChosen: '0',
};*/
class Product {
    constructor(kanapId, quantityChosen, colorChosen) {
        this.kanapId = kanapId;
        this.quantityChosen = quantityChosen;
        this.colorChosen = colorChosen;
    }
}

//on insère les données recueillies dans la page HTML
function kanapDetails(result) {
    // on ajoute chaque élément dans la page
    kanapImgDetails.innerHTML = `<img src="${result.imageUrl}" alt="${result.altTxt}">`;
    kanapName.innerHTML = `<h1 id="title"> ${result.name} </h1>`;
    kanapPrice.innerHTML = `<span id="price"> ${result.price} </span>`;
    kanapDescription.innerHTML = `<p id="description"> ${result.description} </p>`;
    for (let i = 0; i < result.colors.length; i++) {
        kanapColors.innerHTML += `<option value="${result.colors[i]}">${result.colors[i]}</option>`
    }
}

// on utilise fetch pour récupérer les détails du produit en question

fetch(`http://localhost:3000/api/products/${kanapId}`)
    .then((result) => result.json())
    .then((result) => {
        console.log(result);
        kanapDetails(result);
    })
    .catch((error) => {
        alert("Le serveur met du temps à répondre...");
    });



// Ajouter des produits dans le panier (localStorage pour l'instant)

// Récupérer la couleur et la quantité choisies : faire en sorte qu'on ne prenne la quantité qu'au bout de qq seconde (sinon on n'a pas le temps d'écrire une valeur que déjà l'alerte apparaît)
kanapQuantity.addEventListener("input", function(e) {
    let quantityChosen = e.target.value;
    currentQuantity = quantityChosen;
    /*
    if (quantityChosen > 100 || quantityChosen < 1) {
        alert('Veuillez choisir une quantité entre 1 et 100');
    } else {
        alert(quantityChosen + ' Kanaps dans votre panier');
    }
    */
});

kanapColors.addEventListener("change", function(e) {
    let colorChosen = e.target.value;
    currentColor = colorChosen;
    /*
    if (!colorChosen) {
        alert('Veuillez choisir une couleur');
    } else {
        alert('Vous avez choisi ' + colorChosen);
    };
    */
});





// créer un array contenant les 3 paramètres du produit


// au clic sur le bouton, on met l'article correspondant (id/quantité/couleur du produit) dans un "tableau" dans le local storage"



button.addEventListener('click', addToCart, false /* pour les tâches spécifiques on peut mettre à true qui nécessite d'annuler le premier clic */ );

// vérifier auparavant si le local storage ne contiendrait pas déjà un panier)
// écrire 2 fonctions JStoString et StringToJS ou manipuler directement json.parse et json.stringify
// une fois qu'on a créé un objet JS il faudra faire une boucle pour parcourir le panier
// il existe des boucles auto pour parcourir les objets (forEach)
function addToCart() {
    alert('ok');
    // 1. créer un nouveau produit (classe Product)
    let product = new Product(kanapId, currentQuantity, currentColor);
    console.log('le produit');
    // 2. ajouter ce produit au panier (qui est un tableau nommé "panier")
    cart.push(product);
    console.log(cart);
    // 3. stocker le panier dans le local storage
}


// page panier
// Quand on clique sur le bouton,

//localStorage.setItem(product, [])

//on peut stocker le tableau en json(area to string) json.stringify
//utiliser ces méthodes pour pouvoir le faire

/*
product.kanapId = kanapId;
product.colorChosen = currentColor;
product.quantityChosen = currentQuantity;
*/