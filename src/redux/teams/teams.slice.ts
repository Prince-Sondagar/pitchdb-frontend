import { createSlice } from '@reduxjs/toolkit';
import { teamsStoreKey } from './teams.const';
import { createTeam, getTeam, removeUserTeam, sendInvitation } from './teams.thunks';
import { IUserData } from '../../types';
import { ITeam } from '../../types';

interface TeamState {
  isLoading: boolean;
  team: ITeam | null;
  users: IUserData[] | null;
}

export const initialState: TeamState = {
  isLoading: false,
  team: null,
  users: null,
};

export const teamsSlice = createSlice({
  name: teamsStoreKey,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* CREATE TEAMS  */
    builder.addCase(createTeam.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createTeam.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createTeam.fulfilled, (state, action) => {
      state.isLoading = false;
      state.team = action.payload;
    });
    /* ISSUEINVITATION */
    builder.addCase(sendInvitation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(sendInvitation.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(sendInvitation.fulfilled, (state) => {
      state.isLoading = false;
    });
    /* GETTEAM */
    builder.addCase(getTeam.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTeam.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getTeam.fulfilled, (state, action) => {
      state.isLoading = false;

      state.team = action.payload;
      if (action.payload.users) state.users = action.payload.users;
    });
    /* REMOVE USERTEAM*/
    builder.addCase(removeUserTeam.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(removeUserTeam.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(removeUserTeam.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});
