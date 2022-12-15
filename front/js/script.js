// Requête de l'API pour récupérer les données sous forme de tableau, avant de leur appliquer la fonction d'affichage des produits
fetch(`http://localhost:3000/api/products`)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then((result) => {
        showKanaps(result);
    })
    .catch((error) => {
        alert("Le serveur met du temps à répondre...");
    });

// fonction d'affichage des produits dans la page
function showKanaps(result) {
    // on fait une boucle for pour parcourir le tableau et récupérer tous les éléments
    for (let i = 0; i < result.length; i++) {

        // Initialisation des éléments HTML
        let kanapLink = document.createElement('a');
        let itemsArticle = document.createElement('article');
        let kanapImg = document.createElement('img');
        let kanapName = document.createElement('h3');
        let kanapDescription = document.createElement('p');

        // Puis on leur attribue une valeur
        kanapLink.setAttribute('href', `./product.html?_id=${result[i]._id}`)
        kanapImg.setAttribute('src', `${result[i].imageUrl}`);
        kanapImg.setAttribute('alt', `${result[i].altTxt}`);
        kanapName.textContent = `${result[i].name}`;
        kanapDescription.textContent = `${result[i].description}`;

        // On indique au navigateur comment vont s'imbriquer les éléments entre eux
        let itemsContainer = document.querySelector("#items");
        kanapLink.appendChild(itemsArticle);
        itemsArticle.appendChild(kanapImg);
        kanapName.classList.add('productName');
        itemsArticle.appendChild(kanapName);
        kanapDescription.className = 'productDescription';
        itemsArticle.appendChild(kanapDescription);

        // Puis on ajoute les différents éléments items dans la page
        itemsContainer.appendChild(kanapLink);
    }
}