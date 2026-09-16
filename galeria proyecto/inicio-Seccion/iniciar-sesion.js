document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login');

    // Procesar el envío del formulario de inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Cargar lista de usuarios desde el almacenamiento local
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Buscar coincidencias exactas de correo y contraseña
        const userFound = users.find(u => u.email === email && u.password === password);

        if (userFound) {
            // Guardar usuario en sesión activa
            localStorage.setItem('session_user', JSON.stringify(userFound));
            showAlert(`¡Bienvenido de nuevo, ${userFound.name}!`, 'success');

            // Redirigir al inicio en 1.2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        } else {
            showAlert('Correo o contraseña incorrectos.', 'error');
        }
    });
});

function showAlert(message, type) {
    const alertBox = document.getElementById('alert-box');
    alertBox.innerText = message;
    alertBox.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    alertBox.style.display = 'block';
}