import { createSlice } from '@reduxjs/toolkit';
import { conferencesSearchStoreKey, processGetConferences, processGetTotalConferences } from '.';

interface IState {
  isLoading: boolean;
}

const initialState: IState = {
  isLoading: false,
};

export const conferencesSearchSlice = createSlice({
  name: conferencesSearchStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // processGetConferences
    builder.addCase(processGetConferences.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(processGetConferences.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(processGetConferences.fulfilled, (state) => {
      state.isLoading = false;
    });
    // processGetTotalConferences
    builder.addCase(processGetTotalConferences.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(processGetTotalConferences.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(processGetTotalConferences.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
