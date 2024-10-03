import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Bundles, IBundle, ISubscription, Subscriptions } from './components';
import styles from './BuyCredits.module.css';
import { formatDate } from '../../utils';

export interface IBuyingItem {
  selectedPlan?: ISubscription;
  selectedBundle?: IBundle;
}

export interface IFormData {
  country: ILocationParameter | null;
  state: ILocationParameter | null;
  city: ILocationParameter | null;
  address: string;
  name: string;
}

interface ILocationParameter {
  _id: string;
  label: string;
  value: string;
  refId: string;
}

export function BuyCredits() {
  const navigate = useNavigate();

  const [beginTransaction, setBeginTransaction] = useState(false);
  const [successItem, setSuccessItem] = useState<IBuyingItem | null>(null);

  const toggleBeginTransaction = (beginTransaction: boolean) => {
    setBeginTransaction(beginTransaction);
  };

  const toggleSuccessItem = (successItem: IBuyingItem) => {
    setSuccessItem(successItem);
  };

  return (
    <>
      {!successItem ? (
        <>
          <Subscriptions
            beginTransaction={beginTransaction}
            toggleBeginTransaction={toggleBeginTransaction}
            toggleSuccessItem={toggleSuccessItem}
          />
          <Bundles
            beginTransaction={beginTransaction}
            toggleBeginTransaction={toggleBeginTransaction}
            toggleSuccessItem={toggleSuccessItem}
          />
        </>
      ) : (
        <div className={styles.paymentConfirmedWrapper}>
          <Typography variant="h3" color="text.primary" gutterBottom>
            Upgrade processed successfully
          </Typography>
          <Typography variant="body1" color="text.primary">
            <b>Transaction date:</b> {formatDate(null)}
          </Typography>
          {successItem.selectedPlan ? (
            <>
              <Typography variant="body1" color="text.primary">
                <b>Plan:</b> {successItem.selectedPlan.name}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <b>Price:</b>{' '}
                {`$${successItem.selectedPlan.price} / ${successItem.selectedPlan.interval}`}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body1" color="text.primary">
                <b>Bundle:</b> {successItem.selectedBundle?.type}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <b>Price:</b> {`$${successItem.selectedBundle?.price}`}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <b>Credits:</b> {successItem.selectedBundle?.amount}
              </Typography>
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('../outreach-sequences-mail')}
            sx={{ mt: '1rem' }}
          >
            Back to main page
          </Button>
        </div>
      )}
    </>
  );
}
