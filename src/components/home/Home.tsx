import { useState } from 'react';
import backgroundImage from '../../assets/images/pitchdb-background.png';
import logo from '../../assets/logos/pitchdb-logo.png';
import { AuthenticationDisplay, ForgotPasswordDisplay } from './components';
import styles from './Home.module.css';
import { useAppSelector } from '../../redux/hooks';
import { authenticationSelectors } from '../../redux/authentication';

interface IProps {
  isInvite?: boolean;
}

export function Home({ isInvite }: IProps) {
  const [forgetPasswordVisible, setForgetPasswordVisible] = useState(false);
  const authenticationIsLoading = useAppSelector(authenticationSelectors.isLoading);

  const toggleForgotPassword = () => {
    setForgetPasswordVisible((prev) => !prev);
  };

  return (
    <div className={styles.home} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.panel}>
        <div className={styles.logoWrapper}>
          <img src={logo} alt="Company logo" />
        </div>
        {!forgetPasswordVisible ? (
          <AuthenticationDisplay
            isInvite={isInvite ?? false}
            toggleForgotPassword={toggleForgotPassword}
            isLoading={authenticationIsLoading}
          />
        ) : (
          <ForgotPasswordDisplay
            toggleForgotPassword={toggleForgotPassword}
            isLoading={authenticationIsLoading}
          />
        )}
      </div>
    </div>
  );
}
