import { createSlice } from '@reduxjs/toolkit';
import { templateStoreKey } from './template.const';
import { ITemplate } from '../../types';

import {
  getAllTemplates,
  getEmailTemplateById,
  editEmailTemplate,
  addEmailTemplate,
  removeEmailTemplate,
} from '.';

interface IState {
  isLoading: boolean;
  emailTemplates: ITemplate[];
}

const initialState: IState = {
  isLoading: false,
  emailTemplates: [],
};

export const templateSlice = createSlice({
  name: templateStoreKey,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //getEmailTemplateById
    builder.addCase(getEmailTemplateById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getEmailTemplateById.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getEmailTemplateById.rejected, (state) => {
      state.isLoading = false;
    });
    //addEmailTemplate
    builder.addCase(addEmailTemplate.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addEmailTemplate.fulfilled, (state, action) => {
      state.isLoading = false;
      state.emailTemplates = [...state.emailTemplates, action.payload];
    });
    builder.addCase(addEmailTemplate.rejected, (state) => {
      state.isLoading = false;
    });
    //getAllTemplates
    builder.addCase(getAllTemplates.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllTemplates.fulfilled, (state, action) => {
      state.isLoading = false;
      state.emailTemplates = action.payload;
    });
    builder.addCase(getAllTemplates.rejected, (state) => {
      state.isLoading = false;
    });
    //editEmailtemplate
    builder.addCase(editEmailTemplate.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editEmailTemplate.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(editEmailTemplate.rejected, (state) => {
      state.isLoading = false;
    });
    //deleteEmailtemplate
    builder.addCase(removeEmailTemplate.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(removeEmailTemplate.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(removeEmailTemplate.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
