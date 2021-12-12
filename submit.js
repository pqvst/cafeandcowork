const got = require('got');

const FORM_ACTION = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScpERMNnPEBsMRnHRtGSgCgaa46fnAXMFYko-P70yBNbm6Gjw/formResponse';

const FORM_FIELDS = {
  email: 'entry.1003095951',
  author: 'entry.698804565',
  city: 'entry.1931176596',
  name: 'entry.588589100',
  google_maps: 'entry.804212171',
  wifi: 'entry.1753723752',
  speed: 'entry.1403885761',
  power: 'entry.1272057959',
  vacancy: 'entry.2046648137',
  comfort: 'entry.1144461527',
  quiet: 'entry.821816784',
  food: 'entry.311973800',
  drinks: 'entry.122974942',
  price: 'entry.85589928',
  view: 'entry.97128487',
  toilets: 'entry.1776684342',
  music: 'entry.1879119442',
  smoking: 'entry.495024092',
  standing_tables: 'entry.58564578',
  outdoor_seating: 'entry.1029695140',
  cash_only: 'entry.258421776',
  animals: 'entry.459598352',
  lactose_free_milk: 'entry.1038954349',
  time_limit: 'entry.1235872444',
  comments: 'entry.1081841747',
};

async function submit(place) {
  const form = {};
  for (const field in FORM_FIELDS) {
    const entry = FORM_FIELDS[field];
    if (place[field]) {
      form[entry] = place[field];
    }
  };
  const resp = await got(FORM_ACTION, {
    method: 'post',
    form,
    throwHttpErrors: false,
  });
  if (resp.statusCode >= 400) {
    console.log(resp.statusCode);
    throw new Error('submission failed');
  }
}

module.exports = { submit };
