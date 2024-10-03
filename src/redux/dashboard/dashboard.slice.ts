import { dashboardStoreKey } from './index';
import { getLatestByCategory } from './dashboard.thunks';
import { createSlice } from '@reduxjs/toolkit';

const dateFrom = new Date();
dateFrom.setDate(dateFrom.getDate() - 7);

interface dashboardState {
  isLoading: boolean;
  dateTo: string;
  dateStart: string;
  new_booking: number;
  estimatedval: number[];
  pitches_used: number;
  revenue: number;
  waitingdata: [];
  selectedDate: string;
  categoryName: string;
  booked: number;
  topsent: number;
  topbooking: number;
  sent: number;
  opened: number;
  replied: number;
  waiting: number;
}

const initialState: dashboardState = {
  isLoading: false,
  dateTo: new Date().toISOString(),
  dateStart: dateFrom.toISOString(),
  new_booking: 0,
  pitches_used: 0,
  estimatedval: [],
  revenue: 0,
  waitingdata: [],
  selectedDate: '7',
  categoryName: '',
  booked: 0,
  topsent: 0,
  topbooking: 0,
  sent: 0,
  opened: 0,
  replied: 0,
  waiting: 0,
};

export const dashboardSlice = createSlice({
  name: dashboardStoreKey,
  initialState,
  reducers: {
    setEstimatedVal: (state, action) => {
      state.estimatedval = action.payload;
    },
    setNewBooking: (state, action) => {
      state.new_booking = action.payload.data.length;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setCategoryName: (state, action) => {
      state.categoryName = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getLatestByCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getLatestByCategory.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getLatestByCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.booked = action.payload;
      state.topsent = action.payload;
      state.topbooking = action.payload;
      state.sent = action.payload;
      state.opened = action.payload;
      state.replied = action.payload;
      state.waiting = action.payload;
    });
  },
});

export const { setEstimatedVal, setNewBooking, setSelectedDate, setCategoryName } =
  dashboardSlice.actions;
