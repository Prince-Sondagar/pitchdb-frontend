import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import querystring from 'querystring';
import moment from 'moment';
import { reportsStoreKey } from './reports.const';
import { errorSideAlert } from '../alerts';
import { RootState } from '../store';
import { formatAmountsData } from './utils/formatAmountsData';
import { formatToDate } from '../../utils';
import { formatSummaryData } from './utils';
import { commonDataParsing } from '../../utils/dataParsing';

const CHARTS_ENDPOINT = '/charts/';
const ACTIVITY_ENDPOINT = '/activity/';
const basePath = import.meta.env.VITE_API_BASE_URL;

interface IFetchStageSummaryParams {
  updated: boolean;
}

interface Chart {
  CHART_SUMMARY: string;
  CHART_AMOUNT: string;
  CHART_DATE_FORMAT: string;
}
export const typeChart: Chart = {
  CHART_SUMMARY: 'summary',
  CHART_AMOUNT: 'amount',
  CHART_DATE_FORMAT: 'YYYY-MM-DD',
};

export const getOutreachActivity = createAsyncThunk(
  `${reportsStoreKey}activity/outreachActivity`,
  async (selectedDate: string, thunkApi) => {
    try {
      let dates = '';
      if (selectedDate === '7') {
        dates = commonDataParsing.parseDate(new Date().setDate(new Date().getDate() - 7));
      } else if (selectedDate === '30') {
        dates = commonDataParsing.parseDate(new Date().setDate(new Date().getDate() - 30));
      } else if (selectedDate === '90') {
        dates = commonDataParsing.parseDate(new Date().setDate(new Date().getDate() - 90));
      }
      const response = await axios.get(basePath + ACTIVITY_ENDPOINT);

      const dates_new = new Date(dates).getTime();

      const data = response.data.filter((item: any) => {
        const get_date = commonDataParsing.parseDate(item.date);
        const final_date = new Date(get_date).getTime();
        const current_date = new Date().getTime();
        if (!isNaN(dates_new) && !isNaN(final_date) && !isNaN(current_date)) {
          return final_date > dates_new && final_date < current_date;
        } else {
          return false;
        }
      });
      /* console.log(data); */
      return data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error getting outreach activity, Please, try again later.'),
      );
    }
  },
);

export const fetchStageSummary = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageSummary`,
  async (params: IFetchStageSummaryParams, thunkApi) => {
    try {
      const state = thunkApi.getState() as RootState;

      const queryParams = {
        dateStart: moment(formatToDate(state.reports.dateStart)).format(
          typeChart.CHART_DATE_FORMAT,
        ),
        dateTo: moment(formatToDate(state.reports.dateTo)).format(typeChart.CHART_DATE_FORMAT),
      };

      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/summary?' + querystring.stringify(queryParams),
      );

      const formattedData = formatSummaryData(response.data);

      const updateObject = {
        updatedSummaryData: params.updated ? formattedData : state.reports.updatedSummaryData,
        summaryData: params.updated ? state.reports.summaryData : formattedData,
      };

      return updateObject;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error fetching the stages summary. Please, try again later.'),
      );
    }
  },
);

export const fetchStageAmounts = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmounts`,
  async (params: IFetchStageSummaryParams, thunkApi) => {
    try {
      const state = thunkApi.getState() as RootState;

      const queryParams = {
        dateStart: moment(formatToDate(state.reports.dateStart)).format(
          typeChart.CHART_DATE_FORMAT,
        ),
        dateTo: moment(formatToDate(state.reports.dateTo)).format(typeChart.CHART_DATE_FORMAT),
        period: 'daily',
      };

      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amounts?' + querystring.stringify(queryParams),
      );

      const seriesData = formatAmountsData(
        response.data,
        formatToDate(state.reports.dateStart),
        formatToDate(state.reports.dateTo),
      );

      const updateObject = {
        maxAmountValue: seriesData.maxAmount + 1,
        amountData: params.updated ? state.reports.amountData : seriesData.series,
        updatedAmountData: params.updated ? seriesData.series : state.reports.updatedAmountData,
      };

      return updateObject;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error fetching the stages amount. Please, Try again later.'),
      );
    }
  },
);

export const fetchStageAmountsPodcast = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmountsPodcast`,
  async (queryParams, thunkApi) => {
    try {
      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amountspodcast?' + queryParams,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error fetching the stages amount for podcasts. Please, try again later.'),
      );
    }
  },
);

export const fetchStageAmountsSpeaker = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmountsSpeaker`,
  async (queryParams, thunkApi) => {
    try {
      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amountsspeaker?' + queryParams,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error fetching the stages amount for speakers. Please, try again later.'),
      );
    }
  },
);

export const fetchStageAmountsMedia = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmountsMedia`,
  async (queryParams, thunkApi) => {
    try {
      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amountsmedia?' + queryParams,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error fetching the stages amount for media outlets. Please, try again later.',
        ),
      );
    }
  },
);

export const fetchStageAmountsConference = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmountsConference`,
  async (queryParams, thunkApi) => {
    try {
      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amountsconference?' + queryParams,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error fetching the stages amount for conferences. Please, try again later.',
        ),
      );
    }
  },
);

export const fetchStageAmountsAssociation = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmountsAsscoaition`,
  async (queryParams, thunkApi) => {
    try {
      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amountsassociation?' + queryParams,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error fetching the stages amount for local associations. Please, try again later.',
        ),
      );
    }
  },
);

export const fetchStageAmountsbookedPodcast = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmountsbookedPodcast`,
  async (queryParams, thunkApi) => {
    try {
      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amountsbookedpodcast?' + queryParams,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error fetching the booked stages for podcasts. Please, try again later.'),
      );
    }
  },
);

export const fetchStageAmountsbookedSpeaker = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmountsbookedSpeaker`,
  async (queryParams, thunkApi) => {
    try {
      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amountsbookedpodcast?' + queryParams,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error fetching the booked stages for speakers. Please, try again later.'),
      );
    }
  },
);

export const fetchStageAmountsbookedMedia = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmountsbookedMedia`,
  async (queryParams, thunkApi) => {
    try {
      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amountsbookedmedia?' + queryParams,
      );
      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error fetching the booked stages for media outlets. Please, try again later.',
        ),
      );
    }
  },
);

export const fetchStageAmountsbookedAssociation = createAsyncThunk(
  `${reportsStoreKey}charts/fetchStageAmountsbookedAsscoaition`,
  async (queryParams, thunkApi) => {
    try {
      const response = await axios.get(
        basePath + CHARTS_ENDPOINT + 'stages/amountsbookedassociation?' + queryParams,
      );
      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert(
          'Error fetching the booked stages for local associations. Please, try again later.',
        ),
      );
    }
  },
);
