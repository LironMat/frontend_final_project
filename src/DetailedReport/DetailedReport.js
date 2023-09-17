import './DetailedReport.css';
import { useState } from 'react';
import {
  Button,
  FormControl,
  Typography,
  TextField,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  TableBody,
} from '@mui/material';
import { IDB } from '../idbModule';
import { format } from 'date-fns';

export default function DetailedReport() {
  const [yearMonthValue, setYearMonthValue] = useState(format(new Date(), 'yyyy-MM'));
  const [reportData, setReportData] = useState({
    data: [],
    date: yearMonthValue,
    errorMessage: '',
  });

  function handleYearMonthChange(e) {
    setYearMonthValue(e.target.value);
  }

  async function fetchReportData() {
    try {
      const db = await IDB.openCostsDB('costsdb', 1);

      const [year, month] = (yearMonthValue || format(new Date(), 'yyyy-MM'))
        .split('-')
        .map((split) => parseInt(split));

      const data = await db.getDetailedReport(month, year);
      if (data.length === 0) {
        setReportData({
          data: null,
          date: yearMonthValue,
          errorMessage: 'No reports for selected date',
        });
      } else {
        setReportData({ data: data, date: yearMonthValue, errorMessage: '' });
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      return false;
    }
  }

  const tableHeaders = ['Sum', 'Category', 'Description'];

  return (
    <div className="form-container">
      <FormControl margin="normal">
        <TextField
          value={yearMonthValue}
          onChange={handleYearMonthChange}
          label="Year & Month"
          type="month"
        />
      </FormControl>

      <Button variant="contained" color="primary" onClick={fetchReportData}>
        Fetch Report
      </Button>

      {reportData.errorMessage && (
        <Typography color="error" align="center">
          {reportData.errorMessage}
        </Typography>
      )}

      {!reportData.errorMessage && reportData.data.length > 0 && (
        <div>
          <Typography color="green" align="center">
            Showing results for {reportData.date}
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.data.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>{report.sum}</TableCell>
                    <TableCell>{report.category}</TableCell>
                    <TableCell>{report.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}
