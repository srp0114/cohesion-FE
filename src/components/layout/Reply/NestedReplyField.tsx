import React, { useState } from "react";
import { TextField, Button, Grid, Modal, Paper, Stack, Typography } from "@mui/material";
import { BoardType } from "../../model/board";
import QuillEditor from "../../layout/QuillEditor";
import { QuillModal } from "./EditQuillReply";

interface NestedReplyProps {
  board: BoardType
  parentId: number;
  onAddNested: (article:string, parentId: number) => void;
}

const NestedReplyField = (props: NestedReplyProps) => {
  const [replyArticle, setReplyArticle] = useState<string>("");
  const [openReplyField, setOpenReplyField] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false); 

  const handleOpenNested = () => {
    props.board === BoardType.question ?  setOpenModal(!openModal) : setOpenReplyField(!openReplyField)
  }

  const onQuillChange = (value: string) => {
    const modifiedArticle = value.trim() === '<p><br></p>' ? "" : value;
    setReplyArticle(modifiedArticle);
  };

  const onReplySubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    props.onAddNested(replyArticle, props.parentId);
    setReplyArticle('');
    handleOpenNested();
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyArticle(e.target.value);
  };

  const isDisabled = () => {
    return replyArticle.trim() === '';
  }
  
  return (
    <>
      <Button onClick={handleOpenNested}>답글</Button>
      {props.board === BoardType.question ? (
          <Modal open={openModal}>
            <Paper sx={QuillModal} elevation={4}>
              <Stack direction="column" spacing="2rem">
                <Typography variant="h3" p="0.5rem">답글 달기</Typography>
                <div className="replyModalQuill">
                  <QuillEditor onAddQuill={onQuillChange} content={replyArticle} />
                </div>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button onClick={() => setOpenModal(false)}>취소</Button>
                  <Button onClick={onReplySubmit}>답글</Button>
                </Stack>
              </Stack>
            </Paper>
          </Modal>
      ) : (
        openReplyField && (
          <Grid container direction="row" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} p="1rem">
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
              <Button disabled={isDisabled()} onClick={onReplySubmit}>답글달기</Button>
            </Grid>
          </Grid>
        )
      )}
    </>
  );

}
  
export default NestedReplyField;