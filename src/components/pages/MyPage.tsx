import React from "react";
import {
  Badge,
  Box,
  Grid,
  IconButton,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import Image from "mui-image";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline"; //댓글
import BookmarkIcon from "@mui/icons-material/BookmarkBorder"; //북마크
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"; //게시글
import Money from "@mui/icons-material/MonetizationOn"; //포인트
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined"; //작성 및 수정
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"; //더보기

const MyPage: React.FC = () => {
  //추가정보페이지 입력 전까지는 들어오지 못하게 해야함.
  return (
    <>
      <Typography variant="h3">마이페이지</Typography>
      <Grid
        container
        columnSpacing={{ md: "36px", xs: "24px" }}
        rowSpacing={4}
        direction="row"
      >
        <Grid item xs={12} md={5}>
          <MyProfile />
        </Grid>

        <Grid
          container
          item
          rowSpacing={{ md: "36px", xs: "24px" }}
          xs={12}
          md={7}
          direction="column"
        >
          <Grid item>
            <MyHistory />
          </Grid>

          <Grid container item rowSpacing={{ md: "18px" }}>
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
          padding: "5px",
          margin: "5px",
        }}
      >
        <Typography>HANSUNG UNIVERSITY COMPUTER ENGINEERING</Typography>
        <Image
          src="https://pbs.twimg.com/profile_images/1212031261297930241/p6kIo01N_400x400.jpg"
          width={250}
          height={250}
          duration={325}
        />
        <Box>
          <Typography>닉네임</Typography>
          <Typography>종강시켜주세요</Typography>
        </Box>
        <Box>
          <Typography>소속트랙</Typography>
          <Typography>디지털콘텐츠 가상현실</Typography>
          <Typography>웹공학</Typography>
        </Box>
        <Typography>COHENSION</Typography>
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

        <Box>
          <Typography>누적포인트</Typography>
          <IconButton disabled color="primary" size="large">
            <Money /> <Typography>1080</Typography>
          </IconButton>
        </Box>
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
        padding: "5px",
        margin: "5px",
      }}
    >
      <Box>
        <Typography>오늘의 공부 기록 요약</Typography>
        <IconButton>
          <CreateOutlinedIcon />
        </IconButton>
      </Box>
      <Box>
        <Typography>
          오늘 공부한 내용에 대해 짤막한 요약글을 작성한다.
        </Typography>
      </Box>
      <Box>
        <Typography>작성날짜. 수정날짜는 별도로 표시X?</Typography>
        <IconButton>
          <MoreHorizOutlinedIcon />
        </IconButton>
      </Box>
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
        padding: "5px",
        margin: "5px",
      }}
    >
      <Box>
        <Typography>유저닉네임의 자기 소개</Typography>
        <IconButton>
          <CreateOutlinedIcon />
        </IconButton>
      </Box>

      <Box>
        <Typography>추가정보에서 작성한 기술스택</Typography>
      </Box>

      <Box>
        <Typography>추가정보에서 작성한 자기소개</Typography>
      </Box>
    </Paper>
  );
};

export default MyPage;
