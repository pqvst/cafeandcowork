(function () {

  //----------------------------------------------------------------------
  // Prepare mapbox
  //----------------------------------------------------------------------
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

  function colorRamp(value) {
    if (value >= 4) return '#418395';
    if (value >= 3) return '#2ecc71';
    if (value >= 2) return '#f39c12';
    return '#e67e22';
  }

  function makePopup(place) {
    return `
      <div>
        <b><a target="_blank" href="${place.google_maps}">${place.name}</a></b>
      </div>
    `;
    /*
    <div>${this.formatScore(place._score)} (${place.type})</div>
    ${place.tips ? place.tips.map(tip => `<div>${tip}</div>`).join('\n') : ''}
    */
  }

  let map, markers = [];

  function createMap() {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: COORDINATES ? COORDINATES.split(',').map(Number).reverse() : undefined,
      zoom: 10
    });
    map.on('load', () => updateMap());
  }

  function getPlaces() {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    return rows.map(e => {
      return {
        score: e.getAttribute('data-score'),
        coordinates: e.getAttribute('data-coordinates'),
      };
    });
  }

  function updateMap() {
    if (!map || !map.loaded()) {
      return createMap();
    }
    
    markers.forEach(e => e.remove());
    markers = [];

    const bounds = new mapboxgl.LngLatBounds;
    const places = getPlaces();
    console.log(places);
    for (const place of places) {
      if (!place.coordinates) {
        continue;
      }
      const [lat, lng] = place.coordinates.split(',');
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(makePopup(place));
      const marker = new mapboxgl.Marker({ color: colorRamp(place.score), scale: 0.5 })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
      markers.push(marker);
      bounds.extend([lng, lat]);
    }
    map.fitBounds(bounds, { padding: 50, linear: true, maxZoom: 17 });
  }

  createMap();

})();
