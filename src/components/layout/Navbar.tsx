import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateCodeChallenge, generateCodeVerifier } from "../pkce/pkce";
import { Button, Box, Grid, Menu, MenuItem } from "@mui/material";
import Profile from "../layout/Profile";
import { checkLogin } from "../checkLogin";
import { logoutHandler } from "../logoutHandler";
import { getCurrentUserInfo } from "../getCurrentUserInfo";
import SearchField from "./SearchField";
import pingpong from "../asset/logo/pingpong.png";
import pingpong_hover from "../asset/logo/pingpong_hover.png";

const logo = [pingpong, pingpong_hover];

const Navbar = () => {
  const navigate = useNavigate();
  const [logoHover, setLogoHover] = React.useState<number | 0 | 1>(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget); //게시판 클릭이되면 이거
  };
  const handleClose = () => {
    //onClose가 true면 메뉴가 보이고, false면 메뉴가 숨겨진다.
    setAnchorEl(null);
  };

  const handleLogoHover = () => {
    setLogoHover(Math.abs(logoHover - 1));
  }

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [profileImg, setProfileImg] = useState<string | null>(null);

  // sessionStorage로부터 저장된 토큰 있는지 처음 렌더링할때만 확인
  // 토큰여부에 따라 네비게이션 바 상단 로그인 - 로그아웃 버튼 조절
  // 로그아웃 기능 추가 필요!!
  useEffect(() => {
    checkLogin()
      .then((res) => {
        if (res) {
          setIsLogin(true);
          getCurrentUserInfo()
            .then((userInfo) => {
              setNickname(userInfo.nickname);
              setProfileImg(userInfo.profileImg);
            })
            .catch((err) => console.log(err));
        } else {
          setIsLogin(false);
        }
      })
  }, []);

  // 백에서 Home페이지에 추가해둔 로그인 핸들러 그대로 가져왔습니다
  // else 부분 (isLogin(true)인 상태) -> 로그아웃 처리 필요
  const handleLogin = () => {
    if (!isLogin) {
      const verifier = generateCodeVerifier();
      sessionStorage.setItem("codeVerifier", verifier);
      const codeChallenge = generateCodeChallenge();
      sessionStorage.setItem("codeChallenge", codeChallenge);
      navigate(`/redirect`);
    } else {
      //인가서버 로그아웃 처리(세션 쿠키 삭제)
      logoutHandler();
    }
  };

  const moveToHome = () => {
    navigate("/");
    handleClose();
  };

  const moveToFree = () => {
    navigate("/free");
    handleClose();
  };

  const moveToQna = () => {
    navigate("/questions");
    handleClose();
  };

  const moveToRecruit = () => {
    navigate("/recruit");
    handleClose();
  };

  const moveToNotice = () => {
    navigate("/notice");
    handleClose();
  };

  const moveToMyPage = () => {
    navigate("/mypage");
    handleClose();
  };

  return (
    <>
      <Grid container direction={"row"} spacing={"1rem"} alignItems={"center"} sx={{ mt: "1.5rem", mb: "2rem" }} >
        <Grid item container xs={12} md={6}>
          <img
            src={`${logo[logoHover]}`}
            onClick={moveToHome}
            style={{
              width: "16rem",
              cursor: "default",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => {
              handleLogoHover();
              e.currentTarget.style.cursor = "pointer";
              e.currentTarget.style.filter = "drop-shadow(5px 5px 5px #555)";
            }}
            onMouseOut={(e) => {
              handleLogoHover();
              e.currentTarget.style.cursor = "default";
              e.currentTarget.style.filter = "none";
            }}
          />
          <Button
            className="navButton"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >게시판</Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={moveToFree}>자유게시판</MenuItem>
            <MenuItem onClick={moveToQna}>Q&A게시판</MenuItem>
            <MenuItem onClick={moveToRecruit}>구인게시판</MenuItem>
          </Menu>
          <Button onClick={moveToNotice} className="navButton">공지사항</Button>
        </Grid>

        <Grid item xs={12} md={6} container direction="row" alignItems="center" justifyContent={"flex-end"}>
          {isLogin ? (
            <>
              <SearchField />
              <Button className="profile" onClick={moveToMyPage}>
                <Profile nickname={nickname} imgUrl={profileImg} size={28} />
              </Button>
              <Button onClick={handleLogin} className="loginButton">
                로그아웃
              </Button>
            </>) : (
            <Button onClick={handleLogin} className="loginButton">로그인</Button>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Navbar;
