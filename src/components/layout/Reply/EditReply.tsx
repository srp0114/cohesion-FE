import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface EditReplyProps {
  article: string;
  id : number;
  parentId?: number;
  isEditing: boolean;
  onChangeReply: (id:number, article:string, parentId?: number) => void;
}

// 답글 달기 입력창 컴포넌트
const EditReply = (props: EditReplyProps) => {
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
    <div style={{ width: '100%' }}>
      {props.isEditing && 
        <>
        <Box sx={{display:"flex", justifyContent:"space-evenly"}}>
          <TextField 
            variant="standard" 
            multiline 
            fullWidth
            value={editArticle} 
            onChange={handleEditArticleChange} 
          />
          <Button onClick={handleSubmit}>수정</Button>
        </Box>
        </>
      }
    </div>
  );
};

export default EditReply;