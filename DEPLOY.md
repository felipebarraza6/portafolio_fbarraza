# 🚀 CÓMO SUBIR TU PORTAFOLIO A UN SERVIDOR

## 📁 Archivos que necesitas

Tu portafolio está listo en la carpeta `app/dist/`. Estos son los archivos que debes subir:

```
app/dist/
├── index.html          ← Página principal
├── assets/             ← CSS, JS, imágenes
│   ├── index-DEENEHhY.css
│   └── index-DzYuhqLW.js
```

---

## 🌐 OPCIÓN 1: Netlify (GRATIS - Recomendado)

### Paso 1: Crea cuenta
1. Ve a https://www.netlify.com
2. Regístrate con GitHub o email

### Paso 2: Sube tu sitio
1. En el dashboard, haz clic en **"Add new site"** → **"Deploy manually"**
2. Arrastra la carpeta `app/dist` o haz clic para seleccionarla
3. ¡Listo! Netlify te dará una URL como `https://felipebarraza.netlify.app`

### Paso 3: Configura dominio personalizado (opcional)
1. Ve a **Domain settings**
2. Haz clic en **"Add custom domain"**
3. Ingresa tu dominio (ej: felipebarraza.cl)
4. Sigue las instrucciones de DNS

---

## 🌐 OPCIÓN 2: Vercel (GRATIS)

### Paso 1: Instala Vercel CLI
```bash
npm i -g vercel
```

### Paso 2: Despliega
```bash
cd app/dist
vercel --prod
```

### Paso 3: Sigue las instrucciones
- Inicia sesión con tu cuenta
- Confirma el despliegue
- ¡Listo!

---

## 🌐 OPCIÓN 3: GitHub Pages (GRATIS)

### Paso 1: Crea repositorio
1. Ve a https://github.com/new
2. Nombre: `felipebarraza.github.io`
3. Hazlo público

### Paso 2: Sube archivos
```bash
cd app/dist
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/felipebarraza6/felipebarraza.github.io.git
git push -u origin main
```

### Paso 3: Activa GitHub Pages
1. Ve a Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / root
4. Guarda y espera 2-3 minutos

Tu sitio estará en: `https://felipebarraza6.github.io`

---

## 🌐 OPCIÓN 4: Servidor VPS (DigitalOcean, AWS, etc.)

### Paso 1: Conéctate al servidor
```bash
ssh root@tu-servidor.com
```

### Paso 2: Instala Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### Paso 3: Sube archivos
```bash
# En tu computadora local
cd app/dist
scp -r . root@tu-servidor.com:/var/www/html/
```

### Paso 4: Configura Nginx
```bash
sudo nano /etc/nginx/sites-available/default
```

Agrega:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Paso 5: Reinicia Nginx
```bash
sudo systemctl restart nginx
```

---

## 🌐 OPCIÓN 5: Surge.sh (GRATIS - Más rápido)

### Paso 1: Instala Surge
```bash
npm install -g surge
```

### Paso 2: Despliega
```bash
cd app/dist
surge
```

### Paso 3: Elige dominio
- Por defecto: `https://nombre-random.surge.sh`
- Personalizado: `https://felipebarraza.surge.sh`

---

## 🔒 CONFIGURAR HTTPS (SSL)

### Para Nginx (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

### Para Netlify/Vercel
- HTTPS viene incluido automáticamente ✅

---

## 📧 CONFIGURAR CORREO PERSONALIZADO

Si compras un dominio (ej: felipebarraza.cl), puedes crear:
- `contacto@felipebarraza.cl`
- `hola@felipebarraza.cl`

### Opciones gratuitas:
1. **Zoho Mail** - 5 cuentas gratis
2. **Google Workspace** - Pago pero profesional
3. **Namecheap Private Email** - Barato

---

## 🎯 RECOMENDACIÓN FINAL

| Opción | Precio | Dificultad | URL |
|--------|--------|------------|-----|
| **Netlify** | Gratis | ⭐ Fácil | `tu-nombre.netlify.app` |
| **Vercel** | Gratis | ⭐ Fácil | `tu-nombre.vercel.app` |
| **GitHub Pages** | Gratis | ⭐⭐ Medio | `usuario.github.io` |
| **Surge.sh** | Gratis | ⭐ Fácil | `tu-nombre.surge.sh` |
| **VPS + Dominio** | ~$5-10/mes | ⭐⭐⭐ Difícil | `tu-dominio.com` |

### Mi recomendación:
1. **Empieza con Netlify** (gratis, fácil, profesional)
2. Cuando estés listo, compra tu dominio en Namecheap (~$10/año)
3. Conecta el dominio a Netlify

---

## 💡 TIPS

1. **Comprime imágenes** antes de subir para mejor velocidad
2. **Usa un CDN** para assets grandes (Cloudflare gratis)
3. **Activa analytics** para ver quién visita tu portafolio
4. **Actualiza regularmente** con nuevos proyectos

---

## 🆘 PROBLEMAS COMUNES

### "404 Not Found" al recargar
- Solución: Configura rewrite rules en tu servidor
- Netlify: Crea `_redirects` con `/* /index.html 200`

### CSS no carga
- Verifica que los archivos estén en la carpeta correcta
- Revisa las rutas en index.html

### Fonts no aparecen
- Asegúrate de que las fuentes estén incluidas en el build

---

¿Necesitas ayuda? Escríbeme a felipe.barraza.vega@gmail.com
