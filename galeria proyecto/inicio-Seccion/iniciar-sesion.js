/* =========================================================
   ARCHIVO: iniciar-sesion.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login') || document.getElementById('loginForm');
    const emailInput = document.getElementById('login-email') || document.getElementById('email');
    const passwordInput = document.getElementById('login-password') || document.getElementById('password');
    const alertBox = document.getElementById('alert-box') || document.getElementById('alertMessage');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        if (!email || !password) {
            mostrarAlerta('Por favor, ingresa tu correo y contraseña.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                mostrarAlerta('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

                localStorage.setItem('sesionIniciada', 'true');
                localStorage.setItem('emailUsuario', data.email);
                localStorage.setItem('nombreUsuario', data.nombre || '');
                localStorage.setItem('tagUsuario', data.tag || '');

                setTimeout(() => {
                    if (data.perfilCompletado) {
                        window.location.href = '../perfil/perfil.html';
                    } else {
                        window.location.href = '../completar-perfil/completar-perfil.html';
                    }
                }, 1000);

            } else {
                mostrarAlerta(data.message || 'Correo o contraseña incorrectos.', 'error');
            }

        } catch (error) {
            mostrarAlerta('Error de conexión con el servidor. Ejecuta "node server.js".', 'error');
        }
    });

    function mostrarAlerta(mensaje, tipo) {
        if (!alertBox) return;
        alertBox.textContent = mensaje;
        alertBox.className = 'alert-message';
        if (tipo === 'success') alertBox.classList.add('alert-success');
        if (tipo === 'error') alertBox.classList.add('alert-error');
        alertBox.style.display = 'block';
    }
});