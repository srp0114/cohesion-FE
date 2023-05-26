import React, { useState, ChangeEvent } from "react";
import { Grid, TextField, Button, Paper } from "@mui/material"

export interface EditReplyProps {
  article: string;
  id: number;
  parentId?: number;
  isEditing: boolean;
  setIsEditing : (isEditing: boolean) => void;
  onChangeReply: (id:number, article:string, parentId?: number) => void;
}

// 댓글 수정 컴포넌트
const EditReplyField = (props: EditReplyProps) => {
  const [editArticle, setEditArticle] = useState(props.article);

  const handleCancel = () => {
    props.setIsEditing(false);
  }

  const handleEditArticleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditArticle(event.target.value);
  };

  const handleSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    props.onChangeReply(props.id, editArticle, props.parentId);
  };
  
  const isDisabled = () => {
    return editArticle.trim() === '';
  }


  return (
    <>
      <Grid container direction={"column"} pl={"3rem"} pr={"3rem"} spacing={"0.5rem"}>
        <Grid item>
          <TextField 
            variant="standard" 
            multiline 
            value={editArticle} 
            onChange={handleEditArticleChange} 
          />
        </Grid>
        <Grid item direction={"row"} display={"flex"} justifyContent={"flex-end"}>
          <Button onClick={handleCancel}>취소</Button>
          <Button onClick={handleSubmit} disabled={isDisabled()}>수정</Button>
        </Grid>
      </Grid>
    </>
  );
};

export default EditReplyField;