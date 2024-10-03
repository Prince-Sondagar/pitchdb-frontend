import { useCallback, useEffect, useState } from 'react';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import { Button, ButtonGroup, InputAdornment, MenuItem, TextField } from '@mui/material';
import { useAppDispatch } from '../../../../redux/hooks';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { getCities, getStates } from '../../../../redux/searchParameters';
import { ISelectInputOption } from '../../../../types';
import styles from '../../ContactSearches.module.css';
import {
  magazinePositions,
  mainCategoriesForMediaOutlets,
  mediaOutletCategories,
} from '../../../../constants';
import { formatToTitleCase } from '../../../../utils';

export interface IFilterMediaOutletsSearchsOptions {
  type: ISelectInputOption;
  position?: ISelectInputOption;
  keywords: string;
  state: ISelectInputOption;
  city: ISelectInputOption;
}

interface IProps {
  handleProcessFiltering: (filters: IFilterMediaOutletsSearchsOptions) => void;
}

export function MediaOutletsSearchFiltering({ handleProcessFiltering }: IProps) {
  const dispatch = useAppDispatch();

  const [filtersEvaluated, setFiltersEvaluated] = useState(true);
  const [displayingMoreFilters, setDisplayingMoreFilter] = useState(false);
  const [statesList, setStatesList] = useState<ISelectInputOption[]>([]);
  const [citiesList, setCitiesList] = useState<ISelectInputOption[]>([]);
  const [filterOptions, setFilerOptions] = useState<IFilterMediaOutletsSearchsOptions>({
    type: { label: 'Magazines', value: mediaOutletCategories.magazine },
    position: {
      label: formatToTitleCase(magazinePositions.editor),
      value: magazinePositions.editor,
    },
    keywords: '',
    state: { label: 'All states', value: 'all' },
    city: { label: 'All cities', value: 'all' },
  });

  const fetchStates = useCallback(async () => {
    const statesResponse = await dispatch(getStates('231')).unwrap(); // Fixed countryRefId for United states.

    if (statesResponse?.length) {
      // Transform response so that we don't use the abbreviated name of
      // the city as a value. Instead, the entire string which is the label of the object
      const transformedData = statesResponse.map((stateObj: ISelectInputOption) => {
        const { _id, label, refId } = stateObj;
        return {
          _id: _id,
          label: label,
          value: label,
          refId: refId,
        };
      });
      setStatesList(transformedData);
    }
  }, [dispatch]);

  const fetchCities = useCallback(
    async (selectedCityRefId: string) => {
      const citiesResponse = await dispatch(getCities(selectedCityRefId)).unwrap();

      if (citiesResponse?.length) {
        setCitiesList(citiesResponse);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

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

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const stateSelected = statesList.find((state) => state.value === event.target.value);

    if (stateSelected?.refId) {
      fetchCities(stateSelected.refId);

      setFilerOptions((prev) => {
        return {
          ...prev,
          state: stateSelected,
        };
      });
    } else {
      setCitiesList([]);
    }

    setFiltersEvaluated(false);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const citySelected = citiesList.find((city) => city.value === event.target.value);

    setFilerOptions((prev) => {
      return {
        ...prev,
        city: citySelected ?? { label: 'All cities', value: 'all' },
      };
    });
    setFiltersEvaluated(false);
  };

  const handleFiltersTypeChange = (selected: ISelectInputOption) => {
    setFilerOptions((prev) => {
      return {
        ...prev,
        type: selected,
      };
    });

    setFiltersEvaluated(false);
  };

  const handleFiltersPositionChange = (selected: ISelectInputOption) => {
    setFilerOptions((prev) => {
      return {
        ...prev,
        position: selected,
      };
    });

    setFiltersEvaluated(false);
  };

  const isMagazine = filterOptions.type.value === mediaOutletCategories.magazine;

  return (
    <div className={styles.filtersWrapper}>
      <ButtonGroup variant="text" className={styles.mainCategoriesWrapper}>
        <Button
          onClick={() => handleFiltersTypeChange(mainCategoriesForMediaOutlets.magazine)}
          sx={(theme) => ({
            backgroundColor:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.magazine.value
                ? theme.palette.text.secondary
                : 'auto',
            color:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.magazine.value
                ? theme.palette.text.primaryInverted
                : theme.palette.text.primary,
            fontWeight: 'bold',
            padding: '0 1rem',
            ':hover': {
              backgroundColor:
                filterOptions.type?.value === mainCategoriesForMediaOutlets.magazine.value
                  ? theme.palette.text.secondary
                  : 'auto',
            },
          })}
          size="small"
        >
          {formatToTitleCase(mainCategoriesForMediaOutlets.magazine.label)}
        </Button>
        <Button
          onClick={() => handleFiltersTypeChange(mainCategoriesForMediaOutlets.newspaper)}
          sx={(theme) => ({
            backgroundColor:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.newspaper.value
                ? theme.palette.text.secondary
                : 'auto',
            color:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.newspaper.value
                ? theme.palette.text.primaryInverted
                : theme.palette.text.primary,
            fontWeight: 'bold',
            padding: '0 1rem',
            ':hover': {
              backgroundColor:
                filterOptions.type?.value === mainCategoriesForMediaOutlets.newspaper.value
                  ? theme.palette.text.secondary
                  : 'auto',
            },
          })}
          size="small"
        >
          {formatToTitleCase(mainCategoriesForMediaOutlets.newspaper.label)}
        </Button>
        <Button
          onClick={() => handleFiltersTypeChange(mainCategoriesForMediaOutlets.radio)}
          sx={(theme) => ({
            backgroundColor:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.radio.value
                ? theme.palette.text.secondary
                : 'auto',
            color:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.radio.value
                ? theme.palette.text.primaryInverted
                : theme.palette.text.primary,
            fontWeight: 'bold',
            padding: '0 1rem',
            ':hover': {
              backgroundColor:
                filterOptions.type?.value === mainCategoriesForMediaOutlets.radio.value
                  ? theme.palette.text.secondary
                  : 'auto',
            },
          })}
          size="small"
        >
          {formatToTitleCase(mainCategoriesForMediaOutlets.radio.label)}
        </Button>
        <Button
          onClick={() => handleFiltersTypeChange(mainCategoriesForMediaOutlets.tvstation)}
          sx={(theme) => ({
            backgroundColor:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.tvstation.value
                ? theme.palette.text.secondary
                : 'auto',
            color:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.tvstation.value
                ? theme.palette.text.primaryInverted
                : theme.palette.text.primary,
            fontWeight: 'bold',
            padding: '0 1rem',
            ':hover': {
              backgroundColor:
                filterOptions.type?.value === mainCategoriesForMediaOutlets.tvstation.value
                  ? theme.palette.text.secondary
                  : 'auto',
            },
          })}
          size="small"
        >
          {formatToTitleCase(mainCategoriesForMediaOutlets.tvstation.label)}
        </Button>
        <Button
          onClick={() => handleFiltersTypeChange(mainCategoriesForMediaOutlets.blog)}
          sx={(theme) => ({
            backgroundColor:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.blog.value
                ? theme.palette.text.secondary
                : 'auto',
            color:
              filterOptions.type?.value === mainCategoriesForMediaOutlets.blog.value
                ? theme.palette.text.primaryInverted
                : theme.palette.text.primary,
            fontWeight: 'bold',
            padding: '0 1rem',
            ':hover': {
              backgroundColor:
                filterOptions.type?.value === mainCategoriesForMediaOutlets.blog.value
                  ? theme.palette.text.secondary
                  : 'auto',
            },
          })}
          size="small"
        >
          {formatToTitleCase(mainCategoriesForMediaOutlets.blog.label)}
        </Button>
      </ButtonGroup>
      {isMagazine && (
        <ButtonGroup variant="text" sx={{ border: '1px solid #f1f2f3' }}>
          <Button
            onClick={() =>
              handleFiltersPositionChange({
                label: formatToTitleCase(magazinePositions.editor),
                value: magazinePositions.editor,
              })
            }
            sx={(theme) => ({
              backgroundColor:
                filterOptions.position?.value === magazinePositions.editor
                  ? theme.palette.text.secondary
                  : 'auto',
              color:
                filterOptions.position?.value === magazinePositions.editor
                  ? theme.palette.text.primaryInverted
                  : theme.palette.text.primary,
              fontWeight: 'bold',
              padding: '0 1rem',
              ':hover': {
                backgroundColor:
                  filterOptions.position?.value === magazinePositions.editor
                    ? theme.palette.text.secondary
                    : 'auto',
              },
            })}
            size="small"
          >
            {formatToTitleCase(magazinePositions.editor)}
          </Button>
          <Button
            onClick={() =>
              handleFiltersPositionChange({
                label: formatToTitleCase(magazinePositions.writer),
                value: magazinePositions.writer,
              })
            }
            sx={(theme) => ({
              backgroundColor:
                filterOptions.position?.value === magazinePositions.writer
                  ? theme.palette.text.secondary
                  : 'auto',
              color:
                filterOptions.position?.value === magazinePositions.writer
                  ? theme.palette.text.primaryInverted
                  : theme.palette.text.primary,
              fontWeight: 'bold',
              padding: '0 1rem',
              ':hover': {
                backgroundColor:
                  filterOptions.position?.value === magazinePositions.writer
                    ? theme.palette.text.secondary
                    : 'auto',
              },
            })}
            size="small"
          >
            {formatToTitleCase(magazinePositions.writer)}
          </Button>
        </ButtonGroup>
      )}
      <div className={styles.filtersAndButtonWrapper}>
        <div className={styles.regularFiltersWrapper}>
          {!isMagazine && (
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
          )}
          <div
            className={styles.selectWrappers}
            style={{ marginTop: displayingMoreFilters ? '1rem' : '' }}
          >
            {displayingMoreFilters && !isMagazine && (
              <>
                <TextField
                  id="state"
                  name="state"
                  label="State"
                  value={filterOptions.state.value}
                  onChange={handleStateChange}
                  select
                  className={styles.filterInputSelectWrapper}
                >
                  <MenuItem value="all">All states</MenuItem>
                  {statesList.map((state, index) => {
                    return (
                      <MenuItem key={index} value={state.value}>
                        {state.label}
                      </MenuItem>
                    );
                  })}
                </TextField>
                <TextField
                  id="city"
                  name="city"
                  label="City"
                  value={filterOptions.city.value}
                  onChange={handleCityChange}
                  select
                  className={styles.filterInputSelectWrapper}
                >
                  <MenuItem value="all">All cities</MenuItem>
                  {citiesList.map((city, index) => {
                    return (
                      <MenuItem key={index} value={city.value}>
                        {city.label}
                      </MenuItem>
                    );
                  })}
                </TextField>
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
