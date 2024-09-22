document.addEventListener('DOMContentLoaded', function () {
    const closePopupButton = document.getElementById('closePopup');
    const projectList = document.getElementById('projectList');

    closePopupButton.addEventListener('click', function () {
        window.close(); // Cierra la ventana emergente
    });

    projectList.addEventListener('dblclick', function (event) {
        const projectName = event.target.textContent;
        // Abre una nueva ventana emergente con detalles del proyecto
        window.open(`proyecto/${projectName}.html`, '_blank', 'width=600,height=400');
    });
});
