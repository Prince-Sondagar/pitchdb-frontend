import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileStoreKey } from '.';
import { IProfileData } from '../../types';
import { errorAlert, errorSideAlert, successAlert } from '../alerts';

const basePath = import.meta.env.VITE_API_BASE_URL;
const EMAIL_ACCOUNTS_ENDPOINT = '/profile-data/';
const userProfileImagePath = `${basePath}/userimage`;

interface IGetProfileData {
  userId: string;
}

interface IAddProfileData {
  data: IProfileData;
}

export const addProfileData = createAsyncThunk(
  `${profileStoreKey}/addprofiledata`,
  async (params: IAddProfileData, thunkApi) => {
    try {
      const { data } = params;

      const response = await axios.post(basePath + EMAIL_ACCOUNTS_ENDPOINT + 'addprofiledata', {
        data,
      });

      if (response.status === 200) {
        thunkApi.dispatch(successAlert(`Your profile was successfully saved.`));

        if (data?.userId) {
          thunkApi.dispatch(getProfileData({ userId: data?.userId }));
        }
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error, please try again later.'));
    }
  },
);

export const getProfileData = createAsyncThunk(
  `${profileStoreKey}/getprofiledata`,
  async (params: IGetProfileData) => {
    try {
      const { userId } = params;

      const response = await axios.get(
        basePath + EMAIL_ACCOUNTS_ENDPOINT + userId + '/getprofiledata',
      );

      return response.data;
    } catch (error) {
      throw new Error('Error');
    }
  },
);

export const addUserProfileImage = createAsyncThunk(
  `${profileStoreKey}/addUserProfileImage`,
  async (data: FormData, thunkApi) => {
    try {
      const response = await axios.post(`${userProfileImagePath}/add-userimage`, data);

      if (response.status === 200) {
        thunkApi.dispatch(successAlert('Profile image added successfully'));

        thunkApi.dispatch(getUserProfileImage());
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error adding the user profile image. Please, try again later.'),
      );
    }
  },
);

export const deleteUserProfileImage = createAsyncThunk(
  `${profileStoreKey}/deleteUserProfileImage`,
  async (userId: string, thunkApi) => {
    try {
      const response = await axios.post(`${userProfileImagePath}/delete-userimage`, userId);

      if (response.status === 200) {
        thunkApi.dispatch(getUserProfileImage());
        thunkApi.dispatch(successAlert('Profile image removed successfully'));
      }

      return { success: true };
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error removing the user profile image. Please, try again later.'),
      );
    }
  },
);

export const getUserProfileImage = createAsyncThunk(
  `${profileStoreKey}/getUserProfileImage`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${userProfileImagePath}`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the user profile image. Please, try again later.'),
      );
    }
  },
);
