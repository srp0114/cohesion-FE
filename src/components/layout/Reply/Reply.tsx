import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Button } from "@mui/material";
import ReplyField from "./ReplyField";
import NestedReplyField from "./NestedReplyField";
import Checkbox from "./ReplyCheckbox";
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
  board: string;
  postingId: string;
}

const Reply = (props: ReplyProps) => {
  const [replyData, setReplyData] = useState<ReplyItems[]>([]);
  const [userId,setUserId] = useState<Number>(0);
  const [replyCheck, setReplyCheck] = useState<boolean>(false);

  // 기존 FreeReply, QnAReply를 삭제하고 Reply로 통일 (api 주소, 작성창, 체크박스 외 동일해서)
  // Details 컴포넌트에서 Reply 컴포넌트 호출 시 해당 게시판, 게시판 번호 전달
  // Reply 컴포넌트에서 해당 게시판과 게시판 번호 받아서 api에 적용하도록 변경
  // QnA 게시판도 댓글 작성, 답글 작성 확인가능한 상태
  // 댓글 수정, QnA게시판인 경우 채택 api 작업 필요

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

  // 답글 추가 핸들러
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

  const editReply = (parentId: number) => {
    // 변경 api 추가
    //수정 창 생기고 진행
  };

  const deleteReply = (replyId : Number) => {
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

  // 체크박스 변경되는 경우 값 넘어올 핸들러
  // 댓글 추가 핸들러 axios에 해당 데이터 추가 시도 -> 그럼 댓글이 계속 생성(get)
  // 우선 data 보내는 경우 isChosen: replyCheck 으로 값 지정
  const handleCheckReply = (isChosen: boolean) => {
    setReplyCheck(isChosen);
    console.log(isChosen);
  }

  //qna 게시판인 경우 체크박스 출력
  const ReplyCheckbox = board === "qna" ? (<Checkbox onReplyCheck={handleCheckReply}/>) : (null);

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
                    <Button onClick={()=>editReply(reply.id)}>수정</Button>
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
                    <Button onClick={()=>editReply(value.id)}>수정</Button>
                    <Button onClick={()=>deleteReply(value.id)}>삭제</Button>
            </> : null}</Box>
            </Box>
            <Box sx={{display:"flex", justifyContent:"space-between"}}>
              <Typography sx={{ ml: 5, mt: 1, whiteSpace: "pre-wrap"}}>{value.article}</Typography>
              {ReplyCheckbox}
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
      <ReplyField onAddReply={handleAddReply} />
      {reply}
    </>
  );
};

export default Reply;
