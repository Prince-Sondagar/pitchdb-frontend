export function trimString(string: string, desiredLength: number) {
  if (string.length > desiredLength) {
    return `${string.substring(0, desiredLength)}...`;
  } else {
    return string;
  }
}
