# Cafe and Cowork
Find places to work. Open and collaborative. Pull requests welcome!

## Adding or updating cities and places
Want to add or update places?
1. [Fork the repo](fork)
2. Add/edit files under `data/<city>/<place>.md`
3. Add images under `images/<city>/<place>/`
4. Validate using `yarn test` or `npm test`
5. Resize images using `yarn run resize` or `npm run resize`
6. Submit a pull request

## Template
You can use this `.md` file template for new places:

```
---
contributors:
  - https://www.instagram.com/CHANGE-ME/ [insert your instagram here]
added: 2021-04-27
name: A Demain Cafe
type: Cafe
area: Nangang
google_maps: https://goo.gl/maps/zZ6Nh6aCZYkqs2Aw5
coordinates: 25.055553738210808, 121.59626418096329
address:
  en: No. 55號, Chongyang Road, Nangang District, Taipei City, 115
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
facebook: https://www.facebook.com/ademainbrunch
instagram: https://www.instagram.com/ademaincafe/
telephone: "+886226515266"
website:
images:
  - seating1.jpg [stored in images/<city>/<place>/]
  - seating2.jpg
  - seating4.jpg
  - seating3.jpg
  - interior.jpg
  - menu1.jpg
  - menu2.jpg
  - menu3.jpg
  - menu4.jpg
---

Lorem Ipsum you can include a written review/description here. What's good? What's bad? How's the vibe? Any tips/recommendations?

```
## Attributes
Name|Description
--|--
`name`|What is the name of this place? Please provide it in English.
type|Type of space `Cafe`, `Bar`, `Restaurant`, `Library`, `Lobby`, `Coworking Space`, `Public Space`, `Event Space`, `Lounge`, `Booth`, ```Bookstore`
`area`|General area/district/region
`google_maps`|Provide a Google maps link to the place you want to submit.
`coordinates`|Coordinates `<lat>,<lng>` (decimal)
`address`|Address (you can include localized addresses as well, see example above).
`hours`|Opening hours (per day or same for all days, see example above).
`station`|List station names (comma separated)
`wifi`|Is there WiFi? Is the WiFi fast, reliable, and stable? `0-5`
`speed`|Run a [speed test](https://fast.com) (mbps)
`power`|How many of the seats have access to power outlets? `0-5`
`vacancy`|How easy is it to get a seat? Is it usually empty or always very `crowded`? `1-5`
`comfort`|How comfortable is the environment, temperature, seats, etc. `1-5`
`quiet`|How quiet is the space? Is it completely silent or very noisy? `1-5`
`food`|Is food served? If so, how's the selection and quality? `0-5`
`drinks`|Are drinks served? If so, how's the selection and quality? `0-5`
`price`|How are the prices? Is it free or good value for money? `1-5`
`view`|How's the ambiance, atmosphere, vibe, view? `1-5`
`toilets`|Are toilets available? If so, are they clean, near by, enough of them? `0-5`
`music`|Is there music playing in the background? `true` or `false`
`smoking`|Are you allowed to smoke in the primary seating area? `true` or `false`
`standing_tables`|Are there any tables where you can stand up and work? `true` or `false`
`outdoor_seating`|Is there any seating outside? `true` or `false`
`cash_only`|Is this place cash only? `true` or `false`
`animals`|Are there animals in the cafe or are you allowed to bring pets? `true` or `false`
`lactose_free_milk`|Are lactose free milk alternatives available (like oatly)? `true` or `false`
`facebook`|Link to facebook page
`instagram`|Link to instagram account
`telephone`|Telephone number
`website`|Link to website
`closed`|Permanently closed? `true` or `false`
`temporarily_closed`|Temporarily closed? `true` or `false`

## Local Dev Environment
1. Install [nodejs](https://nodejs.org/en/)
2. Install deps `npm install`
3. Run `npm start`
4. Open [localhost:3000](http://localhost:3000)
