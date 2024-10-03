import { type RootState } from '../store';

const isLoading = (state: RootState) => state.user.isLoading;
const userData = (state: RootState) => state.user.userData;
const isAdmin = (state: RootState) => state.user.isAdmin;
const emailConfig = (state: RootState) => state.user.emailConfig;

export const userSelectors = { isLoading, userData, isAdmin, emailConfig };
