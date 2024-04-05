let container = document.getElementById('corps');
let btn = document.getElementById('searchButton');
let deleteValidation = document.getElementById('lineDeleteAction');
let unite = document.getElementById('unit');
let tempvilleNode = document.getElementsByClassName('tempville');
let tempunitNode = document.getElementsByClassName('tempunit');
let input_ville = document.getElementById('rechercheville');
let deleteConfirm = document.getElementById('confirm');
let deleteCancel = document.getElementById('cancel');
let ville_a_sup;
let villeindex;
let sup ;
let liste_ville = []; //liste_ville est un array qui stocke les noms des villes présentes dans local storage + celles qui sont ajoutées via la barre de recherche
if (localStorage.getItem('ville') !== null) { liste_ville = JSON.parse(localStorage.getItem('ville'))}; // charge dans liste_ville le contenu de local storage, attention localstorage est un string et liste_ville un array
let apikey = '967a9bd33d49966284cd4709635d0491';

// récupération des données dans l'API openweather map
function afficherMeteo(nom_ville, nouvelle_ville = false) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${nom_ville}&appid=${apikey}`;

    fetch(url).then(response => response.json())
        .then(data => {
            let ligne = document.createElement('div');
            ligne.classList.add('meteo_ville');
            ligne.setAttribute('id', nom_ville)

            temperature = Math.round(data['main']['temp'] - 273.15);
            humidite = data['main']['humidity'] + "%";
            weather = data['weather']['0']['description'];
            icone = data['weather']['0']['icon'];
            nom_propre_ville = nom_ville.charAt(0).toUpperCase() + nom_ville.slice(1) // Affiche le nom de la ville avec la première lettre en majuscule

            container.appendChild(ligne);
            ligne.innerHTML = "<img src='icon/" + icone + ".svg' alt='' class='weathericon'>" +
                "<div class='meteo_texte'><p class='temperature'><span class='tempville'>" + temperature + "</span><span class='tempunit'>°C</span></p><p class='ville'>"
                + nom_propre_ville + "</p></div>" +
                "<div class='humidite_texte'><p class='humidite_titre'>Humidité:</p><p class='humidite'>"
                + humidite + "</p></div><div class='deleteButton btn' ><img src='icon/deletewhite.svg' alt='Sup' class='deleteicon'></div>";

            // implemente localstorage si ajout d'une nouvelle ville via le formulaire
            if (nouvelle_ville == true) {
                liste_ville.push(nom_ville);
                localStorage.setItem('ville', JSON.stringify(liste_ville));
            }

        })
        .catch((error) => {
            if (error) {
                alert('Cette ville n\'existe pas!');
            }
        })

}

//charge les villes présentes dans le local storage
function Chargement(){
    if (liste_ville !== null) {
        for (i = 0; i < liste_ville.length; i++) {
            afficherMeteo(liste_ville[i]);
        }
    }}

// ajoute une ville
function ajoutVille(){
    let nom_ville = input_ville.value.trim().toLowerCase();  //permet de mettre le nom rentré dans l'inoput toujours sous la même forme, evite les espaces en trop
    
    if (nom_ville !== "") {
        let existe = liste_ville.indexOf(nom_ville);
        if (existe == -1) {
            afficherMeteo(nom_ville, true);
        }
        
    } else {
        alert('Veuillez saisir le nom d\'une ville');
    }
}
// supprime une ligne météo

container.addEventListener('click', supVille)

//supprime une ville
function supVille (event) {
    sup = event.target;
    if (sup.className == 'deleteicon') {
        ville_a_sup = sup.parentNode.parentNode.querySelector('.ville').textContent.toLowerCase();
        villeindex = liste_ville.indexOf(ville_a_sup);

        deleteValidation.parentElement.classList.remove('visible');
        let deletetext = document.getElementById('supTexte');
        deletetext.textContent = 'Voulez-vous vraiment supprimer la ville de ' + ville_a_sup + " ?";

    }
}

deleteConfirm.addEventListener('click', function () {
    liste_ville.splice(villeindex, 1);
    localStorage.setItem('ville', JSON.stringify(liste_ville));
    sup.parentNode.parentNode.remove();
    deleteValidation.parentElement.classList.add('visible');
})

deleteCancel.addEventListener('click', function () {
    deleteValidation.parentElement.classList.add('visible');
})

// Affiche les données pour chaque ville stockées dans localstorage au démarrage de l'appli
document.onload=Chargement();



// ajoute une ville lors du click du bouton search et implémente la liste de ville dans localstorage
btn.addEventListener('click', ajoutVille)

input_ville.addEventListener('keypress', function(event){
    if (event.key === "Enter"){
        ajoutVille()
    }
})


// Convertion d'unité

function celsiusToFarenheit(temperature) {
    let temperatureF = Math.round((temperature * 9) / 5 + 32);
    return temperatureF;
}

function farenheitToCelsius(temperature) {
    let temperatureC = Math.round((temperature - 32) * 5 / 9);
    return temperatureC;
}

unite.parentNode.addEventListener('click', function () {
    if (unite.textContent == "°C") {
        for (let elmt in tempvilleNode) {
            let tempC = tempvilleNode[elmt].textContent
            let tempF = celsiusToFarenheit(tempC)
            tempvilleNode[elmt].textContent = tempF
        }
        for (let elmt in tempunitNode) {
            tempunitNode[elmt].textContent = '°F'
        }
        unite.textContent = '°F'
    }
    else {
        for (let elmt in tempvilleNode) {
            let tempC = tempvilleNode[elmt].textContent
            let tempF = farenheitToCelsius(tempC)
            tempvilleNode[elmt].textContent = tempF
        }
        for (let elmt in tempunitNode) {
            tempunitNode[elmt].textContent = '°C'
        }
        unite.textContent = '°C'
    }
})

