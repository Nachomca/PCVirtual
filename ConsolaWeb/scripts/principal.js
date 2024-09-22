const consoleOutput = document.querySelector('.console-output');
const inputField = document.getElementById('user-input');
const consoleContainer = document.querySelector('.console');
const openConsoleButton = document.getElementById('openConsoleButton'); // Obtener el botón de reapertura

const commands = {
    help: "Muestra la lista de comandos disponibles",
    about: "Muestra información sobre esta página",
    root: "Para saber más sobre mi",
    contact: "Muestra formas de contactar conmigo",
    open: "Abrir. Disponible: proyects y curriculum.pdf. Escribe 'open + {nombre}'",
    date: "Muestra la fecha actual",
    time: "Muestra la hora actual",
    echo: "Imprime un mensaje en la consola",
    prompt: "Cambiar el usuario de la consola",
    clear: "Limpia la pantalla. Comando 'cls' también disponible",
    exit: "Para salir"
    // Puedes agregar más comandos según sea necesario
};

// Lista de artículos disponibles para abrir
const availableArticles = ['proyects', 'curriculum.pdf', 'links', 'tecnologies.doc', 'more.exe'];

// Función para abrir la consola
function openConsole() {
    consoleContainer.style.display = 'flex'; // Mostrar la consola
    openConsoleButton.style.display ="none";
    inputField.focus();
}

// Función para cerrar la consola
function closeConsole() {
    consoleContainer.style.display = 'none'; // Ocultar la consola
    openConsoleButton.style.display ="flex";
}

// JavaScript para abrir la ventana modal
function openProjectsModal(article) {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    const closeButton = document.createElement('span');
    closeButton.textContent = 'X';
    closeButton.classList.add('modal-close-button');
    closeButton.addEventListener('click', closeProjectsModal);

    const maximizeButton = document.createElement('span');
    maximizeButton.textContent = '[]';
    maximizeButton.classList.add('modal-maximize-button');
    maximizeButton.addEventListener('click', toggleMaximize);

    const iframe = document.createElement('iframe');

    if(article === 'proyects') {
        iframe.setAttribute('src', 'add/proyectos.html');
    }else if(article === 'curriculum.pdf') {
        iframe.setAttribute('src', 'media/curriculum.pdf');
    }else if (article === 'links') {
        iframe.setAttribute('src', 'add/links.html');
        iframe.style.width = '14vw';
        iframe.style.height = '14hw';
    }else if (article === 'tecnologies.doc') {
        iframe.setAttribute('src', 'add/tecnologias.html');
    }else if (article === 'more.exe') {
        iframe.setAttribute('src', 'add/more.html');
    }

    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');
    iframe.setAttribute('frameborder', '0');
    //iframe.setAttribute('sandbox','');

    modalContainer.appendChild(maximizeButton);
    modalContainer.appendChild(closeButton);
    modalContainer.appendChild(iframe);
    modalOverlay.appendChild(modalContainer);
    document.body.appendChild(modalOverlay);
}

// Cerrar la ventana modal
function closeProjectsModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.remove();
    }
}

// Ampliar la ventana modal
function toggleMaximize() {
    const iframe = document.querySelector('iframe');

    if (iframe.style.width === '80vw' && iframe.style.height === '80vh') {
        // Si ya está maximizado, restaurar tamaño original
        iframe.style.width = '30vw';
        iframe.style.height = '30vh';
    } else {
        // Si no está maximizado, maximizar
        iframe.style.width = '80vw';
        iframe.style.height = '80vh';
    }
}

//CONTROLADOR DEL INPUT DE LA CONSOLA
var prom = 'C:User/Invitado> ';

