import { useCallback, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { useAppDispatch } from '../redux/hooks';
import { removeCookies } from '../redux/cookies';
import { errorAlert } from '../redux/alerts';
import { authMessages } from '../constants';

export function useAuthenticationListener() {
  const dispatch = useAppDispatch();

  const recieveMessage = useCallback(
    (event: MessageEvent) => {
      const cookies = new Cookies();
      const { protocol, port } = window.location;
      const slashes = protocol.concat('//');
      const host = slashes.concat(window.location.hostname + ':' + port);

      switch (event.data) {
        case 'auth':
          window.location.href = host + '/main/dashboard';
          break;
        case 'email-config':
          window.location.href = host + '/main/configuration?element=email';
          break;
        case 'connectsign':
          window.location.href = host + '/main/configuration?element=connect';
          break;
        case authMessages.POST_AUTH_ERROR:
          dispatch(errorAlert(cookies.get(authMessages.COOKIES_AUTH_ERROR)));
          dispatch(removeCookies(authMessages.COOKIES_AUTH_ERROR));
          break;
        case authMessages.POST_EMAIL_ERROR:
          dispatch(
            errorAlert(
              'There was an error connecting your email: ' +
                cookies.get(authMessages.COOKIES_EMAIL_ERROR),
            ),
          );
          dispatch(removeCookies(authMessages.COOKIES_EMAIL_ERROR));
          break;
        case authMessages.POST_CONNECT_ERROR:
          dispatch(
            errorAlert(
              'There was an error connecting your email: ' +
                cookies.get(authMessages.COOKIES_CONNECT_ERROR),
            ),
          );
          dispatch(removeCookies(authMessages.COOKIES_CONNECT_ERROR));
          break;
        default:
          null;
      }
    },
    [dispatch],
  );

  useEffect(() => {
    window.addEventListener('message', recieveMessage, false);
    return () =>
      window.removeEventListener('message', () => console.log('Authentication handled.'));
  }, [recieveMessage]);
}
