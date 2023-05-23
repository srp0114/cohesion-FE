import { useState } from "react";
import QuillEditor from "../QuillEditor";
import { Button } from "@mui/material";
import { EditReplyProps } from "./EditReplyField";
import { Modal, Paper, Stack } from "@mui/material";

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

    const QuestionEditModal = () => {
        return (
            <>
            {props.isEditing &&
                <Modal open={open}>
                    <Paper sx={d} elevation={4}>
                        <Stack direction={"column"} spacing={"2rem"}>
                            <div className="replyQuill">
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
    };

    return (
        <>
           <QuestionEditModal/>
        </>
    )
}

export default EditQuillReply;


const d = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  hegiht: 600,
  bgcolor: 'background.paper',
  p: "1.5rem",
  borderRadius: 6,
};
