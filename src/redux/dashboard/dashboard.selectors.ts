import { type RootState } from '../store';

const isLoading = (state: RootState) => state.dashboard.isLoading;
const selectedDate = (state: RootState) => state.dashboard.selectedDate;
/* const categoryName = (state: RootState) => state.dashboard.categoryName; */

export const dashboardSelectors = {
  isLoading,
  selectedDate,
  /*   categoryName, */
};
