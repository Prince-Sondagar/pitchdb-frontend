import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { templateStoreKey } from '.';
import { errorAlert, successAlert, successSideAlert } from '../alerts';
import { IAddEmailTemplate, IEditEmailTemplate } from '../../types';

interface IRemoveEmailTemplate {
  userId: string;
  templateId: string;
}

interface IGetEmailById {
  userId: string;
  withStages: string;
}

const basePath = import.meta.env.VITE_API_BASE_URL;

const ADD_TEMPLATE_ENDPOINT = '/email-templates/';

export const getEmailTemplateById = createAsyncThunk(
  `${templateStoreKey}/getemailtemplatebyid`,
  async (params: IGetEmailById) => {
    const { userId, withStages } = params;

    try {
      const requestPath = basePath + ADD_TEMPLATE_ENDPOINT + userId + '?withStages=' + withStages;

      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      errorAlert('Error, please try again later.');
    }
  },
);

export const getAllTemplates = createAsyncThunk(
  `${templateStoreKey}/getemaildata`,
  async (_, thunkApi) => {
    try {
      const requestPath = basePath + ADD_TEMPLATE_ENDPOINT;

      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error getting the templates, please try again later.'));
    }
  },
);

export const addEmailTemplate = createAsyncThunk(
  `${templateStoreKey}/addemailtemplate`,
  async (params: IAddEmailTemplate, thunkApi) => {
    const { userId, template } = params;

    try {
      const requestPath = basePath + ADD_TEMPLATE_ENDPOINT + userId + '/add-template';

      //add the email template
      const response = await axios.put(requestPath, template);

      if (response.status === 200) {
        thunkApi.dispatch(successSideAlert(`Successfully added a new email template.`));
        //recover all the templates again
        thunkApi.dispatch(getAllTemplates());
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error, please try again later.'));
    }
  },
);

export const editEmailTemplate = createAsyncThunk(
  `${templateStoreKey}/editemailtemplate`,
  async (params: IEditEmailTemplate, thunkApi) => {
    const { template, templateId } = params;

    try {
      const requestPath =
        basePath + ADD_TEMPLATE_ENDPOINT + templateId + '/edit-template/' + template._id;

      const response = await axios.put(requestPath, template);

      if (response.status == 200) {
        thunkApi.dispatch(getAllTemplates());

        thunkApi.dispatch(successAlert('The template was edited successfully.'));
      } else {
        thunkApi.dispatch(errorAlert('Oops, something went wrong. Please try again later.'));
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error, please try again later.'));
    }
  },
);

export const removeEmailTemplate = createAsyncThunk(
  `${templateStoreKey}/removeemailtemplate`,
  async (params: IRemoveEmailTemplate, thunkApi) => {
    const { userId, templateId } = params;

    try {
      if (templateId && templateId.trim() !== '') {
        const requestPath =
          basePath + ADD_TEMPLATE_ENDPOINT + userId + '/remove-template/' + templateId;

        const response = await axios.delete(requestPath);

        if (response.status == 200) {
          //recover all the templates again
          thunkApi.dispatch(getAllTemplates());

          thunkApi.dispatch(successAlert('The template was deleted successfully.'));
        } else {
          thunkApi.dispatch(errorAlert('Oops, something went wrong. Please try again later.'));
        }

        return response.data;
      }
    } catch (error) {
      thunkApi.dispatch(errorAlert('Oops, something went wrong. Please try again later.'));
    }
  },
);

/* 
export const getEmailReport = createAsyncThunk(
  `${templateStoreKey}/emailvalidity"`,
  async (params: IGetEmailById, thunkApi) => {
    const { userId } = params;

    try {
      const requestPath = basePath + ADD_TEMPLATE_ENDPOINT + userId + '/email-validity';

      const response = await axios.get(requestPath);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error, please try again later.'));
    }
  },
);
 */
