import {useEffect,useState}from 'react'
import { Typography, Box, TextField, Button, IconButton } from '@mui/material'
import ReportCard from '../../../Components/ReportCard';
import ButtonGroup from '@mui/material/ButtonGroup';
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';
import useReservation from '../../../Hooks/useReservation';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import Papa from 'papaparse';


function Report() {
  const {data:reservations,loading:loadingReports,error,getReservation} = useReservation();
  const [reports, setReports] = useState([]);
  const [reportCardValue,setReportCardValue] = useState({
    TotalGuests:0,
    TotalAccommodation:0,
    TotalSales:0
  })
  const [dateFilterButton,setDateFilterButton] = useState("sortAToZ") // sortAToZ or sortZtoA
  const [dateFilterInput,setDateFilterInput] = useState({
    start:"",
    end:""
  })
  const handleDateChange = (e:any, field:string) => {
    // Update state correctly
    
    setDateFilterInput(prevState => ({
      ...prevState,
      [field]: e.target.value
    }));
  };

  function getTotalNumberOfGuests(reservations: any) {
    let totalGuests = 0;
    for (const reservation of reservations) {
      // Check if reservation has invoices and invoices is an array with at least one element
      for(const invoices of reservation.invoices){
        totalGuests += invoices.guests.pwd +invoices.guests.kids + invoices.guests.adult + invoices.guests.senior
      }
    }
    return totalGuests;
  }
  function getTotalAccommodation(reservations: any): number {
    let totalAccommodation = 0;
  
    for (const reservation of reservations) {
      // Check if reservation has invoices and invoices is an array with at least one element
      if (
        reservation?.invoices &&
        Array.isArray(reservation.invoices) &&
        reservation.invoices.length > 0
      ) {
        totalAccommodation += reservation.invoices.length;
      }
    }
    return totalAccommodation;
  }
  
  const getTotalAmountForAllReservations = (data: any) => {
    let totalAccommodations = 0;
    let totalInclusions = 0;
    let totalGuests = 0;
  
    if (data && data.length > 0) {
      data.forEach((reservation: any) => {
        if (reservation.invoices && reservation.invoices.length > 0) {
          reservation.invoices.forEach((item: any) => {
            // Calculate accommodations
            totalAccommodations += item.rate;
  
            // Calculate guests
            totalGuests +=
              parseFloat(item.guests.adult) * parseFloat(item.guestFee.adult) +
              parseFloat(item.guests.kids) * parseFloat(item.guestFee.kids) +
              parseFloat(item.guests.senior) * (parseFloat(item.guestFee.adult) * 0.8) +
              parseFloat(item.guests.pwd) * (parseFloat(item.guestFee.adult) * 0.8);
  
            // Calculate inclusions
            if (item.inclusions && item.inclusions.length > 0) {
              item.inclusions.forEach((inclusion: any) => {
                totalInclusions += inclusion.price * inclusion.quantity;
              });
            }
          });
        }
      });
    }
  
    const total = totalAccommodations + totalInclusions + totalGuests;
    return { total, accommodations: totalAccommodations, inclusions: totalInclusions, guests: totalGuests };
  };
  
  
  const calculateTotalAmount = (data: any) => {
    let totalAccommodations = 0;
    let totalInclusions = 0;
    let totalGuests = 0;
  
    if (data && data.length > 0 && data[0].invoices) {
      data[0].invoices.forEach((item: any) => {
        // Calculate accommodations
        totalAccommodations += item.rate;
  
        // Calculate guests
        totalGuests +=
          parseFloat(item.guests.adult) * parseFloat(item.guestFee.adult) +
          parseFloat(item.guests.kids) * parseFloat(item.guestFee.kids) +
          parseFloat(item.guests.senior) * (parseFloat(item.guestFee.adult) * 0.8) +
          parseFloat(item.guests.pwd) * (parseFloat(item.guestFee.adult) * 0.8);
  
        // Calculate inclusions
        if (item.inclusions && item.inclusions.length > 0) {
          item.inclusions.forEach((inclusion: any) => {
            totalInclusions += inclusion.price * inclusion.quantity;
          });
        }
      });
    }
  
    const totalAmount = totalAccommodations + totalInclusions + totalGuests;
  
    return { total: totalAmount, minimum: totalAccommodations };
  };
  
  
  // Filter Functions
  const sortBySchedule = (data: any): any => {
    return data.sort((a:any, b:any) => new Date(b.schedule).getTime() - new Date(a.schedule).getTime());
  };
  const sortByOldestSchedule = (data: any): any => {
    return data.sort((a:any, b:any) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime());
  };
  const filterByDateRange = (data: any, startDate: Date, endDate: Date): any => {
    const filteredData = data.filter((reservation:any) => {
      const reservationDate = new Date(reservation.schedule);
      return reservationDate >= startDate && reservationDate <= endDate;
    });
  
    return filteredData;
  };

  const flattenObject = (obj: any, parentKey = ''): any => {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const newKey = parentKey ? `${parentKey}_${key}` : key;
  
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const nestedObj = flattenObject(obj[key], newKey);
        acc = { ...acc, ...nestedObj };
      } else {
        acc[newKey] = obj[key];
      }
  
      return acc;
    }, {});
  };
  
  const exportToCSV = (data: any) => {
    // Flatten nested objects
    const flattenedData = data.map((item: any) => {
      return flattenObject(item);
    });
  
    const csvData = Papa.unparse(flattenedData, {
      header: true,
    });
  
    // Create a Blob
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  
    // Create a link to trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'data.csv';
  
    // Append the link to the body
    document.body.appendChild(link);
  
    // Trigger the click event on the link
    link.click();
  
    // Remove the link from the body
    document.body.removeChild(link);
  };
  
  
  useEffect(()=>{
    getReservation();
  },[])


  useEffect(() => {
    if (!reservations) {
      return; // Exit early if reservations is null
    }
    if (dateFilterInput.start !== '' && dateFilterInput.end !== '') {
      const startDate = new Date(dateFilterInput.start);
      const endDate = new Date(dateFilterInput.end);
  
      const filteredAndSorted = reservations
        .filter((reservation: any) => ['checkedOut','checked out'].includes(reservation.status))
        .sort((a: any, b: any) => new Date(b.schedule).getTime() - new Date(a.schedule).getTime());
  
      const filteredData = filterByDateRange(filteredAndSorted, startDate, endDate);
      setReports(filteredData);
    } else {
      // If no date range is specified, set the reports directly
      const filteredAndSorted = reservations
        .filter((reservation: any) => ['checkedOut','checked out'].includes(reservation.status))
        .sort((a: any, b: any) => new Date(b.schedule).getTime() - new Date(a.schedule).getTime());
      setReports(filteredAndSorted);
    }
  }, [reservations, dateFilterInput.start, dateFilterInput.end]);
  
  useEffect(() => {
    if (reports) {
      setReportCardValue((prevReportCardValue) => ({
        ...prevReportCardValue,
        TotalGuests: getTotalNumberOfGuests(reports),
        TotalAccommodation: getTotalAccommodation(reports),
        TotalSales: getTotalAmountForAllReservations(reports).total
      }));
    }
  }, [reports]);
  

  if(loadingReports) return <><div>Loading...</div></>
  return (
      <div>
          <Typography variant="h4" fontWeight={600} color="primary">Report</Typography>
          <Typography variant="h6" fontWeight={400} color="initial" sx={{marginBottom:"2em"}}>List of reservation and reports</Typography>
          <Box display="flex" gap={"15px"}>
              <ReportCard variant='reservation' title="Total Number of Guests" value={reportCardValue.TotalGuests}/>
              <ReportCard variant='accommodation' title="Total Accommodation" value={reportCardValue.TotalAccommodation}/>
              <ReportCard variant='revenue' title="Total Sales" value={reportCardValue.TotalSales}/>
          </Box>
          <Box display="flex" m={"45px 0"} gap={"25px"} alignItems={"center"}>
              <Box display={"flex"} gap={"10px"} sx={{ flexGrow: "1" }}>
                <TextField
                  id="fromDate"
                  label=""
                  type="date"
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    selectedDate.setDate(selectedDate.getDate() - 1); // Deduct one day

                    // Update state correctly
                    setDateFilterInput((prevState) => ({
                      ...prevState,
                      start: selectedDate.toISOString().split("T")[0], // Format to 'YYYY-MM-DD'
                    }));
                  }}
                />
                <TextField
                  id="toDate" 
                  label=""
                  type="date"
                  onChange={(e) => handleDateChange(e, "end")}
                />
              </Box>
              <ButtonGroup
                  disableElevation
                  variant="contained"
                  aria-label="Disabled elevation buttons"
              >
                <Button onClick={()=>{exportToCSV(reservations)}}>Backup</Button>
                {/* <Button>Restore</Button> */}
              </ButtonGroup>
          </Box>
          <TableContainer sx={{marginTop:"25px"}}>
              <Table aria-label="simple table">
                  <TableHead>
                      <TableRow>
                          <TableCell sx={{display:"flex",alignItems:"center"}}>
                            Date
                            {dateFilterButton === "sortAToZ"?
                              <IconButton aria-label="" onClick={()=>{
                                  setDateFilterButton("sortZToA")
                                  setReports(sortByOldestSchedule(reports))
                                }}>
                                <ArrowUpwardIcon/>
                              </IconButton>
                            :""}
                            {dateFilterButton === "sortZToA"?
                              <IconButton aria-label="" onClick={()=>{
                                setDateFilterButton("sortAToZ")
                                setReports(sortBySchedule(reports))
                                }}>
                                <ArrowDownwardIcon/>
                              </IconButton>
                            :""}
                          </TableCell>
                          <TableCell >Reference No.</TableCell>
                          <TableCell >No. Accommodation</TableCell>
                          <TableCell >Check In </TableCell>
                          <TableCell >Check Out </TableCell>
                          <TableCell >Status </TableCell>
                          <TableCell >Amount</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody >
                    {reports?.map((reservation: any) => {
                      const costInfo = calculateTotalAmount([reservation]);

                      return (
                        <TableRow key={reservation.reservationId} sx={{ background: "#D7D7D7" }}>
                          <TableCell>{dayjs(reservation?.schedule).format('MMMM D, YYYY')}</TableCell>
                          <TableCell>{`${reservation.reservationId.substring(0, 4)}...${reservation.reservationId.substring(reservation.reservationId.length - 4)}`}</TableCell>
                          <TableCell align='center'>{reservation?.invoices.length}</TableCell>
                          <TableCell>Oct 25, 2023 at 10 am</TableCell>
                          <TableCell>Oct 25, 2023 at 2 pm</TableCell>
                          <TableCell>
                            <Chip
                              label={reservation?.status}
                              color={reservation.status === 'cancelled' || reservation.status === 'declined' || reservation.status === 'refunded'   ? "error" : (reservation.status === "checked out" ? "success" : "info")}
                            />
                          </TableCell>
                          <TableCell>₱{costInfo.total.toLocaleString()}</TableCell> {/* Display the total amount per reservation */}
                        </TableRow>
                      );
                    })}
                  </TableBody>
              </Table>
          </TableContainer>
      </div>
  )
}

export default Report