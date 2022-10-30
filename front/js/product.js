//localStorage.clear();

// récupérer l'id du produit ayant été cliqué sur la page produit dans l'url
let searchParams = new URLSearchParams(window.location.search);
const kanapId = searchParams.get("_id");

// Déclaration des variables qui seront utilisées pour insérer les données dans la page HTML
const kanapImgDetails = document.querySelector('.item__img');
const kanapName = document.querySelector('#title');
const kanaptPrice = document.querySelector('#price');
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

// on utilise fetch pour récupérer les détails du produit en question

// on s'assure que l'id obtenu est bien le bon (avec un if ! cf. notes)
console.log(kanapId);
if (kanapId !== null) {
    fetch(`http://localhost:3000/api/products/${kanapId}`)
        .then((result) => result.json())
        .then((result) => {
            //console.log(result);
            kanapDetails(result);
        })
        .catch((error) => {
            alert("Le serveur met du temps à répondre...");
        });


    //on insère les données recueillies dans la page HTML et on ajoute chaque élément dans la page
    function kanapDetails(result) {
        // on créé une balise img dans laquelle insérer l'image et le texte correspondant
        let kanapImg = document.createElement('img');
        kanapImgDetails.appendChild(kanapImg);
        kanapImg.setAttribute('src', `${result.imageUrl}`);
        kanapImg.setAttribute('alt', `${result.altTxt}`);
        kanapName.innerHTML = `${result.name}`;
        kanaptPrice.innerHTML = `${result.price}`;
        kanapDescription.innerHTML = `${result.description}`;

        for (let i = 0; i < result.colors.length; i++) {
            kanapColors.innerHTML += `
            <option value="${result.colors[i]}">${result.colors[i]}</option>`
        }

    }

    // Ajouter des produits dans le panier (localStorage pour l'instant)

    // Récupérer la couleur et la quantité choisies quand elles changent 

    kanapColors.addEventListener("change", function(e) {
        colorChosen = e.target.value;
        console.log(colorChosen);
    });

    kanapQuantity.addEventListener("input", function(e) {
        quantityChosen = e.target.value;
        console.log(quantityChosen);
    });

    // au clic sur le bouton, on met l'article correspondant (id/quantité/couleur du produit) dans un "tableau" dans le local storage"

    button.addEventListener('click', addToCart, false /* pour les tâches spécifiques on peut mettre à true qui nécessite d'annuler le premier clic */ );

    function addToCart() {
        // on met une condition pour que l'article soit ajouté au panier : il doit avoir une couleur et une quantité valable
        if (colorChosen === '') {
            window.confirm("Vous n'avez pas choisi de couleur")
            return;
        } else if ((quantityChosen > 100 || quantityChosen < 1)) {
            window.confirm('Veuillez choisir une quantité entre 1 et 100');
            return;
        } else {
            // on déclare les variables qui seront utilisées dans la fonction
            let panier = []; // ou : let panier = new Array();
            let isNewProduct = true; //oui on peut enregistrer ce produit car il est nouveau

            //lire d'abord le panier déjà stocké et vérifier s'il existe (vérifier auparavant si le local storage ne contiendrait pas déjà un panier)
            console.log(localStorage.getItem("panier"));

            panier = localStorage.getItem("panier") === null ? [] : JSON.parse(localStorage.getItem("panier"))
            console.log(panier);
            // 1. créer un nouveau produit 
            //avec for each on pourrait créer une foncton appelée à chaque tour (voir devdocs)
            produit.kanapId = kanapId;
            produit.kanapQuantity = parseInt(quantityChosen);
            produit.kanapColor = colorChosen;

            console.log(produit['kanapId']);
            console.log(produit['kanapQuantity']);
            console.log(produit['kanapColor']);

            if (panier.length > 0) {
                let compteur = 0;
                /**  on fait une boucle for of pour regarder chaque article du panier pour s'assurer que
                 l'article choisi n'y est pas déjà, auquel cas on ajoute juste la quantité */
                for (produitStock of panier) {

                    if (produitStock.kanapId === produit.kanapId) {
                        console.log('ce type de canapé est déjà dans le panier donc on vérifie la couleur');
                        if (produitStock.kanapColor === produit.kanapColor) {
                            console.log('déjà dans le panier et même couleur donc on ajoute juste la quantité');
                            panier[compteur]['kanapQuantity'] += produit.kanapQuantity;
                            console.log('la quantité passe à : ' + panier[compteur]['kanapQuantity']);
                            isNewProduct = false;
                            break;
                        } else {
                            isNewProduct = true;
                            // on définit cette variable pour signaler qu'on ne pourra plus enregistrer ce produit
                            /** c'est le même produit mais d'une couleur différente donc on l'ajoute */
                            console.log('ajout du produit avec même id mais couleur différente')
                        }
                    }
                    //isNewProduct = true;
                    compteur++;
                }
                if (isNewProduct) {
                    panier.push(produit);
                    console.log('ajout du produit');
                }
            } else {
                panier.push(produit); //on ajoute le tout premier produit dans le panier
                console.log('ajout du premier produit')
            }

            localStorage.setItem("panier", JSON.stringify(panier));
            console.log(localStorage.getItem("panier"));
        }
    }
}