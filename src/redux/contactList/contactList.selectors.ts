import { type RootState } from '../store';

const isLoading = (state: RootState) => state.contactList.isLoading;
const contactLists = (state: RootState) => state.contactList.userContactLists;
const contactListsItems = (state: RootState) => state.contactList.contactListsItems;

export const contactListSelectors = {
  isLoading,
  contactLists,
  contactListsItems,
};
