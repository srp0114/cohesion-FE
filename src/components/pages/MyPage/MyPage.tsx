import React from "react";
import {
  Grid,
} from "@mui/material";
import { Track } from "../../model/user";
import { Reply } from "../../model/reply";
import { Board } from "../../model/board";
import { MyProfile } from "./MyProfile";
import { MyHistory } from "./MyHistory";
import { MySummary } from "./MySummary";
import { MyIntroduction } from "./MyIntroduction";

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

export default MyPage;
