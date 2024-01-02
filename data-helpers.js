
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

export function getScore(place) {
  let score = avg([place.wifi, place.power, place.vacancy, place.comfort, place.quiet, place.drinks, place.food, place.price, place.view, place.toilets]);
  if (place.wifi === 0) score -= 0.2;
  if (place.power === 0) score -= 0.2;
  if (place.smoking) score -= 0.1;
  if (place.standing_tables) score += 0.1;
  if (place.outdoor_seating) score += 0.1;
  if (place.cash_only) score -= 0.1;
  if (place.time_limit) score -= 0.1;
  return Math.max(0, Math.min(score, 5));
}

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function getHours(hours) {
  if (hours) {
    const res = [];
    if (typeof hours === 'string') {
      for (const day of DAYS) {
        res.push(getTimes(hours));
      }
    } else {
      for (const day of DAYS) {
        res.push(getTimes(hours[day]));
      }
    }
    return res;
  } else {
    return null;
  }
}

export function getReview(place) {
  if (place.review) {
    return place.review;
  } else if (place.content) {
    return { en: place.content };
  } else {
    return {};
  }
}

function getTimes(span) {
  if (!span) return null;
  const times = span.split('-');
  let [open, close] = times.map((time, i) => {
    let [hour, min] = time.split(':').map(Number);
    return (hour * 100) + (min || 0);
  });
  if (close < 500) {
    close += 2400;
  }
  return [open, close];
}
