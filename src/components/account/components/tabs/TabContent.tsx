import Profile from '../profile';
import styles from '../../Account.module.css';
import Configuration from '../configuration';
import Teams from '../teams';
import UsersSuperAdmin from '../usersSuperAdmin';

interface IProps {
  index: number;
}

export function TabContent({ index }: IProps) {
  let content;

  switch (index) {
    case 0:
      content = <Profile />;
      break;
    case 1:
      content = <Configuration />;
      break;
    case 2:
      content = <Teams />;
      break;
    case 3:
      content = <UsersSuperAdmin />;
      break;
    default:
      content = <></>;
      break;
  }

  return (
    <div
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={styles.tabContainer}
    >
      <div>{content}</div>
    </div>
  );
}
