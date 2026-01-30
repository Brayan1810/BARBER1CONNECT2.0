// ================= CARGA FOOTER UNIVERSAL =================

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // Busca el archivo footer.html dentro de la carpeta html
    fetch('footer.html') // MISMA carpeta que index.html
        .then(response => response.text()) // Convierte el HTML a texto
        .then(data => {
            const footerContainer = document.getElementById('footer'); // Busca el div contenedor

            if (footerContainer) { // Verifica que exista
                footerContainer.innerHTML = data; // Inserta el footer
            } else {
                console.error('No existe el div #footer en el HTML');
            }
        })
        .catch(error => {
            console.error('Error cargando el footer:', error);
        });

});
