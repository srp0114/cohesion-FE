import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Typography, Box, Button, Grid, Divider, Stack } from "@mui/material";
import ReplyField from "./ReplyField";
import NestedReplyField from "./NestedReplyField";
import AdoptReply from "./AdoptReply";
import Time from "../Time";
import Profile from "../Profile";
import EditReplyField from "./EditReplyField";
import EditQuillReply from "./EditQuillReply";
import { BoardType } from "../../model/board";
import { replyCount } from "../postingDetail/replyCount";
import { FindIcon } from "../../data/IconData";
import DoneAll from '@mui/icons-material/DoneAllRounded';

interface User {
  id: number;
  nickname: string;
  profileImg: string | null;
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
  board: BoardType; // 게시판 유형
  writerId?: number; // Q&A 채택을 위한 게시글 작성자 학번
}

interface AdoptReplyProps {
  check: boolean;
  id: number | null;
}

const Reply = (props: ReplyProps) => {
  const [replyData, setReplyData] = useState<ReplyItems[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const [isChosen, setIsChosen] = useState<AdoptReplyProps>({
    check: false,
    id: null
  });
  const [editReplyId, setReplyId] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const id = props.postingId;
  const board = props.board;
  const writerId = props.writerId;

  const getReply = async () => {
    try {
      const res = await axios.get(`/api/${board}/${id}/replies`);
      if (res.status === 200) {
        setReplyData(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  const getAdoptReply = useCallback(() => {
    if (board === "questions") {
      axios({
        method: "get",
        url: `/api/questions/${id}/adopt-check`,
      })
        .then((res) => {
          if (res.status === 200) {
            setIsChosen(res.data);
            console.log(res.data)

          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [board, id, isChosen]);

  useEffect(() => {
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

    getReply();
    getAdoptReply();
  }, [board, id, getAdoptReply]);

  const handleAdoptReply = async (replyId: number) => {
    try {
      isChosen.check ?
        await axios.put(`/api/questions/${replyId}/adopt-cancel`) :
        await axios.post(`/api/questions/${replyId}/adopt-replies`)
        getAdoptReply()
    } catch (err) {
      console.error(err)
    }
  };

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
          getReply();
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
          getReply();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editReply = (id: number, article: string, parentId?: number) => {
    setIsEditing(false);

    const data = {
      id : id,
      article: article,
      parentId: parentId,
    };

    axios({
      method: "put",
      url: `/api/${board}/update/replies`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    })
      .then((res) => {
          if(res.status===200){
            getReply();
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
          getReply();
      }).catch((err)=>{
          console.log(err);
      })
  };

  const editHandler = (id: number) => {
    setReplyId(id);
    setIsEditing(true);
  };

  const Article = (writerUserId: number, article: string, id: number) => {
  return (
    <>
      {board === BoardType.question ? (
        //채택하기
        <Grid item container direction={"row"}>
          <Grid item xs={9} md={10}>
            <div className="ql-snow">
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: article }}/>
            </div>
          </Grid>
          {userId === writerId ? (
            <Grid item xs={3} md={2}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <AdoptReply
                  userId={userId}
                  writerUserId={writerUserId}
                  replyId={id}
                  onReplyAdopt={handleAdoptReply}
                  check={isChosen.check}
                  checkId={isChosen.id}
                />
              </Box>
            </Grid>
          ) : null}
        </Grid>
        ) : (
        <Grid item ml={"1rem"} mr={"1rem"}>
          <Typography variant={"h4"}>{article}</Typography>
        </Grid>
      )}
    </>
    );
  };

  // 수정 버튼 클릭에 따른 컴포넌트 전환
  const Edit = (writerUserId: number, article: string, id: number, parentId?: number) => {
    return (
      (editReplyId === id && isEditing) ?
        (board === BoardType.question ? 
          <>
            {Article(writerUserId, article, id)}
            <EditQuillReply 
              id={id} 
              article={article} 
              parentId={parentId} 
              isEditing={isEditing} 
              onChangeReply={editReply}
              setIsEditing={setIsEditing}
            /> 
          </> :
          <EditReplyField
            id={id}
            article={article}
            parentId={parentId}
            isEditing={isEditing}
            onChangeReply={editReply}
            setIsEditing={setIsEditing}
          />
        )
      :
      Article(writerUserId, article, id)
    );
  };
  
  const generateReply = (reply: ReplyItems) => (
    <>
      <Grid item container direction={"column"} spacing={"0.8rem"} mt={"1rem"} mb={"0.1rem"}>
        <Grid item container direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <Profile nickname={reply.user.nickname} imgUrl={reply.user.profileImg} size={30}/>
            <Typography variant="h4" sx={{ ml: 1 }}>
              {reply.user.nickname}
            </Typography>
            <Typography variant="h5" color="primary.dark" sx={{ ml: 1 }}>
              <Time date={reply.createdAt} />
            </Typography>
            {isChosen.check && isChosen.id === reply.id ? 
              <>
              <Stack direction={"row"} alignItems={"center"} spacing={"0.2rem"} ml={"2rem"}>
              <DoneAll fontSize="small" sx={{ color:"primary.main"}}/> 
              <Typography variant="subtitle1" color="primary.main">채택됨</Typography>
              </Stack>
              </> : null}
          </Stack>
          <Stack direction={"row"}>
            {reply.user.id === userId && !isEditing? (
              <>
                <Button onClick={() => editHandler(reply.id)}>수정</Button>
                <Button onClick={() => deleteReply(reply.id)}>삭제</Button>
              </>
            ) : null}
          </Stack>
        </Grid>
        {Edit(reply.user.id, reply.article, reply.id, reply.parentId)}
        <Grid item>
          {!isEditing && 
            <NestedReplyField
            board={board}
            onAddNested={handleAddNested}
            parentId={reply.id}
            />
          }
          {replyContainer(replyData, reply.id)}
        </Grid>
        </Grid>
    </>
  );

  const replyContainer = (replies: ReplyItems[], parentId?: number) => {
    const filteredReplies = parentId
        ? replies.filter((reply) => reply.parentId === parentId)
        : replies;

    return (
      filteredReplies.length > 0 && (
        <>
        <Grid item container direction="column" pl="2rem">
          {filteredReplies.map((reply) => generateReply(reply))}
        </Grid>
        </>
      )
    );
  };

  const reply = replyData
  .filter((reply) => !reply.parentId)
  .map((value) => generateReply(value));

  return (
    <>
        {replyCount(replyData.length)}
        <ReplyField onAddReply={handleAddReply} board={props.board} />
        <Grid container direction="column">
        {reply}
        </Grid>
    </>
  );

};

export default Reply;
