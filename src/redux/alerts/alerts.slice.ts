import { createSlice } from '@reduxjs/toolkit';
import swal from 'sweetalert';
import { toast, Theme, Zoom } from 'react-toastify';
import { alertsStoreKey } from './alerts.const';
import spinnerGif from '../../assets/gifts/spinner.gif';

interface IState {
  alerts: null;
}

const initialState: IState = {
  alerts: null,
};

const toastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  transition: Zoom,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  theme: 'light' as Theme,
};

export const alertsSlice = createSlice({
  name: alertsStoreKey,
  initialState,
  reducers: {
    openLoadingModal: (_, action) => {
      if (swal.getState && !swal.getState().isOpen) {
        swal({
          title: '',
          text: (action.payload || 'Loading') + ', please wait...',
          icon: spinnerGif,
          closeOnClickOutside: false,
        });
      }
    },
    closeLoadingModal: () => {
      if (swal.getState && swal.close && swal.getState().isOpen) {
        swal.close();
      }
    },
    errorAlert: (_, action) => {
      swal('Error', action.payload, 'error');
    },
    warningAlert: (_, action) => {
      swal(action.payload.title, action.payload.message, 'warning');
    },
    successAlert: (_, action) => {
      swal('Success', action.payload, 'success');
    },
    successSideAlert: (_, action) => {
      if (swal.getState && swal.close && swal.getState().isOpen) {
        swal.close();
      }
      toast.success(action.payload, toastOptions);
    },
    errorSideAlert: (_, action) => {
      if (swal.getState && swal.close && swal.getState().isOpen) {
        swal.close();
      }
      toast.error(action.payload, toastOptions);
    },
  },
});

export const {
  openLoadingModal,
  closeLoadingModal,
  errorAlert,
  warningAlert,
  successAlert,
  successSideAlert,
  errorSideAlert,
} = alertsSlice.actions;
