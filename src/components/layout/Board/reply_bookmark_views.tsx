import React from "react";
import { Stack, Typography } from "@mui/material";
import { FreeBoardItems } from "../../pages/Board/Free/FreeBoard";
import { RecruitBoardItems } from "../../pages/Board/Recruit/RecruitBoard";
import { BoardItems } from "../../pages/Board/QnA/QnABoard";
import { NoticeItems } from "../../pages/Board/Notice/NoticeBoard";
import { FindIcon } from "../../data/IconData";

export function reply_bookmark_views(props: FreeBoardItems | BoardItems | RecruitBoardItems | NoticeItems) {
  return <Stack direction="row"
    spacing={"0.75rem"}
    sx={{ display: "flex", justifyContent: "flex-end", textAlign: "center", alignItems:"center"}}>
    <Stack direction={"row"} alignItems={"center"} spacing={"0.2rem"}>
    <FindIcon name="reply" /> 
    <Typography variant="h5">{props.reply}</Typography>
    </Stack>    
    <Stack direction={"row"} alignItems={"center"} spacing={"0.2rem"}>
    <FindIcon name="bookmark" /> 
    <Typography variant="h5">{props.bookmark}</Typography>
    </Stack>    
    <Stack direction={"row"} alignItems={"center"} spacing={"0.2rem"}>
    <FindIcon name="views" /> 
    <Typography variant="h5">{props.views}</Typography>
    </Stack>
  </Stack>;
}

export function reply_bookmark_views_recruit(props: FreeBoardItems | BoardItems | RecruitBoardItems| NoticeItems) {
  return <Stack direction="row"
    spacing={"0.25rem"}
    sx={{ display: "flex", justifyContent: "flex-end", textAlign: "center", alignItems:"center" }}>
    <Stack direction={"row"} alignItems={"center"} spacing={"0.2rem"}>
    <FindIcon name="reply" iconProps={{ fontSize: "small" }} /> 
    <Typography variant="h6">{props.reply}</Typography>
    </Stack>
    <Stack direction={"row"} alignItems={"center"} spacing={"0.2rem"}>
    <FindIcon name="bookmark" iconProps={{ fontSize: "small"  }} /> 
    <Typography variant="h6">{props.bookmark}</Typography>
    </Stack>
    <Stack direction={"row"} alignItems={"center"} spacing={"0.2rem"}>
    <FindIcon name="views" iconProps={{ fontSize: "small"  }} /> 
    <Typography variant="h6">{props.views}</Typography>
    </Stack>
  </Stack>;
}