import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Box, Select, SelectChangeEvent } from '@mui/material';
import { ISelectInputOption } from '../types';

interface IProps {
  inputLabel: string;
  options: ISelectInputOption[];
  selectedOptions: ISelectInputOption[];
  handleChange: (options: ISelectInputOption[]) => void;
}

export const MultiSelectInput: React.FC<IProps> = ({
  inputLabel,
  options,
  selectedOptions,
  handleChange,
}) => {
  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 500,
        width: 250,
      },
    },
  };

  const handleInputChange = (event: SelectChangeEvent<string[] | null>) => {
    const values = event.target.value;

    if (values) {
      let selectedValues: string[];
      if (typeof values == 'string' || typeof values == 'number') {
        selectedValues = [values];
      } else {
        selectedValues = values;
      }

      // Convert string to proper IOption
      const selectedOptions: ISelectInputOption[] = [];

      if (options.length) {
        options.map((option) => {
          selectedValues.map((selected) => {
            if (option.value === selected) {
              selectedOptions.push(option);
            }
          });
        });
      }

      handleChange(selectedOptions);
    }
  };

  const handleDelete = (erasingItemValue: string) => {
    const newSelectedOnesAfterDelete = selectedOptions.filter(
      (option) => option.value !== erasingItemValue,
    );

    handleChange(newSelectedOnesAfterDelete);
  };

  return (
    <FormControl>
      <InputLabel>{inputLabel}</InputLabel>
      <Select
        multiple
        value={selectedOptions.map((option) => option.value)}
        onChange={handleInputChange}
        input={<OutlinedInput label={inputLabel} sx={{ width: '100%' }} />}
        MenuProps={menuProps}
        renderValue={() => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedOptions.map((option, index) => (
              <Chip
                key={index}
                label={option.label}
                onDelete={() => handleDelete(option.value)}
                onMouseDown={(event) => event.stopPropagation()}
              />
            ))}
          </Box>
        )}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
