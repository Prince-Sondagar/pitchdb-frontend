import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorSideAlert } from '../../alerts';
import { speakersSearchStoreKey } from '.';

const speakersSearchPath = `${import.meta.env.VITE_API_BASE_URL}/profile-data`;

export const processGetSpeakers = createAsyncThunk(
  `${speakersSearchStoreKey}/processGetSpeakers`,
  async (searchAsString: string, thunkApi) => {
    try {
      const response = await axios.get(
        `${speakersSearchPath}/${searchAsString}/getprofilesearchdata`,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the expert speakers. Please, try again later.'),
      );
    }
  },
);
