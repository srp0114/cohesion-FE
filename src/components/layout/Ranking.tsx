import React, { useEffect, useState } from "react";
import { Grid, Box, Typography, Divider, Stack } from "@mui/material";
import Profile from "../layout/Profile";
import axios from "axios";
import { useNavigate } from "react-router";
import { FindIcon } from "../data/IconData";
import Shorten from "./Shorten";

interface PostRankingItem {
    id: number,
    boardType: string,
    title: string,
}

interface UserRakingItem {
    adoptSize: number,
    nickname: string,
    studentId: string,
    profileImg: string | null

}

// 인기게시글 컴포넌트
export const PostRanking = () => {
    const naviagate = useNavigate();
    const [postRanking, setPostRanking] = useState<PostRankingItem[]>([]);

    useEffect(() => {
        axios({
            method: "get",
            url: `/api/popular`
        })
        .then((res) => {
            if (res.status === 200) {
                setPostRanking(res.data);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <Box sx={{ p:2 }}>
        <Stack direction={"row"} alignItems={"center"}>
            <FindIcon name="thumbUp"/>
            <Typography variant="h3">Top Posting</Typography>
        </Stack>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <>
        {postRanking.map((value, index) => {
            const board = value.boardType;

            const id = value.id;

            const boardName: string = board === "free" ? "자유게시판"
            : board === "questions" ? "Q&A게시판"
            : board === "recruit" ? "구인게시판"
            : board === "notice" ? "공지사항" : "";

            const goToDetails = () => {
                naviagate(`${board}/${id}`)
            }

            return (
                <>
                <Box sx={{ display:"flex", mt:3.5 }} onClick={goToDetails}>
                <Typography variant="h4" sx={{mt:"0.5rem", mr:5, ml:1}}>{index+1}위</Typography>
                <Box sx={{'&:hover': {
                            backgroundColor: '#f2f2f2',
                            opacity: [1.0, 0.9, 0.9],
                        }}}>
                    <Typography variant="h6" color="secondary.dark">{boardName}</Typography>
                    <Typography variant="h5">{Shorten(value.title, 10)}</Typography>
                </Box>
                </Box>
                </>
            )
        })}
        </>
        </Box>
    )
}

// 인기유저 컴포넌트
export const UserRanking = () => {
    const [userRanking, setUserRanking] = useState<UserRakingItem[]>([]);

    useEffect(() => {
        axios({
            method: "get",
            url: `/api/user-rank`,
        })
        .then((res) => {
            if (res.status === 200) {
                setUserRanking(res.data);
            }
        })
        .catch((err) => {
            
        });
    }, []);

    return (
        <Box sx={{ p:2 }}>
        <Stack direction={"row"} alignItems={"center"}>
        <FindIcon name="crown"/>
        <Typography variant="h3">Top User</Typography>
        </Stack>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <>
        {userRanking.map((value, index) => {
            const studentId = value.studentId.slice(0,2);
            return (
                <>
                <Grid container direction="row" sx={{ display:"flex", mt:5, alignItems:"center" }}>
                <Typography variant="h4" sx={{mr:4, ml:1}}>{index+1}위</Typography>
                <Profile nickname={value.nickname} imgUrl={value.profileImg} size={33}/>
                <Box sx={{ display:"flex", justifyContent: "flex-end", ml: "1.5rem", mr:"0.2rem",
            
            '&:hover': {
                            backgroundColor: '#f2f2f2',
                            opacity: [1.0, 0.9, 0.9],
                        },
                        }}>
                    <Typography variant="h5" sx={{ width:85 }}>{Shorten(value.nickname, 8)}</Typography>
                    <Typography variant="h6" color="secondary.dark" sx={{mt:0.3}}>{studentId}학번</Typography>
                </Box>
                </Grid>
                </>
            )
        })}
        </>
        </Box>
    )
}

const Ranking = () => {
    return(
        <>
        <PostRanking/>
        <UserRanking/>
        </>
    )
}

export default Ranking;