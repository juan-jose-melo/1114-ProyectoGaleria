/* =========================================================
   ARCHIVO: perfil/perfil.js
   Manejo de vista, subida de archivos locales/URL y modal
   ========================================================= */

// Funciona tanto al abrir archivos locales como desde el servidor Express.
const API_URL = window.location.protocol === 'file:'
    ? 'http://localhost:3000'
    : window.location.origin;

const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM del perfil
    const elNombre = document.getElementById('perfil-nombre');
    const elTag = document.getElementById('perfil-tag');
    const elEmail = document.getElementById('perfil-email');
    const elAvatar = document.getElementById('avatar-letra');
    const btnLogout = document.getElementById('btn-logout');

    // Elementos del modal
    const btnSubir = document.getElementById('btn-subir');
    const modalSubir = document.getElementById('modal-subir');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formSubir = document.getElementById('form-subir-dibujo');
    const gridMisDibujos = document.getElementById('grid-mis-dibujos');
    const inputFile = document.getElementById('file-dibujo');
    const fileNameDisplay = document.getElementById('file-name-display');

    // 1. Obtener información guardada del usuario
    const emailUsuario = localStorage.getItem('emailUsuario');
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';
    const tagUsuario = localStorage.getItem('tagUsuario') || '@usuario';

    if (!emailUsuario) {
        window.location.href = '../inicio-Seccion/iniciar-sesion.html';
        return;
    }

    if (elNombre) elNombre.textContent = nombreUsuario;
    if (elTag) elTag.textContent = tagUsuario;
    if (elEmail) elEmail.textContent = emailUsuario;
    if (elAvatar) elAvatar.textContent = nombreUsuario.charAt(0).toUpperCase();

    // 2. Cerrar Sesión
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../inicio-Seccion/iniciar-sesion.html';
        });
    }

    // 3. Control del Modal y mostrador de nombre de archivo
    if (btnSubir) btnSubir.addEventListener('click', () => modalSubir.style.display = 'flex');
    if (btnCancelar) btnCancelar.addEventListener('click', () => {
        modalSubir.style.display = 'none';
        resetFormulario();
    });

    if (inputFile) {
        inputFile.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                fileNameDisplay.textContent = e.target.files[0].name;
                fileNameDisplay.style.color = '#5248e5';
            } else {
                fileNameDisplay.textContent = 'Ningún archivo seleccionado';
                fileNameDisplay.style.color = '#777';
            }
        });
    }

    function resetFormulario() {
        if (formSubir) formSubir.reset();
        if (fileNameDisplay) {
            fileNameDisplay.textContent = 'Ningún archivo seleccionado';
            fileNameDisplay.style.color = '#777';
        }
    }

    // Función auxiliar para convertir archivo local a Base64
    function leerArchivoComoDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // 4. Publicar Dibujo desde el Perfil
    if (formSubir) {
        formSubir.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.getElementById('titulo-dibujo').value.trim();
            const inputUrl = document.getElementById('url-dibujo').value.trim();
            const descripcion = document.getElementById('descripcion-dibujo').value.trim();

            let imagenUrl = '';

            // Si se seleccionó un archivo local, procesarlo en prioridad
            if (inputFile.files && inputFile.files[0]) {
                try {
                    imagenUrl = await leerArchivoComoDataURL(inputFile.files[0]);
                } catch (err) {
                    alert('Error al procesar la imagen seleccionada.');
                    return;
                }
            } else if (inputUrl !== '') {
                imagenUrl = inputUrl;
            } else {
                alert('Por favor selecciona un archivo desde tu equipo o ingresa una URL.');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/dibujos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailUsuario, nombreUsuario, titulo, descripcion, imagenUrl })
                });

                const data = await response.json();
                if (data.success) {
                    modalSubir.style.display = 'none';
                    resetFormulario();
                    cargarMisDibujos();
                } else {
                    alert('Error al publicar: ' + data.message);
                }
            } catch (err) {
                alert('Error de conexión con el servidor en Render.');
            }
        });
    }

    // 5. Cargar únicamente los dibujos de la cuenta actual
    async function cargarMisDibujos() {
        if (!gridMisDibujos) return;
        try {
            const response = await fetch(`${API_URL}/api/dibujos?email=${encodeURIComponent(emailUsuario)}`);
            const data = await response.json();

            if (data.success) {
                const misDibujos = data.dibujos.filter(d => d.emailUsuario === emailUsuario);

                if (misDibujos.length > 0) {
                    gridMisDibujos.style.display = 'grid';
                    gridMisDibujos.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
                    gridMisDibujos.style.gap = '15px';

                    gridMisDibujos.innerHTML = misDibujos.map(d => `
                        <div class="card-dibujo" style="background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                            <img src="${d.imagenUrl}" alt="${d.titulo}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://via.placeholder.com/300?text=Error+de+Imagen'">
                            <h4 style="margin: 10px 0 0 0; color: #333;">${escapeHTML(d.titulo)}</h4>
                            <p style="color:#666;white-space:pre-wrap">${escapeHTML(d.descripcion || '')}</p>
                            <p style="color:#777">♡ ${Number(d.likes)||0} · ${Number(d.comentariosCount)||0} comentarios</p>
                            <button type="button" class="editar-mi-dibujo" data-id="${d.id}" data-titulo="${escapeHTML(d.titulo)}" data-descripcion="${escapeHTML(d.descripcion || '')}">Editar título y descripción</button>
                        </div>
                    `).join('');
                } else {
                    gridMisDibujos.style.display = 'block';
                    gridMisDibujos.innerHTML = `
                        <p class="empty-msg">🎨 Aún no has publicado ningún dibujo.<br>
                        <small>¡Haz clic en "+ Subir Dibujo" para compartir tu primera creación!</small></p>
                    `;
                }
            }
        } catch (err) {
            gridMisDibujos.style.display = 'block';
            gridMisDibujos.innerHTML = '<p style="color: red; text-align: center;">Error al cargar tus dibujos.</p>';
        }
    }

    if (gridMisDibujos) gridMisDibujos.addEventListener('click', async (e) => {
        const btn = e.target.closest('.editar-mi-dibujo'); if (!btn) return;
        const titulo = prompt('Editar título:', btn.dataset.titulo); if (titulo === null) return;
        const descripcion = prompt('Editar descripción:', btn.dataset.descripcion); if (descripcion === null) return;
        try {
            const r = await fetch(`${API_URL}/api/dibujos/${btn.dataset.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({emailUsuario, titulo, descripcion}) });
            const data = await r.json(); if (!r.ok || !data.success) throw new Error(data.message || 'No se pudo editar.');
            cargarMisDibujos();
        } catch (err) { alert(err.message || 'Error al editar la publicación.'); }
    });
    cargarMisDibujos();
});