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
  if (value >= 5) return 'blue';
  if (value >= 4) return 'green';
  if (value >= 3) return 'yellow';
  if (value >= 2) return 'orange';
  if (value >= 1) return 'red';
  if (value >= 0) return 'grey';
  return 'grey';
}
