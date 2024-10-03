import { useState } from 'react';
import { Checkbox, IconButton, Tooltip, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import defaultImage from '../../../../assets/images/podcast-default-image.png';
import { formatExternalLinkCorrently, trimString } from '../../../../utils';
import { ISpeakerResult } from '../SpeakersSearch';
import styles from '../../ContactSearches.module.css';

interface IProps {
  selectedItems: ISpeakerResult[];
  itemInfo: ISpeakerResult;
  handleItemSelection: (item: ISpeakerResult) => void;
  handleShowItemDetail: (item: ISpeakerResult) => void;
}

export function SpeakerItem({
  selectedItems,
  itemInfo,
  handleItemSelection,
  handleShowItemDetail,
}: IProps) {
  const [displayActionButtons, setDisplayActionButtons] = useState(false);
  const itemIsSelected = () => {
    const found = selectedItems.find((item) => item._id === itemInfo._id);

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
          onError={(e: any) => (e.src = defaultImage)}
          alt="Contact profile"
          width="100%"
          height="100%"
        />
      </div>
      <div className={styles.descriptionAndSeeMore}>
        <div className={styles.textDescriptionWrapper}>
          <Typography variant="body1" color="text.secondary" fontWeight="bold">
            {itemInfo.name}
          </Typography>
          {itemInfo.website && (
            <div className={styles.itemWebsite} style={{ marginBottom: '1rem' }}>
              <LinkIcon fontSize="small" color="primary" />
              <a
                href={formatExternalLinkCorrently(itemInfo.website)}
                target="_blank"
                rel="noreferrer"
              >
                {itemInfo.website}
              </a>
            </div>
          )}
          {!!itemInfo.searchGenres?.length && (
            <Typography variant="body2" color="text.secondary">
              <b>Genres</b>: {itemInfo.searchGenres.map((genre) => genre.label).join(' | ')}
            </Typography>
          )}
          {itemInfo.topics && (
            <Typography variant="body2" color="text.secondary">
              <b>Topics</b>: {trimString(itemInfo.topics, 150)}
            </Typography>
          )}
          {itemInfo.audience && (
            <Typography variant="body2" color="text.secondary">
              <b>Audience</b>: {trimString(itemInfo.audience, 150)}
            </Typography>
          )}
          <div className={styles.listTagsWrapper} style={{ marginTop: '1rem' }}>
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
