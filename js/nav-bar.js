

document.addEventListener("DOMContentLoaded", () => {
    const nav = `
        <a href="index.html">Temperatura</a>
        <a href="lightning.html">Wyładowania atmosferyczne</a>
        <a href="rainfall.html">Opady</a>
        <a href="contact.html">Kontakt</a>
    `;

    const navbar = document.querySelector(".nav-bar");
    navbar.innerHTML = nav;
});
