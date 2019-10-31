# Places to Work
Create one JSON file per city.

## Tips
- Before adding a new place, make sure to search to check that it doesn't already exist
- If any information is incorrect or the ratings seem off, feel free to create a pull request
- For chains that serve the exact same food/drinks (e.g. Starbucks), consider using the same ratings as other places for consistency.

## Attributes
- `name`: name of the place
- `type`: type of space (`cafe`, `coworking space`, `lobby`, `bar`, `event space`, `public space`, `library`)
- `area`: general area name
- `google_maps`: google maps short link
- `coordinates`: location `<lat>,<lng>` (decimal)
- `station`: list station IDs (see below)
- `wifi`: how is the wifi speed, quality, and stability? (`0` = no wifi, `5` = best)
- `power`: how many power outlets are there? (`0` = no power outlets, `5` = best)
- `seats`: how easy is it to find a seat?
- `comfort`: how comfortable are the seating options?
- `quiet`: how quiet is the space?
- `food`: how is the food quality and selection? (`0` = no food, `5` = best)
- `drinks`: how is the drink quality and selection? (`0` = no drinks, `5` = best)
- `price`: how are the prices?
- `view`: how is the view? (`0` = no view/windows, `5` = best)
- `toilets`: how is the toilet? (`0` = no toilets available, `5` = best)
- `music`: is there music playing? (`true` or `false`)
- `smoking`: is smoking allowed in the primary space? (`true` or `false`)
- `hours`: what are the primary opening hours? (e.g. `09-22`)
- `time_limit`: is there are time limit? (`true` or `false`)
- `standing_tables`: are standing tables available? (`true` or `false`)
- `outdoor_seating`: is outdoor seating available? (`true` or `false`)
- `website`:
- `notes`: 
- `closed`: place has permanently closed (`true` or `false`)

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
    "station": "JY22",
    "wifi": 5,
    "power": 5,
    "seats": 5,
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
    "time_limit": false,
    "standing_tables": false,
    "outdoor_seating": false
  }
]
```
