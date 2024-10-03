import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { IAmountData, getlineReady } from '../../redux/reports/reports.slice';
import { Chart } from './components/Chart';
import { reportsSelectors } from '../../redux/reports';

HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);

const commonOptions = {
  defaultLineMaxYAxis: 6,
  general: {
    credits: {
      enabled: false,
    },
  },
  lineSeries: {
    type: 'spline',
    showInLegend: false,
  },
};

interface IProps {
  seriesData?: IAmountData[] | null;
  maxYAxis?: number;
  yAxisTitle: string;
  toolTipText: string;
}

export const LineChart: React.FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const ready = useAppSelector(reportsSelectors.ready);

  let defaultMaxYAxis = commonOptions.defaultLineMaxYAxis;
  const { maxYAxis, yAxisTitle, toolTipText, seriesData } = props;

  useEffect(() => {
    dispatch(getlineReady(true));
  }, [dispatch]);

  if (maxYAxis && maxYAxis > defaultMaxYAxis) {
    defaultMaxYAxis = maxYAxis;
  }

  const baseOptions: Highcharts.Options = {
    ...commonOptions.general,
    yAxis: {
      title: {
        text: yAxisTitle,
      },
      max: defaultMaxYAxis,
    },
    tooltip: {
      pointFormat: `<b>{point.y}</b> ${toolTipText}`,
    },
    xAxis: {
      tickInterval: 1,
      labels: {
        enabled: true,
        formatter: function () {
          if (seriesData && seriesData[0]) {
            return seriesData[0].name || '';
          } else {
            return '';
          }
        },
      },
    },
    series: [
      {
        ...commonOptions.lineSeries,
        type: 'spline',
        data: seriesData || undefined,
      },
    ],
  };

  return <Chart highcharts={Highcharts} options={baseOptions} ready={ready} />;
};
