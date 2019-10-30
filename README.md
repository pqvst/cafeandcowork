# Best Places to Work
Create one JSON file per city.

## Example

tokyo.json:

```json
[
  {
    "name": "AWS Loft Tokyo",
    "type": "Coworking Space",
    "location": "Meguro",
    "google_maps": "https://goo.gl/maps/h2FiX7CnMEs5TZ5b6",
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
    "hours": "10-18",
    "time_limit": false,
    "standing_tables": false,
    "outdoor_seating": false,
  }
]
```


## Attributes
- `name`: name of the place
- `type`: type of space (`cafe`, `coworking space`, `lobby`, `bar`, `event space`, `public space`, `library`)
- `location`: general location name
- `google_maps`: google maps short link
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
- `toilet`: how is the toilet? (`0` = no toilets available, `5` = best)
- `music`: is there music playing? (`true` or `false`)
- `smoking`: is smoking allowed in the primary space? (`true` or `false`)
- `hours`: what are the primary opening hours? (e.g. `09-22`)
- `time_limit`: is there are time limit? (`true` or `false`)
- `standing_tables`: are standing tables available? (`true` or `false`)
- `outdoor_seating`: is outdoor seating available? (`true` or `false`)
- `website`:
- `notes`: 
- `closed`: place has permanently closed
