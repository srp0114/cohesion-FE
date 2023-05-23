import React, { useState } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import { BoardType } from "../../model/board";
import QuillEditor from "../../layout/QuillEditor";

interface NestedReplyProps {
  board: BoardType
  parentId: number;
  onAddNested: (article:string, parentId: number) => void;
}

// 답글 달기 입력창 컴포넌트
const NestedReplyField = (props: NestedReplyProps) => {
  const [replyArticle, setReplyArticle] = useState<string>("");
  const [openReplyField, setOpenReplyField] = useState<boolean>(false);

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
    <Box>
      <Button onClick={()=>{setOpenReplyField(!openReplyField)}}>답글</Button>
        {openReplyField && (
        <>
        {props.board === BoardType.question ? (
          <div className="replyQuill">
            <QuillEditor onAddQuill={onQuillChange} content={replyArticle} />
          </div>
        ) : (
          <Grid container spacing={2} direction="row" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pl: "2.5rem", pr: "1.5rem" }}>
            <Grid item xs={8} md={10}>
              <TextField
                placeholder="답글달기.."
                variant="standard"
                multiline
                value={replyArticle}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        )}
        <Grid item>
          <Button disabled={isDisabled()} onClick={onReplySumbit}>답글달기</Button>
        </Grid>
        </>
        )}
    </Box>
  )
}
  
export default NestedReplyField;