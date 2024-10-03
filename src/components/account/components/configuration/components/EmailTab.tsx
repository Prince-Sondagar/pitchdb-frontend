import { Button, Typography } from '@mui/material';
import styles from '../../../Account.module.css';
import { IEmailAccount } from '../../../../../types';
import { parseDate } from '../../../../../utils';
import { SocialAuthenticationButton } from '../../../../home/components';
import { socialNetworks } from '../../../../../constants';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { openConfirmation } from '../../../../../redux/alerts';
import {
  deleteAccount,
  emailSelectors,
  getEmailAccounts,
  setPrimaryAccount,
} from '../../../../../redux/email';
import { useEffect, useState } from 'react';
import { requestSocialAuthentication } from '../../../../../redux/authentication';

interface IEmailTabProps {
  isSignIn: boolean;
}

export const EmailTab: React.FC<IEmailTabProps> = ({ isSignIn }) => {
  const dispatch = useAppDispatch();
  const emailAccountsData = useAppSelector(emailSelectors.emailAccounts);

  const [emailAccounts, setEmailAccounts] = useState<IEmailAccount[] | null>(null);

  useEffect(() => {
    dispatch(getEmailAccounts());
  }, []);

  useEffect(() => {
    setEmailAccounts(emailAccountsData);
  }, [emailAccountsData]);

  const handleSetPrimaryAccount = async (id: string) => {
    const isConfirmed = await dispatch(
      openConfirmation({
        message: 'Set this account as your primary sending account?',
        title: 'Confirm',
      }),
    ).unwrap();

    if (isConfirmed) {
      dispatch(setPrimaryAccount(id));
    }
  };

  const handleDeleteAccount = async (id: string) => {
    const isConfirmed = await dispatch(
      openConfirmation({
        message: 'Are you sure you want to delete this account?',
        title: 'Delete',
      }),
    ).unwrap();

    if (isConfirmed) {
      dispatch(deleteAccount(id));
    }
  };

  //not used yet
  const configureAccount = (network: socialNetworks) => {
    const params = {
      socialSite: network,
      isSignIn: isSignIn,
      isEmailConfiguration: true,
    };

    dispatch(requestSocialAuthentication(params));
  };

  return (
    <div className={`${styles.content}`}>
      <div style={{ margin: '2rem 2rem 1rem 2rem' }}>
        <Typography variant="h3">Email</Typography>
      </div>

      <div style={{ margin: '1rem 2rem 0rem 2rem' }}>
        <Typography variant="subtitle1">
          {' '}
          Set up the email accounts you will use in your outreach sequences.
        </Typography>
      </div>

      <div style={{ margin: '2rem 2rem 1rem 2rem' }}>
        <Typography variant="h3">{'Connected accounts:'}</Typography>

        {emailAccounts &&
          emailAccounts.map((account, index) => {
            return (
              <div key={index} style={{ margin: '2rem 0rem 1rem 0rem' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div>
                    {account?.email ? (
                      <Typography fontWeight="600">{account.email} </Typography>
                    ) : (
                      <Typography>Gmail account</Typography>
                    )}
                  </div>
                  {index === 0 ? (
                    <div style={{ marginLeft: '2rem' }}>
                      <Typography fontWeight="600">(Primary)</Typography>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Button onClick={() => handleSetPrimaryAccount(account._id)}>
                          Set as primary
                        </Button>
                      </div>
                      <div>
                        <Button onClick={() => handleDeleteAccount(account._id)}>
                          (Delete account)
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                {account?.date && (
                  <Typography sx={{ marginTop: '1rem' }}>
                    {' '}
                    {'Connected on ' + parseDate(account.date)}{' '}
                  </Typography>
                )}
              </div>
            );
          })}
      </div>
      <div className={styles.socialButtonsWrapper}>
        <SocialAuthenticationButton
          network={socialNetworks.GOOGLE}
          onClick={() => configureAccount(socialNetworks.GOOGLE)}
        />
        <SocialAuthenticationButton
          network={socialNetworks.MICROSOFT}
          onClick={() => configureAccount(socialNetworks.MICROSOFT)}
        />
      </div>
    </div>
  );
};
