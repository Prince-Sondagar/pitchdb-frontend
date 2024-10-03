import { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsExportData from 'highcharts/modules/export-data';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { IAmountData, getbaseOptions } from '../../redux/reports/reports.slice';
import { Chart } from '../../common/charts/components/Chart';
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

function generatePieColors(): string[] {
  const baseColor: Highcharts.ColorType | undefined = Highcharts.getOptions()?.colors?.[0];
  const pieColors: string[] = [];

  if (baseColor) {
    for (let i = 0; i < 10; i++) {
      const color: Highcharts.Color = Highcharts.color(baseColor).brighten((i - 3) / 7);
      if (typeof color === 'string') {
        const colorString: string = color;
        pieColors.push(colorString);
      }
    }
  }

  return pieColors;
}

const pieColorsResult = generatePieColors();

interface IProps {
  subtitle: string;
  seriesData?: IAmountData[];
}

export const PieChart: React.FC<IProps> = ({ subtitle, seriesData }) => {
  const dispatch = useAppDispatch();
  const ready = useAppSelector(reportsSelectors.ready);

  useEffect(() => {
    dispatch(getbaseOptions(true));
  }, [dispatch]);

  const baseOptions: Highcharts.Options = {
    ...commonOptions.general,
    chart: {
      plotBackgroundColor: '#fff',
      plotBorderWidth: 0,
      plotShadow: false,
      type: 'pie',
    },
    subtitle: {
      text: subtitle,
    },
    tooltip: {
      pointFormat: 'Total: <b>{point.y}</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        colors: pieColorsResult,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
          distance: -50,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 4,
          },
        },
      },
    },
    series: [
      {
        type: 'pie',
        data: seriesData,
      },
    ],
  };

  return <Chart highcharts={Highcharts} options={baseOptions} ready={ready} />;
};
