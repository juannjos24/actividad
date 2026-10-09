/* ===========================================================
   ¿Qué pesa más?  —  juego de ordenar tarjetas sin backend.
   Todo se guarda en localStorage del navegador.
   =========================================================== */

const VALORES = [
  { id: 'redes',       emoji: '📱',   nombre: 'Redes sociales' },
  { id: 'dinero',      emoji: '💰',   nombre: 'Dinero' },
  { id: 'pareja',      emoji: '❤️',   nombre: 'Pareja' },
  { id: 'videojuegos', emoji: '🎮',   nombre: 'Videojuegos' },
  { id: 'amigos',      emoji: '👥',   nombre: 'Amigos' },
  { id: 'exito',       emoji: '🏆',   nombre: 'Éxito' },
  { id: 'apariencia',  emoji: '💄',   nombre: 'Apariencia' },
  { id: 'fiestas',     emoji: '🍺',   nombre: 'Fiestas' },
  { id: 'estudios',    emoji: '🎓',   nombre: 'Estudios' },
  { id: 'trabajo',     emoji: '💼',   nombre: 'Trabajo' },
  { id: 'popularidad', emoji: '🔥',   nombre: 'Popularidad' },
  { id: 'aceptacion',  emoji: '❤️‍🩹', nombre: 'Aceptación' },
  { id: 'jesus',       emoji: '✝️',   nombre: 'Jesús' },
  { id: 'diversion',   emoji: '😎',   nombre: 'Diversión' },
];

const POR_ID = Object.fromEntries(VALORES.map(v => [v.id, v]));
const STORAGE_KEY = 'que-pesa-mas:respuestas';
const N = VALORES.length;

const $ = sel => document.querySelector(sel);

/* ---------------- Almacenamiento ---------------- */
function cargarRespuestas() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(data) ? data.filter(esRespuestaValida) : [];
  } catch { return []; }
}

function guardarRespuestas(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function esRespuestaValida(r) {
  return r && typeof r.id === 'string' && Array.isArray(r.orden)
    && r.orden.length === N && r.orden.every(id => POR_ID[id])
    && new Set(r.orden).size === N;
}

function agregarRespuesta(r) {
  const lista = cargarRespuestas();
  if (lista.some(x => x.id === r.id)) return false;
  lista.push(r);
  guardarRespuestas(lista);
  return true;
}

function nuevoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------------- Codificar / decodificar enlace ---------------- */
function codificar(r) {
  const json = JSON.stringify(r);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodificar(str) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(b64)));
    const r = JSON.parse(json);
    return esRespuestaValida(r) ? r : null;
  } catch { return null; }
}

/* ---------------- Vista: Jugar ---------------- */
const lista = $('#lista-tarjetas');

function barajar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderTarjetas(orden) {
  lista.innerHTML = '';
  orden.forEach(id => {
    const v = POR_ID[id];
    const li = document.createElement('li');
    li.className = 'tarjeta';
    li.dataset.id = id;
    li.innerHTML = `
      <span class="posicion"></span>
      <span class="emoji">${v.emoji}</span>
      <span class="nombre">${v.nombre}</span>
      <span class="controles">
        <button type="button" data-mover="-1" aria-label="Subir ${v.nombre}">▲</button>
        <button type="button" data-mover="1" aria-label="Bajar ${v.nombre}">▼</button>
        <span class="asa" aria-hidden="true">⋮⋮</span>
      </span>`;
    lista.appendChild(li);
  });
  actualizarPosiciones();
}

function actualizarPosiciones() {
  [...lista.children].forEach((li, i) => {
    li.querySelector('.posicion').textContent = i + 1;
    li.querySelector('[data-mover="-1"]').disabled = i === 0;
    li.querySelector('[data-mover="1"]').disabled = i === lista.children.length - 1;
  });
}

function ordenActual() {
  return [...lista.children].map(li => li.dataset.id);
}

