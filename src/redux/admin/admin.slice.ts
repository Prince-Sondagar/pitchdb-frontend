import { createSlice } from '@reduxjs/toolkit';
import { adminStoreKey } from './admin.const';
import { IUserData } from '../../types';
import { addCredits, countUsers, createUser, deleteUser, getAllUsers, getPrivilegeList } from '.';

interface IState {
  isLoading: boolean;
  users: IUserData[] | null;
  usersAmount: number;
  page: number;
  pageSize: number;
  bundleAdditionIndex: number;
  numberAdditionCredits: number;
  userPrivileges: string[] | null;
}

const initialState: IState = {
  isLoading: false,
  users: null,
  usersAmount: 0,
  page: 0,
  pageSize: 0,
  bundleAdditionIndex: 0,
  numberAdditionCredits: 0,
  userPrivileges: null,
};

export const adminSlice = createSlice({
  name: adminStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    //getAllUsers
    builder.addCase(getAllUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
      state.bundleAdditionIndex = -1;
      state.numberAdditionCredits = 0;
    });

    //countUsers
    builder.addCase(countUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(countUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(countUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.usersAmount = action.payload.count;
      state.pageSize = action.payload.pageSize;
    });

    //createUser
    builder.addCase(createUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createUser.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createUser.fulfilled, (state) => {
      state.isLoading = false;
    });

    //deleteUser
    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteUser.fulfilled, (state) => {
      state.isLoading = false;
    });

    //addCredits
    builder.addCase(addCredits.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addCredits.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addCredits.fulfilled, (state) => {
      state.isLoading = false;
    });

    //getPrivilegelist
    builder.addCase(getPrivilegeList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPrivilegeList.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getPrivilegeList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userPrivileges = action.payload;
    });
  },
});
