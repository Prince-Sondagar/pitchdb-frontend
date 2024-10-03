import { type RootState } from '../../store';

const isLoading = (state: RootState) => state.mediaOutletsSearch.isLoading;

export const MediaOutletsSearchSelectors = { isLoading };
