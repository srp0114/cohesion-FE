import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Box, Typography, Card, CardContent, CardActions, Button } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import MySummary from "./MySummary"

interface MyDataProps {
    activityType : string;
}

// UserActivityItems 인터페이스
interface UserActivityItems {
    boardType: string;
    id: number;
    title: string;
    content: string;
    writer: string;
    createdDate: string;
    modifiedDate?: string;
    language?: string;
    bookmark: number;
    reply: number;
    point?: number;
}

const MyActivity = (props: MyDataProps) => {
    const [activity, setActivity] = useState<UserActivityItems[]>([]);
    const activityType = props.activityType;
    const navigate = useNavigate();

    useEffect (()=>{
        activityType === "summary" ? setActivity([]) :
        axios({
            method : "get",
            url : `/api/user/${activityType}/mypage`
        }).then((res)=>{
            if(res.status === 200)
                setActivity(res.data);
        }).catch((err)=>{
            console.log(err);
        })
    }, [activityType])
    
    const activityTitle = activityType === "summary" ? "공부기록" :
        activityType === "reply" ? "작성한 댓글" :
        activityType === "bookmark" ? "북마크한 글" :
        activityType === "post" ? "작성한 게시글" : null;

    const goToDetails = (postId: number, boardType: string) => {
        navigate(`/${boardType}/${postId}`);
    }

    return (
        <>
        <Typography variant="h4" sx={{mt:"3rem"}}>{activityTitle}</Typography>
            <Box sx={{display:"flex", flexWrap:"wrap", justifyContent: "space-between"}}>
                {activityType === "summary" ? <MySummary/> :
                activity.length === 0 ? 
                    <Typography variant="h2" textAlign="center" p={5} color="primary.dark">아직 {activityTitle}이 없습니다</Typography> : 
                    activity.map((value) => {
                        return (
                            // TODO: 카드 높이 조정 필요
                            <Card sx={{ width: "48%", mt:"1.5rem", borderRadius:"15px"}}>
                            <CardContent>
                                <Typography variant="subtitle2" color="black" gutterBottom>{value.title}</Typography>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Box>
                                    <Typography variant="subtitle2" color="secondary.dark"> {value.writer}</Typography>
                                    </Box>
                                    <Box sx={{display:"flex"}}>
                                    <BookmarkIcon />
                                    <Typography>{value.bookmark}</Typography>
                                    <ChatIcon sx={{ marginLeft: 1, marginRight: 0.5 }} />
                                    <Typography>{value.reply}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={()=>goToDetails(value.id, value.boardType)}>자세히 보기</Button>
                            </CardActions>
                            </Card>
                        )
                    })
                }
            </Box>  
        </>
    )
}

export default MyActivity;