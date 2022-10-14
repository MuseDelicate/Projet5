let itemsContainer = document.querySelector(".items");
//let requestInit = new Request();
//requestInit.headers.append("MimeType", "application/json");

// Requête de l'API pour récupérer les données
// connaître les différentes syntaxes (avec le mot clé function ou les fléches ou l'absence d'acolade sans utiliser de return). L'acolade signiafie qu'il y a un "bloc" de choses à réaliser)
fetch(`http://localhost:3000/api/products` /*, requestInit*/ )
    .then(function(result) {
        // le premier result est du json pur
        console.log(result);
        return result.json();
    })
    .then((result2) => {
        showKanaps(result2);
        console.log(result2);
        // on convertit le json en objet javascript
    })
    .catch((error) => {
        alert(error.message);
    });


//On crée de nouvelles balises HTML pour y ajouter toutes les données recueillies
function showKanaps(result) {
    let content = "";
    // on fait une boucle for pour parcourir et récupérer tous les éléments
    for (let i = 0; i < result.length; i++) {
        // on ajoute chaque élément dans la page
        content += `
    <a href="./product.html?_id=${result[i]._id}"> 
      <article>
        <img src="${result[i].imageUrl}" alt="${result[i].altTxt}">
        <h3 class="productName">${result[i].name}</h3> 
        <p class="productDescription">${result[i].description}</p>
      </article>
    </a>`;
    }
    itemsContainer.innerHTML = content;
}