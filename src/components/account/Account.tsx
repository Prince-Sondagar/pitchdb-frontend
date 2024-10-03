import { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupsIcon from '@mui/icons-material/Groups';
import { TabContent } from './components/tabs';
import styles from './Account.module.css';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useAppSelector } from '../../redux/hooks';
import { userSelectors } from '../../redux/user';

export function Account() {
  const userData = useAppSelector(userSelectors.userData);

  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} `}>
        <Tabs
          value={value}
          onChange={handleChange}
          orientation="vertical"
          className={styles.tabMenuWrapper}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            icon={<AccountCircleOutlinedIcon />}
            label="Profile"
            className={styles.tabItemWrapper}
          />
          <Tab icon={<SettingsIcon />} label="Configuration" className={styles.tabItemWrapper} />
          <Tab icon={<GroupsIcon />} label="Teams" className={styles.tabItemWrapper} />
          {userData && userData.privileges.some((privilege) => privilege === 'superAdmin') && (
            <Tab
              icon={<ManageAccountsIcon />}
              label="Super Admin - Users"
              className={styles.tabItemWrapper}
            />
          )}
        </Tabs>
      </div>
      <div className={styles.content}>
        <TabContent index={value} />
      </div>
    </div>
  );
}
