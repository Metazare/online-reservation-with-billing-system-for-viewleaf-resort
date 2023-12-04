import React,{useEffect}from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import useContent from '../../Hooks/useContent'
function Policy() {
  const {data:content, loading:contentLoading, error:contentError, getContent} = useContent();
  useEffect(()=>{
    getContent();
  },[])

  if (contentLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Container maxWidth="lg" sx={{padding:"6em 0 7em"}}>
      <Typography variant="h4" color="primary" fontWeight={600}>Policy</Typography>
      <Typography variant="body1" color="initial" fontWeight={400} mb={"20px"}>Here are you can see information about our resort</Typography>
      <div style={{marginTop:"25px",marginBottom:"25px"}}>
        <iframe
          title="PDF Viewer" 
          src={content?.payment} 
          width="100%"
          height="800px" 
        />
      </div>
    </Container>
  )
}

export default Policy