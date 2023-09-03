import './AddItemForm.css';
import {useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { IDB } from '../idbModule';

const categories = ['FOOD', 'HEALTH', 'EDUCATION', 'TRAVEL', 'HOUSING', 'OTHER'];

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




export default function AddItemForm() {

    const[sumInput,setSumInput] = useState(0);
    const[categoryInput,setCategoryInput] = useState("FOOD");
    const[descriptionInput,setDescriptionInput] = useState(" ");
    const[monthInput,setMonthInput] = useState(undefined);
    const[yearInput,setYearInput] = useState(undefined);
    const[yearMonthValue,setYearMonthValue] = useState("2023-09");

    async function handleAddItem() {
        /**
         * @type {DB}
         */

        const db = await IDB.openCostsDB('costsdb', 1);

        const result = await db.addCost({
            sum: sumInput,
            category: categoryInput,
            description: descriptionInput,
            month: monthInput,
            year: yearInput
        });

        if(result) {
            alert("item added successfully");
        }
        else {
            alert("error adding item");
        }

    }

    function handleSumChange(e) {
        setSumInput(parseInt(e.target.value));
    }

    function handleDescriptionChange(e) {
        setDescriptionInput(e.target.value);
    }

    function handleCategoryChange(e) {
        setCategoryInput(e.target.value);
    }

    function handleYearMonthChange(e) {
        let yearMonthList = (e.target.value).split("-");
        setYearInput(parseInt(yearMonthList[0]));
        setMonthInput(parseInt(yearMonthList[1]));
        setYearMonthValue(e.target.value);
    }

  return(<div>
      <br/>
      <FormControl normal>
          <TextField
              value={sumInput}
              onChange={handleSumChange}
              id="outlined-sum"
              label="Sum"
              type="number"
              InputLabelProps={{
                  shrink: true,
              }}
          />
          <br/>
          <TextField
              value={descriptionInput}
              onChange={handleDescriptionChange}
              id="outlined-multiline-static"
              label="Details"
              multiline
              rows={4}
              defaultValue=""
          />
          <br/>
      <FormControl normal>
      <InputLabel id="category-select-component">Category</InputLabel>
      <Select
          labelId="category-select-component"
          id="category-select-component"
          value={categoryInput}
          onChange={handleCategoryChange}
          input={<OutlinedInput label="Category" />}
          MenuProps={MenuProps}
      >
          {categories.map((categoryName) => (
              <MenuItem
                  key={categoryName}
                  value={categoryName}
                  //style={getStyles(categoryName, category, theme)}
              >
                  {categoryName}
              </MenuItem>
          ))}
      </Select>
          <br/>
      </FormControl>
          <br/>
          <TextField
              value={yearMonthValue}
              onChange={handleYearMonthChange}
              id="outlined-year"
              label="Year"
              type="month"
              InputLabelProps={{
                  shrink: true,
              }}
          />

      </FormControl>
          
          <Button onClick={(e) => handleAddItem()} size="small" variant="outlined">Add Item</Button>

      </div>);
}
