import React from "react";
import { Box, Typography, Divider } from "@mui/material"
import UserProfile from "boring-avatars";
import Ranking from "./Ranking";

interface HomeSideProps {
    nickname: string
}

const SideBar = (props: HomeSideProps) => {
    const nickname = props.nickname;

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
            <UserProfile
                name={nickname}
                size={45}
                variant="beam"
                colors={["#58B76B", "#FFE045", "#B5CC6C", "#AED62E", "#87D241"]}
            />
            <Box sx={{display:"flex", justifyContent: "space-around", m:0.8}}>
                <Typography variant="subtitle1" sx={{ pl:1, pr:1 }}>김서영{nickname}</Typography>
                <Typography variant="subtitle1" color="primary.dark">님</Typography>
            </Box>
        </Box>  
        <Box sx={{display:"flex", justifyContent: "flex-start", mt:5, ml: 0.7}}>
            <Typography variant="subtitle1" color="primary.dark">학번</Typography>
            {/*TODO: 사용자 학번 받아오기*/}
            <Typography variant="subtitle1" sx={{ ml:3 }}>2071274</Typography>
        </Box>
        <Box sx={{display:"flex", justifyContent: "flex-start", mt:2, ml: 0.7 }}>
            <Typography variant="subtitle1" color="primary.dark">전공</Typography>
            {/*TODO: 사용자 트랙 받아오기*/}
            <Typography variant="subtitle1" sx={{ ml:3 }}>웹공학트랙</Typography>
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