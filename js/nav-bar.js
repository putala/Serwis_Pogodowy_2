

document.addEventListener("DOMContentLoaded", () => {
    const nav = `
        <a href="index.html">Strona Główna</a>
        <a href="lightning.html">Wyładowania</a>
        <a href="rainfall.html">Opady</a>
        <a href="location.html">Lokalizacja</a>
        <a href="contact.html">Kontakt</a>
    `;

    const navbar = document.querySelector(".nav-bar");
    navbar.innerHTML = nav;
});
