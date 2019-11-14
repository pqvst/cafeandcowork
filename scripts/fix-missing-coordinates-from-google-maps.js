const request = require('request-promise');
const path = require('path');
const fs = require('fs');

const city = process.argv[2];
if (!city) {
  process.exit();
}

const file = path.join(__dirname, `../data/cities/${city}.json`);

async function main() {
  const list = JSON.parse(fs.readFileSync(file, 'utf8'));

  for (let e of list) {
    if (e.coordinates) {
      continue;
    }
    const resp = await request({ url: e.google_maps, followRedirect: false, resolveWithFullResponse: true, simple: false });
    const location = resp.headers.location;
    console.log(e.name, location);
    if (!location.includes('/@')) {
      console.log('skip');
      continue;
    }
    const split = location.split('/');
    const latlng = split[6];
    const [lat, lng] = latlng.slice(1).split(',');
    e.coordinates = `${lat},${lng}`;
  }

  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

main();
