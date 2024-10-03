import { createSlice } from '@reduxjs/toolkit';
import { outreachSequenceStoreKey } from './outreachSequence.const';
import { getSequenceByContactId } from '.';

interface IState {
  isLoading: boolean;
}

const initialState: IState = {
  isLoading: false,
};

export const outreachSequenceSlice = createSlice({
  name: outreachSequenceStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // getSequenceByContactId
    builder.addCase(getSequenceByContactId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSequenceByContactId.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getSequenceByContactId.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
