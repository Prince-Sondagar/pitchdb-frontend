import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { mediaOutletsSearchStoreKey } from '.';
import { errorSideAlert } from '../../alerts';

const mediaOutletsSearchPath = `${import.meta.env.VITE_API_BASE_URL}/search/media`;

export const processGetMediaOutlets = createAsyncThunk(
  `${mediaOutletsSearchStoreKey}/processGetMediaOutlets`,
  async (queryParameters: string, thunkApi) => {
    try {
      const response = await axios.get(`${mediaOutletsSearchPath}/?${queryParameters}`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the media outlets. Please, try again later.'),
      );
    }
  },
);

export const processGetTotalMediaOutlets = createAsyncThunk(
  `${mediaOutletsSearchStoreKey}/processGetTotalMediaOutlets`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${mediaOutletsSearchPath}/total`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the total media outlets. Please, try again later.'),
      );
    }
  },
);
