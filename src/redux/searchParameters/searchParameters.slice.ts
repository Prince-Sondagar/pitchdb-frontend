import { createSlice } from '@reduxjs/toolkit';
import { searchParametersStoreKey } from './searchParameters.const';
import {
  getCities,
  getCountries,
  getGenres,
  getGuestIndustries,
  getLanguages,
  getLocations,
  getMonths,
  getPlaces,
  getRoles,
  getSchoolTypes,
  getSponsorIndustries,
  getSponsorMarkets,
  getStates,
} from '.';
import { Genre } from '../../types';

interface IState {
  isLoading: boolean;
  genres?: Genre[] | null;
}

const initialState: IState = {
  isLoading: false,
  genres: null,
};

export const searchParametersSlice = createSlice({
  name: searchParametersStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // getGenres
    builder.addCase(getGenres.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getGenres.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.isLoading = false;
      state.genres = action.payload;
    });
    // getLanguages
    builder.addCase(getLanguages.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getLanguages.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getLanguages.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getLocations
    builder.addCase(getLocations.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getLocations.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getLocations.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getPlaces
    builder.addCase(getPlaces.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPlaces.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getPlaces.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getMonths
    builder.addCase(getMonths.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMonths.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getMonths.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getCountries
    builder.addCase(getCountries.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCountries.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getCountries.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getStates
    builder.addCase(getStates.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getStates.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getStates.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getCities
    builder.addCase(getCities.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCities.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getCities.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getRoles
    builder.addCase(getRoles.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getRoles.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getRoles.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getSchoolTypes
    builder.addCase(getSchoolTypes.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSchoolTypes.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getSchoolTypes.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getSponsorIndustries
    builder.addCase(getSponsorIndustries.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSponsorIndustries.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getSponsorIndustries.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getSponsorMarkets
    builder.addCase(getSponsorMarkets.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSponsorMarkets.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getSponsorMarkets.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getGuestIndustries
    builder.addCase(getGuestIndustries.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getGuestIndustries.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getGuestIndustries.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
