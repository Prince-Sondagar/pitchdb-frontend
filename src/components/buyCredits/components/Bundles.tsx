import { useCallback, useEffect, useState } from 'react';
import { Token, loadStripe } from '@stripe/stripe-js';
import { Button, IconButton, Typography } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  getBundlePlans,
  getUserCreditCounter,
  payBundle,
  subscriptionSelectors,
} from '../../../redux/subscription';
import { IBuyingItem } from '../BuyCredits';
import { PaymentForm } from '.';
import styles from '../BuyCredits.module.css';
import { LoadingDisplay } from '../../../common';
import { loadingDisplayTypes } from '../../../types';

export interface IBundle {
  _id: string;
  type: string;
  amount: number;
  price: number;
}

interface IProps {
  beginTransaction: boolean;
  toggleBeginTransaction: (beginTransaction: boolean) => void;
  toggleSuccessItem: (item: IBuyingItem) => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export function Bundles({ beginTransaction, toggleBeginTransaction, toggleSuccessItem }: IProps) {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(subscriptionSelectors.isLoading);
  const userPlan = useAppSelector(subscriptionSelectors.userSubscription);

  const [plans, setPlans] = useState<IBundle[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<IBundle | null>(null);

  const fetchPlans = useCallback(async () => {
    const response = await dispatch(getBundlePlans()).unwrap();

    if (response) {
      setPlans(response);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSelectPlan = (selectedPlan: IBundle) => {
    toggleBeginTransaction(true);
    setSelectedPlan(selectedPlan);
  };

  const processPayBundle = async (token: Token) => {
    const bundleId = selectedPlan?._id;

    if (bundleId) {
      const response = await dispatch(
        payBundle({
          token,
          bundleId,
        }),
      ).unwrap();

      if (response?.success) {
        toggleSuccessItem({ selectedBundle: selectedPlan });
        dispatch(getUserCreditCounter());
      }
    }
  };

  return (
    <>
      {!beginTransaction && (
        <div className={styles.planOptions}>
          <Typography variant="h3" color="primary" m="2rem 0">
            Pitch refills
          </Typography>
          <div className={styles.itemsMappedWrapper}>
            {isLoading && <LoadingDisplay type={loadingDisplayTypes.entireComponent} />}
            {!isLoading &&
              plans.map((plan, index) => {
                return (
                  <div className={styles.bundleItem} key={index}>
                    <div className={styles.header}>
                      <Typography variant="h5" color="text.secondary" fontWeight="bold">
                        {plan.type}
                      </Typography>
                    </div>
                    <div className={styles.body}>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {plan.amount} pitch{plan.amount > 1 ? 'es' : ''}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {`$${plan.price}`}
                      </Typography>
                      <IconButton color="primary" onClick={() => handleSelectPlan(plan)}>
                        <AdsClickIcon />
                      </IconButton>
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
                  setSelectedPlan(null);
                  toggleBeginTransaction(false);
                }}
                sx={{ mb: '1rem' }}
              >
                Go back
              </Button>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  userPlan={userPlan}
                  selectedBundle={selectedPlan ?? undefined}
                  processPayBundle={processPayBundle}
                />
              </Elements>
            </div>
          )}
        </>
      )}
    </>
  );
}
