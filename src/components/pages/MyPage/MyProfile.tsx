import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { Track } from "../../model/user";

/**
 * 유저의 기본정보를 나타내는 컴포넌트
 */
interface MyProfileProps {
  nickname: string;
  track1: string;
  track2: string;
  profileImg: string;
}

export const MyProfile = (props: MyProfileProps) => {
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
              srcSet={props.profileImg}
              width="250px"
              height="250px"
              style={{ border: "1px solid black" }} />
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="body1">닉네임</Typography>
              <Typography variant="h6">{props.nickname}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="body2">소속트랙</Typography>
              <Typography variant="h6">{props.track1}</Typography>
              <Typography variant="h6">{props.track2}</Typography>
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
