document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('form-register');

    // Procesar envío del registro
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        // Cargar lista existente de usuarios en localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Validar si el correo ya fue registrado anteriormente
        const userExists = users.some(u => u.email === email);
        if (userExists) {
            showAlert('Este correo electrónico ya está registrado.', 'error');
            return;
        }

        // Guardar nuevo usuario
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        showAlert('¡Cuenta creada exitosamente! Redirigiendo...', 'success');

        // Redirigir a la página de iniciar sesión
        setTimeout(() => {
            window.location.href = 'iniciar-sesion.html';
        }, 1500);
    });
});

function showAlert(message, type) {
    const alertBox = document.getElementById('alert-box');
    alertBox.innerText = message;
    alertBox.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    alertBox.style.display = 'block';
}