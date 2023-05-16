import React, { useEffect, useState } from "react";
import { Box, Chip, Typography, TextField, Button, Stack, ButtonBase, ListItemAvatar, Avatar, Autocomplete, Grid } from "@mui/material";
import { skillData } from "../data/SkillData";
import { styled } from "@mui/material/styles";
import IdTokenVerifier from "idtoken-verifier";
import axios from "axios";
import { useNavigate } from "react-router";
import { logoutHandler } from "../logoutHandler";
import Profile from "../layout/Profile";
import { useForm, Controller } from "react-hook-form";
import UserSkill from "../layout/UserSkill";
import UserIntroduce from "../layout/UserIntroduce";
import { useTheme } from "@mui/material/styles"
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

interface UserInfoItems {
  sub: number;
  name: string;
  track1: string;
  track2: string;
  picture: string | null;
  nickname: string;
  introduce?: string;
  skills?: string[];
}

interface UserAddItems {
  nickname: string;
  isOnlyNickName: boolean;
  introduce?: string;
  skills?: { name: string }[];
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
  const [flag, setFlag] = useState<number>(-1);

  const { formState: { errors }, register, control, handleSubmit, setError, clearErrors, watch } = useForm<UserAddItems>({ mode: "onChange" });

  const navigate = useNavigate();

  const [isOnlyNickName, setIsOnlyNickName] = useState<boolean | null>(null);

  const _theme = useTheme();

