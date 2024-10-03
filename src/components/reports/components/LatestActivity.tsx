import { Typography } from '@mui/material';
import { LoadingDisplay } from '../../../common';
import { loadingDisplayTypes } from '../../../types';
import { formatDate } from '../../../utils';
import { useAppSelector } from '../../../redux/hooks';
import { reportsSelectors } from '../../../redux/reports';
import styles from '../Reports.module.css';

interface ActivityData {
  date: string;
  message: string;
}

interface IProps {
  activityData: ActivityData[] | null;
}

export const LatestActivity: React.FC<IProps> = ({ activityData }) => {
  const isLoading = useAppSelector(reportsSelectors.isLoadingActivities);

  return (
    <div className={styles.reportsModuleWrapper}>
      <div className={styles.reportsModuleHeader}>
        <Typography variant="h6" color="text.secondary" fontWeight="bold" m="0rem 0.2rem">
          Latest activity
        </Typography>
      </div>
      <div className={styles.reportsModuleBody}>
        {isLoading ? (
          <LoadingDisplay type={loadingDisplayTypes.entireComponent} />
        ) : (
          <>
            {activityData?.length ? (
              activityData.map((activity, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className="col-auto">
                    <Typography variant="h3" color="text.secondary">
                      {formatDate(activity.date)}
                    </Typography>
                  </div>
                  <div className="col-lg-auto col-12">
                    <Typography variant="body1">{activity.message}</Typography>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No activity to show
              </Typography>
            )}
          </>
        )}
      </div>
    </div>
  );
};
