import { type RootState } from '../store';

const isLoading = (state: RootState) => state.authentication.isLoading;

export const authenticationSelectors = { isLoading };
