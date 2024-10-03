import { type RootState } from '../store';

const team = (state: RootState) => state.teams.team;
const users = (state: RootState) => state.teams.users;

export const teamsSelectors = { team, users };
