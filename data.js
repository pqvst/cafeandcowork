const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { getHours, getScore, getReview } = require('./data-helpers');

function parseFile(filename) {
  const file = fs.readFileSync(filename, 'utf8');
  const split = file.split('---');
  const data = yaml.parse(split[1]);
  const content = split.slice(2).join('---').trim();
  if (content) {
    data.content = content;
  }
  return data;
}

function filterValidFiles(filename) {
  return !filename.startsWith('.');
}

function getPlaceDescription(i18n, locale, place) {
  const { __ } = i18n;
  const { power, wifi, speed } = place;
  
  const type = __({ locale, phrase: `Type: ${place.type}` });
  const city = __({ locale, phrase: `Location: ${place.cityName}` });
  const area = place.area ? __({ locale, phrase: `Area: ${place.area }` }) : null;

  let text;
  if (area) {
    text = __({ locale, phrase: '{{type}} in {{area}}, {{city}}.' }, { type, area, city })
  } else {
    text = __({ locale, phrase: '{{type}} in {{area}}.' }, { type, area: city });
  }

  if (power && wifi && speed) {
    text += __({ locale, phrase: ' {{speed}} Mb/s WiFi and power outlets available.' }, { speed });
  } else if (power && wifi) {
    text += __({ locale, phrase: ' WiFi and power outlets available.' });
  } else if (power) {
    text += __({ locale, phrase: ' Power outlets available.' });
  } else if (wifi && speed) {
    text += __({ locale, phrase: ' {{speed}} Mb/s WiFi available.' });
  } else if (wifi) {
    text += __({ locale, phrase: ' WiFi available.' });
  }

  if (place.review[locale]) {
    text += ` ${place.review[locale]}`;
  }
  
  return text;
}

function getCityDescription(i18n, locale, city) {
  const { __ } = i18n;
  const name = __({ locale, phrase: `City: ${city.name}` });
  const country = __({ locale, phrase: `Country: ${city.country}` });
  if (name == country) {
    return __({
      locale,
      phrase: 'Explore work-friendly cafes and coworking spaces in {{name}}. Find the best places with power outlets and fast WiFi to work or study from.',
    }, { name });
  } else {
    return __({
      locale,
      phrase: 'Explore work-friendly cafes and coworking spaces in {{name}}, {{country}}. Find the best places with power outlets and fast WiFi to work or study from.',
    }, { name, country });
  }
}

function parseCoordinates(coords) {
  if (coords) {
    const [lat, lng] = coords.split(',').map(e => Number(e.trim()));
    return [lng, lat];
  } else {
    return undefined;
  }
}

function getUrlFriendlyName(name) {
  return name.toLowerCase()
    .split(' / ').join('-')
    .split(' - ').join('-')
    .split(' & ').join('-')
    .split('/').join('-')
    .split(' ').join('-');
}

function getPlaces() {
  const places = [];
  const cityDirs = fs.readdirSync('data/').filter(filterValidFiles);
  for (const cityId of cityDirs) {
    const placeFiles = fs.readdirSync(`data/${cityId}/`).filter(filterValidFiles);
    for (const placeFile of placeFiles) {
      if (placeFile != 'index.md') {
        try {
          const placeData = parseFile(`data/${cityId}/${placeFile}`);
          const name = path.basename(placeFile, '.md');
          const place = Object.assign(placeData, {
            id: name,
            url: `/${cityId}/${name}/`,
            coordinates: parseCoordinates(placeData.coordinates),
            city: cityId,
            file: `${cityId}/${placeFile}`,
            score: getScore(placeData),
            hours: getHours(placeData.hours),
            review: getReview(placeData),
          });
          if (place.images) {
            place.images = place.images.map(image => `${place.url}${image}`);
          }
          places.push(place);
        } catch (err) {
          console.log(cityId, placeFile, err.message);
          throw err;
        }
      }
    }
  }
  return _(places)
    .orderBy('score', 'desc')
    .value();
}

function getCities(places) {
  const cities = {};
  for (const place of places) {
    const cityData = parseFile(`data/${place.city}/index.md`);
    const id = place.city;
    if (!cities[place.city]) {
      const city = Object.assign(cityData, {
        id,
        url: `/${id}/`,
        coordinates: parseCoordinates(cityData.coordinates),
        places: [],
        count: 0,
        redirects: [],
      });
      cities[place.city] = city;
    }
    if (place.redirect) {
      cities[place.city].redirects.push(place);
      continue;
    }
    place.cityUrl = `/${id}/`;
    place.cityName = cityData.name;
    cities[place.city].places.push(place);
    if (place.score && !place.closed) {
      cities[place.city].count++;
    }
  }
  return _(cities)
    .values()
    .orderBy(e => e.name)
    .value();
}

function getAreas(places) {
  const areas = {};
  for (const place of places) {
    if (place.area && place.content && place.images && place.score >= 3 && !place.closed) {
      if (!areas[place.area]) {
        const id = getUrlFriendlyName(place.area);
        areas[place.area] = {
          id,
          name: place.area,
          url: `/${place.city}/area/${id}/`,
          title: `${place.area} Area`,
          city: place.city,
          places: [],
        };
      }
      areas[place.area].places.push(place);
    }
  }
  for (const place of places) {
    if (areas[place.area]) {
      place.areaUrl = areas[place.area].url;
    }
  }
  return _(areas)
    .values()
    .orderBy('name')
    .value();
}

function getStations(places) {
  const stations = {};
  for (const place of places) {
    if (place.station && place.content && place.images && place.score >= 3 && !place.closed) {
      for (const station of place.station.split(',').map(e => e.trim())) {
        if (!stations[station]) {
          const id = getUrlFriendlyName(station);
          stations[station] = {
            id,
            name: station,
            url: `/${place.city}/station/${id}/`,
            title: `${station} Station`,
            city: place.city,
            places: [],
          }
        }
        stations[station].places.push(place);
      }
    }
  }
  for (const place of places) {
    if (stations[place.station]) {
      place.stationUrl = stations[place.station].url;
    }
  }
  return _(stations)
    .values()
    .orderBy('name')
    .value();
}

function load() {
  const t1 = Date.now();

  const places = getPlaces();
  const cities = getCities(places);
  const areas = []; //getAreas(places);
  const stations = []; //getStations(places);

  const recent = _(places)
    .filter(e => e.added && e.images?.length > 0)
    .orderBy(e => e.added, 'desc')
    .value();

  const top = _(places)
    .filter(e => !e.closed && e.images?.length > 0)
    .orderBy('score', 'desc')
    .value();

  const t2 = Date.now();
  console.log(`Loaded ${cities.length} cities, ${places.length} places, ${areas.length} areas, ${stations.length} stations in ${t2 - t1} ms`);

  return { cities, places, areas, stations, recent, top };
}

module.exports = { load, getCityDescription, getPlaceDescription };
