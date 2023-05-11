import React, {useEffect, useState} from "react";
import { Grid, IconButton, Typography, Stack, Paper } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { Track } from "../../model/user";
import { MyProfile } from "./MyProfile";
import { MyHistory } from "./MyHistory";
import { MyIntroduction } from "./MyIntroduction";

import { myPageData_fresh, myPageData_sopho } from "../../data/MyPageData";
import axios from "axios"; //시험용 데이터

export interface MyPageItems {
  studentId: string; //사용자 고유식별번호, 학번, 사용자의 아이디
  profileImg: string | null; //추가정보에서 선택한 프로필사진
  nickname: string; //추가정보페이지의 닉네임
  track1: string; //1트랙 1학년인 경우 1,2트랙 모두 none으로 나옴.
  track2: string; //2트랙
  reply: number; //자신이 작성한 댓글 수, 기본값 0
  board: number; //자신이 작성한 게시글 수, 기본값 0
  bookmark: number; //북마크한 게시글 수, 기본값 0
  point: number; //사용자의 포인트
  skills?: Array<string>; //추가정보페이지에서 선택한 관심있는 기술, 라이브러리나 프레임워크 의미
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
        <Grid item xs={12} md={4.5} rowSpacing={{ xs: "1.5rem" }} pl={"2rem"} pr={"2rem"} >
          <Grid container item direction="column" gap={4}>
          <Grid item xs={12}>
            <MyProfile studentId={data?.studentId ?? ""} nickname={data?.nickname ?? ""} track1 = {data?.track1 ?? ""} track2 = {data?.track2 ?? ""} profileImg={data?.profileImg ?? null}/>
          </Grid>
          <Grid item xs={12}>
          <MyIntroduction nickname={data?.nickname ?? ""} selfIntroduction = {data?.selfIntroduction ?? ""} skill={data?.skills}/>
          </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={7} rowSpacing={{ xs: "1.5rem" }}>
          <MyHistory reply={data?.reply ?? 0} board={data?.board ?? 0} bookmark={data?.bookmark ?? 0} point={data?.point?? 0}/>
        </Grid>
      </Grid>
    </>
  );
};

export default MyPage;
