# Configuración de Variables de Entorno

## Configuración de Google Maps API

Para usar Google Maps en este proyecto, necesitas configurar una clave de API de Google Maps.

### 1. Obtener una clave de Google Maps API

1. Ve a la [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Ve a "Credentials" y crea una nueva API Key
5. Restringe la clave a tu dominio para mayor seguridad

### 2. Configurar el archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Google Maps API Key
GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps_aqui

# API URL (opcional, ya está configurada por defecto)
API_URL=https://rakium-be-production.up.railway.app
```

### 3. Configuración para diferentes entornos

- **Desarrollo**: La clave se cargará desde el archivo `.env`
- **Producción**: Asegúrate de que la clave esté configurada en tu servidor de producción

### 4. Seguridad

⚠️ **IMPORTANTE**: 
- Nunca commits el archivo `.env` al repositorio
- El archivo `.env` ya está incluido en `.gitignore`
- Restringe tu clave de API a dominios específicos en Google Cloud Console

### 5. Verificación

Para verificar que la configuración funciona:

1. Crea el archivo `.env` con tu clave
2. Ejecuta `npm start`
3. Ve a la página del mapa en tu aplicación
4. El mapa debería cargarse correctamente

### 6. Solución de problemas

Si el mapa no se carga:
1. Verifica que la clave de API sea válida
2. Asegúrate de que las APIs necesarias estén habilitadas
3. Revisa la consola del navegador para errores
4. Verifica que las restricciones de dominio permitan tu dominio 
