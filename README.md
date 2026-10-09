# ⚖️ ¿Qué pesa más?

Juego de tarjetas para ordenar valores de **mayor** a **menor peso** en la vida.
100 % estático (HTML + CSS + JS), sin base de datos ni servidor. Pensado para GitHub Pages.

## Cómo funciona

- **Jugar** (`#jugar`): aparecen 14 tarjetas mezcladas. Se ordenan arrastrando el asa `⋮⋮`
  (ratón o táctil) o con las flechas ▲ ▼. Al pulsar **Enviar mi orden** la respuesta se guarda.
- **Resultados** (`#resultados`, vista principal): ranking global con puntuación tipo Borda
  (14 puntos al 1º lugar, 1 al último), posición media, veces en 1º lugar y el listado de
  respuestas individuales.

## Dónde se guardan los datos

En `localStorage` del navegador. Eso significa que **cada dispositivo ve solo sus propias
respuestas**. Para juntar respuestas de varias personas sin backend hay dos caminos:

1. **Enlace compartido**: al enviar, el juego genera un enlace con la respuesta codificada
   (`#r=...`). Quien recoge resultados abre ese enlace en su dispositivo y la respuesta se añade
   automáticamente (sin duplicados).
2. **Exportar / Importar JSON**: desde Resultados se descargan todas las respuestas y se pueden
   importar en otro navegador.

También funciona perfecto si todos juegan en el **mismo dispositivo** (por ejemplo una tablet
que se va pasando): ahí sí se acumulan directamente.

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
cambiar emojis y nombres; la puntuación se ajusta sola al número de tarjetas.
