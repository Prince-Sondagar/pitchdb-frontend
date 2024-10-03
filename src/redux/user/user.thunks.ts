import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userStoreKey } from '.';
import { removeCookies } from '../cookies';
import Cookies from 'universal-cookie';
import { errorAlert, successAlert } from '../alerts';
import { IEmailAccountConfiguration } from '../../types';

const basePath = import.meta.env.VITE_API_BASE_URL;
const userPath = `${basePath}/users`;
const emailConfigPath = `${basePath}/email-notification`;

const cookies = new Cookies();

interface IChangePassword {
  password: string;
  newPassword: string;
}

export const getUserData = createAsyncThunk(`${userStoreKey}/getUserData`, async (_, thunkApi) => {
  try {
    const response = await axios.get(`${userPath}/me`);

    const isAdmin = cookies.get('admin-token');

    return {
      response: response.data,
      isAdmin,
    };
  } catch (error) {
    thunkApi.dispatch(removeCookies('jwt'));
  }
});

export const changePassword = createAsyncThunk(
  `${userStoreKey}/changePassword`,
  async (params: IChangePassword, thunkApi) => {
    try {
      const response = await axios.put(`${userPath}/me/password`, params);

      if (response.status === 200) {
        thunkApi.dispatch(successAlert('Password changed sucessfully'));
      } else {
        thunkApi.dispatch(
          errorAlert('An error occured while changing your password, please try again later'),
        );
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('An error occured while changing your password, please try again later'),
      );
    }
  },
);

export const addEmailConfig = createAsyncThunk(
  `${userStoreKey}/addemailconfig`,
  async (data: IEmailAccountConfiguration, thunkApi) => {
    try {
      const response = await axios.post(`${emailConfigPath}/addemailconfigration`, { data });

      if (response.status === 200) {
        thunkApi.dispatch(getEmailConfig(data.userId));
        thunkApi.dispatch(successAlert('Your email configuration was saved successfully'));
      } else {
        thunkApi.dispatch(
          errorAlert('An error occured saving your email configuration, please try again later'),
        );
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('An error occured saving your email configuration, please try again later'),
      );
    }
  },
);

export const getEmailConfig = createAsyncThunk(
  `${userStoreKey}/getemailconfig`,
  async (userId: string, thunkApi) => {
    try {
      const response = await axios.get(`${emailConfigPath}/${userId}/getemailconfigration`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert(
          'An error occured while getting your email configuration details, please try again later',
        ),
      );
    }
  },
);
