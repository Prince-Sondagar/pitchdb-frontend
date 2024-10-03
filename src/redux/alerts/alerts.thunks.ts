import { createAsyncThunk } from '@reduxjs/toolkit';
import swal from 'sweetalert';
import { alertsStoreKey } from '.';
import { ContentOptions } from 'sweetalert/typings/modules/options/content';
import { ButtonList } from 'sweetalert/typings/modules/options/buttons';

interface IOpenConfirmation {
  message: string;
  title?: string;
  confirmMessage?: string;
  isInEditor?: boolean;
  isInMailbox?: boolean;
}

interface ISwalOptions {
  title: string;
  text: string;
  icon?: string;
  dangerMode?: boolean;
  content: ContentOptions;
  buttons?: ButtonList | (string | boolean)[];
  closeOnClickOutside?: boolean;
  className?: string;
}

interface IOpenDualConfirmation {
  message: string;
  title?: string;
  button1: string;
  button2: string;
}

interface IOpenRemovalConfirmation {
  item: string;
  message: string;
}

export const openConfirmation = createAsyncThunk(
  `${alertsStoreKey}/openConfirmation`,
  async (params: IOpenConfirmation) => {
    const { title, message, confirmMessage, isInEditor, isInMailbox } = params;

    const options: ISwalOptions = {
      title: title || 'Confirm',
      text: message,
      content: { element: 'div' },
      buttons: ['Cancel', confirmMessage || 'Confirm'],
    };

    if (!isInEditor) {
      options.icon = 'warning';
      options.dangerMode = true;
    }
    if (isInMailbox) {
      options.className = 'mailbox_editor';
    }

    return swal(options);
  },
);

export const openDualActionConfirmation = createAsyncThunk(
  `${alertsStoreKey}/openDualActionConfirmation`,
  async (params: IOpenDualConfirmation) => {
    const { title, message, button1, button2 } = params;

    return swal({
      title: title || 'Confirm',
      text: message,
      icon: 'warning',
      dangerMode: true,
      buttons: {
        cancel: true,
        button1: {
          text: button1,
          value: button1,
        },
        button2: {
          text: button2,
          value: button2,
        },
      },
    });
  },
);

export const openDeleteConfirmation = createAsyncThunk(
  `${alertsStoreKey}/openDeleteConfirmation`,
  async (params: IOpenRemovalConfirmation) => {
    const { item, message } = params;

    return swal({
      title: 'Remove ' + item + '?',
      text: message ? message : 'Once removed, you will not be able to recover this ' + item,
      icon: 'warning',
      dangerMode: true,
      buttons: ['Cancel', 'Remove'],
    });
  },
);
