const { Octokit } = require('@octokit/rest');
const token = '0276c329725bc9fb121099966f507eec0b589726';
const octokit = new Octokit({ auth: token });
const YAML = require('yaml');

YAML.scalarOptions.null.nullStr = '';

const strFields = ['name', 'type', 'area', 'google_maps', 'coordinates', 'address', 'station', 'opens', 'closes', 'facebook', 'instagram', 'telephone', 'website'];
const numFields = ['wifi', 'speed', 'power', 'vacancy', 'comfort', 'quiet', 'food', 'drinks', 'price', 'view', 'toilets'];
const boolFields = ['music', 'standing_tables', 'outdoor_seating', 'cash_only', 'animals'];

function parse(body) {
  const place = {
    city: {
      name: body.city,
    },
    name: body.name,
  };
  for (const field of strFields) {
    place[field] = (body[field] === '') ? null : String(body[field]);
  }
  for (const field of numFields) {
    place[field] = (body[field] === '') ? null : Number(body[field]);
  }
  for (const field of boolFields) {
    place[field] = (body[field] === '') ? null : body[field] === 'true';
  }
  return place;
}

function getYaml(body) { 
  return `
\`\`\`
${YAML.stringify(body)}
\`\`\`
`;
}

async function submit(place) {
  const date = (new Date).toISOString().slice(0, 10);
  const body = Object.assign({ date }, place);
  body.city = place.city.name;
  const issue = await octokit.issues.create({
    owner: 'pqvst',
    repo: 'cafeandcowork-test',
    title: `${body.name}, ${body.city}`,
    body: getYaml(body),
    labels: ['pending']
  });
  return issue.data.html_url;
}

module.exports = { parse, submit };
