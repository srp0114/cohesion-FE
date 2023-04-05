import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import {  Box, TextField, Button } from "@mui/material";

interface ReplyProps{
    url: string;
}
  
// 댓글 입력창 컴포넌트 
const ReplyField = ({url} : ReplyProps) => {

    const[article, setArticle] = useState<string>("");

    const location = useLocation();

    const onSubmit = () => {
        
        const data ={
            article : article
        }

        let response = axios({
            method: "post",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
        });
        
        // 텍스트필드 값 지우기
        setArticle("");    
        
        // 수정 필요
        window.location.href=location.pathname;  
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