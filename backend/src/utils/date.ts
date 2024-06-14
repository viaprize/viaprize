export function dateToCron(date: Date) {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-indexed
  const dayOfWeek = date.getDay(); // 0-6, Sunday-Saturday

  return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export function addMinutes(date: Date, minutes: number): Date {
  date.setMinutes(date.getMinutes() + minutes);

  return date;
}

export function formatDateToUTC(date) {
  const pad = (num) => num.toString().padStart(2, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // getUTCMonth() returns 0-11
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function extractMinutes(isoString: string) {
  const minutesMatch = isoString.match(/:(\d{2})/);
  return minutesMatch ? parseInt(minutesMatch[1]) : null;
}
