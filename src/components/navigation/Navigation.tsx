import { useLocation } from 'react-router-dom';
import { navigationOptions } from '../../constants';
import { useAppSelector } from '../../redux/hooks';
import { userSelectors } from '../../redux/user';
import { userHasAllAccess } from '../../utils';
import { NavigationItem } from './components';
import styles from './Navigation.module.css';

interface IProps {
  navigationIsMinimized: boolean;
  toggleNavigationDisplay: () => void;
}

export function Navigation({ navigationIsMinimized, toggleNavigationDisplay }: IProps) {
  const location = useLocation();
  const userData = useAppSelector(userSelectors.userData);

  const checkIfIsActive = (option: string) => {
    if (location.pathname.includes(`/main/${option}`)) {
      return true;
    }
    return false;
  };

  return (
    <div className={`${styles.navigationPanel} ${navigationIsMinimized ? styles.minimized : ''}`}>
      <div style={{ position: 'relative' }}>
        {navigationOptions.map((navigationObject, index) => {
          const { icon, option, title } = navigationObject;
          return (
            <NavigationItem
              key={index}
              navigationIsMinimized={navigationIsMinimized}
              isActive={checkIfIsActive(option)}
              text={title}
              Icon={icon}
              link={option}
              userPrivileges={userData?.privileges}
              limitedAccess={!userHasAllAccess(userData?.privileges)}
              toggleNavigationDisplay={toggleNavigationDisplay}
            />
          );
        })}
      </div>
    </div>
  );
}
