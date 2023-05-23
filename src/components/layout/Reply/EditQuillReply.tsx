import { useState } from "react";
import QuillEditor from "../QuillEditor";
import { Button } from "@mui/material";
import { EditReplyProps } from "./EditReplyField";
import { Modal, Paper, Stack } from "@mui/material";
import "../../style/Board.css";

const QuillModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70rem',
  hegiht: '50rem',
  bgcolor: 'background.paper',
  p: "10rem",
  borderRadius: 6,
};

const EditQuillReply = (props: EditReplyProps) => {
    const [editArticle, setEditArticle] = useState(props.article);
    const [open, setOpen] = useState<boolean>(true);

    const onQuillChange = (value: string) => {
        setEditArticle(value);
    };

    const handleSubmit = (event: React.MouseEvent<HTMLElement>) => {    
        event.preventDefault();
        props.onChangeReply(props.id, editArticle, props.parentId);
        setOpen(false);
    };

    return (
        <>
           {props.isEditing &&
                <Modal open={open}>
                <Paper sx={QuillModal} elevation={4}>
                <Stack direction={"column"} spacing={"2rem"}>
                    <div className="replyModalQuill">
                        <QuillEditor onAddQuill={onQuillChange} content={editArticle} />
                    </div>
                    <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                        <Button onClick={()=>setOpen(false)}>취소</Button>
                        <Button onClick={handleSubmit}>수정</Button>
                    </Stack>
                </Stack>
                </Paper>
                </Modal>
            }
        </>
    )
}

export default EditQuillReply;
