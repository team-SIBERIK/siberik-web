const buttons = document.querySelectorAll('.founder-btn');
const profiles = document.querySelectorAll('.profile');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.target;
        const targetProfile = document.getElementById(targetId);
        const isVisible = targetProfile.classList.contains('show');

        // Si el perfil ya está visible → ciérralo
        if (isVisible) {
            targetProfile.classList.remove('show');
            return;
        }

        // Cierra todos los perfiles primero
        profiles.forEach(profile => profile.classList.remove('show'));

        // Muestra el perfil seleccionado
        targetProfile.classList.add('show');
    });
});
