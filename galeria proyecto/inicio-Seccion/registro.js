/* =========================================================
   ARCHIVO: registro.js
   Manejo de registro de usuario guardando directo en SQLite (Render)
   ========================================================= */

const API_URL = 'http://localhost:3000';



document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del formulario HTML
    const registerForm = document.getElementById('form-register');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const alertBox = document.getElementById('alert-box');

    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        // Evitar que el navegador recargue la página o envíe el formulario de forma nativa
        e.preventDefault();
        e.stopImmediatePropagation();

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        // 1. Validar que los campos no estén vacíos
        if (email === '' || password === '') {
            mostrarAlerta('Por favor, completa todos los campos para registrarte.', 'error');
            return;
        }

        try {
            // 2. Enviar datos al backend en Render
            const response = await fetch(`${API_URL}/api/registro`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // 3. Evaluar respuesta del servidor
            if (data.success) {
                mostrarAlerta('¡Cuenta creada con éxito! Redirigiendo...', 'success');

                // 4. Redirigir a la pantalla de iniciar sesión
                setTimeout(() => {
                    window.location.href = 'iniciar-sesion.html';
                }, 1200);
            } else {
                mostrarAlerta(data.message || 'Error al registrar la cuenta.', 'error');
            }

        } catch (error) {
            mostrarAlerta('No se pudo conectar con el servidor en la nube.', 'error');
        }
    });

    // Función auxiliar para mostrar alertas en pantalla
    function mostrarAlerta(mensaje, tipo) {
        if (!alertBox) return;

        alertBox.textContent = mensaje;
        alertBox.className = 'alert-message'; // Limpiar clases previas

        if (tipo === 'success') {
            alertBox.classList.add('alert-success');
        } else if (tipo === 'error') {
            alertBox.classList.add('alert-error');
        }

        alertBox.style.display = 'block';
    }
});