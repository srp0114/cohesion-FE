import React, { useState } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";

interface NestedReplyProps {
  parentId: number;
  onAddNested: (article:string, parentId: number) => void;
}

// 답글 달기 입력창 컴포넌트
const NestedReplyField = (props: NestedReplyProps) => {
  const [replyArticle, setReplyArticle] = useState<string>("");
  const [openReplyField, setOpenReplyField] = useState<boolean>(false);

  // 답글 게시 버튼 클릭 시 적용될 핸들러
  const onReplySumbit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    props.onAddNested(replyArticle, props.parentId);
    setReplyArticle('');
    setOpenReplyField(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyArticle(e.target.value);  
  };

  const isDisabled = () => {
    return replyArticle.trim() === '';
  }


  return (
    <Box>
      <Button onClick={()=>{setOpenReplyField(!openReplyField)}} sx={{ m:"1rem" }}>답글</Button>
      {openReplyField && 
        <>
        <Grid container spacing={2} direction="row" sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", pl:"2.5rem", pr:"1.5rem" }}>
        <Grid item xs={8} md={10}>
          <TextField
            placeholder="답글달기.."
            variant="standard"
            multiline
            value={replyArticle}
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <Button disabled={isDisabled()} onClick={onReplySumbit}>답글달기</Button>
        </Grid>
        </Grid>
        </> 
      }          
    </Box>
  )
}
  
export default NestedReplyField;