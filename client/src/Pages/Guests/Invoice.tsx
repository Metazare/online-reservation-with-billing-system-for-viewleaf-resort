import React, {useState, useEffect} from 'react'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import BookingStatement from './Booking/BookingStatement';
import Container from '@mui/material/Container'
import Chip from '@mui/material/Chip';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StarIcon from '@mui/icons-material/Star';
import Grid from '@mui/material/Grid';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import RateInput from '../../Components/RateInput';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link, useParams, useNavigate } from 'react-router-dom';

import useReservation from '../../Hooks/useReservation';
import useFeedback from '../../Hooks/useFeedback';
import moment from 'moment';
import Rating from '@mui/material/Rating';

import dayjs from 'dayjs';

type Props = {
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius:"8px"
};
function Invoice({}:Props) {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState("");
    // approved,pending, checkedOut, canceled, refunded
    const {id} = useParams();
    const {data, loading, error, getReservation, updateReservation} = useReservation();
    const [status, setStatus] = React.useState<"pending" | "paid" | "approved" | "declined" | "refunding" | "rescheduling" | "cancelling" | "checkedIn" | "refunded" | "cancelled" | "checked out">("pending");
    const [note, setNote] = useState<string>("")
    const [schedule, setSchedule] = useState<string>("")
    const { createFeedback } = useFeedback();
    const [rating, setRating] = useState<number>(5);
    const [review, setReview] = useState<string>("");


    const submitReschedule = () => {
      updateReservation({
        reservationId: id||"",
        status: 'rescheduling',
        note: `This reservation wants to reschedule at ${schedule} with a reason of ${note}`
      })
      navigate(`/reservation/${id}`)
    }

    const submitFeedback = (e: React.FormEvent) => {
      e.preventDefault();
      createFeedback({
        reservationId: id||"",
        rating: ratingForm.rating,
        review: ratingForm.feedback
      });
      window.location.reload();
    }

    const submit = async (status: string, note: string) => {
      updateReservation({
        reservationId: id||"",
        status: status,
        note: note
      })
      navigate(`/reservation/${id}`)
    }
    
    const filterByStatus = (data: any, status: string) => {
      return data.filter((item: any) => item.status === status);
    };
    
    const [ratingForm, setRatingForm] = useState({
      rating: 0,
      feedback:""
    });

    useEffect(()=>{

      if (data) {
        setStatus(data?.[0]?.status)
      } 
      else {
        getReservation({
          reservationId: id || ""
        })
      }

    }, [data])

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error || data?.length === 0) {
      return <Container maxWidth="lg" sx={{padding:"6em 0 7em"}}>
        <div style={{display:"flex",justifyContent:"center",color:"red"}}>This reservation does not exist</div>
      </Container>
    }

    return<>
        <Container maxWidth="lg"  sx={{padding:"6em 0 7em"}}>
          <Box display="flex" gap={"15px"} sx={{flexWrap:"wrap"}} mt={2}>
            {status === "approved"?<>
              <Chip icon={<CurrencyExchangeIcon />} label="Get Refund" variant="outlined" onClick={()=>{setOpen("refund")}} />
              <Chip icon={<EventRepeatIcon />} label="Reschedule Reservation" variant="outlined" onClick={()=>{setOpen("reschedule")}} />
              <Chip icon={<DoNotDisturbAltIcon />} label="Cancel Reservation" variant="outlined" onClick={()=>{setOpen("cancel")}} />
            </>:""}
            <Box sx={{flexGrow:"1"}} ></Box>
            {status === "checked out"?
              <>
                {data?.[0]?.feedbacks?.length > 0 ? <></> : 
                  <Chip icon={<StarIcon />} label="Rate our Service" variant="filled" onClick={()=>{setOpen("rate")}} color="primary" />
                }
              </>
            :<></> }
          </Box>

          {status==="pending"?
            <Box sx={{position:"relative"}}>
              <Alert severity="warning" sx={{margin:"2em 0",padding:" 1em 9em 1em 1em"}}>Please make the payment to finalize your reservation, Thank you!</Alert>
              <Chip label="Pay now" variant="outlined" onClick={()=>{}} component={Link} to={data?.[0]?.paymongo?.url} color="primary" sx={{position:"absolute",top:"50%",right:"10px",transform:"translateY(-50%)"}} target='_blank'/>
            </Box>
          :""}
          {status==="paid"?
            <Alert severity="info" sx={{margin:"2em 0",padding:" 1em 9em 1em 1em"}}>Thanks for your reservation! We've received your payment and currently verifying it. We'll update you shortly!</Alert>
          :""}
          {status==="approved"?
            <Alert severity="info" sx={{margin:"2em 0",padding:" 1em 9em 1em 1em"}}>Your reservation is active, We are excited to see you here!</Alert>
          :""}
          {status==="checkedIn"?
            <Alert severity="warning" sx={{margin:"2em 0",padding:" 1em 9em 1em 1em"}}>Your reservation has been already been checked in</Alert>
          :""}
          {status==="checked out"?
          <>
            {data?.[0]?.feedbacks?.length > 0 ? <>
              <Alert severity="success" sx={{margin:"2em 0",padding:" 1em 9em 1em 1em"}}>This reservation is done, We are happy to serve you!</Alert>
              
              <Paper variant="elevation" elevation={1} sx={{marginTop:"-2px",background:"white",padding:"1em"}}>
                <Typography variant="subtitle1" fontWeight={600} color="initial">Rating</Typography>
                {/* Insert in the value how plenty of star */}
                <Rating name="read-only" value={data?.[0]?.feedbacks?.[0]?.rating} readOnly />
                <Typography variant="subtitle1" mt={2} fontWeight={600} color="initial">Feedback</Typography>
                <Typography variant="body2"  color="initial">
                {data?.[0]?.feedbacks?.[0]?.review}
                </Typography>
              </Paper>
            </> : <></>}
          </>
          :""}
          {status==="declined"?<>
            <Alert severity="error" sx={{margin:"2em 0 0", zIndex:"23"}}>This reservation is declined, We are sorry!</Alert>
            <Paper variant="elevation" elevation={1} sx={{marginTop:"-2px",background:"white",padding:"1em"}}>
              <Typography variant="subtitle1" fontWeight={600} color="initial">Note</Typography>
              <Typography variant="body2"  color="initial">
                {filterByStatus(data?.[0]?.notes, status)?.[0]?.note}
              </Typography>
            </Paper>
          </>:""}
          {status==="refunding"?<>
            <Alert severity="warning" sx={{margin:"2em 0 0", zIndex:"23"}}>This reservation requested to refund</Alert>
            <Paper variant="elevation" elevation={1} sx={{marginTop:"-2px",background:"white",padding:"1em"}}>
              <Typography variant="subtitle1" fontWeight={600} color="initial">Note</Typography>
              <Typography variant="body2"  color="initial">
                {filterByStatus(data?.[0]?.notes, status)?.[0]?.note}
              </Typography>
            </Paper>
          </>:""}
          {status==="cancelling"?<>
            <Alert severity="warning" sx={{margin:"2em 0 0", zIndex:"23"}}>This reservation requested to cancel</Alert>
            <Paper variant="elevation" elevation={1} sx={{marginTop:"-2px",background:"white",padding:"1em"}}>
              <Typography variant="subtitle1" fontWeight={600} color="initial">Note</Typography>
              <Typography variant="body2"  color="initial">
                {filterByStatus(data?.[0]?.notes, status)?.[0]?.note}
              </Typography>
            </Paper>
          </>:""}
          {status==="rescheduling"?<>
            <Alert severity="warning" sx={{margin:"2em 0 0", zIndex:"23"}}>This reservation requested to be reschedule</Alert>
            <Paper variant="elevation" elevation={1} sx={{marginTop:"-2px",background:"white",padding:"1em"}}>
              <Typography variant="subtitle1" color="initial">Note</Typography>
              <Typography variant="body2"  color="initial">
                {filterByStatus(data?.[0]?.notes, status)?.[0]?.note}
              </Typography>
            </Paper>
          </>:""}

          {status==="refunded"?<>
            <Alert severity="error" sx={{margin:"2em 0 ", zIndex:"23"}}>This reservation is refunded</Alert>
            {filterByStatus(data?.[0]?.notes, status)?.[0]?.note && <>
              <Paper variant="elevation" elevation={1} sx={{marginTop:"-2px",background:"white",padding:"1em"}}>
                <Typography variant="subtitle1" fontWeight={600} color="initial">Note</Typography>
                <Typography variant="body2"  color="initial">
                  {filterByStatus(data?.[0]?.notes, status)?.[0]?.note}
                </Typography>
              </Paper>
            </>}
          </>:""}

          {status==="cancelled"?<>
            <Alert severity="error" sx={{margin:"2em 0 ", zIndex:"23"}}>This reservation is cancelled</Alert>
            {filterByStatus(data?.[0]?.notes, status)?.[0]?.note && <>
              <Paper variant="elevation" elevation={1} sx={{marginTop:"-2px",background:"white",padding:"1em"}}>
                <Typography variant="subtitle1" fontWeight={600} color="initial">Note</Typography>
                <Typography variant="body2"  color="initial">
                  {filterByStatus(data?.[0]?.notes, status)?.[0]?.note}
                </Typography>
              </Paper>
            </>}
          </>:""}
          
          
          {/*Header  */}
          <Box display="flex" sx={{margin:"25px 0"}}>
              <Box sx={{flexGrow:"1"}}>
                <Typography variant="h4" color="primary" >#{data?.[0]?.reservationId}</Typography>
                <Typography variant="h6" color="initial" sx={{opacity:".6"}}>Reference Number</Typography>
              </Box>
              <Box >
                <Typography textAlign={"end"} variant="h4" color="primary" >{ moment(new Date(data?.[0]?.schedule)).format('DD/MM/YYYY')} - {data?.[0]?.invoices?.[0]?.shift}</Typography>
                <Typography textAlign={"end"} variant="h6" color="initial" sx={{opacity:".6"}}>Scheduled Date</Typography>
              </Box>
          </Box>
          
          {/* User Details */}
          <Paper variant="elevation" elevation={3} sx={{borderRadius:"8px",background:"#e3e3e3",padding:"1em",margin:"2em 0" ,display:"flex",alignItems:"center"}}>
            <Box sx={{flexGrow:"1"}}>
              <Typography variant="h5" color="initial" fontWeight={500}>{data?.[0]?.customer?.name}</Typography>
              <Box display="flex" gap={"15px"} mt={1}>
                <Box display="flex" gap="5px">
                    <CallIcon/>
                    <Typography variant="body1" color="initial">{data?.[0]?.customer?.phone}</Typography>
                </Box>
                <Box display="flex" gap="5px">
                    <EmailIcon/>
                    <Typography variant="body1" color="initial">{data?.[0]?.customer?.email}</Typography>
                </Box>
              </Box>
            </Box>
            <Tooltip title="View Receipt">
              <IconButton aria-label="" onClick={()=>{setOpen("viewReceipt")}} size="large" >
                <ReceiptLongIcon  fontSize="inherit"/>
              </IconButton>
            </Tooltip>
          </Paper>

          <Typography variant="h6" color="initial">Billing Statement</Typography>
          { data?.[0]?.invoices &&  <BookingStatement additional={false} form={data?.[0]?.invoices} invoices={data}/> }
            
          <hr style={{margin:"2em 0"}}/>
        </Container>

        <Modal
            keepMounted
            open={!(open==="")}
            onClose={()=>{setOpen("")}}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                {open ==="reschedule"?<>
                    <Typography id="keep-mounted-modal-title" variant="h6" fontWeight={700} color={"primary"} component="h2">
                        Reschedule Reservation
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{marginBottom:"15px"}}>
                        Input your desired date to be moved on
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{marginBottom:"25px"}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker 
                                      slotProps={{ textField: { fullWidth: true } }} 
                                      label="Schedule"
                                      onChange={(newDate: string | number | Date | null) => setSchedule(dayjs(newDate).format('YYYY-MM-DD'))}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sx={{marginBottom:"25px"}}>
                            <TextField
                                id="reason"
                                label=" Reason"
                                multiline
                                fullWidth
                                required
                                onChange={(e)=>{setNote(e.target.value)}}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Button variant="text" sx={{color:"black"}}  onClick={()=>{setOpen("")}} fullWidth>Cancel</Button>
                        </Grid>
                        <Grid item xs={7}>
                            <Button 
                            variant="contained" 
                            fullWidth 
                            onClick={()=>{
                              setOpen(""); 
                              // submit("rescheduling", note);
                              submitReschedule();
                            }}>
                              Send
                            </Button>
                        </Grid>
                    </Grid>
                </>:""}
                {open ==="refund"?<>
                    <Typography id="keep-mounted-modal-title" variant="h6" fontWeight={700} color={"primary"} component="h2">
                        Get Refund
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{marginBottom:"15px"}}>
                        Only the 50% of the payment is refundable
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{marginBottom:"25px"}}>
                            <TextField
                                id="reason"
                                label=" Reason"
                                multiline
                                fullWidth
                                required
                                onChange={(e)=>{setNote(e.target.value)}}
                            />
                        </Grid>

                        <Grid item xs={5} marginBottom={"20px"}>
                            <Button variant="text" sx={{color:"black"}} onClick={()=>{setOpen("")}} fullWidth>Cancel</Button>
                        </Grid>
                        <Grid item xs={7} marginBottom={"20px"}>
                            <Button variant="contained" fullWidth onClick={()=>{setOpen(""); submit("refunding", note)}}>Send</Button>
                        </Grid>
                    </Grid>
                </>:""}
                {open ==="cancel"?<>
                    <Typography id="keep-mounted-modal-title" variant="h6" fontWeight={700} color={"primary"} component="h2">
                        Cancel Reservation
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{marginBottom:"15px"}}>
                        Provide a reason why you want to cancel
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{marginBottom:"25px"}}>
                            <TextField
                                id="reason"
                                label=" Reason"
                                multiline
                                fullWidth
                                required
                                onChange={(e)=>{setNote(e.target.value)}}
                            />
                        </Grid>
                        <Grid item xs={5} marginBottom={"20px"}>
                            <Button variant="text" sx={{color:"black"}} onClick={()=>{setOpen(""); }} fullWidth>Cancel</Button>
                        </Grid>
                        <Grid item xs={7} marginBottom={"20px"}>
                            <Button variant="contained" fullWidth onClick={()=>{setOpen(""); submit("cancelling", note)}}>Send</Button>
                        </Grid>
                    </Grid>
                </>:""}
                {open ==="rate"?<>
                  <form onSubmit={submitFeedback}>
                    <Typography id="keep-mounted-modal-title" variant="h6" fontWeight={700} color={"primary"} component="h2">
                      Set Schedule
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{marginBottom:"15px"}}>
                      Specify the date you want to stay with us
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="initial">Ratings</Typography>
                          <RateInput setRate={setRatingForm} rate={ratingForm}/>
                        </Grid>
                        <Grid item xs={12} marginBottom={"20px"}>
                          <Typography variant="subtitle2" sx={{marginBottom:"10px"}} color="initial">Feedback</Typography>
                          <TextField id="feedback" fullWidth multiline value={ratingForm.feedback} onChange={(e)=>{setRatingForm({...ratingForm,feedback:e.target.value})}}/>
                        </Grid>
                        <Grid item xs={5} marginBottom={"20px"}>
                            <Button variant="text" sx={{color:"black"}} onClick={()=>{setOpen("")}} fullWidth>Cancel</Button>
                        </Grid>
                        <Grid item xs={7} marginBottom={"20px"}>
                          <Button variant="contained" fullWidth type='submit'>Send</Button>
                        </Grid>
                    </Grid>
                  </form>
                </>:""}
                {open ==="viewReceipt"?<>
                    <Typography id="keep-mounted-modal-title" variant="h6" fontWeight={700} color={"primary"} component="h2">
                        View Receipt 
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{marginBottom:"15px"}}>
                        Attached Image for receipt 
                    </Typography>
                    <Grid container spacing={2}>
                      { data?.[0]?.receipts?.map((receipt:any)=>(
                        <Grid item xs={12} sx={{marginBottom:"25px",overflowY:"scroll",maxHeight:"500px"}}>
                          <img style={{width:"100%"}} src={receipt} alt="" />
                      </Grid>
                      ))}

                      <Grid item xs={5} marginBottom={"20px"}>
                          <Button variant="text"  sx={{color:"black"}} onClick={()=>{setOpen("")}} fullWidth>Cancel</Button>
                      </Grid>
                        {/* <Grid item xs={7} marginBottom={"20px"}>
                            <Button variant="contained" fullWidth>Send</Button>
                        </Grid> */}
                    </Grid>
                </>:""}
            </Box>
        </Modal>
    </> 
}

export default Invoice