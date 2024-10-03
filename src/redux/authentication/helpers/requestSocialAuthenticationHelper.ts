import randomstring from 'randomstring';
import { AnyAction, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import { socialNetworks } from '../../../constants';
import { setCookies } from '../../cookies';
import { requestSocialAuthentication } from '..';
import { type RootState } from '../../store';

interface IProps {
  socialSite: socialNetworks;
  isSignIn: boolean;
  dispatch: ThunkDispatch<RootState, undefined, AnyAction> & Dispatch<AnyAction>;
}

export async function requestSocialAuthenticationHelper({
  socialSite,
  isSignIn,
  dispatch,
}: IProps) {
  const stateString = randomstring.generate(20);

  dispatch(
    setCookies({
      key: 'stateString',
      value: stateString,
    }),
  );
  dispatch(
    setCookies({
      key: 'isSignIn',
      value: `${isSignIn}`,
    }),
  );

  const dualScreenLeft = window.screenLeft ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop ? window.screenTop : window.screenY;
  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : window.screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : window.screen.height;
  const w = 450;
  const h = 650;
  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;

  const newWindow = window.open(
    '',
    '_blank',
    'scrollbars=yes, width=' +
      w / systemZoom +
      ', height=' +
      h / systemZoom +
      ', top=' +
      top +
      ', left=' +
      left,
  );

  const socialAuthLink = await dispatch(
    requestSocialAuthentication({ socialSite, isSignIn }),
  ).unwrap();

  if (newWindow && socialAuthLink) {
    newWindow.location.href = `${socialAuthLink}&state=${stateString}`;
    newWindow.focus();
  }
}
