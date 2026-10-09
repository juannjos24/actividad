# ⚖️ ¿Qué pesa más?

Juego de tarjetas para ordenar valores de **mayor** a **menor peso** en la vida.
100 % estático (HTML + CSS + JS), sin base de datos ni servidor. Pensado para GitHub Pages.

## Cómo funciona

- Al abrir la página aparecen las 14 tarjetas **mezcladas al azar**.
- Se ordenan arrastrando el asa `⋮⋮` (ratón o táctil) o con las flechas ▲ ▼.
- El botón **Mezclar** las vuelve a barajar.
- **Guardar** conserva el orden en `localStorage` del navegador. Al volver a abrir la página se
  restaura ese orden; debajo del botón se indica si está guardado o hay cambios sin guardar.
  Si no hay nada guardado, las tarjetas aparecen mezcladas.

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
