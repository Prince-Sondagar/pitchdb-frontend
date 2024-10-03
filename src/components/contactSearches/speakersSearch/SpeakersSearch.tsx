import { useCallback, useEffect, useState } from 'react';
import { Button, IconButton, Pagination, Tooltip, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { AnimatePresence, motion } from 'framer-motion';
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
  ISelectInputOption,
  ISelectInputOptionNumeric,
  contactSearchTypes,
  loadingDisplayTypes,
} from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { errorSideAlert, successSideAlert } from '../../../redux/alerts';
import {
  IFilterExpertSearchsOptions,
  SpeakerDetail,
  SpeakerItem,
  SpeakerSearchFiltering,
} from './components';
import styles from '../ContactSearches.module.css';
import { processGetSpeakers } from '../../../redux/searches/speakersSearch';

export interface ISpeakerResult {
  _id: string;
  Equipment?: string;
  additionalinfo?: string;
  audience?: string;
  businessname?: string;
  detailedprofile?: string;
  image?: string;
  name: string;
  opportunities?: string[];
  optionalcontactmethod?: string;
  ownpodcast?: string;
  past_appereance1?: { id: string; title: string };
  past_appereance2?: { id: string; title: string };
  past_appereance3?: { id: string; title: string };
  promotionPlan?: string;
  qualification?: string;
  sampleQuestion?: string;
  searchGenres?: ISelectInputOptionNumeric[];
  shortbio?: string;
  topics?: string;
  website?: string;
  // filling fields post getting result:
  tags?: IListTag[];
}

interface ISearchResults {
  results: ISpeakerResult[];
  totalInDB: number;
  offset: number;
}

const resultsPerPage = 20;

