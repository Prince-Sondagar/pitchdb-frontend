import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorSideAlert } from '../../alerts';
import { userSavedSearchesStoreKey } from '.';
import { ISearchTransformedParameters } from '../../../types';

interface ISaveUserSearch {
  type: string;
  keyword: string;
  results: number;
  filters: ISearchTransformedParameters;
}

const userSavedSearchesPath = `${import.meta.env.VITE_API_BASE_URL}/searches`;

export const saveUserSearch = createAsyncThunk(
  `${userSavedSearchesStoreKey}/saveUserSearch`,
  async (search: ISaveUserSearch, thunkApi) => {
    try {
      const response = await axios.post(userSavedSearchesPath, search);

      if (response.data) {
        return { success: true };
      }
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error saving the search for the user. Please, try again later.'),
      );
    }
  },
);
