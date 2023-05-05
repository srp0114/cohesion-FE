import React, {useEffect, useState} from "react";
import { Grid, IconButton, Typography, Stack, Paper } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { Track } from "../../model/user";
import { MyProfile } from "./MyProfile";
import { MyHistory } from "./MyHistory";
import { MySummary } from "./MySummary";
import { MyIntroduction } from "./MyIntroduction";
import { MySummaryItems } from "./MySummary";

import { myPageData_fresh, myPageData_sopho } from "../../data/MyPageData";
import axios from "axios"; //시험용 데이터

export interface MyPageItems {
  studentId: string; //사용자 고유식별번호, 학번, 사용자의 아이디
  profileImg: string; //추가정보에서 선택한 프로필사진
  nickname: string; //추가정보페이지의 닉네임
  track1: string; //1트랙 1학년인 경우 1,2트랙 모두 none으로 나옴.
  track2: string; //2트랙
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
  const [data,setData] = useState<MyPageItems | undefined>();

  useEffect(()=>{
    axios({
      method : "get",
      url : "/api/user-info"
    }).then((res)=>{
      setData(res.data);
    }).catch((err)=>{
      console.log(err);
    })

  },[])

  return (
    <>
      <Grid 
        container 
        direction="row" 
        gap={4}
        mt={"4rem"}
        p={2}
      >
        <Grid container item xs={12} md={4.5} rowSpacing={{ xs: "1.5rem" }} pl={"2rem"} pr={"2rem"} >
          <Grid item xs={12}>
          <MyProfile studentId={data?.studentId ?? ""} nickname={data?.nickname ?? ""} track1 = {data?.track1 ?? ""} track2 = {data?.track2 ?? ""} profileImg={test.profileImg}/>
          </Grid>
          <Grid item xs={12}>
          <MyIntroduction nickname={data?.nickname ?? ""} selfIntroduction = {data?.selfIntroduction ?? ""} language={test.language} skill={test.skill}/>
          </Grid>
        </Grid>

        <Grid
          container
          item
          rowSpacing={{ xs: "1.5rem" }}
          xs={12}
          md={7}
          direction="column"
        >
          <Grid item>
            <MyHistory reply={data?.reply ?? 0} board={data?.board ?? 0} bookmark={data?.bookmark ?? 0} point={data?.point?? 0}/>
          </Grid>
          
          <Grid container item rowSpacing={{ xs: "1.125rem" }}>
            <Grid item xs={12}>
              {!(test.dailySummary===undefined) ? (
                <MySummary dailySummary={test.dailySummary} />
              ) : (
                <Paper
                  sx={{
                    borderRadius: "15px",
                    padding: "1.125rem", //18px
                  }}
                  elevation={3}
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
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default MyPage;
