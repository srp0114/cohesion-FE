import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fab, Box, Tooltip, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { FindIcon } from "../data/IconData";
import Loading from "./Loading";
import { BoardType } from "../model/board";
import axios from "axios";
import { ApplicantList } from "../pages/Board/Recruit/ApplyAcceptStuff";
import { getCurrentUserInfo } from "../getCurrentUserInfo";

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
          <FindIcon name="write" />
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
}

export const UpdateSpeedDial = (props: UpdateSpeedDialProps) => {
  const [open, setOpen] = React.useState(false);
  const [showTheList, setShowTheList] = useState(false);
  const navigate = useNavigate();

  const goToEditing = () => {
    navigate(`/edit/${props.boardType}/${props.postingId}`, { state: getBoardType(props.boardType) });
  };

  const getBoardType = (type: string): BoardType | undefined => {
    if (type === "free") {
      return BoardType.free;
    } else if (type === "questions") {
      return BoardType.question;
    } else if (type === "recruit") {
      return BoardType.recruit;
    } else if (type === "notice") {
      return BoardType.notice;
    } else if (type === "summary") {
      return BoardType.summary;
    } else {
      return undefined;
    }
  }

  const deleteHandler = () => {
    axios({
      method: 'delete',
      url: `/api/${props.boardType}/delete/${props.postingId}`
    }).then(
      (res) => {
        if (res.status === 200) {
          console.log(`삭제 요청 완료 response.data ${res.data}`);
          navigate(`/${props.boardType}`);
        }
      }
    ).catch((err) => console.log(err));
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showApplicantList = () => {
    setShowTheList(true);
  }

  return (
    <Box sx={{ position: "fixed", bottom: "2.5rem", right: "10rem", transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="게시글 더보기"
        icon={<FindIcon name="settings" />}
        onClose={handleClose}
        onClick={handleOpen}
        open={open}
      >
        <SpeedDialAction
          icon={<FindIcon name="edit" />}
          tooltipTitle={`수정`}
          tooltipOpen
          onClick={goToEditing}
        />
        <SpeedDialAction
          icon={<FindIcon name="delete" />}
          tooltipTitle={`삭제`}
          tooltipOpen
          onClick={deleteHandler}
        />
      </SpeedDial>
    </Box>
  );
}


interface UpdateRecruitSpeedDialProps {
  boardType: BoardType;
  postingId: number;
  postingTitle?: string;
  postingContent?: string;
  onNewApprovedApplicants: () => void;
  onApprovedApplicantsOut: () => void;
}

export const UpdateRecruitSpeedDial = (props: UpdateRecruitSpeedDialProps) => {
  const [open, setOpen] = React.useState(false);
  const [showTheList, setShowTheList] = useState(false);
  const navigate = useNavigate();

  const goToEditing = () => {
    navigate(`/edit/${props.boardType}/${props.postingId}`, { state: getBoardType(props.boardType) });
  };

  const getBoardType = (type: string): BoardType | undefined => {
    if (type === "free") {
      return BoardType.free;
    } else if (type === "questions") {
      return BoardType.question;
    } else if (type === "recruit") {
      return BoardType.recruit;
    } else if (type === "notice") {
      return BoardType.notice;
    } else if (type === "summary") {
      return BoardType.summary;
    } else {
      return undefined;
    }
  }

  const deleteHandler = () => {
    axios({
      method: 'delete',
      url: `/api/${props.boardType}/delete/${props.postingId}`
    }).then(
      (res) => {
        if (res.status === 200) {
          console.log(`삭제 요청 완료 response.data ${res.data}`);
          navigate(`/${props.boardType}`);
        }
      }
    ).catch((err) => console.log(err));
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showApplicantList = () => {
    setShowTheList(true);
  }

  return (
    <Box sx={{ position: "fixed", bottom: "2.5rem", right: "10rem", transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="게시글 더보기"
        icon={<FindIcon name="settings" />}
        onClose={handleClose}
        onClick={handleOpen}
        open={open}
      >
        <SpeedDialAction
          icon={<FindIcon name="edit" />}
          tooltipTitle={`수정`}
          tooltipOpen
          onClick={goToEditing}
        />
        <SpeedDialAction
          icon={<FindIcon name="delete" />}
          tooltipTitle={`삭제`}
          tooltipOpen
          onClick={deleteHandler}
        />
        <SpeedDialAction
          icon={<FindIcon name="applicantList" />}
          tooltipTitle={`신청자 목록`}
          tooltipOpen
          onClick={showApplicantList}
        />
        {showTheList && (
          <ApplicantList
            postingId={props.postingId}
            onNewApprovedApplicants={props.onNewApprovedApplicants}
            onApprovedApplicantsOut={props.onApprovedApplicantsOut}
            toggleDrawerStatus={true}
          />
        )}
      </SpeedDial>
    </Box>
  );
}