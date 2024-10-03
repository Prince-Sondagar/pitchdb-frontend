import Cookies from 'universal-cookie';

export const verifyStateFromQueryParams = (queryParams: string[]) => {
  const cookies = new Cookies();
  let found = false;

  queryParams.forEach((queryParam) => {
    if (queryParam.includes('state=') && cookies.get('stateString') === queryParam.split('=')[1]) {
      found = true;
    }
  });

  return found;
};
