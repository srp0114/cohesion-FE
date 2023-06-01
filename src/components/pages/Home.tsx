import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateCodeChallenge, generateCodeVerifier } from "../pkce/pkce";
import { Box, Modal, Typography, Button, Paper, Stack, ButtonBase, styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import Banner from "../layout/Banner";
import SideBar from "../layout/SideBar";
import HomeBoard from "../layout/HomeBoard";
import LoginModal from "../layout/LoginModal";
import axios from "axios";
import { checkLogin } from "../checkLogin";
import { WritingButton } from "../layout/CRUDButtonStuff";
import { getCurrentUserInfo } from "../getCurrentUserInfo";
import { HomeSkeleton, useSkeleton } from "../layout/Skeletons";
import { BoardType } from "../model/board";

export interface UserInfoItems {
  nickname: string;
  studentId: number;
  track1: string;
  track2?: string;
  profileImg: string | null;
}

const Home = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfoItems>({
    nickname: "",
    studentId: 0,
    track1: "",
    profileImg: null,
  });

  const handleClose = () => setOpen(false);
  const openModal = () => {
    if (!isLogin)
      setOpen(!open);
  };

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

  const loadingStatus: boolean = useSkeleton(800);

  const navigate = useNavigate();

  const handleLogin = () => {
    const verifier = generateCodeVerifier();
    sessionStorage.setItem("codeVerifier", verifier);
    const codeChallenge = generateCodeChallenge();
    sessionStorage.setItem("codeChallenge", codeChallenge);

    navigate(`/redirect`);
  };

  return (
    <>{loadingStatus ? (
      <Grid container spacing={2} gap={3.5}>
        <Grid item direction={"column"} xs={8.5}>
          <Grid item>
            <Banner />
          </Grid>
          <Grid item sx={{ filter: isLogin ? null : "blur(1.5px)" }} onClick={openModal} mt={"3rem"}>
            <LoginModal open={open} handleClose={handleClose} handleLogin={handleLogin} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <HomeBoard board="free" loginState={isLogin} />
              </Grid>
              <Grid item xs={6}>
                <HomeBoard board="questions" loginState={isLogin} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <HomeBoard board="recruit" loginState={isLogin} />
              </Grid>
              <Grid item xs={6}>
                <HomeBoard board="notice" loginState={isLogin} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs>
          <SideBar nickname={user.nickname} studentId={user.studentId} track1={user.track1} profileImg={user.profileImg} />
        </Grid>
      </Grid>) : 
      (
      <HomeSkeleton />
    )}
      {isLogin ? <WritingButton /> : null}
    </>
  );
};

export default Home;