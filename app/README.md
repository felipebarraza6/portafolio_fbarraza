# Felipe Barraza - Portfolio

Portfolio profesional con Arquitectura de Enjambre como metodología principal.

## 🚀 Desplegar en GitHub Pages

### Paso 1: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombra el repositorio: `portfolio`
3. Hazlo público
4. No inicialices con README (ya lo tenemos)

### Paso 2: Subir el código
```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/portfolio.git
git push -u origin main
```

### Paso 3: Configurar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Click en **Settings**
3. En el menú lateral, click en **Pages**
4. En "Source" selecciona **GitHub Actions**

### Paso 4: Esperar el deploy
- El workflow se ejecutará automáticamente
- Ve a la pestaña **Actions** para ver el progreso
- Cuando termine, tu sitio estará en: `https://TU_USUARIO.github.io/portfolio/`

## 🛠 Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React

## 📁 Estructura

```
src/
├── pages/
│   ├── Portfolio.tsx    # Página principal
│   └── GuiaKimi.tsx     # Guía de suscripción
├── components/
│   └── ...
└── ...
```

## 📝 Personalizar

Para cambiar información personal, edita las constantes en `src/pages/Portfolio.tsx`:
- `contactInfo` - Datos de contacto
- `skills` - Habilidades técnicas
- `experience` - Experiencia laboral
- `products` - Productos disponibles
- `services` - Servicios ofrecidos

## 📄 Licencia

MIT - Libre para usar y modificar.
