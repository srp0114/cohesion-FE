import React, { ReactNode, useState } from "react";
import { Badge, IconButton, Typography, Stack } from "@mui/material";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BorderColorIcon from '@mui/icons-material/BorderColorOutlined';
import MyActivity from "./MyActivity";
import { FindIcon } from "../../data/IconData";

interface MyHistoryProps {
  application: number;
  board: number;
  bookmark: number;
}

export const MyHistory = (props: MyHistoryProps) => {
  const [MyPage, setMyPage] = useState<ReactNode>(<MyActivity activityType="summary"/>);

  const handleMySummary = () => {
    setMyPage(<MyActivity activityType="summary"/>);
  };

  const handleMyApplication = () => {
    setMyPage(<MyActivity activityType="application"/>);
  };

  const handleMyPosting = () => {
    setMyPage(<MyActivity activityType="post"/>);
  };

  const handleMyBookmark = () => {
    setMyPage(<MyActivity activityType="bookmark"/>);
  };

  return (
    <>
      <Stack direction="row" display={"flex"} justifyContent={"flex-start"} spacing={"2rem"}>
        <Stack direction={"column"} spacing={"0.5rem"} alignItems={"center"} sx={{width:"6.5rem"}}>
          <Typography variant="h5" sx={{fontWeight:500}}>공부기록</Typography>
          <IconButton size="large" onClick={handleMySummary}>
              <FindIcon name="borderColor"/>
          </IconButton>
        </Stack>

        <Stack direction={"column"} spacing={"0.5rem"} alignItems={"center"} sx={{width:"6.5rem"}}>
          <Typography variant="h5" sx={{fontWeight:500}}>작성한 게시글</Typography>
          <IconButton size="large" onClick={handleMyPosting}>
            <Badge color="success" badgeContent={props.board} max={99} showZero>
              <FindIcon name="description"/>
            </Badge>
          </IconButton>
        </Stack>
        
        <Stack direction={"column"} spacing={"0.5rem"} alignItems={"center"} sx={{width:"6.5rem"}}>
          <Typography variant="h5" sx={{fontWeight:500}}>북마크한 글</Typography>
          <IconButton size="large" onClick={handleMyBookmark}>
            <Badge color="success" badgeContent={props.bookmark} max={99} showZero>
              <FindIcon name="bookmark" />
            </Badge>
          </IconButton>
        </Stack>

        <Stack direction={"column"} spacing={"0.5rem"} alignItems={"center"} sx={{width:"6.5rem"}}>
          <Typography variant="h5" sx={{fontWeight:500}}>신청 목록</Typography>
          <IconButton size="large" onClick={handleMyApplication}>
            <Badge color="success" badgeContent={props.application} max={99} showZero>
              <FindIcon name="apply"/>
            </Badge>
          </IconButton>
        </Stack>
      </Stack>
      {MyPage}
    </>
  );
};
