import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import {  Box, TextField, Button } from "@mui/material";
import EditorToolbar from "../EditorToolbar";

interface ReplyProps{
    onAddReply: (article:string) => void;
    board: string;
}
  
// 댓글 입력창 컴포넌트 
const ReplyField = (props : ReplyProps) => {

    const[article, setArticle] = useState<string>("");

    const onSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        props.onAddReply(article);
        setArticle('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setArticle(e.target.value);
    };
        
    const getArticle = (value: string) => {
        setArticle(value);
    };
    
    const ReplyForm = props.board === "qna" ? 
    <EditorToolbar onAddQuill={getArticle}/>
    : <TextField
                fullWidth
                placeholder="댓글을 입력하세요."
                variant="outlined"
                multiline
                sx={{ mt: 2, mb: 2}}
                value={article}
                onChange={handleChange}
            />

    return (
        <>
        <Box>
            {ReplyForm}
            <Box display="flex" justifyContent="flex-end">
                <Button onClick={onSubmit} size="large">작성하기</Button>
            </Box>
        </Box>
        </>
    )
}

export default ReplyField;