import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import EditorToolbar from "../EditorToolbar";
import "../../style/Board.css";

interface ReplyProps{
  onAddReply: (article:string) => void;
  board: string;
}

const ReplyField = (props : ReplyProps) => {
  const [article, setArticle] = useState<string>("");

  const onQuillChange = (value: string) => {
    setArticle(value);
  };

  const onSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    props.onAddReply(article);
    setArticle("");
  };

  return (
    <Box>
      { props.board === "questions" ? 
        <div className="replyQuill">
          <EditorToolbar onAddQuill={onQuillChange} content={article} />
        </div> : 
        <TextField
          fullWidth
          placeholder="댓글을 입력하세요."
          variant="outlined"
          multiline
          sx={{ mt: 2, mb: 2 }}
          value={article}
          onChange={(e) => setArticle(e.target.value)}
        />
      }
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={onSubmit} size="large">작성하기</Button>
      </Box>
    </Box>
  )
}

export default ReplyField;