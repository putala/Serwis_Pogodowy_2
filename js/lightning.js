

document.addEventListener("DOMContentLoaded", function () {
    const mapFrame = document.getElementById("lightningMap");
    
    if (!mapFrame) {
        console.error("Nie znaleziono elementu iframe dla mapy wyładowań.");
        return;
    }

    // Obsługa błędów ładowania iframe
    setTimeout(() => {
        if (mapFrame.contentWindow === null) {
            console.error("Mapa Blitzortung nie załadowała się poprawnie. Może być blokowana przez serwer.");
            mapFrame.style.display = "none";
            const errorMessage = document.createElement("p");
            errorMessage.innerText = "Nie można załadować mapy wyładowań atmosferycznych. Sprawdź oryginalną stronę.";
            errorMessage.style.color = "red";
            document.querySelector(".map-container").appendChild(errorMessage);
        }
    }, 5000);

    // Obsługa geolokalizacji
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Pozycja użytkownika: ", position.coords);
            },
            (error) => {
                console.warn("Geolokalizacja wyłączona lub niedostępna.", error);
            }
        );
    } else {
        console.warn("Geolokalizacja nie jest obsługiwana przez tę przeglądarkę.");
    }
});
