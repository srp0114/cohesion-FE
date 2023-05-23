import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import { MyProfile } from "./MyProfile";
import { MyHistory } from "./MyHistory";
import { MyIntroduction } from "./MyIntroduction";

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
  skills: Array<string>; //추가정보페이지에서 선택한 관심있는 기술, 라이브러리나 프레임워크 의미
  introduce: string; //추가정보페이지에서 입력한 자기소개
}

const MyPage = () => {
  const [myInfo, setMyInfo] = useState<MyPageItems>({
    studentId: "",
    profileImg: "",
    nickname: "",
    track1: "",
    track2: "",
    reply: 0,
    board: 0,
    bookmark: 0,
    point: 0,
    skills: [],
    introduce: ""
  });

  const getUserInfo = async () => {
    try {
      const res = await axios.get(`/api/user-info`);
      if (res.status === 200) {
        setMyInfo(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, [])

  const onChangeUserInfo = (nickname: string, skills: string[], introduce: string) => {
    return new Promise<void>((resolve, reject) => {
      const data = {
        nickname: nickname,
        skills: skills,
        introduce: introduce
      }

      axios({
        method: "put",
        url: `/api/user/update`,
        headers: { "Content-Type": "application/json" },
        data: data,
      })
        .then((res) => {
          if (res.status === 200) { // 수정이 성공하고
            getUserInfo()
              .then(() => resolve()); // 정보 요청이 성공하면 resolve
          }
        })
        .catch((err) => {
          reject(err); // 수정 실패 시, error reject
        });
    })
  }

  console.log(myInfo.nickname)
  console.log(myInfo.skills)
  console.log(myInfo.introduce)

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
              <MyProfile studentId={myInfo.studentId} nickname={myInfo.nickname} track1={myInfo.track1} track2={myInfo.track2} profileImg={myInfo.profileImg} />
            </Grid>
            <Grid item xs={12}>
              <MyIntroduction editUserInfo={onChangeUserInfo} nickname={myInfo.nickname} introduce={myInfo.introduce} skills={myInfo.skills} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={7} rowSpacing={{ xs: "1.5rem" }}>
          <MyHistory reply={myInfo.reply} board={myInfo.board} bookmark={myInfo.bookmark} point={myInfo.point} />
        </Grid>
      </Grid>
    </>
  );
};

export default MyPage;
