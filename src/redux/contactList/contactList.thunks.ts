import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { contactListStoreKey } from './contactList.const';
import { errorAlert, errorSideAlert, warningAlert } from '../alerts';
import { IUserContactList, IContactSequence } from '../../types';
import { IContactListItemDetail, storeContactListItems } from '.';
import { contactCategories } from '../../constants';
import { IPodcastResult } from '../../components/contactSearches/podcastsSearch/PodcastsSearch';
import { IEventResult } from '../../components/contactSearches/eventsSearch/EventsSearch';
import { IMediaOutletResult } from '../../components/contactSearches/mediaOutletsSearch/MediaOutletsSearch';
import { IConferenceResult } from '../../components/contactSearches/conferencesSearch/ConferencesSearch';
import { ISpeakerResult } from '../../components/contactSearches/speakersSearch/SpeakersSearch';

const contactListsPath = `${import.meta.env.VITE_API_BASE_URL}/lists`;

interface IGetUserContactLists {
  page: number;
  noLimit: boolean;
}

interface ICreateUserContactList {
  name: string;
  podcasts: [];
  episodes: [];
}

interface IAddItemsToUserContactList {
  listId: string;
  itemType: string;
  items:
    | IPodcastResult[]
    | IEventResult[]
    | IMediaOutletResult[]
    | IConferenceResult[]
    | ISpeakerResult[];
}

interface IGetContactListItems {
  listId: string;
  itemType: string;
  page: number;
}

interface IGetContactListItemsCount {
  listId: string;
  itemType: string;
}

interface IDeleteUserContactListItems {
  listId: string;
  listItemIds: string[];
}

interface IGetUserContactListItemSequence {
  listId: string;
  listItemId: string;
}

