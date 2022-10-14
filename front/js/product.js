let itemsContainer = document.querySelector(".item");

// récupérer l'id du produit ayant été cliqué sur la page produit dans l'url

let searchParams = new URLSearchParams(window.location.search);
let kanapId = searchParams.get("_id");

// on s'assure que l'id obtenu est bien le bon
console.log(kanapId);



// Déclaration des variables qui seront utilisées pour insérer les données dans la page HTML
const kanapImgDetails = document.querySelector('.item__img');
const kanapName = document.getElementById('title');
const kanapPrice = document.getElementById('price');
const kanapDescription = document.querySelector('#description');
const kanapColors = document.querySelector("#colors");


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
        // récupérer le lien, puis tester si la variable id existe bien
        console.log(result);
        kanapDetails(result);
    })
    .catch((error) => {
        alert("Le serveur met du temps à répondre...");
    });