export function SpeakersSearch() {
  const dispatch = useAppDispatch();
  const contactLists = useAppSelector(contactListSelectors.contactLists);
  const contactListsItems = useAppSelector(contactListSelectors.contactListsItems);

  const [loadingView, setLoadingView] = useState<'loadMore' | 'pagination'>('loadMore');
  const [currentResults, setCurrentResults] = useState<ISearchResults>({
    results: [],
    totalInDB: 0,
    offset: 0,
  });
  const [selectedItems, setSelectedItems] = useState<ISpeakerResult[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingAddingContacts, setIsLoadingAddingContacts] = useState(false);
  const [displayingAddToContacts, setDisplayingAddToContacts] = useState(false);
  const [displayingItemDetails, setDisplayingItemDetails] = useState<ISpeakerResult | null>(null);
  const [displayinScrollTop, setDisplayingScrollTop] = useState(false);
  const [resultsMatchShouldUpdate, setResultsMatchShouldUpdate] = useState(false);

  const getContactListInfoIfExists = useCallback(
    (results: ISpeakerResult[]) => {
      const itemsThatMatch: ISpeakerResult[] = [];
      const itemsThatDontMatch: ISpeakerResult[] = [];

      results.map((result) => {
        let matched = false;
        const listsPerResult: IListTag[] = [];

        contactListsItems.map((item) => {
          if (
            result.name === item.baseInfo.name &&
            result.businessname === item.details?.businessName &&
            result.detailedprofile === item.details?.detailedProfile
          ) {
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

  const getSpeakers = useCallback(
    async (_offset: number, isResettingValue: boolean, filters?: IFilterExpertSearchsOptions) => {
      setIsLoadingResults(true);

      const speakerParameters = {
        type: contactSearchTypes.expertsSearch,
        keyword: filters?.keywords ?? 'experts',
        searchGenres: filters?.genres ?? [],
        selectSearchOpportunities: filters?.opportunities ?? [],
        filters: {
          type: contactSearchTypes.expertsSearch,
          keywords: filters?.keywords ?? 'experts',
          pagination: loadingView === 'pagination' ? true : false,
        },
      };

      const response = await dispatch(
        processGetSpeakers(JSON.stringify(speakerParameters)),
      ).unwrap();

      if (response?.results) {
        setCurrentResults((prev) => {
          let newResults: ISpeakerResult[];

          if (isResettingValue) {
            setSelectedItems([]);

            newResults = response.results;
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
          // dispatch(
          //   saveUserSearch({
          //     type: contactSearchTypes.eventsSearch,
          //     keyword: filters?.keywords ?? '',
          //     results: response.total,
          //     filters: speakerParameters,
          //   }),
          // );
        }
      }
      setIsLoadingResults(false);
    },
    [dispatch],
  );

  useEffect(() => {
    getSpeakers(0, false);
  }, [getSpeakers]);

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

  const handleProcessFiltering = (filters: IFilterExpertSearchsOptions) => {
    getSpeakers(0, true, filters);
  };

  const handleToggleLoadingView = (view: 'loadMore' | 'pagination') => {
    setLoadingView(view);

    if (currentResults.offset > resultsPerPage * 1) {
      getSpeakers(0, true);
    }
  };

  const handleShowItemDetail = (item: ISpeakerResult) => {
    setDisplayingItemDetails(item);
  };

  const handleToggleSelectAll = () => {
    let newItemsSelected: ISpeakerResult[] = [];

    if (selectedItems.length < currentResults.results.length) {
      newItemsSelected = currentResults.results;
    }

    setSelectedItems(newItemsSelected);
  };

  const handleItemSelection = (item: ISpeakerResult) => {
    const selectedItemsWithoutExtraSelection = selectedItems.filter(
      (selectedItem) => selectedItem._id !== item._id,
    );

    if (selectedItemsWithoutExtraSelection.length === selectedItems.length) {
      setSelectedItems((prev) => [item, ...prev]);
    } else {
      setSelectedItems(selectedItemsWithoutExtraSelection);
    }
  };

  const handleLoadMore = () => {
    getSpeakers(currentResults.offset, false);
  };

  const handlePaginationChange = (_e: React.ChangeEvent<unknown>, page: number) => {
    getSpeakers(page * resultsPerPage - resultsPerPage * 1, true);

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

    selectedItems.map((selectedItem) => {
      if (existingItem && existingInList) return;

      itemsExistingInListsSelected.find((item) => {
        if (
          selectedItem.name === item.baseInfo.name &&
          selectedItem.businessname === item.details?.businessName &&
          selectedItem.detailedprofile === item.details?.detailedProfile
        ) {
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
            itemType: 'speaker',
            items: selectedItems,
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
          Experts search
        </Typography>
        {displayingItemDetails ? (
          <SpeakerDetail
            itemInfo={displayingItemDetails}
            handleCloseDetails={() => setDisplayingItemDetails(null)}
            handleAddItemToContactLists={() => setDisplayingAddToContacts(true)}
          />
        ) : (
          <>
            <SpeakerSearchFiltering handleProcessFiltering={handleProcessFiltering} />
            {currentResults.results.length ? (
              <>
                {isLoadingResults && (
                  <div style={{ marginTop: '1rem' }}>
                    <LoadingIcon />
                  </div>
                )}
                <SearchResultsWrapper
                  itemsTypeLabel="expert"
                  totalItems={currentResults.totalInDB}
                  selectedItemsTotal={selectedItems.length}
                  totalResultsInDB={currentResults.results.length}
                  loadingView={loadingView}
                  allItemsAreSelected={currentResults.results.length === selectedItems.length}
                  handleOpenAddContactsModal={() => setDisplayingAddToContacts(true)}
                  handleToggleLoadingView={handleToggleLoadingView}
                  handleToggleSelectAll={handleToggleSelectAll}
                >
                  <>
                    {currentResults.results.map((result, index) => {
                      return (
                        <SpeakerItem
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
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleLoadMore}
                          disabled={currentResults.offset === currentResults.totalInDB}
                        >
                          Load more
                        </Button>
                      ) : (
                        <Pagination
                          variant="outlined"
                          shape="rounded"
                          color="primary"
                          count={Math.floor(currentResults.totalInDB / resultsPerPage)}
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
