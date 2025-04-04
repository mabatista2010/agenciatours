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

    // --- Countdown Timer para la Sección CTA ---
    const countdown = {
        days: document.getElementById('countdown-days'),
        hours: document.getElementById('countdown-hours'),
        minutes: document.getElementById('countdown-minutes'),
        seconds: document.getElementById('countdown-seconds')
    };

    if (countdown.days && countdown.hours && countdown.minutes && countdown.seconds) {
        // Establecer fecha objetivo: final del mes siguiente
        const now = new Date();
        const targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Primer día del mes siguiente
        
        const updateCountdown = () => {
            const currentTime = new Date();
            const difference = targetDate - currentTime;
            
            if (difference <= 0) {
                // Si la fecha objetivo ya pasó, establecemos una nueva fecha
                targetDate.setMonth(targetDate.getMonth() + 1);
            }
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            // Actualizar los valores con formato de dos dígitos
            countdown.days.textContent = days.toString().padStart(2, '0');
            countdown.hours.textContent = hours.toString().padStart(2, '0');
            countdown.minutes.textContent = minutes.toString().padStart(2, '0');
            countdown.seconds.textContent = seconds.toString().padStart(2, '0');
        };
        
        // Actualizar cada segundo
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // --- Form Validation para el formulario de la sección CTA ---
    const ctaForm = document.querySelector('.cta-form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulación de envío de formulario
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simular envío (reemplazar con tu lógica de envío real)
            setTimeout(() => {
                // Resetear el formulario
                this.reset();
                
                // Mostrar mensaje de éxito
                submitButton.textContent = '¡Enviado!';
                
                // Volver al estado original después de un tiempo
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
                
                // Aquí podrías mostrar un mensaje de confirmación
                alert('¡Gracias por suscribirte! Pronto recibirás nuestras ofertas exclusivas.');
            }, 1500);
        });
    }

    // --- Carrusel de Tours ---
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    
    if (carouselContainer && carouselDots.length > 0 && prevButton && nextButton) {
        // Solo activamos el carrusel si estamos en móvil/tablet
        if (window.innerWidth < 992) {
            const tourCards = document.querySelectorAll('.tour-card');
            let currentSlide = 0;
            const maxSlides = tourCards.length;
            
            // Función para mover el carrusel
            function moveCarousel(slideIndex) {
                if (slideIndex < 0) slideIndex = maxSlides - 1;
                if (slideIndex >= maxSlides) slideIndex = 0;
                
                currentSlide = slideIndex;
                
                // Ancho del card + margin derecho
                const cardWidth = tourCards[0].offsetWidth + 15;
                carouselContainer.style.transform = `translateX(-${cardWidth * currentSlide}px)`;
                
                // Actualizar dots
                carouselDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
            
            // Event Listeners para controles
            prevButton.addEventListener('click', () => {
                moveCarousel(currentSlide - 1);
            });
            
            nextButton.addEventListener('click', () => {
                moveCarousel(currentSlide + 1);
            });
            
            // Event Listeners para dots
            carouselDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    moveCarousel(index);
                });
            });
            
            // Auto-play (opcional)
            let autoPlayInterval;
            
            function startAutoPlay() {
                autoPlayInterval = setInterval(() => {
                    moveCarousel(currentSlide + 1);
                }, 5000); // Cambiar cada 5 segundos
            }
            
            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }
            
            // Iniciar auto-play y detenerlo al interactuar
            startAutoPlay();
            
            // Detener cuando el usuario interactúa
            prevButton.addEventListener('mouseenter', stopAutoPlay);
            nextButton.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            
            // Reiniciar cuando el usuario deja de interactuar
            prevButton.addEventListener('mouseleave', startAutoPlay);
            nextButton.addEventListener('mouseleave', startAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
            
            // Manejar eventos táctiles para dispositivos móviles
            let touchStartX = 0;
            let touchEndX = 0;
            
            carouselContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoPlay();
            }, { passive: true });
            
            carouselContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoPlay();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50; // mínima distancia para considerar un swipe
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe a la izquierda
                    moveCarousel(currentSlide + 1);
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe a la derecha
                    moveCarousel(currentSlide - 1);
                }
            }
        } else {
            // En desktop, ocultamos los controles de navegación
            document.querySelector('.carousel-controls').style.display = 'none';
        }
        
        // Ajustar al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth < 992) {
                document.querySelector('.carousel-controls').style.display = 'flex';
            } else {
                document.querySelector('.carousel-controls').style.display = 'none';
            }
        });
    }

    // --- Efectos de aparición al hacer scroll (Intersection Observer API) ---
    // Añadir clase CSS para la animación inicial
    const addScrollStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .fade-in-element {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            .fade-in-element.visible {
                opacity: 1;
                transform: translateY(0);
            }
            .delay-100 { transition-delay: 0.1s; }
            .delay-200 { transition-delay: 0.2s; }
            .delay-300 { transition-delay: 0.3s; }
            .delay-400 { transition-delay: 0.4s; }
            .delay-500 { transition-delay: 0.5s; }
        `;
        document.head.appendChild(style);
    };
    
    addScrollStyles();
    
    // Aplicar clases a elementos que queremos animar
    const prepareElementsForAnimation = () => {
        // Para las actividades
        const activityCards = document.querySelectorAll('.activity-card');
        activityCards.forEach((card, index) => {
            card.classList.add('fade-in-element');
            card.classList.add(`delay-${(index % 4) * 100 + 100}`);
        });
        
        // Para los testimonios
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
            card.classList.add('fade-in-element');
            card.classList.add(`delay-${(index % 3) * 100 + 100}`);
        });
        
        // Para las características (why choose us)
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.classList.add('fade-in-element');
            card.classList.add(`delay-${(index % 3) * 100 + 100}`);
        });
        
        // Para la sección CTA
        const ctaElements = [
            document.querySelector('.cta-left h2'),
            document.querySelector('.cta-subtitle'),
            document.querySelector('.cta-features'),
            document.querySelector('.cta-offer'),
            document.querySelector('.cta-buttons'),
            document.querySelector('.cta-form-container')
        ];
        
        ctaElements.forEach((element, index) => {
            if (element) {
                element.classList.add('fade-in-element');
                element.classList.add(`delay-${index * 100 + 100}`);
            }
        });
    };
    
    prepareElementsForAnimation();
    
    // Configurar y activar el Intersection Observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% del elemento debe ser visible
    };
    
    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // dejar de observar una vez animado
            }
        });
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observar todos los elementos con la clase 'fade-in-element'
    document.querySelectorAll('.fade-in-element').forEach(el => {
        observer.observe(el);
    });

    // --- Puedes añadir más funcionalidades aquí ---
    // Ej: Validación de formulario de contacto simple (antes de enviar a backend)
    // Ej: Un simple slider/carousel para la galería de fotos del tour
    // Ej: Efectos de aparición al hacer scroll (Intersection Observer API)

});