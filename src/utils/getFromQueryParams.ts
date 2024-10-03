export const getFromQueryParams = (queryParams: string[], parameter: string) => {
  let foundCode: string | undefined;

  queryParams.forEach((element) => {
    if (element.includes(parameter + '=')) {
      const splitIndex = element.indexOf('=');
      foundCode = element.substring(splitIndex + 1, element.length);
    }
  });

  return foundCode;
};
