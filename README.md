# Cafe and Cowork
Find places to work. Open and collaborative. Pull requests welcome!

## Project Structure
```
data/
  <city>/
    index.md        # City metadata (name, country, timezone, etc.)
    <place>.md      # Individual place (cafe, coworking space, etc.)
images/
  <city>/
    <place>/
      *.jpg          # Place images
```

Each city has its own directory under `data/`. The `index.md` file defines the city, and each place is a separate `.md` file alongside it. See [CITY.md](CITY.md) and [PLACE.md](PLACE.md) for templates.

## Adding or updating cities and places
Want to add or update places?
1. [Fork the repo](fork)
2. To add a new city, create `data/<city>/index.md` (see City Template below)
3. Add/edit place files under `data/<city>/<place>.md`
4. Add images under `images/<city>/<place>/`
5. Validate using `npm test`
6. Resize images using `npm run resize`
7. Submit a pull request

## City Template
Each city needs an `index.md` with the following frontmatter:

```yaml
---
id: tokyo
name: Tokyo
country: Japan
coordinates: 35.689487,139.691711
timezone: Asia/Tokyo
flag: jp
---
```

Name|Description
--|--
`id`|Unique identifier for the city (should match the directory name)
`name`|Display name of the city
`country`|Country where the city is located
`coordinates`|Coordinates `<lat>,<lng>` (decimal)
`timezone`|Timezone identifier (e.g. `Asia/Tokyo`, `Europe/Madrid`)
`flag`|ISO country code (e.g. `jp`, `tw`, `es`, `us`)

## Place Template
You can use this `.md` file template for new places:

```yaml
---
contributors:
  - <link to instagram/twitter/threads/website>
added: 2021-04-27
name: A Demain Cafe
type: Cafe
area: Nangang
google_maps: https://goo.gl/maps/zZ6Nh6aCZYkqs2Aw5
coordinates: 25.055553738210808, 121.59626418096329
address:
  en: No. 55, Chongyang Road, Nangang District, Taipei City, 115
  zh-tw: 115台北市南港區重陽路55號
station: Kunyang
hours:
  mon: 11:30-21
  tue: 11:30-21
  wed: 11:30-21
  thu: 11:30-21
  fri: 11:30-21
  sat: 9-17:30
  sun: 9-17:30
wifi: 3
speed: 10
power: 4
vacancy: 4
comfort: 4
quiet: 3
food: 5
drinks: 5
price: 4
view: 4
toilets: 3
music: true
smoking: false
standing_tables: true
outdoor_seating: false
cash_only: false
animals: false
lactose_free_milk: false
time_limit: false
facebook: https://www.facebook.com/ademainbrunch
instagram: https://www.instagram.com/ademaincafe/
telephone: "+886226515266"
website:
images:
  - seating1.jpg
  - seating2.jpg
---

You can include a written review/description here. What's good? What's bad? How's the vibe? Any tips/recommendations?

```

## Place Attributes
Name|Description
--|--
`contributors`|List of contributor profile URL (instagram, twitter, threads, website, or other link...)
`closed`|Permanently closed? `true`
`temporarily_closed`|Temporarily closed? `true`
`added`|Date added (YY-MM-DD format)
`updated`|Date updated (YY-MM-DD format) if not a new place
`name`|Name of the place (in English)
`type`|Type of space: `Cafe`, `Bar`, `Restaurant`, `Library`, `Lobby`, `Coworking Space`, `Public Space`, `Event Space`, `Lounge`, `Booth`, `Bookstore`, `Hotel`, `Pub`
`area`|General area/district/region
`google_maps`|Google Maps link
`coordinates`|Coordinates `<lat>,<lng>` (decimal)
`address`|Address, supports multi-lingual (see below)
`station`|Nearby station names (comma separated)
`hours`|Opening hours per day (see below))
`wifi`|Is there WiFi? Is it fast, reliable, and stable? `0-5`
`speed`|WiFi speed in Mbps (run a [speed test](https://fast.com))
`power`|How many seats have access to power outlets? `0-5`
`vacancy`|How easy is it to get a seat? `0-5`
`comfort`|How comfortable is the environment, temperature, seats? `1-5`
`quiet`|How quiet is the space? `1-5`
`food`|Is food served? How's the selection and quality? `0-5`
`drinks`|Are drinks served? How's the selection and quality? `0-5`
`price`|How are the prices? Is it free or good value for money? `1-5`
`view`|How's the ambiance, atmosphere, vibe, view? `0-5`
`toilets`|Are toilets available? Clean, nearby, enough of them? `0-5`
`music`|Is there background music? `true` or `false`
`smoking`|Is smoking allowed in the primary seating area? `true` or `false`
`standing_tables`|Are there standing-height tables? `true` or `false`
`outdoor_seating`|Is there outdoor seating? `true` or `false`
`cash_only`|Is this place cash only? `true` or `false`
`animals`|Are there animals or are pets allowed? `true` or `false`
`lactose_free_milk`|Are lactose free milk alternatives available? `true` or `false`
`time_limit`|Is there a time limit for staying? `true` or `false`
`facebook`|Link to Facebook page
`instagram`|Link to Instagram account
`telephone`|Telephone number (quote it in YAML)
`website`|Link to website
`images`|List of image filenames (stored in `images/<city>/<place>/`)

## Hours Syntax

Specify opening hours per day using `mon`-`sun` keys. Times use 24-hour `H/HH` or `H/HH:MM` format:

```yaml
hours:
  mon: 8-22
  tue: 8-22
  wed: 8-22
  thu: 8-22
  fri: 8-22
  sat: 9:30-17:30
  sun: 9:30-17:30
```

If the hours are the same every day, you can specify them directly as a single string:

```yaml
hours: 8-18
```

For places that are open 24 hours:

```yaml
hours: 0-24
```

Omit a day if the place is closed that day.

## Multi-lingual Support

The following attributes support localized values using language code keys:

**`address`** — provide translations as an object with language keys:
```yaml
address:
  en: No. 55, Chongyang Road, Nangang District, Taipei City
  zh-tw: 115台北市南港區重陽路55號
```

**`review`** — provide translations as an object with language keys:
```yaml
review:
  en: A great cafe with fast wifi and good coffee.
  ja: 速いWiFiと美味しいコーヒーのある素敵なカフェ。
```

If no localization is needed, both `address` and `review` can be provided as plain strings. Alternatively a body content can be provided instead of using the `review` property.

## Local Dev Environment
1. Install [Node.js](https://nodejs.org/en/)
2. Install deps: `npm install`
3. Run: `npm start`
4. Open [localhost:3000](http://localhost:3000)

## Other Commands
- `npm test` — validate all data against the schema
- `npm run resize` — resize images to 1200px max width
- `npm run links` — check for broken links (requires local server running)
