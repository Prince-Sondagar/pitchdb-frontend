import { ISeriesObject } from '..';
import { outreachSequenceStates } from '../../../constants';

interface IBaseResultsObject {
  series: ISeriesObject;
  maxAmount: number;
}

export const formatAmountsData = (rawData: any[], fromDate: Date, toDate: Date) => {
  const baseResultsObject: IBaseResultsObject = {
    series: {
      waiting: [],
      sent: [],
      opened: [],
      replied: [],
      booked: [],
      postponed: [],
      conversed: [],
    },
    maxAmount: 0,
  };

  for (let date = fromDate; date <= toDate; date.setDate(date.getDate() + 1)) {
    const dateString = `${date.getDate()}/${date.getMonth() + 1}`;

    for (const state in baseResultsObject.series) {
      let found = false;

      if (rawData.length) {
        rawData.map((raw) => {
          if (`${raw._id.date}/${raw._id.month}` === dateString && state === raw._id.category) {
            found = true;

            baseResultsObject.series[state as outreachSequenceStates].push({
              name: dateString,
              y: raw.value,
            });
            if (raw.value > baseResultsObject.maxAmount) {
              baseResultsObject.maxAmount = raw.value;
            }
          }
        });

        if (!found) {
          baseResultsObject.series[state as outreachSequenceStates].push({
            name: dateString,
            y: 0,
          });
        }
      }
    }
  }

  return baseResultsObject;
};
