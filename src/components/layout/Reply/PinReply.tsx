import React, { useState } from 'react';
import { Button, Snackbar } from '@mui/material';

interface ReplyCheckboxProps {
  onReplyCheck: (isChosen:boolean) => void;
}

const ReplyCheckbox = (props: ReplyCheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);


  const handleCheckReply = (event: React.MouseEvent<HTMLElement>) => {
    setIsChecked(!isChecked);
    setOpen(!open);
    props.onReplyCheck(isChecked);
    console.log(isChecked);
  };

  return (
    <>
    <Button onClick={handleCheckReply}>
      채택하기
    </Button>
    <Snackbar
        open={open}
        message=""
      />
    </>
  );
}

export default ReplyCheckbox;
