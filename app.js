const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");

const data = require('./data');
const submit = require('./submit');

const app = express();
const port = 3000;

app.set('views', 'views');
app.set('view engine', 'pug');
//app.set('strict routing', true);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('dev'));

app.locals.site = {
  title: 'Cafe and Cowork',
  description: 'Find Places to Work From',
  url: 'https://cafeandcowork.com',
  github: 'https://github.com/pqvst/cafeandcowork',
  instagram: 'https://instagram.com/cafeandcowork',
};

// app.use((req, res, next) => {
//   if (req.path.slice(req.path.length-1) !== '/') {
//     res.redirect(301, req.path + '/' + req.url.slice(req.path.length));
//   } else {
//     next();
//   }
//   next();
// });

const { cities, recent, top } = data.load();

app.locals.cities = cities;
app.locals.recent = recent;
app.locals.top = top;

app.locals.places = [];

for (const city of cities) {
  app.get(`/${city.id}/`, (req, res) => {
    res.render('city', city);
  });
  for (const place of city.places) {
    app.get(`/${city.id}/${encodeURI(place.id)}/`, (req, res) => {
      res.render('place', place);
    });
  }
}

app.get('/', (req, res) => {
  res.render('index');
});

const submissionLimiter = rateLimit({
  keyGenerator: () => 'all',
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit to 5 submissions per 5 minutes
});

app.get('/submit', (req, res) => {
  res.render('submit', { title: 'Submit' });
});

app.post('/submit', submissionLimiter, async (req, res) => {
  const place = submit.parse(req.body);
  try {
    const url = await submit.submit(place);
    res.render('submit', { issue_link: url });
  } catch (err) {
    console.log(err);
    res.render('submit', Object.assign(place, { error: true }));
  }
});

app.get('/feed.xml', (req, res) => {
  res.type('application/xml');
  res.render('feed', { recent, pretty: true });
});

app.listen(port);

process.on('SIGTERM', () => {
  process.exit();
});
