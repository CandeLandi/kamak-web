# Configuracion de entorno

## Google Maps

La app carga Google Maps de forma dinamica desde `GoogleMapsService`. No hay claves reales commiteadas en el repo.

### Crear la clave

1. Abrir Google Cloud Console.
2. Habilitar estas APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Crear una API key.
4. Restringirla por dominio y por APIs permitidas.

### Desarrollo local

Para probar mapas en local, crea `src/assets/config.local.json`:

```json
{
  "googleMapsApiKey": "tu_clave_restringida"
}
```

No subas una clave real al repositorio.

## Imagenes

Para recomprimir assets locales grandes sin cambiar rutas:

```bash
npm run optimize:images
```

### Produccion

En GitHub Pages, configura el secret `GOOGLE_MAPS_API_KEY`. El workflow genera `src/assets/config.js` durante el deploy.

### Verificacion

1. Ejecuta `npm start`.
2. Abre la pagina principal.
3. Baja hasta el mapa.
4. Si no carga, revisa la consola del navegador y las restricciones de la key.
