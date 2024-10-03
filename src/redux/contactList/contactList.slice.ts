import { createSlice } from '@reduxjs/toolkit';
import { contactListStoreKey } from './contactList.const';
import { IUserContactList } from '../../types';
import {
  createUserContactList,
  getUserContactList,
  getUserContactLists,
  getUserContactListCountSummary,
  addUserContactListItems,
  getContactListItems,
  getContactListItemsCount,
  deleteUserContactListItems,
  getUserContactListItemSequence,
  activateUserContactListItemSequence,
  connectContacts,
  connectContactsNew,
  getListContactItems,
} from './contactList.thunks';
import { contactCategories } from '../../constants';

export interface IContactListItemDetailBaseInfo {
  id: string;
  name: string;
  image: string | null;
  category: contactCategories;
  pitched: boolean;
  listId: string;
  email?: string; // podcasts
  position?: string; // medias && events
  eventType?: string; // events
}

interface IContactListItemDetailDetails {
  id?: string;
  connected?: boolean;
  email?: boolean;
  businessName?: string; // speakers
  website?: string; // speakers && events
  socialMediaLink1?: string; // speakers
  socialMediaLink2?: string; // speakers
  socialMediaLink3?: string; // speakers
  equipment?: string; // speakers
  additionalInfo?: string; // speakers
  optionalContactMethod?: string; // speakers
  categories?: {
    label: string;
    value?: string;
  }[]; // speakers && podcasts
  subCategories?: string; // speakers
  shortBio?: string; // speakers
  topics?: string; // speakers
  detailedProfile?: string; // speakers
  qualification?: string; // speakers
  audience?: string; // speakers
  promotionPlan?: string; // speakers
  sampleQuestion?: string; // speakers
  ownPodcast?: string; // speaker
  pastAppereance1?: string; // speakers
  pastAppereance2?: string; // speakers
  pastAppereance3?: string; // speakers
  publisherName?: string; // podcasts
  listenNotesId?: string; // podcasts
  rating?: {
    value: number;
    reviewsAmount: number;
  }; // podcasts
  description?: string; // podcasts && conferences && events
  publishDate?: string; // podcastEpisodes
  magazineGenre?: string; // medias
  contactName?: {
    firstName: string;
    lastName?: string;
  }; // medias && conferences && events
  phoneNumber?: string; // medias && events
  location?: {
    city?: string;
    state?: string;
    country?: string;
  }; // medias && conferences && events
  conferenceCategory?: string; // conferences
  estimatedAudience?: number; // conferences
  date?: string; // conferences
  eventAddress?: {
    value: string;
    zipCode?: string;
  }; // events
  foundedYear?: string; // events
  employeesRange?: string; // events
  sector?: string; // events
  industry?: string; // events
  budget?: number; // events
  places?: string[]; // events
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    crunchbase?: string;
  }; // events
  episodeEnclosureUrl?: string; // podcastEpisode
  episodeDuration?: string; // podcastEpisode
  episodeKeywords?: string[]; // podcastEpisode
}

export interface IContactListItemDetail {
  baseInfo: IContactListItemDetailBaseInfo;
  details?: IContactListItemDetailDetails;
}

interface IState {
  isLoading: boolean;
  userContactLists: IUserContactList[];
  contactListsItems: IContactListItemDetail[];
}

const initialState: IState = {
  isLoading: false,
  userContactLists: [],
  contactListsItems: [],
};

export const contactListSlice = createSlice({
  name: contactListStoreKey,
  initialState,
  reducers: {
    storeContactListItems: (state, action) => {
      state.contactListsItems = action.payload;
    },
    updateItemsPostRemoval: (state, action) => {
      const newItems: IContactListItemDetail[] = [];
      const deletedItemIds = action.payload;

      state.contactListsItems.map((existingItem) => {
        if (!deletedItemIds.includes(existingItem.baseInfo.id)) {
          newItems.push(existingItem);
        }
      });

      state.contactListsItems = newItems;
    },
  },
  extraReducers(builder) {
    // getUserContactLists
    builder.addCase(getUserContactLists.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserContactLists.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserContactLists.fulfilled, (state, action) => {
      state.userContactLists = action.payload ?? [];
      state.isLoading = false;
    });
    // getUserContactList
    builder.addCase(getUserContactList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserContactList.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserContactList.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getUserContactListCountSummary
    builder.addCase(getUserContactListCountSummary.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserContactListCountSummary.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserContactListCountSummary.fulfilled, (state) => {
      state.isLoading = false;
    });
    // createUserContactList
    builder.addCase(createUserContactList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createUserContactList.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createUserContactList.fulfilled, (state, action) => {
      const newListsArray = [action.payload, ...state.userContactLists];

      state.userContactLists = newListsArray;
      state.isLoading = false;
    });
    // getContactListItems
    builder.addCase(getContactListItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContactListItems.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getContactListItems.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getContactListItemsCount
    builder.addCase(getContactListItemsCount.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getContactListItemsCount.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getContactListItemsCount.fulfilled, (state) => {
      state.isLoading = false;
    });
    // addUserContactListItems
    builder.addCase(addUserContactListItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addUserContactListItems.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addUserContactListItems.fulfilled, (state) => {
      state.isLoading = false;
    });
    // deleteUserContactListItems
    builder.addCase(deleteUserContactListItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUserContactListItems.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteUserContactListItems.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getUserContactListItemSequence
    builder.addCase(getUserContactListItemSequence.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserContactListItemSequence.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserContactListItemSequence.fulfilled, (state) => {
      state.isLoading = false;
    });
    // activateUserContactListItemSequence
    builder.addCase(activateUserContactListItemSequence.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(activateUserContactListItemSequence.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(activateUserContactListItemSequence.fulfilled, (state) => {
      state.isLoading = false;
    });
    // connectContacts
    builder.addCase(connectContacts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(connectContacts.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(connectContacts.fulfilled, (state) => {
      state.isLoading = false;
    });
    // connectContactsNew
    builder.addCase(connectContactsNew.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(connectContactsNew.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(connectContactsNew.fulfilled, (state) => {
      state.isLoading = false;
    });
    // getListContactItems
    builder.addCase(getListContactItems.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getListContactItems.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getListContactItems.fulfilled, (state) => {
      state.isLoading = false;
    });
  },
});

export const { storeContactListItems, updateItemsPostRemoval } = contactListSlice.actions;
