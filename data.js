const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const marked = require('marked');
const _ = require('lodash');

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

function getScore(place) {
  let score = avg([place.wifi, place.power, place.vacancy, place.comfort, place.quiet, place.drinks, place.food, place.price, place.view, place.toilets]);
  if (place.smoking) score -= 0.1;
  if (place.standing_tables) score += 0.1;
  if (place.outdoor_seating) score += 0.1;
  if (place.cash_only) score -= 0.1;
  return Math.min(score, 5);
}

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

function load() {
  const t1 = Date.now();

  const cities = fs.readdirSync('data/').filter(filter).map(cityId => {

    const cityData = parseFile(`data/${cityId}/index.md`);

    const city = Object.assign(cityData, {
      title: cityData.name,
      id: cityId,
      url: `/${cityId}/`,
      places: [],
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
