import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminStoreKey } from '.';
import { errorAlert, successAlert } from '../alerts';
import { ICreatingUser } from '../../types';

interface IGetAllUsersProps {
  page: number;
  term?: string;
}

interface IAddCredits {
  userId: string;
  amount: string;
}

interface IAddPrivilege {
  userId: string;
  privilege: string;
}

interface IAddAdminasSignTemplate {
  userId: string;
  templateid: string;
}

const basePath = import.meta.env.VITE_API_BASE_URL;
const adminPath = `${basePath}/admin-users`;

export const getAllUsers = createAsyncThunk(
  `${adminStoreKey}/getAllUsers`,
  async (data: IGetAllUsersProps, thunkApi) => {
    try {
      const { page, term } = data;

      const requestPath = adminPath + '/?page=' + page + (term ? `&term=${term}` : '');
      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('An error occured getting all users, please try again later'));
    }
  },
);

export const countUsers = createAsyncThunk(
  `${adminStoreKey}/countUsers`,
  async (term: string | null, thunkApi) => {
    try {
      const requestPath = adminPath + '/count' + (term ? `?term=${term}` : '');
      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('An error occured counting users, please try again later'));
    }
  },
);

export const createUser = createAsyncThunk(
  `${adminStoreKey}/createUser`,
  async (userData: ICreatingUser, thunkApi) => {
    try {
      const response = await axios.post(`${adminPath}/`, userData);

      if (response.status === 200) {
        const props = {
          page: 0,
        };
        thunkApi.dispatch(successAlert('The user was created successfully.'));
        thunkApi.dispatch(getAllUsers(props));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('An error occured creating the user, please try again later'));
    }
  },
);

export const deleteUser = createAsyncThunk(
  `${adminStoreKey}/deleteUser`,
  async (userId: string, thunkApi) => {
    try {
      const requestPath = `${adminPath}/${userId}`;
      const response = await axios.delete(requestPath);

      if (response.status === 200) {
        const props = {
          page: 0,
        };
        thunkApi.dispatch(successAlert('The user was deleted successfully.'));
        thunkApi.dispatch(getAllUsers(props));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('An error occured deleting the user, please try again later'));
    }
  },
);

export const addCredits = createAsyncThunk(
  `${adminStoreKey}/addCredits`,
  async (data: IAddCredits, thunkApi) => {
    try {
      const { userId, amount } = data;

      const requestPath = `${adminPath}/${userId}/credits`;
      const response = await axios.put(requestPath, amount);

      if (response.status === 200) {
        const props = {
          page: 0,
        };

        thunkApi.dispatch(successAlert(amount + ' of credits was added successfully.'));
        thunkApi.dispatch(getAllUsers(props));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error adding credits, please try again later'));
    }
  },
);

export const resetPassword = createAsyncThunk(
  `${adminStoreKey}/resetPassword`,
  async (userId: string, thunkApi) => {
    try {
      const requestPath = `${adminPath}/${userId}/reset`;
      const response = await axios.put(requestPath);

      if (response.status === 200) {
        const props = {
          page: 0,
        };
        thunkApi.dispatch(successAlert('The password was reseted successfully.'));
        thunkApi.dispatch(getAllUsers(props));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Could not reset password'));
    }
  },
);

export const getSignInToken = createAsyncThunk(
  `${adminStoreKey}/getSignInToken`,
  async (userId: string, thunkApi) => {
    try {
      const requestPath = `${adminPath}/${userId}/user-token`;
      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('An error occurred, try again later.'));
    }
  },
);

export const getPrivilegeList = createAsyncThunk(
  `${adminStoreKey}/getPrivilegeList`,
  async (_, thunkApi) => {
    try {
      const requestPath = `${adminPath}/user-privelege`;
      const response = await axios.get(requestPath);

      if (response.status === 200) {
        const privileges: string[] = [];
        const userprivilege = response.data;
        Object.keys(userprivilege).map(function (key) {
          privileges.push(userprivilege[key]);
        });
        return privileges;
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('An error occurred, try again later.'));
    }
  },
);

export const addPrivilege = createAsyncThunk(
  `${adminStoreKey}/addPrivilege`,
  async (data: IAddPrivilege, thunkApi) => {
    try {
      const { userId, privilege } = data;

      const requestPath = `${adminPath}/${userId}/add-privilege?privilege=${privilege}`;
      const response = await axios.put(requestPath);

      if (response.status === 200) {
        const props = {
          page: 0,
        };
        thunkApi.dispatch(successAlert('The privilege was added successfully.'));
        thunkApi.dispatch(getAllUsers(props));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error adding privileges, try again later'));
    }
  },
);

export const removePrivilege = createAsyncThunk(
  `${adminStoreKey}/removePrivilege`,
  async (data: IAddPrivilege, thunkApi) => {
    try {
      const { userId, privilege } = data;

      const requestPath = `${adminPath}/${userId}/remove-privilege?privilege=${privilege}`;
      const response = await axios.put(requestPath);

      if (response.status === 200) {
        const props = {
          page: 0,
        };
        thunkApi.dispatch(successAlert('The privilege was removed successfully.'));
        thunkApi.dispatch(getAllUsers(props));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error removing privileges. Try again later.'));
    }
  },
);

export const toggleStatus = createAsyncThunk(
  `${adminStoreKey}/toggleStatus`,
  async (userId: string, thunkApi) => {
    try {
      const requestPath = `${adminPath}/${userId}/status-toggle`;
      const response = await axios.put(requestPath);

      if (response.status === 200) {
        const props = {
          page: 0,
        };
        thunkApi.dispatch(successAlert('The status was chanegd successfully.'));
        thunkApi.dispatch(getAllUsers(props));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('An error occurred. Try again later.'));
    }
  },
);

export const addAdminasSignTemplate = createAsyncThunk(
  `${adminStoreKey}/addAdminasSignTemplate`,
  async (data: IAddAdminasSignTemplate, thunkApi) => {
    try {
      const { userId, templateid } = data;

      const requestPath = `${adminPath}/${userId}/add-assign-template`;
      const response = await axios.put(requestPath, templateid);

      if (response.status === 200) {
        const props = {
          page: 0,
        };
        thunkApi.dispatch(successAlert('The template was assigned successfully.'));
        thunkApi.dispatch(getAllUsers(props));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('An error occurred. Try again later.'));
    }
  },
);
