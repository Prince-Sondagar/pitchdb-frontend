import { useEffect, useState, useCallback } from 'react';
import { Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import logo from '../../assets/logos/pitchdb-logo.png';
import { AccountMenu } from './components';
import { useAppSelector } from '../../redux/hooks';
import { userSelectors } from '../../redux/user';
import { subscriptionSelectors } from '../../redux/subscription';
import styles from './Header.module.css';
import { profileSelectors } from '../../redux/profile';

interface IProps {
  navigationIsMinimized: boolean;
  toggleNavigationIsMinimized: () => void;
}

export function Header({ navigationIsMinimized, toggleNavigationIsMinimized }: IProps) {
  const userData = useAppSelector(userSelectors.userData);
  const profileImagePath = useAppSelector(profileSelectors.userImagePath);
  const subscriptionPlan = useAppSelector(subscriptionSelectors.userSubscription);
  const remainingCredits = useAppSelector(subscriptionSelectors.credits)?.remaining;

  const [profileMenuIsOpen, setProfileMenuIsOpen] = useState(false);
  const [generalMenuIsOpen, setgeneralMenuIsOpen] = useState(false);
  const [errorInProfileImage, setErrorInProfileImage] = useState(false);

  const toggleProfileMenu = useCallback(() => {
    setProfileMenuIsOpen((prev) => !prev);
    if (!navigationIsMinimized) {
      toggleNavigationIsMinimized();
    }
  }, [navigationIsMinimized, toggleNavigationIsMinimized, setProfileMenuIsOpen]);

  useEffect(() => {
    if (window.innerWidth <= 600 && !navigationIsMinimized && profileMenuIsOpen) {
      toggleProfileMenu();
    }
  }, [navigationIsMinimized, profileMenuIsOpen, toggleProfileMenu]);

  const toggleGeneralMenu = useCallback(() => {
    setgeneralMenuIsOpen((prev) => !prev);
    setProfileMenuIsOpen(false);
    toggleNavigationIsMinimized();
  }, [toggleNavigationIsMinimized]);

  useEffect(() => {
    if (
      window.innerWidth <= 600 &&
      !navigationIsMinimized &&
      profileMenuIsOpen &&
      !generalMenuIsOpen
    ) {
      toggleProfileMenu();
    }
  }, [navigationIsMinimized, profileMenuIsOpen, toggleProfileMenu, generalMenuIsOpen]);

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.logoAndMobileToggleWrapper}>
        <div className={styles.mobileNavigationToggle} onClick={toggleGeneralMenu}>
          {navigationIsMinimized ? (
            <MenuIcon
              className={styles.menuOpen}
              sx={(theme) => ({ color: theme.palette.text.primary })}
              fontSize="large"
            />
          ) : (
            <MenuOpenIcon
              className={styles.menuOpen}
              sx={(theme) => ({ color: theme.palette.text.primary })}
              fontSize="large"
            />
          )}
        </div>
        <div className={styles.logoWrapper}>
          <img src={logo} width="100%" height="100%" />
        </div>
      </div>
      <div className={styles.profileOptionsWrapper} onClick={toggleProfileMenu}>
        {profileImagePath && !errorInProfileImage ? (
          <img
            src={import.meta.env.VITE_PROFILE_ENDPOINT_URL + profileImagePath}
            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
            onError={() => setErrorInProfileImage(true)}
          />
        ) : (
          <AccountCircleRoundedIcon
            className={styles.profileIcon}
            sx={(theme) => ({ color: theme.palette.text.primary })}
            fontSize="large"
          />
        )}
        <div className={styles.mobileHiddenAccountWrapper}>
          <div className={styles.nameAndArrowDownWrapper}>
            <Typography variant="body1" color="text.primary" fontWeight="bold">
              {userData?.name ?? ''}
            </Typography>
            <div className={styles.profileToggleWrapper}>
              {profileMenuIsOpen ? (
                <KeyboardArrowUpRoundedIcon color="primary" />
              ) : (
                <KeyboardArrowDownRoundedIcon color="primary" />
              )}
            </div>
          </div>
          {subscriptionPlan && (
            <Typography variant="caption" color="text.secondary">
              {`${remainingCredits ? remainingCredits + ' pitches - ' : ''} ${
                subscriptionPlan.type
              }`}
            </Typography>
          )}
        </div>
        {profileMenuIsOpen && <AccountMenu />}
      </div>
    </div>
  );
}
