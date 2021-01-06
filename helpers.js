const dateFormat = require('dateformat');

exports.formatRssDate = function (date) {
  return dateFormat(date, 'ddd, dd mmm yyyy 00:00:00 +0000');
}

exports.formatAgo = function (date) {
  date = new Date(date);
  const today = new Date();
  const days = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (days <= 0) return 'Today';
  if (days == 1) return 'Yesterday';
  if (days <= 7) return `${days} days ago`;
  if (days <= 30) return `${weeks} weeks ago`;
}

exports.formatDate = function (date) {
  return dateFormat(date, 'mmm d, yyyy');
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

function formatTime(time) {
  let [hour, min] = time.split(':');
  if (min == null) min = 0;
  min = Number(min);
  hour = Number(hour);
  if (hour < 10) hour = '0' + hour;
  if (min < 10) min = '0' + min;
  return [hour, min].join(':');
}

exports.formatUrl = function(url) {
  return decodeURI(url)
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/$/, '');
}

function getTimes(span) {
  if (!span) return null;
  const times = span.split('-');
  return times.map(formatTime);
}

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function getHours(hours) {
  if (hours) {
    const res = [];
    if (typeof hours === 'string') {
      for (const day of days) {
        res.push(getTimes(hours));
      }
    } else {
      for (const day of days) {
        res.push(getTimes(hours[day]));
      }
    }
    return res;
  } else {
    return null;
  }
}

exports.formatHours = function(hours) {
  if (!hours) return 'Closed';
  const times = hours.split('-');
  return times.map(formatTime).join(' - ');
}

exports.formatOpens = function(hours) {
  return getHours(hours);
}

exports.getOpeningTime = function(hours) {
  hours = getHours(hours);
  const dow = (new Date).getDay();
  if (hours && hours[dow]) {
    return hours[dow][0];
  }
}

exports.getClosingTime = function(hours) {
  hours = getHours(hours);
  const dow = (new Date).getDay();
  if (hours && hours[dow]) {
    return hours[dow][1];
  }
}

exports.isOpenToday = function(hours) {

  hours = getHours(hours);
  const dow = (new Date).getDay();
  return !hours || hours[dow];
}
