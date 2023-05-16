import { useState } from "react";
import { Grid, Menu, MenuItem, ListItemIcon, IconButton } from "@mui/material";
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
            <MenuItem onClick={()=>deleteHandler(props.summaryId)}>
            <ListItemIcon>
                <DeleteIcon fontSize="small" />
            </ListItemIcon>삭제
            </MenuItem>
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

export default MySummaryMenu;