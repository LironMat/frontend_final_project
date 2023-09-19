import './AddItemForm.css';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { DB, IDB } from '../idbModule';
import { format } from 'date-fns';

export default function AddItemForm() {
  const currentYearMonthString = format(new Date(), 'yyyy-MM');

  const [sumInput, setSumInput] = useState(0);
  const [categoryInput, setCategoryInput] = useState(DB.costCategories[0]);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [yearMonthValue, setYearMonthValue] = useState(currentYearMonthString);

  async function handleAddItem() {
    const db = await IDB.openCostsDB('costsdb', 1);

    const [year, month] = (yearMonthValue || currentYearMonthString)
      .split('-')
      .map((split) => parseInt(split));

    const result = await db
      .addCost({
        sum: sumInput ? sumInput : 0,
        category: categoryInput,
        description: descriptionInput,
        month: month,
        year: year,
      })
      .catch((e) => {
        console.error(e);

        return false;
      });

    if (result) {
      alert('item added successfully');
    } else {
      alert('error adding item');
    }
  }

  function handleSumChange(e) {
    const parsed = parseInt(e.target.value);
    setSumInput(isNaN(parsed) ? '' : parsed);
  }

  function handleDescriptionChange(e) {
    setDescriptionInput(e.target.value);
  }

  function handleCategoryChange(e) {
    setCategoryInput(e.target.value);
  }

  function handleYearMonthChange(e) {
    setYearMonthValue(e.target.value);
  }

  return (
    <div className="add-item-container">
      <FormControl margin="normal">
        <TextField value={sumInput} onChange={handleSumChange} label="Sum" type="number" />
      </FormControl>

      <FormControl margin="normal">
        <TextField
          value={descriptionInput}
          onChange={handleDescriptionChange}
          label="Details"
          multiline
          rows={4}
        />
      </FormControl>

      <FormControl margin="normal">
        <InputLabel id="category-select-component">Category</InputLabel>
        <Select
          labelId="category-select-component"
          value={categoryInput}
          onChange={handleCategoryChange}
          input={<OutlinedInput label="Category" />}
        >
          {DB.costCategories.map((categoryName) => (
            <MenuItem key={categoryName} value={categoryName}>
              {categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl margin="normal">
        <TextField
          value={yearMonthValue}
          onChange={handleYearMonthChange}
          label="Year & Month"
          type="month"
        />
      </FormControl>

      <Button onClick={() => handleAddItem()} size="small" variant="contained">
        Add Item
      </Button>
    </div>
  );
}
