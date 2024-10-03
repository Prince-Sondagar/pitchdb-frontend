import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { userSelectors } from '../../redux/user';
import { LoadingDisplay } from '../../common';
import { loadingDisplayTypes } from '../../types';
import { useFetchUser } from '../../hooks';
import Templates from '../templates';
import Header from '../header';
import Navigation from '../navigation';
import BuyCredits from '../buyCredits';
import Contacts from '../contacts';
import Reports from '../reports';
import Dashboard from '../dashboard';
import ContactSearches from '../contactSearches';
import Account from '../account';
import styles from './Main.module.css';

export function Main() {
  const userIsLoading = useAppSelector(userSelectors.isLoading);
  const userData = useAppSelector(userSelectors.userData);

  useFetchUser();

  const [navigationIsMinimized, setNavigationIsMinimized] = useState(true);

  const toggleNavigationIsMinimized = () => {
    setNavigationIsMinimized((prev) => !prev);
  };

  if (userIsLoading || !userData) {
    return <LoadingDisplay type={loadingDisplayTypes.entireScreen} />;
  }

  return (
    <div style={{ width: '100svw', height: '88svh' }}>
      <Header
        navigationIsMinimized={navigationIsMinimized}
        toggleNavigationIsMinimized={toggleNavigationIsMinimized}
      />
      <Navigation
        navigationIsMinimized={navigationIsMinimized}
        toggleNavigationDisplay={toggleNavigationIsMinimized}
      />
      <div
        className={`${styles.mainContentWrapper} ${navigationIsMinimized ? styles.minimized : ''}`}
      >
        <Routes>
          <Route path={'dashboard'} element={<Dashboard />} />
          <Route path={'searches/*'} element={<ContactSearches />} />
          <Route path={'contacts'} element={<Contacts />} />
          <Route path={'account'} element={<Account />} />
          <Route path={'reports'} element={<Reports />} />
          <Route path={'payment/credits'} element={<BuyCredits />} />
          <Route path={'templates'} element={<Templates />} />
          <Route
            path={'academy'}
            element={<div id="candu-academy-content" className="candu-academy-content" />}
          />
        </Routes>
      </div>
    </div>
  );
}
