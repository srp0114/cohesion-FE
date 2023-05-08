import React from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { Track } from "../../model/user";
import Profile from "../../layout/Profile";

/**
 * 유저의 기본정보를 나타내는 컴포넌트
 */
interface MyProfileProps {
  nickname: string;
  studentId: string;
  track1: string;
  track2: string;
  profileImg: string | null;
}

export const MyProfile = (props: MyProfileProps) => {
  return (
    <>
      <Paper
        sx={{
          borderRadius: "15px",
          pt: "2.5rem", pl:"5rem", pr:"2rem", pb:"2.5rem"
        }}
        elevation={3}
      >
        <Grid
          container
          rowSpacing={{ xs: "2.5rem" }}
          direction="column"
        >
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={6} md={5}>
                <Profile nickname={props.nickname} imgUrl={props.profileImg} size={100}/>
              </Grid>
              <Grid item xs={4} md={7} sx={{mt:"1.5rem"}}>
                <Typography variant="subtitle1">{props.nickname}</Typography>
                <Grid container spacing={2} sx={{mt:"2rem"}}>
                  <Grid item>
                  <Typography variant="subtitle2" color="secondary.dark">학번</Typography>
                  </Grid>
                  <Grid item>
                  <Typography variant="subtitle2">{props.studentId}</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{mt:"1rem"}}>
                  <Grid item>
                    <Typography variant="subtitle2" color="secondary.dark">전공</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2">{props.track1}</Typography>
                    <Typography variant="subtitle2">{props.track2}</Typography>
                  </Grid>
                </Grid>
                </Grid>
            </Grid>
          </Grid>
        </Grid>
        </Paper>
        
    </>
  );
};
