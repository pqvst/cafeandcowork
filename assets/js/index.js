(function () {

  //----------------------------------------------------------------------
  // Prepare mapbox
  //----------------------------------------------------------------------
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;


  //----------------------------------------------------------------------
  // Helpers
  //----------------------------------------------------------------------

  function findIndexOf(arr, fn) {
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i])) return i;
    }
    return -1;
  }

  function avg(arr) {
    let n = 0;
    let t = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] != null) {
        n++;
        t += arr[i];
      }
    }
    return n == 0 ? 0 : t / n;
  }

  function colorRamp(value) {
    if (value >= 4) return '#418395';
    if (value >= 3) return '#2ecc71';
    if (value >= 2) return '#f39c12';
    return '#e67e22';
  }

  //----------------------------------------------------------------------
  // Attribute Component
  //----------------------------------------------------------------------

  Vue.component('attribute', {
    props: ['place', 'name'],
    template: '#attribute-template',
    computed: {
      value() {
        return this.place[this.name];
      },
      text() {
        if (this.value === true) return 'Yes';
        if (this.value === false) return 'No';
        return this.value + ' ★';
      },
      color() {
        if (this.value === true) return 'blue';
        if (this.value === false) return 'orange';
        if (this.value === 5) return 'blue';
        if (this.value === 4) return 'green';
        if (this.value === 3) return 'yellow';
        if (this.value === 2) return 'orange';
        if (this.value === 1) return 'red';
        if (this.value === 0) return 'grey';
        return 'grey';
      }
    }
  });

  //----------------------------------------------------------------------
  // Vue App
  //----------------------------------------------------------------------

  new Vue({
    el: '#app',

    data: {
      map: null,
      url: REPO_URL + '/edit/master' + DATA_URL,
      filter: '',
      places: [],
      markers: [],
      sortName: '_score',
      sortOrder: 'asc',
    },

    computed: {
      list() {
        const filter = this.filter.toLowerCase();
        const list = this.places.filter(e => {
          if (!filter) return true;
          const str = [
            e.name,
            e.type,
            e.area,
            e.music ? 'music' : '',
            e.smoking ? 'smoking' : '',
            e.standing_tables ? 'standing' : '',
            e.outdoor_seating ? 'outdoor': '',
          ].join(' ');
          return str.toLowerCase().includes(filter);
        });
        list.sort((a, b) => {
          let order = this.sortOrder == 'asc' ? 1 : -1;
          let av = a[this.sortName];
          let bv = b[this.sortName];

          // Always place null values last!
          if (av == null && bv == null) return 0;
          if (av == null && bv != null) return 1;
          if (av != null && bv == null) return -1;

          if (typeof av === 'string' && typeof bv === 'string') {
            if (av.toLowerCase) av = av.toLowerCase();
            if (bv.toLowerCase) bv = bv.toLowerCase();  
          } else if (typeof av === 'number' && typeof bv === 'number') {
            order *= -1;
          } else if (typeof av === 'boolean' && typeof bv === 'boolean') {
            order *= -1;
          }
          
          if (av > bv) return 1 * order;
          if (av < bv) return -1 * order;
          return 0;
        });
        return list;
      }
    },

    watch: {
      list() {
        this.updateMap();
      }
    },

    methods: {
      sort(name) {
        if (name == this.sortName) {
          this.sortOrder = this.sortOrder == 'asc' ? 'desc' : 'asc';
        } else {
          this.sortOrder = 'asc';
          this.sortName = name;
        }
      },
      updateMap() {
        if (!this.map || !this.map.loaded()) return;

        this.markers.forEach(e => e.remove());
        this.markers = [];

        const bounds = new mapboxgl.LngLatBounds;
        const list = _(this.list).filter(e => e._score > 0).orderBy('_score', 'asc').value();
        for (let e of list) {
          if (!e.coordinates) continue;
          const [lat, lng] = e.coordinates.split(',');

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(this.makePopup(e));

          const marker = new mapboxgl.Marker({ color: colorRamp(e._score), scale: 0.5 })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(this.map);
          this.markers.push(marker);
          bounds.extend([lng, lat]);
        }
        this.map.fitBounds(bounds, { padding: 50, linear: true, maxZoom: 17 });
      },

      makePopup(place) {
        return `
          <div>
            <b><a target="_blank" href="${place.google_maps}">${place.name}</a></b>
          </div>
          <div>${this.formatScore(place._score)} (${place.type})</div>
          ${place.tips ? place.tips.map(tip => `<div>${tip}</div>`).join('\n') : ''}
        `;
      },

      formatScore(n) {
        return n.toFixed(1);
      },

    },

    created() {
      fetch(DATA_URL).then((resp) => {
        resp.text().then((text) => {
          const lines = text.split('\n');
          const places = JSON.parse(text);
          places.forEach((e) => {
            e._line = findIndexOf(lines, line => line.includes(e.name)) + 1;
            e._url = this.url + `#L${e._line}`;
            e._score = avg([e.wifi, e.power, e.vacancy, e.comfort, e.quiet, e.drinks, e.food, e.price, e.view, e.toilets]);
          });
          this.places = places;
        });
      });
    },

    mounted() {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: COORDINATES ? COORDINATES.split(',').map(Number).reverse() : undefined,
        zoom: 10
      });
      this.map.on('load', () => this.updateMap());
    }

  });

})();
