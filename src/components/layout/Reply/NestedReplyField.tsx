import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface NestedReplyProps {
  parentID: number;
  onAddNested: (article:string, parentId: number) => void;
}

// 답글 달기 입력창 컴포넌트
const FreeNestedReply = (props: NestedReplyProps) => {
  const [replyArticle, setReplyArticle] = useState<string>("");
  const [openReplyField, setOpenReplyField] = useState<boolean>(false);

  // 답글 게시 버튼 클릭 시 적용될 핸들러
  const onReplySumbit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    props.onAddNested(replyArticle, props.parentID);
    setReplyArticle('');
    setOpenReplyField(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyArticle(e.target.value);  
  };

  return (
    <Box>
      <Button onClick={()=>{ setOpenReplyField(!openReplyField)}}>답글</Button>
      {openReplyField && 
        <>
        <TextField 
        variant="standard" 
        placeholder="답글달기.."
        multiline
        value={replyArticle}
        onChange={handleChange}
        />
        <Box display="flex" justifyContent="flex-end">
        <Button size="large" onClick={onReplySumbit}>답글 달기</Button>
        </Box>       
        </> 
      }          
    </Box>
  )
}
  
export default FreeNestedReply;