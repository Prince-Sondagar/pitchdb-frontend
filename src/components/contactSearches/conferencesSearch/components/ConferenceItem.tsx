import { Checkbox, Typography } from '@mui/material';
import podcastDefaultImage from '../../../../assets/images/podcast-default-image.png';
import DateRangeIcon from '@mui/icons-material/DateRange';
import defautlContactImage from '../../../../assets/logos/pitchdb-logo-short.png';
import styles from '../../ContactSearches.module.css';
import { formatDate } from '../../../../utils';
import { IConferenceResult } from '../ConferencesSearch';

interface IProps {
  selectedItems: IConferenceResult[];
  itemInfo: IConferenceResult;
  handleItemSelection: (item: IConferenceResult) => void;
}

export function ConferenceItem({ selectedItems, itemInfo, handleItemSelection }: IProps) {
  const itemIsSelected = () => {
    const found = selectedItems.find((item) => item._id === itemInfo._id);

    return !!found;
  };

  const getImage = () => {
    if (itemInfo.enrichment?.logo) {
      return itemInfo.enrichment.logo;
    } else {
      return defautlContactImage;
    }
  };

  return (
    <div className={`${styles.searchItem} ${itemIsSelected() ? styles.itemSelected : ''}`}>
      <div className={styles.checkBoxWrapper}>
        <Checkbox onClick={() => handleItemSelection(itemInfo)} checked={itemIsSelected()} />
      </div>
      <div className={styles.itemImageWrapper}>
        <img
          src={getImage()}
          onError={(e: any) => (e.src = podcastDefaultImage)}
          alt="Contact profile"
          width="100%"
          height="100%"
        />
      </div>
      <div className={styles.descriptionAndSeeMore}>
        <div>
          <Typography variant="body1" color="text.secondary" fontWeight="bold">
            {itemInfo.eventName}
          </Typography>
          {itemInfo.date && (
            <div className={styles.detailFieldWithIcon}>
              <DateRangeIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(itemInfo.date)}
              </Typography>
            </div>
          )}
          <Typography variant="body2" color="text.secondary" mb="1rem">
            {itemInfo.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {itemInfo.eventDescription}
          </Typography>

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
      </div>
    </div>
  );
}
