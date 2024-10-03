import styles from '../Templates.module.css';

interface TabPanelProps {
  children?: React.ReactElement;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;

  return <>{value === index && <div className={`${styles.customTabPanel}`}>{children}</div>}</>;
};

export default CustomTabPanel;
