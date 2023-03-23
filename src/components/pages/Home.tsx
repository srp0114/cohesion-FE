import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Header from '../layout/Header';
import Banner from '../layout/Banner';
import LeftSidebar from '../layout/LeftSidebar';
import RightSidebar from '../layout/RightSidebar';
import Board from "../layout/Board";
import Board2 from "../layout/Board2";
import { Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import {generateCodeChallenge, generateCodeVerifier} from "../pkce/pkce";

const WritingButton = () => {
  const navigate = useNavigate();

  const goToWriting = () => {
    navigate('/post')
}
  return (
  <Box sx={{ '& > :not(style)': { ml: 120 } }}>
    <Fab size="medium" color="primary" aria-label="edit" onClick={goToWriting}>
    <AddIcon/>
    </Fab>
  </Box>
  )
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    const verifier = generateCodeVerifier();
    sessionStorage.setItem('codeVerifier', verifier);
    const codeChallenge = generateCodeChallenge();
    sessionStorage.setItem('codeChallenge', codeChallenge);

    navigate(`/redirect`)
  };
    return (
      <>
        <button onClick={handleLogin}>로그인</button>
        <Header/>
        <Grid container spacing={2} style={{margin:0}}>   
          <Grid xs>
            <LeftSidebar/>
          </Grid>       
          <Grid xs={7}>
          <Banner/>
            <Grid container spacing={2} style={{margin:0}}>
              <Grid xs>
              <Board/>
              <Board2/>
              </Grid>
              <Grid xs>
              <Board2/>
              <Board/>
              </Grid>
            </Grid>
            <WritingButton/>
          </Grid>
          <Grid xs>
          <RightSidebar/>
          </Grid>
        </Grid>
      </>
    );
  }
  
  export default Home;