import { useState } from 'react';
import { Box, Checkbox, IconButton, Tooltip, Typography } from '@mui/material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { AnimatePresence, motion } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarRateIcon from '@mui/icons-material/StarRate';
import podcastDefaultImage from '../../../../assets/images/podcast-default-image.png';
import { convertToMarkdown, trimString } from '../../../../utils';
import { IPodcastResult } from '../PodcastsSearch';
import styles from '../../ContactSearches.module.css';

interface IProps {
  selectedItems: IPodcastResult[];
  itemInfo: IPodcastResult;
  handleItemSelection: (item: IPodcastResult) => void;
  handleShowItemDetail: (item: IPodcastResult) => void;
}

export function PodcastItem({
  selectedItems,
  itemInfo,
  handleItemSelection,
  handleShowItemDetail,
}: IProps) {
  const [displayActionButtons, setDisplayActionButtons] = useState(false);
  const itemIsSelected = () => {
    const found = selectedItems.find((item) => item.listenNotesId === itemInfo.listenNotesId);

    return !!found;
  };

  return (
    <div
      className={`${styles.searchItem} ${itemIsSelected() ? styles.itemSelected : ''}`}
      onMouseEnter={() => setDisplayActionButtons(true)}
      onMouseLeave={() => setDisplayActionButtons(false)}
    >
      <div className={styles.checkBoxWrapper}>
        <Checkbox onClick={() => handleItemSelection(itemInfo)} checked={itemIsSelected()} />
      </div>
      <div className={styles.itemImageWrapper}>
        <img
          src={itemInfo.image}
          onError={(e: any) => (e.src = podcastDefaultImage)}
          alt="Contact profile"
          width="100%"
          height="100%"
        />
      </div>
      <div className={styles.descriptionAndSeeMore}>
        <div className={styles.textDescriptionWrapper}>
          <Typography variant="body1" color="text.secondary" fontWeight="bold">
            {trimString(itemInfo.title, 50)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            By {trimString(itemInfo.publisherName, 40)}
          </Typography>
          {itemInfo.rating && (
            <div className={styles.ratingsWrapper}>
              <StarRateIcon
                fontSize="small"
                sx={(theme) => ({ color: theme.palette.primary.starYellow })}
              />
              <Typography variant="body2" color="text.secondary">
                {itemInfo.rating.toFixed(2)} | {itemInfo.ratingsAmount} review
                {itemInfo.ratingsAmount > 1 ? 's' : ''}
              </Typography>
            </div>
          )}
          <Box sx={(theme) => ({ fontSize: '0.8rem', color: theme.palette.text.secondary })}>
            <ReactMarkdown>
              {convertToMarkdown(trimString(itemInfo.description, 300))}
            </ReactMarkdown>
          </Box>
          <div className={styles.listTagsWrapper}>
            {itemInfo.tags &&
              itemInfo.tags.map((tag) => {
                return (
                  <div key={tag.listId} className={styles.listTag}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      {tag.listName}
                    </Typography>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={styles.visibilityButton}>
          <AnimatePresence>
            {displayActionButtons && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ backgroundColor: '#fff', borderRadius: '50%' }}
              >
                <Tooltip title="See details" placement="top">
                  <IconButton
                    sx={(theme) => ({ backgroundColor: theme.palette.text.primaryInverted })}
                    onClick={() => handleShowItemDetail(itemInfo)}
                  >
                    <VisibilityIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
