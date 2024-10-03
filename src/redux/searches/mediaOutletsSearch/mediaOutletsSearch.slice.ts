import { createSlice } from '@reduxjs/toolkit';
import { mediaOutletsSearchStoreKey } from './mediaOutletsSearch.const';
import { processGetMediaOutlets, processGetTotalMediaOutlets } from '.';

interface IState {
  isLoading: boolean;
}

const initialState: IState = {
  isLoading: false,
};

export const mediaOutletsSearchSlice = createSlice({
  name: mediaOutletsSearchStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // processGetMediaOutlets
    builder.addCase(processGetMediaOutlets.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(processGetMediaOutlets.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(processGetMediaOutlets.fulfilled, (state) => {
      state.isLoading = false;
    });
    // processGetTotalMediaOutlets
    builder.addCase(processGetTotalMediaOutlets.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(processGetTotalMediaOutlets.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(processGetTotalMediaOutlets.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
