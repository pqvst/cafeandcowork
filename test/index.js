const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const ajv = new Ajv();

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
  type: 'array',
  items: {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: { type: 'string' },
      type: { type: 'string', enum: types },
      area: { type: 'string' },
      coordinates: { type: 'string' },
      google_maps: { type: 'string' },
      station: { type: 'string' },
      wifi: { type: 'integer', minimum: 0, maximum: 5 },
      speed: { type: 'integer' },
      power: { type: 'number', minimum: 0, maximum: 5 },
      vacancy: { type: 'number', minimum: 0, maximum: 5 },
      comfort: { type: 'number', minimum: 1, maximum: 5 },
      quiet: { type: 'number', minimum: 1, maximum: 5 },
      drinks: { type: 'number', minimum: 0, maximum: 5 },
      food: { type: 'number', minimum: 0, maximum: 5 },
      price: { type: 'number', minimum: 1, maximum: 5 },
      view: { type: 'number', minimum: 0, maximum: 5 },
      toilets: { type: 'number', minimum: 0, maximum: 5 },
      music: { type: 'boolean' },
      smoking: { type: 'boolean' },
      hours: { type: 'string' },
      standing_tables: { type: 'boolean' },
      outdoor_seating: { type: 'boolean' },
      cash_only: { type: 'boolean' },
      closed: { type: 'boolean' },
      tips: { type: 'array', items: { type: 'string' } },
      animals: { type: 'boolean' },
      opens: { type: 'string' },
      closes: { type: 'string' },
    },
    required: ['name', 'type', 'area', 'coordinates']
  }
};

const cities = fs.readdirSync(path.join(__dirname, '../data/cities'));
for (let city of cities) {
  console.log('checking:', city);
  const valid = ajv.validate(schema, require(path.join(__dirname, '../data/cities/', city)));
  if (!valid) {
    console.error(ajv.errors);
    process.exit(-1);
  } else {
    console.log('ok!')
  }
}
