import React from "react";
import {
  Badge,
  Box,
  Divider,
  Grid,
  IconButton,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline"; //댓글
import BookmarkIcon from "@mui/icons-material/BookmarkBorder"; //북마크
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"; //게시글
import Money from "@mui/icons-material/MonetizationOn"; //포인트
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined"; //작성 및 수정
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"; //더보기
import { Track } from "../model/user";
import { Reply } from "../model/reply";
import { Board } from "../model/board";

export interface MyPageItems {
  //논의 후 수정 必
  studentId: string; //사용자 고유식별번호, 학번, 사용자의 아이디
  profileImg: string; //추가정보에서 선택한 프로필사진
  nickname: string; //추가정보페이지의 닉네임
  track1: Track; //1트랙 1학년인 경우 1,2트랙 모두 none으로 나옴.
  track2: Track; //2트랙
  reply?: Array<Reply>; //자신이 작성한 댓글의 배열
  board?: Array<Board>; //자신이 작성한 게시글의 배열
  bookmark?: Array<Board>; //북마크한 게시글들의 배열
  point: number; //사용자의 포인트
  dailySummary: Array<Board>; //오늘 공부 기록
  skill?: string; //추가정보페이지에서 선택한 관심있는 기술, 라이브러리나 프레임워크 의미
  language?: string; //추가정보페이지에서 선택한 언어, js, java, c, python의 언어 의미
  selfIntroduction: string; //추가정보페이지에서 입력한 자기소개
}

const MyPage: React.FC = () => {
  //추가정보페이지 입력 전까지는 들어오지 못하게 해야함.
  return (
    <>
      <Grid
        container
        columnSpacing={{ md: "2.5rem", xs: "1.5rem" }} //1rem == 16px, 2.5rem == 36px, 1.5rem == 24px, 1.125rem === 18px
        rowSpacing={4}
        direction="row"
      >
        <Grid item xs={12} md={4}>
          <MyProfile />
        </Grid>

        <Grid
          container
          item
          rowSpacing={{ md: "2.5rem", xs: "1.5rem" }}
          xs={12}
          md={8}
          direction="column"
        >
          <Grid item>
            <MyHistory />
          </Grid>

          <Grid container item rowSpacing={{ xs: "1.125rem" }}>
            <Grid item xs={12}>
              <MySummary />
            </Grid>

            <Grid item xs={12}>
              <MyIntroduction />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

/**
 * 유저의 기본정보를 나타내는 컴포넌트
 */
const MyProfile: React.FC = () => {
  return (
    <>
      <Paper
        sx={{
          border: "0.5px solid black",
          borderRadius: "20px",
          padding: "1.125rem",
        }}
      >
        <Grid
          container
          rowSpacing={{ xs: "2.5rem" }}
          direction="column"
          sx={{ padding: "0 3rem", textAlign: "center" }}
        >
          <Grid item>
            <Typography>HANSUNG UNIVERSITY</Typography>
            <Typography>COMPUTER ENGINEERING</Typography>
          </Grid>
          <Grid item>
            <img
              src="https://pbs.twimg.com/profile_images/1212031261297930241/p6kIo01N_400x400.jpg"
              width="250px"
              height="250px"
              style={{ border: "1px solid black" }}
            />
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="body1">닉네임</Typography>
              <Typography variant="h6">종강시켜주세요</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="body2">소속트랙</Typography>
              <Typography variant="h6">디지털콘텐츠 가상현실</Typography>
              <Typography variant="h6">웹공학</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Typography>COHENSION</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

/**
 * 유저가 남긴 댓글,게시글, 북마크 및 누적 포인트
 *
 */
const MyHistory: React.FC = () => {
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

/**
 * 유저가 오늘 공부한 것들을 기록하는 컴포넌트
 * 날짜, id, string,
 */
const MySummary: React.FC = () => {
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

/**
 * 유저의 자기소개란. 자신의 기술스택, 자기 한 줄소개, 그 외 기타(프로젝트 소개나 공모전 입상 등)을 적는 컴포넌트
 * skills, | language와 자기 한 줄 소개를 쓰는 string...
 */
const MyIntroduction: React.FC = () => {
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

export default MyPage;
