import { Checkbox, Typography } from '@mui/material';
import podcastDefaultImage from '../../../../assets/images/podcast-default-image.png';
import numeral from 'numeral';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { IEventResult } from '../EventsSearch';
import defautlContactImage from '../../../../assets/logos/pitchdb-logo-short.png';
import styles from '../../ContactSearches.module.css';
import { formatExternalLinkCorrently } from '../../../../utils';

interface IProps {
  selectedItems: IEventResult[];
  itemInfo: IEventResult;
  handleItemSelection: (item: IEventResult) => void;
}

export function EventItem({ selectedItems, itemInfo, handleItemSelection }: IProps) {
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
            {itemInfo.dataFileType === 1 ? itemInfo.schoolName : itemInfo.organization}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb="1rem">
            {itemInfo.firstName} {itemInfo.lastName} | {itemInfo.position}
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
                {`${itemInfo.dataFileType === 2 ? itemInfo.country + ' - ' : ''} ${
                  itemInfo.city
                }, ${itemInfo.state}`}
              </Typography>
            </div>
          )}
          {itemInfo.budget && (
            <div className={styles.detailFieldWithIcon}>
              <AccountBalanceWalletIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                ${numeral(itemInfo.budget).format('0, 0')}
              </Typography>
            </div>
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
