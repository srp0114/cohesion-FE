import React, { Fragment, SyntheticEvent, useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Stack, ButtonBase, ListItemAvatar, Avatar, Autocomplete, Grid, Icon, InputAdornment} from "@mui/material";
import { skillData } from "../data/SkillData";
import profileImg from "../asset/image/react.png";
import { styled } from "@mui/material/styles";
import IdTokenVerifier from "idtoken-verifier";
import axios from "axios";
import { useNavigate } from "react-router";
import {logoutHandler} from "../logoutHandler";
import Profile from "../layout/Profile";
import { useForm, Controller } from "react-hook-form";

interface UserInfoItems {
  sub: number; //학번
  name: string; //이름
  track1: string; //1트랙
  track2: string; //2트랙
  picture: string; //프로필
  nickname: string; //닉네임
  introduce?: string; //자기소개
  skills?: string[];
}

interface UserAddItems {
  nickname: string; //닉네임
  introduce?: string; //자기소개
  skills?: {name:string}[];
  picture: string;
}

const Welcome = () => {
  const [profileImg, setProfileImg] = useState<string>("");

  const [userInfo, setUserInfo] = useState<UserInfoItems>({
    sub: 0,
    name: "",
    track1: "",
    track2: "",
    picture: profileImg,
    nickname: "",
    introduce: "",
    skills: [],
  });

  const {  formState: { errors }, register, control, handleSubmit, watch } =
  useForm<UserAddItems>({
    mode: "onChange"
  });

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
        setUserInfo((prev) => ({ ...prev, ...payload }));
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

  const onSubmit = (data: UserAddItems) => {
    const newUserData = {
      nickname: data.nickname,
      introduce: data.introduce ?? "",
      skills: (data.skills || []).map((s) => s.name),
    };

    setUserInfo(prev => ({
      ...prev,
      nickname: newUserData.nickname,
      introduce: newUserData.introduce,
      skills: newUserData.skills,
    }));
  };

  useEffect(() => {
    confirm();
  }, [userInfo]);

  const confirm = () => {
    console.log(userInfo);

    axios({
      method: "post",
      url: "/api/join",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(userInfo),
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
    setUserInfo({ ...userInfo, picture: flag === 1 ? profileImg : "" });
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
        <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ pl: 15, pr: 15, mb: 5 }}>
          <Stack spacing={5}>
            <Box>
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
                      {userInfo.name}
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
                value={userInfo.name}
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
                value={userInfo.sub}
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
                  value={userInfo.track1}
                  sx={{ mt: 2 }}
                />
              </Box>
              <Box sx={{ width: "400px" }}>
                <TextField
                  disabled
                  fullWidth
                  variant="outlined"
                  label="2트랙"
                  value={userInfo.track2}
                  sx={{ mt: 2 }}
                />
              </Box>
            </Box>
            <Box>
                <Controller
                  control={control}
                  name="nickname"
                  rules={{
                    required: true,
                    maxLength: 10,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="닉네임"
                      placeholder="닉네임을 입력해주세요"
                      sx={{ mt: 2 }}
                      error={error !== undefined}
                      helperText={error ? "false" : "true"}
                    />
                  )}
                />
            </Box>
            <Box>
               <Controller
                control={control}
                name="skills"
                rules={{
                  validate: (data) => {
                    if(data && data.length > 3) return false;
                  }
                }}
                render={({ field: { ref, onChange, ...field }, fieldState }) => (
                  <Autocomplete
                    multiple
                    options={skillData}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, data) => onChange(data)}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...props}
                      >
                        <img src={option.logo} width={20} height={20}/>
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...field}
                        {...params}
                        fullWidth
                        placeholder="관심기술을 선택해주세요!"
                        inputRef={ref}
                        variant="outlined"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message} 
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                  control={control}
                  name="introduce"
                  defaultValue={userInfo.introduce}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      multiline
                      fullWidth
                      variant="outlined"
                      label="자기소개"
                      placeholder="본인소개를 해주세요."
                      {...field}
                      rows={2}
                      sx={{ mt: 2 }}
                      error={error !== undefined}
                      helperText={error ? "false" : "true"}
                    />
                  )}
                />
              
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button sx={{ mr: 1 }} onClick={back}>뒤로</Button>
              <Button type="submit" variant="contained">
                완료
              </Button>
            </Box>
          </Stack>
        </Box>
        </form>
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
