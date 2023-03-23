import React, { useState } from "react";
import { 
  Typography,
  Box
} from "@mui/material";
import Profile from '@mui/icons-material/AccountCircle';

interface ReplyItems {
  postingID: number //게시글 id
  id: number; //댓글 번호
  writer: string;  //작성자
  content: string; //댓글 내용
  createdDate: string; //작성일
  modifiedDate?: string; //수정일
  parentID? : number; //부모 댓글 id
  isChosen?: boolean; //선택여부 - Q&A, 모집게시판에서 사용
  reports: number; //신고
}

//axios get 이전에 UI 확인을 위한 댓글 데이터
const TestReply : ReplyItems[] = [ 
  {
  postingID: 2,
  id: 1,
  writer: "young",
  content: "컴포넌트 매개변수 전달은 props를 이용하시면 됩니다.",
  createdDate: "1초전",
  reports: 0
  },
  {
    postingID: 2,
    id: 2,
    writer: "서영",
    content: "defaultProps로 값을 설정하면 전달할 수 있어요!",
    createdDate: "1시간전",
    reports: 0
  },
]

const Reply: React.FC = () => {
  
  const [replyData, setReplyData] = useState<ReplyItems[] | undefined>(TestReply);
  /*
  초기값 없는 경우(undefiend) -> 댓글 없습니다 출력
  */

  //const [replyData, setReplyData] = useState<DetailItems | undefined>();

  const reply = replyData ? (
    replyData.map((value) => {
      return (
        <>
          <Box sx={{
            display: 'flex', 
            mt:5 
          }}>
            <Profile fontSize="large"/>
            <Box sx={{mt:0.3}}>
              <Typography variant="h6" sx={{ml: 1}}>{value.writer}</Typography>            
              <Typography variant="subtitle2" sx={{ml: 1}}> {value.createdDate}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ml: 5, mt: 1, mb: 5}}>{value.content}</Typography>
          </Box>
        </>
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