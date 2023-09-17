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

      setReportData({
        data: data,
        date: yearMonthValue,
        errorMessage: data.length === 0 ? 'No reports for selected date' : '',
      });
    } catch (error) {
      setReportData({
        data: [],
        date: null,
        errorMessage: 'Error fetching report data',
      });

      console.error('Error fetching report data:', error);
    }
  }

  const tableHeaders = ['Sum', 'Category', 'Description'];

  return (
    <div className="detailed-report-container">
      <div className="flex-row">
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
          <Typography color="error">{reportData.errorMessage}</Typography>
        )}

        {reportData.data.length > 0 && (
          <Typography color="green">Showing results for {reportData.date}</Typography>
        )}
      </div>

      {!reportData.errorMessage && reportData.data.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {tableHeaders.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.data.map((report, index) => (
                <TableRow key={index}>
                  <TableCell style={{ fontWeight: 'bolder' }}>{index}</TableCell>
                  <TableCell>{report.sum}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell style={{ whiteSpace: 'pre-line' }}>{report.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
