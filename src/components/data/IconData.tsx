import React from "react";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import MediaIcon from '@mui/icons-material/PermMediaOutlined';
import ArrowDown from '@mui/icons-material/KeyboardArrowDownOutlined';
import ArrowUp from '@mui/icons-material/KeyboardArrowUpOutlined';
import ThumbUp from '@mui/icons-material/ThumbUp';
import { FaCrown } from 'react-icons/fa';
import { SvgIcon } from "@mui/joy";

const icons = [
    { name: "reply", component: < ChatIcon /> }, //댓글,
    { name: "bookmark", component: <BookmarkIcon /> }, //북마크
    { name: "views", component: <Visibility /> }, //조회수

    { name: "apply", component: <Visibility /> },//신청하기
    { name: "applyCancel", component: <Visibility /> },//신청취소

    { name: "recruitPeople", component: <Visibility /> },//모집인원
    { name: "approveComplete", component: <Visibility /> },//승인한 상태
    { name: "approveReject", component: <Visibility /> },//승인취소 상태,
    { name: "close", component: <CloseIcon /> },//신청자목록닫기
    { name: "recruitComplete", component: <Visibility /> },//모집완료

    { name: "edit", component: <Visibility /> },//게시글 혹은 정보 수정
    { name: "delete", component: <Visibility /> },//게시글 혹은 정보 삭제

    { name: "myPost", component: <Visibility /> },//작성한 게시글
    { name: "myRecord", component: <Visibility /> },//공부기록
    { name: "fix", component: <Visibility /> },//고정

    { name: "done", component: <DoneIcon /> }, // V
    { name: "close", component: <CloseIcon /> }, // X
    { name: "file", component: <MediaIcon/> },
    { name: "up", component: <ArrowUp/>},
    { name: "down", component: <ArrowDown/>},
    { name: "thumbUp", component: <ThumbUp/> },
    { name: "crown", component: <FaCrown fontSize={"1.8rem"}/> }
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
    "close",
    "recruitComplete",
    "edit",
    "delete",
    "myPost",
    "myRecord",
    "fix",
    "done",
    "close",
    "up",
    "down",
    "thumbUp",
    "crown"
]

/**
 * 아이콘의 이름 (ex: 댓글수 아이콘의 이름: reply)를 입력하면, 해당 아이콘 컴포넌트를 반환하는 함수
 */

interface FindIconProps {
    name: string | typeof iconList;
    iconProps?: { fontSize?: string | "small" | "medium" | "large"; color?: string };
}

export const FindIcon = (props: FindIconProps) => {
    const _icon = icons.find((icon) => props.name === icon.name);
    if (_icon) {
        return React.cloneElement(_icon.component, { ...props.iconProps });
    }
    return null;
};