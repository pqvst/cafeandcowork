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

app.locals.site = {
  title: 'Cafe and Cowork',
  description: 'Find Places to Work From',
  url: 'https://cafeandcowork.com',
  github: 'https://github.com/pqvst/cafeandcowork',
  instagram: 'https://instagram.com/cafeandcowork',
};

app.use((req, res, next) => {
  if (req.path.slice(req.path.length-1) !== '/') {
    res.redirect(301, req.path + '/' + req.url.slice(req.path.length));
  } else {
    next();
  }
});

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

app.listen(port);

process.on('SIGTERM', () => {
  process.exit();
});
