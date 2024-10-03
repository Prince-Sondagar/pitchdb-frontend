import Cookies from 'universal-cookie';
import { getFromQueryParams, verifyStateFromQueryParams } from '../../../utils';
import { processEmailConfiguration } from '..';
import { setCookies } from '../../cookies';
import { authMessages } from '../../../constants';
import { AnyAction, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { type RootState } from '../../store';

interface IProps {
  dispatch: ThunkDispatch<RootState, undefined, AnyAction> & Dispatch<AnyAction>;
}

export async function processEmailConfigurationHelper({ dispatch }: IProps) {
  const cookies = new Cookies();
  const queryParams = window.location.search.substring(1).split('&');
  const jwt = cookies.get('jwt');

  if (verifyStateFromQueryParams(queryParams)) {
    const emailAuthNetwork = cookies.get('emailAuthNetwork');

    const sendBody = {
      code: getFromQueryParams(queryParams, 'code') || '',
      state: getFromQueryParams(queryParams, 'state'),
    };

    await dispatch(processEmailConfiguration({ jwt, emailAuthNetwork, sendBody })).unwrap();

    window.opener.postMessage('email-config', window.opener.origin);
  } else {
    dispatch(
      setCookies({
        key: authMessages.COOKIES_AUTH_ERROR,
        value:
          'There was a problem performing the ' +
          (cookies.get('isSignIn') === 'true' ? 'sign-in' : 'sign-out') +
          ', please try again.',
      }),
    );
    window.opener.postMessage(authMessages.POST_AUTH_ERROR, window.opener.origin);
  }
  setTimeout(window.close, 400);
}
