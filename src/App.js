import './App.css';
import AddItemForm from './AddItemForm/AddItemForm';
import DetailedReport from './DetailedReport/DetailedReport';
import { AppBar, Button } from '@mui/material';
import { useState } from 'react';

function App() {
  const tabs = ['Add Item', 'Get Items Report'];

  const [value, setValue] = useState(0);

  return (
    <div className="host">
      <AppBar position="static" component="nav" className="header">
        {tabs.map((tab, index) => (
          <Button
            onClick={() => setValue(index)}
            key={index}
            variant="text"
            sx={{ my: 2, color: 'white' }}
            style={{ fontWeight: index === value ? 'bold' : 'initial' }}
          >
            {tab}
          </Button>
        ))}
      </AppBar>
      <div className="tab-content">
        {value === 0 && <AddItemForm />}
        {value === 1 && <DetailedReport />}
      </div>
    </div>
  );
}

export default App;
