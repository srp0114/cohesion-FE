import React, { useState, useEffect } from "react";
import axios from "axios";
import {  Typography, Box, TextField, Button } from "@mui/material";
import Time from "../Time";
import Profile from '@mui/icons-material/AccountCircle';
import ReplyField from "./ReplyField";
import NestedReplyField from "./NestedReplyField";
import { useNavigate } from "react-router-dom";

interface User {
  id : number;
  nickname : string;
}

interface ReplyItems{
  id: number;
  user: User;
  article: string;
  createdAt: string;
  modifiedDate?: string;
  parentId?: number;
  isChosen?: boolean;
  reports?: number;
}

interface ReplyProps{
  postingID?: string;
}

const Reply = ({postingID} : ReplyProps) => {

  const[replyData ,setReplyData] = useState<ReplyItems[]>([]);
  const navigate = useNavigate();

  const url = `/api/qnaBoards/${postingID}/replies`;
  
  useEffect(()=>{
      axios({
          method : "get",
          url : url,
      }).then((res)=>{
          setReplyData(res.data);
      }).catch((err)=>{
          console.log(err);
      })
  },[])

  // 댓글 필드 및 버튼 컴포넌트 
  const ReplyField = () => {

    const[article,setArticle] = useState<string>("");

    // 댓글 게시 버튼 클릭 시 적용될 핸들러
    const onSubmit = () => {
      
      // 작성 버튼 클릭한 경우
      // 데이터 보낼 axios 구현
      const data ={
        article : article
      }
        axios({
            method : "post",
            url : "/api/qnaBoards/"+postingID+"/replies",
            headers : {"Content-Type" : "application/json"},
            data : JSON.stringify(data)
        }).then((res)=>{
            if(res.status === 200){
                window.location.reload();
            }
        }).catch((err)=>{
            console.log(err);
        })
      
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

  // 대댓글이 들어갈 컨테이너 (테스트용으로 임시로 해놨습니다. 바꿔주시면 됩니다!)
  const replyContainer = (replies: ReplyItems[], parentId?: number) => {
    const filteredReplies = parentId ? replies.filter((reply) => reply.parentId === parentId) : replies;

    return filteredReplies.length > 0 && (
      <Box sx={{ ml: 6 }}>
        {filteredReplies.map((reply) => (
          <div key={reply.id}>
            <Box sx={{ display: 'flex', mt: 5 }}>
              <Profile fontSize="large" />
              <Box sx={{ mt: 0.3 }}>
                <Typography variant="h6" sx={{ ml: 1 }}>{reply.user.nickname}</Typography>
                <Typography variant="subtitle2" sx={{ ml: 1 }}>               
                  <Time date={reply.createdAt}/> 
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography sx={{ ml: 5, mt: 1, mb: 5 }}>{reply.article}</Typography>
            </Box>
            <NestedReplyField parentID={reply.id} url={url}/>
            {replyContainer(replies, reply.id)}
          </div>
        ))}
      </Box>
    );
  };

  const reply = replyData.filter((reply) => !reply.parentId).length ?   (
    replyData.filter((reply) => !reply.parentId).map((value) => {
      return (
        <div key={value.id}>
          <Box sx={{
            display: 'flex', 
            mt:5 
          }}>
            <Profile fontSize="large"/>
            <Box sx={{mt:0.3}}>
              <Typography variant="h6" sx={{ml: 1}}>{value.user.nickname}</Typography>            
              <Typography variant="subtitle2" sx={{ml: 1}}>  
                <Time date={value.createdAt}/> 
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ml: 5, mt: 1 }}>{value.article}</Typography>
          </Box>
          <NestedReplyField parentID={value.id} url={url}/>
          {replyContainer(replyData,value.id)}
        </div>
      )
    })
    
  ) : (<Typography variant="h6" sx={{color:"grey", m:2}}>아직 댓글이 없습니다.</Typography>)

  return (
    <>
      {reply}
    </>
  );
};

export default Reply;
