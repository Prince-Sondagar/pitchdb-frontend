import { Button, Typography } from '@mui/material';
import { speakerOpportunities } from '../../../../constants';
import podcastDefaultImage from '../../../../assets/images/podcast-default-image.png';
import { ISpeakerResult } from '../SpeakersSearch';
import styles from '../../ContactSearches.module.css';

interface IProps {
  itemInfo: ISpeakerResult;
  handleCloseDetails: () => void;
  handleAddItemToContactLists: () => void;
}

export function SpeakerDetail({
  itemInfo,
  handleCloseDetails,
  handleAddItemToContactLists,
}: IProps) {
  const prepareOpportunities = () => {
    const matchedOportunities: string[] = [];

    if (itemInfo.opportunities?.length) {
      const opportunityOptions = Object.values(speakerOpportunities);

      itemInfo.opportunities.map((opportunity) => {
        opportunityOptions.map((option) => {
          if (opportunity === option.value) {
            matchedOportunities.push(option.label);
          }
        });
      });
    }

    return matchedOportunities;
  };

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
            <img
              src={itemInfo.image}
              onError={(e: any) => (e.src = podcastDefaultImage)}
              alt="Contact profile details"
              width="100%"
              height="100%"
            />
          </div>
          <div className={styles.detailsDescriptionWrapper}>
            <Typography variant="body1" color="primary" fontWeight="bold">
              {itemInfo.name}
            </Typography>
            {!!itemInfo.searchGenres?.length && (
              <Typography variant="body2" color="text.secondary">
                <b>Genres</b>: {itemInfo.searchGenres.map((genre) => genre.label).join(' | ')}
              </Typography>
            )}
            {!!itemInfo.opportunities?.length && (
              <Typography variant="body2" color="text.secondary">
                <b>Opportunities</b>: {prepareOpportunities().join(' | ')}
              </Typography>
            )}
            {itemInfo.promotionPlan && (
              <Typography variant="body1" color="text.secondary">
                <b>Promotion plan</b>: {itemInfo.promotionPlan}
              </Typography>
            )}
            {itemInfo.promotionPlan && (
              <Typography variant="body1" color="text.secondary">
                <b>Qualification</b>: {itemInfo.qualification}
              </Typography>
            )}
            {itemInfo.promotionPlan && (
              <Typography variant="body1" color="text.secondary">
                <b>Bio</b>: {itemInfo.shortbio}
              </Typography>
            )}
            {itemInfo.promotionPlan && (
              <Typography variant="body1" color="text.secondary">
                <b>Topics</b>: {itemInfo.topics}
              </Typography>
            )}
            {itemInfo.promotionPlan && (
              <Typography variant="body1" color="text.secondary">
                <b>Audience</b>
                <br />
                {itemInfo.audience}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