inputField.addEventListener('keydown', function (e) {

    if (e.key === 'Enter') {
        const command = inputField.value.trim().toLowerCase();
        const commandParts = command.split(' '); // Dividir el texto en partes separadas por espacios
        const command2 = commandParts.shift(); // Extraer el primer elemento (el comando)
        const argument = commandParts.join(' '); // Unir los restantes elementos (el argumento)

        inputField.value = '';

        // Simulando respuesta de la consola
        const output = document.createElement('p');
        output.textContent = prom + command;
        consoleOutput.appendChild(output);

        // Procesamiento de comandos
        if (command === 'help') {
            Object.keys(commands).forEach(cmd => {
                const cmdOutput = document.createElement('p');
                cmdOutput.textContent = `${cmd}: ${commands[cmd]}`;
                consoleOutput.appendChild(cmdOutput);
            });

        } else if (command === 'clear' || command === 'cls') {
            consoleOutput.innerHTML = '';

        } else if (command === 'exit') {
            closeConsole(); // Cerrar la consola

        } else if (command === 'date') {
            const currentDate = new Date().toLocaleDateString();
            const dateOutput = document.createElement('p');
            dateOutput.textContent = currentDate;
            consoleOutput.appendChild(dateOutput);

        } else if (command === 'time') {
            const currentTime = new Date().toLocaleTimeString();
            const timeOutput = document.createElement('p');
            timeOutput.textContent = currentTime;
            consoleOutput.appendChild(timeOutput);

        } else if (command.startsWith('echo')) {
            const message = command.slice(4).trim();
            const echoOutput = document.createElement('p');
            echoOutput.textContent = message;
            consoleOutput.appendChild(echoOutput);

        } else if (command === 'about') {
            const aboutText = "Esta página web es una simulación de un pc antiguo sin interfaz. Solo puedes interactuar con el mediante consola " + 
            "Ha sido creada con HTML, CSS y JavaScript como proyecto web y portfolio. " +
            "Es una versión beta en desarrollo del proyecto final que acabará siendo. Un pc virtual. " +
            "Para saber más acerca de este proyecto, introduzca 'open more.exe'.";
            const aboutOutput = document.createElement('p');
            aboutOutput.textContent = aboutText;
            consoleOutput.appendChild(aboutOutput);

        } else if (command === 'contact') {
            const contactInfo = "Puedes contactarme a través de mi correo electrónico: namarcaran@gmail.com. " +
            "Para conocer mis redes sociales, teclee 'open links'.";
            const contactOutput = document.createElement('p');
            contactOutput.textContent = contactInfo;
            consoleOutput.appendChild(contactOutput);

        } else if (command.startsWith('open')) {
            const article = command.slice(4).trim();

            if (availableArticles.includes(article)) {            
                // Abre el artículo correspondiente
                //window.location.href = `add/${article}.html`; // Cambia la ruta según la ubicación de tu archivo HTML
                /*const width = 600;
                const height = 400;
                const left = (window.innerWidth - width) / 2;
                const top = (window.innerHeight - height) / 2;
                const options = `
                    toolbar=no,
                    location=no,
                    directories=no,
                    status=no,
                    menubar=no,
                    scrollbars=no,
                    resizable=no,
                    width=${width},
                    height=${height},
                    top=${top},
                    left=${left}
                `;
                const projectsPopup = window.open(`add/${article}.html`, 'Carpeta', options);
                if (window.focus) {
                    projectsPopup.focus();
                }*/
                openProjectsModal(article);

            } else {
                // Si no se encuentra el artículo, muestra un mensaje de error
                const openErrorOutput = document.createElement('p');
                openErrorOutput.textContent = `No se pudo abrir ${article}: No existe.`;
                openErrorOutput.style.color = 'red';
                consoleOutput.appendChild(openErrorOutput);
            }
        } else if (command2 === 'prompt') {
            prom = argument;

        } else if (command.startsWith('root')) {
            const aboutText = "Me llamo Ignacio Martínez de Carvajal Andrés y tengo 24 años. " + 
            "Soy desarrollador Full Stack, especializado en backend JAVA. " +
            "Cuento con bastantes años de experiencia en este sector y como esto puede demostrar, me apasiona. " +
            "Para conocer que tecnologías controlo y saber más sobre mi, introduce 'open tecnologies.doc'.";
            const aboutOutput = document.createElement('p');
            aboutOutput.textContent = aboutText;
            consoleOutput.appendChild(aboutOutput);
        } else if (command.startsWith('more')) {

        } else if (command in commands) {
            const cmdOutput = document.createElement('p');
            cmdOutput.textContent = commands[command];
            consoleOutput.appendChild(cmdOutput);
        }else {
            const errorOutput = document.createElement('p');
            errorOutput.textContent = `Comando desconocido: ${command}`;
            errorOutput.style.color = 'red';
            consoleOutput.appendChild(errorOutput);
        }

        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
});

// Para que al hacer click en la pantalla, vuelva a su sitio el cursor y deje escribir correctamente
inputField.addEventListener('click', function() {

    inputField.focus();
});