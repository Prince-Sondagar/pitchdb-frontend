import { type RootState } from '../store';

const isLoading = (state: RootState) => state.profile.isLoading;
const profileData = (state: RootState) => state.profile.profileData;
const userImagePath = (state: RootState) => state.profile.userImagePath;

export const profileSelectors = { isLoading, profileData, userImagePath };
