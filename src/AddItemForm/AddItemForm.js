import './AddItemForm.css';
import {useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import {FormLabel, useTheme} from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { IDB } from '../idbModule';

//{ sum: 200, category: 'HOUSING', description: 'rent for 01.2023', month: 7, year: 2022 }
const categories = ['FOOD', 'HEALTH', 'EDUCATION', 'TRAVEL', 'HOUSING', 'OTHER'];
const months = [1,2,3,4,5,6,7,8,9,10,11,12];

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

function getStyles(category, categoryName, theme) {
    return {
        fontWeight:
            categoryName.indexOf(category) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}



export default function AddItemForm() {

    const theme = useTheme();
    const[sumInput,setSumInput] = useState(0);
    const[categoryInput,setCategoryInput] = useState("FOOD");
    const[descriptionInput,setDescriptionInput] = useState(" ");
    const[monthInput,setMonthInput] = useState(undefined);
    const[yearInput,setYearInput] = useState(undefined);

    async function handleAddItem() {
        /**
         * @type {DB}
         */
        if(monthInput === undefined || yearInput === undefined) {
            setMonthInput(undefined);
            setYearInput(undefined);
        }

        const db = await IDB.openCostsDB('costsdb', 1);

        const result = await db.addCost({
            sum: sumInput,
            category: categoryInput,
            description: descriptionInput,
            month: monthInput,
            year: yearInput
        });
        console.log(sumInput);
        console.log(categoryInput);
        console.log(descriptionInput);
        if(result) {
            alert("item added succesfully");
        }
        else {
            alert("error adding item");
        }

        //const result2 = await db.addCost({sum: sumInput, category: categoryInput, description: descriptionInput});
    }

    function handleSumChange(e) {
        //console.log(e.target.value);
        setSumInput(parseInt(e.target.value));
    }

    function handleDescriptionChange(e) {
        //console.log(e.target.value);
        setDescriptionInput(e.target.value);
    }

    function handleCategoryChange(e) {
        console.log(e.target.value);
        setCategoryInput(e.target.value);
    }
    function handleMonthChange(e) {
        console.log(e.target.value);
        setMonthInput(e.target.value);
    }

    function handleYearChange(e) {
        if(parseInt(e.target.value)) {
            setYearInput(parseInt(e.target.value));
        }

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
          <FormControl normal>
              <InputLabel id="month-select-component">Month</InputLabel>
              <Select
                  labelId="month-select-component"
                  id="month-select-component"
                  value={monthInput}
                  onChange={handleMonthChange}
                  input={<OutlinedInput label="Month" />}
                  MenuProps={MenuProps}
              >
                  {months.map((monthNumber) => (
                      <MenuItem
                          key={monthNumber}
                          value={monthNumber}
                          //style={getStyles(categoryName, category, theme)}
                      >
                          {monthNumber}
                      </MenuItem>
                  ))}
              </Select>
          </FormControl>
          <br/>
          <TextField
              value={yearInput}
              onChange={handleYearChange}
              id="outlined-year"
              label="Year"
              type="number"
              InputLabelProps={{
                  shrink: true,
              }}
          />

      </FormControl>
          
          <Button onClick={(e) => handleAddItem()} size="small" variant="outlined">Add Item</Button>


      </div>);
}
