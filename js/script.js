document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggler && navbarMenu) {
        navbarToggler.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            // Opcional: Cambiar el icono del toggler (ej. a una 'X')
             if (navbarMenu.classList.contains('active')) {
                navbarToggler.innerHTML = '×'; // Icono 'X'
                navbarToggler.setAttribute('aria-label', 'Cerrar navegación');
            } else {
                navbarToggler.innerHTML = '☰'; // Icono Hamburguesa
                 navbarToggler.setAttribute('aria-label', 'Abrir navegación');
            }
        });

        // Opcional: Cerrar menú al hacer clic en un enlace (para SPAs o si quieres ese comportamiento)
        navbarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                    navbarToggler.innerHTML = '☰';
                    navbarToggler.setAttribute('aria-label', 'Abrir navegación');
                }
            });
        });

         // Opcional: Cerrar menú si se hace clic fuera de él
         document.addEventListener('click', (event) => {
            const isClickInsideNav = navbarMenu.contains(event.target);
            const isClickOnToggler = navbarToggler.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggler && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                navbarToggler.innerHTML = '☰';
                 navbarToggler.setAttribute('aria-label', 'Abrir navegación');
            }
        });
    }

    // --- Footer: Actualizar Año Automáticamente ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Opcional: Smooth Scroll para enlaces internos (si los tienes) ---
    // Selecciona todos los enlaces que empiezan con #
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Previene el comportamiento por defecto del ancla
            e.preventDefault();

            // Obtiene el elemento al que apunta el ancla
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if(targetElement) {
                // Calcula la posición del elemento, ajustando por la altura del navbar fijo
                 const headerOffset = document.querySelector('.main-header')?.offsetHeight || 0; // Obtiene altura del header
                 const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                 const offsetPosition = elementPosition - headerOffset - 15; // 15px de espacio extra

                // Realiza el scroll suave
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Cierra el menú móvil si está abierto después del scroll
                if (navbarMenu && navbarMenu.classList.contains('active')) {
                     navbarMenu.classList.remove('active');
                     navbarToggler.innerHTML = '☰';
                     navbarToggler.setAttribute('aria-label', 'Abrir navegación');
                }
            }
        });
    });

    // --- Pre-llenar Asunto del Formulario de Contacto desde el botón de reserva ---
    // Si la URL tiene ?tour=NombreDelTour
    const urlParams = new URLSearchParams(window.location.search);
    const tourSubject = urlParams.get('tour');
    const subjectInput = document.querySelector('#subject'); // Asegúrate que tu input de asunto tenga id="subject"

    if (tourSubject && subjectInput) {
        subjectInput.value = `Consulta sobre el tour: ${tourSubject}`;
    }


    // --- Puedes añadir más funcionalidades aquí ---
    // Ej: Validación de formulario de contacto simple (antes de enviar a backend)
    // Ej: Un simple slider/carousel para la galería de fotos del tour
    // Ej: Efectos de aparición al hacer scroll (Intersection Observer API)

});