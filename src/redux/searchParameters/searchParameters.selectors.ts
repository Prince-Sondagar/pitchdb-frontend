import { type RootState } from '../store';

const isLoading = (state: RootState) => state.searchParameters.isLoading;
const genres = (state: RootState) => state.searchParameters.genres;

export const searchParametersSelectors = { isLoading, genres };
