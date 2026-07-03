# Invitación XV años - Alejandra García Peña

Proyecto estático listo para publicar en Vercel o GitHub Pages.

## Estructura

```text
index.html
assets/
  css/style.css
  js/countdown.js
  img/
.nojekyll
vercel.json
```

## Publicar en GitHub Pages

1. Crea un repositorio público, por ejemplo `alex-xv`.
2. Sube todos los archivos de esta carpeta a la raíz del repositorio.
3. En GitHub: Settings → Pages.
4. En Source selecciona Deploy from a branch.
5. Branch: `main` / folder: `/root`.
6. Guarda y espera la URL pública.

## Publicar en Vercel

1. Crea un repositorio en GitHub con estos archivos.
2. En Vercel, importa el repositorio como nuevo proyecto.
3. No necesitas framework ni comando de build.
4. Public directory: raíz del proyecto.
5. Deploy.

## Nota técnica

El contador está en `assets/js/countdown.js` y usa `Date.UTC(...)` para evitar problemas de interpretación de fecha en Safari, iPhone, Android y WebViews.
