document.addEventListener('DOMContentLoaded', function() {
    const btnWhatIs = document.getElementById('btnWhatIs');
    const btnRoadmap = document.getElementById('btnRoadmap');
    const btnComments = document.getElementById('btnComments');
    const dynamicContent = document.getElementById('dynamicContent');

    // Contenido para el botón "¿Qué es?"
    const whatIsContent = `
        <h2>¿Qué es More.exe?</h2>
        <p>More.exe es una aplicación diseñada para proporcionar información adicional sobre el proyecto actual. 
        Permite a los usuarios conocer más detalles sobre el desarrollo, las tecnologías utilizadas y la hoja de ruta del proyecto.</p>
        <p>Con More.exe, los usuarios pueden mantenerse informados sobre el progreso del proyecto y contribuir con comentarios y sugerencias.</p>
    `;


    // Contenido para el botón "Hoja de Ruta"
    const roadmapContent = `
        <h2>Hoja de Ruta del Proyecto</h2>
        <div class="roadmap">
            <div class="step">
                <span class="step-text">1. Reunión inicial de planificación del proyecto</span>
            </div>
            <div class="arrow"></div>
            <div class="step">
                <span class="step-text">2. Análisis de requisitos y especificaciones</span>
            </div>
            <div class="arrow"></div>
            <div class="step">
                <span class="step-text">3. Diseño y arquitectura del sistema</span>
            </div>
            <div class="arrow"></div>
            <div class="step">
                <span class="step-text">4. Desarrollo e implementación</span>
            </div>
            <div class="arrow"></div>
            <div class="step">
                <span class="step-text">5. Pruebas y depuración</span>
            </div>
            <div class="arrow"></div>
            <div class="step">
                <span class="step-text">6. Entrega final y lanzamiento del producto</span>
            </div>
        </div>
        <p class="roadmap-description">La hoja de ruta detalla los principales hitos y actividades del proyecto, desde la planificación hasta la entrega final del producto.</p>
    `;

    // Contenido para el botón "Enviar Comentarios"
    const commentsContent = `
        <h2>Enviar Comentarios</h2>
        <form id="commentsForm">
            <label for="comment">Escribe tu comentario:</label><br>
            <textarea id="comment" name="comment" rows="4" cols="50"></textarea><br>
            <button type="submit">Enviar</button>
        </form>
        <p>Tu opinión es importante para nosotros. ¡Déjanos saber qué piensas!</p>
    `;

    // Función para mostrar el contenido dinámico
    function showContent(content) {
        dynamicContent.innerHTML = content;
        dynamicContent.style.display = 'block';
    }

    // Event listeners para los botones
    btnWhatIs.addEventListener('click', function() {
        showContent(whatIsContent);
    });

    btnRoadmap.addEventListener('click', function() {
        showContent(roadmapContent);
    });

    btnComments.addEventListener('click', function() {
        showContent(commentsContent);
    });

    // Prevent default form submission for comments form
    const commentsForm = document.getElementById('commentsForm');
    commentsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Aquí puedes agregar la lógica para enviar el comentario
        // Por ejemplo, obtener el valor del textarea: 
        // const comment = document.getElementById('comment').value;
        // Y luego enviarlo a través de una solicitud HTTP
    });
});
