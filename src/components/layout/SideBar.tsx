import React from "react";
import { Box, Typography, Divider } from "@mui/material"
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
        <Box sx={{ ml:3, mt:3, mb:5 }}>
        <Box sx={{
                display: "flex",
                justifyContent: "flex-start",
        }}>
            <Profile nickname={nickname} imgUrl={profileImg} size={45}/>
            <Box sx={{display:"flex", justifyContent: "space-around", m:0.8}}>
                <Typography variant="subtitle1" sx={{ pl:1, pr:1 }}>{nickname}</Typography>
                <Typography variant="subtitle1" color="primary.dark">님</Typography>
            </Box>
        </Box>  
        <Box sx={{display:"flex", justifyContent: "flex-start", mt:5, ml: 0.7}}>
            <Typography variant="subtitle1" color="primary.dark">학번</Typography>
            {/*TODO: 사용자 학번 받아오기*/}
            <Typography variant="subtitle1" sx={{ ml:3 }}>{studentId}</Typography>
        </Box>
        <Box sx={{display:"flex", justifyContent: "flex-start", mt:2, ml: 0.7 }}>
            <Typography variant="subtitle1" color="primary.dark">전공</Typography>
            {/*TODO: 사용자 트랙 받아오기*/}
            <Typography variant="subtitle1" sx={{ ml:3 }}>{track1}</Typography>
        </Box>
        </Box>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <Ranking/>
        </>
    )

    return (
        <>
        {isLogging}
        </>
    );
  }
  
  export default SideBar;