import React, { useState } from "react";
import { Grid, TextField, Button, Box } from "@mui/material";
import QuillEditor from "../QuillEditor";
import "../../style/Board.css";
import { BoardType } from "../../model/board";

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
    props.board === BoardType.question ? 
      <Grid container direction={"column"} spacing={"1rem"}>
        <Grid item xs={12} md={12}>
          <div className="replyQuill">
            <QuillEditor onAddQuill={onQuillChange} content={article} />
          </div>
        </Grid>
        <Grid item display={"flex"} justifyContent={"flex-end"}>
          <Button disabled={isDisabled()} onClick={onSubmit}>작성하기</Button>
        </Grid>
      </Grid> : 
      <Grid container direction="row" sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
      <Grid item xs={8} md={11}>
        <TextField
          fullWidth
          placeholder="댓글을 입력해주세요."
          variant="outlined"
          multiline
          value={article}
          onChange={(e) => setArticle(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Button disabled={isDisabled()} onClick={onSubmit}>작성하기</Button>
      </Grid>
    </Grid>
  )
}

export default ReplyField;