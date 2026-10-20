/* =========================================================
   ARCHIVO: galeria.js
   Manejo de vista principal, modal y conexión a SQLite
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const userDisplay = document.getElementById('user-display');
    const btnLogout = document.getElementById('btn-logout');
    const btnSubir = document.getElementById('btn-subir');
    const modalSubir = document.getElementById('modal-subir');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formSubir = document.getElementById('form-subir-dibujo');
    const gridDibujos = document.getElementById('grid-dibujos');

    // 1. Validar Sesión
    const emailUsuario = localStorage.getItem('emailUsuario');
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Artista';
    const tagUsuario = localStorage.getItem('tagUsuario') || '';

    if (!emailUsuario) {
        window.location.href = 'inicio-Seccion/iniciar-sesion.html';
        return;
    }

    if (userDisplay) {
        userDisplay.textContent = `${nombreUsuario} (${tagUsuario})`;
    }

    // 2. Cerrar Sesión
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'inicio-Seccion/iniciar-sesion.html';
        });
    }

    // 3. Abrir / Cerrar Modal
    if (btnSubir) btnSubir.addEventListener('click', () => modalSubir.style.display = 'flex');
    if (btnCancelar) btnCancelar.addEventListener('click', () => modalSubir.style.display = 'none');

    // 4. Publicar Dibujo
    if (formSubir) {
        formSubir.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.getElementById('titulo-dibujo').value.trim();
            const imagenUrl = document.getElementById('url-dibujo').value.trim();

            try {
                const response = await fetch('http://localhost:3000/api/dibujos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emailUsuario, nombreUsuario, titulo, imagenUrl })
                });

                const data = await response.json();
                if (data.success) {
                    modalSubir.style.display = 'none';
                    formSubir.reset();
                    cargarDibujos();
                }
            } catch (err) {
                alert('Error al publicar el dibujo.');
            }
        });
    }

    // 5. Cargar Dibujos desde SQLite
    async function cargarDibujos() {
        if (!gridDibujos) return;
        try {
            const response = await fetch('http://localhost:3000/api/dibujos');
            const data = await response.json();

            if (data.success && data.dibujos.length > 0) {
                gridDibujos.innerHTML = data.dibujos.map(d => `
                    <div class="card-dibujo" style="background: #2b2b2b; border-radius: 8px; overflow: hidden; padding: 10px; color: white;">
                        <img src="${d.imagenUrl}" alt="${d.titulo}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px;" onerror="this.src='https://via.placeholder.com/300?text=Error+de+Imagen'">
                        <h3 style="margin: 10px 0 5px 0;">${d.titulo}</h3>
                        <p style="font-size: 0.85rem; color: #aaa;">Por: ${d.nombreUsuario}</p>
                    </div>
                `).join('');
            } else {
                gridDibujos.innerHTML = '<p style="color: white; grid-column: 1/-1; text-align: center;">Aún no hay dibujos publicados. ¡Sé el primero en subir uno!</p>';
            }
        } catch (err) {
            gridDibujos.innerHTML = '<p style="color: white; grid-column: 1/-1; text-align: center;">Error al conectar con el servidor.</p>';
        }
    }

    cargarDibujos();
});