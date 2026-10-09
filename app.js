/* ===========================================================
   ¿Qué pesa más?  —  ordenar tarjetas de mayor a menor peso.
   Las tarjetas se cargan siempre mezcladas.
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
const $ = sel => document.querySelector(sel);
const lista = $('#lista-tarjetas');

/* ---------------- Tarjetas ---------------- */
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

$('#btn-mezclar').addEventListener('click', () => {
  renderTarjetas(barajar(VALORES.map(v => v.id)));
});

/* ---------------- Botones ▲ ▼ ---------------- */
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

/* ---------------- Arrastrar con el asa (ratón y táctil) ---------------- */
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

/* ---------------- Inicio: siempre mezcladas ---------------- */
renderTarjetas(barajar(VALORES.map(v => v.id)));
