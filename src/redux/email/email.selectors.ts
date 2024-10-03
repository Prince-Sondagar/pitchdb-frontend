import { type RootState } from '../store';

const isLoading = (state: RootState) => state.email.isLoading;
const emailSignatureData = (state: RootState) => state.email.emailSignatureData;
const primaryEmailAccount = (state: RootState) => state.email.primaryEmailAccount;
const emailAccounts = (state: RootState) => state.email.emailAccounts;

export const emailSelectors = { isLoading, emailSignatureData, primaryEmailAccount, emailAccounts };