// Botones ▲ ▼
lista.addEventListener('click', e => {
  const btn = e.target.closest('[data-mover]');
  if (!btn) return;
  const li = btn.closest('.tarjeta');
  const dir = Number(btn.dataset.mover);
  if (dir < 0 && li.previousElementSibling) lista.insertBefore(li, li.previousElementSibling);
  if (dir > 0 && li.nextElementSibling) lista.insertBefore(li.nextElementSibling, li);
  actualizarPosiciones();
  li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});

// Arrastrar con el asa (funciona con ratón y táctil gracias a Pointer Events)
let arrastre = null;

lista.addEventListener('pointerdown', e => {
  const asa = e.target.closest('.asa');
  if (!asa) return;
  const li = asa.closest('.tarjeta');
  e.preventDefault();
  arrastre = { li, pointerId: e.pointerId };
  li.classList.add('arrastrando');
  asa.setPointerCapture(e.pointerId);
});

lista.addEventListener('pointermove', e => {
  if (!arrastre || e.pointerId !== arrastre.pointerId) return;
  const { li } = arrastre;
  const y = e.clientY;
  const hermanos = [...lista.children].filter(c => c !== li);
  let destino = null;
  for (const c of hermanos) {
    const r = c.getBoundingClientRect();
    if (y < r.top + r.height / 2) { destino = c; break; }
  }
  if (destino) {
    if (li.nextElementSibling !== destino) lista.insertBefore(li, destino);
  } else if (lista.lastElementChild !== li) {
    lista.appendChild(li);
  }
  actualizarPosiciones();

  // Auto-scroll al acercarse al borde de la ventana
  const margen = 60;
  if (y < margen) window.scrollBy(0, -8);
  else if (y > window.innerHeight - margen) window.scrollBy(0, 8);
});

function terminarArrastre(e) {
  if (!arrastre || (e && e.pointerId !== arrastre.pointerId)) return;
  arrastre.li.classList.remove('arrastrando');
  arrastre = null;
}
lista.addEventListener('pointerup', terminarArrastre);
lista.addEventListener('pointercancel', terminarArrastre);

$('#btn-mezclar').addEventListener('click', () => renderTarjetas(barajar(VALORES.map(v => v.id))));

$('#btn-enviar').addEventListener('click', () => {
  const nombre = $('#nombre').value.trim() || 'Anónimo';
  const r = { id: nuevoId(), nombre, fecha: new Date().toISOString(), orden: ordenActual() };
  agregarRespuesta(r);

  const url = location.origin + location.pathname + '#r=' + codificar(r);
  $('#enlace-compartir').value = url;
  $('#modal-compartir').hidden = false;
});

$('#btn-copiar').addEventListener('click', async () => {
  const ta = $('#enlace-compartir');
  try {
    await navigator.clipboard.writeText(ta.value);
    toast('Enlace copiado ✅');
  } catch {
    ta.select();
    document.execCommand('copy');
    toast('Enlace copiado ✅');
  }
});

$('#btn-otra').addEventListener('click', () => {
  $('#modal-compartir').hidden = true;
  $('#nombre').value = '';
  renderTarjetas(barajar(VALORES.map(v => v.id)));
  window.scrollTo(0, 0);
});

/* ---------------- Vista: Resultados ---------------- */
function calcularRanking(respuestas) {
  const acc = Object.fromEntries(VALORES.map(v => [v.id, { puntos: 0, sumaPos: 0, primeros: 0 }]));
  respuestas.forEach(r => {
    r.orden.forEach((id, i) => {
      acc[id].puntos += N - i;        // 14 puntos al 1º, 1 punto al último
      acc[id].sumaPos += i + 1;
      if (i === 0) acc[id].primeros++;
    });
  });
  const total = respuestas.length;
  return VALORES.map(v => ({
    ...v,
    puntos: acc[v.id].puntos,
    promedio: total ? acc[v.id].sumaPos / total : 0,
    primeros: acc[v.id].primeros,
  })).sort((a, b) => b.puntos - a.puntos || a.promedio - b.promedio);
}

