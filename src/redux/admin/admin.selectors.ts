import { type RootState } from '../store';

const isLoading = (state: RootState) => state.admin.isLoading;
const users = (state: RootState) => state.admin.users;
const page = (state: RootState) => state.admin.page;
const pageSize = (state: RootState) => state.admin.pageSize;
const bundleAdditionIndex = (state: RootState) => state.admin.bundleAdditionIndex;
const numberAdditionCredits = (state: RootState) => state.admin.numberAdditionCredits;
const userPrivileges = (state: RootState) => state.admin.userPrivileges;
const usersAmount = (state: RootState) => state.admin.usersAmount;

export const adminSelectors = {
  isLoading,
  users,
  page,
  pageSize,
  bundleAdditionIndex,
  numberAdditionCredits,
  userPrivileges,
  usersAmount,
};
