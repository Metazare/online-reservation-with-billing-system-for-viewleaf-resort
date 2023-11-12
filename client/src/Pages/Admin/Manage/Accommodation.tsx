import React,{useState} from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccommodationCard from '../../../Components/AccommodationCard';

import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import TESTCalendar from '../../../Components/TESTCalendar';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton'

import ModeEditIcon from '@mui/icons-material/ModeEdit';




const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius:"8px",
    maxHeight:"90vh",
    overflowY:"scroll"
};

function Accommodation() {
    const [open, setOpen] = useState("");

    return <>
        <div>
            <Typography variant="h4" fontWeight={600} color="primary">Manage Accommodations</Typography>
            <Typography variant="h6" fontWeight={400} color="initial" sx={{marginBottom:"2em"}}>List of all Accommodation</Typography>
            <Box display="flex" sx={{margin:"2em 0"}}>
                <Box sx={{flexGrow:"1",display:"flex"}}>
                    <Box display="flex" gap={"10px"} alignItems={"center"} sx={{background:"#D9D9D9",border:"1px solid #B9B9B9",padding:".5em 1em",borderRadius:"1000px"}}>
                        <Box display={"flex"} gap={"8px"}>
                            <Typography variant="subtitle1" fontWeight={600} color="initial">Day Shift:</Typography>
                            <Typography variant="subtitle1" color="initial">8 am to 12 pm</Typography>
                        </Box>
                        <Box display={"flex"} gap={"8px"}>
                            <Typography variant="subtitle1" fontWeight={600} color="initial">Night Shift:</Typography>
                            <Typography variant="subtitle1" color="initial">2 pm to 7 pm</Typography>
                        </Box>
                        <Box display={"flex"} gap={"8px"}>
                            <Typography variant="subtitle1" fontWeight={600} color="initial">Whole Day:</Typography>
                            <Typography variant="subtitle1" color="initial"> 9 am to 6 pm</Typography>
                        </Box>
                        <IconButton aria-label="edit" onClick={()=>{}}>
                            <ModeEditIcon/>
                        </IconButton>
                    </Box>
                </Box>
                <Button variant="contained" color="primary" onClick={()=>{setOpen("addAccommodation")}}>
                    Add Accommodation
                </Button>
            </Box>
            <Box display="flex" gap={"10px"}>
                <AccommodationCard variant="manage" openModal={setOpen}/>
            </Box>
        </div>
        <Modal
            keepMounted
            open={!(open==="")}
            onClose={()=>{setOpen("")}}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                {open === "addAccommodation"?<>
                    <Typography id="keep-mounted-modal-title" variant="h6" fontWeight={700} color={"primary"} component="h2">
                        Add Accommodation
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{marginBottom:"25px"}}>
                        Fill Up Accommodation Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item  md={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Type"
                                >
                                    <MenuItem value={10}>Room</MenuItem>
                                    <MenuItem value={20}>Cottage</MenuItem>
                                    <MenuItem value={30}>Pool</MenuItem>
                                    <MenuItem value={30}>Resort</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item  md={6} xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="pax"
                                label="Pax"
                            />
                        </Grid>
                        <Grid item  xs={12}>
                            <TextField
                                type='text'
                                fullWidth
                                id="Title"
                                label="Title"
                            />
                        </Grid>
                        <Grid item  xs={12}>
                            <TextField
                                type='text'
                                fullWidth
                                id="Description"
                                label="Description"
                                multiline
                                
                            />
                        </Grid>
                        <Grid item  xs={12}>
                            <TextField
                                type='file'
                                fullWidth
                                id="Description"
                            />
                        </Grid>
                        <Grid item md={4}  xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="dayRate"
                                label="Day Shift Rate"
                            />
                        </Grid>
                        <Grid item md={4}  xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="dayRate"
                                label="Night Shift Rate"
                            />
                        </Grid>
                        <Grid item md={4}  xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="dayRate"
                                label="Whole Day Rate"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <hr style={{marginBottom:"1em"}}/>
                            <Typography variant="subtitle1" color="initial">Add Inclusion </Typography>
                        </Grid>
                        <Grid item md={5}  xs={12}>
                            <TextField
                                type='text'
                                fullWidth
                                id="inclusionName"
                                label="Name"
                            />
                        </Grid>
                        <Grid item md={5}  xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="Price"
                                label="Price"
                            />
                        </Grid>
                        <Grid item md={2}  xs={12}>
                            <Button fullWidth variant="contained" color="primary" sx={{height:"100%"}}>
                                Add
                            </Button>
                        </Grid>
                        <Grid item  xs={12}>
                            <Box display="flex" gap={"1em"} >
                                <Chip label="Towel (100) " variant="outlined" onDelete={()=>{}} />
                                <Chip label="Slippers (150) " variant="outlined" onDelete={()=>{}} />
                            </Box>
                        </Grid>
                        <Grid item  xs={12} sx={{margin:"2em"}}>
                            
                        </Grid>
                        <Grid item  xs={4}>
                            <Button variant="text" color="primary" fullWidth onClick={()=>setOpen("")}>
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item  xs={8}>
                            <Button variant="contained" color="primary" fullWidth>
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </>:""}
                {open === "editAccommodation"?<>
                    <Typography id="keep-mounted-modal-title" variant="h6" fontWeight={700} color={"primary"} component="h2">
                        Edit Accommodation
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{marginBottom:"25px"}}>
                        Fill Up Accommodation Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item  md={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Type"
                                >
                                    <MenuItem value={10}>Room</MenuItem>
                                    <MenuItem value={20}>Cottage</MenuItem>
                                    <MenuItem value={30}>Pool</MenuItem>
                                    <MenuItem value={30}>Resort</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item  md={6} xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="pax"
                                label="Pax"
                            />
                        </Grid>
                        <Grid item  xs={12}>
                            <TextField
                                type='text'
                                fullWidth
                                id="Title"
                                label="Title"
                            />
                        </Grid>
                        <Grid item  xs={12}>
                            <TextField
                                type='text'
                                fullWidth
                                id="Description"
                                label="Description"
                                multiline
                                
                            />
                        </Grid>
                        <Grid item  xs={12}>
                            <TextField
                                type='file'
                                fullWidth
                                id="Description"
                            />
                        </Grid>
                        <Grid item md={4}  xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="dayRate"
                                label="Day Shift Rate"
                            />
                        </Grid>
                        <Grid item md={4}  xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="dayRate"
                                label="Night Shift Rate"
                            />
                        </Grid>
                        <Grid item md={4}  xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="dayRate"
                                label="Whole Day Rate"
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <hr style={{marginBottom:"1em"}}/>
                            <Typography variant="subtitle1" color="initial">Add Inclusion </Typography>
                        </Grid>
                        <Grid item md={5}  xs={12}>
                            <TextField
                                type='text'
                                fullWidth
                                id="inclusionName"
                                label="Name"
                            />
                        </Grid>
                        <Grid item md={5}  xs={12}>
                            <TextField
                                type='number'
                                fullWidth
                                id="Price"
                                label="Price"
                            />
                        </Grid>
                        <Grid item md={2}  xs={12}>
                            <Button fullWidth variant="contained" color="primary" sx={{height:"100%"}}>
                                Add
                            </Button>
                        </Grid>
                        <Grid item  xs={12}>
                            <Box display="flex" gap={"1em"} >
                                <Chip label="Towel (100) " variant="outlined" onDelete={()=>{}} />
                                <Chip label="Slippers (150) " variant="outlined" onDelete={()=>{}} />
                            </Box>
                        </Grid>
                        <Grid item  xs={12} sx={{margin:"2em"}}>
                            
                        </Grid>
                        <Grid item  xs={4}>
                            <Button variant="text" color="primary" fullWidth onClick={()=>setOpen("")}>
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item  xs={8}>
                            <Button variant="contained" color="primary" fullWidth>
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                </>:""}
            </Box>
        </Modal>
    </>
}

export default Accommodation