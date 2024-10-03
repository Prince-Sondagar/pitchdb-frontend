import { Checkbox, Typography } from '@mui/material';
import podcastDefaultImage from '../../../../assets/images/podcast-default-image.png';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import defaultContactImage from '../../../../assets/logos/pitchdb-logo-short.png';
import styles from '../../ContactSearches.module.css';
import { formatExternalLinkCorrently } from '../../../../utils';
import { IMediaOutletResult } from '../MediaOutletsSearch';

interface IProps {
  selectedItems: IMediaOutletResult[];
  itemInfo: IMediaOutletResult;
  handleItemSelection: (item: IMediaOutletResult) => void;
}

export function MediaOutletItem({ selectedItems, itemInfo, handleItemSelection }: IProps) {
  const itemIsSelected = () => {
    const found = selectedItems.find((item) => item._id === itemInfo._id);

    return !!found;
  };

  const getImage = () => {
    if (itemInfo.enrichment?.logo) {
      return itemInfo.enrichment.logo;
    } else {
      return defaultContactImage;
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
            {itemInfo.companyName}
          </Typography>
          {itemInfo.magazineGenre && (
            <Typography variant="body2" color="text.secondary">
              {itemInfo.magazineGenre}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" mb="1rem">
            {itemInfo.firstName} {itemInfo.lastName}{' '}
            {itemInfo.firstName || itemInfo.lastName ? '|' : ''}{' '}
            {itemInfo.position ? itemInfo.position : ''}
          </Typography>
          {itemInfo.website && (
            <div className={styles.itemWebsite}>
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
          {itemInfo.city && itemInfo.state && (
            <div className={styles.detailFieldWithIcon}>
              <LocationOnIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {`${itemInfo.city}, ${itemInfo.state}`}
              </Typography>
            </div>
          )}
          {itemInfo.description && (
            <Typography variant="body2" color="text.secondary">
              {itemInfo.description}
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
      </div>
    </div>
  );
}
