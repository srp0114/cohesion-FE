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

  const url = `/api/freeBoards/${postingID}/replies`;

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
  };

  const deleteReply = () => {
    // 삭제 api 추가
  };

  // 작성자인 경우 해당 버튼 출력
  // 현재 모든 댓글에 출력
  // TODO 작성자 확인
  const WriterButton = isWriter ? (
    <>
      <Button onClick={editReply}>수정</Button>
      <Button onClick={deleteReply}>삭제</Button>
    </>
  ) : null;

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
                <Box>{WriterButton}</Box>
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
              <Box>{WriterButton}</Box>
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
