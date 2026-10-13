/* =========================================================
   ARCHIVO: completar-perfil.js
   Lógica blindada para guardar datos y forzar la redirección
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const formPerfil = document.getElementById('form-perfil');
    const inputNombre = document.getElementById('nombre-completo');
    const inputTag = document.getElementById('usuario-tag');
    const alertBox = document.getElementById('alert-box');

    if (!formPerfil) return;

    formPerfil.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const nombre = inputNombre ? inputNombre.value.trim() : '';
        let tag = inputTag ? inputTag.value.trim() : '';
        
        // Si no hay email en localStorage, usar un valor por defecto para no bloquear la ejecución
        const emailUsuario = localStorage.getItem('emailUsuario') || 'usuario_temporal@correo.com';

        if (!nombre || !tag) {
            mostrarAlerta('Por favor completa tu nombre y usuario.', 'error');
            return;
        }

        if (!tag.startsWith('@')) {
            tag = `@${tag}`;
        }

        // Guardar localmente de inmediato para asegurar que el perfil tenga los datos
        localStorage.setItem('nombreUsuario', nombre);
        localStorage.setItem('tagUsuario', tag);
        localStorage.setItem('perfilCompletado', 'true');

        mostrarAlerta('¡Perfil configurado! Entrando a tu perfil...', 'success');

        // Intentar actualizar la base de datos en Node.js
        try {
            await fetch('http://localhost:3000/api/completar-perfil', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailUsuario,
                    nombre: nombre,
                    tag: tag
                })
            });
        } catch (err) {
            console.log('Servidor offline, pero continuando con la redirección local...');
        }

        // REDIRECCIÓN GARANTIZADA: Se ejecuta sí o sí tras 1 segundo
        setTimeout(() => {
            // Ajustar ruta según la ubicación de tu carpeta de perfil
            window.location.href = '../perfil/perfil.html';
        }, 1000);
    });

    function mostrarAlerta(mensaje, tipo) {
        if (!alertBox) return;
        alertBox.textContent = mensaje;
        alertBox.style.display = 'block';
        alertBox.style.padding = '10px';
        alertBox.style.marginTop = '10px';
        alertBox.style.borderRadius = '5px';
        alertBox.style.textAlign = 'center';

        if (tipo === 'success') {
            alertBox.style.backgroundColor = '#28a745';
            alertBox.style.color = '#ffffff';
        } else {
            alertBox.style.backgroundColor = '#dc3545';
            alertBox.style.color = '#ffffff';
        }
    }
});