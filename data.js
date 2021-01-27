const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const marked = require('marked');
const _ = require('lodash');
const { getScore } = require('./helpers');

function parseFile(filename) {
  const file = fs.readFileSync(filename, 'utf8');
  const split = file.split('---');
  const data = yaml.parse(split[1]);
  const markdown = split.slice(2).join('---').trim();
  const content = marked(markdown);
  return Object.assign({ content, markdown }, data);
}

function filter(filename) {
  return !filename.startsWith('.');
}

function getPlaceDescription(place) {
  const { type, city, area, power, wifi, speed, markdown } = place;
  
  let text;
  if (area) {
    text = `${type} in ${area}, ${city.name}.`
  } else {
    text = `${type} in ${city.name}.`
  }
  if (power && wifi && speed) {
    text += ` ${speed} Mb/s WiFi and power outlets available.`
  } else if (power && wifi) {
    text += ` WiFi and power outlets available.`
  } else if (power) {
    text += ` Power outlets available.`
  } else if (wifi && speed) {
    text += ` ${speed} Mb/s WiFi available.`
  } else if (wifi) {
    text += ` WiFi available.`;
  } 
  if (markdown) {
    text += ` ${markdown}`;
  }
  return text;
}

function getCityDescription(city) {
  return `Explore cafes and coworking spaces in ${city.name}, ${city.country}. Find the best places with power outlets and fast WiFi to work or study from.`;
}

function parseCoordinates(coords) {
  if (coords) {
    const [lat, lng] = coords.split(',').map(e => Number(e.trim()));
    return [lng, lat];
  } else {
    return undefined;
  }
}

function load() {
  const t1 = Date.now();

  const cities = fs.readdirSync('data/').filter(filter).map(cityId => {

    const cityData = parseFile(`data/${cityId}/index.md`);

    const city = Object.assign(cityData, {
      title: cityData.name,
      id: cityId,
      url: `/${cityId}/`,
      places: [],
      coordinates: parseCoordinates(cityData.coordinates),
    });

    for (const placeFile of fs.readdirSync(`data/${cityId}/`).filter(filter)) {
      if (placeFile != 'index.md') {
        const placeData = parseFile(`data/${cityId}/${placeFile}`);
        const name = path.basename(placeFile, '.md');
        const place = Object.assign(placeData, {
          id: name,
          url: `/${cityId}/${name}/`,
          city: city,
          file: `${cityId}/${placeFile}`,
          score: getScore(placeData),
          title: placeData.name,
          coordinates: parseCoordinates(placeData.coordinates),
        });
        place.description = getPlaceDescription(place);
        city.places.push(place);
      }
    }

    city.description = getCityDescription(city);
    city.places.sort((a, b) => b.score - a.score);

    return city;
  });
  
  cities.sort((a, b) => b.places.length - a.places.length);

  const recent = _([])
    .concat(...cities.map(e => e.places))
    .filter(e => !!e.added)
    .orderBy('added', 'desc')
    .take(10)
    .value();

  const top = _([])
    .concat(...cities.map(e => e.places))
    .orderBy('score', 'desc')
    .take(10)
    .value();

  const t2 = Date.now();
  console.log(`Loaded ${cities.length} cities in ${t2 - t1} ms`);

  return { cities, recent, top };
}

module.exports = { load };
