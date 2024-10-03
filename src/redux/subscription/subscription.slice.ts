import { createSlice } from '@reduxjs/toolkit';
import { subscriptionStoreKey } from './subscription.const';
import {
  addSubscriptionPlanToStripe,
  addUserSubscriptionPlan,
  cancelUserSubscriptionPlan,
  getBundlePlans,
  getStripeSubscriptionPlansData,
  getSubscriptionPlans,
  getUserCreditCounter,
  getUserSubscriptionPlan,
  payBundle,
  paySubscription,
  updateUserSubscriptionPlan,
} from '.';
import { ISubscriptionPlan, IUserSubscription } from '../../types';

interface ICredits {
  _id: string;
  remaining: number;
  used: number;
}

interface IState {
  isLoading: boolean;
  userSubscription: IUserSubscription | null;
  credits: ICredits | null;
  subscriptionPlans: ISubscriptionPlan[] | null;
}

const initialState: IState = {
  isLoading: false,
  userSubscription: null,
  credits: null,
  subscriptionPlans: null,
};

export const subscriptionSlice = createSlice({
  name: subscriptionStoreKey,
  initialState,
  reducers: {},
  extraReducers(builder) {
    // getSubscriptionPlans
    builder.addCase(getSubscriptionPlans.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSubscriptionPlans.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getSubscriptionPlans.fulfilled, (state, action) => {
      state.isLoading = false;
      state.subscriptionPlans = action.payload;
    });
    // paySubscription
    builder.addCase(paySubscription.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(paySubscription.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(paySubscription.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getBundlePlans
    builder.addCase(getBundlePlans.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getBundlePlans.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getBundlePlans.fulfilled, (state) => {
      state.isLoading = false;
    });
    // payBundle
    builder.addCase(payBundle.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(payBundle.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(payBundle.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getUserCreditCounter
    builder.addCase(getUserCreditCounter.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserCreditCounter.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserCreditCounter.fulfilled, (state, action) => {
      state.isLoading = false;
      state.credits = action.payload;
    });
    // getUserSubscriptionPlan
    builder.addCase(getUserSubscriptionPlan.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserSubscriptionPlan.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserSubscriptionPlan.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userSubscription = action.payload ?? null;
    });
    // updateUserSubscriptionPlan
    builder.addCase(updateUserSubscriptionPlan.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserSubscriptionPlan.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateUserSubscriptionPlan.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userSubscription = action.payload;
    });
    // cancelUserSubscriptionPlan
    builder.addCase(cancelUserSubscriptionPlan.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(cancelUserSubscriptionPlan.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(cancelUserSubscriptionPlan.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userSubscription = action.payload;
    });
    // addUserSubscriptionPlan
    builder.addCase(addUserSubscriptionPlan.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addUserSubscriptionPlan.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addUserSubscriptionPlan.fulfilled, (state) => {
      state.isLoading = false;
    });
    // addSubscriptionPlanToStripe
    builder.addCase(addSubscriptionPlanToStripe.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addSubscriptionPlanToStripe.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addSubscriptionPlanToStripe.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getStripeSubscriptionPlansData
    builder.addCase(getStripeSubscriptionPlansData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getStripeSubscriptionPlansData.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getStripeSubscriptionPlansData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.subscriptionPlans = action.payload;
    });
  },
});
