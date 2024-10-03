import { useState } from 'react';
import { Box, Select, SelectChangeEvent } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import { useAppSelector } from '../../../../../redux/hooks';
import { searchParametersSelectors } from '../../../../../redux/searchParameters';
import { profileSelectors } from '../../../../../redux/profile';
import { Genre } from '../../../../../types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface IMultiSelector {
  handleSetProfileData: (name: string, value: string | Genre[]) => void;
}

export const MultiSelector: React.FC<IMultiSelector> = ({ handleSetProfileData }) => {
  const genres = useAppSelector(searchParametersSelectors.genres);
  const profileData = useAppSelector(profileSelectors.profileData);

  const [selectedGenres, setSelectedGenres] = useState<string[] | null>(
    profileData?.searchGenres?.map((genre) => genre._id) || [],
  );

  const handleChange = (event: SelectChangeEvent<string[] | null>) => {
    const selectedValues = event.target.value;

    if (selectedValues) {
      let selected: string[];
      if (typeof selectedValues == 'string') {
        selected = [selectedValues];
      } else {
        selected = selectedValues;
      }

      setSelectedGenres(selected);

      // Map the selected genre IDs to the corresponding genre objects
      const selectedGenres: Genre[] = [];
      if (genres?.length) {
        genres.map((genre) => {
          selected.map((selectedId) => {
            if (genre._id === selectedId) {
              selectedGenres.push(genre);
            }
          });
        });
      }

      handleSetProfileData('searchGenres', selectedGenres);
    }
  };

  const handleDelete = (genreId: string) => {
    let selected: string[];

    if (selectedGenres) {
      selected = selectedGenres.filter((id) => id !== genreId);
      setSelectedGenres(selected);
    }

    const newSelectedGenres: Genre[] = [];
    if (genres?.length) {
      genres.map((genre) => {
        selected.map((selectedId) => {
          if (genre._id === selectedId) {
            newSelectedGenres.push(genre);
          }
        });
      });

      handleSetProfileData('searchGenres', newSelectedGenres);
    }
  };

  return (
    <FormControl>
      <InputLabel>Categories</InputLabel>
      <Select
        multiple
        value={selectedGenres}
        onChange={handleChange}
        input={<OutlinedInput label="Categories" />}
        MenuProps={MenuProps}
        renderValue={() => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedGenres?.map((genreId) => (
              <Chip
                key={genreId}
                label={genres?.find((genre) => genre._id === genreId)?.label}
                onDelete={() => handleDelete(genreId)}
                onMouseDown={(event) => event.stopPropagation()}
              />
            ))}
          </Box>
        )}
      >
        {!!genres?.length &&
          genres.map((genre) => (
            <MenuItem key={genre._id} value={genre._id}>
              {genre.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};
