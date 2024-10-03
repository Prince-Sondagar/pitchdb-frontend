export function formatEpisodeDuration(duration: string) {
  const colonAmount = (duration.match(/:/g) || []).length;

  if (colonAmount === 0) {
    const durationInMinutes = Number(duration) / 60;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = Math.floor(durationInMinutes % 60);
    const seconds = Number(duration) - (hours * 3600 + minutes * 60);

    return (
      hours.toString().padStart(2, '0') +
      ':' +
      minutes.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0')
    );
  } else if (colonAmount === 1) {
    return '00:' + duration;
  }
}
