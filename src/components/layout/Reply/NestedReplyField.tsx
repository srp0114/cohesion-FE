import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { Box, TextField, Button, IconButton } from "@mui/material";
import ThumbUP from '@mui/icons-material/ThumbUpOutlined';

interface NestedReplyProps {
    parentID: number;
    url: string;
}

// 답글 달기 입력창 컴포넌트
const FreeNestedReply = ({parentID, url}: NestedReplyProps) => {

    const [replyArticle, setReplyArticle] = useState<string>("");
    const [openReplyField, setOpenReplyField] = useState<boolean>(false);

    const location = useLocation();

    // 답글 게시 버튼 클릭 시 적용될 핸들러
    const onReplySumbit = () => {
      
      // 테스트위해서 임시로 작성
      const data ={
        article : replyArticle,
        parentId : parentID
      }

      axios({
          method : "post",
          url : url,
          headers : {"Content-Type" : "application/json"},
          data : JSON.stringify(data)
      }).then((res)=>{
          if(res.status === 200){
              window.location.reload();
          }
      }).catch((err)=>{
          console.log(err);
      })

      
      // 답글 창 닫기
      setOpenReplyField(false);
      // 답글 필드 비우기
      setReplyArticle("");
      
      // 수정필요
      window.location.href=location.pathname;
    }
    
    return (
        <Box>
          <IconButton><ThumbUP/></IconButton>
          <Button onClick={()=>{ setOpenReplyField(!openReplyField)}}>답글</Button>

          {openReplyField && 
            <>
            <TextField 
                variant="standard" 
                placeholder="답글달기.."
                multiline
                value={replyArticle}
                onChange={(e) => { setReplyArticle(e.target.value) }}
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