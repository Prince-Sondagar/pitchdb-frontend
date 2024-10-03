import { type RootState } from '../../store';

const isLoading = (state: RootState) => state.podcastsSearch.isLoading;

export const podcastsSearchSelectors = { isLoading };
