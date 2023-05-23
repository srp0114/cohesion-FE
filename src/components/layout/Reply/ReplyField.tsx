import React, { useState } from "react";
import { Grid, TextField, Button, Box } from "@mui/material";
import QuillEditor from "../QuillEditor";
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
  
  const isDisabled = () => {
    return article.trim() === '';
  }

  return (
    <Grid container spacing={2} direction="row" sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <Grid item xs={9} md={10.5}>
      {props.board === "questions" ? 
        <div className="replyQuill">
          <QuillEditor onAddQuill={onQuillChange} content={article} />
        </div> : 
        <TextField
          fullWidth
          placeholder="댓글을 입력하세요."
          variant="outlined"
          multiline
          value={article}
          onChange={(e) => setArticle(e.target.value)}
        />
      }
      </Grid>
      <Grid item>
        <Button disabled={isDisabled()} onClick={onSubmit}>작성하기</Button>
      </Grid>
    </Grid>
  )
}

export default ReplyField;