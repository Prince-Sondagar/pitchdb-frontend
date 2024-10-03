import { Button, Divider, TextField, Typography } from '@mui/material';
import styles from '../../../Account.module.css';
import { authMessages, socialNetworks } from '../../../../../constants';
import { SocialAuthenticationButton } from '../../../../home/components';
import { getFromQueryParams } from '../../../../../utils';
import { useAppDispatch } from '../../../../../redux/hooks';
import { setCookies } from '../../../../../redux/cookies';
import { requestSocialAuthenticationHelper } from '../../../../../redux/authentication/helpers';
import { passwordValidation } from '../../../../../utils';
import { useState } from 'react';
import { changePassword } from '../../../../../redux/user';

interface IPasswordProps {
  isSignIn: boolean;
  currentMethod?: string;
}

export const PasswordTab: React.FC<IPasswordProps> = ({ currentMethod, isSignIn }) => {
  const dispatch = useAppDispatch();

  const [formVisible, setFormVisible] = useState(false);
  const [passwordFitsRegex, setPasswordFitsRegex] = useState(false);
  const [password, setPassword] = useState({
    password: '',
    newPassword: '',
    reNewPassword: '',
  });

  const switchVisibleForm = () => {
    setFormVisible(!formVisible);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;

    switch (inputName) {
      case 'newPassword': {
        setPassword((prevState) => ({
          ...prevState,
          newPassword: event.target.value,
        }));
        validatePassWordsMatch();
        validateNewPassword(event.target.value);
        break;
      }
      case 'reNewPassword': {
        setPassword((prevState) => ({
          ...prevState,
          reNewPassword: event.target.value,
        }));
        validatePassWordsMatch();
        break;
      }
      case 'password': {
        setPassword((prevState) => ({
          ...prevState,
          password: event.target.value,
        }));
        break;
      }
      default:
        break;
    }
  };

  const validateNewPassword = (value: string) => {
    const regexTest = passwordValidation(value);

    if (!passwordFitsRegex && regexTest) {
      setPasswordFitsRegex(true);
    } else if (passwordFitsRegex && !regexTest) {
      setPasswordFitsRegex(false);
    }
  };

  const validatePassWordsMatch = () => {
    return password.newPassword.length > 0 && password.newPassword === password.reNewPassword;
  };

  const handleChangePassword = () => {
    const params = {
      password: password.password,
      newPassword: password.newPassword,
    };

    dispatch(changePassword(params));
  };

  const signInOrUpWithSocial = (network: socialNetworks) => {
    const queryParams = window.location.search.substring(1).split('&');

    const inviteToken = getFromQueryParams(queryParams, 'inv');

    dispatch(
      setCookies({
        key: 'inviteToken',
        value: inviteToken || '',
      }),
    );

    dispatch(
      setCookies({
        key: 'authNetwork',
        value: network,
      }),
    );

    requestSocialAuthenticationHelper({
      socialSite: network,
      isSignIn,
      dispatch,
    });
  };

  return (
    <div className={`${styles.content}`}>
      <div className={styles.contentWrapper}>
        <Typography variant="h3">Password</Typography>
        <Typography variant="subtitle1">
          {currentMethod === authMessages.PITCHDB_CREDENTIALS
            ? 'Change the password you use to sign-in into PitchDB'
            : 'You are currently using an external method to sign-in into PitchDB'}
        </Typography>
      </div>

      {!formVisible && currentMethod === 'PitchDB credentials' && (
        <div style={{ margin: '1rem 2rem 1rem 2rem' }}>
          <Button variant="contained" onClick={switchVisibleForm}>
            Update Password
          </Button>
        </div>
      )}
      {formVisible && (
        <>
          <div style={{ margin: '1rem 2rem 0rem 2rem' }}>
            <TextField
              label="Current Password"
              type="password"
              name="password"
              onChange={onChangePassword}
              value={password.password}
              inputProps={{ min: 6, max: 40 }}
            />
          </div>

          <div style={{ margin: '1rem 2rem 0rem 2rem' }}>
            <Typography style={{ marginBottom: '1rem' }}>
              {' '}
              Your password must contain a minimum of eight characters, at least one uppercase
              letter, one lowercase letter and one number{' '}
            </Typography>
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              onChange={onChangePassword}
              value={password.newPassword}
              inputProps={{ min: 6, max: 40 }}
              required
              error={password.newPassword.length > 0 && !passwordFitsRegex}
              helperText={
                password.newPassword
                  ? !passwordFitsRegex
                    ? 'Your password is too weak'
                    : 'Your password is strong enough'
                  : ''
              }
            />
          </div>
          <div style={{ margin: '1rem 2rem 0rem 2rem' }}>
            <TextField
              label="Retype new Password"
              name="reNewPassword"
              type="password"
              onChange={onChangePassword}
              value={password.reNewPassword}
              inputProps={{ min: 6, max: 40 }}
              required
            />
            <Typography color={'red'}>
              {' '}
              {password.reNewPassword
                ? !validatePassWordsMatch()
                  ? 'Passwords do not match'
                  : ''
                : ''}{' '}
            </Typography>
          </div>

          <div style={{ margin: '1rem 2rem 2rem 2rem' }}>
            <Button onClick={switchVisibleForm}> Cancel </Button>
            <Button
              onClick={handleChangePassword}
              disabled={!validatePassWordsMatch()}
              variant="contained"
            >
              {' '}
              Update{' '}
            </Button>
          </div>
        </>
      )}

      <Divider variant="middle" />

      <div className={styles.contentWrapper}>
        <Typography variant="h3">Sign-in</Typography>
        <Typography variant="subtitle1"> Configure the way you sign-in into PitchDB </Typography>
      </div>

      <div className={styles.socialButtonsWrapper}>
        <Typography variant="subtitle1" fontWeight="fontWeightBold">
          Current sign-in method:
        </Typography>
        <Typography variant="subtitle1"> {currentMethod}</Typography>

        <SocialAuthenticationButton
          network={socialNetworks.LINKEDIN}
          onClick={() => signInOrUpWithSocial(socialNetworks.LINKEDIN)}
        />
        <SocialAuthenticationButton
          network={socialNetworks.GOOGLE}
          onClick={() => signInOrUpWithSocial(socialNetworks.GOOGLE)}
        />
        <SocialAuthenticationButton
          network={socialNetworks.FACEBOOK}
          onClick={() => signInOrUpWithSocial(socialNetworks.FACEBOOK)}
        />
        <SocialAuthenticationButton
          network={socialNetworks.MICROSOFT}
          onClick={() => signInOrUpWithSocial(socialNetworks.MICROSOFT)}
        />
      </div>
    </div>
  );
};