export const getUserContactLists = createAsyncThunk(
  `${contactListStoreKey}/getUserContactLists`,
  async (query: IGetUserContactLists, thunkApi) => {
    try {
      const response = await axios.get(
        `${contactListsPath}?page=${query.page}${query.noLimit ? '&noLimit=1' : ''}`,
      );

      const lists: IUserContactList[] = [];

      if (response?.data?.length) {
        response.data.map((list: IUserContactList) => {
          lists.push({
            _id: list._id,
            name: list.name,
            dateCreated: list.dateCreated,
          });
        });
      }
      // Evaluating listItems
      const listIdsAsStrings = lists.map((list) => list._id).join(',');

      const listItems = await thunkApi.dispatch(getListContactItems(listIdsAsStrings)).unwrap();

      if (listItems?.length) {
        const listItemsMapped: IContactListItemDetail[] = [];

        listItems.map((item: any) => {
          if (item.userPodcast) {
            const { userPodcast, _id, listId } = item;
            const { podcast, connected } = userPodcast;

            listItemsMapped.push({
              baseInfo: {
                id: _id,
                name: podcast.title,
                image: podcast.image,
                category: contactCategories.podcast,
                pitched: !!(connected && podcast.hasEmail),
                listId,
              },
              details: {
                id: userPodcast._id,
                connected,
                email: podcast.hasEmail,
                listenNotesId: podcast.listenNotesId,
                publisherName: podcast.publisherName,
                categories: podcast.genres,
                rating: {
                  value: podcast.rating,
                  reviewsAmount: podcast.ratingsAmount,
                },
                description: podcast.description,
              },
            });
          } else if (item.userPodcastEpisode) {
            const { userPodcastEpisode, _id, listId } = item;
            const { episode, connected } = userPodcastEpisode;

            listItemsMapped.push({
              baseInfo: {
                id: _id,
                name: episode.title,
                image: episode.image,
                category: contactCategories.podcastEpisode,
                pitched: !!(connected && episode.hasEmail),
                listId,
              },
              details: {
                id: userPodcastEpisode._id,
                connected,
                email: episode.hasEmail,
                listenNotesId: episode.listenNotesId,
                publisherName: episode.publisherName,
                categories: episode.genres,
                rating: {
                  value: episode.rating,
                  reviewsAmount: episode.ratingsAmount,
                },
                description: episode.description,
                publishDate: episode.publishDate,
                episodeDuration: episode.duration,
                episodeKeywords: episode.keywords,
              },
            });
          } else if (item.userEventOrganization) {
            const { userEventOrganization, _id, listId } = item;
            const { eventOrganization } = userEventOrganization;
            const {
              connected,
              hasEmail,
              dataFileType,
              organization,
              schoolName,
              enrichment,
              position,
              description,
              firstName,
              lastName,
              phone,
              personPhone,
              address,
              zipCode,
              organizationWebsite,
              city,
              state,
              country,
              budget,
              places,
            } = eventOrganization;

            const itemName = dataFileType === 1 ? schoolName : organization;
            const logo = enrichment ? enrichment.logo : '';

            listItemsMapped.push({
              baseInfo: {
                id: _id,
                name: itemName,
                image: logo,
                category: contactCategories.eventOrganization,
                pitched: !!(connected && hasEmail),
                listId,
                position,
                eventType: dataFileType === 1 ? 'School' : 'Event',
              },
              details: {
                id: userEventOrganization._id,
                connected,
                email: hasEmail,
                description,
                contactName: {
                  firstName,
                  lastName,
                },
                phoneNumber: personPhone || phone,
                eventAddress: {
                  value: address,
                  zipCode,
                },
                website: organizationWebsite,
                foundedYear: enrichment?.foundedYear,
                employeesRange: enrichment?.metrics?.employeesRange,
                sector: enrichment?.category?.sector,
                industry: enrichment?.category?.industry,
                location: {
                  city,
                  state,
                  country,
                },
                budget,
                places,
                socialLinks: {
                  facebook: enrichment?.facebook?.handle,
                  linkedin: enrichment?.linkedin?.handle,
                  crunchbase: enrichment?.crunchbase?.handle,
                },
              },
            });
          } else if (item.userSpeaker) {
            const { userSpeaker, _id, listId } = item;
            const { speaker, connected } = userSpeaker;

            const itemName = speaker.name ?? speaker.email;
            const logo = speaker.image ?? '';

            listItemsMapped.push({
              baseInfo: {
                id: _id,
                name: itemName,
                image: logo,
                category: contactCategories.speaker,
                pitched: !!(connected && speaker.email),
                listId,
                email: speaker.email,
              },
              details: {
                id: userSpeaker._id,
                businessName: speaker.businessname,
                website: speaker.website,
                socialMediaLink1: speaker.socialMediaLink1,
                socialMediaLink2: speaker.socialMediaLink2,
                socialMediaLink3: speaker.socialMediaLink3,
                equipment: speaker.Equipment,
                additionalInfo: speaker.additionalinfo,
                optionalContactMethod: speaker.optionalcontactmethod,
                categories: speaker.searchGenres,
                subCategories: speaker.subcategories,
                shortBio: speaker.shortbio,
                topics: speaker.topics,
                detailedProfile: speaker.detailedprofile,
                qualification: speaker.qualification,
                audience: speaker.audience,
                promotionPlan: speaker.promotionPlan,
                sampleQuestion: speaker.sampleQuestion,
                ownPodcast: speaker.ownpodcast,
                pastAppereance1: speaker.past_appereance1?.title,
                pastAppereance2: speaker.past_appereance2?.title,
                pastAppereance3: speaker.past_appereance3?.title,
              },
            });
          } else if (item.userMediaOutlet) {
            const { userMediaOutlet, _id, listId } = item;
            const { mediaOutlet, connected } = userMediaOutlet;

            listItemsMapped.push({
              baseInfo: {
                id: _id,
                name: mediaOutlet.companyName ?? '',
                image: null,
                category: contactCategories.mediaOutlet,
                pitched: !!(connected && mediaOutlet.email),
                listId,
                position: mediaOutlet.position,
              },
              details: {
                id: userMediaOutlet._id,
                connected,
                email: mediaOutlet.hasEmail,
                magazineGenre: mediaOutlet.magazineGenre,
                contactName: {
                  firstName: mediaOutlet.firstName,
                  lastName: mediaOutlet.lastName,
                },
                phoneNumber: mediaOutlet.phone,
                location: {
                  city: mediaOutlet.city,
                  state: mediaOutlet.state,
                },
              },
            });
          } else if (item.userConference) {
            const { userConference, _id, listId } = item;
            const { conference, connected } = userConference;

            const logo =
              conference.enrichment?.logo ?? `https://logo.clearbit.com/${conference.website}`;

            listItemsMapped.push({
              baseInfo: {
                id: _id,
                name: conference.eventName,
                image: logo,
                category: contactCategories.conference,
                pitched: !!(connected && conference.hasEmail),
                listId,
              },
              details: {
                id: userConference._id,
                connected,
                email: conference.hasEmail,
                description: conference.eventDescription,
                contactName: {
                  firstName: conference.contactName,
                },
                location: {
                  city: conference.location,
                },
                conferenceCategory: conference.category,
                estimatedAudience: conference.estAudience,
                date: conference.date,
              },
            });
          }
        });

        thunkApi.dispatch(storeContactListItems(listItemsMapped));
      }
      //

      return lists;
    } catch (error) {
      thunkApi.dispatch(errorSideAlert('Error getting the user lists. Please, try again later.'));
    }
  },
);

