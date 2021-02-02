
function avg(arr) {
  let n = 0;
  let t = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] != null) {
      n++;
      t += arr[i];
    }
  }
  return n == 0 ? 0 : t / n;
}

exports.getScore = function(place) {
  let score = avg([place.wifi, place.power, place.vacancy, place.comfort, place.quiet, place.drinks, place.food, place.price, place.view, place.toilets]);
  if (place.smoking) score -= 0.1;
  if (place.standing_tables) score += 0.1;
  if (place.outdoor_seating) score += 0.1;
  if (place.cash_only) score -= 0.1;
  return Math.min(score, 5);
}

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

exports.getHours = function(hours) {
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

function getTimes(span) {
  if (!span) return null;
  const times = span.split('-');
  return times.map(time => {
    let [hour, min] = time.split(':').map(Number);
    let value = (hour * 100) + (min || 0);
    if (value < 500) {
      value += 2400;
    }
    return value;
  });
}
