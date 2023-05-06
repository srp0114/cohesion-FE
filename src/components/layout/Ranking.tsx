import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Profile from "../layout/Profile";
import { shortenContent } from "../pages/Board/QnA/QnABoard";
import axios from "axios";

interface PostRankingItem {
    boardType: string,
    title: string,
}

interface UserRakingItem {
    adoptSize: number,
    nickname: string
    studentId: string,
}

// 인기게시글 테스트 데이터
const userRank: UserRakingItem[] = [
    {
        adoptSize: 1,
        nickname: "yoddddddung",
        studentId: "182982"
    },
    {
        adoptSize: 2,
        nickname: "dddd",
        studentId: "18222982"
    }
]

// 인기게시글 컴포넌트
export const PostRanking = () => {
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
        <Typography variant="h3" sx={{mt:20, ml:2, mb:2}}>Top Posting</Typography>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <>
        {postRanking.map((value, index) => {
            const board = value.boardType
            const boardName: string = board === "free" ? "자유게시판"
            : board === "questions" ? "Q&A게시판"
            : board === "recruit" ? "구인게시판"
            : board === "notice" ? "공지사항" : "";
            return (
                <>
                <Box sx={{ display:"flex", mt:3.5 }}>
                <Typography variant="h4" sx={{mt:"1rem", mr:5, ml:1}}>{index+1}위</Typography>
                <Box>
                    <Typography variant="h6" color="secondary.dark">{boardName}</Typography>
                    <Typography variant="h5">{shortenContent(value.title, 10)}</Typography>
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
    const [userRanking, setUserRanking] = useState<UserRakingItem[]>(userRank);

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
        <Typography variant="h3" sx={{mt:10, ml:2, mb:2}}>Top User</Typography>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <>
        {userRanking.map((value, index) => {
            const studentId = value.studentId.slice(0,2);
            return (
                <>
                <Box sx={{ display:"flex", mt:5 }}>
                <Typography variant="h4" sx={{mr:4, ml:1}}>{index+1}위</Typography>
                <Profile nickname={value.nickname} imgUrl={undefined} size={33}/>
                <Box sx={{ display:"flex", justifyContent: "flex-end", ml: "1rem", mr:"0.2rem"}}>
                    <Typography variant="h5" sx={{ width:85 }}>{shortenContent(value.nickname, 8)}</Typography>
                    <Typography variant="h6" color="secondary.dark" sx={{mt:0.3}}>{studentId}학번</Typography>
                </Box>
                </Box>
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