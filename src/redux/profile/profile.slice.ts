import { createSlice } from '@reduxjs/toolkit';
import { profileStoreKey } from './profile.const';
import { IProfileData } from '../../types';
import {
  getProfileData,
  addUserProfileImage,
  deleteUserProfileImage,
  getUserProfileImage,
} from '.';

interface IState {
  isLoading: boolean;
  profileData?: IProfileData | null;
  userImagePath: string | null;
}

const initialState: IState = {
  isLoading: false,
  profileData: null,
  userImagePath: null,
};

export const profileSlice = createSlice({
  name: profileStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    //getProfileData
    builder.addCase(getProfileData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProfileData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profileData = action.payload;
    });
    builder.addCase(getProfileData.rejected, (state) => {
      state.isLoading = false;
    });
    // addUserProfileImage
    builder.addCase(addUserProfileImage.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addUserProfileImage.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addUserProfileImage.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.length) {
        state.userImagePath = action.payload[0].userimage || null;
      }
    });
    // deleteUserProfileImage
    builder.addCase(deleteUserProfileImage.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUserProfileImage.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteUserProfileImage.fulfilled, (state) => {
      state.isLoading = false;
      state.userImagePath = '';
    });
    // getUserProfileImage
    builder.addCase(getUserProfileImage.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserProfileImage.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserProfileImage.fulfilled, (state, action) => {
      if (action.payload?.length) {
        state.userImagePath = action.payload[0].userimage || null;
      }
      state.isLoading = false;
    });
  },
});
