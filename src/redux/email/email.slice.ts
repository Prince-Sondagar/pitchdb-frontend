import { createSlice } from '@reduxjs/toolkit';
import { emailStoreKey } from './email.const';
import {
  getEmailSignature,
  sendEmail,
  getEmailReport,
  getPrimaryEmailAccount,
  getEmailAccounts,
} from '.';
import { IEmailAccount } from '../../types';

interface IState {
  isLoading: boolean;
  emailSignatureData: string;
  primaryEmailAccount: string | null;
  emailAccounts: IEmailAccount[] | null;
}

const initialState: IState = {
  isLoading: false,
  emailSignatureData: '',
  primaryEmailAccount: null,
  emailAccounts: null,
};

export const emailSlice = createSlice({
  name: emailStoreKey,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //getEmailSignature
    builder.addCase(getEmailSignature.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getEmailSignature.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getEmailSignature.fulfilled, (state, action) => {
      state.isLoading = false;
      state.emailSignatureData = action.payload[0]?.emailsignature ?? '';
    });
    // getPrimaryEmailAccount
    builder.addCase(getPrimaryEmailAccount.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPrimaryEmailAccount.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getPrimaryEmailAccount.fulfilled, (state, action) => {
      state.isLoading = false;
      state.primaryEmailAccount = action.payload?.data.email ?? null;
    });
    //sendEmail
    builder.addCase(sendEmail.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(sendEmail.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(sendEmail.fulfilled, (state) => {
      state.isLoading = false;
    });
    //getEmailReport
    builder.addCase(getEmailReport.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getEmailReport.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getEmailReport.fulfilled, (state) => {
      state.isLoading = false;
    });
    //getEmailAccounts
    builder.addCase(getEmailAccounts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getEmailAccounts.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getEmailAccounts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.emailAccounts = action.payload;
    });
  },
});
