// récupérer dans l'url l'id du produit ayant été cliqué sur la page d'accueil

let searchParams = new URLSearchParams(window.location.search);
const kanapId = searchParams.get("_id");


// Déclaration des variables qui seront utilisées pour insérer les données dans la page HTML

const kanapImgDetails = document.querySelector('.item__img');
const kanapName = document.querySelector('#title');
const kanapPrice = document.querySelector('#price');
const kanapDescription = document.querySelector('#description');

const kanapColors = document.querySelector("#colors");
const kanapQuantity = document.querySelector('#quantity');

let quantityChosen = 0;
let colorChosen = '';

const button = document.getElementById('addToCart');


// créer un objet contenant les 3 paramètres du produit

let produit = {
    kanapId: '',
    kanapQuantity: 0,
    kanapColor: ''
}

// on utilise fetch pour récupérer les détails du produit en question, en s'assurant que l'id existe bien

console.log(kanapId);

if (kanapId !== null) {
    fetch(`http://localhost:3000/api/products/${kanapId}`)
        .then((result) => result.json())
        .then((result) => {
            kanapDetails(result);
        })
        .catch((error) => {
            alert("Le serveur met du temps à répondre...");
        });
}


//on insère les données recueillies dans la page HTML et on ajoute chaque élément dans la page

function kanapDetails(result) {

    // on créé une balise img dans laquelle insérer l'image et le texte correspondant
    let kanapImg = document.createElement('img');
    kanapImg.setAttribute('src', `${result.imageUrl}`);
    kanapImg.setAttribute('alt', `${result.altTxt}`);
    kanapName.innerHTML = `${result.name}`;
    kanapPrice.innerHTML = `${result.price}`;
    kanapDescription.innerHTML = `${result.description}`;

    // on récupère les choix de couleur existant pour ce produit
    for (let i = 0; i < result.colors.length; i++) {
        kanapColors.innerHTML += `
            <option value="${result.colors[i]}">${result.colors[i]}</option>`
    }
    kanapImgDetails.appendChild(kanapImg);
}

// Récupérer la couleur et la quantité choisies quand elles changent 

kanapColors.addEventListener("change", function(e) {
    colorChosen = e.target.value;
    console.log(colorChosen);
});

kanapQuantity.addEventListener("input", function(e) {
    quantityChosen = e.target.value;
    console.log(quantityChosen);
});


button.addEventListener('click', addToCart, false);

// fonction d'ajout d'un produit au panier
function addToCart() {

    if (colorChosen === '') {
        window.confirm("Vous n'avez pas choisi de couleur")
        return;
    } else if ((quantityChosen > 100 || quantityChosen < 1)) {
        window.confirm('Veuillez choisir une quantité entre 1 et 100');
        return;
    } else {
        let panier = [];
        let isNewProduct = true;

        panier = localStorage.getItem("panier") === null ? [] : JSON.parse(localStorage.getItem("panier"))

        produit.kanapId = kanapId;
        produit.kanapQuantity = parseInt(quantityChosen);
        produit.kanapColor = colorChosen;

        if (panier.length > 0) {
            let compteur = 0;

            for (produitStock of panier) {
                if (produitStock.kanapId === produit.kanapId) {
                    if (produitStock.kanapColor === produit.kanapColor) {
                        panier[compteur]['kanapQuantity'] += produit.kanapQuantity;
                        isNewProduct = false;
                        break;
                    } else {
                        isNewProduct = true;
                    }
                }
                compteur++;
            }
            if (isNewProduct) {
                panier.push(produit);
                window.confirm('Votre produit est bien ajouté au panier !')
            }
        } else {
            panier.push(produit);
            window.confirm('Votre produit est bien ajouté au panier !')
        }

        localStorage.setItem("panier", JSON.stringify(panier));

    }
}