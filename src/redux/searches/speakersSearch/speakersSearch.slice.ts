import { createSlice } from '@reduxjs/toolkit';
import { speakersSearchStoreKey } from './speakersSearch.const';
import { processGetSpeakers } from '.';

interface IState {
  isLoading: boolean;
}

const initialState: IState = {
  isLoading: false,
};

export const speakersSearchSlice = createSlice({
  name: speakersSearchStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // processGetSpeakers
    builder.addCase(processGetSpeakers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(processGetSpeakers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(processGetSpeakers.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
