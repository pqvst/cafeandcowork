# Cafe & Cowork
Find places to work. Open and collaborative. Pull requests welcome!

## Updating a city
Want to add/update places in a city?
1. [Fork the repo](fork)
2. Edit the JSON file (`data/cities/<name>.json`)
3. Submit a pull request
4. Recommended: validate JSON using `npm test`

## Adding a new city
Want to add a new city?
1. Create a JSON file listing places (`data/cities/<name>.json`) 
2. Create an HTML file with basic metadata (`_cities/<city>.html`)
3. Add the city to the nav bar in `_layout/default.html` (not automatic yet...)
4. Recommended: validate JSON using `npm test`

## Tips
- Before adding a new place, make sure to search to check that it doesn't already exist
- If any information is incorrect or the ratings seem off, feel free to create a pull request
- For chains that serve the exact same food/drinks (e.g. Starbucks), consider using the same ratings as the other places for consistency.

## Attributes
- `name`: name of the place
- `type`: type of space:
  - `Cafe`: 
  - `Bar`: 
  - `Restaurant`: 
  - `Library`: 
  - `Lobby`: Hotel lobby
  - `Coworking Space`: A dedicated coworking space (free or paid)
  - `Public Space`: Any open public space
  - `Event Space`: 
  - `Lounge`: Hotel, airport, or other type of lounge
  - `Booth`: A work pod/booth
  - `Bookstore`: Bookstore
- `area`: general area name
- `google_maps`: google maps short link
- `coordinates`: location `<lat>,<lng>` (decimal)
- `station`: list station names/ids, comma separated (see below)
- `wifi`: how is the wifi speed, quality, and stability? (`0` = no wifi, `5` = very good wifi)
- `speed`: wifi download speed (Mbps) e.g. using fast.com
- `power`: how many power outlets are there? (`0` = no power outlets, `5` = best)
- `vacancy`: how easy is it to find a seat? (`1` = very busy/difficult to get a seat, `5` = very easy to get a seat)
- `comfort`: how comfortable are the seating options? (`1` = very uncomfortable, `5` = very comfortable/ergonomic)
- `quiet`: how quiet is the space? (`1` = very noisy, `5` = very quiet)
- `food`: how is the food quality and selection? (`0` = no food, `5` = best)
- `drinks`: how is the drink quality and selection? (`0` = no drinks, `5` = best)
- `price`: how are the prices? (`1` = very expensive, `5` = very cheap/free)
- `view`: how is the view? (`0` = no view/windows, `5` = best)
- `toilets`: how is the toilet? (`0` = no toilets available, `5` = best)
- `music`: is there music playing? (`true` or `false`)
- `smoking`: is smoking allowed in the primary space? (`true` or `false`)
- `hours`: what are the primary opening hours? (e.g. `09-22`)
- `standing_tables`: are standing tables available? (`true` or `false`)
- `outdoor_seating`: is outdoor seating available? (`true` or `false`)
- `tips`: array of tips/suggestions/advice
- `closed`: place has permanently closed (`true` or `false`)
- `animals`: are animals present in the café? (`true` or `false`)

## Example

tokyo.json:

```json
[
  {
    "name": "AWS Loft Tokyo",
    "type": "Coworking Space",
    "area": "Meguro",
    "google_maps": "https://goo.gl/maps/h2FiX7CnMEs5TZ5b6",
    "coordinates": "35.6333455,139.7144",
    "station": "JY22,G01",
    "wifi": 5,
    "power": 5,
    "vacancy": 5,
    "comfort": 5,
    "quiet": 5,
    "drinks": 5,
    "food": 5,
    "price": 5,
    "view": 5,
    "toilets": 5,
    "music": true,
    "smoking": true,
    "hours": "10:00-18:00",
    "standing_tables": false,
    "outdoor_seating": false
  }
]
```

## Local Dev Environment
1. Install [Jekyll](https://jekyllrb.com/docs/installation/macos/)
2. Run `bash serve.sh`
