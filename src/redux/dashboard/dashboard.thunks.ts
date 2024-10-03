import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { errorSideAlert } from '../alerts';
import { dashboardStoreKey } from './index';
/* import { commonDataParsing } from '../../utils/dataParsing';
import { setEstimatedVal } from '../../redux/dashboard/dashboard.slice';
import { useAppDispatch } from '../../redux/hooks'; */
const basePath = import.meta.env.VITE_API_BASE_URL;

const STAGES_ENDPOINT = '/stages/';

export const actionsendsecond = createAsyncThunk(
  `${dashboardStoreKey}stages/actionsendsecond`,
  async (stage, thunkApi) => {
    try {
      const response = await axios.post(basePath + STAGES_ENDPOINT + 'action/sendsecond', stage);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorSideAlert('An error has occured sending. Please, try again later.'));
    }
  },
);

export const getLatestByCategory = createAsyncThunk(
  `${dashboardStoreKey}/getLatestByCategory`,
  async (category: string, thunkApi) => {
    try {
      const response = await axios.get(`${basePath}${STAGES_ENDPOINT}latestByCategory/${category}`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorSideAlert('Error getting the latest data. Please, try again later.'));
    }
  },
);

/* const RevenueData = async () => {
  const dispatch = useAppDispatch();
  try {
    const currentYear: number = new Date().getFullYear();
    const monthlyData: number[] = Array(12).fill(0);

    const response = await dispatch(getLatestByCategory('booked'));

    response.payload.forEach((item: any) => {
      const get_date = commonDataParsing.parseDate(item.date);
      const get_month = new Date(get_date).getMonth() + 1;
      const get_year = new Date(get_date).getFullYear();

      if (get_year === currentYear && get_month >= 1 && get_month <= 12) {
        monthlyData[get_month - 1] += item.sequence.estimatedrevenue;
      }
      dispatch(setEstimatedVal(JSON.stringify(monthlyData)));
    });
  } catch (error) {
    console.error(error);
  }
}; */

export const actionSend = createAsyncThunk(
  `${dashboardStoreKey}stages/actionSend`,
  async (stage, thunkApi) => {
    try {
      const response = await axios.post(basePath + STAGES_ENDPOINT + 'action/send', stage);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorSideAlert('An error has occured sending . Please, try again later.'));
    }
  },
);
