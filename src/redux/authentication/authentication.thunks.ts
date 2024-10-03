import axios, { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authMessages, socialNetworks } from '../../constants';
import { authenticationStoreKey } from '.';
import { errorAlert } from '../alerts';
import { setCookies } from '../cookies';

interface IRequestSocialAuthentication {
  socialSite: socialNetworks;
  isSignIn: boolean;
  isEmailConfiguration?: boolean;
}

export interface IProcessSocialAuthenticationBody {
  code: string;
  isSignIn: boolean;
  invitationToken?: string; // TODO: This should be a boolean and the backend should expect so
}

interface IProcessSignConfiguration {
  jwt: string;
  authNetwork: socialNetworks;
  sendBody: IProcessSocialAuthenticationBody;
}

interface IProcessProcessSocialAuthentication {
  authNetwork: socialNetworks;
  sendBody: IProcessSocialAuthenticationBody;
}

interface IProcessEmailConfiguration {
  jwt: string;
  emailAuthNetwork: socialNetworks;
  sendBody: {
    code: string;
    state?: string;
  };
}

interface IProcessRegularAuthentication {
  email: string;
  password: string;
}

interface IResetPassword {
  email: string;
}

const basePath = import.meta.env.VITE_API_BASE_URL;
const authPath = `${basePath}/auth`;
const emailConfigPath = `${basePath}/email-accounts`;

export const requestSocialAuthentication = createAsyncThunk(
  `${authenticationStoreKey}/requestSocialAuthentication`,
  async (params: IRequestSocialAuthentication, thunkApi) => {
    const { socialSite, isSignIn, isEmailConfiguration } = params;
    let requestPath: string | undefined;

    if (isEmailConfiguration) {
      requestPath = `${basePath}/email-accounts/${socialSite}`;
    } else {
      requestPath = `${authPath}/${socialSite}?isSignIn=${isSignIn}`;
    }

    try {
      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        thunkApi.dispatch(errorAlert(error.message));
      }
    }
  },
);

export const processSocialAuthentication = createAsyncThunk(
  `${authenticationStoreKey}/processSocialAuthentication`,
  async (params: IProcessProcessSocialAuthentication, thunkApi) => {
    const { authNetwork, sendBody } = params;

    try {
      const response = await axios.post(`${authPath}/${authNetwork}/login`, sendBody);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<string>;

      thunkApi.dispatch(
        setCookies({
          key: authMessages.COOKIES_AUTH_ERROR,
          value: err.response?.data || 'Error, please try again later.',
        }),
      );
      window.opener.postMessage(authMessages.POST_AUTH_ERROR, window.opener.origin);
    }
  },
);

export const processRegularAuthentication = createAsyncThunk(
  `${authenticationStoreKey}/processRegularAuthentication`,
  async (loginData: IProcessRegularAuthentication, thunkApi) => {
    try {
      const response = await axios.post(`${authPath}/login`, loginData);

      return response.data;
    } catch (error) {
      const err = error as AxiosError<string>;
      if (err.response) {
        thunkApi.dispatch(errorAlert(err.response.data ?? 'Error, please try again later.'));
      } else {
        throw error;
      }
    }
  },
);

export const processSignConfiguration = createAsyncThunk(
  `${authenticationStoreKey}/processSignConfiguration`,
  async (params: IProcessSignConfiguration, thunkApi) => {
    const { jwt, authNetwork, sendBody } = params;

    try {
      const response = await axios.put(`${basePath}/users/social-login/${authNetwork}`, sendBody, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<string>;

      thunkApi.dispatch(
        setCookies({
          key: authMessages.COOKIES_AUTH_ERROR,
          value: err.response?.data ?? 'Error, please try again later.',
        }),
      );
      window.opener.postMessage(authMessages.POST_CONNECT_ERROR, window.opener.origin);
    }
  },
);

export const processEmailConfiguration = createAsyncThunk(
  `${authenticationStoreKey}/processEmailConfiguration`,
  async (params: IProcessEmailConfiguration, thunkApi) => {
    const { jwt, emailAuthNetwork, sendBody } = params;
    let requestPath: string;

    if (emailAuthNetwork === socialNetworks.GMAIL) {
      requestPath = `${emailConfigPath}/gmail-activation`;
    } else {
      requestPath = `${emailConfigPath}/${emailAuthNetwork}/configure`;
    }

    try {
      const response = await axios.post(requestPath, sendBody, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      return response.data;
    } catch (error) {
      const err = error as AxiosError<string>;

      thunkApi.dispatch(
        setCookies({
          key: authMessages.COOKIES_EMAIL_ERROR,
          value: err.response?.data ?? 'Error, please try again later.',
        }),
      );

      window.opener.postMessage(authMessages.POST_EMAIL_ERROR, window.opener.origin);
    }
  },
);

export const processResetPassword = createAsyncThunk(
  `${authenticationStoreKey}/resetPassword`,
  async (userData: IResetPassword, thunkApi) => {
    try {
      await axios.put(`${authPath}/password`, userData);

      return { success: true };
    } catch (error) {
      const err = error as AxiosError<string>;

      thunkApi.dispatch(
        errorAlert(err.response?.data ?? 'An unexpected error occured, please try again later'),
      );
    }
  },
);
