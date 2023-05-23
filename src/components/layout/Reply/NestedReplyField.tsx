import React, { useState } from "react";
import { Box, TextField, Button, Grid, Modal, Paper, Stack, Typography } from "@mui/material";
import { BoardType } from "../../model/board";
import QuillEditor from "../../layout/QuillEditor";
import { QuillModal } from "./EditQuillReply";
interface NestedReplyProps {
  board: BoardType
  parentId: number;
  onAddNested: (article:string, parentId: number) => void;
}

// 답글 달기 입력창 컴포넌트
const NestedReplyField = (props: NestedReplyProps) => {
  const [replyArticle, setReplyArticle] = useState<string>("");
  const [openReplyField, setOpenReplyField] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);

  const onQuillChange = (value: string) => {
    setReplyArticle(value);
  };

  // 답글 게시 버튼 클릭 시 적용될 핸들러
  const onReplySumbit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    props.onAddNested(replyArticle, props.parentId);
    setReplyArticle('');
    setOpenReplyField(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyArticle(e.target.value);  
  };

  const isDisabled = () => {
    return replyArticle.trim() === '';
  }

  return (
    <>
      <Button onClick={()=>{setOpenReplyField(!openReplyField)}}>답글</Button>
        {openReplyField && (
        <>
          {props.board === BoardType.question ? (
              <Modal open={open}>
                <Paper sx={QuillModal} elevation={4}>
                <Stack direction={"column"} spacing={"2rem"}>
                    <Typography variant="h3" p={"0.5rem"}>답글 달기</Typography>
                    <div className="replyModalQuill">
                        <QuillEditor onAddQuill={onQuillChange} content={replyArticle} />
                    </div>
                    <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                        <Button onClick={()=>setOpen(false)}>취소</Button>
                        <Button onClick={onReplySumbit}>답글</Button>
                    </Stack>
                </Stack>
                </Paper>
              </Modal>
          ) : (
              <Grid container direction="row" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} pl={"1rem"} pr={"1rem"}>
                <Grid item xs={8} md={11}>
                  <TextField
                    placeholder="답글달기.."
                    variant="standard"
                    multiline
                    value={replyArticle}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <Button disabled={isDisabled()} onClick={onReplySumbit}>답글달기</Button>
                </Grid>
              </Grid>
          )}
         
        </>
        )}
    </>
  )
}
  
export default NestedReplyField;