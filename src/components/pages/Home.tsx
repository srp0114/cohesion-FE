import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateCodeChallenge, generateCodeVerifier } from "../pkce/pkce";
import { Fab, Box, Modal, Typography, ButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Banner from "../layout/Banner";
import LeftSidebar from "../layout/LeftSidebar";
import RightSidebar from "../layout/RightSidebar";
import HomeFreeBoard from "../layout/HomeFreeBoard";
import HomeQnABoard from "../layout/HomeQnABoard";
import AddIcon from "@mui/icons-material/Add";
import hansung from  "../asset/image/hansung.png";
import axios from "axios";
import {checkLogin} from "../checkLogin";

const Home: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [nickname, setNickname] = useState(undefined);
  const handleClose = () => setOpen(false);

  // sessionStorage로부터 저장된 토큰 있는지 처음 렌더링할때만 확인
  // 토큰있으면 - 게시판 보이도록
  // 토큰없으면 - 게시판 블러 처리
  useEffect(() => {
    checkLogin().then((res) => {
      if (res) {
        setIsLogin(true);
        axios({
          method: "get",
          url: "/api/user-info",
        })
            .then((res) => {
              setNickname(res.data.nickname);
            })
            .catch((err) => {
              console.log(err);
            });
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

  return (
    <>
      <Grid container spacing={3}>
          <Grid xs>
            <LeftSidebar nickname={nickname} />
          </Grid>

          <Grid xs={8}>
            <Banner/>

            <Grid container spacing={5}
                  onClick={openModal}
            >

              <Grid xs
                sx={{
                  // 로그인 여부에 따라 블러 처리              
                  filter: isLogin? null : "blur(1.5px)"
                }}
                // 로그인 토큰 없는 상태에서 클릭하는 경우 - 모달창 open
              >
                <Modal
                  open={open}
                  onClose={handleClose}
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                > 
                <Box sx={loginModalstyle}>
                  <Typography align="center" variant="h5" sx={{mt:2}}>Cohesion에 오신 것을 환영합니다!</Typography>
                  <Typography align="center" variant="subtitle1" sx={{mt:2, mb:2}}>한성대학교 로그인 페이지로 이동합니다</Typography>
                  <StartButton onClick={handleLogin}>
                    <img src={hansung} width="30" style={{marginRight:10}}/>한성대학교로 시작하기
                  </StartButton>
                </Box>
                </Modal>

                <HomeFreeBoard loginState={isLogin} />
              </Grid>


              <Grid xs
                sx={{
                  // 로그인 여부에 따라 블러 처리              
                  filter: isLogin? null : "blur(1.5px)"
                }}>
                <HomeQnABoard loginState={isLogin} />
              </Grid>
              {isLogin ? <WritingButton/> : null}
          </Grid>

        </Grid>

        <Grid xs>
          <RightSidebar />
        </Grid>
      </Grid>
    </>
  );
};

// 모달 내 box스타일
const loginModalstyle = {
  borderRadius: 5,
  p: 4,
  bgcolor: 'background.paper',
  boxShadow: 20,
};

// 선택 버튼 커스텀
const StartButton = styled(ButtonBase)(({ theme }) => ({
  width:600,
  height: 80,
  "&:hover, &.Mui-focusVisible": {
    zIndex: 2,
    backgroundColor: '#f7f7f7',
    transform: 'translateY(-7%)',
  },
  borderRadius: 20,
  border: '2px solid #777777'
}));

// 작성하기 버튼
const WritingButton = () => {
  const navigate = useNavigate();

  const goToWriting = () => {
    navigate("/post");
  };
  
  return (
    <Box sx={{ "& > :not(style)": { ml: 120 } }}>
      <Fab
        size="medium"
        color="primary"
        aria-label="edit"
        onClick={goToWriting}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Home;