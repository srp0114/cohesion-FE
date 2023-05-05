import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, CardActions, Button } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";

interface MyDataProps {
    activity : string;
}

// BoardItems 인터페이스
interface UserActivityItems {
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

const UserActivity = [
    {
        id: 1,
        title: '웹 개발 중 카카오 주소 api 사용 중 궁금한 게 있습니다',
        content: `주소 api에서 검색 결과를 클릭하면 열리는 팝업 창으로 검색 결과 값을 넘기는 방법이 궁금합니다.
        회원 가입 페이지에 만들어 둔 인풋 박스에 값 넘기는 건 예제도 있어서 문제가 없는데, 
        팝업창을 사용하는 경우는 다른 jsp 파일로 값을 넘겨야 해서 어떻게 해야 할지 도무지 감이 안 오네요ㅠㅠ`,
        writer: "young",
        createdDate: "1초전",
        bookmark: 1,
        reply: 5,
    },
    {
        id: 2,
        title: 'c언어 배열 어떻게 해야하나요?',
        content: `제가 이해가 되지 않는 부분은  for (s = 0; s < grade[i]; s++)  입니다.
        1. grade[i] 들어가야 원소 수만큼 *를 출력하는 원리가 무엇인지 궁금합니다.
        2. grade[s] 를 넣어준다면 전부 5개의 *만 출력되는 이유가 무엇인지도 궁금합니다.`,
        writer: "ddd",
        createdDate: '3초 전',
        bookmark: 0,
        reply: 2,
    },
    {
        id:3,
        title: 'c 반복문 질문있습니다',
        content: `문제가 3명의 학생정보를 반복문으로 돌려서 이름, 학과, 주민등록번호를 입력받아서 이름, 생년월일, 윤년 여부, 출생지역(대한민국, 외국), 성별(남자, 여자), 학과 이름을 출력하는건데요.
        우선 반복문을 사용해서, 출력하는건 다 해봤습니다. `,
        writer: "가나다라",
        createdDate: "1시간 전",
        bookmark: 1,
        reply: 3,
    },
]

const MyActivity = (props: MyDataProps) => {
    const [activity, setActivity] = useState<UserActivityItems[]>(UserActivity);

    const activityType = props.activity;

    // 사용자가 작성한 댓글, 선택한 북마크, 작성한 게시글 데이터를 받아올 api 연동 필요
    // 댓글 컴포넌트와 유사하게 activity로부터 reply, bookmark, post 셋중 하나를 받아와서 url에 적용
    // ex) /api/${userId}/${activity} => /api/102/reply  
    // TODO: 연동 url 추가

    useEffect (()=>{
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
        
    // activityType에 따른 타이틀 변경
    const activityTitle = activityType === "summary" ? "공부기록" :
        activityType === "reply" ? "작성한 댓글" :
        activityType === "bookmark" ? "북마크한 글" :
        activityType === "post" ? "작성한 게시글" : null;

    return (
        <>
            <Typography variant="h4" sx={{mt:"3rem"}}>{activityTitle}</Typography>
            <Box sx={{display:"flex", flexWrap:"wrap", justifyContent: "space-between"}}>
            {activity.map((value) => {
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
                        <Button size="small">자세히 보기</Button>
                    </CardActions>
                    </Card>
                )
            })}
            </Box>
        </>
    )
}

export default MyActivity;