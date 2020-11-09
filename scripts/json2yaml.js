const fs = require('fs');

function safeName(name) {
  return name
    .toLowerCase()
    .replace(/[\.'()_-]/g, '')
    .replace(/[é]/g, 'e')
    .replace(/[ /]/g, '-');
}

function safeValue(value) {
  if (value == null)
    return '';
  else
    return value;
}

function place2yaml(city, name, place) {
  let yaml = 
`---
name: ${safeValue(place.name)}
type: ${safeValue(place.type)}
area: ${safeValue(place.area)}
google_maps: ${safeValue(place.google_maps)}
coordinates: ${safeValue(place.coordinates)}
address: ${safeValue(place.address)}
station: ${safeValue(place.station)}
opens: "${safeValue(place.opens)}"
closes: "${safeValue(place.closes)}"
closed: ${safeValue(place.closed)}
wifi: ${safeValue(place.wifi)}
speed: ${safeValue(place.speed)}
power: ${safeValue(place.power)}
vacancy: ${safeValue(place.vacancy)}
comfort: ${safeValue(place.comfort)}
quiet: ${safeValue(place.quiet)}
food: ${safeValue(place.food)}
drinks: ${safeValue(place.drinks)}
price: ${safeValue(place.price)}
view: ${safeValue(place.view)}
toilets: ${safeValue(place.toilets)}
music: ${safeValue(place.music)}
smoking: ${safeValue(place.smoking)}
standing_tables: ${safeValue(place.standing_tables)}
outdoor_seating: ${safeValue(place.outdoor_seating)}
cash_only: ${safeValue(place.cash_only)}
animals: ${safeValue(place.animals)}
facebook: ${safeValue(place.facebook)}
instagram: ${safeValue(place.instagram)}
telephone: ${safeValue(place.phone)}
website: ${safeValue(place.website)}
`;
  if (place.tips) {
    yaml += `tips:\n${place.tips.map(tip => `  - ${tip}`).join('\n')}\n`;
  }
  yaml += '---';
  return yaml;
}

function generate(city) {
  const filename = `json/${city}.json`;
  const places = JSON.parse(fs.readFileSync(filename));
  fs.mkdirSync(`data/${city}/`, { recursive: true });
  for (const place of places) {
    const name = safeName(place.name);
    const yaml = place2yaml(city, name, place);
    fs.writeFileSync(`data/${city}/${name}.md`, yaml);
  }
}

generate(process.argv[2]);
