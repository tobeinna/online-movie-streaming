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
  if (timestamp) {
    const date = new Date(timestamp * 1000);

    return date.getFullYear();
  }
}

export function timestampToDate(timestamp: number) {
  if (timestamp) {
    const date = new Date(timestamp * 1000);

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
}

export function formatDateToYearMonthDay(date: Date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function convertYearMonthDayToUTCDate(dateString: string) {
  const tempReleaseDate = new Date(dateString);
  tempReleaseDate.setDate(tempReleaseDate.getDate() - 1);
  tempReleaseDate.setUTCHours(17);

  return tempReleaseDate;
}
