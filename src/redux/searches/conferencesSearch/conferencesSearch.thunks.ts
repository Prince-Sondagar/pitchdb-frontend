import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { conferencesSearchStoreKey } from '.';
import { errorSideAlert } from '../../alerts';

const conferencesSearchPath = `${import.meta.env.VITE_API_BASE_URL}/search/conferences`;

export const processGetConferences = createAsyncThunk(
  `${conferencesSearchStoreKey}/processGetConferences`,
  async (queryParameters: string, thunkApi) => {
    try {
      const response = await axios.get(`${conferencesSearchPath}/?${queryParameters}`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorSideAlert('Error getting the conferences. Please, try again later.'));
    }
  },
);

export const processGetTotalConferences = createAsyncThunk(
  `${conferencesSearchStoreKey}/processGetTotalConferences`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${conferencesSearchPath}/total`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the total conferences. Please, try again later.'),
      );
    }
  },
);
