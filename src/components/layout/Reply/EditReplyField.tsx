import React, { useState, ChangeEvent } from "react";
import { Grid, TextField, Button } from "@mui/material"

export interface EditReplyProps {
  article: string;
  id: number;
  parentId?: number;
  isEditing: boolean;
  onChangeReply: (id:number, article:string, parentId?: number) => void;
}

// 댓글 수정 컴포넌트
const EditReplyField = (props: EditReplyProps) => {
  const [editArticle, setEditArticle] = useState(props.article);

  const handleEditArticleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditArticle(event.target.value);
  };

  const handleSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    props.onChangeReply(props.id, editArticle, props.parentId);
  };

  return (
    <>
    {props.isEditing && 
      <Grid container direction="row" sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}  pl={"3rem"} pr={"3rem"}>
        <Grid item xs={8} md={11}>
          <TextField 
            variant="standard" 
            multiline 
            fullWidth
            value={editArticle} 
            onChange={handleEditArticleChange} 
          />
        </Grid>
      <Grid item>
        <Button onClick={handleSubmit}>수정하기</Button>
      </Grid>
      </Grid>
    }
    </>
  );
};

export default EditReplyField;