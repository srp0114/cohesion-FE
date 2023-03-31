import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Banner from "../layout/Banner";
import LeftSidebar from "../layout/LeftSidebar";
import RightSidebar from "../layout/RightSidebar";
import Board from "../layout/Board";
import Board2 from "../layout/Board2";
import { Fab, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { generateCodeChallenge, generateCodeVerifier } from "../pkce/pkce";

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

const Home: React.FC = () => {

  const [isLogin, setIsLogin] = useState<boolean>(false);

  //sessionStorage로부터 저장된 토큰 있는지 처음 렌더링할때만 확인
  //토큰있으면 - 게시판 보이도록
  //토큰없으면 - 게시판 블러 처리
  useEffect (() => {
    let token = sessionStorage.getItem("id_token");
    // token여부에 따라 로그인 여부 정하기
    token ? (setIsLogin(true)) : (setIsLogin(false));
    console.log(token);
  }, [])

  const navigate = useNavigate();

  const handleLogin = () => {
    const verifier = generateCodeVerifier();
    sessionStorage.setItem("codeVerifier", verifier);
    const codeChallenge = generateCodeChallenge();
    sessionStorage.setItem("codeChallenge", codeChallenge);

    navigate(`/redirect`);
  };
  
  return (
    <>
      <button onClick={handleLogin}>로그인</button>
      <Grid container spacing={2}>
        <Grid xs>
          <LeftSidebar />
        </Grid>
        <Grid xs={9}>
          <Banner />
          <Grid container spacing={2} 
            sx={{
              //로그인 여부에 따라 블러 처리              
              filter: isLogin? null : "blur(2px)"
            }}
          >
            <Grid xs>
              <Board />
              <Board2 />
            </Grid>
            <Grid xs>
              <Board2 />
              <Board />
            </Grid>
          </Grid>
          <WritingButton />
        </Grid>
        <Grid xs>
          <RightSidebar />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
