export function minutesToHoursAndMinutes(minute: number) {
  let result: string = "";
  if (Math.floor(minute / 60) > 0) {
    result += `${Math.floor(minute / 60)}h`;
  }
  if (minute % 60 > 0) {
    result += `${minute % 60}m`;
  }
  return result;
}

export function timestampToYear(timestamp: number) {
  if(timestamp) {
    const date = new Date(timestamp * 1000);

    return date.getFullYear()
  }
}