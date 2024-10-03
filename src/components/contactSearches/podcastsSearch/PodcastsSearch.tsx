import { useCallback, useEffect, useState } from 'react';
import { Button, IconButton, Pagination, Tooltip, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { AnimatePresence, motion } from 'framer-motion';
import {
  IFilterPodcastsSearchsOptions,
  PodcastsSearchFiltering,
} from './components/PodcastsSearchFiltering';
import { contactCategories } from '../../../constants';
import { formatQueryParameters } from '../../../utils';
import { podcastsSocket } from '../../../sockets/podcastsSocket';
import {
  IContactListItemDetail,
  addUserContactListItems,
  contactListSelectors,
  getUserContactLists,
} from '../../../redux/contactList';
import { AddToContactsModal, SearchResultsWrapper } from '../common';
import { LoadingDisplay, LoadingIcon } from '../../../common';
import {
  IListTag,
  ISearchTransformedParameters,
  ISelectInputOption,
  contactSearchTypes,
  loadingDisplayTypes,
} from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { errorSideAlert, successSideAlert } from '../../../redux/alerts';
import { PodcastDetail, PodcastItem } from './components';
import styles from '../ContactSearches.module.css';
import { saveUserSearch } from '../../../redux/searches/userSavedSearches';

interface IReview {
  rating: number;
  date: string;
  title: string;
  author: string;
  comment: string;
}

export interface IPodcastResult {
  description: string;
  done?: boolean;
  failed?: boolean;
  feedUrl: string;
  genres: ISelectInputOption[];
  iTunesId: number;
  image: string;
  listenNotesId: string;
  publisherName: string;
  rating: number;
  ratingsAmount: number;
  reviewsArray: IReview[];
  title: string;
  type: string;
  // filling fields post getting result:
  tags?: IListTag[];
}

interface ISearchResults {
  results: IPodcastResult[];
  totalInDB: number;
  offset: number;
}

const totalForPodcasts = 3131282;
const totalForEpisodes = 168863851;
const resultsPerPage = 10;

export function PodcastsSearch() {
  const dispatch = useAppDispatch();
  const contactLists = useAppSelector(contactListSelectors.contactLists);
  const contactListsItems = useAppSelector(contactListSelectors.contactListsItems);

  const [loadingView, setLoadingView] = useState<'loadMore' | 'pagination'>('loadMore');
  const [currentResults, setCurrentResults] = useState<ISearchResults>({
    results: [],
    totalInDB: 0,
    offset: 0,
  });
  const [selectedItems, setSelectedItems] = useState<IPodcastResult[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingAddingContacts, setIsLoadingAddingContacts] = useState(false);
  const [displayingItemDetails, setDisplayingItemDetails] = useState<IPodcastResult | null>(null);
  const [displayingAddToContacts, setDisplayingAddToContacts] = useState(false);
  const [displayinScrollTop, setDisplayingScrollTop] = useState(false);
  const [storingFilters, setStoringFilters] = useState<IFilterPodcastsSearchsOptions | null>(null);
  const [resultsMatchShouldUpdate, setResultsMatchShouldUpdate] = useState(false);

  const getContactListInfoIfExists = useCallback(
    (results: IPodcastResult[]) => {
      const itemsThatMatch: IPodcastResult[] = [];
      const itemsThatDontMatch: IPodcastResult[] = [];

      results.map((result) => {
        let matched = false;
        const listsPerResult: IListTag[] = [];

        contactListsItems.map((item) => {
          if (result.listenNotesId === item.details?.listenNotesId) {
            const foundList = contactLists.find((list) => list._id === item.baseInfo.listId);
            if (foundList) {
              listsPerResult.push({ listId: foundList._id, listName: foundList.name });
              matched = true;
            }
          }
        });

        if (!matched) {
          itemsThatDontMatch.push(result);
        } else {
          itemsThatMatch.push({
            ...result,
            tags: listsPerResult,
          });
        }
      });

      return [...itemsThatMatch, ...itemsThatDontMatch];
    },
    [contactLists, contactListsItems],
  );

  const getPodcasts = useCallback(
    (offset: number, isResettingValue: boolean, filters?: IFilterPodcastsSearchsOptions) => {
      setIsLoadingResults(true);
      const transformedMainCategory =
        filters?.mainCategory.value === contactCategories.podcastEpisode
          ? 'episode'
          : contactCategories.podcast;
      const searchParameters: ISearchTransformedParameters = {
        type: transformedMainCategory,
        resultsPerPage: resultsPerPage, // useless. The socket brings 10 regardless
        keywords: 'business',
        offset,
      };

      if (filters) {
        const { keywords, genres, language, publishedBefore, publishedAfter } = filters;

        if (keywords) searchParameters.keywords = keywords;
        if (genres.length && genres[0].value !== 'all') {
          searchParameters.genreIds = genres.map((genre) => genre.value).join('_');
        }
        if (language && language.value !== 'all') searchParameters.language = language.value;
        if (publishedBefore) searchParameters.publishedBefore = publishedBefore.valueOf();
        if (publishedAfter) searchParameters.publishedAfter = publishedAfter.valueOf();
      }

      const formattedSearchParameters = formatQueryParameters(searchParameters);

      const searchSocket = podcastsSocket.searchPodcasts(formattedSearchParameters);

      searchSocket.on(podcastsSocket.events.RESULTS_FIRST, (response: any) => {
        if (response?.results) {
          setCurrentResults((prev) => {
            let newResults: IPodcastResult[];
            if (isResettingValue) {
              newResults = response.results;
              setSelectedItems([]);
            } else {
              newResults = [...prev.results, ...response.results];
            }

            return {
              results: newResults,
              totalInDB: response.total,
              offset: response.offset ?? newResults.length,
            };
          });

          setResultsMatchShouldUpdate(true);

          if (isResettingValue) {
            dispatch(
              saveUserSearch({
                type: contactSearchTypes.podcastSearch,
                keyword: filters?.keywords ?? '',
                results: response.total,
                filters: searchParameters,
              }),
            );
          }
        }
        setIsLoadingResults(false);
      });
      searchSocket.on(podcastsSocket.events.RESULTS_COMPLETE, () => {
        setIsLoadingResults(false);
      });
      searchSocket.on(podcastsSocket.events.SEARCH_ERROR, () => {
        setIsLoadingResults(false);
        dispatch(errorSideAlert('Error performing the search. Please, try again later.'));
      });
    },
    [dispatch],
  );

  useEffect(() => {
    getPodcasts(0, false);
  }, [getPodcasts]);

  useEffect(() => {
    if (resultsMatchShouldUpdate) {
      setTimeout(() => {
        const resultsMatchedWithContacts = getContactListInfoIfExists(currentResults.results);

        setCurrentResults((prev) => {
          return {
            ...prev,
            results: resultsMatchedWithContacts,
          };
        });

        setResultsMatchShouldUpdate(false);
      }, 1000);
    }
  }, [resultsMatchShouldUpdate, getContactListInfoIfExists, currentResults.results]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        if (!displayinScrollTop) setDisplayingScrollTop(true);
      } else {
        if (displayinScrollTop) setDisplayingScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayinScrollTop]);

  const handleProcessFiltering = (filters: IFilterPodcastsSearchsOptions) => {
    setStoringFilters(filters);
    getPodcasts(0, true, filters);
  };

  const totalItemsForMainCategory = () => {
    if (storingFilters?.mainCategory.value === contactCategories.podcast) {
      return totalForPodcasts;
    } else {
      return totalForEpisodes;
    }
  };

  const handleToggleLoadingView = (view: 'loadMore' | 'pagination') => {
    setLoadingView(view);

    if (currentResults.offset > resultsPerPage * 1) {
      getPodcasts(0, true);
    }
  };

  const handleToggleSelectAll = () => {
    let newItemsSelected: IPodcastResult[] = [];

    if (selectedItems.length < currentResults.results.length) {
      newItemsSelected = currentResults.results;
    }

    setSelectedItems(newItemsSelected);
  };

  const handleItemSelection = (item: IPodcastResult) => {
    const selectedItemsWithoutExtraSelection = selectedItems.filter(
      (selectedItem) => selectedItem.listenNotesId !== item.listenNotesId,
    );

    if (selectedItemsWithoutExtraSelection.length === selectedItems.length) {
      setSelectedItems((prev) => [item, ...prev]);
    } else {
      setSelectedItems(selectedItemsWithoutExtraSelection);
    }
  };

  const handleShowItemDetail = (item: IPodcastResult) => {
    setDisplayingItemDetails(item);
  };

  const handleLoadMore = () => {
    getPodcasts(currentResults.offset, false);
  };

  const handlePaginationChange = (_e: React.ChangeEvent<unknown>, page: number) => {
    getPodcasts(page * resultsPerPage - resultsPerPage * 1, true);

    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleGoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleAddItemsToLists = (listsSelected: ISelectInputOption[]) => {
    setIsLoadingAddingContacts(true);

    const itemsExistingInListsSelected: IContactListItemDetail[] = [];

    listsSelected.map((list) => {
      contactListsItems.map((item) => {
        if (item.baseInfo.listId === list._id) {
          itemsExistingInListsSelected.push(item);
        }
      });
    });

    let existingItem: string | null = null;
    let existingInList: string | null = null;

    let itemsToAdd: IPodcastResult[];

    if (displayingItemDetails) {
      itemsToAdd = [displayingItemDetails];
    } else {
      itemsToAdd = selectedItems;
    }

    itemsToAdd.map((selectedItem) => {
      if (existingItem && existingInList) return;

      itemsExistingInListsSelected.find((item) => {
        if (item.baseInfo.name === selectedItem.title) {
          const foundList = contactLists.find((list) => list._id === item.baseInfo.listId);
          existingItem = item.baseInfo.name;
          existingInList = foundList?.name ?? '';
        }
      });
    });

    if (existingItem && existingInList) {
      setIsLoadingAddingContacts(false);
      dispatch(
        errorSideAlert(
          `The contact item named "${existingItem}" is already stored in the ${existingInList} contact lists.`,
        ),
      );

      return;
    }

    listsSelected.map((list) => {
      if (list._id) {
        dispatch(
          addUserContactListItems({
            listId: list._id,
            itemType: itemsToAdd[0].type,
            items: itemsToAdd,
          }),
        );
      }
    });

    dispatch(getUserContactLists({ page: 0, noLimit: true }));
    setResultsMatchShouldUpdate(true);

    dispatch(successSideAlert('Contacts successfully added to lists'));
    setIsLoadingAddingContacts(false);
    setDisplayingAddToContacts(false);
  };

  return (
    <>
      <div className={styles.contactSearchesWrapper}>
        <Typography variant="h3" color="primary.main" sx={{ m: '2rem 0' }}>
          Podcasts search
        </Typography>
        {displayingItemDetails ? (
          <PodcastDetail
            itemInfo={displayingItemDetails}
            handleCloseDetails={() => setDisplayingItemDetails(null)}
            handleAddItemToContactLists={() => setDisplayingAddToContacts(true)}
          />
        ) : (
          <>
            <PodcastsSearchFiltering handleProcessFiltering={handleProcessFiltering} />
            {currentResults.results.length ? (
              <>
                {isLoadingResults && (
                  <div style={{ marginTop: '1rem' }}>
                    <LoadingIcon />
                  </div>
                )}
                <SearchResultsWrapper
                  itemsTypeLabel={
                    storingFilters?.mainCategory.value === contactCategories.podcastEpisode
                      ? 'episode'
                      : contactCategories.podcast
                  }
                  totalItems={totalItemsForMainCategory()}
                  selectedItemsTotal={selectedItems.length}
                  totalResultsInDB={currentResults.totalInDB}
                  loadingView={loadingView}
                  allItemsAreSelected={currentResults.results.length === selectedItems.length}
                  handleOpenAddContactsModal={() => setDisplayingAddToContacts(true)}
                  handleToggleLoadingView={handleToggleLoadingView}
                  handleToggleSelectAll={handleToggleSelectAll}
                >
                  <>
                    {currentResults.results.map((result, index) => {
                      return (
                        <PodcastItem
                          key={index}
                          selectedItems={selectedItems}
                          itemInfo={result}
                          handleItemSelection={handleItemSelection}
                          handleShowItemDetail={handleShowItemDetail}
                        />
                      );
                    })}
                  </>
                </SearchResultsWrapper>
                <div className={styles.loadingViewControlls}>
                  {isLoadingResults ? (
                    <LoadingIcon />
                  ) : (
                    <>
                      {loadingView === 'loadMore' ? (
                        <Button variant="contained" color="primary" onClick={handleLoadMore}>
                          Load more
                        </Button>
                      ) : (
                        <Pagination
                          variant="outlined"
                          shape="rounded"
                          color="primary"
                          count={30} // Fixed max of results comming for podcasts.
                          page={Math.floor(currentResults.offset / resultsPerPage)}
                          onChange={handlePaginationChange}
                        />
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {isLoadingResults ? (
                  <div className={styles.isLoadingWrapper}>
                    <LoadingDisplay type={loadingDisplayTypes.entireComponent} />
                  </div>
                ) : (
                  <div className={styles.isLoadingWrapper}>
                    <Typography variant="body1" color="text.secondary">
                      No results to show.
                    </Typography>
                  </div>
                )}
              </>
            )}
            <AnimatePresence>
              {displayinScrollTop && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={styles.goTopWrapper}
                >
                  <Tooltip title="Scroll top" placement="top">
                    <IconButton
                      sx={(theme) => ({
                        border: '1px solid #f1f2f3',
                        boxShadow: theme.palette.primary.generalBoxShadow,
                        backgroundColor: theme.palette.text.secondaryInverted,
                      })}
                      onClick={handleGoTop}
                    >
                      <ArrowUpwardIcon sx={(theme) => ({ color: theme.palette.text.secondary })} />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
      <AddToContactsModal
        isOpen={displayingAddToContacts}
        selectedItemsAmount={selectedItems.length}
        handleClose={() => setDisplayingAddToContacts(false)}
        handleAddItemsToLists={handleAddItemsToLists}
        isLoading={isLoadingAddingContacts}
      />
    </>
  );
}
