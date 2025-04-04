document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle Limpio ---
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarMain = document.querySelector('.navbar-main'); 
    // const menuOverlay = document.querySelector('.menu-overlay'); // Descomentar si usas overlay

    if (navbarToggler && navbarMain) {
        navbarToggler.addEventListener('click', function() {
            // Alternar clase 'active' en el toggler y el menú principal
            navbarToggler.classList.toggle('active');
            navbarMain.classList.toggle('active');
            
            // (Opcional) Alternar overlay
            // if (menuOverlay) menuOverlay.classList.toggle('active');

            // (Opcional) Prevenir scroll del body cuando el menú está abierto
            // document.body.style.overflow = navbarMain.classList.contains('active') ? 'hidden' : '';
        });

        // (Opcional) Cerrar menú al hacer clic en el overlay
        // if (menuOverlay) {
        //     menuOverlay.addEventListener('click', function() {
        //         navbarToggler.classList.remove('active');
        //         navbarMain.classList.remove('active');
        //         menuOverlay.classList.remove('active');
        //         document.body.style.overflow = '';
        //     });
        // }

        // Cerrar menú al hacer clic en un enlace dentro del menú
        navbarMain.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbarToggler.classList.remove('active');
                navbarMain.classList.remove('active');
                // if (menuOverlay) menuOverlay.classList.remove('active'); // Si usas overlay
                // document.body.style.overflow = ''; // Si previenes scroll
            });
        });
    }

    // --- Efecto de scroll para el header (ya no es necesario si es siempre blanco) ---
    // window.addEventListener('scroll', function() {
    //     if (window.scrollY > 50) {
    //         header.classList.add('scrolled');
    //     } else {
    //         header.classList.remove('scrolled');
    //     }
    // });
    // handleScroll(); // Llamar inicialmente si se mantiene el efecto

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
                 const headerOffset = header?.offsetHeight || 0; // Obtiene altura del header
                 const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                 const offsetPosition = elementPosition - headerOffset - 15; // 15px de espacio extra

                // Realiza el scroll suave
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
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

    // --- Carrusel de Tours --- Refinado
    const carousel = document.querySelector('.tour-carousel');

    if (carousel) {
        const carouselContainer = carousel.querySelector('.carousel-container');
        const carouselDotsContainer = carousel.querySelector('.carousel-dots');
        const prevButton = carousel.querySelector('.carousel-control.prev');
        const nextButton = carousel.querySelector('.carousel-control.next');
        let tourCards = [];
        let carouselDots = [];
        let currentSlide = 0;
        let maxSlides = 0;
        let isDesktop = window.innerWidth >= 992;

        function setupCarousel() {
            isDesktop = window.innerWidth >= 992;
            tourCards = Array.from(carouselContainer.querySelectorAll('.tour-card'));
            maxSlides = tourCards.length;

            if (isDesktop) {
                // En escritorio, ocultamos controles y dots si están visibles
                if (prevButton) prevButton.style.display = 'none';
                if (nextButton) nextButton.style.display = 'none';
                if (carouselDotsContainer) carouselDotsContainer.style.display = 'none';
                carouselContainer.style.transform = ''; // Reset transform
                carouselContainer.classList.remove('scrolling');
            } else {
                // En móvil/tablet
                if (prevButton) prevButton.style.display = 'flex';
                if (nextButton) nextButton.style.display = 'flex';
                if (carouselDotsContainer) {
                     carouselDotsContainer.style.display = 'flex';
                     setupDots();
                }
                updateCarouselUI();
                carouselContainer.classList.add('scrolling');
            }
        }
        
        function setupDots() {
            if (!carouselDotsContainer) return;
            carouselDotsContainer.innerHTML = ''; // Limpiar dots existentes
            carouselDots = [];
            for (let i = 0; i < maxSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                carouselDotsContainer.appendChild(dot);
                carouselDots.push(dot);
            }
            updateDots();
        }

        function updateDots() {
            if (!carouselDotsContainer || isDesktop) return;
            carouselDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function updateCarouselUI() {
            if (isDesktop) return;
            // Calculamos el desplazamiento usando scrollLeft para mayor precisión con scroll-snap
            const scrollAmount = currentSlide * carouselContainer.offsetWidth;
            carouselContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            updateDots();
        }

        function goToSlide(slideIndex) {
            if (isDesktop) return;
            
            currentSlide = (slideIndex + maxSlides) % maxSlides; // Asegura índice válido
            updateCarouselUI();
        }

        // Event Listeners para botones
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
            });
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
            });
        }

        // Actualizar índice al hacer scroll manual (para sincronizar dots)
        let scrollTimeout;
        if (carouselContainer) {
            carouselContainer.addEventListener('scroll', () => {
                if (isDesktop) return;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrollLeft = carouselContainer.scrollLeft;
                    const containerWidth = carouselContainer.offsetWidth;
                    // Estimamos el índice basado en la posición de scroll
                    const newSlideIndex = Math.round(scrollLeft / containerWidth);
                    if (newSlideIndex !== currentSlide) {
                         currentSlide = (newSlideIndex + maxSlides) % maxSlides; // Asegura índice válido
                         updateDots();
                    }
                }, 150); // Espera un poco después de que el scroll termine
            }, { passive: true });
        }

        // Reconfigurar en resize
        window.addEventListener('resize', setupCarousel);

        // Configuración inicial
        setupCarousel();
    }

    // --- Efectos de aparición al hacer scroll (Intersection Observer API) ---
    const isMobile = () => window.innerWidth < 768; // Definir punto de corte móvil
    
    // Añadir clase CSS para la animación inicial
    const addScrollStyles = () => {
        // Solo añade estilos de animación si no es móvil
        if (isMobile()) return;
        
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
    
    // Aplicar clases a elementos que queremos animar (solo en desktop)
    const prepareElementsForAnimation = () => {
        // Solo aplica clases si no es móvil
        if (isMobile()) return;
        
        // Selector general para todos los elementos a animar
        const elementsToAnimate = document.querySelectorAll(
            '.activity-card, .testimonial-card, .feature-card, '
            + '.cta-left h2, .cta-subtitle, .cta-features, .cta-offer, .cta-buttons, .cta-form-container'
        );

        elementsToAnimate.forEach((element, index) => {
            element.classList.add('fade-in-element');
            // Aplicar delay basado en un grupo o índice general si es más simple
            const delayClass = `delay-${(index % 5) * 100 + 100}`;
            element.classList.add(delayClass);
        });
    };
    
    prepareElementsForAnimation();
    
    // Configurar y activar el Intersection Observer (solo en desktop)
    if (!isMobile()) {
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
    }

    // --- Puedes añadir más funcionalidades aquí ---
    // Ej: Validación de formulario de contacto simple (antes de enviar a backend)
    // Ej: Un simple slider/carousel para la galería de fotos del tour
    // Ej: Efectos de aparición al hacer scroll (Intersection Observer API)

});