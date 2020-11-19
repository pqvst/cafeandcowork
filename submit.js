const { Octokit } = require('@octokit/rest');

const GITHUB_REPO = 'pqvst/cafeandcowork';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const YAML = require('yaml');
YAML.scalarOptions.null.nullStr = '';

//const strFields = ['name', 'type', 'area', 'google_maps', 'coordinates', 'address', 'station', 'opens', 'closes', 'facebook', 'instagram', 'telephone', 'website'];
const strFields = ['city', 'name', 'google_maps'];
const numFields = ['wifi', 'speed', 'power', 'vacancy', 'comfort', 'quiet', 'food', 'drinks', 'price', 'view', 'toilets'];
const boolFields = ['music', 'smoking', 'standing_tables', 'outdoor_seating', 'cash_only', 'animals'];

function parse(body) {
  const place = {};
  for (const field of strFields) {
    place[field] = (body[field] === '') ? null : String(body[field]);
  }
  for (const field of numFields) {
    place[field] = (body[field] === '') ? null : Number(body[field]);
  }
  for (const field of boolFields) {
    place[field] = (body[field] === '') ? null : body[field] === 'true';
  }
  place.city = {
    name: place.city
  };
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
  if (!GITHUB_TOKEN) throw new Error('Missing GITHUB_TOKEN!');
  const added = (new Date).toISOString().slice(0, 10);
  const body = Object.assign({ added }, place);
  body.city = place.city.name;
  const [owner, repo] = GITHUB_REPO.split('/');
  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  const issue = await octokit.issues.create({
    owner,
    repo,
    title: `${body.name}, ${body.city}`,
    body: getYaml(body),
    labels: ['pending']
  });
  return issue.data.html_url;
}

module.exports = { parse, submit };
