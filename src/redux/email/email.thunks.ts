import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { emailStoreKey } from '.';
import { errorAlert, errorSideAlert, successAlert } from '../alerts';
import { ISendEmail } from '../../types';

const basePath = import.meta.env.VITE_API_BASE_URL;

const templatePath = `${basePath}/email-templates`;
const emailAccountsPath = `${basePath}/email-accounts`;

export interface IAddEmailSignatureProps {
  signaturedata: string;
  userId: string;
}

export interface IUpdateEmailSignatureProps {
  signaturedata: string;
  userId: string;
}

export const sendEmail = createAsyncThunk(
  `${emailStoreKey}/sendEmail`,
  async (params: ISendEmail, thunkApi) => {
    const { emailData } = params;

    try {
      const requestPath = `${templatePath}/sendemail`;

      const response = await axios.post(requestPath, emailData);

      if (response.status == 200) {
        thunkApi.dispatch(successAlert('The email was sended successfully.'));
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error sending email. Please, try again later.'));
    }
  },
);

export const getPrimaryEmailAccount = createAsyncThunk(
  `${emailStoreKey}/getPrimaryEmailAccount`,
  async (_, thunkApi) => {
    try {
      const requestPath = `${emailAccountsPath}/primary`;
      const response = await axios.get(requestPath);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the primary email account. Please, try again later.'),
      );
    }
  },
);

export const getEmailSignature = createAsyncThunk(
  `${emailStoreKey}/getEmailSignature`,
  async (userId: string, thunkApi) => {
    try {
      const requestPath = `${emailAccountsPath}/${userId}/getemailsignature`;
      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorSideAlert('Error getting email signature. Please, try again later.'));
    }
  },
);

//not used yet
export const getEmailReport = createAsyncThunk(
  `${emailStoreKey}/getEmailReport`,
  async (_id: string, thunkApi) => {
    try {
      const requestPath = `${templatePath}/email-validity`;
      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorSideAlert('Error getting email report. Please, try again later.'));
    }
  },
);

export const addEmailSignature = createAsyncThunk(
  `${emailStoreKey}/addemailsignature`,
  async (data: IAddEmailSignatureProps, thunkApi) => {
    try {
      const requestPath = `${emailAccountsPath}/addemailsignature`;

      const response = await axios.post(requestPath, { data });

      if (response.status == 200) {
        thunkApi.dispatch(successAlert('The signature was saved successfully.'));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error saving your signature. Please, try again later.'));
    }
  },
);

export const updateEmailSignature = createAsyncThunk(
  `${emailStoreKey}/updateemailsignature`,
  async (data: IUpdateEmailSignatureProps, thunkApi) => {
    const { userId, signaturedata } = data;

    try {
      const requestPath = `${emailAccountsPath}/${userId}/updateemailsignature`;

      const response = await axios.put(requestPath, { signaturedata });

      if (response.status == 200) {
        thunkApi.dispatch(successAlert('The signature was updated successfully.'));
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error updating your signature. Please, try again later.'));
    }
  },
);

export const setPrimaryAccount = createAsyncThunk(
  `${emailStoreKey}/setprimaryaccount`,
  async (id: string, thunkApi) => {
    try {
      const requestPath = `${emailAccountsPath}/${id}/activation`;

      const response = await axios.put(requestPath);

      if (response.status == 200) {
        thunkApi.dispatch(successAlert('Account set as primary successfully'));
        thunkApi.dispatch(getEmailAccounts());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error. Please, try again later.'));
    }
  },
);

export const deleteAccount = createAsyncThunk(
  `${emailStoreKey}/deleteaccount`,
  async (id: string, thunkApi) => {
    try {
      const requestPath = `${emailAccountsPath}/${id}/delete`;

      const response = await axios.put(requestPath);

      if (response.status == 200) {
        thunkApi.dispatch(successAlert('Account deleted successfully'));
        thunkApi.dispatch(getEmailAccounts());
      }
      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error deleting this account. Please, try again later.'));
    }
  },
);

export const getEmailAccounts = createAsyncThunk(
  `${emailStoreKey}/getEmailAccounts`,
  async (_, thunkApi) => {
    try {
      const requestPath = `${emailAccountsPath}/`;
      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorSideAlert('Error getting email signature. Please, try again later.'));
    }
  },
);
