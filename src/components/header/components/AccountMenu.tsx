import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import Cookies from 'universal-cookie';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import PaidIcon from '@mui/icons-material/Paid';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { removeCookies, setUserJWT } from '../../../redux/cookies';
import { userSelectors } from '../../../redux/user';
import styles from './AccountMenu.module.css';

export function AccountMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const isAdminMode = useAppSelector(userSelectors.isAdmin);

  const signOut = () => {
    dispatch(removeCookies('jwt'));
    navigate('/');
  };

  const backToAdmin = () => {
    dispatch(setUserJWT(cookies.get('admin-token')));
    dispatch(removeCookies('admin-token'));
    dispatch(removeCookies('lastPage'));
    dispatch(removeCookies('currentPage'));
    navigate('/');
  };

  return (
    <div className={styles.headerDropMenu}>
      <div style={{ position: 'relative' }}>
        <div className={styles.verticalDivider} />
        <div className={styles.headerMenuItem} onClick={() => navigate('account')}>
          <div className={styles.profileIconWrapper}>
            <SettingsIcon
              sx={(theme) => ({ color: theme.palette.text.primary })}
              fontSize="small"
            />
          </div>
          <Typography variant="body1" color="text.primary">
            Configuration
          </Typography>
        </div>
        <div className={styles.verticalDivider} />
        <div className={styles.headerMenuItem} onClick={() => navigate('reports')}>
          <div className={styles.profileIconWrapper}>
            <BarChartIcon
              sx={(theme) => ({ color: theme.palette.text.primary })}
              fontSize="small"
            />
          </div>
          <Typography variant="body1" color="text.primary">
            Reports
          </Typography>
        </div>
        <div className={styles.verticalDivider} />
        <div className={styles.headerMenuItem} onClick={() => navigate('payment/credits')}>
          <div className={styles.profileIconWrapper}>
            <PaidIcon sx={(theme) => ({ color: theme.palette.text.primary })} fontSize="small" />
          </div>
          <Typography variant="body1" color="text.primary">
            Payment option
          </Typography>
        </div>
        <div className={styles.verticalDivider} />
        <div className={styles.headerMenuItem} onClick={signOut}>
          <div className={styles.profileIconWrapper}>
            <LogoutIcon sx={(theme) => ({ color: theme.palette.text.primary })} fontSize="small" />
          </div>
          <Typography variant="body1" color="text.primary">
            Sign out
          </Typography>
        </div>
        {isAdminMode && (
          <>
            <div className={styles.verticalDivider} />
            <div className={styles.headerMenuItem} onClick={backToAdmin}>
              <div className={styles.profileIconWrapper}>
                <LogoutIcon color="primary" fontSize="small" />
              </div>
              <Typography variant="body1" color="text.primary">
                Back to admin
              </Typography>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
