import { createSlice } from '@reduxjs/toolkit';
import { eventsSearchStoreKey } from './eventsSearch.const';
import { processGetEvents, processGetTotalEvents } from '.';

interface IState {
  isLoading: boolean;
}

const initialState: IState = {
  isLoading: false,
};

export const eventsSearchSlice = createSlice({
  name: eventsSearchStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // processGetEvents
    builder.addCase(processGetEvents.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(processGetEvents.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(processGetEvents.fulfilled, (state) => {
      state.isLoading = false;
    });
    // processGetTotalEvents
    builder.addCase(processGetTotalEvents.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(processGetTotalEvents.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(processGetTotalEvents.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
