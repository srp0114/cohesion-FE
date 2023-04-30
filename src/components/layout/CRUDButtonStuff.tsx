import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { Fab, Box, Tooltip, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from "./Loading";
import { BoardType } from "../model/board";
import axios from "axios";

// 작성하기 버튼
export const WritingButton = () => {
  const navigate = useNavigate();

  const goToWriting = () => {
    navigate("/post");
  };

  return (
    <Box sx={{ "& > :not(style)": { ml: 120 }, position: "fixed", bottom: "2.5rem", right: "10rem" }}>
      <Tooltip title="새 게시글 작성">
        <Fab
          size="medium"
          color="primary"
          aria-label="create"
          onClick={goToWriting}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};

interface UpdateSpeedDialProps {
  boardType: BoardType;
  postingId: number;
  postingTitle?: string;
  postingContent?: string;
  //postingFile?: undefined; //파일 추가될 시 지정.
}

export const UpdateSpeedDial = (props:UpdateSpeedDialProps) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const goToEditing = () => {
    navigate(`/edit/${props.boardType}/${props.postingId}`);
  };

  const deleteHandler = () => {
    /*추후 qna, recruit 게시글 수정, 삭제 api 완성되면 추가해야함. */
    axios({
      method: 'delete',
      url: `/api/${props.boardType}/delete/${props.postingId}`
    }).then(
      (res) => {
        if(res.status === 200){
          console.log(`삭제 요청 완료 response.data ${res.data}`);
          <Loading delayTime={1500} />
          navigate(`/${props.boardType}`);
        }
      }
    ).catch((err) => console.log(err));
  }

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false)
  };

  const actions = [
    { icon: <EditOutlinedIcon />, name: '수정'},
    { icon: <DeleteIcon />, name: '삭제'},
  ];

  return (
    <Box sx={{ "& > :not(style)": { ml: 120 }, position: "fixed", bottom: "2.5rem", right: "10rem" ,transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="게시글 수정 삭제 스피드 다이얼"
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
          <SpeedDialAction
            icon={actions[0].icon}
            tooltipTitle={actions[0].name}
            onClick={goToEditing}
          />
          <SpeedDialAction
            icon={actions[1].icon}
            tooltipTitle={actions[1].name}
            onClick={deleteHandler}
          />
      </SpeedDial>
    </Box>
  );
}