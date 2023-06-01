import React, { useEffect, useState } from "react";
import { Box, Autocomplete, Typography, TextField, Button, Stack, ButtonBase, ListItemAvatar, Avatar, Container, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import IdTokenVerifier from "idtoken-verifier";
import axios from "axios";
import { useNavigate } from "react-router";
import { logoutHandler } from "../logoutHandler";
import Profile from "../layout/Profile";
import { useForm, Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles"
import { FindIcon } from "../data/IconData";
import { skillData } from "../data/SkillData";
import { UseFormSetError, UseFormClearErrors } from "react-hook-form";

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
  const asUrl = process.env.REACT_APP_AUTHORIZATION_SERVER_URL;

  const { formState: { errors }, setValue, control, handleSubmit, setError, clearErrors, watch,  } = useForm<UserAddItems>({ mode: "onChange" });

  const navigate = useNavigate();

  const back = () => {
    logoutHandler();
  }

  useEffect(() => {
    idTokenVerifier();
  }, []);

  const idTokenVerifier = () => {
    const verifier = new IdTokenVerifier({
      issuer: `${asUrl}`, // issuer 가 같은지
      audience: "client", // audience 가 같은지
      jwksURI: `${asUrl}/oauth2/jwks`, // get public key
    });

    const id_token = sessionStorage.getItem("id_token");

    if (id_token) {
      verifier.verify(id_token, (error, payload: any) => {
        if (error) {
          alert("토큰이 만료되었습니다.");
          logoutHandler();
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

  const [isOnlyNickName, setIsOnlyNickName] = useState<boolean | null>(null);

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
            setError("isOnlyNickName", {
              type: "manual",
              message: "사용 중인 닉네임입니다.",
            });
            setValue("isOnlyNickName", false);
          } else {
            clearErrors("isOnlyNickName");
            setValue("isOnlyNickName", true);
            setError("isOnlyNickName", { message: "중복검사를 통과했습니다"});
          }
          setIsOnlyNickName(res.data);
        }
      })
      .catch((err) => { console.log(`postOnlyNickname에서 error catch ${err}`) });
  }
  return (
    <>
      <Container maxWidth="md">
      <Grid container direction="column" display={"flex"} justifyContent={"center"} spacing={"2.5rem"} mt={"3rem"} mb={"5rem"}>
        <Grid item>
            <Stack alignItems={"center"} justifyContent={"center"} display={"flex"} mb={"1rem"}>
            <Typography variant="h2" sx={{fontWeight:600}} >부가 정보를 입력해주세요</Typography>
            </Stack>
        </Grid>
        <Grid item spacing={"1rem"} alignItems={"center"}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5} justifyContent={"center"} display={"flex"}>
              <Box>
                <Controller
                  control={control}
                  name="picture"
                  rules={{
                    required: "프로필을 선택해주세요!",
                  }}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <>
                      <Stack p={"0.5rem 0.5rem 0.5rem 1rem"}>
                        <Typography variant="h5" color="primary.dark">프로필 선택</Typography>
                      </Stack>
                      <Grid container direction="row" spacing={2} alignItems={"center"}>
                        <Grid item xs={12} md={6}>
                          <ImageButton
                            style={flag === 1 ? clickBorder : defaultBorder}
                            onClick={() => {
                              setFlag(1);
                              onChange(profileImg);
                              onProfileChange(1);
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar src={profileImg} sx={{ width: 100, height: 100 }}/>
                            </ListItemAvatar>
                          </ImageButton>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ImageButton
                            style={flag === 2 ? clickBorder : defaultBorder}
                            onClick={() => {
                              setFlag(2);
                              onChange("avatar");
                              onProfileChange(2);
                            }}
                          >
                            <Profile nickname={userInfo.nickname} imgUrl={null} size={75} />
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
              <Box sx={{width: "100%"}}>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      disabled
                      variant="outlined"
                      label="이름"
                      value={userInfo.name}
                      fullWidth
                      //InputProps={{ sx: { backgroundColor: "#e0e0e0" } }}
                    />
                  </Grid>
                  <Grid item xs>
                   <TextField
                      disabled
                      fullWidth
                      variant="outlined"
                      label="학번"
                      value={userInfo.sub}
                    />
                  </Grid>
                </Grid>
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
                <Grid container direction="row" spacing={"1rem"}>
                    <Grid item xs={6} md={10.5}>
                      <Controller
                        control={control}
                        name="nickname"
                        rules={{
                          required: "닉네임을 입력해주세요!",
                          maxLength: {
                            value: 8,
                            message: "최대 8자까지 입력이 가능합니다",
                          },
                          minLength: {
                            value:2,
                            message: "최소 2자 이상 입력해주세요!"
                          }
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            onClick={()=>{
                              clearErrors("isOnlyNickName");
                              setValue("isOnlyNickName", false)
                            }}
                            placeholder="닉네임을 입력해주세요"
                            error={error !== undefined}
                            helperText={error ? error.message : ""}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs mt={"0.6rem"}>
                      <Controller
                        control={control}
                        name="isOnlyNickName"
                        rules={{
                          required: "중복검사가 필요합니다!"
                        }}
                        render={({ field }) => (
                          <Button
                            type="button"
                            onClick={async () => {
                              postOnlyNickname(watch("nickname"));
                            }}                           
                            variant="outlined"
                            size="medium"
                          >
                            중복검사
                          </Button>
                        )}
                      />
                     
                  </Grid>
                </Grid>
                 <Grid item>
                    <Stack p={"0.5rem 0.5rem 0.5rem 0.85rem"}>
                    {errors.isOnlyNickName && 
                      <Stack direction={"row"} alignItems={"center"}>
                      <Typography variant="h6" color="error">{errors.isOnlyNickName.message}</Typography>
                      </Stack>
                    }
                  </Stack>
                  </Grid>
              </Box>
              <Box>
                <Controller
                  control={control}
                  name="skills"
                  rules={{
                    validate: (data) => {
                      if (data && data.length > 7) return false;
                    },
                  }}
                  render={({ field: { ref, onChange, ...field }, fieldState }) => (
                    <Autocomplete
                      multiple
                      options={skillData}
                      getOptionLabel={(option) => option.name}
                      onChange={(_, data) => {
                        onChange(data);
                        onChangeSkill(data.map((s) => s.name));
                      }}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                          <img src={option.logo} width={20} height={20} />
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
                          error={fieldState.error !== undefined}
                          helperText={fieldState.error ? "관심기술은 7개까지 선택할 수 있습니다." : ""}
                        />
                      )}
                       ListboxProps={{ style: { maxHeight: '10rem' } }}
                    />
                  )}
                />
              </Box>
              <Box>
                <Controller
                    control={control}
                    name="introduce"
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        multiline
                        placeholder="자기소개를 해주세요."
                        maxRows={2}                    
                        rows={2}
                        error={error !== undefined}
                        helperText={error ? "글자 수를 초과했습니다." : ""}
                        onChange={(e) => {
                          field.onChange(e);
                          onChangeIntroduce(e.target.value);
                        }}
                    />
                    )}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button sx={{ mr: "1rem" }} onClick={back}>뒤로</Button>
                <Button type="submit" variant="contained" >완료</Button>
              </Box>
            </Stack>
          </form>
        </Grid>
      </Grid>
      </Container>
    </>
  );
};

//프로필 선택 버튼
const ImageButton = styled(ButtonBase)(({ theme }) => ({
  width: "100%",
  height: 150,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 150,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    border: "2px solid #008CFF",
  },
  "&:focus": {
    border: "2.5px solid #008CFF",
  },
  "&:active": {
    border: "2.5px solid #008CFF",
  },
  borderRadius: 20,
  border: 'var(--border)',
}));

// 기본 border, 클릭하는 경우 border css 지정
const defaultBorder = {
  '--border': "1px solid #e0e0e0",
} as React.CSSProperties;

const clickBorder = {
  '--border': "2.5px solid #008CFF",
} as React.CSSProperties;


export default Welcome;
