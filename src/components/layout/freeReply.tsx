import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import ReplyField from "./ReplyField";
import Profile from "@mui/icons-material/AccountCircle";

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
  
// 상위 컴포넌트로 부터 게시글 id 값 받아오기 
const FreeReply: React.FC<ReplyProps> = ({postingID}) => {

  const[replyData ,setReplyData] = useState<ReplyItems[]>([]);

  useEffect(()=>{
      axios
      .get("/api/freeBoards/"+postingID+"/replies")
      .then((res)=>setReplyData(res.data));
  },[replyData]);
  
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
              <Typography variant="subtitle2" sx={{ ml: 1 }}> {reply.createdAt}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ ml: 5, mt: 1, mb: 5 }}>{reply.article}</Typography>
          </Box>
          {replyContainer(replies, reply.id)}
        </div>
      ))}
    </Box>
  );
};

const reply = replyData.filter((reply) => !reply.parentId).length ?  (
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
            <Typography variant="subtitle2" sx={{ml: 1}}> {value.createdAt}</Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ml: 5, mt: 1, mb: 5}}>{value.article}</Typography>
        </Box>
        {replyContainer(replyData,value.id)}
      </div>
    )
  })
  
) : (<Typography variant="h6" sx={{color:"grey", m:2}}>아직 댓글이 없습니다.</Typography>)

  return (
    <>
      <ReplyField postingID={postingID} />
      {reply}
    </>
  );
};

export default FreeReply;
