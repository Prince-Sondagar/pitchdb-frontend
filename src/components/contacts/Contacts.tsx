import { useEffect, useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { IContactListItemDetail, contactListSelectors } from '../../redux/contactList';
import { useAppSelector } from '../../redux/hooks';
import {
  ContactItems,
  ContactsFiltering,
  DetailedItem,
  IFilterContactsOptions,
} from './components';
import { contactCategories } from '../../constants';
import styles from './Contacts.module.css';

export function Contacts() {
  const userContactLists = useAppSelector(contactListSelectors.contactLists);
  const userContactItems = useAppSelector(contactListSelectors.contactListsItems);

  const [displayinScrollTop, setDisplayingScrollTop] = useState(false);
  const [displayingItems, setDisplayingItems] = useState<IContactListItemDetail[]>([]);
  const [displayingDetailItem, setDisplayingDetailItem] = useState<IContactListItemDetail | null>(
    null,
  );

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

  useEffect(() => {
    setDisplayingItems(userContactItems);
  }, [userContactItems]);

  const handleProcessFiltering = (filters: IFilterContactsOptions) => {
    const { category, pitchState, contactList, keyword } = filters;

    let newItemsDisplaying = userContactItems;
    if (category !== 'all') {
      newItemsDisplaying = newItemsDisplaying.filter((item) => {
        if (
          category === contactCategories.podcast ||
          category === contactCategories.podcastEpisode
        ) {
          return (
            item.baseInfo.category === contactCategories.podcast ||
            item.baseInfo.category === contactCategories.podcastEpisode
          );
        } else {
          return item.baseInfo.category === category;
        }
      });
    }

    if (pitchState !== 'all') {
      const transformValue = (oldPitchState: string) =>
        oldPitchState === 'pitched' ? true : false;
      newItemsDisplaying = newItemsDisplaying.filter(
        (item) => item.baseInfo.pitched === transformValue(pitchState),
      );
    }

    if (contactList !== 'all') {
      const selectedContactList = userContactLists.find((list) => list.name === contactList);

      newItemsDisplaying = newItemsDisplaying.filter(
        (item) => item.baseInfo.listId === selectedContactList?._id,
      );
    }

    if (keyword) {
      newItemsDisplaying = newItemsDisplaying.filter(
        (item) =>
          item.baseInfo.name.includes(keyword) ||
          item.baseInfo.email?.includes(keyword) ||
          item.baseInfo.position?.includes(keyword),
      );
    }

    setDisplayingItems(newItemsDisplaying);
  };

  const handleGoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.mainWrapper}>
      {displayingDetailItem ? (
        <DetailedItem
          info={displayingDetailItem}
          userContactLists={userContactLists}
          handleCloseDetails={() => setDisplayingDetailItem(null)}
        />
      ) : (
        <>
          <Typography variant="h3" color="primary" m="2rem 0">
            Contacts
          </Typography>
          <ContactsFiltering handleProcessFiltering={handleProcessFiltering} />
          <ContactItems
            displayingItems={displayingItems}
            handleShowItemDetail={(item) => setDisplayingDetailItem(item)}
          />
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
    </div>
  );
}
