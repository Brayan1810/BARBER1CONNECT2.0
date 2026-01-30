// ================== INICIO DEL ARCHIVO index.js ==================

// ================= SLIDER AVANZADO BARBER1CONNECT2.0 =================

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    const slides = document.querySelectorAll('.slide'); // Todas las imágenes del slider
    const nextBtn = document.querySelector('.next'); // Botón siguiente
    const prevBtn = document.querySelector('.prev'); // Botón anterior
    const sliderContainer = document.querySelector('.slider-container'); // Contenedor principal
    const dotsContainer = document.createElement('div'); // Contenedor de puntos

    let index = 0; // Índice del slide actual
    let startX = 0; // Posición inicial del dedo (swipe)

    // ================= CREAR PUNTOS =================
    dotsContainer.classList.add('slider-dots'); // Clase para estilos
    sliderContainer.appendChild(dotsContainer); // Agrega los puntos al slider

    slides.forEach((_, i) => {
        const dot = document.createElement('span'); // Crea un punto
        dot.classList.add('dot'); // Clase base
        if (i === 0) dot.classList.add('active'); // Primer punto activo
        dot.addEventListener('click', () => showSlide(i)); // Permite cambiar slide al tocar
        dotsContainer.appendChild(dot); // Inserta el punto
    });

    const dots = document.querySelectorAll('.dot'); // Todos los puntos

    // ================= FUNCIÓN MOSTRAR SLIDE =================
    function showSlide(i) {
        slides.forEach(slide => slide.classList.remove('active')); // Oculta todos
        dots.forEach(dot => dot.classList.remove('active')); // Desactiva puntos

        slides[i].classList.add('active'); // Muestra slide actual
        dots[i].classList.add('active'); // Activa punto actual
        index = i; // Actualiza índice
    }

    // ================= BOTONES (SOLO PC) =================
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide((index + 1) % slides.length); // Avanza
        });

        prevBtn.addEventListener('click', () => {
            showSlide((index - 1 + slides.length) % slides.length); // Retrocede
        });
    }

    // ================= SWIPE SOLO EN MÓVIL =================
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX; // Guarda posición inicial del dedo
    });

    sliderContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX; // Posición final
        const diff = startX - endX; // Diferencia de movimiento

        if (diff > 50) {
            showSlide((index + 1) % slides.length); // Swipe izquierda
        } else if (diff < -50) {
            showSlide((index - 1 + slides.length) % slides.length); // Swipe derecha
        }
    });

    // ================= AUTOMÁTICO =================
    setInterval(() => {
        showSlide((index + 1) % slides.length); // Cambio automático
    }, 5000);

});

// ================= SLIDER AUTOMÁTICO BARBER1CONNECT2.0 =================

// Espera a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // Obtiene todos los slides
    const slides = document.querySelectorAll('.slide'); // Todas las imágenes

    // Botones
    const nextBtn = document.querySelector('.next'); // Botón siguiente
    const prevBtn = document.querySelector('.prev'); // Botón anterior

    let index = 0; // Slide actual

    // Función que muestra el slide activo
    function showSlide(i) {
        slides.forEach(slide => slide.classList.remove('active')); // Oculta todos
        slides[i].classList.add('active'); // Muestra el actual
    }

    // Botón siguiente
    nextBtn.addEventListener('click', () => {
        index = (index + 1) % slides.length; // Avanza
        showSlide(index); // Actualiza
    });

    // Botón anterior
    prevBtn.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length; // Retrocede
        showSlide(index);
    });

    // Cambio automático cada 5 segundos
    setInterval(() => {
        index = (index + 1) % slides.length;
        showSlide(index);
    }, 5000);

});

/* ================= CAMBIO AUTOMÁTICO SOLO EN MÓVIL ================= */

if (window.innerWidth <= 768) { // Verifica si es pantalla móvil

    const cards = document.querySelectorAll('.auto-swap'); // Selecciona las tarjetas móviles

    cards.forEach(card => { // Recorre cada tarjeta

        const imgMain = card.querySelector('.img-main'); // Imagen principal
        const imgHover = card.querySelector('.img-hover'); // Imagen secundaria

        let showingMain = true; // Controla qué imagen se muestra

        setInterval(() => { // Cambia imagen cada cierto tiempo

            if (showingMain) {
                imgMain.style.opacity = '0'; // Oculta la imagen principal
                imgHover.style.opacity = '1'; // Muestra la secundaria
            } else {
                imgMain.style.opacity = '1'; // Vuelve a la principal
                imgHover.style.opacity = '0'; // Oculta secundaria
            }

            showingMain = !showingMain; // Alterna estado

        }, 2500); // Tiempo en milisegundos (2.5 segundos)

    });
}
