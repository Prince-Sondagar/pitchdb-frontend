import { type RootState } from '../../store';

const isLoading = (state: RootState) => state.userSavedSearches.isLoading;

export const eventsSearchSelectors = { isLoading };
