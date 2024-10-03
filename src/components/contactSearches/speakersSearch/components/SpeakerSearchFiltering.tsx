import { useCallback, useEffect, useState } from 'react';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useAppDispatch } from '../../../../redux/hooks';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { getGenres } from '../../../../redux/searchParameters';
import { ISelectInputOption } from '../../../../types';
import { MultiSelectInput } from '../../../../common';
import { speakerOpportunities } from '../../../../constants';
import styles from '../../ContactSearches.module.css';

export interface IFilterExpertSearchsOptions {
  keywords: string;
  genres: ISelectInputOption[];
  opportunities: ISelectInputOption[];
}

interface IProps {
  handleProcessFiltering: (filters: IFilterExpertSearchsOptions) => void;
}

export function SpeakerSearchFiltering({ handleProcessFiltering }: IProps) {
  const dispatch = useAppDispatch();

  const [filtersEvaluated, setFiltersEvaluated] = useState(true);
  const [displayingMoreFilters, setDisplayingMoreFilter] = useState(false);
  const [genresList, setGenresList] = useState<ISelectInputOption[]>([]);
  const [filterOptions, setFilerOptions] = useState<IFilterExpertSearchsOptions>({
    keywords: '',
    genres: [{ label: 'All genres', value: 'all' }],
    opportunities: [{ label: 'All opportunities', value: 'all' }],
  });

  const fetchGenres = useCallback(async () => {
    const genresResponse = await dispatch(getGenres()).unwrap();

    if (genresResponse?.length) {
      const transformedGenres: ISelectInputOption[] = [];

      genresResponse.map((genre: ISelectInputOption) => {
        transformedGenres.push({
          _id: genre._id,
          label: genre.label,
          value: genre.value.toString(),
          refId: genre.refId,
        });
      });

      setGenresList(transformedGenres);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleFiltersChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const handleGenresChange = (genres: ISelectInputOption[]) => {
    setFilerOptions((prev) => {
      return {
        ...prev,
        genres,
      };
    });

    setFiltersEvaluated(false);
  };

  const handleOpportunitiesChange = (opportunities: ISelectInputOption[]) => {
    setFilerOptions((prev) => {
      return {
        ...prev,
        opportunities,
      };
    });

    setFiltersEvaluated(false);
  };

  return (
    <div className={styles.filtersWrapper}>
      <div className={styles.filtersAndButtonWrapper}>
        <div className={styles.regularFiltersWrapper}>
          <Button
            variant="text"
            color="primary"
            size="small"
            endIcon={
              displayingMoreFilters ? (
                <ArrowDropUpIcon fontSize="small" />
              ) : (
                <ArrowDropDownIcon fontSize="small" />
              )
            }
            onClick={() => setDisplayingMoreFilter((prev) => !prev)}
          >
            {displayingMoreFilters ? 'Less filters' : 'More filters'}
          </Button>
          <div
            className={styles.selectWrappers}
            style={{ marginTop: displayingMoreFilters ? '1rem' : '' }}
          >
            {displayingMoreFilters && (
              <>
                <div
                  className={styles.multiSelectInputWrapper}
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    justifyContent: 'center',
                  }}
                >
                  {!!genresList?.length && (
                    <MultiSelectInput
                      inputLabel="Genres"
                      options={genresList}
                      selectedOptions={filterOptions.genres}
                      handleChange={handleGenresChange}
                    />
                  )}
                  <MultiSelectInput
                    inputLabel="Opportunities"
                    options={speakerOpportunities}
                    selectedOptions={filterOptions.opportunities}
                    handleChange={handleOpportunitiesChange}
                  />
                </div>
              </>
            )}
          </div>
          <TextField
            type="text"
            label="Keyword search"
            name="keywords"
            value={filterOptions.keywords}
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
    </div>
  );
}
