import React, {useEffect} from 'react'
import Typography from '@mui/material/Typography'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import { useParams, useNavigate } from 'react-router-dom';

import useReservation from '../../../Hooks/useReservation'
import useContent from '../../../Hooks/useContent'
import useFirebase from '../../../Hooks/useFirebase';
import { Button } from '@mui/material';

function Payment() {
  const {id} = useParams();
  const navigate = useNavigate();
  const {
    data: reservation, 
    loading: reservationLoading, 
    error: reservationError, 
    getReservation,
    payReservation,
    updateReservation
  } = useReservation();
  const {data: content, loading: contentLoading, error: contentError, getContent} = useContent();
  const {downloadURL, uploading, uploadFile } = useFirebase();


  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(downloadURL)
    console.log(id)
    payReservation({
      reservationId: id||"",
      receipt: downloadURL
    })
    updateReservation({
      reservationId: id||"",
      status: "paid",
      note: "Paid"
    })
    navigate(`/reservation/${id}`);
  }

  useEffect(()=>{
    getReservation({reservationId:id});
    getContent();
  }, [])

  if (reservationLoading || contentLoading) {
    return <div>Loading...</div>
  }

    return <>
      <form onSubmit={submit}>
        <Container maxWidth="lg" sx={{padding:"6em 0 7em"}}>
          <Typography variant="h4" color="primary" fontWeight={600}>Payment</Typography>
          <Typography variant="body1" color="initial" fontWeight={400} mb={"20px"}>You can follow the instruction Below</Typography>
          <Box display="flex" gap={4}>
            <Box >
              <Typography variant="subtitle2" color="initial" sx={{opacity:'.6'}}>Total</Typography>
              <Typography variant="h6" color="initial" fontWeight={600}>₱1,150</Typography>
            </Box>
            <Box >
              <Typography variant="subtitle2" color="initial" sx={{opacity:'.6'}}>Min. Payment</Typography>
              <Typography variant="h6" color="initial" fontWeight={600}>₱400</Typography>
            </Box>
          </Box>
          <div style={{marginTop:"25px",marginBottom:"25px"}}>
              {/* Replace this div if will put the PDF viewer */}
            <div style={{background:"#D9D9D9",height:"100vh",borderRadius:"8px",display:"flex",justifyContent:"center",alignItems:"center",maxHeight:"1100px"}}>
              <Box>
                <iframe
                  title="PDF Viewer" 
                  src={content?.payment} 
                  width="100%"
                  height="800px" 
                />
              </Box>
            </div>
            </div>
            <div style={{display:"flex",alignItems:"center"}}>
                <FormControlLabel control={<Checkbox defaultChecked />} label="I agree with ViewLeaf's" />
                <Typography variant="body1" component={"a"} fontWeight={500} color="initial" marginLeft={"-12px"}>Policies</Typography>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",margin:"2em 0"}}>
              <img width={"50%"} src={downloadURL} alt="" />
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",margin:"2em 0",gap:'15px'}}>
                <input required type="file" name="upload" id="upload" style={{display:"none"}} onChange={(e:any)=>{uploadFile(e.target.files[0], 'orbs')}}/>
                <label htmlFor="upload">
                  <Chip label="Upload Payment Receipt " variant="outlined" onClick={()=>{}}/>
                </label>
                {/* <Chip label="Send" variant="filled" color='primary' sx={{color:"white"}} onClick={()=>{}}/> */}
                <Button variant="contained" color="primary" type="submit">
                  Pay Now
                </Button>
            </div>
        </Container>
      </form>
    </>
}

export default Payment