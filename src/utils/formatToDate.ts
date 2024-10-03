export function formatToDate(date: Date | string | null) {
  if (date instanceof Date) {
    return date;
  } else if (date) {
    return new Date(date);
  }

  return new Date();
}
