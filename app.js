const express = require('express');
const morgan = require('morgan');
const data = require('./data');

const app = express();
const port = 3000;

app.set('views', 'views');
app.set('view engine', 'pug');
app.set('strict routing', true);

app.use(express.static('public'))
app.use(morgan('dev'));

app.locals.title = 'Cafe and Cowork';
app.locals.description = 'Find Places to Work From';
app.locals.url = 'https://cafeandcowork.com';
app.locals.github = 'https://github.com/pqvst/cafeandcowork';

app.use((req, res, next) => {
  if (req.path.slice(req.path.length-1) !== '/') {
    res.redirect(301, req.path + '/' + req.url.slice(req.path.length));
  } else {
    next();
  }
});

const cities = data.load();

app.locals.cities = cities;
app.locals.places = [];

for (const city of cities) {
  app.get(`/${city.id}/`, (req, res) => {
    res.render('city', city);
  });
  for (const place of city.places) {
    app.get(`/${city.id}/${place.id}/`, (req, res) => {
      res.render('place', place);
    });
  }
}

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port);

process.on('SIGTERM', () => {
  process.exit();
});
