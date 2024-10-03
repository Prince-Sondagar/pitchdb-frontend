import { Box, Button, Modal, Typography } from '@mui/material';
import styles from '../../ContactSearches.module.css';
import { IPodcastResult } from '../PodcastsSearch';
import StarRateIcon from '@mui/icons-material/StarRate';
import ReactMarkdown from 'react-markdown';
import { convertToMarkdown, formatDate } from '../../../../utils';
import { contactCategories } from '../../../../constants';
import { PodcastEpisodes } from '../../../contacts/components';
import { useState } from 'react';

interface IProps {
  itemInfo: IPodcastResult;
  handleCloseDetails: () => void;
  handleAddItemToContactLists: () => void;
}

export function PodcastDetail({
  itemInfo,
  handleCloseDetails,
  handleAddItemToContactLists,
}: IProps) {
  const [displayingReviews, setDisplayingReviews] = useState(false);
  return (
    <>
      <div className={styles.detailItemsControlsWrapper}>
        <Button variant="outlined" color="primary" onClick={handleCloseDetails}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddItemToContactLists}>
          Add To contacts
        </Button>
      </div>
      <div className={styles.detailsWrapper}>
        <div className={styles.twoColumnsDetailsWrapper}>
          <div className={styles.detailsImageWrapper}>
            <img src={itemInfo.image} alt="Contact profile details" width="100%" height="100%" />
          </div>
          <div className={styles.detailsDescriptionWrapper}>
            <Typography variant="body1" color="primary" fontWeight="bold">
              {itemInfo.title}
            </Typography>
            <Typography variant="body2" color="text.primary">
              By {itemInfo.publisherName}
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
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setDisplayingReviews(true)}
                  sx={{ textTransform: 'none' }}
                >
                  See reviews
                </Button>
              </div>
            )}
            <Box sx={(theme) => ({ fontSize: '0.8rem', color: theme.palette.text.secondary })}>
              <ReactMarkdown>{convertToMarkdown(itemInfo.description)}</ReactMarkdown>
            </Box>
          </div>
        </div>
        {!!itemInfo.genres.length && (
          <Typography variant="body2" color="text.secondary">
            <b>Genres</b>
            <br />
            {itemInfo.genres.map((genre) => genre.label).join(' | ')}
          </Typography>
        )}
        {itemInfo.type === contactCategories.podcast && itemInfo.listenNotesId && (
          <PodcastEpisodes listenNotesId={itemInfo.listenNotesId} />
        )}
      </div>

      <Modal
        open={displayingReviews}
        onClose={() => setDisplayingReviews(false)}
        className={styles.modalWrapper}
      >
        <div className={styles.reviewsListsWrapper}>
          <Typography variant="h3" color="primary" gutterBottom>
            Podcast reviews
          </Typography>
          <Typography variant="body1" color="text.primary" fontWeight="bold" gutterBottom>
            Average rating: {itemInfo.rating.toFixed(2)} / {itemInfo.ratingsAmount} reviews
          </Typography>
          {itemInfo.reviewsArray.map((review, index) => {
            return (
              <div key={index} className={styles.reviewWrapper}>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">
                  {review.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By {review.author}, on {formatDate(review.date)}
                </Typography>
                <div className={styles.ratingsWrapper}>
                  <StarRateIcon
                    fontSize="small"
                    sx={(theme) => ({ color: theme.palette.primary.starYellow })}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {review.rating}
                  </Typography>
                </div>
                <Typography variant="body2" color="text.secondary">
                  {review.comment}
                </Typography>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
