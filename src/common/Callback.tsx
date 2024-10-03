import { useEffect } from 'react';
import {
  processSocialAuthenticationHelper,
  processEmailConfigurationHelper,
} from '../redux/authentication/helpers';
import { callbackTypes, loadingDisplayTypes } from '../types';
import { useAppDispatch } from '../redux/hooks';
import { LoadingDisplay } from './LoadingDisplay';

interface IProps {
  type: callbackTypes;
}

export function Callback({ type }: IProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    switch (type) {
      case callbackTypes.authentication:
        processSocialAuthenticationHelper({ dispatch });
        break;
      case callbackTypes.emailConfiguration:
        processEmailConfigurationHelper({ dispatch });
        break;
      default:
        null;
    }
  }, [type, dispatch]);

  return <LoadingDisplay type={loadingDisplayTypes.entireScreen} />;
}
