import { type RootState } from '../store';

const isLoading = (state: RootState) => state.subscription.isLoading;
const userSubscription = (state: RootState) => state.subscription.userSubscription;
const credits = (state: RootState) => state.subscription.credits;
const subscriptionPlans = (state: RootState) => state.subscription.subscriptionPlans;

export const subscriptionSelectors = { isLoading, userSubscription, credits, subscriptionPlans };
