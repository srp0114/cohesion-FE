import React from "react";
import {
  Badge,
  Box,
  Divider, IconButton,
  Typography,
  Stack
} from "@mui/material";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Money from "@mui/icons-material/MonetizationOn";

/**
 * 유저가 남긴 댓글,게시글, 북마크 및 누적 포인트
 *
 */
export const MyHistory: React.FC = () => {
  return (
    <>
      <Stack
        direction="row"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={"36px"}>
          <Box>
            <Typography>작성한 댓글</Typography>
            <IconButton size="large">
              <Badge color="success" badgeContent={6} max={99} showZero>
                <ChatIcon />
              </Badge>
            </IconButton>
          </Box>
          <Box>
            <Typography>작성한 게시글</Typography>
            <IconButton size="large">
              <Badge color="success" badgeContent={0} max={99} showZero>
                <DescriptionOutlinedIcon />
              </Badge>
            </IconButton>
          </Box>
          <Box>
            <Typography>북마크</Typography>
            <IconButton size="large">
              <Badge color="success" badgeContent={123} max={99} showZero>
                <BookmarkIcon />
              </Badge>
            </IconButton>
          </Box>
        </Stack>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Stack direction="row">
          <Typography>누적포인트</Typography>
          <IconButton disabled color="primary" size="large">
            <Money /> <Typography sx={{ fontSize: "2rem" }}>1080</Typography>
          </IconButton>
        </Stack>
      </Stack>
    </>
  );
};
