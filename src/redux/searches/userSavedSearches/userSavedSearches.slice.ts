import { createSlice } from '@reduxjs/toolkit';
import { userSavedSearchesStoreKey } from './userSavedSearches.const';
import { saveUserSearch } from '.';

interface IState {
  isLoading: boolean;
}

const initialState: IState = {
  isLoading: false,
};

export const userSavedSearchesSlice = createSlice({
  name: userSavedSearchesStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // saveUserSearch
    builder.addCase(saveUserSearch.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(saveUserSearch.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(saveUserSearch.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
