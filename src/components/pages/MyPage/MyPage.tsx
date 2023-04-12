import React from "react";
import { Grid, IconButton, Typography, Stack, Paper } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { Track } from "../../model/user";
import { MyProfile } from "./MyProfile";
import { MyHistory } from "./MyHistory";
import { MySummary } from "./MySummary";
import { MyIntroduction } from "./MyIntroduction";
import { MySummaryItems } from "./MySummary";

import { myPageData_fresh, myPageData_sopho } from "../../data/MyPageData"; //시험용 데이터

export interface MyPageItems {
  studentId: string; //사용자 고유식별번호, 학번, 사용자의 아이디
  profileImg: string; //추가정보에서 선택한 프로필사진
  nickname: string; //추가정보페이지의 닉네임
  track1: Track; //1트랙 1학년인 경우 1,2트랙 모두 none으로 나옴.
  track2: Track; //2트랙
  reply: number; //자신이 작성한 댓글 수, 기본값 0
  board: number; //자신이 작성한 게시글 수, 기본값 0
  bookmark: number; //북마크한 게시글 수, 기본값 0
  point: number; //사용자의 포인트
  dailySummary?: MySummaryItems; //
  skill?: Array<string>; //추가정보페이지에서 선택한 관심있는 기술, 라이브러리나 프레임워크 의미
  language?: Array<string>; //추가정보페이지에서 선택한 언어, js, java, c, python의 언어 의미
  selfIntroduction: string; //추가정보페이지에서 입력한 자기소개
}

const MyPage = () => {
  //추가정보페이지 입력 전까지는 들어오지 못하게 해야함.
  const test = myPageData_fresh; //myPageData_fresh도 가능. 시험용 데이터입니다.연동 후에 지우면 됩니다. test으로 되어있는 것도 변경되어야함.

  return (
    <>
      
      <Grid
        container
        columnSpacing={{ md: "2.5rem", xs: "1.5rem" }} //1rem == 16px, 2.5rem == 36px, 1.5rem == 24px, 1.125rem === 18px
        rowSpacing={4}
        direction="row"
      >
        <Grid item xs={12} md={4}>
          <MyProfile nickname={test.nickname} track1 = {test.track1} track2 = {test.track2} profileImg={test.profileImg}/>
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
            <MyHistory reply={test.reply} board={test.board} bookmark={test.bookmark} point={test.point}/>
          </Grid>

          <Grid container item rowSpacing={{ xs: "1.125rem" }}>
            <Grid item xs={12}>
              {!(test.dailySummary===undefined) ? (
                <MySummary dailySummary={test.dailySummary} />
              ) : (
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

                  <Typography>아직 공부기록이 없습니다.</Typography>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12}>
              <MyIntroduction nickname={test.nickname} selfIntroduction = {test.selfIntroduction} language={test.language} skill={test.skill}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default MyPage;
