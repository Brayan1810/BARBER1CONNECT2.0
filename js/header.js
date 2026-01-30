// ================= HEADER REUTILIZABLE =================

// Espera a que el DOM cargue
document.addEventListener("DOMContentLoaded", function () {

    // Inserta el header en el div con id="header"
    fetch("../html/header.html") // Carga el archivo del menú
        .then(response => response.text()) // Convierte a texto
        .then(data => {
            document.getElementById("header").innerHTML = data;
            activarMenu(); // Activa eventos después de cargar
        });

});

// Función que activa el menú
function activarMenu() {

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    // Menú hamburguesa
    toggle.addEventListener("click", function () {
        nav.classList.toggle("active");
    });

    // Submenú productos
    const dropdown = document.querySelector(".dropdown");

    dropdown.addEventListener("click", function () {
        this.classList.toggle("active");
    });
}
