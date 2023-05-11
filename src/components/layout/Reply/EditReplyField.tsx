import React, { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";

interface EditReplyProps {
  article: string;
  id : number;
  parentId?: number;
  isEditing: boolean;
  onChangeReply: (id:number, article:string, parentId?: number) => void;
}

// 댓글 수정 컴포넌트
const EditReplyField = (props: EditReplyProps) => {
  const [editArticle, setEditArticle] = useState(props.article);

  const handleEditArticleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditArticle(event.target.value);
  };

  const handleSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    // 변경된 article 내용 전달
    props.onChangeReply(props.id, editArticle, props.parentId);
  };

  return (
    <>
    {props.isEditing && 
      <Grid container spacing={2} direction="row" sx={{display:"flex", justifyContent:"space-evenly", alignItems:"center", mr:"1rem"}}>
        <Grid item xs={9} md={10}>
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