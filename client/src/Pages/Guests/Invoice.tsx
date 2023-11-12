import React from 'react'
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
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import RateInput from '../../Components/RateInput';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'


type Props = {
    variant: "manage"|"view"
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
function Invoice({variant}:Props) {
    const [open, setOpen] = React.useState("");
    return<>
        <Container maxWidth="lg"  sx={{padding:"6em 0 7em"}}>
            {/* 
            ===== ALERT TYPES =====
            <Alert severity="success">Your requests is got approved</Alert>
            <Alert severity="error">Your requests is got declined</Alert>
            <Alert severity="warning">Your requests is got approved</Alert> 
            
            */}
            <Box display="flex" gap={"15px"} sx={{flexWrap:"wrap"}} mt={2}>
                <Chip icon={<CurrencyExchangeIcon />} label="Get ERefund" variant="outlined" onClick={()=>{setOpen("refund")}} />
                <Chip icon={<EventRepeatIcon     />} label="Reschedule Reservation" variant="outlined" onClick={()=>{setOpen("reschedule")}} />
                <Chip icon={<DoNotDisturbAltIcon />} label="Cancel Reservation" variant="outlined" onClick={()=>{setOpen("cancel")}} />
                <Box sx={{flexGrow:"1"}} ></Box>
                {variant ==="view"?
                    <Chip icon={<StarIcon />} label="Rate our Service" variant="filled" onClick={()=>{setOpen("rate")}} color="primary" />:""    
                }
                {variant ==="manage"?
                    <Chip icon={<AddIcon />} label="Add" variant="filled" onClick={()=>{}} color="primary" />:""    
                }
            </Box>
            <Alert severity="info" sx={{margin:"2em 0"}}>Your requests is pending for verification</Alert>
            <Typography variant="h4" color="primary" sx={{marginTop:"25px"}}>#123A23123</Typography>
            <Typography variant="h6" color="initial" sx={{opacity:".6"}}>Reference Number</Typography>
            
            
            <Paper variant="elevation" elevation={3} sx={{borderRadius:"8px",background:"#e3e3e3",padding:"1em",margin:"2em 0" ,display:"flex",alignItems:"center"}}>
                <Box sx={{flexGrow:"1"}}>
                    <Typography variant="h5" color="initial" fontWeight={500}>Jon Doe</Typography>
                    <Box display="flex" gap={"15px"} mt={1}>
                        <Box display="flex" gap="5px">
                            <CallIcon/>
                            <Typography variant="body1" color="initial">0915-232-1231</Typography>
                        </Box>
                        <Box display="flex" gap="5px">
                            <EmailIcon/>
                            <Typography variant="body1" color="initial">jondoe@gmail.com</Typography>
                        </Box>
                    </Box>
                </Box>
                <Tooltip title="View Receipt">
                    <IconButton aria-label="" onClick={()=>{setOpen("viewReceipt")}} size="large" >
                        <ReceiptLongIcon  fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
                
            </Paper>
            <Typography variant="h6" color="initial">Billing Statement #1</Typography>
            <BookingStatement/>
            <Box sx={{padding:"0 32px"}}>
                <Typography variant="subtitle1" textAlign="end" color="initial" fontWeight={600} sx={{opacity:".6"}}>TOTAL</Typography>
                <Typography variant="h5" textAlign="end" color="initial" fontWeight={600}>₱300</Typography>
            </Box>
            <hr style={{margin:"2em 0"}}/>
            <Typography variant="h6" color="initial">Billing Statement #2</Typography>
            <BookingStatement/>
            <Box sx={{padding:"0 32px"}}>
                <Typography variant="subtitle1" textAlign="end" color="initial" fontWeight={600} sx={{opacity:".6"}}>TOTAL</Typography>
                <Typography variant="h5" textAlign="end" color="initial" fontWeight={600}>₱300</Typography>
            </Box>
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
                        <Grid item md={8} xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker slotProps={{ textField: { fullWidth: true } }} label="Basic date picker" />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item md={4} xs={12} marginTop={"8px"}>
                            <TextField
                                id="reason"
                                label=" Reason"
                                multiline
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginBottom:"25px"}}>
                            <TextField
                                id="reason"
                                label=" Reason"
                                multiline
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={5}>
                            <Button variant="text" onClick={()=>{setOpen("")}} fullWidth>Cancel</Button>
                        </Grid>
                        <Grid item xs={7}>
                            <Button variant="contained" fullWidth>Send</Button>
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
                            />
                        </Grid>



                        <Grid item xs={5} marginBottom={"20px"}>
                            <Button variant="text" onClick={()=>{setOpen("")}} fullWidth>Cancel</Button>
                        </Grid>
                        <Grid item xs={7} marginBottom={"20px"}>
                            <Button variant="contained" fullWidth>Send</Button>
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
                            />
                        </Grid>


                        <Grid item xs={5} marginBottom={"20px"}>
                            <Button variant="text" onClick={()=>{setOpen("")}} fullWidth>Cancel</Button>
                        </Grid>
                        <Grid item xs={7} marginBottom={"20px"}>
                            <Button variant="contained" fullWidth>Send</Button>
                        </Grid>
                    </Grid>
                </>:""}
                {open ==="rate"?<>
                    <Typography id="keep-mounted-modal-title" variant="h6" fontWeight={700} color={"primary"} component="h2">
                        Set Schedule
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{marginBottom:"15px"}}>
                        Specify the date you want to stay with us
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" color="initial">Ratings</Typography>
                            <RateInput/>
                        </Grid>
                        <Grid item xs={12} marginBottom={"20px"}>
                            <Typography variant="subtitle2" sx={{marginBottom:"10px"}} color="initial">Feedback</Typography>
                            <TextField id="feedback" fullWidth multiline/>
                        </Grid>
                        <Grid item xs={5} marginBottom={"20px"}>
                            <Button variant="text" onClick={()=>{setOpen("")}} fullWidth>Cancel</Button>
                        </Grid>
                        <Grid item xs={7} marginBottom={"20px"}>
                            <Button variant="contained" fullWidth>Send</Button>
                        </Grid>
                    </Grid>
                </>:""}
                {open ==="viewReceipt"?<>
                    <Typography id="keep-mounted-modal-title" variant="h6" fontWeight={700} color={"primary"} component="h2">
                        Cancel Reservation
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{marginBottom:"15px"}}>
                        Provide a reason why you want to cancel
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{marginBottom:"25px",overflowY:"scroll",maxHeight:"500px"}}>
                            <img style={{width:"100%"}} src="https://sp-uploads.s3.amazonaws.com/uploads/services/2452054/20220310214231_622a70c730534_gcash_skypay_paybills_10032022173641.png_blurred.jpeg" alt="" />
                        </Grid>


                        <Grid item xs={5} marginBottom={"20px"}>
                            <Button variant="text" onClick={()=>{setOpen("")}} fullWidth>Cancel</Button>
                        </Grid>
                        <Grid item xs={7} marginBottom={"20px"}>
                            <Button variant="contained" fullWidth>Send</Button>
                        </Grid>
                    </Grid>
                </>:""}
            </Box>
        </Modal>
    </> 
}

export default Invoice