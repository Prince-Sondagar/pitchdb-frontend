import { useState } from 'react';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import { Button, InputAdornment, MenuItem, SelectChangeEvent, TextField } from '@mui/material';
import { useAppSelector } from '../../../redux/hooks';
import { contactListSelectors } from '../../../redux/contactList';
import styles from '../Contacts.module.css';
import { contactCategories } from '../../../constants';

export interface IFilterContactsOptions {
  category: string;
  pitchState: string;
  contactList: string;
  keyword: string;
}

interface IProps {
  handleProcessFiltering: (filters: IFilterContactsOptions) => void;
}

export function ContactsFiltering({ handleProcessFiltering }: IProps) {
  const userLists = useAppSelector(contactListSelectors.contactLists);

  const [filtersEvaluated, setFiltersEvaluated] = useState(true);
  const [filterOptions, setFilerOptions] = useState<IFilterContactsOptions>({
    category: 'all',
    pitchState: 'all',
    contactList: 'all',
    keyword: '',
  });

  const handleFiltersChange = (
    event: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFilerOptions((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    setFiltersEvaluated(false);
  };

  return (
    <div className={styles.filtersWrapper}>
      <div>
        <div className={styles.selectWrappers}>
          <TextField
            name="category"
            label="Category"
            value={filterOptions.category}
            onChange={handleFiltersChange}
            select
            className={styles.filterInputSelectWrapper}
          >
            <MenuItem value="all">All categories</MenuItem>
            <MenuItem value={contactCategories.podcast}>Podcasts</MenuItem>
            <MenuItem value={contactCategories.eventOrganization}>Local associations</MenuItem>
            <MenuItem value={contactCategories.speaker}>Speakers</MenuItem>
            <MenuItem value={contactCategories.mediaOutlet}>Media outlets</MenuItem>
            <MenuItem value={contactCategories.conference}>Conferences</MenuItem>
          </TextField>
          {!!userLists.length && (
            <TextField
              name="contactList"
              label="Contact list"
              value={filterOptions.contactList}
              onChange={handleFiltersChange}
              select
              className={styles.filterInputSelectWrapper}
            >
              <MenuItem value="all">All lists</MenuItem>
              {userLists.map((list, index) => {
                return (
                  <MenuItem key={index} value={list._id}>
                    {list.name}
                  </MenuItem>
                );
              })}
            </TextField>
          )}
          <TextField
            name="pitchState"
            label="Pitch State"
            value={filterOptions.pitchState}
            onChange={handleFiltersChange}
            select
            className={styles.filterInputSelectWrapper}
          >
            <MenuItem value="all">All states</MenuItem>
            <MenuItem value="pitched">Pitched</MenuItem>
            <MenuItem value="new">New</MenuItem>
          </TextField>
        </div>
        <TextField
          type="text"
          label="Keyword search"
          name="keyword"
          value={filterOptions.keyword}
          onChange={handleFiltersChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SavedSearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleProcessFiltering(filterOptions);
          setFiltersEvaluated(true);
        }}
        disabled={filtersEvaluated}
      >
        Filter
      </Button>
    </div>
  );
}
