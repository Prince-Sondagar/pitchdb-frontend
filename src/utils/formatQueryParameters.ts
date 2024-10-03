export function formatQueryParameters(searchParameters: any) {
  const parameterKeys = Object.keys(searchParameters);
  let formatted = '';

  parameterKeys.map((key) => (formatted += `&${key}=${searchParameters[key]}`));

  return formatted.slice(1);
}
