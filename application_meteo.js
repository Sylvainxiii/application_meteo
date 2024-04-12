// DEFINITION DES VARIABLES DE NAVIGATION DANS LE DOM-------------------------------------------------------------------------------------------------------------------------------------

let container = document.getElementById('corps');
let rechercheBtn = document.getElementById('searchButton');
let supprimerValidation = document.getElementById('modaleSuppression');
let unite = document.getElementById('unit');
let temperatureVilleNode = document.getElementsByClassName('tempville');
let temperatureUnitNode = document.getElementsByClassName('tempunit');
let barreDeRechercheVille = document.getElementById('rechercheville');
let deletetext = document.getElementById('supTexte');
let confirmerSupprimer = document.getElementById('confirm');
let supprimerAnnule = document.getElementById('cancel');
let cleApi = '967a9bd33d49966284cd4709635d0491';

//RECUPERATION ET AFFICHAGE DES DONNEES METEO PAR VILLE---------------------------------------------------------------------------------------------------------------------------------

function createUrl(nomVille, apikey) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${nomVille}&appid=${apikey}`;
    return url
}
// récupération des données dans l'API openweather map et création de l'élement HTML contenant les données
function afficherMeteo(nomVille, apikey) {

    fetch(createUrl(nomVille, apikey)).then(response => response.json())
        .then(data => {

            //Récupération des données de L'api
            temperature = Math.round(data['main']['temp'] - 273.15);
            humidite = data['main']['humidity'] + "%";
            weather = data['weather']['0']['description'];
            icone = data['weather']['0']['icon'];

            creationDivVille(container, nomVille, icone, temperature, humidite);
            return;
        })
        .catch((error) => {
            if (error) {
                alert('Cette ville n\'existe pas!');
                return;
            }
            return;
        })
}

//Fonction de création de l'élément HTML contenant les données météo d'une ville
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

    return true;
}

//OPERATIONS DANS LE LOCAL STORAGE--------------------------------------------------------------------------------------------------------------------------------------------------

function extractLocalStorage() {
    let listeVille = []; //listeVille est un array qui stocke les noms des villes présentes dans local storage + celles qui sont ajoutées via la barre de recherche
    if (localStorage.getItem('ville') !== null) { listeVille = JSON.parse(localStorage.getItem('ville')) }; // charge dans listeVille le contenu de local storage, attention localstorage est un string et listeVille un array    

    return listeVille;
}

function villeDansLocalStorage(nomVille) {
    local = extractLocalStorage();
    return local.includes(nomVille);
}

function implementLocalStorage(nomVille) {
    local = extractLocalStorage();
    local.push(nomVille);
    localStorage.setItem('ville', JSON.stringify(local));
    return true;
}

function supprimerDeLocalStorage(nomVille) {
    local = extractLocalStorage();
    let villeIndex = local.indexOf(nomVille);
    local.splice(villeIndex, 1);
    localStorage.setItem('ville', JSON.stringify(local));
    return true;
}

// ACTIONS AU CHARGEMENT DE LA PAGE-------------------------------------------------------------------------------------------------------------------------------------------------

// Affiche les données pour chaque ville stockées dans localstorage au démarrage de l'appli
document.onload = Chargement(extractLocalStorage(), cleApi);

//charge les villes présentes dans le local storage
function Chargement(listeVille, apikey) {
    if (listeVille.length !== 0) {
        for (i = 0; i < listeVille.length; i++) {
            afficherMeteo(listeVille[i], apikey);
        }
    }
    return true;
}

//AJOUT D'UNE VILLE-----------------------------------------------------------------------------------------------------------------------------------------------------------------

// ajoute une ville lors du click du bouton search
rechercheBtn.addEventListener("click", function () {
    ajoutVille(barreDeRechercheVille, cleApi)
});

// ajoute une ville en appuyant sur le bouton "Entrée"
barreDeRechercheVille.addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        ajoutVille(barreDeRechercheVille, cleApi)
    }
})

// Fonction d'ajou d'une ville
function ajoutVille(inputVille, apikey) {

    let nomVille = inputVille.value.trim().toLowerCase();

    if (nomVille !== "") {
        if (villeDansLocalStorage(nomVille) == false) {
            afficherMeteo(nomVille, apikey);
            //RAJOUTER LA GESTION DE L'ERREUR QUI IMPLEMENT QUAND MEME LE LOCALSTORAGE
            implementLocalStorage(nomVille);
        }

    } else {
        alert('Veuillez saisir le nom d\'une ville');
    }

    return true;
}

//SUPPRESSION DES DONNEES METEO D'UNE VILLE----------------------------------------------------------------------------------------------------------------------------------------

//supprime une ville
container.addEventListener('click', prepaSuppressionVille);

//Fonction préparant la suppression en identifiant la ville à supprimer en fonction du bouton cliqué (1 bouton par ligne)
function prepaSuppressionVille(event) {
    let supprimerBtn = event.target;
    if (supprimerBtn.className == 'deleteicon') {
        let villeASupprimer = supprimerBtn.parentNode.parentNode.querySelector('.ville').textContent.toLowerCase();
        fenetreSuppression(villeASupprimer);
    }
    return;
}

//
function fenetreSuppression(villeASupprimer) {
    supprimerValidation.classList.remove('visible');
    deletetext.innerHTML = 'Voulez-vous vraiment supprimer la ville de <span id = "spanvilleasup">' + villeASupprimer + "</span> ?"; //le span permet de stocker le nom de la ville pour pouvoir le récupérer lors de la confirmation
    return villeASupprimer;
}

//Action suite au click du bouton "confirmer" de la modale de validation de suppression
confirmerSupprimer.addEventListener('click', function () {
    let spanvilleasup = document.getElementById('spanvilleasup');
    let villeASupprimer = spanvilleasup.textContent;
    suppressionVille(villeASupprimer);
})

//Annulation de la suppression
supprimerAnnule.addEventListener('click', function () {
    let spanvilleasup = document.getElementById('spanvilleasup');
    spanvilleasup.textContent = ""; //purge le span du texte de la modale d'annulation de suppression pour éviter une erreur en cas de bug (car il sert de stockage pour la validation de suppression)
    supprimerValidation.classList.add('visible');
    lignePosInit();
})

// Fonction qui finalise la suppression et purge le localstorage de la ville supprimée
function suppressionVille(nomVille) {
    supprimerDeLocalStorage(nomVille);

    let ligneASupprimer = document.getElementById(nomVille);
    debugger
    remonteLigne(nomVille);
    ligneASupprimer.remove();
    supprimerValidation.classList.add('visible');
    return true;
}

//CONVERSION D'UNITES ENTRE LES °C ET LES °F----------------------------------------------------------------------------------------------------------------------------------------

// Convertion d'unité

function celsiusToFarenheit(temperature, elmt) {
    let temperatureF = Math.round((temperature * 9) / 5 + 32);
    elmt.textContent = temperatureF
    elmt.parentNode.lastChild.textContent = '°F'
    unite.textContent = '°F'
    return true;
}

function farenheitToCelsius(temperature, elmt) {
    let temperatureC = Math.round((temperature - 32) * 5 / 9);
    elmt.textContent = temperatureC
    elmt.parentNode.lastChild.textContent = '°C'
    unite.textContent = '°C'
    return true;
}

unite.parentNode.addEventListener('click', function () {
    for (let elmt in temperatureVilleNode) {
        let temperatureelmt = temperatureVilleNode[elmt].textContent;
        let uniteelmt = temperatureVilleNode[elmt].parentNode.lastChild.textContent;
        if (uniteelmt == "°C") {
            celsiusToFarenheit(temperatureelmt, temperatureVilleNode[elmt]);
        } else {
            farenheitToCelsius(temperatureelmt, temperatureVilleNode[elmt]);
        }

    }

})

//SUPPRESSION DE LIGNE AVEC UN SWIPE LEFT------------------------------------------------------------------------------------------------------------

document.addEventListener('touchstart', function (event) {
    let startX = event.changedTouches[0].pageX;
    let elm = deleteTarget(event.target)
    let villeASupprimer = elm.id
    if (elm.className == "meteo_ville") {
        glissement(elm, startX, function (action) {
            if (action == 'delete') {
                fenetreSuppression(villeASupprimer)
            }
        })
    }
})

// Permet de se positionner sur la div qui correspond à la ligne d'une ville peut importe l'élément interne qui est la cible du touchstart
function deleteTarget(touchelm) {

    let i = touchelm
    do {
        i = i.parentNode
    } while (i === container)
    return i
}

function lignePosInit() {
    let containercontent = container.childNodes
    for (i = 1; i < containercontent.length; i++) {
        containercontent[i].style.transition = "all 0.5s ";
        containercontent[i].style.transform = "translateX(0)"
    }
}

function remonteLigne(nomVille) {

    let nextLigne = document.getElementById(nomVille).nextSibling
    nextLigne.style.transition = "all 0.5s ";
    nextLigne.style.transform = "translateY(0)"
}

function glissement(elm, startX, callback) {

    elm.style.transition = "all 0s ";
    let disX;
    elm.addEventListener('touchmove', function (event) {

        disX = event.touches[0].pageX - startX;
        elmwidth = elm.offsetWidth;
        elmheight = elm.offsetHeight;
        elm.style.transform = "translateX(" + disX + "px)"
    })

    elm.addEventListener('touchend', function (event) {
        if (disX < -200) {
            elm.style.transform = "translateX(-105%)"
            action = "delete"
        } else {
            elm.style.transition = "all 0.5s ";
            elm.style.transform = "translateX(0)"
            action = "cancel"
        }
        callback(action)
    })

}

