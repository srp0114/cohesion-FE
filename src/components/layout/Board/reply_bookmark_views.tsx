import React from "react";
import { IconButton, Stack } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import { FreeBoardItems } from "../../pages/Board/Free/FreeBoard";
import { RecruitBoardItems } from "../../pages/Board/Recruit/RecruitBoard";
import { BoardItems } from "../../pages/Board/QnA/QnABoard";

export function reply_bookmark_views(props: FreeBoardItems| BoardItems | RecruitBoardItems) {
  return <Stack direction="row"
    spacing={"0.75rem"}
    sx={{ display: "flex", justifyContent: "flex-end" }} alignItems={"center"}>
      <ChatIcon /> {props.reply}
      <BookmarkIcon /> {props.bookmark}
      <Visibility /> {props.views}
  </Stack>;
}
