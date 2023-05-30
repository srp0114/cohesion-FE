import React from "react";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MediaIcon from '@mui/icons-material/PermMediaOutlined';
import ArrowDown from '@mui/icons-material/KeyboardArrowDownOutlined';
import ArrowUp from '@mui/icons-material/KeyboardArrowUpOutlined';
import ThumbUp from '@mui/icons-material/ThumbUpOffAlt';
import { TbCrown } from 'react-icons/tb';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonAddDisabledOutlinedIcon from '@mui/icons-material/PersonAddDisabledOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import Search from '@mui/icons-material/Search';
import Description from "@mui/icons-material/DescriptionOutlined";
import BorderColor from '@mui/icons-material/BorderColorOutlined';
import DoneAll from '@mui/icons-material/DoneAllRounded';

const icons = [
    { name: "reply", component: <ChatIcon /> }, //댓글,
    { name: "bookmark", component: <BookmarkIcon /> }, //북마크
    { name: "views", component: <Visibility /> }, //조회수

    { name: "apply", component: <HistoryEduOutlinedIcon /> },//신청하기
    { name: "applyCancel", component: <CancelOutlinedIcon /> },//신청취소

    { name: "recruitPeople", component: <PeopleAltOutlinedIcon /> },//모집인원
    { name: "approveComplete", component: <PersonAddDisabledOutlinedIcon /> },//승인한 상태
    { name: "approveReject", component: <PersonAddOutlinedIcon /> },//승인취소 상태,
    { name: "applicantList", component: <FolderSharedOutlinedIcon /> }, //신청자목록
    { name: "recruitComplete", component: <AssignmentTurnedInIcon /> },//모집완료

    { name: "write", component: <AddIcon /> },
    { name: "edit", component: <EditOutlinedIcon /> },//게시글 혹은 정보 수정
    { name: "delete", component: <DeleteIcon /> },//게시글 혹은 정보 삭제
    { name: "settings", component: <SettingsIcon /> }, //설정

    { name: "myPost", component: <Visibility /> },//작성한 게시글
    { name: "myRecord", component: <Visibility /> },//공부기록
    { name: "fix", component: <Visibility /> },//고정

    { name: "done", component: <DoneIcon /> }, // V (체크 표시)
    { name: "close", component: <CloseIcon /> }, // X

    { name: "next", component: <ArrowForwardIosIcon /> }, // > 다음
    { name: "previous", component: <ArrowBackIosNewIcon /> }, // < 이전

    { name: "file", component: <MediaIcon/> },
    { name: "up", component: <ArrowUp/>},
    { name: "down", component: <ArrowDown/>},
    { name: "thumbUp", component: <ThumbUp/> },
    { name: "crown", component: <TbCrown fontSize={"1.8rem"}/> },
    { name: "high", component: <PriorityHigh/>},
    { name: "search", component: <Search/>},
    { name: "description", component: <Description/>},
    { name: "borderColor", component: <BorderColor/>},
    { name: "collapseClose", component: <ExpandLess /> }, // V
    { name: "collapseOpen", comonent: <ExpandMore /> }, //^
    { name: "done", comment: <DoneAll/>},
];

const iconList = [
    "reply",
    "bookmark",
    "views",
    "apply",
    "applyCancel",
    "recruitPeople",
    "approveComplete",
    "approveReject",
    "applicantList",
    "recruitComplete",
    "collapseClose",
    "collapseOpen",
    "write",
    "edit",
    "delete",
    "myPost",
    "myRecord",
    "fix",
    "done",
    "close",
    "next",
    "previous",
    "up",
    "down",
    "thumbUp",
    "crown",
    "high",
    "description",
    "borderColor",
    "settings",
    "done",
]

/**
 * 아이콘의 이름 (ex: 댓글수 아이콘의 이름: reply)를 입력하면, 해당 아이콘 컴포넌트를 반환하는 함수
 */

interface FindIconProps {
    name: string | typeof iconList;
    iconProps?: { fontSize?: string | "small" | "medium" | "large"; color?: string };
    onClick?: () => void;
}

export const FindIcon = (props: FindIconProps) => {
    const _icon = icons.find((icon) => props.name === icon.name);
    if (_icon && _icon.component) {
        return React.cloneElement(_icon.component, { ...props.iconProps });
    }
    return null;
};
