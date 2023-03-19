import React from 'react';
import Header from '../layout/Header';
import { 
  Typography, 
  Container 
} from '@mui/material';

const MyPage: React.FC = () => {
    return (
      <>
        <Container>
          <Header/>
          <Typography variant="h3">마이페이지</Typography>
        </Container>
      </>
    );
  }
  
  export default MyPage;