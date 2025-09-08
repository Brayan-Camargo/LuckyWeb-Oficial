document.addEventListener('DOMContentLoaded', function() {
    'use strict'; // Modo estricto para escribir código más seguro y evitar errores comunes.

    // --- 1. Funciones Auxiliares para una Mejor Legibilidad ---
    const getEl = (selector) => document.querySelector(selector);
    const getAllEl = (selector) => document.querySelectorAll(selector);

    // --- 2. Funcionalidades del Sitio Web ---

    /**
     * @function setupParticles
     * @description Inicializa la librería particles.js para el fondo animado.
     */
    const setupParticles = () => {
        if (getEl('#particles-js')) {
            particlesJS('particles-js', {
                "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#fb923c" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": false }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "out_mode": "out" } },
                "interactivity": { "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.3 } }, "push": { "particles_nb": 4 } } },
                "retina_detect": true
            });
        }
    };

    /**
     * @function setupCustomCursor
     * @description Maneja la lógica del cursor personalizado para seguir el mouse y cambiar de tamaño.
     */
    const setupCustomCursor = () => {
        const cursor = getEl('.custom-cursor');
        // Seleccionamos todos los elementos interactivos para el efecto hover.
        const hoverableElements = getAllEl('a, button, input, textarea, [data-tilt]');

        if (cursor) {
            window.addEventListener('mousemove', e => {
                // Actualiza la posición del cursor personalizado.
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            });

            // Añade y quita la clase 'hovered' al pasar sobre elementos interactivos.
            hoverableElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
            });
        }
    };

    /**
     * @function setupScrollAnimations
     * @description Utiliza Intersection Observer para animar elementos al entrar en el viewport.
     */
    const setupScrollAnimations = () => {
        const revealElements = getAllEl('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 }); // Se dispara cuando el 10% del elemento es visible.
        
        revealElements.forEach(el => observer.observe(el));
    };

    /**
     * @function setupVanillaTilt
     * @description Inicializa la librería Vanilla-tilt.js para el efecto 3D en las tarjetas.
     */
    const setupVanillaTilt = () => {
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(getAllEl("[data-tilt]"), {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.3
            });
        }
    };

    /**
     * @function setupHeaderScroll
     * @description Cambia el estilo del encabezado al hacer scroll.
     */
    const setupHeaderScroll = () => {
        const header = getEl('#header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
            });
        }
    };

    /**
     * @function setupContactForm
     * @description Maneja la lógica del formulario de contacto.
     */
    const setupContactForm = () => {
        const contactForm = getEl('#contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                // e.preventDefault();
                // Lógica para el envío real del formulario...
            });
        }
    };

    /**
     * @function setupRotatingText
     * @description Anima un texto rotativo para el eslogan del hero.
     */
    const setupRotatingText = () => {
        const rotatingTextElement = getEl("#rotating_text");
        if (rotatingTextElement) {
            const palabras = ["Increíbles", "Profesionales", "Modernas", "Únicas", "Digitales"];
            let palabrasIndex = 0;
            let letrasIndex = 0;
            let palabraRecurrente = "";
            let letrasRecurrentes = "";

            function type() {
                if (palabrasIndex === palabras.length) palabrasIndex = 0;
                palabraRecurrente = palabras[palabrasIndex];
                letrasRecurrentes = palabraRecurrente.slice(0, ++letrasIndex);
                rotatingTextElement.textContent = letrasRecurrentes;
                if (letrasRecurrentes.length === palabraRecurrente.length) {
                    setTimeout(erase, 1500);
                } else {
                    setTimeout(type, 100);
                }
            }

            function erase() {
                letrasRecurrentes = palabraRecurrente.slice(0, --letrasIndex);
                rotatingTextElement.textContent = letrasRecurrentes;
                if (letrasRecurrentes.length === 0) {
                    palabrasIndex++;
                    setTimeout(type, 500);
                } else {
                    setTimeout(erase, 50);
                }
            }
            type();
        }
    };

    /**
     * @function setupBudgetForm
     * @description Controla la visibilidad del botón y las opciones del formulario de presupuesto.
     */
    const setupBudgetForm = () => {
        const generarBtn = getEl('#generar-presupuesto-btn');
        const opcionesSection = getEl('#opciones-pdf');
        if (generarBtn && opcionesSection) {
            generarBtn.addEventListener('click', () => {
                opcionesSection.style.display = 'block';
                generarBtn.style.display = 'none';
            });
        }
    };

    /**
     * @function setupLightbox
     * @description Maneja la galería de imágenes con efecto lightbox.
     */
    const setupLightbox = () => {
        const portfolioImages = getAllEl('.portfolio-image');
        const lightbox = getEl('#lightbox');
        const lightboxImage = getEl('#lightbox-image');
        const lightboxClose = getEl('#lightbox-close');

        if (portfolioImages.length > 0 && lightbox) {
            portfolioImages.forEach(image => {
                image.addEventListener('click', () => {
                    lightbox.classList.remove('hidden');
                    lightbox.classList.add('active');
                    lightboxImage.src = image.dataset.image;
                    document.body.style.overflow = 'hidden';
                });
            });

            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    lightbox.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }, 300);
            });

            lightbox.addEventListener('click', (e) => {
                // Cierra si se hace clic en el fondo o en la imagen
                if (e.target.id === 'lightbox' || e.target.id === 'lightbox-image') {
                    lightboxClose.click();
                }
            });
        }
    };

    /**
     * @function setupMobileMenu
     * @description Controla el menú desplegable en dispositivos móviles.
     */
    const setupMobileMenu = () => {
        const mobileMenuButton = getEl('#mobile-menu-button');
        const mobileMenu = getEl('#mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // Cierra el menú al hacer clic en un enlace.
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    };

    // --- 3. Inicialización del Sitio ---
    // Llamamos a todas las funciones para iniciar la lógica.
    setupParticles();
    setupCustomCursor();
    setupScrollAnimations();
    setupVanillaTilt();
    setupHeaderScroll();
    setupContactForm();
    setupRotatingText();
    setupBudgetForm();
    setupLightbox();
    setupMobileMenu();
});