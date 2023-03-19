import React from 'react';
import Header from '../layout/Header';
import { 
  Typography, 
  Container 
} from '@mui/material';

const Notice: React.FC = () => {
    return (
      <>
        <Container>
        <Header/>
        <Typography variant="h3">공지사항</Typography>
        </Container>
      </>
    );
  }
  
  export default Notice;