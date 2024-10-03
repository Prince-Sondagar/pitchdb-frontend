import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { searchParametersStoreKey } from '.';
import { errorSideAlert } from '../alerts';

const searchParametersPath = `${import.meta.env.VITE_API_BASE_URL}/search-parameters`;

export const getGenres = createAsyncThunk(
  `${searchParametersStoreKey}/getGenres`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/genres`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the genres for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getLanguages = createAsyncThunk(
  `${searchParametersStoreKey}/getLanguages`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/languages`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the languages for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getLocations = createAsyncThunk(
  `${searchParametersStoreKey}/getLocations`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/locations`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the locations for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getPlaces = createAsyncThunk(
  `${searchParametersStoreKey}/getPlaces`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/places`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the places for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getMonths = createAsyncThunk(
  `${searchParametersStoreKey}/getMonths`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/months`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the months for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getCountries = createAsyncThunk(
  `${searchParametersStoreKey}/getCountries`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/countries`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the countries for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getStates = createAsyncThunk(
  `${searchParametersStoreKey}/getStates`,
  async (countryRefId: string, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/states?countryId=${countryRefId}`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the states for the specified country. Please, try again later.',
        ),
      );
    }
  },
);

export const getCities = createAsyncThunk(
  `${searchParametersStoreKey}/getCities`,
  async (stateId: string, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/cities?stateId=${stateId}`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the cities for the specified state. Please, try again later.',
        ),
      );
    }
  },
);

export const getRoles = createAsyncThunk(
  `${searchParametersStoreKey}/getRoles`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/roles`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the roles for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getSchoolTypes = createAsyncThunk(
  `${searchParametersStoreKey}/getSchoolTypes`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/school-types`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the school types for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getSponsorIndustries = createAsyncThunk(
  `${searchParametersStoreKey}/getSponsorIndustries`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/sponsorIndustries`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the sponsor industries for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getSponsorMarkets = createAsyncThunk(
  `${searchParametersStoreKey}/getSponsorMarkets`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/sponsorMarkets`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the sponsor markets for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);

export const getGuestIndustries = createAsyncThunk(
  `${searchParametersStoreKey}/getGuestIndustries`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${searchParametersPath}/guestIndustries`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error getting the guest industries for the search parameters. Please, try again later.',
        ),
      );
    }
  },
);
