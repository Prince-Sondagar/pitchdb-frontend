import Cookies from 'universal-cookie';
import { getFromQueryParams, verifyStateFromQueryParams } from '../../../utils';
import {
  IProcessSocialAuthenticationBody,
  processSignConfiguration,
  processSocialAuthentication,
} from '..';
import { removeCookies, setCookies, setUserJWT } from '../../cookies';
import { authMessages } from '../../../constants';
import { AnyAction, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { type RootState } from '../../store';

interface IProps {
  dispatch: ThunkDispatch<RootState, undefined, AnyAction> & Dispatch<AnyAction>;
}

export async function processSocialAuthenticationHelper({ dispatch }: IProps) {
  const cookies = new Cookies();
  const queryParams = window.location.search.substring(1).split('&');

  const sendBody: IProcessSocialAuthenticationBody = {
    code: decodeURIComponent(getFromQueryParams(queryParams, 'code') || ''),
    isSignIn: cookies.get('isSignIn') || false,
  };

  const inviteToken = cookies.get('inviteToken');
  if (inviteToken && inviteToken !== 'false') {
    sendBody.invitationToken = inviteToken;
  }

  if (verifyStateFromQueryParams(queryParams)) {
    const authNetwork = cookies.get('authNetwork');

    if (cookies.get('signconfig') === 'y') {
      const jwt = cookies.get('jwt');

      const response = await dispatch(
        processSignConfiguration({ jwt, authNetwork, sendBody }),
      ).unwrap();

      if (response?.token) {
        dispatch(removeCookies('signconfig'));
        dispatch(setUserJWT(response.token));

        window.opener.postMessage('connectsign', window.opener.origin);
      }
    } else {
      const response = await dispatch(
        processSocialAuthentication({ authNetwork, sendBody }),
      ).unwrap();

      if (response?.token) {
        if (inviteToken && inviteToken !== 'false') {
          dispatch(removeCookies('inviteToken'));
        }

        dispatch(setUserJWT(response.token));
        window.opener.postMessage('auth', window.opener.origin);
      }
    }
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
