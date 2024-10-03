import { useCallback, useEffect, useState } from 'react';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import { Button, ButtonGroup, InputAdornment, MenuItem, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useAppDispatch } from '../../../../redux/hooks';
import { contactCategories } from '../../../../constants';
import type { Dayjs } from 'dayjs';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { getGenres, getLanguages } from '../../../../redux/searchParameters';
import { ISelectInputOption } from '../../../../types';
import { MultiSelectInput } from '../../../../common';
import styles from '../../ContactSearches.module.css';

export interface IFilterPodcastsSearchsOptions {
  mainCategory: ISelectInputOption;
  keywords: string;
  genres: ISelectInputOption[];
  language: ISelectInputOption;
  publishedBefore: Dayjs | null;
  publishedAfter: Dayjs | null;
}

interface IProps {
  handleProcessFiltering: (filters: IFilterPodcastsSearchsOptions) => void;
}

export function PodcastsSearchFiltering({ handleProcessFiltering }: IProps) {
  const dispatch = useAppDispatch();

  const [filtersEvaluated, setFiltersEvaluated] = useState(true);
  const [displayingMoreFilters, setDisplayingMoreFilter] = useState(false);
  const [genresList, setGenresList] = useState<ISelectInputOption[]>([]);
  const [languagesList, setLanguagesList] = useState<ISelectInputOption[]>([]);
  const [filterOptions, setFilerOptions] = useState<IFilterPodcastsSearchsOptions>({
    mainCategory: { label: 'Podcasts', value: contactCategories.podcast },
    keywords: '',
    genres: [{ label: 'All genres', value: 'all' }],
    language: { label: 'Any language', value: 'Any language' },
    publishedBefore: null,
    publishedAfter: null,
  });

  const fetchParameters = useCallback(async () => {
    const genresResponse = await dispatch(getGenres()).unwrap();
    const languagesResponse = await dispatch(getLanguages()).unwrap();

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

    if (languagesResponse?.length) {
      setLanguagesList(languagesResponse);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchParameters();
  }, [fetchParameters]);

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

  const handleLanguagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueSelected = languagesList.find((language) => language.value === event.target.value);

    if (valueSelected) {
      setFilerOptions((prev) => {
        return {
          ...prev,
          language: valueSelected,
        };
      });
    }

    setFiltersEvaluated(false);
  };

  const handleDateFiltersChange = (newValue: Dayjs | null, fieldName: string) => {
    setFilerOptions((prev) => {
      return {
        ...prev,
        [fieldName]: newValue,
      };
    });

    setFiltersEvaluated(false);
  };

  const handleFiltersMainCategoryChange = (selected: ISelectInputOption) => {
    setFilerOptions((prev) => {
      return {
        ...prev,
        mainCategory: selected,
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

  return (
    <div className={styles.filtersWrapper}>
      <ButtonGroup variant="text" sx={{ border: '1px solid #f1f2f3' }}>
        <Button
          onClick={() =>
            handleFiltersMainCategoryChange({
              label: 'Podcasts',
              value: contactCategories.podcast,
            })
          }
          sx={(theme) => ({
            backgroundColor:
              filterOptions.mainCategory?.value === contactCategories.podcast
                ? theme.palette.text.secondary
                : 'auto',
            color:
              filterOptions.mainCategory?.value === contactCategories.podcast
                ? theme.palette.text.primaryInverted
                : theme.palette.text.primary,
            fontWeight: 'bold',
            padding: '0 1rem',
            ':hover': {
              backgroundColor:
                filterOptions.mainCategory?.value === contactCategories.podcast
                  ? theme.palette.text.secondary
                  : 'auto',
            },
          })}
          size="small"
        >
          Podcasts
        </Button>
        <Button
          onClick={() =>
            handleFiltersMainCategoryChange({
              label: 'Episodes',
              value: contactCategories.podcastEpisode,
            })
          }
          sx={(theme) => ({
            backgroundColor:
              filterOptions.mainCategory?.value === contactCategories.podcastEpisode
                ? theme.palette.text.secondary
                : 'auto',
            color:
              filterOptions.mainCategory?.value === contactCategories.podcastEpisode
                ? theme.palette.text.primaryInverted
                : theme.palette.text.primary,
            fontWeight: 'bold',
            padding: '0 1rem',
            ':hover': {
              backgroundColor:
                filterOptions.mainCategory?.value === contactCategories.podcastEpisode
                  ? theme.palette.text.secondary
                  : 'auto',
            },
          })}
          size="small"
        >
          Episodes
        </Button>
      </ButtonGroup>
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
                  {!!languagesList?.length && (
                    <TextField
                      name="language"
                      label="Language"
                      value={filterOptions.language.value}
                      onChange={handleLanguagesChange}
                      className={styles.filterInputSelectWrapper}
                      fullWidth
                      select
                    >
                      {languagesList.map((language, index) => {
                        return (
                          <MenuItem key={index} value={language.label}>
                            {language.value}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  )}
                </div>
                <div className={styles.filterInputSelectWrapper}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label="Published before"
                      value={filterOptions.publishedBefore}
                      onChange={(newValue) => handleDateFiltersChange(newValue, 'publishedBefore')}
                    />
                  </DemoContainer>
                </div>
                <div className={styles.filterInputSelectWrapper}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label="Published after"
                      value={filterOptions.publishedAfter}
                      onChange={(newValue) => handleDateFiltersChange(newValue, 'publishedAfter')}
                    />
                  </DemoContainer>
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
