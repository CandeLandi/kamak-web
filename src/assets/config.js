window.__KAMAK_CONFIG__ = window.__KAMAK_CONFIG__ || {
  googleMapsApiKey: ''
};

if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
  try {
    var request = new XMLHttpRequest();
    request.open('GET', 'assets/config.local.json', false);
    request.send(null);

    if (request.status === 200) {
      window.__KAMAK_CONFIG__ = Object.assign(
        {},
        window.__KAMAK_CONFIG__,
        JSON.parse(request.responseText)
      );
    }
  } catch (error) {
    console.warn('Local config could not be loaded.', error);
  }
}
