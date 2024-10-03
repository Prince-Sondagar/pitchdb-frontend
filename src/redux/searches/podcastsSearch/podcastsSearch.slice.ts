import { createSlice } from '@reduxjs/toolkit';
import { podcastsSearchStoreKey } from './podcastsSearch.const';
import { getAllEpisodesById, getDetailByListenNotesId } from '.';

interface IState {
  isLoading: boolean;
}

const initialState: IState = {
  isLoading: false,
};

export const podcastsSearchSlice = createSlice({
  name: podcastsSearchStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // getDetailByListenNotesId
    builder.addCase(getDetailByListenNotesId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getDetailByListenNotesId.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getDetailByListenNotesId.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getAllEpisodesById
    builder.addCase(getAllEpisodesById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllEpisodesById.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getAllEpisodesById.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
