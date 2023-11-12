import React from 'react'
import Typography from '@mui/material/Typography'
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import ReportCard from '../../Components/ReportCard';
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
function Dashboard() {
    const [anchorElMoreMenu, setAnchorElMoreMenu] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorElMoreMenu);
 
    
    return (
        <div>
            <Typography variant="h4" fontWeight={600} color="primary">Dashboard</Typography>
            <Typography variant="h6" fontWeight={400} color="initial" sx={{marginBottom:"2em"}}>Here are the list of reservation for today</Typography>
            <Grid container spacing={2}>
                <Grid item  md={9}>
                    <Box display="flex"  gap={"15px"}>
                        <Box sx={{flexGrow:"1"}}>
                            <Box sx={{ display: 'flex', alignItems: 'center',background:"white", width:"300px",padding:"0 0 0 .5em",border:"1px solid #B5B5B5", borderRadius:"8px"}}>
                                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                <input placeholder='Search...' type="text" style={{border:"none",outline:"none", height:"38px",width:"100%",marginRight:"5px"}}/>
                            </Box>
                        </Box>
                        <Button variant="contained" color="primary"  href='/admin/reservation/create'>
                            Add Reservation
                        </Button>
                    </Box>

                    <TableContainer sx={{marginTop:"25px"}}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Reference No.</TableCell>
                                    <TableCell >Name</TableCell>
                                    <TableCell >Check In </TableCell>
                                    <TableCell >Check Out </TableCell>
                                    <TableCell >Status </TableCell>
                                    <TableCell ></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                <TableRow sx={{background:"#D7D7D7"}}>
                                    <TableCell >#2W23e23</TableCell>
                                    <TableCell >Jon Doe</TableCell>
                                    <TableCell >Oct 25, 2023 at 10 am</TableCell>
                                    <TableCell >Oct 25, 2023 at 1 pm</TableCell>
                                    <TableCell ></TableCell>
                                    <TableCell align='right'>
                                        <IconButton aria-label="" 
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                setAnchorElMoreMenu(event.currentTarget);
                                            }}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{background:"#D7D7D7"}}>
                                    <TableCell >#2W23e2</TableCell>
                                    <TableCell >Row Chris</TableCell>
                                    <TableCell >Oct 25, 2023 at 10 am</TableCell>
                                    <TableCell >Oct 25, 2023 at 1 pm</TableCell>
                                    <TableCell ></TableCell>        
                                    <TableCell align='right'>
                                        <IconButton aria-label="" 
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                setAnchorElMoreMenu(event.currentTarget);
                                            }}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item  md={3}>
                    <Box display="flex" flexDirection={"column"} gap={"15px"} >
                        <ReportCard variant='reservation' title={"Today’s Reservation"} value={5}/>
                        <ReportCard variant='accommodation' title={"Today’s Accommodation"} value={25}/>
                    </Box>
                </Grid>
            </Grid>
            <Menu
                id="basic-menu"
                anchorEl={anchorElMoreMenu}
                open={openMenu}
                onClose={()=>setAnchorElMoreMenu(null)}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={()=>setAnchorElMoreMenu(null)}>View Invoice</MenuItem>
                <MenuItem onClick={()=>setAnchorElMoreMenu(null)}>Additional</MenuItem>
                <MenuItem onClick={()=>setAnchorElMoreMenu(null)}>Reschedule</MenuItem>
                <MenuItem onClick={()=>setAnchorElMoreMenu(null)}>Cancel</MenuItem>
            </Menu>
        </div>
    )
}

export default Dashboard