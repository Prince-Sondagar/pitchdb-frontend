import { Typography } from '@mui/material';
import { LineChart } from '../../../common/charts/LineChart';
import { LoadingDisplay } from '../../../common';
import { ISeriesObject, reportsSelectors } from '../../../redux/reports';
import { loadingDisplayTypes } from '../../../types';
import { outreachSequenceStates } from '../../../constants';
import { useAppSelector } from '../../../redux/hooks';
import styles from '../Reports.module.css';

interface IProps {
  amountData: ISeriesObject | null;
  maxAmountValue: number;
}

export const DailyReports: React.FC<IProps> = ({ amountData, maxAmountValue }) => {
  const isLoading = useAppSelector(reportsSelectors.isLoadingAmounts);
  const sequencesStates = Object.keys(outreachSequenceStates);

  return (
    <>
      {sequencesStates.map((state, index) => {
        if (state !== outreachSequenceStates.conversed) {
          return (
            <div key={index} className={styles.reportsModuleWrapper}>
              <div className={styles.reportsModuleHeader}>
                <Typography variant="h6" color="text.secondary" fontWeight="bold">
                  Pitches {state}
                </Typography>
              </div>
              <div className={styles.reportsModuleBody}>
                {isLoading ? (
                  <LoadingDisplay type={loadingDisplayTypes.entireComponent} />
                ) : (
                  <>
                    {amountData && !!amountData[state as outreachSequenceStates].length ? (
                      <LineChart
                        toolTipText={state}
                        seriesData={amountData[state as outreachSequenceStates]}
                        maxYAxis={maxAmountValue}
                        yAxisTitle=""
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No sequences to show
                      </Typography>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        }
      })}
    </>
  );
};
