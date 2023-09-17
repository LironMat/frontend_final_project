import './DetailedReport.css';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  FormControl,
  Typography,
} from '@mui/material';
import { IDB } from '../idbModule';

export default function DetailedReport() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [reportDate, setReportDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleDateChange(newDate) {
    setSelectedDate(newDate);
  }

  async function fetchReportData() {
    try {
      const db = await IDB.openCostsDB('costsdb', 1);

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1; // Months are 0-indexed, so add 1
      const data = await db.getDetailedReport(month, year);
      if (data.length === 0) {
        setErrorMessage('No reports for selected date');
      } else {
        setErrorMessage('');
        setReportData(data);
        setReportDate(selectedDate);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setErrorMessage('An error occurred while fetching the report data.');
    }
  }

  return (
    <div className="form-container">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <FormControl margin="normal">
          <DatePicker
            views={['year', 'month']}
            label="Select Month and Year"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <Button variant="contained" color="primary" onClick={fetchReportData}>
            Fetch Report
          </Button>
        </FormControl>
        {errorMessage && (
          <Typography color="error" align="center">
            {errorMessage}
          </Typography>
        )}
        {!errorMessage && reportData.length > 0 && (
          <div>
            <Typography color="green" align="center">
              Showing results for{' '}
              {reportDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Typography>
            <List>
              {reportData.map((report, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography component="div">
                          Sum: {report.sum}
                          <br />
                          Category: {report.category}
                          <br />
                          Description: {report.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < reportData.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </div>
        )}
      </LocalizationProvider>
    </div>
  );
}
