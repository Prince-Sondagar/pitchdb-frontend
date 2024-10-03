import { createSlice } from '@reduxjs/toolkit';
import { userStoreKey } from './user.const';
import { IEmailAccountConfiguration, IUserData } from '../../types';
import { changePassword, getEmailConfig, getUserData } from '.';

interface IState {
  isLoading: boolean;
  userData: IUserData | null;
  isAdmin: boolean;
  emailConfig: IEmailAccountConfiguration | null;
}

const initialState: IState = {
  isLoading: false,
  userData: null,
  isAdmin: false,
  emailConfig: null,
};

export const userSlice = createSlice({
  name: userStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // getUserData
    builder.addCase(getUserData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserData.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userData = action.payload?.response;
      state.isAdmin = action.payload?.isAdmin;
    });

    // changePassword
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changePassword.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.isLoading = false;
    });

    // getEmailConfig
    builder.addCase(getEmailConfig.fulfilled, (state, action) => {
      state.emailConfig = action.payload;
    });
  },
});
