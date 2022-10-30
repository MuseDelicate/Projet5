//let requestInit = new Request();
//requestInit.headers.append("MimeType", "application/json");



// Requête de l'API pour récupérer les données
// savoir expliquer le principe de fetch, avec promise, async, await et callback, et requestInit
// connaître les différentes syntaxes (avec le mot clé function ou les fléches ou l'absence d'acolade sans utiliser de return). L'acolade signiafie qu'il y a un "bloc" de choses à réaliser)
fetch(`http://localhost:3000/api/products`)
    .then(function(res) {
        // le premier result est du json pur
        if (res.ok) {
            return res.json();
        }
    })
    .then((result) => {
        console.log(result);
        showKanaps(result);
        // on convertit le json en objet javascript
    })
    .catch((error) => {
        alert("Le serveur met du temps à répondre...");
    });


// let lien = document.createElement ...
function showKanaps(result) {
    // on fait une boucle for pour parcourir et récupérer tous les éléments
    let content = "";
    for (let i = 0; i < result.length; i++) {
        // on ajoute chaque élément dans la page

        //On crée de nouvelles balises HTML pour y ajouter toutes les données recueillies

        let kanapLink = document.createElement('a');
        let itemsArticle = document.createElement('article');
        let kanapImg = document.createElement('img');
        let kanapName = document.createElement('h3');
        let kanapDescription = document.createElement('p');

        let itemsContainer = document.querySelector("#items");
        itemsContainer.appendChild(kanapLink);
        kanapLink.appendChild(itemsArticle);
        itemsArticle.appendChild(kanapImg);
        kanapName.className = 'productName';
        itemsArticle.appendChild(kanapName);
        kanapDescription.className = 'productDescription';
        itemsArticle.appendChild(kanapDescription);

        kanapLink.setAttribute('href', `./product.html?_id=${result[i]._id}`)
        kanapImg.setAttribute('src', `${result[i].imageUrl}`);
        kanapImg.setAttribute('alt', `${result[i].altTxt}`);
        kanapName.innerHTML = `${result[i].name}`;
        kanapDescription.innerHTML = `${result[i].description}`;
    }
}