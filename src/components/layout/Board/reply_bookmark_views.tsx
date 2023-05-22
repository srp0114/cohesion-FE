import React from "react";
import { Stack } from "@mui/material";
import { FreeBoardItems } from "../../pages/Board/Free/FreeBoard";
import { RecruitBoardItems } from "../../pages/Board/Recruit/RecruitBoard";
import { BoardItems } from "../../pages/Board/QnA/QnABoard";
import { FindIcon } from "../../data/IconData";

export function reply_bookmark_views(props: FreeBoardItems | BoardItems | RecruitBoardItems) {
  return <Stack direction="row"
    spacing={"0.75rem"}
    sx={{ display: "flex", justifyContent: "flex-end", textAlign: "center" }}>
    <FindIcon name="reply" iconProps={{ color: "neutral" }} /> {props.reply}
    <FindIcon name="bookmark" iconProps={{ color: "neutral" }} /> {props.bookmark}
    <FindIcon name="views" iconProps={{ color: "neutral" }} /> {props.views}
  </Stack>;
}

export function reply_bookmark_views_recruit(props: FreeBoardItems | BoardItems | RecruitBoardItems) {
  return <Stack direction="row"
    spacing={"0.25rem"}
    sx={{ display: "flex", justifyContent: "flex-end", textAlign: "center" }}>
    <FindIcon name="reply" iconProps={{ fontSize: "small", color: "neutral" }} /> {props.reply}
    <FindIcon name="bookmark" iconProps={{ fontSize: "small", color: "neutral" }} /> {props.bookmark}
    <FindIcon name="views" iconProps={{ fontSize: "small", color: "neutral" }} /> {props.views}
  </Stack>;
}