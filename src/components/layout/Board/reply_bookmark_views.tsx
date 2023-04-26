import React from "react";
import { IconButton, Stack } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import Visibility from "@mui/icons-material/VisibilityOutlined";
import { FreeBoardItems } from "../../pages/Board/Free/FreeBoard";

export function reply_bookmark_views(props: FreeBoardItems) {
  return <Stack direction="row"
    spacing={"0.75rem"}
    sx={{ display: "flex", justifyContent: "flex-end" }}>
    <IconButton size="small">
      <ChatIcon /> {props.reply}
    </IconButton>
    <IconButton size="small">
      <BookmarkIcon /> {props.bookmark}
    </IconButton>
    <IconButton size="small">
      <Visibility /> {props.views}
    </IconButton>
  </Stack>;
}
