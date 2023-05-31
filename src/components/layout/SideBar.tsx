import React from "react";
import { Stack, Box, Typography, Grid } from "@mui/material"
import { UserInfoItems } from "../pages/Home";
import Ranking from "./Ranking";
import Profile from "./Profile";

const SideBar = (props: UserInfoItems) => {
    const nickname = props.nickname;
    const studentId = props.studentId;
    const track1 = props.track1;
    const profileImg = props.profileImg;

    const isLogging = nickname === "" ? (
        <>
        <Box sx={{ height:80, borderRadius:6, backgroundColor:"secondary.light"}}>
        <Typography variant="subtitle2" sx={{ p:3.5 }}>로그인이 필요합니다</Typography>
        </Box>    
        </>
    ) : (
        <>
        <Grid container item direction={"column"} spacing={"1rem"}>
        <Box sx={{ ml:3, mt:3, mb:5, border: "2px solid rgba(169, 169, 169, 0.5)", borderRadius: 6, p:"2.5rem 3rem 3rem"}}>
            <Box sx={{
                display: "flex",
                justifyContent: "flex-start",
            }}>
                <Profile nickname={nickname} imgUrl={profileImg} size={45}/>
                <Stack direction={"row"} spacing={1} mt={"1rem"} ml={"1rem"}>
                    <Typography variant="h4" sx={{fontWeight:"500"}}>{nickname}</Typography>
                    <Typography variant="h5" color="primary.dark">님</Typography>
                </Stack>
            </Box>  
            <Box sx={{display:"flex", justifyContent: "flex-start", mt:4, ml: "0.9rem"}}>
                <Typography variant="h5" color="primary.dark">학번</Typography>
                <Typography variant="h5" sx={{ ml:3 }}>{studentId}</Typography>
            </Box>
            <Box sx={{display:"flex", justifyContent: "flex-start", mt:2, ml: "0.9rem" }}>
                <Typography variant="h5" color="primary.dark">전공</Typography>
                <Typography variant="h5" sx={{ ml:3 }}>{track1}</Typography>
            </Box>
        </Box>
        <Ranking/>
        </Grid>
        </>
    )

    return (
        <>
        {isLogging}
        </>
    );
  }
  
  export default SideBar;