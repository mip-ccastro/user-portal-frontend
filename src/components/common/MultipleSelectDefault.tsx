import { type Theme, useTheme } from '@mui/material/styles';
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { type SelectChangeEvent } from '@mui/material/Select';

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

export type MultipleSelectProps = {
  onChange: (value: Array<string>) => void
  value: string[]
  label: string
  options: Array<{ label: string, value: string }>
}

const getStyles = (name: string, value: string[], theme: Theme) => {
  return {
    fontWeight: value.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelect({
  onChange,
  value,
  label,
  options = []
}: MultipleSelectProps) {
  const theme = useTheme();
  
  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    const {
      target: { value: val },
    } = event;
    onChange(val as string[]);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="multiple-name-label">{label}</InputLabel>
        <Select
          labelId="multiple-name-label"
          id="multiple-name"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {options?.map(({ label, value: val }) => (
            <MenuItem
              key={label}
              value={val}
              style={getStyles(label, value, theme)}
            >
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
