import { useCallback, useEffect, useState } from 'react';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import { Button, InputAdornment, MenuItem, TextField } from '@mui/material';
import { useAppDispatch } from '../../../../redux/hooks';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { getCities, getStates } from '../../../../redux/searchParameters';
import { ISelectInputOption } from '../../../../types';
import styles from '../../ContactSearches.module.css';

export interface IFilterEventsSearchsOptions {
  keywords: string;
  state: ISelectInputOption;
  city: ISelectInputOption;
}

interface IProps {
  handleProcessFiltering: (filters: IFilterEventsSearchsOptions) => void;
}

export function EventsSearchFiltering({ handleProcessFiltering }: IProps) {
  const dispatch = useAppDispatch();

  const [filtersEvaluated, setFiltersEvaluated] = useState(true);
  const [displayingMoreFilters, setDisplayingMoreFilter] = useState(false);
  const [statesList, setStatesList] = useState<ISelectInputOption[]>([]);
  const [citiesList, setCitiesList] = useState<ISelectInputOption[]>([]);
  const [filterOptions, setFilerOptions] = useState<IFilterEventsSearchsOptions>({
    keywords: '',
    state: { label: 'All states', value: 'all' },
    city: { label: 'All cities', value: 'all' },
  });

  const fetchStates = useCallback(async () => {
    const statesResponse = await dispatch(getStates('231')).unwrap(); // Fixed countryRefId for United states.

    if (statesResponse?.length) {
      // Transform response so that we don't use the abbreviated name of
      // the city as a value. Instead, the entire string which is the label of the object
      // const transformedData = statesResponse.map((stateObj: ISelectInputOption) => {
      //   const { _id, label, refId } = stateObj;
      //   return {
      //     _id: _id,
      //     label: label,
      //     value: label,
      //     refId: refId,
      //   };
      // });
      setStatesList(statesResponse);
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
