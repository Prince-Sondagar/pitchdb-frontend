import { type RootState } from '../store';

const isLoading = (state: RootState) => state.reports.isLoading;
const activityData = (state: RootState) => state.reports.activityData;
const updatedSummaryData = (state: RootState) => state.reports.updatedSummaryData;
const summaryData = (state: RootState) => state.reports.summaryData;
const maxAmountValue = (state: RootState) => state.reports.maxAmountValue;
const updatedAmountData = (state: RootState) => state.reports.updatedAmountData;
const ready = (state: RootState) => state.reports.ready;
const getSummarySubtitle = (state: RootState) => state.reports.summaryTimePeriod;
const getAmountTimePeriod = (state: RootState) => state.reports.amountTimePeriod;
const amountData = (state: RootState) => state.reports.amountData;
const isLoadingActivities = (state: RootState) => state.reports.isLoadingLastestActivityData;
const isLoadingSumamry = (state: RootState) => state.reports.isLoadingSummaryData;
const isLoadingAmounts = (state: RootState) => state.reports.isLoadingAmountData;

export const reportsSelectors = {
  isLoading,
  activityData,
  updatedSummaryData,
  summaryData,
  maxAmountValue,
  updatedAmountData,
  ready,
  getSummarySubtitle,
  getAmountTimePeriod,
  amountData,
  isLoadingActivities,
  isLoadingSumamry,
  isLoadingAmounts,
};
