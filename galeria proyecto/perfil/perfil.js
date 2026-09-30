document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos guardados en localStorage
    const nombre = localStorage.getItem('nombreUsuario') || 'Usuario';
    const tag = localStorage.getItem('tagUsuario') || '@usuario';
    const email = localStorage.getItem('emailUsuario') || 'correo@ejemplo.com';

    // Insertar datos en la pantalla
    document.getElementById('user-display-name').textContent = nombre;
    document.getElementById('user-display-tag').textContent = tag;
    document.getElementById('user-display-email').textContent = email;

    // Colocar la primera letra del nombre en el avatar
    const inicial = nombre.charAt(0).toUpperCase();
    document.getElementById('avatar-inicial').textContent = inicial;

    // Botón Cerrar Sesión
    const btnLogout = document.getElementById('btn-cerrar-sesion');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('sesionIniciada');
            window.location.href = '../inicio-Seccion/iniciar-sesion.html';
        });
    }

    // Botón Volver a editar perfil
    const btnEditar = document.getElementById('btn-editar-perfil');
    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            window.location.href = '../completar-perfil/completar-perfil.html';
        });
    }
});