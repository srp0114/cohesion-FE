import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Button } from "@mui/material";
import ReplyField from "./ReplyField";
import NestedReplyField from "./NestedReplyField";
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
  postingID?: string;
}

const FreeReply = ({ postingID }: ReplyProps) => {
  const [replyData, setReplyData] = useState<ReplyItems[]>([]);
  const [isWriter, setIsWriter] = useState<boolean>(true);
  const [userId,setUserId] = useState<Number>(0);

  const url = `/api/free/${postingID}/replies`;

  useEffect(() => {
    axios({
      method: "get",
      url: url,
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
      url: url,
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
      url: url,
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
                parentID={reply.id}
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
            <Box>
              <Typography sx={{ ml: 5, mt: 1, whiteSpace: "pre-wrap"}}>{value.article}</Typography>
            </Box>
            <NestedReplyField
              onAddNested={handleAddNested}
              parentID={value.id}
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

export default FreeReply;
