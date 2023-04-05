import React, { useState } from "react";
import axios from "axios";
import {  Box, TextField, Button } from "@mui/material";

interface ReplyProps{
  postingID?: string;
}
  
// 댓글 필드 및 버튼 컴포넌트 
const ReplyField = ({postingID} : ReplyProps) => {

    const[article, setArticle] = useState<string>("");

    // 댓글 작성 버튼 클릭 시 적용될 핸들러
    const onSubmit = () => {
        // 작성 버튼 클릭한 경우
        // 데이터 보낼 axios 구현
        const data ={
            article : article
        }

        let response = axios({
            method: "post",
            url: "/api/freeBoards/"+postingID+"/replies", // 테스트를 위해 id 고정
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
        });
        
        // 텍스트필드 값 지우기
        setArticle("");    
    }

    return (
        <>
        <Box>
        <TextField
            fullWidth
            placeholder="댓글을 입력하세요."
            variant="outlined"
            multiline
            sx={{ mt: 2, mb: 2}}
            value={article}
            onChange={(e) => { setArticle(e.target.value) }}
        />
        <Box display="flex" justifyContent="flex-end">
        <Button onClick={onSubmit} size="large">작성하기</Button>
        </Box>
        </Box>
        </>
    )
}

export default ReplyField;