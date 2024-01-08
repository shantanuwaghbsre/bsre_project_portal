import { FormControl, InputLabel, Select, ListSubheader, TextField, InputAdornment, MenuItem, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SelectListWithText = ({
    searchResults, value, change, label
}
) => {
  return (
    <>
            <FormControl sx={{ m: 1, minWidth: 320 }}>
            <InputLabel id="search-select-label">{label}</InputLabel>
        <Select
          // Disables auto focus on MenuItems and allows TextField to be in focus
          MenuProps={{ autoFocus: false }}
          label={label}
          id="search-select"
          value={value}
          onChange={(e) => change("from_quotation", e.target.value)}
          // This prevents rendering empty string in Select's value
          // if search text would exclude currently selected option.
          renderValue={() => value}
        >
          {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
          <ListSubheader>
            <TextField
              size="small"
              // Autofocus on textfield
              autoFocus
              placeholder="Type to search..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={(e) => change("from_quotation", e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
            />
          </ListSubheader>
          {searchResults.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        </>
  )
}

export default SelectListWithText