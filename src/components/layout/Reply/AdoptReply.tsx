import React, { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import axios from "axios";

interface AdoptReplyProps {
  onReplyCheck: (isChosen: boolean) => void;
  isChosen: boolean;
  replyId: number;
}

const AdoptReply = ({ onReplyCheck, isChosen, replyId }: AdoptReplyProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleCheckReply = async () => {
    try {
      // 댓글 채택한 경우 post axios 연동 추가
      await axios.post(`/api/questions/${replyId}/adopt-replies`)
      .then((res)=>{
          if(res.status===200) {
            console.log(res)
          }
      }).catch((err)=>{
          console.log(err);
      })
      setOpen(true);
      onReplyCheck(!isChosen);
      setMessage(isChosen ? "댓글 채택이 취소되었습니다." : "댓글이 채택되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Button onClick={handleCheckReply}>
      채택하기
      <Snackbar
        autoHideDuration={1500}
        open={open}
        message={message}
        onClose={handleClose}
      />
    </Button>
  );
};

export default AdoptReply;
