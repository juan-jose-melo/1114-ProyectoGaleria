/* =========================================================
   ARCHIVO: iniciar-sesion.js
   Manejo de inicio de sesión consultando directamente a SQLite
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener referencias a los elementos del DOM en tu HTML
    const loginForm = document.getElementById('form-login') || document.getElementById('loginForm');
    const emailInput = document.getElementById('login-email') || document.getElementById('email');
    const passwordInput = document.getElementById('login-password') || document.getElementById('password');
    const alertBox = document.getElementById('alert-box') || document.getElementById('alertMessage');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        // Evita que el navegador recargue la página automáticamente
        e.preventDefault();
        e.stopImmediatePropagation();

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        // Validar que no se envíen campos vacíos
        if (!email || !password) {
            mostrarAlerta('Por favor, ingresa tu correo y contraseña.', 'error');
            return;
        }

        try {
            // 2. Consulta al backend de Node.js / SQLite
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // 3. Evaluar respuesta del servidor
            if (data.success) {
                mostrarAlerta('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

                // Guardar la sesión activa del usuario actual
                localStorage.setItem('sesionIniciada', 'true');
                localStorage.setItem('emailUsuario', data.email);
                localStorage.setItem('nombreUsuario', data.nombre || '');
                localStorage.setItem('tagUsuario', data.tag || '');

                // 4. Redirección inteligente
                setTimeout(() => {
                    // Si en SQLite la cuenta ya tiene perfilCompletado = 1 (true)
                    if (data.perfilCompletado) {
                        window.location.href = '../perfil/perfil.html';
                    } else {
                        // Si es una cuenta nueva o con perfilCompletado = 0 (false)
                        window.location.href = '../completar-perfil/completar-perfil.html';
                    }
                }, 1000);

            } else {
                mostrarAlerta(data.message || 'Correo o contraseña incorrectos.', 'error');
            }

        } catch (error) {
            mostrarAlerta('Error de conexión con el servidor. Verifica que "node server.js" esté ejecutándose.', 'error');
        }
    });

    // Función para mostrar alertas rojas o verdes
    function mostrarAlerta(mensaje, tipo) {
        if (!alertBox) return;

        alertBox.textContent = mensaje;
        alertBox.className = 'alert-message';

        if (tipo === 'success') {
            alertBox.classList.add('alert-success');
        } else if (tipo === 'error') {
            alertBox.classList.add('alert-error');
        }

        alertBox.style.display = 'block';
    }
});