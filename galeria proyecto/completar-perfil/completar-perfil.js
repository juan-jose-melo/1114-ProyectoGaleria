/* =========================================================
   ARCHIVO: completar-perfil.js
   Guarda los datos de perfil y la marca 'perfilCompletado'
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener referencias a los elementos del DOM
    const formPerfil = document.getElementById('form-perfil');
    const inputNombre = document.getElementById('nombre-completo');
    const inputTag = document.getElementById('usuario-tag');
    const alertBox = document.getElementById('alert-box');

    // 2. Función auxiliar para mostrar mensajes de alerta
    function mostrarAlerta(mensaje, tipo = 'error') {
        if (!alertBox) return;

        alertBox.textContent = mensaje;
        alertBox.className = 'alert-message'; // Limpiar clases previas

        if (tipo === 'success' || tipo === 'exito') {
            alertBox.classList.add('alert-success');
        } else if (tipo === 'error') {
            alertBox.classList.add('alert-error');
        }

        alertBox.style.display = 'block';
    }

    // 3. Manejo del envío del formulario
    if (formPerfil) {
        formPerfil.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita recargar la página

            const nombre = inputNombre ? inputNombre.value.trim() : '';
            let tag = inputTag ? inputTag.value.trim() : '';

            // Validaciones básicas de campos vacíos
            if (!nombre) {
                mostrarAlerta('Por favor ingresa tu nombre completo.', 'error');
                if (inputNombre) inputNombre.focus();
                return;
            }

            if (!tag) {
                mostrarAlerta('Por favor ingresa un nombre de usuario.', 'error');
                if (inputTag) inputTag.focus();
                return;
            }

            // Asegurar que el tag comience con @
            if (!tag.startsWith('@')) {
                tag = `@${tag}`;
            }

            // Guardar datos en localStorage
            localStorage.setItem('nombreUsuario', nombre);
            localStorage.setItem('tagUsuario', tag);

            // 🔑 MARCA CLAVE: Guarda que el usuario ya completó este paso
            localStorage.setItem('perfilCompletado', 'true');

            // Notificación de éxito
            mostrarAlerta('¡Perfil configurado con éxito! Redirigiendo a tu perfil...', 'success');

            // Redirigir al perfil principal después de 1.2 segundos
            setTimeout(() => {
                window.location.href = '../perfil/perfil.html';
            }, 1200);
        });
    }
});