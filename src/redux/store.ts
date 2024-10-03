import { configureStore } from '@reduxjs/toolkit';
import { cookiesSlice, cookiesStoreKey } from './cookies';
import { alertsSlice, alertsStoreKey } from './alerts';
import { authenticationSlice, authenticationStoreKey } from './authentication';
import { templateSlice, templateStoreKey } from './template';
import { emailSlice, emailStoreKey } from './email';
import { userSlice, userStoreKey } from './user';
import { contactListStoreKey, contactListSlice } from './contactList';
import { subscriptionSlice, subscriptionStoreKey } from './subscription';
import { teamsSlice, teamsStoreKey } from './teams';
import { reportsSlice, reportsStoreKey } from './reports';
import { searchParametersSlice, searchParametersStoreKey } from './searchParameters';
import { podcastsSearchSlice, podcastsSearchStoreKey } from './searches/podcastsSearch';
import { eventsSearchSlice, eventsSearchStoreKey } from './searches/eventsSearch';
import { mediaOutletsSearchSlice, mediaOutletsSearchStoreKey } from './searches/mediaOutletsSearch';
import { conferencesSearchSlice, conferencesSearchStoreKey } from './searches/conferencesSearch';
import { userSavedSearchesSlice, userSavedSearchesStoreKey } from './searches/userSavedSearches';
import { speakersSearchSlice, speakersSearchStoreKey } from './searches/speakersSearch';
import { dashboardStoreKey, dashboardSlice } from './dashboard';
import { outreachSequenceSlice, outreachSequenceStoreKey } from './outreachSequence';
import { profileSlice, profileStoreKey } from './profile';
import { adminSlice, adminStoreKey } from './admin';

export const store = configureStore({
  reducer: {
    [cookiesStoreKey]: cookiesSlice.reducer,
    [alertsStoreKey]: alertsSlice.reducer,
    [authenticationStoreKey]: authenticationSlice.reducer,
    [templateStoreKey]: templateSlice.reducer,
    [emailStoreKey]: emailSlice.reducer,
    [userStoreKey]: userSlice.reducer,
    [contactListStoreKey]: contactListSlice.reducer,
    [subscriptionStoreKey]: subscriptionSlice.reducer,
    [searchParametersStoreKey]: searchParametersSlice.reducer,
    [teamsStoreKey]: teamsSlice.reducer,
    [reportsStoreKey]: reportsSlice.reducer,
    [podcastsSearchStoreKey]: podcastsSearchSlice.reducer,
    [eventsSearchStoreKey]: eventsSearchSlice.reducer,
    [mediaOutletsSearchStoreKey]: mediaOutletsSearchSlice.reducer,
    [conferencesSearchStoreKey]: conferencesSearchSlice.reducer,
    [speakersSearchStoreKey]: speakersSearchSlice.reducer,
    [userSavedSearchesStoreKey]: userSavedSearchesSlice.reducer,
    [dashboardStoreKey]: dashboardSlice.reducer,
    [outreachSequenceStoreKey]: outreachSequenceSlice.reducer,
    [profileStoreKey]: profileSlice.reducer,
    [adminStoreKey]: adminSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
