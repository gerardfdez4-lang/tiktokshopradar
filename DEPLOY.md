# Desplegar en un VPS de Hostinger

Guía para poner TikTok Shop Radar en producción en un **VPS de Hostinger** (KVM).
La app es Next.js con rutas de servidor, así que necesita Node.js corriendo (no vale el hosting compartido PHP).

---

## 0. Pedir el VPS en Hostinger
- En hPanel → **VPS** → elige un plan (con **KVM 1** sobra para empezar).
- Al crearlo, en "Sistema operativo" elige **Ubuntu 22.04** (o "Ubuntu con OpenLiteSpeed/Node" si lo ofrece; con Ubuntu limpio vale).
- Apunta la **IP del VPS** y la contraseña/clave SSH.

## 1. Conectar por SSH
```bash
ssh root@LA_IP_DEL_VPS
```

## 2. Instalar Node 20, git, nginx y PM2
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx
npm install -g pm2
node -v   # debe decir v20.x
```

## 3. Clonar el repo
```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/TU_USUARIO/tiktok-shop-radar.git
cd tiktok-shop-radar
```

## 4. Crear el .env.local (NO está en git, hay que crearlo en el server)
```bash
nano .env.local
```
Pega (con tu key **rotada**):
```
RAPIDAPI_KEY=tu_key_de_rapidapi
RAPIDAPI_HOST=tiktok-ultra-api1.p.rapidapi.com
```
Guarda con Ctrl+O, Enter, Ctrl+X.

## 5. Instalar dependencias y compilar
```bash
npm ci
npm run build
```

## 6. Arrancar con PM2 (se reinicia solo y sobrevive a reinicios del server)
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup        # ejecuta el comando que imprima
```
Comprueba: `curl http://127.0.0.1:3000` debe devolver HTML.

## 7. Configurar nginx (dominio -> app)
```bash
cp deploy/nginx.conf /etc/nginx/sites-available/tiktok-shop-radar
# edita y pon tu dominio:
nano /etc/nginx/sites-available/tiktok-shop-radar
ln -s /etc/nginx/sites-available/tiktok-shop-radar /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 8. Apuntar el dominio
En Hostinger (o donde tengas el DNS del dominio):
- Registro **A** `@` → IP del VPS
- Registro **A** `www` → IP del VPS

## 9. HTTPS gratis con Let's Encrypt
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d TU_DOMINIO -d www.TU_DOMINIO
```
Certbot configura el SSL y la redirección a HTTPS solo.

---

## Actualizar la app más adelante (deploy de cambios)
```bash
cd /var/www/tiktok-shop-radar
git pull
npm ci
npm run build
pm2 restart tiktok-shop-radar
```

## Comandos útiles
- `pm2 logs tiktok-shop-radar` — ver logs
- `pm2 status` — estado
- `pm2 restart tiktok-shop-radar` — reiniciar
