export function formatExternalLinkCorrently(link: string) {
  if (link.includes('http://') || link.includes('https://')) {
    return link;
  } else {
    return `https://${link}`;
  }
}
