(function () {

  function colorRamp(value) {
    if (value >= 4) return '#418395';
    if (value >= 3) return '#2ecc71';
    if (value >= 2) return '#f39c12';
    return '#e67e22';
  }

  function makePopup(place) {
    const html = `
      <div>
        <b><a target="_blank" href="${place.url}">${place.name} (${place.score.toFixed(1)})</a></b>
      </div>
    `;
    return new mapboxgl.Popup({ offset: 25 }).setHTML(html);
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoicHF2c3QiLCJhIjoiY2ptcTBnYnBjMTQ5bzNxbXB3YXk2NTdxMCJ9.siEO29S7-nsJbBiZ_jVhrg';

  var map;

  window.CafeAndCowork = {};

  window.CafeAndCowork.Place = function (place) {
    var [lat, lng] = place.coordinates.split(',').map(Number);
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 14
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
    map.on('load', function() {
      new mapboxgl.Marker({ color: colorRamp(place.score), scale: 0.5 })
        .setLngLat([lng, lat])
        .setPopup(makePopup(place))
        .addTo(map);
    });
  };

  window.CafeAndCowork.City = function (coordinates, places) {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates ? coordinates.split(',').map(Number).reverse() : undefined,
      zoom: 10
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
    map.on('load', function() {
      const bounds = new mapboxgl.LngLatBounds;
      for (const place of places) {
        if (!place.coordinates) {
          continue;
        }
        const [lat, lng] = place.coordinates.split(',');
        new mapboxgl.Marker({ color: colorRamp(place.score), scale: 0.5 })
          .setLngLat([lng, lat])
          .setPopup(makePopup(place))
          .addTo(map);
        bounds.extend([lng, lat]);
      }
      map.fitBounds(bounds, { padding: 50, linear: true, maxZoom: 17 });
    });
  };

  window.CafeAndCowork.Table = function (table, input) {

    input.addEventListener('input', function (evt) {
      filter(evt.target.value.toLowerCase());
    });
    
    table.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
      sort(th);
    })));

    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
        v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
        )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    function sort(th) {
      const table = th.closest('table');
      const tbody = table.querySelector('tbody');
      Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => tbody.appendChild(tr) );
    }

    function filterRow(tr, value) {
      const include = !!Array.from(tr.children).find(e => e.innerText.toLowerCase().includes(value));
      tr.style.display = include ? '' : 'none';
    }

    function filter(value) {
      const tbody = table.querySelector('tbody');
      Array.from(tbody.querySelectorAll('tr'))
        .forEach(tr => filterRow(tr, value));
    }

    sort(document.querySelector('th'));
    sort(document.querySelector('th'));

  };

})();
