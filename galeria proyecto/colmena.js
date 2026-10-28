const API_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : window.location.origin;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const readFile = file => new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file); });
const LOGIN_URL = 'inicio-Seccion/iniciar-sesion.html';

document.addEventListener('DOMContentLoaded', () => {
  const emailUsuario = (localStorage.getItem('emailUsuario') || '').trim().toLowerCase();
  const loggedIn = Boolean(emailUsuario);
  const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Artista';
  const tagUsuario = localStorage.getItem('tagUsuario') || '';
  const grid = document.getElementById('grid-dibujos');
  const modal = document.getElementById('modal-subir');
  const form = document.getElementById('form-subir-dibujo');
  const editModal = document.getElementById('modal-editar');
  const editForm = document.getElementById('form-editar-dibujo');
  let editingId = null;

  const userDisplay = document.getElementById('user-display');
  const logout = document.getElementById('btn-logout');
  const uploadButton = document.getElementById('btn-subir');
  const loginLink = document.getElementById('btn-login');
  const registerLink = document.getElementById('btn-register');
  const profileLink = document.getElementById('btn-mi-perfil');
  if (userDisplay) userDisplay.textContent = loggedIn ? `${nombreUsuario}${tagUsuario ? ` (${tagUsuario})` : ''}` : '';
  if (userDisplay && !loggedIn) userDisplay.style.display = 'none';
  if (logout) logout.style.display = loggedIn ? '' : 'none';
  if (loginLink) loginLink.style.display = loggedIn ? 'none' : '';
  if (registerLink) registerLink.style.display = loggedIn ? 'none' : '';
  if (profileLink) profileLink.style.display = loggedIn ? '' : 'none';
  if (uploadButton) uploadButton.style.display = loggedIn ? '' : 'none';
  if (form && !loggedIn) form.style.display = 'none';

  if (loggedIn) {
    logout?.addEventListener('click', () => {
      ['emailUsuario','nombreUsuario','tagUsuario'].forEach(k => localStorage.removeItem(k));
      location.href = LOGIN_URL;
    });
    uploadButton?.addEventListener('click', () => modal.style.display = 'flex');
    document.getElementById('btn-cancelar')?.addEventListener('click', () => { modal.style.display = 'none'; form.reset(); });
  }

  const loginNotice = () => {
    if (confirm('Para dar me gusta, comentar o publicar necesitas iniciar sesión. ¿Quieres ir a iniciar sesión?')) {
      location.href = LOGIN_URL;
    }
  };
  const closeEdit = () => { editModal.style.display = 'none'; editForm.reset(); editingId = null; };
  document.getElementById('cerrar-editar')?.addEventListener('click', closeEdit);
  document.getElementById('cancelar-editar')?.addEventListener('click', closeEdit);
  editModal?.addEventListener('click', e => { if (e.target === editModal) closeEdit(); });

  editForm?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!loggedIn) return loginNotice();
    const titulo = document.getElementById('editar-titulo').value.trim();
    const descripcion = document.getElementById('editar-descripcion').value.trim();
    if (!titulo || !editingId) return;
    const submit = editForm.querySelector('[type=submit]'); submit.disabled = true; submit.textContent = 'Guardando...';
    try {
      const r = await fetch(`${API_URL}/api/dibujos/${editingId}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({emailUsuario,titulo,descripcion})});
      const d = await r.json(); if (!r.ok || !d.success) throw new Error(d.message || 'No se pudieron guardar los cambios.');
      closeEdit(); await cargarDibujos();
    } catch(err) { alert(err.message || 'No se pudo editar la publicación.'); }
    finally { submit.disabled = false; submit.textContent = 'Guardar cambios'; }
  });

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!loggedIn) return loginNotice();
    const titulo = document.getElementById('titulo-dibujo').value.trim();
    const descripcion = document.getElementById('descripcion-dibujo').value.trim();
    const urlInput = document.getElementById('url-dibujo').value.trim();
    const file = document.getElementById('file-dibujo').files[0];
    if (!titulo || (!urlInput && !file)) { alert('Escribe un título y selecciona una imagen o pega un enlace.'); return; }
    try {
      const imagenUrl = file ? await readFile(file) : urlInput;
      const response = await fetch(`${API_URL}/api/dibujos`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({emailUsuario,nombreUsuario,titulo,descripcion,imagenUrl})});
      const data = await response.json(); if (!response.ok || !data.success) throw new Error(data.message || 'No se pudo publicar.');
      modal.style.display = 'none'; form.reset(); await cargarDibujos();
    } catch(err) { alert(err.message || 'Error al publicar. Verifica que el servidor esté iniciado.'); }
  });

  async function cargarDibujos() {
    try {
      const response = await fetch(`${API_URL}/api/dibujos?orden=likes${loggedIn ? `&email=${encodeURIComponent(emailUsuario)}` : ''}`);
      const data = await response.json(); if (!response.ok || !data.success) throw new Error();
      if (!data.dibujos.length) { grid.innerHTML = '<p class="empty-msg">Aún no hay publicaciones. ¡Vuelve pronto para descubrir obras!</p>'; return; }
      grid.innerHTML = data.dibujos.map(d => `<article class="card-dibujo" style="background:#fff;border:1px solid #e7e3f5;border-radius:14px;overflow:hidden;padding:12px;color:#26233a;box-shadow:0 4px 14px #24124b12;">
        <img src="${escapeHTML(d.imagenUrl)}" alt="${escapeHTML(d.titulo)}" style="width:100%;height:260px;object-fit:contain;background:#f7f5fc;border-radius:8px" loading="lazy" onerror="this.alt='No se pudo cargar la imagen';this.style.opacity='.4'">
        <div style="padding:5px 2px"><h3 style="margin:8px 0">${escapeHTML(d.titulo)}</h3><p style="margin:4px 0;color:#6c6680">Por <strong>${escapeHTML(d.nombreUsuario)}</strong> · ${escapeHTML(d.fecha || '')}</p><p style="white-space:pre-wrap">${escapeHTML(d.descripcion || '')}</p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:12px 0"><button class="btn-primary like-btn" data-id="${d.id}" style="background:${d.likedByMe?'#df4260':'#6657ff'}">${d.likedByMe?'♥ Te gusta':'♡ Me gusta'} · ${Number(d.likes)||0}</button><button class="btn-logout comments-toggle" data-id="${d.id}">Comentarios (${Number(d.comentariosCount)||0})</button>${loggedIn && String(d.emailUsuario).toLowerCase()===emailUsuario?`<button class="edit-post" data-id="${d.id}" data-title="${escapeHTML(d.titulo)}" data-description="${escapeHTML(d.descripcion||'')}">Editar título y descripción</button>`:''}</div>
        <div class="comments-box" id="comments-${d.id}" style="display:none;border-top:1px solid #eee;padding-top:10px"><div class="comments-list" style="font-size:.92rem"></div>${loggedIn?`<form class="comment-form" data-id="${d.id}" style="display:flex;gap:6px;margin-top:8px"><input class="form-control" name="contenido" maxlength="1000" placeholder="Escribe un comentario..." required style="flex:1;min-width:0"><button class="btn-primary" type="submit">Enviar</button></form>`:`<p class="login-to-comment" style="margin-top:8px"><a href="${LOGIN_URL}">Inicia sesión</a> para comentar.</p>`}</div></div></article>`).join('');
    } catch { grid.innerHTML = '<p class="empty-msg">No se pudo conectar con el servidor. Comprueba que npm start esté ejecutándose.</p>'; }
  }

  grid.addEventListener('click', async e => {
    const like = e.target.closest('.like-btn');
    const toggle = e.target.closest('.comments-toggle');
    const edit = e.target.closest('.edit-post');
    const deleteComment = e.target.closest('.delete-comment');
    if (deleteComment) {
      if (!loggedIn) return loginNotice();
      if (!confirm('¿Quieres borrar este comentario?')) return;
      try { const r = await fetch(`${API_URL}/api/dibujos/${deleteComment.dataset.drawing}/comentarios/${deleteComment.dataset.comment}`, {method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({emailUsuario})}); const d = await r.json(); if (!r.ok || !d.success) throw new Error(d.message); await cargarComentarios(deleteComment.dataset.drawing); await cargarDibujos(); document.getElementById(`comments-${deleteComment.dataset.drawing}`).style.display='block'; } catch(err) { alert(err.message || 'No se pudo borrar el comentario.'); }
      return;
    }
    if (like) {
      if (!loggedIn) return loginNotice();
      like.disabled = true;
      try { const r = await fetch(`${API_URL}/api/dibujos/${like.dataset.id}/like`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({emailUsuario})}); const d = await r.json(); if (!r.ok || !d.success) throw new Error(d.message); await cargarDibujos(); }
      catch(err) { alert(err.message || 'No se pudo guardar el me gusta.'); like.disabled = false; }
    }
    if (toggle) { const box = document.getElementById(`comments-${toggle.dataset.id}`); const open = box.style.display === 'none'; box.style.display = open ? 'block' : 'none'; if (open) await cargarComentarios(toggle.dataset.id); }
    if (edit) {
      if (!loggedIn) return loginNotice();
      editingId = edit.dataset.id;
      document.getElementById('editar-titulo').value = edit.dataset.title || '';
      document.getElementById('editar-descripcion').value = edit.dataset.description || '';
      editModal.style.display = 'flex'; document.getElementById('editar-titulo').focus();
    }
  });
  grid.addEventListener('submit', async e => {
    const commentForm = e.target.closest('.comment-form'); if (!commentForm) return; e.preventDefault();
    if (!loggedIn) return loginNotice();
    const contenido = new FormData(commentForm).get('contenido');
    try { const r = await fetch(`${API_URL}/api/dibujos/${commentForm.dataset.id}/comentarios`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({emailUsuario,contenido,nombreUsuario})}); const d = await r.json(); if (!r.ok || !d.success) throw new Error(d.message); commentForm.reset(); await cargarComentarios(commentForm.dataset.id); await cargarDibujos(); document.getElementById(`comments-${commentForm.dataset.id}`).style.display='block'; }
    catch(err) { alert(err.message || 'No se pudo guardar el comentario.'); }
  });
  async function cargarComentarios(id) {
    const box = document.getElementById(`comments-${id}`); if (!box) return;
    const list = box.querySelector('.comments-list'); list.textContent = 'Cargando comentarios...';
    try { const r = await fetch(`${API_URL}/api/dibujos/${id}/comentarios`); const d = await r.json(); if (!d.success) throw new Error(); list.innerHTML = d.comentarios.length ? d.comentarios.map(c=>`<p style="margin:8px 0;display:flex;gap:8px;align-items:flex-start;justify-content:space-between"><span><strong>${escapeHTML(c.nombreUsuario)}</strong>: ${escapeHTML(c.contenido)} <small style="color:#888">${escapeHTML(c.fecha)}</small></span>${loggedIn && String(c.emailUsuario).toLowerCase()===emailUsuario?`<button type="button" class="delete-comment" data-drawing="${id}" data-comment="${c.id}" style="border:1px solid #eadff8;background:#fff;color:#a33;padding:5px 9px;border-radius:8px;cursor:pointer">Borrar</button>`:''}</p>`).join('') : '<p style="color:#777">Sé el primero en comentar.</p>'; }
    catch { list.textContent = 'No se pudieron cargar los comentarios.'; }
  }
  cargarDibujos();
});
