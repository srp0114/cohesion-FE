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
          p: "2.5rem 1rem 5rem", 
        }}
        elevation={3}
      >
            <Grid container spacing={2} direction="row" sx={{ display:"flex", justifyContent:"center", alignItems:"center"}} >
              <Grid item sx={{p:"2rem"}}>
                <Profile nickname={props.nickname} imgUrl={props.profileImg} size={100}/>
              </Grid>
              <Grid item sx={{mt:"2rem"}}>
                <Typography variant="subtitle1">{props.nickname}</Typography>
                <Grid container spacing={2} sx={{mt:"1rem"}}>
                  <Grid item>
                    <Typography variant="subtitle2" color="secondary.dark">학번</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2">{props.studentId}</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{mt:"0.5rem"}}>
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
        </Paper>
        
    </>
  );
};
