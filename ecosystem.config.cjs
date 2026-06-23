// Configuración de PM2 para mantener la app viva en el VPS.
// Uso: pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "tiktok-shop-radar",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/tiktok-shop-radar",
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
