import numeral from 'numeral';
import { Button, Checkbox, IconButton, Tooltip, Typography } from '@mui/material';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import styles from '../ContactSearches.module.css';

interface IProps {
  children: React.ReactElement;
  itemsTypeLabel: string;
  totalItems: number;
  selectedItemsTotal: number;
  totalResultsInDB: number;
  loadingView: 'loadMore' | 'pagination';
  allItemsAreSelected: boolean;
  handleOpenAddContactsModal: () => void;
  handleToggleLoadingView: (view: 'loadMore' | 'pagination') => void;
  handleToggleSelectAll: () => void;
}

export function SearchResultsWrapper({
  children,
  itemsTypeLabel,
  totalItems,
  selectedItemsTotal,
  totalResultsInDB,
  loadingView,
  allItemsAreSelected,
  handleOpenAddContactsModal,
  handleToggleLoadingView,
  handleToggleSelectAll,
}: IProps) {
  return (
    <div className={styles.searchResultsWrapper}>
      <div className={styles.resultsHeaderCorrector}>
        <div className={styles.searchResultsHeader}>
          <div className={styles.addToContactsWrapper}>
            <div className={styles.selectionControlWrapper}>
              <Checkbox
                name="all-selection"
                onClick={handleToggleSelectAll}
                checked={allItemsAreSelected}
                color="primary"
              />
              <Typography
                variant="body2"
                color="text.secondary"
              >{`${selectedItemsTotal} selected`}</Typography>
            </div>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={handleOpenAddContactsModal}
              disabled={selectedItemsTotal === 0}
            >
              Add to contacts
            </Button>
          </div>
          <Typography variant="body1" color="text.secondary" fontWeight="bold">
            {numeral(totalResultsInDB).format('0,0')} of {numeral(totalItems).format('0,0')}{' '}
            {itemsTypeLabel}s
          </Typography>
          <div className={styles.loadingResultsOptions}>
            <IconButton
              disabled={loadingView === 'loadMore'}
              onClick={() => handleToggleLoadingView('loadMore')}
              color="primary"
              size="small"
            >
              <Tooltip title="Infinite view" placement="left">
                <ViewStreamIcon fontSize="inherit" />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={loadingView === 'pagination'}
              onClick={() => handleToggleLoadingView('pagination')}
              color="primary"
              size="small"
            >
              <Tooltip title="Pagination view" placement="left">
                <ViewWeekIcon fontSize="inherit" />
              </Tooltip>
            </IconButton>
          </div>
        </div>
      </div>
      <div className={styles.searchResultsBody}>{children}</div>
    </div>
  );
}
