import React, { ReactNode, useState } from "react";
import { Badge, Box, Divider, IconButton, Typography, Stack } from "@mui/material";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Money from "@mui/icons-material/MonetizationOn";
import BorderColorIcon from '@mui/icons-material/BorderColorOutlined';
import MyActivity from "./MyActivity";
/**
 * 유저가 남긴 댓글,게시글, 북마크 및 누적 포인트
 *
 */
interface MyHistoryProps {
  reply: number;
  board: number;
  bookmark: number;
}

export const MyHistory = (props: MyHistoryProps) => {
  const [MyPage, setMyPage] = useState<ReactNode>(<MyActivity activityType="summary"/>);

  const handleMySummary = () => {
    setMyPage(<MyActivity activityType="summary"/>);
  };

  const handleMyReply = () => {
    setMyPage(<MyActivity activityType="reply"/>);
  };

  const handleMyPosting = () => {
    setMyPage(<MyActivity activityType="post"/>);
  };

  const handleMyBookmark = () => {
    setMyPage(<MyActivity activityType="bookmark"/>);
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={"36px"}>
          <Box>
            <Typography>공부기록</Typography>
            <IconButton size="large" onClick={handleMySummary}>
                <BorderColorIcon />
            </IconButton>
          </Box>
          <Box>
            <Typography>작성한 댓글</Typography>
            <IconButton size="large" onClick={handleMyReply}>
              <Badge color="success" badgeContent={props.reply} max={99} showZero>
                <ChatIcon />
              </Badge>
            </IconButton>
          </Box>
          <Box>
            <Typography>작성한 게시글</Typography>
            <IconButton size="large" onClick={handleMyPosting}>
              <Badge color="success" badgeContent={props.board} max={99} showZero>
                <DescriptionOutlinedIcon />
              </Badge>
            </IconButton>
          </Box>
          <Box>
            <Typography>북마크</Typography>
            <IconButton size="large" onClick={handleMyBookmark}>
              <Badge color="success" badgeContent={props.bookmark} max={99} showZero>
                <BookmarkIcon />
              </Badge>
            </IconButton>
          </Box>
        </Stack>
        <Divider orientation="vertical" variant="middle" flexItem />
      </Stack>
      {MyPage}
    </>
  );
};
