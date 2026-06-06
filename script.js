document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const getEl = (selector) => document.querySelector(selector);
    const getAllEl = (selector) => document.querySelectorAll(selector);

    const setupParticles = () => {
        if (getEl('#particles-js')) {
            particlesJS('particles-js', {
                "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#fb923c" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": false }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "out_mode": "out" } },
                "interactivity": { "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.3 } }, "push": { "particles_nb": 4 } } },
                "retina_detect": true
            });
        }
    };

    const setupCustomCursor = () => {
        const cursor = getEl('.custom-cursor');
        const hoverableElements = getAllEl('a, button, input, textarea, select, [data-tilt]');

        if (cursor) {
            window.addEventListener('mousemove', e => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            });

            hoverableElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
            });
        }
    };

    const setupScrollAnimations = () => {
        const revealElements = getAllEl('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

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

    const setupRotatingText = () => {
        const rotatingTextElement = getEl("#rotating_text");
        if (rotatingTextElement) {
            const palabras = ["Escalable", "Para Empresas", "En la Nube", "Robusta", "A Medida"];
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
                if (e.target.id === 'lightbox' || e.target.id === 'lightbox-image') {
                    lightboxClose.click();
                }
            });
        }
    };

    const setupMobileMenu = () => {
        const mobileMenuButton = getEl('#mobile-menu-button');
        const mobileMenu = getEl('#mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }
    };

    const setupCotizadorSaaS = () => {
        const sucursalesInput = getEl('#sucursalesInput');
        const sucursalesVal = getEl('#sucursalesVal');
        const totalImplementacionEl = getEl('#totalImplementacion');
        const totalMensualEl = getEl('#totalMensual');
        const btnAgendar = getEl('#btnAgendarDemo');

        if (!sucursalesInput) return;

        const MENSUALIDAD_LIBRE_POR_SUCURSAL = 600;
        const IMPL_BASE_LIBRE = 3500; 
        const IMPL_EXTRA_LIBRE = 1000; 

        const formatMoneda = (valor) => {
            return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(valor);
        };

        const calcularCotizacion = () => {
            const sucursales = parseInt(sucursalesInput.value);
            
            let subtotalMensual = sucursales * MENSUALIDAD_LIBRE_POR_SUCURSAL;
            let subtotalImplementacion = 0;

            if (sucursales <= 3) {
                subtotalImplementacion = IMPL_BASE_LIBRE;
            } else {
                const sucursalesExtra = sucursales - 3;
                subtotalImplementacion = IMPL_BASE_LIBRE + (sucursalesExtra * IMPL_EXTRA_LIBRE);
            }

            const totalImplementacionConIva = subtotalImplementacion * 1.16;
            const totalMensualConIva = subtotalMensual * 1.16;

            totalImplementacionEl.innerText = formatMoneda(totalImplementacionConIva);
            totalMensualEl.innerText = formatMoneda(totalMensualConIva);
        };

        sucursalesInput.addEventListener('input', (e) => {
            sucursalesVal.innerText = e.target.value;
            calcularCotizacion();
        });

        if (btnAgendar) {
            btnAgendar.addEventListener('click', () => {
                const sucursales = sucursalesInput.value;
                const mensaje = `Hola LuckyDev, me interesa agendar una demostración del Gestor de Horarios. Coticé el sistema para ${sucursales} sucursales y me gustaría ver cómo funciona.`;
                window.open(`https://wa.me/+525533476238?text=${encodeURIComponent(mensaje)}`, '_blank');
            });
        }

        calcularCotizacion();
    };

    // --- Inicialización del Sitio ---
    setupParticles();
    setupCustomCursor();
    setupScrollAnimations();
    setupVanillaTilt();
    setupHeaderScroll();
    setupRotatingText();
    setupLightbox();
    setupMobileMenu();
    setupCotizadorSaaS();
});