import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateCodeChallenge, generateCodeVerifier } from "../pkce/pkce";
import { Box, Modal, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Banner from "../layout/Banner";
import SideBar from "../layout/SideBar";
import HomeBoard from "../layout/HomeBoard";
import hansung from  "../asset/image/hansung.png";
import axios from "axios";
import {checkLogin} from "../checkLogin";
import { WritingButton } from "../layout/CRUDButtonStuff";
import {getCurrentUserInfo} from "../getCurrentUserInfo";

const Home: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [nickname, setNickname] = useState<string>("");
  const handleClose = () => setOpen(false);

  // sessionStorage로부터 저장된 토큰 있는지 처음 렌더링할때만 확인
  // 토큰있으면 - 게시판 보이도록
  // 토큰없으면 - 게시판 블러 처리
  useEffect(() => {
    checkLogin().then((res) => {
      if (res) {
        setIsLogin(true);
        getCurrentUserInfo()
          .then(userInfo => setNickname(userInfo.nickname))
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
    if(!isLogin) 
      setOpen(!open);
  };

  console.log(nickname);

  return (
    <>
      <Grid container spacing={2} gap={2}>
      <Grid item xs={8.5}>
        <Banner/>
        <Grid container spacing={2} onClick={openModal}>
          <Modal
            open={open}
            onClose={handleClose}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}> 
            <Box sx={loginModalstyle}>
              <Typography align="center" variant="h5" sx={{mt:2}}>Cohesion에 오신 것을 환영합니다!</Typography>
              <Typography align="center" variant="subtitle1" sx={{mt:2, mb:2}}>한성대학교 로그인 페이지로 이동합니다</Typography>
              <Button className="startButton" onClick={handleLogin}>
                <img src={hansung} width="30" style={{marginRight:10}}/>한성대학교로 시작하기
              </Button>
            </Box>
          </Modal>

          <Grid xs
            sx={{ filter: isLogin? null : "blur(1.5px)"}}>
            <HomeBoard board="free" loginState={isLogin} />
          </Grid>
          <Grid xs
            sx={{ filter: isLogin? null : "blur(1.5px)"}}>
            <HomeBoard board="qna" loginState={isLogin} />
          </Grid>
        </Grid>

        <Grid container spacing={2} onClick={openModal}>
          <Modal
            open={open}
            onClose={handleClose}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}> 
            <Box sx={loginModalstyle}>
              <Typography align="center" variant="h5" sx={{mt:2}}>Cohesion에 오신 것을 환영합니다!</Typography>
              <Typography align="center" variant="subtitle1" sx={{mt:2, mb:2}}>한성대학교 로그인 페이지로 이동합니다</Typography>
              <Button className="startButton" onClick={handleLogin}>
                <img src={hansung} width="30" style={{marginRight:10}}/>한성대학교로 시작하기
              </Button>
            </Box>
          </Modal>

          <Grid xs
            sx={{ filter: isLogin? null : "blur(1.5px)"}}>
            {/* TODO: 구인게시판 main api 작업 후 board 수정*/}
            <HomeBoard board="free" loginState={isLogin} />
          </Grid>
          <Grid xs
            sx={{ filter: isLogin? null : "blur(1.5px)"}}>
            {/* TODO: 공지사항 main api 작업 후 board 수정*/}
            <HomeBoard board="free" loginState={isLogin} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs>
        <SideBar nickname={nickname}/> 
      </Grid>

      </Grid>
      {isLogin ? <WritingButton/> : null}
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