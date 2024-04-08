let container = document.getElementById('corps');
let rechercheBtn = document.getElementById('searchButton');
let supprimerValidation = document.getElementById('lineDeleteAction');
let unite = document.getElementById('unit');
let temperatureVilleNode = document.getElementsByClassName('tempville');
let temperatureUnitNode = document.getElementsByClassName('tempunit');
let inputVille = document.getElementById('rechercheville');
let confirmerSupprimer = document.getElementById('confirm');
let supprimerAnnule = document.getElementById('cancel');
let villeASupprimer;
let villeIndex;
let supprimerBtn;
let listeVille = []; //listeVille est un array qui stocke les noms des villes présentes dans local storage + celles qui sont ajoutées via la barre de recherche
if (localStorage.getItem('ville') !== null) { listeVille = JSON.parse(localStorage.getItem('ville')) }; // charge dans listeVille le contenu de local storage, attention localstorage est un string et listeVille un array
let cleApi = '967a9bd33d49966284cd4709635d0491';

// récupération des données dans l'API openweather map
function afficherMeteo(nomVille, apikey, nouvelleVille = false) {

    fetch(createUrl(nomVille, apikey)).then(response => response.json())
        .then(data => {

            //Récupération des données de L'api
            temperature = Math.round(data['main']['temp'] - 273.15);
            humidite = data['main']['humidity'] + "%";
            weather = data['weather']['0']['description'];
            icone = data['weather']['0']['icon'];

            creationDivVille(container, nomVille, icone, temperature, humidite);

            // implemente localstorage si ajout d'une nouvelle ville via le formulaire
            if (villeDansLocalStorage(nomVille) == false) {
                implementLocalStorage(nomVille)
            }

        })
        .catch((error) => {
            if (error) {
                alert('Cette ville n\'existe pas!');
            }
        })

}

function creationDivVille(divParent, divNomVille, divIcone, divTemperature, divHumidite) {
    nomPropreVille = divNomVille.charAt(0).toUpperCase() + divNomVille.slice(1); // Affiche le nom de la ville avec la première lettre en majuscule
    //Création d'un nouvel élément
    let ligne = document.createElement('div');
    ligne.classList.add('meteo_ville');
    ligne.setAttribute('id', divNomVille);
    divParent.appendChild(ligne);
    ligne.innerHTML = "<img src='icon/" + divIcone + ".svg' alt='' class='weathericon'>" +
        "<div class='meteo_texte'><p class='temperature'><span class='tempville'>" + divTemperature + "</span><span class='tempunit'>°C</span></p><p class='ville'>"
        + nomPropreVille + "</p></div>" +
        "<div class='humidite_texte'><p class='humidite_titre'>Humidité:</p><p class='humidite'>"
        + divHumidite + "</p></div><div class='deleteButton btn' ><img src='icon/deletewhite.svg' alt='Sup' class='deleteicon'></div>";

    return
}

function createUrl(nomVille, apikey) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${nomVille}&appid=${apikey}`;
    return url
}

function extractLocalStorage() {
    let listeVille = []; //listeVille est un array qui stocke les noms des villes présentes dans local storage + celles qui sont ajoutées via la barre de recherche
    if (localStorage.getItem('ville') !== null) { listeVille = JSON.parse(localStorage.getItem('ville')) }; // charge dans listeVille le contenu de local storage, attention localstorage est un string et listeVille un array    

    return listeVille
}

function villeDansLocalStorage(nomVille) {
    extractLocalStorage();
    return listeVille.includes(nomVille);
}

function implementLocalStorage(nomVille) {
    local = extractLocalStorage();
    local.push(nomVille);
    localStorage.setItem('ville', JSON.stringify(local));
    return true
}




//charge les villes présentes dans le local storage
function Chargement() {
    if (listeVille !== null) {
        for (i = 0; i < listeVille.length; i++) {
            afficherMeteo(listeVille[i], cleApi);
        }
    }
}

// ajoute une ville
function ajoutVille() {
    let nomVille = inputVille.value.trim().toLowerCase();  //permet de mettre le nom rentré dans l'inoput toujours sous la même forme, evite les espaces en trop

    if (nomVille !== "") {
        let existe = listeVille.indexOf(nomVille);
        if (existe == -1) {
            afficherMeteo(nomVille, cleApi, true);
        }

    } else {
        alert('Veuillez saisir le nom d\'une ville');
    }
}

//supprime une ville
function supVille(event) {
    supprimerBtn = event.target;
    if (supprimerBtn.className == 'deleteicon') {
        villeASupprimer = supprimerBtn.parentNode.parentNode.querySelector('.ville').textContent.toLowerCase();
        villeIndex = listeVille.indexOf(villeASupprimer);

        supprimerValidation.parentElement.classList.remove('visible');
        let deletetext = document.getElementById('supTexte');
        deletetext.textContent = 'Voulez-vous vraiment supprimer la ville de ' + villeASupprimer + " ?";

    }
}




confirmerSupprimer.addEventListener('click', function () {
    listeVille.splice(villeIndex, 1);
    localStorage.setItem('ville', JSON.stringify(listeVille));
    supprimerBtn.parentNode.parentNode.remove();
    supprimerValidation.parentElement.classList.add('visible');
})

supprimerAnnule.addEventListener('click', function () {
    supprimerValidation.parentElement.classList.add('visible');
})


// supprime une ligne météo

container.addEventListener('click', supVille)


// Affiche les données pour chaque ville stockées dans localstorage au démarrage de l'appli
document.onload = Chargement();



// ajoute une ville lors du click du bouton search et implémente la liste de ville dans localstorage
rechercheBtn.addEventListener('click', ajoutVille)

inputVille.addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
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
        for (let elmt in temperatureVilleNode) {
            let tempC = temperatureVilleNode[elmt].textContent
            let tempF = celsiusToFarenheit(tempC)
            temperatureVilleNode[elmt].textContent = tempF
        }
        for (let elmt in temperatureUnitNode) {
            temperatureUnitNode[elmt].textContent = '°F'
        }
        unite.textContent = '°F'
    }
    else {
        for (let elmt in temperatureVilleNode) {
            let tempC = temperatureVilleNode[elmt].textContent
            let tempF = farenheitToCelsius(tempC)
            temperatureVilleNode[elmt].textContent = tempF
        }
        for (let elmt in temperatureUnitNode) {
            temperatureUnitNode[elmt].textContent = '°C'
        }
        unite.textContent = '°C'
    }
})

