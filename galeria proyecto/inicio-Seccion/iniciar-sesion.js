/* =========================================================
   ARCHIVO: iniciar-sesion.js
   Valida las credenciales y redirige según el estado del perfil
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login');

    if (!loginForm) return;

    // Procesar el envío del formulario de inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        // 1. Intentar validar usando la lista de usuarios (si usas array de 'users')
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userFound = users.find(u => u.email === email && u.password === password);

        // 2. Intentar validar usando las credenciales simples de registro
        const emailGuardado = localStorage.getItem('usuarioRegistradoEmail');
        const passwordGuardada = localStorage.getItem('usuarioRegistradoPassword');

        const esValidoSimple = (email === emailGuardado && password === passwordGuardada && email !== '');

        if (userFound || esValidoSimple) {
            // Guardar usuario activo en sesión
            localStorage.setItem('sesionIniciada', 'true');
            localStorage.setItem('emailUsuario', email);

            showAlert(`¡Bienvenido de nuevo!`, 'success');

            // 🔑 LÓGICA DE REDIRECCIÓN INTELIGENTE
            setTimeout(() => {
                const perfilCompletado = localStorage.getItem('perfilCompletado');

                if (perfilCompletado === 'true') {
                    // Si YA configuró el perfil previamente -> Va directo a Perfil
                    window.location.href = '../perfil/perfil.html';
                } else {
                    // Si ES LA PRIMERA VEZ -> Va a completar el perfil
                    window.location.href = '../completar-perfil/completar-perfil.html';
                }
            }, 1200);

        } else {
            showAlert('Correo o contraseña incorrectos. Inténtalo de nuevo.', 'error');
        }
    });
});

// Función para mostrar los mensajes de alerta
function showAlert(message, type) {
    const alertBox = document.getElementById('alert-box');
    if (!alertBox) return;

    alertBox.innerText = message;
    alertBox.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    alertBox.style.display = 'block';
}