import React from "react";
import {
  Grid,
  IconButton,
  Typography,
  Stack,
  Paper
} from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

/**
 * 유저의 자기소개란. 자신의 기술스택, 자기 한 줄소개, 그 외 기타(프로젝트 소개나 공모전 입상 등)을 적는 컴포넌트
 * skills, | language와 자기 한 줄 소개를 쓰는 string...
 */
export const MyIntroduction: React.FC = () => {
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
        <Typography>유저닉네임의 자기 소개</Typography>
        <IconButton>
          <CreateOutlinedIcon />
        </IconButton>
      </Stack>

      <Grid container rowSpacing={"1.125rem"} direction="column">
        <Grid item>
          <Typography>추가정보에서 작성한 기술스택</Typography>
          <Typography>리액트, C, Javascript</Typography>
        </Grid>

        <Grid item>
          <Typography>추가정보에서 작성한 자기소개</Typography>

          <Typography>
            내가 뭘 할 수 있는지에 대해서 작성을 해놨습니다.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
