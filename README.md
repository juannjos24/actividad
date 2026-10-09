# ⚖️ ¿Qué pesa más?

Juego de tarjetas para ordenar valores de **mayor** a **menor peso** en la vida.
100 % estático (HTML + CSS + JS), sin base de datos ni servidor. Pensado para GitHub Pages.

## Cómo funciona

- Aparecen 14 tarjetas mezcladas. Se ordenan arrastrando el asa `⋮⋮` (ratón o táctil)
  o con las flechas ▲ ▼. El botón **Mezclar** las baraja de nuevo.
- Al pulsar **Enviar mi orden** las tarjetas quedan **congeladas** (no se pueden mover)
  y el orden se guarda en `localStorage`, así que sobrevive a recargar la página.
- **Volver a ordenar** (pide confirmación) desbloquea las tarjetas.

## Publicar en GitHub Pages

```bash
git init
git add .
git commit -m "Juego ¿Qué pesa más?"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

Luego en GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
La página quedará en `https://TU_USUARIO.github.io/TU_REPO/`.

## Personalizar

Las tarjetas están en el array `VALORES` al inicio de `app.js`. Se pueden añadir, quitar o
cambiar emojis y nombres.
