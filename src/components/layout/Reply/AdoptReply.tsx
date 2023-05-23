import React, { useState } from 'react';
import { Button, Snackbar, SnackbarOrigin, Alert, Modal, Stack, Paper, Typography } from '@mui/material';
import { debounce } from "lodash";

export interface State extends SnackbarOrigin {
  open: boolean;
}

interface AdoptReplyProps {
  replyId: number; // 댓글 id
  check: boolean; // 채택 여부
  checkId: number | null // 채택한 댓글 id
  userId: number; // user.id
  writerUserId: number; // 댓글 작성자 user.id
  onReplyAdopt: (replyId: number) => void;
}

const AdoptReply = ({ userId, writerUserId, onReplyAdopt, check, checkId, replyId }: AdoptReplyProps) => {
  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });

  const [adoptModalOpen, setAdoptModalOpen] = useState<boolean>(false);

  const { vertical, horizontal, open } = state;

  const [message, setMessage] = useState<string>("");
  
  const handleCheckReply = debounce(() => {
    setAdoptModalOpen(false);
    onReplyAdopt(replyId);
    setMessage(check ? "댓글 채택이 취소되었습니다." : "댓글이 채택되었습니다.");
    setState({ open: true, vertical: 'top', horizontal: 'right'});  
  }, 400);
  
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <>
      { userId === writerUserId ? 
        null : check ? replyId === checkId ? 
        <Button onClick={()=>setAdoptModalOpen(true)}>채택취소</Button> : null 
          : <Button onClick={()=>setAdoptModalOpen(true)}>채택하기</Button>
      }
      <Modal open={adoptModalOpen}>
        <Paper sx={editUserinfoModal} elevation={4}>
        <Stack direction={"column"} spacing={"2rem"}>
            <Typography variant="h3" p={"0.5rem"}>{check? "댓글 채택 취소" : "댓글 채택"}</Typography>
            <Typography variant="h4" align="center">{check? "댓글 채택을 취소하시겠습니까?" : "해당 댓글을 채택 하시겠습니까?"}</Typography>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                <Button onClick={()=>{ 
                    setAdoptModalOpen(false); 
                    handleClose();
                }}>취소</Button>
                <Button onClick={handleCheckReply}>확인</Button>
            </Stack>
        </Stack>
        </Paper>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={2000}
        open={open}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </>
  )
};

export default AdoptReply;

const editUserinfoModal = {
  position: 'absolute' as 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  p: "1.5rem",
  borderRadius: 6,
};
