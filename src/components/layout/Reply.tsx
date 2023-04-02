import React, { useState,useEffect } from "react";
import { 
  Typography,
  Box
} from "@mui/material";
import Profile from '@mui/icons-material/AccountCircle';
import axios from "axios";

// interface ReplyItems {
//   postingID: number //게시글 id
//   id: number; //댓글 번호
//   writer: string;  //작성자
//   content: string; //댓글 내용
//   createdDate: string; //작성일
//   modifiedDate?: string; //수정일
//   parentID? : number; //부모 댓글 id
//   isChosen?: boolean; //선택여부 - Q&A, 모집게시판에서 사용
//   reports: number; //신고
// }

//axios get 이전에 UI 확인을 위한 댓글 데이터
// const TestReply : ReplyItems[] = [ 
//   {
//   postingID: 2,
//   id: 1,
//   writer: "young",
//   content: "컴포넌트 매개변수 전달은 props를 이용하시면 됩니다.",
//   createdDate: "1초전",
//   reports: 0
//   },
//   {
//     postingID: 2,
//     id: 2,
//     writer: "서영",
//     content: "defaultProps로 값을 설정하면 전달할 수 있어요!",
//     createdDate: "1시간전",
//     reports: 0
//   },
// ]

interface User {
  id : number;
  nickname : String;
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
  id : String | undefined;
}



//상위 컴포넌트로 부터 게시글 id 값 받아오기 
const Reply: React.FC<ReplyProps> = ({id}) => {

  const[replyData ,setReplyData] = useState<ReplyItems[]>([]);
  /*
  초기값 없는 경우(undefiend) -> 댓글 없습니다 출력
  */

  useEffect(()=>{
      axios
      .get("/api/qnaBoards/"+id+"/replies")
      .then((res)=>setReplyData(res.data));
  },[])

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



  const reply = replyData.length ? (
    replyData.map((value) => {
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
    
  ) : (<Typography variant="h5" sx={{color:"grey", m:2}}>아직 댓글이 없습니다.</Typography>)

  return (
    <>
      {reply}
    </>
  );
};

export default Reply;