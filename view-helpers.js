const moment = require('moment-timezone');

exports.formatDate = function (date) {
  return moment(date).format('MMM D, YYYY');
}

exports.formatScore = function (n) {
  return n.toFixed(1);
}

exports.getValueText = function (value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return value + ' ★';
}

exports.getValueColor = function (value) {
  if (value === true) return 'blue';
  if (value === false) return 'orange';
  if (value != null) {
    value = value.toFixed(1);
    if (value >= 5) return 'blue';
    if (value >= 4) return 'green';
    if (value >= 3) return 'yellow';
    if (value >= 2) return 'orange';
    if (value >= 1) return 'red';
    if (value >= 0) return 'grey';
  }
  return 'grey';
}

exports.formatUrl = function(url) {
  return decodeURI(url)
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/$/, '');
}

exports.truncate = function(s) {
  if (s.length >= 300) {
    let trimmed = s.slice(0, 250);
    trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
    return trimmed + '...';
  }
}


//=====================================================================================
// Time/Hours Helpers
//=====================================================================================


function formatTime(time) {
  let hour = Math.floor(time / 100);
  let min = time % 100;
  if (hour >= 24) hour -= 24;
  if (hour < 10) hour = '0' + hour;
  if (min < 10) min = '0' + min;
  return [hour, min].join(':');
}

exports.formatHours = function(hours) {
  return hours.map(formatTime).join(' - ');
}


//=====================================================================================
// Open/Close Helpers
//=====================================================================================


// Get current day of week, adjusted for late hours (until 5am)
function getAdjustedDay(m) {
  const dow = m.day();
  const hour = m.hour();
  if (hour < 5) {
    return (dow == 0) ? 6 : dow - 1;
  } else {
    return dow;
  }
}

// Get current time, adjusted for late hours (until 5am)
function getAdjustedTime(m) {
  let hour = m.hour();
  const min = m.minutes();
  if (hour < 5) {
    hour += 24;
  }
  return (hour * 100) + min;
}

exports.isOpeningSoon = function(city, place) {
  const m = moment.tz(city.timezone);
  const dow = getAdjustedDay(m);
  const time = getAdjustedTime(m);
  if (place.hours) {
    if (place.hours[dow]) {
      return time < place.hours[dow][0];
    }
  }
  return false;
}

exports.isClosingSoon = function(city, place) {
  const m = moment.tz(city.timezone);
  const dow = getAdjustedDay(m);
  const time = getAdjustedTime(m);
  if (place.hours) {
    if (place.hours[dow]) {
      const closingIn = place.hours[dow][1] - time;
      return closingIn > 0 && closingIn <= 100;
    }
  }
  return false;
}

exports.isClosedToday = function(city, place) {
  const m = moment.tz(city.timezone);
  const dow = getAdjustedDay(m);
  if (place.hours) {
    return !place.hours[dow];
  } else {
    return false;
  }
}

exports.isClosedNow = function(city, place) {
  const m = moment.tz(city.timezone);
  const dow = getAdjustedDay(m);
  const time = getAdjustedTime(m);
  if (place.hours) {
    if (place.hours[dow]) {
      return time < place.hours[dow][0] || time >= place.hours[dow][1];
    } else {
      return true;
    }
  } else {
    return false;
  }
}

exports.getOpeningTime = function(city, place) {
  const m = moment.tz(city.timezone);
  const dow = getAdjustedDay(m);
  if (place.hours && place.hours[dow]) {
    return formatTime(place.hours[dow][0]);
  }
}

exports.getClosingTime = function(city, place) {
  const m = moment.tz(city.timezone);
  const dow = getAdjustedDay(m);
  if (place.hours && place.hours[dow]) {
    return formatTime(place.hours[dow][1]);
  }
}

exports.isOpen24Hours = function(city, place, dow) {
  const m = moment.tz(city.timezone);
  if (dow == null) {
    dow = getAdjustedDay(m);
  }
  if (place.hours && place.hours[dow]) {
    return place.hours[dow][0] == 0 && place.hours[dow][1] == 2400;
  } else {
    return false;
  }
}
