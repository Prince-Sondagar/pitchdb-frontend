import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { eventsSearchStoreKey } from '.';
import { errorSideAlert } from '../../alerts';

const eventsSearchPath = `${import.meta.env.VITE_API_BASE_URL}/search/event-organizations`;

export const processGetEvents = createAsyncThunk(
  `${eventsSearchStoreKey}/processGetEvents`,
  async (queryParameters: string, thunkApi) => {
    try {
      const response = await axios.get(`${eventsSearchPath}/?${queryParameters}}`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the local association events. Please, try again later.'),
      );
    }
  },
);

export const processGetTotalEvents = createAsyncThunk(
  `${eventsSearchStoreKey}/processGetTotalEvents`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${eventsSearchPath}/total`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the total local association events. Please, try again later.',
        ),
      );
    }
  },
);
