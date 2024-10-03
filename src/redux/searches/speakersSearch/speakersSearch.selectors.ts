import { type RootState } from '../../store';

const isLoading = (state: RootState) => state.speakersSearch.isLoading;

export const speakersSearchSelectors = { isLoading };
