import { type RootState } from '../../store';

const isLoading = (state: RootState) => state.eventsSearch.isLoading;

export const eventsSearchSelectors = { isLoading };
