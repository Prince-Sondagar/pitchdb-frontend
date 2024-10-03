import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { podcastsSearchStoreKey } from '.';
import { errorSideAlert } from '../../alerts';

const podcastsSearchPath = `${import.meta.env.VITE_API_BASE_URL}/podcasts`;

export const getDetailByListenNotesId = createAsyncThunk(
  `${podcastsSearchStoreKey}/getByListenNotesId`,
  async (listenNotesId: string, thunkApi) => {
    try {
      const response = await axios.get(
        `${podcastsSearchPath}/${encodeURIComponent(listenNotesId)}`,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the podcasts details. Please, try again later.'),
      );
    }
  },
);

export const getAllEpisodesById = createAsyncThunk(
  `${podcastsSearchStoreKey}/getAllEpisodesById`,
  async (id: string, thunkApi) => {
    try {
      const response = await axios.get(`${podcastsSearchPath}/${id}/allepisodes`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting all the episodes for the podcasts specified. Please, try again later.',
        ),
      );
    }
  },
);
