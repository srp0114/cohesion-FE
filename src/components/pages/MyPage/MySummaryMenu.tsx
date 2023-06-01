import { useState } from "react";
import { Button, Paper, Typography, Stack, Grid, Menu, MenuItem, ListItemIcon, IconButton, Modal } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/EditOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';

interface MySummaryMenuProps {
    summaryId: number;
    isFixed: boolean; 
    onDeleteSummary: (id: number) => void;
    onFixSummary: (id: number) => void;
    onReleaseSummary: (id: number) => void;
    setIsEditing: (isEditing : boolean) => void;
    setEditSummaryId: (id: number) => void;
}

const MySummaryMenu = (props: MySummaryMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    const editHandler = (id: number) => {
        props.setIsEditing(true);
        props.setEditSummaryId(id);
        handleClose();
    }

    const deleteHandler = (id: number) => {
        props.onDeleteSummary(id);
        handleClose();
    }   

    const pinHandler = (id: number, isFixed: boolean) => {
        isFixed ? props.onReleaseSummary(id) : props.onFixSummary(id);
        handleClose();
    }

    return (
        <>
        <Grid item>
        <IconButton
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className="summaryMenuButton"
        ><MoreVertIcon />
        </IconButton>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={()=>editHandler(props.summaryId)}>
            <ListItemIcon>
                <EditIcon fontSize="small" />
            </ListItemIcon>수정
            </MenuItem>
            <MenuItem onClick={()=>setDeleteOpen(true)}>
            <ListItemIcon>
                <DeleteIcon fontSize="small" />
            </ListItemIcon>삭제
            </MenuItem>
            <Modal open={deleteOpen}>
                <Paper sx={editUserinfoModal} elevation={4}>
                <Stack direction={"column"} spacing={"2rem"}>
                    <Typography variant="h3" p={"0.5rem"}>공부기록 삭제</Typography>
                    <Typography variant="h4" align="center">공부기록을 삭제하시겠습니까?</Typography>
                    <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                        <Button  onClick={()=>{ 
                            setDeleteOpen(false); 
                            handleClose();
                        }}>취소</Button>
                        <Button variant="contained" onClick={()=>deleteHandler(props.summaryId)}>삭제</Button>
                    </Stack>
                </Stack>
                </Paper>
            </Modal>
            <MenuItem onClick={()=>pinHandler(props.summaryId, props.isFixed)}>
            <ListItemIcon>
            <PushPinIcon fontSize="small"/>
            </ListItemIcon>
            {props.isFixed ? "고정해제" : "고정"}
            </MenuItem>
        </Menu>
        </Grid>
        </>
    )
}
const editUserinfoModal = {
  position: 'absolute' as 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  p: "1.5rem",
  borderRadius: 6,
};

export default MySummaryMenu;