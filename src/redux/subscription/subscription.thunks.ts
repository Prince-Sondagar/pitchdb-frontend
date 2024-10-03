import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionStoreKey } from '.';
import { errorAlert, errorSideAlert, successAlert } from '../alerts';
import { Token } from '@stripe/stripe-js';
import { IUserSubscription } from '../../types';

interface IPaySubscription {
  token: Token;
  planId: string;
}

interface IAddUserSubscriptionPlan {
  userId: string;
  planId: string;
  email: string;
  name: string;
  stripeId: string;
}

interface IAddSubscriptionPlanToStripe {
  interval: string;
  interval_count: number;
  currency: string;
  amount: number;
  'product[name]': string;
  nickname: string;
  'metadata[app_credits]': number;
  'metadata[app_name]': string;
}

interface IPayBundle {
  token: Token;
  bundleId: string;
}

const basePath = import.meta.env.VITE_API_BASE_URL;
const subscriptionPath = `${basePath}/subscriptions`;

export const getSubscriptionPlans = createAsyncThunk(
  `${subscriptionStoreKey}/getSubscriptionPlans`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${subscriptionPath}/plans`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the subscription plans. Please, try again later.'),
      );
    }
  },
);

export const paySubscription = createAsyncThunk(
  `${subscriptionStoreKey}/paySubscription`,
  async (params: IPaySubscription, thunkApi) => {
    const { token, planId } = params;
    try {
      await axios.post(`${subscriptionPath}`, { token, planId });

      return { success: true };
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error processing the payment for the plan selected. Please, try again later.'),
      );
    }
  },
);

export const getBundlePlans = createAsyncThunk(
  `${subscriptionStoreKey}/getBundlePlans`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${basePath}/bundles`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorSideAlert('Error getting the bundle plans. Please, try again later.'));
    }
  },
);

export const payBundle = createAsyncThunk(
  `${subscriptionStoreKey}/payBundle`,
  async (params: IPayBundle, thunkApi) => {
    try {
      await axios.post(`${basePath}/payments/bundle`, params);

      return { success: true };
    } catch (error) {
      thunkApi.dispatch(
        errorAlert(
          'Error processing the payment for the bundle selected. Please, try again later.',
        ),
      );
    }
  },
);

export const getUserCreditCounter = createAsyncThunk(
  `${subscriptionStoreKey}/getUserCreditCounter`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${basePath}/counters`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the user credits counter. Please, try again later.'),
      );
    }
  },
);

export const getUserSubscriptionPlan = createAsyncThunk(
  `${subscriptionStoreKey}/getUserSubscriptionPlan`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${subscriptionPath}/current`);
      let userSubscription: IUserSubscription;

      if (response.data?.type) {
        userSubscription = response.data;
      } else {
        userSubscription = {
          type: 'Pay as you pitch',
          scheduledToCancel: false,
        };
      }

      return userSubscription;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting the user subscription plan. Please, try again later.'),
      );
    }
  },
);

export const updateUserSubscriptionPlan = createAsyncThunk(
  `${subscriptionStoreKey}/updateUserSubscriptionPlan`,
  async (newPlanId: string, thunkApi) => {
    try {
      const response = await axios.put(`${subscriptionPath}/current`, {
        planId: newPlanId,
      });

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error updating the user subscription plan. Please, try again later.'),
      );
    }
  },
);

export const cancelUserSubscriptionPlan = createAsyncThunk(
  `${subscriptionStoreKey}/cancelUserSubscriptionPlan`,
  async (_, thunkApi) => {
    try {
      const response = await axios.delete(`${subscriptionPath}/current`);

      thunkApi.dispatch(successAlert('Plan cancelled sucessfully'));
      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error cancelling the user subscription plan. Please, try again later.'),
      );
    }
  },
);

// ADMIN ENDPOINTS
export const addUserSubscriptionPlan = createAsyncThunk(
  `${subscriptionStoreKey}/addUserSubscriptionPlan`,
  async (params: IAddUserSubscriptionPlan, thunkApi) => {
    const { userId, planId, email, name, stripeId } = params;
    const transformedParamsForBe = {
      userid: userId,
      planId,
      email,
      name,
      stripe_id: stripeId,
    };
    try {
      const response = await axios.post(
        `${subscriptionPath}/addSubscription`,
        transformedParamsForBe,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error cancelling the user subscription plan. Please, try again later.'),
      );
    }
  },
);

export const addSubscriptionPlanToStripe = createAsyncThunk(
  `${subscriptionStoreKey}/addSubscriptionPlanToStripe`,
  async (newPlan: IAddSubscriptionPlanToStripe, thunkApi) => {
    try {
      await axios.post(`${subscriptionPath}/addPlan`, { requestBody: newPlan });

      return { success: true };
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error adding the new subscription plan to Stripe. Please, try again later.'),
      );
    }
  },
);

export const getStripeSubscriptionPlansData = createAsyncThunk(
  `${subscriptionStoreKey}/getStripeSubscriptionPlansData`,
  async (_, thunkApi) => {
    try {
      const response = await axios.get(`${subscriptionPath}/getStripePlansdata`);

      if (response.status === 200) {
        return response.data.data;
      }

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error getting subscription plans data from Stripe. Please, try again later.'),
      );
    }
  },
);
