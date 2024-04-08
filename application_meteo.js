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
                listeVille.push(nom_ville);
                localStorage.setItem('ville', JSON.stringify(listeVille));
            }

        })
        .catch((error) => {
            if (error) {
                alert('Cette ville n\'existe pas!');
            }
        })

}

//charge les villes présentes dans le local storage
function Chargement() {
    if (listeVille !== null) {
        for (i = 0; i < listeVille.length; i++) {
            afficherMeteo(listeVille[i]);
        }
    }
}

// ajoute une ville
function ajoutVille() {
    let nom_ville = inputVille.value.trim().toLowerCase();  //permet de mettre le nom rentré dans l'inoput toujours sous la même forme, evite les espaces en trop

    if (nom_ville !== "") {
        let existe = listeVille.indexOf(nom_ville);
        if (existe == -1) {
            afficherMeteo(nom_ville, true);
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

