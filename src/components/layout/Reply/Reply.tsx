import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Button, Grid } from "@mui/material";
import ReplyField from "./ReplyField";
import NestedReplyField from "./NestedReplyField";
import AdoptReply from "./AdoptReply";
import Time from "../Time";
import Profile from "@mui/icons-material/AccountCircle";
import EditReplyField from "./EditReplyField";
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
  postingId: string, // 게시글 번호
  board: string; // 게시판 유형
  writerId?: number; // Q&A 채택을 위한 게시글 작성자 학번
}

const Reply = (props: ReplyProps) => {
  const [replyData, setReplyData] = useState<ReplyItems[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const [isChosen, setIsChosen] = useState<boolean>(false);

  const [editReplyId, setReplyId] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const id = props.postingId;
  const board = props.board;
  const writerId = props.writerId;

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

    // Q&A 게시판인 경우 해당 게시글 채택 댓글이 있는지 받아올 api 추가
    // url - 해당 게시글 번호 오류 발생
    // TODO: url /api/qna/${id}/adopt-check 로 수정
    if (board==="qna") {
      axios({
        method : "get",
        url : `/api/qna/1/adopt-check`
      }).then((res)=>{
          if(res.status===200) {
            console.log(res)
          }
      }).catch((err)=>{
          console.log(err);
      })
    }
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

  // 수정 버튼 클릭한 경우 - 기존 댓글 내용이 수정창으로 변경
  const editReply = (id: number, article: string, parentId?: number) => {
    setIsEditing(false);

    const data = {
      id : id,
      article: article,
      parentId: parentId,
    };

    // 변경 api
    axios({
      method: "put",
      url: `/api/${board}/update/replies`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    })
      .then((res) => {
          if(res.status===200){
            const editedReply = res.data;
            const newReplyData = replyData.map((reply)=>{
                if(reply.id === editedReply.id){
                    return {...reply, ...editedReply, showEditForm:false};
                }
                return reply;
            });
              setReplyData(newReplyData);
          }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteReply = (replyId : number) => {
      axios({
          method : "delete",
          url : `/api/${board}/delete/${replyId}/replies`
      }).then((res)=>{
          console.log(res.data);
          setReplyData(replyData.filter((reply) => reply.id !== replyId));
      }).catch((err)=>{
          console.log(err);
      })

  };

  // 수정 버튼 클릭 시, 적용될 핸들러
  const editHandler = (id: number) => {
    setReplyId(id);
    setIsEditing(true);
  };

  // 채택하기 변경되는 경우 값 넘어올 핸들러
  // data 보내는 경우 isChosen: replyCheck 으로 값 지정
  const handleChooseReply = (isChosen: boolean) => {
    setIsChosen(isChosen);
    console.log(isChosen);
  };

  // Q&A 게시판인 경우 상세보기로부터 받아온 작성자의 userId와 로그인한 사용자의 userId 비교 후 동일한 경우 채택버튼 출력
  const Article = (article: string, id:number) => {
    return (
      <>
        {board === "qna" ? (
          // Q&A 게시판인 경우
          <Grid container spacing={2}>
            <Grid item xs={11}>
              <div className="ql-snow">
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: article }}
                />
              </div>
            </Grid>
            {userId === writerId ? (
              <Grid item>
                <AdoptReply replyId={id} onReplyCheck={handleChooseReply} isChosen={isChosen} />
              </Grid>
              ) : (null)
            }
          </Grid>
        ) : (
          // 그 외 나머지 게시판이 경우
          <Typography>{article}</Typography>
        )}
      </>
    );
  };

  // 수정 버튼 클릭에 따른 컴포넌트 전환
  const Edit = (article: string, id: number, parentId?: number) => {
    return editReplyId === id && isEditing ? (
      <EditReplyField
        id={id}
        article={article}
        parentId={parentId}
        isEditing={isEditing}
        onChangeReply={editReply}
      />
    ) : (
      <>{Article(article, id)}</>
    );
  };

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
                <Box>
                  {reply.user.id === userId ? (
                    <>
                      <Button onClick={() => editHandler(reply.id)}>
                        수정
                      </Button>
                      <Button onClick={() => deleteReply(reply.id)}>
                        삭제
                      </Button>
                    </>
                  ) : null}
                </Box>
              </Box>
              <Box>
                <Typography sx={{ ml: 5, mt: 1, whiteSpace: "pre-wrap" }}>
                  {Edit(reply.article, reply.id, reply.parentId)}
                </Typography>
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
              <Box>
                {value.user.id === userId ? (
                  <>
                    <Button onClick={() => editHandler(value.id)}>수정</Button>
                    <Button onClick={() => deleteReply(value.id)}>삭제</Button>
                  </>
                ) : null}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                ml: 3,
                mt: 2,
                mr: 3,
                whiteSpace: "pre-wrap",
              }}
            >
              {Edit(value.article, value.id)}
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
      <ReplyField onAddReply={handleAddReply} board={props.board} />
      {reply}
    </>
  );
};

export default Reply;