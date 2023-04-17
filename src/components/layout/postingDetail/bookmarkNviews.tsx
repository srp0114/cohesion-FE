import React from "react";
import {
  Box, Stack,
  Typography,
  IconButton
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/BookmarkBorder";
import Visibility from "@mui/icons-material/VisibilityOutlined";

export function bookmarkNviews(views: number, onClickBookmark: () => void, bookmarkCount: number) {
  return <Stack
    direction="row"
    spacing={"0.75rem"}
    sx={{ display: "flex", justifyContent: "flex-end" }}
  >
    <Box>
      <IconButton size="small" disabled>
        <Visibility fontSize="large" />
        <Typography variant="h5">{views}</Typography>
      </IconButton>
    </Box>

    <Box>
      <IconButton size="small" onClick={onClickBookmark}>
        <BookmarkIcon fontSize="large" />
        <Typography variant="h5">{bookmarkCount}</Typography>
      </IconButton>
    </Box>
  </Stack>;
}
