import { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent, Token } from '@stripe/stripe-js';
import { Button, Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { IBundle, ISubscription } from '.';
import { formatToTitleCase } from '../../../utils';
import { IUserSubscription } from '../../../types';
import styles from '../BuyCredits.module.css';

interface IProps {
  userPlan: IUserSubscription | null;
  selectedPlan?: ISubscription;
  selectedBundle?: IBundle;
  processPaySubscription?: (token: Token) => void;
  processPayBundle?: (token: Token) => void;
  upgradePlan?: () => void;
}

export function PaymentForm({
  userPlan,
  selectedPlan,
  selectedBundle,
  processPaySubscription,
  processPayBundle,
  upgradePlan,
}: IProps) {
  window.scrollTo(0, 0);

  const stripe = useStripe();
  const elements = useElements();

  const [formIsComplete, setFormIsComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cardElement = elements?.getElement(CardElement);

    if (cardElement) {
      const response = await stripe?.createToken(cardElement);

      if (response?.token) {
        if (processPaySubscription) {
          processPaySubscription(response.token);
        } else if (processPayBundle) {
          processPayBundle(response.token);
        }
      }
    }
  };

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setFormIsComplete(event.complete);
  };

  return (
    <div className={styles.paymentForm}>
      {processPaySubscription ? (
        <>
          <Typography variant="h3" color="text.primary" gutterBottom>
            Upgrade to {selectedPlan?.name} plan
          </Typography>
          {selectedPlan?.description && (
            <Typography variant="body1" color="text.primary" gutterBottom>
              {selectedPlan.description}
            </Typography>
          )}
        </>
      ) : (
        <>
          <Typography variant="h3" color="text.primary" gutterBottom>
            Get the {formatToTitleCase(selectedBundle?.type ?? '')} bundle
          </Typography>
          <Typography variant="body1" color="text.primary">
            <b>Pitches:</b> {selectedBundle?.amount}
          </Typography>
        </>
      )}
      <Typography variant="body1" color="text.primary">
        <b>Total to pay:</b> ${`${selectedPlan ? selectedPlan.price : selectedBundle?.price}`}{' '}
        {`${selectedPlan ? `/ ${selectedPlan.interval}` : ''}`}
      </Typography>
      {processPaySubscription && (
        <Typography variant="body2" color="text.primary" textAlign="center" mt="1rem">
          <b>Note:</b> If you already have a plan, purchasing this new plan will replace the
          previous one. You will be credited/debited the proration changes at the start of the next
          billing month.
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" color="text.primary" mt="2rem" textAlign="center">
          Enter your payment information
        </Typography>
        <div className={styles.security}>
          <Typography variant="body2" color="text.secondary">
            Powered & secured by{' '}
            <a href="https://stripe.com/" target="_blank">
              Stripe
            </a>
          </Typography>
          <SecurityIcon color="primary" fontSize="small" />
        </div>
        <div className={styles.cardWrapper}>
          <CardElement
            id="my-card"
            onChange={handleCardChange}
            options={{
              iconStyle: 'solid',
              style: {
                base: {
                  iconColor: 'rgba(0, 26, 183, 1)',
                  color: 'rgb(13 13, 13)',
                },
                invalid: {
                  iconColor: 'rgb(211, 47, 47)',
                  color: 'rgb(211, 47, 47)',
                },
              },
            }}
          />
        </div>
        {selectedPlan ? (
          <>
            {userPlan ? (
              <Button
                variant="contained"
                color="primary"
                onClick={upgradePlan}
                disabled={!formIsComplete}
              >
                Change plan
              </Button>
            ) : (
              <Button variant="contained" color="primary" type="submit" disabled={!formIsComplete}>
                Pay upgrade
              </Button>
            )}
          </>
        ) : (
          <Button variant="contained" color="primary" type="submit" disabled={!formIsComplete}>
            Pay bundle
          </Button>
        )}
      </form>
    </div>
  );
}
