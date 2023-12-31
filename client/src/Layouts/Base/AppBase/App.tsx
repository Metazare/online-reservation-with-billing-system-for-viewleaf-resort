import React,{useState} from 'react'
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box'
import { AppBar, Typography, Container, IconButton } from '@mui/material';
import logoDrop from '../../../Images/LogoDrop.png'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ModeIcon from '@mui/icons-material/Mode';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { Link } from 'react-router-dom'
import NavItem from './NavItem';
import {useAuth} from '../../../Hooks/useAuth';
import MenuIcon from '@mui/icons-material/Menu';
function App() {
  const {logout, User} = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [sideBar,setSideBar] = useState(false)


  return <>
    <Box display="flex" gap={"25px"} sx={{height:"100%",minHeight:"100vh"}}>
      <AppBar position="relative" sx={{background:"white",maxWidth:"250px" , minHeight:"100%",display: { md: "block", xs: sideBar ? "block" : "none" }}}>
        <div style={{display:"flex",flexDirection:"column"}}>
          <a href="/admin" style={{margin:"40px auto",width:"60%"}}>
            <img width={"100%"} src={logoDrop} alt="" />
          </a>
          <NavItem  title="Dashboard" link="/admin" icon={<SpaceDashboardIcon/>} type={"title"} />

          <Typography variant="h6"  color="initial" sx={{
            padding:".5em 1em",
            color:"#5C5C5C",
          }}> 
            <Box display="flex" gap={"10px"} alignItems={"center"} ><EventAvailableIcon/> Reservation</Box>
          </Typography>
          <NavItem  title="Approval" link="/admin/reservation/approval" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}}/>} type={"subTitle"}/> 
          <NavItem  title="Check In" link="/admin/reservation/checkin" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}}/>} type={"subTitle"}/> 
          <NavItem  title="Check out" link="/admin/reservation/checkout" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}}/>} type={"subTitle"}/>
          <NavItem  title="Cancelled & Declined" link="/admin/reservation/cancelled" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}}/>} type={"subTitle"}/> 
          {/* <NavItem  title="List of Reservation" link="/admin/reservation/list" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}}/>} type={"subTitle"}/> */}
          <NavItem  title="Requests" link="/admin/reservation/requests" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}}/>} type={"subTitle"}/>
          {User().role==="admin"?<>
            <Typography variant="h6"  color="initial" sx={{
                padding:".5em 1em",
                color:"#5C5C5C",
              }}> 
              <Box display="flex" gap={"10px"} alignItems={"center"} ><ModeIcon/> Manage</Box>
            </Typography>
            <NavItem  title="Accommodation" link="/admin/manage/accommodations" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}} />} type={"subTitle"} />
            <NavItem  title="Content" link="/admin/manage/content" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}} />} type={"subTitle"} />
            <NavItem  title="Payment Instruction" link="/admin/manage/paymentInstruction" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}} />} type={"subTitle"} />
            <NavItem  title="Policy" link="/admin/manage/policy" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}} />} type={"subTitle"} />
            <NavItem  title="Privacy" link="/admin/manage/privacy" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}} />} type={"subTitle"} />
            <NavItem  title="Terms & Condition" link="/admin/manage/terms" icon={<FiberManualRecordIcon sx={{transform:"scale(.6)"}} />} type={"subTitle"} />


            <NavItem  title="Reports" link="/admin/report" icon={<AssessmentIcon/>} type={"title"} />
            
            <NavItem  title="Staff" link="/admin/staff" icon={<PersonIcon/>} type={"title"} />
          </>:""}

          {/* <NavItem  title="Notification" link="/admin/notifications" icon={<NotificationsIcon/>} type={"title"} /> */}

        </div>
      </AppBar>
      <Box style={{flexGrow:"1",padding:"1em 1em 4em"}}>
        <Box display="flex" sx={{padding:"1em"}} >
          <Box sx={{flexGrow:"1",display:"flex"}}>
            <IconButton sx={{display:{md:"none", xs:"block"}}} onClick={()=>{setSideBar(!sideBar)}}>
              <MenuIcon/>
            </IconButton>
          </Box>
          <Box display="flex" alignItems={"center"} gap={"5px"} sx={{cursor:"pointer"}} onClick={handleClick}>
            <Typography variant="subtitle1" color="initial">{User().username}</Typography>
            <Avatar
              alt={User().username}
              src="/static/images/avatar/1.jpg"
              />
          </Box>
        </Box>
        <Menu
          id="fade-menu"
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          {User().role==="admin"?"":<MenuItem component={Link} to={'/profile'} >Profile</MenuItem>}
          
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
        <div style={{padding:"4em 1em 1em 0"}} onClick={()=>{
          if(sideBar){
            setSideBar(false)
          }
        }}>
          <Container maxWidth="lg">
            <Outlet/>
          </Container>
        </div>
      </Box>
    </Box>
  </>
}

export default App