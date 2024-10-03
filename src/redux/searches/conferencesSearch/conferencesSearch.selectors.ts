import { type RootState } from '../../store';

const isLoading = (state: RootState) => state.conferencesSearch.isLoading;

export const conferencesSearchSelectors = { isLoading };
