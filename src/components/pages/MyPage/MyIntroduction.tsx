import React from "react";
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { MyPageItems } from "./MyPage";

/**
 * 유저의 자기소개란. 자신의 기술스택, 자기 한 줄소개, 그 외 기타(프로젝트 소개나 공모전 입상 등)을 적는 컴포넌트
 * skills, | language와 자기 한 줄 소개를 쓰는 string...
 */
interface MyIntroductionProps {
  nickname: string;
  skill?: Array<string>;
  language?: Array<string>;
  selfIntroduction: string;
}

export const MyIntroduction = (props: MyIntroductionProps) => {
  const language = props.language;
  const skill = props.skill;

  return (
    <Paper
      sx={{
        border: "0.5px solid black",
        borderRadius: "20px",
        padding: "1.125rem",
      }}
    >
      <Stack
        direction="row"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography>{`Hello, ${props.nickname}!`}</Typography>
        <IconButton>
          <CreateOutlinedIcon />
        </IconButton>
      </Stack>

      <Grid container rowSpacing={"1.125rem"} direction="column">
        <Grid item>
          <Typography>추가정보에서 작성한 기술스택</Typography>
          <Box>
            {language?.map((lang, idx) => {
              return <Chip key={idx} label={lang} variant="filled" />;
            })}
            {skill?.map((ski, idx) => {
              return <Chip key={idx} label={ski} variant="outlined" />;
            })}
          </Box>
        </Grid>

        <Grid item>
          <Typography>추가정보에서 작성한 자기소개</Typography>

          <Typography>{props.selfIntroduction}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
