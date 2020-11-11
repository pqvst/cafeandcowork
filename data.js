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

function load() {
  const t1 = Date.now();

  const cities = fs.readdirSync('data/').filter(filter).map(cityId => {

    const cityData = parseFile(`data/${cityId}/index.md`);

    const city = Object.assign(cityData, {
      title: cityData.name,
      id: cityId,
      url: `/${cityId}`,
      places: [],
    });

    for (const placeFile of fs.readdirSync(`data/${cityId}/`).filter(filter)) {
      if (placeFile != 'index.md') {
        const placeData = parseFile(`data/${cityId}/${placeFile}`);
        const name = path.basename(placeFile, '.md');
        city.places.push(Object.assign(placeData, {
          id: name,
          url: `/${cityId}/${name}`,
          city: city,
          file: `${cityId}/${placeFile}`,
          score: getScore(placeData),
          title: placeData.name,
        }));
      }
    }

    city.places.sort((a, b) => b.score - a.score);

    return city;
  });
  
  cities.sort((a, b) => b.places.length - a.places.length);

  const recent = _([])
    .concat(...cities.map(e => e.places))
    .filter(e => !!e.date)
    .orderBy('date', 'desc')
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
