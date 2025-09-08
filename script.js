// El evento DOMContentLoaded se dispara cuando el documento HTML ha sido completamente cargado y parseado,
// sin esperar a que las hojas de estilo, imágenes y subframes terminen de cargar.
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Configuración de Partículas.js para el fondo del Hero ---
    // Verifica si existe el elemento para evitar errores en otras páginas si no se usa.
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#fb923c" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 },
                "move": { "enable": true, "speed": 1, "direction": "none", "out_mode": "out" }
            },
            "interactivity": {
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.3 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }

    // --- 2. Lógica del Cursor Personalizado ---
    const cursor = document.querySelector('.custom-cursor');
    // Seleccionamos todos los elementos interactivos para aplicar el efecto hover al cursor.
    const hoverableElements = document.querySelectorAll('a, button, input, textarea, [data-tilt]');

    if (cursor) {
         window.addEventListener('mousemove', e => {
            // Actualiza la posición del cursor personalizado para que siga al puntero del mouse.
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Agrega y quita la clase 'hovered' para animar el cursor cuando pasa sobre elementos interactivos.
        hoverableElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // --- 3. Animaciones de Entrada (On-Scroll) con Intersection Observer ---
    // Intersection Observer es una API moderna y eficiente para detectar cuando un elemento entra en la pantalla.
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si el elemento es visible en el viewport, le añade la clase 'visible' para activar la animación CSS.
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // La animación se dispara cuando al menos el 10% del elemento es visible.
    });

    // Observa cada elemento que tiene la clase 'reveal'.
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- 4. Inicialización de Vanilla-tilt.js para el efecto 3D en las tarjetas ---
    // Se comprueba si la librería VanillaTilt está cargada antes de intentar usarla.
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.3
        });
    }

    // --- 5. Estilo del Header al hacer scroll ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            // Si el usuario ha hecho scroll más de 50px, se añade una clase para cambiar el fondo del header.
            if(window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // Formulario
    if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // e.preventDefault(); // Comenta o borra esta línea
        // alert('¡Formulario enviado! (Esto es una simulación)'); // Comenta o borra esta línea
        // En una aplicación real, aquí iría la lógica para enviar los datos...
    });
}

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const userIdea = ideaInput.value;
            if (!userIdea.trim()) {
                messageTextarea.value = "Por favor, introduce una idea para tu proyecto primero.";
                return;
            }

            // Muestra el spinner y deshabilita el botón para evitar clics múltiples.
            loadingSpinner.classList.remove('hidden');
            generateBtn.disabled = true;
            messageTextarea.value = "Generando un borrador increíble para tu proyecto... 🚀";

            // --- IMPORTANTE: Buena Práctica de Seguridad ---
            // NUNCA expongas tu API Key en el código del lado del cliente (frontend).
            // Un atacante podría robarla y usarla. En un proyecto real, esta llamada
            // debería hacerse desde un servidor (backend) que guarde la clave de forma segura.
            const apiKey = ""; // La API key debe ser manejada en un entorno seguro.
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            // El "systemPrompt" le da a la IA el contexto y el rol que debe asumir.
            const systemPrompt = "Actúas como un estratega de proyectos senior en una agencia digital de primer nivel llamada LuckyWeb. Un cliente potencial ha proporcionado una idea breve para un nuevo proyecto. Tu tarea es ampliar esta idea en un borrador de proyecto estructurado y profesional que impresione al cliente y sirva como un excelente punto de partida para una conversación. El tono debe ser alentador, profesional e innovador. Formatea el resultado como texto sin formato, utilizando títulos claros para cada sección (como 'Sugerencias de Nombre', 'Objetivos Clave', 'Público Objetivo', 'Características Principales'), y usa saltos de línea para la legibilidad.";
            const userQuery = `La idea del cliente es: "${userIdea}"`;

            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
            };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`Error en la llamada a la API: ${response.statusText}`);
                }

                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    const generatedText = candidate.content.parts[0].text;
                    messageTextarea.value = generatedText;
                } else {
                    messageTextarea.value = "Lo siento, no pude generar un borrador en este momento. Por favor, intenta de nuevo o describe tu proyecto manualmente.";
                }

            } catch (error) {
                console.error("Error al llamar a la API de Gemini:", error);
                messageTextarea.value = "Hubo un problema de conexión al generar el borrador. Por favor, revisa tu conexión e inténtalo de nuevo.";
            } finally {
                // Oculta el spinner y reactiva el botón, tanto si la llamada fue exitosa como si falló.
                loadingSpinner.classList.add('hidden');
                generateBtn.disabled = false;
            }
        });
    }
});

//Funcion de texto Rotativo
const rotatingTextElement = document.getElementById("rotating_text");

if(rotatingTextElement){
    const palabras = ["Increíbles", "Profesionales", "Modernas", "Únicas", "Digitales"];
    let palabrasIndex = 0;
    let letrasIndex = 0;
    let palabraRecurrente = "";
    let letrasRecurrentes = "";

    function type(){
        if (palabrasIndex === palabras.length){
            palabrasIndex = 0;
        }
        palabraRecurrente = palabras[palabrasIndex];
        letrasRecurrentes = palabraRecurrente.slice(0, ++ letrasIndex);

        rotatingTextElement.textContent = letrasRecurrentes;

        if (letrasRecurrentes.length === palabraRecurrente.length){
            setTimeout(erase, 1500);
        } else {
            setTimeout(type, 100);
        }
    }

    function erase() {
        letrasRecurrentes = palabraRecurrente.slice(0, --letrasIndex);
        rotatingTextElement.textContent = letrasRecurrentes;

        if (letrasRecurrentes.length === 0){
            palabrasIndex++;
            setTimeout(type, 500);
        } else {
            setTimeout(erase, 50);
        }
    }
    type();
}

//FORMULARIO FUNCIONALIDAD

// 1. Seleccionamos los elementos que vamos a manipular
  const generarBtn = document.getElementById('generar-presupuesto-btn');
  const opcionesSection = document.getElementById('opciones-pdf');

  // 2. Creamos un "escuchador de eventos" para el clic en el botón
  generarBtn.addEventListener('click', function() {
    
    // 3. Cuando se haga clic, mostramos la sección de opciones
    opcionesSection.style.display = 'block'; // O 'flex' si prefieres
    
    // 4. (Opcional pero recomendado) Ocultamos el botón que ya se presionó
    generarBtn.style.display = 'none';
    
  });