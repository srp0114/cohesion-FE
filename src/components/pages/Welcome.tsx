import React, { SyntheticEvent, useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Stack, ButtonBase, ListItemAvatar, Avatar, Autocomplete, Grid } from "@mui/material";
import { skillData } from "../data/SkillData";
import profileImg from "../asset/image/react.png";
import { styled } from "@mui/material/styles";
import IdTokenVerifier from "idtoken-verifier";
import axios from "axios";
import { useNavigate } from "react-router";
import {logoutHandler} from "../logoutHandler";
import Profile from "../layout/Profile";
import { useForm, SubmitHandler } from "react-hook-form";

interface UserAccountItems {
  sub: number; //학번
  name: string; //이름
  track1: string; //1트랙
  track2: string; //2트랙
  picture: string; //프로팔
}

interface UserInfoItems {
  nickname: string; //닉네임
  introduce?: string; //자기소개
  skills?: Array<string>; //관심기술 - 최대 5개
}

const Welcome = () => {
  const [profileImg, setProfileImg] = useState<string>("");
  const [userAccount, setUserAccount] = useState<UserAccountItems>({
    sub: 0,
    name: "",
    track1: "",
    track2: "",
    picture: profileImg
  });
  const [userInfo, setUserInfo] = useState<UserInfoItems>({
    nickname: "",
    introduce: "",
  });
  const [skill, setSkill] = useState<typeof skillData>([]);




  const navigate = useNavigate();

  useEffect(() => {
    idTokenVerifier();
  }, []);

  const idTokenVerifier = () => {
    const verifier = new IdTokenVerifier({
      issuer: "http://localhost:8081", // issuer 가 같은지
      audience: "client", // audience 가 같은지
      jwksURI: "http://localhost:8081/oauth2/jwks", // get public key
    });

    const id_token = sessionStorage.getItem("id_token");

    if (id_token) {
      verifier.verify(id_token, (error, payload: any) => {
        if (error) {
          alert("토큰이 만료되었습니다.");
          return;
        }
        setUserAccount(payload);
        if (payload) {
          setProfileImg(payload.picture);
        }
      });
    } else {
      alert("로그인이 필요합니다.");
      window.location.href = "/";
    }
  };

  // 프로필 선택 여부 확인을 위한 useState 
  // 기본 -1로 지정
  const [flag, setFlag] = useState<number>(-1);

  // 닉네임, 자기소개 핸들러
  const onNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({...userInfo, nickname: event.target.value})
  };

  const onIntroduceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({...userInfo, introduce: event.target.value})
  };

  const onSkillChange = (event: SyntheticEvent<Element, Event>, value: any) => {
    setUserInfo({...userInfo, skills: value});
    setSkill(value);
  }

  const request_data = {
    studentId: userAccount.sub,
    name: userAccount.name,
    track1: userAccount.track1,
    track2: userAccount.track2,
    picture: userAccount.picture,
    nickname: userInfo.nickname,
    introduce: userInfo.introduce,
    skills: skill.map(s => s.name)
  };


  const confirm = () => {
    axios({
      method: "post",
      url: "/api/join",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(request_data),
    })
      .then((response) => {
        if (response.status === 200) { // 부가 정보 입력 정상 완료 시
          navigate("/"); // 메인 페이지로 이동 
        } // 에러 핸들링 ...
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const back= ()=>{
    logoutHandler();
  }

  const onProfileChange = (flag: number) => {
    setFlag(flag);
    flag === 1 ? 
      setUserAccount({...userAccount, picture: profileImg})
     : 
      setUserAccount({...userAccount, picture: ""})
  }

  return (
    <>
      <Grid item xs={12}>
        <Grid item>
        <Box sx={{ m: 5, mt:10, mb:10,  p: 1 }}>
          <Typography variant="h3" align="center">
            추가 정보를 입력해주세요
          </Typography>
        </Box>
        </Grid>

        <Grid>
        <Box sx={{ pl: 15, pr: 15, mb: 5 }}>
          <Stack spacing={5}>
            <Box>
              <Typography>* 프로필을 선택해주세요</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  mt: 2,
                }}
              >
                  <ImageButton 
                    style={flag === 1 ? clickBorder : defaultBorder} 
                    onClick={()=>onProfileChange(1)}
                  >
                    <ListItemAvatar>
                      <Avatar src={profileImg} />
                    </ListItemAvatar>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        p: 4,
                      }}
                    >
                      {userAccount.name}
                    </Typography>
                  </ImageButton>
                  
                  <ImageButton 
                    style={flag === 2 ? clickBorder : defaultBorder} 
                    onClick={()=>onProfileChange(2)}
                  >
                    <Profile nickname={userInfo.nickname} size={40}/>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        p: 4,
                      }}
                    >
                      {userInfo.nickname}
                    </Typography>
                  </ImageButton>
              </Box>
            </Box>
            <Box>
              <TextField
                disabled
                variant="outlined"
                label="이름"
                value={userAccount.name}
                fullWidth
                //InputProps={{ sx: { backgroundColor: "#e0e0e0" } }}
                sx={{ mt: 2 }}
              />
            </Box>
            <Box>
              <TextField
                disabled
                fullWidth
                variant="outlined"
                label="학번"
                value={userAccount.sub}
                sx={{ mt: 2 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ width: "400px" }}>
                <TextField
                  disabled
                  fullWidth
                  variant="outlined"
                  label="1트랙"
                  value={userAccount.track1}
                  sx={{ mt: 2 }}
                />
              </Box>
              <Box sx={{ width: "400px" }}>
                <TextField
                  disabled
                  fullWidth
                  variant="outlined"
                  label="2트랙"
                  value={userAccount.track2}
                  sx={{ mt: 2 }}
                />
              </Box>
            </Box>
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                label="닉네임"
                placeholder="닉네임을 입력해주세요!"
                sx={{ mt: 2 }}
                onChange={onNicknameChange}
                />
            </Box>
            <Box>
              <Autocomplete
                multiple
                options={skillData}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    label="관심기술"
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
                value={skill}
                onChange={onSkillChange}
              />
            </Box>
            <Box>
              <TextField
                multiline
                fullWidth
                variant="outlined"
                label="자기소개"
                placeholder="본인소개를 해주세요."
                rows={3}
                onChange={onIntroduceChange}
                sx={{ mt: 2 }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button sx={{ mr: 1 }} onClick={back}>뒤로</Button>
              <Button variant="contained" onClick={confirm}>
                완료
              </Button>
            </Box>
          </Stack>
        </Box>
        </Grid>
      </Grid>
    </>
  );
};


//프로필 선택 버튼
const ImageButton = styled(ButtonBase)(({ theme }) => ({
  width: 350,
  height: 150,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 150,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    border: "2px solid #5b81bd",
  },
  "&:focus": {
    border: "2.5px solid #5b81bd",
  },
  "&:active": {
    border: "2.5px solid #5b81bd",
  },
  borderRadius: 20,
  border : 'var(--border)',
}));

// 기본 border, 클릭하는 경우 border css 지정
const defaultBorder = {
  '--border': "1px solid #e0e0e0",
} as React.CSSProperties;

const clickBorder = {
  '--border': "2.5px solid #5b81bd",
} as React.CSSProperties;


export default Welcome;
