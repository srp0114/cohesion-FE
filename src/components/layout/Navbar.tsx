import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateCodeChallenge, generateCodeVerifier } from "../pkce/pkce";
import { Button, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import UserIcon from '@mui/icons-material/AccountCircleOutlined';
import axios from "axios";


const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget); //게시판 클릭이되면 이거
  };
  const handleClose = () => {
    //onClose가 true면 메뉴가 보이고, false면 메뉴가 숨겨진다.
    setAnchorEl(null);
  };

  const [isLogin, setIsLogin] = useState<boolean>(false);

  // sessionStorage로부터 저장된 토큰 있는지 처음 렌더링할때만 확인
  // 토큰여부에 따라 네비게이션 바 상단 로그인 - 로그아웃 버튼 조절
  // 로그아웃 기능 추가 필요!!
  useEffect(() => {
    let token = sessionStorage.getItem("id_token");
    // token 여부에 따라 로그인 여부 정하기
    token ? setIsLogin(true) : setIsLogin(false);
    console.log(token);
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
      axios({
        method : "get",
        url : "http://localhost:8081/logout",
        withCredentials : true
      }).then((res)=>{
          sessionStorage.clear();
          window.location.href="/";
      }).catch((err)=>{
        console.log(err);
    })
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
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", m: 2 }}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-start", marginLeft: 3 }}
        >
          <Button
            onClick={moveToHome}
            sx={{ color: "black", paddingLeft: 3, paddingRight: 3 }}
          >
            홈
          </Button>
          <Button
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ color: "black", paddingLeft: 3, paddingRight: 3 }}
          >
            게시판
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={moveToFree}>자유게시판</MenuItem>
            <MenuItem onClick={moveToQna}>Q&A게시판</MenuItem>
            <MenuItem onClick={moveToRecruit}>모집게시판</MenuItem>
          </Menu>
          <Button sx={{ color: "black", paddingLeft: 3, paddingRight: 3 }}>
            학부정보
          </Button>
          <Button
            onClick={moveToNotice}
            sx={{ color: "black", paddingLeft: 3, paddingRight: 3 }}
          >
            공지사항
          </Button>
        </Box>

          <Box sx={{display:'flex'}}>
              <IconButton onClick={moveToMyPage}>
              <UserIcon fontSize="large" /> 
              </IconButton>
              {/* 로그인시 띄울 닉네임 여기에 */}
              <Typography sx={{pt:2.5}}variant="subtitle1">김서영</Typography>
            <Button sx={{ m: 2 }} onClick={handleLogin}>
              {isLogin ? "로그아웃" : "로그인"}
            </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Navbar;
