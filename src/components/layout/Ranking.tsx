import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Profile from "../layout/Profile";
import { shortenContent } from "../pages/Board/QnA/QnABoard";
import axios from "axios";

interface PostRankingItem {
    board: string,
    title: string,
}

interface UserRakingItem {
    adoptSize: number,
    nickname: string
    studentId: string,
}

// 인기유저 테스트 데이터
const postRank: PostRankingItem[] = [
    {
        board: "free",
        title: "제목제목제목제목제목제목"
    },
    {
        board: "free",
        title: "ABCDEFGHIJKLMNOPQRSTU"
    },
    {
        board: "qna",
        title: "가나다라마바사아자차카타파하"
    },
    {
        board: "recruit",
        title: "팀원 구하고 있어요"
    },
    {
        board: "qna",
        title: "질문 있습니다!"
    }
]

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
    const [postRanking, setPostRanking] = useState<PostRankingItem[]>(postRank);

    useEffect(() => {
        axios({
            method: "get",
            // TODO: 인기 게시글 api 추가 필요
            //url: ``,
        })
        .then((res) => {
            if (res.status === 200) {
                setPostRanking(res.data);
            }
        })
        .catch((err) => {
            
        });
    }, []);

    return (
        <Box sx={{ p:2 }}>
        <Typography variant="h6" sx={{mt:20, ml:2, mb:2}}>Top Posting</Typography>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <>
        {postRanking.map((value, index) => {
            const board = value.board
            const boardName: string = board === "free" ? "자유게시판"
            : board === "qna" ? "Q&A게시판"
            : board === "recruit" ? "구인게시판"
            : board === "notice" ? "공지사항" : "";
            return (
                <>
                <Box sx={{ display:"flex", mt:3.5 }}>
                <Typography variant="h6" sx={{mt:"1rem", mr:5, ml:1}}>{index+1}위</Typography>
                <Box>
                    <Typography variant="subtitle2" color="secondary.dark">{boardName}</Typography>
                    <Typography variant="subtitle1">{shortenContent(value.title, 10)}</Typography>
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
        <Typography variant="h6" sx={{mt:10, ml:2, mb:2}}>Top User</Typography>
        <Divider sx={{ borderBottomWidth: 3, borderColor: 'primary.light' }} />
        <>
        {userRanking.map((value, index) => {
            const studentId = value.studentId.slice(0,2);
            return (
                <>
                <Box sx={{ display:"flex", mt:5 }}>
                <Typography variant="h6" sx={{mr:4, ml:1}}>{index+1}위</Typography>
                <Profile nickname={value.nickname} size={33}/>
                <Box sx={{ display:"flex", justifyContent: "flex-end", ml: "1rem", mr:"0.2rem"}}>
                    <Typography variant="subtitle1" sx={{ width:85 }}>{shortenContent(value.nickname, 8)}</Typography>
                    <Typography variant="subtitle2" color="secondary.dark" sx={{mt:0.3}}>{studentId}학번</Typography>
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