  const back = () => {
    logoutHandler();
  }

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
        setUserInfo((prev) => ({ ...prev, ...payload, nickname: payload.name }));
        if (payload) {
          setProfileImg(payload.picture);
        }
      });
    } else {
      alert("로그인이 필요합니다.");
      window.location.href = "/";
    }
  };

  const onChangeSkill = (userSkills: string[]) => {
    setUserInfo({
      ...userInfo,
      skills: userSkills,
    })
  }

  const onChangeIntroduce = (selfIntro: string) => {
    setUserInfo({ ...userInfo, introduce: selfIntro })
  }

  const onSubmit = (userAdd: UserAddItems) => {
    const addUserData = {
      nickname: userAdd.nickname,
      introduce: userInfo.introduce,
      skills: userInfo.skills
    };

    const userAccountInfo = {
      ...userInfo,
      ...addUserData,
      studentId: userInfo.sub
    };

    axios({
      method: "post",
      url: "/api/join",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(userAccountInfo),
    })
      .then((response) => {
        if (response.status === 200) { // 부가 정보 입력 정상 완료 시
          setUserInfo({ ...userInfo, nickname: userAccountInfo.nickname });
          console.log(userAccountInfo);
          setTimeout(() =>
            navigate("/") // 메인 페이지로 이동 
            , 1000)
        } // 에러 핸들링 ...
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onProfileChange = (flag: number) => {
    setUserInfo({ ...userInfo, picture: flag === 1 ? profileImg : null });
  }

  //닉네임 중복 검사 함수
  const postOnlyNickname = (nickname: string) => {
    const request_nickname = {
      nickname: nickname
    };

    axios({
      method: "post",
      url: "/api/user/check-nickname",
      headers: { "Content-Type": "application/json" },
      data: request_nickname,
    })
      .then((res) => {
        if (res.status === 200) {
          if (res.data) {
            setError("nickname", {
              type: "manual",
              message: "이미 누군가가 사용 중인 닉네임입니다.",
            });
          } else {
            clearErrors("nickname");
          }
          setIsOnlyNickName(res.data);
        }
      })
      .catch((err) => { console.log(`postOnlyNickname에서 error catch ${err}`) });

  }

  return (
    <>
      <Grid container direction="column" justifyContent="center" alignItems="center" md={12} mt={"5rem"} mb={"4rem"}>
        <Grid item md={12}>
          <Box mb={"4rem"}>
            <Typography variant="h2" align="center">추가 정보를 입력해주세요</Typography>
          </Box>
        </Grid>
        <Grid item md={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <Box>
                <Controller
                  control={control}
                  name="picture"
                  rules={{
                    required: "프로필을 선택해주세요",
                  }}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                      <Grid container direction="row" spacing={5}>
                        <Grid item>
                          <ImageButton
                            style={flag === 1 ? clickBorder : defaultBorder}
                            onClick={() => {
                              setFlag(1);
                              onChange(profileImg);
                              onProfileChange(1);
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={profileImg} />
                            </ListItemAvatar>
                            <Typography variant="subtitle1" sx={{ p: 4 }}>
                              {userInfo.name}
                            </Typography>
                          </ImageButton>
                        </Grid>
                        <Grid item>
                          <ImageButton
                            style={flag === 2 ? clickBorder : defaultBorder}
                            onClick={() => {
                              setFlag(2);
                              onChange("avatar");
                              onProfileChange(2);
                            }}
                          >
                            <Profile nickname={userInfo.nickname} imgUrl={null} size={40} />
                            <Typography variant="subtitle1" sx={{ p: 4 }}>
                              {userInfo.nickname}
                            </Typography>
                          </ImageButton>
                        </Grid>
                      </Grid>
                      <Box pl={"0.9rem"} pt={"0.2rem"}>
                        <Typography variant="h6" color="error.main">{error?.message}</Typography>
                      </Box>
                    </>
                  )}
                />
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
              <Box sx={{ width: '100%' }}>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      disabled
                      fullWidth
                      variant="outlined"
                      label="1트랙"
                      value={userInfo.track1}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      disabled
                      fullWidth
                      variant="outlined"
                      label="2트랙"
                      value={userInfo.track2}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container direction="row" xs={12} sx={{ textAlign: "center", alignItems: "center" }}>
                  <Grid item container xs={12} md={7} rowSpacing={1} sx={{ textAlign: "center", alignItems: "center" }}>
                    <Grid item md={6}>
                      <Controller
                        control={control}
                        name="nickname"
                        rules={{
                          required: "닉네임을 입력해주세요!",
                          maxLength: {
                            value: 8,
                            message: "최대 8자까지 입력이 가능합니다",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="닉네임"
                            placeholder="닉네임을 입력해주세요"
                            error={error !== undefined}
                            helperText={error ? error.message : ""}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={5}>
                      <Controller
                        control={control}
                        name="isOnlyNickName"
                        defaultValue={(isOnlyNickName ?? true)} // 상태값을 기본값으로 설정
                        render={({ field }) => (
                          <Button
                            type="button"
                            onClick={() => postOnlyNickname(watch("nickname"))}
                            variant="outlined"
                            color="info"
                            size="small"
                          >
                            중복검사
                          </Button>
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Chip
                      label={!(isOnlyNickName ?? true) ? "중복검사를 통과했습니다" : "중복검사를 통과하지 못했습니다."}
                      color={!(isOnlyNickName ?? true) ? "success" : "error"}
                      icon={!(isOnlyNickName ?? true) ? <DoneIcon /> : <CloseIcon />}
                      size="medium"
                      variant="outlined"
                    />
                  </Grid>

                </Grid>
              </Box>
              <Box>
                <UserSkill skills={userInfo.skills} changeSkills={onChangeSkill} />
              </Box>
              <Box>
                <UserIntroduce introduce={userInfo.introduce} changeIntroduce={onChangeIntroduce} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button sx={{ mr: "1rem" }} onClick={back}>뒤로</Button>
                <Button type="submit" variant="contained" disabled={(isOnlyNickName ?? true)}>완료</Button>
              </Box>
            </Stack>
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
  border: 'var(--border)',
}));

// 기본 border, 클릭하는 경우 border css 지정
const defaultBorder = {
  '--border': "1px solid #e0e0e0",
} as React.CSSProperties;

const clickBorder = {
  '--border': "2.5px solid #5b81bd",
} as React.CSSProperties;


export default Welcome;
