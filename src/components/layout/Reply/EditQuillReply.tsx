import { useState } from "react";
import QuillEditor from "../QuillEditor";
import { Button, Typography } from "@mui/material";
import { EditReplyProps } from "./EditReplyField";
import { Modal, Paper, Stack } from "@mui/material";
import "../../style/Board.css";

export const QuillModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '65rem',
  maxHeight: "50rem",
  bgcolor: 'background.paper',
  p: "5rem",
  borderRadius: 6,
};

const EditQuillReply = (props: EditReplyProps) => {
    const [editArticle, setEditArticle] = useState(props.article);
    const [open, setOpen] = useState<boolean>(true);

    const onQuillChange = (value: string) => {
        const modifiedArticle = value.trim() === '<p><br></p>' ? "" : value;
        setEditArticle(modifiedArticle);
    };

    const handleSubmit = (event: React.MouseEvent<HTMLElement>) => {    
        event.preventDefault();
        props.onChangeReply(props.id, editArticle, props.parentId);
        setOpen(false);
    };

    const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
        setOpen(false);
        props.setIsEditing(!props.isEditing);
    }

    const isDisabled = () => {
        return editArticle.trim() === '';
    }

    return (
        <>
        <Modal open={open}>
        <Paper sx={QuillModal} elevation={4}>
        <Stack direction={"column"} spacing={"2rem"}>
            <Typography variant="h3" p={"0.5rem"}>댓글 수정</Typography>
            <div className="replyModalQuill">
                <QuillEditor onAddQuill={onQuillChange} content={editArticle} />
            </div>
            <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                <Button onClick={handleCancel}>취소</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={isDisabled()}>수정</Button>
            </Stack>
        </Stack>
        </Paper>
        </Modal>
        </>
    )
}

export default EditQuillReply;
