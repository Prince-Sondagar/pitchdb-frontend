import { createSlice } from '@reduxjs/toolkit';
import { type PayloadAction } from '@reduxjs/toolkit';
import { cookiesStoreKey } from './cookies.const';
import Cookies from 'universal-cookie';

interface IState {
  cookies: null;
}

interface ISetSettings {
  path: string;
  expires?: Date;
}

interface ISetCookies {
  key: string;
  value: string;
}

const initialState: IState = {
  cookies: null,
};

const setSettings: ISetSettings = { path: '/' };

export const cookiesSlice = createSlice({
  name: cookiesStoreKey,
  initialState,
  reducers: {
    setUserJWT: (_, action: PayloadAction<string>) => {
      const cookies = new Cookies();
      const today = new Date();
      const expireDate = new Date();
      expireDate.setDate(today.getDate() + 5);
      setSettings.expires = expireDate;

      cookies.set('jwt', action.payload, setSettings);
    },
    setCookies: (_, action: PayloadAction<ISetCookies>) => {
      const cookies = new Cookies();

      cookies.set(action.payload.key, action.payload.value, setSettings);
    },
    removeCookies: (_, action: PayloadAction<string>) => {
      const cookies = new Cookies();

      cookies.remove(action.payload, setSettings);
    },
    setAdminJWT: (_, action: PayloadAction<string>) => {

      const cookies = new Cookies();
    
      cookies.set("admin-token", cookies.get("jwt"));
      const today = new Date();
      const expireDate = new Date();
      expireDate.setDate(today.getDate() + 5);
      setSettings.expires = expireDate;
      cookies.set('jwt', action.payload, setSettings);
      cookies.remove("currentPage");

    }
  },
});

export const { setUserJWT, setCookies, removeCookies, setAdminJWT } = cookiesSlice.actions;
