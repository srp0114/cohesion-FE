import React, { useState } from 'react';
import { Button, Snackbar } from '@mui/material';

interface ReplyCheckboxProps {
  onReplyCheck: (isChosen:boolean) => void;
  isChosen: boolean;
}

const PinReply = (props: ReplyCheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleCheckReply = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setIsChecked(!isChecked);
    props.onReplyCheck(isChecked);
    setMessage(props.isChosen ?
      "댓글 채택이 취소되었습니다." : "댓글이 채택되었습니다.")
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
    <Button onClick={handleCheckReply}>
      채택하기
    </Button>
    <Snackbar
        autoHideDuration={1500}
        open={open}
        message={message}
        onClose={handleClose}
      />
    </>
  );
}

export default PinReply;
