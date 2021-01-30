(function () {

  function colorRamp(value) {
    if (value >= 4) return '#418395';
    if (value >= 3.5) return '#59ae9f';
    if (value >= 3) return '#2ecc71';
    if (value >= 2) return '#f39c12';
    if (value == 0) return '#aaaaaa';
    return '#e67e22';
  }

  function makeMarker(coordinates, place) {
    return new mapboxgl.Marker({ color: colorRamp(place.score), scale: 0.5 })
      .setLngLat(coordinates)
      .setPopup(makePopup(place));
  }
  
  function makePopup(place) {
    const html = `
      <div>
        <b><a target="_blank" href="${place.url}">${place.name} (${place.score.toFixed(1)})</a></b>
      </div>
    `;
    return new mapboxgl.Popup({ offset: 25 }).setHTML(html);
  }
  
  function initMap(center, zoom, callback) {
    mapboxgl.accessToken = 'pk.eyJ1IjoicHF2c3QiLCJhIjoiY2ptcTBnYnBjMTQ5bzNxbXB3YXk2NTdxMCJ9.siEO29S7-nsJbBiZ_jVhrg';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom
    });
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    map.addControl(new mapboxgl.NavigationControl({
      showCompass: false
    }));
    map.on('load', function() {
      callback(map);
    });
    return map;
  }

  function initPlace(place) {
    initMap(place.coordinates, 14, (map) => {
      new mapboxgl.Marker({ color: colorRamp(place.score) })
        .setLngLat(place.coordinates)
        .setPopup(makePopup(place))
        .addTo(map);
    });
  };
  
  let tid;

  function updateMarkers(places, map, markers, filter) {
    const bounds = new mapboxgl.LngLatBounds;
    let count = 0;
    const arr = Array.from(places).reverse();
    for (const place of arr) {
      if (!filter || place.filter.toLowerCase().includes(filter)) {
        bounds.extend(place.coordinates);
        markers[place.url].addTo(map);
        count++;
      } else {
        markers[place.url].remove();
      }
    }
    if (count) {
      clearTimeout(tid);
      tid = setTimeout(() => {
        map.fitBounds(bounds, { padding: 50, linear: true, maxZoom: 17 });
      }, filter ? 150 : 0);
    }
  }

  function updateRows(places, filter) {
    for (const place of places) {
      const include = !filter || place.filter.toLowerCase().includes(filter);
      const tr = document.querySelector(`tr[data-url='${place.url}']`);
      tr.style.display = include ? '' : 'none';
    }
  }

  function initCity(opts) {
    const markers = {};

    const { coordinates, places, table, input } = opts;
    const map = initMap(coordinates, 10, (map) => {
      for (const place of places) {
        const marker = makeMarker(place.coordinates, place);
        markers[place.url] = marker;
      }
      updateMarkers(places, map, markers);
    });

    makeSortableTable(table, input);

    input.addEventListener('input', function (evt) {
      const filter = evt.target.value.toLowerCase();
      updateMarkers(places, map, markers, filter);
      updateRows(places, filter);
    });
  };

  function makeSortableTable(table) {
    // Inspired by: https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript

    table.querySelectorAll('th').forEach(th => {
      const name = th.innerText;
      if (name == 'Name' || name == 'Area' || name == 'Opens') {
        th.asc = false;
      } else {
        th.asc = true;
      }
      th.addEventListener('click', (() => {
        sort(th);
      }));
    });

    const getCellValue = (tr, idx, name, asc) => {
      const text = tr.children[idx] ? tr.children[idx].innerText || tr.children[idx].textContent || '' : '';
      if (name == 'Opens' || name == 'Closes') {
        if (text == 'Closed Today' || text == '') {
          return asc ? Number.MAX_VALUE : Number.MIN_VALUE;
        }
        let number = Number(text.replace(':', ''));
        if (number < 600) {
          number += 2400;
        }
        return number;
      }
      return text;
    };

    const compareValues = (v1, v2) => {
      return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
    };

    const comparer = (idx, name, asc) => {
      return (a, b) => {
        return compareValues(getCellValue(asc ? a : b, idx, name, asc), getCellValue(asc ? b : a, idx, name, asc));
      };
    };

    function sort(th) {
      th.asc = !th.asc;
      const tbody = table.querySelector('tbody');
      Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), th.innerText, th.asc))
        .forEach(tr => tbody.appendChild(tr) );
    }
  }

  window.CafeAndCowork = window.CafeAndCowork || { Place: initPlace, City: initCity };

})();
