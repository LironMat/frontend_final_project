import './AddItemForm.css';
import {useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import {useTheme} from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { IDB } from '../idbModule';

//{ sum: 200, category: 'HOUSING', description: 'rent for 01.2023', month: 7, year: 2022 }
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
    const[sum,setSum] = useState(0);
    const[category,setCategory] = useState("FOOD");
    const[description,setDescription] = useState(" ");
    //const[month,setMonth] = useState(1);
    //const[year,setYear] = useState(2023);

    async function handleClick() {
        const input = {sum: {sum},category: {category}, description: {description}};
        const db = await IDB.openCostsDB('costsdb', 1);
        const result1 = await db.addCost(input);
        if (db) {
            console.log('creating db succeeded');
        }

        if (result1) {
            console.log('adding 1st cost succeeded');
        }

    }
    function handleSumChange(e) {
        //console.log(e.target.value);
        setSum(e.target.value);
    }

    function handleDescriptionChange(e) {
        //console.log(e.target.value);
        setDescription(e.target.value);
    }

    function handleCategoryChange(e) {
        console.log(e.target.value);
        setCategory(e.target.value);
    }

  return(<div>
      <br/>
          <TextField
              value={sum}
              onChange={handleSumChange}
              id="outlined-sum"
              label="Sum"
              type="number"
              InputLabelProps={{
                  shrink: true,
              }}
          />
          <TextField
              value={description}
              onChange={handleDescriptionChange}
              id="outlined-multiline-static"
              label="Details"
              multiline
              rows={4}
              defaultValue=""
          />
      <FormControl normal>
      <InputLabel id="category-select-component">Category</InputLabel>
      <Select
          labelId="category-select-component"
          id="category-select-component"
          value={category}
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
      </FormControl>

          
          <Button onClick={(e) => handleClick()} size="small" variant="outlined">Add Item</Button>

      </div>);
}
