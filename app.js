const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const { I18n } = require('i18n');

const i18n = new I18n({
  locales: ['en', 'zh-tw'],
  directory: 'locales',
});

const data = require('./data');
const submit = require('./submit');

const app = express();
const port = 3000;

app.set('views', 'views');
app.set('view engine', 'pug');
app.set('strict routing', true);

const DEBUG = process.env.NODE_ENV !== 'production';

// Disable redirect, otherwise the middleware auto creates redirects for directories
// E.g. /taipei -> /taipei/ which conflicts with the city urls!
app.use(express.static('public', { redirect: false, maxAge: DEBUG ? 0 : '1y' }));
app.use(express.static('images', { redirect: false, maxAge: DEBUG ? 0 : '1y' }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.locals.site = {
  title: 'Cafe and Cowork',
  summary: 'Find Places to Work From',
  description: 'A curated collection of cafes and coworking spaces around the world. Find the best places with power outlets and fast WiFi to work or study from.',
  url: 'https://cafeandcowork.com',
  github: 'https://github.com/pqvst/cafeandcowork',
  instagram: 'https://instagram.com/cafeandcowork',
};

app.locals.DEBUG = DEBUG;
app.locals.v = Date.now();
app.locals.marked = require('marked');

Object.assign(app.locals, require('./view-helpers'));
Object.assign(app.locals, data.load());

function redirectWithTrailingSlash(req, res) {
  res.redirect(301, req.path + '/' + req.url.slice(req.path.length));
}

app.use(i18n.init);

for (const locale of i18n.getLocales()) {
  const prefix = locale == 'en' ? '' : `/${locale}`;

  app.use(`${prefix}/`, (req, res, next) => {
    req.setLocale(locale);

    res.locals.prefix = prefix;

    res.locals.site = Object.assign({}, app.locals.site, {
      title: req.__(app.locals.title),
      summary: req.__(app.locals.summary),
      description: req.__(app.locals.description),
    });
    
    next();
  });

  if (prefix) {
    app.get(`${prefix}`, redirectWithTrailingSlash);
  }
  app.get(`${prefix}/`, (req, res) => {
    res.render('index', { url: '/' });
  });

  for (const city of app.locals.cities) {
    app.get(`${prefix}/${city.id}`, redirectWithTrailingSlash);
    app.get(`${prefix}/${city.id}/`, (req, res) => {
      res.render('city', {
        title: city.title,
        description: city.description,
        url: city.url,
        city
      });
    });
    for (const place of city.places) {
      app.get(`${prefix}/${city.id}/${encodeURI(place.id)}`, redirectWithTrailingSlash);
      app.get(`${prefix}/${city.id}/${encodeURI(place.id)}/`, (req, res) => {
        res.render('place', {
          title: place.title,
          description: place.description,
          url: place.url,
          image: place.images && place.images.length > 0 ? place.images[0] : null,
          city,
          place
        });
      });
    }
  }  

}

const submissionLimiter = rateLimit({
  keyGenerator: () => 'all',
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit to 10 submissions per 5 minutes
});

app.get('/submit', redirectWithTrailingSlash);
app.get('/submit/', (req, res) => {
  res.render('submit', { title: 'Submit' });
});

app.post('/submit/', submissionLimiter, async (req, res) => {
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
  res.render('feed', { recent: app.locals.recent, pretty: true });
});

app.use((req, res) => {
  res.status(404).render('error');
});

app.listen(port);

process.on('SIGTERM', () => {
  process.exit();
});

