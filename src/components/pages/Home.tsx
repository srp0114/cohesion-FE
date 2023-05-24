import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateCodeChallenge, generateCodeVerifier } from "../pkce/pkce";
import { Box, Modal, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Banner from "../layout/Banner";
import SideBar from "../layout/SideBar";
import HomeBoard from "../layout/HomeBoard";
import hansung from "../asset/image/hansung.png";
import axios from "axios";
import { checkLogin } from "../checkLogin";
import { WritingButton } from "../layout/CRUDButtonStuff";
import { getCurrentUserInfo } from "../getCurrentUserInfo";

export interface UserInfoItems {
  nickname: string;
  studentId: number;
  track1: string;
  track2?: string;
  profileImg: string | null;
}

const Home = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useState<UserInfoItems>({
    nickname: "",
    studentId: 0,
    track1: "",
    profileImg: null,
  });

  const handleClose = () => setOpen(false);

  // sessionStorage로부터 저장된 토큰 있는지 처음 렌더링할때만 확인
  // 토큰있으면 - 게시판 보이도록
  // 토큰없으면 - 게시판 블러 처리
  useEffect(() => {
    checkLogin().then((res) => {
      if (res) {
        setIsLogin(true);
        getCurrentUserInfo()
          .then(userInfo => {
            setUser(userInfo)
          })
          .catch(err => console.log(err));
      } else {
        setIsLogin(false);
      }
    });
  }, []);

  const navigate = useNavigate();

  const handleLogin = () => {
    const verifier = generateCodeVerifier();
    sessionStorage.setItem("codeVerifier", verifier);
    const codeChallenge = generateCodeChallenge();
    sessionStorage.setItem("codeChallenge", codeChallenge);

    navigate(`/redirect`);
  };

  const openModal = () => {
    if (!isLogin)
      setOpen(!open);
  };

  //로그인 모달
  const LoginModal = () => (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={loginModalstyle}>
        <Typography align="center" variant="h5" sx={{ mt: 2 }}>Cohesion에 오신 것을 환영합니다!</Typography>
        <Typography align="center" variant="subtitle1" sx={{ mt: 2, mb: 2 }}>한성대학교 로그인 페이지로 이동합니다</Typography>
        <Button className="startButton" onClick={handleLogin}>
          <img src={hansung} width="30" style={{ marginRight: 10 }} />한성대학교로 시작하기
        </Button>
      </Box>
    </Modal>
  );

  return (
    <>
      <Grid container xs={12} columnSpacing={2} rowSpacing={3.5}>
        {/* 배너 */}
        <Grid item xs={12} md={9} columnSpacing={2}>
          <Banner />
        </Grid>
        {/* 사용자 정보 */}
        <Grid item xs={12} md={3}>
          <SideBar nickname={user.nickname} studentId={user.studentId} track1={user.track1} profileImg={user.profileImg} />
        </Grid>
        {/* 로그인 모달 적용 시킨 각 게시판들 */}
        <Grid item container xs={12} md={9} spacing={2} onClick={openModal}>
          {/* 로그인 모달 */}
          <LoginModal />
          {/* 자유게시판 */}
          <Grid xs={12} md={6}
            sx={{ filter: isLogin ? null : "blur(1.5px)" }}>
            <HomeBoard board="free" loginState={isLogin} />
          </Grid>
          {/* Q&A게시판 */}
          <Grid xs={12} md={6}
            sx={{ filter: isLogin ? null : "blur(1.5px)" }}>
            {/* qna -> questions로 수정*/}
            <HomeBoard board="questions" loginState={isLogin} />
          </Grid>
          {/* 구인게시판 */}
          <Grid xs={12} md={6}
            sx={{ filter: isLogin ? null : "blur(1.5px)" }}>
            {/* TODO: 구인게시판 main api 작업 후 board 수정*/}
            <HomeBoard board="recruit" loginState={isLogin} />
          </Grid>
          {/* 공지사항 */}
          <Grid xs={12} md={6}
            sx={{ filter: isLogin ? null : "blur(1.5px)" }}>
            {/* TODO: 공지사항 main api 작업 후 board 수정*/}
            <HomeBoard board="free" loginState={isLogin} />
          </Grid>
        </Grid>

      </Grid>
      {isLogin ? <WritingButton /> : null}
    </>
  );
};

const loginModalstyle = {
  borderRadius: 5,
  p: 4,
  bgcolor: 'background.paper',
  boxShadow: 20,
};

export default Home;