import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, IconButton } from "@mui/material";
import ThumbUP from '@mui/icons-material/ThumbUpOutlined';

interface NestedReplyProps {
    parentID?: number;
    postingID?: string;
}

// 답글 달기 텍스트 필드 추가
const FreeNestedReply = ({parentID, postingID}: NestedReplyProps) => {

    const [replyArticle, setReplyArticle] = useState<string>("");
    const [openReplyField, setOpenReplyField] = useState<boolean>(false);

    // 답글 게시 버튼 클릭 시 적용될 핸들러
    const onReplySumbit = () => {
      const data ={
        article : replyArticle,
        parentId : parentID
      }
  
      let response = axios({
        method: "post",
        url: "/api/freeBoards/"+postingID+"/replies", // 테스트를 위해 id 고정
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(data),
      });
			
      //답글 창 닫기
      setOpenReplyField(false);
      //답글 필드 비우기
      setReplyArticle("");
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