export const getUserContactList = createAsyncThunk(
  `${contactListStoreKey}/getUserContactList`,
  async (listId: string, thunkApi) => {
    try {
      const response = await axios.get(`${contactListsPath}/${listId}`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error getting the list specified. Please, try again later.'));
    }
  },
);

export const getUserContactListCountSummary = createAsyncThunk(
  `${contactListStoreKey}/getUserContactListsCountSummary`,
  async (listId: string, thunkApi) => {
    try {
      const response = await axios.get(`${contactListsPath}/${listId}/count-summary`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error getting the count of contacts in a list. Please, try again later.'),
      );
    }
  },
);

export const createUserContactList = createAsyncThunk(
  `${contactListStoreKey}/createUserContactList`,
  async (listData: ICreateUserContactList, thunkApi) => {
    try {
      const response = await axios.post(contactListsPath, listData);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('There is already a list with that name. Please, choose another name.'),
      );
    }
  },
);

export const deleteUserContactList = createAsyncThunk(
  `${contactListStoreKey}/deleteUserContactList`,
  async (listId: string, thunkApi) => {
    try {
      const response = await axios.delete(`${contactListsPath}/${listId}`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(errorAlert('Error deleting the list specified. Please, try again later.'));
    }
  },
);

export const getContactListItemsCount = createAsyncThunk(
  `${contactListStoreKey}/getContactListItemsCount`,
  async (params: IGetContactListItemsCount, thunkApi) => {
    const { listId, itemType } = params;
    try {
      const response = await axios.get(
        `${contactListsPath}/${listId}/items/count?type=${itemType}`,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert(
          'Error getting the count of items in the list specified. Please, try again later.',
        ),
      );
    }
  },
);

export const addUserContactListItems = createAsyncThunk(
  `${contactListStoreKey}/addUserContactListItems`,
  async (params: IAddItemsToUserContactList, thunkApi) => {
    const { listId, itemType, items } = params;
    try {
      const response = await axios.post(
        `${contactListsPath}/${listId}/items?type=${itemType}`,
        items,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorSideAlert('Error adding the contacts to the list specified. Please, try again later.'),
      );
    }
  },
);

export const deleteUserContactListItems = createAsyncThunk(
  `${contactListStoreKey}/deleteUserContactListItems`,
  async (params: IDeleteUserContactListItems, thunkApi) => {
    const { listId, listItemIds } = params;
    try {
      await axios.delete(`${contactListsPath}/${listId}/items`, {
        data: listItemIds,
      });

      return { success: true, deletedItemIds: listItemIds };
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error deleting the contact from the list specified. Please, try again later.'),
      );
    }
  },
);

export const getUserContactListItemSequence = createAsyncThunk(
  `${contactListStoreKey}/getUserContactListItemSequence`,
  async (params: IGetUserContactListItemSequence, thunkApi) => {
    const { listId, listItemId } = params;
    try {
      const response = await axios.get(
        `${contactListsPath}/${listId}/items/${listItemId}/sequence`,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error getting the contact list item sequence. Please, try again later.'),
      );
    }
  },
);

export const activateUserContactListItemSequence = createAsyncThunk(
  `${contactListStoreKey}/activateUserContactListItemSequence`,
  async (params: IGetUserContactListItemSequence, thunkApi) => {
    const { listId, listItemId } = params;
    try {
      const response = await axios.put(
        `${contactListsPath}/${listId}/items/${listItemId}/sequence`,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error activating the contact list item sequence. Please, try again later.'),
      );
    }
  },
);

export const connectContacts = createAsyncThunk(
  `${contactListStoreKey}/connectContacts`,
  async (newSequences: IContactSequence[], thunkApi) => {
    try {
      await axios.put(`${contactListsPath}/items/contact`, newSequences);

      return { success: true };
    } catch (error) {
      thunkApi.dispatch(
        warningAlert({
          title: 'Not validated',
          message:
            "We couldn't validate the recipient's able to recieve messages, the outreach sequence has been removed",
        }),
      );
      thunkApi.dispatch(
        deleteUserContactListItems({
          listId: newSequences[0].listId,
          listItemIds: [newSequences[0].listItemId],
        }),
      );
    }
  },
);

export const connectContactsNew = createAsyncThunk(
  `${contactListStoreKey}/connectContactsNew`,
  async (newSequence: IContactSequence, thunkApi) => {
    try {
      await axios.put(`${contactListsPath}/items/contactnew`, newSequence);

      return { success: true };
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error connecting to the new contact specified. Please, try again later.'),
      );
    }
  },
);

export const getContactListItems = createAsyncThunk(
  `${contactListStoreKey}/getContactListItems`,
  async (params: IGetContactListItems, thunkApi) => {
    const { listId, itemType, page } = params;
    try {
      const response = await axios.get(
        `${contactListsPath}/${listId}/items?type=${itemType}&page=${page}`,
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert('Error getting the items in the list specified. Please, try again later.'),
      );
    }
  },
);

export const getListContactItems = createAsyncThunk(
  `${contactListStoreKey}/getListContactItems`,
  async (listIdsAsString: string, thunkApi) => {
    try {
      const response = await axios.get(`${contactListsPath}/${listIdsAsString}/contactitems`);

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        errorAlert(
          'Error getting the contact items in the list specified. Please, try again later.',
        ),
      );
    }
  },
);
