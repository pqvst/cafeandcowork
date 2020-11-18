# Cafe and Cowork
Find places to work. Open and collaborative. Pull requests welcome!

## Adding or updating cities and places
Want to add or update places?
1. [Fork the repo](fork)
2. Add/edit files under `data/<city>/<place>.md`
3. Recommended: validate using `yarn test`
4. Submit a pull request

## Template
You can use this `.md` file template for new places:

```
---
added: 2020-10-19
name: Milk Bar by BKA
type: Cafe
area: Songshan
google_maps: https://g.page/Milkbarbybka?share
coordinates: 25.052553, 121.545712
address: No. 6-1號, Lane 269, Section 3, Nanjing E Rd, Songshan District, Taipei City, Taiwan 105
station: Nanjing Fuxing
opens: "09:00-10:00"
closes: "18:00-21:00"
wifi: 2
speed: 4
power: 5
vacancy: 5
comfort: 3
quiet: 3
food: 4
drinks: 4
price: 4
view: 3
toilets: 5
music: true
smoking: false
standing_tables: false
outdoor_seating: true
cash_only: false 
animals: true
facebook: https://www.facebook.com/milkbarbybka
instagram: https://www.instagram.com/milkbarbybka/
telephone: "+886227133118"
website: 
---

```
## Attributes
Name|Description
--|--
`name`|What is the name of this place? Please provide it in English.
type|Type of space `Cafe`, `Bar`, `Restaurant`, `Library`, `Lobby`, `Coworking Space`, `Public Space`, `Event Space`, `Lounge`, `Booth`, ```Bookstore`
`area`|General area/district/region
`google_maps`|Provide a Google maps link to the place you want to submit.
`coordinates`|Coordinates `<lat>,<lng>` (decimal)
`address`|Address
`opens`|Open hours
`closes`|Close hours
`station`|List station names (comma separated)
`wifi`|Is there WiFi? Is the WiFi fast, reliable, and stable? `0-5`
`speed`|Run a [speedtest](https://fast.com) (mbps)
`power`|How many of the seats have access to power outlets? `0-5`
`vacancy`|How easy is it to get a seat? Is it usually empty or always very `crowded`? `1-5`
`comfort`|How comfortable is the environment, temperature, seats, etc. `1-5`
`quiet`|How quiet is the space? Is it completely silent or very noisy? `1-5`
`food`|Is food served? If so, how's the selection and quality? `0-5`
`drinks`|Are drinks served? If so, how's the selection and quality? `0-5`
`price`|How are the prices? Is it free or good value for money? `1-5`
`view`|How's the ambiance, atmosphere, vibe, view? `1-5`
`toilets`|Are toilets available? If so, are they clean, near by, enough of `them`? `0-5`
`music`|Is there music playing in the background? `true` or `false`
`smoking`|Are you allowed to smoke in the primary seating area? `true` or `false`
`standing_tables`|Are there any tables where you can stand up and work? `true` or `false`
`outdoor_seating`|Is there any seating outside? `true` or `false`
`cash_only`|Is this place cash only? `true` or `false`
`animals`|Are there animals in the cafe or are you allowed to bring pets? `true` or `false`
`facebook`|Link to facebook page
`instagram`|Link to instagram account
`telephone`|Telephone number
`website`|Link to website
`closed`|Permanently closed? `true` or `false`

## Local Dev Environment
1. Install [nodejs](https://nodejs.org/en/)
2. Install deps `npm install`
3. Run `npm start`
4. Open [localhost:3000](http://localhost:3000)
