const Ajv = require('ajv');
const ajv = new Ajv();

const data = require('../data');
const { cities } = data.load();

const types = [
  'Cafe',
  'Bar',
  'Restaurant',
  'Lobby',
  'Library',
  'Coworking Space',
  'Public Space',
  'Event Space',
  'Lounge',
  'Booth',
  'Bookstore'
];

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    date: { type: ['string', 'null'], pattern: "\\d\\d-\\d\\d-\\d\\d" },
    name: { type: 'string' },
    type: { type: 'string', enum: types },
    area: { type: ['string', 'null'] },
    address: { type: ['string', 'null'] },
    coordinates: { type: 'string' },
    google_maps: { type: 'string' },
    station: { type: ['string', 'null'] },
    wifi: { type: ['integer', 'null'], minimum: 0, maximum: 5 },
    speed: { type: ['integer', 'null'] },
    power: { type: ['number', 'null'], minimum: 0, maximum: 5 },
    vacancy: { type: ['number', 'null'], minimum: 0, maximum: 5 },
    comfort: { type: ['number', 'null'], minimum: 1, maximum: 5 },
    quiet: { type: ['number', 'null'], minimum: 1, maximum: 5 },
    drinks: { type: ['number', 'null'], minimum: 0, maximum: 5 },
    food: { type: ['number', 'null'], minimum: 0, maximum: 5 },
    price: { type: ['number', 'null'], minimum: 1, maximum: 5 },
    view: { type: ['number', 'null'], minimum: 0, maximum: 5 },
    toilets: { type: ['number', 'null'], minimum: 0, maximum: 5 },
    music: { type: ['boolean', 'null'] },
    smoking: { type: ['boolean', 'null'] },
    hours: { type: ['string', 'null'] },
    standing_tables: { type: ['boolean', 'null'] },
    outdoor_seating: { type: ['boolean', 'null'] },
    cash_only: { type: ['boolean', 'null'] },
    closed: { type: ['boolean', 'null'] },
    tips: { type: 'array', items: { type: 'string' } },
    animals: { type: ['boolean', 'null'] },
    opens: { type: ['string', 'null'] },
    closes: { type: ['string', 'null'] },
    facebook: { type: ['string', 'null'] },
    instagram: { type: ['string', 'null'] },
    website: { type: ['string', 'null'] },
    telephone: { type: ['string', 'null'] },
    content: { type: 'string' },
    id: { type: 'string' },
    url: { type: 'string' },
    city: { type: 'object' },
    file: { type: 'string' },
    score: { type: 'number' },
    title: { type: 'string' },
  },
  required: ['name', 'type', 'area', 'coordinates']
};

for (const city of cities) {
  for (const place of city.places) {
    const valid = ajv.validate(schema, place);
    if (!valid) {
      console.log(city.name, place.name);
      console.log(ajv.errors);
      process.exit(-1);
    }
  }
}
