import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { outreachSequenceStoreKey } from './outreachSequence.const';
import { errorSideAlert } from '../alerts';

const outreachSequencePath = `${import.meta.env.VITE_API_BASE_URL}/outreach-sequences`;

export const getSequenceByContactId = createAsyncThunk(
  `${outreachSequenceStoreKey}/getSequenceByListId`,
  async (contactId: string, thunkApi) => {
    try {
      const response = await axios.get(`${outreachSequencePath}/${contactId}/contactdata`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the outreach sequence for the contact specified. Please, try again later.',
        ),
      );
    }
  },
);
