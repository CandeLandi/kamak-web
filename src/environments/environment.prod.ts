export const environment = {
  production: true,
  apiUrl: 'https://api.rakium.dev/api',
  googleMapsApiKey: '',
  // Endpoints públicos del ERP Kamak (obras + leads). Fuente de verdad de la web.
  // Override en runtime via window.__KAMAK_CONFIG__.obrasApiUrl (assets/config.js).
  obrasApiUrl: 'https://app.kamak.com.ar/api/public'
};
