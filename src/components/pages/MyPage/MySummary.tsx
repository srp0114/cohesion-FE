import React from "react";
import {
  IconButton,
  Typography,
  Stack,
  Paper
} from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

/**
 * 유저가 오늘 공부한 것들을 기록하는 컴포넌트
 * 날짜, id, string,
 */
export const MySummary: React.FC = () => {
  return (
    <Paper
      sx={{
        border: "0.5px solid black",
        borderRadius: "20px",
        padding: "1.125rem", //18px
      }}
    >
      <Stack
        direction="row"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography>오늘의 공부 기록 요약(가제)</Typography>

        <IconButton>
          <CreateOutlinedIcon />
        </IconButton>
      </Stack>

      <Typography>
        Decorators are an upcoming ECMAScript feature that allow us to customize
        classes and their members in a reusable way. 오늘 공부 기록에 대한
        문장입니다.
      </Typography>

      <Stack
        direction="row"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1.125rem",
        }}
      >
        <Typography>작성날짜. 수정날짜는 별도로 표시X?</Typography>

        <IconButton>
          <MoreHorizOutlinedIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};
