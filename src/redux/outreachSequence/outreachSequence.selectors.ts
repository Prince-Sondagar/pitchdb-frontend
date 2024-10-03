import { type RootState } from '../store';

const isLoading = (state: RootState) => state.outreachSequence.isLoading;

export const outreachSequenceSelectors = {
  isLoading,
};
