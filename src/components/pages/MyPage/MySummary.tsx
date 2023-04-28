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
export interface MySummaryItems { //유저가 작성한 공부기록들 중 가장 최신 글을 가지고와야한다.
  summaryId: string; //공부내용 요약 고유 id
  date: string; //가장 최신 공부기록의 날짜
  content: string; //공부기록내용
}

export const MySummary = (props: { dailySummary?: MySummaryItems}) => {

  const { dailySummary } = props;
  if(!dailySummary) return null;

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
        <Typography>공부한 내용 요약 기록</Typography>

        <IconButton>
          <CreateOutlinedIcon />
        </IconButton>
      </Stack>

      <Typography>
        {dailySummary.content}
      </Typography>

      <Stack
        direction="row"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1.125rem",
        }}
      >
        <Typography>{dailySummary.date}</Typography>

        <IconButton>
          <MoreHorizOutlinedIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};
