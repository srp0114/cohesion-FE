import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Button, Grid } from "@mui/material";
import ReplyField from "./ReplyField";
import NestedReplyField from "./NestedReplyField";
import PinReply from "./PinReply";
import Time from "../Time";
import Profile from "@mui/icons-material/AccountCircle";

interface User {
  id: number;
  nickname: string;
}

interface ReplyItems {
  id: number;
  user: User;
  article: string;
  createdAt: string;
  modifiedDate?: string;
  parentId?: number;
  isChosen?: boolean;
  reports?: number;
}

interface ReplyProps {
  postingId: string;
  board: string;
}

const Reply = ( props : ReplyProps) => {
  const [replyData, setReplyData] = useState<ReplyItems[]>([]);
  const [userId,setUserId] = useState<number>(0);
  const [isChosen, setIsChosen] = useState<boolean>(false);

  // 기존 FreeReply, QnAReply 삭제 후, Reply로 통일 (api 주소, 작성창, 체크박스 외 동일해서)
  // Details 컴포넌트에서 Reply 컴포넌트 호출 시 해당 게시판, 게시판 번호 전달
  // Reply 컴포넌트에서 해당 게시판과 게시판 번호 받아서 api에 적용하도록 변경
  // Q&A 게시판 댓글 작성, 답글 작성 확인가능
  // TODO : 모집게시판
  // TODO : 댓글 수정, Q&A게시판 -  채택 axios 작업 필요

  let id = props.postingId;
  let board = props.board;

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/${board}/${id}/replies`,
    })
      .then((res) => {
        setReplyData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios({
        method : "get",
        url : "/api/user-id"
    }).then((res)=>{
        if(res.status===200) {
            setUserId(res.data);
        }
    }).catch((err)=>{
        console.log(err);
    })


  }, []);

  // 댓글 추가 핸들러
  const handleAddReply = (article: string) => {
    const data = {
      article: article,
    };
    axios({
      method: "post",
      url: `/api/${board}/${id}/replies`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          const newReply = res.data;
          setReplyData([...replyData, newReply]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddNested = (article: string, parentId: number) => {
    const data = {
      article: article,
      parentId: parentId,
    };

    axios({
      method: "post",
      url: `/api/${board}/${id}/replies`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          const newReply = res.data;
          setReplyData([...replyData, newReply]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editReply = () => {
    // 변경 api 추가
      //수정 창 생기고 진행
  };

  const deleteReply = (replyId : number) => {
    // 삭제 api 추가
      axios({
          method : "delete",
          url : "/api/free/delete/"+replyId+"/replies"
      }).then((res)=>{
          console.log(res.data);
          setReplyData(replyData.filter((reply) => reply.id !== replyId));
      }).catch((err)=>{
          console.log(err);
      })

  };

  // 채택하기 변경되는 경우 값 넘어올 핸들러
  // data 보내는 경우 isChosen: replyCheck 으로 값 지정
  // TODO : 변경된 값 어떻게 전달할지 논의 및 전달
  const handleChooseReply = (isChosen: boolean) => {
    setIsChosen(isChosen);
    console.log(isChosen);
  }

  // Q&A 게시판인 경우 상세보기로부터 받아온 작성자의 id와 현재 사용자 id 비교 후 채택하기 버튼 출력 예정
  // 게시글 작성 시에도 현재 사용자의 id 필요 
  // 현재는 모든 사용자 체크박스 확인 가능
  // TODO : && userId === props.writerId 인 경우에도 버튼 출력하도록 조건 추가
  const ChooseReply = (article: string) => { 
    return board === "qna" ? (
      <>
      <Grid container spacing={2}>
          <Grid item xs={11}>
            <div className="ql-snow">                
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: article }} />
            </div>
          </Grid>
          <Grid item>
            <PinReply onReplyCheck={handleChooseReply} isChosen={isChosen}/>
          </Grid>
      </Grid>
      </>
    ) : ( <Typography>{article}</Typography>);
  }

  //사용자 확인은 해당 접속 유저의 id를 받아온 상태에서 map 함수 안에서 확인 하였습니다.

  const replyContainer = (replies: ReplyItems[], parentId?: number) => {
    const filteredReplies = parentId
      ? replies.filter((reply) => reply.parentId === parentId)
      : replies;

    return (
      filteredReplies.length > 0 && (
        <Box sx={{ ml: 6 }}>
          {filteredReplies.map((reply) => (
              <div key={reply.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <Profile fontSize="large" />
                  <Box sx={{ mt: 0.3 }}>
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {reply.user.nickname}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      <Time date={reply.createdAt} />
                    </Typography>
                  </Box>
                </Box>
                <Box>{reply.user.id === userId ?  <>
                    <Button onClick={editReply}>수정</Button>
                    <Button onClick={()=>deleteReply(reply.id)}>삭제</Button>
                </> : null}</Box>
              </Box>
              <Box>
                <Typography sx={{ ml: 5, mt: 1, whiteSpace: "pre-wrap"}}>{reply.article}</Typography>
              </Box>
              <NestedReplyField
                onAddNested={handleAddNested}
                parentId={reply.id}
              />
              {replyContainer(replies, reply.id)}
            </div>
          ))}
        </Box>
      )
    );
  };

  const reply = replyData.filter((reply) => !reply.parentId).length ? (
    replyData
      .filter((reply) => !reply.parentId)
      .map((value) => {
        return (
          <div key={value.id}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Profile fontSize="large" />
                <Box sx={{ mt: 0.3 }}>
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {value.user.nickname}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ ml: 1 }}>
                    <Time date={value.createdAt} />
                  </Typography>
                </Box>
              </Box>
                <Box>{value.user.id === userId ?  <>
                    <Button onClick={editReply}>수정</Button>
                    <Button onClick={()=>deleteReply(value.id)}>삭제</Button>
            </> : null}</Box>
            </Box>
            <Box sx={{display:"flex", justifyContent:"space-between", ml:3, mt:2, mr: 3, whiteSpace: "pre-wrap" }}>
              {ChooseReply(value.article)}
            </Box>
            <NestedReplyField
              onAddNested={handleAddNested}
              parentId={value.id}
            />
            {replyContainer(replyData, value.id)}
          </div>
        );
      })
  ) : (
    <Typography variant="h6" sx={{ color: "grey", m: 2 }}>
      아직 댓글이 없습니다.
    </Typography>
  );

  return (
    <>
      <ReplyField onAddReply={handleAddReply} board={props.board}/> 
      {reply}
    </>
  );
};

export default Reply;