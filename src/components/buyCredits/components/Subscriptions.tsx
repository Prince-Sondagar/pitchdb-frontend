import { useCallback, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Token, loadStripe } from '@stripe/stripe-js';
import { Button, IconButton, Typography } from '@mui/material';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  cancelUserSubscriptionPlan,
  getSubscriptionPlans,
  getUserSubscriptionPlan,
  paySubscription,
  subscriptionSelectors,
  updateUserSubscriptionPlan,
} from '../../../redux/subscription';
import { IBuyingItem } from '../BuyCredits';
import { openConfirmation } from '../../../redux/alerts/alerts.thunks';
import { PaymentForm } from '.';
import { LoadingDisplay } from '../../../common';
import { loadingDisplayTypes } from '../../../types';
import styles from '../BuyCredits.module.css';

export interface ISubscription {
  id: string;
  price: number;
  interval: string;
  name?: string;
  description?: string;
}

interface IProps {
  beginTransaction: boolean;
  toggleBeginTransaction: (beginTransaction: boolean) => void;
  toggleSuccessItem: (item: IBuyingItem) => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export function Subscriptions({
  beginTransaction,
  toggleBeginTransaction,
  toggleSuccessItem,
}: IProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(subscriptionSelectors.isLoading);
  const userPlan = useAppSelector(subscriptionSelectors.userSubscription);

  const [plans, setPlans] = useState<ISubscription[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ISubscription | null>(null);

  const fetchPlans = useCallback(async () => {
    const response = await dispatch(getSubscriptionPlans()).unwrap();

    if (response) {
      setPlans(response);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSelectPlan = (selectedPlan: ISubscription) => {
    toggleBeginTransaction(true);
    setSelectedPlan(selectedPlan);
  };

  const processPaySubscription = async (token: Token) => {
    const planId = selectedPlan?.id;

    if (planId) {
      const response = await dispatch(
        paySubscription({
          token,
          planId,
        }),
      ).unwrap();

      if (response?.success) {
        dispatch(getUserSubscriptionPlan());
        toggleSuccessItem({ selectedPlan });
      }
    }
  };

  const upgradePlan = async () => {
    const planId = selectedPlan?.id;

    if (planId) {
      const response = await dispatch(updateUserSubscriptionPlan(planId)).unwrap();

      if (response) {
        toggleSuccessItem({ selectedPlan });
      }
    }
  };

  const cancelPlan = async () => {
    const confirmation = await dispatch(
      openConfirmation({
        message: 'Cancel your current plan?',
        confirmMessage: 'Cancel plan',
      }),
    ).unwrap();

    if (confirmation) {
      dispatch(cancelUserSubscriptionPlan());
    }
  };

  return (
    <>
      {!beginTransaction && (
        <div className={styles.planOptions}>
          {userPlan && (
            <>
              <div className={styles.userPlanWrapper}>
                <div className={styles.cancelPlanWrapper}>
                  <div>
                    <Typography variant="body2" color="text.secondary">
                      <b>Your current plan:</b> {userPlan.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Credits per month:</b> {userPlan.credits ?? 'Infinite!'}
                    </Typography>
                  </div>
                  {!userPlan?.scheduledToCancel && (
                    <div>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={cancelPlan}
                        sx={{ width: '8rem' }}
                      >
                        Cancel plan
                      </Button>
                    </div>
                  )}
                </div>
                {!userPlan?.scheduledToCancel ? (
                  <Typography variant="body2" color="text.secondary">
                    <b>Note:</b> Canceling your current plan will remove all the pitches that you
                    gained from it when the current billing month ends.
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    <b>Note:</b> You have scheduled to cancel your subscription at the end of the
                    month.
                  </Typography>
                )}
              </div>
            </>
          )}
          <Typography variant="h3" color="primary" m="2rem 0">
            Subscription plans
          </Typography>
          <div className={styles.itemsMappedWrapper}>
            {isLoading && <LoadingDisplay type={loadingDisplayTypes.entireComponent} />}
            {!isLoading &&
              plans.map((plan, index) => {
                return (
                  <div className={styles.planItem} key={index}>
                    <div className={styles.header}>
                      <Typography variant="h5" color="text.secondary" fontWeight="bold">
                        {plan.name ?? `Plan #${index}`}
                      </Typography>
                    </div>
                    <div className={styles.body}>
                      {plan.description && (
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          {plan.description}
                        </Typography>
                      )}
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {`$${plan.price} / ${plan.interval}`}
                      </Typography>
                      {userPlan?.planId === plan.id ? (
                        <Typography variant="body2" color="text.secondary" fontWeight="bold">
                          Selected
                        </Typography>
                      ) : (
                        <IconButton color="primary" onClick={() => handleSelectPlan(plan)}>
                          <AdsClickIcon />
                        </IconButton>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {beginTransaction && selectedPlan && (
        <>
          {isLoading ? (
            <LoadingDisplay type={loadingDisplayTypes.entireComponent} />
          ) : (
            <div className={styles.transactionInProcess}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  toggleBeginTransaction(false);
                  setSelectedPlan(null);
                }}
                sx={{ mb: '1rem' }}
              >
                Go back
              </Button>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  upgradePlan={upgradePlan}
                  userPlan={userPlan}
                  selectedPlan={selectedPlan ?? undefined}
                  processPaySubscription={processPaySubscription}
                />
              </Elements>
            </div>
          )}
        </>
      )}
    </>
  );
}
