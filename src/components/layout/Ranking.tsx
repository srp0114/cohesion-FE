import React, { useEffect, useState } from "react";
import { Typography, Divider, Stack } from "@mui/material";
import Profile from "../layout/Profile";
import axios from "axios";
import { useNavigate } from "react-router";
import { FindIcon } from "../data/IconData";
import Shorten from "./Shorten";
import ThumbUp from '@mui/icons-material/ThumbUp';

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
        <Stack p={"1rem"} mb={"1rem"}>
        <Stack direction={"row"} alignItems={"center"} p={"1rem"} spacing={"0.5rem"}>
            <FindIcon name="thumbUp"/>
            <Typography variant="h3" sx={{fontWeight:500}}>Top Posting</Typography>
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
                <Stack sx={{ '&:hover': {
                            backgroundColor: '#f2f2f2',
                            opacity: [1.0, 0.9, 0.9],
                            transform: "scale(1.02)"
                        },
                        borderRadius:2
                        }} 
                        m={"1.5rem 1rem 1rem 1.5rem"}
                        onClick={goToDetails}
                        direction={"row"}
                        alignItems={"center"}
                        spacing={"1.5rem"}
                    >
                    <Typography variant="h4" sx={{fontWeight:500}} mr={"2rem"}>{index+1}위</Typography>
                    <Stack direction={"column"} alignItems={"flex"}>
                    <Typography variant="h6" color="secondary.dark">{boardName}</Typography>
                    <Typography variant="h5">{Shorten(value.title, 10)}</Typography>
                    </Stack>
                </Stack>
                </>
            )
        })}
        </>
        </Stack>
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
         <Stack p={"1rem"}>
            <Stack direction={"row"} alignItems={"center"} p={"1rem"} spacing={"0.5rem"}>
            <FindIcon name="crown" iconProps={{color: "#ffcf40"}}/>
            <Typography variant="h3" sx={{fontWeight:500}}>Top User</Typography>
            </Stack>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <>
        {userRanking.map((value, index) => {
            const studentId = value.studentId.slice(0,2);
            return (
                <>
                <Stack m={"1.5rem 1rem 1rem 1.5rem"} direction={"row"} alignItems={"center"} spacing={"2rem"}>
                    <Typography variant="h4" sx={{fontWeight: 500}} mr={"2rem"}>{index+1}위</Typography>
                    <Profile nickname={value.nickname} imgUrl={value.profileImg} size={33}/>
                    <Typography variant="h5">{Shorten(value.nickname, 8)}</Typography>
                    <Typography variant="h6" color="secondary.dark">{studentId}학번</Typography>
                </Stack>
                </>
            )
        })}
        </>
        </Stack>
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