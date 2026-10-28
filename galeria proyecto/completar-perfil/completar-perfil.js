/* =========================================================
   ARCHIVO: completar-perfil.js
   Manejo de guardado de perfil y redirección a perfil.html (Render)
   ========================================================= */

// Funciona tanto al abrir archivos locales como desde el servidor Express.
const API_URL = window.location.protocol === 'file:'
    ? 'http://localhost:3000'
    : window.location.origin;

document.addEventListener('DOMContentLoaded', () => {
    const formPerfil = document.getElementById('form-perfil');
    const btnGuardar = document.getElementById('btn-guardar');
    const inputNombre = document.getElementById('nombre-completo');
    const inputTag = document.getElementById('usuario-tag');
    const alertBox = document.getElementById('alert-box');

    async function procesarYRedirigir() {
        const nombre = inputNombre ? inputNombre.value.trim() : '';
        let tag = inputTag ? inputTag.value.trim() : '';
        const emailUsuario = localStorage.getItem('emailUsuario') || '';

        if (!emailUsuario) {
            mostrarAlerta('Tu sesión expiró. Inicia sesión nuevamente.', 'error');
            return;
        }
        if (!nombre || !tag) {
            mostrarAlerta('Por favor completa tu nombre y usuario.', 'error');
            return;
        }
        if (!tag.startsWith('@')) tag = `@${tag}`;

        try {
            const response = await fetch(`${API_URL}/api/completar-perfil`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailUsuario, nombre, tag })
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || 'No se pudo guardar el perfil.');
            localStorage.setItem('nombreUsuario', nombre);
            localStorage.setItem('tagUsuario', tag);
            localStorage.setItem('perfilCompletado', 'true');
            mostrarAlerta('¡Perfil guardado! Redirigiendo...', 'success');
            setTimeout(() => { window.location.href = '../perfil/perfil.html'; }, 700);
        } catch (error) {
            mostrarAlerta(error.message || 'No se pudo conectar con el servidor.', 'error');
        }
    }

    if (formPerfil) {
        formPerfil.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            await procesarYRedirigir();
        });
    }

    if (btnGuardar) {
        btnGuardar.addEventListener('click', async (e) => {
            if (formPerfil && !formPerfil.checkValidity()) return;
            e.preventDefault();
            await procesarYRedirigir();
        });
    }

    function mostrarAlerta(mensaje, tipo) {
        if (!alertBox) return;
        alertBox.textContent = mensaje;
        alertBox.style.display = 'block';

        if (tipo === 'success') {
            alertBox.style.backgroundColor = '#28a745';
            alertBox.style.color = '#ffffff';
        } else {
            alertBox.style.backgroundColor = '#dc3545';
            alertBox.style.color = '#ffffff';
        }
    }
});