function renderResultados() {
  const respuestas = cargarRespuestas().sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  const total = respuestas.length;

  $('#resumen-resultados').textContent = total
    ? `${total} ${total === 1 ? 'persona ha' : 'personas han'} ordenado las tarjetas. Puntuación: 14 puntos al 1º lugar, 1 punto al último.`
    : 'Todavía no hay respuestas. ¡Sé el primero en jugar!';

  const ranking = $('#ranking-global');
  if (!total) {
    ranking.innerHTML = '<div class="vacio">Sin datos todavía.</div>';
  } else {
    const max = N * total;
    ranking.innerHTML = calcularRanking(respuestas).map((v, i) => `
      <div class="fila">
        <span class="pos">${i + 1}</span>
        <span class="emoji">${v.emoji}</span>
        <div class="detalle">
          <div class="cabecera">
            <strong>${v.nombre}</strong>
            <span>${v.puntos} pts · pos. media ${v.promedio.toFixed(1)}${v.primeros ? ` · 🥇×${v.primeros}` : ''}</span>
          </div>
          <div class="barra"><i style="width:${(v.puntos / max * 100).toFixed(1)}%"></i></div>
        </div>
      </div>`).join('');
  }

  const cont = $('#lista-respuestas');
  cont.innerHTML = total ? respuestas.map(r => `
    <details class="respuesta" data-id="${r.id}">
      <summary>
        <span>${escapar(r.nombre || 'Anónimo')}</span>
        <small>${formatearFecha(r.fecha)}</small>
      </summary>
      <ol>${r.orden.map(id => `<li>${POR_ID[id].emoji} ${POR_ID[id].nombre}</li>`).join('')}</ol>
      <div class="pie"><button type="button" data-borrar="${r.id}">Eliminar</button></div>
    </details>`).join('')
    : '<div class="vacio">Nadie ha jugado todavía.</div>';
}

$('#lista-respuestas').addEventListener('click', e => {
  const btn = e.target.closest('[data-borrar]');
  if (!btn) return;
  if (!confirm('¿Eliminar esta respuesta?')) return;
  guardarRespuestas(cargarRespuestas().filter(r => r.id !== btn.dataset.borrar));
  renderResultados();
});

$('#btn-borrar-todo').addEventListener('click', () => {
  if (!cargarRespuestas().length) return;
  if (!confirm('¿Borrar TODAS las respuestas guardadas en este navegador?')) return;
  guardarRespuestas([]);
  renderResultados();
  toast('Respuestas borradas');
});

$('#btn-exportar').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(cargarRespuestas(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `que-pesa-mas-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});

$('#input-importar').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const lista = Array.isArray(data) ? data : [data];
    let nuevas = 0;
    lista.filter(esRespuestaValida).forEach(r => { if (agregarRespuesta(r)) nuevas++; });
    renderResultados();
    toast(`${nuevas} respuesta(s) importada(s)`);
  } catch {
    toast('Archivo no válido');
  }
  e.target.value = '';
});

/* ---------------- Utilidades ---------------- */
function escapar(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatearFecha(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' });
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

/* ---------------- Enrutado por hash ---------------- */
function mostrarVista(nombre) {
  $('#vista-jugar').hidden = nombre !== 'jugar';
  $('#vista-resultados').hidden = nombre !== 'resultados';
  if (nombre === 'resultados') renderResultados();
  window.scrollTo(0, 0);
}

function enrutar() {
  const hash = location.hash.slice(1);

  // Enlace compartido: #r=<datos>
  if (hash.startsWith('r=')) {
    const r = decodificar(hash.slice(2));
    if (r) {
      const nueva = agregarRespuesta(r);
      toast(nueva ? `Respuesta de ${r.nombre || 'Anónimo'} añadida ✅` : 'Esa respuesta ya estaba guardada');
    } else {
      toast('El enlace no es válido');
    }
    history.replaceState(null, '', location.pathname + '#resultados');
    mostrarVista('resultados');
    return;
  }

  // Por defecto se entra directo a ordenar. #resultados es una vista "oculta" para quien recoge respuestas.
  mostrarVista(hash === 'resultados' ? 'resultados' : 'jugar');
}

window.addEventListener('hashchange', enrutar);

renderTarjetas(barajar(VALORES.map(v => v.id)));
enrutar();
