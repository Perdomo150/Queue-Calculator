// Funcionalidad de los modales
document.addEventListener('DOMContentLoaded', function() {
    const helpModal = document.getElementById('helpModal');
    const conceptModal = document.getElementById('conceptModal');
    const helpButton = document.getElementById('helpButton');
    const conceptButton = document.getElementById('conceptButton');
    const closeButtons = document.querySelectorAll('.close');

    helpButton.addEventListener('click', function() {
        helpModal.style.display = 'block';
    });

    conceptButton.addEventListener('click', function() {
        conceptModal.style.display = 'block';
    });

    closeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            helpModal.style.display = 'none';
            conceptModal.style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target == helpModal) {
            helpModal.style.display = 'none';
        } else if (event.target == conceptModal) {
            conceptModal.style.display = 'none';
        }
    });
});
