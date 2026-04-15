export const eachStayDate = (checkIn, checkOut) => {
  const dates = [];
  const cursor = new Date(checkIn);
  const end = new Date(checkOut);

  while (cursor < end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

export const normalizeDate = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const nightsBetween = (checkIn, checkOut) => {
  const ms = normalizeDate(checkOut) - normalizeDate(checkIn);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};
