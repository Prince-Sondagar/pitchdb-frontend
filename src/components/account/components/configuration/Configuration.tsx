import { Tabs, Tab, Typography } from '@mui/material';
import styles from '../../Account.module.css';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getEmailConfig, userSelectors } from '../../../../redux/user';
import { useEffect, useState } from 'react';
import { TabPanel } from '../profile/components';
import { CalendarMonth, Email } from '@mui/icons-material';
import CreateIcon from '@mui/icons-material/Create';
import LockIcon from '@mui/icons-material/Lock';
import { PasswordTab, EmailTab, SendingCalendarTab, SignatureTab } from './components';
import { authMessages } from '../../../../constants';

export function Configuration() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(userSelectors.userData);

  const [value, setValue] = useState(0);
  const [currentMethod, setCurrentMethod] = useState('');

  const handleChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (userData?._id) dispatch(getEmailConfig(userData?._id));

    if (userData?.network) {
      setCurrentMethod(userData.network + ' (' + userData.email + ')');
    } else {
      setCurrentMethod(authMessages.PITCHDB_CREDENTIALS);
    }
  }, []);

  return (
    <div className={`${styles.content}`}>
      <div style={{ margin: '2rem 0' }}>
        <Typography variant="h3">Configuration</Typography>
      </div>
      <div className={styles.profileOptionsWrapper}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          className={styles.tabMenuProfileAndConfiguration}
          variant="fullWidth"
        >
          <Tab
            className={styles.tabMenuWrapperIcons}
            icon={<LockIcon />}
            label="Password & Sign In"
          />
          <Tab className={styles.tabMenuWrapperIcons} icon={<Email />} label="Email" />
          <Tab
            className={styles.tabMenuWrapperIcons}
            icon={<CalendarMonth />}
            label="Sending Calendar"
          />
          <Tab
            className={styles.tabMenuWrapperIcons}
            icon={<CreateIcon />}
            label="Email Signature"
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <PasswordTab
            isSignIn={userData?.signupEmail ? true : false}
            currentMethod={currentMethod}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EmailTab isSignIn={userData?.signupEmail ? true : false} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <SendingCalendarTab userId={userData?._id || ''} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <SignatureTab userId={userData?._id || ''} />
        </TabPanel>
      </div>
    </div>
  );
}
