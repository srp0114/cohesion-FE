import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";

/**
 * 유저의 기본정보를 나타내는 컴포넌트
 */
export const MyProfile: React.FC = () => {
  return (
    <>
      <Paper
        sx={{
          border: "0.5px solid black",
          borderRadius: "20px",
          padding: "1.125rem",
        }}
      >
        <Grid
          container
          rowSpacing={{ xs: "2.5rem" }}
          direction="column"
          sx={{ padding: "0 3rem", textAlign: "center" }}
        >
          <Grid item>
            <Typography>HANSUNG UNIVERSITY</Typography>
            <Typography>COMPUTER ENGINEERING</Typography>
          </Grid>
          <Grid item>
            <img
              src="https://pbs.twimg.com/profile_images/1212031261297930241/p6kIo01N_400x400.jpg"
              width="250px"
              height="250px"
              style={{ border: "1px solid black" }} />
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="body1">닉네임</Typography>
              <Typography variant="h6">종강시켜주세요</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="body2">소속트랙</Typography>
              <Typography variant="h6">디지털콘텐츠 가상현실</Typography>
              <Typography variant="h6">웹공학</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Typography>COHENSION</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
