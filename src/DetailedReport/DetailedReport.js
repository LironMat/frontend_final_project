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
import { DataGrid } from '@mui/x-data-grid';

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

  const tableHeaders = [
    { field: 'id', headerName: '#', headerAlign: 'center' },
    { field: 'sum', headerName: 'Sum', headerAlign: 'center' },
    { field: 'category', headerName: 'Category', width: 300, headerAlign: 'center' },
    { field: 'description', headerName: 'Description', width: 1000, headerAlign: 'center' },
  ];

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
        <DataGrid
          rows={reportData.data.map((report, index) => ({
            id: index,
            sum: report.sum,
            category: report.category,
            description: report.description,
          }))}
          columns={tableHeaders}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      )}
    </div>
  );
}
