/* =========================================================
   ARCHIVO: completar-perfil.js
   Manejo de guardado de perfil y redirección a perfil.html
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const formPerfil = document.getElementById('form-perfil');
    const btnGuardar = document.getElementById('btn-guardar');
    const inputNombre = document.getElementById('nombre-completo');
    const inputTag = document.getElementById('usuario-tag');
    const alertBox = document.getElementById('alert-box');

    function procesarYRedirigir() {
        const nombre = inputNombre ? inputNombre.value.trim() : '';
        let tag = inputTag ? inputTag.value.trim() : '';
        const emailUsuario = localStorage.getItem('emailUsuario') || 'usuario@correo.com';

        if (!nombre || !tag) {
            mostrarAlerta('Por favor completa tu nombre y usuario.', 'error');
            return;
        }

        if (!tag.startsWith('@')) {
            tag = `@${tag}`;
        }

        // Guardar datos en la sesión local
        localStorage.setItem('nombreUsuario', nombre);
        localStorage.setItem('tagUsuario', tag);
        localStorage.setItem('perfilCompletado', 'true');

        mostrarAlerta('¡Perfil configurado! Redirigiendo...', 'success');

        // Petición al servidor
        fetch('http://localhost:3000/api/completar-perfil', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailUsuario, nombre: nombre, tag: tag })
        }).catch(() => console.log('Actualizando estado localmente...'));

        // Redirección a la carpeta /perfil/perfil.html
        setTimeout(() => {
            window.location.href = '../perfil/perfil.html';
        }, 1000);
    }

    if (formPerfil) {
        formPerfil.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            procesarYRedirigir();
        });
    }

    if (btnGuardar) {
        btnGuardar.addEventListener('click', (e) => {
            if (formPerfil && !formPerfil.checkValidity()) return;
            e.preventDefault();
            procesarYRedirigir();
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