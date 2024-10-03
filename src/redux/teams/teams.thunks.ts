import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { teamsStoreKey } from './teams.const';
import { errorAlert, successAlert } from '../alerts';
import { ITeam } from '../../types';
import { getUserData } from '../user';

interface ISendInvitationProps {
  team: ITeam;
  invEmail: string;
}

interface IRemoveUserTeamProps {
  userId: string;
  teamId: string;
}

const basePath = import.meta.env.VITE_API_BASE_URL;
const teamsPath = `${basePath}/teams`;

export const createTeam = createAsyncThunk(`${teamsStoreKey}/createTeam`, async (_, thunkApi) => {
  try {
    const requestPath = `${teamsPath}/`;
    const response = await axios.post(requestPath, {});

    if (response.status === 200 && response.data.user) {
      const { teamId } = response.data.user;

      await thunkApi.dispatch(getUserData());

      await thunkApi.dispatch(getTeam(teamId));

      thunkApi.dispatch(successAlert('Tteam created successfully'));
    }
    return response.data;
  } catch (error) {
    thunkApi.dispatch(errorAlert('Error creating the team. Please, try again later.'));
  }
});

export const sendInvitation = createAsyncThunk(
  `${teamsStoreKey}/issueInvitation`,
  async (params: ISendInvitationProps, thunkApi) => {
    const { team, invEmail } = params;

    try {
      const requestPath = `${teamsPath}/invitation`;
      const response = await axios.post(requestPath, { team: team, email: invEmail });

      if (response.status === 200) {
        thunkApi.dispatch(successAlert('Invitation sent successfully'));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error sending the invitation. Please, try again later.'));
    }
  },
);

export const getTeam = createAsyncThunk(
  `${teamsStoreKey}/getTeam`,
  async (id: string, thunkApi) => {
    try {
      const requestPath = `${teamsPath}/${id}`;
      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error retrieving the specified team. Please, try again later.'),
      );
    }
  },
);

export const removeUserTeam = createAsyncThunk(
  `${teamsStoreKey}/removeUserTeam`,
  async (params: IRemoveUserTeamProps, thunkApi) => {
    try {
      const { userId, teamId } = params;

      const requestPath = `${teamsPath}/users/${userId}`;
      const response = await axios.delete(requestPath);

      if (response.status === 200) {
        thunkApi.dispatch(getTeam(teamId));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error deleting the specified team. Please, try again later.'));
    }
  },
);
